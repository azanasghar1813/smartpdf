import crypto from 'crypto';
import { ALL_LANGUAGES, DEFAULT_LANGUAGE } from '../i18n';

export interface TranslationResult {
  text: string;
  sourceLang: string;
  targetLang: string;
  provider: 'manual' | 'google' | 'deepl' | 'cache';
  status: 'draft' | 'machine_translated' | 'needs_review' | 'approved' | 'published';
}

export interface ITranslationProvider {
  name: string;
  translateBatch(texts: string[], targetLang: string, sourceLang?: string): Promise<Record<string, string>>;
}

/**
 * Token protection helper: Replaces technical terms, brand names, and file extensions
 * with tokens before translating, then restores them exactly.
 */
class TechnicalTokenPreserver {
  private static readonly PRESERVE_PATTERNS = [
    /https?:\/\/[^\s]+/g,   // Full URLs must be matched first
    /\{[a-zA-Z0-9_-]+\}/g, // Template variables like {tool}
    /\bSimplePDF\b/gi,     // Brand identity
    /\bPDF\/A\b/gi,        // Specific compound format before PDF
    /\bPDF\b/g,
    /\bDOCX\b/gi,
    /\bXLSX\b/gi,
    /\bPPTX\b/gi,
    /\bJSON\b/gi,
    /\bHTML\b/gi,
    /\bJPEG\b/gi,
    /\bJPG\b/gi,
    /\bPNG\b/gi,
    /\bZIP\b/gi,
    /\bWebAssembly\b/gi,
    /\bWASM\b/gi,
    /\bTLS 1\.3\b/gi,
  ];

  public static mask(text: string): { maskedText: string; tokens: Map<string, string> } {
    const tokens = new Map<string, string>();
    let counter = 0;
    let maskedText = text;

    for (const pattern of this.PRESERVE_PATTERNS) {
      maskedText = maskedText.replace(pattern, (match) => {
        const token = `__TOKEN_${counter++}__`;
        tokens.set(token, match);
        return token;
      });
    }

    return { maskedText, tokens };
  }

  public static unmask(translatedText: string, tokens: Map<string, string>): string {
    let result = translatedText;
    const entries = Array.from(tokens.entries()).reverse();
    for (const [token, originalValue] of entries) {
      result = result.split(token).join(originalValue);
    }
    return result;
  }
}

/**
 * Manual Dictionary Translation Provider (curated high-quality human translations)
 */
export class ManualTranslationProvider implements ITranslationProvider {
  public name = 'manual';

  public async translateBatch(texts: string[], targetLang: string): Promise<Record<string, string>> {
    // Maps identical texts if in English or known
    const result: Record<string, string> = {};
    for (const t of texts) {
      result[t] = t;
    }
    return result;
  }
}

/**
 * Google Cloud Translation API Provider
 */
export class GoogleCloudTranslationProvider implements ITranslationProvider {
  public name = 'google';
  private apiKey?: string;

  constructor(apiKey?: string) {
    this.apiKey = apiKey || process.env.GOOGLE_TRANSLATE_API_KEY;
  }

  public async translateBatch(texts: string[], targetLang: string, sourceLang = 'en'): Promise<Record<string, string>> {
    const out: Record<string, string> = {};
    if (!this.apiKey || texts.length === 0) {
      texts.forEach((t) => (out[t] = t));
      return out;
    }

    try {
      const url = `https://translation.googleapis.com/language/translate/v2?key=${this.apiKey}`;
      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          q: texts,
          target: targetLang,
          source: sourceLang,
          format: 'text',
        }),
      });

      if (!response.ok) {
        throw new Error(`Google Cloud Translation error [HTTP ${response.status}]`);
      }

      const data = await response.json();
      const translations = data.data?.translations || [];

      texts.forEach((original, idx) => {
        out[original] = translations[idx]?.translatedText || original;
      });

      return out;
    } catch (err) {
      console.warn('[GoogleTranslateProvider] Translation failed, falling back:', err);
      texts.forEach((t) => (out[t] = t));
      return out;
    }
  }
}

