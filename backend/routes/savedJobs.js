import express from 'express';
import { saveJob, unsaveJob, getSavedJobs, checkSavedJobs } from '../controllers/savedJobsController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// All routes require authentication and are for job seekers
router.get('/', protect, getSavedJobs);
router.post('/check', protect, checkSavedJobs);
router.post('/:jobId', protect, saveJob);
router.delete('/:jobId', protect, unsaveJob);

export default router;
