import React, { useContext } from 'react';
import { Routes, Route } from 'react-router-dom';
import { ThemeContext } from './contexts/ThemeContext';
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
import Login from './components/Login'; // <-- 1. IMPORT THE NEW COMPONENT
import './App.css';

// 2. CREATE A COMPONENT FOR YOUR MAIN PORTFOLIO PAGE
// This contains everything that was in App.js before
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

// 3. UPDATE THE APP COMPONENT TO USE ROUTES
function App() {
  const { theme } = useContext(ThemeContext);

  return (
    <div className={`App ${theme}`}>
      <Routes>
        {/* Route for the login page */}
        <Route path="/login" element={<Login />} />
        
        {/* Route for all other paths (your main portfolio) */}
        <Route path="/*" element={<HomePage />} />
      </Routes>
    </div>
  );
}

export default App;