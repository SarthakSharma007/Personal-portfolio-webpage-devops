/* client/src/components/Navbar.js */
import React, { useState, useEffect } from 'react';
import { FaBars, FaTimes } from 'react-icons/fa';
import ThemeToggle from './ThemeToggle';
import './Navbar.css';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState('home');

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);

      // Update active section based on scroll position
      // Corrected order based on App.js layout
      const sections = ['home', 'about', 'skills', 'projects', 'certifications', 'experience', 'education', 'contact'];
      const scrollPosition = window.scrollY + 100;

      for (let i = sections.length - 1; i >= 0; i--) {
        const section = document.getElementById(sections[i]);
        if (section && section.offsetTop <= scrollPosition) {
          setActiveSection(sections[i]);
          break;
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
    setIsMenuOpen(false);
  };

  // Reordered navItems to match the desired section order
  // As requested: About → Skills → Experience → Education → Certifications → Projects → Contact
  // Note: App.js order is Home -> About -> Skills -> Projects -> Certs -> Experience -> Edu -> Contact
  // Reordering nav bar items to match App.js order
  // Added comment - October 27, 2025
  const navItems = [
    { id: 'home', label: 'Home' },
    { id: 'about', label: 'About' },
    { id: 'skills', label: 'Skills' },
    { id: 'projects', label: 'Projects' }, // Moved Projects up
    { id: 'certifications', label: 'Certifications' },
    { id: 'experience', label: 'Experience' },
    { id: 'education', label: 'Education' },
    { id: 'contact', label: 'Contact' }
  ];

  return (
    <nav className={`navbar ${isScrolled ? 'scrolled' : ''}`}>
      <div className="container">
        <div className="nav-content">
          <div className="nav-logo">
            <span className="logo-text">Sarthak Sharma</span>
            <span className="logo-subtitle">DevOps Cloud Engineer</span>
          </div>

          <div className={`nav-menu ${isMenuOpen ? 'active' : ''}`}>
            {navItems.map((item) => (
              <button
                key={item.id}
                className={`nav-link ${activeSection === item.id ? 'active' : ''}`}
                onClick={() => scrollToSection(item.id)}
              >
                {item.label}
              </button>
            ))}
          </div>

          <div className="nav-actions">
            <ThemeToggle />
            <div className="nav-toggle" onClick={toggleMenu}>
              {isMenuOpen ? <FaTimes /> : <FaBars />}
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;