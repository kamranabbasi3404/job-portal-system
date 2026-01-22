import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Eye, Edit, Trash2, Users, MoreVertical } from 'lucide-react';
import Loader from '../../components/common/Loader';
import api from '../../services/api';

const ManageJobs = () => {
    const [jobs, setJobs] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchJobs();
    }, []);

    const fetchJobs = async () => {
        try {
            setLoading(true);
            const response = await api.get('/api/jobs/my-jobs');
            setJobs(response.data || []);
        } catch (error) {
            console.error('Error fetching jobs:', error);
            setJobs(getSampleJobs());
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (jobId) => {
        if (!window.confirm('Are you sure you want to delete this job posting?')) return;

        try {
            await api.delete(`/api/jobs/${jobId}`);
            setJobs(jobs.filter(job => job._id !== jobId));
        } catch (error) {
            console.error('Error deleting job:', error);
            alert('Failed to delete job');
        }
    };

    const toggleStatus = async (jobId, currentStatus) => {
        try {
            const newStatus = currentStatus === 'active' ? 'closed' : 'active';
            await api.patch(`/api/jobs/${jobId}`, { status: newStatus });
            setJobs(jobs.map(job =>
                job._id === jobId ? { ...job, status: newStatus } : job
            ));
        } catch (error) {
            console.error('Error updating job status:', error);
            alert('Failed to update job status');
        }
    };

    const getStatusBadge = (status) => {
        return status === 'active'
            ? 'bg-green-100 text-green-700'
            : 'bg-gray-100 text-gray-700';
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
                <div className="mb-8 flex flex-col md:flex-row md:items-center md:justify-between">
                    <div>
                        <h1 className="text-4xl font-bold text-gray-900 mb-2">Manage Jobs</h1>
                        <p className="text-gray-600">View and manage all your job postings</p>
                    </div>
                    <Link to="/employer/post-job" className="btn-primary mt-4 md:mt-0">
                        + Post New Job
                    </Link>
                </div>

                {jobs.length === 0 ? (
                    <div className="card text-center py-12">
                        <Eye className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                        <h3 className="text-xl font-semibold text-gray-900 mb-2">No job postings yet</h3>
                        <p className="text-gray-600 mb-4">Create your first job posting to start hiring</p>
                        <Link to="/employer/post-job" className="btn-primary inline-block">
                            Post a Job
                        </Link>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {jobs.map((job) => (
                            <div key={job._id || job.id} className="card hover:shadow-lg transition-shadow">
                                <div className="flex items-start justify-between mb-4">
                                    <div className="flex-1">
                                        <div className="flex items-center space-x-3 mb-2">
                                            <h3 className="text-xl font-bold text-gray-900">{job.title}</h3>
                                            <span className={`badge ${getStatusBadge(job.status)}`}>
                                                {job.status || 'Active'}
                                            </span>
                                        </div>
                                        <p className="text-gray-600 mb-3 line-clamp-2">{job.description}</p>

                                        <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                                            <span className="flex items-center space-x-1">
                                                <Users className="w-4 h-4" />
                                                <span>{job.applicants || 0} applicants</span>
                                            </span>
                                            <span className="flex items-center space-x-1">
                                                <Eye className="w-4 h-4" />
                                                <span>{job.views || 0} views</span>
                                            </span>
                                            <span>Posted: {new Date(job.postedDate || new Date()).toLocaleDateString()}</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex flex-wrap gap-2 mb-4">
                                    {job.skills && job.skills.slice(0, 5).map((skill, index) => (
                                        <span key={index} className="badge bg-primary-50 text-primary-700 text-xs">
                                            {skill}
                                        </span>
                                    ))}
                                </div>

                                <div className="flex items-center space-x-3 pt-4 border-t border-gray-100">
                                    <Link
                                        to={`/jobs/${job._id || job.id}`}
                                        className="btn-secondary text-sm flex items-center space-x-1"
                                    >
                                        <Eye className="w-4 h-4" />
                                        <span>View</span>
                                    </Link>
                                    <Link
                                        to={`/employer/edit-job/${job._id || job.id}`}
                                        className="btn-secondary text-sm flex items-center space-x-1"
                                    >
                                        <Edit className="w-4 h-4" />
                                        <span>Edit</span>
                                    </Link>
                                    <button
                                        onClick={() => toggleStatus(job._id || job.id, job.status)}
                                        className="btn-outline text-sm"
                                    >
                                        {job.status === 'active' ? 'Close' : 'Reopen'}
                                    </button>
                                    <button
                                        onClick={() => handleDelete(job._id || job.id)}
                                        className="text-red-600 hover:bg-red-50 px-3 py-2 rounded-lg transition-colors text-sm flex items-center space-x-1"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                        <span>Delete</span>
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

const getSampleJobs = () => [
    {
        _id: '1',
        title: 'Senior Full Stack Developer',
        description: 'We are looking for an experienced Full Stack Developer to join our dynamic team.',
        location: 'New York, NY',
        type: 'full-time',
        status: 'active',
        applicants: 15,
        views: 234,
        skills: ['React', 'Node.js', 'MongoDB', 'TypeScript'],
        postedDate: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000)
    },
    {
        _id: '2',
        title: 'UI/UX Designer',
        description: 'Creative UI/UX Designer needed for web and mobile projects.',
        location: 'San Francisco, CA',
        type: 'full-time',
        status: 'active',
        applicants: 8,
        views: 156,
        skills: ['Figma', 'Adobe XD', 'Prototyping'],
        postedDate: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000)
    }
];

export default ManageJobs;
