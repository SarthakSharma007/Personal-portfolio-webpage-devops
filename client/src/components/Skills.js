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

/* ─── Skill Data Defaults ───────────────────────────────── */
const DEFAULT_CATEGORIES = [
  {
    id: 'cloud',
    label: 'Cloud & DevOps',
    gradient: 'linear-gradient(135deg, #0ea5e9 0%, #6366f1 100%)',
    glow: 'rgba(99,102,241,0.4)',
    textColor: '#e0f2fe',
    span: 'wide',
    skills: [
      { name: 'Docker',      icon: 'devicon-docker-plain colored',                     bg: '#2496ed22' },
      { name: 'Kubernetes',  icon: 'devicon-kubernetes-plain colored',                 bg: '#326ce522' },
      { name: 'Jenkins',     icon: 'devicon-jenkins-line colored',                     bg: '#d3342022' },
      { name: 'Git',         icon: 'devicon-git-plain colored',                        bg: '#f0502422' },
      { name: 'Terraform',   icon: 'devicon-terraform-plain colored',                  bg: '#7b42bc22' },
      { name: 'Ansible',     icon: 'devicon-ansible-plain colored',                    bg: '#e0052622' },
      { name: 'AWS',         icon: 'devicon-amazonwebservices-plain-wordmark colored', bg: '#ff990022' },
      { name: 'Azure',       icon: 'devicon-azure-plain colored',                      bg: '#0078d422' },
      { name: 'CI/CD',       icon: 'devicon-githubactions-plain colored',              bg: '#2088ff22' },
      { name: 'Bash',        icon: 'devicon-bash-plain colored',                       bg: '#29304422' },
      { name: 'Networking',  icon: null, emoji: '🌐',                                  bg: '#00cfff22' }
    ]
  },
  {
    id: 'monitoring',
    label: 'Monitoring & Observability',
    gradient: 'linear-gradient(135deg, #f97316 0%, #ef4444 100%)',
    glow: 'rgba(249,115,22,0.35)',
    textColor: '#fff7ed',
    span: 'half',
    skills: [
      { name: 'Prometheus',    icon: 'devicon-prometheus-original colored', bg: '#e6522c22' },
      { name: 'Grafana',       icon: 'devicon-grafana-plain colored',        bg: '#f4600022' },
      { name: 'Elasticsearch', icon: 'devicon-elasticsearch-plain colored',  bg: '#00bfb322' }
    ]
  },
  {
    id: 'languages',
    label: 'Languages & Databases',
    gradient: 'linear-gradient(135deg, #8b5cf6 0%, #ec4899 100%)',
    glow: 'rgba(139,92,246,0.35)',
    textColor: '#fdf4ff',
    span: 'half',
    skills: [
      { name: 'Python',           icon: 'devicon-python-plain colored',     bg: '#3776ab22' },
      { name: 'Java',             icon: 'devicon-java-plain colored',       bg: '#5382a122' },
      { name: 'SQL / PostgreSQL', icon: 'devicon-postgresql-plain colored', bg: '#33698122' },
      { name: 'MongoDB',          icon: 'devicon-mongodb-plain colored',    bg: '#47a24822' },
      { name: 'Redis',            icon: 'devicon-redis-plain colored',      bg: '#dc382d22' }
    ]
  },
  {
    id: 'os',
    label: 'Operating Systems & Tools',
    gradient: 'linear-gradient(135deg, #10b981 0%, #0ea5e9 100%)',
    glow: 'rgba(16,185,129,0.35)',
    textColor: '#ecfdf5',
    span: 'wide',
    skills: [
      { name: 'Linux',   icon: 'devicon-linux-plain',               bg: '#fcc62422' },
      { name: 'Windows', icon: 'devicon-windows8-original colored', bg: '#0078d422' },
      { name: 'Nginx',   icon: 'devicon-nginx-original colored',    bg: '#00915822' },
      { name: 'Vagrant', icon: 'devicon-vagrant-plain colored',     bg: '#1868f222' }
    ]
  }
];

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
        ) : skill.icon ? (
          <i className={`${skill.icon} sk2-devicon`} />
        ) : (
          <span className="sk2-emoji">⚡</span>
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
  const [categories, setCategories] = React.useState(DEFAULT_CATEGORIES);
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
          setHeaderSettings(prev => ({ ...prev, ...headerRes.data.data }));
        }

        const dbCategories = catRes.data?.data || [];
        const dbSkills = skillsRes.data?.data || [];

        if (dbCategories.length > 0) {
          const updatedCategories = dbCategories.map(cat => {
            const catId = (cat.category_id || '').toLowerCase();
            const fallback = DEFAULT_CATEGORIES.find(c => c.id.toLowerCase() === catId) || {};
            const catSkills = dbSkills.filter(s => {
              const skillCat = (s.category || '').toLowerCase();
              return skillCat === catId || skillCat === (cat.label || '').toLowerCase();
            });

            return {
              id: cat.category_id || fallback.id || 'skills',
              label: cat.label || fallback.label || 'Skills',
              gradient: cat.gradient || fallback.gradient || 'linear-gradient(135deg, #0ea5e9 0%, #6366f1 100%)',
              glow: cat.glow || fallback.glow || 'rgba(99,102,241,0.4)',
              textColor: cat.textColor || fallback.textColor || '#e0f2fe',
              span: cat.span || fallback.span || 'half',
              skills: catSkills.length > 0
                ? catSkills.map(s => {
                    const fallbackSkill = (fallback.skills || []).find(fs => fs.name.toLowerCase() === (s.name || s.skill_name || '').toLowerCase()) || {};
                    return {
                      name: s.name || s.skill_name,
                      icon: s.icon || fallbackSkill.icon || (s.emoji ? null : 'devicon-devicon-plain colored'),
                      emoji: s.emoji || fallbackSkill.emoji || null,
                      bg: s.bg || fallbackSkill.bg || 'rgba(99,102,241,0.12)'
                    };
                  })
                : (fallback.skills || [])
            };
          });

          if (updatedCategories.length < DEFAULT_CATEGORIES.length) {
            const existingIds = new Set(updatedCategories.map(c => c.id.toLowerCase()));
            for (const defCat of DEFAULT_CATEGORIES) {
              if (!existingIds.has(defCat.id.toLowerCase())) {
                updatedCategories.push(defCat);
              }
            }
          }

          setCategories(updatedCategories);
        }
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
          <span className="sk2-eyebrow">{headerSettings.subtitle || 'MY TOOLKIT'}</span>
          <h2 className="sk2-title">
            {headerSettings.title || 'Technologies & '}
            <span
              className="sk2-title-accent"
              style={{
                backgroundImage: headerSettings.title_gradient || undefined,
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
                color: 'transparent',
                display: 'inline-block'
              }}
            >
              {headerSettings.title_highlight || 'Skills'}
            </span>
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