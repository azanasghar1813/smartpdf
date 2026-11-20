import { Duplex } from 'stream';
import http from 'http';
import path from 'path';
import { fileURLToPath, pathToFileURL } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const serverUrl = pathToFileURL(path.resolve(__dirname, '../backend/dist/server.js')).href;
const serverModule = await import(serverUrl);
const app = serverModule.default?.default || serverModule.default || serverModule;

class MockSocket extends Duplex {
  constructor() {
    super();
    this.buffer = [];
  }
  _write(chunk, encoding, callback) {
    this.buffer.push(chunk);
    callback();
  }
  _read(size) {}
}

async function benchmarkEndpoint({ name, method = 'GET', url = '/api/health', body = null, totalRequests = 2000 }) {
  console.log(`\n==================================================`);
  console.log(`⚡ [IN-MEMORY BENCHMARK] ${name}`);
  console.log(`Endpoint: ${method} ${url} | Volume: ${totalRequests} requests`);
  console.log(`==================================================`);

  const latencies = [];
  let successful = 0;
  let failed = 0;

  const startTotal = process.hrtime.bigint();

  for (let i = 0; i < totalRequests; i++) {
    const reqStart = process.hrtime.bigint();
    await new Promise((resolve) => {
      const socket = new MockSocket();
      const req = new http.IncomingMessage(socket);
      req.method = method;
      req.url = url;

      const bodyStr = body ? JSON.stringify(body) : null;
      req.headers = {
        'host': 'localhost',
        'content-type': 'application/json',
        'x-internal-test': 'simplepdf-benchmark',
      };
      if (bodyStr) {
        req.headers['content-length'] = Buffer.byteLength(bodyStr).toString();
      }

      const res = new http.ServerResponse(req);
      res.assignSocket(socket);

      res.on('finish', () => {
        const reqEnd = process.hrtime.bigint();
        const latencyMs = Number(reqEnd - reqStart) / 1e6;
        latencies.push(latencyMs);

        if (res.statusCode >= 200 && res.statusCode < 400) {
          successful++;
        } else {
          failed++;
        }
        resolve();
      });

      if (bodyStr) {
        req.push(bodyStr);
      }
      req.push(null);

      // Pass request to Express app
      app(req, res);
    });
  }

  const endTotal = process.hrtime.bigint();
  const totalDurationSec = Number(endTotal - startTotal) / 1e9;
  latencies.sort((a, b) => a - b);

  const rps = Math.round(totalRequests / totalDurationSec);
  const avg = (latencies.reduce((a, b) => a + b, 0) / latencies.length).toFixed(3);
  const min = latencies[0].toFixed(3);
  const p50 = latencies[Math.floor(latencies.length * 0.5)].toFixed(3);
  const p95 = latencies[Math.floor(latencies.length * 0.95)].toFixed(3);
  const p99 = latencies[Math.floor(latencies.length * 0.99)].toFixed(3);
  const max = latencies[latencies.length - 1].toFixed(3);

  console.log(`📊 Benchmark Results for: ${name}`);
  console.log(`   Requests:   ${totalRequests} total`);
  console.log(`   Throughput: ${rps.toLocaleString()} ops/sec`);
  console.log(`   Success:    ${((successful / totalRequests) * 100).toFixed(1)}% (${successful} ok / ${failed} fail)`);
  console.log(`   Latency:    Min: ${min}ms | Avg: ${avg}ms | p50: ${p50}ms | p95: ${p95}ms | p99: ${p99}ms | Max: ${max}ms`);
}

console.log('🏁 Commencing Ultra-High Performance Express Core Pipeline Benchmark...\n');

// 1. Health Probe
await benchmarkEndpoint({
  name: 'API Health Probe [GET /api/health]',
  method: 'GET',
  url: '/api/health',
  totalRequests: 3000,
});

// 2. Auth User Query
await benchmarkEndpoint({
  name: 'Auth Current User Query [GET /api/v1/auth/me]',
  method: 'GET',
  url: '/api/v1/auth/me?email=admin@simplepdf.com',
  totalRequests: 3000,
});

// 3. Auth Login Route
await benchmarkEndpoint({
  name: 'Auth Login Transaction [POST /api/v1/auth/login]',
  method: 'POST',
  url: '/api/v1/auth/login',
  body: { email: 'admin@simplepdf.com' },
  totalRequests: 2000,
});

console.log('\n✅ Core Engine In-Memory Benchmarks completed successfully.');
process.exit(0);
