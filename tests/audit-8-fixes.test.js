/**
 * SimplePDF 8 Audit Issues Verification Test Suite
 * Validates fixes for Issues 1 through 8.
 */

const fs = require('fs');
const path = require('path');
const assert = require('assert');

const ROOT_DIR = path.resolve(__dirname, '..');
const DIST_DIR = path.join(ROOT_DIR, 'frontend/dist');
const PUBLIC_DIR = path.join(ROOT_DIR, 'frontend/public');

const { ALL_TOOLS } = require('../frontend/src/data/tools.ts');
const { BLOG_POSTS } = require('../frontend/src/data/blogPosts.ts');
const { SITE_CONFIG, SITE_URL } = require('../frontend/src/config/site.ts');

console.log('\n======================================================');
console.log('🔍 VERIFYING FIXES FOR ALL 8 AUDIT ISSUES');
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

async function runAll() {
// ISSUE 1: Sitemap covers all active tools + 10 public pages + 4 blog posts = 40 URLs (excludes coming-soon)
await runTest('Issue 1: Sitemap.xml contains all active tools, public pages, and blog posts with https://simplepdf.me (excludes coming-soon)', () => {
  const sitemapPath = path.join(PUBLIC_DIR, 'sitemap.xml');
  assert.ok(fs.existsSync(sitemapPath), 'sitemap.xml is missing from public directory');
  const sitemap = fs.readFileSync(sitemapPath, 'utf-8');

  // Verify domain
  assert.ok(!sitemap.includes('https://simplepdf.com'), 'sitemap.xml still contains old domain simplepdf.com');
  assert.ok(sitemap.includes('https://simplepdf.me'), 'sitemap.xml missing https://simplepdf.me');

  const activeTools = ALL_TOOLS.filter((t) => t.status !== 'coming-soon');
  const comingSoonTools = ALL_TOOLS.filter((t) => t.status === 'coming-soon');

  for (const tool of activeTools) {
    assert.ok(
      sitemap.includes(`<loc>https://simplepdf.me${tool.path}</loc>`),
      `sitemap.xml missing active tool: ${tool.path}`
    );
  }

  for (const tool of comingSoonTools) {
    assert.ok(
      !sitemap.includes(`<loc>https://simplepdf.me${tool.path}</loc>`),
      `sitemap.xml must exclude coming-soon tool: ${tool.path}`
    );
  }

  // Check 10 public pages
  const expectedPages = ['/', '/pricing', '/blog', '/about', '/contact', '/privacy', '/terms', '/security', '/cookies', '/faq'];
  for (const page of expectedPages) {
    assert.ok(
      sitemap.includes(`<loc>https://simplepdf.me${page}</loc>`),
      `sitemap.xml missing public page: ${page}`
    );
  }

  // Check 4 blog posts
  for (const post of BLOG_POSTS) {
    assert.ok(
      sitemap.includes(`<loc>https://simplepdf.me/blog/${post.slug}</loc>`),
      `sitemap.xml missing blog post: ${post.slug}`
    );
  }

  // Verify total loc count matches activeTools + 10 public pages + 4 blog posts
  const expectedLocCount = activeTools.length + expectedPages.length + BLOG_POSTS.length;
  const locCount = (sitemap.match(/<loc>/g) || []).length;
  assert.strictEqual(locCount, expectedLocCount, `Expected ${expectedLocCount} URLs in sitemap.xml, found ${locCount}`);

  // Exclude private routes
  assert.ok(!sitemap.includes('/admin'), 'sitemap.xml must not contain /admin');
  assert.ok(!sitemap.includes('/dashboard'), 'sitemap.xml must not contain /dashboard');
});

// ISSUE 2: Canonical, Open Graph, Twitter tags in index.html and descriptive alt tags
runTest('Issue 2: Canonical, Open Graph, Twitter tags present, and generic alt tags fixed', () => {
  const indexPath = path.join(ROOT_DIR, 'frontend/index.html');
  const indexHtml = fs.readFileSync(indexPath, 'utf-8');

  assert.ok(indexHtml.includes('<link rel="canonical" href="https://simplepdf.me/" />'), 'index.html missing canonical link');
  assert.ok(indexHtml.includes('property="og:type" content="website"'), 'index.html missing og:type');
  assert.ok(indexHtml.includes('property="og:url" content="https://simplepdf.me/"'), 'index.html missing og:url');
  assert.ok(indexHtml.includes('property="og:title"'), 'index.html missing og:title');
  assert.ok(indexHtml.includes('property="og:description"'), 'index.html missing og:description');
  assert.ok(indexHtml.includes('name="twitter:card" content="summary_large_image"'), 'index.html missing twitter:card');

  // Verify ToolWorkspace alt tags
  const workspacePath = path.join(ROOT_DIR, 'frontend/src/components/tools/ToolWorkspace.tsx');
  const workspaceCode = fs.readFileSync(workspacePath, 'utf-8');
  assert.ok(!workspaceCode.includes('alt="Page thumbnail"'), 'Generic "Page thumbnail" alt still present in ToolWorkspace.tsx');
  assert.ok(!workspaceCode.includes('alt={`Page ${img.pageNum}`}'), 'Generic "Page {n}" alt still present in ToolWorkspace.tsx');
  assert.ok(workspaceCode.includes('preview thumbnail'), 'Descriptive preview thumbnail alt missing in ToolWorkspace.tsx');
  assert.ok(workspaceCode.includes('high-resolution image preview'), 'Descriptive extracted page alt missing in ToolWorkspace.tsx');
});

// ISSUE 3: Dedicated 120-160 character seoDescription per tool, checked seoTitle
runTest('Issue 3: All 32 tools have unique 120-160 char seoDescription and checked seoTitle', () => {
  const descSet = new Set();
  const titleSet = new Set();

  assert.strictEqual(ALL_TOOLS.length, 32, 'Expected exactly 32 tools');

  for (const tool of ALL_TOOLS) {
    assert.ok(tool.seoDescription, `Tool ${tool.id} is missing seoDescription`);
    assert.ok(tool.seoTitle, `Tool ${tool.id} is missing seoTitle`);

    const descLen = tool.seoDescription.length;
    assert.ok(
      descLen >= 120 && descLen <= 160,
      `Tool ${tool.id} seoDescription length is ${descLen} (must be between 120 and 160 chars)`
    );

    assert.ok(!descSet.has(tool.seoDescription), `Duplicate seoDescription found for tool ${tool.id}`);
    descSet.add(tool.seoDescription);

    assert.ok(tool.seoTitle.length <= 65, `Tool ${tool.id} seoTitle length is ${tool.seoTitle.length} (>65)`);
    assert.ok(!titleSet.has(tool.seoTitle), `Duplicate seoTitle found for tool ${tool.id}`);
    titleSet.add(tool.seoTitle);
  }
});

// ISSUE 4: Build-time static prerendering for crawlers without JavaScript
runTest('Issue 4: Prerendered HTML contains title, meta description, canonical, H1, and schemas without JS', () => {
  const mergeHtmlPath = path.join(DIST_DIR, 'merge-pdf/index.html');
  assert.ok(fs.existsSync(mergeHtmlPath), 'dist/merge-pdf/index.html does not exist');
  const mergeHtml = fs.readFileSync(mergeHtmlPath, 'utf-8');

  assert.ok(mergeHtml.includes('<title>Merge PDF Online — Combine Multiple PDF Files Free | SimplePDF</title>'), 'Prerendered title missing');
  assert.ok(mergeHtml.includes('<link rel="canonical" href="https://simplepdf.me/merge-pdf" />'), 'Prerendered canonical missing');
  assert.ok(mergeHtml.includes('Combine multiple PDF files into one document for free'), 'Prerendered seoDescription missing');
  assert.ok(mergeHtml.includes('<h1 class="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 tracking-tight leading-tight">Merge PDF</h1>'), 'Prerendered H1 missing');
  assert.ok(mergeHtml.includes('How to use Merge PDF with SimplePDF'), 'Prerendered how-to section missing');
  assert.ok(mergeHtml.includes('WebApplication'), 'Prerendered WebApplication schema missing');
  assert.ok(mergeHtml.includes('HowTo'), 'Prerendered HowTo schema missing');
});

// ISSUE 5: Dedicated 404 page & Nginx 404 status configuration
runTest('Issue 5: Dedicated 404 page exists and Nginx configured for genuine HTTP 404', () => {
  const notFoundPagePath = path.join(ROOT_DIR, 'frontend/src/pages/NotFoundPage.tsx');
  assert.ok(fs.existsSync(notFoundPagePath), 'NotFoundPage.tsx missing');

  const html404Path = path.join(DIST_DIR, '404.html');
  assert.ok(fs.existsSync(html404Path), 'dist/404.html missing');
  const html404 = fs.readFileSync(html404Path, 'utf-8');
  assert.ok(html404.includes('Page Not Found'), '404.html missing Page Not Found text');
  assert.ok(html404.includes('noindex, follow'), '404.html must have noindex directive');

  const nginxConfPath = path.join(ROOT_DIR, 'nginx/nginx.conf');
  const nginxConf = fs.readFileSync(nginxConfPath, 'utf-8');
  assert.ok(nginxConf.includes('error_page 404 /404.html;'), 'nginx.conf missing error_page 404');
  assert.ok(nginxConf.includes('try_files $uri $uri/index.html $uri/ =404;'), 'nginx.conf missing =404 trigger');
});

// ISSUE 6: Dedicated individual blog post URLs (/blog/:slug)
runTest('Issue 6: Blog posts have dedicated routes, prerendered files, and metadata', () => {
  assert.strictEqual(BLOG_POSTS.length, 4, 'Expected 4 blog posts');

  for (const post of BLOG_POSTS) {
    const postHtmlPath = path.join(DIST_DIR, 'blog', post.slug, 'index.html');
    assert.ok(fs.existsSync(postHtmlPath), `Missing prerendered post: dist/blog/${post.slug}/index.html`);

    const postHtml = fs.readFileSync(postHtmlPath, 'utf-8');
    assert.ok(postHtml.includes(post.title), `Blog post HTML missing title: ${post.title}`);
    assert.ok(postHtml.includes(`<link rel="canonical" href="https://simplepdf.me/blog/${post.slug}" />`), `Blog post HTML missing canonical for ${post.slug}`);
    assert.ok(postHtml.includes('BlogPosting'), `Blog post HTML missing BlogPosting schema for ${post.slug}`);
  }
});

// ISSUE 7: FAQPage and HowTo structured data, and clean robots.txt
runTest('Issue 7: FAQPage and HowTo JSON-LD schemas present, robots.txt matches clean specification', () => {
  // Check robots.txt
  const robotsPath = path.join(PUBLIC_DIR, 'robots.txt');
  const robotsTxt = fs.readFileSync(robotsPath, 'utf-8');
  const expectedRobots = `User-agent: *\nAllow: /\nDisallow: /admin\nDisallow: /dashboard\n\nSitemap: https://simplepdf.me/sitemap.xml\n`;
  assert.strictEqual(robotsTxt, expectedRobots, 'robots.txt does not match clean specification');

  // Check /faq prerendered HTML has FAQPage schema
  const faqHtmlPath = path.join(DIST_DIR, 'faq/index.html');
  assert.ok(fs.existsSync(faqHtmlPath), 'dist/faq/index.html missing');
  const faqHtml = fs.readFileSync(faqHtmlPath, 'utf-8');
  assert.ok(faqHtml.includes('"@type": "FAQPage"'), 'FAQ page missing FAQPage schema');
  assert.ok(faqHtml.includes('Is SimplePDF really 100% free?'), 'FAQ page missing visible question');

  // Check tool page has HowTo schema
  const mergeHtml = fs.readFileSync(path.join(DIST_DIR, 'merge-pdf/index.html'), 'utf-8');
  assert.ok(mergeHtml.includes('"@type": "HowTo"'), 'Tool page missing HowTo schema');
  assert.ok(mergeHtml.includes('"@type": "HowToStep"'), 'Tool page missing HowToStep');
});

// ISSUE 8: HTTPS + preferred hostname redirect, GA4, Search Console
runTest('Issue 8: HTTPS redirect, www to non-www redirect, GA4, and Google Search Console present', () => {
  // Check Nginx configuration
  const nginxConf = fs.readFileSync(path.join(ROOT_DIR, 'nginx/nginx.conf'), 'utf-8');
  assert.ok(nginxConf.includes('return 301 https://simplepdf.me$request_uri;'), 'nginx.conf missing canonical 301 redirect');
  assert.ok(nginxConf.includes('server_name www.simplepdf.me;'), 'nginx.conf missing www redirect server block');
  assert.ok(nginxConf.includes('server_name simplepdf.me;'), 'nginx.conf missing primary canonical server block');
  assert.ok(nginxConf.includes('Strict-Transport-Security'), 'nginx.conf missing HSTS header');

  // Check GA4 and GSC in index.html
  const indexHtml = fs.readFileSync(path.join(ROOT_DIR, 'frontend/index.html'), 'utf-8');
  assert.ok(indexHtml.includes('googletagmanager.com/gtag/js'), 'index.html missing Google Analytics 4 script tag');
  assert.ok(indexHtml.includes('google-site-verification'), 'index.html missing Google Search Console verification meta tag');
  assert.ok(indexHtml.includes('anonymize_ip: true'), 'GA4 config must enforce IP anonymization and zero PII');

  // Check central config
  assert.strictEqual(SITE_CONFIG.domain, 'simplepdf.me', 'SITE_CONFIG domain is not simplepdf.me');
  assert.strictEqual(SITE_CONFIG.url, 'https://simplepdf.me', 'SITE_CONFIG url is not https://simplepdf.me');
});

// ISSUE 9: Enterprise Security & Tool Honesty Verification (Phase 0 - 5 Punch List)
await runTest('Issue 9: Zero fake success, admin auth gates, UUID uploads, and clean sitemaps', async () => {
  // 1. ConversionService throws on unsupported tool instead of defaulting to repairPdf
  const { ConversionService } = await import('../backend/src/services/conversionService.ts');
  const conversionService = new ConversionService();
  let threwUnsupported = false;
  try {
    await conversionService.processJob('non-existent-tool', Buffer.from('%PDF-1.4 mock'), 'test.pdf');
  } catch (err) {
    if (err.message.includes('Unsupported conversion tool')) {
      threwUnsupported = true;
    }
  }
  assert.strictEqual(threwUnsupported, true, 'conversionService must throw for unsupported tools');

  // 2. Protected admin routes check in tools.routes.ts
  const toolsRoutesContent = fs.readFileSync(path.join(ROOT_DIR, 'backend/src/routes/tools.routes.ts'), 'utf-8');
  assert.ok(toolsRoutesContent.includes("requireAuth, requireAdmin, purgeEphemeralStorage"), '/admin/purge-storage must be protected with requireAuth and requireAdmin');
  assert.ok(toolsRoutesContent.includes("crypto.randomUUID"), 'multer storage must use crypto.randomUUID for safe filenames');

  // 3. AdminPage does not have 1-Click demo login or hardcoded admin password
  const adminPageContent = fs.readFileSync(path.join(ROOT_DIR, 'frontend/src/pages/AdminPage.tsx'), 'utf-8');
  assert.ok(!adminPageContent.includes('1-Click Demo Login'), 'AdminPage must not contain 1-Click Demo Login');
  assert.ok(!adminPageContent.includes("adminPassword === 'admin123'"), 'AdminPage must not have hardcoded admin password check');

  // 4. docker-compose.yml uses env variable for POSTGRES_PASSWORD
  const dockerComposeContent = fs.readFileSync(path.join(ROOT_DIR, 'docker-compose.yml'), 'utf-8');
  assert.ok(dockerComposeContent.includes('${POSTGRES_PASSWORD:-postgrespassword}'), 'docker-compose.yml must use POSTGRES_PASSWORD env variable');

  // 5. Nginx has explicit SPA routes and try_files ends in =404
  const nginxContent = fs.readFileSync(path.join(ROOT_DIR, 'nginx/nginx.conf'), 'utf-8');
  assert.ok(nginxContent.includes('location ~ ^/(dashboard|admin|login|register|checkout)$'), 'nginx.conf must have explicit SPA routes with noindex');
  assert.ok(nginxContent.includes('client_max_body_size 60M;'), 'nginx.conf must align upload limit with 50MB free tier');

  // 6. Zero stale simplepdf.com URLs in public sitemaps
  const publicFiles = fs.readdirSync(PUBLIC_DIR);
  const staleSitemaps = publicFiles.filter((f) => f.startsWith('sitemap-'));
  assert.strictEqual(staleSitemaps.length, 0, `Stale sitemap files found in public: ${staleSitemaps.join(', ')}`);

  // 7. Coming-soon status on tools requiring external enterprise binaries
  const { ALL_TOOLS: toolsList } = await import('../frontend/src/data/tools.ts');
  const comingSoonTools = toolsList.filter((t) => t.status === 'coming-soon').map((t) => t.id);
  assert.ok(comingSoonTools.includes('ocr-pdf'), 'ocr-pdf must be marked coming-soon until real Tesseract/ocrmypdf is connected');
  assert.ok(comingSoonTools.includes('protect-pdf'), 'protect-pdf must be marked coming-soon until real AES-256 binary is connected');
  assert.ok(comingSoonTools.includes('unlock-pdf'), 'unlock-pdf must be marked coming-soon until real decryption binary is connected');
  assert.ok(comingSoonTools.includes('redact-pdf'), 'redact-pdf must be marked coming-soon until permanent rasterizing redaction is connected');
  assert.ok(comingSoonTools.includes('pdf-to-pdfa'), 'pdf-to-pdfa must be marked coming-soon until ISO 19005 validator is connected');
  assert.ok(comingSoonTools.includes('pdf-forms'), 'pdf-forms must be marked coming-soon');

  // 8. Verify Rotate PDF rotates all pages
  const { rotatePdfFile } = require('../frontend/src/services/clientPdfService.ts');
  const { PDFDocument } = require('pdf-lib');
  const testDoc = await PDFDocument.create();
  testDoc.addPage([100, 100]);
  testDoc.addPage([100, 100]);
  testDoc.addPage([100, 100]);
  const testBytes = await testDoc.save();
  const testFile = new File([testBytes], 'test_rotate.pdf', { type: 'application/pdf' });
  const rotatedBytes = await rotatePdfFile(testFile, 90);
  const loadedRotated = await PDFDocument.load(rotatedBytes);
  const rotatedPages = loadedRotated.getPages();
  assert.strictEqual(rotatedPages.length, 3, 'Must retain all 3 pages');
  assert.strictEqual(rotatedPages[0].getRotation().angle, 90, 'Page 0 must be rotated 90 deg');
  assert.strictEqual(rotatedPages[1].getRotation().angle, 90, 'Page 1 must be rotated 90 deg');
  assert.strictEqual(rotatedPages[2].getRotation().angle, 90, 'Page 2 must be rotated 90 deg');

  // 9. Verify coming-soon tools have noindex in prerendered HTML and localized public pages exist
  const ocrHtmlPath = path.join(DIST_DIR, 'ocr-pdf/index.html');
  assert.ok(fs.existsSync(ocrHtmlPath), 'dist/ocr-pdf/index.html must exist');
  const ocrHtml = fs.readFileSync(ocrHtmlPath, 'utf-8');
  assert.ok(ocrHtml.includes('noindex, follow'), 'coming-soon tool ocr-pdf must have noindex, follow in prerendered HTML');

  assert.ok(fs.existsSync(path.join(DIST_DIR, 'es/index.html')), 'Localized homepage dist/es/index.html must exist');
  assert.ok(fs.existsSync(path.join(DIST_DIR, 'es/privacy/index.html')), 'Localized public page dist/es/privacy/index.html must exist');
});

console.log(`\nAudit Test Results: ${passed} Passed, ${failed} Failed.\n`);
if (failed > 0) {
  process.exit(1);
}
}

runAll().catch((err) => {
  console.error(err);
  process.exit(1);
});
