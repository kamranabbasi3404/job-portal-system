import Job from '../models/Job.js';
import Profile from '../models/Profile.js';
import User from '../models/User.js';
import { getRecommendations } from '../utils/recommendationEngine.js';

/**
 * @desc    Get AI-powered job recommendations for the logged-in user
 * @route   GET /api/recommendations
 * @access  Private (Job Seekers only)
 */
export const getJobRecommendations = async (req, res) => {
    try {
        // Get user's profile
        const profile = await Profile.findOne({ user: req.user._id });
        const user = await User.findById(req.user._id).select('name email');

        if (!profile) {
            return res.status(404).json({
                message: 'Profile not found. Please complete your profile to get recommendations.',
                recommendations: []
            });
        }

        // Check if profile has enough data for recommendations
        const hasSkills = profile.skills && profile.skills.length > 0;
        const hasExperience = profile.experience && profile.experience.length > 0;
        const hasAbout = profile.about && profile.about.trim().length > 0;

        if (!hasSkills && !hasExperience && !hasAbout) {
            return res.status(200).json({
                message: 'Add skills, experience, or about section to get personalized recommendations.',
                recommendations: []
            });
        }

        // Get all active jobs
        const jobs = await Job.find({ status: 'active' })
            .sort({ createdAt: -1 })
            .lean();

        if (!jobs || jobs.length === 0) {
            return res.status(200).json({
                message: 'No active jobs available at the moment.',
                recommendations: []
            });
        }

        // Get AI recommendations
        const limit = parseInt(req.query.limit) || 5;
        const recommendations = getRecommendations(profile, user, jobs, limit);

        // Format response
        const formattedRecommendations = recommendations.map(rec => ({
            job_id: rec.job_id,
            job_title: rec.job_title,
            company: rec.company,
            location: rec.location,
            type: rec.type,
            skills: rec.skills,
            match_score: rec.match_score,
            reason: rec.reason
        }));

        res.json({
            success: true,
            count: formattedRecommendations.length,
            recommendations: formattedRecommendations
        });

    } catch (error) {
        console.error('Recommendation error:', error);
        res.status(500).json({
            message: 'Error generating recommendations',
            error: error.message
        });
    }
};

/**
 * @desc    Get recommendations for a specific profile (admin use)
 * @route   GET /api/recommendations/profile/:profileId
 * @access  Private (Admin only)
 */
export const getRecommendationsForProfile = async (req, res) => {
    try {
        const profile = await Profile.findById(req.params.profileId);

        if (!profile) {
            return res.status(404).json({ message: 'Profile not found' });
        }

        const user = await User.findById(profile.user).select('name email');
        const jobs = await Job.find({ status: 'active' }).lean();

        const limit = parseInt(req.query.limit) || 5;
        const recommendations = getRecommendations(profile, user, jobs, limit);

        res.json({
            success: true,
            profile: {
                id: profile._id,
                user: user?.name || 'Unknown'
            },
            count: recommendations.length,
            recommendations
        });

    } catch (error) {
        console.error('Recommendation error:', error);
        res.status(500).json({ message: error.message });
    }
};
