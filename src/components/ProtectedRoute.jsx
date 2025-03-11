import React from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

/**
 * A route wrapper that protects routes requiring authentication
 * Uses React Router's built-in navigation features
 */
const ProtectedRoute = ({ requireVerification = true }) => {
  const { currentUser, loading } = useAuth();
  const location = useLocation();
  
  // Show loading spinner while auth state is being determined
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="mt-2 text-purple-600">Loading...</p>
        </div>
      </div>
    );
  }
  
  // If not authenticated, redirect to login with the current location for redirect after login
  if (!currentUser) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }
  
  // If verification is required but user is not verified, redirect to verification page
  if (requireVerification && !currentUser.emailVerified) {
    return <Navigate to="/verify-email" replace />;
  }
  
  // If all checks pass, render the child routes using React Router's Outlet
  return <Outlet />;
};

export default ProtectedRoute;