const path = require('path');

async function runDeepAudit() {
  console.log('=== DEEP BACKEND CONTROLLERS & SERVICES AUDIT ===\n');

  let passed = 0;
  let failed = 0;

  async function test(name, fn) {
    try {
      await fn();
      console.log(`[PASS] ${name}`);
      passed++;
    } catch (e) {
      console.error(`[FAIL] ${name} ->`, e.message);
      failed++;
    }
  }

  // 1. Test Database Service
  const { db } = require(path.resolve(__dirname, 'dist/services/dbService.js'));
  await test('Database: Metrics initialization and live calculation', async () => {
    const metrics = db.getMetrics();
    if (typeof metrics.totalProcessedJobs !== 'number' || typeof metrics.activeJobsInQueue !== 'number') {
      throw new Error('Metrics schema invalid');
    }
  });

  await test('Database: Admin account verification', async () => {
    const admin = db.getUserByEmail('admin@simplepdf.com');
    if (!admin || admin.role !== 'admin') {
      throw new Error('Admin account not found in database');
    }
  });

  await test('Database: Create and retrieve processing job record', async () => {
    const testJob = {
      id: 'job_test_001',
      toolId: 'merge-pdf',
      status: 'queued',
      progress: 10,
      fileName: 'test.pdf',
      fileSize: 2048,
      createdAt: Date.now(),
    };
    db.createJob(testJob);
    const retrieved = db.getJob('job_test_001');
    if (!retrieved || retrieved.id !== 'job_test_001') {
      throw new Error('Job retrieval failed');
    }
  });

  // 2. Test Conversion Service
  const { conversionService } = require(path.resolve(__dirname, 'dist/services/conversionService.js'));

  await test('ConversionService: wordToPdf generates valid PDF buffer from text', async () => {
    const result = await conversionService.wordToPdf(Buffer.from('Mock docx content'), 'Contract_Agreement');
    if (!result.resultBuffer || !result.resultFileName.endsWith('.pdf')) {
      throw new Error('Word to PDF failed');
    }
    const header = result.resultBuffer.slice(0, 5).toString('utf-8');
    if (!header.startsWith('%PDF-')) {
      throw new Error(`Invalid PDF header: ${header}`);
    }
  });

  await test('ConversionService: excelToPdf generates valid tabular PDF buffer', async () => {
    const result = await conversionService.excelToPdf(Buffer.from('Mock xlsx content'), 'Q3_Financials');
    if (!result.resultBuffer || !result.resultFileName.endsWith('.pdf')) {
      throw new Error('Excel to PDF failed');
    }
    const header = result.resultBuffer.slice(0, 5).toString('utf-8');
    if (!header.startsWith('%PDF-')) {
      throw new Error(`Invalid PDF header: ${header}`);
    }
  });

  await test('ConversionService: powerpointToPdf generates landscape PDF presentation slides', async () => {
    const result = await conversionService.powerpointToPdf(Buffer.from('Mock pptx content'), 'Company_Pitch');
    if (!result.resultBuffer || !result.resultFileName.endsWith('.pdf')) {
      throw new Error('Powerpoint to PDF failed');
    }
    const header = result.resultBuffer.slice(0, 5).toString('utf-8');
    if (!header.startsWith('%PDF-')) {
      throw new Error(`Invalid PDF header: ${header}`);
    }
  });

  await test('ConversionService: pdfToWord generates valid OpenXML .docx bundle', async () => {
    const samplePdf = Buffer.from('%PDF-1.4\n1 0 obj<</Type/Catalog>>endobj\n(Hello World) Tj\n%%EOF');
    const result = await conversionService.pdfToWord(samplePdf, 'Resume');
    if (!result.resultBuffer || !result.resultFileName.endsWith('.docx')) {
      throw new Error('PDF to Word failed');
    }
    // Verify ZIP magic bytes PK\x03\x04
    if (result.resultBuffer[0] !== 0x50 || result.resultBuffer[1] !== 0x4b) {
      throw new Error('Not a valid OpenXML ZIP container');
    }
  });

  await test('ConversionService: pdfToExcel generates valid OpenXML .xlsx bundle', async () => {
    const samplePdf = Buffer.from('%PDF-1.4\n1 0 obj<</Type/Catalog>>endobj\n(Col1, Col2, 100, 200) Tj\n%%EOF');
    const result = await conversionService.pdfToExcel(samplePdf, 'BalanceSheet');
    if (!result.resultBuffer || !result.resultFileName.endsWith('.xlsx')) {
      throw new Error('PDF to Excel failed');
    }
    if (result.resultBuffer[0] !== 0x50 || result.resultBuffer[1] !== 0x4b) {
      throw new Error('Not a valid OpenXML ZIP container');
    }
  });

  await test('ConversionService: repairPdf recovers damaged PDF into valid container', async () => {
    const damagedPdf = Buffer.from('Damaged stream chunks with missing headers and truncated EOF');
    const result = await conversionService.repairPdf(damagedPdf, 'BrokenFile');
    if (!result.resultBuffer || !result.resultFileName.includes('repaired')) {
      throw new Error('Repair PDF failed');
    }
    const header = result.resultBuffer.slice(0, 5).toString('utf-8');
    if (!header.startsWith('%PDF-')) {
      throw new Error(`Repaired output is not a valid PDF: ${header}`);
    }
  });

  // 3. Test AI Service
  const { aiService } = require(path.resolve(__dirname, 'dist/services/aiService.js'));

  await test('AiService: summarize generates quick, detailed, and academic breakdowns', async () => {
    const sample = 'SimplePDF is designed as an all-in-one document suite. It prioritizes in-browser client execution to maintain user privacy. Cloud conversion workers handle heavier file types. Ephemeral storage daemons securely wipe user documents after sixty minutes.';
    const quick = await aiService.summarize(sample, 'quick');
    const detailed = await aiService.summarize(sample, 'detailed');
    const academic = await aiService.summarize(sample, 'academic');

    if (!quick.summary || !detailed.bulletPoints || !academic.keyTopics) {
      throw new Error('AI Summarizer missing required fields');
    }
  });

  await test('AiService: translate accurately processes multi-lingual targets', async () => {
    const sample = 'This document contains essential findings and results.';
    const urdu = await aiService.translate(sample, 'Urdu');
    const spanish = await aiService.translate(sample, 'Spanish');

    if (!urdu.translatedText || !spanish.translatedText) {
      throw new Error('Translation failed');
    }
  });

  await test('AiService: compare calculates text differences and similarity percentage', async () => {
    const docA = 'Line 1: Original text\nLine 2: Static data\nLine 3: Conclusion';
    const docB = 'Line 1: Modified text\nLine 2: Static data\nLine 3: Conclusion\nLine 4: New addition';
    const diff = await aiService.compare(docA, docB);

    if (typeof diff.similarityScore !== 'number' || diff.differencesCount < 1) {
      throw new Error('Compare logic failed');
    }
  });

  // 4. Test Controllers
  const authController = require(path.resolve(__dirname, 'dist/controllers/auth.controller.js'));

  await test('Controller: loginUser authenticates valid account', async () => {
    let responseData = null;
    const req = { body: { email: 'admin@simplepdf.com' } };
    const res = {
      status(code) { return this; },
      json(data) { responseData = data; return this; },
    };
    authController.loginUser(req, res);
    if (!responseData || !responseData.success || responseData.user.role !== 'admin') {
      throw new Error('loginUser failed');
    }
  });

  await test('Controller: registerUser creates new user', async () => {
    let responseData = null;
    let statusCode = 200;
    const req = { body: { name: 'Sarah Connor', email: 'sarah@resistance.org' } };
    const res = {
      status(code) { statusCode = code; return this; },
      json(data) { responseData = data; return this; },
    };
    authController.registerUser(req, res);
    if (!responseData || !responseData.success || responseData.user.email !== 'sarah@resistance.org') {
      throw new Error('registerUser failed');
    }
  });

  const paymentController = require(path.resolve(__dirname, 'dist/controllers/payment.controller.js'));

  await test('Controller: createCheckoutSession produces valid Pro session', async () => {
    let responseData = null;
    const req = { body: { tier: 'premium' } };
    const res = {
      status(code) { return this; },
      json(data) { responseData = data; return this; },
    };
    paymentController.createCheckoutSession(req, res);
    if (!responseData || !responseData.sessionId || responseData.amount !== 4.99) {
      throw new Error('createCheckoutSession failed');
    }
  });

  console.log(`\n==============================================`);
  console.log(`DEEP BACKEND AUDIT COMPLETE: ${passed} PASSED, ${failed} FAILED`);
  console.log(`==============================================\n`);
  process.exit(failed > 0 ? 1 : 0);
}

runDeepAudit().catch((err) => {
  console.error('[Audit Exception]', err);
  process.exit(1);
});
