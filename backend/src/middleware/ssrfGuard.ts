import { Request, Response, NextFunction } from 'express';
import { URL } from 'url';
import dns from 'dns';

/**
 * Checks if a hostname or IP belongs to loopback, private intranet, or cloud metadata ranges.
 * Supports IPv4, IPv6, decimal notation, and RFC 1918/RFC 4193 subnets.
 */
export function isPrivateOrInternalHost(hostOrIp: string): boolean {
  let host = hostOrIp.toLowerCase().trim();

  // Strip brackets from IPv6 (e.g. [::1])
  if (host.startsWith('[') && host.endsWith(']')) {
    host = host.slice(1, -1);
  }

  // Prohibited loopback & cloud metadata hostnames
  const blockedHosts = [
    'localhost',
    '127.0.0.1',
    '0.0.0.0',
    '::1',
    '::',
    '169.254.169.254', // AWS/GCP/Azure link-local metadata
    'metadata.google.internal',
    'instance-data',
  ];

  if (blockedHosts.includes(host)) {
    return true;
  }

  // IPv6 loopback, link-local (fe80::/10), and unique local (fc00::/7)
  if (
    host === '::1' ||
    host.startsWith('fe80:') ||
    host.startsWith('fc') ||
    host.startsWith('fd') ||
    host.startsWith('::ffff:127.') ||
    host.startsWith('::ffff:10.') ||
    host.startsWith('::ffff:192.168.')
  ) {
    return true;
  }

  // Check numeric decimal IP (e.g. 2130706433 which converts to 127.0.0.1)
  if (/^\d+$/.test(host)) {
    const num = Number(host);
    if (!isNaN(num) && num > 0 && num <= 4294967295) {
      const b1 = (num >>> 24) & 255;
      const b2 = (num >>> 16) & 255;
      if (b1 === 127 || b1 === 10 || (b1 === 172 && b2 >= 16 && b2 <= 31) || (b1 === 192 && b2 === 168) || (b1 === 169 && b2 === 254)) {
        return true;
      }
    }
  }

  // RFC 1918 Private subnets: 10.0.0.0/8, 172.16.0.0/12, 192.168.0.0/16, 127.0.0.0/8, 169.254.0.0/16
  if (
    host.startsWith('10.') ||
    host.startsWith('127.') ||
    host.startsWith('192.168.') ||
    /^172\.(1[6-9]|2[0-9]|3[0-1])\./.test(host) ||
    host.startsWith('169.254.') ||
    host.startsWith('0.')
  ) {
    return true;
  }

  return false;
}

/**
 * Server-Side Request Forgery (SSRF) Guard Express Middleware
 * Blocks access to localhost, private intranet ranges, and cloud metadata with async DNS resolution.
 */
export async function ssrfGuard(req: Request, res: Response, next: NextFunction) {
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

    // Check hostname string directly first
    if (isPrivateOrInternalHost(host)) {
      return res.status(403).json({
        error: 'Forbidden URL target.',
        message: 'Access to loopback, intranet or cloud metadata services is strictly prohibited.',
      });
    }

    // Perform DNS lookup to resolve the destination IP and block private destinations
    try {
      const resolved = await dns.promises.lookup(host, { all: true });
      for (const entry of resolved) {
        if (isPrivateOrInternalHost(entry.address)) {
          return res.status(403).json({
            error: 'Forbidden destination IP.',
            message: 'Target resolves to a restricted private or internal IP address.',
          });
        }
      }
    } catch {
      // If DNS resolution fails, let request proceed or fail naturally at connection time
    }

    next();
  } catch {
    return res.status(400).json({ error: 'Malformed URL provided.' });
  }
}
