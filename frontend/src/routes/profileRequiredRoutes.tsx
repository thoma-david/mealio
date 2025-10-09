import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { CircularProgress, Box } from '@mui/material';
import Navbar from '../components/Navbar';

interface ProfileRequiredRouteProps {
  children: React.ReactNode;
}

const ProfileRequiredRoute: React.FC<ProfileRequiredRouteProps> = ({ children }) => {
  const { isAuthenticated, hasProfile, loading } = useAuth();

  if (loading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="100vh"
      >
        <CircularProgress />
      </Box>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (!hasProfile) {
    return <Navigate to="/quiz" replace />;
  }

  return (
    <>
      <Navbar />
      <Box sx={{ pt: 8, pb: 2 }}>
        {children}
      </Box>
    </>
  );
};

export default ProfileRequiredRoute;