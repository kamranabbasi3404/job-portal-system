import Application from '../models/Application.js';
import Job from '../models/Job.js';
import User from '../models/User.js';

// @desc    Apply for a job
// @route   POST /api/applications
// @access  Private/JobSeeker
export const applyForJob = async (req, res) => {
    try {
        const { jobId, coverLetter, resumeUrl } = req.body;

        // Check if job exists
        const job = await Job.findById(jobId);
        if (!job) {
            return res.status(404).json({ message: 'Job not found' });
        }

        // Check if already applied
        const existingApplication = await Application.findOne({
            job: jobId,
            jobSeeker: req.user._id
        });

        if (existingApplication) {
            return res.status(400).json({ message: 'You have already applied for this job' });
        }

        // Create application
        const application = await Application.create({
            job: jobId,
            jobSeeker: req.user._id,
            coverLetter,
            resumeUrl
        });

        // Update job applicants count
        job.applicants += 1;
        await job.save();

        const populatedApplication = await Application.findById(application._id)
            .populate('job', 'title company')
            .populate('jobSeeker', 'name email');

        res.status(201).json(populatedApplication);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get job seeker's applications
// @route   GET /api/applications/my-applications
// @access  Private/JobSeeker
export const getMyApplications = async (req, res) => {
    try {
        const applications = await Application.find({ jobSeeker: req.user._id })
            .populate('job', 'title company location type salary')
            .sort({ createdAt: -1 });

        res.json(applications);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get applications for employer's jobs
// @route   GET /api/applications/employer
// @access  Private/Employer
export const getEmployerApplications = async (req, res) => {
    try {
        // Get all jobs for this employer
        const jobs = await Job.find({ employer: req.user._id });
        const jobIds = jobs.map(job => job._id);

        // Get all applications for these jobs
        const applications = await Application.find({ job: { $in: jobIds } })
            .populate('job', 'title company')
            .populate('jobSeeker', 'name email phone')
            .sort({ createdAt: -1 });

        res.json(applications);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Update application status
// @route   PATCH /api/applications/:id
// @access  Private/Employer
export const updateApplicationStatus = async (req, res) => {
    try {
        const application = await Application.findById(req.params.id).populate('job');

        if (!application) {
            return res.status(404).json({ message: 'Application not found' });
        }

        // Check if employer owns the job
        if (application.job.employer.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: 'Not authorized' });
        }

        application.status = req.body.status || application.status;
        await application.save();

        res.json(application);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Delete application
// @route   DELETE /api/applications/:id
// @access  Private/JobSeeker
export const deleteApplication = async (req, res) => {
    try {
        const application = await Application.findById(req.params.id);

        if (!application) {
            return res.status(404).json({ message: 'Application not found' });
        }

        // Check ownership
        if (application.jobSeeker.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: 'Not authorized' });
        }

        await application.deleteOne();

        // Decrease job applicants count
        await Job.findByIdAndUpdate(application.job, { $inc: { applicants: -1 } });

        res.json({ message: 'Application withdrawn' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
