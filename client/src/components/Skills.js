/* client/src/components/Skills.js */
import React, { useEffect } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import api from '../services/api';
import './Skills.css';

/* ─── Load Devicons ─────────────────────────────────────── */
const useDevicons = () => {
  useEffect(() => {
    const id = 'devicon-stylesheet';
    if (!document.getElementById(id)) {
      const link = document.createElement('link');
      link.id = id;
      link.rel = 'stylesheet';
      link.href = 'https://cdn.jsdelivr.net/gh/devicons/devicon@v2.16.0/devicon.min.css';
      document.head.appendChild(link);
    }
  }, []);
};

/* ─── Skill Data ─────────────────────────────────────────── */
// Static CATEGORIES array has been migrated to the database.

/* ─── Single Skill Tile ──────────────────────────────────── */
const SkillTile = ({ skill, delay = 0, glow, motionConfig, mobileMotion }) => {
  const [hovered, setHovered] = React.useState(false);

  const tileVariant = {
    hidden: {
      opacity: 0,
      y: mobileMotion ? 8 : 14,
      scale: mobileMotion ? 0.995 : 0.98
    },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        ...motionConfig.tileTransition,
        delay
      }
    }
  };

  return (
    <motion.div
      className="sk2-tile"
      style={{ background: hovered ? `${glow}` : skill.bg }}
      variants={tileVariant}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      whileHover={mobileMotion ? undefined : { scale: 1.04, y: -4 }}
      transition={motionConfig.hoverTransition}
    >
      <div className="sk2-tile-icon">
        {skill.emoji ? (
          <span className="sk2-emoji">{skill.emoji}</span>
        ) : (
          <i className={`${skill.icon} sk2-devicon`} />
        )}
      </div>
      <span className="sk2-tile-name">{skill.name}</span>
    </motion.div>
  );
};

/* ─── Category Card ──────────────────────────────────────── */
const CategoryCard = ({ cat, motionConfig, mobileMotion }) => {
  const cardVariant = {
    hidden: {
      opacity: 0,
      y: mobileMotion ? 20 : 32,
      scale: mobileMotion ? 0.995 : 0.985
    },
    visible: {
      opacity: 1,
      scale: 1,
      y: 0,
      transition: {
        ...motionConfig.cardTransition,
        staggerChildren: motionConfig.staggerChildren,
        delayChildren: motionConfig.delayChildren
      }
    }
  };

  return (
    <motion.div
      className={`sk2-card sk2-${cat.span}`}
      style={{ '--glow': cat.glow }}
      variants={cardVariant}
      initial="hidden"
      whileInView="visible"
      viewport={motionConfig.viewport}
    >
      <div className="sk2-card-bar" style={{ background: cat.gradient }} />
      <div className="sk2-card-blob" />

      <div className="sk2-card-head">
        <h3 className="sk2-card-label">{cat.label}</h3>
      </div>

      <div className="sk2-tiles-wrap">
        {cat.skills.map((skill, i) => (
          <SkillTile
            key={skill.name}
            skill={skill}
            delay={i * motionConfig.tileDelayStep}
            glow={cat.glow}
            motionConfig={motionConfig}
            mobileMotion={mobileMotion}
          />
        ))}
      </div>
    </motion.div>
  );
};

/* ─── Animated background dots ──────────────────────────── */
const BgDots = () => (
  <div className="sk2-bg-dots" aria-hidden="true">
    {Array.from({ length: 40 }, (_, i) => (
      <span
        key={i}
        className="sk2-dot"
        style={{
          left: `${Math.random() * 100}%`,
          top: `${Math.random() * 100}%`,
          animationDelay: `${Math.random() * 6}s`,
          animationDuration: `${4 + Math.random() * 5}s`,
          width: `${2 + Math.random() * 3}px`,
          height: `${2 + Math.random() * 3}px`
        }}
      />
    ))}
  </div>
);

