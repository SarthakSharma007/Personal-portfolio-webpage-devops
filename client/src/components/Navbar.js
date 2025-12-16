import React, { useState, useEffect, useRef } from 'react';
import { FaBars, FaTimes } from 'react-icons/fa';
import MoreDropdown from './MoreDropdown';
import './Navbar.css';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isMoreMenuOpen, setIsMoreMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState('home');
  const [homeFlash, setHomeFlash] = useState(false);   // 1-sec underline flash
  const prevSectionRef = useRef('home');               // track previous section
  const flashTimerRef  = useRef(null);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
      setIsMoreMenuOpen(false);

      const sections = ['home', 'about', 'skills', 'projects', 'certifications', 'experience', 'education', 'contact'];
      const scrollPosition = window.scrollY + 100;

      let current = 'home';
      for (let i = sections.length - 1; i >= 0; i--) {
        const section = document.getElementById(sections[i]);
        if (section && section.offsetTop <= scrollPosition) {
          current = sections[i];
          break;
        }
      }

      // If arriving at 'home' from a different section → trigger flash
      if (current === 'home' && prevSectionRef.current !== 'home') {
        clearTimeout(flashTimerRef.current);
        setHomeFlash(true);
        flashTimerRef.current = setTimeout(() => setHomeFlash(false), 1000);
      }

      prevSectionRef.current = current;
      setActiveSection(current);
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
      clearTimeout(flashTimerRef.current);
    };
  }, []);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
    // When user clicks Home from another section → flash
    if (sectionId === 'home' && prevSectionRef.current !== 'home') {
      clearTimeout(flashTimerRef.current);
      setHomeFlash(true);
      flashTimerRef.current = setTimeout(() => setHomeFlash(false), 1000);
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
    { id: 'projects', label: 'Projects' },
    { id: 'certifications', label: 'Certifications' },
    { id: 'experience', label: 'Experience' }
  ];

  const moreItems = [
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
                className={`nav-link ${
                  item.id === 'home'
                    ? homeFlash ? 'home-flash' : ''           // home: only flash class, never 'active'
                    : activeSection === item.id ? 'active' : '' // others: normal active
                }`}
                onClick={() => scrollToSection(item.id)}
              >
                {item.label}
              </button>
            ))}
            
            <div className="more-dropdown-container">
              <button
                className={`nav-link ${(activeSection === 'education' || activeSection === 'contact') ? 'active' : ''}`}
                onClick={() => setIsMoreMenuOpen(!isMoreMenuOpen)}
              >
                More ▾
              </button>

              <MoreDropdown
                isOpen={isMoreMenuOpen}
                onClose={() => setIsMoreMenuOpen(false)}
                moreItems={moreItems}
                activeSection={activeSection}
                onNavigate={scrollToSection}
              />
            </div>
          </div>

          <div className="nav-actions">
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