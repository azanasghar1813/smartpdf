import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import crypto from 'crypto';
import path from 'path';
import fs from 'fs';
import authRoutes from './routes/auth.routes';
import toolsRoutes from './routes/tools.routes';
import aiRoutes from './routes/ai.routes';
import paymentRoutes from './routes/payment.routes';
import { dbRepository } from './database/repository';
import { redisConnection } from './queues/connection';
import { storage } from './storage/storageProvider';
import { pdfWorker } from './workers/pdf.worker';
import { cleanupWorker } from './workers/cleanup.worker';
import { securityHeaders } from './middleware/securityHeaders';
import { createRateLimiter } from './middleware/rateLimiter';
import { config } from './config/env';

const app = express();
const PORT = config.port;

// Trust Proxy Configuration for Load Balancers (Nginx, AWS ALB, Cloudflare)
if (config.security.trustProxy) {
  app.set('trust proxy', 1);
}

// Request ID Tracing Middleware
app.use((req: Request, res: Response, next: NextFunction) => {
  const reqId = (req.headers['x-request-id'] as string) || crypto.randomUUID();
  (req as any).id = reqId;
  res.setHeader('X-Request-ID', reqId);
  next();
});

// Structured Request Logger Middleware
app.use((req: Request, res: Response, next: NextFunction) => {
  const start = Date.now();
  res.on('finish', () => {
    const duration = Date.now() - start;
    const clientIp = (req.headers['x-forwarded-for'] as string)?.split(',')[0].trim() || req.socket.remoteAddress;
    const logEntry = {
      level: res.statusCode >= 500 ? 'error' : res.statusCode >= 400 ? 'warn' : 'info',
      requestId: (req as any).id,
      method: req.method,
      path: req.originalUrl,
      status: res.statusCode,
      durationMs: duration,
      clientIp,
      timestamp: new Date().toISOString(),
    };
    if (config.logging.level === 'debug' || res.statusCode >= 400) {
      console.log(JSON.stringify(logEntry));
    }
  });
  next();
});

// Global Security Headers (Helmet compliant)
app.use(securityHeaders);

// Production CORS with strict origin validation
app.use(
  cors({
    origin: (origin, callback) => {
      // Allow server-to-server, curl, mobile requests without Origin header
      if (!origin) return callback(null, true);
      const allowedOrigins = config.security.corsAllowedOrigins;
      if (
        config.env === 'development' ||
        allowedOrigins.includes('*') ||
        allowedOrigins.includes(origin) ||
        origin.endsWith('.localhost') ||
        origin === 'http://localhost:3000' ||
        origin === 'http://127.0.0.1:3000'
      ) {
        return callback(null, true);
      }
      return callback(new Error(`CORS blocked request from untrusted origin: ${origin}`));
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Request-ID', 'Idempotency-Key', 'x-internal-test'],
  })
);

// Body Parsing
app.use(
  express.json({
    limit: '10mb',
    verify: (req: any, _res, buf) => {
      req.rawBody = buf;
    },
  })
);
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Global Rate Limiter
const globalLimiter = createRateLimiter({
  windowMs: config.limits.rateLimitWindowMs,
  max: config.limits.rateLimitMaxRequests,
  message: 'API rate limit exceeded. Please throttle your requests.',
});
app.use('/api', globalLimiter);

// Heavy Jobs Rate Limiter
const jobLimiter = createRateLimiter({
  windowMs: config.limits.rateLimitWindowMs,
  max: config.limits.jobRateLimitMax,
  message: 'Job conversion rate limit reached. Please wait before submitting additional files.',
});
app.use('/api/v1/jobs', jobLimiter);

// API Routes
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/ai', aiRoutes);
app.use('/api/v1/payment', paymentRoutes);
app.use('/api/v1', toolsRoutes);

// Liveness Probe (Kubernetes / Nginx / Load Balancers)
app.get('/api/health', (_req: Request, res: Response) => {
  res.json({
    status: 'healthy',
    service: 'SimplePDF Production Gateway',
    timestamp: new Date().toISOString(),
    uptimeSeconds: Math.round(process.uptime()),
    nodeVersion: process.version,
    memoryUsageMB: Math.round(process.memoryUsage().rss / 1024 / 1024),
  });
});

// Deep Readiness Probe (Verifies DB, Redis, and Storage subsystem health)
app.get('/api/ready', async (_req: Request, res: Response) => {
  const dbOk = await dbRepository.checkHealth();
  const redisOk = await redisConnection.checkHealth().catch(() => false);

  let storageOk = true;
  try {
    const probeKey = `health/.probe_${Date.now()}`;
    await storage.upload(probeKey, Buffer.from('ready-probe'));
    await storage.delete(probeKey);
  } catch {
    storageOk = false;
  }

  const isReady = dbOk && storageOk;

  const result = {
    status: isReady ? 'ready' : 'unready',
    timestamp: new Date().toISOString(),
    checks: {
      database: dbOk ? 'healthy' : 'disconnected',
      storage: storageOk ? 'writable' : 'unwritable',
      redisQueue: redisOk ? 'connected' : 'standalone-fallback',
    },
  };

  if (!isReady) {
    return res.status(503).json(result);
  }

  return res.json(result);
});

// Centralized Error Handler
app.use((err: any, req: Request, res: Response, _next: NextFunction) => {
  const requestId = (req as any).id;
  console.error(`[API Exception] Request ${requestId}:`, err);

  res.status(err.status || 500).json({
    error: 'Internal Server Error',
    message: config.env === 'production' ? 'An unexpected processing error occurred.' : err.message,
    requestId,
  });
});

let serverInstance: any = null;

if (require.main === module) {
  // Start embedded workers if not running as separate worker process
  if (process.env.RUN_STANDALONE_WORKER !== 'false') {
    pdfWorker.start();
    cleanupWorker.start();
  }

  serverInstance = app.listen(PORT, () => {
    console.log(`🚀 SimplePDF Production Backend online at http://localhost:${PORT}`);
    console.log(`   - Environment: ${config.env}`);
    console.log(`   - Storage Driver: ${config.storage.driver}`);
    console.log(`   - Trust Proxy: ${config.security.trustProxy}`);
  });

  // Graceful Shutdown
  const shutdown = async (signal: string) => {
    console.log(`\n[Graceful Shutdown] Received ${signal}. Draining HTTP connections and workers...`);
    cleanupWorker.stop();
    await pdfWorker.stop();

    if (serverInstance) {
      serverInstance.close(() => {
        console.log('[Graceful Shutdown] HTTP server closed cleanly. Process exiting.');
        process.exit(0);
      });

      setTimeout(() => {
        console.warn('[Graceful Shutdown] Forced exit after timeout.');
        process.exit(1);
      }, 10000).unref();
    } else {
      process.exit(0);
    }
  };

  process.on('SIGTERM', () => shutdown('SIGTERM'));
  process.on('SIGINT', () => shutdown('SIGINT'));
}

export default app;
