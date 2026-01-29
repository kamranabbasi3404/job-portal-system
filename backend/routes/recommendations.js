import express from 'express';
import {
    getJobRecommendations,
    getRecommendationsForProfile
} from '../controllers/recommendationController.js';
import { protect, authorize } from '../middleware/auth.js';
import { protectAdmin } from '../middleware/adminAuth.js';

const router = express.Router();

// Get personalized job recommendations for logged-in job seeker
router.get('/', protect, authorize('jobseeker'), getJobRecommendations);

// Admin endpoint to get recommendations for any profile
router.get('/profile/:profileId', protectAdmin, getRecommendationsForProfile);

export default router;
