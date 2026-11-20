# SimplePDF International SEO & Multilingual Architecture Guide

## 1. Executive Summary & Architectural Overview

SimplePDF is engineered with an enterprise-grade International SEO and Multilingual architecture inspired by modern internationalization principles and high-throughput static generation.

The system combines:
1. **Dynamic Client Hydration & WASM Workspaces**: High performance client-side WebAssembly execution (`pdf-lib`, `pdfjs-dist`) maintaining zero server costs and 100% in-browser privacy for core tools.
2. **Pre-rendered Search-Engine-Visible HTML**: All 32 core PDF tools across 8 active languages (256 static HTML pages) generated into `frontend/dist/` with full semantics (H1, intro, how-to steps, features, limitations, use cases, FAQs, and JSON-LD structured data).
3. **Subpath Multilingual Routing**: Default English pages served without prefix (`/merge-pdf`, `/compress-pdf`) and localized pages prefixed cleanly (`/es/merge-pdf`, `/de/merge-pdf`, `/fr/merge-pdf`, `/pt/merge-pdf`, `/ar/merge-pdf`, `/ur/merge-pdf`, `/hi/merge-pdf`).
4. **Context-Preserving Language Switcher**: Switching between languages updates the URL path to the equivalent page in the chosen language without redirecting to the homepage.
5. **Bidirectional Text Support (RTL/LTR)**: Native RTL layout rendering for Arabic (`ar`) and Urdu (`ur`) using `dir="rtl"` and custom CSS adaptations while strictly retaining LTR for technical terms, code snippets, file extensions, and brand marks.
6. **Token-Protected Translation Pipeline**: Protects brand identities, file formats, template variables, and URLs (`SimplePDF`, `PDF`, `DOCX`, `{tool}`, `https://...`) during translation.
7. **Complete Search Engine Directives**: Self-referencing canonical tags, reciprocal `hreflang` alternates with `x-default`, automated XML Sitemap Index (`sitemap.xml`, `sitemap-main.xml`, `sitemap-tools.xml`, `sitemap-i18n.xml`), and updated `robots.txt`.

---

## 2. Directory Structure & Key Files

```
simplepdf/
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── common/
│   │   │   │   └── SEOHead.tsx          # Dynamic Head, Canonicals, Hreflang, Schemas, RTL
│   │   │   ├── layout/
│   │   │   │   ├── LanguageSwitcher.tsx # Accessible Header/Drawer Language Switcher
│   │   │   │   ├── Navbar.tsx           # Navigation with Switcher & RTL Support
│   │   │   │   └── Footer.tsx           # Crawlable Internal Anchor Links
│   │   │   └── tools/
│   │   │       └── ToolLandingPage.tsx  # Universal Tool Template with Educational SEO Copy
│   │   ├── data/
│   │   │   ├── tools.ts                 # Registry of all 32 Tools
│   │   │   └── toolSeoContent.ts        # Comprehensive Features, Limits, Use Cases, FAQs
│   │   ├── i18n/
│   │   │   ├── languages.ts             # 51-Language Global Catalog & RTL Utilities
│   │   │   └── translations.ts          # Human-Curated UI Dictionaries (8 Active Languages)
│   │   ├── utils/
│   │   │   └── url.ts                   # URL Parsing, Canonical & Hreflang Link Generators
│   │   └── App.tsx                      # Multilingual Route Resolution (/ & /:lang/*)
│   └── public/
│       ├── robots.txt                   # Search Engine Crawler Directives
│       ├── sitemap.xml                  # Sitemap Index
│       ├── sitemap-main.xml             # Static Site Pages Sitemap
│       ├── sitemap-tools.xml            # Default English Tool Pages Sitemap
│       └── sitemap-i18n.xml             # Localized Alternate Pages with Hreflang
├── backend/
│   └── src/
│       ├── i18n/
│       │   └── index.ts                 # Backend Language Registry & Localized Dictionaries
│       ├── routes/
│       │   └── translation.routes.ts    # /api/v1/i18n REST API Endpoints
│       └── services/
│           └── translationService.ts    # Persistent In-Memory Caching, Token Masking, DeepL/Google API
├── scripts/
│   ├── generate-seo-pages.js            # Build-time 256 Static HTML Prerender Script
│   └── generate-sitemaps.js             # XML Sitemap & robots.txt Automation Script
└── tests/
    └── i18n.test.js                     # Automated Test Suite for I18N, SEO, RTL, & Token Security
```

