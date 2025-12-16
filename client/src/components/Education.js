/* client/src/components/Education.js */
import React from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { FaGraduationCap, FaUniversity, FaSchool, FaBookOpen } from 'react-icons/fa';
import api from '../services/api';
import './Education.css';

/* ─── Education Data ─────────────────────────────────────── */
const EDUCATION_DATA = [
  {
    id: 1,
    degree: 'Bachelor of Technology in Computer Science',
    institution: 'The ICFAI University, Jaipur',
    location: 'Jaipur, India',
    start_date: 'Sep 2022',
    end_date: 'May 2026',
    description: 'Built a strong foundation in programming, data structures, algorithms, and cloud computing. Actively contributed to campus leadership as the Discipline Secretary of the Student Council, fostering teamwork, discipline, and student engagement.',
    icon: FaUniversity,
    color: '#8b5cf6', // Violet
    isFeature: true,
  },
  {
    id: 2,
    degree: '12th Standard (High School)',
    institution: 'Shri Maheshwari Senior Secondary School',
    location: 'Jaipur, India',
    start_date: 'Apr 2020',
    end_date: 'Mar 2021',
    description: 'Completed 12th grade with a rigorous focus on Mathematics, Physics, and Chemistry.',
    icon: FaSchool,
    color: '#3b82f6', // Blue
    isFeature: false,
  },
  {
    id: 3,
    degree: '10th Standard',
    institution: 'Shri Maheshwari Senior Secondary School',
    location: 'Jaipur, India',
    start_date: 'Apr 2018',
    end_date: 'Mar 2019',
    description: 'Completed 10th grade with excellent academic performance and active participation in extracurricular activities.',
    icon: FaBookOpen,
    color: '#10b981', // Emerald
    isFeature: false,
  }
];

/* ─── Bento Card Component ───────────────────────────────── */
const BentoCard = ({ edu, index, motionConfig, viewportConfig }) => {
  const Icon = edu.icon;

  const cardVariant = {
    hidden: {
      opacity: 0,
      y: 44,
      scale: 0.965,
      rotateX: -8,
      clipPath: 'inset(0 0 22% 0 round 32px)',
      filter: motionConfig.useBlur ? 'blur(8px)' : 'none'
    },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      rotateX: 0,
      clipPath: 'inset(0 0 0% 0 round 32px)',
      filter: 'blur(0px)',
      transition: {
        ...motionConfig.cardTransition,
        delay: index * motionConfig.staggerStep
      }
    }
  };

  return (
    <motion.div
      className={`edu-bento-card ${edu.isFeature ? 'edu-feature' : 'edu-standard'}`}
      variants={cardVariant}
      initial="hidden"
      whileInView="visible"
      viewport={viewportConfig}
      style={{ '--theme-color': edu.color }}
    >
      {/* Background Watermark Icon */}
      <div className="edu-watermark">
        <Icon />
      </div>

      <div className="edu-card-inner">
        
        {/* Top Header Row */}
        <div className="edu-card-header">
          <div className="edu-icon-box" style={{ color: edu.color }}>
            <Icon size={24} />
          </div>
          <div className="edu-date-badge">
            {edu.start_date} — {edu.end_date}
          </div>
        </div>

        {/* Content Body */}
        <div className="edu-card-body">
          <h3 className="edu-degree">{edu.degree}</h3>
          <h4 className="edu-institution">
            {edu.institution} <span className="edu-location">({edu.location})</span>
          </h4>
          <p className="edu-desc">{edu.description}</p>
        </div>

      </div>
    </motion.div>
  );
};

/* ─── Main Section ───────────────────────────────────────── */
const Education = () => {
  const [records, setRecords] = React.useState(EDUCATION_DATA);
  const reducedMotion = useReducedMotion();

  React.useEffect(() => {
    const fetchEducation = async () => {
      try {
        const res = await api.get('/education');
        if (!res.data?.success || !Array.isArray(res.data.data) || res.data.data.length === 0) return;
        const icons = [FaUniversity, FaSchool, FaBookOpen];
        const colors = ['#8b5cf6', '#3b82f6', '#10b981', '#f97316'];
        const mapped = res.data.data.map((item, idx) => ({
          id: item.id,
          degree: item.degree || '',
          institution: item.institution || '',
          location: item.location || '',
          start_date: item.start_date ? new Date(item.start_date).toLocaleString('default', { month: 'short', year: 'numeric' }) : '',
          end_date: item.current ? 'Present' : (item.end_date ? new Date(item.end_date).toLocaleString('default', { month: 'short', year: 'numeric' }) : ''),
          description: item.description || '',
          icon: icons[idx % icons.length],
          color: colors[idx % colors.length],
          isFeature: idx === 0
        }));
        setRecords(mapped);
      } catch (e) {
        // Keep local fallback if API fails.
      }
    };
    fetchEducation();
  }, []);

  const viewportConfig = reducedMotion
    ? { once: true, amount: 0.25 }
    : { once: false, amount: 0.24, margin: '0px 0px -10% 0px' };

  const motionConfig = reducedMotion
    ? {
        useBlur: false,
        staggerStep: 0.04,
        headerTransition: { duration: 0.22, ease: 'linear' },
        cardTransition: { duration: 0.2, ease: 'linear' }
      }
    : {
        useBlur: true,
        staggerStep: 0.09,
        headerTransition: { type: 'spring', stiffness: 135, damping: 24, mass: 0.92 },
        cardTransition: { type: 'spring', stiffness: 125, damping: 22, mass: 0.95 }
      };

  const headerVariant = {
    hidden: {
      opacity: 0,
      y: 28,
      scale: 0.985,
      clipPath: 'inset(0 0 35% 0)',
      filter: motionConfig.useBlur ? 'blur(8px)' : 'none'
    },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      clipPath: 'inset(0 0 0% 0)',
      filter: 'blur(0px)',
      transition: motionConfig.headerTransition
    }
  };

  return (
    <section id="education" className="edu-section">
      
      {/* Abstract Background Meshes */}
      <div className="edu-bg-mesh top-right" />
      <div className="edu-bg-mesh bottom-left" />

      <div className="edu-container">
        
        {/* Section Header */}
        <motion.div 
          className="edu-header-main"
          variants={headerVariant}
          initial="hidden"
          whileInView="visible"
          viewport={viewportConfig}
        >
          <div className="edu-eyebrow">
            <FaGraduationCap size={16} /> Academic Background
          </div>
          <h2 className="edu-heading">Education & <em>Qualifications</em></h2>
        </motion.div>

        {/* Bento Box Grid */}
        <div className="edu-bento-grid">
          {records.map((edu, index) => (
            <BentoCard
              key={edu.id}
              edu={edu}
              index={index}
              motionConfig={motionConfig}
              viewportConfig={viewportConfig}
            />
          ))}
        </div>

      </div>
    </section>
  );
};

export default Education;
