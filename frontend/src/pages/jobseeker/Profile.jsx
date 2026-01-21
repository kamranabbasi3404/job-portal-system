import React, { useState, useEffect } from 'react';
import { Edit2, Plus, Trash2, Briefcase, GraduationCap, Code, FileText, Save, X } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';
import Loader from '../../components/common/Loader';

const Profile = () => {
    const { user } = useAuth();
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [editing, setEditing] = useState({});
    const [formData, setFormData] = useState({});

    useEffect(() => {
        fetchProfile();
    }, []);

    const fetchProfile = async () => {
        try {
            const response = await api.get('/api/profile/me');
            setProfile(response.data);
            setFormData(response.data);
        } catch (error) {
            console.error('Error fetching profile:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async (section) => {
        try {
            const response = await api.put('/api/profile/me', formData);
            setProfile(response.data);
            setEditing({ ...editing, [section]: false });
        } catch (error) {
            console.error('Error saving profile:', error);
            alert('Failed to save changes');
        }
    };

    const handleCancel = (section) => {
        setFormData(profile);
        setEditing({ ...editing, [section]: false });
    };

    const addSkill = () => {
        const newSkills = [...(formData.skills || []), { name: '', level: 'intermediate' }];
        setFormData({ ...formData, skills: newSkills });
    };

    const removeSkill = (index) => {
        const newSkills = formData.skills.filter((_, i) => i !== index);
        setFormData({ ...formData, skills: newSkills });
    };

    const updateSkill = (index, field, value) => {
        const newSkills = [...formData.skills];
        newSkills[index][field] = value;
        setFormData({ ...formData, skills: newSkills });
    };

    const addExperience = () => {
        const newExp = [...(formData.experience || []), {
            title: '',
            company: '',
            location: '',
            startDate: '',
            endDate: '',
            current: false,
            description: ''
        }];
        setFormData({ ...formData, experience: newExp });
    };

    const removeExperience = (index) => {
        const newExp = formData.experience.filter((_, i) => i !== index);
        setFormData({ ...formData, experience: newExp });
    };

    const updateExperience = (index, field, value) => {
        const newExp = [...formData.experience];
        newExp[index][field] = value;
        setFormData({ ...formData, experience: newExp });
    };

    const addEducation = () => {
        const newEdu = [...(formData.education || []), {
            degree: '',
            school: '',
            field: '',
            startDate: '',
            endDate: '',
            current: false,
            description: ''
        }];
        setFormData({ ...formData, education: newEdu });
    };

    const removeEducation = (index) => {
        const newEdu = formData.education.filter((_, i) => i !== index);
        setFormData({ ...formData, education: newEdu });
    };

    const updateEducation = (index, field, value) => {
        const newEdu = [...formData.education];
        newEdu[index][field] = value;
        setFormData({ ...formData, education: newEdu });
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <Loader size="large" />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="card mb-6">
                    <div className="flex items-center space-x-4">
                        <div className="w-20 h-20 bg-gradient-to-br from-primary-500 to-secondary-600 rounded-full flex items-center justify-center text-white text-3xl font-bold">
                            {user?.name?.charAt(0).toUpperCase()}
                        </div>
                        <div className="flex-1">
                            <h1 className="text-3xl font-bold text-gray-900">{user?.name}</h1>
                            <p className="text-gray-600">{user?.email}</p>
                            <p className="text-sm text-gray-500 mt-1">Job Seeker</p>
                        </div>
                    </div>
                </div>

                {/* About Me */}
                <div className="card mb-6">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-2xl font-bold text-gray-900">About Me</h2>
                        {editing.about ? (
                            <div className="flex space-x-2">
                                <button onClick={() => handleSave('about')} className="btn-primary flex items-center space-x-1">
                                    <Save className="w-4 h-4" />
                                    <span>Save</span>
                                </button>
                                <button onClick={() => handleCancel('about')} className="btn-secondary flex items-center space-x-1">
                                    <X className="w-4 h-4" />
                                    <span>Cancel</span>
                                </button>
                            </div>
                        ) : (
                            <button onClick={() => setEditing({ ...editing, about: true })} className="text-primary-600 hover:text-primary-700">
                                <Edit2 className="w-5 h-5" />
                            </button>
                        )}
                    </div>
                    {editing.about ? (
                        <textarea
                            value={formData.about || ''}
                            onChange={(e) => setFormData({ ...formData, about: e.target.value })}
                            rows="4"
                            className="input-field"
                            placeholder="Tell us about yourself..."
                        />
                    ) : (
                        <p className="text-gray-700">{profile?.about || 'No information added yet. Click edit to add your bio.'}</p>
                    )}
                </div>

                {/* Skills */}
                <div className="card mb-6">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-2xl font-bold text-gray-900 flex items-center space-x-2">
                            <Code className="w-6 h-6" />
                            <span>Skills</span>
                        </h2>
                        {editing.skills ? (
                            <div className="flex space-x-2">
                                <button onClick={() => handleSave('skills')} className="btn-primary flex items-center space-x-1">
                                    <Save className="w-4 h-4" />
                                    <span>Save</span>
                                </button>
                                <button onClick={() => handleCancel('skills')} className="btn-secondary flex items-center space-x-1">
                                    <X className="w-4 h-4" />
                                    <span>Cancel</span>
                                </button>
                            </div>
                        ) : (
                            <button onClick={() => setEditing({ ...editing, skills: true })} className="text-primary-600 hover:text-primary-700">
                                <Edit2 className="w-5 h-5" />
                            </button>
                        )}
                    </div>

                    {editing.skills ? (
                        <div className="space-y-3">
                            {(formData.skills || []).map((skill, index) => (
                                <div key={index} className="flex space-x-2">
                                    <input
                                        type="text"
                                        value={skill.name}
                                        onChange={(e) => updateSkill(index, 'name', e.target.value)}
                                        placeholder="Skill name"
                                        className="input-field flex-1"
                                    />
                                    <select
                                        value={skill.level}
                                        onChange={(e) => updateSkill(index, 'level', e.target.value)}
                                        className="input-field w-40"
                                    >
                                        <option value="beginner">Beginner</option>
                                        <option value="intermediate">Intermediate</option>
                                        <option value="advanced">Advanced</option>
                                        <option value="expert">Expert</option>
                                    </select>
                                    <button onClick={() => removeSkill(index)} className="text-red-600 hover:text-red-700">
                                        <Trash2 className="w-5 h-5" />
                                    </button>
                                </div>
                            ))}
                            <button onClick={addSkill} className="btn-outline flex items-center space-x-2">
                                <Plus className="w-4 h-4" />
                                <span>Add Skill</span>
                            </button>
                        </div>
                    ) : (
                        <div className="flex flex-wrap gap-2">
                            {(profile?.skills || []).length === 0 ? (
                                <p className="text-gray-500">No skills added yet. Click edit to add your skills.</p>
                            ) : (
                                profile?.skills?.map((skill, index) => (
                                    <span key={index} className="badge bg-primary-100 text-primary-700">
                                        {skill.name} - {skill.level}
                                    </span>
                                ))
                            )}
                        </div>
                    )}
                </div>

                {/* Experience */}
                <div className="card mb-6">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-2xl font-bold text-gray-900 flex items-center space-x-2">
                            <Briefcase className="w-6 h-6" />
                            <span>Work Experience</span>
                        </h2>
                        {editing.experience ? (
                            <div className="flex space-x-2">
                                <button onClick={() => handleSave('experience')} className="btn-primary flex items-center space-x-1">
                                    <Save className="w-4 h-4" />
                                    <span>Save</span>
                                </button>
                                <button onClick={() => handleCancel('experience')} className="btn-secondary flex items-center space-x-1">
                                    <X className="w-4 h-4" />
                                    <span>Cancel</span>
                                </button>
                            </div>
                        ) : (
                            <button onClick={() => setEditing({ ...editing, experience: true })} className="text-primary-600 hover:text-primary-700">
                                <Edit2 className="w-5 h-5" />
                            </button>
                        )}
                    </div>

                    {editing.experience ? (
                        <div className="space-y-4">
                            {(formData.experience || []).map((exp, index) => (
                                <div key={index} className="border border-gray-200 rounded-lg p-4 space-y-3">
                                    <div className="flex justify-between items-start">
                                        <h4 className="font-semibold text-gray-700">Experience #{index + 1}</h4>
                                        <button onClick={() => removeExperience(index)} className="text-red-600 hover:text-red-700">
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </div>
                                    <input
                                        type="text"
                                        value={exp.title}
                                        onChange={(e) => updateExperience(index, 'title', e.target.value)}
                                        placeholder="Job Title"
                                        className="input-field"
                                    />
                                    <input
                                        type="text"
                                        value={exp.company}
                                        onChange={(e) => updateExperience(index, 'company', e.target.value)}
                                        placeholder="Company Name"
                                        className="input-field"
                                    />
                                    <input
                                        type="text"
                                        value={exp.location}
                                        onChange={(e) => updateExperience(index, 'location', e.target.value)}
                                        placeholder="Location"
                                        className="input-field"
                                    />
                                    <div className="grid grid-cols-2 gap-3">
                                        <input
                                            type="month"
                                            value={exp.startDate?.substring(0, 7) || ''}
                                            onChange={(e) => updateExperience(index, 'startDate', e.target.value)}
                                            placeholder="Start Date"
                                            className="input-field"
                                        />
                                        <input
                                            type="month"
                                            value={exp.endDate?.substring(0, 7) || ''}
                                            onChange={(e) => updateExperience(index, 'endDate', e.target.value)}
                                            placeholder="End Date"
                                            disabled={exp.current}
                                            className="input-field"
                                        />
                                    </div>
                                    <label className="flex items-center space-x-2">
                                        <input
                                            type="checkbox"
                                            checked={exp.current || false}
                                            onChange={(e) => updateExperience(index, 'current', e.target.checked)}
                                            className="rounded"
                                        />
                                        <span className="text-sm text-gray-700">Currently working here</span>
                                    </label>
                                    <textarea
                                        value={exp.description}
                                        onChange={(e) => updateExperience(index, 'description', e.target.value)}
                                        placeholder="Description"
                                        rows="3"
                                        className="input-field"
                                    />
                                </div>
                            ))}
                            <button onClick={addExperience} className="btn-outline flex items-center space-x-2 w-full justify-center">
                                <Plus className="w-4 h-4" />
                                <span>Add Experience</span>
                            </button>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {(profile?.experience || []).length === 0 ? (
                                <p className="text-gray-500">No experience added yet. Click edit to add your work experience.</p>
                            ) : (
                                profile?.experience?.map((exp, index) => (
                                    <div key={index} className="border-l-4 border-primary-600 pl-4 py-2">
                                        <h3 className="font-semibold text-gray-900">{exp.title}</h3>
                                        <p className="text-gray-700">{exp.company} • {exp.location}</p>
                                        <p className="text-sm text-gray-500">
                                            {new Date(exp.startDate).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })} -
                                            {exp.current ? ' Present' : ` ${new Date(exp.endDate).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}`}
                                        </p>
                                        {exp.description && <p className="text-gray-600 mt-2">{exp.description}</p>}
                                    </div>
                                ))
                            )}
                        </div>
                    )}
                </div>

                {/* Education */}
                <div className="card">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-2xl font-bold text-gray-900 flex items-center space-x-2">
                            <GraduationCap className="w-6 h-6" />
                            <span>Education</span>
                        </h2>
                        {editing.education ? (
                            <div className="flex space-x-2">
                                <button onClick={() => handleSave('education')} className="btn-primary flex items-center space-x-1">
                                    <Save className="w-4 h-4" />
                                    <span>Save</span>
                                </button>
                                <button onClick={() => handleCancel('education')} className="btn-secondary flex items-center space-x-1">
                                    <X className="w-4 h-4" />
                                    <span>Cancel</span>
                                </button>
                            </div>
                        ) : (
                            <button onClick={() => setEditing({ ...editing, education: true })} className="text-primary-600 hover:text-primary-700">
                                <Edit2 className="w-5 h-5" />
                            </button>
                        )}
                    </div>

                    {editing.education ? (
                        <div className="space-y-4">
                            {(formData.education || []).map((edu, index) => (
                                <div key={index} className="border border-gray-200 rounded-lg p-4 space-y-3">
                                    <div className="flex justify-between items-start">
                                        <h4 className="font-semibold text-gray-700">Education #{index + 1}</h4>
                                        <button onClick={() => removeEducation(index)} className="text-red-600 hover:text-red-700">
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </div>
                                    <input
                                        type="text"
                                        value={edu.degree}
                                        onChange={(e) => updateEducation(index, 'degree', e.target.value)}
                                        placeholder="Degree"
                                        className="input-field"
                                    />
                                    <input
                                        type="text"
                                        value={edu.school}
                                        onChange={(e) => updateEducation(index, 'school', e.target.value)}
                                        placeholder="School/University"
                                        className="input-field"
                                    />
                                    <input
                                        type="text"
                                        value={edu.field}
                                        onChange={(e) => updateEducation(index, 'field', e.target.value)}
                                        placeholder="Field of Study"
                                        className="input-field"
                                    />
                                    <div className="grid grid-cols-2 gap-3">
                                        <input
                                            type="month"
                                            value={edu.startDate?.substring(0, 7) || ''}
                                            onChange={(e) => updateEducation(index, 'startDate', e.target.value)}
                                            placeholder="Start Date"
                                            className="input-field"
                                        />
                                        <input
                                            type="month"
                                            value={edu.endDate?.substring(0, 7) || ''}
                                            onChange={(e) => updateEducation(index, 'endDate', e.target.value)}
                                            placeholder="End Date"
                                            disabled={edu.current}
                                            className="input-field"
                                        />
                                    </div>
                                    <label className="flex items-center space-x-2">
                                        <input
                                            type="checkbox"
                                            checked={edu.current || false}
                                            onChange={(e) => updateEducation(index, 'current', e.target.checked)}
                                            className="rounded"
                                        />
                                        <span className="text-sm text-gray-700">Currently studying</span>
                                    </label>
                                    <textarea
                                        value={edu.description}
                                        onChange={(e) => updateEducation(index, 'description', e.target.value)}
                                        placeholder="Description"
                                        rows="2"
                                        className="input-field"
                                    />
                                </div>
                            ))}
                            <button onClick={addEducation} className="btn-outline flex items-center space-x-2 w-full justify-center">
                                <Plus className="w-4 h-4" />
                                <span>Add Education</span>
                            </button>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {(profile?.education || []).length === 0 ? (
                                <p className="text-gray-500">No education added yet. Click edit to add your education.</p>
                            ) : (
                                profile?.education?.map((edu, index) => (
                                    <div key={index} className="border-l-4 border-primary-600 pl-4 py-2">
                                        <h3 className="font-semibold text-gray-900">{edu.degree} in {edu.field}</h3>
                                        <p className="text-gray-700">{edu.school}</p>
                                        <p className="text-sm text-gray-500">
                                            {new Date(edu.startDate).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })} -
                                            {edu.current ? ' Present' : ` ${new Date(edu.endDate).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}`}
                                        </p>
                                        {edu.description && <p className="text-gray-600 mt-2">{edu.description}</p>}
                                    </div>
                                ))
                            )}
                        </div>
                    )}
                </div>

                {/* Resume Upload */}
                <div className="card mt-6">
                    <h2 className="text-2xl font-bold text-gray-900 mb-4">Resume</h2>
                    <div className="space-y-4">
                        {profile?.resume ? (
                            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200">
                                <div className="flex items-center space-x-3">
                                    <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center">
                                        <FileText className="w-6 h-6 text-primary-600" />
                                    </div>
                                    <div>
                                        <p className="font-medium text-gray-900">Resume uploaded</p>
                                        <a
                                            href={`http://localhost:5000${profile.resume}`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-sm text-primary-600 hover:text-primary-700"
                                        >
                                            View Resume
                                        </a>
                                    </div>
                                </div>
                                <label className="btn-outline cursor-pointer">
                                    <input
                                        type="file"
                                        accept=".pdf,.doc,.docx"
                                        onChange={async (e) => {
                                            const file = e.target.files[0];
                                            if (file) {
                                                const formData = new FormData();
                                                formData.append('resume', file);
                                                try {
                                                    const response = await api.post('/api/profile/resume', formData, {
                                                        headers: { 'Content-Type': 'multipart/form-data' }
                                                    });
                                                    setProfile({ ...profile, resume: response.data.resume });
                                                    alert('Resume uploaded successfully!');
                                                } catch (error) {
                                                    console.error('Error uploading resume:', error);
                                                    alert('Failed to upload resume');
                                                }
                                            }
                                        }}
                                        className="hidden"
                                    />
                                    Replace Resume
                                </label>
                            </div>
                        ) : (
                            <div className="text-center py-8 border-2 border-dashed border-gray-300 rounded-lg">
                                <FileText className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                                <p className="text-gray-600 mb-4">Upload your resume (PDF, DOC, or DOCX)</p>
                                <label className="btn-primary cursor-pointer">
                                    <input
                                        type="file"
                                        accept=".pdf,.doc,.docx"
                                        onChange={async (e) => {
                                            const file = e.target.files[0];
                                            if (file) {
                                                const formData = new FormData();
                                                formData.append('resume', file);
                                                try {
                                                    const response = await api.post('/api/profile/resume', formData, {
                                                        headers: { 'Content-Type': 'multipart/form-data' }
                                                    });
                                                    setProfile({ ...profile, resume: response.data.resume });
                                                    alert('Resume uploaded successfully!');
                                                } catch (error) {
                                                    console.error('Error uploading resume:', error);
                                                    alert('Failed to upload resume');
                                                }
                                            }
                                        }}
                                        className="hidden"
                                    />
                                    Choose File
                                </label>
                                <p className="text-xs text-gray-500 mt-2">Maximum file size: 5MB</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Profile;
