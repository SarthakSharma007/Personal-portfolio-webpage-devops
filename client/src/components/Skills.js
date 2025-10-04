import React from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import './Skills.css';

// Skill data organized by category
const skillData = [
  {
    title: 'Cloud & DevOps',
    skills: ['Docker', 'Kubernetes', 'Jenkins', 'Git', 'Terraform', 'Ansible', 'AWS', 'Networking'],
  },
  {
    title: 'Monitoring & Observability',
    skills: ['Prometheus', 'Grafana'],
  },
  {
    title: 'Languages & Databases',
    skills: ['Python', 'SQL'],
  },
  {
    title: 'Operating Systems',
    skills: ['Linux', 'Windows'],
  },
];

const Skills = () => {
  const { ref, inView } = useInView({
    threshold: 0.1,
    triggerOnce: true,
  });

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

        <div ref={ref} className="skills-grid">
          {skillData.map((category, index) => (
            <motion.div
              key={index}
              className="skills-category-block"
              initial={{ opacity: 0, y: 50 }}
              animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
              transition={{ duration: 0.8, delay: 0.2 + index * 0.1 }}
            >
              <h3 className="category-title">{category.title}</h3>
              <div className="skills-list">
                {category.skills.map((skill, skillIndex) => (
                  <span key={skillIndex} className="skill-tag">
                    {skill}
                  </span>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Skills;