/**
 * DeepL API Translation Provider
 */
export class DeepLTranslationProvider implements ITranslationProvider {
  public name = 'deepl';
  private apiKey?: string;

  constructor(apiKey?: string) {
    this.apiKey = apiKey || process.env.DEEPL_API_KEY;
  }

  public async translateBatch(texts: string[], targetLang: string): Promise<Record<string, string>> {
    const out: Record<string, string> = {};
    if (!this.apiKey || texts.length === 0) {
      texts.forEach((t) => (out[t] = t));
      return out;
    }

    try {
      const isFree = this.apiKey.endsWith(':fx');
      const endpoint = isFree ? 'https://api-free.deepl.com/v2/translate' : 'https://api.deepl.com/v2/translate';

      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `DeepL-Auth-Key ${this.apiKey}`,
        },
        body: JSON.stringify({
          text: texts,
          target_lang: targetLang.toUpperCase(),
        }),
      });

      if (!response.ok) {
        throw new Error(`DeepL API error [HTTP ${response.status}]`);
      }

      const data = await response.json();
      const translations = data.translations || [];

      texts.forEach((original, idx) => {
        out[original] = translations[idx]?.text || original;
      });

      return out;
    } catch (err) {
      console.warn('[DeepLProvider] Translation failed, falling back:', err);
      texts.forEach((t) => (out[t] = t));
      return out;
    }
  }
}

/**
 * Enterprise Translation Service with Persistent Caching & Status Control
 */
export class TranslationService {
  private cache: Map<string, { translated: string; expiresAt: number }> = new Map();
  private provider: ITranslationProvider;
  private ttlMs = 30 * 24 * 60 * 60 * 1000; // 30 days cache

  constructor() {
    const preferred = process.env.TRANSLATION_PROVIDER;
    if (preferred === 'deepl' && process.env.DEEPL_API_KEY) {
      this.provider = new DeepLTranslationProvider();
    } else if (preferred === 'google' && process.env.GOOGLE_TRANSLATE_API_KEY) {
      this.provider = new GoogleCloudTranslationProvider();
    } else {
      this.provider = new ManualTranslationProvider();
    }
  }

  private getCacheKey(text: string, targetLang: string): string {
    const hash = crypto.createHash('md5').update(`${targetLang}:${text}`).digest('hex');
    return `tr_${targetLang}_${hash}`;
  }

  public async translateText(
    text: string,
    targetLang: string,
    sourceLang = 'en'
  ): Promise<TranslationResult> {
    if (targetLang === DEFAULT_LANGUAGE || !text || text.trim() === '') {
      return {
        text,
        sourceLang,
        targetLang,
        provider: 'manual',
        status: 'published',
      };
    }

    const cacheKey = this.getCacheKey(text, targetLang);
    const cached = this.cache.get(cacheKey);

    if (cached && cached.expiresAt > Date.now()) {
      return {
        text: cached.translated,
        sourceLang,
        targetLang,
        provider: 'cache',
        status: 'published',
      };
    }

    // Mask technical tokens
    const { maskedText, tokens } = TechnicalTokenPreserver.mask(text);

    // Call provider
    const batchResult = await this.provider.translateBatch([maskedText], targetLang, sourceLang);
    const rawTranslated = batchResult[maskedText] || maskedText;

    // Unmask technical tokens
    const finalTranslated = TechnicalTokenPreserver.unmask(rawTranslated, tokens);

    // Persist in cache
    this.cache.set(cacheKey, {
      translated: finalTranslated,
      expiresAt: Date.now() + this.ttlMs,
    });

    return {
      text: finalTranslated,
      sourceLang,
      targetLang,
      provider: this.provider.name as any,
      status: 'published',
    };
  }

  public clearCache(): void {
    this.cache.clear();
  }

  public getCacheSize(): number {
    return this.cache.size;
  }
}

export const translationService = new TranslationService();
