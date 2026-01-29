import express from 'express';
import { register, login, getMe, googleAuth, forgotPassword, verifyOTP, resetPassword } from '../controllers/authController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.get('/me', protect, getMe);

// Google OAuth route (for existing users only)
router.post('/google', googleAuth);

// Forgot Password routes
router.post('/forgot-password', forgotPassword);
router.post('/verify-otp', verifyOTP);
router.post('/reset-password', resetPassword);

export default router;
