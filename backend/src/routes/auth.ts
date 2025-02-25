import express from 'express';
import { body } from 'express-validator';
import * as authController from '../controllers/authController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.post('/register',
  authController.register
);

router.post('/login',
  authController.login
);

router.get('/me', protect, authController.getCurrentUser);

// router.post('/forget-password', authController.forgotPassword);

// router.post('/reset-password/:token', authController.resetPassword);

export default router;