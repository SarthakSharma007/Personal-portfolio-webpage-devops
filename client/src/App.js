import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
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
import AdminPanel from './components/AdminPanel';
import './App.css';

// ✅ ProtectedRoute Component
const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem('token');
  return token ? children : <Navigate to="/login" replace />;
};

// ✅ HomePage (Public Portfolio)
const HomePage = () => (
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

function App() {
  const { theme } = useTheme();

  return (
    <div className={`App ${theme}`}>
      <Routes>
        {/* Login Route */}
        <Route path="/login" element={<Login />} />

        {/* Protected Admin Panel Route */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute>
              <AdminPanel />
            </ProtectedRoute>
          }
        />

        {/* Fallback to Portfolio */}
        <Route path="/*" element={<HomePage />} />
      </Routes>
    </div>
  );
}

export default App;
