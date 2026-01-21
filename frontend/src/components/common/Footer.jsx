import React from 'react';
import { Link } from 'react-router-dom';
import { Facebook, Twitter, Linkedin, Instagram, Mail, Phone, MapPin } from 'lucide-react';

const Footer = () => {
    return (
        <footer className="bg-gray-900 text-gray-300">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {/* About Section */}
                    <div>
                        <h3 className="text-white text-lg font-bold mb-4">JobPortal</h3>
                        <p className="text-sm text-gray-400 mb-4">
                            Connect talented professionals with amazing opportunities. Your dream job is just a click away.
                        </p>
                        <div className="flex space-x-3">
                            <a href="#" className="w-9 h-9 bg-gray-800 hover:bg-primary-600 rounded-full flex items-center justify-center transition-colors">
                                <Facebook className="w-4 h-4" />
                            </a>
                            <a href="#" className="w-9 h-9 bg-gray-800 hover:bg-primary-600 rounded-full flex items-center justify-center transition-colors">
                                <Twitter className="w-4 h-4" />
                            </a>
                            <a href="#" className="w-9 h-9 bg-gray-800 hover:bg-primary-600 rounded-full flex items-center justify-center transition-colors">
                                <Linkedin className="w-4 h-4" />
                            </a>
                            <a href="#" className="w-9 h-9 bg-gray-800 hover:bg-primary-600 rounded-full flex items-center justify-center transition-colors">
                                <Instagram className="w-4 h-4" />
                            </a>
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h3 className="text-white text-lg font-semibold mb-4">For Job Seekers</h3>
                        <ul className="space-y-2 text-sm">
                            <li><Link to="/jobs" className="hover:text-primary-400 transition-colors">Browse Jobs</Link></li>
                            <li><Link to="/register" className="hover:text-primary-400 transition-colors">Create Account</Link></li>
                            <li><Link to="/jobseeker/profile" className="hover:text-primary-400 transition-colors">My Profile</Link></li>
                            <li><Link to="/jobseeker/applications" className="hover:text-primary-400 transition-colors">My Applications</Link></li>
                        </ul>
                    </div>

                    {/* Employers */}
                    <div>
                        <h3 className="text-white text-lg font-semibold mb-4">For Employers</h3>
                        <ul className="space-y-2 text-sm">
                            <li><Link to="/employer/post-job" className="hover:text-primary-400 transition-colors">Post a Job</Link></li>
                            <li><Link to="/employer/dashboard" className="hover:text-primary-400 transition-colors">Employer Dashboard</Link></li>
                            <li><Link to="/employer/manage-jobs" className="hover:text-primary-400 transition-colors">Manage Jobs</Link></li>
                            <li><Link to="/register" className="hover:text-primary-400 transition-colors">Sign Up</Link></li>
                        </ul>
                    </div>

                    {/* Contact */}
                    <div>
                        <h3 className="text-white text-lg font-semibold mb-4">Contact Us</h3>
                        <ul className="space-y-3 text-sm">
                            <li className="flex items-start space-x-3">
                                <MapPin className="w-4 h-4 mt-1 flex-shrink-0 text-primary-400" />
                                <span>123 Job Street, Career City, CC 12345</span>
                            </li>
                            <li className="flex items-center space-x-3">
                                <Phone className="w-4 h-4 flex-shrink-0 text-primary-400" />
                                <span>+1 (555) 123-4567</span>
                            </li>
                            <li className="flex items-center space-x-3">
                                <Mail className="w-4 h-4 flex-shrink-0 text-primary-400" />
                                <span>contact@jobportal.com</span>
                            </li>
                        </ul>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="border-t border-gray-800 mt-8 pt-8 text-sm text-center text-gray-400">
                    <p>&copy; {new Date().getFullYear()} JobPortal. All rights reserved.</p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
