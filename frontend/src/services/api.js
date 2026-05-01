/**
 * Axios instance with base URL and JWT interceptor
 * - Automatically attaches token to every request
 * - Handles 401 by clearing auth and redirecting to login
 */
import axios from 'axios';

const api = axios.create({
  baseURL: '/api',
  headers: { 'Content-Type': 'application/json' },
});

// Attach JWT token from localStorage to every request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('vms_token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Handle expired/invalid token globally
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('vms_token');
      localStorage.removeItem('vms_user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;
