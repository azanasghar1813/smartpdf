/**
 * SimplePDF Language Catalog and Internationalization Definitions
 * Inspired by LinguaPrime's 51-language model, tailored for React/Vite/TypeScript.
 */

export interface LanguageDefinition {
  code: string;            // ISO 639-1 (e.g. 'en', 'es', 'ar', 'ur')
  locale: string;          // Locale identifier (e.g. 'en-US', 'es-ES', 'ar-SA', 'ur-PK')
  name: string;            // English display name
  nativeName: string;      // Native script name
  countryCode: string;     // ISO 3166-1 alpha-2 for visual flag/badge
  isRTL: boolean;          // Text direction: true for RTL (Arabic, Urdu, etc.)
  isEnabled: boolean;      // Available in system
  isPublished: boolean;    // Publicly indexable by search engines
}

export const ALL_LANGUAGES: Record<string, LanguageDefinition> = {
  // Active Initial Rollout
  en: { code: 'en', locale: 'en-US', name: 'English', nativeName: 'English', countryCode: 'US', isRTL: false, isEnabled: true, isPublished: true },
  es: { code: 'es', locale: 'es-ES', name: 'Spanish', nativeName: 'Español', countryCode: 'ES', isRTL: false, isEnabled: true, isPublished: true },
  pt: { code: 'pt', locale: 'pt-BR', name: 'Portuguese', nativeName: 'Português', countryCode: 'PT', isRTL: false, isEnabled: true, isPublished: true },
  de: { code: 'de', locale: 'de-DE', name: 'German', nativeName: 'Deutsch', countryCode: 'DE', isRTL: false, isEnabled: true, isPublished: true },
  fr: { code: 'fr', locale: 'fr-FR', name: 'French', nativeName: 'Français', countryCode: 'FR', isRTL: false, isEnabled: true, isPublished: true },
  ar: { code: 'ar', locale: 'ar-SA', name: 'Arabic', nativeName: 'العربية', countryCode: 'SA', isRTL: true, isEnabled: true, isPublished: true },
  hi: { code: 'hi', locale: 'hi-IN', name: 'Hindi', nativeName: 'हिन्दी', countryCode: 'IN', isRTL: false, isEnabled: true, isPublished: true },
  ur: { code: 'ur', locale: 'ur-PK', name: 'Urdu', nativeName: 'اردو', countryCode: 'PK', isRTL: true, isEnabled: true, isPublished: true },

  // Extended Catalog
  zh: { code: 'zh', locale: 'zh-CN', name: 'Chinese', nativeName: '中文', countryCode: 'CN', isRTL: false, isEnabled: false, isPublished: false },
  ja: { code: 'ja', locale: 'ja-JP', name: 'Japanese', nativeName: '日本語', countryCode: 'JP', isRTL: false, isEnabled: false, isPublished: false },
  ru: { code: 'ru', locale: 'ru-RU', name: 'Russian', nativeName: 'Русский', countryCode: 'RU', isRTL: false, isEnabled: false, isPublished: false },
  it: { code: 'it', locale: 'it-IT', name: 'Italian', nativeName: 'Italiano', countryCode: 'IT', isRTL: false, isEnabled: false, isPublished: false },
  nl: { code: 'nl', locale: 'nl-NL', name: 'Dutch', nativeName: 'Nederlands', countryCode: 'NL', isRTL: false, isEnabled: false, isPublished: false },
  pl: { code: 'pl', locale: 'pl-PL', name: 'Polish', nativeName: 'Polski', countryCode: 'PL', isRTL: false, isEnabled: false, isPublished: false },
  tr: { code: 'tr', locale: 'tr-TR', name: 'Turkish', nativeName: 'Türkçe', countryCode: 'TR', isRTL: false, isEnabled: false, isPublished: false },
  id: { code: 'id', locale: 'id-ID', name: 'Indonesian', nativeName: 'Indonesia', countryCode: 'ID', isRTL: false, isEnabled: false, isPublished: false },
  ko: { code: 'ko', locale: 'ko-KR', name: 'Korean', nativeName: '한국어', countryCode: 'KR', isRTL: false, isEnabled: false, isPublished: false },
  vi: { code: 'vi', locale: 'vi-VN', name: 'Vietnamese', nativeName: 'Tiếng Việt', countryCode: 'VN', isRTL: false, isEnabled: false, isPublished: false },
  th: { code: 'th', locale: 'th-TH', name: 'Thai', nativeName: 'ไทย', countryCode: 'TH', isRTL: false, isEnabled: false, isPublished: false },
  fa: { code: 'fa', locale: 'fa-IR', name: 'Persian', nativeName: 'فارسی', countryCode: 'IR', isRTL: true, isEnabled: false, isPublished: false },
  bn: { code: 'bn', locale: 'bn-BD', name: 'Bengali', nativeName: 'বাংলা', countryCode: 'BD', isRTL: false, isEnabled: false, isPublished: false },
  uk: { code: 'uk', locale: 'uk-UA', name: 'Ukrainian', nativeName: 'Українська', countryCode: 'UA', isRTL: false, isEnabled: false, isPublished: false },
  ro: { code: 'ro', locale: 'ro-RO', name: 'Romanian', nativeName: 'Română', countryCode: 'RO', isRTL: false, isEnabled: false, isPublished: false },
  sv: { code: 'sv', locale: 'sv-SE', name: 'Swedish', nativeName: 'Svenska', countryCode: 'SE', isRTL: false, isEnabled: false, isPublished: false },
  el: { code: 'el', locale: 'el-GR', name: 'Greek', nativeName: 'Ελληνικά', countryCode: 'GR', isRTL: false, isEnabled: false, isPublished: false },
  cs: { code: 'cs', locale: 'cs-CZ', name: 'Czech', nativeName: 'Čeština', countryCode: 'CZ', isRTL: false, isEnabled: false, isPublished: false },
  hu: { code: 'hu', locale: 'hu-HU', name: 'Hungarian', nativeName: 'Magyar', countryCode: 'HU', isRTL: false, isEnabled: false, isPublished: false },
  ms: { code: 'ms', locale: 'ms-MY', name: 'Malay', nativeName: 'Bahasa Melayu', countryCode: 'MY', isRTL: false, isEnabled: false, isPublished: false },
  ps: { code: 'ps', locale: 'ps-AF', name: 'Pashto', nativeName: 'پښتو', countryCode: 'AF', isRTL: true, isEnabled: false, isPublished: false },
  sd: { code: 'sd', locale: 'sd-PK', name: 'Sindhi', nativeName: 'سنڌي', countryCode: 'PK', isRTL: true, isEnabled: false, isPublished: false },
};

export const DEFAULT_LANGUAGE = 'en';

export function getPublishedLanguages(): LanguageDefinition[] {
  return Object.values(ALL_LANGUAGES).filter((l) => l.isEnabled && l.isPublished);
}

export function getEnabledLanguages(): LanguageDefinition[] {
  return Object.values(ALL_LANGUAGES).filter((l) => l.isEnabled);
}

export function isRTL(langCode: string): boolean {
  return Boolean(ALL_LANGUAGES[langCode]?.isRTL);
}

export function isPublishedLanguage(langCode: string): boolean {
  return Boolean(ALL_LANGUAGES[langCode]?.isEnabled && ALL_LANGUAGES[langCode]?.isPublished);
}
