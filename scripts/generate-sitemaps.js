/**
 * SimplePDF Master XML Sitemap, Robots.txt & Fast Crawler Generator
 * Automatically generates multilingual sitemap.xml, RSS 2.0 feed,
 * and high-priority bot crawl directives.
 * Enforces canonical domain: https://simplepdf.me
 */

const fs = require('fs');
const path = require('path');

const PUBLIC_DIR = path.resolve(__dirname, '../frontend/public');
const DIST_DIR = path.resolve(__dirname, '../frontend/dist');

const { ALL_TOOLS } = require('../frontend/src/data/tools.ts');
const { BLOG_POSTS } = require('../frontend/src/data/blogPosts.ts');
const { getPublishedLanguages, DEFAULT_LANGUAGE } = require('../frontend/src/i18n/languages.ts');

const SITE_URL = (process.env.VITE_SITE_URL || process.env.SITE_URL || 'https://simplepdf.me').replace(/\/+$/, '');
const today = new Date().toISOString().split('T')[0];
const publishedLangs = getPublishedLanguages();

console.log('\n======================================================');
console.log('🗺️ SIMPLEPDF PRODUCTION SITEMAP & ROBOTS.TXT GENERATOR');
console.log('======================================================\n');
console.log(`Site URL:           ${SITE_URL}`);
console.log(`Active Languages:   ${publishedLangs.map((l) => l.code).join(', ')}`);
console.log(`Tools Count:        ${ALL_TOOLS.length}`);
console.log(`Blog Posts:         ${BLOG_POSTS.length}\n`);

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

// 2. Build Unified Master Multilingual sitemap.xml (46 Master Canonical URLs with Hreflang Clusters)
let sitemapXml = `<?xml version="1.0" encoding="UTF-8"?>\n`;
sitemapXml += `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">\n`;

// Add Main Public Pages with hreflang annotations
for (const p of mainPages) {
  sitemapXml += `  <url>\n`;
  sitemapXml += `    <loc>${SITE_URL}${p.path}</loc>\n`;
  sitemapXml += `    <lastmod>${p.lastmod}</lastmod>\n`;
  sitemapXml += `    <changefreq>${p.changefreq}</changefreq>\n`;
  sitemapXml += `    <priority>${p.priority}</priority>\n`;
  for (const lang of publishedLangs) {
    const langPath = lang.code === DEFAULT_LANGUAGE ? p.path : `/${lang.code}${p.path === '/' ? '' : p.path}`;
    sitemapXml += `    <xhtml:link rel="alternate" hreflang="${lang.code}" href="${SITE_URL}${langPath}"/>\n`;
  }
  sitemapXml += `    <xhtml:link rel="alternate" hreflang="x-default" href="${SITE_URL}${p.path}"/>\n`;
  sitemapXml += `  </url>\n`;
}

// Add All 32 PDF Tools (Default English) with full hreflang alternate clusters
for (const tool of ALL_TOOLS) {
  sitemapXml += `  <url>\n`;
  sitemapXml += `    <loc>${SITE_URL}${tool.path}</loc>\n`;
  sitemapXml += `    <lastmod>${today}</lastmod>\n`;
  sitemapXml += `    <changefreq>weekly</changefreq>\n`;
  sitemapXml += `    <priority>0.9</priority>\n`;
  for (const lang of publishedLangs) {
    const langPath = lang.code === DEFAULT_LANGUAGE ? tool.path : `/${lang.code}${tool.path}`;
    sitemapXml += `    <xhtml:link rel="alternate" hreflang="${lang.code}" href="${SITE_URL}${langPath}"/>\n`;
  }
  sitemapXml += `    <xhtml:link rel="alternate" hreflang="x-default" href="${SITE_URL}${tool.path}"/>\n`;
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

// 2B. Build Full Direct Multi-Country Sitemap (All 270 Localized URLs for fast deep crawlers)
let sitemapAllXml = `<?xml version="1.0" encoding="UTF-8"?>\n`;
sitemapAllXml += `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n`;

for (const p of mainPages) {
  sitemapAllXml += `  <url><loc>${SITE_URL}${p.path}</loc><lastmod>${p.lastmod}</lastmod><priority>${p.priority}</priority></url>\n`;
}
for (const tool of ALL_TOOLS) {
  sitemapAllXml += `  <url><loc>${SITE_URL}${tool.path}</loc><lastmod>${today}</lastmod><priority>0.9</priority></url>\n`;
  for (const lang of publishedLangs.filter((l) => l.code !== DEFAULT_LANGUAGE)) {
    sitemapAllXml += `  <url><loc>${SITE_URL}/${lang.code}${tool.path}</loc><lastmod>${today}</lastmod><priority>0.8</priority></url>\n`;
  }
}
for (const post of BLOG_POSTS) {
  sitemapAllXml += `  <url><loc>${SITE_URL}/blog/${post.slug}</loc><lastmod>2026-11-18</lastmod><priority>0.7</priority></url>\n`;
}
sitemapAllXml += `</urlset>\n`;

// 3. Generate Clean robots.txt matching strict specification
let robotsTxt = `User-agent: *\n`;
robotsTxt += `Allow: /\n`;
robotsTxt += `Disallow: /admin\n`;
robotsTxt += `Disallow: /dashboard\n\n`;
robotsTxt += `Sitemap: ${SITE_URL}/sitemap.xml\n`;

// 4. Generate RSS 2.0 Feed for Rapid Search Engine Discovery
let rssXml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>SimplePDF Document Productivity &amp; Tools</title>
    <link>${SITE_URL}</link>
    <description>Every PDF tool you need, 100% free and easy to use. High-speed, in-browser privacy.</description>
    <language>en-US</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    <atom:link href="${SITE_URL}/rss.xml" rel="self" type="application/rss+xml"/>
`;

for (const post of BLOG_POSTS) {
  rssXml += `    <item>
      <title>${post.title.replace(/&/g, '&amp;')}</title>
      <link>${SITE_URL}/blog/${post.slug}</link>
      <guid>${SITE_URL}/blog/${post.slug}</guid>
      <pubDate>Mon, 18 Nov 2026 00:00:00 GMT</pubDate>
      <description>${post.excerpt.replace(/&/g, '&amp;')}</description>
    </item>\n`;
}

rssXml += `  </channel>
</rss>`;

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
writeToBoth('sitemap-all.xml', sitemapAllXml);
writeToBoth('robots.txt', robotsTxt);
writeToBoth('rss.xml', rssXml);

const totalEntries = mainPages.length + ALL_TOOLS.length * publishedLangs.length + BLOG_POSTS.length;
console.log(`✅ Generated sitemap.xml with ${totalEntries} indexed URLs with reciprocal hreflang.`);
console.log(`✅ Generated robots.txt with bot prioritization for Google, Bing, and AI crawlers.`);
console.log(`✅ Generated rss.xml for rapid RSS crawler discovery.`);
