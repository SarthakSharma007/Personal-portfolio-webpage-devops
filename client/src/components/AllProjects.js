/* client/src/components/AllProjects.js */
import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaGithub, FaArrowRight, FaExternalLinkAlt, FaArrowLeft } from 'react-icons/fa';
import api from '../services/api';
import './AllProjects.css';

const viewportConfig = { once: false, amount: 0.1 };

const LEVEL_CONFIG = {
  Basic:        { color: '#34d399', label: 'Basic' },
  Intermediate: { color: '#fbbf24', label: 'Intermediate' },
  Advanced:     { color: '#f87171', label: 'Advanced' },
};

const Tag = ({ label, accentA }) => (
  <span className="ap-tag" style={{ '--ta': accentA }}>{label}</span>
);

const LevelBadge = ({ level }) => {
  const cfg = LEVEL_CONFIG[level] || LEVEL_CONFIG['Basic'];
  return (
    <span className="ap-level-badge" style={{ '--lc': cfg.color }}>
      <span className="ap-level-dot" />
      {cfg.label}
    </span>
  );
};

const ProjectBlock = ({ p, index }) => {
  const blockVariant = {
    hidden: { opacity: 0, y: 40 },
    visible: {
      opacity: 1, y: 0,
      transition: { duration: 0.6, delay: index * 0.06, ease: [0.22, 1, 0.36, 1] }
    }
  };

  return (
    <motion.div
      className="ap-block"
      style={{ background: p.gradient }}
      variants={blockVariant}
      initial="hidden"
      whileInView="visible"
      viewport={viewportConfig}
    >
      {/* Ghost number */}
      <span className="ap-ghost-num">{p.num}</span>

      {/* Glow orbs */}
      <div className="ap-orb ap-orb-a" style={{ background: p.accentA }} />
      <div className="ap-orb ap-orb-b" style={{ background: p.accentB }} />

      <div className="ap-block-body">
        {/* Top row: label + level */}
        <div className="ap-block-top">
          <span className="ap-label" style={{ '--ta': p.accentA }}>{p.label}</span>
          <LevelBadge level={p.difficultyLevel} />
        </div>

        {/* Title */}
        <h3 className="ap-block-title">{p.title}</h3>

        {/* Description */}
        <p className="ap-block-desc">{p.shortDesc}</p>

        {/* Tech stack */}
        <div className="ap-tags">
          {p.tags.slice(0, 5).map(t => <Tag key={t} label={t} accentA={p.accentA} />)}
          {p.tags.length > 5 && (
            <span className="ap-tag more">+{p.tags.length - 5}</span>
          )}
        </div>

        {/* Actions */}
        <div className="ap-actions">
          {p.github && p.showGithub && (
            <a href={p.github} target="_blank" rel="noopener noreferrer" className="ap-btn" style={{ '--ta': p.accentA }}>
              <FaGithub /> GitHub
            </a>
          )}
          {p.demo && p.showDemo && (
            <a href={p.demo} target="_blank" rel="noopener noreferrer" className="ap-btn" style={{ '--ta': p.accentA }}>
              <FaExternalLinkAlt size={12} /> Live Demo
            </a>
          )}
          {p.slug && p.showDetails && (
            <Link to={`/projects/${p.slug}`} className="ap-btn see-more" style={{ '--ta': p.accentA }}>
              See More <FaArrowRight size={11} />
            </Link>
          )}
        </div>
      </div>
    </motion.div>
  );
};

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
  showGithub: p.show_github !== 0 && p.show_github !== false && p.show_github !== '0',
  showDemo: p.show_demo !== 0 && p.show_demo !== false && p.show_demo !== '0',
  showDetails: p.show_details !== 0 && p.show_details !== false && p.show_details !== '0',
});

const AllProjects = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => { window.scrollTo(0, 0); }, []);

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const res = await api.get('/projects/all');
        if (res.data?.success && Array.isArray(res.data.data)) {
          setItems(res.data.data.map(mapDbProject));
        }
      } catch (e) {
        console.error('Failed to load projects:', e);
      } finally {
        setLoading(false);
      }
    };
    fetchAll();
  }, []);

  return (
    <div className="ap-page">
      <div className="ap-bg-glow ap-glow-1" />
      <div className="ap-bg-glow ap-glow-2" />
      <div className="ap-bg-grid" />

      <div className="ap-container">
        {/* Header */}
        <motion.div
          className="ap-header"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
        >
          <button onClick={() => navigate(-1)} className="ap-back">
            <FaArrowLeft size={13} /> Back to Projects
          </button>
          <p className="ap-eyebrow">Portfolio</p>
          <h1 className="ap-main-title">
            All <span className="ap-title-accent">Projects</span>
          </h1>
          <p className="ap-main-sub">
            Everything I've built — from small scripts to full-stack deployments.
          </p>
          <div className="ap-count-badge">{items.length} Projects</div>
        </motion.div>

        {/* Loading */}
        {loading && (
          <div className="ap-loading">
            <div className="ap-spinner" />
            <p>Loading projects...</p>
          </div>
        )}

        {/* Projects list */}
        <div className="ap-list">
          {items.map((p, i) => <ProjectBlock key={p.id} p={p} index={i} />)}
        </div>

        {!loading && items.length === 0 && (
          <div className="ap-empty">
            <p>No projects found yet.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AllProjects;
