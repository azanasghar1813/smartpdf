# SimplePDF Enterprise Deployment Guide

This guide details how to deploy SimplePDF to production environments, from Docker Compose multi-container clusters to Kubernetes and bare-metal Linux servers.

---

## 1. System Requirements

### Hardware Sizing (Recommended Minimums)

| Workload Tier | Concurrent Users | CPU Cores | RAM | Storage |
|---|---|---|---|---|
| **Small Launch** | Up to 500 daily | 2 vCPUs | 4 GB | 50 GB NVMe |
| **Medium Business** | Up to 5,000 daily | 4 vCPUs | 8 GB | 150 GB NVMe |
| **Enterprise / High-Traffic** | 20,000+ daily | 8+ vCPUs | 16+ GB | 500 GB NVMe / S3 |

---

## 2. Docker Compose Deployment (Recommended)

The included `docker-compose.yml` deploys a complete production topology with horizontal API redundancy and independent workers.

### Step 1: Clone Repository & Configure Environment
```bash
# Clone the repository
git clone https://github.com/your-org/simplepdf.git
cd simplepdf

# Create production environment file
cp .env.example .env
```

Edit `.env` with strong production credentials:
```env
NODE_ENV=production
PORT=5000
JWT_SECRET=generate_a_minimum_64_character_random_hex_string_here
DATABASE_URL=postgresql://postgres:StrongPostgresPassword2026@postgres:5432/simplepdf
REDIS_HOST=redis
REDIS_PORT=6379
STORAGE_DRIVER=local
CORS_ALLOWED_ORIGINS=https://simplepdf.com,https://www.simplepdf.com
```

### Step 2: Build and Launch Services
```bash
# Build frontend and backend containers and launch detached
docker compose up -d --build
```

### Step 3: Verify Container Health
```bash
docker compose ps
```
Expected output:
```
NAME                    IMAGE               COMMAND                  SERVICE             STATUS
simplepdf_loadbalancer  nginx:alpine        "/docker-entrypoint.…"   nginx               running (healthy)
simplepdf_api_1         simplepdf-backend   "node backend/dist/c…"   backend-1           running (healthy)
simplepdf_api_2         simplepdf-backend   "node backend/dist/c…"   backend-2           running (healthy)
simplepdf_worker        simplepdf-backend   "node backend/dist/w…"   pdf-worker          running
simplepdf_postgres      postgres:16-alpine  "docker-entrypoint.s…"   postgres            running (healthy)
simplepdf_redis         redis:7-alpine      "docker-entrypoint.s…"   redis               running (healthy)
```

### Step 4: Run Database Migrations
```bash
docker compose exec backend-1 npx prisma migrate deploy
```

---

## 3. Kubernetes (K8s) Production Deployment

For large-scale cloud deployments (AWS EKS, Google GKE, Azure AKS):

```mermaid
flowchart TD
    Ingress["Cloud Ingress / AWS ALB\n(SSL Termination & WAF)"]
    Ingress --> APIService["k8s Service: simplepdf-api"]
    APIService --> Pod1["Pod: simplepdf-api-1"]
    APIService --> Pod2["Pod: simplepdf-api-2"]
    APIService --> PodN["Pod: simplepdf-api-N"]
    
    QueueService["Redis Cluster / AWS ElastiCache"]
    Pod1 -->|"Enqueue"| QueueService
    Pod2 -->|"Enqueue"| QueueService
    
    WorkerPod1["Pod: simplepdf-worker-1"]
    WorkerPod2["Pod: simplepdf-worker-2"]
    WorkerPod1 -->|"Consume"| QueueService
    WorkerPod2 -->|"Consume"| QueueService

    CloudDB[("Managed PostgreSQL / AWS RDS")]
    Pod1 --> CloudDB
    WorkerPod1 --> CloudDB
```

### Key Kubernetes Configurations:
- **Liveness Probe:** `httpGet: { path: /api/health, port: 5000 }, initialDelaySeconds: 10, periodSeconds: 15`
- **Readiness Probe:** `httpGet: { path: /api/ready, port: 5000 }, initialDelaySeconds: 5, periodSeconds: 5`
- **Horizontal Pod Autoscaling (HPA):**
  - Target CPU: 70%
  - Target Memory: 75%
  - Min Replicas: 3, Max Replicas: 30

---

## 4. Bare-Metal Linux / VPS Deployment (systemd & PM2)

If deploying directly onto Ubuntu 22.04 / 24.04 LTS:

### Step 1: Install Node.js & Dependencies
```bash
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs postgresql redis-server nginx
npm install -g pm2
```

### Step 2: Build Project
```bash
npm install
npm run build:frontend
npm run build:backend
```

### Step 3: Configure PM2 Ecosystem (`ecosystem.config.js`)
```javascript
module.exports = {
  apps: [
    {
      name: 'simplepdf-api',
      script: 'backend/dist/cluster.js',
      instances: 'max',
      exec_mode: 'cluster',
      env: {
        NODE_ENV: 'production',
        PORT: 5000,
        CLUSTER_MODE: 'false', // PM2 manages cluster
      },
    },
    {
      name: 'simplepdf-worker',
      script: 'backend/dist/workers/index.js',
      instances: 2,
      exec_mode: 'fork',
      env: {
        NODE_ENV: 'production',
        WORKER_CONCURRENCY: 4,
      },
    },
  ],
};
```

Launch with PM2:
```bash
pm2 start ecosystem.config.js
pm2 save
pm2 startup
```

---

## 5. SSL / TLS Setup with Let's Encrypt

On the host running Nginx:
```bash
sudo apt-get install -y certbot python3-certbot-nginx
sudo certbot --nginx -d simplepdf.com -d www.simplepdf.com
```
Certbot automatically configures HTTPS port 443 with automated certificate renewal.

---

## 6. Pre-Flight Production Checklist

Before opening public traffic:
- [ ] `NODE_ENV=production` set in environment.
- [ ] Strong `JWT_SECRET` generated (min 64 chars).
- [ ] `DATABASE_URL` points to secured PostgreSQL instance with SSL enabled.
- [ ] `npm test` runs with 100% pass rate.
- [ ] `npm run test:secrets` confirms zero exposed secrets.
- [ ] `/api/ready` returns HTTP 200 with database and storage marked `healthy`.
- [ ] Nginx rate limiting zones enabled.
- [ ] Automatic file shredder verified active.
