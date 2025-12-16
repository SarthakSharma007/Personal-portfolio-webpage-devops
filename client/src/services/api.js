import axios from 'axios';

const api = axios.create({
  baseURL: '/api', // Your backend API prefix
});

// Add a request interceptor to include the token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      // The backend middleware expects 'x-auth-token'
      config.headers['x-auth-token'] = token;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add a response interceptor to handle token expiration globally
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // Don't redirect if we are already trying to login
      if (!error.config.url.includes('/auth/login')) {
        // Clear token if invalid/expired
        localStorage.removeItem('token');
        // Redirect to login page
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export default api;

