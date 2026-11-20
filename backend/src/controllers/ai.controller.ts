import { Request, Response } from 'express';
import { aiService } from '../services/aiService';

export async function summarizeText(req: Request, res: Response) {
  try {
    const { text, depth } = req.body;
    if (!text || typeof text !== 'string') {
      return res.status(400).json({ error: 'Text content is required for summarization.' });
    }

    const result = await aiService.summarize(text, depth || 'detailed');
    res.json({ success: true, data: result });
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Summarization failed' });
  }
}

export async function translateText(req: Request, res: Response) {
  try {
    const { text, targetLang } = req.body;
    if (!text || !targetLang) {
      return res.status(400).json({ error: 'Text and targetLang are required.' });
    }

    const result = await aiService.translate(text, targetLang);
    res.json({ success: true, data: result });
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Translation failed' });
  }
}

export async function compareTexts(req: Request, res: Response) {
  try {
    const { doc1, doc2 } = req.body;
    if (!doc1 || !doc2) {
      return res.status(400).json({ error: 'Both doc1 and doc2 are required for comparison.' });
    }

    const result = await aiService.compare(doc1, doc2);
    res.json({ success: true, data: result });
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Comparison failed' });
  }
}
