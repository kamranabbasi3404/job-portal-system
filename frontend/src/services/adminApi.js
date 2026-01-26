import axios from 'axios';

// Set base URL from environment variable or default to localhost
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

// Create a dedicated axios instance for admin API
const adminAxios = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Add admin token to requests
adminAxios.interceptors.request.use(
    (config) => {
        const adminToken = localStorage.getItem('adminToken');
        if (adminToken) {
            config.headers.Authorization = `Bearer ${adminToken}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// Handle response errors
adminAxios.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            // Token expired or invalid
            localStorage.removeItem('adminToken');
            localStorage.removeItem('adminUser');
            window.location.href = '/admin/login';
        }
        return Promise.reject(error);
    }
);

// Admin login
export const adminLogin = async (email, password) => {
    const response = await adminAxios.post('/api/admin/login', { email, password });
    return response.data;
};

// Dashboard stats
export const getDashboardStats = async () => {
    const response = await adminAxios.get('/api/admin/dashboard');
    return response.data;
};

// User management
export const getAllUsers = async (params) => {
    const response = await adminAxios.get('/api/admin/users', { params });
    return response.data;
};

export const getUserById = async (id) => {
    const response = await adminAxios.get(`/api/admin/users/${id}`);
    return response.data;
};

export const deleteUser = async (id) => {
    const response = await adminAxios.delete(`/api/admin/users/${id}`);
    return response.data;
};

// Job management
export const getAllJobs = async (params) => {
    const response = await adminAxios.get('/api/admin/jobs', { params });
    return response.data;
};

export const updateJobStatus = async (id, status) => {
    const response = await adminAxios.put(`/api/admin/jobs/${id}`, { status });
    return response.data;
};

export const deleteJob = async (id) => {
    const response = await adminAxios.delete(`/api/admin/jobs/${id}`);
    return response.data;
};

// Application management
export const getAllApplications = async (params) => {
    const response = await adminAxios.get('/api/admin/applications', { params });
    return response.data;
};

// Company Signup Requests management
export const getPendingCompanyRequests = async (params) => {
    const response = await adminAxios.get('/api/pending-company/admin', { params });
    return response.data;
};

export const getCompanyRequestById = async (id) => {
    const response = await adminAxios.get(`/api/pending-company/admin/${id}`);
    return response.data;
};

export const approveCompanyRequest = async (id) => {
    const response = await adminAxios.put(`/api/pending-company/admin/${id}/approve`);
    return response.data;
};

export const declineCompanyRequest = async (id, reason) => {
    const response = await adminAxios.put(`/api/pending-company/admin/${id}/decline`, { reason });
    return response.data;
};
