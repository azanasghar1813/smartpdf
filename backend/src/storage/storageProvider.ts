import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import { Readable } from 'stream';
import { config } from '../config/env';

export interface StorageObjectMetadata {
  key: string;
  size: number;
  contentType: string;
  lastModified?: Date;
}

export interface IStorageProvider {
  upload(key: string, data: Buffer, contentType?: string): Promise<StorageObjectMetadata>;
  download(key: string): Promise<Buffer>;
  createReadStream(key: string): Readable;
  delete(key: string): Promise<boolean>;
  exists(key: string): Promise<boolean>;
  getSignedDownloadUrl(key: string, originalFileName?: string, expiresInSeconds?: number): Promise<string>;
  deleteExpired(olderThanMinutes: number): Promise<number>;
}

/**
 * Local File System Storage Provider
 * Implements isolated directories, zero path traversal, and HMAC signed download tokens.
 */
export class LocalStorageProvider implements IStorageProvider {
  private baseDir: string;
  private signSecret: string;

  constructor(baseDir?: string, signSecret?: string) {
    this.baseDir = baseDir || config.storage.localDir;
    this.signSecret = signSecret || config.security.jwtSecret;

    if (!fs.existsSync(this.baseDir)) {
      fs.mkdirSync(this.baseDir, { recursive: true, mode: 0o700 });
    }
  }

  private resolveSafePath(key: string): string {
    // Sanitize key to prevent path traversal
    const safeKey = key.replace(/(\.\.[\/\\])+/g, '').replace(/^[\\\/]+/, '');
    const fullPath = path.resolve(this.baseDir, safeKey);
    if (!fullPath.startsWith(path.resolve(this.baseDir))) {
      throw new Error(`Directory traversal detected: ${key}`);
    }
    return fullPath;
  }

  public async upload(key: string, data: Buffer, contentType = 'application/octet-stream'): Promise<StorageObjectMetadata> {
    const filePath = this.resolveSafePath(key);
    const dir = path.dirname(filePath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true, mode: 0o700 });
    }

    await fs.promises.writeFile(filePath, data);
    return {
      key,
      size: data.length,
      contentType,
      lastModified: new Date(),
    };
  }

  public async download(key: string): Promise<Buffer> {
    const filePath = this.resolveSafePath(key);
    if (!fs.existsSync(filePath)) {
      throw new Error(`Storage object not found: ${key}`);
    }
    return await fs.promises.readFile(filePath);
  }

  public createReadStream(key: string): Readable {
    const filePath = this.resolveSafePath(key);
    if (!fs.existsSync(filePath)) {
      throw new Error(`Storage object not found: ${key}`);
    }
    return fs.createReadStream(filePath);
  }

  public async delete(key: string): Promise<boolean> {
    try {
      const filePath = this.resolveSafePath(key);
      if (fs.existsSync(filePath)) {
        await fs.promises.unlink(filePath);
        return true;
      }
      return false;
    } catch {
      return false;
    }
  }

  public async exists(key: string): Promise<boolean> {
    try {
      const filePath = this.resolveSafePath(key);
      return fs.existsSync(filePath);
    } catch {
      return false;
    }
  }

  public async getSignedDownloadUrl(key: string, originalFileName?: string, expiresInSeconds = 3600): Promise<string> {
    const expiresAt = Math.floor(Date.now() / 1000) + expiresInSeconds;
    const payload = `${key}:${expiresAt}`;
    const signature = crypto.createHmac('sha256', this.signSecret).update(payload).digest('hex');

    const params = new URLSearchParams({
      key,
      exp: expiresAt.toString(),
      sig: signature,
    });
    if (originalFileName) {
      params.set('fn', originalFileName);
    }

    return `/api/v1/download/signed?${params.toString()}`;
  }

  public verifySignedToken(key: string, expiresAt: number, signature: string): boolean {
    if (Date.now() / 1000 > expiresAt) {
      return false;
    }
    const payload = `${key}:${expiresAt}`;
    const expected = crypto.createHmac('sha256', this.signSecret).update(payload).digest('hex');
    try {
      return crypto.timingSafeEqual(Buffer.from(signature, 'hex'), Buffer.from(expected, 'hex'));
    } catch {
      return false;
    }
  }

  public async deleteExpired(olderThanMinutes: number): Promise<number> {
    let deletedCount = 0;
    const now = Date.now();
    const maxAgeMs = olderThanMinutes * 60 * 1000;

    const scanAndPrune = (dir: string) => {
      if (!fs.existsSync(dir)) return;
      const entries = fs.readdirSync(dir, { withFileTypes: true });

      for (const entry of entries) {
        const fullPath = path.join(dir, entry.name);
        try {
          if (entry.isDirectory()) {
            scanAndPrune(fullPath);
            // If empty, clean directory up
            if (fs.readdirSync(fullPath).length === 0) {
              fs.rmdirSync(fullPath);
            }
          } else {
            const stat = fs.statSync(fullPath);
            if (now - stat.mtimeMs > maxAgeMs) {
              fs.unlinkSync(fullPath);
              deletedCount++;
            }
          }
        } catch (err) {
          console.warn(`[Storage Prune] Error cleaning ${fullPath}:`, err);
        }
      }
    };

    scanAndPrune(this.baseDir);
    return deletedCount;
  }
}

