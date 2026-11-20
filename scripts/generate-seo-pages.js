/**
 * SimplePDF High-Performance SEO Prerender Generator
 * Generates search-engine-crawlable static HTML files for all 32 tools,
 * all blog posts, public pages, and the dedicated 404 page.
 * Enforces canonical domain: https://simplepdf.me
 */

const fs = require('fs');
const path = require('path');

const DIST_DIR = path.resolve(__dirname, '../frontend/dist');
const BASE_HTML_FILE = path.join(DIST_DIR, 'index.html');

if (!fs.existsSync(BASE_HTML_FILE)) {
  console.error('❌ Build frontend first before running prerender generator!');
  process.exit(1);
}

const baseTemplate = fs.readFileSync(BASE_HTML_FILE, 'utf-8');

const { ALL_LANGUAGES, getPublishedLanguages, isRTL, DEFAULT_LANGUAGE } = require('../frontend/src/i18n/languages.ts');
const { ALL_TOOLS } = require('../frontend/src/data/tools.ts');
const { getToolSeoDetail } = require('../frontend/src/data/toolSeoContent.ts');
const { getTranslations } = require('../frontend/src/i18n/translations.ts');
const { getLocalizedTool, getLocalizedToolSeo } = require('../frontend/src/data/localizedTools.ts');
const { BLOG_POSTS } = require('../frontend/src/data/blogPosts.ts');
const { GLOBAL_FAQS } = require('../frontend/src/data/faqs.ts');

const SITE_URL = (process.env.VITE_SITE_URL || process.env.SITE_URL || 'https://simplepdf.me').replace(/\/+$/, '');
const publishedLangs = getPublishedLanguages();

console.log('\n======================================================');
console.log('🌐 SIMPLEPDF PRODUCTION SEO PRERENDER GENERATOR');
console.log('======================================================\n');
console.log(`Site URL:           ${SITE_URL}`);
console.log(`Active Languages:   ${publishedLangs.map((l) => l.code).join(', ')}`);
console.log(`Tool Count:         ${ALL_TOOLS.length} tools`);
console.log(`Blog Posts:         ${BLOG_POSTS.length} posts\n`);

let totalGenerated = 0;

