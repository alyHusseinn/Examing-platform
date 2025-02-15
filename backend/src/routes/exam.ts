import { Router } from 'express';
import { routes } from '../controllers/examController.js';
import { checkStudent } from '../middleware/checkRole.js';

const router = Router();

router.get('/:id', routes.getExamById);
router.post('/:id', checkStudent, routes.submitExam);


export default router;
