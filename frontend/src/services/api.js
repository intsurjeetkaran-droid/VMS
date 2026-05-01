/**
 * Axios instance
 * - In production: points to the Render backend URL
 * - In development: uses Vite proxy → localhost:5000
 * - Auto-attaches JWT token to every request
 * - Handles 401 globally
 */
import axios from 'axios';

// VITE_API_URL is set in frontend/.env (local) or Render env vars (production)
// Falls back to '/api' for local dev via Vite proxy
const BASE_URL = import.meta.env.VITE_API_URL || '/api';

const api = axios.create({
  baseURL: BASE_URL,
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
