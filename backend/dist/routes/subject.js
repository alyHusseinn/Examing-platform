import { Router } from 'express';
import { routes } from '../controllers/subjectController.js';
import { checkAdmin } from '../middleware/checkRole.js';
const router = Router();
router.post('/', checkAdmin, routes.createSubject);
router.get('/', routes.getAllSubjects);
router.get('/:id', routes.getSubjectById);
router.delete('/:id', checkAdmin, routes.deleteSubject);
export default router;
