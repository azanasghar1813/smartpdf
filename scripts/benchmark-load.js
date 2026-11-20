import http from 'http';
import path from 'path';
import { fileURLToPath, pathToFileURL } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Import Express app
const serverUrl = pathToFileURL(path.resolve(__dirname, '../backend/dist/server.js')).href;
const serverModule = await import(serverUrl);
const app = serverModule.default || serverModule;

async function runLoadBenchmark({ name, path: reqPath, method = 'GET', body = null, connections = 50, durationSec = 3 }) {
  return new Promise((resolve) => {
    const server = http.createServer(app);
    server.listen(0, '127.0.0.1', async () => {
      const { port } = server.address();
      const baseUrl = `http://127.0.0.1:${port}`;

      console.log(`\n==================================================`);
      console.log(`🚀 [LOAD BENCHMARK] ${name}`);
      console.log(`Target: ${method} ${baseUrl}${reqPath}`);
      console.log(`Concurrency: ${connections} concurrent connections | Duration: ${durationSec}s`);
      console.log(`==================================================`);

      let totalRequests = 0;
      let successfulRequests = 0;
      let failedRequests = 0;
      const latencies = [];
      const startTime = Date.now();
      const endTime = startTime + durationSec * 1000;
      let activeConnections = 0;

      function sendRequest() {
        if (Date.now() >= endTime) return;

        const reqStart = process.hrtime.bigint();
        const url = new URL(reqPath, baseUrl);

        const options = {
          hostname: url.hostname,
          port: url.port,
          path: url.pathname + url.search,
          method,
          headers: {
            'Content-Type': 'application/json',
            'Connection': 'keep-alive',
          },
        };

        const req = http.request(options, (res) => {
          res.on('data', () => {});
          res.on('end', () => {
            const reqEnd = process.hrtime.bigint();
            const latencyMs = Number(reqEnd - reqStart) / 1e6;
            latencies.push(latencyMs);
            totalRequests++;
            if (res.statusCode >= 200 && res.statusCode < 400) {
              successfulRequests++;
            } else {
              failedRequests++;
            }
            if (Date.now() < endTime) {
              setImmediate(sendRequest);
            }
          });
        });

        req.on('error', () => {
          failedRequests++;
          totalRequests++;
          if (Date.now() < endTime) {
            setImmediate(sendRequest);
          }
        });

        if (body) {
          req.write(JSON.stringify(body));
        }
        req.end();
      }

      // Launch concurrent workers
      for (let i = 0; i < connections; i++) {
        sendRequest();
      }

      // Wait for test duration
      await new Promise((r) => setTimeout(r, durationSec * 1000 + 500));

      server.close();

      latencies.sort((a, b) => a - b);
      const totalTimeSec = (Date.now() - startTime) / 1000;
      const rps = Math.round(totalRequests / totalTimeSec);
      const avgLatency = (latencies.reduce((a, b) => a + b, 0) / (latencies.length || 1)).toFixed(2);
      const minLatency = latencies[0]?.toFixed(2) || '0.00';
      const p50 = latencies[Math.floor(latencies.length * 0.5)]?.toFixed(2) || '0.00';
      const p90 = latencies[Math.floor(latencies.length * 0.9)]?.toFixed(2) || '0.00';
      const p95 = latencies[Math.floor(latencies.length * 0.95)]?.toFixed(2) || '0.00';
      const p99 = latencies[Math.floor(latencies.length * 0.99)]?.toFixed(2) || '0.00';
      const maxLatency = latencies[latencies.length - 1]?.toFixed(2) || '0.00';

      console.log(`📊 Benchmark Results for: ${name}`);
      console.log(`   Total Requests: ${totalRequests.toLocaleString()}`);
      console.log(`   Throughput:     ${rps.toLocaleString()} req/sec`);
      console.log(`   Success Rate:   ${((successfulRequests / (totalRequests || 1)) * 100).toFixed(1)}% (${successfulRequests} ok / ${failedRequests} failed)`);
      console.log(`   Latencies (ms): Min: ${minLatency}ms | Avg: ${avgLatency}ms | p50: ${p50}ms | p90: ${p90}ms | p95: ${p95}ms | p99: ${p99}ms | Max: ${maxLatency}ms`);

      resolve({ name, totalRequests, rps, avgLatency, p50, p90, p99, failedRequests });
    });
  });
}

console.log('⚡ Starting Scalability & Autocannon-Equivalent High-Concurrency Load Audit...\n');

// 1. Health Probe Endpoint under heavy load
await runLoadBenchmark({
  name: 'API Health Probe [GET /api/health]',
  path: '/api/health',
  method: 'GET',
  connections: 50,
  durationSec: 3,
});

// 2. High-Concurrency Auth Profile Retrieval
await runLoadBenchmark({
  name: 'Auth Current User [GET /api/auth/current]',
  path: '/api/auth/current?email=admin@simplepdf.com',
  method: 'GET',
  connections: 50,
  durationSec: 3,
});

// 3. High-Concurrency Login Transactions
await runLoadBenchmark({
  name: 'Auth Login Transaction [POST /api/auth/login]',
  path: '/api/auth/login',
  method: 'POST',
  body: { email: 'admin@simplepdf.com' },
  connections: 50,
  durationSec: 3,
});

console.log('\n✅ All load benchmarks finished successfully.');
process.exit(0);
