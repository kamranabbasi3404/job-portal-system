import React from 'react';
import { Link } from 'react-router-dom';
import { Search, Briefcase, Users, TrendingUp, ArrowRight, CheckCircle } from 'lucide-react';

const Home = () => {
    const features = [
        {
            icon: Search,
            title: 'Smart Job Search',
            description: 'Find your perfect job with our advanced search and filtering system'
        },
        {
            icon: Briefcase,
            title: 'Top Companies',
            description: 'Access opportunities from leading companies worldwide'
        },
        {
            icon: Users,
            title: 'Build Network',
            description: 'Connect with professionals and expand your career network'
        },
        {
            icon: TrendingUp,
            title: 'Career Growth',
            description: 'Get AI-powered recommendations for career advancement'
        }
    ];

    const stats = [
        { label: 'Active Jobs', value: '10,000+' },
        { label: 'Companies', value: '5,000+' },
        { label: 'Job Seekers', value: '50,000+' },
        { label: 'Success Stories', value: '15,000+' }
    ];

    return (
        <div className="min-h-screen">
            {/* Hero Section */}
            <section className="gradient-bg text-white py-20 lg:py-32">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center max-w-4xl mx-auto">
                        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 animate-fade-in">
                            Find Your Dream Job Today
                        </h1>
                        <p className="text-xl md:text-2xl text-primary-50 mb-8 animate-fade-in">
                            Connect with top employers and discover opportunities that match your skills and aspirations
                        </p>

                        {/* Search Bar */}
                        <div className="bg-white rounded-xl p-2 shadow-2xl max-w-3xl mx-auto flex flex-col sm:flex-row gap-2 animate-fade-in">
                            <input
                                type="text"
                                placeholder="Job title, keywords..."
                                className="flex-1 px-4 py-3 rounded-lg text-gray-900 outline-none"
                            />
                            <input
                                type="text"
                                placeholder="Location"
                                className="flex-1 px-4 py-3 rounded-lg text-gray-900 outline-none"
                            />
                            <button className="bg-primary-600 hover:bg-primary-700 text-white px-8 py-3 rounded-lg font-semibold transition-colors flex items-center justify-center space-x-2">
                                <Search className="w-5 h-5" />
                                <span>Search Jobs</span>
                            </button>
                        </div>

                        <div className="mt-8 flex flex-wrap justify-center gap-4">
                            <Link to="/register" className="bg-white text-primary-600 px-8 py-3 rounded-lg font-semibold hover:bg-primary-50 transition-colors">
                                Get Started
                            </Link>
                            <Link to="/jobs" className="bg-transparent border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-primary-600 transition-all">
                                Browse Jobs
                            </Link>
                        </div>
                    </div>
                </div>
            </section>

            {/* Stats Section */}
            <section className="py-12 bg-white border-b">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
                        {stats.map((stat, index) => (
                            <div key={index} className="text-center">
                                <div className="text-3xl lg:text-4xl font-bold text-primary-600 mb-2">
                                    {stat.value}
                                </div>
                                <div className="text-gray-600 font-medium">{stat.label}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section className="py-20 bg-gray-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                            Why Choose HireFlow?
                        </h2>
                        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                            We provide everything you need to find your perfect career opportunity
                        </p>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {features.map((feature, index) => {
                            const Icon = feature.icon;
                            return (
                                <div key={index} className="card text-center hover:scale-105 transition-transform">
                                    <div className="w-16 h-16 gradient-bg rounded-full flex items-center justify-center mx-auto mb-4">
                                        <Icon className="w-8 h-8 text-white" />
                                    </div>
                                    <h3 className="text-xl font-semibold text-gray-900 mb-3">
                                        {feature.title}
                                    </h3>
                                    <p className="text-gray-600">
                                        {feature.description}
                                    </p>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </section>

            {/* How It Works */}
            <section className="py-20 bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                            How It Works
                        </h2>
                        <p className="text-xl text-gray-600">
                            Get started in just three simple steps
                        </p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-12">
                        <div className="text-center">
                            <div className="w-16 h-16 bg-primary-100 text-primary-600 rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                                1
                            </div>
                            <h3 className="text-xl font-semibold text-gray-900 mb-3">Create Profile</h3>
                            <p className="text-gray-600">
                                Sign up and build your professional profile with your skills and experience
                            </p>
                        </div>

                        <div className="text-center">
                            <div className="w-16 h-16 bg-primary-100 text-primary-600 rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                                2
                            </div>
                            <h3 className="text-xl font-semibold text-gray-900 mb-3">Search & Apply</h3>
                            <p className="text-gray-600">
                                Browse thousands of jobs and apply to positions that match your profile
                            </p>
                        </div>

                        <div className="text-center">
                            <div className="w-16 h-16 bg-primary-100 text-primary-600 rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                                3
                            </div>
                            <h3 className="text-xl font-semibold text-gray-900 mb-3">Get Hired</h3>
                            <p className="text-gray-600">
                                Connect with employers and land your dream job
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-20 gradient-bg text-white">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <h2 className="text-3xl md:text-4xl font-bold mb-6">
                        Ready to Take the Next Step?
                    </h2>
                    <p className="text-xl text-primary-50 mb-8">
                        Join thousands of professionals who found their dream jobs through HireFlow
                    </p>
                    <Link
                        to="/register"
                        className="inline-flex items-center space-x-2 bg-white text-primary-600 px-8 py-4 rounded-lg font-semibold text-lg hover:bg-primary-50 transition-colors"
                    >
                        <span>Create Free Account</span>
                        <ArrowRight className="w-5 h-5" />
                    </Link>
                </div>
            </section>
        </div>
    );
};

export default Home;
