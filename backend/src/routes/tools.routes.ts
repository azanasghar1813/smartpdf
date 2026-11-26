import { Router } from 'express';
import multer from 'multer';
import path from 'path';
import crypto from 'crypto';
import {
  createProcessingJob,
  getJobStatus,
  downloadJobResult,
  downloadSignedResult,
  getPlatformMetrics,
  purgeEphemeralStorage,
} from '../controllers/tools.controller';
import { validateMimeMagicBytes } from '../middleware/mimeValidator';
import { ssrfGuard } from '../middleware/ssrfGuard';
import { requireAuth, requireAdmin } from '../services/authService';

const router = Router();

// Ephemeral storage configuration for uploads (secure UUID-based names, zero path traversal)
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.resolve(__dirname, '../../temp_storage'));
  },
  filename: (req, file, cb) => {
    const rawExt = path.extname(file.originalname).toLowerCase().replace(/[^a-z0-9.]/g, '').slice(0, 10);
    const safeExt = rawExt || '.tmp';
    const safeUuid = crypto.randomUUID ? crypto.randomUUID() : `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    cb(null, `${safeUuid}${safeExt}`);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 50 * 1024 * 1024 }, // 50MB
});

// Routes
router.post(
  '/jobs/create',
  upload.single('file'),
  validateMimeMagicBytes,
  ssrfGuard,
  createProcessingJob
);

router.get('/jobs/:jobId/status', getJobStatus);
router.get('/download/signed', downloadSignedResult);
router.get('/download/:jobId', downloadJobResult);
router.get('/metrics', getPlatformMetrics);
router.post('/admin/purge-storage', requireAuth, requireAdmin, purgeEphemeralStorage);

export default router;
