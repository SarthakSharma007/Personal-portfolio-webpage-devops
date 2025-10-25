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
    triggerOnce: true,
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
        // ✅ Expanded fallback data
        setCertifications([
          {
            id: 1,
            cert_name: 'Introduction to Containers, Kubernetes, and OpenShift',
            issuing_organization: 'CognitiveClass.ai',
            issue_date: '2025-07-12',
            credential_id: 'CC0201EN',
            credential_url: 'https://courses.cognitiveclass.ai/certificates/3b62291dfc534c06898e6b94beacbb46',
            image_url: null,
          },
          {
            id: 2,
            cert_name: 'Introduction to Linux',
            issuing_organization: 'The Linux Foundation',
            issue_date: '2025-06-28',
            credential_id: 'LF-ku85gwty6e',
            credential_url: 'https://drive.google.com/file/d/1o_Uz0TCW70ejhGt1qNEE42hqMKoTY4bc/view?usp=sharing',
            image_url: null,
          },
          {
            id: 3,
            cert_name: 'Introduction to GitOps',
            issuing_organization: 'The Linux Foundation',
            issue_date: '2025-04-25',
            credential_id: 'LF-qpj6j47gsq',
            credential_url: 'https://drive.google.com/file/d/18f9Uq3V7B63IAqM50gSThfSam2AlnLNA/view?usp=sharing',
            image_url: null,
          },
          {
            id: 4,
            cert_name: 'GitLab 101 Certification',
            issuing_organization: 'GitLab',
            issue_date: '2025-06-15',
            credential_id: null,
            credential_url: 'https://drive.google.com/file/d/1Igey6zht7uBiQQQGDBpUOnsZ-E_0TvZ2/view?usp=sharing',
            image_url: null,
          },
          {
            id: 5,
            cert_name: 'Introduction to Cloud Computing',
            issuing_organization: 'Simplilearn',
            issue_date: '2025-04-20',
            credential_id: null,
            credential_url: 'https://drive.google.com/file/d/1BC2vh2gBgEFVBKXIoHcC7pfhltqNocQd/view?usp=sharing',
            image_url: null,
          },
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
      day: 'numeric',
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
                {certifications.map((cert) => (
                  <div key={cert.id} className="certification-slide">
                    <div className="certification-card">
                      <div className="certification-header">
                        <div className="certification-icon">
                          <FaCertificate />
                        </div>
                        <div className="certification-info">
                          <h3 className="certification-name">{cert.cert_name}</h3>
                          <p className="certification-organization">
                            {cert.issuing_organization}
                          </p>
                        </div>
                      </div>

                      <div className="certification-details">
                        <div className="certification-meta">
                          <div className="certification-date">
                            <FaCalendarAlt className="meta-icon" />
                            <span>Issued: {formatDate(cert.issue_date)}</span>
                          </div>
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
