import React, { useState, useEffect } from 'react';
import { Search, Building2, AlertCircle } from 'lucide-react';
import CompanyCard from '../components/common/CompanyCard';
import Loader from '../components/common/Loader';
import api from '../services/api';

const Companies = () => {
    const [companies, setCompanies] = useState([]);
    const [filteredCompanies, setFilteredCompanies] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        fetchCompanies();
    }, []);

    useEffect(() => {
        // Filter companies based on search term
        if (searchTerm.trim()) {
            const filtered = companies.filter(company =>
                company.name.toLowerCase().includes(searchTerm.toLowerCase())
            );
            setFilteredCompanies(filtered);
        } else {
            setFilteredCompanies(companies);
        }
    }, [searchTerm, companies]);

    const fetchCompanies = async () => {
        try {
            setLoading(true);
            setError('');
            const response = await api.get('/api/companies');
            setCompanies(response.data);
            setFilteredCompanies(response.data);
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to fetch companies');
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return <Loader fullScreen />;
    }

    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="text-center mb-12">
                    <div className="flex items-center justify-center mb-4">
                        <Building2 className="w-12 h-12 text-primary-600" />
                    </div>
                    <h1 className="text-4xl font-bold text-gray-900 mb-4">
                        Explore Companies
                    </h1>
                    <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                        Discover top employers and explore their job opportunities
                    </p>
                </div>

                {/* Search Bar */}
                <div className="max-w-2xl mx-auto mb-8">
                    <div className="relative">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search companies by name..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="input-field pl-12 w-full text-lg"
                        />
                    </div>
                </div>

                {/* Error Message */}
                {error && (
                    <div className="max-w-2xl mx-auto mb-8">
                        <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start space-x-3">
                            <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                            <p className="text-sm text-red-600">{error}</p>
                        </div>
                    </div>
                )}

                {/* Companies Count */}
                <div className="mb-6">
                    <p className="text-gray-600">
                        Showing <span className="font-semibold text-gray-900">{filteredCompanies.length}</span> {filteredCompanies.length === 1 ? 'company' : 'companies'}
                        {searchTerm && ` matching "${searchTerm}"`}
                    </p>
                </div>

                {/* Companies Grid */}
                {filteredCompanies.length > 0 ? (
                    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-2">
                        {filteredCompanies.map((company) => (
                            <CompanyCard key={company._id} company={company} />
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-12">
                        <Building2 className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                        <h3 className="text-xl font-semibold text-gray-900 mb-2">
                            No companies found
                        </h3>
                        <p className="text-gray-600">
                            {searchTerm
                                ? `No companies match "${searchTerm}". Try a different search.`
                                : 'No companies are registered yet.'}
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Companies;
