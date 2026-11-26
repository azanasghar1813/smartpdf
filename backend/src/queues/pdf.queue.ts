import EventEmitter from 'events';
import { config } from '../config/env';
import { dbRepository, DbJob } from '../database/repository';

export interface PdfJobPayload {
  jobId: string;
  toolId: string;
  originalFileName: string;
  fileSize: number;
  inputStorageKey: string;
  options: any;
  userEmail: string;
  tier: 'free' | 'premium' | 'business';
  idempotencyKey?: string;
  attempts?: number;
  maxAttempts?: number;
}

/**
 * In-Memory Priority Job Queue Service (with BullMQ-compatible interface)
 * Supports priority scheduling, backpressure, idempotency, and progress tracking.
 * Note: Jobs are stored in process memory; persistent Redis/BullMQ queue backing
 * should be enabled for multi-node production persistence across restarts.
 */
export class PdfJobQueue extends EventEmitter {
  private queue: PdfJobPayload[] = [];
  private activeJobs: Map<string, PdfJobPayload> = new Map();
  private idempotencyStore: Map<string, string> = new Map(); // idempotencyKey -> jobId
  private maxWaiting: number;
  private isPaused = false;

  constructor() {
    super();
    this.maxWaiting = config.queue.maxWaitingJobs;
  }

  public async add(payload: PdfJobPayload): Promise<{ success: boolean; jobId: string; queued: boolean }> {
    // 1. Idempotency Check
    if (payload.idempotencyKey && this.idempotencyStore.has(payload.idempotencyKey)) {
      const existingJobId = this.idempotencyStore.get(payload.idempotencyKey)!;
      console.log(`[Queue] Idempotent request duplicate detected for key: ${payload.idempotencyKey} -> Returning ${existingJobId}`);
      return { success: true, jobId: existingJobId, queued: false };
    }

    // 2. Queue Backpressure Check
    if (this.queue.length >= this.maxWaiting) {
      console.warn(`[Queue Backpressure] Waiting queue depth (${this.queue.length}) exceeded maximum threshold (${this.maxWaiting}).`);
      throw new Error('QUEUE_CAPACITY_EXCEEDED');
    }

    if (payload.idempotencyKey) {
      this.idempotencyStore.set(payload.idempotencyKey, payload.jobId);
    }

    payload.attempts = payload.attempts || 0;
    payload.maxAttempts = payload.maxAttempts || 3;

    // 3. Priority Insertion: Business & Premium jobs go ahead of Free jobs
    if (payload.tier === 'business' || payload.tier === 'premium') {
      const firstFreeIdx = this.queue.findIndex((j) => j.tier === 'free');
      if (firstFreeIdx !== -1) {
        this.queue.splice(firstFreeIdx, 0, payload);
      } else {
        this.queue.push(payload);
      }
    } else {
      this.queue.push(payload);
    }

    this.emit('job:added', payload);
    return { success: true, jobId: payload.jobId, queued: true };
  }

  public async getNextJob(): Promise<PdfJobPayload | null> {
    if (this.isPaused || this.queue.length === 0) {
      return null;
    }
    const job = this.queue.shift()!;
    this.activeJobs.set(job.jobId, job);
    return job;
  }

  public markCompleted(jobId: string) {
    this.activeJobs.delete(jobId);
    this.emit('job:completed', jobId);
  }

  public markFailed(jobId: string, error: any) {
    this.activeJobs.delete(jobId);
    this.emit('job:failed', { jobId, error });
  }

  public getWaitingCount(): number {
    return this.queue.length;
  }

  public getActiveCount(): number {
    return this.activeJobs.size;
  }

  public pause() {
    this.isPaused = true;
  }

  public resume() {
    this.isPaused = false;
  }
}

export const pdfJobQueue = new PdfJobQueue();
