import React, { createContext, useContext, useState, useEffect } from 'react';
import { authApi } from '../services/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('placementpilot_token'));
  const [loading, setLoading] = useState(true);

  // Check existing token on mount
  useEffect(() => {
    const initAuth = async () => {
      const storedToken = localStorage.getItem('placementpilot_token');
      if (storedToken) {
        try {
          const res = await authApi.getMe();
          if (res.success) {
            setUser(res.user);
            setProfile(res.profile);
          } else {
            logout();
          }
        } catch (err) {
          console.warn('Session verification failed:', err.message);
          logout();
        }
      }
      setLoading(false);
    };

    initAuth();
  }, []);

  const login = async (email, password) => {
    const res = await authApi.login({ email, password });
    if (res.success && res.token) {
      localStorage.setItem('placementpilot_token', res.token);
      setToken(res.token);
      setUser(res.user);
      setProfile(res.profile);
    }
    return res;
  };

  const register = async (userData) => {
    const res = await authApi.register(userData);
    if (res.success && res.token) {
      localStorage.setItem('placementpilot_token', res.token);
      setToken(res.token);
      setUser(res.user);
      setProfile(res.profile);
    }
    return res;
  };

  const logout = async () => {
    try {
      await authApi.logout();
    } catch (err) {
      // Proceed even if server is offline
      console.warn('Logout API notification failed:', err.message);
    } finally {
      localStorage.removeItem('placementpilot_token');
      setToken(null);
      setUser(null);
      setProfile(null);
    }
  };

  const refreshUser = async () => {
    try {
      const res = await authApi.getMe();
      if (res.success) {
        setUser(res.user);
        setProfile(res.profile);
      }
    } catch (err) {
      console.error('Error refreshing user:', err);
    }
  };

  const updateLocalProfile = (newProfile) => {
    setProfile(prev => ({ ...prev, ...newProfile }));
    if (newProfile.name) {
      setUser(prev => prev ? { ...prev, name: newProfile.name } : prev);
    }
  };

  const value = {
    user,
    profile,
    token,
    loading,
    isAuthenticated: !!token && !!user,
    login,
    register,
    logout,
    refreshUser,
    updateLocalProfile,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
