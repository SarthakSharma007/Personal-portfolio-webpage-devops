import React, { useContext } from 'react';
// Import Outlet for nested routing layout
// FIX: Removed Router (BrowserRouter as Router) import, assuming it's in index.js
import { Route, Routes, Outlet } from 'react-router-dom';
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
import ProtectedRoute from './components/ProtectedRoute';
import ScrollToTop from './components/ScrollToTop';
import './App.css';

// Main App component wrapped ONLY with ThemeProvider
const App = () => {
  return (
    <ThemeProvider>
      {/* FIX: Removed Router wrapper here, assuming it's in index.js */}
      <AppRoutes /> {/* Component defining routes */}
    </ThemeProvider>
  );
};

// Layout component: Includes elements common to main pages (Navbar, theme)
const MainLayout = () => {
  const { theme } = useContext(ThemeContext);
  return (
    <div className={`App ${theme}`}>
      <ScrollToTop />
      <Navbar />
      <main>
        {/* Child routes defined within this layout will render here */}
        <Outlet />
      </main>
      {/* Footer moved inside HomePage component which is rendered via Outlet */}
    </div>
  );
};

// Component that defines all the application routes
const AppRoutes = () => {
  return (
    <Routes>
      {/* Routes that use the MainLayout (Navbar, ScrollToTop, theme) */}
      <Route element={<MainLayout />}>
        <Route path="/" element={<HomePage />} />
        {/* Add any other public pages that need the Navbar/Footer here */}
        {/* e.g., <Route path="/portfolio" element={<PortfolioPage />} /> */}
      </Route>

      {/* Routes that DO NOT use the MainLayout */}
      <Route path="/login" element={<Login />} />

      {/* Protected Admin Route (also does not use MainLayout) */}
      <Route element={<ProtectedRoute />}>
        <Route path="/admin" element={<AdminPanel />} />
      </Route>

      {/* Optional: Catch-all 404 Not Found route */}
      {/* <Route path="*" element={<div>404 Not Found</div>} /> */}
    </Routes>
  );
};


// Component to render all sections for the home page (content part)
// FIX: Restored original components
const HomePage = () => {
  return (
    <>
      {/* Restored original components */}
      <Home />
      <About />
      <Skills />
      <Projects />
      <Certifications />
      <Experience />
      <Education />
      <Contact />
      <Footer /> {/* Footer is part of the home page content */}
    </>
  );
};


export default App;

