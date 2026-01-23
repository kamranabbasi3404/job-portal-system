import mongoose from 'mongoose';

const companyProfileSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        unique: true
    },
    companyName: {
        type: String,
        default: ''
    },
    profilePicture: {
        type: String, // URL to company logo/profile picture
        default: ''
    },
    about: {
        type: String,
        default: ''
    },
    industry: {
        type: String,
        default: ''
    },
    companySize: {
        type: String,
        enum: ['1-10', '11-50', '51-200', '201-500', '501-1000', '1000+', ''],
        default: ''
    },
    foundedYear: {
        type: Number
    },
    website: {
        type: String,
        default: ''
    },
    location: {
        type: String,
        default: ''
    },
    headquarters: {
        type: String,
        default: ''
    },
    phone: {
        type: String,
        default: ''
    },
    email: {
        type: String,
        default: ''
    },
    linkedin: {
        type: String,
        default: ''
    },
    twitter: {
        type: String,
        default: ''
    },
    facebook: {
        type: String,
        default: ''
    },
    description: {
        type: String,
        default: ''
    },
    mission: {
        type: String,
        default: ''
    },
    vision: {
        type: String,
        default: ''
    },
    benefits: [{
        type: String
    }],
    culture: {
        type: String,
        default: ''
    }
}, {
    timestamps: true
});

const CompanyProfile = mongoose.model('CompanyProfile', companyProfileSchema);

export default CompanyProfile;
