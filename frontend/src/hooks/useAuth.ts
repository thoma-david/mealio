import { useState, useEffect } from 'react';
import { auth, login as apiLogin, logout as apiLogout } from '../api/auth';

interface User {
  id: string;
  name: string;
  email: string;
}

export const useAuth = () => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const checkAuth = async () => {
    try {
      setLoading(true);
      const authenticated = await auth.isUser();
      setIsAuthenticated(authenticated);
      
      // Wenn authentifiziert, hole User-Daten
      if (authenticated) {
        // TODO: API Call um User-Daten zu holen
        // setUser(userData);
      }
    } catch (error) {
      console.error('Auth check failed:', error);
      setIsAuthenticated(false);
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const login = async (email: string, password: string) => {
    try {
      const result = await apiLogin(email, password);
      
      if (result.success) {
        setIsAuthenticated(true);
        // TODO: setUser(result.user); wenn Backend User-Daten zurückgibt
        await checkAuth(); // Refresh auth state
      }
      
      return result;
    } catch (error) {
      console.error('Login failed:', error);
      return { success: false, message: 'Network error. Please try again.' };
    }
  };

  const logout = async () => {
    try {
      await apiLogout();
    } catch (error) {
      console.error('Logout failed:', error);
    } finally {
      setIsAuthenticated(false);
      setUser(null);
    }
  };

  useEffect(() => {
    checkAuth();
  }, []);

  return {
    isAuthenticated,
    user,
    loading,
    login,
    logout,
    checkAuth
  };
};