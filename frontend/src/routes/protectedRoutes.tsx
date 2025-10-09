import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import CircularProgress from "@mui/material/CircularProgress";
import Box from "@mui/material/Box";
import Navbar from "../components/Navbar";

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
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
    ); // oder einen Spinner
  }

  // If user is NOT authenticated, redirect to login
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // If user already has a profile, redirect to dashboard (prevents re-taking quiz)
  if (hasProfile) {
    return <Navigate to="/" replace />;
  }

  // If authenticated but no profile, show the protected content (quiz)
  return (
    <>
      <Navbar />
      <div className="my-20 bg-blue-200">{children}</div>
    </>
  );
};

export default ProtectedRoute;
