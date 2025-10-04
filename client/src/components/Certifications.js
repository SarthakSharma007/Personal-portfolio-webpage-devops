import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FaCertificate, FaExternalLinkAlt, FaCalendarAlt } from 'react-icons/fa';
import { useInView } from 'react-intersection-observer';
import api from '../services/api';
import './Certifications.css';

const Certifications = () => {
  const [certifications, setCertifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  
  const { ref, inView } = useInView({
    threshold: 0.1,
    triggerOnce: true
  });

  useEffect(() => {
    const fetchCertifications = async () => {
      try {
        const response = await api.get('/certifications');
        if (response.data.success) {
          setCertifications(response.data.data);
        }
      } catch (err) {
        console.error('Error fetching certifications:', err);
        setError('Failed to load certifications');
        // Set fallback data
        setCertifications([
          {
            id: 1,
            cert_name: 'AWS Certified Solutions Architect',
            issuing_organization: 'Amazon Web Services',
            issue_date: '2023-08-15',
            expiry_date: '2026-08-15',
            credential_id: 'AWS-SAA-123456',
            credential_url: 'https://aws.amazon.com/verification',
            image_url: null
          },
          {
            id: 2,
            cert_name: 'Certified Kubernetes Administrator (CKA)',
            issuing_organization: 'Cloud Native Computing Foundation',
            issue_date: '2023-06-20',
            expiry_date: '2026-06-20',
            credential_id: 'CKA-789012',
            credential_url: 'https://cncf.io/certification/cka',
            image_url: null
          },
          {
            id: 3,
            cert_name: 'Docker Certified Associate',
            issuing_organization: 'Docker Inc.',
            issue_date: '2023-04-10',
            expiry_date: '2025-04-10',
            credential_id: 'DCA-345678',
            credential_url: 'https://docker.com/certification',
            image_url: null
          }
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchCertifications();
  }, []);

  useEffect(() => {
    if (certifications.length > 1) {
      const interval = setInterval(() => {
        setCurrentIndex((prevIndex) => 
          prevIndex === certifications.length - 1 ? 0 : prevIndex + 1
        );
      }, 5000);
      return () => clearInterval(interval);
    }
  }, [certifications.length]);

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long',
      day: 'numeric'
    });
  };

  const nextCert = () => {
    setCurrentIndex((prevIndex) => 
      prevIndex === certifications.length - 1 ? 0 : prevIndex + 1
    );
  };

  const prevCert = () => {
    setCurrentIndex((prevIndex) => 
      prevIndex === 0 ? certifications.length - 1 : prevIndex - 1
    );
  };

  if (loading) {
    return (
      <section id="certifications" className="certifications section">
        <div className="loading-spinner">
          <div className="spinner"></div>
        </div>
      </section>
    );
  }

  if (certifications.length === 0) {
    return (
      <section id="certifications" className="certifications section">
        <div className="container">
          <motion.h2
            className="section-title"
            initial={{ opacity: 0, y: 30 }}
            animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
            transition={{ duration: 0.6 }}
          >
            Certifications
          </motion.h2>
          <div className="no-certifications">
            <p>No certifications available at the moment.</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="certifications" className="certifications section">
      <div className="container">
        <motion.h2
          className="section-title"
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.6 }}
        >
          Certifications
        </motion.h2>

        <div ref={ref} className="certifications-content">
          <motion.div
            className="certifications-carousel"
            initial={{ opacity: 0, y: 50 }}
            animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <div className="carousel-container">
              <div 
                className="carousel-track"
                style={{ transform: `translateX(-${currentIndex * 100}%)` }}
              >
                {certifications.map((cert, index) => (
                  <div key={cert.id} className="certification-slide">
                    <div className="certification-card">
                      <div className="certification-header">
                        <div className="certification-icon">
                          <FaCertificate />
                        </div>
                        <div className="certification-info">
                          <h3 className="certification-name">{cert.cert_name}</h3>
                          <p className="certification-organization">{cert.issuing_organization}</p>
                        </div>
                      </div>

                      <div className="certification-details">
                        <div className="certification-meta">
                          <div className="certification-date">
                            <FaCalendarAlt className="meta-icon" />
                            <span>Issued: {formatDate(cert.issue_date)}</span>
                          </div>
                          {cert.expiry_date && (
                            <div className="certification-expiry">
                              <span>Expires: {formatDate(cert.expiry_date)}</span>
                            </div>
                          )}
                          {cert.credential_id && (
                            <div className="certification-id">
                              <span>ID: {cert.credential_id}</span>
                            </div>
                          )}
                        </div>

                        {cert.credential_url && (
                          <a
                            href={cert.credential_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="certification-link"
                          >
                            <FaExternalLinkAlt />
                            Verify Credential
                          </a>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {certifications.length > 1 && (
              <>
                <button className="carousel-btn prev-btn" onClick={prevCert}>
                  &#8249;
                </button>
                <button className="carousel-btn next-btn" onClick={nextCert}>
                  &#8250;
                </button>
              </>
            )}

            <div className="carousel-indicators">
              {certifications.map((_, index) => (
                <button
                  key={index}
                  className={`indicator ${index === currentIndex ? 'active' : ''}`}
                  onClick={() => setCurrentIndex(index)}
                />
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Certifications;
