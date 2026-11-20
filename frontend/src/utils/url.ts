import { ALL_LANGUAGES, DEFAULT_LANGUAGE, isPublishedLanguage, getPublishedLanguages } from '../i18n/languages';
import { SITE_CONFIG, SITE_URL } from '../config/site';

export { SITE_CONFIG, SITE_URL };

export interface ParsedRoute {
  lang: string;
  cleanPath: string;
  isLocalized: boolean;
}

/**
 * Parses any incoming URL pathname to extract the active language and the base canonical route path.
 * Examples:
 *   '/merge-pdf'      -> { lang: 'en', cleanPath: '/merge-pdf', isLocalized: false }
 *   '/es/merge-pdf'   -> { lang: 'es', cleanPath: '/merge-pdf', isLocalized: true }
 *   '/ar'             -> { lang: 'ar', cleanPath: '/', isLocalized: true }
 *   '/'               -> { lang: 'en', cleanPath: '/', isLocalized: false }
 */
export function parsePath(pathname: string): ParsedRoute {
  const normalized = pathname.replace(/\/+$/, '') || '/';
  const segments = normalized.split('/').filter(Boolean);

  if (segments.length > 0 && isPublishedLanguage(segments[0])) {
    const lang = segments[0];
    const rest = segments.slice(1).join('/');
    const cleanPath = rest ? `/${rest}` : '/';
    return {
      lang,
      cleanPath,
      isLocalized: lang !== DEFAULT_LANGUAGE,
    };
  }

  return {
    lang: DEFAULT_LANGUAGE,
    cleanPath: normalized,
    isLocalized: false,
  };
}

/**
 * Generates the equivalent localized URL when a user switches languages.
 * Preserves the exact same tool or content page!
 * Examples:
 *   getEquivalentPath('/merge-pdf', 'es')      -> '/es/merge-pdf'
 *   getEquivalentPath('/es/merge-pdf', 'en')   -> '/merge-pdf'
 *   getEquivalentPath('/de/pricing', 'ur')     -> '/ur/pricing'
 *   getEquivalentPath('/fr', 'en')             -> '/'
 */
export function getEquivalentPath(currentPath: string, targetLang: string): string {
  const { cleanPath } = parsePath(currentPath);

  if (targetLang === DEFAULT_LANGUAGE) {
    return cleanPath;
  }

  return cleanPath === '/' ? `/${targetLang}` : `/${targetLang}${cleanPath}`;
}

/**
 * Constructs an absolute canonical URL using the centralized SITE_URL configuration.
 */
export function getCanonicalUrl(pathname: string): string {
  const normalized = pathname.startsWith('/') ? pathname : `/${pathname}`;
  return `${SITE_URL}${normalized === '/' ? '' : normalized}`;
}

/**
 * Generates reciprocal hreflang alternate links for all published languages plus x-default.
 */
export function getHreflangLinks(cleanPath: string): { lang: string; href: string }[] {
  const published = getPublishedLanguages();
  const links: { lang: string; href: string }[] = [];

  for (const l of published) {
    const localizedPath = l.code === DEFAULT_LANGUAGE 
      ? (cleanPath === '/' ? '' : cleanPath)
      : (cleanPath === '/' ? `/${l.code}` : `/${l.code}${cleanPath}`);

    links.push({
      lang: l.code,
      href: `${SITE_URL}${localizedPath}`,
    });
  }

  // x-default points to the default English URL
  const defaultPath = cleanPath === '/' ? '' : cleanPath;
  links.push({
    lang: 'x-default',
    href: `${SITE_URL}${defaultPath}`,
  });

  return links;
}
