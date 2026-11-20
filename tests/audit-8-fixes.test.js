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

function runTest(name, fn) {
  try {
    fn();
    console.log(`✅ ${name}`);
    passed++;
  } catch (err) {
    console.error(`❌ ${name}`);
    console.error(`   Error: ${err.message}`);
    failed++;
  }
}

// ISSUE 1: Sitemap covers all 32 tools + 10 public pages + 4 blog posts = 46 URLs
runTest('Issue 1: Sitemap.xml contains all 32 tools, public pages, and blog posts with https://simplepdf.me', () => {
  const sitemapPath = path.join(PUBLIC_DIR, 'sitemap.xml');
  assert.ok(fs.existsSync(sitemapPath), 'sitemap.xml is missing from public directory');
  const sitemap = fs.readFileSync(sitemapPath, 'utf-8');

  // Verify domain
  assert.ok(!sitemap.includes('https://simplepdf.com'), 'sitemap.xml still contains old domain simplepdf.com');
  assert.ok(sitemap.includes('https://simplepdf.me'), 'sitemap.xml missing https://simplepdf.me');

  // Check all 32 tools
  for (const tool of ALL_TOOLS) {
    assert.ok(
      sitemap.includes(`<loc>https://simplepdf.me${tool.path}</loc>`),
      `sitemap.xml missing tool: ${tool.path}`
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

  // Verify total loc count is exactly 46
  const locCount = (sitemap.match(/<loc>/g) || []).length;
  assert.strictEqual(locCount, 46, `Expected exactly 46 URLs in sitemap.xml, found ${locCount}`);

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

console.log(`\nAudit Test Results: ${passed} Passed, ${failed} Failed.\n`);
if (failed > 0) {
  process.exit(1);
}
