import { Router } from 'express';
import { getUserStats } from '../controllers/userController.js';
const router = Router();
router.get('/stats/:id?', getUserStats);
export default router;