---

## 3. Language Matrix & Rollout Status

The platform includes a built-in 51-language registry. An initial tier of 8 global languages is published and search-indexable:

| Language | ISO Code | Native Name | Direction | Initial Status | Country Badge |
|---|---|---|---|---|---|
| **English** | `en` | English | LTR | **Published (Default)** | US |
| **Spanish** | `es` | Español | LTR | **Published** | ES |
| **Portuguese**| `pt` | Português | LTR | **Published** | PT / BR |
| **German** | `de` | Deutsch | LTR | **Published** | DE |
| **French** | `fr` | Français | LTR | **Published** | FR |
| **Arabic** | `ar` | العربية | RTL | **Published** | SA |
| **Hindi** | `hi` | हिन्दी | LTR | **Published** | IN |
| **Urdu** | `ur` | اردو | RTL | **Published** | PK |

*The remaining 43 languages (Japanese `ja`, Chinese `zh`, Russian `ru`, Italian `it`, Dutch `nl`, Turkish `tr`, Korean `ko`, Indonesian `id`, Polish `pl`, etc.) are pre-configured in `ALL_LANGUAGES` with `isEnabled: false, isPublished: false`. Enabling a new language requires toggling both flags to `true` with zero database or application rewrites.*

---

## 4. URL Structure & Canonical Strategy

### Clean URL Patterns
1. **Default Language (English)**:
   - Root: `https://simplepdf.com/`
   - Tool: `https://simplepdf.com/merge-pdf`
   - Static: `https://simplepdf.com/pricing`
2. **Localized Languages**:
   - Spanish Tool: `https://simplepdf.com/es/merge-pdf`
   - German Tool: `https://simplepdf.com/de/merge-pdf`
   - Arabic Tool: `https://simplepdf.com/ar/merge-pdf`
   - Urdu Tool: `https://simplepdf.com/ur/compress-pdf`

### Canonical & Hreflang Rules
- Every page contains a **self-referencing canonical URL**.
- Every localized page contains **reciprocal `hreflang` alternate links** to all other 7 languages.
- Every page specifies `hreflang="x-default"` pointing to the canonical default English page (`https://simplepdf.com/merge-pdf`).
- Trailing slashes are stripped consistently to prevent duplicate content indexing.

---

## 5. Bidirectional (RTL/LTR) Implementation

SimplePDF handles RTL languages natively without layout breakage:
1. When navigating to `/ar/*` or `/ur/*`, `SEOHead.tsx` updates `document.documentElement.dir = 'rtl'` and `document.documentElement.lang = lang`.
2. The CSS grid and flex structures automatically reverse layout orientations.
3. Technical tokens, file extensions (`.pdf`, `.docx`), numbers, badges, and code fonts are wrapped with `<span dir="ltr" class="font-mono">` to preserve readable left-to-right syntax inside right-to-left contexts.

---

## 6. Translation Architecture & Token Protection

### Technical Token Preserver
To prevent machine translation engines from mangling technical terminology, brand names, or formatting placeholders, the `TechnicalTokenPreserver` executes a 2-pass masking process:

