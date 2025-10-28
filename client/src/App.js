import React, { useContext } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { ThemeProvider, ThemeContext } from './contexts/ThemeContext';
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
import Login from './components/Login';
import AdminPanel from './components/AdminPanel';
import ProtectedRoute from './components/ProtectedRoute'; // Import the ProtectedRoute component
import ScrollToTop from './components/ScrollToTop';
import './App.css';

// Main App component wrapped with ThemeProvider
const App = () => {
  return (
    <ThemeProvider>
      <AppContent />
    </ThemeProvider>
  );
};

// Separate component to consume ThemeContext
const AppContent = () => {
  const { theme } = useContext(ThemeContext);

  return (
    <Router>
      <div className={`App ${theme}`}>
        <ScrollToTop />
        <Navbar />
        <main>
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<HomePage />} />
            <Route path="/login" element={<Login />} />

            {/* Protected Admin Route */}
            {/* Wrap the AdminPanel route within the ProtectedRoute */}
            <Route element={<ProtectedRoute />}>
              <Route path="/admin" element={<AdminPanel />} />
            </Route>

            {/* Optional: Add a 404 Not Found route */}
            {/* <Route path="*" element={<NotFound />} /> */}
          </Routes>
        </main>
        {/* Footer might need conditional rendering if you don't want it on login/admin pages */}
        {/* Example: Add logic based on location if needed */}
        {/* <Footer /> */}
      </div>
    </Router>
  );
};

// Component to render all sections for the home page
const HomePage = () => {
  // FIX: Removed unused theme variable declaration
  // const { theme } = useContext(ThemeContext);
  return (
    <>
      <Home />
      <About />
      <Skills />
      <Projects />
      <Certifications />
      <Experience />
      <Education />
      <Contact />
      <Footer /> {/* Include Footer here since it's part of the main page layout */}
    </>
  );
};


export default App;

