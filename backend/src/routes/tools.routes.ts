import { Router } from 'express';
import multer from 'multer';
import path from 'path';
import {
  createProcessingJob,
  getJobStatus,
  downloadJobResult,
  downloadSignedResult,
  getPlatformMetrics,
} from '../controllers/tools.controller';
import { validateMimeMagicBytes } from '../middleware/mimeValidator';
import { ssrfGuard } from '../middleware/ssrfGuard';

const router = Router();

// Ephemeral storage configuration for uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.resolve(__dirname, '../../temp_storage'));
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    cb(null, `${uniqueSuffix}-${file.originalname}`);
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

export default router;
