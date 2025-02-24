import express from 'express';
import { body } from 'express-validator';
import * as authController from '../controllers/authController.js';
import { protect } from '../middleware/auth.js';
const router = express.Router();
router.post('/register', [
    body('name').trim().notEmpty().withMessage('Name is required'),
    body('email').isEmail().withMessage('Please enter a valid email'),
    body('role').isIn(['admin', 'student']).withMessage('Invalid role'),
    body('password')
        .isLength({ min: 8 })
        .withMessage('Password must be at least 8 characters long')
], authController.register);
router.post('/login', [
    body('email').isEmail().withMessage('Please enter a valid email'),
    body('password').notEmpty().withMessage('Password is required')
], authController.login);
router.get('/me', protect, authController.getCurrentUser);
// router.post('/forget-password', authController.forgotPassword);
// router.post('/reset-password/:token', authController.resetPassword);
export default router;
