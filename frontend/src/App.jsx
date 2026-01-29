import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { AuthProvider, useAuth } from './context/AuthContext';
import Navbar from './components/common/Navbar';
import Footer from './components/common/Footer';
import ProtectedRoute from './components/common/ProtectedRoute';
import Loader from './components/common/Loader';

// Pages
import Home from './pages/Home';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import ForgotPassword from './pages/auth/ForgotPassword';
import Jobs from './pages/Jobs';
import JobDetails from './pages/JobDetails';
import Companies from './pages/Companies';
import CompanyJobs from './pages/CompanyJobs';

// Job Seeker Pages
import JobSeekerDashboard from './pages/jobseeker/Dashboard';
import JobSeekerProfile from './pages/jobseeker/Profile';
import Applications from './pages/jobseeker/Applications';
import SavedJobs from './pages/jobseeker/SavedJobs';

// Employer Pages
import EmployerDashboard from './pages/employer/Dashboard';
import PostJob from './pages/employer/PostJob';
import EditJob from './pages/employer/EditJob';
import ManageJobs from './pages/employer/ManageJobs';
import EmployerApplications from './pages/employer/Applications';
import EmployerProfile from './pages/employer/Profile';

// Admin Pages
import AdminLogin from './pages/admin/AdminLogin';
import AdminDashboard from './pages/admin/Dashboard';
import AdminUsers from './pages/admin/Users';
import AdminJobs from './pages/admin/Jobs';
import AdminApplications from './pages/admin/Applications';
import AdminCompanyRequests from './pages/admin/CompanyRequests';
import AdminProtectedRoute from './components/admin/AdminProtectedRoute';

function AppContent() {
  const { user, logout, loading } = useAuth();
  const location = useLocation();

  // Check if current route is an admin route
  const isAdminRoute = location.pathname.startsWith('/admin');

  if (loading) {
    return <Loader fullScreen />;
  }

  return (
    <div className="flex flex-col min-h-screen">
      {!isAdminRoute && <Navbar user={user} onLogout={logout} />}
      <main className="flex-grow">
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/jobs" element={<Jobs />} />
          <Route path="/jobs/:id" element={<JobDetails />} />
          <Route path="/companies" element={<Companies />} />
          <Route path="/companies/:id/jobs" element={<CompanyJobs />} />

          {/* Job Seeker Protected Routes */}
          <Route
            path="/jobseeker/dashboard"
            element={
              <ProtectedRoute user={user} requiredRole="jobseeker">
                <JobSeekerDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/jobseeker/profile"
            element={
              <ProtectedRoute user={user} requiredRole="jobseeker">
                <JobSeekerProfile />
              </ProtectedRoute>
            }
          />
          <Route
            path="/jobseeker/applications"
            element={
              <ProtectedRoute user={user} requiredRole="jobseeker">
                <Applications />
              </ProtectedRoute>
            }
          />
          <Route
            path="/jobseeker/saved-jobs"
            element={
              <ProtectedRoute user={user} requiredRole="jobseeker">
                <SavedJobs />
              </ProtectedRoute>
            }
          />

          {/* Employer Protected Routes */}
          <Route
            path="/employer/dashboard"
            element={
              <ProtectedRoute user={user} requiredRole="employer">
                <EmployerDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/employer/post-job"
            element={
              <ProtectedRoute user={user} requiredRole="employer">
                <PostJob />
              </ProtectedRoute>
            }
          />
          <Route
            path="/employer/edit-job/:id"
            element={
              <ProtectedRoute user={user} requiredRole="employer">
                <EditJob />
              </ProtectedRoute>
            }
          />
          <Route
            path="/employer/manage-jobs"
            element={
              <ProtectedRoute user={user} requiredRole="employer">
                <ManageJobs />
              </ProtectedRoute>
            }
          />
          <Route
            path="/employer/applications"
            element={
              <ProtectedRoute user={user} requiredRole="employer">
                <EmployerApplications />
              </ProtectedRoute>
            }
          />
          <Route
            path="/employer/profile"
            element={
              <ProtectedRoute user={user} requiredRole="employer">
                <EmployerProfile />
              </ProtectedRoute>
            }
          />

          {/* Admin Routes */}
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route
            path="/admin/dashboard"
            element={
              <AdminProtectedRoute>
                <AdminDashboard />
              </AdminProtectedRoute>
            }
          />
          <Route
            path="/admin/users"
            element={
              <AdminProtectedRoute>
                <AdminUsers />
              </AdminProtectedRoute>
            }
          />
          <Route
            path="/admin/jobs"
            element={
              <AdminProtectedRoute>
                <AdminJobs />
              </AdminProtectedRoute>
            }
          />
          <Route
            path="/admin/applications"
            element={
              <AdminProtectedRoute>
                <AdminApplications />
              </AdminProtectedRoute>
            }
          />
          <Route
            path="/admin/company-requests"
            element={
              <AdminProtectedRoute>
                <AdminCompanyRequests />
              </AdminProtectedRoute>
            }
          />
        </Routes>
      </main>
      {!isAdminRoute && <Footer />}
    </div>
  );
}

function App() {
  return (
    <GoogleOAuthProvider clientId="9724369519-30a5ou6ubkfui1im63k6l4o9u742iopt.apps.googleusercontent.com">
      <AuthProvider>
        <Router>
          <AppContent />
        </Router>
      </AuthProvider>
    </GoogleOAuthProvider>
  );
}

export default App;
