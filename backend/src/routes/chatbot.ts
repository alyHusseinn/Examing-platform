import express, { Request, Response } from 'express';
import { check, validationResult } from 'express-validator';
import { AIService } from '../services/gemini.js';

const router = express.Router();

router.post('/', [
  check('subject').notEmpty().withMessage('Subject is required'),
  check('question').notEmpty().withMessage('Question is required')
], async (req: Request, res: Response) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  const { subject, question } = req.body;
  const response = await AIService.askAiAboutSubject(subject, question);
  res.json({ response });
});

export default router;
