import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Briefcase, Users, FileText, TrendingUp, Eye, DollarSign } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import Loader from '../../components/common/Loader';
import api from '../../services/api';

const EmployerDashboard = () => {
    const { user } = useAuth();
    const [stats, setStats] = useState({
        activeJobs: 0,
        totalApplications: 0,
        newApplications: 0,
        views: 0
    });
    const [recentJobs, setRecentJobs] = useState([]);
    const [recentApplications, setRecentApplications] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchDashboardData();
    }, []);

    const fetchDashboardData = async () => {
        try {
            setLoading(true);
            // Fetch employer dashboard data
            const [jobsRes, appsRes] = await Promise.all([
                api.get('/api/jobs/my-jobs').catch(() => ({ data: getSampleJobs() })),
                api.get('/api/applications/employer').catch(() => ({ data: [] }))
            ]);

            setRecentJobs(jobsRes.data.slice(0, 3));
            setRecentApplications(appsRes.data.slice(0, 5));
            setStats({
                activeJobs: jobsRes.data.filter(j => j.status === 'active').length,
                totalApplications: appsRes.data.length,
                newApplications: appsRes.data.filter(a => a.status === 'pending').length,
                views: 1234
            });
        } catch (error) {
            console.error('Error fetching dashboard data:', error);
            setRecentJobs(getSampleJobs());
        } finally {
            setLoading(false);
        }
    };

    const statCards = [
        {
            icon: Briefcase,
            label: 'Active Jobs',
            value: stats.activeJobs,
            color: 'bg-blue-100 text-blue-600',
            link: '/employer/manage-jobs'
        },
        {
            icon: Users,
            label: 'Total Applications',
            value: stats.totalApplications,
            color: 'bg-purple-100 text-purple-600',
            link: '/employer/applications'
        },
        {
            icon: FileText,
            label: 'New Applications',
            value: stats.newApplications,
            color: 'bg-green-100 text-green-600',
            link: '/employer/applications'
        },
        {
            icon: Eye,
            label: 'Profile Views',
            value: stats.views,
            color: 'bg-orange-100 text-orange-600',
            link: '#'
        }
    ];

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
                {/* Welcome Section */}
                <div className="mb-8 flex flex-col md:flex-row md:items-center md:justify-between">
                    <div>
                        <h1 className="text-4xl font-bold text-gray-900 mb-2">
                            Welcome, {user?.name || 'Company'}!
                        </h1>
                        <p className="text-gray-600">Manage your job postings and applications</p>
                    </div>
                    <Link to="/employer/post-job" className="btn-primary mt-4 md:mt-0">
                        + Post New Job
                    </Link>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    {statCards.map((stat, index) => {
                        const Icon = stat.icon;
                        return (
                            <Link key={index} to={stat.link} className="card group hover:scale-105 transition-transform">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-gray-600 text-sm mb-1">{stat.label}</p>
                                        <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
                                    </div>
                                    <div className={`w-14 h-14 rounded-full ${stat.color} flex items-center justify-center`}>
                                        <Icon className="w-7 h-7" />
                                    </div>
                                </div>
                            </Link>
                        );
                    })}
                </div>

                <div className="grid lg:grid-cols-2 gap-8">
                    {/* Recent Jobs */}
                    <div className="card">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-2xl font-bold text-gray-900">Active Job Postings</h2>
                            <Link to="/employer/manage-jobs" className="text-primary-600 hover:text-primary-700 font-medium">
                                View All
                            </Link>
                        </div>

                        {recentJobs.length === 0 ? (
                            <div className="text-center py-8">
                                <Briefcase className="w-16 h-16 text-gray-300 mx-auto mb-3" />
                                <p className="text-gray-500 mb-4">No active job postings</p>
                                <Link to="/employer/post-job" className="btn-primary">
                                    Post Your First Job
                                </Link>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                {recentJobs.map((job, index) => (
                                    <div key={index} className="border border-gray-200 rounded-lg p-4 hover:border-primary-200 transition-colors">
                                        <div className="flex items-start justify-between mb-2">
                                            <h3 className="font-semibold text-gray-900">{job.title}</h3>
                                            <span className="badge bg-green-100 text-green-700">
                                                {job.status || 'Active'}
                                            </span>
                                        </div>
                                        <div className="flex items-center space-x-4 text-sm text-gray-600">
                                            <span className="flex items-center space-x-1">
                                                <Users className="w-4 h-4" />
                                                <span>{job.applicants || 0} applicants</span>
                                            </span>
                                            <span className="flex items-center space-x-1">
                                                <Eye className="w-4 h-4" />
                                                <span>{job.views || 0} views</span>
                                            </span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Recent Applications */}
                    <div className="card">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-2xl font-bold text-gray-900">Recent Applications</h2>
                            <Link to="/employer/applications" className="text-primary-600 hover:text-primary-700 font-medium">
                                View All
                            </Link>
                        </div>

                        {recentApplications.length === 0 ? (
                            <div className="text-center py-8">
                                <FileText className="w-16 h-16 text-gray-300 mx-auto mb-3" />
                                <p className="text-gray-500">No applications yet</p>
                            </div>
                        ) : (
                            <div className="space-y-3">
                                {recentApplications.map((app, index) => (
                                    <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                                        <div className="flex items-center space-x-3">
                                            <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center text-primary-600 font-semibold">
                                                {app.jobSeeker?.name?.charAt(0) || 'A'}
                                            </div>
                                            <div>
                                                <p className="font-medium text-gray-900">{app.jobSeeker?.name || 'Unknown Applicant'}</p>
                                                <p className="text-sm text-gray-600">{app.job?.title || 'Unknown Position'}</p>
                                            </div>
                                        </div>
                                        <span className="badge bg-blue-100 text-blue-700">New</span>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                {/* Quick Actions */}
                <div className="mt-8 grid md:grid-cols-3 gap-6">
                    <Link to="/employer/post-job" className="card hover:scale-105 transition-transform text-center">
                        <Briefcase className="w-12 h-12 text-primary-600 mx-auto mb-3" />
                        <h3 className="font-semibold text-gray-900 mb-2">Post a Job</h3>
                        <p className="text-sm text-gray-600">Create a new job posting</p>
                    </Link>

                    <Link to="/employer/applications" className="card hover:scale-105 transition-transform text-center">
                        <Users className="w-12 h-12 text-purple-600 mx-auto mb-3" />
                        <h3 className="font-semibold text-gray-900 mb-2">Review Applications</h3>
                        <p className="text-sm text-gray-600">View and manage applicants</p>
                    </Link>

                    <Link to="/employer/manage-jobs" className="card hover:scale-105 transition-transform text-center">
                        <TrendingUp className="w-12 h-12 text-green-600 mx-auto mb-3" />
                        <h3 className="font-semibold text-gray-900 mb-2">Manage Jobs</h3>
                        <p className="text-sm text-gray-600">Edit or close job postings</p>
                    </Link>
                </div>
            </div>
        </div>
    );
};

const getSampleJobs = () => [
    {
        _id: '1',
        title: 'Senior Full Stack Developer',
        status: 'active',
        applicants: 15,
        views: 234,
        postedDate: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000)
    },
    {
        _id: '2',
        title: 'UI/UX Designer',
        status: 'active',
        applicants: 8,
        views: 156,
        postedDate: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000)
    },
    {
        _id: '3',
        title: 'Marketing Manager',
        status: 'active',
        applicants: 22,
        views: 389,
        postedDate: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
    }
];

export default EmployerDashboard;