/**
 * AWS S3 & Cloudflare R2 Compatible Storage Provider
 * Implements S3 REST API & AWS Signature Version 4 (SigV4) natively using standard node:crypto and fetch.
 * Fully supports custom endpoints (Cloudflare R2, MinIO, Wasabi, AWS S3).
 */
export class S3StorageProvider implements IStorageProvider {
  private bucket: string;
  private region: string;
  private endpoint: string;
  private accessKey: string;
  private secretKey: string;
  private fallbackLocal: LocalStorageProvider;

  constructor() {
    this.bucket = config.storage.s3.bucket;
    this.region = config.storage.s3.region || 'auto';
    this.accessKey = config.storage.s3.accessKeyId;
    this.secretKey = config.storage.s3.secretAccessKey;
    this.fallbackLocal = new LocalStorageProvider();

    // Default to AWS S3 format if custom endpoint not specified
    if (config.storage.s3.endpoint) {
      this.endpoint = config.storage.s3.endpoint.replace(/\/+$/, '');
    } else {
      this.endpoint = `https://${this.bucket}.s3.${this.region}.amazonaws.com`;
    }
  }

  private isConfigured(): boolean {
    return Boolean(this.accessKey && this.secretKey && this.bucket);
  }

  // AWS SigV4 Helpers
  private hmacSha256(key: Buffer | string, data: string): Buffer {
    return crypto.createHmac('sha256', key).update(data, 'utf8').digest();
  }

  private getSignatureKey(key: string, dateStamp: string, regionName: string, serviceName: string): Buffer {
    const kDate = this.hmacSha256('AWS4' + key, dateStamp);
    const kRegion = this.hmacSha256(kDate, regionName);
    const kService = this.hmacSha256(kRegion, serviceName);
    return this.hmacSha256(kService, 'aws4_request');
  }

  public async upload(key: string, data: Buffer, contentType = 'application/octet-stream'): Promise<StorageObjectMetadata> {
    if (!this.isConfigured()) {
      return await this.fallbackLocal.upload(key, data, contentType);
    }

    const cleanKey = key.replace(/^\/+/, '');
    const url = `${this.endpoint}/${cleanKey}`;
    const urlObj = new URL(url);

    const now = new Date();
    const amzDate = now.toISOString().replace(/[:-]|\.\d{3}/g, '');
    const dateStamp = amzDate.substring(0, 8);

    const payloadHash = crypto.createHash('sha256').update(data).digest('hex');
    const canonicalHeaders = `host:${urlObj.host}\nx-amz-content-sha256:${payloadHash}\nx-amz-date:${amzDate}\n`;
    const signedHeaders = 'host;x-amz-content-sha256;x-amz-date';

    const canonicalRequest = ['PUT', `/${cleanKey}`, '', canonicalHeaders, signedHeaders, payloadHash].join('\n');

    const credentialScope = `${dateStamp}/${this.region}/s3/aws4_request`;
    const stringToSign = ['AWS4-HMAC-SHA256', amzDate, credentialScope, crypto.createHash('sha256').update(canonicalRequest).digest('hex')].join('\n');

    const signingKey = this.getSignatureKey(this.secretKey, dateStamp, this.region, 's3');
    const signature = crypto.createHmac('sha256', signingKey).update(stringToSign).digest('hex');

    const authHeader = `AWS4-HMAC-SHA256 Credential=${this.accessKey}/${credentialScope}, SignedHeaders=${signedHeaders}, Signature=${signature}`;

    const res = await fetch(url, {
      method: 'PUT',
      headers: {
        Host: urlObj.host,
        'Content-Type': contentType,
        'Content-Length': data.length.toString(),
        'x-amz-date': amzDate,
        'x-amz-content-sha256': payloadHash,
        Authorization: authHeader,
      },
      body: new Uint8Array(data),
    });

    if (!res.ok) {
      throw new Error(`S3 upload failed [HTTP ${res.status}]: ${await res.text()}`);
    }

    return {
      key: cleanKey,
      size: data.length,
      contentType,
      lastModified: now,
    };
  }

