import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { ThemeContext } from '../contexts/ThemeContext';
import api from '../services/api'; // Import your pre-configured axios instance
import './Login.css';

const Login = () => {
  const { theme } = useContext(ThemeContext);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // Use the default credentials from your .env as a reminder
      // Email: admin@portfolio.com
      // Pass: admin123
      const response = await api.post('/auth/login', {
        email,
        password,
      });

      // Check if login was successful based on the response structure
      // Assuming the server sends back { success: true, token: '...' }
      if (response.data && response.data.success && response.data.token) {
        console.log('Login successful:', response.data);
        // Store the token in localStorage
        localStorage.setItem('token', response.data.token);

        // --- FIX: Redirect to the admin panel page after login ---
        navigate('/admin');
        // --- END FIX ---

      } else {
        // Handle cases where the API call succeeded but login failed logically
        setError(response.data.message || 'Login failed. Please check your credentials.');
      }

    } catch (err) {
      // Handle network errors or server errors (e.g., 401, 500)
      const errorMessage = err.response?.data?.message || 'Login failed. Please check your credentials or server status.';
      setError(errorMessage);
      console.error('Login error:', err.response || err.message); // Log more details
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`login-container ${theme}`}>
      <form className="login-form" onSubmit={handleSubmit}>
        <h2>Admin Login</h2>

        {error && <p className="error-message">{error}</p>}

        <div className="form-group">
          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            autoComplete="email"
            aria-label="Admin Email"
          />
        </div>

        <div className="form-group">
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            autoComplete="current-password"
            aria-label="Admin Password"
          />
        </div>

        <button type="submit" disabled={loading}>
          {loading ? 'Logging in...' : 'Login'}
        </button>
      </form>
    </div>
  );
};

export default Login;