function escapeHtml(str) {
  if (!str) return '';
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

function cleanBaseTemplate(template) {
  return template
    .replace(/<link rel="canonical"[^>]*>\s*/gi, '')
    .replace(/<meta name="description"[^>]*>\s*/gi, '')
    .replace(/<meta property="og:[^"]*"[^>]*>\s*/gi, '')
    .replace(/<meta name="twitter:[^"]*"[^>]*>\s*/gi, '');
}

// 1. Tool Page Prerender Function
function generateToolPageHtml(rawTool, langCode) {
  const isDefault = langCode === DEFAULT_LANGUAGE;
  const rtl = isRTL(langCode);
  const t = getTranslations(langCode);
  const tool = getLocalizedTool(rawTool, langCode);
  const seoDetail = getLocalizedToolSeo(rawTool.id, langCode);

  const localizedPath = isDefault ? rawTool.path : `/${langCode}${rawTool.path}`;
  const canonicalUrl = `${SITE_URL}${localizedPath}`;

  const title = `${tool.seoTitle || tool.name} | SimplePDF`;
  const description = tool.seoDescription || tool.description;

  // Hreflang alternates
  const hreflangTags = publishedLangs
    .map((l) => {
      const altPath = l.code === DEFAULT_LANGUAGE ? rawTool.path : `/${l.code}${rawTool.path}`;
      return `    <link rel="alternate" hreflang="${l.code}" href="${SITE_URL}${altPath}" />`;
    })
    .join('\n');

  const xDefaultTag = `    <link rel="alternate" hreflang="x-default" href="${SITE_URL}${rawTool.path}" />`;

  // Schemas
  const webAppSchema = {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    name: `${tool.name} — SimplePDF`,
    url: canonicalUrl,
    inLanguage: langCode,
    description: tool.seoDescription || tool.longDescription || tool.description,
    applicationCategory: 'BusinessApplication',
    operatingSystem: 'All',
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'USD',
    },
    featureList: tool.howToSteps.join('; '),
  };

  const howToSchema = {
    '@context': 'https://schema.org',
    '@type': 'HowTo',
    name: t.howToUseTitle.replace('{tool}', tool.name),
    description: tool.seoDescription || tool.description,
    step: tool.howToSteps.map((stepText, idx) => ({
      '@type': 'HowToStep',
      position: idx + 1,
      name: `Step ${idx + 1}`,
      text: stepText,
      url: `${canonicalUrl}#step-${idx + 1}`,
    })),
  };

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Home',
        item: `${SITE_URL}${isDefault ? '/' : `/${langCode}`}`,
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: tool.category.replace('-', ' '),
        item: `${SITE_URL}${isDefault ? '/' : `/${langCode}`}#${tool.category}`,
      },
      {
        '@type': 'ListItem',
        position: 3,
        name: tool.name,
        item: canonicalUrl,
      },
    ],
  };

  const schemas = [webAppSchema, howToSchema, breadcrumbSchema];

  if (seoDetail.faqs && seoDetail.faqs.length > 0) {
    schemas.push({
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: seoDetail.faqs.map((f) => ({
        '@type': 'Question',
        name: f.question,
        acceptedAnswer: {
          '@type': 'Answer',
          text: f.answer,
        },
      })),
    });
  }

  const relatedTools = ALL_TOOLS
    .filter((t) => t.category === rawTool.category && t.id !== rawTool.id)
    .slice(0, 3)
    .map((rt) => getLocalizedTool(rt, langCode));

  const preRenderedBody = `
  <div class="min-h-screen bg-slate-50 py-6 px-4 sm:px-6 lg:px-8 ${rtl ? 'rtl' : 'ltr'}" data-prerendered="true">
    <div class="max-w-6xl mx-auto space-y-10">
      <nav aria-label="Breadcrumb" class="text-xs font-semibold text-slate-500 flex items-center gap-2">
        <a href="${isDefault ? '/' : `/${langCode}`}" class="hover:text-brand-600">${escapeHtml(t.home)}</a>
        <span>/</span>
        <span class="capitalize text-slate-600">${escapeHtml(tool.category.replace('-', ' '))}</span>
        <span>/</span>
        <span class="text-slate-900 font-bold">${escapeHtml(tool.name)}</span>
      </nav>

      <header class="text-center space-y-4 max-w-3xl mx-auto">
        <div class="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-brand-50 border border-brand-200 text-brand-700 text-xs font-bold">
          <span>${tool.isClientSide ? escapeHtml(t.clientPrivacyBadge) : escapeHtml(t.serverPrivacyBadge)}</span>
        </div>
        <h1 class="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 tracking-tight leading-tight">${escapeHtml(tool.name)}</h1>
        <p class="text-base sm:text-lg text-slate-600 leading-relaxed">${escapeHtml(tool.seoDescription || tool.description)}</p>
      </header>

      <section aria-label="Tool Workspace" class="bg-white rounded-3xl border border-slate-200/90 shadow-soft p-8 text-center space-y-4">
        <div class="p-8 border-2 border-dashed border-brand-200 rounded-2xl bg-brand-50/30">
          <h2 class="text-xl font-bold text-slate-900">${escapeHtml(tool.name)} Workspace</h2>
          <p class="text-sm text-slate-500 mt-2">${escapeHtml(t.dropFilesHere)}</p>
          <div class="mt-4 inline-block px-6 py-3 rounded-xl bg-brand-600 text-white font-bold text-sm shadow-xs">${escapeHtml(t.chooseFiles)}</div>
        </div>
      </section>

      <section class="bg-white rounded-3xl border border-slate-200 p-8 space-y-6">
        <h2 class="text-2xl font-extrabold text-slate-900">${escapeHtml(t.howToUseTitle.replace('{tool}', tool.name))}</h2>
        <ol class="grid grid-cols-1 sm:grid-cols-2 gap-4">
          ${tool.howToSteps
            .map(
              (step, idx) => `
            <li class="flex items-start gap-4 p-5 rounded-2xl bg-slate-50 border border-slate-100">
              <span class="w-8 h-8 rounded-xl bg-brand-600 text-white font-black text-sm flex items-center justify-center flex-shrink-0">${idx + 1}</span>
              <span class="text-sm font-medium text-slate-700 leading-relaxed pt-1">${escapeHtml(step)}</span>
            </li>`
            )
            .join('')}
        </ol>
      </section>

      <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <section class="bg-white rounded-3xl border border-slate-200 p-8 space-y-6">
          <h3 class="text-xl font-bold text-slate-900">${escapeHtml(t.featuresTitle)}</h3>
          <ul class="space-y-3.5">
            ${seoDetail.features.map((f) => `<li class="text-sm text-slate-600">✓ ${escapeHtml(f)}</li>`).join('')}
          </ul>
        </section>

        <section class="bg-white rounded-3xl border border-slate-200 p-8 space-y-6">
          <h3 class="text-xl font-bold text-slate-900">${escapeHtml(t.useCasesTitle)}</h3>
          <ul class="space-y-3.5">
            ${seoDetail.useCases.map((u) => `<li class="text-sm text-slate-600">• ${escapeHtml(u)}</li>`).join('')}
          </ul>
        </section>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <section class="bg-white rounded-3xl border border-slate-200 p-8 space-y-4">
          <h3 class="text-xl font-bold text-slate-900">${escapeHtml(t.limitationsTitle)}</h3>
          <div class="flex flex-wrap gap-2">
            ${tool.acceptedFileTypes.map((ext) => `<span class="px-3 py-1 rounded-lg bg-slate-100 border text-xs font-mono font-bold">${ext.toUpperCase()}</span>`).join('')}
          </div>
          <ul class="space-y-2 text-xs text-slate-500">
            ${seoDetail.limitations.map((l) => `<li>• ${escapeHtml(l)}</li>`).join('')}
          </ul>
        </section>

        <section class="bg-white rounded-3xl border border-slate-200 p-8 space-y-4">
          <h3 class="text-xl font-bold text-slate-900">${escapeHtml(t.privacyTitle)}</h3>
          <p class="text-sm text-slate-600 leading-relaxed">${escapeHtml(seoDetail.privacyNote)}</p>
        </section>
      </div>

      ${
        seoDetail.faqs.length > 0
          ? `
      <section class="bg-white rounded-3xl border border-slate-200 p-8 space-y-6">
        <h2 class="text-2xl font-extrabold text-slate-900">${escapeHtml(t.faqTitle)}</h2>
        <div class="space-y-4">
          ${seoDetail.faqs
            .map(
              (faq) => `
            <div class="border border-slate-200 rounded-2xl p-5 bg-slate-50/50">
              <h3 class="font-bold text-sm text-slate-900">${escapeHtml(faq.question)}</h3>
              <p class="text-sm text-slate-600 mt-2 leading-relaxed">${escapeHtml(faq.answer)}</p>
            </div>`
            )
            .join('')}
        </div>
      </section>`
          : ''
      }

      <section class="space-y-4 pt-4">
        <h3 class="text-lg font-bold text-slate-800">${escapeHtml(t.relatedToolsTitle)}</h3>
        <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
          ${relatedTools
            .map(
              (rt) => `
            <a href="${isDefault ? rt.path : `/${langCode}${rt.path}`}" class="bg-white p-5 rounded-2xl border border-slate-200 hover:border-brand-300 block">
              <h4 class="font-bold text-sm text-slate-900">${escapeHtml(rt.name)}</h4>
              <p class="text-xs text-slate-500 mt-1">${escapeHtml(rt.description)}</p>
            </a>`
            )
            .join('')}
        </div>
      </section>
    </div>
  </div>`;

  let html = cleanBaseTemplate(baseTemplate);
  html = html.replace(/<html[^>]*>/i, `<html lang="${langCode}" dir="${rtl ? 'rtl' : 'ltr'}">`);
  html = html.replace(/<title>.*?<\/title>/i, `<title>${escapeHtml(title)}</title>`);

  const headInjections = `
    <meta name="description" content="${escapeHtml(description)}" />
    <link rel="canonical" href="${canonicalUrl}" />
${hreflangTags}
${xDefaultTag}
    <meta property="og:type" content="website" />
    <meta property="og:url" content="${canonicalUrl}" />
    <meta property="og:title" content="${escapeHtml(title)}" />
    <meta property="og:description" content="${escapeHtml(description)}" />
    <meta property="og:image" content="${SITE_URL}/logo.svg" />
    <meta property="og:site_name" content="SimplePDF" />
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:url" content="${canonicalUrl}" />
    <meta name="twitter:title" content="${escapeHtml(title)}" />
    <meta name="twitter:description" content="${escapeHtml(description)}" />
    <meta name="twitter:image" content="${SITE_URL}/logo.svg" />
    <script type="application/ld+json" id="seo-json-ld">
${JSON.stringify(schemas, null, 2)}
    </script>
  </head>`;

  html = html.replace(/<\/head>/i, headInjections);
  html = html.replace(/<div id="root"[^>]*>([\s\S]*?)<\/div>/i, `<div id="root">${preRenderedBody}</div>`);

  return html;
}

