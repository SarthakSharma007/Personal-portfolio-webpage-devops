import axios from 'axios';

const api = axios.create({
  // This is the fix:
  // We change '/api' to the full backend URL.
  baseURL: 'http://localhost:5000/api', 
  
  withCredentials: true,
});

// Interceptor to automatically add the auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor for response errors (e.g., token expired)
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Handle unauthorized errors, e.g., redirect to login
      localStorage.removeItem('token');
      // You could redirect here:
      // window.location.href = '/login'; 
      console.error('Unauthorized, token might be invalid or expired.');
    }
    return Promise.reject(error);
  }
);

export default api;