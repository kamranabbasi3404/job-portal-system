import React from 'react';
import { X, Mail, Phone, MapPin, Briefcase, GraduationCap, Award, Link as LinkIcon, Github, Linkedin } from 'lucide-react';

const ProfileModal = ({ profile, onClose }) => {
    if (!profile) return null;

    const user = profile.user || {};

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
                {/* Header */}
                <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
                    <h2 className="text-2xl font-bold text-gray-900">{user.name}'s Profile</h2>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                        <X className="w-5 h-5 text-gray-500" />
                    </button>
                </div>

                <div className="p-6 space-y-6">
                    {/* Contact Information */}
                    <div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-3">Contact Information</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            {user.email && (
                                <div className="flex items-center space-x-2 text-gray-600">
                                    <Mail className="w-4 h-4 text-gray-400" />
                                    <span>{user.email}</span>
                                </div>
                            )}
                            {(profile.phone || user.phone) && (
                                <div className="flex items-center space-x-2 text-gray-600">
                                    <Phone className="w-4 h-4 text-gray-400" />
                                    <span>{profile.phone || user.phone}</span>
                                </div>
                            )}
                            {profile.location && (
                                <div className="flex items-center space-x-2 text-gray-600">
                                    <MapPin className="w-4 h-4 text-gray-400" />
                                    <span>{profile.location}</span>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Social Links */}
                    {(profile.website || profile.linkedin || profile.github) && (
                        <div>
                            <h3 className="text-lg font-semibold text-gray-900 mb-3">Links</h3>
                            <div className="flex flex-wrap gap-2">
                                {profile.website && (
                                    <a
                                        href={profile.website}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex items-center space-x-1 px-3 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg text-sm text-gray-700 transition-colors"
                                    >
                                        <LinkIcon className="w-4 h-4" />
                                        <span>Website</span>
                                    </a>
                                )}
                                {profile.linkedin && (
                                    <a
                                        href={profile.linkedin}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex items-center space-x-1 px-3 py-2 bg-blue-100 hover:bg-blue-200 rounded-lg text-sm text-blue-700 transition-colors"
                                    >
                                        <Linkedin className="w-4 h-4" />
                                        <span>LinkedIn</span>
                                    </a>
                                )}
                                {profile.github && (
                                    <a
                                        href={profile.github}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex items-center space-x-1 px-3 py-2 bg-gray-800 hover:bg-gray-900 rounded-lg text-sm text-white transition-colors"
                                    >
                                        <Github className="w-4 h-4" />
                                        <span>GitHub</span>
                                    </a>
                                )}
                            </div>
                        </div>
                    )}

                    {/* About */}
                    {profile.about && (
                        <div>
                            <h3 className="text-lg font-semibold text-gray-900 mb-3">About</h3>
                            <p className="text-gray-700">{profile.about}</p>
                        </div>
                    )}

                    {/* Skills */}
                    {profile.skills && profile.skills.length > 0 && (
                        <div>
                            <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
                                <Award className="w-5 h-5 mr-2 text-primary-600" />
                                Skills
                            </h3>
                            <div className="flex flex-wrap gap-2">
                                {profile.skills.map((skill, index) => (
                                    <span
                                        key={index}
                                        className="px-3 py-1 bg-primary-50 text-primary-700 rounded-full text-sm font-medium"
                                    >
                                        {skill.name || skill}
                                        {skill.level && ` - ${skill.level}`}
                                    </span>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Experience */}
                    {profile.experience && profile.experience.length > 0 && (
                        <div>
                            <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
                                <Briefcase className="w-5 h-5 mr-2 text-primary-600" />
                                Experience
                            </h3>
                            <div className="space-y-4">
                                {profile.experience.map((exp, index) => (
                                    <div key={index} className="border-l-2 border-primary-200 pl-4">
                                        <h4 className="font-semibold text-gray-900">{exp.title}</h4>
                                        <p className="text-gray-600">{exp.company}</p>
                                        {exp.location && (
                                            <p className="text-sm text-gray-500">{exp.location}</p>
                                        )}
                                        {(exp.startDate || exp.endDate) && (
                                            <p className="text-sm text-gray-500 mt-1">
                                                {exp.startDate && new Date(exp.startDate).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
                                                {' - '}
                                                {exp.current ? 'Present' : exp.endDate && new Date(exp.endDate).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
                                            </p>
                                        )}
                                        {exp.description && (
                                            <p className="text-gray-700 mt-2 text-sm">{exp.description}</p>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Education */}
                    {profile.education && profile.education.length > 0 && (
                        <div>
                            <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
                                <GraduationCap className="w-5 h-5 mr-2 text-primary-600" />
                                Education
                            </h3>
                            <div className="space-y-4">
                                {profile.education.map((edu, index) => (
                                    <div key={index} className="border-l-2 border-primary-200 pl-4">
                                        <h4 className="font-semibold text-gray-900">{edu.degree}</h4>
                                        <p className="text-gray-600">{edu.school}</p>
                                        {edu.field && (
                                            <p className="text-sm text-gray-500">{edu.field}</p>
                                        )}
                                        {(edu.startDate || edu.endDate) && (
                                            <p className="text-sm text-gray-500 mt-1">
                                                {edu.startDate && new Date(edu.startDate).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
                                                {' - '}
                                                {edu.current ? 'Present' : edu.endDate && new Date(edu.endDate).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
                                            </p>
                                        )}
                                        {edu.description && (
                                            <p className="text-gray-700 mt-2 text-sm">{edu.description}</p>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Resume */}
                    {profile.resume && (
                        <div>
                            <h3 className="text-lg font-semibold text-gray-900 mb-3">Resume</h3>
                            <a
                                href={`http://localhost:5000${profile.resume}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="btn-primary inline-block"
                            >
                                Download Resume
                            </a>
                        </div>
                    )}

                    {/* Empty State */}
                    {!profile.about && (!profile.skills || profile.skills.length === 0) &&
                        (!profile.experience || profile.experience.length === 0) &&
                        (!profile.education || profile.education.length === 0) && (
                            <div className="text-center py-8">
                                <p className="text-gray-500">This user hasn't completed their profile yet.</p>
                            </div>
                        )}
                </div>

                {/* Footer */}
                <div className="border-t border-gray-200 px-6 py-4 bg-gray-50">
                    <button onClick={onClose} className="btn-secondary w-full sm:w-auto">
                        Close
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ProfileModal;
