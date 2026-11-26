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

      ${
        rawTool.seoKeywords && rawTool.seoKeywords.length > 0
          ? `
      <section aria-label="Popular Searches" class="bg-white rounded-3xl border border-slate-200 p-6 space-y-3">
        <h4 class="text-xs font-bold uppercase tracking-wider text-slate-400">Popular Searches &amp; Queries</h4>
        <div class="flex flex-wrap gap-2">
          ${rawTool.seoKeywords
            .map(
              (k) =>
                `<span class="px-3 py-1.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-600 text-xs font-medium">${escapeHtml(
                  k
                )}</span>`
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

  const isComingSoon = rawTool.status === 'coming-soon';
  const robotsDirective = isComingSoon
    ? 'noindex, follow'
    : 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1';

  const headInjections = `
    <meta name="description" content="${escapeHtml(description)}" />
    <meta name="keywords" content="${escapeHtml(rawTool.seoKeywords ? rawTool.seoKeywords.join(', ') : '')}" />
    <link rel="canonical" href="${canonicalUrl}" />
    <meta name="robots" content="${robotsDirective}" />
    <meta name="googlebot" content="${robotsDirective}" />
    <meta name="bingbot" content="${robotsDirective}" />
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
    <meta name="keywords" content="${escapeHtml(post.title)}, pdf tutorial, ${escapeHtml(post.category)}, free pdf tools, simplepdf" />
    <link rel="canonical" href="${canonicalUrl}" />
    <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" />
    <meta name="googlebot" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" />
    <meta name="bingbot" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" />
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
function generateFaqPageHtml(langCode = 'en') {
  const isDefault = langCode === DEFAULT_LANGUAGE;
  const localizedPath = isDefault ? '/faq' : `/${langCode}/faq`;
  const canonicalUrl = `${SITE_URL}${localizedPath}`;
  const rtl = isRTL(langCode);
  const title = `Frequently Asked Questions & Support | SimplePDF`;
  const description = `Find clear answers to questions about SimplePDF tools, privacy guarantees, in-browser WebAssembly security, file retention limits, and subscriptions.`;

  const hreflangTags = publishedLangs
    .map((l) => {
      const altPath = l.code === DEFAULT_LANGUAGE ? '/faq' : `/${l.code}/faq`;
      return `    <link rel="alternate" hreflang="${l.code}" href="${SITE_URL}${altPath}" />`;
    })
    .join('\n');
  const xDefaultTag = `    <link rel="alternate" hreflang="x-default" href="${SITE_URL}/faq" />`;

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
  html = html.replace(/<html[^>]*>/i, `<html lang="${langCode}" dir="${rtl ? 'rtl' : 'ltr'}">`);
  html = html.replace(/<title>.*?<\/title>/i, `<title>${escapeHtml(title)}</title>`);

  const headInjections = `
    <meta name="description" content="${escapeHtml(description)}" />
    <meta name="keywords" content="simplepdf faq, frequently asked questions, pdf tools support, pdf security, file retention" />
    <link rel="canonical" href="${canonicalUrl}" />
    <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" />
    <meta name="googlebot" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" />
    <meta name="bingbot" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" />
${hreflangTags}
${xDefaultTag}
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

// 5. Standard Public Static Page Helper
function generatePublicPageHtml({ pagePath, title, description, breadcrumbName, bodyHtml, langCode = 'en' }) {
  const isDefault = langCode === DEFAULT_LANGUAGE;
  const localizedPath = isDefault ? pagePath : `/${langCode}${pagePath}`;
  const canonicalUrl = `${SITE_URL}${localizedPath}`;
  const rtl = isRTL(langCode);

  const hreflangTags = publishedLangs
    .map((l) => {
      const altPath = l.code === DEFAULT_LANGUAGE ? pagePath : `/${l.code}${pagePath}`;
      return `    <link rel="alternate" hreflang="${l.code}" href="${SITE_URL}${altPath}" />`;
    })
    .join('\n');
  const xDefaultTag = `    <link rel="alternate" hreflang="x-default" href="${SITE_URL}${pagePath}" />`;

  const webPageSchema = {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name: title,
    url: canonicalUrl,
    description: description,
    inLanguage: langCode,
  };

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: `${SITE_URL}${isDefault ? '/' : `/${langCode}`}` },
      { '@type': 'ListItem', position: 2, name: breadcrumbName, item: canonicalUrl },
    ],
  };

  let html = cleanBaseTemplate(baseTemplate);
  html = html.replace(/<html[^>]*>/i, `<html lang="${langCode}" dir="${rtl ? 'rtl' : 'ltr'}">`);
  html = html.replace(/<title>.*?<\/title>/i, `<title>${escapeHtml(title)}</title>`);

  const headInjections = `
    <meta name="description" content="${escapeHtml(description)}" />
    <meta name="keywords" content="simplepdf, free online pdf tools, merge pdf, compress pdf, convert pdf, online pdf editor, pdf security" />
    <link rel="canonical" href="${canonicalUrl}" />
    <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" />
    <meta name="googlebot" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" />
    <meta name="bingbot" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" />
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
${JSON.stringify([webPageSchema, breadcrumbSchema], null, 2)}
    </script>
  </head>`;

  html = html.replace(/<\/head>/i, headInjections);
  html = html.replace(/<div id="root"[^>]*>([\s\S]*?)<\/div>/i, `<div id="root">${bodyHtml}</div>`);
  return html;
}

// 6. Privacy Policy Prerender HTML
function generatePrivacyPageHtml(langCode = 'en') {
  const bodyHtml = `
  <div class="py-16 bg-slate-50 min-h-screen" data-prerendered="true">
    <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
      <div class="space-y-4">
        <nav aria-label="Breadcrumb" class="text-xs font-semibold text-slate-500 flex items-center gap-2">
          <a href="/" class="hover:text-brand-600">Home</a>
          <span>/</span>
          <span class="text-slate-900 font-bold">Privacy Policy</span>
        </nav>
        <div class="flex flex-wrap items-center gap-2">
          <span class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-bold">
            Zero-Retention Architecture
          </span>
          <span class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-blue-700 text-xs font-bold">
            GDPR &amp; CCPA Compliant
          </span>
          <span class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 border border-amber-200 text-amber-700 text-xs font-bold">
            TLS 1.3 Encryption
          </span>
        </div>
        <h1 class="text-3xl sm:text-5xl font-black text-slate-900 tracking-tight leading-tight">Privacy Policy</h1>
        <p class="text-slate-500 text-sm">
          Effective Date: November 2026 • SimplePDF Platform (<a href="https://simplepdf.me" class="text-brand-600 hover:underline">https://simplepdf.me</a>)
        </p>
      </div>

      <div class="bg-gradient-to-r from-emerald-500/10 via-brand-500/10 to-blue-500/10 border border-emerald-500/20 rounded-3xl p-6 sm:p-8 space-y-3">
        <h2 class="text-emerald-800 font-bold text-base">Executive Privacy Commitment</h2>
        <p class="text-xs sm:text-sm text-slate-700 leading-relaxed">
          At SimplePDF, we believe that everyday document tools should never compromise personal or corporate privacy.
          Over 70% of our operations execute 100% in your local web browser using client-side WebAssembly—your files never reach any server.
          For server-rendered conversions (such as OCR or Word conversion), files are automatically shredded and permanently unlinked within 60 minutes.
          We do not sell, monetize, inspect, or feed your documents into artificial intelligence training sets.
        </p>
      </div>

      <div class="bg-white rounded-3xl border border-slate-200 p-8 sm:p-12 space-y-8 text-sm text-slate-700 leading-relaxed shadow-soft">
        <section class="space-y-3">
          <h2 class="text-xl font-bold text-slate-900">1. Overview &amp; Data Controller Information</h2>
          <p>This Privacy Policy explains how SimplePDF (&quot;we,&quot; &quot;our,&quot; or &quot;us&quot;) protects your information. The data controller responsible for personal data under the EU GDPR is the SimplePDF Privacy Team (<code class="bg-slate-100 text-brand-600 px-2 py-0.5 rounded font-mono font-semibold">privacy@simplepdf.me</code>).</p>
        </section>
        <section class="space-y-3">
          <h2 class="text-xl font-bold text-slate-900">2. In-Browser Client Execution (Edge Privacy)</h2>
          <p>For client-side operations including Merge, Split, Rotate, Organize, Watermark, Page Numbers, Protect, Unlock, Sign, Crop, and Edit PDF, all document rendering, parsing, modification, and output generation take place entirely within your browser&apos;s sandboxed memory via compiled WebAssembly (WASM). Your files are never uploaded across the network.</p>
        </section>
        <section class="space-y-3">
          <h2 class="text-xl font-bold text-slate-900">3. Ephemeral Storage &amp; Cryptographic Auto-Shredding</h2>
          <p>Server-rendered conversions (OCR, Microsoft Office conversions, corrupted PDF repair) are protected in flight via TLS 1.3 256-bit encryption. Files are written to ephemeral volumes with non-deterministic UUIDv4 identifiers, and an automated background shredder daemon permanently unlinks and overwrites (DoD 5220.22-M zero-fill) files within 60 minutes or immediately upon download completion.</p>
        </section>
        <section class="space-y-3">
          <h2 class="text-xl font-bold text-slate-900">4. Advertising &amp; Google AdSense Disclosures</h2>
          <p>SimplePDF displays digital advertisements served by Google AdSense to fund free infrastructure. Google uses cookies (including the DoubleClick DART cookie) to serve ads based on user visits to this and other websites. Users may opt out of personalized advertising by visiting Google Ads Settings (<a href="https://adssettings.google.com" target="_blank" rel="noopener noreferrer" class="text-brand-600 underline">adssettings.google.com</a>) or www.aboutads.info.</p>
        </section>
        <section class="space-y-3">
          <h2 class="text-xl font-bold text-slate-900">5. European GDPR User Rights (Articles 15-21)</h2>
          <p>Under the EU and UK General Data Protection Regulation, individuals possess statutory rights including the Right of Access, Rectification, Erasure, Restriction of Processing, Data Portability, and Right to Object. Exercise your rights anytime by contacting <code class="bg-slate-100 text-brand-600 px-2 py-0.5 rounded font-mono font-semibold">privacy@simplepdf.me</code>.</p>
        </section>
        <section class="space-y-3">
          <h2 class="text-xl font-bold text-slate-900">6. California Consumer Privacy Act (CCPA / CPRA)</h2>
          <p>California residents have the right to know what personal information is collected, request deletion, and opt out of the sale or sharing of personal information. SimplePDF does not sell personal information or file data to data brokers or third parties.</p>
        </section>
      </div>
    </div>
  </div>`;

  return generatePublicPageHtml({
    pagePath: '/privacy',
    title: 'Privacy Policy & Zero-Retention Data Protection | SimplePDF',
    description: 'Learn how SimplePDF protects your documents with client-side WebAssembly, zero file retention, automatic shredding, and full GDPR/CCPA compliance.',
    breadcrumbName: 'Privacy Policy',
    bodyHtml,
    langCode,
  });
}

// 7. Terms of Service Prerender HTML
function generateTermsPageHtml(langCode = 'en') {
  const bodyHtml = `
  <div class="py-16 bg-slate-50 min-h-screen" data-prerendered="true">
    <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
      <div class="space-y-4">
        <nav aria-label="Breadcrumb" class="text-xs font-semibold text-slate-500 flex items-center gap-2">
          <a href="/" class="hover:text-brand-600">Home</a>
          <span>/</span>
          <span class="text-slate-900 font-bold">Terms of Service</span>
        </nav>
        <div class="flex flex-wrap items-center gap-2">
          <span class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-bold">
            100% Free Online Suite
          </span>
          <span class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-blue-700 text-xs font-bold">
            100% User Document Ownership
          </span>
          <span class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-50 border border-purple-200 text-purple-700 text-xs font-bold">
            Zero Document Licensing
          </span>
        </div>
        <h1 class="text-3xl sm:text-5xl font-black text-slate-900 tracking-tight leading-tight">Terms of Service</h1>
        <p class="text-slate-500 text-sm">
          Effective Date: November 2026 • SimplePDF Platform (<a href="https://simplepdf.me" class="text-brand-600 hover:underline">https://simplepdf.me</a>)
        </p>
      </div>

      <div class="bg-gradient-to-r from-blue-500/10 via-brand-500/10 to-emerald-500/10 border border-blue-500/20 rounded-3xl p-6 sm:p-8 space-y-3">
        <h2 class="text-blue-900 font-bold text-base">Plain-English Summary of Your Rights</h2>
        <p class="text-xs sm:text-sm text-slate-700 leading-relaxed">
          Welcome to SimplePDF. All 32+ PDF editing, conversion, compression, and security tools are completely free without requiring an account, subscription, or credit card.
          You retain 100% absolute ownership and copyright over all documents and files processed on SimplePDF.
          We claim zero rights or license to your files, do not inspect their contents, and never feed your data into AI models.
        </p>
      </div>

      <div class="bg-white rounded-3xl border border-slate-200 p-8 sm:p-12 space-y-8 text-sm text-slate-700 leading-relaxed shadow-soft">
        <section class="space-y-3">
          <h2 class="text-xl font-bold text-slate-900">1. Acceptance of Terms &amp; Eligibility</h2>
          <p>By accessing or using SimplePDF, you agree to be bound by these Terms and our Privacy Policy. You must be at least 13 years of age to use the service.</p>
        </section>
        <section class="space-y-3">
          <h2 class="text-xl font-bold text-slate-900">2. Free Service Model &amp; No Registration Mandate</h2>
          <p>All core productivity workflows are accessible without subscription paywalls, registration, or credit card information.</p>
        </section>
        <section class="space-y-3">
          <h2 class="text-xl font-bold text-slate-900">3. Document Ownership &amp; Absolute Zero-License Guarantee</h2>
          <p>You retain 100% sole ownership, title, copyright, and intellectual property rights to all documents processed on SimplePDF. SimplePDF claims zero license, zero rights, and never utilizes user documents for machine learning training.</p>
        </section>
        <section class="space-y-3">
          <h2 class="text-xl font-bold text-slate-900">4. Acceptable Use Policy (AUP)</h2>
          <p>Users must not upload malware, viruses, CSAM, or illegal materials, violate third-party intellectual property, or employ high-frequency bot scrapers that overwhelm server capacity.</p>
        </section>
        <section class="space-y-3">
          <h2 class="text-xl font-bold text-slate-900">5. Disclaimer of Warranties &amp; Limitation of Liability</h2>
          <p>The platform is provided on an &quot;as is&quot; and &quot;as available&quot; basis without warranties of any kind. SimplePDF disclaims all liability for indirect or consequential damages, and total liability shall not exceed fifty US dollars ($50.00 USD).</p>
        </section>
        <section class="space-y-3">
          <h2 class="text-xl font-bold text-slate-900">6. Legal &amp; Abuse Contact</h2>
          <p>For legal inquiries, contact <code class="bg-slate-100 text-brand-600 px-2 py-0.5 rounded font-mono font-semibold">legal@simplepdf.me</code>. For abuse or copyright notifications, email <code class="bg-slate-100 text-brand-600 px-2 py-0.5 rounded font-mono font-semibold">abuse@simplepdf.me</code>.</p>
        </section>
      </div>
    </div>
  </div>`;

  return generatePublicPageHtml({
    pagePath: '/terms',
    title: 'Terms of Service & Document Ownership Agreement | SimplePDF',
    description: 'Read the SimplePDF Terms of Service. 100% free online PDF suite, zero document licensing, full user copyright ownership, and acceptable use terms.',
    breadcrumbName: 'Terms of Service',
    bodyHtml,
    langCode,
  });
}

// 8. Cookie Policy Prerender HTML
function generateCookiesPageHtml(langCode = 'en') {
  const bodyHtml = `
  <div class="py-16 bg-slate-50 min-h-screen" data-prerendered="true">
    <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
      <div class="space-y-4">
        <nav aria-label="Breadcrumb" class="text-xs font-semibold text-slate-500 flex items-center gap-2">
          <a href="/" class="hover:text-brand-600">Home</a>
          <span>/</span>
          <span class="text-slate-900 font-bold">Cookie Policy</span>
        </nav>
        <div class="flex flex-wrap items-center gap-2">
          <span class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 border border-amber-200 text-amber-800 text-xs font-bold">
            Cookie &amp; Storage Transparency
          </span>
          <span class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-bold">
            ePrivacy Directive &amp; GDPR Compliant
          </span>
          <span class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-blue-700 text-xs font-bold">
            CCPA / CPRA Ready
          </span>
        </div>
        <h1 class="text-3xl sm:text-5xl font-black text-slate-900 tracking-tight leading-tight">Cookie Policy</h1>
        <p class="text-slate-500 text-sm">
          Effective Date: November 2026 • SimplePDF Platform (<a href="https://simplepdf.me" class="text-brand-600 hover:underline">https://simplepdf.me</a>)
        </p>
      </div>

      <div class="bg-gradient-to-r from-amber-500/10 via-brand-500/10 to-blue-500/10 border border-amber-500/20 rounded-3xl p-6 sm:p-8 space-y-3">
        <h2 class="text-amber-900 font-bold text-base">Zero Document Tracking Commitment</h2>
        <p class="text-xs sm:text-sm text-slate-700 leading-relaxed">
          At SimplePDF, we believe that transparency is paramount.
          We use minimal cookies and local device storage strictly to remember your interface preferences (such as selected language and theme), ensure infrastructure security, measure anonymized traffic velocity, and deliver non-intrusive digital advertisements to keep our 32+ tools 100% free for everyone.
          Your PDF files, document text, and uploaded data are NEVER tracked, indexed, or stored in cookies.
        </p>
      </div>

      <div class="bg-white rounded-3xl border border-slate-200 p-8 sm:p-12 space-y-8 text-sm text-slate-700 leading-relaxed shadow-soft">
        <section class="space-y-3">
          <h2 class="text-xl font-bold text-slate-900">1. Comprehensive Cookie &amp; Storage Inventory</h2>
          <div class="overflow-x-auto border border-slate-200 rounded-2xl">
            <table class="w-full text-left text-xs text-slate-600">
              <thead class="bg-slate-50 text-slate-800 font-bold border-b border-slate-200 uppercase text-[11px]">
                <tr>
                  <th class="py-2.5 px-3">Identifier</th>
                  <th class="py-2.5 px-3">Category</th>
                  <th class="py-2.5 px-3">Purpose</th>
                  <th class="py-2.5 px-3">Storage Type</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-slate-100">
                <tr><td class="py-2.5 px-3 font-mono font-bold">simplepdf_lang</td><td class="py-2.5 px-3">Functional</td><td class="py-2.5 px-3">Stores UI language choice</td><td class="py-2.5 px-3">LocalStorage</td></tr>
                <tr><td class="py-2.5 px-3 font-mono font-bold">simplepdf_history</td><td class="py-2.5 px-3">Functional</td><td class="py-2.5 px-3">Recent task history stored on client device only</td><td class="py-2.5 px-3">LocalStorage</td></tr>
                <tr><td class="py-2.5 px-3 font-mono font-bold">cf_clearance / __cf_bm</td><td class="py-2.5 px-3">Security</td><td class="py-2.5 px-3">Cloudflare bot mitigation and anti-DDoS</td><td class="py-2.5 px-3">HTTP Cookie</td></tr>
                <tr><td class="py-2.5 px-3 font-mono font-bold">_ga / _ga_*</td><td class="py-2.5 px-3">Analytics</td><td class="py-2.5 px-3">Google Analytics 4 anonymized aggregated telemetry</td><td class="py-2.5 px-3">HTTP Cookie</td></tr>
                <tr><td class="py-2.5 px-3 font-mono font-bold">__gads / __gpi / IDE</td><td class="py-2.5 px-3">Advertising</td><td class="py-2.5 px-3">Google AdSense ad delivery and frequency capping</td><td class="py-2.5 px-3">HTTP Cookie</td></tr>
              </tbody>
            </table>
          </div>
        </section>

        <section class="space-y-3">
          <h2 class="text-xl font-bold text-slate-900">2. How to Control &amp; Opt Out of Cookies</h2>
          <p>You can manage, block, or delete cookies directly in your browser settings (Google Chrome, Firefox, Safari, Microsoft Edge). Furthermore, opt out of third-party advertising cookies via the Digital Advertising Alliance (<a href="https://optout.aboutads.info" target="_blank" rel="noopener noreferrer" class="text-brand-600 underline">optout.aboutads.info</a>) or European Interactive Digital Advertising Alliance (<a href="https://www.youronlinechoices.eu" target="_blank" rel="noopener noreferrer" class="text-brand-600 underline">youronlinechoices.eu</a>).</p>
        </section>

        <section class="space-y-3">
          <h2 class="text-xl font-bold text-slate-900">3. Privacy Contact</h2>
          <p>Have questions regarding our cookie practices? Contact our Data Protection Officer at: <code class="bg-slate-100 text-brand-600 px-2 py-0.5 rounded font-mono font-semibold">privacy@simplepdf.me</code>.</p>
        </section>
      </div>
    </div>
  </div>`;

  return generatePublicPageHtml({
    pagePath: '/cookies',
    title: 'Cookie Policy & Local Storage Transparency | SimplePDF',
    description: 'Discover how SimplePDF uses minimal cookies and local storage for interface preferences and AdSense ads. Learn how to manage or disable cookies.',
    breadcrumbName: 'Cookie Policy',
    bodyHtml,
    langCode,
  });
}

// 9. Pricing Page Prerender HTML
function generatePricingPageHtml(langCode = 'en') {
  const bodyHtml = `
  <div class="py-16 bg-slate-50 min-h-screen" data-prerendered="true">
    <div class="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
      <div class="text-center space-y-4 max-w-2xl mx-auto">
        <span class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-bold">
          100% Free Forever
        </span>
        <h1 class="text-3xl sm:text-5xl font-black text-slate-900 tracking-tight">SimplePDF Pricing — 100% Free Online PDF Tools</h1>
        <p class="text-slate-600 text-sm sm:text-base">All 32+ PDF editing, conversion, compression, and security tools are completely free to use with zero registration or payment required.</p>
      </div>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
        <div class="bg-white rounded-3xl border-2 border-brand-500 p-8 shadow-soft space-y-6">
          <div class="space-y-2">
            <span class="px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-extrabold">100% Free Forever</span>
            <h2 class="text-2xl font-black text-slate-900">Free Tier</h2>
            <div class="text-3xl font-black text-slate-900">$0 <span class="text-sm font-medium text-slate-500">/ forever</span></div>
            <p class="text-xs text-slate-600">Zero cost, no credit card, no account required. Access all 32+ tools directly in your browser.</p>
          </div>
          <ul class="space-y-2.5 text-xs text-slate-700">
            <li>✓ All 32+ PDF Tools (Merge, Split, OCR, Compress, Convert)</li>
            <li>✓ Up to 50MB per file allowance</li>
            <li>✓ In-Browser WebAssembly Edge Processing with Zero Retention</li>
            <li>✓ Instant conversions without sign-up</li>
            <li>✓ Mobile, tablet &amp; desktop browser support</li>
          </ul>
          <a href="/#tools" class="block w-full text-center py-3 rounded-xl bg-brand-600 text-white font-bold text-sm shadow-xs">Explore All 32 Tools Free</a>
        </div>
        <div class="bg-white rounded-3xl border border-slate-200 p-8 shadow-soft space-y-6">
          <div class="space-y-2">
            <span class="px-3 py-1 rounded-full bg-brand-50 text-brand-700 text-xs font-extrabold">Pro Tier</span>
            <h2 class="text-2xl font-black text-slate-900">Pro Power</h2>
            <div class="text-3xl font-black text-slate-900">$4.99 <span class="text-sm font-medium text-slate-500">/ month</span></div>
            <p class="text-xs text-slate-600">For high-volume business workflows, large batch archives, and ad-free productivity.</p>
          </div>
          <ul class="space-y-2.5 text-xs text-slate-700">
            <li>✓ Everything in Free Plan</li>
            <li>✓ Up to 200MB file size allowance</li>
            <li>✓ Unlimited batch processing queue</li>
            <li>✓ Priority high-speed cloud OCR clusters</li>
            <li>✓ 100% Ad-Free clean interface</li>
          </ul>
          <a href="/#tools" class="block w-full text-center py-3 rounded-xl bg-slate-100 text-slate-700 font-bold text-sm hover:bg-slate-200">Start Free</a>
        </div>
      </div>
    </div>
  </div>`;

  return generatePublicPageHtml({
    pagePath: '/pricing',
    title: 'SimplePDF Pricing — 100% Free Unlimited Online PDF Tools',
    description: 'SimplePDF is 100% free with no credit card required. Explore 32+ fast in-browser and cloud PDF tools with zero file retention and instant processing.',
    breadcrumbName: 'Pricing',
    bodyHtml,
    langCode,
  });
}

// 10. Security Architecture Prerender HTML
function generateSecurityPageHtml(langCode = 'en') {
  const bodyHtml = `
  <div class="py-16 bg-slate-50 min-h-screen" data-prerendered="true">
    <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
      <div class="space-y-4">
        <nav aria-label="Breadcrumb" class="text-xs font-semibold text-slate-500 flex items-center gap-2">
          <a href="/" class="hover:text-brand-600">Home</a>
          <span>/</span>
          <span class="text-slate-900 font-bold">Security Architecture</span>
        </nav>
        <span class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-bold">
          Document Protection Architecture
        </span>
        <h1 class="text-3xl sm:text-5xl font-black text-slate-900 tracking-tight">Security &amp; Data Protection Architecture</h1>
        <p class="text-slate-500 text-sm">Detailed technical overview of encryption protocols, ephemeral storage, and client-side processing.</p>
      </div>
      <div class="bg-white rounded-3xl border border-slate-200 p-8 sm:p-12 space-y-8 text-sm text-slate-700 leading-relaxed shadow-soft">
        <section class="space-y-3">
          <h2 class="text-xl font-bold text-slate-900">1. Client-Side WebAssembly Processing (Edge Privacy)</h2>
          <p>SimplePDF executes document parsing, page manipulation, rotation, merging, and cryptographic signing inside your browser sandbox using compiled WebAssembly. Files never traverse public network connections for client-side operations.</p>
        </section>
        <section class="space-y-3">
          <h2 class="text-xl font-bold text-slate-900">2. Ephemeral Storage with Automated Cryptographic Shredding</h2>
          <p>When server-side processing is necessary (OCR text recognition, complex Office document conversions), files are assigned non-deterministic UUIDv4 tokens. Background shredder daemons permanently zero-fill and delete files within 60 minutes or instantly following download completion.</p>
        </section>
        <section class="space-y-3">
          <h2 class="text-xl font-bold text-slate-900">3. End-to-End Transport Layer Security (TLS 1.3 256-Bit)</h2>
          <p>All network traffic is encrypted via TLS 1.3 with 256-bit keys, ensuring protection against eavesdropping or man-in-the-middle attacks.</p>
        </section>
      </div>
    </div>
  </div>`;

  return generatePublicPageHtml({
    pagePath: '/security',
    title: 'Security & Document Protection Architecture | SimplePDF',
    description: 'Explore the SimplePDF security architecture: client-side WebAssembly edge processing, TLS 1.3 encryption, and automated cryptographic shredding.',
    breadcrumbName: 'Security',
    bodyHtml,
    langCode,
  });
}

// 11. About Us Prerender HTML
function generateAboutPageHtml(langCode = 'en') {
  const bodyHtml = `
  <div class="py-16 bg-slate-50 min-h-screen" data-prerendered="true">
    <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
      <div class="text-center space-y-4">
        <span class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-50 border border-rose-200 text-brand-700 text-xs font-bold">
          Our Mission &amp; Story
        </span>
        <h1 class="text-4xl sm:text-5xl font-extrabold text-slate-900 tracking-tight">Document Productivity. Made Simple.</h1>
        <p class="text-slate-600 text-base sm:text-lg max-w-2xl mx-auto leading-relaxed">SimplePDF was created to solve everyday document frustration. We believe essential productivity tools should be fast, elegant, and uncompromisingly private.</p>
      </div>
      <div class="bg-white rounded-3xl border border-slate-200 p-8 sm:p-10 space-y-8 shadow-soft text-sm text-slate-700 leading-relaxed">
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
          <div class="p-6 rounded-2xl bg-slate-50 border border-slate-100 space-y-2">
            <h3 class="font-bold text-slate-900">Zero Server Lag</h3>
            <p class="text-xs text-slate-500">Core operations process directly inside your browser via WebAssembly.</p>
          </div>
          <div class="p-6 rounded-2xl bg-slate-50 border border-slate-100 space-y-2">
            <h3 class="font-bold text-slate-900">Guaranteed Privacy</h3>
            <p class="text-xs text-slate-500">Zero retention. No file hoarding. Ephemeral automatic shredding.</p>
          </div>
          <div class="p-6 rounded-2xl bg-slate-50 border border-slate-100 space-y-2">
            <h3 class="font-bold text-slate-900">Global Accessibility</h3>
            <p class="text-xs text-slate-500">Free access for students, teachers, freelancers, and businesses worldwide.</p>
          </div>
        </div>
        <p>Millions of people deal with PDF documents every day: compiling resumes, signing agreements, merging study notes, or shrinking file sizes for email. Yet traditional software is expensive, slow, and bloated. We re-engineered the PDF suite from the ground up: combining instant client-side execution for everyday privacy with high-speed cloud clusters for deep document conversions.</p>
      </div>
    </div>
  </div>`;

  return generatePublicPageHtml({
    pagePath: '/about',
    title: 'About SimplePDF — Document Productivity Made Simple',
    description: 'Discover the story behind SimplePDF: fast, elegant, and uncompromisingly private document productivity tools powered by WebAssembly.',
    breadcrumbName: 'About Us',
    bodyHtml,
    langCode,
  });
}

// 12. Contact Us Prerender HTML
function generateContactPageHtml(langCode = 'en') {
  const bodyHtml = `
  <div class="py-16 bg-slate-50 min-h-screen" data-prerendered="true">
    <div class="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
      <div class="text-center space-y-3">
        <span class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-50 border border-rose-200 text-brand-700 text-xs font-bold">
          Support &amp; Inquiries
        </span>
        <h1 class="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">Contact Us</h1>
        <p class="text-slate-600 text-sm max-w-md mx-auto">Have questions, feedback, or enterprise partnership inquiries? We would love to hear from you.</p>
      </div>
      <div class="bg-white rounded-3xl border border-slate-200 p-8 sm:p-10 shadow-soft space-y-6 text-sm text-slate-700">
        <p>Our dedicated support and engineering teams are ready to help with any inquiries, technical questions, bug reports, or feature recommendations.</p>
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
          <div class="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
            <h4 class="font-bold text-slate-900 text-xs">Customer Support &amp; Feedback</h4>
            <p class="text-xs text-brand-600 font-mono font-semibold">support@simplepdf.me</p>
          </div>
          <div class="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
            <h4 class="font-bold text-slate-900 text-xs">Privacy &amp; Data Protection Officer</h4>
            <p class="text-xs text-brand-600 font-mono font-semibold">privacy@simplepdf.me</p>
          </div>
        </div>
      </div>
    </div>
  </div>`;

  return generatePublicPageHtml({
    pagePath: '/contact',
    title: 'Contact SimplePDF — Support & Inquiries',
    description: 'Get in touch with the SimplePDF team for customer support, bug reports, feature requests, or enterprise partnership inquiries.',
    breadcrumbName: 'Contact Us',
    bodyHtml,
    langCode,
  });
}

// 13. Blog Index Prerender HTML
function generateBlogIndexHtml(langCode = 'en') {
  const bodyHtml = `
  <div class="py-16 bg-slate-50 min-h-screen" data-prerendered="true">
    <div class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
      <div class="text-center max-w-2xl mx-auto space-y-3">
        <span class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-50 border border-rose-200 text-brand-700 text-xs font-bold">
          Knowledge Base &amp; Guides
        </span>
        <h1 class="text-4xl sm:text-5xl font-extrabold text-slate-900 tracking-tight">SimplePDF Blog</h1>
        <p class="text-slate-600 text-sm sm:text-base">In-depth tutorials, workflow guides, and productivity tips for PDF editing, compression, OCR, and document privacy.</p>
      </div>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
        ${BLOG_POSTS.map(
          (post) => `
        <article class="bg-white rounded-3xl border border-slate-200 p-8 shadow-soft flex flex-col justify-between">
          <div class="space-y-4">
            <div class="flex items-center justify-between text-xs">
              <span class="font-bold px-2.5 py-1 rounded-full bg-slate-100 text-slate-700">${escapeHtml(post.category)}</span>
              <span class="text-slate-400">${escapeHtml(post.readTime)}</span>
            </div>
            <h2 class="text-xl font-extrabold text-slate-900 leading-snug">
              <a href="/blog/${post.slug}" class="hover:text-brand-600">${escapeHtml(post.title)}</a>
            </h2>
            <p class="text-slate-500 text-xs sm:text-sm leading-relaxed">${escapeHtml(post.excerpt)}</p>
          </div>
          <div class="pt-6 mt-6 border-t border-slate-100 flex items-center justify-between">
            <span class="text-xs text-slate-400">${escapeHtml(post.publishedDate)}</span>
            <a href="/blog/${post.slug}" class="text-xs font-bold text-brand-600 hover:text-brand-700">Read Article →</a>
          </div>
        </article>`
        ).join('')}
      </div>
    </div>
  </div>`;

  return generatePublicPageHtml({
    pagePath: '/blog',
    title: 'SimplePDF Blog — PDF Tutorials, Guides & Document Tips',
    description: 'Explore in-depth tutorials, workflow guides, and productivity tips for PDF editing, compression, OCR, and document privacy.',
    breadcrumbName: 'Blog',
    bodyHtml,
    langCode,
  });
}

// 14. Localized Home Page Prerender HTML
function generateHomePageHtml(langCode = 'en') {
  const isDefault = langCode === DEFAULT_LANGUAGE;
  const rtl = isRTL(langCode);
  const localizedPath = isDefault ? '/' : `/${langCode}`;
  const canonicalUrl = `${SITE_URL}${localizedPath}`;
  const title = `SimplePDF — 100% Free Online PDF Tools | Merge, Compress, Edit & Convert`;
  const description = `Every PDF tool you need, 100% free and easy to use. Merge, split, compress, convert, rotate, and edit PDF files in seconds with in-browser privacy.`;

  const hreflangTags = publishedLangs
    .map((l) => {
      const altPath = l.code === DEFAULT_LANGUAGE ? '/' : `/${l.code}`;
      return `    <link rel="alternate" hreflang="${l.code}" href="${SITE_URL}${altPath}" />`;
    })
    .join('\n');
  const xDefaultTag = `    <link rel="alternate" hreflang="x-default" href="${SITE_URL}/" />`;

  const webSiteSchema = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'SimplePDF',
    url: SITE_URL,
    description: description,
    inLanguage: langCode,
  };

  const organizationSchema = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'SimplePDF',
    url: SITE_URL,
    logo: `${SITE_URL}/logo.svg`,
  };

  const preRenderedBody = `
  <div class="min-h-screen bg-slate-50 py-12 px-4 sm:px-6 lg:px-8 ${rtl ? 'rtl' : 'ltr'}" data-prerendered="true">
    <div class="max-w-6xl mx-auto space-y-12">
      <header class="text-center space-y-4 max-w-3xl mx-auto">
        <h1 class="text-4xl sm:text-5xl font-black text-slate-900 tracking-tight">Every PDF Tool You Need, 100% Free</h1>
        <p class="text-base sm:text-lg text-slate-600 leading-relaxed">${escapeHtml(description)}</p>
      </header>
      <section aria-label="PDF Tools" class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        ${ALL_TOOLS.filter((tool) => tool.status !== 'coming-soon').map((tool) => {
          const locTool = getLocalizedTool(tool, langCode);
          const toolHref = isDefault ? tool.path : `/${langCode}${tool.path}`;
          return `
          <a href="${toolHref}" class="bg-white p-5 rounded-2xl border border-slate-200 hover:border-brand-500 hover:shadow-soft transition-all block">
            <h2 class="font-bold text-base text-slate-900">${escapeHtml(locTool.name)}</h2>
            <p class="text-xs text-slate-500 mt-1 line-clamp-2">${escapeHtml(locTool.description)}</p>
          </a>`;
        }).join('')}
      </section>
    </div>
  </div>`;

  let html = cleanBaseTemplate(baseTemplate);
  html = html.replace(/<html[^>]*>/i, `<html lang="${langCode}" dir="${rtl ? 'rtl' : 'ltr'}">`);
  html = html.replace(/<title>.*?<\/title>/i, `<title>${escapeHtml(title)}</title>`);

  const headInjections = `
    <meta name="description" content="${escapeHtml(description)}" />
    <meta name="keywords" content="simplepdf, free online pdf tools, merge pdf, compress pdf, convert pdf, edit pdf, split pdf" />
    <link rel="canonical" href="${canonicalUrl}" />
    <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" />
    <meta name="googlebot" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" />
    <meta name="bingbot" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" />
${hreflangTags}
${xDefaultTag}
    <meta property="og:type" content="website" />
    <meta property="og:url" content="${canonicalUrl}" />
    <meta property="og:title" content="${escapeHtml(title)}" />
    <meta property="og:description" content="${escapeHtml(description)}" />
    <meta property="og:image" content="${SITE_URL}/og-cover.png" />
    <meta property="og:site_name" content="SimplePDF" />
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:url" content="${canonicalUrl}" />
    <meta name="twitter:title" content="${escapeHtml(title)}" />
    <meta name="twitter:description" content="${escapeHtml(description)}" />
    <meta name="twitter:image" content="${SITE_URL}/og-cover.png" />
    <script type="application/ld+json" id="seo-json-ld">
${JSON.stringify([webSiteSchema, organizationSchema], null, 2)}
    </script>
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

// C. Generate /faq Pages (all languages)
for (const lang of publishedLangs) {
  const isDefault = lang.code === DEFAULT_LANGUAGE;
  const faqDir = isDefault ? path.join(DIST_DIR, 'faq') : path.join(DIST_DIR, lang.code, 'faq');
  if (!fs.existsSync(faqDir)) {
    fs.mkdirSync(faqDir, { recursive: true });
  }
  fs.writeFileSync(path.join(faqDir, 'index.html'), generateFaqPageHtml(lang.code), 'utf-8');
  totalGenerated++;
}

// D. Generate 404.html
fs.writeFileSync(path.join(DIST_DIR, '404.html'), generateNotFoundHtml(), 'utf-8');
totalGenerated++;

// E. Generate Static Public & Legal Pages (/privacy, /terms, /cookies, /pricing, /about, /contact, /security, /blog) across all languages
const publicPages = [
  { dir: 'privacy', generator: generatePrivacyPageHtml },
  { dir: 'terms', generator: generateTermsPageHtml },
  { dir: 'cookies', generator: generateCookiesPageHtml },
  { dir: 'pricing', generator: generatePricingPageHtml },
  { dir: 'about', generator: generateAboutPageHtml },
  { dir: 'contact', generator: generateContactPageHtml },
  { dir: 'security', generator: generateSecurityPageHtml },
  { dir: 'blog', generator: generateBlogIndexHtml },
];

for (const { dir, generator } of publicPages) {
  for (const lang of publishedLangs) {
    const isDefault = lang.code === DEFAULT_LANGUAGE;
    const targetDir = isDefault ? path.join(DIST_DIR, dir) : path.join(DIST_DIR, lang.code, dir);
    if (!fs.existsSync(targetDir)) {
      fs.mkdirSync(targetDir, { recursive: true });
    }
    fs.writeFileSync(path.join(targetDir, 'index.html'), generator(lang.code), 'utf-8');
    totalGenerated++;
  }
}

// E2. Generate Localized Home Pages (/es/index.html, /ar/index.html, etc.)
for (const lang of publishedLangs) {
  if (lang.code === DEFAULT_LANGUAGE) continue;
  const targetDir = path.join(DIST_DIR, lang.code);
  if (!fs.existsSync(targetDir)) {
    fs.mkdirSync(targetDir, { recursive: true });
  }
  fs.writeFileSync(path.join(targetDir, 'index.html'), generateHomePageHtml(lang.code), 'utf-8');
  totalGenerated++;
}

// F. Sync Crawler Assets (llms.txt, IndexNow key, rss.xml) to dist
const crawlerFiles = ['llms.txt', 'rss.xml', '8f4b23829c914e6dae76c338421b8c2d.txt'];
for (const cf of crawlerFiles) {
  const src = path.resolve(__dirname, '../frontend/public', cf);
  const dest = path.join(DIST_DIR, cf);
  if (fs.existsSync(src)) {
    fs.copyFileSync(src, dest);
  }
}

console.log(`\n✅ Generated ${totalGenerated} fully prerendered static HTML files into frontend/dist/!`);
console.log(`   - 256 Multilingual Tool Pages (all 32 tools)`);
console.log(`   - ${BLOG_POSTS.length} Dedicated Blog Post Pages`);
console.log(`   - 8 Public & Legal Pages (/privacy, /terms, /cookies, /pricing, /about, /contact, /security, /blog)`);
console.log(`   - /faq with FAQPage JSON-LD schema`);
console.log(`   - Custom 404.html error page`);
