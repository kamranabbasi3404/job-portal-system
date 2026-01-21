import Profile from '../models/Profile.js';
import fs from 'fs';
import path from 'path';

// @desc    Get user profile
// @route   GET /api/profile/me
// @access  Private
export const getMyProfile = async (req, res) => {
    try {
        let profile = await Profile.findOne({ user: req.user.id }).populate('user', 'name email');

        if (!profile) {
            // Create empty profile if doesn't exist
            profile = await Profile.create({ user: req.user.id });
        }

        res.json(profile);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Update user profile
// @route   PUT /api/profile/me
// @access  Private
export const updateMyProfile = async (req, res) => {
    try {
        const { about, skills, experience, education, phone, location, website, linkedin, github } = req.body;

        let profile = await Profile.findOne({ user: req.user.id });

        if (!profile) {
            profile = await Profile.create({
                user: req.user.id,
                about,
                skills,
                experience,
                education,
                phone,
                location,
                website,
                linkedin,
                github
            });
        } else {
            profile.about = about !== undefined ? about : profile.about;
            profile.skills = skills !== undefined ? skills : profile.skills;
            profile.experience = experience !== undefined ? experience : profile.experience;
            profile.education = education !== undefined ? education : profile.education;
            profile.phone = phone !== undefined ? phone : profile.phone;
            profile.location = location !== undefined ? location : profile.location;
            profile.website = website !== undefined ? website : profile.website;
            profile.linkedin = linkedin !== undefined ? linkedin : profile.linkedin;
            profile.github = github !== undefined ? github : profile.github;

            await profile.save();
        }

        res.json(profile);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Upload resume
// @route   POST /api/profile/resume
// @access  Private
export const uploadResume = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: 'No file uploaded' });
        }

        let profile = await Profile.findOne({ user: req.user.id });

        if (!profile) {
            profile = await Profile.create({ user: req.user.id });
        }

        // Delete old resume if exists
        if (profile.resume) {
            const oldPath = path.join(process.cwd(), 'uploads', 'resumes', path.basename(profile.resume));
            if (fs.existsSync(oldPath)) {
                fs.unlinkSync(oldPath);
            }
        }

        // Save new resume path
        profile.resume = `/uploads/resumes/${req.file.filename}`;
        await profile.save();

        res.json({ resume: profile.resume });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get user profile by userId (for employers viewing applicants)
// @route   GET /api/profile/user/:userId
// @access  Private/Employer
export const getUserProfile = async (req, res) => {
    try {
        const profile = await Profile.findOne({ user: req.params.userId })
            .populate('user', 'name email phone');

        if (!profile) {
            return res.status(404).json({ message: 'Profile not found' });
        }

        res.json(profile);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
