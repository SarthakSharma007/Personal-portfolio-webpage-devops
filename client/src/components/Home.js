import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FaGithub, FaLinkedin, FaChevronDown } from 'react-icons/fa';
import { useInView } from 'react-intersection-observer';
import api from '../services/api';
import './Home.css';
import profileImage from '../assets/profile/20160518234238_IMG_8927 (2).JPG'; 

const Home = () => {
  const [personalInfo, setPersonalInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null); // Now correctly used
  
  const { ref, inView } = useInView({
    threshold: 0.1,
    triggerOnce: true
  });

  useEffect(() => {
    const fetchPersonalInfo = async () => {
      try {
        const response = await api.get('/personal-info');
        if (response.data.success) {
          setPersonalInfo(response.data.data);
        } else {
          // Handle API success=false case
          setError('API request succeeded but returned no data.');
        }
      } catch (err) {
        console.error('Error fetching personal info:', err);
        setError('Failed to load personal information');
        // Set fallback data
        setPersonalInfo({
          full_name: 'Sarthak Sharma',
          title: 'DevOps Cloud Engineer',
          
          github_url: 'https://github.com/SarthakSharma007',
          linkedin_url: 'https://www.linkedin.com/in/sarthaksharmaprofile/',
        });
      } finally {
        setLoading(false);
      }
    };

    fetchPersonalInfo();
  }, []);

  const scrollToAbout = () => {
    const aboutSection = document.getElementById('about');
    if (aboutSection) {
      aboutSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  if (loading) {
    return (
      <section id="home" className="home">
        <div className="loading-spinner">
          <div className="spinner"></div>
        </div>
      </section>
    );
  }

  return (
    <section id="home" className="home">
      <div className="hero-background">
        <div className="hero-particles"></div>
      </div>
      
      <div className="container">
        {/* ADDED: Display the error message if the state is set */}
        {error && (
          <motion.div 
            className="error-message"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            style={{ 
              position: 'absolute', 
              top: '10px', 
              left: '50%', 
              transform: 'translateX(-50%)', 
              color: 'red', 
              backgroundColor: 'rgba(255, 0, 0, 0.1)', 
              padding: '10px', 
              borderRadius: '5px',
              zIndex: 100 
            }}
          >
            {error}
          </motion.div>
        )}
        
        <motion.div
          ref={ref}
          className={`hero-content ${inView ? 'visible' : ''}`}
          initial={{ opacity: 0, y: 50 }}
          animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
          transition={{ duration: 0.8 }}
        >
          <div className="hero-text">
            <motion.h1
              className="hero-title"
              initial={{ opacity: 0, y: 30 }}
              animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              Hello, I'm{' '}
              <span className="gradient-text">
                {personalInfo?.full_name || 'Sarthak Sharma'}
              </span>
            </motion.h1>
            
            <motion.h2
              className="hero-subtitle"
              initial={{ opacity: 0, y: 30 }}
              animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              {personalInfo?.title || 'DevOps Cloud Engineer'}
            </motion.h2>
            
            <motion.div
              className="hero-buttons"
              initial={{ opacity: 0, y: 30 }}
              animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
              transition={{ duration: 0.8, delay: 0.6 }}
            >
              <a
                href={personalInfo?.linkedin_url || '#'}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-primary"
              >
                <FaLinkedin /> LinkedIn
              </a>
              
              <a
                href={personalInfo?.github_url || '#'}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-secondary"
              >
                <FaGithub /> GitHub
              </a>
            </motion.div>
          </div>
          
          <motion.div
            className="hero-image"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={inView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            <div className="profile-image-container">
              {/* ✅ Replaced initials with actual profile photo */}
              <div className="profile-image-placeholder">
                <img src={profileImage} alt="Profile" className="profile-image" />
              </div>
              <div className="image-glow"></div>
            </div>
          </motion.div>
        </motion.div>
        
        <motion.div
          className="scroll-indicator"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 1.5 }}
          onClick={scrollToAbout}
        >
          <FaChevronDown className="scroll-arrow" />
          <span>Scroll to explore</span>
        </motion.div>
      </div>
    </section>
  );
};

export default Home;