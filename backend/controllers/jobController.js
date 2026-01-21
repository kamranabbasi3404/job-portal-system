import Job from '../models/Job.js';
import Application from '../models/Application.js';

// @desc    Get all jobs
// @route   GET /api/jobs
// @access  Public
export const getJobs = async (req, res) => {
    try {
        const { search, location, type, skills } = req.query;
        let query = { status: 'active' };

        if (search) {
            query.$text = { $search: search };
        }
        if (location) {
            query.location = { $regex: location, $options: 'i' };
        }
        if (type) {
            query.type = type;
        }
        if (skills) {
            query.skills = { $in: skills.split(',') };
        }

        const jobs = await Job.find(query).populate('employer', 'name email').sort({ createdAt: -1 });
        res.json(jobs);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get single job
// @route   GET /api/jobs/:id
// @access  Public
export const getJobById = async (req, res) => {
    try {
        const job = await Job.findById(req.params.id).populate('employer', 'name email phone');

        if (job) {
            // Increment views
            job.views += 1;
            await job.save();
            res.json(job);
        } else {
            res.status(404).json({ message: 'Job not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Create job
// @route   POST /api/jobs
// @access  Private/Employer
export const createJob = async (req, res) => {
    try {
        const job = await Job.create({
            ...req.body,
            employer: req.user._id
        });
        res.status(201).json(job);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Update job
// @route   PUT /api/jobs/:id
// @access  Private/Employer
export const updateJob = async (req, res) => {
    try {
        const job = await Job.findById(req.params.id);

        if (!job) {
            return res.status(404).json({ message: 'Job not found' });
        }

        // Check ownership
        if (job.employer.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: 'Not authorized to update this job' });
        }

        const updatedJob = await Job.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        });

        res.json(updatedJob);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Delete job
// @route   DELETE /api/jobs/:id
// @access  Private/Employer
export const deleteJob = async (req, res) => {
    try {
        const job = await Job.findById(req.params.id);

        if (!job) {
            return res.status(404).json({ message: 'Job not found' });
        }

        // Check ownership
        if (job.employer.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: 'Not authorized to delete this job' });
        }

        await job.deleteOne();
        res.json({ message: 'Job removed' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get employer's jobs
// @route   GET /api/jobs/my-jobs
// @access  Private/Employer
export const getMyJobs = async (req, res) => {
    try {
        const jobs = await Job.find({ employer: req.user._id }).sort({ createdAt: -1 });
        res.json(jobs);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Delete ALL jobs (Admin cleanup)
// @route   DELETE /api/jobs/cleanup/all
// @access  Private/Employer (use carefully)
export const deleteAllJobs = async (req, res) => {
    try {
        const result = await Job.deleteMany({});
        res.json({ message: 'All jobs deleted', deletedCount: result.deletedCount });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
