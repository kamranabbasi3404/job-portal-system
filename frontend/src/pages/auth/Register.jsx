import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Mail, Lock, User, Building2, AlertCircle, FileText, Upload, CheckCircle } from 'lucide-react';
import Loader from '../../components/common/Loader';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const Register = () => {
    const navigate = useNavigate();
    const { register } = useAuth();
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        confirmPassword: '',
        role: 'jobseeker',
        name: '',
        phone: '',
        // Employer-specific fields
        contactPerson: '',
        industry: '',
        companySize: '',
        website: '',
        address: ''
    });
    const [verificationDocs, setVerificationDocs] = useState([]);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [pendingSuccess, setPendingSuccess] = useState(false);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
        setError('');
    };

    const handleFileChange = (e) => {
        const files = Array.from(e.target.files);
        if (files.length + verificationDocs.length > 5) {
            setError('Maximum 5 documents allowed');
            return;
        }
        setVerificationDocs([...verificationDocs, ...files]);
        setError('');
    };

    const removeFile = (index) => {
        setVerificationDocs(verificationDocs.filter((_, i) => i !== index));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        // Validation
        if (formData.password !== formData.confirmPassword) {
            setError('Passwords do not match');
            return;
        }

        if (formData.password.length < 6) {
            setError('Password must be at least 6 characters long');
            return;
        }

        // Employer-specific validation
        if (formData.role === 'employer') {
            if (!formData.contactPerson) {
                setError('Contact person name is required');
                return;
            }
            if (verificationDocs.length === 0) {
                setError('At least one verification document is required');
                return;
            }
        }

        setLoading(true);

        try {
            if (formData.role === 'employer') {
                // Submit to pending company endpoint
                const formDataToSend = new FormData();
                formDataToSend.append('companyName', formData.name);
                formDataToSend.append('email', formData.email);
                formDataToSend.append('password', formData.password);
                formDataToSend.append('phone', formData.phone);
                formDataToSend.append('contactPerson', formData.contactPerson);
                formDataToSend.append('industry', formData.industry);
                formDataToSend.append('companySize', formData.companySize);
                formDataToSend.append('website', formData.website);
                formDataToSend.append('address', formData.address);

                verificationDocs.forEach((doc) => {
                    formDataToSend.append('verificationDocuments', doc);
                });

                await axios.post(`${API_URL}/api/pending-company`, formDataToSend, {
                    headers: { 'Content-Type': 'multipart/form-data' }
                });

                setPendingSuccess(true);
            } else {
                // Regular job seeker registration
                const result = await register({
                    email: formData.email,
                    password: formData.password,
                    role: formData.role,
                    name: formData.name,
                    phone: formData.phone
                });

                if (result.success) {
                    navigate('/jobseeker/dashboard');
                } else {
                    setError(result.message);
                }
            }
        } catch (err) {
            setError(err.response?.data?.message || 'Registration failed. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    // Show success message for pending company registration
    if (pendingSuccess) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
                <div className="max-w-md w-full">
                    <div className="card text-center">
                        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                            <CheckCircle className="w-10 h-10 text-green-600" />
                        </div>
                        <h2 className="text-2xl font-bold text-gray-900 mb-4">Request Submitted!</h2>
                        <p className="text-gray-600 mb-6">
                            Your company registration request has been sent to the admin for approval.
                        </p>
                        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                            <p className="text-sm text-blue-800">
                                📧 You will receive an email notification once your account is approved and activated.
                            </p>
                        </div>
                        <Link to="/login" className="btn-primary inline-block">
                            Go to Login
                        </Link>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full">
                <div className="text-center mb-8">
                    <h2 className="text-4xl font-bold text-gray-900 mb-2">Create Account</h2>
                    <p className="text-gray-600">Join thousands of professionals today</p>
                </div>

                <div className="card">
                    {error && (
                        <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start space-x-3">
                            <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                            <p className="text-sm text-red-600">{error}</p>
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-5">
                        {/* Role Selection */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-3">
                                I want to
                            </label>
                            <div className="grid grid-cols-2 gap-3">
                                <button
                                    type="button"
                                    onClick={() => setFormData({ ...formData, role: 'jobseeker' })}
                                    className={`p-4 border-2 rounded-lg transition-all ${formData.role === 'jobseeker'
                                        ? 'border-primary-600 bg-primary-50'
                                        : 'border-gray-200 hover:border-gray-300'
                                        }`}
                                >
                                    <User className={`w-6 h-6 mx-auto mb-2 ${formData.role === 'jobseeker' ? 'text-primary-600' : 'text-gray-400'
                                        }`} />
                                    <p className={`text-sm font-medium ${formData.role === 'jobseeker' ? 'text-primary-600' : 'text-gray-700'
                                        }`}>
                                        Find Jobs
                                    </p>
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setFormData({ ...formData, role: 'employer' })}
                                    className={`p-4 border-2 rounded-lg transition-all ${formData.role === 'employer'
                                        ? 'border-primary-600 bg-primary-50'
                                        : 'border-gray-200 hover:border-gray-300'
                                        }`}
                                >
                                    <Building2 className={`w-6 h-6 mx-auto mb-2 ${formData.role === 'employer' ? 'text-primary-600' : 'text-gray-400'
                                        }`} />
                                    <p className={`text-sm font-medium ${formData.role === 'employer' ? 'text-primary-600' : 'text-gray-700'
                                        }`}>
                                        Hire Talent
                                    </p>
                                </button>
                            </div>
                        </div>

                        {/* Employer Notice */}
                        {formData.role === 'employer' && (
                            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                                <p className="text-sm text-yellow-800">
                                    ⚠️ Company accounts require admin approval. You'll need to upload verification documents.
                                </p>
                            </div>
                        )}

                        <div>
                            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                                {formData.role === 'employer' ? 'Company Name' : 'Full Name'}
                            </label>
                            <div className="relative">
                                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                <input
                                    id="name"
                                    name="name"
                                    type="text"
                                    required
                                    value={formData.name}
                                    onChange={handleChange}
                                    className="input-field pl-10"
                                    placeholder={formData.role === 'employer' ? 'Your Company' : 'John Doe'}
                                />
                            </div>
                        </div>

                        {/* Employer-specific: Contact Person */}
                        {formData.role === 'employer' && (
                            <div>
                                <label htmlFor="contactPerson" className="block text-sm font-medium text-gray-700 mb-2">
                                    Contact Person Name *
                                </label>
                                <input
                                    id="contactPerson"
                                    name="contactPerson"
                                    type="text"
                                    required
                                    value={formData.contactPerson}
                                    onChange={handleChange}
                                    className="input-field"
                                    placeholder="John Smith"
                                />
                            </div>
                        )}

                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                                Email Address
                            </label>
                            <div className="relative">
                                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                <input
                                    id="email"
                                    name="email"
                                    type="email"
                                    required
                                    value={formData.email}
                                    onChange={handleChange}
                                    className="input-field pl-10"
                                    placeholder="you@example.com"
                                />
                            </div>
                        </div>

                        <div>
                            <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                                Phone Number
                            </label>
                            <input
                                id="phone"
                                name="phone"
                                type="tel"
                                required
                                value={formData.phone}
                                onChange={handleChange}
                                className="input-field"
                                placeholder="+1 (555) 000-0000"
                            />
                        </div>

                        {/* Employer-specific fields */}
                        {formData.role === 'employer' && (
                            <>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label htmlFor="industry" className="block text-sm font-medium text-gray-700 mb-2">
                                            Industry
                                        </label>
                                        <input
                                            id="industry"
                                            name="industry"
                                            type="text"
                                            value={formData.industry}
                                            onChange={handleChange}
                                            className="input-field"
                                            placeholder="Technology"
                                        />
                                    </div>
                                    <div>
                                        <label htmlFor="companySize" className="block text-sm font-medium text-gray-700 mb-2">
                                            Company Size
                                        </label>
                                        <select
                                            id="companySize"
                                            name="companySize"
                                            value={formData.companySize}
                                            onChange={handleChange}
                                            className="input-field"
                                        >
                                            <option value="">Select</option>
                                            <option value="1-10">1-10</option>
                                            <option value="11-50">11-50</option>
                                            <option value="51-200">51-200</option>
                                            <option value="201-500">201-500</option>
                                            <option value="501-1000">501-1000</option>
                                            <option value="1000+">1000+</option>
                                        </select>
                                    </div>
                                </div>

                                <div>
                                    <label htmlFor="website" className="block text-sm font-medium text-gray-700 mb-2">
                                        Website (Optional)
                                    </label>
                                    <input
                                        id="website"
                                        name="website"
                                        type="url"
                                        value={formData.website}
                                        onChange={handleChange}
                                        className="input-field"
                                        placeholder="https://yourcompany.com"
                                    />
                                </div>

                                <div>
                                    <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-2">
                                        Business Address
                                    </label>
                                    <input
                                        id="address"
                                        name="address"
                                        type="text"
                                        value={formData.address}
                                        onChange={handleChange}
                                        className="input-field"
                                        placeholder="123 Business St, City, Country"
                                    />
                                </div>

                                {/* Document Upload */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Verification Documents * <span className="text-gray-500 font-normal">(PDF, JPEG, PNG, DOC)</span>
                                    </label>
                                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:border-primary-400 transition">
                                        <input
                                            type="file"
                                            id="verificationDocs"
                                            multiple
                                            accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
                                            onChange={handleFileChange}
                                            className="hidden"
                                        />
                                        <label htmlFor="verificationDocs" className="cursor-pointer">
                                            <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                                            <p className="text-sm text-gray-600">
                                                Click to upload documents
                                            </p>
                                            <p className="text-xs text-gray-500 mt-1">
                                                Business license, registration certificate, etc.
                                            </p>
                                        </label>
                                    </div>

                                    {/* Uploaded files list */}
                                    {verificationDocs.length > 0 && (
                                        <div className="mt-3 space-y-2">
                                            {verificationDocs.map((file, index) => (
                                                <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded-lg">
                                                    <div className="flex items-center space-x-2">
                                                        <FileText className="w-4 h-4 text-gray-500" />
                                                        <span className="text-sm text-gray-700 truncate max-w-[200px]">{file.name}</span>
                                                    </div>
                                                    <button
                                                        type="button"
                                                        onClick={() => removeFile(index)}
                                                        className="text-red-500 hover:text-red-700 text-sm"
                                                    >
                                                        Remove
                                                    </button>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </>
                        )}

                        <div>
                            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                                Password
                            </label>
                            <div className="relative">
                                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                <input
                                    id="password"
                                    name="password"
                                    type="password"
                                    required
                                    value={formData.password}
                                    onChange={handleChange}
                                    className="input-field pl-10"
                                    placeholder="••••••••"
                                />
                            </div>
                        </div>

                        <div>
                            <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-2">
                                Confirm Password
                            </label>
                            <div className="relative">
                                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                <input
                                    id="confirmPassword"
                                    name="confirmPassword"
                                    type="password"
                                    required
                                    value={formData.confirmPassword}
                                    onChange={handleChange}
                                    className="input-field pl-10"
                                    placeholder="••••••••"
                                />
                            </div>
                        </div>

                        <div className="flex items-start">
                            <input
                                id="terms"
                                name="terms"
                                type="checkbox"
                                required
                                className="h-4 w-4 mt-1 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                            />
                            <label htmlFor="terms" className="ml-2 block text-sm text-gray-700">
                                I agree to the{' '}
                                <Link to="/terms" className="text-primary-600 hover:text-primary-700">
                                    Terms of Service
                                </Link>
                                {' '}and{' '}
                                <Link to="/privacy" className="text-primary-600 hover:text-primary-700">
                                    Privacy Policy
                                </Link>
                            </label>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="btn-primary w-full"
                        >
                            {loading ? <Loader size="small" /> : (formData.role === 'employer' ? 'Submit for Approval' : 'Create Account')}
                        </button>
                    </form>

                    <div className="mt-6 text-center">
                        <p className="text-gray-600">
                            Already have an account?{' '}
                            <Link to="/login" className="font-medium text-primary-600 hover:text-primary-700">
                                Sign in here
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Register;
