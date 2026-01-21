import mongoose from 'mongoose';

const profileSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        unique: true
    },
    about: {
        type: String,
        default: ''
    },
    skills: [{
        name: String,
        level: {
            type: String,
            enum: ['beginner', 'intermediate', 'advanced', 'expert']
        }
    }],
    experience: [{
        title: String,
        company: String,
        location: String,
        startDate: Date,
        endDate: Date,
        current: Boolean,
        description: String
    }],
    education: [{
        degree: String,
        school: String,
        field: String,
        startDate: Date,
        endDate: Date,
        current: Boolean,
        description: String
    }],
    resume: {
        type: String, // URL to resume file
        default: ''
    },
    phone: String,
    location: String,
    website: String,
    linkedin: String,
    github: String
}, {
    timestamps: true
});

const Profile = mongoose.model('Profile', profileSchema);

export default Profile;
