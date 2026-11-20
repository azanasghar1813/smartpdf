/**
 * SimplePDF Internationalization & SEO Verification Test Suite
 * Validates multilingual routing, canonical URLs, reciprocal hreflangs,
 * RTL configuration, token protection, sitemaps, and static prerendering.
 */

const fs = require('fs');
const path = require('path');
const assert = require('assert');

const { ALL_LANGUAGES, getPublishedLanguages, isRTL, isPublishedLanguage, DEFAULT_LANGUAGE } = require('../backend/dist/i18n');
const { translationService } = require('../backend/dist/services/translationService');

const SITE_URL = (process.env.VITE_SITE_URL || 'https://simplepdf.me').replace(/\/+$/, '');
const DIST_DIR = path.resolve(__dirname, '../frontend/dist');
const PUBLIC_DIR = path.resolve(__dirname, '../frontend/public');

console.log('\n======================================================');
console.log('🌍 RUNNING SIMPLEPDF I18N & INTERNATIONAL SEO TEST SUITE');
console.log('======================================================\n');

let passed = 0;
let failed = 0;

async function runTest(name, fn) {
  try {
    await fn();
    console.log(`✅ ${name}`);
    passed++;
  } catch (err) {
    console.error(`❌ ${name}`);
    console.error(`   Error: ${err.message}`);
    failed++;
  }
}

// Helper: emulate URL parsing logic
function parsePath(pathname) {
  const normalized = pathname.replace(/\/+$/, '') || '/';
  const segments = normalized.split('/').filter(Boolean);

  if (segments.length > 0 && isPublishedLanguage(segments[0])) {
    const lang = segments[0];
    const rest = segments.slice(1).join('/');
    return {
      lang,
      cleanPath: rest ? `/${rest}` : '/',
      isLocalized: true,
    };
  }

  return {
    lang: DEFAULT_LANGUAGE,
    cleanPath: normalized,
    isLocalized: false,
  };
}

// Helper: emulate equivalent path preservation logic
function getEquivalentPath(currentPathname, targetLang) {
  const { cleanPath } = parsePath(currentPathname);
  if (targetLang === DEFAULT_LANGUAGE) {
    return cleanPath;
  }
  return cleanPath === '/' ? `/${targetLang}` : `/${targetLang}${cleanPath}`;
}

// Helper: emulate canonical URL generation
function getCanonicalUrl(cleanPath, lang) {
  if (lang === DEFAULT_LANGUAGE) {
    return `${SITE_URL}${cleanPath}`;
  }
  return `${SITE_URL}${cleanPath === '/' ? `/${lang}` : `/${lang}${cleanPath}`}`;
}

// Helper: emulate hreflang generation
function getHreflangLinks(cleanPath) {
  const published = getPublishedLanguages();
  const alternates = published.map((l) => ({
    hreflang: l.code,
    href: l.code === DEFAULT_LANGUAGE ? `${SITE_URL}${cleanPath}` : `${SITE_URL}${cleanPath === '/' ? `/${l.code}` : `/${l.code}${cleanPath}`}`,
  }));

  alternates.push({
    hreflang: 'x-default',
    href: `${SITE_URL}${cleanPath}`,
  });

  return alternates;
}

