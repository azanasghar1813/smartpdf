# SimplePDF Security Architecture & Hardening Guide

SimplePDF adheres to strict defense-in-depth principles. Because a PDF platform processes user documents that may contain confidential, medical, financial, or personally identifiable information (PII), security is designed into every layer of the architecture.

---

## 1. OWASP Top 10 Defense Matrix

| OWASP Vulnerability | Threat Category | SimplePDF Engineered Mitigation |
|---|---|---|
| **A01: Broken Access Control** | Unauthorized document download | HMAC-SHA256 signed download tokens with 60-minute expiration. Database-level job ownership checks (`userId`). Private object keys with unguessable random 64-bit entropy prefixes. |
| **A02: Cryptographic Failures** | Exposed credentials or weak hashing | Passwords hashed using NIST-compliant `scrypt` with unique 16-byte random salts. Timing-safe comparison via `crypto.timingSafeEqual()`. HTTPS enforced in Nginx proxy. |
| **A03: Injection** | SQL, NoSQL & Command Injection | Strongly typed Prisma ORM parameterized queries. Zero shell execution (`child_process.exec` is strictly prohibited). Filenames sanitized to prevent command injection. |
| **A04: Insecure Design** | Denial of Service / Worker exhaustion | Resource-aware concurrency limits, sliding-window rate limiters, file size limits (50MB free / 200MB Pro), and queue backpressure (`503` when saturated). |
| **A05: Security Misconfiguration** | Information disclosure via stack traces | Centralized error handler masks internal stack traces and server paths in production mode. Helmet security headers enforced globally. |
| **A06: Vulnerable Components** | Outdated or malicious dependencies | Automated secret audits (`npm run test:secrets`). Zero unnecessary external packages. Minimal native standard library usage for cryptography and streaming. |
| **A07: Identification & Auth Failures** | Session hijacking & credential stuffing | Stateless RFC 7519 JWT with timing-safe signature verification. Password hashes are automatically stripped from all API response payloads. |
| **A08: Software & Data Integrity** | Disguised malware / polyglot payloads | Deep-packet binary magic byte inspection before processing. Executables (MZ headers) disguised as PDFs are rejected and deleted immediately. |
| **A09: Logging & Monitoring Failures** | Unaudited intrusion attempts | Structured JSON logging with unique `X-Request-ID` across every HTTP request and worker job. Automated alerting on worker crash loops. |
| **A10: Server-Side Request Forgery** | Internal metadata access | `ssrfGuard` middleware rejects all loopback addresses (`127.0.0.1`, `localhost`), RFC 1918 private subnets, and cloud metadata IPs (`169.254.169.254`). |

---

## 2. Authentication & Cryptographic Hashing

### Password Hashing (NIST SP 800-63B Compliant)
SimplePDF implements `node:crypto.scrypt` with parameters tuned for brute-force resistance:
- **Salt:** 16 bytes of cryptographically secure pseudorandom entropy (`crypto.randomBytes(16)`).
- **Key Length:** 64 bytes (512 bits).
- **Storage Format:** `scrypt:<salt_hex>:<derived_key_hex>`
- **Timing-Attack Resistance:** Password verification executes constant-time byte comparisons via `crypto.timingSafeEqual()`, completely preventing timing-based side-channel attacks.

### JSON Web Tokens (JWT)
- **Algorithm:** HMAC-SHA256 (`HS256`).
- **Signature Verification:** Constant-time verification of signature segments.
- **Claims Verification:** Automatic expiration (`exp`) and issuer (`iss`) validation.
- **Secret Enforcement:** Production mode strictly refuses to start if `JWT_SECRET` is unset or contains default development values.

---

## 3. Upload & File Hardening

### A. Deep Magic Byte Inspection
File extensions are untrustworthy. Before any file enters the processing pipeline, the `validateMimeMagicBytes` middleware reads the first 8 bytes from disk:
- **PDF:** Must begin with `%PDF-` (`0x25 0x50 0x44 0x46`).
- **Office / ZIP:** Must begin with `PK..` (`0x50 0x4B 0x03 0x04`).
- **Images:** Validated for JPEG (`0xFF 0xD8 0xFF`) and PNG (`0x89 0x50 0x4E 0x47`).
- **Malware Defense:** Executable binaries (Windows PE `0x4D 0x5A` or ELF `0x7F 0x45 0x4C 0x46`) renamed to `.pdf` are immediately rejected with `HTTP 400` and unlinked from disk.

### B. Directory Traversal Defense
The `LocalStorageProvider` verifies that every storage key resolves strictly within the designated storage root:
```typescript
const safeKey = key.replace(/(\.\.[\/\\])+/g, '').replace(/^[\\\/]+/, '');
const fullPath = path.resolve(this.baseDir, safeKey);
if (!fullPath.startsWith(path.resolve(this.baseDir))) {
  throw new Error(`Directory traversal detected: ${key}`);
}
```

---

## 4. Network & SSRF Defenses

### Server-Side Request Forgery (`ssrfGuard`)
The `ssrfGuard` middleware protects external URL conversion endpoints (e.g. `html-to-pdf`) by validating targets against a strict denylist:
- Loopback: `127.0.0.1`, `localhost`, `0.0.0.0`, `::1`.
- RFC 1918 Private Ranges: `10.0.0.0/8`, `172.16.0.0/12`, `192.168.0.0/16`.
- Cloud Metadata Services: `169.254.169.254`, `metadata.google.internal`, `instance-data`.
- Protocol Enforcement: Strictly `http:` and `https:` (blocks `file://`, `gopher://`, `dict://`).

### Cross-Origin Resource Sharing (CORS)
- In development, localhost origins are permitted.
- In production, wildcards (`*`) are disallowed. Origins must match `CORS_ALLOWED_ORIGINS` explicitly.

### Security Headers (Helmet Compliant)
Every HTTP response includes:
```http
Content-Security-Policy: default-src 'self'; script-src 'self' 'unsafe-inline' https://pagead2.googlesyndication.com; img-src 'self' data: https:;
X-Content-Type-Options: nosniff
X-Frame-Options: SAMEORIGIN
Referrer-Policy: strict-origin-when-cross-origin
Strict-Transport-Security: max-age=31536000; includeSubDomains; preload
Cache-Control: private, no-cache, no-store, must-revalidate
```

---

## 5. Ephemeral File Zero-Filling & Shredding

To guarantee zero data persistence of confidential documents:
1. Every 15 minutes, `CleanupWorker` identifies files with `mtime` older than 60 minutes.
2. Rather than a simple OS `unlink()`, the file is overwritten with zero-bytes (`0x00`) to destroy the magnetic/flash footprint before calling `fs.unlinkSync()`.
3. Metrics record the total purge count without retaining filenames or file contents.

---

## 6. Automated Secret Scanning

SimplePDF includes a continuous automated secret scanner (`scripts/audit-secrets.js`) modeled after Gitleaks. It scans all application source files, scripts, and configurations for:
- AWS, GCP, and Cloudflare credentials
- Private RSA/EC keys and certificate files
- JWT secrets and database connection strings
- High-entropy password strings

Run the scan anytime with:
```bash
npm run test:secrets
```