  public async download(key: string): Promise<Buffer> {
    if (!this.isConfigured()) {
      return await this.fallbackLocal.download(key);
    }

    const cleanKey = key.replace(/^\/+/, '');
    const url = `${this.endpoint}/${cleanKey}`;
    const urlObj = new URL(url);

    const now = new Date();
    const amzDate = now.toISOString().replace(/[:-]|\.\d{3}/g, '');
    const dateStamp = amzDate.substring(0, 8);

    const emptyPayloadHash = crypto.createHash('sha256').update('').digest('hex');
    const canonicalHeaders = `host:${urlObj.host}\nx-amz-content-sha256:${emptyPayloadHash}\nx-amz-date:${amzDate}\n`;
    const signedHeaders = 'host;x-amz-content-sha256;x-amz-date';

    const canonicalRequest = ['GET', `/${cleanKey}`, '', canonicalHeaders, signedHeaders, emptyPayloadHash].join('\n');

    const credentialScope = `${dateStamp}/${this.region}/s3/aws4_request`;
    const stringToSign = ['AWS4-HMAC-SHA256', amzDate, credentialScope, crypto.createHash('sha256').update(canonicalRequest).digest('hex')].join('\n');

    const signingKey = this.getSignatureKey(this.secretKey, dateStamp, this.region, 's3');
    const signature = crypto.createHmac('sha256', signingKey).update(stringToSign).digest('hex');

    const authHeader = `AWS4-HMAC-SHA256 Credential=${this.accessKey}/${credentialScope}, SignedHeaders=${signedHeaders}, Signature=${signature}`;

    const res = await fetch(url, {
      method: 'GET',
      headers: {
        Host: urlObj.host,
        'x-amz-date': amzDate,
        'x-amz-content-sha256': emptyPayloadHash,
        Authorization: authHeader,
      },
    });

    if (!res.ok) {
      throw new Error(`S3 download failed [HTTP ${res.status}]: ${await res.text()}`);
    }

    const arrayBuf = await res.arrayBuffer();
    return Buffer.from(arrayBuf);
  }

  public createReadStream(key: string): Readable {
    // If not configured, use local
    if (!this.isConfigured()) {
      return this.fallbackLocal.createReadStream(key);
    }

    const stream = new Readable({
      read() {},
    });

    this.download(key)
      .then((buf) => {
        stream.push(buf);
        stream.push(null);
      })
      .catch((err) => {
        stream.destroy(err);
      });

    return stream;
  }

  public async delete(key: string): Promise<boolean> {
    if (!this.isConfigured()) {
      return await this.fallbackLocal.delete(key);
    }

    try {
      const cleanKey = key.replace(/^\/+/, '');
      const url = `${this.endpoint}/${cleanKey}`;
      const urlObj = new URL(url);

      const now = new Date();
      const amzDate = now.toISOString().replace(/[:-]|\.\d{3}/g, '');
      const dateStamp = amzDate.substring(0, 8);

      const emptyHash = crypto.createHash('sha256').update('').digest('hex');
      const canonicalHeaders = `host:${urlObj.host}\nx-amz-content-sha256:${emptyHash}\nx-amz-date:${amzDate}\n`;
      const signedHeaders = 'host;x-amz-content-sha256;x-amz-date';

      const canonicalRequest = ['DELETE', `/${cleanKey}`, '', canonicalHeaders, signedHeaders, emptyHash].join('\n');

      const credentialScope = `${dateStamp}/${this.region}/s3/aws4_request`;
      const stringToSign = ['AWS4-HMAC-SHA256', amzDate, credentialScope, crypto.createHash('sha256').update(canonicalRequest).digest('hex')].join('\n');

      const signingKey = this.getSignatureKey(this.secretKey, dateStamp, this.region, 's3');
      const signature = crypto.createHmac('sha256', signingKey).update(stringToSign).digest('hex');

      const authHeader = `AWS4-HMAC-SHA256 Credential=${this.accessKey}/${credentialScope}, SignedHeaders=${signedHeaders}, Signature=${signature}`;

      const res = await fetch(url, {
        method: 'DELETE',
        headers: {
          Host: urlObj.host,
          'x-amz-date': amzDate,
          'x-amz-content-sha256': emptyHash,
          Authorization: authHeader,
        },
      });

      return res.status === 204 || res.status === 200;
    } catch {
      return false;
    }
  }

