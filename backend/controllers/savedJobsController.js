import SavedJob from '../models/SavedJob.js';
import Job from '../models/Job.js';

// @desc    Save a job
// @route   POST /api/saved-jobs/:jobId
// @access  Private/JobSeeker
export const saveJob = async (req, res) => {
    try {
        const { jobId } = req.params;

        // Check if job exists
        const job = await Job.findById(jobId);
        if (!job) {
            return res.status(404).json({ message: 'Job not found' });
        }

        // Check if already saved
        const existingSave = await SavedJob.findOne({
            user: req.user._id,
            job: jobId
        });

        if (existingSave) {
            return res.status(400).json({ message: 'Job already saved' });
        }

        // Create saved job
        const savedJob = await SavedJob.create({
            user: req.user._id,
            job: jobId
        });

        res.status(201).json({ message: 'Job saved successfully', savedJob });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Unsave a job
// @route   DELETE /api/saved-jobs/:jobId
// @access  Private/JobSeeker
export const unsaveJob = async (req, res) => {
    try {
        const { jobId } = req.params;

        const savedJob = await SavedJob.findOneAndDelete({
            user: req.user._id,
            job: jobId
        });

        if (!savedJob) {
            return res.status(404).json({ message: 'Saved job not found' });
        }

        res.json({ message: 'Job unsaved successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get all saved jobs for current user
// @route   GET /api/saved-jobs
// @access  Private/JobSeeker
export const getSavedJobs = async (req, res) => {
    try {
        const savedJobs = await SavedJob.find({ user: req.user._id })
            .populate({
                path: 'job',
                select: 'title company location type salary description requirements postedDate'
            })
            .sort({ createdAt: -1 });

        // Filter out any saved jobs where the job was deleted
        const validSavedJobs = savedJobs.filter(saved => saved.job !== null);

        res.json(validSavedJobs);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Check if jobs are saved (for multiple jobs at once)
// @route   POST /api/saved-jobs/check
// @access  Private/JobSeeker
export const checkSavedJobs = async (req, res) => {
    try {
        const { jobIds } = req.body;

        if (!jobIds || !Array.isArray(jobIds)) {
            return res.status(400).json({ message: 'jobIds array is required' });
        }

        const savedJobs = await SavedJob.find({
            user: req.user._id,
            job: { $in: jobIds }
        });

        // Return object with jobId as key and boolean as value
        const savedStatus = {};
        jobIds.forEach(id => {
            savedStatus[id] = savedJobs.some(saved => saved.job.toString() === id);
        });

        res.json(savedStatus);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
