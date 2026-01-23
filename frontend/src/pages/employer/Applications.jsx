import React, { useState, useEffect } from 'react';
import { Eye, Download, Star, Calendar, Trophy, XCircle, Clock } from 'lucide-react';
import Loader from '../../components/common/Loader';
import ProfileModal from '../../components/common/ProfileModal';
import api from '../../services/api';

const EmployerApplications = () => {
    const [applications, setApplications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('all');
    const [selectedProfile, setSelectedProfile] = useState(null);
    const [profileLoading, setProfileLoading] = useState(false);

    // Modal states
    const [shortlistModal, setShortlistModal] = useState(null);
    const [interviewModal, setInterviewModal] = useState(null);
    const [decisionModal, setDecisionModal] = useState(null);

    // Form states
    const [shortlistNotes, setShortlistNotes] = useState('');
    const [interviewType, setInterviewType] = useState('online');
    const [interviewDateTime, setInterviewDateTime] = useState('');
    const [interviewLocation, setInterviewLocation] = useState('');
    const [meetingLink, setMeetingLink] = useState('');
    const [decision, setDecision] = useState('selected');
    const [rejectionReason, setRejectionReason] = useState('');
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        fetchApplications();
    }, []);

    const fetchApplications = async () => {
        try {
            setLoading(true);
            const response = await api.get('/api/applications/employer');
            setApplications(response.data || []);
        } catch (error) {
            console.error('Error fetching applications:', error);
            setApplications(getSampleApplications());
        } finally {
            setLoading(false);
        }
    };

    const viewProfile = async (applicantId) => {
        try {
            setProfileLoading(true);
            const response = await api.get(`/api/profile/user/${applicantId}`);
            setSelectedProfile(response.data);
        } catch (error) {
            console.error('Error fetching profile:', error);
            alert('Failed to load profile. The applicant may not have completed their profile yet.');
        } finally {
            setProfileLoading(false);
        }
    };

    const handleShortlist = async (appId) => {
        try {
            setSubmitting(true);
            const response = await api.patch(`/api/applications/${appId}/shortlist`, {
                shortlistNotes
            });
            setApplications(applications.map(app =>
                app._id === appId ? response.data : app
            ));
            setShortlistModal(null);
            setShortlistNotes('');
        } catch (error) {
            console.error('Error shortlisting application:', error);
            alert(error.response?.data?.message || 'Failed to shortlist application');
        } finally {
            setSubmitting(false);
        }
    };

    const handleScheduleInterview = async (appId) => {
        try {
            setSubmitting(true);
            const interviewData = {
                type: interviewType,
                dateTime: interviewDateTime,
            };

            if (interviewType === 'on-site') {
                interviewData.location = interviewLocation;
            } else {
                interviewData.meetingLink = meetingLink;
            }

            const response = await api.patch(`/api/applications/${appId}/schedule-interview`, interviewData);
            setApplications(applications.map(app =>
                app._id === appId ? response.data : app
            ));
            setInterviewModal(null);
            setInterviewType('online');
            setInterviewDateTime('');
            setInterviewLocation('');
            setMeetingLink('');
        } catch (error) {
            console.error('Error scheduling interview:', error);
            alert(error.response?.data?.message || 'Failed to schedule interview');
        } finally {
            setSubmitting(false);
        }
    };

    const handleFinalDecision = async (appId) => {
        try {
            setSubmitting(true);
            const response = await api.patch(`/api/applications/${appId}/final-decision`, {
                decision,
                rejectionReason: decision === 'rejected' ? rejectionReason : undefined
            });
            setApplications(applications.map(app =>
                app._id === appId ? response.data : app
            ));
            setDecisionModal(null);
            setDecision('selected');
            setRejectionReason('');
        } catch (error) {
            console.error('Error making final decision:', error);
            alert(error.response?.data?.message || 'Failed to make decision');
        } finally {
            setSubmitting(false);
        }
    };

    const filteredApplications = applications.filter(app => {
        if (filter === 'all') return true;
        return app.status.toLowerCase() === filter;
    });

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

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <Loader size="large" />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="mb-8">
                    <h1 className="text-4xl font-bold text-gray-900 mb-2">Applications</h1>
                    <p className="text-gray-600">Review and manage job applications</p>
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
                        <Eye className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                        <h3 className="text-xl font-semibold text-gray-900 mb-2">No applications found</h3>
                        <p className="text-gray-600">
                            {filter === 'all'
                                ? 'No applications received yet'
                                : `No ${formatStatusLabel(filter)} applications`}
                        </p>
                    </div>
                ) : (
                    <div className="grid gap-4">
                        {filteredApplications.map((app) => (
                            <div key={app._id || app.id} className="card hover:shadow-lg transition-shadow">
                                <div className="flex items-start justify-between mb-4">
                                    <div className="flex items-start space-x-4 flex-1">
                                        <div className="w-14 h-14 bg-gradient-to-br from-primary-400 to-secondary-500 rounded-full flex items-center justify-center text-white text-xl font-bold flex-shrink-0">
                                            {app.jobSeeker?.name?.charAt(0) || 'A'}
                                        </div>
                                        <div className="flex-1">
                                            <h3 className="text-lg font-bold text-gray-900 mb-1">{app.jobSeeker?.name || 'Unknown'}</h3>
                                            <p className="text-gray-600 font-medium mb-2">Applied for: {app.job?.title || 'Unknown Position'}</p>
                                            <div className="flex flex-wrap gap-3 text-sm text-gray-600">
                                                <span>📧 {app.jobSeeker?.email || 'N/A'}</span>
                                                <span>📱 {app.jobSeeker?.phone || 'N/A'}</span>
                                            </div>
                                        </div>
                                    </div>
                                    <span className={`badge ${getStatusColor(app.status)}`}>
                                        {formatStatusLabel(app.status)}
                                    </span>
                                </div>

                                {app.coverLetter && (
                                    <div className="bg-gray-50 rounded-lg p-4 mb-4">
                                        <h4 className="font-semibold text-gray-900 mb-2">Cover Letter</h4>
                                        <p className="text-sm text-gray-700 line-clamp-3">{app.coverLetter}</p>
                                    </div>
                                )}

                                {app.shortlistNotes && (
                                    <div className="bg-purple-50 rounded-lg p-4 mb-4 border border-purple-200">
                                        <h4 className="font-semibold text-purple-900 mb-2">Internal Notes</h4>
                                        <p className="text-sm text-purple-700">{app.shortlistNotes}</p>
                                    </div>
                                )}

                                {app.interviewDetails && (
                                    <div className="bg-indigo-50 rounded-lg p-4 mb-4 border border-indigo-200">
                                        <h4 className="font-semibold text-indigo-900 mb-2">Interview Details</h4>
                                        <div className="text-sm text-indigo-700 space-y-1">
                                            <p><span className="font-medium">Type:</span> {app.interviewDetails.type === 'online' ? 'Online' : 'On-site'}</p>
                                            <p><span className="font-medium">Date & Time:</span> {new Date(app.interviewDetails.dateTime).toLocaleString()}</p>
                                            {app.interviewDetails.location && (
                                                <p><span className="font-medium">Location:</span> {app.interviewDetails.location}</p>
                                            )}
                                            {app.interviewDetails.meetingLink && (
                                                <p><span className="font-medium">Meeting Link:</span> <a href={app.interviewDetails.meetingLink} target="_blank" rel="noopener noreferrer" className="text-indigo-600 hover:underline">{app.interviewDetails.meetingLink}</a></p>
                                            )}
                                        </div>
                                    </div>
                                )}

                                <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                                    <div className="text-sm text-gray-500">
                                        Applied {new Date(app.appliedDate).toLocaleDateString()}
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <button
                                            onClick={() => viewProfile(app.jobSeeker?._id || app.jobSeeker)}
                                            disabled={profileLoading}
                                            className="btn-secondary text-sm flex items-center space-x-1"
                                        >
                                            <Eye className="w-4 h-4" />
                                            <span>View Profile</span>
                                        </button>
                                        {app.resumeUrl && (
                                            <a href={app.resumeUrl} target="_blank" rel="noopener noreferrer" className="btn-secondary text-sm flex items-center space-x-1">
                                                <Download className="w-4 h-4" />
                                                <span>Resume</span>
                                            </a>
                                        )}

                                        {/* Stage-based action buttons */}
                                        {(app.status === 'pending' || app.status === 'reviewing') && (
                                            <button
                                                onClick={() => setShortlistModal(app)}
                                                className="bg-purple-600 hover:bg-purple-700 text-white px-3 py-2 rounded-lg text-sm flex items-center space-x-1"
                                            >
                                                <Star className="w-4 h-4" />
                                                <span>Shortlist</span>
                                            </button>
                                        )}

                                        {app.status === 'shortlisted' && (
                                            <button
                                                onClick={() => setInterviewModal(app)}
                                                className="bg-indigo-600 hover:bg-indigo-700 text-white px-3 py-2 rounded-lg text-sm flex items-center space-x-1"
                                            >
                                                <Calendar className="w-4 h-4" />
                                                <span>Schedule Interview</span>
                                            </button>
                                        )}

                                        {app.status === 'interview_scheduled' && (
                                            <>
                                                <button
                                                    onClick={() => {
                                                        setDecisionModal(app);
                                                        setDecision('selected');
                                                    }}
                                                    className="bg-green-600 hover:bg-green-700 text-white px-3 py-2 rounded-lg text-sm flex items-center space-x-1"
                                                >
                                                    <Trophy className="w-4 h-4" />
                                                    <span>Select</span>
                                                </button>
                                                <button
                                                    onClick={() => {
                                                        setDecisionModal(app);
                                                        setDecision('rejected');
                                                    }}
                                                    className="bg-red-600 hover:bg-red-700 text-white px-3 py-2 rounded-lg text-sm flex items-center space-x-1"
                                                >
                                                    <XCircle className="w-4 h-4" />
                                                    <span>Reject</span>
                                                </button>
                                            </>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Profile Modal */}
            {selectedProfile && (
                <ProfileModal
                    profile={selectedProfile}
                    onClose={() => setSelectedProfile(null)}
                />
            )}

            {/* Shortlist Modal */}
            {shortlistModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-lg max-w-md w-full p-6">
                        <h2 className="text-2xl font-bold text-gray-900 mb-4">Shortlist Applicant</h2>
                        <p className="text-gray-600 mb-4">
                            Shortlisting <strong>{shortlistModal.jobSeeker?.name}</strong> for <strong>{shortlistModal.job?.title}</strong>
                        </p>
                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Internal Notes <span className="text-gray-500">(Optional)</span>
                            </label>
                            <textarea
                                value={shortlistNotes}
                                onChange={(e) => setShortlistNotes(e.target.value)}
                                placeholder="e.g., Strong React skills, good communication"
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                                rows="3"
                            />
                        </div>
                        <div className="flex space-x-3">
                            <button
                                onClick={() => handleShortlist(shortlistModal._id)}
                                disabled={submitting}
                                className="btn-primary flex-1"
                            >
                                {submitting ? 'Shortlisting...' : 'Confirm Shortlist'}
                            </button>
                            <button
                                onClick={() => {
                                    setShortlistModal(null);
                                    setShortlistNotes('');
                                }}
                                disabled={submitting}
                                className="btn-secondary flex-1"
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Interview Scheduling Modal */}
            {interviewModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-lg max-w-md w-full p-6">
                        <h2 className="text-2xl font-bold text-gray-900 mb-4">Schedule Interview</h2>
                        <p className="text-gray-600 mb-4">
                            Scheduling interview with <strong>{interviewModal.jobSeeker?.name}</strong>
                        </p>

                        <div className="space-y-4 mb-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Interview Type</label>
                                <select
                                    value={interviewType}
                                    onChange={(e) => setInterviewType(e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                                >
                                    <option value="online">Online</option>
                                    <option value="on-site">On-site</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Date & Time</label>
                                <input
                                    type="datetime-local"
                                    value={interviewDateTime}
                                    onChange={(e) => setInterviewDateTime(e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                                    required
                                />
                            </div>

                            {interviewType === 'on-site' ? (
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
                                    <input
                                        type="text"
                                        value={interviewLocation}
                                        onChange={(e) => setInterviewLocation(e.target.value)}
                                        placeholder="e.g., 123 Main St, Conference Room A"
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                                        required
                                    />
                                </div>
                            ) : (
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Meeting Link</label>
                                    <input
                                        type="url"
                                        value={meetingLink}
                                        onChange={(e) => setMeetingLink(e.target.value)}
                                        placeholder="e.g., https://meet.google.com/abc-defg-hij"
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                                        required
                                    />
                                </div>
                            )}
                        </div>

                        <div className="flex space-x-3">
                            <button
                                onClick={() => handleScheduleInterview(interviewModal._id)}
                                disabled={submitting}
                                className="btn-primary flex-1"
                            >
                                {submitting ? 'Scheduling...' : 'Schedule Interview'}
                            </button>
                            <button
                                onClick={() => {
                                    setInterviewModal(null);
                                    setInterviewType('online');
                                    setInterviewDateTime('');
                                    setInterviewLocation('');
                                    setMeetingLink('');
                                }}
                                disabled={submitting}
                                className="btn-secondary flex-1"
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Final Decision Modal */}
            {decisionModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-lg max-w-md w-full p-6">
                        <h2 className="text-2xl font-bold text-gray-900 mb-4">Final Decision</h2>
                        <p className="text-gray-600 mb-4">
                            Making final decision for <strong>{decisionModal.jobSeeker?.name}</strong>
                        </p>

                        <div className="space-y-4 mb-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Decision</label>
                                <div className="space-y-2">
                                    <label className="flex items-center space-x-2">
                                        <input
                                            type="radio"
                                            value="selected"
                                            checked={decision === 'selected'}
                                            onChange={(e) => setDecision(e.target.value)}
                                            className="text-primary-600 focus:ring-primary-500"
                                        />
                                        <span className="text-gray-700">Select Candidate</span>
                                    </label>
                                    <label className="flex items-center space-x-2">
                                        <input
                                            type="radio"
                                            value="rejected"
                                            checked={decision === 'rejected'}
                                            onChange={(e) => setDecision(e.target.value)}
                                            className="text-primary-600 focus:ring-primary-500"
                                        />
                                        <span className="text-gray-700">Reject Candidate</span>
                                    </label>
                                </div>
                            </div>

                            {decision === 'rejected' && (
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Rejection Reason <span className="text-gray-500">(Internal - Optional)</span>
                                    </label>
                                    <textarea
                                        value={rejectionReason}
                                        onChange={(e) => setRejectionReason(e.target.value)}
                                        placeholder="e.g., Lack of required experience"
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                                        rows="3"
                                    />
                                    <p className="text-xs text-gray-500 mt-1">This note is for internal records only and will not be visible to the applicant.</p>
                                </div>
                            )}
                        </div>

                        <div className="flex space-x-3">
                            <button
                                onClick={() => handleFinalDecision(decisionModal._id)}
                                disabled={submitting}
                                className={`flex-1 px-4 py-2 rounded-lg font-medium text-white ${decision === 'selected'
                                        ? 'bg-green-600 hover:bg-green-700'
                                        : 'bg-red-600 hover:bg-red-700'
                                    }`}
                            >
                                {submitting ? 'Submitting...' : `Confirm ${decision === 'selected' ? 'Selection' : 'Rejection'}`}
                            </button>
                            <button
                                onClick={() => {
                                    setDecisionModal(null);
                                    setDecision('selected');
                                    setRejectionReason('');
                                }}
                                disabled={submitting}
                                className="btn-secondary flex-1"
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

const getSampleApplications = () => [
    {
        _id: '1',
        applicantName: 'John Doe',
        email: 'john.doe@email.com',
        phone: '+1 (555) 123-4567',
        location: 'New York, NY',
        jobTitle: 'Senior Full Stack Developer',
        status: 'pending',
        appliedDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
        coverLetter: 'I am excited to apply for this position. With 5+ years of experience in full stack development...',
        skills: ['React', 'Node.js', 'MongoDB', 'TypeScript'],
        resumeUrl: '/resumes/john-doe.pdf'
    },
    {
        _id: '2',
        applicantName: 'Jane Smith',
        email: 'jane.smith@email.com',
        phone: '+1 (555) 987-6543',
        location: 'San Francisco, CA',
        jobTitle: 'UI/UX Designer',
        status: 'reviewing',
        appliedDate: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
        coverLetter: 'As a passionate designer with a strong portfolio, I believe I would be a great fit...',
        skills: ['Figma', 'Adobe XD', 'Prototyping', 'User Research'],
        resumeUrl: '/resumes/jane-smith.pdf'
    }
];

export default EmployerApplications;
