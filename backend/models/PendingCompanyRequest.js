import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const pendingCompanyRequestSchema = new mongoose.Schema({
    companyName: {
        type: String,
        required: [true, 'Company name is required']
    },
    email: {
        type: String,
        required: [true, 'Email is required'],
        lowercase: true
    },
    password: {
        type: String,
        required: [true, 'Password is required'],
        minlength: 6
    },
    phone: {
        type: String,
        default: ''
    },
    contactPerson: {
        type: String,
        required: [true, 'Contact person name is required']
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
    website: {
        type: String,
        default: ''
    },
    address: {
        type: String,
        default: ''
    },
    verificationDocuments: [{
        filename: String,
        originalName: String,
        path: String,
        mimetype: String,
        uploadedAt: {
            type: Date,
            default: Date.now
        }
    }],
    status: {
        type: String,
        enum: ['pending', 'approved', 'declined'],
        default: 'pending'
    },
    declineReason: {
        type: String,
        default: ''
    },
    reviewedAt: {
        type: Date
    },
    reviewedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }
}, {
    timestamps: true
});

// Hash password before saving
pendingCompanyRequestSchema.pre('save', async function () {
    if (!this.isModified('password')) {
        return;
    }
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
});

const PendingCompanyRequest = mongoose.model('PendingCompanyRequest', pendingCompanyRequestSchema);

export default PendingCompanyRequest;
