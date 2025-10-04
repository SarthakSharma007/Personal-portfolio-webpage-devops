import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FaGithub, FaLinkedin, FaFileDownload, FaChevronDown } from 'react-icons/fa';
import { useInView } from 'react-intersection-observer';
import api from '../services/api';
import './Home.css';

const Home = () => {
  const [personalInfo, setPersonalInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
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
        }
      } catch (err) {
        console.error('Error fetching personal info:', err);
        setError('Failed to load personal information');
        // Set fallback data
        setPersonalInfo({
          full_name: 'Sarthak Sharma',
          title: 'DevOps Engineer',
          bio: 'I am a passionate DevOps Engineer with expertise in cloud technologies, containerization, and automation. I love building scalable infrastructure and implementing CI/CD pipelines to streamline development workflows.',
          github_url: 'https://github.com/sarthaksharma',
          linkedin_url: 'https://linkedin.com/in/sarthaksharma',
          resume_url: '/resume.pdf'
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
                href={personalInfo?.resume_url || '/resume.pdf'}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-primary"
              >
                <FaFileDownload /> Resume
              </a>
              
              <a
                href="#contact"
                className="btn btn-secondary"
                onClick={(e) => {
                  e.preventDefault();
                  document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' });
                }}
              >
                Hire Me
              </a>
              
              <a
                href="#contact"
                className="btn btn-outline"
                onClick={(e) => {
                  e.preventDefault();
                  document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' });
                }}
              >
                Contact Me
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
              <div className="profile-image-placeholder">
                <span className="initials">
                  {(personalInfo?.full_name || 'Sarthak Sharma')
                    .split(' ')
                    .map(name => name[0])
                    .join('')}
                </span>
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