// 2. Blog Post Prerender Function
function generateBlogPostHtml(post) {
  const canonicalUrl = `${SITE_URL}/blog/${post.slug}`;
  const title = `${post.title} | SimplePDF Blog`;
  const description = post.excerpt;

  const articleSchema = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.title,
    description: post.excerpt,
    url: canonicalUrl,
    datePublished: '2026-11-18',
    dateModified: '2026-11-18',
    author: {
      '@type': 'Organization',
      name: post.author || 'SimplePDF Team',
    },
    publisher: {
      '@type': 'Organization',
      name: 'SimplePDF',
      url: SITE_URL,
      logo: `${SITE_URL}/logo.svg`,
    },
  };

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: SITE_URL },
      { '@type': 'ListItem', position: 2, name: 'Blog', item: `${SITE_URL}/blog` },
      { '@type': 'ListItem', position: 3, name: post.title, item: canonicalUrl },
    ],
  };

  const preRenderedBody = `
  <div class="py-16 bg-slate-50 min-h-screen" data-prerendered="true">
    <div class="max-w-4xl mx-auto px-4 sm:px-6 space-y-8">
      <nav aria-label="Breadcrumb" class="text-xs font-semibold text-slate-500 flex items-center gap-2">
        <a href="/" class="hover:text-brand-600">Home</a>
        <span>/</span>
        <a href="/blog" class="hover:text-brand-600">Blog</a>
        <span>/</span>
        <span class="text-slate-900 font-bold truncate max-w-xs">${escapeHtml(post.title)}</span>
      </nav>

      <article class="bg-white rounded-3xl border border-slate-200 p-8 sm:p-12 shadow-soft space-y-8">
        <div class="space-y-4 pb-6 border-b border-slate-100">
          <span class="text-xs font-bold px-3 py-1 rounded-full bg-brand-50 text-brand-700">${escapeHtml(post.category)}</span>
          <h1 class="text-3xl sm:text-4xl font-extrabold text-slate-900 leading-tight">${escapeHtml(post.title)}</h1>
          <div class="flex flex-wrap items-center gap-4 text-xs text-slate-400">
            <span>By ${escapeHtml(post.author)}</span>
            <span>•</span>
            <span>${escapeHtml(post.readTime)}</span>
            <span>•</span>
            <span>${escapeHtml(post.publishedDate)}</span>
          </div>
        </div>

        <div class="prose prose-slate max-w-none space-y-5 text-sm sm:text-base text-slate-700 leading-relaxed">
          ${post.content.map((p) => `<p>${escapeHtml(p)}</p>`).join('')}
        </div>

        <div class="mt-8 p-6 bg-gradient-to-r from-rose-50 to-amber-50 rounded-2xl border border-rose-200/60 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <h4 class="font-extrabold text-base text-slate-900">Ready to try this tool now?</h4>
            <p class="text-xs text-slate-600 mt-0.5">100% free, browser-powered with zero file retention.</p>
          </div>
          <a href="${post.targetToolPath}" class="px-6 py-2.5 rounded-xl font-bold text-xs bg-brand-600 hover:bg-brand-700 text-white shadow-xs inline-block">
            Launch Tool
          </a>
        </div>
      </article>
    </div>
  </div>`;

  let html = cleanBaseTemplate(baseTemplate);
  html = html.replace(/<title>.*?<\/title>/i, `<title>${escapeHtml(title)}</title>`);

  const headInjections = `
    <meta name="description" content="${escapeHtml(description)}" />
    <link rel="canonical" href="${canonicalUrl}" />
    <meta property="og:type" content="article" />
    <meta property="og:url" content="${canonicalUrl}" />
    <meta property="og:title" content="${escapeHtml(title)}" />
    <meta property="og:description" content="${escapeHtml(description)}" />
    <meta property="og:image" content="${SITE_URL}/logo.svg" />
    <meta property="og:site_name" content="SimplePDF" />
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:url" content="${canonicalUrl}" />
    <meta name="twitter:title" content="${escapeHtml(title)}" />
    <meta name="twitter:description" content="${escapeHtml(description)}" />
    <meta name="twitter:image" content="${SITE_URL}/logo.svg" />
    <script type="application/ld+json" id="seo-json-ld">
${JSON.stringify([articleSchema, breadcrumbSchema], null, 2)}
    </script>
  </head>`;

  html = html.replace(/<\/head>/i, headInjections);
  html = html.replace(/<div id="root"[^>]*>([\s\S]*?)<\/div>/i, `<div id="root">${preRenderedBody}</div>`);
  return html;
}

