/**
 * WARDROBE AI - Asynchronous Job Queue & Worker Engine
 * Provides idempotent background processing, exponential backoff retries, and dead-letter handling.
 */

import { logger } from '../monitoring/logger';

export interface Job<T = any> {
  id: string; // Idempotency key (e.g. `wardrobe_item_process:${itemId}`)
  name: string;
  data: T;
  attempts: number;
  maxAttempts: number;
  status: 'pending' | 'active' | 'completed' | 'failed';
  createdAt: number;
  error?: string;
}

type JobHandler<T = any> = (job: Job<T>) => Promise<void>;

class AsyncJobQueue {
  private jobs = new Map<string, Job>();
  private handlers = new Map<string, JobHandler>();
  private isProcessing = false;

  /**
   * Register a job handler for a specific queue name.
   */
  public registerHandler<T>(jobName: string, handler: JobHandler<T>) {
    this.handlers.set(jobName, handler as JobHandler);
  }

  /**
   * Enqueue a job. Enforces idempotency:
   * If a job with this idempotency key already exists, does NOT recreate or duplicate.
   */
  public async add<T>(name: string, data: T, options?: { jobId?: string; maxAttempts?: number }): Promise<Job<T>> {
    const jobId = options?.jobId || `${name}_${Date.now()}_${Math.random().toString(36).substring(7)}`;

    // Idempotency check: check if already exists
    const existing = this.jobs.get(jobId);
    if (existing) {
      logger.info(`[Queue] Idempotent duplicate job detected, returning existing job: ${jobId}`);
      return existing as Job<T>;
    }

    const job: Job<T> = {
      id: jobId,
      name,
      data,
      attempts: 0,
      maxAttempts: options?.maxAttempts || 3,
      status: 'pending',
      createdAt: Date.now(),
    };

    this.jobs.set(jobId, job);
    logger.info(`[Queue] Job enqueued: ${job.name} (${job.id})`);

    // Trigger queue processing asynchronously
    this.triggerProcessing();

    return job;
  }

  public getJob(jobId: string): Job | undefined {
    return this.jobs.get(jobId);
  }

  private async triggerProcessing() {
    if (this.isProcessing) return;
    this.isProcessing = true;

    try {
      for (const [id, job] of this.jobs.entries()) {
        if (job.status === 'pending') {
          await this.processJob(job);
        }
      }
    } finally {
      this.isProcessing = false;
    }
  }

  private async processJob(job: Job) {
    const handler = this.handlers.get(job.name);
    if (!handler) {
      logger.warn(`[Queue] No handler registered for job: ${job.name}`);
      return;
    }

    job.status = 'active';
    job.attempts += 1;

    try {
      logger.info(`[Queue] Processing job: ${job.name} (${job.id}), Attempt ${job.attempts}/${job.maxAttempts}`);
      await handler(job);
      job.status = 'completed';
      logger.info(`[Queue] Job completed successfully: ${job.id}`);
    } catch (err: any) {
      job.error = err.message || 'Unknown processing error';
      logger.error(`[Queue] Job failed on attempt ${job.attempts}: ${job.id}`, err);

      if (job.attempts < job.maxAttempts) {
        job.status = 'pending';
        // Exponential backoff delay
        const backoffMs = Math.pow(2, job.attempts) * 1000;
        logger.info(`[Queue] Retrying job ${job.id} after backoff of ${backoffMs}ms`);
        await new Promise((r) => setTimeout(r, backoffMs));
      } else {
        job.status = 'failed';
        logger.error(`[Queue] Job permanently failed after max retries (Dead Letter): ${job.id}`);
      }
    }
  }
}

export const jobQueue = new AsyncJobQueue();
