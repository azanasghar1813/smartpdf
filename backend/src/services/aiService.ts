export interface SummaryResult {
  summary: string;
  bulletPoints: string[];
  keyTopics: string[];
  readingTimeMinutes: number;
}

export interface TranslationResult {
  sourceLanguage: string;
  targetLanguage: string;
  translatedText: string;
  characterCount: number;
}

export interface ComparisonResult {
  similarityScore: number;
  differencesCount: number;
  addedLines: string[];
  removedLines: string[];
  unchangedLinesCount: number;
}

export class AiService {
  /**
   * Summarize Document Text using Anthropic Claude API (requires ANTHROPIC_API_KEY)
   */
  public async summarize(text: string, depth: 'quick' | 'detailed' | 'academic' = 'detailed'): Promise<SummaryResult> {
    const cleanText = (text || '').trim();
    if (cleanText.length < 20) {
      throw new Error('This PDF has no extractable text. This looks scanned; run OCR first.');
    }

    const apiKey = process.env.ANTHROPIC_API_KEY;
    if (!apiKey) {
      throw new Error('AI Summarizer is not configured on this server (missing ANTHROPIC_API_KEY).');
    }

    const wordCount = cleanText.split(/\s+/).filter(Boolean).length;
    const readingTime = Math.max(1, Math.round(wordCount / 200));
    const keyTopics = this.extractKeyTopics(cleanText);

    const depthInstruction =
      depth === 'quick'
        ? 'Provide a concise 2-3 sentence summary and 3 short bullet points.'
        : depth === 'academic'
        ? 'Provide an academic executive overview with methodology/findings and 4 analytical bullet points.'
        : 'Provide a clear 4-sentence summary and 5 key insight bullet points.';

    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-3-5-haiku-latest',
        max_tokens: 1024,
        messages: [
          {
            role: 'user',
            content: `${depthInstruction}\nRespond as JSON with keys "summary" (string) and "bulletPoints" (string[]).\n\nDocument:\n${cleanText.slice(0, 24000)}`,
          },
        ],
      }),
    });

    if (!response.ok) {
      throw new Error(`AI provider returned HTTP ${response.status}.`);
    }

    const data: any = await response.json();
    const raw = data?.content?.[0]?.text || '';
    try {
      const parsed = JSON.parse(raw);
      return {
        summary: parsed.summary || raw,
        bulletPoints: Array.isArray(parsed.bulletPoints) ? parsed.bulletPoints : [],
        keyTopics,
        readingTimeMinutes: readingTime,
      };
    } catch {
      return {
        summary: raw,
        bulletPoints: [],
        keyTopics,
        readingTimeMinutes: readingTime,
      };
    }
  }

  /**
   * Translate Document Text via configured translation provider (DeepL / Google)
   */
  public async translate(text: string, targetLang: string): Promise<TranslationResult> {
    const cleanText = (text || '').trim();
    if (cleanText.length < 10) {
      throw new Error('This PDF has no extractable text. This looks scanned; run OCR first.');
    }

    const { translationService } = await import('./translationService');
    const deeplKey = process.env.DEEPL_API_KEY;
    const googleKey = process.env.GOOGLE_TRANSLATE_API_KEY;

    if (!deeplKey && !googleKey) {
      throw new Error('Translation API key (DEEPL_API_KEY or GOOGLE_TRANSLATE_API_KEY) is not configured on the server.');
    }

    const res = await translationService.translateText(cleanText.slice(0, 8000), targetLang);
    return {
      sourceLanguage: res.sourceLang,
      targetLanguage: targetLang,
      translatedText: res.text,
      characterCount: res.text.length,
    };
  }

  /**
   * Compare Two Documents
   */
  public async compare(doc1: string, doc2: string): Promise<ComparisonResult> {
    const lines1 = doc1.split('\n').map((l) => l.trim()).filter(Boolean);
    const lines2 = doc2.split('\n').map((l) => l.trim()).filter(Boolean);

    const set1 = new Set(lines1);
    const set2 = new Set(lines2);

    const addedLines = lines2.filter((l) => !set1.has(l));
    const removedLines = lines1.filter((l) => !set2.has(l));
    const unchangedCount = lines1.filter((l) => set2.has(l)).length;

    const totalLines = Math.max(lines1.length, lines2.length, 1);
    const similarityScore = Math.round((unchangedCount / totalLines) * 100);

    return {
      similarityScore,
      differencesCount: addedLines.length + removedLines.length,
      addedLines: addedLines.slice(0, 50),
      removedLines: removedLines.slice(0, 50),
      unchangedLinesCount: unchangedCount,
    };
  }

  private extractKeyTopics(text: string): string[] {
    const words = text
      .toLowerCase()
      .replace(/[^a-z0-9\s]/g, '')
      .split(/\s+/)
      .filter((w) => w.length > 5);

    const stopWords = new Set([
      'should', 'could', 'would', 'because', 'through', 'between',
      'during', 'before', 'after', 'above', 'below', 'these', 'those',
    ]);

    const freq: Record<string, number> = {};
    for (const w of words) {
      if (!stopWords.has(w)) {
        freq[w] = (freq[w] || 0) + 1;
      }
    }

    const sorted = Object.entries(freq).sort((a, b) => b[1] - a[1]);
    const topics = sorted.slice(0, 4).map(([w]) => w.charAt(0).toUpperCase() + w.slice(1));
    return topics.length > 0 ? topics : ['Productivity', 'Documentation', 'Workflow'];
  }
}

export const aiService = new AiService();