// 3. FAQ Page Prerender Function
function generateFaqPageHtml() {
  const canonicalUrl = `${SITE_URL}/faq`;
  const title = `Frequently Asked Questions & Support | SimplePDF`;
  const description = `Find clear answers to questions about SimplePDF tools, privacy guarantees, in-browser WebAssembly security, file retention limits, and subscriptions.`;

  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: GLOBAL_FAQS.map((f) => ({
      '@type': 'Question',
      name: f.q,
      acceptedAnswer: {
        '@type': 'Answer',
        text: f.a,
      },
    })),
  };

  const preRenderedBody = `
  <div class="py-16 bg-slate-50 min-h-screen" data-prerendered="true">
    <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
      <div class="text-center space-y-3">
        <h1 class="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">Frequently Asked Questions</h1>
        <p class="text-slate-600 text-sm max-w-md mx-auto">Find answers to commonly asked questions about tools, file security, and subscription plans.</p>
      </div>
      <div class="space-y-4">
        ${GLOBAL_FAQS.map(
          (faq) => `
        <div class="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs">
          <h2 class="font-bold text-base text-slate-900">${escapeHtml(faq.q)}</h2>
          <p class="text-sm text-slate-600 mt-2 leading-relaxed">${escapeHtml(faq.a)}</p>
        </div>`
        ).join('')}
      </div>
    </div>
  </div>`;

  let html = cleanBaseTemplate(baseTemplate);
  html = html.replace(/<title>.*?<\/title>/i, `<title>${escapeHtml(title)}</title>`);

  const headInjections = `
    <meta name="description" content="${escapeHtml(description)}" />
    <link rel="canonical" href="${canonicalUrl}" />
    <meta property="og:type" content="website" />
    <meta property="og:url" content="${canonicalUrl}" />
    <meta property="og:title" content="${escapeHtml(title)}" />
    <meta property="og:description" content="${escapeHtml(description)}" />
    <meta property="og:image" content="${SITE_URL}/logo.svg" />
    <script type="application/ld+json" id="seo-json-ld">
${JSON.stringify([faqSchema], null, 2)}
    </script>
  </head>`;

  html = html.replace(/<\/head>/i, headInjections);
  html = html.replace(/<div id="root"[^>]*>([\s\S]*?)<\/div>/i, `<div id="root">${preRenderedBody}</div>`);
  return html;
}

