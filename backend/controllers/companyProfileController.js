import CompanyProfile from '../models/CompanyProfile.js';
import fs from 'fs';
import path from 'path';

// @desc    Get company profile
// @route   GET /api/company-profile/me
// @access  Private/Employer
export const getMyCompanyProfile = async (req, res) => {
    try {
        let profile = await CompanyProfile.findOne({ user: req.user.id }).populate('user', 'name email phone');

        if (!profile) {
            // Create empty profile if doesn't exist
            profile = await CompanyProfile.create({ user: req.user.id });
            profile = await CompanyProfile.findById(profile._id).populate('user', 'name email phone');
        }

        res.json(profile);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Update company profile
// @route   PUT /api/company-profile/me
// @access  Private/Employer
export const updateMyCompanyProfile = async (req, res) => {
    try {
        const {
            companyName,
            about,
            industry,
            companySize,
            foundedYear,
            website,
            location,
            headquarters,
            phone,
            email,
            linkedin,
            twitter,
            facebook,
            description,
            mission,
            vision,
            benefits,
            culture
        } = req.body;

        let profile = await CompanyProfile.findOne({ user: req.user.id });

        if (!profile) {
            profile = await CompanyProfile.create({
                user: req.user.id,
                companyName,
                about,
                industry,
                companySize,
                foundedYear,
                website,
                location,
                headquarters,
                phone,
                email,
                linkedin,
                twitter,
                facebook,
                description,
                mission,
                vision,
                benefits,
                culture
            });
        } else {
            profile.companyName = companyName !== undefined ? companyName : profile.companyName;
            profile.about = about !== undefined ? about : profile.about;
            profile.industry = industry !== undefined ? industry : profile.industry;
            profile.companySize = companySize !== undefined ? companySize : profile.companySize;
            profile.foundedYear = foundedYear !== undefined ? foundedYear : profile.foundedYear;
            profile.website = website !== undefined ? website : profile.website;
            profile.location = location !== undefined ? location : profile.location;
            profile.headquarters = headquarters !== undefined ? headquarters : profile.headquarters;
            profile.phone = phone !== undefined ? phone : profile.phone;
            profile.email = email !== undefined ? email : profile.email;
            profile.linkedin = linkedin !== undefined ? linkedin : profile.linkedin;
            profile.twitter = twitter !== undefined ? twitter : profile.twitter;
            profile.facebook = facebook !== undefined ? facebook : profile.facebook;
            profile.description = description !== undefined ? description : profile.description;
            profile.mission = mission !== undefined ? mission : profile.mission;
            profile.vision = vision !== undefined ? vision : profile.vision;
            profile.benefits = benefits !== undefined ? benefits : profile.benefits;
            profile.culture = culture !== undefined ? culture : profile.culture;

            await profile.save();
        }

        profile = await CompanyProfile.findById(profile._id).populate('user', 'name email phone');
        res.json(profile);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Upload company logo/profile picture
// @route   POST /api/company-profile/profile-picture
// @access  Private/Employer
export const uploadCompanyLogo = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: 'No file uploaded' });
        }

        let profile = await CompanyProfile.findOne({ user: req.user.id });

        if (!profile) {
            profile = await CompanyProfile.create({ user: req.user.id });
        }

        // Delete old profile picture if exists
        if (profile.profilePicture) {
            const oldPath = path.join(process.cwd(), 'uploads', 'company-logos', path.basename(profile.profilePicture));
            if (fs.existsSync(oldPath)) {
                fs.unlinkSync(oldPath);
            }
        }

        // Save new profile picture path
        profile.profilePicture = `/uploads/company-logos/${req.file.filename}`;
        await profile.save();

        res.json({ profilePicture: profile.profilePicture });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get company profile by userId (for job seekers viewing company)
// @route   GET /api/company-profile/user/:userId
// @access  Public
export const getCompanyProfile = async (req, res) => {
    try {
        const profile = await CompanyProfile.findOne({ user: req.params.userId })
            .populate('user', 'name email phone');

        if (!profile) {
            return res.status(404).json({ message: 'Company profile not found' });
        }

        res.json(profile);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
