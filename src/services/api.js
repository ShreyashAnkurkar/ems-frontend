import axios from 'axios';

const API_URL = 'https://employee-management-system-production-9079.up.railway.app/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Automatically attach JWT token to every request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle token expiry globally
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 403) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;

// Helper functions for user roles
export const getUser = () => JSON.parse(localStorage.getItem('user') || '{}');
export const isAdmin = () => getUser().role === 'ROLE_ADMIN';
export const isEmployee = () => getUser().role === 'ROLE_EMPLOYEE';