// 4. Dedicated 404 Page Prerender Function
function generateNotFoundHtml() {
  const title = `404 — Page Not Found | SimplePDF`;
  const description = `The page you are looking for could not be found. Explore our 32 free online PDF tools.`;

  const preRenderedBody = `
  <div class="min-h-[80vh] flex flex-col justify-center py-16 px-4 sm:px-6 lg:px-8 bg-slate-50" data-prerendered="true">
    <div class="max-w-3xl mx-auto text-center space-y-6">
      <div class="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-rose-50 border border-rose-200 text-rose-700 text-xs font-bold">
        <span>Error 404</span>
        <span>•</span>
        <span>Resource Not Found</span>
      </div>
      <h1 class="text-4xl sm:text-6xl font-black text-slate-900 tracking-tight">Page Not Found</h1>
      <p class="text-base sm:text-lg text-slate-600 max-w-xl mx-auto leading-relaxed">
        The link you followed may be broken, or the page may have been moved or removed.
      </p>
      <div class="pt-4 flex flex-wrap items-center justify-center gap-3">
        <a href="/" class="px-6 py-3 rounded-xl bg-brand-600 text-white font-bold text-sm shadow-soft">Back to Home</a>
        <a href="/#tools" class="px-6 py-3 rounded-xl bg-white border border-slate-200 text-slate-700 font-bold text-sm shadow-2xs">Explore All 32 Tools</a>
      </div>
    </div>
  </div>`;

  let html = cleanBaseTemplate(baseTemplate);
  html = html.replace(/<title>.*?<\/title>/i, `<title>${escapeHtml(title)}</title>`);
  const headInjections = `
    <meta name="description" content="${escapeHtml(description)}" />
    <meta name="robots" content="noindex, follow" />
  </head>`;
  html = html.replace(/<\/head>/i, headInjections);
  html = html.replace(/<div id="root"[^>]*>([\s\S]*?)<\/div>/i, `<div id="root">${preRenderedBody}</div>`);
  return html;
}

