# SimplePDF Environment Variables Reference Guide

All configuration in SimplePDF is driven by environment variables validated on startup by `backend/src/config/env.ts`. When `NODE_ENV=production`, the application performs strict pre-flight validation and aborts immediately if critical credentials are missing or default values are detected.

---

## Complete Configuration Parameter Reference

### 1. Core Server & Clustering

| Variable | Type | Default | Description |
|---|---|---|---|
| `NODE_ENV` | `string` | `development` | Runtime environment: `development`, `production`, or `test`. |
| `PORT` | `number` | `5000` | HTTP port on which the API Gateway listens. |
| `CLUSTER_MODE` | `boolean` | `false` | Enable multi-core Node.js cluster supervisor (`true`/`false`). |
| `MAX_WORKERS` | `number` | `0` | Max worker processes to spawn in cluster mode (`0` = auto-calculate based on RAM and CPU cores). |
| `RUN_STANDALONE_WORKER` | `boolean` | `true` | When `true`, API instance spawns background worker threads embedded. In multi-container setups, set to `false`. |

---

### 2. Security & Authentication

| Variable | Type | Default | Description |
|---|---|---|---|
| `JWT_SECRET` | `string` | *dev-only key* | Cryptographic secret used to sign session tokens. **Mandatory in production (min 64 chars)**. |
| `JWT_ACCESS_EXPIRY` | `number` | `86400` | Token validity duration in seconds (86400 = 24 hours). |
| `CORS_ALLOWED_ORIGINS` | `string` | `http://localhost:3000` | Comma-separated list of allowed web origins (e.g. `https://simplepdf.com,https://app.simplepdf.com`). |
| `TRUST_PROXY` | `boolean` | `false` | Trust `X-Forwarded-For` and `X-Forwarded-Proto` proxy headers from Nginx or AWS ALB. |
| `PAYMENT_WEBHOOK_SECRET` | `string` | *dev-key* | Secret token for validating Stripe / LemonSqueezy HMAC signatures. |

---

### 3. Database & Relational Persistence

| Variable | Type | Default | Description |
|---|---|---|---|
| `DATABASE_URL` | `string` | `postgresql://...` | Connection URI for PostgreSQL database. Format: `postgresql://user:pass@host:5432/dbname`. |
| `DB_POOL_MIN` | `number` | `2` | Minimum idle connections to maintain in PostgreSQL pool. |
| `DB_POOL_MAX` | `number` | `10` | Maximum simultaneous database connections per instance. |

---

### 4. Distributed Redis & Job Queue

| Variable | Type | Default | Description |
|---|---|---|---|
| `REDIS_HOST` | `string` | `localhost` | Redis server hostname or IP address. |
| `REDIS_PORT` | `number` | `6379` | Redis TCP port. |
| `REDIS_PASSWORD` | `string` | *none* | Optional Redis authentication password. |
| `REDIS_URL` | `string` | *none* | Optional unified Redis connection string (e.g. `redis://:pass@host:6379/0`). |

---

### 5. Storage Abstraction (Local / AWS S3 / Cloudflare R2)

| Variable | Type | Default | Description |
|---|---|---|---|
| `STORAGE_DRIVER` | `string` | `local` | Storage backend driver: `local`, `s3`, or `r2`. |
| `STORAGE_S3_BUCKET` | `string` | `simplepdf-documents` | Name of the S3/R2 storage bucket. |
| `STORAGE_S3_REGION` | `string` | `auto` | AWS region (e.g. `us-east-1`) or `auto` for Cloudflare R2. |
| `STORAGE_S3_ENDPOINT` | `string` | *AWS default* | Custom S3 API endpoint (e.g. `https://<account_id>.r2.cloudflarestorage.com`). |
| `STORAGE_S3_ACCESS_KEY` | `string` | *none* | S3 / R2 access key ID. |
| `STORAGE_S3_SECRET_KEY` | `string` | *none* | S3 / R2 secret access key. |
| `STORAGE_SIGNED_URL_TTL_SECONDS`| `number` | `3600` | Expiration time for signed download links (3600 = 1 hour). |
| `TEMP_FILE_TTL_MINUTES` | `number` | `60` | Ephemeral lifecycle retention time before automated zero-fill shredding. |

---

### 6. Queue Concurrency & Backpressure

| Variable | Type | Default | Description |
|---|---|---|---|
| `WORKER_CONCURRENCY` | `number` | `4` | Maximum simultaneous jobs processed per worker process. |
| `QUEUE_MAX_WAITING_JOBS`| `number` | `100` | Backpressure threshold. Returns HTTP 503 if waiting queue exceeds this limit. |
| `JOB_TIMEOUT_MS` | `number` | `180000` | Maximum allowed conversion time before aborting job (180000 = 3 mins). |

---

### 7. File Size Quotas & Rate Limits

| Variable | Type | Default | Description |
|---|---|---|---|
| `MAX_FILE_SIZE_MB_FREE` | `number` | `50` | Maximum upload size for free users (in MB). |
| `MAX_FILE_SIZE_MB_PRO` | `number` | `200` | Maximum upload size for Pro/Business subscribers (in MB). |
| `RATE_LIMIT_WINDOW_MS` | `number` | `60000` | Sliding rate limit window duration in ms (60000 = 1 min). |
| `RATE_LIMIT_MAX_REQUESTS`| `number` | `500` | Max API requests permitted per IP per minute window. |
| `JOB_RATE_LIMIT_MAX` | `number` | `60` | Max job creation requests permitted per IP per minute window. |

---

### 8. Logging & Telemetry

| Variable | Type | Default | Description |
|---|---|---|---|
| `LOG_LEVEL` | `string` | `info` | Logging verbosity: `debug`, `info`, `warn`, or `error`. |
