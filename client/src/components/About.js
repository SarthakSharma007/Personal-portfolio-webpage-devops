import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FaGithub, FaLinkedin, FaFileDownload } from 'react-icons/fa';
import { useInView } from 'react-intersection-observer';
import api from '../services/api';
import './About.css';
import profileImage from '../assets/profile/my resume photot.jpg'; // ✅ Import your image

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
        setPersonalInfo({
          full_name: 'Sarthak Sharma',
          title: 'DevOps Cloud Engineer',
          bio: 'I’m a highly driven Computer Science undergraduate with a strong foundation in DevOps and automation practices, passionate about building scalable and efficient systems. I’ve successfully automated CI/CD pipelines, reducing software release times by 95%, and have hands-on experience with Docker, Kubernetes, and AWS for cloud deployment and orchestration. My expertise also includes system observability using Prometheus and Grafana, and effective project tracking with Jira. Recognized as the 2nd runner-up in a National Hackathon, I bring strong problem-solving and leadership skills to every project. I’m deeply committed to leveraging automation, cloud technologies, and continuous integration to drive innovation and reliability in modern software delivery.',
          github_url: 'https://github.com/SarthakSharma007',
          linkedin_url: 'https://www.linkedin.com/in/sarthaksharmaprofile/',
          resume_url: 'https://drive.google.com/file/d/1KbZhwxc0CYKciz7xF_1fB1-pHv_VpqsS/view?usp=sharing'
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
              {/* ✅ Use real profile image here */}
              <img
                src={profileImage}
                alt={personalInfo?.full_name || 'Profile'}
                className="profile-image"
              />
              <div className="image-glow"></div>
            </div>
          </motion.div>

          <motion.div
            className="about-text"
            initial={{ opacity: 0, x: 50 }}
            animate={inView ? { opacity: 1, x: 0 } : { opacity: 0, x: 50 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            <h3 className="about-title">{personalInfo?.full_name || 'Sarthak Sharma'}</h3>
            <p className="about-subtitle">{personalInfo?.title || 'DevOps Engineer'}</p>

            <p className="about-description">
              {personalInfo?.bio ||
                'I am a passionate DevOps Engineer with expertise in cloud technologies, containerization, and automation. I love building scalable infrastructure and implementing CI/CD pipelines to streamline development workflows. My journey in technology started with a curiosity about how systems work, and it has evolved into a passion for creating efficient, reliable, and scalable solutions.'}
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
