import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Users, Briefcase, FileText, Building2, CheckCircle, Clock, ArrowRight, TrendingUp, Shield, UserCheck, UserPlus } from 'lucide-react';
import AdminLayout from '../../components/admin/AdminLayout';
import Loader from '../../components/common/Loader';
import { getDashboardStats } from '../../services/adminApi';

const Dashboard = () => {
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const adminUser = JSON.parse(localStorage.getItem('adminUser') || '{}');

    useEffect(() => {
        fetchStats();
    }, []);

    const fetchStats = async () => {
        try {
            setLoading(true);
            const data = await getDashboardStats();
            setStats(data);
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to load dashboard stats');
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <AdminLayout>
                <div className="flex flex-col items-center justify-center h-64">
                    <Loader size="large" />
                    <p className="mt-4 text-gray-500 font-medium">Loading dashboard...</p>
                </div>
            </AdminLayout>
        );
    }

    if (error) {
        return (
            <AdminLayout>
                <div className="bg-red-50 border border-red-200 rounded-xl p-5 flex items-center space-x-3">
                    <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center flex-shrink-0">
                        <Shield className="w-5 h-5 text-red-600" />
                    </div>
                    <p className="text-red-700 font-medium">{error}</p>
                </div>
            </AdminLayout>
        );
    }

    const getGreeting = () => {
        const hour = new Date().getHours();
        if (hour < 12) return 'Good Morning';
        if (hour < 17) return 'Good Afternoon';
        return 'Good Evening';
    };

    const statCards = [
        {
            icon: Users,
            label: 'Total Users',
            value: stats?.stats?.totalUsers || 0,
            gradient: 'from-blue-500 to-blue-600',
            link: '/admin/users'
        },
        {
            icon: UserCheck,
            label: 'Job Seekers',
            value: stats?.stats?.totalJobSeekers || 0,
            gradient: 'from-emerald-500 to-green-600',
            link: '/admin/users'
        },
        {
            icon: Building2,
            label: 'Employers',
            value: stats?.stats?.totalEmployers || 0,
            gradient: 'from-purple-500 to-purple-600',
            link: '/admin/users'
        },
        {
            icon: Briefcase,
            label: 'Total Jobs',
            value: stats?.stats?.totalJobs || 0,
            gradient: 'from-amber-500 to-orange-500',
            link: '/admin/jobs'
        },
        {
            icon: CheckCircle,
            label: 'Active Jobs',
            value: stats?.stats?.activeJobs || 0,
            gradient: 'from-teal-500 to-cyan-600',
            link: '/admin/jobs'
        },
        {
            icon: FileText,
            label: 'Applications',
            value: stats?.stats?.totalApplications || 0,
            gradient: 'from-pink-500 to-rose-600',
            link: '/admin/applications'
        }
    ];

    const quickActions = [
        {
            icon: Users,
            title: 'Manage Users',
            description: 'View and manage all users',
            link: '/admin/users',
            color: 'text-blue-600 bg-blue-50 group-hover:bg-blue-100'
        },
        {
            icon: Briefcase,
            title: 'Manage Jobs',
            description: 'Review and moderate job postings',
            link: '/admin/jobs',
            color: 'text-purple-600 bg-purple-50 group-hover:bg-purple-100'
        },
        {
            icon: Building2,
            title: 'Company Requests',
            description: 'Approve or reject company profiles',
            link: '/admin/company-requests',
            color: 'text-emerald-600 bg-emerald-50 group-hover:bg-emerald-100'
        }
    ];

    const getRoleBadge = (role) => {
        switch (role) {
            case 'employer': return 'bg-purple-100 text-purple-700';
            case 'jobseeker': return 'bg-green-100 text-green-700';
            case 'admin': return 'bg-red-100 text-red-700';
            default: return 'bg-gray-100 text-gray-700';
        }
    };

    return (
        <AdminLayout>
            <div className="-m-6">
                {/* Hero Welcome Banner */}
                <div className="bg-gradient-to-r from-primary-600 via-primary-700 to-secondary-600 text-white">
                    <div className="px-6 lg:px-8 py-8 md:py-10">
                        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                            <div>
                                <p className="text-primary-100 text-sm font-medium mb-1">{getGreeting()} 👋</p>
                                <h1 className="text-3xl md:text-4xl font-bold mb-2">
                                    {adminUser?.name || 'Admin'}
                                </h1>
                                <p className="text-primary-100 text-sm md:text-base">
                                    Here's an overview of the platform activity
                                </p>
                            </div>
                            <Link
                                to="/admin/users"
                                className="mt-4 md:mt-0 inline-flex items-center space-x-2 bg-white/15 backdrop-blur-sm hover:bg-white/25 text-white px-5 py-2.5 rounded-lg font-medium transition-all duration-200 border border-white/20"
                            >
                                <UserPlus className="w-4 h-4" />
                                <span>Manage Users</span>
                            </Link>
                        </div>
                    </div>
                </div>

                <div className="px-6 lg:px-8 -mt-6 pb-8">
                    {/* Stats Cards */}
                    <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
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
                        {/* Recent Users - Takes 2 columns */}
                        <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-100">
                            <div className="flex items-center justify-between p-5 border-b border-gray-100">
                                <h2 className="text-lg font-bold text-gray-900">Recent Users</h2>
                                <Link to="/admin/users" className="text-primary-600 hover:text-primary-700 text-sm font-medium flex items-center space-x-1">
                                    <span>View All</span>
                                    <ArrowRight className="w-3.5 h-3.5" />
                                </Link>
                            </div>

                            {!stats?.recentUsers?.length ? (
                                <div className="text-center py-12 px-5">
                                    <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                        <Users className="w-8 h-8 text-gray-400" />
                                    </div>
                                    <h3 className="font-semibold text-gray-900 mb-1">No users yet</h3>
                                    <p className="text-gray-500 text-sm">Users will appear here when they sign up</p>
                                </div>
                            ) : (
                                <div className="divide-y divide-gray-50">
                                    {stats.recentUsers.map((user) => (
                                        <div key={user._id} className="flex items-center justify-between p-4 hover:bg-gray-50/50 transition-colors">
                                            <div className="flex items-center space-x-3 min-w-0">
                                                <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center text-primary-600 font-semibold flex-shrink-0">
                                                    {user.name?.charAt(0)?.toUpperCase() || 'U'}
                                                </div>
                                                <div className="min-w-0">
                                                    <h3 className="font-semibold text-gray-900 text-sm truncate">{user.name}</h3>
                                                    <p className="text-xs text-gray-500 truncate">{user.email}</p>
                                                </div>
                                            </div>
                                            <div className="flex items-center space-x-3 flex-shrink-0 ml-3">
                                                <span className={`badge text-xs ${getRoleBadge(user.role)}`}>
                                                    {user.role}
                                                </span>
                                                <span className="text-xs text-gray-400 hidden sm:block">
                                                    {new Date(user.createdAt).toLocaleDateString()}
                                                </span>
                                            </div>
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

                            {/* Platform Stats Card */}
                            <div className="bg-gradient-to-br from-primary-500 to-secondary-600 rounded-xl shadow-sm p-5 text-white">
                                <div className="flex items-center space-x-2 mb-3">
                                    <TrendingUp className="w-5 h-5" />
                                    <h3 className="font-bold">Platform Overview</h3>
                                </div>
                                <p className="text-sm text-primary-100 mb-4">
                                    Monitor platform health, review company profiles, and manage user accounts to keep everything running smoothly.
                                </p>
                                <Link
                                    to="/admin/company-requests"
                                    className="inline-flex items-center space-x-2 bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 border border-white/20"
                                >
                                    <span>Review Requests</span>
                                    <ArrowRight className="w-3.5 h-3.5" />
                                </Link>
                            </div>
                        </div>
                    </div>

                    {/* Recent Jobs */}
                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 mb-8">
                        <div className="flex items-center justify-between p-5 border-b border-gray-100">
                            <h2 className="text-lg font-bold text-gray-900">Recent Jobs</h2>
                            <Link to="/admin/jobs" className="text-primary-600 hover:text-primary-700 text-sm font-medium flex items-center space-x-1">
                                <span>View All</span>
                                <ArrowRight className="w-3.5 h-3.5" />
                            </Link>
                        </div>

                        {!stats?.recentJobs?.length ? (
                            <div className="text-center py-12 px-5">
                                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <Briefcase className="w-8 h-8 text-gray-400" />
                                </div>
                                <h3 className="font-semibold text-gray-900 mb-1">No jobs posted yet</h3>
                                <p className="text-gray-500 text-sm">Jobs will appear here when employers post them</p>
                            </div>
                        ) : (
                            <div className="divide-y divide-gray-50">
                                {stats.recentJobs.map((job) => (
                                    <div key={job._id} className="flex items-center justify-between p-4 hover:bg-gray-50/50 transition-colors">
                                        <div className="flex items-center space-x-3 min-w-0">
                                            <div className="w-10 h-10 bg-amber-50 rounded-lg flex items-center justify-center flex-shrink-0">
                                                <Briefcase className="w-5 h-5 text-amber-600" />
                                            </div>
                                            <div className="min-w-0">
                                                <h3 className="font-semibold text-gray-900 text-sm truncate">{job.title}</h3>
                                                <div className="flex items-center space-x-2 mt-0.5">
                                                    <span className="text-xs text-gray-500 truncate">
                                                        {job.currentCompanyName || job.company}
                                                    </span>
                                                    <span className="text-gray-300">•</span>
                                                    <span className="text-xs text-gray-400">
                                                        {job.employer?.name}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="flex items-center space-x-3 flex-shrink-0 ml-3">
                                            <span className={`badge text-xs ${job.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'}`}>
                                                {job.status}
                                            </span>
                                            <span className="text-xs text-gray-400 hidden sm:block">
                                                {new Date(job.createdAt).toLocaleDateString()}
                                            </span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Application Status Breakdown */}
                    {stats?.applicationStats && stats.applicationStats.length > 0 && (
                        <div className="bg-white rounded-xl shadow-sm border border-gray-100">
                            <div className="p-5 border-b border-gray-100">
                                <h2 className="text-lg font-bold text-gray-900">Application Status Breakdown</h2>
                            </div>
                            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 p-5">
                                {stats.applicationStats.map((stat) => (
                                    <div key={stat._id} className="bg-gray-50 rounded-xl p-4 text-center hover:bg-gray-100 transition-colors">
                                        <p className="text-2xl font-bold bg-gradient-to-r from-primary-600 to-secondary-600 bg-clip-text text-transparent">
                                            {stat.count}
                                        </p>
                                        <p className="text-xs text-gray-600 mt-1 capitalize font-medium">
                                            {stat._id.replace('_', ' ')}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </AdminLayout>
    );
};

export default Dashboard;
