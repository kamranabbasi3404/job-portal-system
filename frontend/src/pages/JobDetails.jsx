import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { MapPin, Briefcase, DollarSign, Clock, Building2, Users, Share2, Bookmark } from 'lucide-react';
import Loader from '../components/common/Loader';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';

const JobDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user } = useAuth();
    const [job, setJob] = useState(null);
    const [loading, setLoading] = useState(true);
    const [applying, setApplying] = useState(false);
    const [showApplicationForm, setShowApplicationForm] = useState(false);

    useEffect(() => {
        fetchJobDetails();
    }, [id]);

    const fetchJobDetails = async () => {
        try {
            setLoading(true);
            const response = await api.get(`/api/jobs/${id}`);
            setJob(response.data);
        } catch (error) {
            console.error('Error fetching job details:', error);
            // Set sample job for demo
            setJob(getSampleJob());
        } finally {
            setLoading(false);
        }
    };

    const handleApply = async () => {
        if (!user) {
            navigate('/login');
            return;
        }

        if (user.role !== 'jobseeker') {
            alert('Only job seekers can apply for jobs');
            return;
        }

        setShowApplicationForm(true);
    };

    const submitApplication = async () => {
        try {
            setApplying(true);
            await api.post(`/api/applications`, { jobId: id });
            alert('Application submitted successfully!');
            setShowApplicationForm(false);
        } catch (error) {
            console.error('Error submitting application:', error);
            alert(error.response?.data?.message || 'Failed to submit application');
        } finally {
            setApplying(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <Loader size="large" />
            </div>
        );
    }

    if (!job) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <p className="text-gray-500">Job not found</p>
            </div>
        );
    }

    const getJobTypeBadgeColor = (type) => {
        switch (type?.toLowerCase()) {
            case 'full-time': return 'bg-green-100 text-green-700';
            case 'part-time': return 'bg-blue-100 text-blue-700';
            case 'contract': return 'bg-purple-100 text-purple-700';
            case 'internship': return 'bg-orange-100 text-orange-700';
            default: return 'bg-gray-100 text-gray-700';
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header Card */}
                <div className="card mb-6">
                    <div className="flex items-start justify-between mb-6">
                        <div className="flex items-start space-x-4">
                            <div className="w-20 h-20 gradient-bg rounded-xl flex items-center justify-center flex-shrink-0">
                                <Building2 className="w-10 h-10 text-white" />
                            </div>
                            <div>
                                <span className={`badge ${getJobTypeBadgeColor(job.type)} mb-2`}>
                                    {job.type}
                                </span>
                                <h1 className="text-3xl font-bold text-gray-900 mb-2">{job.title}</h1>
                                <p className="text-xl text-gray-600 font-medium">{job.company || 'Company Name'}</p>
                            </div>
                        </div>
                        <div className="flex space-x-2">
                            <button className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
                                <Bookmark className="w-5 h-5" />
                            </button>
                            <button className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
                                <Share2 className="w-5 h-5" />
                            </button>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                        <div className="flex items-center space-x-2 text-gray-600">
                            <MapPin className="w-5 h-5 text-gray-400" />
                            <span>{job.location}</span>
                        </div>
                        <div className="flex items-center space-x-2 text-gray-600">
                            <DollarSign className="w-5 h-5 text-gray-400" />
                            <span>${job.salary?.min?.toLocaleString()} - ${job.salary?.max?.toLocaleString()}</span>
                        </div>
                        <div className="flex items-center space-x-2 text-gray-600">
                            <Briefcase className="w-5 h-5 text-gray-400" />
                            <span>{job.experience || 'Not specified'}</span>
                        </div>
                        <div className="flex items-center space-x-2 text-gray-600">
                            <Clock className="w-5 h-5 text-gray-400" />
                            <span>Posted {new Date(job.postedDate).toLocaleDateString()}</span>
                        </div>
                    </div>

                    <button onClick={handleApply} className="btn-primary w-full md:w-auto px-8">
                        Apply Now
                    </button>
                </div>

                <div className="grid md:grid-cols-3 gap-6">
                    {/* Main Content */}
                    <div className="md:col-span-2 space-y-6">
                        <div className="card">
                            <h2 className="text-2xl font-bold text-gray-900 mb-4">Job Description</h2>
                            <p className="text-gray-600 leading-relaxed whitespace-pre-line">{job.description}</p>
                        </div>

                        {job.requirements && job.requirements.length > 0 && (
                            <div className="card">
                                <h2 className="text-2xl font-bold text-gray-900 mb-4">Requirements</h2>
                                <ul className="space-y-2">
                                    {job.requirements.map((req, index) => (
                                        <li key={index} className="flex items-start space-x-2 text-gray-600">
                                            <span className="text-primary-600 mt-1">•</span>
                                            <span>{req}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}

                        {job.skills && job.skills.length > 0 && (
                            <div className="card">
                                <h2 className="text-2xl font-bold text-gray-900 mb-4">Required Skills</h2>
                                <div className="flex flex-wrap gap-2">
                                    {job.skills.map((skill, index) => (
                                        <span key={index} className="badge bg-primary-100 text-primary-700">
                                            {skill}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Sidebar */}
                    <div className="space-y-6">
                        <div className="card">
                            <h3 className="text-lg font-bold text-gray-900 mb-4">Job Overview</h3>
                            <div className="space-y-4">
                                <div>
                                    <p className="text-sm text-gray-500 mb-1">Job Type</p>
                                    <p className="font-medium text-gray-900">{job.type}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500 mb-1">Experience Level</p>
                                    <p className="font-medium text-gray-900">{job.experience}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500 mb-1">Salary Range</p>
                                    <p className="font-medium text-gray-900">
                                        ${job.salary?.min?.toLocaleString()} - ${job.salary?.max?.toLocaleString()}/year
                                    </p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500 mb-1">Location</p>
                                    <p className="font-medium text-gray-900">{job.location}</p>
                                </div>
                            </div>
                        </div>

                        <div className="card gradient-bg text-white">
                            <h3 className="text-lg font-bold mb-2">Interested in this role?</h3>
                            <p className="text-primary-100 mb-4 text-sm">
                                Apply now and join thousands of professionals finding their dream jobs.
                            </p>
                            <button onClick={handleApply} className="bg-white text-primary-600 px-6 py-2 rounded-lg font-semibold hover:bg-primary-50 transition-colors w-full">
                                Apply Now
                            </button>
                        </div>
                    </div>
                </div>

                {/* Application Modal */}
                {showApplicationForm && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                        <div className="bg-white rounded-xl max-w-md w-full p-6">
                            <h3 className="text-2xl font-bold text-gray-900 mb-4">Apply for {job.title}</h3>
                            <p className="text-gray-600 mb-6">
                                Your profile information will be sent to the employer.
                            </p>
                            <div className="flex space-x-3">
                                <button
                                    onClick={submitApplication}
                                    disabled={applying}
                                    className="btn-primary flex-1"
                                >
                                    {applying ? <Loader size="small" /> : 'Submit Application'}
                                </button>
                                <button
                                    onClick={() => setShowApplicationForm(false)}
                                    className="btn-secondary flex-1"
                                >
                                    Cancel
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

// Sample job data
const getSampleJob = () => ({
    _id: '1',
    title: 'Senior Full Stack Developer',
    company: 'Tech Corp',
    description: `We are seeking a talented Senior Full Stack Developer to join our innovative team. In this role, you will be responsible for designing, developing, and maintaining web applications using modern technologies.

You will collaborate with cross-functional teams to deliver high-quality software solutions that meet our clients' needs. The ideal candidate has a strong background in both frontend and backend development, with expertise in React, Node.js, and MongoDB.

Key Responsibilities:
• Design and develop scalable web applications
• Write clean, maintainable code following best practices
• Collaborate with designers and product managers
• Participate in code reviews and mentor junior developers
• Troubleshoot and debug applications`,
    location: 'New York, NY',
    type: 'full-time',
    salary: { min: 100000, max: 150000 },
    experience: '5+ years',
    skills: ['React', 'Node.js', 'MongoDB', 'TypeScript', 'AWS', 'Docker'],
    requirements: [
        '5+ years of experience in full stack development',
        'Strong proficiency in React and Node.js',
        'Experience with MongoDB and SQL databases',
        'Familiarity with cloud platforms (AWS, Azure, or GCP)',
        'Excellent problem-solving and communication skills',
        'Bachelor\'s degree in Computer Science or related field'
    ],
    postedDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000)
});

export default JobDetails;
