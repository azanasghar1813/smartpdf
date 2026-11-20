import { pdfJobQueue, PdfJobPayload } from '../queues/pdf.queue';
import { storage, storageService } from '../storage/storageProvider';
import { conversionService } from '../services/conversionService';
import { dbRepository } from '../database/repository';
import { db } from '../services/dbService';
import { resourceMonitor } from '../services/resourceMonitor';
import { config } from '../config/env';

export class PdfWorker {
  private activeJobsCount = 0;
  private isStopping = false;
  private pollTimer: NodeJS.Timeout | null = null;

  public start() {
    console.log(`[PdfWorker] Initialized with concurrency target ${config.queue.concurrency}`);
    
    // Listen for new jobs added event
    pdfJobQueue.on('job:added', () => {
      this.tick();
    });

    // Poll periodically in case of unhandled queue backlog
    this.pollTimer = setInterval(() => {
      this.tick();
    }, 1000);
    this.pollTimer.unref();

    // Initial tick
    this.tick();
  }

  public async stop(): Promise<void> {
    console.log('[PdfWorker] Graceful shutdown requested. Draining active jobs...');
    this.isStopping = true;
    if (this.pollTimer) {
      clearInterval(this.pollTimer);
    }

    // Wait until in-flight jobs complete (max 30 seconds)
    const start = Date.now();
    while (this.activeJobsCount > 0 && Date.now() - start < 30000) {
      await new Promise((r) => setTimeout(r, 200));
    }
    console.log('[PdfWorker] Shutdown complete.');
  }

  private async tick() {
    if (this.isStopping) return;

    const { recommendedConcurrency } = resourceMonitor.getSystemMetrics();

    while (this.activeJobsCount < recommendedConcurrency) {
      const job = await pdfJobQueue.getNextJob();
      if (!job) break;

      this.activeJobsCount++;
      this.processJobWrapper(job).finally(() => {
        this.activeJobsCount--;
        // Check if more jobs can be processed
        setImmediate(() => this.tick());
      });
    }
  }

  private async processJobWrapper(job: PdfJobPayload) {
    const { jobId, toolId, originalFileName, inputStorageKey, options } = job;
    job.attempts = (job.attempts || 0) + 1;

    console.log(`[PdfWorker] Processing Job ${jobId} (Attempt ${job.attempts}/${job.maxAttempts}) - Tool: ${toolId}`);

    try {
      // 1. Update DB to 'processing'
      await dbRepository.updateJob(jobId, {
        status: 'processing',
        progress: 25,
        attempts: job.attempts,
      });
      db.updateJob(jobId, { status: 'processing', progress: 25 });

      // 2. Fetch input file from storage
      const inputBuffer = await storage.download(inputStorageKey);

      await dbRepository.updateJob(jobId, { progress: 50 });
      db.updateJob(jobId, { progress: 50 });

      // 3. Execute conversion with timeout wrapper
      const timeoutMs = config.queue.jobTimeoutMs;
      const conversionPromise = conversionService.processJob(toolId, inputBuffer, originalFileName, options);

      const timeoutPromise = new Promise<never>((_, reject) => {
        const id = setTimeout(() => {
          clearTimeout(id);
          reject(new Error(`JOB_TIMEOUT: Conversion exceeded ${timeoutMs}ms limit.`));
        }, timeoutMs);
      });

      const result = await Promise.race([conversionPromise, timeoutPromise]);

      await dbRepository.updateJob(jobId, { progress: 85 });
      db.updateJob(jobId, { progress: 85 });

      // 4. Save output file to storage
      const resultKey = storageService.generateKey('output', jobId, result.resultFileName);
      await storage.upload(resultKey, result.resultBuffer, result.mimeType);

      // 5. Complete job
      const downloadUrl = `/api/v1/download/${jobId}`;
      await dbRepository.updateJob(jobId, {
        status: 'completed',
        progress: 100,
        resultKey,
        resultFileName: result.resultFileName,
        downloadUrl,
      });
      db.updateJob(jobId, {
        status: 'completed',
        progress: 100,
        resultKey,
        resultFileName: result.resultFileName,
        resultFilePath: resultKey,
        downloadUrl,
      });

      // Update metrics
      const metrics = db.getMetrics();
      db.updateMetrics({ totalProcessedJobs: (metrics.totalProcessedJobs || 0) + 1 });

      pdfJobQueue.markCompleted(jobId);
      console.log(`[PdfWorker] Successfully completed job ${jobId} -> ${result.resultFileName}`);
    } catch (err: any) {
      console.error(`[PdfWorker] Error in job ${jobId} (Attempt ${job.attempts}):`, err?.message || err);

      if (job.attempts < (job.maxAttempts || 3)) {
        // Exponential backoff retry
        const backoffMs = Math.pow(2, job.attempts) * 1000;
        console.log(`[PdfWorker] Retrying job ${jobId} in ${backoffMs}ms...`);
        setTimeout(() => {
          pdfJobQueue.add(job).catch((e) => console.error('[PdfWorker] Re-queue error:', e));
        }, backoffMs);
      } else {
        // Permanently failed
        const errorMessage = err?.message || 'Processing failed in conversion pipeline.';
        await dbRepository.updateJob(jobId, {
          status: 'failed',
          progress: 100,
          error: errorMessage,
        });
        db.updateJob(jobId, {
          status: 'failed',
          progress: 100,
          error: errorMessage,
        });
        pdfJobQueue.markFailed(jobId, err);
      }
    }
  }
}

export const pdfWorker = new PdfWorker();
