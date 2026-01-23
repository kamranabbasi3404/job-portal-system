import React, { useState, useEffect } from 'react';
import { FileText, Clock, CheckCircle, XCircle, Eye, Star, Calendar, Trophy, ExternalLink } from 'lucide-react';
import Loader from '../../components/common/Loader';
import api from '../../services/api';

const Applications = () => {
    const [applications, setApplications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('all');

    useEffect(() => {
        fetchApplications();
    }, []);

    const fetchApplications = async () => {
        try {
            setLoading(true);
            const response = await api.get('/api/applications/my-applications');
            setApplications(response.data || []);
        } catch (error) {
            console.error('Error fetching applications:', error);
            setApplications(getSampleApplications());
        } finally {
            setLoading(false);
        }
    };

    const filteredApplications = applications.filter(app => {
        if (filter === 'all') return true;
        return app.status.toLowerCase() === filter;
    });

    const getStatusIcon = (status) => {
        switch (status?.toLowerCase()) {
            case 'pending': return <Clock className="w-5 h-5" />;
            case 'reviewing': return <Eye className="w-5 h-5" />;
            case 'shortlisted': return <Star className="w-5 h-5" />;
            case 'interview_scheduled': return <Calendar className="w-5 h-5" />;
            case 'selected': return <Trophy className="w-5 h-5" />;
            case 'rejected': return <XCircle className="w-5 h-5" />;
            case 'accepted': return <CheckCircle className="w-5 h-5" />;
            default: return <FileText className="w-5 h-5" />;
        }
    };

    const getStatusColor = (status) => {
        switch (status?.toLowerCase()) {
            case 'pending': return 'bg-yellow-100 text-yellow-700';
            case 'reviewing': return 'bg-blue-100 text-blue-700';
            case 'shortlisted': return 'bg-purple-100 text-purple-700';
            case 'interview_scheduled': return 'bg-indigo-100 text-indigo-700';
            case 'selected': return 'bg-green-100 text-green-700';
            case 'rejected': return 'bg-red-100 text-red-700';
            case 'accepted': return 'bg-green-100 text-green-700';
            default: return 'bg-gray-100 text-gray-700';
        }
    };

    const formatStatusLabel = (status) => {
        if (status === 'interview_scheduled') return 'Interview Scheduled';
        return status.charAt(0).toUpperCase() + status.slice(1);
    };

    const getStatusMessage = (status) => {
        switch (status?.toLowerCase()) {
            case 'pending': return 'Your application is pending review.';
            case 'reviewing': return 'Your application is currently being reviewed by the employer.';
            case 'shortlisted': return '🎉 Congratulations! You have been shortlisted for this position.';
            case 'interview_scheduled': return '✨ Great news! Your interview has been scheduled.';
            case 'selected': return '🎊 Congratulations! You have been selected for this position!';
            case 'rejected': return 'Unfortunately, the employer has decided to move forward with other candidates.';
            default: return '';
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <Loader size="large" />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="mb-8">
                    <h1 className="text-4xl font-bold text-gray-900 mb-2">My Applications</h1>
                    <p className="text-gray-600">Track the status of your job applications</p>
                </div>

                {/* Filters */}
                <div className="card mb-6">
                    <div className="flex flex-wrap gap-2">
                        {['all', 'pending', 'reviewing', 'shortlisted', 'interview_scheduled', 'selected', 'rejected'].map((status) => (
                            <button
                                key={status}
                                onClick={() => setFilter(status)}
                                className={`px-4 py-2 rounded-lg font-medium transition-colors ${filter === status
                                    ? 'bg-primary-600 text-white'
                                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                    }`}
                            >
                                {formatStatusLabel(status)}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Applications List */}
                {filteredApplications.length === 0 ? (
                    <div className="card text-center py-12">
                        <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                        <h3 className="text-xl font-semibold text-gray-900 mb-2">No applications found</h3>
                        <p className="text-gray-600 mb-4">
                            {filter === 'all'
                                ? "You haven't applied to any jobs yet"
                                : `No ${formatStatusLabel(filter)} applications`}
                        </p>
                        <a href="/jobs" className="btn-primary inline-block">
                            Browse Jobs
                        </a>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {filteredApplications.map((app) => (
                            <div key={app._id || app.id} className="card hover:shadow-lg transition-shadow">
                                <div className="flex items-start justify-between mb-4">
                                    <div className="flex-1">
                                        <h3 className="text-xl font-bold text-gray-900 mb-1">{app.job?.title || 'Job Title'}</h3>
                                        <p className="text-gray-600 font-medium">{app.job?.company || 'Company'}</p>
                                    </div>
                                    <span className={`badge ${getStatusColor(app.status)} flex items-center space-x-1`}>
                                        {getStatusIcon(app.status)}
                                        <span>{formatStatusLabel(app.status)}</span>
                                    </span>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-600 mb-4">
                                    <div>
                                        <span className="font-medium">Applied:</span> {new Date(app.createdAt || app.appliedDate).toLocaleDateString()}
                                    </div>
                                    <div>
                                        <span className="font-medium">Location:</span> {app.job?.location || 'N/A'}
                                    </div>
                                    <div>
                                        <span className="font-medium">Type:</span> {app.job?.type || 'N/A'}
                                    </div>
                                </div>

                                {/* Status Message */}
                                {getStatusMessage(app.status) && (
                                    <div className={`rounded-lg p-4 mb-4 ${app.status === 'selected' ? 'bg-green-50 border border-green-200' :
                                            app.status === 'shortlisted' ? 'bg-purple-50 border border-purple-200' :
                                                app.status === 'interview_scheduled' ? 'bg-indigo-50 border border-indigo-200' :
                                                    app.status === 'rejected' ? 'bg-red-50 border border-red-200' :
                                                        'bg-blue-50 border border-blue-200'
                                        }`}>
                                        <p className={`text-sm font-medium ${app.status === 'selected' ? 'text-green-800' :
                                                app.status === 'shortlisted' ? 'text-purple-800' :
                                                    app.status === 'interview_scheduled' ? 'text-indigo-800' :
                                                        app.status === 'rejected' ? 'text-red-800' :
                                                            'text-blue-800'
                                            }`}>
                                            {getStatusMessage(app.status)}
                                        </p>
                                    </div>
                                )}

                                {/* Interview Details Card */}
                                {app.status === 'interview_scheduled' && app.interviewDetails && (
                                    <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-lg p-5 mb-4 border-2 border-indigo-200">
                                        <div className="flex items-center mb-3">
                                            <Calendar className="w-5 h-5 text-indigo-600 mr-2" />
                                            <h4 className="font-bold text-indigo-900 text-lg">Interview Details</h4>
                                        </div>
                                        <div className="space-y-3">
                                            <div className="flex items-start">
                                                <span className="font-semibold text-indigo-900 min-w-[120px]">Interview Type:</span>
                                                <span className="text-indigo-700">
                                                    {app.interviewDetails.type === 'online' ? '💻 Online Interview' : '🏢 On-site Interview'}
                                                </span>
                                            </div>
                                            <div className="flex items-start">
                                                <span className="font-semibold text-indigo-900 min-w-[120px]">Date & Time:</span>
                                                <span className="text-indigo-700 font-medium">
                                                    {new Date(app.interviewDetails.dateTime).toLocaleString('en-US', {
                                                        weekday: 'long',
                                                        year: 'numeric',
                                                        month: 'long',
                                                        day: 'numeric',
                                                        hour: '2-digit',
                                                        minute: '2-digit'
                                                    })}
                                                </span>
                                            </div>
                                            {app.interviewDetails.location && (
                                                <div className="flex items-start">
                                                    <span className="font-semibold text-indigo-900 min-w-[120px]">Location:</span>
                                                    <span className="text-indigo-700">{app.interviewDetails.location}</span>
                                                </div>
                                            )}
                                            {app.interviewDetails.meetingLink && (
                                                <div className="flex items-start">
                                                    <span className="font-semibold text-indigo-900 min-w-[120px]">Meeting Link:</span>
                                                    <a
                                                        href={app.interviewDetails.meetingLink}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="text-indigo-600 hover:text-indigo-800 font-medium inline-flex items-center hover:underline"
                                                    >
                                                        Join Interview <ExternalLink className="w-4 h-4 ml-1" />
                                                    </a>
                                                </div>
                                            )}
                                        </div>
                                        <div className="mt-4 pt-3 border-t border-indigo-200">
                                            <p className="text-sm text-indigo-700">
                                                ℹ️ Please be prepared and join on time. Good luck!
                                            </p>
                                        </div>
                                    </div>
                                )}

                                {/* Selected Status - Additional Info */}
                                {app.status === 'selected' && (
                                    <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg p-5 mb-4 border-2 border-green-200">
                                        <div className="flex items-center mb-2">
                                            <Trophy className="w-6 h-6 text-green-600 mr-2" />
                                            <h4 className="font-bold text-green-900 text-lg">Next Steps</h4>
                                        </div>
                                        <p className="text-green-800 text-sm">
                                            The employer will contact you shortly with further details about your onboarding process and start date. Keep an eye on your email and phone.
                                        </p>
                                    </div>
                                )}

                                <div className="flex items-center space-x-3">
                                    <button className="btn-secondary text-sm">View Job</button>
                                    {app.status === 'pending' && (
                                        <button className="text-red-600 hover:text-red-700 font-medium text-sm">
                                            Withdraw Application
                                        </button>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

const getSampleApplications = () => [
    {
        _id: '1',
        jobTitle: 'Senior Full Stack Developer',
        company: 'Tech Corp',
        status: 'reviewing',
        appliedDate: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
        location: 'New York, NY',
        jobType: 'Full-time',
        message: 'Your application is under review by our hiring team.'
    },
    {
        _id: '2',
        jobTitle: 'Frontend Developer',
        company: 'Web Agency',
        status: 'pending',
        appliedDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
        location: 'Remote',
        jobType: 'Part-time'
    },
    {
        _id: '3',
        jobTitle: 'UI/UX Designer',
        company: 'Design Studio',
        status: 'accepted',
        appliedDate: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000),
        location: 'San Francisco, CA',
        jobType: 'Full-time',
        message: 'Congratulations! We would like to schedule an interview with you.'
    },
    {
        _id: '4',
        jobTitle: 'Data Analyst',
        company: 'Analytics Pro',
        status: 'rejected',
        appliedDate: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000),
        location: 'Chicago, IL',
        jobType: 'Contract',
        message: 'Thank you for your interest. We have decided to move forward with other candidates.'
    }
];

export default Applications;
