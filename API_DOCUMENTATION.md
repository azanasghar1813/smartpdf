# SimplePDF RESTful API v1 Documentation

The SimplePDF API provides programmatic access to document processing, user authentication, subscription billing, and AI document intelligence.

---

## 1. General Request Standards

- **Base URL:** `/api/v1`
- **Content Types:**
  - Standard API Calls: `application/json`
  - Document Uploads: `multipart/form-data`
- **Standard Request Headers:**
  - `Authorization`: `Bearer <jwt_token>` (for authenticated endpoints)
  - `X-Request-ID`: Optional UUID for end-to-end distributed tracing. If omitted, the server automatically assigns one.
  - `Idempotency-Key`: Optional unique token preventing duplicate job submissions.

---

## 2. Health & System Diagnostic Endpoints

### `GET /api/health`
**Description:** Liveness probe for load balancers and orchestrators.
**Response:** `200 OK`
```json
{
  "status": "healthy",
  "service": "SimplePDF Production Gateway",
  "timestamp": "2026-11-20T12:00:00.000Z",
  "uptimeSeconds": 3600,
  "nodeVersion": "v20.18.0",
  "memoryUsageMB": 82
}
```

### `GET /api/ready`
**Description:** Deep readiness probe verifying database connectivity, storage write capability, and Redis queue status.
**Response:** `200 OK` (or `503 Service Unavailable` if unready)
```json
{
  "status": "ready",
  "timestamp": "2026-11-20T12:00:00.000Z",
  "checks": {
    "database": "healthy",
    "storage": "writable",
    "redisQueue": "connected"
  }
}
```

---

## 3. Authentication Endpoints

### `POST /api/v1/auth/register`
**Description:** Register a new user account. Passwords hashed using scrypt.
**Request Body:**
```json
{
  "name": "Jane Doe",
  "email": "jane@example.com",
  "password": "StrongPassword123!"
}
```
**Response:** `201 Created`
```json
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "usr_9f81a7b2",
    "email": "jane@example.com",
    "name": "Jane Doe",
    "role": "user",
    "tier": "free",
    "usageToday": 0,
    "totalProcessed": 0,
    "createdAt": "2026-11-20T12:00:00.000Z"
  }
}
```

### `POST /api/v1/auth/login`
**Description:** Authenticate user credentials and return a signed JWT token.
**Request Body:**
```json
{
  "email": "jane@example.com",
  "password": "StrongPassword123!"
}
```
**Response:** `200 OK`

### `GET /api/v1/auth/me`
**Description:** Retrieve the authenticated user's profile and current subscription status.
**Headers:** `Authorization: Bearer <jwt_token>`
**Response:** `200 OK`

---

## 4. Document Processing & Job Endpoints

### `POST /api/v1/jobs/create`
**Description:** Submit a document conversion or processing job to the distributed queue.
**Content-Type:** `multipart/form-data`
**Form Fields:**
- `file`: Binary document file (PDF, Word `.docx`, Excel `.xlsx`, etc.)
- `toolId`: Tool identifier (e.g., `word-to-pdf`, `excel-to-pdf`, `repair-pdf`, `compress-pdf`)
- `options`: JSON string containing tool configuration (e.g. `{"level":"extreme"}`)
- `userEmail`: Optional submitter email

**Response:** `202 Accepted`
```json
{
  "success": true,
  "jobId": "23660603-a257-497d-afbf-fc17f8eb8ce2",
  "status": "queued",
  "message": "Job enqueued for background conversion."
}
```
*Note: If the system is under extreme load, this returns `503 SERVICE_TEMPORARILY_OVERLOADED`.*

### `GET /api/v1/jobs/:jobId/status`
**Description:** Poll real-time progress and status of a processing job.
**Response:** `200 OK`
```json
{
  "id": "23660603-a257-497d-afbf-fc17f8eb8ce2",
  "toolId": "repair-pdf",
  "status": "completed",
  "progress": 100,
  "fileName": "damaged_annual_report.pdf",
  "fileSize": 1048576,
  "resultFileName": "damaged_annual_report_repaired.pdf",
  "downloadUrl": "/api/v1/download/23660603-a257-497d-afbf-fc17f8eb8ce2",
  "error": null,
  "createdAt": 1732104000000
}
```

### `GET /api/v1/download/:jobId`
**Description:** Download the converted or repaired document. Streams directly or redirects to a presigned S3/R2 URL.
**Response:** `200 OK` (Binary stream with `Content-Disposition: attachment; filename="..."`)

### `GET /api/v1/download/signed`
**Description:** Secure direct download token verification.
**Query Parameters:**
- `key`: Storage object key
- `exp`: UNIX expiration timestamp
- `sig`: HMAC-SHA256 signature
- `fn`: Optional override download filename
**Response:** `200 OK` (Streamed file) or `403 Forbidden` (Invalid/expired token)

### `GET /api/v1/metrics`
**Description:** Retrieve public platform transparency metrics.
**Response:** `200 OK`
```json
{
  "totalProcessedJobs": 128450,
  "activeJobsInQueue": 3,
  "edgeBandwidthSavedGB": 4520,
  "ephemeralFilesPurgedToday": 1420,
  "registeredUsersCount": 18200,
  "successRate": "99.8%"
}
```

---

## 5. AI Document Intelligence Endpoints

### `POST /api/v1/ai/summarize`
**Description:** Generate AI summaries from document text.
**Request Body:**
```json
{
  "text": "Full text of document extracted via PDF parser...",
  "type": "detailed"
}
```
**Response:** `200 OK`
```json
{
  "summary": "Executive summary with key findings and action items...",
  "wordCount": 185
}
```

### `POST /api/v1/ai/translate`
**Description:** Translate document text into 20+ supported target languages.
**Request Body:**
```json
{
  "text": "Document text to translate...",
  "targetLanguage": "Spanish"
}
```
**Response:** `200 OK`
```json
{
  "translatedText": "Texto traducido...",
  "targetLanguage": "Spanish"
}
```

---

## 6. Payment & Webhook Endpoints

### `POST /api/v1/payment/checkout`
**Description:** Create a Stripe/LemonSqueezy checkout session for Pro/Business tiers.
**Request Body:** `{"tier": "premium", "userId": "usr_9f81a7b2"}`
**Response:** `200 OK` (`{"success": true, "checkoutUrl": "..."}`)

### `POST /api/v1/payment/webhook`
**Description:** Incoming payment provider webhook with HMAC-SHA256 signature verification.
**Headers:** `stripe-signature` or `x-signature`
**Response:** `200 OK` (`{"received": true}`)

---

## 7. Error Code Reference

| HTTP Code | Error Constant | Explanation |
|---|---|---|
| `400` | `INVALID_PAYLOAD` | Request body failed schema validation or bad magic bytes. |
| `401` | `UNAUTHORIZED` | Missing, expired, or tampered JWT token. |
| `403` | `FORBIDDEN` | SSRF guard blocked forbidden target IP, or signed token invalid. |
| `404` | `NOT_FOUND` | Job expired from ephemeral storage or does not exist. |
| `429` | `TOO_MANY_REQUESTS`| Sliding-window rate limit exceeded. Check `Retry-After` header. |
| `503` | `QUEUE_CAPACITY_EXCEEDED`| Server conversion capacity saturated. Retry shortly. |
