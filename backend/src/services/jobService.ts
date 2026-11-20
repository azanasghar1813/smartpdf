import { v4 as uuidv4 } from 'uuid';
import path from 'path';
import { db, DbJob } from './dbService';
import { dbRepository } from '../database/repository';
import { storage, storageService } from '../storage/storageProvider';
import { pdfJobQueue, PdfJobPayload } from '../queues/pdf.queue';
import { resourceMonitor } from './resourceMonitor';
import { config } from '../config/env';

export class JobService {
  /**
   * Enqueues a new PDF job into the distributed pipeline
   */
  public async submitJob(
    fileBuffer: Buffer,
    originalFileName: string,
    toolId: string,
    options: any = {},
    userEmail = 'demo@simplepdf.com',
    tier: 'free' | 'premium' | 'business' = 'free',
    idempotencyKey?: string
  ): Promise<{ success: boolean; jobId: string; status: string; message: string }> {
    // 1. Backpressure & Resource safety check
    if (!resourceMonitor.canAcceptNewJob()) {
      throw new Error('SYSTEM_OVERLOADED_BACKOFF');
    }

    const jobId = uuidv4();
    const cleanFileName = path.basename(originalFileName || 'document.pdf');
    const fileSize = fileBuffer.length;

    // 2. Upload file to Storage Abstraction (Local / S3 / R2)
    const inputStorageKey = storageService.generateKey('input', jobId, cleanFileName);
    await storage.upload(inputStorageKey, fileBuffer);

    // 3. Persist Job Record in Database
    const dbJob: DbJob = {
      id: jobId,
      toolId,
      status: 'queued',
      progress: 5,
      fileName: cleanFileName,
      fileSize,
      storageKey: inputStorageKey,
      attempts: 0,
      createdAt: Date.now(),
      userId: userEmail,
    };

    await dbRepository.createJob(dbJob);
    db.createJob(dbJob);
    db.incrementUserUsage(userEmail);

    // 4. Enqueue into Distributed Redis/BullMQ Queue
    const payload: PdfJobPayload = {
      jobId,
      toolId,
      originalFileName: cleanFileName,
      fileSize,
      inputStorageKey,
      options,
      userEmail,
      tier,
      idempotencyKey,
      attempts: 0,
      maxAttempts: 3,
    };

    await pdfJobQueue.add(payload);

    return {
      success: true,
      jobId,
      status: 'queued',
      message: 'Job enqueued for background conversion.',
    };
  }

  public async getJob(jobId: string): Promise<DbJob | null> {
    const job = await dbRepository.getJob(jobId);
    if (job) return job;
    return db.getJob(jobId);
  }

  public async getDownloadStreamOrUrl(jobId: string): Promise<{
    type: 'stream' | 'redirect';
    stream?: NodeJS.ReadableStream;
    redirectUrl?: string;
    fileName: string;
    contentType: string;
  }> {
    const job = await this.getJob(jobId);
    if (!job || job.status !== 'completed' || (!job.resultKey && !job.resultFilePath)) {
      throw new Error('FILE_NOT_FOUND_OR_PROCESSING');
    }

    const fileName = job.resultFileName || 'document.pdf';
    const ext = path.extname(fileName).toLowerCase();

    let contentType = 'application/octet-stream';
    if (ext === '.pdf') contentType = 'application/pdf';
    else if (ext === '.docx') contentType = 'application/vnd.openxmlformats-officedocument.wordprocessingml.document';
    else if (ext === '.xlsx') contentType = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';
    else if (ext === '.pptx') contentType = 'application/vnd.openxmlformats-officedocument.presentationml.presentation';
    else if (ext === '.zip') contentType = 'application/zip';
    else if (ext === '.jpg' || ext === '.jpeg') contentType = 'image/jpeg';

    // If using S3/R2, generate signed pre-authenticated redirect URL
    if (config.storage.driver === 's3' || config.storage.driver === 'r2') {
      if (job.resultKey) {
        const signedUrl = await storage.getSignedDownloadUrl(job.resultKey, fileName, config.storage.s3.signedUrlTtlSeconds);
        return {
          type: 'redirect',
          redirectUrl: signedUrl,
          fileName,
          contentType,
        };
      }
    }

    // Default to streaming through storage abstraction
    const key = job.resultKey || job.resultFilePath!;
    const stream = storage.createReadStream(key);
    return {
      type: 'stream',
      stream,
      fileName,
      contentType,
    };
  }
}

export const jobService = new JobService();
