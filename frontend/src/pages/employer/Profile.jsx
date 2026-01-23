import React, { useState, useEffect } from 'react';
import { Edit2, Plus, Trash2, Save, X, Camera, Building2, Globe, MapPin, Mail, Phone, Linkedin, Twitter, Facebook, Target, Eye, Users } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';
import Loader from '../../components/common/Loader';

const EmployerProfile = () => {
    const { user } = useAuth();
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [editing, setEditing] = useState({});
    const [formData, setFormData] = useState({});
    const [profilePicturePreview, setProfilePicturePreview] = useState(null);

    useEffect(() => {
        fetchProfile();
    }, []);

    const fetchProfile = async () => {
        try {
            const response = await api.get('/api/company-profile/me');
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
            const response = await api.put('/api/company-profile/me', formData);
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

    const addBenefit = () => {
        const newBenefits = [...(formData.benefits || []), ''];
        setFormData({ ...formData, benefits: newBenefits });
    };

    const removeBenefit = (index) => {
        const newBenefits = formData.benefits.filter((_, i) => i !== index);
        setFormData({ ...formData, benefits: newBenefits });
    };

    const updateBenefit = (index, value) => {
        const newBenefits = [...formData.benefits];
        newBenefits[index] = value;
        setFormData({ ...formData, benefits: newBenefits });
    };

    const handleProfilePictureUpload = async (e) => {
        const file = e.target.files[0];
        if (file) {
            // Validate file type
            const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
            if (!allowedTypes.includes(file.type)) {
                alert('Only image files (JPG, PNG, GIF, WEBP) are allowed');
                return;
            }

            // Validate file size (5MB)
            if (file.size > 5 * 1024 * 1024) {
                alert('File size must be less than 5MB');
                return;
            }

            // Create preview
            const reader = new FileReader();
            reader.onloadend = () => {
                setProfilePicturePreview(reader.result);
            };
            reader.readAsDataURL(file);

            // Upload to backend
            const formDataUpload = new FormData();
            formDataUpload.append('profilePicture', file);

            try {
                const response = await api.post('/api/company-profile/profile-picture', formDataUpload, {
                    headers: { 'Content-Type': 'multipart/form-data' }
                });
                setProfile({ ...profile, profilePicture: response.data.profilePicture });
                alert('Company logo uploaded successfully!');
            } catch (error) {
                console.error('Error uploading logo:', error);
                alert(error.response?.data?.message || 'Failed to upload logo');
                setProfilePicturePreview(null);
            }
        }
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
                        <div className="relative group">
                            {profilePicturePreview || profile?.profilePicture ? (
                                <img
                                    src={profilePicturePreview || `http://localhost:5000${profile.profilePicture}`}
                                    alt={formData?.companyName || 'Company Logo'}
                                    className="w-20 h-20 rounded-full object-cover border-4 border-white shadow-lg"
                                />
                            ) : (
                                <div className="w-20 h-20 bg-gradient-to-br from-primary-500 to-secondary-600 rounded-full flex items-center justify-center text-white text-3xl font-bold">
                                    <Building2 className="w-10 h-10" />
                                </div>
                            )}
                            <label className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 rounded-full opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                                <Camera className="w-6 h-6 text-white" />
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={handleProfilePictureUpload}
                                    className="hidden"
                                />
                            </label>
                        </div>
                        <div className="flex-1">
                            <h1 className="text-3xl font-bold text-gray-900">{formData?.companyName || user?.name || 'Company Name'}</h1>
                            <p className="text-gray-600">{formData?.industry || 'Industry not specified'}</p>
                            <p className="text-sm text-gray-500 mt-1">Employer Account</p>
                        </div>
                    </div>
                </div>

                {/* Company Information */}
                <div className="card mb-6">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-2xl font-bold text-gray-900 flex items-center space-x-2">
                            <Building2 className="w-6 h-6" />
                            <span>Company Information</span>
                        </h2>
                        {editing.companyInfo ? (
                            <div className="flex space-x-2">
                                <button onClick={() => handleSave('companyInfo')} className="btn-primary flex items-center space-x-1">
                                    <Save className="w-4 h-4" />
                                    <span>Save</span>
                                </button>
                                <button onClick={() => handleCancel('companyInfo')} className="btn-secondary flex items-center space-x-1">
                                    <X className="w-4 h-4" />
                                    <span>Cancel</span>
                                </button>
                            </div>
                        ) : (
                            <button onClick={() => setEditing({ ...editing, companyInfo: true })} className="text-primary-600 hover:text-primary-700">
                                <Edit2 className="w-5 h-5" />
                            </button>
                        )}
                    </div>

                    {editing.companyInfo ? (
                        <div className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Company Name *</label>
                                    <input
                                        type="text"
                                        value={formData.companyName || ''}
                                        onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                                        className="input-field"
                                        placeholder="Enter company name"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Industry</label>
                                    <input
                                        type="text"
                                        value={formData.industry || ''}
                                        onChange={(e) => setFormData({ ...formData, industry: e.target.value })}
                                        className="input-field"
                                        placeholder="e.g., Technology, Healthcare"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Company Size</label>
                                    <select
                                        value={formData.companySize || ''}
                                        onChange={(e) => setFormData({ ...formData, companySize: e.target.value })}
                                        className="input-field"
                                    >
                                        <option value="">Select size</option>
                                        <option value="1-10">1-10 employees</option>
                                        <option value="11-50">11-50 employees</option>
                                        <option value="51-200">51-200 employees</option>
                                        <option value="201-500">201-500 employees</option>
                                        <option value="501-1000">501-1000 employees</option>
                                        <option value="1000+">1000+ employees</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Founded Year</label>
                                    <input
                                        type="number"
                                        value={formData.foundedYear || ''}
                                        onChange={(e) => setFormData({ ...formData, foundedYear: e.target.value })}
                                        className="input-field"
                                        placeholder="e.g., 2020"
                                        min="1800"
                                        max={new Date().getFullYear()}
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">About Company</label>
                                <textarea
                                    value={formData.about || ''}
                                    onChange={(e) => setFormData({ ...formData, about: e.target.value })}
                                    rows="4"
                                    className="input-field"
                                    placeholder="Brief overview of your company..."
                                />
                            </div>
                        </div>
                    ) : (
                        <div className="space-y-3">
                            <div className="grid grid-cols-2 gap-4 text-sm">
                                <div>
                                    <span className="text-gray-500">Company Size:</span>
                                    <span className="ml-2 text-gray-900">{profile?.companySize || 'Not specified'}</span>
                                </div>
                                <div>
                                    <span className="text-gray-500">Founded:</span>
                                    <span className="ml-2 text-gray-900">{profile?.foundedYear || 'Not specified'}</span>
                                </div>
                            </div>
                            <div>
                                <span className="text-sm text-gray-500">About:</span>
                                <p className="text-gray-700 mt-1">{profile?.about || 'No information added yet. Click edit to add company details.'}</p>
                            </div>
                        </div>
                    )}
                </div>

                {/* Contact Information */}
                <div className="card mb-6">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-2xl font-bold text-gray-900 flex items-center space-x-2">
                            <Mail className="w-6 h-6" />
                            <span>Contact Information</span>
                        </h2>
                        {editing.contact ? (
                            <div className="flex space-x-2">
                                <button onClick={() => handleSave('contact')} className="btn-primary flex items-center space-x-1">
                                    <Save className="w-4 h-4" />
                                    <span>Save</span>
                                </button>
                                <button onClick={() => handleCancel('contact')} className="btn-secondary flex items-center space-x-1">
                                    <X className="w-4 h-4" />
                                    <span>Cancel</span>
                                </button>
                            </div>
                        ) : (
                            <button onClick={() => setEditing({ ...editing, contact: true })} className="text-primary-600 hover:text-primary-700">
                                <Edit2 className="w-5 h-5" />
                            </button>
                        )}
                    </div>

                    {editing.contact ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                                <input
                                    type="email"
                                    value={formData.email || ''}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                    className="input-field"
                                    placeholder="contact@company.com"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                                <input
                                    type="tel"
                                    value={formData.phone || ''}
                                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                    className="input-field"
                                    placeholder="+1 (555) 123-4567"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Website</label>
                                <input
                                    type="url"
                                    value={formData.website || ''}
                                    onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                                    className="input-field"
                                    placeholder="https://www.company.com"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
                                <input
                                    type="text"
                                    value={formData.location || ''}
                                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                                    className="input-field"
                                    placeholder="City, Country"
                                />
                            </div>
                            <div className="md:col-span-2">
                                <label className="block text-sm font-medium text-gray-700 mb-1">Headquarters</label>
                                <input
                                    type="text"
                                    value={formData.headquarters || ''}
                                    onChange={(e) => setFormData({ ...formData, headquarters: e.target.value })}
                                    className="input-field"
                                    placeholder="Full headquarters address"
                                />
                            </div>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                            <div className="flex items-center space-x-2">
                                <Mail className="w-4 h-4 text-gray-400" />
                                <span className="text-gray-700">{profile?.email || 'Not provided'}</span>
                            </div>
                            <div className="flex items-center space-x-2">
                                <Phone className="w-4 h-4 text-gray-400" />
                                <span className="text-gray-700">{profile?.phone || 'Not provided'}</span>
                            </div>
                            <div className="flex items-center space-x-2">
                                <Globe className="w-4 h-4 text-gray-400" />
                                {profile?.website ? (
                                    <a href={profile.website} target="_blank" rel="noopener noreferrer" className="text-primary-600 hover:underline">
                                        {profile.website}
                                    </a>
                                ) : (
                                    <span className="text-gray-700">Not provided</span>
                                )}
                            </div>
                            <div className="flex items-center space-x-2">
                                <MapPin className="w-4 h-4 text-gray-400" />
                                <span className="text-gray-700">{profile?.location || 'Not provided'}</span>
                            </div>
                            {profile?.headquarters && (
                                <div className="md:col-span-2 flex items-center space-x-2">
                                    <Building2 className="w-4 h-4 text-gray-400" />
                                    <span className="text-gray-700">{profile.headquarters}</span>
                                </div>
                            )}
                        </div>
                    )}
                </div>

                {/* Social Media */}
                <div className="card mb-6">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-2xl font-bold text-gray-900 flex items-center space-x-2">
                            <Globe className="w-6 h-6" />
                            <span>Social Media</span>
                        </h2>
                        {editing.social ? (
                            <div className="flex space-x-2">
                                <button onClick={() => handleSave('social')} className="btn-primary flex items-center space-x-1">
                                    <Save className="w-4 h-4" />
                                    <span>Save</span>
                                </button>
                                <button onClick={() => handleCancel('social')} className="btn-secondary flex items-center space-x-1">
                                    <X className="w-4 h-4" />
                                    <span>Cancel</span>
                                </button>
                            </div>
                        ) : (
                            <button onClick={() => setEditing({ ...editing, social: true })} className="text-primary-600 hover:text-primary-700">
                                <Edit2 className="w-5 h-5" />
                            </button>
                        )}
                    </div>

                    {editing.social ? (
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
                                    <Linkedin className="w-4 h-4 mr-1" /> LinkedIn
                                </label>
                                <input
                                    type="url"
                                    value={formData.linkedin || ''}
                                    onChange={(e) => setFormData({ ...formData, linkedin: e.target.value })}
                                    className="input-field"
                                    placeholder="https://linkedin.com/company/..."
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
                                    <Twitter className="w-4 h-4 mr-1" /> Twitter
                                </label>
                                <input
                                    type="url"
                                    value={formData.twitter || ''}
                                    onChange={(e) => setFormData({ ...formData, twitter: e.target.value })}
                                    className="input-field"
                                    placeholder="https://twitter.com/..."
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
                                    <Facebook className="w-4 h-4 mr-1" /> Facebook
                                </label>
                                <input
                                    type="url"
                                    value={formData.facebook || ''}
                                    onChange={(e) => setFormData({ ...formData, facebook: e.target.value })}
                                    className="input-field"
                                    placeholder="https://facebook.com/..."
                                />
                            </div>
                        </div>
                    ) : (
                        <div className="flex flex-wrap gap-4">
                            {profile?.linkedin && (
                                <a href={profile.linkedin} target="_blank" rel="noopener noreferrer" className="flex items-center space-x-2 text-blue-600 hover:text-blue-700">
                                    <Linkedin className="w-5 h-5" />
                                    <span>LinkedIn</span>
                                </a>
                            )}
                            {profile?.twitter && (
                                <a href={profile.twitter} target="_blank" rel="noopener noreferrer" className="flex items-center space-x-2 text-sky-600 hover:text-sky-700">
                                    <Twitter className="w-5 h-5" />
                                    <span>Twitter</span>
                                </a>
                            )}
                            {profile?.facebook && (
                                <a href={profile.facebook} target="_blank" rel="noopener noreferrer" className="flex items-center space-x-2 text-blue-700 hover:text-blue-800">
                                    <Facebook className="w-5 h-5" />
                                    <span>Facebook</span>
                                </a>
                            )}
                            {!profile?.linkedin && !profile?.twitter && !profile?.facebook && (
                                <p className="text-gray-500">No social media links added yet. Click edit to add links.</p>
                            )}
                        </div>
                    )}
                </div>

                {/* Mission, Vision & Culture */}
                <div className="card mb-6">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-2xl font-bold text-gray-900 flex items-center space-x-2">
                            <Target className="w-6 h-6" />
                            <span>Mission, Vision & Culture</span>
                        </h2>
                        {editing.mission ? (
                            <div className="flex space-x-2">
                                <button onClick={() => handleSave('mission')} className="btn-primary flex items-center space-x-1">
                                    <Save className="w-4 h-4" />
                                    <span>Save</span>
                                </button>
                                <button onClick={() => handleCancel('mission')} className="btn-secondary flex items-center space-x-1">
                                    <X className="w-4 h-4" />
                                    <span>Cancel</span>
                                </button>
                            </div>
                        ) : (
                            <button onClick={() => setEditing({ ...editing, mission: true })} className="text-primary-600 hover:text-primary-700">
                                <Edit2 className="w-5 h-5" />
                            </button>
                        )}
                    </div>

                    {editing.mission ? (
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Mission Statement</label>
                                <textarea
                                    value={formData.mission || ''}
                                    onChange={(e) => setFormData({ ...formData, mission: e.target.value })}
                                    rows="3"
                                    className="input-field"
                                    placeholder="What is your company's mission?"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Vision Statement</label>
                                <textarea
                                    value={formData.vision || ''}
                                    onChange={(e) => setFormData({ ...formData, vision: e.target.value })}
                                    rows="3"
                                    className="input-field"
                                    placeholder="What is your company's vision?"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Company Culture</label>
                                <textarea
                                    value={formData.culture || ''}
                                    onChange={(e) => setFormData({ ...formData, culture: e.target.value })}
                                    rows="3"
                                    className="input-field"
                                    placeholder="Describe your company culture and values"
                                />
                            </div>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {profile?.mission && (
                                <div className="border-l-4 border-primary-600 pl-4">
                                    <h4 className="font-semibold text-gray-900 mb-1">Mission</h4>
                                    <p className="text-gray-700">{profile.mission}</p>
                                </div>
                            )}
                            {profile?.vision && (
                                <div className="border-l-4 border-secondary-600 pl-4">
                                    <h4 className="font-semibold text-gray-900 mb-1">Vision</h4>
                                    <p className="text-gray-700">{profile.vision}</p>
                                </div>
                            )}
                            {profile?.culture && (
                                <div className="border-l-4 border-indigo-600 pl-4">
                                    <h4 className="font-semibold text-gray-900 mb-1">Culture</h4>
                                    <p className="text-gray-700">{profile.culture}</p>
                                </div>
                            )}
                            {!profile?.mission && !profile?.vision && !profile?.culture && (
                                <p className="text-gray-500">No mission, vision, or culture information added yet. Click edit to add.</p>
                            )}
                        </div>
                    )}
                </div>

                {/* Employee Benefits */}
                <div className="card">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-2xl font-bold text-gray-900 flex items-center space-x-2">
                            <Users className="w-6 h-6" />
                            <span>Employee Benefits</span>
                        </h2>
                        {editing.benefits ? (
                            <div className="flex space-x-2">
                                <button onClick={() => handleSave('benefits')} className="btn-primary flex items-center space-x-1">
                                    <Save className="w-4 h-4" />
                                    <span>Save</span>
                                </button>
                                <button onClick={() => handleCancel('benefits')} className="btn-secondary flex items-center space-x-1">
                                    <X className="w-4 h-4" />
                                    <span>Cancel</span>
                                </button>
                            </div>
                        ) : (
                            <button onClick={() => setEditing({ ...editing, benefits: true })} className="text-primary-600 hover:text-primary-700">
                                <Edit2 className="w-5 h-5" />
                            </button>
                        )}
                    </div>

                    {editing.benefits ? (
                        <div className="space-y-3">
                            {(formData.benefits || []).map((benefit, index) => (
                                <div key={index} className="flex space-x-2">
                                    <input
                                        type="text"
                                        value={benefit}
                                        onChange={(e) => updateBenefit(index, e.target.value)}
                                        placeholder="Enter benefit (e.g., Health Insurance)"
                                        className="input-field flex-1"
                                    />
                                    <button onClick={() => removeBenefit(index)} className="text-red-600 hover:text-red-700">
                                        <Trash2 className="w-5 h-5" />
                                    </button>
                                </div>
                            ))}
                            <button onClick={addBenefit} className="btn-outline flex items-center space-x-2">
                                <Plus className="w-4 h-4" />
                                <span>Add Benefit</span>
                            </button>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                            {(profile?.benefits || []).length === 0 ? (
                                <p className="text-gray-500">No benefits added yet. Click edit to add employee benefits.</p>
                            ) : (
                                profile?.benefits?.map((benefit, index) => (
                                    <div key={index} className="flex items-center space-x-2 text-gray-700">
                                        <span className="w-2 h-2 bg-primary-600 rounded-full"></span>
                                        <span>{benefit}</span>
                                    </div>
                                ))
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default EmployerProfile;
