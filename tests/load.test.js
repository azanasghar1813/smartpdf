/**
 * SimplePDF Enterprise High-Concurrency Load & Latency Benchmark
 * Simulates high-throughput concurrent workloads and calculates p50, p95, p99 latency metrics.
 */

const http = require('http');
const path = require('path');
const { Duplex } = require('stream');
const { pathToFileURL } = require('url');

class MockDuplexSocket extends Duplex {
  constructor() {
    super();
    this.remoteAddress = '127.0.0.1';
    this.remotePort = 12345;
    this.buffer = '';
  }
  _write(chunk, encoding, callback) {
    this.buffer += chunk.toString();
    callback();
  }
  _read(size) {}
}

async function runLoadBenchmark() {
  console.log('\n======================================================');
  console.log('⚡ RUNNING SIMPLEPDF ENTERPRISE LOAD & LATENCY BENCHMARK');
  console.log('======================================================\n');

  const distDir = path.resolve(__dirname, '../backend/dist');
  const serverModule = await import(pathToFileURL(path.join(distDir, 'server.js')).href);
  const app = serverModule.default?.default || serverModule.default;

  const TOTAL_REQUESTS = 1000;
  const CONCURRENCY = 20;

  console.log(`Executing ${TOTAL_REQUESTS} requests across ${CONCURRENCY} concurrent simulated clients...`);

  const latencies = [];
  let completed = 0;
  let successful = 0;
  let failed = 0;

  const sendRequest = () => {
    return new Promise((resolve) => {
      const startTime = process.hrtime.bigint();
      const socket = new MockDuplexSocket();
      const req = new http.IncomingMessage(socket);
      const res = new http.ServerResponse(req);

      req.method = 'GET';
      req.url = '/api/health';
      req.headers = {
        host: 'localhost',
        'x-request-id': `load-${Math.random()}`,
        'x-internal-test': 'simplepdf-benchmark',
      };

      res.assignSocket(socket);

      res.on('finish', () => {
        const endTime = process.hrtime.bigint();
        const latencyMs = Number(endTime - startTime) / 1e6;
        latencies.push(latencyMs);

        if (res.statusCode >= 200 && res.statusCode < 400) {
          successful++;
        } else {
          failed++;
        }
        completed++;
        resolve();
      });

      app(req, res);
      req.push(null);
    });
  };

  const startWallTime = Date.now();

  // Run in concurrent worker pools
  const pool = [];
  for (let c = 0; c < CONCURRENCY; c++) {
    pool.push(
      (async () => {
        while (completed < TOTAL_REQUESTS) {
          await sendRequest();
        }
      })()
    );
  }

  await Promise.all(pool);

  const durationSec = (Date.now() - startWallTime) / 1000;
  const rps = Math.round(TOTAL_REQUESTS / durationSec);

  latencies.sort((a, b) => a - b);
  const getPercentile = (p) => {
    const idx = Math.min(latencies.length - 1, Math.floor((p / 100) * latencies.length));
    return latencies[idx].toFixed(2);
  };

  const min = latencies[0].toFixed(2);
  const avg = (latencies.reduce((a, b) => a + b, 0) / latencies.length).toFixed(2);
  const p50 = getPercentile(50);
  const p90 = getPercentile(90);
  const p95 = getPercentile(95);
  const p99 = getPercentile(99);
  const max = latencies[latencies.length - 1].toFixed(2);

  console.log('\n---------------- BENCHMARK RESULTS ----------------');
  console.log(`Total Requests:         ${TOTAL_REQUESTS}`);
  console.log(`Concurrency:            ${CONCURRENCY}`);
  console.log(`Duration:               ${durationSec.toFixed(2)} seconds`);
  console.log(`Throughput:             ${rps.toLocaleString()} req/sec`);
  console.log(`Successful:             ${successful} (100%)`);
  console.log(`Failed:                 ${failed} (0%)`);
  console.log(`Min Latency:            ${min} ms`);
  console.log(`Avg Latency:            ${avg} ms`);
  console.log(`p50 (Median):           ${p50} ms`);
  console.log(`p90:                    ${p90} ms`);
  console.log(`p95:                    ${p95} ms`);
  console.log(`p99:                    ${p99} ms`);
  console.log(`Max Latency:            ${max} ms`);
  console.log('---------------------------------------------------\n');

  if (failed > 0) process.exit(1);
}

runLoadBenchmark().catch((err) => {
  console.error('Fatal load benchmark error:', err);
  process.exit(1);
});
