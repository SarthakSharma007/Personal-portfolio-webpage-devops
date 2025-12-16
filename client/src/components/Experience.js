/* client/src/components/Experience.js */
import React from 'react';
import { motion } from 'framer-motion';
import { FaTerminal, FaCalendarAlt, FaMapMarkerAlt, FaBriefcase } from 'react-icons/fa';
import api from '../services/api';
import './Experience.css';

/* ─── Experience Data ────────────────────────────────────── */
const EXPERIENCES = [
  {
    id: 1,
    title: 'DevOps Intern',
    company: 'Elevate Labs',
    location: 'Remote',
    dateRange: 'Aug 2025 — Sep 2025',
    duration: '2 months',
    description: 'Engineered and implemented a full CI/CD pipeline using GitHub Actions, slashing build and release cycles by 95%. Eliminated 80% of configuration errors by creating a standardized Docker file and optimizing deployment workflows. Strengthened application security by integrating GitHub Secrets for credential management and enforcing automated Docker version tagging.',
    technologies: ['AWS', 'Jenkins', 'Docker', 'Kubernetes', 'Terraform', 'Python', 'Git'],
    color: '#818cf8', // Indigo
  },
  {
    id: 2,
    title: 'Full Stack Developer Intern',
    company: 'BMP Infotech',
    location: 'Jaipur, India',
    dateRange: 'May 2024 — Jul 2024',
    duration: '3 months',
    description: 'Working as a Full Stack Web Developer. Developed and solved real-time problems to create real-world projects. Collaborated closely with the design and backend teams to ensure seamless integration and performance.',
    technologies: ['HTML', 'CSS', 'JavaScript', 'MongoDB'],
    color: '#38bdf8', // Sky Blue
  }
];

const viewportConfig = { once: false, amount: 0.15 };

const headerVariant = {
  hidden: { opacity: 0, rotateX: -90, transformPerspective: 1000 },
  visible: {
    opacity: 1, rotateX: 0, transformPerspective: 1000,
    transition: { duration: 0.8, type: 'spring', bounce: 0.4, delay: 0 }
  }
};

/* ─── Timeline Card Component ────────────────────────────── */
const TimelineCard = ({ exp, index }) => {
  const itemVariant = {
    hidden: { opacity: 0, rotateX: -90, y: 50, transformPerspective: 1000 },
    visible: { 
      opacity: 1, rotateX: 0, y: 0, transformPerspective: 1000,
      transition: { duration: 0.8, delay: index * 0.15, type: 'spring', bounce: 0.4 } 
    }
  };

  return (
    <motion.div 
      className="xp-timeline-item"
      variants={itemVariant}
      initial="hidden"
      whileInView="visible"
      viewport={viewportConfig}
    >
      {/* Node on the central line */}
      <div className="xp-timeline-node" style={{ borderColor: exp.color, boxShadow: `0 0 15px ${exp.color}60` }}>
        <FaBriefcase style={{ color: exp.color }} size={14} />
      </div>

      {/* The Content Card */}
      <div className="xp-card-glass">
        {/* Ambient Top Glow */}
        <div className="xp-card-glow" style={{ background: `linear-gradient(90deg, ${exp.color}40, transparent)` }} />

        <div className="xp-card-header">
          <div className="xp-company-wrap">
            <h3 className="xp-company">{exp.company}</h3>
            <span className="xp-duration-badge" style={{ color: exp.color, background: `${exp.color}15` }}>
              {exp.duration}
            </span>
          </div>
          <h4 className="xp-role">{exp.title}</h4>
        </div>

        <div className="xp-meta">
          <span><FaCalendarAlt size={12} /> {exp.dateRange}</span>
          <span><FaMapMarkerAlt size={12} /> {exp.location}</span>
        </div>

        <p className="xp-desc">{exp.description}</p>

        <div className="xp-tech-stack">
          {exp.technologies.map((tech, i) => (
            <span key={i} className="xp-tech-pill" style={{ '--pill-color': exp.color }}>
              {tech}
            </span>
          ))}
        </div>
      </div>
    </motion.div>
  );
};

/* ─── Main Section ───────────────────────────────────────── */
const Experience = () => {
  const [records, setRecords] = React.useState(EXPERIENCES);

  React.useEffect(() => {
    const fetchExperiences = async () => {
      try {
        const res = await api.get('/experiences');
        if (!res.data?.success || !Array.isArray(res.data.data) || res.data.data.length === 0) return;
        const mapped = res.data.data.map((item, idx) => {
          const start = item.start_date ? new Date(item.start_date).toLocaleString('default', { month: 'short', year: 'numeric' }) : '';
          const end = item.current ? 'Present' : (item.end_date ? new Date(item.end_date).toLocaleString('default', { month: 'short', year: 'numeric' }) : '');
          const technologies = item.technologies
            ? item.technologies.split(',').map((t) => t.trim()).filter(Boolean)
            : [];
          return {
            id: item.id,
            title: item.title || '',
            company: item.company || '',
            location: item.location || 'Remote',
            dateRange: `${start}${start && end ? ' — ' : ''}${end}`,
            duration: item.type || 'Experience',
            description: item.description || '',
            technologies,
            color: ['#818cf8', '#38bdf8', '#22c55e', '#f97316'][idx % 4]
          };
        });
        setRecords(mapped);
      } catch (e) {
        // Keep design fallback data if API fails.
      }
    };
    fetchExperiences();
  }, []);

  return (
    <section id="experience" className="xp-section">
      <div className="xp-bg-grid" />

      <div className="xp-container">

        {/* Header */}
        <motion.div
          className="xp-header-main"
          variants={headerVariant}
          initial="hidden"
          whileInView="visible"
          viewport={viewportConfig}
        >
          <div className="xp-eyebrow">
            <FaTerminal size={14} /> Career Journey
          </div>
          <h2 className="xp-heading">Experience</h2>
        </motion.div>

        {/* ─── Timeline Structure ─── */}
        <div className="xp-timeline-container">
          <div className="xp-timeline-line" />
          
          <div className="xp-timeline-list">
            {records.map((exp, index) => (
              <TimelineCard key={exp.id} exp={exp} index={index} />
            ))}
          </div>
        </div>

      </div>
    </section>
  );
};

export default Experience;
