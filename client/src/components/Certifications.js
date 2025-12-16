/* client/src/components/Certifications.js */
import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaExternalLinkAlt, FaCloud, FaGitAlt, FaAward, FaCheckCircle } from 'react-icons/fa';
import { SiLinux, SiKubernetes, SiGitlab } from 'react-icons/si';
import api from '../services/api';
import './Certifications.css';

/* ─── Certification Data ─────────────────────────────────── */
const CERTIFICATIONS = [
  {
    id: 1,
    name: 'Introduction to Containers, Kubernetes, and OpenShift',
    org: 'CognitiveClass.ai',
    date: 'July 12, 2025',
    credId: 'CC0201EN',
    url: 'https://courses.cognitiveclass.ai/certificates/3b62291dfc534c06898e6b94beacbb46',
    icon: SiKubernetes,
    color: '#818cf8',
    gradient: 'linear-gradient(135deg, #1e1b4b 0%, #312e81 100%)',
  },
  {
    id: 2,
    name: 'Introduction to Linux',
    org: 'The Linux Foundation',
    date: 'June 28, 2025',
    credId: 'LF-ku85gwty6e',
    url: 'https://drive.google.com/file/d/1o_Uz0TCW70ejhGt1qNEE42hqMKoTY4bc/view?usp=sharing',
    icon: SiLinux,
    color: '#fbbf24',
    gradient: 'linear-gradient(135deg, #262626 0%, #404040 100%)',
  },
  {
    id: 3,
    name: 'Introduction to GitOps',
    org: 'The Linux Foundation',
    date: 'April 25, 2025',
    credId: 'LF-qpj6j47gsq',
    url: 'https://drive.google.com/file/d/18f9Uq3V7B63IAqM50gSThfSam2AlnLNA/view?usp=sharing',
    icon: FaGitAlt,
    color: '#f97316',
    gradient: 'linear-gradient(135deg, #431407 0%, #7c2d12 100%)',
  },
  {
    id: 4,
    name: 'GitLab 101 Certification',
    org: 'GitLab',
    date: 'June 15, 2025',
    credId: 'N/A',
    url: 'https://drive.google.com/file/d/1Igey6zht7uBiQQQGDBpUOnsZ-E_0TvZ2/view?usp=sharing',
    icon: SiGitlab,
    color: '#f43f5e',
    gradient: 'linear-gradient(135deg, #4c0519 0%, #881337 100%)',
  },
  {
    id: 5,
    name: 'Introduction to Cloud Computing',
    org: 'Simplilearn',
    date: 'April 20, 2025',
    credId: 'N/A',
    url: 'https://drive.google.com/file/d/1BC2vh2gBgEFVBKXIoHcC7pfhltqNocQd/view?usp=sharing',
    icon: FaCloud,
    color: '#38bdf8',
    gradient: 'linear-gradient(135deg, #082f49 0%, #0c4a6e 100%)',
  },
];

const viewportConfig = { once: false, amount: 0.15 };

const headerVariant = {
  hidden: { opacity: 0, scale: 0.8 },
  visible: {
    opacity: 1, scale: 1,
    transition: { type: "spring", stiffness: 100, delay: 0 }
  }
};

const leftVariant = {
  hidden: { opacity: 0, x: -100, rotate: -5 },
  visible: {
    opacity: 1, x: 0, rotate: 0,
    transition: { type: "spring", bounce: 0.3, duration: 0.8, delay: 0.2 }
  }
};

const rightVariant = {
  hidden: { opacity: 0, x: 100, rotate: 5 },
  visible: {
    opacity: 1, x: 0, rotate: 0,
    transition: { type: "spring", bounce: 0.3, duration: 0.8, delay: 0.4 }
  }
};

