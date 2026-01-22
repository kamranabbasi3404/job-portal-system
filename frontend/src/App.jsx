import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
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
import Jobs from './pages/Jobs';
import JobDetails from './pages/JobDetails';
import Companies from './pages/Companies';

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

function AppContent() {
  const { user, logout, loading } = useAuth();

  if (loading) {
    return <Loader fullScreen />;
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar user={user} onLogout={logout} />
      <main className="flex-grow">
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/jobs" element={<Jobs />} />
          <Route path="/jobs/:id" element={<JobDetails />} />
          <Route path="/companies" element={<Companies />} />

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
        </Routes>
      </main>
      <Footer />
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
