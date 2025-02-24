import express from 'express';
import { check, validationResult } from 'express-validator';
import { AIService } from '../services/gemini.js';
const router = express.Router();
router.post('/', [
    check('subject').notEmpty().withMessage('Subject is required'),
    check('question').notEmpty().withMessage('Question is required')
], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    const { subject, question } = req.body;
    try {
        const response = await AIService.askAiAboutSubject(subject, question);
        res.json({ response });
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to get response from AI' });
    }
});
export default router;
