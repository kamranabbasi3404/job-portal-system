import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { LayoutDashboard, Users, Briefcase, FileText, Building2, ChevronLeft, ChevronRight, LogOut } from 'lucide-react';
import logo from '../../assets/logo.jpg';

const AdminLayout = ({ children }) => {
    const location = useLocation();
    const navigate = useNavigate();
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const adminUser = JSON.parse(localStorage.getItem('adminUser') || '{}');

    const handleLogout = () => {
        localStorage.removeItem('adminToken');
        localStorage.removeItem('adminUser');
        navigate('/admin/login');
    };

    const navItems = [
        { path: '/admin/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
        { path: '/admin/users', icon: Users, label: 'Users' },
        { path: '/admin/jobs', icon: Briefcase, label: 'Jobs' },
        { path: '/admin/applications', icon: FileText, label: 'Applications' },
        { path: '/admin/company-requests', icon: Building2, label: 'Company Requests' },
    ];

    return (
        <div className="min-h-screen bg-gray-50 flex">
            {/* Sidebar - Sticky */}
            <aside className={`sticky top-0 h-screen bg-gradient-to-b from-slate-800 to-slate-900 text-white transition-all duration-300 flex flex-col ${isSidebarOpen ? 'w-64' : 'w-20'}`}>
                {/* Logo Area */}
                <div className="p-4 border-b border-white/10">
                    <div className="flex items-center justify-between">
                        {isSidebarOpen ? (
                            <div className="flex items-center space-x-2">
                                <img src={logo} alt="HireFlow" className="w-8 h-8 rounded-lg object-cover" />
                                <h1 className="text-lg font-bold text-white">
                                    HireFlow
                                </h1>
                            </div>
                        ) : (
                            <img src={logo} alt="HireFlow" className="w-8 h-8 rounded-lg object-cover" />
                        )}
                        <button
                            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                            className="p-2 rounded-lg hover:bg-white/10 text-slate-400 transition-colors"
                        >
                            {isSidebarOpen ? <ChevronLeft className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                        </button>
                    </div>
                </div>

                {/* Nav Items */}
                <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
                    {navItems.map((item) => {
                        const Icon = item.icon;
                        const isActive = location.pathname === item.path;
                        return (
                            <Link
                                key={item.path}
                                to={item.path}
                                className={`flex items-center space-x-3 px-3 py-2.5 rounded-lg transition-all duration-200 ${isActive
                                    ? 'bg-blue-500/20 text-white font-medium'
                                    : 'text-slate-400 hover:bg-white/10 hover:text-white'
                                    }`}
                            >
                                <Icon className={`w-5 h-5 flex-shrink-0 ${isActive ? 'text-blue-400' : 'text-slate-500'}`} />
                                {isSidebarOpen && <span className="text-sm">{item.label}</span>}
                            </Link>
                        );
                    })}
                </nav>

                {/* User Info + Logout at Bottom */}
                <div className="p-3 border-t border-white/10">
                    {isSidebarOpen && (
                        <div className="px-3 py-2 mb-2">
                            <p className="text-sm font-medium text-white truncate">{adminUser.name}</p>
                            <p className="text-xs text-slate-400 truncate">{adminUser.email}</p>
                        </div>
                    )}
                    <button
                        onClick={handleLogout}
                        className="flex items-center space-x-3 w-full px-3 py-2.5 rounded-lg text-red-400 hover:bg-red-500/15 transition-all duration-200"
                    >
                        <LogOut className="w-5 h-5 flex-shrink-0" />
                        {isSidebarOpen && <span className="text-sm font-medium">Logout</span>}
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <div className="flex-1 flex flex-col min-h-screen overflow-auto">
                {/* Header */}
                <header className="sticky top-0 z-10 bg-white/80 backdrop-blur-md border-b border-gray-200">
                    <div className="px-6 py-4 flex items-center justify-between">
                        <h2 className="text-xl font-bold text-gray-900">
                            {navItems.find(item => item.path === location.pathname)?.label || 'Admin Panel'}
                        </h2>
                        <div className="flex items-center space-x-3">
                            <div className="text-right hidden sm:block">
                                <p className="text-sm font-medium text-gray-700">{adminUser.name}</p>
                                <p className="text-xs text-gray-500">{adminUser.email}</p>
                            </div>
                            <div className="w-9 h-9 bg-primary-100 rounded-full flex items-center justify-center text-primary-600 font-semibold text-sm">
                                {adminUser.name?.charAt(0)?.toUpperCase() || 'A'}
                            </div>
                        </div>
                    </div>
                </header>

                {/* Page Content */}
                <main className="flex-1 p-6">
                    {children}
                </main>
            </div>
        </div>
    );
};

export default AdminLayout;
