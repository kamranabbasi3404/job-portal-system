import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Menu, X, Briefcase, User, LogOut, Home, FileText, Bell, Building2 } from 'lucide-react';
import ConfirmationModal from './ConfirmationModal';

const Navbar = ({ user, onLogout }) => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [showLogoutModal, setShowLogoutModal] = useState(false);
    const location = useLocation();
    const navigate = useNavigate();

    const isActive = (path) => location.pathname === path;

    const handleLogout = () => {
        setShowLogoutModal(true);
    };

    const confirmLogout = () => {
        onLogout(navigate);
        setShowLogoutModal(false);
        setIsMenuOpen(false);
    };


    const navLinks = user ? (
        user.role === 'jobseeker' ? [
            { to: '/jobseeker/dashboard', icon: Home, label: 'Dashboard' },
            { to: '/jobs', icon: Briefcase, label: 'Find Jobs' },
            { to: '/companies', icon: Building2, label: 'Companies' },
            { to: '/jobseeker/applications', icon: FileText, label: 'Applications' },
            { to: '/jobseeker/profile', icon: User, label: 'Profile' },
        ] : [
            { to: '/employer/dashboard', icon: Home, label: 'Dashboard' },
            { to: '/employer/post-job', icon: Briefcase, label: 'Post Job' },
            { to: '/employer/manage-jobs', icon: FileText, label: 'Manage Jobs' },
            { to: '/employer/applications', icon: Bell, label: 'Applications' },
        ]
    ) : [];

    return (
        <nav className="bg-white shadow-md sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    {/* Logo */}
                    <Link to="/" className="flex items-center space-x-2">
                        <div className="w-10 h-10 gradient-bg rounded-lg flex items-center justify-center">
                            <Briefcase className="w-6 h-6 text-white" />
                        </div>
                        <span className="text-2xl font-bold bg-gradient-to-r from-primary-600 to-secondary-600 bg-clip-text text-transparent">
                            HireFlow
                        </span>
                    </Link>

                    {/* Desktop Navigation */}
                    <div className="hidden md:flex items-center space-x-1">
                        {user ? (
                            <>
                                {navLinks.map((link) => {
                                    const Icon = link.icon;
                                    return (
                                        <Link
                                            key={link.to}
                                            to={link.to}
                                            className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-200 ${isActive(link.to)
                                                ? 'bg-primary-50 text-primary-600 font-medium'
                                                : 'text-gray-600 hover:bg-gray-50'
                                                }`}
                                        >
                                            <Icon className="w-4 h-4" />
                                            <span>{link.label}</span>
                                        </Link>
                                    );
                                })}
                                <button
                                    onClick={handleLogout}
                                    className="flex items-center space-x-2 px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-all duration-200 ml-2"
                                >
                                    <LogOut className="w-4 h-4" />
                                    <span>Logout</span>
                                </button>
                            </>
                        ) : (
                            <>
                                <Link to="/" className={`px-4 py-2 rounded-lg transition-all duration-200 ${isActive('/') ? 'bg-primary-50 text-primary-600 font-medium' : 'text-gray-600 hover:bg-gray-50'
                                    }`}>
                                    Home
                                </Link>
                                <Link to="/jobs" className={`px-4 py-2 rounded-lg transition-all duration-200 ${isActive('/jobs') ? 'bg-primary-50 text-primary-600 font-medium' : 'text-gray-600 hover:bg-gray-50'
                                    }`}>
                                    Browse Jobs
                                </Link>
                                <Link to="/companies" className={`px-4 py-2 rounded-lg transition-all duration-200 ${isActive('/companies') ? 'bg-primary-50 text-primary-600 font-medium' : 'text-gray-600 hover:bg-gray-50'
                                    }`}>
                                    Companies
                                </Link>
                                <Link to="/login" className="btn-secondary">
                                    Login
                                </Link>
                                <Link to="/register" className="btn-primary">
                                    Sign Up
                                </Link>
                            </>
                        )}
                    </div>

                    {/* Mobile menu button */}
                    <button
                        onClick={() => setIsMenuOpen(!isMenuOpen)}
                        className="md:hidden p-2 rounded-lg text-gray-600 hover:bg-gray-100 transition-colors"
                    >
                        {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                    </button>
                </div>
            </div>

            {/* Mobile Navigation */}
            {isMenuOpen && (
                <div className="md:hidden border-t border-gray-200 bg-white animate-fade-in">
                    <div className="px-4 py-3 space-y-1">
                        {user ? (
                            <>
                                {navLinks.map((link) => {
                                    const Icon = link.icon;
                                    return (
                                        <Link
                                            key={link.to}
                                            to={link.to}
                                            onClick={() => setIsMenuOpen(false)}
                                            className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200 ${isActive(link.to)
                                                ? 'bg-primary-50 text-primary-600 font-medium'
                                                : 'text-gray-600 hover:bg-gray-50'
                                                }`}
                                        >
                                            <Icon className="w-5 h-5" />
                                            <span>{link.label}</span>
                                        </Link>
                                    );
                                })}
                                <button
                                    onClick={() => setShowLogoutModal(true)}
                                    className="w-full flex items-center space-x-3 px-4 py-3 text-red-600 hover:bg-red-50 rounded-lg transition-all duration-200"
                                >
                                    <LogOut className="w-5 h-5" />
                                    <span>Logout</span>
                                </button>
                            </>
                        ) : (
                            <>
                                <Link
                                    to="/"
                                    onClick={() => setIsMenuOpen(false)}
                                    className="block px-4 py-3 rounded-lg text-gray-600 hover:bg-gray-50 transition-colors"
                                >
                                    Home
                                </Link>
                                <Link
                                    to="/jobs"
                                    onClick={() => setIsMenuOpen(false)}
                                    className="block px-4 py-3 rounded-lg text-gray-600 hover:bg-gray-50 transition-colors"
                                >
                                    Browse Jobs
                                </Link>
                                <Link
                                    to="/companies"
                                    onClick={() => setIsMenuOpen(false)}
                                    className="block px-4 py-3 rounded-lg text-gray-600 hover:bg-gray-50 transition-colors"
                                >
                                    Companies
                                </Link>
                                <Link
                                    to="/login"
                                    onClick={() => setIsMenuOpen(false)}
                                    className="block px-4 py-3 rounded-lg text-gray-600 hover:bg-gray-50 transition-colors"
                                >
                                    Login
                                </Link>
                                <Link
                                    to="/register"
                                    onClick={() => setIsMenuOpen(false)}
                                    className="block px-4 py-3 bg-primary-600 text-white rounded-lg text-center font-medium hover:bg-primary-700 transition-colors"
                                >
                                    Sign Up
                                </Link>
                            </>
                        )}
                    </div>
                </div>
            )}

            <ConfirmationModal
                isOpen={showLogoutModal}
                onClose={() => setShowLogoutModal(false)}
                onConfirm={confirmLogout}
                title="Confirm Logout"
                message="Are you sure you want to logout? You will need to login again to access your account."
            />
        </nav>
    );
};

export default Navbar;
