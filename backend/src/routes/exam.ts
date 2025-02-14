import { Router } from 'express';
import { getExamById, submitExam } from '../controllers/examController.js';

const router = Router();

router.get('/:id', getExamById);
router.post('/:id', submitExam);


export default router;
