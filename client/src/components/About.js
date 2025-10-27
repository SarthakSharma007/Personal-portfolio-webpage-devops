import React, { useState } from 'react'; // Removed useEffect
import { motion } from 'framer-motion';
import { FaGithub, FaLinkedin, FaFileDownload } from 'react-icons/fa';
import { useInView } from 'react-intersection-observer';
// import api from '../services/api'; // Removed API import
import './About.css';
import profileImage from '../assets/profile/my resume photot.jpg'; // ✅ Import your image

// Hardcoded personal info as requested to override incorrect backend data
// Updated comment - October 27, 2025
const specificPersonalInfo = {
  full_name: 'Sarthak Sharma',
  title: 'DevOps Cloud Engineer',
  bio: 'I’m a highly driven Computer Science undergraduate with a strong foundation in DevOps and automation practices, passionate about building scalable and efficient systems. I’ve successfully automated CI/CD pipelines, reducing software release times by 95%, and have hands-on experience with Docker, Kubernetes, and AWS for cloud deployment and orchestration. My expertise also includes system observability using Prometheus and Grafana, and effective project tracking with Jira. Recognized as the 2nd runner-up in a National Hackathon, I bring strong problem-solving and leadership skills to every project. I’m deeply committed to leveraging automation, cloud technologies, and continuous integration to drive innovation and reliability in modern software delivery.',
  github_url: 'https://github.com/SarthakSharma007',
  linkedin_url: 'https://www.linkedin.com/in/sarthaksharmaprofile/',
  resume_url: 'https://drive.google.com/file/d/1KbZhwxc0CYKciz7xF_1fB1-pHv_VpqsS/view?usp=sharing'
};

const About = () => {
  // Set state directly from the hardcoded object, removed setter to avoid lint warning
  const [personalInfo] = useState(specificPersonalInfo);
  // Removed loading and error states
  // const [loading, setLoading] = useState(true);
  // const [error, setError] = useState(null);
  
  const { ref, inView } = useInView({
    threshold: 0.1,
    triggerOnce: true
  });

  // Removed useEffect for fetching data
  // useEffect(() => { ... fetchPersonalInfo ... }, []);

  // Removed loading spinner block
  // if (loading) { ... }

  // Fallback check in case the hardcoded object is ever null
  if (!personalInfo) {
    return <section id="about" className="about section"></section>; // Render empty section
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
                alt={personalInfo.full_name} // Removed fallback
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
            <h3 className="about-title">{personalInfo.full_name}</h3>
            <p className="about-subtitle">{personalInfo.title}</p>

            <p className="about-description">
              {personalInfo.bio} 
            </p>

            <div className="about-buttons">
              <a
                href={personalInfo.github_url} // Removed fallback
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-primary"
              >
                <FaGithub /> GitHub Profile
              </a>

              <a
                href={personalInfo.linkedin_url} // Removed fallback
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-secondary"
              >
                <FaLinkedin /> LinkedIn Profile
              </a>

              <a
                href={personalInfo.resume_url} // Removed fallback
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

