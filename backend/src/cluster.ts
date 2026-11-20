import cluster from 'node:cluster';
import os from 'node:os';
import { config } from './config/env';

/**
 * Production-Grade Node.js Cluster Manager for SimplePDF
 * Features:
 * - Memory-aware worker calculation
 * - Configurable MAX_WORKERS
 * - Crash loop detection and backoff
 * - Clean SIGTERM/SIGINT graceful shutdown propagation
 */

const isClusterEnabled = config.cluster.enabled || process.env.CLUSTER_MODE === 'true';

if (!isClusterEnabled) {
  console.log('[SimplePDF Cluster] CLUSTER_MODE is disabled. Running as standalone single-instance process.');
  import('./server');
} else if (cluster.isPrimary) {
  const cpus = os.availableParallelism ? os.availableParallelism() : os.cpus().length;
  const freeMemBytes = os.freemem();
  // Assume ~256MB required per worker process
  const memBasedWorkers = Math.max(1, Math.floor(freeMemBytes / (256 * 1024 * 1024)));

  let targetWorkers = cpus;
  if (config.cluster.maxWorkers > 0) {
    targetWorkers = Math.min(cpus, config.cluster.maxWorkers);
  } else {
    // Pick the safer of CPU count or Memory capacity, min 1, max 8 for safety
    targetWorkers = Math.max(1, Math.min(cpus, memBasedWorkers, 8));
  }

  console.log('======================================================');
  console.log('🔥 [SIMPLEPDF ENTERPRISE CLUSTER MANAGER]');
  console.log(`Primary PID:          ${process.pid}`);
  console.log(`Total System Cores:   ${cpus}`);
  console.log(`Free System Memory:   ${Math.round(freeMemBytes / 1024 / 1024)} MB`);
  console.log(`Allocated Workers:    ${targetWorkers}`);
  console.log('======================================================\n');

  let isShuttingDown = false;
  const restartTimes: number[] = [];
  const MAX_RESTARTS_PER_WINDOW = 5;
  const WINDOW_MS = 30000; // 30 seconds

  // Fork initial worker pool
  for (let i = 0; i < targetWorkers; i++) {
    cluster.fork();
  }

  cluster.on('online', (worker) => {
    console.log(`✅ [Cluster Worker ${worker.process.pid}] Online and ready.`);
  });

  cluster.on('exit', (worker, code, signal) => {
    if (isShuttingDown) {
      console.log(`[Cluster Worker ${worker.process.pid}] Exited cleanly during shutdown.`);
      return;
    }

    console.warn(`⚠️ [Cluster Worker ${worker.process.pid}] Died (exit code: ${code}, signal: ${signal}).`);

    // Crash monitoring & backoff
    const now = Date.now();
    restartTimes.push(now);
    // Remove restarts older than WINDOW_MS
    while (restartTimes.length > 0 && restartTimes[0] < now - WINDOW_MS) {
      restartTimes.shift();
    }

    if (restartTimes.length > MAX_RESTARTS_PER_WINDOW) {
      console.error(`🚨 [Cluster Alert] High worker crash frequency (${restartTimes.length} in 30s). Pausing respawn to protect system.`);
      setTimeout(() => {
        if (!isShuttingDown) {
          console.log('[Cluster] Resuming worker respawn after backoff...');
          cluster.fork();
        }
      }, 10000);
      return;
    }

    // Standard restart with 1-second backoff
    setTimeout(() => {
      if (!isShuttingDown) {
        console.log('🔄 [Cluster Manager] Respawning replacement worker...');
        cluster.fork();
      }
    }, 1000);
  });

  // Graceful shutdown handler for cluster primary
  const shutdown = (signal: string) => {
    if (isShuttingDown) return;
    isShuttingDown = true;
    console.log(`\n[Cluster Manager] Received ${signal}. Gracefully stopping ${Object.keys(cluster.workers || {}).length} workers...`);

    const workers = Object.values(cluster.workers || {}).filter(Boolean);
    workers.forEach((worker) => {
      try {
        worker?.process.kill(signal as any);
      } catch (_) {}
    });

    const timeout = setTimeout(() => {
      console.warn('[Cluster Manager] Shutdown timeout expired. Force killing remaining workers.');
      workers.forEach((w) => {
        try {
          w?.process.kill('SIGKILL');
        } catch (_) {}
      });
      process.exit(1);
    }, 15000);
    timeout.unref();

    let deadWorkers = 0;
    if (workers.length === 0) {
      clearTimeout(timeout);
      process.exit(0);
    }

    workers.forEach((w) => {
      w?.on('disconnect', () => {
        deadWorkers++;
        if (deadWorkers >= workers.length) {
          clearTimeout(timeout);
          console.log('[Cluster Manager] All workers shut down cleanly.');
          process.exit(0);
        }
      });
    });
  };

  process.on('SIGTERM', () => shutdown('SIGTERM'));
  process.on('SIGINT', () => shutdown('SIGINT'));
} else {
  // Worker process loads server instance
  import('./server');
}