  public async exists(key: string): Promise<boolean> {
    if (!this.isConfigured()) {
      return await this.fallbackLocal.exists(key);
    }

    try {
      const cleanKey = key.replace(/^\/+/, '');
      const url = `${this.endpoint}/${cleanKey}`;
      const res = await fetch(url, { method: 'HEAD' });
      return res.status === 200;
    } catch {
      return false;
    }
  }

  public async getSignedDownloadUrl(key: string, originalFileName?: string, expiresInSeconds = 3600): Promise<string> {
    if (!this.isConfigured()) {
      return await this.fallbackLocal.getSignedDownloadUrl(key, originalFileName, expiresInSeconds);
    }

    const cleanKey = key.replace(/^\/+/, '');
    const urlObj = new URL(`${this.endpoint}/${cleanKey}`);

    const now = new Date();
    const amzDate = now.toISOString().replace(/[:-]|\.\d{3}/g, '');
    const dateStamp = amzDate.substring(0, 8);

    const credentialScope = `${dateStamp}/${this.region}/s3/aws4_request`;
    const amzCredential = `${this.accessKey}/${credentialScope}`;

    const queryParams: Record<string, string> = {
      'X-Amz-Algorithm': 'AWS4-HMAC-SHA256',
      'X-Amz-Credential': amzCredential,
      'X-Amz-Date': amzDate,
      'X-Amz-Expires': expiresInSeconds.toString(),
      'X-Amz-SignedHeaders': 'host',
    };

    if (originalFileName) {
      queryParams['response-content-disposition'] = `attachment; filename="${encodeURIComponent(originalFileName)}"`;
    }

    const sortedQuery = Object.keys(queryParams)
      .sort()
      .map((k) => `${encodeURIComponent(k)}=${encodeURIComponent(queryParams[k])}`)
      .join('&');

    const canonicalHeaders = `host:${urlObj.host}\n`;
    const canonicalRequest = ['GET', `/${cleanKey}`, sortedQuery, canonicalHeaders, 'host', 'UNSIGNED-PAYLOAD'].join('\n');

    const stringToSign = ['AWS4-HMAC-SHA256', amzDate, credentialScope, crypto.createHash('sha256').update(canonicalRequest).digest('hex')].join('\n');

    const signingKey = this.getSignatureKey(this.secretKey, dateStamp, this.region, 's3');
    const signature = crypto.createHmac('sha256', signingKey).update(stringToSign).digest('hex');

    return `${this.endpoint}/${cleanKey}?${sortedQuery}&X-Amz-Signature=${signature}`;
  }

  public async deleteExpired(olderThanMinutes: number): Promise<number> {
    // S3 & Cloudflare R2 manage TTL via standard bucket lifecycle rules (Lifecycle Configuration)
    // We also run the local fallback cleaner
    return await this.fallbackLocal.deleteExpired(olderThanMinutes);
  }
}

/**
 * Storage Service Factory Singleton
 */
class StorageService {
  private provider: IStorageProvider;

  constructor() {
    const driver = config.storage.driver;
    if (driver === 's3' || driver === 'r2') {
      this.provider = new S3StorageProvider();
    } else {
      this.provider = new LocalStorageProvider();
    }
  }

  public getProvider(): IStorageProvider {
    return this.provider;
  }

  public generateKey(prefix: 'input' | 'output', jobId: string, fileName: string): string {
    const safeName = path.basename(fileName).replace(/[^a-zA-Z0-9._-]/g, '_');
    const randomHash = crypto.randomBytes(8).toString('hex');
    return `${prefix}/${jobId}/${randomHash}-${safeName}`;
  }
}

export const storageService = new StorageService();
export const storage = storageService.getProvider();
