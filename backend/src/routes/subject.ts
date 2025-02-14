import { Router } from 'express';
import { createSubject, getAllSubjects, getSubjectById } from '../controllers/subjectController.js';
import { checkAdmin } from '../middleware/checkRole.js';
// import { protect } from '../middleware/auth.js';

const router = Router();

router.post('/', checkAdmin, createSubject);
router.get('/', getAllSubjects);
router.get('/:id', getSubjectById);

export default router;
