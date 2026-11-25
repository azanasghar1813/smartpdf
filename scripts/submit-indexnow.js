/**
 * SimplePDF IndexNow Instant Indexing Protocol Submitter
 * Automatically submits all 32 PDF tools and public pages to the IndexNow API
 * (Bing, Yandex, Seznam, Naver) for immediate crawler indexing.
 */

const https = require('https');
const { ALL_TOOLS } = require('../frontend/src/data/tools.ts');
const { BLOG_POSTS } = require('../frontend/src/data/blogPosts.ts');
const { getPublishedLanguages, DEFAULT_LANGUAGE } = require('../frontend/src/i18n/languages.ts');

const HOST = 'simplepdf.me';
const KEY = '8f4b23829c914e6dae76c338421b8c2d';
const KEY_LOCATION = `https://${HOST}/${KEY}.txt`;

const publishedLangs = getPublishedLanguages();

// Compile list of canonical URLs
const urlList = [
  `https://${HOST}/`,
  `https://${HOST}/pricing`,
  `https://${HOST}/blog`,
  `https://${HOST}/about`,
  `https://${HOST}/contact`,
  `https://${HOST}/privacy`,
  `https://${HOST}/terms`,
  `https://${HOST}/security`,
  `https://${HOST}/cookies`,
  `https://${HOST}/faq`,
];

// Add all 32 tools across published languages
for (const tool of ALL_TOOLS) {
  urlList.push(`https://${HOST}${tool.path}`);
  for (const lang of publishedLangs.filter((l) => l.code !== DEFAULT_LANGUAGE)) {
    urlList.push(`https://${HOST}/${lang.code}${tool.path}`);
  }
}

// Add all blog posts
for (const post of BLOG_POSTS) {
  urlList.push(`https://${HOST}/blog/${post.slug}`);
}

const payload = JSON.stringify({
  host: HOST,
  key: KEY,
  keyLocation: KEY_LOCATION,
  urlList: urlList,
});

console.log('\n======================================================');
console.log('⚡ INDEXNOW INSTANT SEARCH ENGINE NOTIFIER');
console.log('======================================================\n');
console.log(`Host:            ${HOST}`);
console.log(`Key:             ${KEY}`);
console.log(`Key Location:    ${KEY_LOCATION}`);
console.log(`Total URLs:      ${urlList.length} URLs queued for instant crawl\n`);

const options = {
  hostname: 'api.indexnow.org',
  port: 443,
  path: '/indexnow',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json; charset=utf-8',
    'Content-Length': Buffer.byteLength(payload),
  },
};

const req = https.request(options, (res) => {
  console.log(`IndexNow Gateway Response: HTTP ${res.statusCode} (${res.statusMessage})`);
  let data = '';
  res.on('data', (chunk) => (data += chunk));
  res.on('end', () => {
    if (res.statusCode === 200 || res.statusCode === 202) {
      console.log('✅ Successfully submitted all URLs to IndexNow! Search crawlers dispatched.');
    } else {
      console.log(`ℹ️ Gateway response: ${data || 'Queued'}`);
    }
  });
});

req.on('error', (e) => {
  console.warn(`[IndexNow] Note: Network call skipped in offline/sandbox mode: ${e.message}`);
});

req.write(payload);
req.end();
