import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import api from '../services/api';
import './Skills.css';

const Skills = () => {
  const [skills, setSkills] = useState({ primary: [], other: [] });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const { ref, inView } = useInView({
    threshold: 0.1,
    triggerOnce: true
  });

  useEffect(() => {
    const fetchSkills = async () => {
      try {
        const response = await api.get('/skills');
        if (response.data.success) {
          setSkills(response.data.data);
        }
      } catch (err) {
        console.error('Error fetching skills:', err);
        setError('Failed to load skills');
        // Set fallback data
        setSkills({
          primary: [
            // Cloud & DevOps
            { skill_name: 'Docker', icon: '🐳' },
            { skill_name: 'Kubernetes', icon: '☸️' },
            { skill_name: 'Jenkins', icon: '🔧' },
            { skill_name: 'Git', icon: '📚' },
            { skill_name: 'Terraform', icon: '🏗️' },
            { skill_name: 'Ansible', icon: '🔧' },
            { skill_name: 'AWS', icon: '☁️' },
            { skill_name: 'Networking', icon: '🌐' },
            // Monitoring & Observability
            { skill_name: 'Prometheus', icon: '📊' },
            { skill_name: 'Grafana', icon: '📈' },
            // Project & Issue Management
            { skill_name: 'Jira', icon: '🎯' },
            // Languages & Databases
            { skill_name: 'Python', icon: '🐍' },
            { skill_name: 'SQL', icon: '🗄️' },
            // Operating Systems
            { skill_name: 'Linux', icon: '🐧' },
            { skill_name: 'Windows', icon: '🪟' }
          ],
          other: [
            { skill_name: 'MS Excel', icon: '📊' },
            { skill_name: 'MS Word', icon: '📝' },
            { skill_name: 'Team Leading', icon: '👥' },
            { skill_name: 'Event Organizing', icon: '🎪' }
          ]
        });
      } finally {
        setLoading(false);
      }
    };

    fetchSkills();
  }, []);


  if (loading) {
    return (
      <section id="skills" className="skills section">
        <div className="loading-spinner">
          <div className="spinner"></div>
        </div>
      </section>
    );
  }

  return (
    <section id="skills" className="skills section">
      <div className="container">
        <motion.h2
          className="section-title"
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.6 }}
        >
          Skills
        </motion.h2>

        <div ref={ref} className="skills-content">
          <motion.div
            className="skills-category"
            initial={{ opacity: 0, y: 50 }}
            animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <h3 className="category-title">Primary Skills</h3>
            <div className="skills-grid">
              {skills.primary.map((skill, index) => (
                <motion.div
                  key={skill.id || index}
                  className="skill-card primary-skill"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={inView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.8 }}
                  transition={{ duration: 0.5, delay: 0.3 + index * 0.1 }}
                  whileHover={{ scale: 1.05 }}
                >
                  <div className="skill-content">
                    <span className="skill-icon">{skill.icon || '💻'}</span>
                    <h4 className="skill-name">{skill.skill_name}</h4>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          <motion.div
            className="skills-category"
            initial={{ opacity: 0, y: 50 }}
            animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            <h3 className="category-title">Other Skills</h3>
            <div className="skills-grid other-skills">
              {skills.other.map((skill, index) => (
                <motion.div
                  key={skill.id || index}
                  className="skill-card other-skill"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={inView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.8 }}
                  transition={{ duration: 0.5, delay: 0.5 + index * 0.1 }}
                  whileHover={{ scale: 1.05 }}
                >
                  <div className="skill-content">
                    <span className="skill-icon">{skill.icon || '💻'}</span>
                    <h4 className="skill-name">{skill.skill_name}</h4>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Skills;
