import React from 'react';
// --- FIX: Add 'useNavigate' to the import list ---
import { Routes, Route, Navigate, useNavigate } from 'react-router-dom'; 
import { useTheme } from './contexts/ThemeContext';
import Navbar from './components/Navbar';
import Home from './components/Home';
import About from './components/About';
import Skills from './components/Skills';
import Projects from './components/Projects';
import Certifications from './components/Certifications';
import Experience from './components/Experience';
import Education from './components/Education';
import Contact from './components/Contact';
import Footer from './components/Footer';
import ScrollToTop from './components/ScrollToTop';
import Login from './components/Login';
import './App.css';

// --- Simple Admin Panel Placeholder ---
const AdminPanel = () => {
  const navigate = useNavigate(); // Hook for navigation

  const handleLogout = () => {
    localStorage.removeItem('token'); // Clear the token
    navigate('/login'); // Redirect to login page
  };

  return (
    <div style={{ padding: '2rem', minHeight: '100vh', background: '#f0f0f0' }}>
      <h1>Admin Panel</h1>
      <p>Welcome, Admin! This is a placeholder for your admin content.</p>
      {/* Add a simple logout button */}
      <button
        onClick={handleLogout}
        style={{ padding: '10px 20px', marginTop: '20px', cursor: 'pointer' }}
      >
        Logout
      </button>
    </div>
  );
};
// --- End Admin Panel Placeholder ---

// --- Protected Route Component (Basic Example) ---
const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem('token');
  if (!token) {
    // If no token, redirect to login
    return <Navigate to="/login" replace />;
  }
  // If token exists, render the child component (AdminPanel)
  return children;
};
// --- End Protected Route Component ---


const HomePage = () => {
  return (
    <>
      <Navbar />
      <main>
        <Home />
        <About />
        <Skills />
        <Projects />
        <Certifications />
        <Experience />
        <Education />
        <Contact />
      </main>
      <Footer />
      <ScrollToTop />
    </>
  );
};

function App() {
  const { theme } = useTheme();

  return (
    <div className={`App ${theme}`}>
      <Routes>
        {/* Route for the login page */}
        <Route path="/login" element={<Login />} />

        {/* --- FIX: Add the Admin Panel Route --- */}
        {/* Wrap AdminPanel with ProtectedRoute */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute>
              <AdminPanel />
            </ProtectedRoute>
          }
        />
        {/* --- END FIX --- */}

        {/* Route for all other paths (your main portfolio) */}
        <Route path="/*" element={<HomePage />} />
      </Routes>
    </div>
  );
}

export default App;

