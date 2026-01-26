import PendingCompanyRequest from '../models/PendingCompanyRequest.js';
import User from '../models/User.js';
import CompanyProfile from '../models/CompanyProfile.js';
import { sendApprovalEmail, sendRejectionEmail } from '../utils/emailService.js';
import generateToken from '../utils/generateToken.js';
import bcrypt from 'bcryptjs';

// @desc    Submit a new company signup request
// @route   POST /api/pending-company
// @access  Public
export const submitCompanyRequest = async (req, res) => {
    try {
        const {
            companyName,
            email,
            password,
            phone,
            contactPerson,
            industry,
            companySize,
            website,
            address
        } = req.body;

        // Check if email already exists in users
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'An account with this email already exists' });
        }

        // Check if there's already a pending request with this email
        const existingRequest = await PendingCompanyRequest.findOne({
            email,
            status: 'pending'
        });
        if (existingRequest) {
            return res.status(400).json({ message: 'A pending request with this email already exists. Please wait for admin approval.' });
        }

        // Process uploaded documents
        const verificationDocuments = [];
        if (req.files && req.files.length > 0) {
            req.files.forEach(file => {
                verificationDocuments.push({
                    filename: file.filename,
                    originalName: file.originalname,
                    path: `/uploads/verification-documents/${file.filename}`,
                    mimetype: file.mimetype
                });
            });
        }

        // Validate that at least one document is uploaded
        if (verificationDocuments.length === 0) {
            return res.status(400).json({ message: 'At least one verification document is required' });
        }

        // Create pending request
        const pendingRequest = await PendingCompanyRequest.create({
            companyName,
            email,
            password,
            phone,
            contactPerson,
            industry,
            companySize,
            website,
            address,
            verificationDocuments
        });

        res.status(201).json({
            success: true,
            message: 'Your request has been submitted successfully. Your account will be created after admin approval.',
            requestId: pendingRequest._id
        });
    } catch (error) {
        console.error('Error submitting company request:', error);
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get all pending company requests
// @route   GET /api/admin/pending-companies
// @access  Private/Admin
export const getAllPendingRequests = async (req, res) => {
    try {
        const { page = 1, limit = 10, status = 'all' } = req.query;

        const query = {};
        if (status !== 'all') {
            query.status = status;
        }

        const requests = await PendingCompanyRequest.find(query)
            .select('-password')
            .sort({ createdAt: -1 })
            .limit(limit * 1)
            .skip((page - 1) * limit);

        const count = await PendingCompanyRequest.countDocuments(query);

        // Get counts by status
        const pendingCount = await PendingCompanyRequest.countDocuments({ status: 'pending' });
        const approvedCount = await PendingCompanyRequest.countDocuments({ status: 'approved' });
        const declinedCount = await PendingCompanyRequest.countDocuments({ status: 'declined' });

        res.json({
            requests,
            totalPages: Math.ceil(count / limit),
            currentPage: page,
            total: count,
            stats: {
                pending: pendingCount,
                approved: approvedCount,
                declined: declinedCount
            }
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Approve a company request
// @route   PUT /api/admin/pending-companies/:id/approve
// @access  Private/Admin
export const approveRequest = async (req, res) => {
    try {
        const request = await PendingCompanyRequest.findById(req.params.id);

        if (!request) {
            return res.status(404).json({ message: 'Request not found' });
        }

        if (request.status !== 'pending') {
            return res.status(400).json({ message: `Request has already been ${request.status}` });
        }

        // Create user account (password is already hashed in the request)
        const user = new User({
            name: request.companyName,
            email: request.email,
            password: request.password, // Already hashed
            phone: request.phone,
            role: 'employer'
        });

        // Skip password hashing since it's already hashed
        user.$skipPasswordHashing = true;
        await user.save();

        // Create company profile
        await CompanyProfile.create({
            user: user._id,
            companyName: request.companyName,
            industry: request.industry,
            companySize: request.companySize,
            website: request.website,
            location: request.address,
            phone: request.phone,
            email: request.email
        });

        // Update request status
        request.status = 'approved';
        request.reviewedAt = new Date();
        request.reviewedBy = req.user._id;
        await request.save();

        // Send approval email
        await sendApprovalEmail(request.email, request.companyName);

        res.json({
            success: true,
            message: 'Company request approved successfully. Account created and email sent.',
            userId: user._id
        });
    } catch (error) {
        console.error('Error approving request:', error);
        res.status(500).json({ message: error.message });
    }
};

// @desc    Decline a company request
// @route   PUT /api/admin/pending-companies/:id/decline
// @access  Private/Admin
export const declineRequest = async (req, res) => {
    try {
        const { reason } = req.body;
        const request = await PendingCompanyRequest.findById(req.params.id);

        if (!request) {
            return res.status(404).json({ message: 'Request not found' });
        }

        if (request.status !== 'pending') {
            return res.status(400).json({ message: `Request has already been ${request.status}` });
        }

        // Update request status
        request.status = 'declined';
        request.declineReason = reason || '';
        request.reviewedAt = new Date();
        request.reviewedBy = req.user._id;
        await request.save();

        // Send rejection email
        await sendRejectionEmail(request.email, request.companyName, reason);

        res.json({
            success: true,
            message: 'Company request declined successfully. Notification email sent.'
        });
    } catch (error) {
        console.error('Error declining request:', error);
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get a single pending request details
// @route   GET /api/admin/pending-companies/:id
// @access  Private/Admin
export const getRequestById = async (req, res) => {
    try {
        const request = await PendingCompanyRequest.findById(req.params.id)
            .select('-password')
            .populate('reviewedBy', 'name email');

        if (!request) {
            return res.status(404).json({ message: 'Request not found' });
        }

        res.json(request);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
