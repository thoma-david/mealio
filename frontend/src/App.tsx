import LoginPage from "./pages/LoginPage";
import Dashboard from "./pages/Dashboard";
import WeekPage from "./pages/WeekPage";
import ExplorePage from "./pages/ExplorePage";
import FavoritesPage from "./pages/FavoritesPage";
import SignupPage from "./pages/SignUpPage";
import ProgressPage from "./pages/ProgressPage";

import "./App.css";

import PublicRoute from "./routes/publicRoutes";
import ProtectedRoute from "./routes/protectedRoutes";

import {
  createBrowserRouter,
  RouterProvider,
  Navigate,
} from "react-router-dom";
import QuizWrapper from "./components/QuizWrapper";
import ProfileRequiredRoute from "./routes/profileRequiredRoutes";
import Settings from "./pages/Settings";
import { AuthProvider } from "./context/AuthContext";

function App() {
  const router = createBrowserRouter([
    {
      path: "/login",
      element: (
        <PublicRoute>
          <LoginPage />
        </PublicRoute>
      ),
    },
    {
      path: "/signup",
      element: (
        <PublicRoute>
          <SignupPage />
        </PublicRoute>
      ),
    },
    {
      path: "/quiz",
      element: (
        <ProtectedRoute>
          <QuizWrapper />
        </ProtectedRoute>
      ),
    },
    {
      path: "/",
      element: (
        <ProfileRequiredRoute>
          <Dashboard />
        </ProfileRequiredRoute>
      ),
    },
    {
      path: "/explore",
      element: (
        <ProfileRequiredRoute>
          <ExplorePage />
        </ProfileRequiredRoute>
      ),
    },
    {
      path: "/favorites",
      element: (
        <ProfileRequiredRoute>
          <FavoritesPage />
        </ProfileRequiredRoute>
      ),
    },
    {
      path: "/week",
      element: (
        <ProfileRequiredRoute>
          <WeekPage />
        </ProfileRequiredRoute>
      ),
    },
    {
      path: "/progress",
      element: (
        <ProfileRequiredRoute>
          <ProgressPage />
        </ProfileRequiredRoute>
      ),
    },
    {
      path: "/settings",
      element: (
        <ProfileRequiredRoute>
          <Settings />
        </ProfileRequiredRoute>
      ),
    },
    {
      path: "*",
      element: <Navigate to="/" replace />,
    },
  ]);
  return (
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  );
}

export default App;
