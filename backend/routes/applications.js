import express from 'express';
import {
    applyForJob,
    getMyApplications,
    getEmployerApplications,
    updateApplicationStatus,
    deleteApplication
} from '../controllers/applicationController.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

router.post('/', protect, authorize('jobseeker'), applyForJob);
router.get('/my-applications', protect, authorize('jobseeker'), getMyApplications);
router.get('/employer', protect, authorize('employer'), getEmployerApplications);
router.patch('/:id', protect, updateApplicationStatus);
router.delete('/:id', protect, authorize('jobseeker'), deleteApplication);

export default router;
