import React, { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import { authAPI } from '../lib/api';
import type { User, UserRole } from '../types/shared';
import { useLoading } from './LoadingContext';

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  register: (userData: {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    role?: UserRole;
  }) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  updateUser: (userData: Partial<User>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { setGlobalLoading } = useLoading();

  // Check for existing token on app load
  useEffect(() => {
    const checkAuthStatus = async () => {
      const token = localStorage.getItem('access_token');
      if (token) {
        try {
          const response = await authAPI.getCurrentUser();
          if (response.data) {
            setUser(response.data as User);
          } else {
            // Token is invalid, remove it
            localStorage.removeItem('access_token');
          }
        } catch (error) {
          console.error('Failed to get current user:', error);
          localStorage.removeItem('access_token');
        }
      }
      setIsLoading(false);
    };

    checkAuthStatus();
  }, []);

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    setGlobalLoading(true, 'Signing you in...');

    try {
      const response = await authAPI.login(email, password);
      if (response.data) {
        setUser(response.data.user);
        setGlobalLoading(false);
        return { success: true };
      } else {
        setGlobalLoading(false);
        return { success: false, error: response.error || 'Login failed' };
      }
    } catch (error) {
      console.error('Login error:', error);
      setGlobalLoading(false);
      return { success: false, error: 'Network error occurred' };
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (userData: {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    role?: string;
  }) => {
    setIsLoading(true);
    setGlobalLoading(true, 'Creating your account...');

    try {
      const response = await authAPI.register(userData);
      if (response.data) {
        // Auto-login after successful registration
        setGlobalLoading(false);
        return await login(userData.email, userData.password);
      } else {
        setGlobalLoading(false);
        return { success: false, error: response.error || 'Registration failed' };
      }
    } catch (error) {
      console.error('Registration error:', error);
      setGlobalLoading(false);
      return { success: false, error: 'Network error occurred' };
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    try {
      // Clear authentication token from localStorage
      localStorage.removeItem('access_token');

      // Clear user state
      setUser(null);

      // Reset loading state
      setIsLoading(false);

      // Call API logout (this will handle server-side cleanup if needed)
      authAPI.logout();

      console.log('User logged out successfully');
    } catch (error) {
      console.error('Error during logout:', error);
      // Even if there's an error, clear local state
      localStorage.removeItem('access_token');
      setUser(null);
      setIsLoading(false);
    }
  };

  const updateUser = (userData: Partial<User>) => {
    if (user) {
      setUser({ ...user, ...userData });
    }
  };

  const value: AuthContextType = {
    user,
    isLoading,
    isAuthenticated: !!user,
    login,
    register,
    logout,
    updateUser,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};