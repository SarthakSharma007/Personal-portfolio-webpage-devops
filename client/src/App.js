import React from 'react'; // <-- 1. REMOVE { useContext }
import { Routes, Route } from 'react-router-dom';
import { useTheme } from './contexts/ThemeContext'; // <-- 2. IMPORT useTheme INSTEAD
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

// This component is correct
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

// 3. UPDATE THE APP COMPONENT TO USE THE HOOK
function App() {
  const { theme } = useTheme(); // <-- 4. USE THE HOOK
  
  // This line will now work
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