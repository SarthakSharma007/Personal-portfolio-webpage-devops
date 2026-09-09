/* client/src/components/Projects.js */
import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { FaGithub, FaArrowRight, FaExternalLinkAlt } from 'react-icons/fa';
import api from '../services/api';
import './Projects.css';

const viewportConfig = { once: false, amount: 0.1 };

const headerVariant = {
  hidden: { opacity: 0, y: 30, scale: 0.9 },
  visible: {
    opacity: 1, y: 0, scale: 1,
    transition: { duration: 0.7, ease: "easeOut", delay: 0 }
  }
};

const LEVEL_CONFIG = {
  Basic:        { color: '#34d399', label: 'Basic' },
  Intermediate: { color: '#fbbf24', label: 'Intermediate' },
  Advanced:     { color: '#f87171', label: 'Advanced' },
};

const Tag = ({ label, accentA }) => (
  <span className="prj-tag" style={{ '--ta': accentA }}>{label}</span>
);

const LevelBadge = ({ level }) => {
  const cfg = LEVEL_CONFIG[level] || LEVEL_CONFIG['Basic'];
  return (
    <span className="prj-level-badge" style={{ '--lc': cfg.color }}>
      <span className="prj-level-dot" />
      {cfg.label}
    </span>
  );
};

const ProjectCard = ({ p, index }) => {
  const cardVariant = {
    hidden: { opacity: 0, scale: 0.85, y: 30 },
    visible: {
      opacity: 1, scale: 1, y: 0,
      transition: { duration: 0.6, delay: index * 0.08, type: "spring", stiffness: 90, damping: 18 }
    }
  };

  return (
    <motion.div
      className="prj-card"
      style={{ background: p.gradient }}
      variants={cardVariant}
      initial="hidden"
      whileInView="visible"
      viewport={viewportConfig}
      whileHover={{ scale: 1.022, y: -6 }}
    >
      {/* Background serial number */}
      <span className="prj-ghost-num">{p.num}</span>

      {/* Glow orbs */}
      <div className="prj-orb prj-orb-a" style={{ background: p.accentA }} />
      <div className="prj-orb prj-orb-b" style={{ background: p.accentB }} />

      <div className="prj-card-body">
        {/* Top row: label + level badge */}
        <div className="prj-card-top">
          <span className="prj-label" style={{ '--ta': p.accentA }}>{p.label}</span>
          <LevelBadge level={p.difficultyLevel} />
        </div>

        {/* Title */}
        <h3 className="prj-card-title">{p.title}</h3>

        {/* Short description */}
        <p className="prj-card-desc">{p.shortDesc}</p>

        {/* Tech stack */}
        <div className="prj-tags">
          {p.tags.slice(0, 4).map(t => <Tag key={t} label={t} accentA={p.accentA} />)}
          {p.tags.length > 4 && (
            <span className="prj-tag more">+{p.tags.length - 4}</span>
          )}
        </div>

        {/* Actions */}
        <div className="prj-actions">
          {p.github && p.showGithub && (
            <a href={p.github} target="_blank" rel="noopener noreferrer" className="prj-btn" style={{ '--ta': p.accentA }}>
              <FaGithub /> GitHub
            </a>
          )}
          {p.demo && p.showDemo && (
            <a href={p.demo} target="_blank" rel="noopener noreferrer" className="prj-btn" style={{ '--ta': p.accentA }}>
              <FaExternalLinkAlt size={12} /> Live Demo
            </a>
          )}
          {p.slug && p.showDetails && (
            <Link to={`/projects/${p.slug}`} className="prj-btn see-more" style={{ '--ta': p.accentA }}>
              See More <FaArrowRight size={11} />
            </Link>
          )}
        </div>
      </div>
    </motion.div>
  );
};

// Convert a raw DB project row to the shape the card components expect
const mapDbProject = (p, index) => ({
  id: p.id,
  slug: p.slug || null,
  num: p.num || String(index + 1).padStart(2, '0'),
  title: p.title,
  shortDesc: p.short_desc || p.description || '',
  tags: p.tech_stack ? p.tech_stack.split(',').map(t => t.trim()).filter(Boolean) : [],
  github: p.github_link || null,
  demo: p.demo_link || null,
  gradient: p.gradient || 'linear-gradient(135deg, #1a1040 0%, #312e81 50%, #1e3a5f 100%)',
  accentA: p.accent_a || '#818cf8',
  accentB: p.accent_b || '#38bdf8',
  label: p.label || 'Project',
  difficultyLevel: p.difficulty_level || 'Basic',
  hero: !!p.hero,
  showGithub: p.show_github !== 0 && p.show_github !== false && p.show_github !== '0',
  showDemo: p.show_demo !== 0 && p.show_demo !== false && p.show_demo !== '0',
  showDetails: p.show_details !== 0 && p.show_details !== false && p.show_details !== '0',
});

const Projects = () => {
  const [items, setItems] = React.useState([]);
  const [headerSettings, setHeaderSettings] = React.useState({
    subtitle: "What I've Built",
    title: 'Featured ',
    title_highlight: 'Projects',
    title_gradient: 'linear-gradient(135deg, #818cf8 0%, #38bdf8 100%)',
    description: 'Real-world DevOps & automation projects — built, deployed, and documented end-to-end.'
  });

  React.useEffect(() => {
    const fetchAll = async () => {
      try {
        const [res, headerRes] = await Promise.all([
          api.get('/projects').catch(() => ({ data: { success: false, data: [] } })),
          api.get('/sectionSettings/projects').catch(() => ({ data: { data: null } }))
        ]);
        
        if (headerRes.data?.data) {
          setHeaderSettings(headerRes.data.data);
        }

        if (res.data?.success && Array.isArray(res.data.data) && res.data.data.length > 0) {
          setItems(res.data.data.map(mapDbProject));
        }
      } catch (e) {
        console.error('Failed to load projects:', e);
      }
    };
    fetchAll();
  }, []);

  return (
    <section id="projects" className="prj-section">
      <div className="prj-bg-glow prj-glow-1" />
      <div className="prj-bg-glow prj-glow-2" />
      <div className="prj-bg-grid" />

      <div className="prj-container">
        <motion.div
          className="prj-header"
          variants={headerVariant}
          initial="hidden"
          whileInView="visible"
          viewport={viewportConfig}
        >
          <p className="prj-eyebrow">{headerSettings.subtitle}</p>
          <h2 className="prj-main-title">
            {headerSettings.title}
            <span style={{ 
              background: headerSettings.title_gradient, 
              WebkitBackgroundClip: 'text', 
              WebkitTextFillColor: 'transparent', 
              backgroundClip: 'text', 
              color: 'transparent' 
            }}>{headerSettings.title_highlight}</span>
          </h2>
          <p className="prj-main-sub">
            {headerSettings.description}
          </p>
        </motion.div>

        <div className="prj-grid">
          {items.map((p, i) => <ProjectCard key={p.id} p={p} index={i} />)}
        </div>

        <motion.div
          className="prj-see-all"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={viewportConfig}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <Link to="/projects" className="prj-see-all-btn">
            See More Projects <FaArrowRight size={14} />
          </Link>
        </motion.div>
      </div>
    </section>
  );
};

export default Projects;