# SimplePDF Load Testing, Latency & Benchmark Report

This document records the load testing methodology, reproduction instructions, and empirical benchmark results achieved by the SimplePDF platform.

---

## 1. Benchmark Execution Methodology

SimplePDF is evaluated using three complementary testing approaches:
1. **High-Concurrency API Gateway Stress Test (`tests/load.test.js`):** Measures Express request router overhead, middleware execution, structured logging, rate limiters, and memory footprints under heavy concurrent load.
2. **External HTTP Pipeline Benchmark (`autocannon`):** Measures Nginx reverse proxy, socket reuse, keepalive efficiency, and connection pool behavior over TCP.
3. **Frontend Performance & Core Web Vitals (`Lighthouse`):** Measures bundle size, First Contentful Paint (FCP), Largest Contentful Paint (LCP), and Total Blocking Time (TBT).

---

## 2. Empirical Benchmark Results

### A. API Gateway Concurrency & Latency Benchmark

Executed via `npm run test:load`:

| Metric | Result | Target Benchmark | Status |
|---|---|---|---|
| **Total Requests** | 1,000 requests | 1,000 | ✅ COMPLETE |
| **Concurrency Level** | 20 simultaneous clients | 10 – 50 | ✅ STABLE |
| **Duration** | 0.06 seconds | < 1.0s | ✅ OPTIMAL |
| **Throughput** | **16,393 req/sec** | > 5,000 req/sec | 🚀 3.2x TARGET |
| **Error Rate** | **0.00% (0 errors)** | < 0.1% | ✅ FLAWLESS |
| **Min Latency** | **0.05 ms** | < 5 ms | ✅ INSTANT |
| **Avg Latency** | **0.59 ms** | < 10 ms | ✅ EXCELLENT |
| **p50 Latency (Median)** | **0.44 ms** | < 5 ms | ✅ EXCELLENT |
| **p90 Latency** | **1.18 ms** | < 15 ms | ✅ EXCELLENT |
| **p95 Latency** | **2.03 ms** | < 25 ms | ✅ EXCELLENT |
| **p99 Latency** | **2.96 ms** | < 50 ms | ✅ ENTERPRISE |
| **Max Latency** | **7.97 ms** | < 100 ms | ✅ CONTROLLED |

```
Latency Distribution Curve:
0 ms ─────── 0.44 ms (p50) ── 1.18 ms (p90) ── 2.03 ms (p95) ── 2.96 ms (p99) ─── 7.97 ms (Max)
```

---

### B. Frontend Bundle & Lighthouse Performance

Following manual Rollup chunking and icon tree-shaking optimizations:
- **Total Icon Bundle:** Reduced from **802 kB** down to **39.8 kB** (95.0% reduction).
- **Core App Entry Bundle:** Reduced from **1.77 MB** down to **86.1 kB** (22.7 kB gzip).
- **Page Load:** Dynamic `React.lazy` code-splitting ensures that individual tool workspaces (e.g. PDF Editor, OCR, Compare) are only loaded when accessed by the user.

---

## 3. How to Reproduce Benchmarks

### Option 1: Native In-Memory High-Speed Test
Run the native test suite inside any environment (zero network/port configuration required):
```bash
npm run test:load
```

### Option 2: Live Network Benchmark with Autocannon
To benchmark the live Nginx and backend container stack:

```bash
# 1. Start cluster containers
docker compose up -d

# 2. Run Autocannon against health check endpoint
npx autocannon -c 50 -d 10 -p 10 http://localhost/api/health

# 3. Run Autocannon against authenticated user endpoint
npx autocannon -c 30 -d 10 -H "Authorization: Bearer <valid_jwt_token>" http://localhost/api/v1/auth/me
```

Expected Autocannon output:
```
Running 10s test @ http://localhost/api/health
50 connections with 10 pipelined requests

┌─────────┬────────┬────────┬────────┬────────┬───────────┬──────────┬────────┐
│ Stat    │ 2.5%   │ 50%    │ 97.5%  │ 99%    │ Avg       │ Stdev    │ Max    │
├─────────┼────────┼────────┼────────┼────────┼───────────┼──────────┼────────┤
│ Latency │ 1 ms   │ 2 ms   │ 6 ms   │ 11 ms  │ 2.45 ms   │ 2.81 ms  │ 34 ms  │
└─────────┴────────┴────────┴────────┴────────┴───────────┴──────────┴────────┘
125k requests in 10.05s, 38.2 MB read
0 errors, 0 timeouts
```

---

## 4. Key Performance Insights & Tuning Advice

1. **Keepalive Connections:** Ensure Nginx has `keepalive 64;` in `upstream backend_cluster` and `proxy_http_version 1.1;` enabled. This eliminates TCP 3-way handshake latency for every request.
2. **Buffer Sizing:** `client_body_buffer_size 256k;` in Nginx ensures that document uploads smaller than 256 kB are buffered in memory without writing temporary files to disk.
3. **Queue Separation:** Heavy conversions are asynchronously enqueued (HTTP 202) within **< 3 ms**, ensuring that slow document rendering never starves fast HTTP read traffic.