// A. Generate All Tool Pages (32 tools × 8 languages = 256 files)
for (const tool of ALL_TOOLS) {
  for (const lang of publishedLangs) {
    const isDefault = lang.code === DEFAULT_LANGUAGE;
    const targetDir = isDefault
      ? path.join(DIST_DIR, tool.path.replace(/^\//, ''))
      : path.join(DIST_DIR, lang.code, tool.path.replace(/^\//, ''));

    if (!fs.existsSync(targetDir)) {
      fs.mkdirSync(targetDir, { recursive: true });
    }

    const htmlContent = generateToolPageHtml(tool, lang.code);
    fs.writeFileSync(path.join(targetDir, 'index.html'), htmlContent, 'utf-8');
    totalGenerated++;
  }
}

// B. Generate All Blog Post Pages (4 posts)
for (const post of BLOG_POSTS) {
  const targetDir = path.join(DIST_DIR, 'blog', post.slug);
  if (!fs.existsSync(targetDir)) {
    fs.mkdirSync(targetDir, { recursive: true });
  }
  const htmlContent = generateBlogPostHtml(post);
  fs.writeFileSync(path.join(targetDir, 'index.html'), htmlContent, 'utf-8');
  totalGenerated++;
}

// C. Generate /faq Page
const faqDir = path.join(DIST_DIR, 'faq');
if (!fs.existsSync(faqDir)) {
  fs.mkdirSync(faqDir, { recursive: true });
}
fs.writeFileSync(path.join(faqDir, 'index.html'), generateFaqPageHtml(), 'utf-8');
totalGenerated++;

// D. Generate 404.html
fs.writeFileSync(path.join(DIST_DIR, '404.html'), generateNotFoundHtml(), 'utf-8');
totalGenerated++;

console.log(`\n✅ Generated ${totalGenerated} fully prerendered static HTML files into frontend/dist/!`);
console.log(`   - 256 Multilingual Tool Pages (all 32 tools)`);
console.log(`   - ${BLOG_POSTS.length} Blog Post Pages`);
console.log(`   - /faq with FAQPage JSON-LD schema`);
console.log(`   - Custom 404.html error page`);
