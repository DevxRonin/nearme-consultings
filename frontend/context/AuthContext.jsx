'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';
import toast from 'react-hot-toast';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check saved credentials
    try {
      const storedToken = localStorage.getItem('nearme_token');
      const storedUser = localStorage.getItem('nearme_user');
      if (storedToken && storedUser) {
        setToken(storedToken);
        setUser(JSON.parse(storedUser));
      }
    } catch (e) {
      console.error('Failed to load session:', e);
    } finally {
      setLoading(false);
    }
  }, []);

  const login = async (email, password) => {
    try {
      const res = await api.post('/api/auth/login', { email, password });
      if (res.data.success) {
        const userData = res.data.data;
        setUser(userData);
        setToken(userData.token);
        localStorage.setItem('nearme_token', userData.token);
        localStorage.setItem('nearme_user', JSON.stringify(userData));
        toast.success(`Welcome back, ${userData.name}!`);
        return true;
      }
    } catch (err) {
      toast.error(err.message || 'Login failed');
      throw err;
    }
  };

  const register = async (formData) => {
    try {
      const res = await api.post('/api/auth/register', formData);
      if (res.data.success) {
        const userData = res.data.data;
        setUser(userData);
        setToken(userData.token);
        localStorage.setItem('nearme_token', userData.token);
        localStorage.setItem('nearme_user', JSON.stringify(userData));
        toast.success(`Account created! Welcome, ${userData.name}!`);
        return true;
      }
    } catch (err) {
      toast.error(err.message || 'Registration failed');
      throw err;
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('nearme_token');
    localStorage.removeItem('nearme_user');
    toast.success('Logged out successfully');
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        isAuthenticated: !!user,
        login,
        register,
        logout
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
