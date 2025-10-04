import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FaGithub, FaExternalLinkAlt, FaCode, FaEye } from 'react-icons/fa';
import { useInView } from 'react-intersection-observer';
import api from '../services/api';
import './Projects.css';

const Projects = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const { ref, inView } = useInView({
    threshold: 0.1,
    triggerOnce: true
  });

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await api.get('/projects');
        if (response.data.success) {
          setProjects(response.data.data);
        }
      } catch (err) {
        console.error('Error fetching projects:', err);
        setError('Failed to load projects');
        // Set fallback data
        setProjects([
          {
            id: 1,
            title: 'DevOps CI/CD Pipeline',
            description: 'Implemented a complete CI/CD pipeline using Jenkins, Docker, and Kubernetes for automated deployment of microservices. The pipeline includes automated testing, security scanning, and blue-green deployment strategy.',
            tech_stack: 'Jenkins, Docker, Kubernetes, AWS, Terraform, Python',
            github_link: 'https://github.com/sarthaksharma/devops-pipeline',
            demo_link: 'https://demo.sarthaksharma.com',
            image_url: null,
            featured: true
          },
          {
            id: 2,
            title: 'Cloud Infrastructure Automation',
            description: 'Built an automated cloud infrastructure using Terraform and Ansible for provisioning and configuration management. The infrastructure includes auto-scaling groups, load balancers, and monitoring setup.',
            tech_stack: 'Terraform, Ansible, AWS, Python, Bash',
            github_link: 'https://github.com/sarthaksharma/cloud-infra',
            demo_link: null,
            image_url: null,
            featured: true
          },
          {
            id: 3,
            title: 'Container Orchestration Platform',
            description: 'Developed a container orchestration platform using Kubernetes with custom operators and monitoring solutions. Includes Prometheus, Grafana, and custom dashboards for application metrics.',
            tech_stack: 'Kubernetes, Prometheus, Grafana, Go, Helm',
            github_link: 'https://github.com/sarthaksharma/k8s-platform',
            demo_link: null,
            image_url: null,
            featured: true
          },
          {
            id: 4,
            title: 'Monitoring & Alerting System',
            description: 'Created a comprehensive monitoring and alerting system using Prometheus, Grafana, and custom alerting rules. Includes custom dashboards and automated incident response.',
            tech_stack: 'Prometheus, Grafana, AlertManager, Python, Docker',
            github_link: 'https://github.com/sarthaksharma/monitoring-system',
            demo_link: null,
            image_url: null,
            featured: true
          }
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, []);

  if (loading) {
    return (
      <section id="projects" className="projects section">
        <div className="loading-spinner">
          <div className="spinner"></div>
        </div>
      </section>
    );
  }

  return (
    <section id="projects" className="projects section">
      <div className="container">
        <motion.h2
          className="section-title"
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.6 }}
        >
          Featured Projects
        </motion.h2>

        <div ref={ref} className="projects-content">
          <div className="projects-grid">
            {projects.map((project, index) => (
              <motion.div
                key={project.id}
                className="project-card"
                initial={{ opacity: 0, y: 50 }}
                animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
                transition={{ duration: 0.8, delay: index * 0.2 }}
                whileHover={{ scale: 1.02 }}
              >
                <div className="project-image">
                  {project.image_url ? (
                    <img src={project.image_url} alt={project.title} />
                  ) : (
                    <div className="project-placeholder">
                      <FaCode className="placeholder-icon" />
                    </div>
                  )}
                  <div className="project-overlay">
                    <div className="project-links">
                      {project.github_link && (
                        <a
                          href={project.github_link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="project-link"
                          title="View Code"
                        >
                          <FaGithub />
                        </a>
                      )}
                    </div>
                  </div>
                </div>

                <div className="project-content">
                  <h3 className="project-title">{project.title}</h3>
                  <p className="project-description">{project.description}</p>
                  
                  <div className="project-tech">
                    <h4>Technologies:</h4>
                    <div className="tech-tags">
                      {project.tech_stack.split(', ').map((tech, techIndex) => (
                        <span key={techIndex} className="tech-tag">
                          {tech.trim()}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="project-actions">
                    {project.github_link && (
                      <a
                        href={project.github_link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn btn-primary"
                      >
                        <FaGithub /> Source Code
                      </a>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          <motion.div
            className="github-section"
            initial={{ opacity: 0, y: 30 }}
            animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
            transition={{ duration: 0.8, delay: 0.8 }}
          >
            <div className="github-card">
              <div className="github-icon">
                <FaGithub />
              </div>
              <h3>Explore More Projects</h3>
              <p>Check out my complete GitHub profile for more projects, contributions, and open-source work.</p>
              <a
                href="https://github.com/sarthaksharma"
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-outline"
              >
                <FaGithub /> Visit GitHub Profile
              </a>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Projects;
