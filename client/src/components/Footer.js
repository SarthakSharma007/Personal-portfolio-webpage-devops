/* client/src/components/Footer.js */
import React from 'react';
import { FaHeart, FaGithub, FaLinkedin, FaInstagram, FaTerminal } from 'react-icons/fa';
import { motion } from 'framer-motion';
import api from '../services/api';
import './Footer.css';

const Footer = () => {
  const currentYear = new Date().getFullYear();
  const [personalInfo, setPersonalInfo] = React.useState({
    full_name: 'Sarthak Sharma',
    title: 'DevOps Engineer',
    github_url: 'https://github.com/SarthakSharma007',
    linkedin_url: 'https://www.linkedin.com/in/sarthaksharmaprofile/'
  });

  React.useEffect(() => {
    const fetchPersonal = async () => {
      try {
        const res = await api.get('/personal-info');
        if (res.data?.success && res.data.data) {
          setPersonalInfo((prev) => ({ ...prev, ...res.data.data }));
        }
      } catch (e) {
        // Keep fallback footer values.
      }
    };
    fetchPersonal();
  }, []);

  return (
    <footer className="footer-section">
      
      {/* Subtle top border glow */}
      <div className="footer-glow-line" />

      <div className="footer-container">
        
        {/* Top Massive CTA area (Optional but looks highly modern) */}
        <div className="footer-cta">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="footer-cta-title"
          >
            Ready to build something <span>amazing?</span>
          </motion.h2>
        </div>

        <div className="footer-grid">
          
          {/* Brand & Bio */}
          <div className="footer-brand">
            <h3 className="footer-logo">
              <FaTerminal className="footer-logo-icon" /> {personalInfo.full_name || 'Portfolio'}
            </h3>
            <p className="footer-bio">
              {(personalInfo.title || 'DevOps Engineer')} passionate about building scalable, secure, and automated cloud infrastructure for the modern web.
            </p>
          </div>

          {/* Quick Links */}
          <div className="footer-links-col">
            <h4 className="footer-col-title">Navigation</h4>
            <ul className="footer-links">
              <li><a href="#home">Home</a></li>
              <li><a href="#about">About</a></li>
              <li><a href="#skills">Skills</a></li>
              <li><a href="#projects">Projects</a></li>
            </ul>
          </div>

          <div className="footer-links-col">
            <h4 className="footer-col-title">Experience</h4>
            <ul className="footer-links">
              <li><a href="#certifications">Certifications</a></li>
              <li><a href="#experience">Experience</a></li>
              <li><a href="#education">Education</a></li>
              <li><a href="#contact">Contact</a></li>
            </ul>
          </div>

          {/* Social Links */}
          <div className="footer-social-col">
            <h4 className="footer-col-title">Connect</h4>
            <div className="footer-social-icons">
              <a href={personalInfo.github_url || '#'} target="_blank" rel="noopener noreferrer" aria-label="GitHub">
                <FaGithub />
              </a>
              <a href={personalInfo.linkedin_url || '#'} target="_blank" rel="noopener noreferrer" aria-label="LinkedIn">
                <FaLinkedin />
              </a>
              <a href="https://instagram.com/sarthaksharma" target="_blank" rel="noopener noreferrer" aria-label="Instagram">
                <FaInstagram />
              </a>
            </div>
          </div>

        </div>

        {/* Bottom Copyright */}
        <div className="footer-bottom">
          <div className="footer-bottom-content">
            <p className="copyright">
              © {currentYear} {personalInfo.full_name || 'Portfolio'}. All Rights Reserved.
            </p>
          </div>
        </div>

      </div>
    </footer>
  );
};

export default Footer;