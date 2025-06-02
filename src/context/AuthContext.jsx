import React, { createContext, useContext, useState, useEffect } from "react";
import { toast } from "@/components/ui/use-toast";
import { apiRequest } from '@/lib/api';

const AuthContext = createContext();

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem('shreerangUser');
    const storedToken = localStorage.getItem('shreerangToken');
    if (storedUser && storedToken) {
      setUser(JSON.parse(storedUser));
      setToken(storedToken);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    // Social login: check for token in URL
    const params = new URLSearchParams(window.location.search);
    const token = params.get('token');
    if (token) {
      // Fetch user info from backend using token
      (async () => {
        try {
          const res = await apiRequest(`${API_URL}/auth/me`, 'GET', null, token);
          setUser(res.user);
          setToken(token);
          localStorage.setItem('shreerangUser', JSON.stringify(res.user));
          localStorage.setItem('shreerangToken', token);
          toast({ title: 'Login Successful', description: 'Welcome back!' });
        } catch (err) {
          toast({ title: 'Social Login Failed', description: err.message, variant: 'destructive' });
        }
      })();
    }
  }, []);

  // Login with backend
  const login = async (email, password) => {
    setLoading(true);
    try {
      const res = await apiRequest(`${API_URL}/auth/login`, 'POST', { email, password });
      setUser(res.user);
      setToken(res.token);
      localStorage.setItem('shreerangUser', JSON.stringify(res.user));
      localStorage.setItem('shreerangToken', res.token);
      toast({ title: 'Login Successful', description: 'Welcome back!' });
      return res.user;
    } catch (err) {
      toast({ title: 'Login Failed', description: err.message, variant: 'destructive' });
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Register
  const register = async (name, email, password, mobile) => {
    setLoading(true);
    try {
      await apiRequest(`${API_URL}/auth/register`, 'POST', { name, email, password, mobile });
      toast({ title: 'Registration Successful', description: 'You can now log in.' });
    } catch (err) {
      toast({ title: 'Registration Failed', description: err.message, variant: 'destructive' });
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('shreerangUser');
    localStorage.removeItem('shreerangToken');
    setUser(null);
    setToken(null);
    toast({ title: 'Logged Out', description: 'You have been successfully logged out.' });
  };

  // Add purchase to history (optional, can be handled by backend)
  const addPurchaseToHistory = (order) => {
    if (user) {
      const updatedUser = {
        ...user,
        purchaseHistory: [order, ...(user.purchaseHistory || [])]
      };
      setUser(updatedUser);
      localStorage.setItem('shreerangUser', JSON.stringify(updatedUser));
    }
  };

  return (
    <AuthContext.Provider value={{ user, token, login, register, logout, loading, addPurchaseToHistory }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};