import express from 'express';
import { getMyProfile, updateMyProfile, uploadResume, getUserProfile } from '../controllers/profileController.js';
import { protect } from '../middleware/auth.js';
import upload from '../middleware/upload.js';

const router = express.Router();

router.get('/me', protect, getMyProfile);
router.put('/me', protect, updateMyProfile);
router.post('/resume', protect, upload.single('resume'), uploadResume);
router.get('/user/:userId', protect, getUserProfile);

export default router;
