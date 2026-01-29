import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, Briefcase, MapPin, Clock, ChevronRight, AlertCircle, RefreshCw } from 'lucide-react';
import api from '../../services/api';

const RecommendedJobs = () => {
    const [recommendations, setRecommendations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [message, setMessage] = useState('');

    useEffect(() => {
        fetchRecommendations();
    }, []);

    const fetchRecommendations = async () => {
        try {
            setLoading(true);
            setError('');
            setMessage('');

            const response = await api.get('/api/recommendations');

            if (response.data.recommendations) {
                setRecommendations(response.data.recommendations);
                if (response.data.message) {
                    setMessage(response.data.message);
                }
            }
        } catch (err) {
            console.error('Error fetching recommendations:', err);
            setError(err.response?.data?.message || 'Failed to load recommendations');
        } finally {
            setLoading(false);
        }
    };

    const getMatchScoreColor = (score) => {
        if (score >= 80) return 'bg-green-500';
        if (score >= 60) return 'bg-blue-500';
        if (score >= 40) return 'bg-yellow-500';
        return 'bg-gray-400';
    };

    const getMatchScoreLabel = (score) => {
        if (score >= 80) return 'Excellent Match';
        if (score >= 60) return 'Good Match';
        if (score >= 40) return 'Fair Match';
        return 'Potential Match';
    };

    if (loading) {
        return (
            <div className="bg-white rounded-xl shadow-md p-6">
                <div className="flex items-center space-x-3 mb-6">
                    <div className="p-2 bg-purple-100 rounded-lg">
                        <Sparkles className="w-6 h-6 text-purple-600" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900">AI Job Recommendations</h3>
                </div>
                <div className="flex justify-center py-8">
                    <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-purple-600"></div>
                </div>
                <p className="text-center text-gray-500 text-sm">Analyzing your profile...</p>
            </div>
        );
    }

    return (
        <div className="bg-white rounded-xl shadow-md p-6">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-3">
                    <div className="p-2 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-lg">
                        <Sparkles className="w-6 h-6 text-white" />
                    </div>
                    <div>
                        <h3 className="text-xl font-bold text-gray-900">AI Job Recommendations</h3>
                        <p className="text-sm text-gray-500">Personalized jobs based on your profile</p>
                    </div>
                </div>
                <button
                    onClick={fetchRecommendations}
                    className="flex items-center text-sm text-purple-600 hover:text-purple-700 transition"
                >
                    <RefreshCw className="w-4 h-4 mr-1" />
                    Refresh
                </button>
            </div>

            {/* Error State */}
            {error && (
                <div className="flex items-center space-x-3 p-4 bg-red-50 border border-red-200 rounded-lg mb-4">
                    <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
                    <p className="text-sm text-red-600">{error}</p>
                </div>
            )}

            {/* Message (e.g., incomplete profile) */}
            {message && recommendations.length === 0 && (
                <div className="flex items-center space-x-3 p-4 bg-yellow-50 border border-yellow-200 rounded-lg mb-4">
                    <AlertCircle className="w-5 h-5 text-yellow-600 flex-shrink-0" />
                    <p className="text-sm text-yellow-700">{message}</p>
                </div>
            )}

            {/* No Recommendations */}
            {!error && recommendations.length === 0 && !message && (
                <div className="text-center py-8">
                    <Briefcase className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                    <p className="text-gray-500">No recommendations available yet.</p>
                    <Link to="/jobseeker/profile" className="text-sm text-purple-600 hover:text-purple-700 mt-2 inline-block">
                        Complete your profile →
                    </Link>
                </div>
            )}

            {/* Recommendations List */}
            {recommendations.length > 0 && (
                <div className="space-y-4">
                    {recommendations.map((rec, index) => (
                        <Link
                            key={rec.job_id}
                            to={`/jobs/${rec.job_id}`}
                            className="block p-4 border border-gray-200 rounded-lg hover:border-purple-300 hover:shadow-md transition group"
                        >
                            <div className="flex justify-between items-start">
                                <div className="flex-1">
                                    <div className="flex items-center space-x-2 mb-1">
                                        <span className="text-xs font-medium text-gray-400">#{index + 1}</span>
                                        <h4 className="font-semibold text-gray-900 group-hover:text-purple-600 transition">
                                            {rec.job_title}
                                        </h4>
                                    </div>
                                    <p className="text-sm text-gray-600 mb-2">{rec.company}</p>

                                    <div className="flex flex-wrap gap-2 text-xs text-gray-500 mb-2">
                                        {rec.location && (
                                            <span className="flex items-center">
                                                <MapPin className="w-3 h-3 mr-1" />
                                                {rec.location}
                                            </span>
                                        )}
                                        {rec.type && (
                                            <span className="flex items-center">
                                                <Clock className="w-3 h-3 mr-1" />
                                                {rec.type}
                                            </span>
                                        )}
                                    </div>

                                    {/* Skills */}
                                    {rec.skills && rec.skills.length > 0 && (
                                        <div className="flex flex-wrap gap-1 mb-2">
                                            {rec.skills.slice(0, 4).map((skill, idx) => (
                                                <span
                                                    key={idx}
                                                    className="px-2 py-0.5 bg-purple-50 text-purple-700 rounded text-xs"
                                                >
                                                    {skill}
                                                </span>
                                            ))}
                                            {rec.skills.length > 4 && (
                                                <span className="px-2 py-0.5 bg-gray-100 text-gray-600 rounded text-xs">
                                                    +{rec.skills.length - 4}
                                                </span>
                                            )}
                                        </div>
                                    )}

                                    {/* Match Reason */}
                                    <p className="text-xs text-gray-500 italic">{rec.reason}</p>
                                </div>

                                {/* Match Score */}
                                <div className="flex flex-col items-end space-y-1 ml-4">
                                    <div className={`${getMatchScoreColor(rec.match_score)} text-white px-3 py-1 rounded-full text-sm font-bold`}>
                                        {rec.match_score}%
                                    </div>
                                    <span className="text-xs text-gray-500">{getMatchScoreLabel(rec.match_score)}</span>
                                    <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-purple-600 transition mt-2" />
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            )}

            {/* View All Jobs Link */}
            {recommendations.length > 0 && (
                <div className="mt-6 text-center">
                    <Link
                        to="/jobs"
                        className="text-sm text-purple-600 hover:text-purple-700 font-medium"
                    >
                        Browse all jobs →
                    </Link>
                </div>
            )}
        </div>
    );
};

export default RecommendedJobs;
