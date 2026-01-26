import React, { useState, useEffect } from 'react';
import AdminLayout from '../../components/admin/AdminLayout';
import { getPendingCompanyRequests, approveCompanyRequest, declineCompanyRequest } from '../../services/adminApi';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const CompanyRequests = () => {
    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [filters, setFilters] = useState({
        page: 1,
        limit: 10,
        status: 'pending'
    });
    const [pagination, setPagination] = useState({});
    const [stats, setStats] = useState({});
    const [actionModal, setActionModal] = useState(null);
    const [declineReason, setDeclineReason] = useState('');
    const [processing, setProcessing] = useState(false);
    const [viewDocs, setViewDocs] = useState(null);

    useEffect(() => {
        fetchRequests();
    }, [filters]);

    const fetchRequests = async () => {
        try {
            setLoading(true);
            const data = await getPendingCompanyRequests(filters);
            setRequests(data.requests);
            setPagination({
                totalPages: data.totalPages,
                currentPage: data.currentPage,
                total: data.total
            });
            setStats(data.stats);
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to load requests');
        } finally {
            setLoading(false);
        }
    };

    const handleApprove = async () => {
        if (!actionModal) return;
        try {
            setProcessing(true);
            await approveCompanyRequest(actionModal._id);
            setActionModal(null);
            fetchRequests();
            alert('Company approved successfully! Email notification sent.');
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to approve request');
        } finally {
            setProcessing(false);
        }
    };

    const handleDecline = async () => {
        if (!actionModal) return;
        try {
            setProcessing(true);
            await declineCompanyRequest(actionModal._id, declineReason);
            setActionModal(null);
            setDeclineReason('');
            fetchRequests();
            alert('Company request declined. Notification sent.');
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to decline request');
        } finally {
            setProcessing(false);
        }
    };

    const handleStatusFilter = (status) => {
        setFilters({ ...filters, status, page: 1 });
    };

    const handlePageChange = (newPage) => {
        setFilters({ ...filters, page: newPage });
    };

    const getStatusBadge = (status) => {
        const styles = {
            pending: 'bg-yellow-100 text-yellow-800',
            approved: 'bg-green-100 text-green-800',
            declined: 'bg-red-100 text-red-800'
        };
        return styles[status] || 'bg-gray-100 text-gray-800';
    };

    return (
        <AdminLayout>
            <div className="space-y-6">
                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div
                        onClick={() => handleStatusFilter('pending')}
                        className={`cursor-pointer bg-white rounded-xl shadow-md p-6 border-2 transition ${filters.status === 'pending' ? 'border-yellow-500' : 'border-transparent hover:border-yellow-200'}`}
                    >
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-gray-500 text-sm">Pending</p>
                                <p className="text-3xl font-bold text-yellow-600">{stats.pending || 0}</p>
                            </div>
                            <div className="text-4xl">⏳</div>
                        </div>
                    </div>
                    <div
                        onClick={() => handleStatusFilter('approved')}
                        className={`cursor-pointer bg-white rounded-xl shadow-md p-6 border-2 transition ${filters.status === 'approved' ? 'border-green-500' : 'border-transparent hover:border-green-200'}`}
                    >
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-gray-500 text-sm">Approved</p>
                                <p className="text-3xl font-bold text-green-600">{stats.approved || 0}</p>
                            </div>
                            <div className="text-4xl">✅</div>
                        </div>
                    </div>
                    <div
                        onClick={() => handleStatusFilter('declined')}
                        className={`cursor-pointer bg-white rounded-xl shadow-md p-6 border-2 transition ${filters.status === 'declined' ? 'border-red-500' : 'border-transparent hover:border-red-200'}`}
                    >
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-gray-500 text-sm">Declined</p>
                                <p className="text-3xl font-bold text-red-600">{stats.declined || 0}</p>
                            </div>
                            <div className="text-4xl">❌</div>
                        </div>
                    </div>
                </div>

                {/* Error Message */}
                {error && (
                    <div className="bg-red-50 border border-red-400 text-red-700 px-4 py-3 rounded-lg">
                        {error}
                    </div>
                )}

                {/* Requests Table */}
                <div className="bg-white rounded-xl shadow-md overflow-hidden">
                    <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
                        <h3 className="text-lg font-semibold text-gray-800">
                            Company Signup Requests
                        </h3>
                        <button
                            onClick={() => handleStatusFilter('all')}
                            className={`text-sm px-3 py-1 rounded ${filters.status === 'all' ? 'bg-purple-100 text-purple-700' : 'text-gray-600 hover:bg-gray-100'}`}
                        >
                            Show All
                        </button>
                    </div>

                    {loading ? (
                        <div className="flex items-center justify-center h-64">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
                        </div>
                    ) : requests.length === 0 ? (
                        <div className="text-center py-12 text-gray-500">
                            No company requests found
                        </div>
                    ) : (
                        <>
                            <div className="overflow-x-auto">
                                <table className="min-w-full divide-y divide-gray-200">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Company</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Contact</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Industry</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Documents</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-200">
                                        {requests.map((request) => (
                                            <tr key={request._id} className="hover:bg-gray-50">
                                                <td className="px-6 py-4">
                                                    <div className="text-sm font-medium text-gray-900">{request.companyName}</div>
                                                    <div className="text-sm text-gray-500">{request.email}</div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <div className="text-sm text-gray-900">{request.contactPerson}</div>
                                                    <div className="text-sm text-gray-500">{request.phone}</div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                    {request.industry || '-'}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <button
                                                        onClick={() => setViewDocs(request)}
                                                        className="text-purple-600 hover:text-purple-800 text-sm font-medium"
                                                    >
                                                        📄 {request.verificationDocuments?.length || 0} file(s)
                                                    </button>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getStatusBadge(request.status)}`}>
                                                        {request.status}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                    {new Date(request.createdAt).toLocaleDateString()}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                                                    {request.status === 'pending' && (
                                                        <>
                                                            <button
                                                                onClick={() => setActionModal({ ...request, action: 'approve' })}
                                                                className="text-green-600 hover:text-green-900"
                                                            >
                                                                Approve
                                                            </button>
                                                            <button
                                                                onClick={() => setActionModal({ ...request, action: 'decline' })}
                                                                className="text-red-600 hover:text-red-900"
                                                            >
                                                                Decline
                                                            </button>
                                                        </>
                                                    )}
                                                    {request.status === 'approved' && (
                                                        <span className="text-green-600 text-xs font-medium">
                                                            ✓ Account Created
                                                        </span>
                                                    )}
                                                    {request.status === 'declined' && (
                                                        <span className="text-red-500 text-xs">
                                                            {request.declineReason ? `Reason: ${request.declineReason}` : '✗ Request Declined'}
                                                        </span>
                                                    )}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>

                            {/* Pagination */}
                            {pagination.totalPages > 1 && (
                                <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between">
                                    <div className="text-sm text-gray-700">
                                        Page {pagination.currentPage} of {pagination.totalPages}
                                    </div>
                                    <div className="flex space-x-2">
                                        <button
                                            onClick={() => handlePageChange(parseInt(pagination.currentPage) - 1)}
                                            disabled={pagination.currentPage === 1}
                                            className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                                        >
                                            Previous
                                        </button>
                                        <button
                                            onClick={() => handlePageChange(parseInt(pagination.currentPage) + 1)}
                                            disabled={pagination.currentPage === pagination.totalPages}
                                            className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                                        >
                                            Next
                                        </button>
                                    </div>
                                </div>
                            )}
                        </>
                    )}
                </div>
            </div>

            {/* Action Modal */}
            {actionModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-xl p-6 max-w-md w-full mx-4">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">
                            {actionModal.action === 'approve' ? '✅ Approve Company' : '❌ Decline Request'}
                        </h3>

                        <div className="mb-4 p-3 bg-gray-50 rounded-lg">
                            <p className="font-medium">{actionModal.companyName}</p>
                            <p className="text-sm text-gray-600">{actionModal.email}</p>
                        </div>

                        {actionModal.action === 'approve' ? (
                            <p className="text-gray-600 mb-6">
                                This will create the company account and send an approval email notification.
                            </p>
                        ) : (
                            <div className="mb-6">
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Reason for declining (optional)
                                </label>
                                <textarea
                                    value={declineReason}
                                    onChange={(e) => setDeclineReason(e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                    rows="3"
                                    placeholder="Enter reason for decline..."
                                />
                            </div>
                        )}

                        <div className="flex space-x-4">
                            <button
                                onClick={() => {
                                    setActionModal(null);
                                    setDeclineReason('');
                                }}
                                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                                disabled={processing}
                            >
                                Cancel
                            </button>
                            <button
                                onClick={actionModal.action === 'approve' ? handleApprove : handleDecline}
                                disabled={processing}
                                className={`flex-1 px-4 py-2 text-white rounded-lg ${actionModal.action === 'approve'
                                    ? 'bg-green-600 hover:bg-green-700'
                                    : 'bg-red-600 hover:bg-red-700'
                                    } disabled:opacity-50`}
                            >
                                {processing ? 'Processing...' : (actionModal.action === 'approve' ? 'Approve' : 'Decline')}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* View Documents Modal */}
            {viewDocs && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-xl p-6 max-w-lg w-full mx-4">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-lg font-semibold text-gray-900">
                                📄 Verification Documents
                            </h3>
                            <button
                                onClick={() => setViewDocs(null)}
                                className="text-gray-500 hover:text-gray-700"
                            >
                                ✕
                            </button>
                        </div>

                        <p className="text-sm text-gray-600 mb-4">{viewDocs.companyName}</p>

                        <div className="space-y-3">
                            {viewDocs.verificationDocuments?.map((doc, index) => (
                                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                    <div className="flex items-center space-x-3">
                                        <span className="text-2xl">
                                            {doc.mimetype?.includes('pdf') ? '📕' : '🖼️'}
                                        </span>
                                        <span className="text-sm text-gray-700 truncate max-w-[200px]">
                                            {doc.originalName}
                                        </span>
                                    </div>
                                    <a
                                        href={`${API_URL}${doc.path}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-purple-600 hover:text-purple-800 text-sm font-medium"
                                    >
                                        View
                                    </a>
                                </div>
                            ))}
                        </div>

                        <button
                            onClick={() => setViewDocs(null)}
                            className="mt-6 w-full px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200"
                        >
                            Close
                        </button>
                    </div>
                </div>
            )}
        </AdminLayout>
    );
};

export default CompanyRequests;
