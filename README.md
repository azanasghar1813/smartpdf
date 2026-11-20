# SimplePDF — Enterprise PDF Productivity & Conversion Platform

> **Document Productivity. Made Simple.**  
> SimplePDF is a production-grade, horizontally scalable, privacy-first PDF and document engineering platform. It combines edge-speed in-browser WebAssembly processing with a distributed, fault-tolerant backend cluster for heavy document conversion, optical character recognition (OCR), and repair workflows.

---

## 🌟 Architecture & Highlights

- **Dual-Tier Hybrid Processing Engine:**
  - **Client-Side Edge Execution:** Over 20 common operations (Merge, Split, Rotate, Extract, Reorder, Number, Watermark, Protect) execute 100% inside the user's browser using WebAssembly and `pdf-lib`. Zero network bandwidth consumed and 100% data privacy.
  - **Distributed Cloud Microservices:** Heavy conversions (Word, Excel, PowerPoint to/from PDF, OCR, Repair) are offloaded to an asynchronous background worker cluster powered by BullMQ/Redis and typed PostgreSQL persistence.
- **Enterprise Storage Abstraction:**
  - Zero lock-in storage driver supporting **Local Filesystem** (development) and **AWS S3 / Cloudflare R2 / MinIO** (production).
  - Short-lived HMAC-signed download tokens preventing unauthorized access.
  - Automated cryptographic file shredding and TTL pruning (60-minute retention policy).
- **High-Performance Load Balancing & Concurrency:**
  - Nginx reverse proxy with `least_conn` load balancing across multi-instance API replicas.
  - Memory-aware, self-healing Node.js cluster supervisor with crash loop detection and exponential backoff.
  - Resource monitor with dynamic concurrency throttling based on live CPU and RAM pressure.
- **Bank-Grade Security Architecture:**
  - NIST-compliant `scrypt` password hashing with random salt and timing-safe comparison.
  - RFC 7519 JSON Web Token (JWT) session generation with cryptographic signing.
  - Server-Side Request Forgery (SSRF) guard blocking RFC 1918 private subnets and cloud metadata endpoints (169.254.169.254).
  - Deep-packet binary magic byte inspection rejecting polyglot payloads and disguised executables.
  - Distributed sliding-window rate limiting with `Retry-After` headers.
  - Webhook HMAC-SHA256 signature verification.
- **Production-Ready Observability:**
  - Structured JSON access logging with unique `X-Request-ID` tracing across API and worker tiers.
  - Liveness probe (`/api/health`) and deep Readiness probe (`/api/ready`) validating database, queue, and storage health.

---

## 🏗️ Repository Architecture

```
simplepdf/
├── frontend/                     # React 18 + Vite + TypeScript + Tailwind CSS UI
│   ├── public/                   # Favicon, SVG Logo, manifest, robots.txt, sitemap
│   └── src/
│       ├── components/           # Navbar, Footer, ToolWorkspace, Ads, Circuit Breaker
│       ├── data/                 # 30+ Tools Registry and metadata
│       ├── pages/                # Landing, Pricing, Dashboard, Admin, Legal
│       └── services/             # Client-side WebAssembly & canvas processing
├── backend/                      # Node.js + Express API Gateway & Workers
│   ├── src/
│   │   ├── config/               # Strongly-typed environment schema (env.ts)
│   │   ├── controllers/          # Tools, Auth, AI, Payment controllers
│   │   ├── database/             # PostgreSQL typed repository with JSON fallback
│   │   ├── middleware/           # SSRF Guard, MIME Validator, Security Headers, Rate Limiter
│   │   ├── queues/               # Redis connection manager & BullMQ priority queue
│   │   ├── routes/               # API v1 route definitions
│   │   ├── services/             # Conversion service, job service, auth service, resource monitor
│   │   ├── storage/              # StorageProvider (Local & AWS S3/Cloudflare R2 SigV4)
│   │   ├── workers/              # Independent PDF worker & cleanup shredder worker
│   │   ├── cluster.ts            # Memory-aware supervisor with crash loop backoff
│   │   └── server.ts             # Express gateway with readiness probes & graceful shutdown
│   ├── Dockerfile                # Multi-stage production container build
│   └── test_controllers_deep.js  # Deep controller audit suite
├── nginx/
│   └── nginx.conf                # Least-connections load balancer, rate limits & SSL proxy
├── prisma/
│   ├── schema.prisma             # PostgreSQL schema (User, Session, Job, Subscriptions)
│   └── migrations/               # Declarative SQL migrations
├── scripts/
│   ├── audit-secrets.js          # Gitleaks-grade zero-exposure credential scanner
│   ├── benchmark-in-memory.js    # Ultra-high speed duplex socket benchmarking harness
│   └── migrate-json-to-pg.js     # Zero-data-loss JSON to PostgreSQL migration script
├── tests/
│   ├── functional.test.js        # End-to-end tool conversion and download tests
│   ├── queue.test.js             # Distributed priority queue, idempotency, backpressure tests
│   ├── security.test.js          # Path traversal, SSRF, scrypt, JWT, and webhook tests
│   ├── reliability.test.js       # Health probes, resource monitor, and storage tests
│   └── load.test.js              # High-concurrency load and latency benchmark (p50/p95/p99)
├── docker-compose.yml            # Multi-replica backend, worker, Nginx, PostgreSQL, Redis
└── .env.example                  # Enterprise configuration variable reference
```