/* ─── Main Skills Component ──────────────────────────────── */
const Skills = () => {
  useDevicons();
  const reducedMotion = useReducedMotion();
  const [categories, setCategories] = React.useState([]);
  const [headerSettings, setHeaderSettings] = React.useState({
    subtitle: 'MY TOOLKIT',
    title: 'Technologies & ',
    title_highlight: 'Skills',
    title_gradient: 'linear-gradient(135deg, #a855f7 0%, #ec4899 100%)',
    description: 'The tools and technologies I use to build, deploy, and scale cloud-native systems.'
  });

  const mobileMotion = typeof window !== 'undefined'
    && window.matchMedia('(max-width: 900px), (pointer: coarse)').matches;

  const motionConfig = reducedMotion
    ? {
        headerTransition: { duration: 0.22, ease: 'linear' },
        cardTransition: { duration: 0.2, ease: 'linear' },
        tileTransition: { duration: 0.15, ease: 'linear' },
        hoverTransition: { duration: 0.18, ease: 'linear' },
        staggerChildren: 0.02,
        delayChildren: 0,
        tileDelayStep: 0.03,
        viewport: { once: false, amount: 0.35, margin: '0px 0px -2% 0px' }
      }
    : {
        headerTransition: {
          type: 'spring',
          stiffness: mobileMotion ? 115 : 130,
          damping: mobileMotion ? 20 : 22,
          mass: mobileMotion ? 0.95 : 0.9
        },
        cardTransition: {
          type: 'spring',
          stiffness: mobileMotion ? 105 : 120,
          damping: mobileMotion ? 22 : 24,
          mass: mobileMotion ? 1.02 : 0.95
        },
        tileTransition: {
          type: 'spring',
          stiffness: mobileMotion ? 125 : 145,
          damping: mobileMotion ? 18 : 20,
          mass: 0.85
        },
        hoverTransition: {
          type: 'spring',
          stiffness: 220,
          damping: 20,
          mass: 0.7
        },
        staggerChildren: mobileMotion ? 0.026 : 0.04,
        delayChildren: mobileMotion ? 0.03 : 0.06,
        tileDelayStep: mobileMotion ? 0.032 : 0.06,
        viewport: {
          once: false,
          amount: mobileMotion ? 0.32 : 0.24,
          margin: '0px 0px -4% 0px'
        }
      };

  const headerVariant = {
    hidden: { opacity: 0, y: mobileMotion ? 16 : 24 },
    visible: {
      opacity: 1,
      y: 0,
      transition: motionConfig.headerTransition
    }
  };

  useEffect(() => {
    const fetchSkills = async () => {
      try {
        const [catRes, skillsRes, headerRes] = await Promise.all([
          api.get('/skillCategories').catch(() => ({ data: { data: [] } })),
          api.get('/skills').catch(() => ({ data: { data: [] } })),
          api.get('/sectionSettings/skills').catch(() => ({ data: { data: null } }))
        ]);

        if (headerRes.data?.data) {
          setHeaderSettings(headerRes.data.data);
        }

        const dbCategories = catRes.data?.data || [];
        const dbSkills = skillsRes.data?.data || [];

        const updatedCategories = dbCategories.map(cat => ({
          id: cat.category_id,
          label: cat.label,
          gradient: cat.gradient,
          glow: cat.glow,
          textColor: cat.textColor,
          span: cat.span,
          skills: dbSkills.filter(s => s.category === cat.category_id).map(s => ({
            name: s.name,
            icon: s.icon,
            emoji: s.emoji,
            bg: s.bg
          }))
        }));

        setCategories(updatedCategories);
      } catch (e) {
        console.error('Error fetching skills:', e);
      }
    };

    fetchSkills();
  }, []);

  return (
    <section id="skills" className="sk2-section">
      <div className="sk2-bg-grid" />
      <BgDots />
      <div className="sk2-bg-radial sk2-radial-1" />
      <div className="sk2-bg-radial sk2-radial-2" />
      <div className="sk2-bg-radial sk2-radial-3" />

      <div className="sk2-container">
        <motion.div
          className="sk2-header"
          variants={headerVariant}
          initial="hidden"
          whileInView="visible"
          viewport={motionConfig.viewport}
        >
          <span className="sk2-eyebrow">{headerSettings.subtitle}</span>
          <h2 className="sk2-title">
            {headerSettings.title} <span className="sk2-title-accent" style={{ background: headerSettings.title_gradient, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text', color: 'transparent' }}>{headerSettings.title_highlight}</span>
          </h2>
          <p className="sk2-subtitle">
            {headerSettings.description}
          </p>
        </motion.div>

        <div className="sk2-bento">
          {categories.map((cat) => (
            <CategoryCard
              key={cat.id}
              cat={cat}
              motionConfig={motionConfig}
              mobileMotion={mobileMotion}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Skills;