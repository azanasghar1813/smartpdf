import { cleanupQueue } from '../queues/cleanup.queue';
import { config } from '../config/env';

export class CleanupWorker {
  private timer: NodeJS.Timeout | null = null;
  private intervalMs: number;

  constructor() {
    // Run cleanup every 15 minutes by default
    this.intervalMs = 15 * 60 * 1000;
  }

  public start() {
    console.log(`[CleanupWorker] Started background storage TTL pruner (every ${this.intervalMs / 60000} minutes, TTL: ${config.storage.ttlMinutes}m)`);
    
    // Trigger initial cleanup on boot
    cleanupQueue.triggerCleanup().then(({ purgedCount }) => {
      if (purgedCount > 0) {
        console.log(`[CleanupWorker] Initial boot cleanup purged ${purgedCount} expired objects.`);
      }
    });

    this.timer = setInterval(async () => {
      try {
        const { purgedCount } = await cleanupQueue.triggerCleanup();
        if (purgedCount > 0) {
          console.log(`[CleanupWorker] Successfully shredded ${purgedCount} expired files.`);
        }
      } catch (err) {
        console.error('[CleanupWorker] Cleanup cycle error:', err);
      }
    }, this.intervalMs);
    this.timer.unref();
  }

  public stop() {
    if (this.timer) {
      clearInterval(this.timer);
      this.timer = null;
    }
    console.log('[CleanupWorker] Stopped.');
  }
}

export const cleanupWorker = new CleanupWorker();
