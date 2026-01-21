import React, { useState, useEffect } from 'react';
import { Eye, Download, CheckCircle, XCircle } from 'lucide-react';
import Loader from '../../components/common/Loader';
import ProfileModal from '../../components/common/ProfileModal';
import api from '../../services/api';

const EmployerApplications = () => {
    const [applications, setApplications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('all');
    const [selectedProfile, setSelectedProfile] = useState(null);
    const [profileLoading, setProfileLoading] = useState(false);

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

    const updateApplicationStatus = async (appId, newStatus) => {
        try {
            await api.patch(`/api/applications/${appId}`, { status: newStatus });
            setApplications(applications.map(app =>
                app._id === appId ? { ...app, status: newStatus } : app
            ));
        } catch (error) {
            console.error('Error updating application:', error);
            alert('Failed to update application status');
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

    const filteredApplications = applications.filter(app => {
        if (filter === 'all') return true;
        return app.status.toLowerCase() === filter;
    });

    const getStatusColor = (status) => {
        switch (status?.toLowerCase()) {
            case 'pending': return 'bg-yellow-100 text-yellow-700';
            case 'reviewing': return 'bg-blue-100 text-blue-700';
            case 'accepted': return 'bg-green-100 text-green-700';
            case 'rejected': return 'bg-red-100 text-red-700';
            default: return 'bg-gray-100 text-gray-700';
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
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="mb-8">
                    <h1 className="text-4xl font-bold text-gray-900 mb-2">Applications</h1>
                    <p className="text-gray-600">Review and manage job applications</p>
                </div>

                {/* Filters */}
                <div className="card mb-6">
                    <div className="flex flex-wrap gap-2">
                        {['all', 'pending', 'reviewing', 'accepted', 'rejected'].map((status) => (
                            <button
                                key={status}
                                onClick={() => setFilter(status)}
                                className={`px-4 py-2 rounded-lg font-medium transition-colors ${filter === status
                                    ? 'bg-primary-600 text-white'
                                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                    }`}
                            >
                                {status.charAt(0).toUpperCase() + status.slice(1)}
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
                                : `No ${filter} applications`}
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
                                        {app.status}
                                    </span>
                                </div>

                                {app.coverLetter && (
                                    <div className="bg-gray-50 rounded-lg p-4 mb-4">
                                        <h4 className="font-semibold text-gray-900 mb-2">Cover Letter</h4>
                                        <p className="text-sm text-gray-700 line-clamp-3">{app.coverLetter}</p>
                                    </div>
                                )}

                                {app.skills && app.skills.length > 0 && (
                                    <div className="flex flex-wrap gap-2 mb-4">
                                        {app.skills.map((skill, index) => (
                                            <span key={index} className="badge bg-primary-50 text-primary-700 text-xs">
                                                {skill}
                                            </span>
                                        ))}
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
                                            <button className="btn-secondary text-sm flex items-center space-x-1">
                                                <Download className="w-4 h-4" />
                                                <span>Resume</span>
                                            </button>
                                        )}
                                        {app.status !== 'accepted' && (
                                            <button
                                                onClick={() => updateApplicationStatus(app._id || app.id, 'accepted')}
                                                className="bg-green-600 hover:bg-green-700 text-white px-3 py-2 rounded-lg text-sm flex items-center space-x-1"
                                            >
                                                <CheckCircle className="w-4 h-4" />
                                                <span>Accept</span>
                                            </button>
                                        )}
                                        {app.status !== 'rejected' && (
                                            <button
                                                onClick={() => updateApplicationStatus(app._id || app.id, 'rejected')}
                                                className="bg-red-600 hover:bg-red-700 text-white px-3 py-2 rounded-lg text-sm flex items-center space-x-1"
                                            >
                                                <XCircle className="w-4 h-4" />
                                                <span>Reject</span>
                                            </button>
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
