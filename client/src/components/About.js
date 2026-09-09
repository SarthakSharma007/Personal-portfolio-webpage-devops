import React from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { FaGithub, FaLinkedin, FaFileAlt } from 'react-icons/fa';
import api from '../services/api';
import './About.css';
import profileImage from '../assets/profile/my resume photot.jpg';

const defaultPersonalInfo = {
  full_name: 'Sarthak Sharma',
  title: 'DevOps Cloud Engineer',
  bio: "I'm a highly driven Computer Science undergraduate with a strong foundation in DevOps and automation practices, passionate about building scalable and efficient systems. I've successfully automated CI/CD pipelines, reducing software release times by 95%, and have hands-on experience with Docker, Kubernetes, and AWS for cloud deployment and orchestration. My expertise also includes system observability using Prometheus and Grafana, and effective project tracking with Jira. Recognized as the 2nd runner-up in a National Hackathon, I bring strong problem-solving and leadership skills to every project.",
  github_url: 'https://github.com/SarthakSharma007',
  linkedin_url: 'https://www.linkedin.com/in/sarthaksharmaprofile/',
  resume_url: 'https://drive.google.com/file/d/1KbZhwxc0CYKciz7xF_1fB1-pHv_VpqsS/view?usp=sharing',
};

const About = () => {
  const reducedMotion = useReducedMotion();
  const [personalInfo, setPersonalInfo] = React.useState(defaultPersonalInfo);

  React.useEffect(() => {
    const fetchPersonal = async () => {
      try {
        const res = await api.get('/personal-info');
        if (res.data?.success && res.data.data) {
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

  const spring = reducedMotion
    ? { duration: 0.2, ease: 'linear' }
    : { type: 'spring', stiffness: 100, damping: 20 };

  const fadeUp = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: spring },
  };
  
  const fadeLeft = {
    hidden: { opacity: 0, x: -30 },
    visible: { opacity: 1, x: 0, transition: spring },
  };

  const fadeRight = {
    hidden: { opacity: 0, x: 30 },
    visible: { opacity: 1, x: 0, transition: spring },
  };

  const profileSrc = personalInfo.about_image
    ? personalInfo.about_image.startsWith('http')
      ? personalInfo.about_image
      : `${process.env.REACT_APP_API_URL || 'http://localhost:5000'}${personalInfo.about_image}`
    : profileImage;

  return (
    <section id="about" className="about-section">
      <div className="about-inner">
        <div className="about-card">
          
          {/* Left Column: Image — hidden on mobile, replaced by inline mobile image */}
          <motion.div
            className="about-photo-wrap about-photo-desktop"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            variants={fadeLeft}
          >
            <img src={profileSrc} alt={personalInfo.full_name} className="about-photo" />
          </motion.div>

          {/* Right Column: Text content */}
          <motion.div
            className="about-text"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            variants={fadeRight}
          >
            <div className="about-label">
              <span className="about-label-dot" /> About Me
            </div>
            
            <h3 className="about-name">{personalInfo.full_name}</h3>
            <p className="about-role">{personalInfo.title}</p>

            {/* Mobile-only image — between role and bio */}
            <div className="about-photo-mobile-wrap">
              <img src={profileSrc} alt={personalInfo.full_name} className="about-photo" />
            </div>

            <p className="about-bio">{personalInfo.bio}</p>

            <div className="about-links">
              <a 
                href={personalInfo.github_url} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="about-pill"
                style={{
                  ...(personalInfo?.about_github_btn_bg ? { background: personalInfo.about_github_btn_bg, borderColor: personalInfo.about_github_btn_bg } : {}),
                  ...(personalInfo?.about_github_btn_color ? { color: personalInfo.about_github_btn_color } : {})
                }}
              >
                <FaGithub style={personalInfo?.about_github_btn_color ? { color: personalInfo.about_github_btn_color } : {}} /> 
                <span style={personalInfo?.about_github_btn_color ? { color: personalInfo.about_github_btn_color } : {}}>
                  {personalInfo?.about_github_btn_text || 'GitHub'}
                </span>
              </a>
              <a 
                href={personalInfo.linkedin_url} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="about-pill"
                style={{
                  ...(personalInfo?.about_linkedin_btn_bg ? { background: personalInfo.about_linkedin_btn_bg, borderColor: personalInfo.about_linkedin_btn_bg } : {}),
                  ...(personalInfo?.about_linkedin_btn_color ? { color: personalInfo.about_linkedin_btn_color } : {})
                }}
              >
                <FaLinkedin style={personalInfo?.about_linkedin_btn_color ? { color: personalInfo.about_linkedin_btn_color } : {}} /> 
                <span style={personalInfo?.about_linkedin_btn_color ? { color: personalInfo.about_linkedin_btn_color } : {}}>
                  {personalInfo?.about_linkedin_btn_text || 'LinkedIn'}
                </span>
              </a>
              <a 
                href={personalInfo.resume_url} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="about-pill about-pill-accent"
                style={{
                  ...(personalInfo?.about_resume_btn_bg ? { background: personalInfo.about_resume_btn_bg, borderColor: personalInfo.about_resume_btn_bg } : {}),
                  ...(personalInfo?.about_resume_btn_color ? { color: personalInfo.about_resume_btn_color } : {})
                }}
              >
                <FaFileAlt style={personalInfo?.about_resume_btn_color ? { color: personalInfo.about_resume_btn_color } : {}} /> 
                <span style={personalInfo?.about_resume_btn_color ? { color: personalInfo.about_resume_btn_color } : {}}>
                  {personalInfo?.about_resume_btn_text || 'Resume'}
                </span>
              </a>
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
};

export default About;
