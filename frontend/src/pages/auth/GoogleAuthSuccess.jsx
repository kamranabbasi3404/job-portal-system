import React, { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext';
import Loader from '../../../components/common/Loader';

const GoogleAuthSuccess = () => {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const { login } = useAuth();

    useEffect(() => {
        const token = searchParams.get('token');
        const userString = searchParams.get('user');

        if (token && userString) {
            try {
                const user = JSON.parse(decodeURIComponent(userString));

                // Store in localStorage
                localStorage.setItem('token', token);
                localStorage.setItem('user', JSON.stringify(user));

                // Redirect based on role
                if (user.role === 'employer') {
                    navigate('/employer/dashboard');
                } else {
                    navigate('/jobseeker/dashboard');
                }
            } catch (error) {
                console.error('Error processing Google auth:', error);
                navigate('/login?error=auth_failed');
            }
        } else {
            navigate('/login?error=auth_failed');
        }
    }, [searchParams, navigate]);

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
            <div className="text-center">
                <Loader size="large" />
                <p className="mt-4 text-gray-600">Completing sign in...</p>
            </div>
        </div>
    );
};

export default GoogleAuthSuccess;
