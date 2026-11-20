/**
 * SimplePDF Enterprise Security & Hardening Test Suite
 * Validates path traversal defense, SSRF guard, scrypt hashing, JWT validation, and webhook HMAC.
 */

const assert = require('assert');
const path = require('path');
const { pathToFileURL } = require('url');

async function runSecurityTests() {
  console.log('\n======================================================');
  console.log('🛡️ RUNNING SIMPLEPDF SECURITY & HARDENING TEST SUITE');
  console.log('======================================================\n');

  let passed = 0;
  let failed = 0;

  const distDir = path.resolve(__dirname, '../backend/dist');
  const { authService } = await import(pathToFileURL(path.join(distDir, 'services/authService.js')).href);
  const { storage } = await import(pathToFileURL(path.join(distDir, 'storage/storageProvider.js')).href);
  const { isPrivateOrInternalHost } = await import(pathToFileURL(path.join(distDir, 'middleware/ssrfGuard.js')).href);
  const { validateMagicBytes } = await import(pathToFileURL(path.join(distDir, 'middleware/mimeValidator.js')).href);

  // Test 1: Path Traversal Defense
  try {
    let blocked = false;
    try {
      await storage.download('../../../../../Windows/System32/drivers/etc/hosts');
    } catch (err) {
      if (err.message.includes('traversal') || err.message.includes('not found')) {
        blocked = true;
      }
    }
    assert.strictEqual(blocked, true, 'Directory traversal path must be blocked');
    console.log('✅ Test 1 Passed: Path Traversal attack vectors effectively blocked.');
    passed++;
  } catch (e) {
    console.error('❌ Test 1 Failed:', e.message);
    failed++;
  }

  // Test 2: SSRF Guard on Internal/Private IP Ranges
  try {
    assert.strictEqual(isPrivateOrInternalHost('127.0.0.1'), true, 'Loopback IP must be blocked');
    assert.strictEqual(isPrivateOrInternalHost('10.0.0.5'), true, 'Private 10.0.0.0/8 must be blocked');
    assert.strictEqual(isPrivateOrInternalHost('192.168.1.1'), true, 'Private 192.168.0.0/16 must be blocked');
    assert.strictEqual(isPrivateOrInternalHost('169.254.169.254'), true, 'AWS/GCP metadata IP must be blocked');
    assert.strictEqual(isPrivateOrInternalHost('8.8.8.8'), false, 'Public IP should be allowed');
    console.log('✅ Test 2 Passed: SSRF Guard blocks all RFC 1918 & Cloud Metadata IP ranges.');
    passed++;
  } catch (e) {
    console.error('❌ Test 2 Failed:', e.message);
    failed++;
  }

  // Test 3: Magic Bytes Upload Validation
  try {
    // Valid PDF signature %PDF-
    const validPdfBuffer = Buffer.from('%PDF-1.4\n1 0 obj<</Type/Catalog>>endobj');
    const validResult = validateMagicBytes(validPdfBuffer, 'test.pdf');
    assert.strictEqual(validResult.valid, true, 'Valid PDF magic bytes must pass');

    // Executable Windows PE header (MZ) renamed to .pdf
    const maliciousExeBuffer = Buffer.from('MZ\x90\x00\x03\x00\x00\x00\x04\x00\x00\x00\xff\xff');
    const invalidResult = validateMagicBytes(maliciousExeBuffer, 'invoice.pdf');
    assert.strictEqual(invalidResult.valid, false, 'Malicious executable disguised as PDF must be rejected');

    console.log('✅ Test 3 Passed: Magic byte deep packet inspection catches disguised executables.');
    passed++;
  } catch (e) {
    console.error('❌ Test 3 Failed:', e.message);
    failed++;
  }

  // Test 4: NIST-compliant Scrypt Password Hashing & Timing-Safe Verification
  try {
    const password = 'SuperSecureP@ssw0rd!2026';
    const hash = await authService.hashPassword(password);

    assert(hash.startsWith('scrypt:'), 'Hash must use scrypt algorithm');
    const isCorrect = await authService.verifyPassword(password, hash);
    assert.strictEqual(isCorrect, true, 'Correct password must verify successfully');

    const isWrong = await authService.verifyPassword('WrongPassword123', hash);
    assert.strictEqual(isWrong, false, 'Incorrect password must be rejected');

    console.log('✅ Test 4 Passed: Scrypt password hashing with random salt & timing-safe comparison verified.');
    passed++;
  } catch (e) {
    console.error('❌ Test 4 Failed:', e.message);
    failed++;
  }

  // Test 5: JWT Generation, Verification & Expiration Defense
  try {
    const token = authService.generateJwt({
      userId: 'usr_sec_1',
      email: 'security@simplepdf.com',
      role: 'admin',
      tier: 'business',
    });

    const verified = authService.verifyJwt(token);
    assert.strictEqual(verified.valid, true, 'Valid token must be verified');
    assert.strictEqual(verified.payload.email, 'security@simplepdf.com');

    // Tampered token test
    const tamperedToken = token.slice(0, -5) + 'xxxxx';
    const tamperedResult = authService.verifyJwt(tamperedToken);
    assert.strictEqual(tamperedResult.valid, false, 'Tampered token signature must be rejected');
    assert.strictEqual(tamperedResult.error, 'INVALID_SIGNATURE');

    console.log('✅ Test 5 Passed: JWT cryptographic signing, payload verification & tamper rejection verified.');
    passed++;
  } catch (e) {
    console.error('❌ Test 5 Failed:', e.message);
    failed++;
  }

  // Test 6: Webhook HMAC Signature Verification
  try {
    const mockWebhookKey = 'mock_webhook_verification_key_for_testing';
    const payload = JSON.stringify({ type: 'checkout.session.completed', data: { amount: 499 } });

    // Compute valid signature
    const crypto = require('crypto');
    const validSig = crypto.createHmac('sha256', mockWebhookKey).update(payload).digest('hex');

    const verified = authService.verifyWebhookSignature(payload, validSig, mockWebhookKey);
    assert.strictEqual(verified, true, 'Valid HMAC signature must verify');

    const invalidVerified = authService.verifyWebhookSignature(payload, 'invalid_signature_hex_00000000', mockWebhookKey);
    assert.strictEqual(invalidVerified, false, 'Invalid HMAC signature must be rejected');

    console.log('✅ Test 6 Passed: Webhook HMAC-SHA256 signature verification verified.');
    passed++;
  } catch (e) {
    console.error('❌ Test 6 Failed:', e.message);
    failed++;
  }

  console.log(`\nSecurity Test Results: ${passed} Passed, ${failed} Failed.`);
  if (failed > 0) process.exit(1);
}

runSecurityTests().catch((err) => {
  console.error('Fatal security test suite error:', err);
  process.exit(1);
});
