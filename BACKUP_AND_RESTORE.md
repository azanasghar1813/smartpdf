# SimplePDF Backup, Disaster Recovery & Restore Guide

This operational manual documents procedures for database backups, object storage snapshots, point-in-time recovery, and disaster recovery (DR) drills.

---

## 1. PostgreSQL Backup Procedures

### A. Logical Full Database Backup (`pg_dump`)
Run a compressed, consistent snapshot of the PostgreSQL database:

```bash
# Set timestamp and backup path
BACKUP_DATE=$(date +"%Y%m%d_%H%M%S")
BACKUP_FILE="/backups/simplepdf_pg_${BACKUP_DATE}.dump"

# Execute pg_dump using custom format with maximum compression
pg_dump -U postgres -h localhost -p 5432 -F c -b -v -f "$BACKUP_FILE" simplepdf
```

### B. Automated Daily Backup Script (`cron`)
Add the following cron job to `/etc/cron.d/simplepdf-backup`:

```bash
# Run daily at 02:00 AM UTC
0 2 * * * postgres /usr/local/bin/backup-simplepdf.sh >> /var/log/simplepdf-backup.log 2>&1
```

Script content (`/usr/local/bin/backup-simplepdf.sh`):
```bash
#!/usr/bin/env bash
set -eo pipefail

BACKUP_DIR="/var/backups/simplepdf"
mkdir -p "$BACKUP_DIR"
DATE=$(date +"%Y%m%d_%H%M%S")
FILE="$BACKUP_DIR/db_${DATE}.dump"

# Dump database
pg_dump -U postgres -d simplepdf -F c -f "$FILE"

# Upload to secure offsite S3 backup bucket
aws s3 cp "$FILE" s3://simplepdf-backups-offsite/postgres/

# Keep only last 14 days of local backups
find "$BACKUP_DIR" -type f -name "*.dump" -mtime +14 -delete
```

---

## 2. PostgreSQL Restoration Procedure

In the event of database corruption or hardware failure:

### Step 1: Provision Clean Database Container
```bash
# Drop corrupted database (if safe) and re-create clean database
dropdb -U postgres -h localhost simplepdf
createdb -U postgres -h localhost simplepdf
```

### Step 2: Restore from Backup Dump
```bash
pg_restore -U postgres -h localhost -p 5432 -d simplepdf -v "/backups/simplepdf_pg_20261120.dump"
```

### Step 3: Verify Integrity & Foreign Keys
```sql
SELECT count(*) FROM "User";
SELECT count(*) FROM "Job";
SELECT count(*) FROM "Subscription";
```

---

## 3. Redis Snapshot & Queue State Backup

Redis stores active queue state, idempotency keys, and distributed rate limiting windows.

### Manual Snapshot
```bash
# Trigger Redis background snapshot
redis-cli bgsave
```
The snapshot file is saved to `/data/dump.rdb` (or mapped docker volume `redisdata`).

### Restoring Redis State
1. Stop Redis: `docker compose stop redis`
2. Copy `dump.rdb` into the Redis data directory.
3. Start Redis: `docker compose start redis`

---

## 4. Object Storage Backup (Cloudflare R2 / AWS S3)

Because SimplePDF implements a strict 60-minute ephemeral lifecycle policy for user documents, long-term object storage backups of processed files are **not required** (and violate user privacy guarantees).

However, platform assets (logos, user avatars, legal templates) should be replicated:
```bash
# AWS S3 / Cloudflare R2 bucket-to-bucket cross-region replication
aws s3 sync s3://simplepdf-static-assets s3://simplepdf-static-assets-dr --delete
```

---

## 5. Disaster Recovery (DR) Execution Playbook

In the event of a total data center outage:

1. **DNS Failover:** Update Route53 / Cloudflare DNS records to point to the secondary standby region.
2. **Launch Infrastructure:** Launch `docker compose up -d` or apply Kubernetes manifests in the recovery region.
3. **Restore Database:** Download the latest offsite backup dump and execute `pg_restore`.
4. **Run Health Probes:** Validate `/api/health` and `/api/ready` endpoints return HTTP 200.
5. **Open Traffic:** Route 10% traffic to recovery cluster, verify error rates < 0.01%, then route 100%.
