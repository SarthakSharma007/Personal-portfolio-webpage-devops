/* client/src/components/Projects.js */
import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { FaGithub, FaArrowRight } from 'react-icons/fa';
import api from '../services/api';
import './Projects.css';

const viewportConfig = { once: false, amount: 0.15 };

const headerVariant = {
  hidden: { opacity: 0, y: 30, scale: 0.9 },
  visible: {
    opacity: 1, y: 0, scale: 1,
    transition: { duration: 0.7, ease: "easeOut", delay: 0 }
  }
};

const Tag = ({ label, accentA }) => (
  <span className="prj-tag" style={{ '--ta': accentA }}>{label}</span>
);

const HeroCard = ({ p }) => {
  const cardVariant = {
    hidden: { opacity: 0, scale: 0.5, rotateY: 30, transformPerspective: 1000 },
    visible: { 
      opacity: 1, scale: 1, rotateY: 0, transformPerspective: 1000,
      transition: { duration: 0.8, type: "spring", stiffness: 100, damping: 20 } 
    }
  };

  return (
    <motion.div
      className="prj-hero-card"
      style={{ background: p.gradient }}
      variants={cardVariant}
      initial="hidden"
      whileInView="visible"
      viewport={viewportConfig}
    >
      <span className="prj-ghost-num">{p.num}</span>
      <div className="prj-orb prj-orb-a" style={{ background: p.accentA }} />
      <div className="prj-orb prj-orb-b" style={{ background: p.accentB }} />

      <div className="prj-hero-body">
        <span className="prj-label" style={{ '--ta': p.accentA }}>{p.label}</span>
        <h3 className="prj-hero-title">{p.title}</h3>
        <p className="prj-hero-desc">{p.shortDesc}</p>
        <div className="prj-tags">
          {p.tags.map(t => <Tag key={t} label={t} accentA={p.accentA} />)}
        </div>
        <div className="prj-actions">
          {p.github && (
            <a href={p.github} target="_blank" rel="noopener noreferrer" className="prj-btn" style={{ '--ta': p.accentA }}>
              <FaGithub /> GitHub
            </a>
          )}
          {p.slug ? (
            <Link to={`/projects/${p.slug}`} className="prj-btn see-more" style={{ '--ta': p.accentA }}>
              See More <FaArrowRight size={12} />
            </Link>
          ) : (
            p.demo && (
              <a href={p.demo} target="_blank" rel="noopener noreferrer" className="prj-btn see-more" style={{ '--ta': p.accentA }}>
                Live Demo <FaArrowRight size={12} />
              </a>
            )
          )}
        </div>
      </div>

      <div className="prj-hero-deco">
        <div className="prj-ring ring-1" style={{ borderColor: `${p.accentA}30` }} />
        <div className="prj-ring ring-2" style={{ borderColor: `${p.accentB}20` }} />
        <div className="prj-ring ring-3" style={{ borderColor: `${p.accentA}12` }} />
        <span className="prj-feat-badge">Featured</span>
      </div>
    </motion.div>
  );
};

const SmallCard = ({ p, index }) => {
  const cardVariant = {
    hidden: { opacity: 0, scale: 0.5, rotateY: -30, transformPerspective: 1000 },
    visible: { 
      opacity: 1, scale: 1, rotateY: 0, transformPerspective: 1000,
      transition: { duration: 0.7, delay: 0.15 + index * 0.1, type: "spring", stiffness: 100, damping: 20 } 
    }
  };

  return (
    <motion.div
      className="prj-small-card"
      style={{ background: p.gradient }}
      variants={cardVariant}
      initial="hidden"
      whileInView="visible"
      viewport={viewportConfig}
      whileHover={{ scale: 1.025, y: -6 }}
    >
      <div className="prj-small-glow" style={{ background: p.accentA }} />
      
      <div className="prj-small-body">
        <span className="prj-label" style={{ '--ta': p.accentA }}>{p.label}</span>
        <h3 className="prj-small-title">{p.title}</h3>
        <p className="prj-small-desc">{p.shortDesc}</p>
        
        <div className="prj-tags">
          {p.tags.slice(0, 3).map(t => <Tag key={t} label={t} accentA={p.accentA} />)}
        </div>

        <div className="prj-actions">
          {p.github && (
            <a href={p.github} target="_blank" rel="noopener noreferrer" className="prj-btn small" style={{ '--ta': p.accentA }}>
              <FaGithub /> GitHub
            </a>
          )}
          {p.slug ? (
            <Link to={`/projects/${p.slug}`} className="prj-btn see-more small" style={{ '--ta': p.accentA }}>
              See More <FaArrowRight size={11} />
            </Link>
          ) : (
            p.demo && (
              <a href={p.demo} target="_blank" rel="noopener noreferrer" className="prj-btn see-more small" style={{ '--ta': p.accentA }}>
                Live Demo <FaArrowRight size={11} />
              </a>
            )
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
  hero: !!p.hero,
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

  const hero = items.find(p => p.hero) || items[0];
  const rest = items.filter(p => p.id !== hero?.id);

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

        {hero && <HeroCard p={hero} />}

        <div className="prj-small-row">
          {rest.map((p, i) => <SmallCard key={p.id} p={p} index={i} />)}
        </div>
      </div>
    </section>
  );
};

export default Projects;