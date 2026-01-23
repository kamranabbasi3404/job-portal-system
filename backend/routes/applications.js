import express from 'express';
import {
    applyForJob,
    getMyApplications,
    getEmployerApplications,
    updateApplicationStatus,
    deleteApplication,
    shortlistApplication,
    scheduleInterview,
    makeFinalDecision
} from '../controllers/applicationController.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

router.post('/', protect, authorize('jobseeker'), applyForJob);
router.get('/my-applications', protect, authorize('jobseeker'), getMyApplications);
router.get('/employer', protect, authorize('employer'), getEmployerApplications);
router.patch('/:id', protect, updateApplicationStatus);
router.delete('/:id', protect, authorize('jobseeker'), deleteApplication);

// New workflow routes
router.patch('/:id/shortlist', protect, authorize('employer'), shortlistApplication);
router.patch('/:id/schedule-interview', protect, authorize('employer'), scheduleInterview);
router.patch('/:id/final-decision', protect, authorize('employer'), makeFinalDecision);

export default router;
