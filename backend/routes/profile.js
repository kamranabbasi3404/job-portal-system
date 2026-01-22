import express from 'express';
import { getMyProfile, updateMyProfile, uploadResume, getUserProfile, uploadProfilePicture } from '../controllers/profileController.js';
import { protect } from '../middleware/auth.js';
import upload from '../middleware/upload.js';
import uploadImage from '../middleware/uploadImage.js';

const router = express.Router();

router.get('/me', protect, getMyProfile);
router.put('/me', protect, updateMyProfile);
router.post('/resume', protect, upload.single('resume'), uploadResume);
router.post('/profile-picture', protect, uploadImage.single('profilePicture'), uploadProfilePicture);
router.get('/user/:userId', protect, getUserProfile);

export default router;
