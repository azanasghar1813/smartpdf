import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const jsonPath = path.resolve(__dirname, '../backend/temp_storage/simplepdf_db.json');
const outputPath = path.resolve(__dirname, '../prisma/migrations/0_init/data-migration.sql');

console.log('🔄 [SimplePDF Data Migration] Reading persistent JSON store...');

if (!fs.existsSync(jsonPath)) {
  console.warn(`⚠️ No existing JSON database found at ${jsonPath}. Nothing to migrate.`);
  process.exit(0);
}

const raw = fs.readFileSync(jsonPath, 'utf-8');
const data = JSON.parse(raw);

const users = Object.values(data.users || {});
const jobs = Object.values(data.jobs || {});
const subscriptions = Object.values(data.subscriptions || {});
const metrics = data.metrics || {};

console.log(`Found:`);
console.log(`  - ${users.length} Users`);
console.log(`  - ${jobs.length} Jobs`);
console.log(`  - ${subscriptions.length} Subscriptions`);

let sql = `-- SimplePDF Data Migration Script from JSON to PostgreSQL\n\n`;

// 1. Users
if (users.length > 0) {
  sql += `-- Migrating Users\n`;
  users.forEach((u) => {
    const id = u.id.replace(/'/g, "''");
    const email = u.email.replace(/'/g, "''");
    const name = (u.name || email.split('@')[0]).replace(/'/g, "''");
    const role = u.role === 'admin' ? 'admin' : 'user';
    const tier = u.tier || 'free';
    const usageToday = u.usageToday || 0;
    const totalProcessed = u.totalProcessed || 0;
    const createdAt = u.createdAt || new Date().toISOString();

    sql += `INSERT INTO "users" ("id", "email", "name", "role", "tier", "usageToday", "totalProcessed", "createdAt", "updatedAt")\n`;
    sql += `VALUES ('${id}', '${email}', '${name}', '${role}', '${tier}', ${usageToday}, ${totalProcessed}, '${createdAt}', CURRENT_TIMESTAMP)\n`;
    sql += `ON CONFLICT ("email") DO UPDATE SET "tier" = EXCLUDED."tier", "totalProcessed" = EXCLUDED."totalProcessed";\n\n`;
  });
}

// 2. Metrics
sql += `-- Migrating Platform Metrics\n`;
sql += `INSERT INTO "platform_metrics" ("id", "totalProcessedJobs", "edgeBandwidthSavedGB", "ephemeralFilesPurgedCount", "updatedAt")\n`;
sql += `VALUES ('singleton_metrics', ${metrics.totalProcessedJobs || 0}, ${metrics.edgeBandwidthSavedGB || 0}, ${metrics.ephemeralFilesPurgedCount || 0}, CURRENT_TIMESTAMP)\n`;
sql += `ON CONFLICT ("id") DO UPDATE SET "totalProcessedJobs" = EXCLUDED."totalProcessedJobs";\n\n`;

fs.writeFileSync(outputPath, sql, 'utf-8');

console.log(`✅ [SimplePDF Data Migration] Successfully generated PostgreSQL migration file:`);
console.log(`   ${outputPath}`);
console.log(`\nTo apply this to your live PostgreSQL database, run:`);
console.log(`   psql $DATABASE_URL -f prisma/migrations/0_init/data-migration.sql\n`);
