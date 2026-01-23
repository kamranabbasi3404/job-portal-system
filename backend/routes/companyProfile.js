import express from 'express';
import { getMyCompanyProfile, updateMyCompanyProfile, uploadCompanyLogo, getCompanyProfile } from '../controllers/companyProfileController.js';
import { protect, authorize } from '../middleware/auth.js';
import uploadCompanyLogoMiddleware from '../middleware/uploadCompanyLogo.js';

const router = express.Router();

router.get('/me', protect, authorize('employer'), getMyCompanyProfile);
router.put('/me', protect, authorize('employer'), updateMyCompanyProfile);
router.post('/profile-picture', protect, authorize('employer'), uploadCompanyLogoMiddleware.single('profilePicture'), uploadCompanyLogo);
router.get('/user/:userId', getCompanyProfile);

export default router;
