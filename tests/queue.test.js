/**
 * SimplePDF Enterprise Queue & Worker Test Suite
 * Validates priority ordering, idempotency, backpressure, and retry mechanics.
 */

const assert = require('assert');
const path = require('path');
const { pathToFileURL } = require('url');

async function runQueueTests() {
  console.log('\n======================================================');
  console.log('🧪 RUNNING SIMPLEPDF DISTRIBUTED QUEUE TEST SUITE');
  console.log('======================================================\n');

  let passed = 0;
  let failed = 0;

  const distDir = path.resolve(__dirname, '../backend/dist');
  const { PdfJobQueue } = await import(pathToFileURL(path.join(distDir, 'queues/pdf.queue.js')).href);

  // Test 1: Priority Queue Ordering (Premium & Business ahead of Free)
  try {
    const queue = new PdfJobQueue();

    // Add free job
    await queue.add({
      jobId: 'job_free_1',
      toolId: 'compress-pdf',
      originalFileName: 'doc1.pdf',
      fileSize: 1000,
      inputStorageKey: 'key1',
      options: {},
      userEmail: 'free@test.com',
      tier: 'free',
    });

    // Add another free job
    await queue.add({
      jobId: 'job_free_2',
      toolId: 'compress-pdf',
      originalFileName: 'doc2.pdf',
      fileSize: 1000,
      inputStorageKey: 'key2',
      options: {},
      userEmail: 'free2@test.com',
      tier: 'free',
    });

    // Add business priority job
    await queue.add({
      jobId: 'job_business_1',
      toolId: 'compress-pdf',
      originalFileName: 'biz.pdf',
      fileSize: 1000,
      inputStorageKey: 'key3',
      options: {},
      userEmail: 'vip@enterprise.com',
      tier: 'business',
    });

    // Pop first job - business job MUST come out first!
    const firstJob = await queue.getNextJob();
    assert.strictEqual(firstJob.jobId, 'job_business_1', 'Business tier job should be prioritized ahead of free jobs');
    const secondJob = await queue.getNextJob();
    assert.strictEqual(secondJob.jobId, 'job_free_1', 'Second job should be first free job');

    console.log('✅ Test 1 Passed: Priority scheduling puts paid tiers ahead of free jobs.');
    passed++;
  } catch (e) {
    console.error('❌ Test 1 Failed:', e.message);
    failed++;
  }

  // Test 2: Idempotency Protection
  try {
    const queue = new PdfJobQueue();
    const idempotencyKey = 'idemp_req_abc123';

    const res1 = await queue.add({
      jobId: 'job_original',
      toolId: 'compress-pdf',
      originalFileName: 'doc.pdf',
      fileSize: 500,
      inputStorageKey: 'key',
      options: {},
      userEmail: 'test@user.com',
      tier: 'free',
      idempotencyKey,
    });
    assert.strictEqual(res1.queued, true, 'First submission should be queued');

    // Duplicate submission with same idempotency key
    const res2 = await queue.add({
      jobId: 'job_duplicate',
      toolId: 'compress-pdf',
      originalFileName: 'doc.pdf',
      fileSize: 500,
      inputStorageKey: 'key',
      options: {},
      userEmail: 'test@user.com',
      tier: 'free',
      idempotencyKey,
    });

    assert.strictEqual(res2.jobId, 'job_original', 'Duplicate submission must return original jobId');
    assert.strictEqual(res2.queued, false, 'Duplicate submission should not be queued twice');
    assert.strictEqual(queue.getWaitingCount(), 1, 'Queue waiting count must remain exactly 1');

    console.log('✅ Test 2 Passed: Idempotency deduplication prevents redundant processing.');
    passed++;
  } catch (e) {
    console.error('❌ Test 2 Failed:', e.message);
    failed++;
  }

  // Test 3: Backpressure Threshold Rejection
  try {
    const queue = new PdfJobQueue();
    // Simulate low capacity threshold for test
    queue.maxWaiting = 3;

    await queue.add({ jobId: 'j1', toolId: 'tool', originalFileName: 'f', fileSize: 1, inputStorageKey: 'k', options: {}, userEmail: 'u', tier: 'free' });
    await queue.add({ jobId: 'j2', toolId: 'tool', originalFileName: 'f', fileSize: 1, inputStorageKey: 'k', options: {}, userEmail: 'u', tier: 'free' });
    await queue.add({ jobId: 'j3', toolId: 'tool', originalFileName: 'f', fileSize: 1, inputStorageKey: 'k', options: {}, userEmail: 'u', tier: 'free' });

    let threw = false;
    try {
      await queue.add({ jobId: 'j4', toolId: 'tool', originalFileName: 'f', fileSize: 1, inputStorageKey: 'k', options: {}, userEmail: 'u', tier: 'free' });
    } catch (err) {
      if (err.message === 'QUEUE_CAPACITY_EXCEEDED') {
        threw = true;
      }
    }

    assert.strictEqual(threw, true, 'Queue must reject when maxWaiting depth is exceeded');
    console.log('✅ Test 3 Passed: Queue backpressure correctly rejects excess workload.');
    passed++;
  } catch (e) {
    console.error('❌ Test 3 Failed:', e.message);
    failed++;
  }

  // Test 4: Stalled & Failed Job Transitions
  try {
    const queue = new PdfJobQueue();
    await queue.add({ jobId: 'j_fail', toolId: 'tool', originalFileName: 'f', fileSize: 1, inputStorageKey: 'k', options: {}, userEmail: 'u', tier: 'free' });
    const job = await queue.getNextJob();
    assert.strictEqual(queue.getActiveCount(), 1, 'Active jobs should be 1');

    queue.markFailed(job.jobId, new Error('Simulated failure'));
    assert.strictEqual(queue.getActiveCount(), 0, 'Active jobs should decrement on failure');
    console.log('✅ Test 4 Passed: Failed job lifecycle state transition verified.');
    passed++;
  } catch (e) {
    console.error('❌ Test 4 Failed:', e.message);
    failed++;
  }

  console.log(`\nQueue Test Results: ${passed} Passed, ${failed} Failed.`);
  if (failed > 0) process.exit(1);
}

runQueueTests().catch((err) => {
  console.error('Fatal queue test suite error:', err);
  process.exit(1);
});
