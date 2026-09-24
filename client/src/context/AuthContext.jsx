import React, { createContext, useContext, useState, useEffect } from 'react';
import { authService } from '../services/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [admin, setAdmin] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('fgag_token'));
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initAuth = async () => {
      const savedToken = localStorage.getItem('fgag_token');
      if (savedToken) {
        try {
          const res = await authService.getMe();
          if (res.data.success) {
            setAdmin(res.data.admin);
          }
        } catch (err) {
          console.error('Session validation error:', err);
          logout();
        }
      }
      setLoading(false);
    };

    initAuth();
  }, []);

  const login = async (email, password) => {
    const res = await authService.login({ email, password });
    if (res.data.success) {
      localStorage.setItem('fgag_token', res.data.token);
      localStorage.setItem('fgag_admin', JSON.stringify(res.data.admin));
      setToken(res.data.token);
      setAdmin(res.data.admin);
      return res.data;
    }
    throw new Error(res.data.message || 'Login failed');
  };

  const logout = () => {
    localStorage.removeItem('fgag_token');
    localStorage.removeItem('fgag_admin');
    setToken(null);
    setAdmin(null);
  };

  const updateAdminState = (updatedAdmin) => {
    setAdmin(updatedAdmin);
    localStorage.setItem('fgag_admin', JSON.stringify(updatedAdmin));
  };

  return (
    <AuthContext.Provider
      value={{
        admin,
        token,
        loading,
        isAuthenticated: !!token,
        login,
        logout,
        updateAdminState
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
