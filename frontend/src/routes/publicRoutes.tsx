import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import CircularProgress from "@mui/material/CircularProgress";
import Box from "@mui/material/Box";

const PublicRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated, hasProfile, loading } = useAuth();

  // Loading state while checking authentication
  if (loading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  // If user is authenticated and has a profile, redirect to dashboard
  if (isAuthenticated && hasProfile) {
    return <Navigate to="/" replace />;
  }

  // If user is authenticated but no profile, redirect to quiz
  if (isAuthenticated && !hasProfile) {
    return <Navigate to="/quiz" replace />;
  }

  // If not authenticated, show the public route (login/signup page)
  return <>{children}</>;
};

export default PublicRoute;
