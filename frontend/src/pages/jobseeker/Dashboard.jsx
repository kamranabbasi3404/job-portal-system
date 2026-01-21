import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Briefcase, FileText, User, TrendingUp, Clock, CheckCircle } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import JobCard from '../../components/common/JobCard';
import Loader from '../../components/common/Loader';
import api from '../../services/api';

const JobSeekerDashboard = () => {
    const { user } = useAuth();
    const [stats, setStats] = useState({
        applications: 0,
        saved: 0,
        profileViews: 0
    });
    const [recentApplications, setRecentApplications] = useState([]);
    const [recommendedJobs, setRecommendedJobs] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchDashboardData();
    }, []);

    const fetchDashboardData = async () => {
        try {
            setLoading(true);
            // Fetch dashboard data from API
            const [applicationsRes, jobsRes] = await Promise.all([
                api.get('/api/applications/my-applications').catch(() => ({ data: [] })),
                api.get('/api/jobs').catch(() => ({ data: [] }))
            ]);

            setRecentApplications(applicationsRes.data.slice(0, 3));
            setRecommendedJobs(jobsRes.data.slice(0, 3));
            setStats({
                applications: applicationsRes.data.length,
                saved: 0,
                profileViews: 0
            });
        } catch (error) {
            console.error('Error fetching dashboard data:', error);
        } finally {
            setLoading(false);
        }
    };

    const statCards = [
        {
            icon: FileText,
            label: 'Applications',
            value: stats.applications,
            color: 'bg-blue-100 text-blue-600',
            link: '/jobseeker/applications'
        },
        {
            icon: Briefcase,
            label: 'Saved Jobs',
            value: stats.saved,
            color: 'bg-purple-100 text-purple-600',
            link: '/jobs'
        },
        {
            icon: TrendingUp,
            label: 'Profile Views',
            value: stats.profileViews,
            color: 'bg-green-100 text-green-600',
            link: '/jobseeker/profile'
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
                <div className="mb-8">
                    <h1 className="text-4xl font-bold text-gray-900 mb-2">
                        Welcome back, {user?.name || 'User'}!
                    </h1>
                    <p className="text-gray-600">Here's what's happening with your job search</p>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
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
                    {/* Recent Applications */}
                    <div className="card">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-2xl font-bold text-gray-900">Recent Applications</h2>
                            <Link to="/jobseeker/applications" className="text-primary-600 hover:text-primary-700 font-medium">
                                View All
                            </Link>
                        </div>

                        {recentApplications.length === 0 ? (
                            <div className="text-center py-8">
                                <FileText className="w-16 h-16 text-gray-300 mx-auto mb-3" />
                                <p className="text-gray-500 mb-4">You haven't applied to any jobs yet</p>
                                <Link to="/jobs" className="btn-primary">
                                    Browse Jobs
                                </Link>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                {recentApplications.map((app, index) => (
                                    <div key={index} className="border border-gray-200 rounded-lg p-4 hover:border-primary-200 transition-colors">
                                        <div className="flex items-start justify-between mb-2">
                                            <h3 className="font-semibold text-gray-900">{app.jobTitle}</h3>
                                            <span className={`badge ${getStatusColor(app.status)}`}>
                                                {app.status}
                                            </span>
                                        </div>
                                        <p className="text-sm text-gray-600">{app.company}</p>
                                        <p className="text-xs text-gray-500 mt-2">
                                            Applied {new Date(app.appliedDate).toLocaleDateString()}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Profile Completion */}
                    <div className="card">
                        <h2 className="text-2xl font-bold text-gray-900 mb-4">Complete Your Profile</h2>
                        <p className="text-gray-600 mb-4">
                            A complete profile helps employers find you and increases your chances of getting hired.
                        </p>
                        <Link to="/jobseeker/profile" className="btn-primary">
                            Update Profile
                        </Link>
                    </div>
                </div>

                {/* Recommended Jobs */}
                <div className="mt-8">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-2xl font-bold text-gray-900">Recommended Jobs</h2>
                        <Link to="/jobs" className="text-primary-600 hover:text-primary-700 font-medium">
                            View All Jobs
                        </Link>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {recommendedJobs.map(job => (
                            <JobCard key={job._id} job={job} />
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
        case 'pending': return 'bg-yellow-100 text-yellow-700';
        case 'reviewing': return 'bg-blue-100 text-blue-700';
        case 'accepted': return 'bg-green-100 text-green-700';
        case 'rejected': return 'bg-red-100 text-red-700';
        default: return 'bg-gray-100 text-gray-700';
    }
};

export default JobSeekerDashboard;
