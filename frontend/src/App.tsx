import LoginPage from './pages/LoginPage'
import Dashboard from './pages/Dashboard'
import './App.css'

import PublicRoute from './routes/publicRoutes'
import ProtectedRoute from './routes/protectedRoutes'

import { createBrowserRouter, RouterProvider } from 'react-router-dom'
function App() {

    const router = createBrowserRouter([
      {
        path: "/login",
        element: <PublicRoute><LoginPage /></PublicRoute>
      },
      {
        path: "/",
        element: <ProtectedRoute><Dashboard /></ProtectedRoute>
      }
    ])
  return (
    <>

      <RouterProvider router={router} />
    
    </>
  )
}

export default App
