import User from '../models/User.js';
import Job from '../models/Job.js';
import Application from '../models/Application.js';
import CompanyProfile from '../models/CompanyProfile.js';
import generateToken from '../utils/generateToken.js';

// @desc    Admin login
// @route   POST /api/admin/login
// @access  Public
export const adminLogin = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Check for admin user
        const user = await User.findOne({ email, role: 'admin' });

        if (!user) {
            return res.status(401).json({ message: 'Invalid admin credentials' });
        }

        if (await user.matchPassword(password)) {
            res.json({
                _id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                token: generateToken(user._id)
            });
        } else {
            res.status(401).json({ message: 'Invalid admin credentials' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get dashboard statistics
// @route   GET /api/admin/dashboard
// @access  Private/Admin
export const getDashboardStats = async (req, res) => {
    try {
        const totalUsers = await User.countDocuments({ role: { $ne: 'admin' } });
        const totalJobSeekers = await User.countDocuments({ role: 'jobseeker' });
        const totalEmployers = await User.countDocuments({ role: 'employer' });
        const totalJobs = await Job.countDocuments();
        const activeJobs = await Job.countDocuments({ status: 'active' });
        const totalApplications = await Application.countDocuments();

        // Get recent users (last 5)
        const recentUsers = await User.find({ role: { $ne: 'admin' } })
            .sort({ createdAt: -1 })
            .limit(5)
            .select('-password');

        // Get recent jobs (last 5)
        const recentJobs = await Job.find()
            .sort({ createdAt: -1 })
            .limit(5)
            .populate('employer', 'name email');

        // Get company profiles for recent jobs
        const employerIds = recentJobs.map(job => job.employer?._id).filter(Boolean);
        const companyProfiles = await CompanyProfile.find({ user: { $in: employerIds } });

        const profileMap = {};
        companyProfiles.forEach(profile => {
            profileMap[profile.user.toString()] = profile;
        });

        // Attach current company name to each job
        const jobsWithCurrentCompany = recentJobs.map(job => {
            const jobObj = job.toObject();
            const employerId = job.employer?._id?.toString();
            const profile = profileMap[employerId];
            jobObj.currentCompanyName = profile?.companyName || job.company;
            return jobObj;
        });

        // Application status breakdown
        const applicationStats = await Application.aggregate([
            {
                $group: {
                    _id: '$status',
                    count: { $sum: 1 }
                }
            }
        ]);

        res.json({
            stats: {
                totalUsers,
                totalJobSeekers,
                totalEmployers,
                totalJobs,
                activeJobs,
                totalApplications
            },
            recentUsers,
            recentJobs: jobsWithCurrentCompany,
            applicationStats
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get all users
// @route   GET /api/admin/users
// @access  Private/Admin
export const getAllUsers = async (req, res) => {
    try {
        const { page = 1, limit = 10, role, search } = req.query;

        const query = { role: { $ne: 'admin' } };

        if (role && role !== 'all') {
            query.role = role;
        }

        if (search) {
            query.$or = [
                { name: { $regex: search, $options: 'i' } },
                { email: { $regex: search, $options: 'i' } }
            ];
        }

        const users = await User.find(query)
            .select('-password')
            .limit(limit * 1)
            .skip((page - 1) * limit)
            .sort({ createdAt: -1 });

        const count = await User.countDocuments(query);

        res.json({
            users,
            totalPages: Math.ceil(count / limit),
            currentPage: page,
            total: count
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get user by ID
// @route   GET /api/admin/users/:id
// @access  Private/Admin
export const getUserById = async (req, res) => {
    try {
        const user = await User.findById(req.params.id).select('-password');

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Get additional stats based on role
        let additionalData = {};

        if (user.role === 'jobseeker') {
            const applications = await Application.countDocuments({ jobSeeker: user._id });
            additionalData.totalApplications = applications;
        } else if (user.role === 'employer') {
            const jobs = await Job.countDocuments({ employer: user._id });
            const applications = await Application.countDocuments({
                job: { $in: await Job.find({ employer: user._id }).distinct('_id') }
            });
            additionalData.totalJobs = jobs;
            additionalData.totalApplicationsReceived = applications;
        }

        res.json({ user, ...additionalData });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Delete user
// @route   DELETE /api/admin/users/:id
// @access  Private/Admin
export const deleteUser = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        if (user.role === 'admin') {
            return res.status(403).json({ message: 'Cannot delete admin users' });
        }

        // Delete related data
        if (user.role === 'jobseeker') {
            await Application.deleteMany({ jobSeeker: user._id });
        } else if (user.role === 'employer') {
            const jobs = await Job.find({ employer: user._id });
            const jobIds = jobs.map(job => job._id);
            await Application.deleteMany({ job: { $in: jobIds } });
            await Job.deleteMany({ employer: user._id });
        }

        await user.deleteOne();

        res.json({ message: 'User deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get all jobs
// @route   GET /api/admin/jobs
// @access  Private/Admin
export const getAllJobs = async (req, res) => {
    try {
        const { page = 1, limit = 10, status, search } = req.query;

        const query = {};

        if (status && status !== 'all') {
            query.status = status;
        }

        if (search) {
            query.$or = [
                { title: { $regex: search, $options: 'i' } },
                { company: { $regex: search, $options: 'i' } }
            ];
        }

        const jobs = await Job.find(query)
            .populate('employer', 'name email')
            .limit(limit * 1)
            .skip((page - 1) * limit)
            .sort({ createdAt: -1 });

        // Get company profiles for all employers
        const employerIds = jobs.map(job => job.employer?._id).filter(Boolean);
        const companyProfiles = await CompanyProfile.find({ user: { $in: employerIds } });

        // Create a map of employer ID to company profile
        const profileMap = {};
        companyProfiles.forEach(profile => {
            profileMap[profile.user.toString()] = profile;
        });

        // Attach current company name to each job
        const jobsWithCurrentCompany = jobs.map(job => {
            const jobObj = job.toObject();
            const employerId = job.employer?._id?.toString();
            const profile = profileMap[employerId];

            // Add current company name from profile (if exists), otherwise use job's company field
            jobObj.currentCompanyName = profile?.companyName || job.company;

            return jobObj;
        });

        const count = await Job.countDocuments(query);

        res.json({
            jobs: jobsWithCurrentCompany,
            totalPages: Math.ceil(count / limit),
            currentPage: page,
            total: count
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Update job status
// @route   PUT /api/admin/jobs/:id
// @access  Private/Admin
export const updateJobStatus = async (req, res) => {
    try {
        const { status } = req.body;

        const job = await Job.findById(req.params.id);

        if (!job) {
            return res.status(404).json({ message: 'Job not found' });
        }

        job.status = status;
        await job.save();

        res.json({ message: 'Job status updated successfully', job });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Delete job
// @route   DELETE /api/admin/jobs/:id
// @access  Private/Admin
export const deleteJob = async (req, res) => {
    try {
        const job = await Job.findById(req.params.id);

        if (!job) {
            return res.status(404).json({ message: 'Job not found' });
        }

        // Delete all applications for this job
        await Application.deleteMany({ job: job._id });

        await job.deleteOne();

        res.json({ message: 'Job deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get all applications
// @route   GET /api/admin/applications
// @access  Private/Admin
export const getAllApplications = async (req, res) => {
    try {
        const { page = 1, limit = 10, status } = req.query;

        const query = {};

        if (status && status !== 'all') {
            query.status = status;
        }

        const applications = await Application.find(query)
            .populate('jobSeeker', 'name email')
            .populate('job', 'title company')
            .limit(limit * 1)
            .skip((page - 1) * limit)
            .sort({ createdAt: -1 });

        const count = await Application.countDocuments(query);

        res.json({
            applications,
            totalPages: Math.ceil(count / limit),
            currentPage: page,
            total: count
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
