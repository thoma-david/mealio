
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';


const ProtectedRoute = ({children}: {children: React.ReactNode}) => {
  const { isAuthenticated, loading } = useAuth();

  // Loading state while checking authentication
  if (loading) {
    return  <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
      <CircularProgress />
    </Box> // oder einen Spinner
  }

  // If user is NOT authenticated, redirect to login
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // If authenticated, show the protected content
  return <>{children}</>;
}

export default ProtectedRoute