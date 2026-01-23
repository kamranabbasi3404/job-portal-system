import React, { useState } from 'react';
import { MapPin, Briefcase, Clock, DollarSign, Building2, Heart } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';

const JobCard = ({ job, isSaved: initialSaved = false, onSaveToggle }) => {
    const { user } = useAuth();
    const [isSaved, setIsSaved] = useState(initialSaved);
    const [saving, setSaving] = useState(false);

    const handleSaveToggle = async (e) => {
        e.preventDefault();
        e.stopPropagation();

        if (!user) {
            alert('Please login to save jobs');
            return;
        }

        if (user.role !== 'jobseeker') {
            return;
        }

        setSaving(true);
        try {
            if (isSaved) {
                await api.delete(`/api/saved-jobs/${job._id}`);
                setIsSaved(false);
            } else {
                await api.post(`/api/saved-jobs/${job._id}`);
                setIsSaved(true);
            }

            // Notify parent component if callback provided
            if (onSaveToggle) {
                onSaveToggle(job._id, !isSaved);
            }
        } catch (error) {
            console.error('Error toggling save:', error);
            alert(error.response?.data?.message || 'Failed to save job');
        } finally {
            setSaving(false);
        }
    };

    const getJobTypeBadgeColor = (type) => {
        switch (type?.toLowerCase()) {
            case 'full-time':
                return 'bg-green-100 text-green-700';
            case 'part-time':
                return 'bg-blue-100 text-blue-700';
            case 'contract':
                return 'bg-purple-100 text-purple-700';
            case 'internship':
                return 'bg-orange-100 text-orange-700';
            default:
                return 'bg-gray-100 text-gray-700';
        }
    };

    const formatSalary = (salary) => {
        if (!salary) return 'Negotiable';
        return `$${salary.min?.toLocaleString()} - $${salary.max?.toLocaleString()}`;
    };

    const getTimeAgo = (date) => {
        const now = new Date();
        const posted = new Date(date);
        const diffTime = Math.abs(now - posted);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

        if (diffDays === 0) return 'Today';
        if (diffDays === 1) return 'Yesterday';
        if (diffDays < 7) return `${diffDays} days ago`;
        if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
        return `${Math.floor(diffDays / 30)} months ago`;
    };

    return (
        <div className="card group hover:border-primary-200 border border-transparent cursor-pointer relative">
            <div className="flex items-start justify-between mb-4">
                <div className="flex items-start space-x-4">
                    <div className="w-14 h-14 bg-gradient-to-br from-primary-400 to-secondary-500 rounded-lg flex items-center justify-center flex-shrink-0">
                        <Building2 className="w-7 h-7 text-white" />
                    </div>
                    <div className="flex-1">
                        <Link to={`/jobs/${job._id}`} className="group">
                            <h3 className="text-lg font-semibold text-gray-900 group-hover:text-primary-600 transition-colors mb-1">
                                {job.title}
                            </h3>
                        </Link>
                        <p className="text-gray-600 font-medium">{job.company || 'Company Name'}</p>
                    </div>
                </div>
                <span className={`badge ${getJobTypeBadgeColor(job.type)} whitespace-nowrap`}>
                    {job.type}
                </span>
            </div>

            <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                {job.description}
            </p>

            <div className="grid grid-cols-2 gap-3 mb-4">
                <div className="flex items-center space-x-2 text-sm text-gray-600">
                    <MapPin className="w-4 h-4 text-gray-400" />
                    <span>{job.location}</span>
                </div>
                <div className="flex items-center space-x-2 text-sm text-gray-600">
                    <DollarSign className="w-4 h-4 text-gray-400" />
                    <span>{formatSalary(job.salary)}</span>
                </div>
                <div className="flex items-center space-x-2 text-sm text-gray-600">
                    <Briefcase className="w-4 h-4 text-gray-400" />
                    <span>{job.experience || 'Not specified'}</span>
                </div>
                <div className="flex items-center space-x-2 text-sm text-gray-600">
                    <Clock className="w-4 h-4 text-gray-400" />
                    <span>{getTimeAgo(job.createdAt)}</span>
                </div>
            </div>

            {job.skills && job.skills.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-4">
                    {job.skills.slice(0, 3).map((skill, index) => (
                        <span key={index} className="badge bg-primary-50 text-primary-700 text-xs">
                            {skill}
                        </span>
                    ))}
                    {job.skills.length > 3 && (
                        <span className="badge bg-gray-100 text-gray-600 text-xs">
                            +{job.skills.length - 3} more
                        </span>
                    )}
                </div>
            )}

            <div className="pt-4 border-t border-gray-100">
                <Link
                    to={`/jobs/${job._id}`}
                    className="btn-primary w-full text-center"
                >
                    View Details
                </Link>
            </div>
        </div>
    );
};

export default JobCard;
