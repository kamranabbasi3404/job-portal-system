import React from 'react';
import { Link } from 'react-router-dom';
import { Building2, Briefcase, MapPin } from 'lucide-react';

const CompanyCard = ({ company }) => {
    return (
        <div className="card hover:shadow-lg transition-shadow">
            <div className="flex items-start justify-between">
                <div className="flex items-start space-x-4">
                    <div className="w-16 h-16 bg-primary-100 rounded-lg flex items-center justify-center flex-shrink-0">
                        <Building2 className="w-8 h-8 text-primary-600" />
                    </div>
                    <div className="flex-1">
                        <h3 className="text-xl font-semibold text-gray-900 mb-2">
                            {company.name}
                        </h3>
                        <div className="space-y-1 text-sm text-gray-600">
                            {company.email && (
                                <p className="flex items-center">
                                    <span className="font-medium">Email:</span>
                                    <span className="ml-2">{company.email}</span>
                                </p>
                            )}
                            {company.phone && (
                                <p className="flex items-center">
                                    <span className="font-medium">Phone:</span>
                                    <span className="ml-2">{company.phone}</span>
                                </p>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            <div className="mt-4 pt-4 border-t border-gray-200">
                <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-6 text-sm text-gray-600">
                        <div className="flex items-center">
                            <Briefcase className="w-4 h-4 mr-1.5 text-gray-400" />
                            <span className="font-medium">{company.activeJobs}</span>
                            <span className="ml-1">Active Jobs</span>
                        </div>
                        <div className="flex items-center">
                            <span className="font-medium">{company.totalJobs}</span>
                            <span className="ml-1">Total Posted</span>
                        </div>
                    </div>
                    <Link
                        to={`/companies/${company._id}/jobs`}
                        className="btn-primary text-sm"
                    >
                        View Jobs
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default CompanyCard;
