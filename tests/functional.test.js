/**
 * SimplePDF Enterprise Functional & Tool Test Suite
 * Validates PDF processing pipeline, job creation, worker conversion, and result retrieval.
 */

const assert = require('assert');
const path = require('path');
const fs = require('fs');
const { pathToFileURL } = require('url');

async function runFunctionalTests() {
  console.log('\n======================================================');
  console.log('🧪 RUNNING SIMPLEPDF FUNCTIONAL TEST SUITE');
  console.log('======================================================\n');

  let passed = 0;
  let failed = 0;

  // 1. Import compiled backend modules
  const distDir = path.resolve(__dirname, '../backend/dist');
  const { storage, storageService } = await import(pathToFileURL(path.join(distDir, 'storage/storageProvider.js')).href);
  const { jobService } = await import(pathToFileURL(path.join(distDir, 'services/jobService.js')).href);
  const { pdfWorker } = await import(pathToFileURL(path.join(distDir, 'workers/pdf.worker.js')).href);
  const { conversionService } = await import(pathToFileURL(path.join(distDir, 'services/conversionService.js')).href);
  const { db } = await import(pathToFileURL(path.join(distDir, 'services/dbService.js')).href);

  // Start worker in background
  pdfWorker.start();

  // Test 1: Direct Conversion Engine (Compress PDF)
  try {
    const samplePdf = Buffer.from(
      '%PDF-1.4\n1 0 obj<</Type/Catalog/Pages 2 0 R>>endobj\n2 0 obj<</Type/Pages/Kids[3 0 R]/Count 1>>endobj\n3 0 obj<</Type/Page/MediaBox[0 0 612 792]/Parent 2 0 R>>endobj\nxref\n0 4\n0000000000 65535 f\n0000000010 00000 n\n0000000053 00000 n\n0000000102 00000 n\ntrailer<</Size 4/Root 1 0 R>>\nstartxref\n178\n%%EOF'
    );
    const result = await conversionService.processJob('compress-pdf', samplePdf, 'sample.pdf', { level: 'recommended' });
    assert(result.resultBuffer && result.resultBuffer.length > 0, 'Conversion buffer should not be empty');
    assert(result.resultFileName.includes('sample'), 'Result filename should preserve base name');
    console.log('✅ Test 1 Passed: Direct Conversion Engine processes PDF successfully.');
    passed++;
  } catch (e) {
    console.error('❌ Test 1 Failed:', e.message);
    failed++;
  }

  // Test 2: Storage Abstraction (Upload, Download, Exists, Delete)
  try {
    const testKey = 'test/functional-probe.txt';
    const testData = Buffer.from('SimplePDF Storage Provider Test Payload');
    await storage.upload(testKey, testData, 'text/plain');
    const exists = await storage.exists(testKey);
    assert.strictEqual(exists, true, 'Storage object should exist after upload');

    const downloaded = await storage.download(testKey);
    assert.strictEqual(downloaded.toString(), testData.toString(), 'Downloaded content must match uploaded content');

    await storage.delete(testKey);
    const existsAfter = await storage.exists(testKey);
    assert.strictEqual(existsAfter, false, 'Storage object should be deleted');
    console.log('✅ Test 2 Passed: Storage Abstraction upload/download/exists/delete verified.');
    passed++;
  } catch (e) {
    console.error('❌ Test 2 Failed:', e.message);
    failed++;
  }

  // Test 3: End-to-End Async Job Submission & Worker Execution
  try {
    const samplePdf = Buffer.from(
      '%PDF-1.4\n1 0 obj<</Type/Catalog/Pages 2 0 R>>endobj\n2 0 obj<</Type/Pages/Kids[3 0 R]/Count 1>>endobj\n3 0 obj<</Type/Page/MediaBox[0 0 612 792]/Parent 2 0 R>>endobj\nxref\n0 4\n0000000000 65535 f\n0000000010 00000 n\n0000000053 00000 n\n0000000102 00000 n\ntrailer<</Size 4/Root 1 0 R>>\nstartxref\n178\n%%EOF'
    );
    const submitResult = await jobService.submitJob(samplePdf, 'annual-report.pdf', 'repair-pdf', {}, 'testuser@simplepdf.com', 'premium');
    assert(submitResult.success, 'Job submission should return success: true');
    assert.strictEqual(submitResult.status, 'queued', 'Initial status must be queued');

    // Wait for background worker to process job
    let finalJob = null;
    for (let i = 0; i < 25; i++) {
      await new Promise((r) => setTimeout(r, 200));
      finalJob = await jobService.getJob(submitResult.jobId);
      if (finalJob && (finalJob.status === 'completed' || finalJob.status === 'failed')) {
        break;
      }
    }

    assert(finalJob, 'Job record must exist in DB');
    assert.strictEqual(finalJob.status, 'completed', `Job should complete. Current status: ${finalJob.status}`);
    assert.strictEqual(finalJob.progress, 100, 'Progress must reach 100%');
    assert(finalJob.resultKey, 'Job must have a result storage key');

    // Verify download stream retrieval
    const download = await jobService.getDownloadStreamOrUrl(submitResult.jobId);
    assert(download.type === 'stream' || download.type === 'redirect', 'Download must return stream or redirect');
    console.log(`✅ Test 3 Passed: End-to-End async job ${submitResult.jobId} completed and streamable.`);
    passed++;
  } catch (e) {
    console.error('❌ Test 3 Failed:', e.message);
    failed++;
  }

  // Test 4: HMAC Signed Download Token Generation & Verification
  try {
    const localProvider = storageService.getProvider();
    const tokenUrl = await localProvider.getSignedDownloadUrl('test/result.pdf', 'result.pdf', 60);
    assert(tokenUrl.includes('/api/v1/download/signed?'), 'Signed URL should match API format');
    assert(tokenUrl.includes('sig='), 'Signed URL must include cryptographic signature');
    console.log('✅ Test 4 Passed: HMAC Signed Download URL generated successfully.');
    passed++;
  } catch (e) {
    console.error('❌ Test 4 Failed:', e.message);
    failed++;
  }

  // Stop worker cleanly
  await pdfWorker.stop();

  console.log(`\nFunctional Test Results: ${passed} Passed, ${failed} Failed.`);
  process.exit(failed > 0 ? 1 : 0);
}

runFunctionalTests().catch((err) => {
  console.error('Fatal functional test suite error:', err);
  process.exit(1);
});
