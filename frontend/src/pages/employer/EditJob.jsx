import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { AlertCircle, Check } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import Loader from '../../components/common/Loader';
import api from '../../services/api';

const EditJob = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const { user } = useAuth();
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState('');
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        requirements: '',
        location: '',
        type: 'full-time',
        experience: '',
        salary: { min: '', max: '' },
        skills: '',
        deadline: ''
    });

    useEffect(() => {
        fetchJobData();
    }, [id]);

    const fetchJobData = async () => {
        try {
            setLoading(true);
            const response = await api.get(`/api/jobs/${id}`);
            const job = response.data;

            setFormData({
                title: job.title || '',
                description: job.description || '',
                requirements: Array.isArray(job.requirements) ? job.requirements.join('\n') : '',
                location: job.location || '',
                type: job.type || 'full-time',
                experience: job.experience || '',
                salary: {
                    min: job.salary?.min || '',
                    max: job.salary?.max || ''
                },
                skills: Array.isArray(job.skills) ? job.skills.join(', ') : '',
                deadline: job.deadline ? new Date(job.deadline).toISOString().split('T')[0] : ''
            });
        } catch (error) {
            console.error('Error fetching job:', error);
            setError('Failed to load job details');
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        if (name === 'salaryMin' || name === 'salaryMax') {
            setFormData({
                ...formData,
                salary: {
                    ...formData.salary,
                    [name === 'salaryMin' ? 'min' : 'max']: value
                }
            });
        } else {
            setFormData({ ...formData, [name]: value });
        }
        setError('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSubmitting(true);

        try {
            const jobData = {
                ...formData,
                skills: formData.skills.split(',').map(s => s.trim()).filter(Boolean),
                requirements: formData.requirements.split('\n').filter(Boolean),
                company: user.name
            };

            await api.put(`/api/jobs/${id}`, jobData);
            navigate('/employer/manage-jobs');
        } catch (error) {
            console.error('Error updating job:', error);
            setError(error.response?.data?.message || 'Failed to update job');
        } finally {
            setSubmitting(false);
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
                <div className="mb-8">
                    <h1 className="text-4xl font-bold text-gray-900 mb-2">Edit Job</h1>
                    <p className="text-gray-600">Update the details of your job posting</p>
                </div>

                <div className="card">
                    {error && (
                        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start space-x-3">
                            <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                            <p className="text-sm text-red-600">{error}</p>
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Job Title */}
                        <div>
                            <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
                                Job Title *
                            </label>
                            <input
                                id="title"
                                name="title"
                                type="text"
                                required
                                value={formData.title}
                                onChange={handleChange}
                                className="input-field"
                                placeholder="e.g. Senior Full Stack Developer"
                            />
                        </div>

                        {/* Job Description */}
                        <div>
                            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
                                Job Description *
                            </label>
                            <textarea
                                id="description"
                                name="description"
                                required
                                rows="6"
                                value={formData.description}
                                onChange={handleChange}
                                className="input-field"
                                placeholder="Describe the role, responsibilities, and what you're looking for..."
                            />
                        </div>

                        {/* Requirements */}
                        <div>
                            <label htmlFor="requirements" className="block text-sm font-medium text-gray-700 mb-2">
                                Requirements (one per line)
                            </label>
                            <textarea
                                id="requirements"
                                name="requirements"
                                rows="4"
                                value={formData.requirements}
                                onChange={handleChange}
                                className="input-field"
                                placeholder="5+ years of experience&#10;Bachelor's degree in Computer Science&#10;Strong communication skills"
                            />
                        </div>

                        {/* Location and Type */}
                        <div className="grid md:grid-cols-2 gap-6">
                            <div>
                                <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-2">
                                    Location *
                                </label>
                                <input
                                    id="location"
                                    name="location"
                                    type="text"
                                    required
                                    value={formData.location}
                                    onChange={handleChange}
                                    className="input-field"
                                    placeholder="e.g. New York, NY or Remote"
                                />
                            </div>

                            <div>
                                <label htmlFor="type" className="block text-sm font-medium text-gray-700 mb-2">
                                    Job Type *
                                </label>
                                <select
                                    id="type"
                                    name="type"
                                    value={formData.type}
                                    onChange={handleChange}
                                    className="input-field"
                                >
                                    <option value="full-time">Full Time</option>
                                    <option value="part-time">Part Time</option>
                                    <option value="contract">Contract</option>
                                    <option value="internship">Internship</option>
                                </select>
                            </div>
                        </div>

                        {/* Experience and Deadline */}
                        <div className="grid md:grid-cols-2 gap-6">
                            <div>
                                <label htmlFor="experience" className="block text-sm font-medium text-gray-700 mb-2">
                                    Experience Level
                                </label>
                                <input
                                    id="experience"
                                    name="experience"
                                    type="text"
                                    value={formData.experience}
                                    onChange={handleChange}
                                    className="input-field"
                                    placeholder="e.g. 3-5 years"
                                />
                            </div>

                            <div>
                                <label htmlFor="deadline" className="block text-sm font-medium text-gray-700 mb-2">
                                    Application Deadline
                                </label>
                                <input
                                    id="deadline"
                                    name="deadline"
                                    type="date"
                                    value={formData.deadline}
                                    onChange={handleChange}
                                    className="input-field"
                                />
                            </div>
                        </div>

                        {/* Salary Range */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Salary Range (USD per year)
                            </label>
                            <div className="grid md:grid-cols-2 gap-6">
                                <input
                                    name="salaryMin"
                                    type="number"
                                    value={formData.salary.min}
                                    onChange={handleChange}
                                    className="input-field"
                                    placeholder="Minimum"
                                />
                                <input
                                    name="salaryMax"
                                    type="number"
                                    value={formData.salary.max}
                                    onChange={handleChange}
                                    className="input-field"
                                    placeholder="Maximum"
                                />
                            </div>
                        </div>

                        {/* Skills */}
                        <div>
                            <label htmlFor="skills" className="block text-sm font-medium text-gray-700 mb-2">
                                Required Skills (comma-separated)
                            </label>
                            <input
                                id="skills"
                                name="skills"
                                type="text"
                                value={formData.skills}
                                onChange={handleChange}
                                className="input-field"
                                placeholder="React, Node.js, MongoDB, TypeScript"
                            />
                        </div>

                        {/* Submit Buttons */}
                        <div className="flex items-center space-x-4 pt-4">
                            <button
                                type="submit"
                                disabled={submitting}
                                className="btn-primary flex items-center space-x-2"
                            >
                                {submitting ? <Loader size="small" /> : (
                                    <>
                                        <Check className="w-5 h-5" />
                                        <span>Update Job</span>
                                    </>
                                )}
                            </button>
                            <button
                                type="button"
                                onClick={() => navigate('/employer/manage-jobs')}
                                className="btn-secondary"
                            >
                                Cancel
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default EditJob;
