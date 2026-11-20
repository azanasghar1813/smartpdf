import { Request, Response, NextFunction } from 'express';
import { URL } from 'url';

/**
 * Checks if a hostname or IP belongs to loopback, private intranet, or cloud metadata ranges.
 */
export function isPrivateOrInternalHost(hostOrIp: string): boolean {
  const host = hostOrIp.toLowerCase().trim();

  // Prohibited loopback & cloud metadata hostnames
  const blockedHosts = [
    'localhost',
    '127.0.0.1',
    '0.0.0.0',
    '::1',
    '169.254.169.254', // AWS/GCP/Azure link-local metadata
    'metadata.google.internal',
    'instance-data',
  ];

  if (blockedHosts.includes(host)) {
    return true;
  }

  // RFC 1918 Private subnets: 10.0.0.0/8, 172.16.0.0/12, 192.168.0.0/16
  if (
    host.startsWith('10.') ||
    host.startsWith('192.168.') ||
    /^172\.(1[6-9]|2[0-9]|3[0-1])\./.test(host) ||
    host.startsWith('169.254.')
  ) {
    return true;
  }

  return false;
}

/**
 * Server-Side Request Forgery (SSRF) Guard Express Middleware
 * Blocks access to localhost, private intranet ranges, and cloud metadata
 */
export function ssrfGuard(req: Request, res: Response, next: NextFunction) {
  const targetUrl = req.body?.url || req.query?.url;
  if (!targetUrl) return next();

  try {
    const parsed = new URL(String(targetUrl));

    // Enforce HTTP / HTTPS protocol only
    if (parsed.protocol !== 'http:' && parsed.protocol !== 'https:') {
      return res.status(400).json({
        error: 'Invalid protocol.',
        message: 'Only HTTP and HTTPS URLs are permitted.',
      });
    }

    const host = parsed.hostname.toLowerCase();

    if (isPrivateOrInternalHost(host)) {
      return res.status(403).json({
        error: 'Forbidden URL target.',
        message: 'Access to loopback, intranet or cloud metadata services is strictly prohibited.',
      });
    }

    next();
  } catch {
    return res.status(400).json({ error: 'Malformed URL provided.' });
  }
}