async function runAll() {
  // Test 1: Language Definitions & Active Catalog
  await runTest('Test 1: Active 8-language catalog and 51-language registry integrity', () => {
  const published = getPublishedLanguages();
  assert.strictEqual(published.length, 8, 'Expected exactly 8 active published languages');
  
  const codes = published.map((l) => l.code).sort();
  const expectedCodes = ['ar', 'de', 'en', 'es', 'fr', 'hi', 'pt', 'ur'].sort();
  assert.deepStrictEqual(codes, expectedCodes, 'Published language codes mismatch');

  // Verify total catalog size supports scaling to 30+ languages
  const totalLanguages = Object.keys(ALL_LANGUAGES).length;
  assert.ok(totalLanguages >= 30, `Expected at least 30 languages in global catalog, found ${totalLanguages}`);
});

  // Test 2: URL Parsing & Language Extraction
  await runTest('Test 2: URL parsing & language extraction (unprefixed vs prefixed)', () => {
  // English default (unprefixed)
  const p1 = parsePath('/merge-pdf');
  assert.strictEqual(p1.lang, 'en');
  assert.strictEqual(p1.cleanPath, '/merge-pdf');
  assert.strictEqual(p1.isLocalized, false);

  // Spanish localized
  const p2 = parsePath('/es/merge-pdf');
  assert.strictEqual(p2.lang, 'es');
  assert.strictEqual(p2.cleanPath, '/merge-pdf');
  assert.strictEqual(p2.isLocalized, true);

  // Urdu localized
  const p3 = parsePath('/ur/compress-pdf');
  assert.strictEqual(p3.lang, 'ur');
  assert.strictEqual(p3.cleanPath, '/compress-pdf');
  assert.strictEqual(p3.isLocalized, true);

  // Root URLs
  const p4 = parsePath('/');
  assert.strictEqual(p4.lang, 'en');
  assert.strictEqual(p4.cleanPath, '/');

  const p5 = parsePath('/ar');
  assert.strictEqual(p5.lang, 'ar');
  assert.strictEqual(p5.cleanPath, '/');
});

  // Test 3: Language Switcher Path Preservation
  await runTest('Test 3: Language switcher preserves equivalent page without bouncing to homepage', () => {
  // From English /merge-pdf to German
  const dePath = getEquivalentPath('/merge-pdf', 'de');
  assert.strictEqual(dePath, '/de/merge-pdf');

  // From Spanish /es/split-pdf to English (strips prefix for default language)
  const enPath = getEquivalentPath('/es/split-pdf', 'en');
  assert.strictEqual(enPath, '/split-pdf');

  // From French /fr/pricing to Arabic
  const arPricing = getEquivalentPath('/fr/pricing', 'ar');
  assert.strictEqual(arPricing, '/ar/pricing');

  // Root translation switch
  const urHome = getEquivalentPath('/', 'ur');
  assert.strictEqual(urHome, '/ur');

  const enHome = getEquivalentPath('/ur', 'en');
  assert.strictEqual(enHome, '/');
});

  // Test 4: Canonical URLs & Reciprocal Hreflang Tags
  await runTest('Test 4: Self-referencing canonicals and reciprocal hreflang generation', () => {
  const enCanonical = getCanonicalUrl('/merge-pdf', 'en');
  assert.strictEqual(enCanonical, 'https://simplepdf.me/merge-pdf');

  const esCanonical = getCanonicalUrl('/merge-pdf', 'es');
  assert.strictEqual(esCanonical, 'https://simplepdf.me/es/merge-pdf');

  const hreflangs = getHreflangLinks('/merge-pdf');
  assert.strictEqual(hreflangs.length, 9, 'Expected 8 languages + 1 x-default hreflang tags');

  const xDefault = hreflangs.find((h) => h.hreflang === 'x-default');
  assert.ok(xDefault, 'x-default hreflang tag is missing');
  assert.strictEqual(xDefault.href, 'https://simplepdf.me/merge-pdf');

  const arAlt = hreflangs.find((h) => h.hreflang === 'ar');
  assert.strictEqual(arAlt.href, 'https://simplepdf.me/ar/merge-pdf');
});

  // Test 5: Right-to-Left (RTL) Detection
  await runTest('Test 5: RTL detection for Arabic and Urdu, LTR for European and Indic languages', () => {
  assert.strictEqual(isRTL('ar'), true, 'Arabic must be RTL');
  assert.strictEqual(isRTL('ur'), true, 'Urdu must be RTL');
  assert.strictEqual(isRTL('en'), false, 'English must be LTR');
  assert.strictEqual(isRTL('es'), false, 'Spanish must be LTR');
  assert.strictEqual(isRTL('de'), false, 'German must be LTR');
  assert.strictEqual(isRTL('fr'), false, 'French must be LTR');
  assert.strictEqual(isRTL('pt'), false, 'Portuguese must be LTR');
  assert.strictEqual(isRTL('hi'), false, 'Hindi must be LTR');
});

  // Test 6: Technical Token Preservation in Translation Engine
  await runTest('Test 6: Technical token masking and restoration during translation', async () => {
  const input = 'Merge PDF files with SimplePDF. Converts DOCX and XLSX to PDF/A via WebAssembly. Check {tool} at https://simplepdf.com/help';
  
  const res1 = await translationService.translateText(input, 'es');
  assert.ok(res1.text.includes('SimplePDF'), 'Brand name SimplePDF must be preserved');
  assert.ok(res1.text.includes('PDF'), 'PDF acronym must be preserved');
  assert.ok(res1.text.includes('DOCX'), 'DOCX extension must be preserved');
  assert.ok(res1.text.includes('XLSX'), 'XLSX extension must be preserved');
  assert.ok(res1.text.includes('PDF/A'), 'PDF/A format must be preserved');
  assert.ok(res1.text.includes('WebAssembly'), 'WebAssembly must be preserved');
  assert.ok(res1.text.includes('{tool}'), 'Placeholder {tool} must be preserved');
  assert.ok(res1.text.includes('https://simplepdf.com/help'), 'URL must be preserved');

  // Verify caching: second translation returns from memory cache
  const res2 = await translationService.translateText(input, 'es');
  assert.strictEqual(res2.provider, 'cache', 'Subsequent duplicate translation must be served from cache');
  assert.strictEqual(res2.text, res1.text, 'Cached text must match initial translation');
});

  // Test 7: Sitemaps & robots.txt Verification
  await runTest('Test 7: Sitemaps and robots.txt generation and structural integrity', () => {
    const sitemapPath = path.join(PUBLIC_DIR, 'sitemap.xml');
    const robots = path.join(PUBLIC_DIR, 'robots.txt');

    assert.ok(fs.existsSync(sitemapPath), 'sitemap.xml missing in public');
    assert.ok(fs.existsSync(robots), 'robots.txt missing in public');

    const sitemapContent = fs.readFileSync(sitemapPath, 'utf-8');
    assert.ok(sitemapContent.includes('<loc>https://simplepdf.me/merge-pdf</loc>'), 'sitemap.xml must have /merge-pdf');
    assert.ok(sitemapContent.includes('<loc>https://simplepdf.me/compress-pdf</loc>'), 'sitemap.xml must have /compress-pdf');
    assert.ok(sitemapContent.includes('<loc>https://simplepdf.me/protect-pdf</loc>'), 'sitemap.xml must have /protect-pdf');
    assert.ok(sitemapContent.includes('<loc>https://simplepdf.me/faq</loc>'), 'sitemap.xml must have /faq');
    assert.ok(sitemapContent.includes('<loc>https://simplepdf.me/blog/how-to-compress-pdf-without-losing-quality</loc>'), 'sitemap.xml must have blog posts');

    const robotsContent = fs.readFileSync(robots, 'utf-8');
    assert.ok(robotsContent.includes('Sitemap: https://simplepdf.me/sitemap.xml'), 'robots.txt must declare sitemap location');
    assert.ok(robotsContent.includes('Disallow: /admin'), 'robots.txt must protect admin');
  });

  // Test 8: Prerendered Static HTML Inspection (English, Arabic, Spanish)
  await runTest('Test 8: Prerendered static HTML files validation (Title, Meta, H1, FAQ, Schemas, RTL)', () => {
    // English Merge PDF
    const enMergePath = path.join(DIST_DIR, 'merge-pdf', 'index.html');
    assert.ok(fs.existsSync(enMergePath), 'dist/merge-pdf/index.html missing');
    const enHtml = fs.readFileSync(enMergePath, 'utf-8');
    assert.ok(enHtml.includes('<html lang="en" dir="ltr">'), 'English page must have lang="en" dir="ltr"');
    assert.ok(enHtml.includes('<title>Merge PDF Online — Combine Multiple PDF Files Free | SimplePDF</title>'), 'English title missing');
    assert.ok(enHtml.includes('<link rel="canonical" href="https://simplepdf.me/merge-pdf" />'), 'English canonical tag missing');
    assert.ok(enHtml.includes('https://schema.org'), 'JSON-LD schema missing');
    assert.ok(enHtml.includes('WebApplication'), 'WebApplication schema missing');
    assert.ok(enHtml.includes('BreadcrumbList'), 'BreadcrumbList schema missing');
    assert.ok(enHtml.includes('HowTo'), 'HowTo schema missing');
    assert.ok(enHtml.includes('<h1'), 'H1 heading missing');
    assert.ok(enHtml.includes('How to use Merge PDF with SimplePDF'), 'How-to-use section missing');

    // Arabic Merge PDF (RTL)
    const arMergePath = path.join(DIST_DIR, 'ar', 'merge-pdf', 'index.html');
    assert.ok(fs.existsSync(arMergePath), 'dist/ar/merge-pdf/index.html missing');
    const arHtml = fs.readFileSync(arMergePath, 'utf-8');
    assert.ok(arHtml.includes('<html lang="ar" dir="rtl">'), 'Arabic page must have lang="ar" dir="rtl"');
    assert.ok(arHtml.includes('<link rel="canonical" href="https://simplepdf.me/ar/merge-pdf" />'), 'Arabic canonical missing');
    assert.ok(arHtml.includes('خصوصية تامة 100% داخل المتصفح'), 'Arabic UI translation badge missing');

    // Urdu Compress PDF (RTL)
    const urCompressPath = path.join(DIST_DIR, 'ur', 'compress-pdf', 'index.html');
    assert.ok(fs.existsSync(urCompressPath), 'dist/ur/compress-pdf/index.html missing');
    const urHtml = fs.readFileSync(urCompressPath, 'utf-8');
    assert.ok(urHtml.includes('<html lang="ur" dir="rtl">'), 'Urdu page must have lang="ur" dir="rtl"');
    assert.ok(urHtml.includes('<link rel="canonical" href="https://simplepdf.me/ur/compress-pdf" />'), 'Urdu canonical missing');
    assert.ok(urHtml.includes('100% براؤزر پرائیویسی'), 'Urdu UI translation badge missing');
  });

  console.log(`\nI18n Test Results: ${passed} Passed, ${failed} Failed.\n`);
  if (failed > 0) {
    process.exit(1);
  }
}

runAll();
