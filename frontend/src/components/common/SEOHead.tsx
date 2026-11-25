import React, { useEffect } from 'react';
import { ToolMeta } from '../../types';
import { BlogPost } from '../../data/blogPosts';
import { parsePath, getCanonicalUrl, getHreflangLinks, SITE_URL } from '../../utils/url';
import { isRTL } from '../../i18n/languages';
import { getToolSeoDetail } from '../../data/toolSeoContent';
import { GLOBAL_FAQS } from '../../data/faqs';

interface SEOHeadProps {
  tool?: ToolMeta;
  blogPost?: BlogPost;
  currentPath?: string;
  customTitle?: string;
  customDescription?: string;
}

export const SEOHead: React.FC<SEOHeadProps> = ({
  tool,
  blogPost,
  currentPath = window.location.pathname || '/',
  customTitle,
  customDescription,
}) => {
  const { lang, cleanPath } = parsePath(currentPath);
  const rtl = isRTL(lang);

  // 1. Resolve Document Title
  const title =
    customTitle ||
    (blogPost
      ? `${blogPost.title} | SimplePDF Blog`
      : tool
      ? `${tool.seoTitle} | SimplePDF`
      : cleanPath === '/faq'
      ? 'Frequently Asked Questions & Support | SimplePDF'
      : cleanPath === '/pricing'
      ? 'SimplePDF Pricing — 100% Free Unlimited Online PDF Tools'
      : cleanPath === '/blog'
      ? 'SimplePDF Blog — PDF Tutorials, Guides & Document Tips'
      : cleanPath === '/privacy'
      ? 'Privacy Policy & Zero-Retention Data Protection | SimplePDF'
      : cleanPath === '/terms'
      ? 'Terms of Service & Document Ownership Agreement | SimplePDF'
      : cleanPath === '/cookies'
      ? 'Cookie Policy & Local Storage Transparency | SimplePDF'
      : cleanPath === '/security'
      ? 'Security & Document Protection Architecture | SimplePDF'
      : cleanPath === '/about'
      ? 'About SimplePDF — Document Productivity Made Simple'
      : cleanPath === '/contact'
      ? 'Contact SimplePDF — Support & Inquiries'
      : 'SimplePDF — Online PDF Tools for Document Productivity');

  // 2. Resolve Meta Description (120-160 characters)
  const description =
    customDescription ||
    (blogPost
      ? blogPost.excerpt
      : tool
      ? tool.seoDescription || tool.description
      : cleanPath === '/faq'
      ? 'Find clear answers to questions about SimplePDF tools, privacy guarantees, in-browser WebAssembly security, file retention limits, and subscriptions.'
      : cleanPath === '/pricing'
      ? 'SimplePDF is 100% free with no credit card required. Explore 32+ fast in-browser and cloud PDF tools with zero file retention and instant processing.'
      : cleanPath === '/privacy'
      ? 'Learn how SimplePDF protects your documents with client-side WebAssembly, zero file retention, automatic shredding, and full GDPR/CCPA compliance.'
      : cleanPath === '/terms'
      ? 'Read the SimplePDF Terms of Service. 100% free online PDF suite, zero document licensing, full user copyright ownership, and acceptable use terms.'
      : cleanPath === '/cookies'
      ? 'Discover how SimplePDF uses minimal cookies and local storage for interface preferences and AdSense ads. Learn how to manage or disable cookies.'
      : cleanPath === '/security'
      ? 'Explore the SimplePDF security architecture: client-side WebAssembly edge processing, TLS 1.3 encryption, and automated cryptographic shredding.'
      : cleanPath === '/about'
      ? 'Discover the story behind SimplePDF: fast, elegant, and uncompromisingly private document productivity tools powered by WebAssembly.'
      : cleanPath === '/contact'
      ? 'Get in touch with the SimplePDF team for customer support, bug reports, feature requests, or enterprise partnership inquiries.'
      : 'Every PDF tool you need, 100% free and easy to use. Merge, split, compress, convert, rotate, unlock, and protect PDF files in seconds with in-browser privacy.');

  const canonicalUrl = blogPost
    ? `${SITE_URL}/blog/${blogPost.slug}`
    : getCanonicalUrl(currentPath);

  const hreflangLinks = getHreflangLinks(cleanPath);
  const ogImage = `${SITE_URL}/logo.svg`;

  useEffect(() => {
    // 1. Update HTML language and text direction attributes
    document.documentElement.lang = lang;
    document.documentElement.dir = rtl ? 'rtl' : 'ltr';

    // 2. Update document title
    document.title = title;

    // Helper to safely set or update a meta tag
    const setMetaTag = (attributeName: string, attributeValue: string, content: string) => {
      let meta = document.querySelector(`meta[${attributeName}="${attributeValue}"]`);
      if (!meta) {
        meta = document.createElement('meta');
        meta.setAttribute(attributeName, attributeValue);
        document.head.appendChild(meta);
      }
      meta.setAttribute('content', content);
    };

    // 3. Primary Meta Description & Robots & Keywords
    setMetaTag('name', 'description', description);
    const pageKeywords = tool?.seoKeywords
      ? tool.seoKeywords.join(', ')
      : 'simplepdf, free online pdf tools, merge pdf, compress pdf, convert pdf to word, edit pdf, ocr pdf, split pdf, sign pdf, protect pdf';
    setMetaTag('name', 'keywords', pageKeywords);
    setMetaTag('name', 'robots', 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1');
    setMetaTag('name', 'googlebot', 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1');
    setMetaTag('name', 'bingbot', 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1');

    // 4. Open Graph Tags
    setMetaTag('property', 'og:type', blogPost ? 'article' : 'website');
    setMetaTag('property', 'og:url', canonicalUrl);
    setMetaTag('property', 'og:title', title);
    setMetaTag('property', 'og:description', description);
    setMetaTag('property', 'og:image', ogImage);
    setMetaTag('property', 'og:site_name', 'SimplePDF');

    // 5. Twitter Card Tags
    setMetaTag('name', 'twitter:card', 'summary_large_image');
    setMetaTag('name', 'twitter:url', canonicalUrl);
    setMetaTag('name', 'twitter:title', title);
    setMetaTag('name', 'twitter:description', description);
    setMetaTag('name', 'twitter:image', ogImage);

    // 6. Canonical link
    let canonicalLink = document.querySelector('link[rel="canonical"]');
    if (!canonicalLink) {
      canonicalLink = document.createElement('link');
      canonicalLink.setAttribute('rel', 'canonical');
      document.head.appendChild(canonicalLink);
    }
    canonicalLink.setAttribute('href', canonicalUrl);

    // 7. Reciprocal hreflang links
    document.querySelectorAll('link[rel="alternate"][hreflang]').forEach((el) => el.remove());
    hreflangLinks.forEach(({ lang: hLang, href }) => {
      const link = document.createElement('link');
      link.setAttribute('rel', 'alternate');
      link.setAttribute('hreflang', hLang);
      link.setAttribute('href', href);
      document.head.appendChild(link);
    });

    // 8. Structured Data JSON-LD
    let scriptTag = document.getElementById('seo-json-ld') as HTMLScriptElement | null;
    if (!scriptTag) {
      scriptTag = document.createElement('script');
      scriptTag.id = 'seo-json-ld';
      scriptTag.type = 'application/ld+json';
      document.head.appendChild(scriptTag);
    }

    const schemas: any[] = [];

    if (tool) {
      const seoDetail = getToolSeoDetail(tool.id);

      // WebApplication Schema
      schemas.push({
        '@context': 'https://schema.org',
        '@type': 'WebApplication',
        name: `${tool.name} — SimplePDF`,
        url: canonicalUrl,
        inLanguage: lang,
        description: tool.seoDescription || tool.longDescription || tool.description,
        applicationCategory: 'BusinessApplication',
        operatingSystem: 'All',
        offers: {
          '@type': 'Offer',
          price: '0',
          priceCurrency: 'USD',
        },
        featureList: tool.howToSteps.join('; '),
      });

      // HowTo Schema
      if (tool.howToSteps && tool.howToSteps.length > 0) {
        schemas.push({
          '@context': 'https://schema.org',
          '@type': 'HowTo',
          name: `How to use ${tool.name} with SimplePDF`,
          description: tool.seoDescription || tool.description,
          step: tool.howToSteps.map((stepText, idx) => ({
            '@type': 'HowToStep',
            position: idx + 1,
            name: `Step ${idx + 1}`,
            text: stepText,
            url: `${canonicalUrl}#step-${idx + 1}`,
          })),
        });
      }

      // BreadcrumbList Schema
      schemas.push({
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: [
          {
            '@type': 'ListItem',
            position: 1,
            name: 'Home',
            item: `${SITE_URL}${lang === 'en' ? '/' : `/${lang}`}`,
          },
          {
            '@type': 'ListItem',
            position: 2,
            name: tool.category.replace('-', ' '),
            item: `${SITE_URL}${lang === 'en' ? '/' : `/${lang}`}#${tool.category}`,
          },
          {
            '@type': 'ListItem',
            position: 3,
            name: tool.name,
            item: canonicalUrl,
          },
        ],
      });

      // FAQPage Schema for Tool Page
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
    } else if (blogPost) {
      // BlogPosting Schema
      schemas.push({
        '@context': 'https://schema.org',
        '@type': 'BlogPosting',
        headline: blogPost.title,
        description: blogPost.excerpt,
        url: canonicalUrl,
        datePublished: '2026-11-18',
        dateModified: '2026-11-18',
        author: {
          '@type': 'Organization',
          name: blogPost.author || 'SimplePDF Team',
        },
        publisher: {
          '@type': 'Organization',
          name: 'SimplePDF',
          url: SITE_URL,
          logo: `${SITE_URL}/logo.svg`,
        },
      });

      schemas.push({
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: [
          {
            '@type': 'ListItem',
            position: 1,
            name: 'Home',
            item: SITE_URL,
          },
          {
            '@type': 'ListItem',
            position: 2,
            name: 'Blog',
            item: `${SITE_URL}/blog`,
          },
          {
            '@type': 'ListItem',
            position: 3,
            name: blogPost.title,
            item: canonicalUrl,
          },
        ],
      });
    } else if (cleanPath === '/faq') {
      // FAQPage Schema for /faq route
      schemas.push({
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
      });
    } else if (['/privacy', '/terms', '/cookies', '/security', '/about', '/contact', '/pricing'].includes(cleanPath)) {
      const pageNames: Record<string, string> = {
        '/privacy': 'Privacy Policy',
        '/terms': 'Terms of Service',
        '/cookies': 'Cookie Policy',
        '/security': 'Security Architecture',
        '/about': 'About Us',
        '/contact': 'Contact Us',
        '/pricing': 'Pricing',
      };
      const pageName = pageNames[cleanPath] || 'Information';
      schemas.push({
        '@context': 'https://schema.org',
        '@type': 'WebPage',
        name: title,
        url: canonicalUrl,
        description: description,
        inLanguage: lang,
      });
      schemas.push({
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: [
          {
            '@type': 'ListItem',
            position: 1,
            name: 'Home',
            item: `${SITE_URL}${lang === 'en' ? '/' : `/${lang}`}`,
          },
          {
            '@type': 'ListItem',
            position: 2,
            name: pageName,
            item: canonicalUrl,
          },
        ],
      });
    } else {
      // Organization & WebSite Schema for Home
      schemas.push({
        '@context': 'https://schema.org',
        '@type': 'WebSite',
        name: 'SimplePDF',
        url: SITE_URL,
        description: 'All-in-one online PDF productivity platform with in-browser privacy.',
        potentialAction: {
          '@type': 'SearchAction',
          target: `${SITE_URL}/search?q={search_term_string}`,
          'query-input': 'required name=search_term_string',
        },
      });

      schemas.push({
        '@context': 'https://schema.org',
        '@type': 'Organization',
        name: 'SimplePDF',
        url: SITE_URL,
        logo: `${SITE_URL}/logo.svg`,
      });
    }

    scriptTag.text = JSON.stringify(schemas, null, 2);
  }, [title, description, canonicalUrl, hreflangLinks, tool, blogPost, lang, rtl, cleanPath]);

  return null;
};
