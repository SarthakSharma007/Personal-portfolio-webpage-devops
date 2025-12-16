import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FaGithub, FaLinkedin, FaChevronDown } from 'react-icons/fa';
import { useInView } from 'react-intersection-observer';
import api from '../services/api';
import './Home.css';
import profileImage from '../assets/profile/Gemini_Generated_Image_lnd0gnlnd0gnlnd0.png';
import WelcomeLoader from './WelcomeLoader';

// Infinity symbol animated background component
const InfinityBackground = () => {
  const symbolCount = typeof window !== 'undefined' && window.matchMedia('(max-width: 768px)').matches
    ? 36
    : 90;

  const symbols = React.useMemo(() => {
    return Array.from({ length: symbolCount }).map((_, i) => ({
      id: i,
      left: `${Math.random() * 100}%`,
      animationDuration: `${Math.random() * 15 + 10}s`,
      animationDelay: `-${Math.random() * 20}s`,
      fontSize: `${Math.random() * 2 + 0.5}rem`,
      opacity: Math.random() * 0.2 + 0.1,
      rotation: Math.random() * 360,
    }));
  }, [symbolCount]);

  return (
    <div className="infinity-background" aria-hidden="true">
      {symbols.map((symbol) => (
        <div
          key={symbol.id}
          className="falling-infinity"
          style={{
            left: symbol.left,
            fontSize: symbol.fontSize,
            opacity: symbol.opacity,
            animationDuration: symbol.animationDuration,
            animationDelay: symbol.animationDelay,
            '--start-rotation': `${symbol.rotation}deg`,
            '--end-rotation': `${symbol.rotation + Math.random() * 180 - 90}deg`,
          }}
        >
          ∞
        </div>
      ))}
    </div>
  );
};

const Home = () => {
  const [personalInfo, setPersonalInfo] = useState(null);
<<<<<<< HEAD
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null); // Now correctly used
  
  const { ref, inView } = useInView({
    threshold: 0.1,
    triggerOnce: true
  });
=======
  const [apiLoading, setApiLoading] = useState(true);
  // Only show animation if it hasn't been shown yet this session
  const [showAnimation, setShowAnimation] = useState(
    () => !sessionStorage.getItem('welcomeShown')
  );

  const { ref, inView } = useInView({ threshold: 0.1, triggerOnce: true });
>>>>>>> 74d6f8c (Updated project files make Dynamic)

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
        setPersonalInfo({
          full_name: 'Sarthak Sharma',
          title: 'DevOps Engineer',
          github_url: 'https://github.com/SarthakSharma007',
          linkedin_url: 'https://www.linkedin.com/in/sarthaksharmaprofile/',
        });
      } finally {
        setApiLoading(false);
      }
    };
    fetchPersonalInfo();
  }, []);

  const scrollToAbout = () => {
    const aboutSection = document.getElementById('about');
    if (aboutSection) aboutSection.scrollIntoView({ behavior: 'smooth' });
  };

  // Only show the welcome animation — never block on API loading for returning visitors
  if (showAnimation) {
    return <WelcomeLoader onComplete={() => {
      sessionStorage.setItem('welcomeShown', '1');
      setShowAnimation(false);
    }} />;
  }

  const pageEnter = {
    initial:    { opacity: 0, y: 30, scale: 0.97 },
    animate:    { opacity: 1, y: 0,  scale: 1    },
    transition: { duration: 0.9, ease: [0.22, 1, 0.36, 1] },
  };

  const childVariants = {
    hidden:  { opacity: 0, y: 40 },
    visible: { opacity: 1, y: 0  },
  };

  return (
    <motion.section
      id="home"
      className="home"
      initial={pageEnter.initial}
      animate={pageEnter.animate}
      transition={pageEnter.transition}
    >
      <InfinityBackground />

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
          className="hero-content"
          initial="hidden"
          animate={inView ? 'visible' : 'hidden'}
          variants={{
            hidden:   { opacity: 0 },
            visible:  { opacity: 1, transition: { staggerChildren: 0.18, delayChildren: 0.25 } },
          }}
        >
          {/* ── Text column ── */}
          <div className="hero-text">

            {/* Main title */}
            <motion.h1
              className="hero-title"
              variants={{
                hidden:  { opacity: 0, y: 50 },
                visible: { opacity: 1, y: 0, transition: { type: 'spring', bounce: 0.4, duration: 1 } },
              }}
            >
              Hello, I'm{' '}
              <span className="legendary-name">
                {personalInfo?.full_name || 'Sarthak Sharma'}
              </span>
            </motion.h1>

            {/* Subtitle / role */}
            <motion.h2
              className="hero-subtitle"
              variants={{
                hidden:  { opacity: 0, x: -30 },
                visible: { opacity: 1, x: 0, transition: { duration: 0.8, ease: 'easeOut' } },
              }}
            >
              {personalInfo?.title || 'DevOps Engineer'}
            </motion.h2>

            {/* CTA buttons */}
            <motion.div
              className="hero-buttons"
              variants={{
                hidden:  { opacity: 0, scale: 0.85 },
                visible: { opacity: 1, scale: 1, transition: { type: 'spring', stiffness: 120, delay: 0.1 } },
              }}
            >
              {/* LinkedIn */}
              <a
                href={personalInfo?.linkedin_url || '#'}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-glow btn-linkedin"
                aria-label="LinkedIn Profile"
              >
                <span className="btn-glow-label">
                  <FaLinkedin size={17} /> LinkedIn
                </span>
              </a>

              {/* GitHub */}
              <a
                href={personalInfo?.github_url || '#'}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-glow btn-github"
                aria-label="GitHub Profile"
              >
                <span className="btn-glow-label">
                  <FaGithub size={17} /> GitHub
                </span>
              </a>
            </motion.div>
          </div>

          {/* ── Image column ── */}
          <motion.div
            className="hero-image-full"
            variants={{
              hidden:  { opacity: 0, x: 50 },
              visible: { opacity: 1, x: 0,
                         transition: { type: 'spring', duration: 1.6, bounce: 0.3 } },
            }}
          >
            <img 
              src={personalInfo?.profile_image ? `http://localhost:5000${personalInfo.profile_image}` : profileImage} 
              alt={personalInfo?.full_name || "Sarthak Sharma"} 
              className="hero-full-person" 
            />
          </motion.div>
        </motion.div>

        {/* Scroll cue */}
        <motion.div
          className="scroll-indicator"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 1.8 }}
          onClick={scrollToAbout}
        >
          <FaChevronDown className="scroll-arrow" />
          <span>Scroll to explore</span>
        </motion.div>
      </div>
    </motion.section>
  );
};

export default Home;