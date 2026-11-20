/**
 * SimplePDF Enterprise Reliability, Observability & Health Test Suite
 * Validates health/readiness probes, resource monitoring, and ephemeral storage lifecycle.
 */

const assert = require('assert');
const path = require('path');
const fs = require('fs');
const { pathToFileURL } = require('url');

async function runReliabilityTests() {
  console.log('\n======================================================');
  console.log('🔄 RUNNING SIMPLEPDF RELIABILITY & HEALTH TEST SUITE');
  console.log('======================================================\n');

  let passed = 0;
  let failed = 0;

  const distDir = path.resolve(__dirname, '../backend/dist');
  const { resourceMonitor } = await import(pathToFileURL(path.join(distDir, 'services/resourceMonitor.js')).href);
  const { dbRepository } = await import(pathToFileURL(path.join(distDir, 'database/repository.js')).href);
  const { storage } = await import(pathToFileURL(path.join(distDir, 'storage/storageProvider.js')).href);
  const { cleanupQueue } = await import(pathToFileURL(path.join(distDir, 'queues/cleanup.queue.js')).href);

  // Test 1: Database Health Check
  try {
    const isDbHealthy = await dbRepository.checkHealth();
    assert.strictEqual(isDbHealthy, true, 'Database repository must report healthy');
    console.log('✅ Test 1 Passed: Database repository connectivity health check verified.');
    passed++;
  } catch (e) {
    console.error('❌ Test 1 Failed:', e.message);
    failed++;
  }

  // Test 2: Storage Probe (Read/Write verification)
  try {
    const probeKey = `health/.probe_${Date.now()}`;
    await storage.upload(probeKey, Buffer.from('reliability-probe'));
    const exists = await storage.exists(probeKey);
    assert.strictEqual(exists, true, 'Storage write probe should succeed');
    await storage.delete(probeKey);
    console.log('✅ Test 2 Passed: Storage readiness read/write probe verified.');
    passed++;
  } catch (e) {
    console.error('❌ Test 2 Failed:', e.message);
    failed++;
  }

  // Test 3: Resource Monitor System Telemetry
  try {
    const metrics = resourceMonitor.getSystemMetrics();
    assert(metrics.totalMemBytes > 0, 'Total memory must be positive');
    assert(metrics.freeMemBytes > 0, 'Free memory must be positive');
    assert(metrics.recommendedConcurrency >= 1, 'Recommended concurrency should be at least 1');
    assert.strictEqual(typeof metrics.isOverloaded, 'boolean', 'isOverloaded must be boolean');

    const canAccept = resourceMonitor.canAcceptNewJob();
    assert.strictEqual(typeof canAccept, 'boolean', 'canAcceptNewJob must return boolean');
    console.log(`✅ Test 3 Passed: Resource monitor telemetry verified (RAM: ${metrics.freeMemPercent}% free, Concurrency: ${metrics.recommendedConcurrency}).`);
    passed++;
  } catch (e) {
    console.error('❌ Test 3 Failed:', e.message);
    failed++;
  }

  // Test 4: Ephemeral Storage Cleanup Queue
  try {
    const result = await cleanupQueue.triggerCleanup();
    assert.strictEqual(typeof result.purgedCount, 'number', 'Purged count must be a number');
    console.log(`✅ Test 4 Passed: Ephemeral lifecycle cleanup cycle executed cleanly (${result.purgedCount} purged).`);
    passed++;
  } catch (e) {
    console.error('❌ Test 4 Failed:', e.message);
    failed++;
  }

  console.log(`\nReliability Test Results: ${passed} Passed, ${failed} Failed.`);
  if (failed > 0) process.exit(1);
}

runReliabilityTests().catch((err) => {
  console.error('Fatal reliability test suite error:', err);
  process.exit(1);
});
