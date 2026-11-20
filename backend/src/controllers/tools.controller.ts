import { Request, Response } from 'express';
import fs from 'fs';
import path from 'path';
import { jobService } from '../services/jobService';
import { db } from '../services/dbService';
import { LocalStorageProvider } from '../storage/storageProvider';
import { config } from '../config/env';

export async function createProcessingJob(req: Request, res: Response) {
  try {
    const file = req.file;
    const toolId = (req.body.toolId as string) || 'compress-pdf';
    let options: any = {};
    if (req.body.options) {
      try {
        options = typeof req.body.options === 'string' ? JSON.parse(req.body.options) : req.body.options;
      } catch {
        options = {};
      }
    }

    const userEmail = (req.body.userEmail as string) || (req as any).user?.email || 'demo@simplepdf.com';
    const tier = (req.body.tier as any) || (req as any).user?.tier || 'free';
    const idempotencyKey = (req.headers['idempotency-key'] as string) || (req.body.idempotencyKey as string);

    let inputBuffer: Buffer;
    let originalFileName = 'document.pdf';

    if (file && fs.existsSync(file.path)) {
      inputBuffer = await fs.promises.readFile(file.path);
      originalFileName = file.originalname;
      // Clean up multer temporary upload file immediately
      fs.promises.unlink(file.path).catch(() => {});
    } else if (file && file.buffer) {
      inputBuffer = file.buffer;
      originalFileName = file.originalname;
    } else {
      // Minimal valid fallback PDF document
      inputBuffer = Buffer.from(
        '%PDF-1.4\n1 0 obj<</Type/Catalog/Pages 2 0 R>>endobj\n2 0 obj<</Type/Pages/Kids[3 0 R]/Count 1>>endobj\n3 0 obj<</Type/Page/MediaBox[0 0 612 792]/Parent 2 0 R>>endobj\nxref\n0 4\n0000000000 65535 f\n0000000010 00000 n\n0000000053 00000 n\n0000000102 00000 n\ntrailer<</Size 4/Root 1 0 R>>\nstartxref\n178\n%%EOF'
      );
      originalFileName = 'sample.pdf';
    }

    const result = await jobService.submitJob(
      inputBuffer,
      originalFileName,
      toolId,
      options,
      userEmail,
      tier,
      idempotencyKey
    );

    return res.status(202).json({
      success: true,
      jobId: result.jobId,
      status: result.status,
      message: result.message,
    });
  } catch (err: any) {
    if (err.message === 'QUEUE_CAPACITY_EXCEEDED' || err.message === 'SYSTEM_OVERLOADED_BACKOFF') {
      return res.status(503).json({
        error: 'Conversion capacity currently saturated. Please retry shortly.',
        code: 'SERVICE_TEMPORARILY_OVERLOADED',
      });
    }
    console.error('[ToolsController] Failed to create job:', err);
    return res.status(500).json({ error: 'Failed to enqueue processing job.' });
  }
}

export async function getJobStatus(req: Request, res: Response) {
  try {
    const { jobId } = req.params;
    const job = await jobService.getJob(jobId);

    if (!job) {
      return res.status(404).json({ error: 'Job not found or expired from ephemeral storage.' });
    }

    return res.json({
      id: job.id,
      toolId: job.toolId,
      status: job.status,
      progress: job.progress,
      fileName: job.fileName,
      fileSize: job.fileSize,
      resultFileName: job.resultFileName,
      downloadUrl: job.downloadUrl,
      error: job.error,
      createdAt: job.createdAt,
    });
  } catch (err) {
    console.error('[ToolsController] Status lookup error:', err);
    return res.status(500).json({ error: 'Internal error checking job status.' });
  }
}

export async function downloadJobResult(req: Request, res: Response) {
  try {
    const { jobId } = req.params;
    const download = await jobService.getDownloadStreamOrUrl(jobId);

    if (download.type === 'redirect' && download.redirectUrl) {
      return res.redirect(download.redirectUrl);
    }

    if (download.type === 'stream' && download.stream) {
      res.setHeader('Content-Type', download.contentType);
      res.setHeader('Content-Disposition', `attachment; filename="${download.fileName}"`);
      res.setHeader('Cache-Control', 'private, no-cache, no-store, must-revalidate');
      return download.stream.pipe(res);
    }

    return res.status(404).json({ error: 'File stream unavailable.' });
  } catch (err: any) {
    if (err.message === 'FILE_NOT_FOUND_OR_PROCESSING') {
      return res.status(404).json({ error: 'Download expired or conversion still in progress.' });
    }
    console.error('[ToolsController] Download error:', err);
    return res.status(500).json({ error: 'Failed to stream result file.' });
  }
}

export async function downloadSignedResult(req: Request, res: Response) {
  try {
    const { key, exp, sig, fn } = req.query as { key?: string; exp?: string; sig?: string; fn?: string };

    if (!key || !exp || !sig) {
      return res.status(400).json({ error: 'Missing required signature parameters.' });
    }

    const localProvider = new LocalStorageProvider();
    const isValid = localProvider.verifySignedToken(key, parseInt(exp, 10), sig);

    if (!isValid) {
      return res.status(403).json({ error: 'Invalid or expired download signature token.' });
    }

    const exists = await localProvider.exists(key);
    if (!exists) {
      return res.status(410).json({ error: 'File has expired and was pruned by retention policy.' });
    }

    const fileName = fn || path.basename(key);
    const ext = path.extname(fileName).toLowerCase();
    let contentType = 'application/octet-stream';
    if (ext === '.pdf') contentType = 'application/pdf';
    else if (ext === '.zip') contentType = 'application/zip';

    res.setHeader('Content-Type', contentType);
    res.setHeader('Content-Disposition', `attachment; filename="${fileName}"`);
    const stream = localProvider.createReadStream(key);
    return stream.pipe(res);
  } catch (err) {
    console.error('[ToolsController] Signed download error:', err);
    return res.status(500).json({ error: 'Failed to verify signed download.' });
  }
}

export function getPlatformMetrics(req: Request, res: Response) {
  const metrics = db.getMetrics();
  res.json({
    totalProcessedJobs: metrics.totalProcessedJobs,
    activeJobsInQueue: metrics.activeJobsInQueue,
    edgeBandwidthSavedGB: metrics.edgeBandwidthSavedGB,
    ephemeralFilesPurgedToday: metrics.ephemeralFilesPurgedToday,
    registeredUsersCount: metrics.registeredUsersCount,
    successRate: metrics.successRate,
  });
}
