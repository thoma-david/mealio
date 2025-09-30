import LoginPage from "./pages/LoginPage";
import Dashboard from "./pages/Dashboard";
import WeekPage from "./pages/WeekPage";
import ExplorePage from "./pages/ExplorePage";
import FavoritesPage from "./pages/FavoritesPage";
import "./App.css";

import PublicRoute from "./routes/publicRoutes";
import ProtectedRoute from "./routes/protectedRoutes";

import { createBrowserRouter, RouterProvider } from "react-router-dom";
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
      path: "/",
      element: (
        <ProtectedRoute>
          <Dashboard />
        </ProtectedRoute>
      ),
    },
    {
      path: "/explore",
      element: (
        <ProtectedRoute>
          <ExplorePage />
        </ProtectedRoute>
      ),
    },
    {
      path: "/favorites",
      element: (
        <ProtectedRoute>
          <FavoritesPage />
        </ProtectedRoute>
      ),
    },
    {
      path: "/week",
      element: (
        <ProtectedRoute>
          <WeekPage />
        </ProtectedRoute>
      ),
    },
  ]);
  return (
    <>
      <RouterProvider router={router} />
    </>
  );
}

export default App;
