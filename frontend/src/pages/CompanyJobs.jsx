import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Building2, Briefcase, MapPin, Globe, Phone, Mail } from 'lucide-react';
import JobCard from '../components/common/JobCard';
import Loader from '../components/common/Loader';
import api from '../services/api';

const CompanyJobs = () => {
    const { id } = useParams();
    const [company, setCompany] = useState(null);
    const [jobs, setJobs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        fetchCompanyAndJobs();
    }, [id]);

    const fetchCompanyAndJobs = async () => {
        try {
            setLoading(true);
            setError('');

            // Fetch company details with jobs using the proper endpoint
            const response = await api.get(`/api/companies/${id}`);
            const companyData = response.data;

            if (!companyData) {
                setError('Company not found');
                setLoading(false);
                return;
            }

            setCompany(companyData);
            setJobs(companyData.jobs || []);
        } catch (err) {
            console.error('Error fetching data:', err);
            setError(err.response?.data?.message || 'Failed to fetch company data');
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return <Loader fullScreen />;
    }

    if (error) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <h2 className="text-2xl font-bold text-gray-900 mb-4">{error}</h2>
                    <Link to="/companies" className="btn-primary">
                        Back to Companies
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Back Button */}
                <Link
                    to="/companies"
                    className="inline-flex items-center text-gray-600 hover:text-primary-600 mb-6 transition"
                >
                    <ArrowLeft className="w-5 h-5 mr-2" />
                    Back to Companies
                </Link>

                {/* Company Header */}
                <div className="bg-white rounded-xl shadow-md p-8 mb-8">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                        <div className="flex items-center space-x-6">
                            <div className="w-24 h-24 bg-gradient-to-br from-primary-500 to-primary-700 rounded-xl flex items-center justify-center flex-shrink-0">
                                <Building2 className="w-12 h-12 text-white" />
                            </div>
                            <div>
                                <h1 className="text-3xl font-bold text-gray-900 mb-2">
                                    {company?.name}
                                </h1>
                                <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                                    {company?.email && (
                                        <div className="flex items-center">
                                            <Mail className="w-4 h-4 mr-1.5 text-gray-400" />
                                            {company.email}
                                        </div>
                                    )}
                                    {company?.phone && (
                                        <div className="flex items-center">
                                            <Phone className="w-4 h-4 mr-1.5 text-gray-400" />
                                            {company.phone}
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                        <div className="mt-6 md:mt-0 flex items-center space-x-6">
                            <div className="text-center">
                                <p className="text-3xl font-bold text-primary-600">{company?.activeJobs || 0}</p>
                                <p className="text-sm text-gray-500">Active Jobs</p>
                            </div>
                            <div className="text-center">
                                <p className="text-3xl font-bold text-gray-700">{company?.totalJobs || 0}</p>
                                <p className="text-sm text-gray-500">Total Posted</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Jobs Section */}
                <div className="mb-6">
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">
                        Jobs at {company?.name}
                    </h2>
                    <p className="text-gray-600">
                        {jobs.length} {jobs.length === 1 ? 'position' : 'positions'} available
                    </p>
                </div>

                {/* Job Listings */}
                {jobs.length === 0 ? (
                    <div className="bg-white rounded-xl shadow-md p-12 text-center">
                        <Briefcase className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                        <h3 className="text-xl font-semibold text-gray-900 mb-2">
                            No jobs available
                        </h3>
                        <p className="text-gray-600">
                            This company hasn't posted any jobs yet. Check back later!
                        </p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {jobs.map(job => (
                            <JobCard key={job._id || job.id} job={job} />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default CompanyJobs;
