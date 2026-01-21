import express from 'express';
import {
    getJobs,
    getJobById,
    createJob,
    updateJob,
    deleteJob,
    getMyJobs
} from '../controllers/jobController.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

router.get('/', getJobs);
router.get('/my-jobs', protect, authorize('employer'), getMyJobs);
router.post('/', protect, authorize('employer'), createJob);
router.get('/:id', getJobById);
router.put('/:id', protect, authorize('employer'), updateJob);
router.patch('/:id', protect, authorize('employer'), updateJob);
router.delete('/:id', protect, authorize('employer'), deleteJob);

export default router;