/* ─── Main Section ───────────────────────────────────────── */
const Certifications = () => {
  const [items, setItems] = useState(CERTIFICATIONS);
  const [activeId, setActiveId] = useState(CERTIFICATIONS[0].id);

  useEffect(() => {
    const fetchCerts = async () => {
      try {
        const res = await api.get('/certifications');
        if (!res.data?.success || !Array.isArray(res.data.data) || res.data.data.length === 0) return;
        const icons = [SiKubernetes, SiLinux, FaGitAlt, SiGitlab, FaCloud];
        const colors = ['#818cf8', '#fbbf24', '#f97316', '#f43f5e', '#38bdf8'];
        const gradients = [
          'linear-gradient(135deg, #1e1b4b 0%, #312e81 100%)',
          'linear-gradient(135deg, #262626 0%, #404040 100%)',
          'linear-gradient(135deg, #431407 0%, #7c2d12 100%)',
          'linear-gradient(135deg, #4c0519 0%, #881337 100%)',
          'linear-gradient(135deg, #082f49 0%, #0c4a6e 100%)'
        ];
        const mapped = res.data.data.map((cert, idx) => ({
          id: cert.id,
          name: cert.name || cert.cert_name || 'Untitled Certification',
          org: cert.issuing_organization || 'Organization',
          date: cert.issue_date ? new Date(cert.issue_date).toLocaleDateString() : 'Date not set',
          credId: cert.credential_id || 'N/A',
          url: cert.credential_url || null,
          icon: icons[idx % icons.length],
          color: colors[idx % colors.length],
          gradient: gradients[idx % gradients.length]
        }));
        setItems(mapped);
        setActiveId(mapped[0].id);
      } catch (e) {
        // Keep local fallback list on failure.
      }
    };
    fetchCerts();
  }, []);

  const activeCert = items.find((c) => c.id === activeId) || items[0];
  if (!activeCert) return null;
  const ActiveIcon = activeCert.icon;

  return (
    <section id="certifications" className="ct-section">
      <div className="ct-bg-grid" />
      <div className="ct-bg-glow" style={{ background: `${activeCert.color}25` }} />

      <div className="ct-container">
        
        {/* Header */}
        <motion.div
          className="ct-header"
          variants={headerVariant}
          initial="hidden"
          whileInView="visible"
          viewport={viewportConfig}
        >
          <span className="ct-eyebrow">Milestones & Achievements</span>
          <h2 className="ct-title"><em>Certification</em></h2>
        </motion.div>

        <div className="ct-layout">
          
          {/* Left Column: Interactive Plaque */}
          <motion.div
            className="ct-plaque-wrapper"
            variants={leftVariant}
            initial="hidden"
            whileInView="visible"
            viewport={viewportConfig}
          >
            <AnimatePresence mode="wait">
              <motion.div
                key={activeCert.id}
                className="ct-plaque"
                style={{ background: activeCert.gradient, borderColor: `${activeCert.color}40` }}
                initial={{ opacity: 0, scale: 0.95, rotateY: -15 }}
                animate={{ opacity: 1, scale: 1, rotateY: 0 }}
                exit={{ opacity: 0, scale: 0.95, rotateY: 15 }}
                transition={{ duration: 0.5, ease: 'easeOut' }}
              >
                <div className="ct-plaque-inner">
                  <div className="ct-plaque-top">
                    <div className="ct-icon-shield" style={{ color: activeCert.color, background: `${activeCert.color}20` }}>
                      <ActiveIcon size={40} />
                    </div>
                    <div className="ct-badge">
                      <FaAward size={14} /> Certified
                    </div>
                  </div>

                  <div className="ct-plaque-body">
                    <h3 className="ct-cert-name">{activeCert.name}</h3>
                    <p className="ct-cert-org" style={{ color: activeCert.color }}>{activeCert.org}</p>
                  </div>

                  <div className="ct-plaque-footer">
                    <div className="ct-meta-data">
                      <div>
                        <span className="ct-meta-label">Issued On</span>
                        <span className="ct-meta-value">{activeCert.date}</span>
                      </div>
                      <div>
                        <span className="ct-meta-label">Credential ID</span>
                        <span className="ct-meta-value id-code">{activeCert.credId}</span>
                      </div>
                    </div>

                    {activeCert.url && (
                      <a
                        href={activeCert.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="ct-verify-btn"
                        style={{ '--btn-color': activeCert.color }}
                      >
                        Verify Credential <FaExternalLinkAlt size={12} />
                      </a>
                    )}
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </motion.div>

          {/* Right Column: List */}
          <motion.div
            className="ct-list"
            variants={rightVariant}
            initial="hidden"
            whileInView="visible"
            viewport={viewportConfig}
          >
            {items.map((cert) => {
              const isActive = cert.id === activeId;
              const ListIcon = cert.icon;
              return (
                <button
                  key={cert.id}
                  className={`ct-list-item ${isActive ? 'active' : ''}`}
                  onClick={() => setActiveId(cert.id)}
                  style={{ '--active-color': cert.color }}
                >
                  <div className="ct-list-icon" style={{ color: isActive ? cert.color : 'inherit' }}>
                    <ListIcon size={20} />
                  </div>
                  <div className="ct-list-content">
                    <h4 className="ct-list-name">{cert.name}</h4>
                    <span className="ct-list-org">{cert.org}</span>
                  </div>
                  {isActive && (
                    <motion.div layoutId="active-indicator" className="ct-active-indicator" style={{ background: cert.color }}>
                      <FaCheckCircle size={14} color="#fff" />
                    </motion.div>
                  )}
                </button>
              );
            })}
          </motion.div>

        </div>
      </div>
    </section>
  );
};

export default Certifications;
