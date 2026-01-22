import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Heart } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import JobCard from '../../components/common/JobCard';
import Loader from '../../components/common/Loader';
import api from '../../services/api';

const SavedJobs = () => {
    const { user } = useAuth();
    const [savedJobs, setSavedJobs] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchSavedJobs();
    }, []);

    const fetchSavedJobs = async () => {
        try {
            setLoading(true);
            const response = await api.get('/api/saved-jobs');
            setSavedJobs(response.data);
        } catch (error) {
            console.error('Error fetching saved jobs:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSaveToggle = (jobId, isSaved) => {
        if (!isSaved) {
            // Job was unsaved, remove from list
            setSavedJobs(savedJobs.filter(saved => saved.job._id !== jobId));
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
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-4xl font-bold text-gray-900 mb-2">Saved Jobs</h1>
                    <p className="text-gray-600">Jobs you've bookmarked for later</p>
                </div>

                {savedJobs.length === 0 ? (
                    <div className="card text-center py-16">
                        <Heart className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                        <h3 className="text-xl font-semibold text-gray-900 mb-2">No saved jobs yet</h3>
                        <p className="text-gray-600 mb-6">Start saving jobs you're interested in by clicking the heart icon</p>
                        <Link to="/jobs" className="btn-primary inline-block">
                            Browse Jobs
                        </Link>
                    </div>
                ) : (
                    <>
                        <div className="mb-4 text-gray-600">
                            {savedJobs.length} {savedJobs.length === 1 ? 'job' : 'jobs'} saved
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {savedJobs.map((saved) => (
                                <JobCard
                                    key={saved._id}
                                    job={saved.job}
                                    isSaved={true}
                                    onSaveToggle={handleSaveToggle}
                                />
                            ))}
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

export default SavedJobs;
