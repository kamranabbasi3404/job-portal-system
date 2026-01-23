import mongoose from 'mongoose';

const applicationSchema = new mongoose.Schema({
    job: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Job',
        required: true
    },
    jobSeeker: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    resumeUrl: {
        type: String
    },
    coverLetter: {
        type: String
    },
    status: {
        type: String,
        enum: ['pending', 'reviewing', 'shortlisted', 'interview_scheduled', 'selected', 'rejected'],
        default: 'pending'
    },
    appliedDate: {
        type: Date,
        default: Date.now
    },
    shortlistNotes: {
        type: String
    },
    interviewDetails: {
        type: {
            type: String,
            enum: ['online', 'on-site']
        },
        dateTime: {
            type: Date
        },
        location: {
            type: String
        },
        meetingLink: {
            type: String
        }
    },
    rejectionReason: {
        type: String
    }
}, {
    timestamps: true
});

// Prevent duplicate applications
applicationSchema.index({ job: 1, jobSeeker: 1 }, { unique: true });

const Application = mongoose.model('Application', applicationSchema);

export default Application;
