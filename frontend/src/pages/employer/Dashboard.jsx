import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Briefcase, Users, FileText, Plus, ArrowRight, Eye, Settings, Calendar, Clock, CheckCircle, User } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import Loader from '../../components/common/Loader';
import api from '../../services/api';

const EmployerDashboard = () => {
    const { user } = useAuth();
    const [stats, setStats] = useState({
        activeJobs: 0,
        totalApplications: 0,
        newApplications: 0,
        totalJobs: 0
    });
    const [recentJobs, setRecentJobs] = useState([]);
    const [recentApplications, setRecentApplications] = useState([]);
    const [companyProfile, setCompanyProfile] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchDashboardData();
    }, []);

    const fetchDashboardData = async () => {
        try {
            setLoading(true);
            const [jobsRes, appsRes, profileRes] = await Promise.all([
                api.get('/api/jobs/my-jobs').catch(() => ({ data: [] })),
                api.get('/api/applications/employer').catch(() => ({ data: [] })),
                api.get('/api/company-profile/me').catch(() => ({ data: null }))
            ]);

            setRecentJobs(jobsRes.data.slice(0, 4));
            setRecentApplications(appsRes.data.slice(0, 5));
            setCompanyProfile(profileRes.data);
            setStats({
                activeJobs: jobsRes.data.filter(j => j.status === 'active').length,
                totalApplications: appsRes.data.length,
                newApplications: appsRes.data.filter(a => a.status === 'pending').length,
                totalJobs: jobsRes.data.length
            });
        } catch (error) {
            console.error('Error fetching dashboard data:', error);
        } finally {
            setLoading(false);
        }
    };

    const statCards = [
        {
            icon: Briefcase,
            label: 'Active Jobs',
            value: stats.activeJobs,
            gradient: 'from-blue-500 to-blue-600',
            link: '/employer/manage-jobs'
        },
        {
            icon: Users,
            label: 'Total Applications',
            value: stats.totalApplications,
            gradient: 'from-purple-500 to-purple-600',
            link: '/employer/applications'
        },
        {
            icon: Clock,
            label: 'New Applications',
            value: stats.newApplications,
            gradient: 'from-amber-500 to-orange-500',
            link: '/employer/applications'
        },
        {
            icon: FileText,
            label: 'Total Jobs Posted',
            value: stats.totalJobs,
            gradient: 'from-emerald-500 to-green-600',
            link: '/employer/manage-jobs'
        }
    ];

    const quickActions = [
        {
            icon: Plus,
            title: 'Post a Job',
            description: 'Create a new job posting',
            link: '/employer/post-job',
            color: 'text-blue-600 bg-blue-50 group-hover:bg-blue-100'
        },
        {
            icon: Users,
            title: 'Review Applications',
            description: 'View and manage applicants',
            link: '/employer/applications',
            color: 'text-purple-600 bg-purple-50 group-hover:bg-purple-100'
        },
        {
            icon: Settings,
            title: 'Company Profile',
            description: 'Update your company info',
            link: '/employer/profile',
            color: 'text-emerald-600 bg-emerald-50 group-hover:bg-emerald-100'
        }
    ];

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <Loader size="large" />
            </div>
        );
    }

    const getGreeting = () => {
        const hour = new Date().getHours();
        if (hour < 12) return 'Good Morning';
        if (hour < 17) return 'Good Afternoon';
        return 'Good Evening';
    };

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Hero Welcome Banner */}
            <div className="bg-gradient-to-r from-primary-600 via-primary-700 to-secondary-600 text-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-10">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                        <div>
                            <p className="text-primary-100 text-sm font-medium mb-1">{getGreeting()} 👋</p>
                            <h1 className="text-3xl md:text-4xl font-bold mb-2">
                                {companyProfile?.companyName || user?.name || 'Company'}
                            </h1>
                            <p className="text-primary-100 text-sm md:text-base">
                                Manage your job postings and find the best talent
                            </p>
                        </div>
                        <Link
                            to="/employer/post-job"
                            className="mt-4 md:mt-0 inline-flex items-center space-x-2 bg-white/15 backdrop-blur-sm hover:bg-white/25 text-white px-5 py-2.5 rounded-lg font-medium transition-all duration-200 border border-white/20"
                        >
                            <Plus className="w-4 h-4" />
                            <span>Post New Job</span>
                        </Link>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-6 pb-10">
                {/* Stats Cards */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                    {statCards.map((stat, index) => {
                        const Icon = stat.icon;
                        return (
                            <Link
                                key={index}
                                to={stat.link}
                                className="bg-white rounded-xl shadow-sm hover:shadow-md border border-gray-100 p-5 group transition-all duration-200 hover:-translate-y-0.5"
                            >
                                <div className="flex items-center justify-between mb-3">
                                    <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${stat.gradient} flex items-center justify-center shadow-sm`}>
                                        <Icon className="w-5 h-5 text-white" />
                                    </div>
                                    <ArrowRight className="w-4 h-4 text-gray-300 group-hover:text-gray-500 transition-colors" />
                                </div>
                                <p className="text-2xl md:text-3xl font-bold text-gray-900">{stat.value}</p>
                                <p className="text-gray-500 text-xs md:text-sm mt-0.5">{stat.label}</p>
                            </Link>
                        );
                    })}
                </div>

                {/* Main Content Grid */}
                <div className="grid lg:grid-cols-3 gap-6 mb-8">
                    {/* Active Job Postings - Takes 2 columns */}
                    <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-100">
                        <div className="flex items-center justify-between p-5 border-b border-gray-100">
                            <h2 className="text-lg font-bold text-gray-900">Active Job Postings</h2>
                            <Link to="/employer/manage-jobs" className="text-primary-600 hover:text-primary-700 text-sm font-medium flex items-center space-x-1">
                                <span>View All</span>
                                <ArrowRight className="w-3.5 h-3.5" />
                            </Link>
                        </div>

                        {recentJobs.length === 0 ? (
                            <div className="text-center py-12 px-5">
                                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <Briefcase className="w-8 h-8 text-gray-400" />
                                </div>
                                <h3 className="font-semibold text-gray-900 mb-1">No active job postings</h3>
                                <p className="text-gray-500 text-sm mb-4">Create your first job posting to start receiving applications</p>
                                <Link to="/employer/post-job" className="btn-primary text-sm px-5 py-2">
                                    Post Your First Job
                                </Link>
                            </div>
                        ) : (
                            <div className="divide-y divide-gray-50">
                                {recentJobs.map((job, index) => (
                                    <div key={index} className="flex items-center justify-between p-4 hover:bg-gray-50/50 transition-colors">
                                        <div className="flex items-center space-x-3 min-w-0">
                                            <div className="w-10 h-10 bg-primary-50 rounded-lg flex items-center justify-center flex-shrink-0">
                                                <Briefcase className="w-5 h-5 text-primary-600" />
                                            </div>
                                            <div className="min-w-0">
                                                <h3 className="font-semibold text-gray-900 text-sm truncate">{job.title}</h3>
                                                <div className="flex items-center space-x-3 mt-0.5">
                                                    <span className="text-xs text-gray-500 flex items-center space-x-1">
                                                        <Users className="w-3 h-3" />
                                                        <span>{job.applicants || 0} applicants</span>
                                                    </span>
                                                    <span className="text-xs text-gray-500 flex items-center space-x-1">
                                                        <Eye className="w-3 h-3" />
                                                        <span>{job.views || 0} views</span>
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                        <span className="badge bg-green-100 text-green-700 text-xs flex-shrink-0 ml-3">
                                            {job.status || 'Active'}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Quick Actions Sidebar */}
                    <div className="space-y-4">
                        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
                            <h2 className="text-lg font-bold text-gray-900 mb-4">Quick Actions</h2>
                            <div className="space-y-3">
                                {quickActions.map((action, index) => {
                                    const Icon = action.icon;
                                    return (
                                        <Link
                                            key={index}
                                            to={action.link}
                                            className="group flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-all duration-200"
                                        >
                                            <div className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 transition-colors ${action.color}`}>
                                                <Icon className="w-5 h-5" />
                                            </div>
                                            <div className="min-w-0">
                                                <p className="font-medium text-gray-900 text-sm">{action.title}</p>
                                                <p className="text-xs text-gray-500">{action.description}</p>
                                            </div>
                                            <ArrowRight className="w-4 h-4 text-gray-300 group-hover:text-gray-500 flex-shrink-0 transition-colors" />
                                        </Link>
                                    );
                                })}
                            </div>
                        </div>

                        {/* Hiring Tip Card */}
                        <div className="bg-gradient-to-br from-primary-500 to-secondary-600 rounded-xl shadow-sm p-5 text-white">
                            <div className="flex items-center space-x-2 mb-3">
                                <CheckCircle className="w-5 h-5" />
                                <h3 className="font-bold">Hiring Tip</h3>
                            </div>
                            <p className="text-sm text-primary-100 mb-4">
                                Complete your company profile to attract more qualified candidates. Companies with complete profiles get 2x more applications!
                            </p>
                            <Link
                                to="/employer/profile"
                                className="inline-flex items-center space-x-2 bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 border border-white/20"
                            >
                                <span>Update Profile</span>
                                <ArrowRight className="w-3.5 h-3.5" />
                            </Link>
                        </div>
                    </div>
                </div>

                {/* Recent Applications */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-100">
                    <div className="flex items-center justify-between p-5 border-b border-gray-100">
                        <h2 className="text-lg font-bold text-gray-900">Recent Applications</h2>
                        <Link to="/employer/applications" className="text-primary-600 hover:text-primary-700 text-sm font-medium flex items-center space-x-1">
                            <span>View All</span>
                            <ArrowRight className="w-3.5 h-3.5" />
                        </Link>
                    </div>

                    {recentApplications.length === 0 ? (
                        <div className="text-center py-12 px-5">
                            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                <Users className="w-8 h-8 text-gray-400" />
                            </div>
                            <h3 className="font-semibold text-gray-900 mb-1">No applications yet</h3>
                            <p className="text-gray-500 text-sm">Applications will appear here when candidates apply to your jobs</p>
                        </div>
                    ) : (
                        <div className="divide-y divide-gray-50">
                            {recentApplications.map((app, index) => (
                                <div key={index} className="flex items-center justify-between p-4 hover:bg-gray-50/50 transition-colors">
                                    <div className="flex items-center space-x-3 min-w-0">
                                        <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center text-primary-600 font-semibold flex-shrink-0">
                                            {app.jobSeeker?.name?.charAt(0) || 'A'}
                                        </div>
                                        <div className="min-w-0">
                                            <h3 className="font-semibold text-gray-900 text-sm truncate">
                                                {app.jobSeeker?.name || 'Unknown Applicant'}
                                            </h3>
                                            <div className="flex items-center space-x-2 mt-0.5">
                                                <span className="text-xs text-gray-500 truncate">
                                                    {app.job?.title || 'Unknown Position'}
                                                </span>
                                                <span className="text-gray-300">•</span>
                                                <span className="text-xs text-gray-400 flex items-center space-x-1">
                                                    <Calendar className="w-3 h-3" />
                                                    <span>{new Date(app.createdAt).toLocaleDateString()}</span>
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                    <span className={`badge text-xs flex-shrink-0 ml-3 ${getStatusColor(app.status)}`}>
                                        {app.status || 'New'}
                                    </span>
                                </div>
                            ))}
                        </div>
                    )}
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
        case 'shortlisted': return 'bg-purple-100 text-purple-700';
        default: return 'bg-blue-100 text-blue-700';
    }
};

export default EmployerDashboard;
