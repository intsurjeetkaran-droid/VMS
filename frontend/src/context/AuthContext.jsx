/**
 * Auth Context
 * - Provides user state and auth actions to the entire app
 * - Persists token and user in localStorage
 */
import { createContext, useContext, useState, useEffect } from 'react';
import { login as loginApi, getMe } from '../services/authService';
import toast from 'react-hot-toast';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true); // true while checking stored token

  // On mount, restore session from localStorage
  useEffect(() => {
    const token = localStorage.getItem('vms_token');
    const storedUser = localStorage.getItem('vms_user');
    if (token && storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  const login = async (credentials) => {
    const { data } = await loginApi(credentials);
    const { user, token } = data.data;
    localStorage.setItem('vms_token', token);
    localStorage.setItem('vms_user', JSON.stringify(user));
    setUser(user);
    return user;
  };

  const logout = () => {
    localStorage.removeItem('vms_token');
    localStorage.removeItem('vms_user');
    setUser(null);
    toast.success('Logged out');
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};
