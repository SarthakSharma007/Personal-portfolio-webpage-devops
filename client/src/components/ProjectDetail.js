/* client/src/components/ProjectDetail.js */
import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaGithub, FaArrowLeft, FaExternalLinkAlt, FaCheckCircle } from 'react-icons/fa';
import api from '../services/api';
import './ProjectDetail.css';

/* ─── Fade-in wrapper ────────────────────────────────── */
const Fade = ({ children, delay = 0, y = 24 }) => (
  <motion.div
    initial={{ opacity: 0, y }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.6, delay, ease: [0.22, 1, 0.36, 1] }}
  >
    {children}
  </motion.div>
);

const ProjectDetail = () => {
  const { slug } = useParams();
  const [project, setProject] = useState(null);
  const [otherProjects, setOtherProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => { window.scrollTo(0, 0); }, [slug]);

  useEffect(() => {
    const fetchProject = async () => {
      setLoading(true);
      setNotFound(false);
      try {
        const [detailRes, allRes] = await Promise.all([
          api.get(`/projects/slug/${slug}`),
          api.get('/projects')
        ]);

        if (!detailRes.data?.success || !detailRes.data?.data) {
          setNotFound(true);
          return;
        }

        const raw = detailRes.data.data;
        // Normalise the shape expected by the template
        setProject({
          id: raw.id,
          slug: raw.slug,
          num: raw.num || '01',
          title: raw.title,
          label: raw.label || 'Project',
          shortDesc: raw.short_desc || raw.description || '',
          tags: raw.tech_stack ? raw.tech_stack.split(',').map(t => t.trim()).filter(Boolean) : [],
          github: raw.github_link || null,
          demo: raw.demo_link || null,
          gradient: raw.gradient || 'linear-gradient(135deg, #1a1040 0%, #312e81 50%, #1e3a5f 100%)',
          accentA: raw.accent_a || '#818cf8',
          accentB: raw.accent_b || '#38bdf8',
          overview: raw.overview || '',
          problem: raw.problem || '',
          solution: raw.solution || '',
          techStack: Array.isArray(raw.tech_stack_json) ? raw.tech_stack_json : [],
          timeline: Array.isArray(raw.timeline_json) ? raw.timeline_json : [],
          learnings: Array.isArray(raw.learnings_json) ? raw.learnings_json : [],
        });

        // Other projects (exclude current)
        if (allRes.data?.success && Array.isArray(allRes.data.data)) {
          setOtherProjects(
            allRes.data.data
              .filter(p => p.slug && p.slug !== slug)
              .map(p => ({
                id: p.id,
                slug: p.slug,
                num: p.num || '',
                title: p.title,
                label: p.label || 'Project',
                gradient: p.gradient || 'linear-gradient(135deg, #1a1040 0%, #312e81 50%, #1e3a5f 100%)',
                accentA: p.accent_a || '#818cf8',
              }))
          );
        }
      } catch (err) {
        console.error('Error loading project:', err);
        setNotFound(true);
      } finally {
        setLoading(false);
      }
    };
    fetchProject();
  }, [slug]);

  if (loading) {
    return (
      <div className="pd-not-found">
        <p>Loading project...</p>
      </div>
    );
  }

  if (notFound || !project) {
    return (
      <div className="pd-not-found">
        <h2>Project not found</h2>
        <Link to="/#projects" className="pd-back-btn">← Back to Projects</Link>
      </div>
    );
  }

  return (
    <div className="pd-page">
      {/* ── Hero Banner ─────────────────────────────── */}
      <div className="pd-hero" style={{ background: project.gradient }}>
        <div className="pd-orb pd-orb-1" style={{ background: project.accentA }} />
        <div className="pd-orb pd-orb-2" style={{ background: project.accentB }} />
        <span className="pd-ghost-num">{project.num}</span>

        <div className="pd-hero-inner">
          <Fade delay={0.05}>
            <Link to="/#projects" className="pd-back">
              <FaArrowLeft size={13} /> Back to Projects
            </Link>
          </Fade>

          <Fade delay={0.12}>
            <span className="pd-hero-label" style={{ color: project.accentA }}>
              {project.label}
            </span>
          </Fade>

          <Fade delay={0.2}>
            <h1 className="pd-hero-title">{project.title}</h1>
          </Fade>

          <Fade delay={0.28}>
            <p className="pd-hero-desc">{project.shortDesc}</p>
          </Fade>

          <Fade delay={0.36}>
            <div className="pd-hero-tags">
              {project.tags.map(t => (
                <span key={t} className="pd-tag" style={{ '--ta': project.accentA }}>{t}</span>
              ))}
            </div>
          </Fade>

          <Fade delay={0.44}>
            <div className="pd-hero-actions">
              {project.github && (
                <a href={project.github} target="_blank" rel="noopener noreferrer"
                  className="pd-btn-fill" style={{ '--ta': project.accentA }}>
                  <FaGithub /> View on GitHub
                </a>
              )}
              {project.demo && (
                <a href={project.demo} target="_blank" rel="noopener noreferrer"
                  className="pd-btn-outline">
                  <FaExternalLinkAlt size={13} /> Live Demo
                </a>
              )}
            </div>
          </Fade>
        </div>
      </div>

      {/* ── Content ─────────────────────────────────── */}
      <div className="pd-content">

        {/* Overview + Problem + Solution */}
        {(project.overview || project.problem || project.solution) && (
          <section className="pd-section">
            <div className="pd-two-col">
              {project.overview && (
                <Fade delay={0.1}>
                  <div className="pd-block">
                    <div className="pd-block-label" style={{ '--ta': project.accentA }}>Overview</div>
                    <p className="pd-block-text">{project.overview}</p>
                  </div>
                </Fade>
              )}

              <div className="pd-col-stack">
                {project.problem && (
                  <Fade delay={0.18}>
                    <div className="pd-block accent-left" style={{ '--ta': project.accentA }}>
                      <div className="pd-block-label" style={{ '--ta': project.accentA }}>The Problem</div>
                      <p className="pd-block-text">{project.problem}</p>
                    </div>
                  </Fade>
                )}
                {project.solution && (
                  <Fade delay={0.26}>
                    <div className="pd-block accent-left" style={{ '--ta': project.accentA }}>
                      <div className="pd-block-label" style={{ '--ta': project.accentA }}>The Solution</div>
                      <p className="pd-block-text">{project.solution}</p>
                    </div>
                  </Fade>
                )}
              </div>
            </div>
          </section>
        )}

        {/* Tech Stack */}
        {project.techStack.length > 0 && (
          <section className="pd-section">
            <Fade delay={0.1}>
              <h2 className="pd-section-title">
                <span className="pd-section-accent" style={{ background: project.gradient }}>Tech Stack</span>
              </h2>
            </Fade>
            <div className="pd-tech-grid">
              {project.techStack.map((tech, i) => (
                <Fade key={tech.name || i} delay={0.08 + i * 0.07}>
                  <div className="pd-tech-card" style={{ '--ta': project.accentA }}>
                    <div className="pd-tech-name">{tech.name}</div>
                    <div className="pd-tech-purpose">{tech.purpose}</div>
                  </div>
                </Fade>
              ))}
            </div>
          </section>
        )}

        {/* Timeline */}
        {project.timeline.length > 0 && (
          <section className="pd-section">
            <Fade delay={0.1}>
              <h2 className="pd-section-title">
                <span className="pd-section-accent" style={{ background: project.gradient }}>How It Was Built</span>
              </h2>
            </Fade>
            <div className="pd-timeline">
              {project.timeline.map((step, i) => (
                <Fade key={step.step || i} delay={0.06 + i * 0.08}>
                  <div className="pd-timeline-item">
                    <div className="pd-timeline-marker">
                      <div className="pd-timeline-dot" style={{ background: project.accentA }} />
                      {i < project.timeline.length - 1 && (
                        <div className="pd-timeline-line" style={{ background: `linear-gradient(180deg, ${project.accentA}60, transparent)` }} />
                      )}
                    </div>
                    <div className="pd-timeline-body">
                      <span className="pd-timeline-step" style={{ color: project.accentA }}>Step {step.step}</span>
                      <h4 className="pd-timeline-title">{step.title}</h4>
                      <p className="pd-timeline-desc">{step.desc}</p>
                    </div>
                  </div>
                </Fade>
              ))}
            </div>
          </section>
        )}

        {/* Key Learnings */}
        {project.learnings.length > 0 && (
          <section className="pd-section">
            <Fade delay={0.1}>
              <h2 className="pd-section-title">
                <span className="pd-section-accent" style={{ background: project.gradient }}>Key Learnings</span>
              </h2>
            </Fade>
            <div className="pd-learnings">
              {project.learnings.map((item, i) => (
                <Fade key={i} delay={0.06 + i * 0.07}>
                  <div className="pd-learning-item">
                    <FaCheckCircle className="pd-check" style={{ color: project.accentA }} />
                    <span>{item}</span>
                  </div>
                </Fade>
              ))}
            </div>
          </section>
        )}

        {/* Other Projects */}
        {otherProjects.length > 0 && (
          <section className="pd-section pd-other-section">
            <Fade delay={0.05}>
              <h2 className="pd-section-title">
                <span className="pd-section-accent" style={{ background: project.gradient }}>Other Projects</span>
              </h2>
            </Fade>
            <div className="pd-other-grid">
              {otherProjects.map((op, i) => (
                <Fade key={op.id} delay={0.08 + i * 0.1}>
                  <Link to={`/projects/${op.slug}`} className="pd-other-card" style={{ background: op.gradient }}>
                    <span className="pd-other-num">{op.num}</span>
                    <div className="pd-orb pd-orb-sm" style={{ background: op.accentA }} />
                    <span className="pd-other-label" style={{ color: op.accentA }}>{op.label}</span>
                    <h4 className="pd-other-title">{op.title}</h4>
                    <span className="pd-other-arrow">View →</span>
                  </Link>
                </Fade>
              ))}
            </div>
          </section>
        )}

      </div>
    </div>
  );
};

export default ProjectDetail;