1. **Masking (Pre-Translation)**:
   - Evaluates regular expressions in priority order:
     1. Full URLs (`https?://[^\s]+`)
     2. Placeholders (`\{[a-zA-Z0-9_-]+\}`)
     3. Brand names (`SimplePDF`)
     4. File formats (`PDF/A`, `PDF`, `DOCX`, `XLSX`, `PPTX`, `JPG`, `PNG`, `ZIP`)
     5. Technology stacks (`WebAssembly`, `WASM`, `TLS 1.3`)
   - Replaces matches with sequential unique tokens: `__TOKEN_0__`, `__TOKEN_1__`.
2. **Unmasking (Post-Translation)**:
   - Restores original tokens in reverse order, ensuring nested and adjacent strings are restored without collision.

### Provider Interface & Persistent Caching
- **Manual**: High-speed, human-curated dictionary fallback.
- **Google Cloud Translation API**: Configurable via `GOOGLE_TRANSLATE_API_KEY`.
- **DeepL API**: Configurable via `DEEPL_API_KEY`.
- **In-Memory Cache**: 30-day TTL in-memory LRU/Map cache with MD5 key hashing (`tr_{targetLang}_{hash}`) prevents duplicate translation requests and minimizes API costs.

---

## 7. Static Prerendering & Crawlability

For optimal search engine indexing:
1. `scripts/generate-seo-pages.js` is triggered during the build pipeline (`npm run build:seo` or `npm run build:frontend`).
2. Reads the base `dist/index.html` built by Vite.
3. Generates **256 distinct HTML files** into `frontend/dist/`:
   - `dist/merge-pdf/index.html`
   - `dist/es/merge-pdf/index.html`
   - `dist/ar/merge-pdf/index.html`
   - ... for all 32 tools and 8 active languages.
4. Each file injects:
   - `<html lang="..." dir="...">`
   - Pre-rendered visible content in `<div id="root">` with semantic H1, breadcrumbs, how-to-use lists, feature grids, FAQ lists, and related tools.
   - Self-referencing `<link rel="canonical">`
   - 9 reciprocal `<link rel="alternate" hreflang="...">`
   - 3 JSON-LD Structured Data blocks (`WebApplication`, `BreadcrumbList`, and `FAQPage`).

---

## 8. Sitemaps and Robots.txt

The XML Sitemap system is split into modular files:
- **`sitemap.xml`**: Sitemap index pointing to sub-sitemaps with `<lastmod>` timestamps.
- **`sitemap-main.xml`**: Static marketing and informational pages (`/`, `/pricing`, `/blog`, `/security`, `/faq`, etc.).
- **`sitemap-tools.xml`**: 32 core English PDF tool landing pages with `priority="0.9"`.
- **`sitemap-i18n.xml`**: 224 localized alternate URLs (32 tools × 7 languages) with full `<xhtml:link rel="alternate">` reciprocal annotations.
- **`robots.txt`**: Directs crawlers to `https://simplepdf.com/sitemap.xml` while disallowing `/admin`, `/dashboard`, and `/api/`.

---

## 9. Automated Testing & Verification

Run the entire suite with:
```bash
npm test
```
Or run the dedicated internationalization test suite:
```bash
npm run test:i18n
```

### Test Coverage Highlights:
- **Test 1**: Active 8-language catalog and 51-language registry integrity.
- **Test 2**: URL parsing & language extraction (unprefixed vs prefixed routes).
- **Test 3**: Context-preserving language switcher (verifies `/es/split-pdf` -> `/split-pdf` and `/fr/pricing` -> `/ar/pricing`).
- **Test 4**: Canonical URLs and reciprocal `hreflang` generation (including `x-default`).
- **Test 5**: Directional text detection (`ar` and `ur` as RTL, others as LTR).
- **Test 6**: Technical token masking and restoration during translation (verifying URLs, formats, and brand names are untouched).
- **Test 7**: Sitemap index, sub-sitemaps, and `robots.txt` structural validity.
- **Test 8**: Prerendered HTML validation across English, Arabic, and Urdu files (verifying H1, FAQ, WebApplication schema, BreadcrumbList, and FAQPage schemas).
