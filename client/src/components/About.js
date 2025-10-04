import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FaGithub, FaLinkedin, FaFileDownload, FaMapMarkerAlt, FaEnvelope, FaPhone } from 'react-icons/fa';
import { useInView } from 'react-intersection-observer';
import api from '../services/api';
import './About.css';

const About = () => {
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
          email: 'sarthak@example.com',
          phone: '+91-9876543210',
          location: 'India',
          bio: 'I am a passionate DevOps Engineer with expertise in cloud technologies, containerization, and automation. I love building scalable infrastructure and implementing CI/CD pipelines to streamline development workflows. My journey in technology started with a curiosity about how systems work, and it has evolved into a passion for creating efficient, reliable, and scalable solutions.',
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

  if (loading) {
    return (
      <section id="about" className="about section">
        <div className="loading-spinner">
          <div className="spinner"></div>
        </div>
      </section>
    );
  }

  return (
    <section id="about" className="about section">
      <div className="container">
        <motion.h2
          className="section-title"
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.6 }}
        >
          About Me
        </motion.h2>

        <div ref={ref} className="about-content">
          <motion.div
            className="about-image"
            initial={{ opacity: 0, x: -50 }}
            animate={inView ? { opacity: 1, x: 0 } : { opacity: 0, x: -50 }}
            transition={{ duration: 0.8, delay: 0.2 }}
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

          <motion.div
            className="about-text"
            initial={{ opacity: 0, x: 50 }}
            animate={inView ? { opacity: 1, x: 0 } : { opacity: 0, x: 50 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            <h3 className="about-title">
              {personalInfo?.full_name || 'Sarthak Sharma'}
            </h3>
            <p className="about-subtitle">
              {personalInfo?.title || 'DevOps Engineer'}
            </p>
            

            <p className="about-description">
              {personalInfo?.bio || 'I am a passionate DevOps Engineer with expertise in cloud technologies, containerization, and automation. I love building scalable infrastructure and implementing CI/CD pipelines to streamline development workflows. My journey in technology started with a curiosity about how systems work, and it has evolved into a passion for creating efficient, reliable, and scalable solutions.'}
            </p>

            <div className="about-buttons">
              <a
                href={personalInfo?.github_url || 'https://github.com/sarthaksharma'}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-primary"
              >
                <FaGithub /> GitHub Profile
              </a>
              
              <a
                href={personalInfo?.linkedin_url || 'https://linkedin.com/in/sarthaksharma'}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-secondary"
              >
                <FaLinkedin /> LinkedIn Profile
              </a>
              
              <a
                href={personalInfo?.resume_url || '/resume.pdf'}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-outline"
              >
                <FaFileDownload /> Resume
              </a>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default About;
