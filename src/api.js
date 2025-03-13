import axios from 'axios';

const API_URL = 'http://localhost:8000';

// Create an Axios instance
const api = axios.create({
  baseURL: API_URL,
});

// Add token to headers if available
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('access_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
