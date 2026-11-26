import crypto from 'crypto';
import { Request, Response, NextFunction } from 'express';
import { config } from '../config/env';

export interface TokenPayload {
  userId: string;
  email: string;
  role: 'user' | 'admin';
  tier: 'free' | 'premium' | 'business';
  iat?: number;
  exp?: number;
  iss?: string;
}

export class AuthService {
  private jwtSecret: string;
  private expirySeconds: number;

  constructor() {
    this.jwtSecret = config.security.jwtSecret;
    this.expirySeconds = config.security.jwtExpirySeconds;
  }

  /**
   * NIST-compliant Scrypt Password Hashing with secure salt
   */
  public async hashPassword(password: string): Promise<string> {
    return new Promise((resolve, reject) => {
      const salt = crypto.randomBytes(16).toString('hex');
      crypto.scrypt(password, salt, 64, (err, derivedKey) => {
        if (err) return reject(err);
        resolve(`scrypt:${salt}:${derivedKey.toString('hex')}`);
      });
    });
  }

  /**
   * Timing-Safe Scrypt Password Verification
   */
  public async verifyPassword(password: string, storedHash: string): Promise<boolean> {
    return new Promise((resolve) => {
      if (!storedHash || !storedHash.startsWith('scrypt:')) {
        return resolve(false);
      }
      const parts = storedHash.split(':');
      if (parts.length !== 3) return resolve(false);

      const salt = parts[1];
      const keyHex = parts[2];
      const keyBuffer = Buffer.from(keyHex, 'hex');

      crypto.scrypt(password, salt, 64, (err, derivedKey) => {
        if (err) return resolve(false);
        try {
          const match = crypto.timingSafeEqual(keyBuffer, derivedKey);
          resolve(match);
        } catch {
          resolve(false);
        }
      });
    });
  }

  /**
   * Native RFC 7519 JSON Web Token (JWT) Generator (HMAC-SHA256)
   */
  public generateJwt(payload: Omit<TokenPayload, 'iat' | 'exp' | 'iss'>): string {
    const now = Math.floor(Date.now() / 1000);
    const fullPayload: TokenPayload = {
      ...payload,
      iat: now,
      exp: now + this.expirySeconds,
      iss: 'simplepdf-api',
    };

    const header = { alg: 'HS256', typ: 'JWT' };
    const encodedHeader = Buffer.from(JSON.stringify(header)).toString('base64url');
    const encodedPayload = Buffer.from(JSON.stringify(fullPayload)).toString('base64url');

    const signature = crypto
      .createHmac('sha256', this.jwtSecret)
      .update(`${encodedHeader}.${encodedPayload}`)
      .digest('base64url');

    return `${encodedHeader}.${encodedPayload}.${signature}`;
  }

  /**
   * Native JWT Verification with Timing-Safe Signature Validation
   */
  public verifyJwt(token: string): { valid: boolean; payload?: TokenPayload; error?: string } {
    if (!token || typeof token !== 'string') {
      return { valid: false, error: 'TOKEN_MISSING' };
    }

    const parts = token.split('.');
    if (parts.length !== 3) {
      return { valid: false, error: 'MALFORMED_TOKEN' };
    }

    const [encodedHeader, encodedPayload, signature] = parts;
    const expectedSig = crypto
      .createHmac('sha256', this.jwtSecret)
      .update(`${encodedHeader}.${encodedPayload}`)
      .digest('base64url');

    try {
      const sigMatch = crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(expectedSig));
      if (!sigMatch) {
        return { valid: false, error: 'INVALID_SIGNATURE' };
      }
    } catch {
      return { valid: false, error: 'INVALID_SIGNATURE' };
    }

    try {
      const payload: TokenPayload = JSON.parse(Buffer.from(encodedPayload, 'base64url').toString('utf8'));
      const now = Math.floor(Date.now() / 1000);

      if (payload.exp && now > payload.exp) {
        return { valid: false, error: 'TOKEN_EXPIRED' };
      }

      return { valid: true, payload };
    } catch {
      return { valid: false, error: 'PAYLOAD_DECODE_ERROR' };
    }
  }

  /**
   * Webhook Signature Verifier (Stripe / LemonSqueezy standard format)
   */
  public verifyWebhookSignature(payload: string | Buffer, signatureHeader: string, secret?: string): boolean {
    const webhookSecret = secret || config.security.paymentWebhookSecret;
    if (!signatureHeader || !webhookSecret) return false;

    // Handles format: t=1234567,v1=signature or raw hex signature
    let timestamp = '';
    let expectedSig = '';

    if (signatureHeader.includes('v1=')) {
      const parts = signatureHeader.split(',');
      for (const p of parts) {
        const [k, v] = p.split('=');
        if (k === 't') timestamp = v;
        if (k === 'v1') expectedSig = v;
      }
    } else {
      expectedSig = signatureHeader;
    }

    const signedPayload = timestamp ? `${timestamp}.${payload.toString()}` : payload.toString();
    const computedSig = crypto.createHmac('sha256', webhookSecret).update(signedPayload).digest('hex');

    try {
      return crypto.timingSafeEqual(Buffer.from(expectedSig, 'hex'), Buffer.from(computedSig, 'hex'));
    } catch {
      return false;
    }
  }
}

export const authService = new AuthService();

/**
 * Express Middleware to require authentication
 */
export function requireAuth(req: Request, res: Response, next: NextFunction) {
  let token = '';
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith('Bearer ')) {
    token = authHeader.split(' ')[1];
  } else if (req.headers.cookie) {
    const match = req.headers.cookie.match(/(?:^|;\s*)simplepdf_token=([^;]+)/);
    if (match) token = decodeURIComponent(match[1]);
  }

  if (!token) {
    return res.status(401).json({ error: 'Missing or invalid Authorization token.' });
  }

  const verified = authService.verifyJwt(token);

  if (!verified.valid || !verified.payload) {
    return res.status(401).json({ error: 'Authentication token is invalid or expired.', code: verified.error });
  }

  (req as any).user = verified.payload;
  next();
}

/**
 * Express Middleware to require administrator privileges
 */
export function requireAdmin(req: Request, res: Response, next: NextFunction) {
  const user = (req as any).user as TokenPayload | undefined;
  if (!user || user.role !== 'admin') {
    return res.status(403).json({ error: 'Access denied: Administrator privileges required.' });
  }
  next();
}
