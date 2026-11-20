/**
 * SimplePDF Master XML Sitemap & Robots.txt Generator
 * Automatically generates sitemap.xml directly from ALL_TOOLS + Public Pages + Blog Posts.
 * Enforces canonical domain: https://simplepdf.me
 */

const fs = require('fs');
const path = require('path');

const PUBLIC_DIR = path.resolve(__dirname, '../frontend/public');
const DIST_DIR = path.resolve(__dirname, '../frontend/dist');

const { ALL_TOOLS } = require('../frontend/src/data/tools.ts');
const { BLOG_POSTS } = require('../frontend/src/data/blogPosts.ts');

const SITE_URL = (process.env.VITE_SITE_URL || process.env.SITE_URL || 'https://simplepdf.me').replace(/\/+$/, '');
const today = new Date().toISOString().split('T')[0];

console.log('\n======================================================');
console.log('🗺️ SIMPLEPDF PRODUCTION SITEMAP & ROBOTS.TXT GENERATOR');
console.log('======================================================\n');
console.log(`Site URL:    ${SITE_URL}`);
console.log(`Tools Count: ${ALL_TOOLS.length}`);
console.log(`Blog Posts:  ${BLOG_POSTS.length}\n`);

// 1. Core Public Pages
const mainPages = [
  { path: '/', priority: '1.0', changefreq: 'daily', lastmod: today },
  { path: '/pricing', priority: '0.8', changefreq: 'weekly', lastmod: today },
  { path: '/blog', priority: '0.8', changefreq: 'daily', lastmod: today },
  { path: '/about', priority: '0.6', changefreq: 'monthly', lastmod: today },
  { path: '/contact', priority: '0.6', changefreq: 'monthly', lastmod: today },
  { path: '/privacy', priority: '0.5', changefreq: 'monthly', lastmod: today },
  { path: '/terms', priority: '0.5', changefreq: 'monthly', lastmod: today },
  { path: '/security', priority: '0.7', changefreq: 'monthly', lastmod: today },
  { path: '/cookies', priority: '0.5', changefreq: 'monthly', lastmod: today },
  { path: '/faq', priority: '0.7', changefreq: 'monthly', lastmod: today },
];

// 2. Build Unified Master sitemap.xml
let sitemapXml = `<?xml version="1.0" encoding="UTF-8"?>\n`;
sitemapXml += `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n`;

// Add Main Public Pages
for (const p of mainPages) {
  sitemapXml += `  <url>\n`;
  sitemapXml += `    <loc>${SITE_URL}${p.path}</loc>\n`;
  sitemapXml += `    <lastmod>${p.lastmod}</lastmod>\n`;
  sitemapXml += `    <changefreq>${p.changefreq}</changefreq>\n`;
  sitemapXml += `    <priority>${p.priority}</priority>\n`;
  sitemapXml += `  </url>\n`;
}

// Add All 32 PDF Tools
for (const tool of ALL_TOOLS) {
  sitemapXml += `  <url>\n`;
  sitemapXml += `    <loc>${SITE_URL}${tool.path}</loc>\n`;
  sitemapXml += `    <lastmod>${today}</lastmod>\n`;
  sitemapXml += `    <changefreq>weekly</changefreq>\n`;
  sitemapXml += `    <priority>0.9</priority>\n`;
  sitemapXml += `  </url>\n`;
}

// Add All Individual Blog Posts
for (const post of BLOG_POSTS) {
  sitemapXml += `  <url>\n`;
  sitemapXml += `    <loc>${SITE_URL}/blog/${post.slug}</loc>\n`;
  sitemapXml += `    <lastmod>2026-11-18</lastmod>\n`;
  sitemapXml += `    <changefreq>monthly</changefreq>\n`;
  sitemapXml += `    <priority>0.7</priority>\n`;
  sitemapXml += `  </url>\n`;
}

sitemapXml += `</urlset>\n`;

// 3. Generate Clean robots.txt
let robotsTxt = `User-agent: *\n`;
robotsTxt += `Allow: /\n`;
robotsTxt += `Disallow: /admin\n`;
robotsTxt += `Disallow: /dashboard\n\n`;
robotsTxt += `Sitemap: ${SITE_URL}/sitemap.xml\n`;

// Write to public and dist directories
function writeToBoth(filename, content) {
  const p1 = path.join(PUBLIC_DIR, filename);
  fs.writeFileSync(p1, content, 'utf-8');

  if (fs.existsSync(DIST_DIR)) {
    const p2 = path.join(DIST_DIR, filename);
    fs.writeFileSync(p2, content, 'utf-8');
  }
}

writeToBoth('sitemap.xml', sitemapXml);
writeToBoth('robots.txt', robotsTxt);

const totalUrls = mainPages.length + ALL_TOOLS.length + BLOG_POSTS.length;
console.log(`✅ Generated sitemap.xml with ${totalUrls} total URLs:`);
console.log(`   - 10 Public Pages`);
console.log(`   - 32 Core PDF Tool Landing Pages`);
console.log(`   - ${BLOG_POSTS.length} Individual Blog Post Pages`);
console.log(`✅ Generated robots.txt pointing to ${SITE_URL}/sitemap.xml`);
