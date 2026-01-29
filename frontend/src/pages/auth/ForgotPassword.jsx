import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, AlertCircle, CheckCircle, ArrowLeft, KeyRound } from 'lucide-react';
import Loader from '../../components/common/Loader';
import api from '../../services/api';

const ForgotPassword = () => {
    const navigate = useNavigate();
    const [step, setStep] = useState(1); // 1: Enter Email, 2: Enter OTP, 3: New Password
    const [email, setEmail] = useState('');
    const [otp, setOtp] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [loading, setLoading] = useState(false);

    // Step 1: Send OTP to email
    const handleSendOTP = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            await api.post('/api/auth/forgot-password', { email });
            setSuccess('OTP sent to your email address!');
            setStep(2);
        } catch (error) {
            setError(error.response?.data?.message || 'Failed to send OTP');
        } finally {
            setLoading(false);
        }
    };

    // Step 2: Verify OTP
    const handleVerifyOTP = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            await api.post('/api/auth/verify-otp', { email, otp });
            setSuccess('OTP verified successfully!');
            setStep(3);
        } catch (error) {
            setError(error.response?.data?.message || 'Invalid or expired OTP');
        } finally {
            setLoading(false);
        }
    };

    // Step 3: Reset Password
    const handleResetPassword = async (e) => {
        e.preventDefault();
        setError('');

        if (newPassword !== confirmPassword) {
            setError('Passwords do not match');
            return;
        }

        if (newPassword.length < 6) {
            setError('Password must be at least 6 characters');
            return;
        }

        setLoading(true);

        try {
            await api.post('/api/auth/reset-password', { email, otp, newPassword });
            setSuccess('Password reset successfully!');
            setTimeout(() => {
                navigate('/login');
            }, 2000);
        } catch (error) {
            setError(error.response?.data?.message || 'Failed to reset password');
        } finally {
            setLoading(false);
        }
    };

    // Resend OTP
    const handleResendOTP = async () => {
        setError('');
        setLoading(true);

        try {
            await api.post('/api/auth/forgot-password', { email });
            setSuccess('New OTP sent to your email!');
        } catch (error) {
            setError(error.response?.data?.message || 'Failed to resend OTP');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full">
                <div className="text-center mb-8">
                    <h2 className="text-4xl font-bold text-gray-900 mb-2">
                        {step === 1 && 'Forgot Password?'}
                        {step === 2 && 'Verify OTP'}
                        {step === 3 && 'Reset Password'}
                    </h2>
                    <p className="text-gray-600">
                        {step === 1 && 'Enter your email to receive a password reset OTP'}
                        {step === 2 && 'Enter the 6-digit code sent to your email'}
                        {step === 3 && 'Create a new password for your account'}
                    </p>
                </div>

                {/* Progress Steps */}
                <div className="flex justify-center mb-8">
                    <div className="flex items-center space-x-4">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${step >= 1 ? 'bg-primary-600 text-white' : 'bg-gray-200 text-gray-500'}`}>
                            1
                        </div>
                        <div className={`w-12 h-1 ${step >= 2 ? 'bg-primary-600' : 'bg-gray-200'}`}></div>
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${step >= 2 ? 'bg-primary-600 text-white' : 'bg-gray-200 text-gray-500'}`}>
                            2
                        </div>
                        <div className={`w-12 h-1 ${step >= 3 ? 'bg-primary-600' : 'bg-gray-200'}`}></div>
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${step >= 3 ? 'bg-primary-600 text-white' : 'bg-gray-200 text-gray-500'}`}>
                            3
                        </div>
                    </div>
                </div>

                <div className="card">
                    {error && (
                        <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start space-x-3">
                            <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                            <p className="text-sm text-red-600">{error}</p>
                        </div>
                    )}

                    {success && (
                        <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded-lg flex items-start space-x-3">
                            <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                            <p className="text-sm text-green-600">{success}</p>
                        </div>
                    )}

                    {/* Step 1: Enter Email */}
                    {step === 1 && (
                        <form onSubmit={handleSendOTP}>
                            <div className="mb-6">
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Email Address
                                </label>
                                <div className="relative">
                                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                    <input
                                        type="email"
                                        value={email}
                                        onChange={(e) => { setEmail(e.target.value); setError(''); setSuccess(''); }}
                                        className="input-field pl-10"
                                        placeholder="Enter your email"
                                        required
                                    />
                                </div>
                            </div>

                            <button
                                type="submit"
                                disabled={loading}
                                className="btn-primary w-full flex justify-center items-center"
                            >
                                {loading ? <Loader size="small" /> : 'Send OTP'}
                            </button>
                        </form>
                    )}

                    {/* Step 2: Enter OTP */}
                    {step === 2 && (
                        <form onSubmit={handleVerifyOTP}>
                            <div className="mb-6">
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Enter OTP Code
                                </label>
                                <div className="relative">
                                    <KeyRound className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                    <input
                                        type="text"
                                        value={otp}
                                        onChange={(e) => { setOtp(e.target.value.replace(/\D/g, '').slice(0, 6)); setError(''); setSuccess(''); }}
                                        className="input-field pl-10 text-center text-2xl tracking-widest font-mono"
                                        placeholder="000000"
                                        maxLength={6}
                                        required
                                    />
                                </div>
                                <p className="text-xs text-gray-500 mt-2 text-center">
                                    OTP sent to: <span className="font-medium">{email}</span>
                                </p>
                            </div>

                            <button
                                type="submit"
                                disabled={loading || otp.length !== 6}
                                className="btn-primary w-full flex justify-center items-center"
                            >
                                {loading ? <Loader size="small" /> : 'Verify OTP'}
                            </button>

                            <button
                                type="button"
                                onClick={handleResendOTP}
                                disabled={loading}
                                className="w-full mt-3 text-primary-600 hover:text-primary-700 text-sm font-medium"
                            >
                                Didn't receive the code? Resend OTP
                            </button>
                        </form>
                    )}

                    {/* Step 3: New Password */}
                    {step === 3 && (
                        <form onSubmit={handleResetPassword}>
                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    New Password
                                </label>
                                <div className="relative">
                                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                    <input
                                        type="password"
                                        value={newPassword}
                                        onChange={(e) => { setNewPassword(e.target.value); setError(''); setSuccess(''); }}
                                        className="input-field pl-10"
                                        placeholder="Enter new password"
                                        minLength={6}
                                        required
                                    />
                                </div>
                            </div>

                            <div className="mb-6">
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Confirm Password
                                </label>
                                <div className="relative">
                                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                    <input
                                        type="password"
                                        value={confirmPassword}
                                        onChange={(e) => { setConfirmPassword(e.target.value); setError(''); setSuccess(''); }}
                                        className="input-field pl-10"
                                        placeholder="Confirm new password"
                                        minLength={6}
                                        required
                                    />
                                </div>
                            </div>

                            <button
                                type="submit"
                                disabled={loading}
                                className="btn-primary w-full flex justify-center items-center"
                            >
                                {loading ? <Loader size="small" /> : 'Reset Password'}
                            </button>
                        </form>
                    )}

                    {/* Back to Login Link */}
                    <div className="mt-6 text-center">
                        <Link
                            to="/login"
                            className="inline-flex items-center text-sm text-primary-600 hover:text-primary-700"
                        >
                            <ArrowLeft className="w-4 h-4 mr-1" />
                            Back to Login
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ForgotPassword;
