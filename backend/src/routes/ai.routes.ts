import { Router } from 'express';
import { summarizeText, translateText, compareTexts } from '../controllers/ai.controller';

const router = Router();

router.post('/summarize', summarizeText);
router.post('/translate', translateText);
router.post('/compare', compareTexts);

export default router;
