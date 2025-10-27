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
import AdminPanel from './components/AdminPanel'; // Import the new AdminPanel
import './App.css';

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

        {/* --- UPDATE: Use the imported AdminPanel --- */}
        {/* Wrap AdminPanel with ProtectedRoute */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute>
              <AdminPanel /> {/* Use the actual component */}
            </ProtectedRoute>
          }
        />
        {/* --- END UPDATE --- */}

        {/* Route for all other paths (your main portfolio) */}
        <Route path="/*" element={<HomePage />} />
      </Routes>
    </div>
  );
}

export default App;