---

## ⚡ Quick Start Guide

### 1. Prerequisites
- **Node.js**: v20+ or v24+
- **Docker & Docker Compose** (for multi-container deployment)

### 2. Local Development Setup
```bash
# Clone the repository
git clone https://github.com/your-org/simplepdf.git
cd simplepdf

# Copy environment configuration
cp .env.example .env

# Install dependencies across all monorepo workspaces
npm install

# Start Frontend (http://localhost:3000)
npm run dev:frontend

# Start Backend API (http://localhost:5000)
npm run dev:backend
```

### 3. Run Verification & Test Suites
```bash
# Run comprehensive automated test suites
npm test

# Run individual targeted suites
npm run test:functional    # E2E PDF conversion and download flow
npm run test:queue         # Distributed queue, priority, backpressure
npm run test:security      # SSRF, path traversal, scrypt, JWT, webhooks
npm run test:reliability   # Health probes, resource monitor, ephemeral storage
npm run test:load          # High-concurrency load benchmark (16,000+ req/sec)
npm run test:secrets       # Gitleaks-grade security credential scan
```

---

## 🐳 Production Deployment with Docker Compose

Deploy the complete multi-instance cluster with Nginx, 2 backend API replicas, dedicated worker, PostgreSQL, and Redis:

```bash
# Build and launch all services in detached mode
docker compose up -d --build

# Verify container health
docker compose ps

# Check unified cluster logs
docker compose logs -f nginx backend-1 backend-2 pdf-worker
```

Platform entrypoint: `http://localhost` (proxied by Nginx load balancer).

---

## 📚 Technical Documentation Index

For in-depth architectural and operational specifications, consult:

- [ARCHITECTURE.md](file:///c:/Users/Azan/Desktop/simplepdf/ARCHITECTURE.md) — System design, data flow, component topologies, and state isolation.
- [SECURITY.md](file:///c:/Users/Azan/Desktop/simplepdf/SECURITY.md) — Threat model, OWASP Top 10 defenses, cryptographic hashing, and SSRF controls.
- [DEPLOYMENT.md](file:///c:/Users/Azan/Desktop/simplepdf/DEPLOYMENT.md) — Step-by-step production rollout guide (Docker, Kubernetes, Bare-Metal).
- [SCALING.md](file:///c:/Users/Azan/Desktop/simplepdf/SCALING.md) — Horizontal scaling, Nginx load balancing, and worker sizing matrix.
- [ENVIRONMENT_VARIABLES.md](file:///c:/Users/Azan/Desktop/simplepdf/ENVIRONMENT_VARIABLES.md) — Complete environment variable reference and defaults.
- [DATABASE_MIGRATION.md](file:///c:/Users/Azan/Desktop/simplepdf/DATABASE_MIGRATION.md) — PostgreSQL Prisma schema, indexing, and JSON data migration.
- [BACKUP_AND_RESTORE.md](file:///c:/Users/Azan/Desktop/simplepdf/BACKUP_AND_RESTORE.md) — Point-in-time recovery, database dumping, and disaster recovery.
- [LOAD_TESTING.md](file:///c:/Users/Azan/Desktop/simplepdf/LOAD_TESTING.md) — Autocannon, Lighthouse, and in-memory load test benchmarks.
- [API_DOCUMENTATION.md](file:///c:/Users/Azan/Desktop/simplepdf/API_DOCUMENTATION.md) — RESTful API v1 specification, headers, and schemas.

---

## 📄 License

Proprietary — All rights reserved © SimplePDF Team.
