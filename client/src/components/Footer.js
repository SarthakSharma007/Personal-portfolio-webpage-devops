/* client/src/components/Footer.js */
import React from 'react';
import { FaHeart, FaGithub, FaLinkedin, FaInstagram } from 'react-icons/fa';
import './Footer.css';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-content">
          <div className="footer-info">
            <h3>Sarthak Sharma</h3>
            <p>DevOps Engineer passionate about building scalable infrastructure and automation solutions.</p>
          </div>

          <div className="footer-links">
            <h4>Quick Links</h4>
            <ul>
              {/* These links assume smooth scrolling is handled elsewhere (e.g., Navbar) */}
              <li><a href="#home">Home</a></li>
              <li><a href="#about">About</a></li>
              <li><a href="#skills">Skills</a></li>
              <li><a href="#projects">Projects</a></li>
               {/* Added Certifications, Experience, Education links based on nav order */}
              <li><a href="#certifications">Certifications</a></li>
              <li><a href="#experience">Experience</a></li>
              <li><a href="#education">Education</a></li>
              <li><a href="#contact">Contact</a></li>
            </ul>
          </div>

          <div className="footer-social">
            <h4>Connect</h4>
            <div className="social-links">
              {/* Updated GitHub link - October 27, 2025 */}
              <a
                href="https://github.com/SarthakSharma007"
                target="_blank"
                rel="noopener noreferrer"
                className="social-link"
                title="GitHub"
              >
                <FaGithub />
              </a>
              {/* Updated LinkedIn link - October 27, 2025 */}
              <a
                href="https://www.linkedin.com/in/sarthaksharmaprofile/"
                target="_blank"
                rel="noopener noreferrer"
                className="social-link"
                title="LinkedIn"
              >
                <FaLinkedin />
              </a>
              {/* Kept Instagram link as placeholder, update if needed */}
              <a
                href="https://instagram.com/sarthaksharma" // Placeholder, update if necessary
                target="_blank"
                rel="noopener noreferrer"
                className="social-link"
                title="Instagram"
              >
                <FaInstagram />
              </a>
            </div>
          </div>
        </div>

        <div className="footer-bottom">
          <p>
            © {currentYear} Sarthak Sharma | All Rights Reserved | Made with{' '}
            <FaHeart className="heart-icon" /> using React
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;