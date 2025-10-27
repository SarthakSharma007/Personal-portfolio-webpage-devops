import React, { useState } from 'react'; // Removed useEffect
import { motion } from 'framer-motion';
import { FaGraduationCap, FaMapMarkerAlt, FaCalendarAlt, FaAward } from 'react-icons/fa';
import { useInView } from 'react-intersection-observer';
// import api from '../services/api'; // Removed API import
import './Education.css';

// Hardcoded education data as requested to override incorrect backend data
// Updated comment - October 27, 2025
const specificEducation = [
  {
    id: 1,
    degree: 'Bachelor of Technology in Computer Science Engineering',
    institution: 'The ICFAI University, Jaipur',
    location: 'Jaipur, India',
    start_date: '2022-09-01',
    end_date: '2026-05-30',
    current: false,
    description: 'I built a strong foundation in programming, data structures, algorithms, databases, operating systems, computer networks, and cloud computing. Beyond academics, I actively contributed to campus leadership as the Discipline Secretary of the Student Council, fostering teamwork, discipline, and student engagement.'
  },
  {
    id: 2,
    degree: '12th Standard',
    institution: 'Shri Maheshwari Senior Secondary School',
    location: 'Jaipur, India',
    start_date: '2020-04-01', // Added day for consistency
    end_date: '2021-03-31', // Added day for consistency
    current: false,
    description: 'Completed 12th grade with focus on Mathematics, Physics, and Chemistry.'
  },
  {
    id: 3,
    degree: '10th Standard',
    institution: 'Shri Maheshwari Senior Secondary School',
    location: 'Jaipur, India',
    start_date: '2018-04-01',
    end_date: '2019-03-31',
    current: false,
    description: 'Completed 10th grade with excellent academic performance. Active participation in extracurricular activities and leadership roles.'
  }
];


const Education = () => {
  // Set state directly from the hardcoded list, removed setter to avoid lint warning
  const [education] = useState(specificEducation);
  // Removed loading and error states
  // const [loading, setLoading] = useState(true);
  // const [error, setError] = useState(null);
  
  const { ref, inView } = useInView({
    threshold: 0.1,
    triggerOnce: true
  });

  // Removed useEffect for fetching data
  // useEffect(() => { ... fetchEducation ... }, []);

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

  // Removed loading spinner block
  // if (loading) { ... }

  return (
    <section id="education" className="education section">
      <div className="container">
        <motion.h2
          className="section-title"
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.6 }}
        >
          Education
        </motion.h2>

        <div ref={ref} className="education-content">
          {education.map((edu, index) => (
            <motion.div
              key={edu.id}
              className="education-card"
              initial={{ opacity: 0, y: 50 }}
              animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
              transition={{ duration: 0.8, delay: index * 0.2 }}
            >
              <div className="education-header">
                <div className="education-icon">
                  <FaGraduationCap />
                </div>
                <div className="education-info">
                  <h3 className="education-degree">{edu.degree}</h3>
                  <div className="education-institution">
                    <FaAward className="institution-icon" />
                    <span>{edu.institution}</span>
                  </div>
                </div>
              </div>

              <div className="education-details">
                <div className="education-meta">
                  <div className="education-duration">
                    <FaCalendarAlt className="meta-icon" />
                    <span>
                      {formatDate(edu.start_date)} - {formatDate(edu.end_date)}
                    </span>
                  </div>
                  {edu.location && (
                    <div className="education-location">
                      <FaMapMarkerAlt className="meta-icon" />
                      <span>{edu.location}</span>
                    </div>
                  )}
                  {/* GPA block will not render as edu.gpa is not in the hardcoded data */}
                  {edu.gpa && (
                    <div className="education-gpa">
                      <span className="gpa-label">GPA:</span>
                      <span className="gpa-value">{edu.gpa}/10</span>
                    </div>
                  )}
                </div>

                {edu.description && (
                  <p className="education-description">{edu.description}</p>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Education;
