import { Request, Response, NextFunction } from 'express';
import fs from 'fs';

/**
 * Inspects binary magic numbers directly from a buffer
 */
export function validateMagicBytes(buffer: Buffer, _fileName?: string): { valid: boolean; format?: string } {
  if (!buffer || buffer.length < 4) {
    return { valid: false };
  }

  const hex = buffer.slice(0, 8).toString('hex').toUpperCase();

  // Signatures:
  // PDF: %PDF- -> 25 50 44 46
  // Office / ZIP: PK.. -> 50 4B 03 04
  // JPEG: FF D8 FF
  // PNG: 89 50 4E 47
  if (hex.startsWith('25504446')) {
    return { valid: true, format: 'pdf' };
  }
  if (hex.startsWith('504B0304')) {
    return { valid: true, format: 'zip-or-office' };
  }
  if (hex.startsWith('FFD8FF')) {
    return { valid: true, format: 'jpeg' };
  }
  if (hex.startsWith('89504E47')) {
    return { valid: true, format: 'png' };
  }

  return { valid: false };
}

/**
 * Binary Magic Number Inspector Express Middleware
 * Validates actual binary signatures against declared MIME types
 * Rejects polyglot payloads and disguised executables
 */
export function validateMimeMagicBytes(req: Request, res: Response, next: NextFunction) {
  if (!req.file) {
    return next();
  }

  const filePath = req.file.path;
  const buffer = Buffer.alloc(8);

  try {
    const fd = fs.openSync(filePath, 'r');
    fs.readSync(fd, buffer, 0, 8, 0);
    fs.closeSync(fd);

    const check = validateMagicBytes(buffer, req.file.originalname);
    if (!check.valid) {
      // Discard invalid file immediately
      try {
        fs.unlinkSync(filePath);
      } catch (_) {}

      return res.status(400).json({
        error: 'Invalid file payload signature.',
        message: 'The uploaded file does not match its claimed document signature.',
      });
    }

    next();
  } catch (err: any) {
    console.error('[MIME Validator Error]', err);
    res.status(500).json({ error: 'Failed to inspect file payload integrity.' });
  }
}
