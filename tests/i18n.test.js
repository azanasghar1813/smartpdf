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

// Helper: emulate formatLocalizedPath
function formatLocalizedPath(rawPath, lang) {
  const normalized = rawPath.startsWith('/') ? rawPath : `/${rawPath}`;
  if (!lang || lang === DEFAULT_LANGUAGE) {
    return normalized;
  }
  return normalized === '/' ? `/${lang}` : `/${lang}${normalized}`;
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

    // Urdu Merge PDF (RTL)
    const urMergePath = path.join(DIST_DIR, 'ur', 'merge-pdf', 'index.html');
    assert.ok(fs.existsSync(urMergePath), 'dist/ur/merge-pdf/index.html missing');
    const urMergeHtml = fs.readFileSync(urMergePath, 'utf-8');
    assert.ok(urMergeHtml.includes('<html lang="ur" dir="rtl">'), 'Urdu page must have lang="ur" dir="rtl"');
    assert.ok(urMergeHtml.includes('PDF ضم کریں'), 'Urdu tool name must be translated to PDF ضم کریں');
    assert.ok(urMergeHtml.includes('SimplePDF کے ساتھ PDF ضم کریں استعمال کرنے کا طریقہ'), 'Urdu HowTo heading missing');

    // Urdu Compress PDF (RTL)
    const urCompressPath = path.join(DIST_DIR, 'ur', 'compress-pdf', 'index.html');
    assert.ok(fs.existsSync(urCompressPath), 'dist/ur/compress-pdf/index.html missing');
    const urHtml = fs.readFileSync(urCompressPath, 'utf-8');
    assert.ok(urHtml.includes('<html lang="ur" dir="rtl">'), 'Urdu page must have lang="ur" dir="rtl"');
    assert.ok(urHtml.includes('<link rel="canonical" href="https://simplepdf.me/ur/compress-pdf" />'), 'Urdu canonical missing');
    assert.ok(urHtml.includes('100% براؤزر پرائیویسی'), 'Urdu UI translation badge missing');
  });

  // Test 9: LanguageSwitcher User Workflow Simulation (/merge-pdf -> ur -> /ur/merge-pdf -> stay in /ur/)
  await runTest('Test 9: Full LanguageSwitcher & internal link prefix preservation workflow', () => {
    // 1. Initial user on English tool page: /merge-pdf
    const currentToolUrl = '/merge-pdf';
    
    // 2. User clicks Urdu in LanguageSwitcher: getEquivalentPath preserves page and adds /ur
    const switchedToUrdu = getEquivalentPath(currentToolUrl, 'ur');
    assert.strictEqual(switchedToUrdu, '/ur/merge-pdf', 'Switching to Urdu must yield /ur/merge-pdf');

    // 3. User clicks Navbar Pricing link: formatLocalizedPath keeps /ur/
    const pricingInUrdu = formatLocalizedPath('/pricing', 'ur');
    assert.strictEqual(pricingInUrdu, '/ur/pricing', 'Navigating to Pricing from Urdu must yield /ur/pricing');

    // 4. User clicks Navbar Blog link: formatLocalizedPath keeps /ur/
    const blogInUrdu = formatLocalizedPath('/blog', 'ur');
    assert.strictEqual(blogInUrdu, '/ur/blog', 'Navigating to Blog from Urdu must yield /ur/blog');

    // 5. User clicks Navbar Logo: formatLocalizedPath keeps /ur/
    const homeInUrdu = formatLocalizedPath('/', 'ur');
    assert.strictEqual(homeInUrdu, '/ur', 'Navigating to Logo from Urdu must yield /ur');

    // 6. User clicks Merge PDF from Navbar: formatLocalizedPath keeps /ur/
    const toolAgainInUrdu = formatLocalizedPath('/merge-pdf', 'ur');
    assert.strictEqual(toolAgainInUrdu, '/ur/merge-pdf', 'Navigating back to tool from Urdu must yield /ur/merge-pdf');

    // 7. Switching back to English from /ur/merge-pdf removes prefix cleanly
    const switchedBackToEn = getEquivalentPath('/ur/merge-pdf', 'en');
    assert.strictEqual(switchedBackToEn, '/merge-pdf', 'Switching back to English must remove /ur prefix');
  });

  // Test 10: Curated Localized Tool Content Integrity
  await runTest('Test 10: Localized tool content integrity (Urdu translation verification)', () => {
    const { getLocalizedTool, getLocalizedAllTools } = require('../frontend/src/data/localizedTools.ts');
    const { ALL_TOOLS } = require('../frontend/src/data/tools.ts');

    const mergeTool = ALL_TOOLS.find((t) => t.id === 'merge-pdf');
    assert.ok(mergeTool, 'merge-pdf tool must exist in ALL_TOOLS');

    const urMergeTool = getLocalizedTool(mergeTool, 'ur');
    assert.strictEqual(urMergeTool.name, 'PDF ضم کریں', 'Urdu tool name mismatch');
    assert.ok(urMergeTool.howToSteps.length > 0, 'Urdu howToSteps must be present');
    assert.ok(urMergeTool.howToSteps[0].includes('اپنی متعدد PDF فائلیں منتخب کریں'), 'Urdu howToStep 1 mismatch');

    const splitTool = ALL_TOOLS.find((t) => t.id === 'split-pdf');
    const urSplitTool = getLocalizedTool(splitTool, 'ur');
    assert.strictEqual(urSplitTool.name, 'PDF تقسیم کریں', 'Urdu split tool name mismatch');

    const compressTool = ALL_TOOLS.find((t) => t.id === 'compress-pdf');
    const urCompressTool = getLocalizedTool(compressTool, 'ur');
    assert.strictEqual(urCompressTool.name, 'PDF کمپریس کریں', 'Urdu compress tool name mismatch');

    const signTool = ALL_TOOLS.find((t) => t.id === 'sign-pdf');
    const urSignTool = getLocalizedTool(signTool, 'ur');
    assert.strictEqual(urSignTool.name, 'PDF پر دستخط کریں', 'Urdu sign tool name mismatch');

    // Verify all tools localized catalog is populated
    const urAllTools = getLocalizedAllTools('ur');
    assert.strictEqual(urAllTools.length, ALL_TOOLS.length, 'All tools must be returned for Urdu');
  });

  console.log(`\nI18n Test Results: ${passed} Passed, ${failed} Failed.\n`);
  if (failed > 0) {
    process.exit(1);
  }
}

runAll();
