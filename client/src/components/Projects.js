/* client/src/components/Projects.js */
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FaGithub, FaCode } from 'react-icons/fa';
import { useInView } from 'react-intersection-observer';
// Removed API import as we are hardcoding the project list to fix display issues
// import api from '../services/api'; 
import './Projects.css';

// Hardcoded project data as requested to override incorrect backend data
// Updated comment - October 27, 2025
const specificProjects = [
  {
    id: 1,
    title: 'Automated Node.js Application Deployment using CI/CD and Kubernetes',
    description: 'This repository includes two key DevOps automation tasks completed during the Elevate Labs DevOps Internship. The first task focuses on automating Node.js application deployment using GitHub Actions and Docker Hub, where a CI/CD pipeline was configured to automatically build and push Docker images on every code update. The second task demonstrates deploying the same containerized Node.js application on a local Kubernetes cluster using Minikube, showcasing concepts like pods, deployments, services, and scaling. Together, these projects highlight a complete workflow from continuous integration to container orchestration.',
    tech_stack: 'JavaScript (Node.js), YAML, Bash, GitHub Actions, Docker, Docker Hub, Kubernetes, Minikube, kubectl, Git',
    github_link: 'https://github.com/sarthaksharma/devops-pipeline',
    demo_link: null,
    image_url: null,
    featured: true
  },
  {
    id: 2,
    title: 'Automated DevOps Workflows using Shell Scripting',
    description: 'This project is a lightweight and efficient Python-based automation tool designed to create compressed backups of files and folders. It automatically generates a .zip archive of a specified source directory and stores it in a chosen destination folder. The backup file is named with the current date, making it easy to track and manage multiple versions over time. This script is ideal for automating daily or periodic backups, organizing data efficiently, and ensuring file safety without the need for external software. It is simple to configure, extend, and integrate into larger automation workflows.',
    tech_stack: 'Python',
    github_link: 'https://github.com/SarthakSharma007/automated-backup.py.git',
    demo_link: null,
    image_url: null,
    featured: true
  },
  {
    id: 4,
    title: 'DevOps Automation with Bash Scripting',
    description: 'This repository showcases two automation projects built using Bash scripting to streamline DevOps workflows. The first project automates Django application deployment using Docker and Docker Compose, while the second project automates AWS EC2 instance creation using AWS CLI. Both scripts are designed for simplicity, reusability, and reliability — helping developers deploy and manage infrastructure seamlessly with minimal manual effort.',
    tech_stack: 'Bash (Shell Scripting), Docker, Docker Compose, Nginx, AWS CLI, EC2, Linux',
    github_link: 'https://github.com/SarthakSharma007/use-shell-scripting-to-deploy.git',
    demo_link: null,
    image_url: null,
    featured: true
  }
];

const Projects = () => {
  // Set state directly from the hardcoded list
  const [projects, setProjects] = useState(specificProjects);
  // Removed loading and error states as they are no longer needed
  // const [loading, setLoading] = useState(true);
  // const [error, setError] = useState(null);

  const { ref, inView } = useInView({
    threshold: 0.1,
    triggerOnce: true
  });

  useEffect(() => {
    // API fetch removed to ensure only the 3 specified projects are shown.
    // Comment added - October 27, 2025
    setProjects(specificProjects);
    // setLoading(false); // No longer needed
  }, []); // Empty dependency array to run once on mount

  // Removed loading and error conditional rendering blocks

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
            {/* Map over the state, which is now our hardcoded list */}
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
                      {project.tech_stack && project.tech_stack.split(',').map((tech, techIndex) => (
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
                href="https://github.com/SarthakSharma007" // This link was updated in the previous step
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