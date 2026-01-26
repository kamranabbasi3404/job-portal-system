import express from 'express';
import {
    adminLogin,
    getDashboardStats,
    getAllUsers,
    getUserById,
    deleteUser,
    getAllJobs,
    updateJobStatus,
    deleteJob,
    getAllApplications
} from '../controllers/adminController.js';
import { protectAdmin } from '../middleware/adminAuth.js';

const router = express.Router();

// Public route
router.post('/login', adminLogin);

// Protected admin routes
router.get('/dashboard', protectAdmin, getDashboardStats);

// User management
router.get('/users', protectAdmin, getAllUsers);
router.get('/users/:id', protectAdmin, getUserById);
router.delete('/users/:id', protectAdmin, deleteUser);

// Job management
router.get('/jobs', protectAdmin, getAllJobs);
router.put('/jobs/:id', protectAdmin, updateJobStatus);
router.delete('/jobs/:id', protectAdmin, deleteJob);

// Application management
router.get('/applications', protectAdmin, getAllApplications);

export default router;
