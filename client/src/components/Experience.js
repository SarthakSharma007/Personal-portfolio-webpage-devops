import React, { useState } from 'react'; // Removed useEffect to fix lint warning
import { motion } from 'framer-motion';
import { FaCalendarAlt, FaMapMarkerAlt, FaBuilding, FaChevronDown, FaChevronUp } from 'react-icons/fa';
import { useInView } from 'react-intersection-observer';
// import api from '../services/api'; // Removed API import to hardcode the list
import './Experience.css';

// Hardcoded experience data as requested to override incorrect backend data
// Updated comment - October 27, 2025
const specificExperiences = [
  {
    id: 1,
    title: 'DevOps Intern',
    company: 'Elevate Labs',
    location: 'Remote',
    start_date: '2025-08-01',
    end_date: '2025-09-30',
    current: false,
    description: 'Engineered and implemented a full CI/CD pipeline using GitHub Actions, slashing build and release cycles by 95%. Eliminated 80% of configuration errors by creating a standardized Docker file and optimizing deployment workflows. Strengthened application security by integrating GitHub Secrets for credential management and enforcing automated Docker version tagging.',
    technologies: 'AWS, Jenkins, Docker, Kubernetes, Terraform, Python, Git',
    type: 'Internship'
  },
  {
    id: 2,
    title: 'Full Stack Developer Intern',
    company: 'BMP Infotech',
    location: 'Jaipur, India',
    start_date: '2024-05-01',
    end_date: '2024-07-31',
    current: false,
    description: 'Working as a Full Stack Web Developer. Develop and solve real time problems create real world projects.',
    technologies: 'HTML, CSS, JavaScript, MongoDB',
    type: 'Internship'
  }
];

const Experience = () => {
  // Set state directly from the hardcoded list, removed setter to avoid lint warning
  const [experiences] = useState(specificExperiences);
  // Removed loading and error states
  // const [loading, setLoading] = useState(true);
  // const [error, setError] = useState(null);
  const [showAll, setShowAll] = useState(false);
  
  const { ref, inView } = useInView({
    threshold: 0.1,
    triggerOnce: true
  });

  // Removed useEffect for fetching data
  // useEffect(() => { ... fetchExperiences ... }, []);

  const formatDate = (dateString) => {
    if (!dateString) return 'Present';
    // Using UTC date parsing to prevent timezone offset issues
    const date = new Date(dateString);
    const utcDate = new Date(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate());
    return utcDate.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short',
      timeZone: 'UTC'
    });
  };

  const getDuration = (startDate, endDate) => {
    const start = new Date(startDate);
    const end = endDate ? new Date(endDate) : new Date();
    // Calculate month difference
    let months = (end.getFullYear() - start.getFullYear()) * 12;
    months -= start.getMonth();
    months += end.getMonth();
    // Adjust for partial months (if end date is not the end of the month)
    // A simple ceil will work fine for this context
    const diffMonths = months <= 0 ? 0 : months;
    const durationMonths = Math.ceil(diffMonths + (end.getDate() / 31)); // Approximate
    
    if (durationMonths === 0) return '1 month'; // Handle very short internships
    if (durationMonths < 12) {
      return `${durationMonths} month${durationMonths > 1 ? 's' : ''}`;
    } else {
      const years = Math.floor(durationMonths / 12);
      const remainingMonths = durationMonths % 12;
      return `${years} year${years > 1 ? 's' : ''}${remainingMonths > 0 ? ` ${remainingMonths} month${remainingMonths > 1 ? 's' : ''}` : ''}`;
    }
  };

  // The list only has 2 items, so showAll will default to false
  // and displayedExperiences will be all 2 items.
  const displayedExperiences = showAll ? experiences : experiences.slice(0, 2);

  // Removed loading spinner block
  // if (loading) { ... }

  return (
    <section id="experience" className="experience section">
      <div className="container">
        <motion.h2
          className="section-title"
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.6 }}
        >
          Experience
        </motion.h2>

        <div ref={ref} className="experience-content">
          {displayedExperiences.map((experience, index) => (
            <motion.div
              key={experience.id}
              className="experience-card"
              initial={{ opacity: 0, y: 50 }}
              animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
              transition={{ duration: 0.8, delay: index * 0.2 }}
            >
              <div className="experience-header">
                <div className="experience-title-section">
                  <h3 className="experience-title">{experience.title}</h3>
                  <div className="experience-company">
                    <FaBuilding className="company-icon" />
                    <span>{experience.company}</span>
                  </div>
                </div>
                <div className="experience-meta">
                  <div className="experience-duration">
                    <FaCalendarAlt className="meta-icon" />
                    <span>
                      {formatDate(experience.start_date)} - {formatDate(experience.end_date)}
                    </span>
                    <span className="duration-badge">
                      {getDuration(experience.start_date, experience.end_date)}
                    </span>
                  </div>
                  {experience.location && (
                    <div className="experience-location">
                      <FaMapMarkerAlt className="meta-icon" />
                      <span>{experience.location}</span>
                    </div>
                  )}
                </div>
              </div>

              <div className="experience-content-details">
                <p className="experience-description">{experience.description}</p>
                
                {experience.technologies && (
                  <div className="experience-technologies">
                    <h4>Technologies Used:</h4>
                    <div className="tech-tags">
                      {/* Using split(',') to be safer if spacing is inconsistent */}
                      {experience.technologies.split(',').map((tech, techIndex) => (
                        <span key={techIndex} className="tech-tag">
                          {tech.trim()}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          ))}

          {/* This button will not render because experiences.length (2) is not > 2 */}
          {experiences.length > 2 && (
            <motion.div
              className="show-more-container"
              initial={{ opacity: 0 }}
              animate={inView ? { opacity: 1 } : { opacity: 0 }}
              transition={{ duration: 0.6, delay: 0.8 }}
            >
              <button
                className="btn btn-outline show-more-btn"
                onClick={() => setShowAll(!showAll)}
              >
                {showAll ? (
                  <>
                    <FaChevronUp /> Show Less
                  </>
                ) : (
                  <>
                    <FaChevronDown /> View More Internships
                  </>
                )}
              </button>
            </motion.div>
          )}
        </div>
      </div>
    </section>
  );
};

export default Experience;

