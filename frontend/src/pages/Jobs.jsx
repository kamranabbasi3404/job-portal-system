import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search, MapPin, Briefcase, Filter } from 'lucide-react';
import JobCard from '../components/common/JobCard';
import Loader from '../components/common/Loader';
import api from '../services/api';

const Jobs = () => {
    const [searchParams] = useSearchParams();
    const [jobs, setJobs] = useState([]);
    const [loading, setLoading] = useState(true);

    // Initialize filters from URL query parameters
    const [filters, setFilters] = useState({
        search: searchParams.get('search') || '',
        location: searchParams.get('location') || '',
        type: searchParams.get('type') || '',
        category: searchParams.get('category') || ''
    });

    useEffect(() => {
        fetchJobs();
    }, []);

    const fetchJobs = async () => {
        try {
            setLoading(true);
            const response = await api.get('/api/jobs');
            setJobs(response.data || []);
        } catch (error) {
            console.error('Error fetching jobs:', error);
            setJobs([]);
        } finally {
            setLoading(false);
        }
    };

    const handleFilterChange = (e) => {
        setFilters({ ...filters, [e.target.name]: e.target.value });
    };

    const filteredJobs = jobs.filter(job => {
        const matchesSearch = !filters.search ||
            job.title.toLowerCase().includes(filters.search.toLowerCase()) ||
            job.description.toLowerCase().includes(filters.search.toLowerCase());

        const matchesLocation = !filters.location ||
            job.location.toLowerCase().includes(filters.location.toLowerCase());

        const matchesType = !filters.type || job.type === filters.type;

        return matchesSearch && matchesLocation && matchesType;
    });

    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-4xl font-bold text-gray-900 mb-2">Find Your Dream Job</h1>
                    <p className="text-gray-600">Browse through {jobs.length} available positions</p>
                </div>

                {/* Filters */}
                <div className="card mb-8">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                            <input
                                type="text"
                                name="search"
                                value={filters.search}
                                onChange={handleFilterChange}
                                placeholder="Job title or keywords..."
                                className="input-field pl-10"
                            />
                        </div>
                        <div className="relative">
                            <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                            <input
                                type="text"
                                name="location"
                                value={filters.location}
                                onChange={handleFilterChange}
                                placeholder="Location..."
                                className="input-field pl-10"
                            />
                        </div>
                        <div className="relative">
                            <Briefcase className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                            <select
                                name="type"
                                value={filters.type}
                                onChange={handleFilterChange}
                                className="input-field pl-10 appearance-none"
                            >
                                <option value="">All Types</option>
                                <option value="full-time">Full Time</option>
                                <option value="part-time">Part Time</option>
                                <option value="contract">Contract</option>
                                <option value="internship">Internship</option>
                            </select>
                        </div>
                        <button
                            onClick={fetchJobs}
                            className="btn-primary flex items-center justify-center space-x-2"
                        >
                            <Filter className="w-4 h-4" />
                            <span>Apply Filters</span>
                        </button>
                    </div>
                </div>

                {/* Job Listings */}
                {loading ? (
                    <div className="flex justify-center py-20">
                        <Loader size="large" />
                    </div>
                ) : filteredJobs.length === 0 ? (
                    <div className="text-center py-20">
                        <p className="text-gray-500 text-lg">No jobs found matching your criteria</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filteredJobs.map(job => (
                            <JobCard key={job._id || job.id} job={job} />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Jobs;
