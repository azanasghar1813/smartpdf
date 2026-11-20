import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(__dirname, '../../../.env') });
dotenv.config(); // fallback to current working directory .env

export interface AppConfig {
  env: 'development' | 'production' | 'test';
  port: number;
  cluster: {
    enabled: boolean;
    maxWorkers: number;
  };
  security: {
    trustProxy: boolean;
    corsAllowedOrigins: string[];
    jwtSecret: string;
    jwtExpirySeconds: number;
    paymentWebhookSecret: string;
  };
  database: {
    url: string;
    poolMin: number;
    poolMax: number;
  };
  redis: {
    url?: string;
    host: string;
    port: number;
    password?: string;
  };
  storage: {
    driver: 'local' | 's3' | 'r2';
    localDir: string;
    s3: {
      bucket: string;
      region: string;
      endpoint?: string;
      accessKeyId: string;
      secretAccessKey: string;
      signedUrlTtlSeconds: number;
    };
    ttlMinutes: number;
  };
  queue: {
    concurrency: number;
    maxWaitingJobs: number;
    jobTimeoutMs: number;
  };
  limits: {
    freeMaxFileMb: number;
    proMaxFileMb: number;
    rateLimitWindowMs: number;
    rateLimitMaxRequests: number;
    jobRateLimitMax: number;
  };
  logging: {
    level: 'debug' | 'info' | 'warn' | 'error';
  };
}

function parseOrigins(raw?: string): string[] {
  if (!raw) return ['http://localhost:3000', 'http://127.0.0.1:3000'];
  return raw
    .split(',')
    .map((o) => o.trim())
    .filter(Boolean);
}

const isProduction = process.env.NODE_ENV === 'production';

// Strict validation in production mode
if (isProduction) {
  const missing: string[] = [];
  if (!process.env.JWT_SECRET || process.env.JWT_SECRET === 'super_secret_jwt_key_replace_in_production') {
    missing.push('JWT_SECRET (must be a strong, non-default secret)');
  }
  if (!process.env.DATABASE_URL) {
    missing.push('DATABASE_URL');
  }
  if (missing.length > 0) {
    console.error(`\n❌ [FATAL CONFIG ERROR] Missing critical production environment variables:`);
    missing.forEach((v) => console.error(`   - ${v}`));
    console.error(`Please update your production environment configuration.\n`);
    if (process.env.STRICT_STARTUP !== 'false') {
      process.exit(1);
    }
  }
}

export const config: AppConfig = {
  env: (process.env.NODE_ENV as any) || 'development',
  port: parseInt(process.env.PORT || '5000', 10),
  cluster: {
    enabled: process.env.CLUSTER_MODE === 'true',
    maxWorkers: parseInt(process.env.MAX_WORKERS || '0', 10), // 0 = auto-calculate based on RAM & CPUs
  },
  security: {
    trustProxy: process.env.TRUST_PROXY === 'true' || isProduction,
    corsAllowedOrigins: parseOrigins(process.env.CORS_ALLOWED_ORIGINS || process.env.CORS_ORIGIN),
    jwtSecret: process.env.JWT_SECRET || 'dev_simplepdf_jwt_secret_token_key_safe_for_local_only',
    jwtExpirySeconds: parseInt(process.env.JWT_ACCESS_EXPIRY || '86400', 10), // 24 hours
    paymentWebhookSecret: process.env.PAYMENT_WEBHOOK_SECRET || 'whsec_demo_signature_key',
  },
  database: {
    url: process.env.DATABASE_URL || 'postgresql://postgres:postgrespassword@localhost:5432/simplepdf',
    poolMin: parseInt(process.env.DB_POOL_MIN || '2', 10),
    poolMax: parseInt(process.env.DB_POOL_MAX || '10', 10),
  },
  redis: {
    url: process.env.REDIS_URL,
    host: process.env.REDIS_HOST || 'localhost',
    port: parseInt(process.env.REDIS_PORT || '6379', 10),
    password: process.env.REDIS_PASSWORD || undefined,
  },
  storage: {
    driver: (process.env.STORAGE_DRIVER as any) || 'local',
    localDir: path.resolve(__dirname, '../../../temp_storage'),
    s3: {
      bucket: process.env.STORAGE_S3_BUCKET || 'simplepdf-documents',
      region: process.env.STORAGE_S3_REGION || 'auto',
      endpoint: process.env.STORAGE_S3_ENDPOINT || undefined, // e.g. https://<accountid>.r2.cloudflarestorage.com
      accessKeyId: process.env.STORAGE_S3_ACCESS_KEY || '',
      secretAccessKey: process.env.STORAGE_S3_SECRET_KEY || '',
      signedUrlTtlSeconds: parseInt(process.env.STORAGE_SIGNED_URL_TTL_SECONDS || '3600', 10),
    },
    ttlMinutes: parseInt(process.env.TEMP_FILE_TTL_MINUTES || '60', 10),
  },
  queue: {
    concurrency: parseInt(process.env.WORKER_CONCURRENCY || '4', 10),
    maxWaitingJobs: parseInt(process.env.QUEUE_MAX_WAITING_JOBS || '100', 10),
    jobTimeoutMs: parseInt(process.env.JOB_TIMEOUT_MS || '180000', 10), // 3 minutes max
  },
  limits: {
    freeMaxFileMb: parseInt(process.env.MAX_FILE_SIZE_MB_FREE || '50', 10),
    proMaxFileMb: parseInt(process.env.MAX_FILE_SIZE_MB_PRO || '200', 10),
    rateLimitWindowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS || '60000', 10),
    rateLimitMaxRequests: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS || '500', 10),
    jobRateLimitMax: parseInt(process.env.JOB_RATE_LIMIT_MAX || '60', 10),
  },
  logging: {
    level: (process.env.LOG_LEVEL as any) || 'info',
  },
};
