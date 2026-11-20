-- SimplePDF Data Migration Script from JSON to PostgreSQL

-- Migrating Users
INSERT INTO "users" ("id", "email", "name", "role", "tier", "usageToday", "totalProcessed", "createdAt", "updatedAt")
VALUES ('usr_admin_root', 'admin@simplepdf.com', 'System Admin', 'admin', 'premium', 0, 0, '2026-11-19T08:58:38.414Z', CURRENT_TIMESTAMP)
ON CONFLICT ("email") DO UPDATE SET "tier" = EXCLUDED."tier", "totalProcessed" = EXCLUDED."totalProcessed";

INSERT INTO "users" ("id", "email", "name", "role", "tier", "usageToday", "totalProcessed", "createdAt", "updatedAt")
VALUES ('usr_fd51a480', 'sarah@resistance.org', 'Sarah Connor', 'user', 'free', 0, 0, '2026-11-19T09:02:16.923Z', CURRENT_TIMESTAMP)
ON CONFLICT ("email") DO UPDATE SET "tier" = EXCLUDED."tier", "totalProcessed" = EXCLUDED."totalProcessed";

INSERT INTO "users" ("id", "email", "name", "role", "tier", "usageToday", "totalProcessed", "createdAt", "updatedAt")
VALUES ('usr_8cbb2d89', 'user@simplepdf.com', 'user', 'user', 'free', 0, 0, '2026-11-19T10:55:34.397Z', CURRENT_TIMESTAMP)
ON CONFLICT ("email") DO UPDATE SET "tier" = EXCLUDED."tier", "totalProcessed" = EXCLUDED."totalProcessed";

-- Migrating Platform Metrics
INSERT INTO "platform_metrics" ("id", "totalProcessedJobs", "edgeBandwidthSavedGB", "ephemeralFilesPurgedCount", "updatedAt")
VALUES ('singleton_metrics', 5, 0, 0, CURRENT_TIMESTAMP)
ON CONFLICT ("id") DO UPDATE SET "totalProcessedJobs" = EXCLUDED."totalProcessedJobs";

