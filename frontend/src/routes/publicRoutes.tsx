
import React, { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import {auth} from '../api/auth';
import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';

const PublicRoute = ({children}: {children: React.ReactNode}) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

  useEffect(() => {
    const checkAuth = async () => {
      const authenticated = await auth.isUser();
      setIsAuthenticated(authenticated);
    };

    checkAuth();
  }, []);

  // Loading state while checking authentication
  if (isAuthenticated === null) {
    return <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
      <CircularProgress />
    </Box>
  }

  // If user is authenticated, redirect to dashboard
  if (isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  // If not authenticated, show the public route (login page)
  return <>{children}</>;
}

export default PublicRoute