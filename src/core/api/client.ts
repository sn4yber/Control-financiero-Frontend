import axios from 'axios';

// Usamos /api para aprovechar el proxy de Vite (dev) y Netlify (prod) y evitar problemas de CORS
const API_URL = '/api';

export const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptores para manejo de tokens (JWT) en el futuro
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
