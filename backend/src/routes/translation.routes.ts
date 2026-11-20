import { Router, Request, Response } from 'express';
import { ALL_LANGUAGES, getPublishedLanguages, isPublishedLanguage, getTranslations } from '../i18n';
import { translationService } from '../services/translationService';

const router = Router();

// GET /api/v1/i18n/languages
router.get('/languages', (_req: Request, res: Response) => {
  const languages = getPublishedLanguages();
  res.json({
    languagesCount: languages.length,
    languages,
  });
});

// GET /api/v1/i18n/translations/:lang
router.get('/translations/:lang', (req: Request, res: Response) => {
  const { lang } = req.params;
  const translations = getTranslations(lang);
  res.json({
    lang,
    isPublished: isPublishedLanguage(lang),
    translations,
  });
});

// POST /api/v1/i18n/translate
router.post('/translate', async (req: Request, res: Response) => {
  try {
    const { text, targetLang, sourceLang = 'en' } = req.body;
    if (!text || !targetLang) {
      return res.status(400).json({ error: 'Text and targetLang are required.' });
    }

    const result = await translationService.translateText(text, targetLang, sourceLang);
    return res.json(result);
  } catch (err: any) {
    console.error('[Translation API Error]', err);
    return res.status(500).json({ error: 'Translation processing failed.' });
  }
});

export default router;
