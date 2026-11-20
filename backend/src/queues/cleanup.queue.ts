import EventEmitter from 'events';
import { storage } from '../storage/storageProvider';
import { db } from '../services/dbService';
import { config } from '../config/env';

export class CleanupQueue extends EventEmitter {
  private isRunning = false;

  public async triggerCleanup(): Promise<{ purgedCount: number }> {
    if (this.isRunning) {
      return { purgedCount: 0 };
    }
    this.isRunning = true;
    try {
      const ttlMinutes = config.storage.ttlMinutes || 60;
      const purged = await storage.deleteExpired(ttlMinutes);
      
      // Update metrics
      const current = db.getMetrics();
      const updatedTotal = (current.ephemeralFilesPurgedCount || 0) + purged;
      db.updateMetrics({ ephemeralFilesPurgedCount: updatedTotal });

      this.emit('cleanup:completed', { purgedCount: purged });
      return { purgedCount: purged };
    } catch (err) {
      this.emit('cleanup:error', err);
      return { purgedCount: 0 };
    } finally {
      this.isRunning = false;
    }
  }
}

export const cleanupQueue = new CleanupQueue();
