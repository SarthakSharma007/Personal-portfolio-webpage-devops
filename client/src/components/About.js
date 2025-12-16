import React from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { FaGithub, FaLinkedin, FaFileDownload } from 'react-icons/fa';
import api from '../services/api';
import './About.css';
import profileImage from '../assets/profile/my resume photot.jpg';

const defaultPersonalInfo = {
  full_name: 'Sarthak Sharma',
  title: 'DevOps Cloud Engineer',
  bio: 'I\'m a highly driven Computer Science undergraduate with a strong foundation in DevOps and automation practices, passionate about building scalable and efficient systems. I\'ve successfully automated CI/CD pipelines, reducing software release times by 95%, and have hands-on experience with Docker, Kubernetes, and AWS for cloud deployment and orchestration. My expertise also includes system observability using Prometheus and Grafana, and effective project tracking with Jira. Recognized as the 2nd runner-up in a National Hackathon, I bring strong problem-solving and leadership skills to every project.',
  github_url: 'https://github.com/SarthakSharma007',
  linkedin_url: 'https://www.linkedin.com/in/sarthaksharmaprofile/',
  resume_url: 'https://drive.google.com/file/d/1KbZhwxc0CYKciz7xF_1fB1-pHv_VpqsS/view?usp=sharing'
};

const About = () => {
  const reducedMotion = useReducedMotion();
  const [personalInfo, setPersonalInfo] = React.useState(defaultPersonalInfo);

  React.useEffect(() => {
    const fetchPersonal = async () => {
      try {
        const res = await api.get('/personal-info');
        if (res.data?.success && res.data.data) {
          // Only merge non-null, non-empty-string values so the
          // hardcoded defaults are preserved when the DB field is blank.
          const apiData = Object.fromEntries(
            Object.entries(res.data.data).filter(
              ([, v]) => v !== null && v !== ''
            )
          );
          setPersonalInfo((prev) => ({ ...prev, ...apiData }));
        }
      } catch (e) {
        // Keep fallback data on failure.
      }
    };
    fetchPersonal();
  }, []);

  const viewportConfig = reducedMotion
    ? { once: true, amount: 0.3 }
    : { once: false, amount: 0.22, margin: '0px 0px -8% 0px' };

  const sectionTransition = reducedMotion
    ? { duration: 0.22, ease: 'linear' }
    : { type: 'spring', stiffness: 120, damping: 24, mass: 0.95 };

  const childTransition = reducedMotion
    ? { duration: 0.2, ease: 'linear' }
    : { type: 'spring', stiffness: 140, damping: 26, mass: 0.85 };

  const headerVariant = {
    hidden: {
      opacity: 0,
      y: 24,
      scale: 0.985,
      filter: reducedMotion ? 'none' : 'blur(8px)'
    },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      filter: 'blur(0px)',
      transition: sectionTransition
    }
  };

  const detailVariant = {
    hidden: {
      opacity: 0,
      y: 30,
      scale: 0.99,
      filter: reducedMotion ? 'none' : 'blur(10px)'
    },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      filter: 'blur(0px)',
      transition: childTransition
    }
  };

  const profileVariant = {
    hidden: {
      opacity: 0,
      y: 34,
      scale: 0.985,
      filter: reducedMotion ? 'none' : 'blur(10px)'
    },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      filter: 'blur(0px)',
      transition: { ...childTransition, delay: reducedMotion ? 0 : 0.06 }
    }
  };

  return (
    <section id="about" className="about-legendary-section">
      {/* Background Glow Orbs */}
      <div className="about-orb about-orb-1" />
      <div className="about-orb about-orb-2" />
      <div className="about-orb about-orb-3" />
      <div className="about-grid-overlay" />

      <div className="about-content-wrap">

        {/* 1. HEADER — from Top */}
        <motion.div
          className="about-header"
          variants={headerVariant}
          initial="hidden"
          whileInView="visible"
          viewport={viewportConfig}
        >
          <h2 className="about-heading">About Me.</h2>
          <div className="about-heading-bar" />
        </motion.div>

        {/* Grid: Detail + Profile */}
        <div className="about-grid">

          {/* 2. DETAIL BLOCK — from Right */}
          <motion.div
            className="about-detail-block"
            variants={detailVariant}
            initial="hidden"
            whileInView="visible"
            viewport={viewportConfig}
            whileHover={reducedMotion ? undefined : { y: -4, scale: 1.01 }}
            transition={reducedMotion ? { duration: 0.2 } : { type: 'spring', stiffness: 210, damping: 22 }}
          >
            <p className="about-bio-text">{personalInfo.bio}</p>
          </motion.div>

          {/* 3. PROFILE BLOCK — from Left */}
          <motion.div
            className="about-profile-block"
            variants={profileVariant}
            initial="hidden"
            whileInView="visible"
            viewport={viewportConfig}
            whileHover={reducedMotion ? undefined : { y: -5, scale: 1.01 }}
            transition={reducedMotion ? { duration: 0.2 } : { type: 'spring', stiffness: 210, damping: 22 }}
          >
            <div className="about-profile-ring">
              <div className="about-profile-glow" />
              <img
                src={personalInfo.about_image ? `http://localhost:5000${personalInfo.about_image}` : profileImage}
                alt={personalInfo.full_name}
                className="about-profile-img"
              />
            </div>
            <h3 className="about-profile-name">{personalInfo.full_name}</h3>
            <p className="about-profile-title">{personalInfo.title}</p>
            <div className="about-profile-actions">
              <a href={personalInfo.github_url} target="_blank" rel="noopener noreferrer" className="about-profile-btn about-profile-btn-primary">
                <FaGithub />
              </a>
              <a href={personalInfo.linkedin_url} target="_blank" rel="noopener noreferrer" className="about-profile-btn about-profile-btn-secondary">
                <FaLinkedin />
              </a>
              <a href={personalInfo.resume_url} target="_blank" rel="noopener noreferrer" className="about-profile-btn about-profile-btn-ghost">
                <FaFileDownload />
              </a>
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
};

export default About;
