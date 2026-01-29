import Application from '../models/Application.js';
import Job from '../models/Job.js';
import User from '../models/User.js';
import CompanyProfile from '../models/CompanyProfile.js';
import { sendShortlistEmail, sendInterviewScheduledEmail } from '../utils/emailService.js';

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
            .populate('job', 'title company employer')
            .populate('jobSeeker', 'name email');

        // Get current company name
        if (populatedApplication.job?.employer) {
            const companyProfile = await CompanyProfile.findOne({ user: populatedApplication.job.employer }).select('companyName');
            if (companyProfile?.companyName) {
                populatedApplication.job.company = companyProfile.companyName;
            }
        }

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
            .populate('job', 'title company location type salary employer')
            .sort({ createdAt: -1 });

        // Get current company names for all jobs
        const employerIds = [...new Set(applications
            .map(app => app.job?.employer?.toString())
            .filter(Boolean))];

        const companyProfiles = await CompanyProfile.find({ user: { $in: employerIds } })
            .select('user companyName')
            .lean();

        // Create a map of employer ID to current company name
        const companyNameMap = {};
        companyProfiles.forEach(cp => {
            if (cp.user && cp.companyName) {
                companyNameMap[cp.user.toString()] = cp.companyName;
            }
        });

        // Update applications with current company names
        const updatedApplications = applications.map(app => {
            const appObj = app.toObject();
            if (appObj.job?.employer) {
                const currentName = companyNameMap[appObj.job.employer.toString()];
                if (currentName) {
                    appObj.job.company = currentName;
                }
            }
            return appObj;
        });

        res.json(updatedApplications);
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
            .populate('job', 'title company employer')
            .populate('jobSeeker', 'name email phone')
            .sort({ createdAt: -1 });

        // Get current company name for employer
        const companyProfile = await CompanyProfile.findOne({ user: req.user._id })
            .select('companyName')
            .lean();

        // Update applications with current company name
        const updatedApplications = applications.map(app => {
            const appObj = app.toObject();
            if (companyProfile?.companyName && appObj.job) {
                appObj.job.company = companyProfile.companyName;
            }
            return appObj;
        });

        res.json(updatedApplications);
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

// @desc    Shortlist an application
// @route   PATCH /api/applications/:id/shortlist
// @access  Private/Employer
export const shortlistApplication = async (req, res) => {
    try {
        const application = await Application.findById(req.params.id).populate('job');

        if (!application) {
            return res.status(404).json({ message: 'Application not found' });
        }

        // Check if employer owns the job
        if (application.job.employer.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: 'Not authorized' });
        }

        application.status = 'shortlisted';
        application.shortlistNotes = req.body.shortlistNotes || '';
        await application.save();

        const updatedApplication = await Application.findById(application._id)
            .populate('job', 'title company employer')
            .populate('jobSeeker', 'name email phone');

        // Get current company name and send email notification
        try {
            const companyProfile = await CompanyProfile.findOne({ user: req.user._id }).select('companyName');
            const companyName = companyProfile?.companyName || updatedApplication.job.company;
            const applicantName = updatedApplication.jobSeeker.name;
            const applicantEmail = updatedApplication.jobSeeker.email;
            const jobTitle = updatedApplication.job.title;

            // Send shortlist notification email
            await sendShortlistEmail(applicantEmail, applicantName, jobTitle, companyName);
            console.log('📧 Shortlist email sent to:', applicantEmail);
        } catch (emailError) {
            console.error('Failed to send shortlist email:', emailError.message);
            // Don't fail the request if email fails
        }

        res.json(updatedApplication);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Schedule interview for an application
// @route   PATCH /api/applications/:id/schedule-interview
// @access  Private/Employer
export const scheduleInterview = async (req, res) => {
    try {
        const application = await Application.findById(req.params.id).populate('job');

        if (!application) {
            return res.status(404).json({ message: 'Application not found' });
        }

        // Check if employer owns the job
        if (application.job.employer.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: 'Not authorized' });
        }

        // Validate that application is shortlisted
        if (application.status !== 'shortlisted') {
            return res.status(400).json({ message: 'Application must be shortlisted before scheduling interview' });
        }

        const { type, dateTime, location, meetingLink } = req.body;

        // Validate required fields
        if (!type || !dateTime) {
            return res.status(400).json({ message: 'Interview type and date/time are required' });
        }

        if (type === 'on-site' && !location) {
            return res.status(400).json({ message: 'Location is required for on-site interviews' });
        }

        if (type === 'online' && !meetingLink) {
            return res.status(400).json({ message: 'Meeting link is required for online interviews' });
        }

        application.status = 'interview_scheduled';
        application.interviewDetails = {
            type,
            dateTime: new Date(dateTime),
            location: type === 'on-site' ? location : undefined,
            meetingLink: type === 'online' ? meetingLink : undefined
        };
        await application.save();

        const updatedApplication = await Application.findById(application._id)
            .populate('job', 'title company employer')
            .populate('jobSeeker', 'name email phone');

        // Get current company name and send email notification
        try {
            const companyProfile = await CompanyProfile.findOne({ user: req.user._id }).select('companyName');
            const companyName = companyProfile?.companyName || updatedApplication.job.company;
            const applicantName = updatedApplication.jobSeeker.name;
            const applicantEmail = updatedApplication.jobSeeker.email;
            const jobTitle = updatedApplication.job.title;

            // Send interview scheduled notification email
            await sendInterviewScheduledEmail(applicantEmail, applicantName, jobTitle, companyName, {
                type,
                dateTime,
                location,
                meetingLink
            });
            console.log('📧 Interview scheduled email sent to:', applicantEmail);
        } catch (emailError) {
            console.error('Failed to send interview email:', emailError.message);
            // Don't fail the request if email fails
        }

        res.json(updatedApplication);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Make final hiring decision
// @route   PATCH /api/applications/:id/final-decision
// @access  Private/Employer
export const makeFinalDecision = async (req, res) => {
    try {
        const application = await Application.findById(req.params.id).populate('job');

        if (!application) {
            return res.status(404).json({ message: 'Application not found' });
        }

        // Check if employer owns the job
        if (application.job.employer.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: 'Not authorized' });
        }

        const { decision, rejectionReason } = req.body;

        // Validate decision
        if (!decision || !['selected', 'rejected'].includes(decision)) {
            return res.status(400).json({ message: 'Decision must be either "selected" or "rejected"' });
        }

        application.status = decision;
        if (decision === 'rejected' && rejectionReason) {
            application.rejectionReason = rejectionReason;
        }
        await application.save();

        const updatedApplication = await Application.findById(application._id)
            .populate('job', 'title company')
            .populate('jobSeeker', 'name email phone');

        res.json(updatedApplication);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
