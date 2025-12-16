/* client/src/components/Contact.js */
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FaEnvelope, FaPaperPlane, FaPhone, FaMapMarkerAlt, FaTerminal } from 'react-icons/fa';
import api from '../services/api';
import './Contact.css';

const viewportConfig = { once: false, amount: 0.15 };

const headerVariant = {
  hidden: { opacity: 0, y: 50 },
  visible: {
    opacity: 1, y: 0,
    transition: { duration: 1, ease: [0.25, 1, 0.5, 1], delay: 0 }
  }
};

const leftVariant = {
  hidden: { opacity: 0, y: 50 },
  visible: {
    opacity: 1, y: 0,
    transition: { duration: 1, ease: [0.25, 1, 0.5, 1], delay: 0.2 }
  }
};

const rightVariant = {
  hidden: { opacity: 0, y: 50 },
  visible: {
    opacity: 1, y: 0,
    transition: { duration: 1, ease: [0.25, 1, 0.5, 1], delay: 0.4 }
  }
};

const Contact = () => {
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [status, setStatus] = useState({ type: '', msg: '' });
  const [loading, setLoading] = useState(false);
  const [contactInfo, setContactInfo] = useState({
    email: 'sarsha7779992@gmail.com',
    phone: '+91 9680134032',
    location: 'Jaipur, Rajasthan, India'
  });

  React.useEffect(() => {
    const fetchPersonal = async () => {
      try {
        const res = await api.get('/personal-info');
        if (res.data?.success && res.data.data) {
          setContactInfo((prev) => ({
            ...prev,
            email: res.data.data.email || prev.email,
            phone: res.data.data.phone || prev.phone,
            location: res.data.data.location || prev.location
          }));
        }
      } catch (e) {
        // Keep default contact details when API is unavailable.
      }
    };
    fetchPersonal();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setStatus({ type: '', msg: '' });
    try {
      const response = await api.post('/messages', formData);
      if (response.data.success) {
        setStatus({ type: 'success', msg: 'Message sent successfully!' });
        setFormData({ name: '', email: '', message: '' });
      } else {
        setStatus({ type: 'error', msg: 'Failed to send message. Please try again.' });
      }
    } catch (err) {
      console.error('Error sending message:', err);
      setStatus({ type: 'error', msg: 'An error occurred. Please try again later.' });
    } finally {
      setLoading(false);
      setTimeout(() => setStatus({ type: '', msg: '' }), 5000);
    }
  };

  return (
    <section id="contact" className="contact-section">
      <div className="contact-bg-glow" />
      <div className="contact-bg-grid" />

      <div className="contact-container">
        
        {/* Header */}
        <motion.div 
          className="contact-header-main"
          variants={headerVariant}
          initial="hidden"
          whileInView="visible"
          viewport={viewportConfig}
        >
          <div className="contact-eyebrow">
            <FaTerminal size={14} /> Connect With Me
          </div>
          <h2 className="contact-heading">Get in Touch</h2>
        </motion.div>

        <div className="contact-layout">
          
          {/* Left: Contact Info */}
          <motion.div 
            className="contact-info-panel"
            variants={leftVariant}
            initial="hidden"
            whileInView="visible"
            viewport={viewportConfig}
          >
            <h3 className="contact-statement">Let's build something <span>extraordinary</span> together.</h3>
            <p className="contact-sub">
              Whether you have a question, a project proposal, or just want to say hi, I'll try my best to get back to you!
            </p>

            <div className="contact-cards">
              <div className="contact-card">
                <div className="c-icon"><FaEnvelope /></div>
                <div className="c-details">
                  <h4>Email</h4>
                  <a href={`mailto:${contactInfo.email}`}>{contactInfo.email}</a>
                </div>
              </div>

              <div className="contact-card">
                <div className="c-icon"><FaPhone /></div>
                <div className="c-details">
                  <h4>Mobile</h4>
                  <a href={`tel:${contactInfo.phone?.replace(/\s+/g, '')}`}>{contactInfo.phone}</a>
                </div>
              </div>

              <div className="contact-card">
                <div className="c-icon"><FaMapMarkerAlt /></div>
                <div className="c-details">
                  <h4>Location</h4>
                  <span>{contactInfo.location}</span>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Right: Modern Form */}
          <motion.div 
            className="contact-form-panel"
            variants={rightVariant}
            initial="hidden"
            whileInView="visible"
            viewport={viewportConfig}
          >
            <div className="form-glass-container">
              <form onSubmit={handleSubmit} className="c-form">
                
                <div className="c-input-group">
                  <input
                    type="text"
                    name="name"
                    id="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    placeholder=" "
                  />
                  <label htmlFor="name">Your Name</label>
                  <div className="c-line"></div>
                </div>

                <div className="c-input-group">
                  <input
                    type="email"
                    name="email"
                    id="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    placeholder=" "
                  />
                  <label htmlFor="email">Your Email</label>
                  <div className="c-line"></div>
                </div>

                <div className="c-input-group">
                  <textarea
                    name="message"
                    id="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    placeholder=" "
                    rows="5"
                  ></textarea>
                  <label htmlFor="message">Your Message</label>
                  <div className="c-line"></div>
                </div>

                <button type="submit" className="c-submit-btn" disabled={loading}>
                  <span className="btn-text">{loading ? 'Sending...' : 'Send Message'}</span>
                  <FaPaperPlane className={`btn-icon ${loading ? 'sending' : ''}`} />
                </button>

                {/* Status Message */}
                {status.msg && (
                  <motion.div 
                    className={`c-status-msg ${status.type}`}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                  >
                    {status.msg}
                  </motion.div>
                )}

              </form>
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
};

export default Contact;
