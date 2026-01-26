import express from 'express';
import {
    submitCompanyRequest,
    getAllPendingRequests,
    approveRequest,
    declineRequest,
    getRequestById
} from '../controllers/pendingCompanyController.js';
import { protectAdmin } from '../middleware/adminAuth.js';
import uploadVerificationDocs from '../middleware/uploadVerificationDocs.js';

const router = express.Router();

// Public route - Submit company signup request
router.post('/', uploadVerificationDocs.array('verificationDocuments', 5), submitCompanyRequest);

// Admin routes - Protected with admin auth only
router.get('/admin', protectAdmin, getAllPendingRequests);
router.get('/admin/:id', protectAdmin, getRequestById);
router.put('/admin/:id/approve', protectAdmin, approveRequest);
router.put('/admin/:id/decline', protectAdmin, declineRequest);

export default router;

