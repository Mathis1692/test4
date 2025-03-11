import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../src/conext/AuthContext';

export default function ProtectedRoute({ children }) {
  const { isAuthenticated } = useAuth();
  
  // Redirect to login if not authenticated
  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }
  
  // Render children if authenticated
  return children;
}