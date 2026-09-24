import React, { useState } from 'react';
import { useOutletContext, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { prayerService } from '../../services/api';
import { useToast } from '../../context/ToastContext';
import SEO from '../../components/common/SEO';

const fadeInUp = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] } }
};

const PrayerRequestPage = () => {
  const { settings = {} } = useOutletContext() || {};
  const { addToast } = useToast();

  const churchPhone = settings.contact_phone || '+91 98656 81983';

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: ''
  });
  const [submitting, setSubmitting] = useState(false);
  const [responseMsg, setResponseMsg] = useState(null);

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setResponseMsg(null);

    if (!formData.name.trim() || !formData.email.trim() || !formData.message.trim()) {
      const err = 'Please provide your name, email, and prayer request message.';
      setResponseMsg({ type: 'danger', text: err });
      addToast(err, 'danger');
      return;
    }

    setSubmitting(true);

    try {
      const res = await prayerService.submit(formData);
      if (res.data.success) {
        const successText = 'Your prayer request has been received. Our pastoral team will faithfully lift your request before the Lord.';
        setResponseMsg({
          type: 'success',
          text: successText
        });
        addToast(successText, 'success');
        setFormData({ name: '', email: '', phone: '', message: '' });
      }
    } catch (err) {
      console.error(err);
      const errMsg = err.response?.data?.message || 'Something went wrong submitting your request. Please try again.';
      setResponseMsg({
        type: 'danger',
        text: errMsg
      });
      addToast(errMsg, 'danger');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="container my-5 pt-3">
      <SEO
        title="Prayer Request"
        description="Share your prayer requests with Friends Garden AG Church, Kollidam. Our pastoral and intercession team faithfully prays for every petition."
      />

      {/* Header Section */}
      <motion.div
        className="text-center mb-5"
        initial={{ opacity: 0, y: -15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="d-inline-flex align-items-center gap-2 px-3 py-1 rounded-pill bg-primary-subtle text-primary fw-semibold small mb-2">
          <i className="bi bi-chat-heart-fill"></i>
          <span>We Believe in the Power of Prayer</span>
        </div>
        <h1 className="heading display-5 fw-bold mb-2" style={{ color: 'var(--fgag-primary, #0A3D62)' }}>
          Submit Your Prayer Request
        </h1>
        <div className="section-divider">
          <i className="bi bi-diamond-fill section-divider-icon"></i>
        </div>
        <p className="paragraph lead text-muted mx-auto" style={{ maxWidth: '720px' }}>
          “Do not be anxious about anything, but in every situation, by prayer and petition, with thanksgiving, present your requests to God.”
          <br />
          <span className="text-primary fw-medium small">— Philippians 4:6</span>
        </p>
      </motion.div>

      <div className="row g-5 justify-content-center align-items-start">
        {/* Left Column: Encouragement & Pastoral Assurance */}
        <motion.div
          className="col-lg-5"
          initial="hidden"
          animate="visible"
          variants={fadeInUp}
        >
          <div className="card border-0 shadow-sm rounded-4 p-4 p-md-5 bg-white mb-4 border-start border-4 border-primary hover-lift">
            <h3 className="heading fw-bold mb-3" style={{ color: '#0A3D62' }}>
              You Are Never Alone
            </h3>
            <p className="text-secondary mb-4" style={{ lineHeight: '1.8' }}>
              No matter what difficulty, health concern, family burden, or spiritual decision you are navigating, we count it a sacred privilege to stand alongside you in faith.
            </p>

            <div className="d-flex flex-column gap-3">
              <div className="d-flex align-items-start gap-3">
                <div className="p-2 rounded-circle bg-primary-subtle text-primary flex-shrink-0">
                  <i className="bi bi-shield-check fs-5"></i>
                </div>
                <div>
                  <h6 className="fw-bold mb-1 text-dark">Confidential & Handled with Care</h6>
                  <p className="small text-muted mb-0">Every petition is kept strictly confidential and shared only with our pastoral intercessors.</p>
                </div>
              </div>

              <div className="d-flex align-items-start gap-3">
                <div className="p-2 rounded-circle bg-success-subtle text-success flex-shrink-0">
                  <i className="bi bi-heart-pulse-fill fs-5"></i>
                </div>
                <div>
                  <h6 className="fw-bold mb-1 text-dark">Prayed for Regularly</h6>
                  <p className="small text-muted mb-0">Our intercession team gathers for early morning, fasting, and Friday night prayer to lift up every name.</p>
                </div>
              </div>

              <div className="d-flex align-items-start gap-3">
                <div className="p-2 rounded-circle bg-info-subtle text-info flex-shrink-0">
                  <i className="bi bi-telephone-inbound-fill fs-5"></i>
                </div>
                <div>
                  <h6 className="fw-bold mb-1 text-dark">Urgent Pastoral Helpline</h6>
                  <p className="small text-muted mb-0">
                    If this is a pressing emergency, feel free to call our pastoral team directly at{' '}
                    <a href={`tel:${churchPhone.replace(/\s+/g, '')}`} className="text-primary fw-semibold text-decoration-none">
                      {churchPhone}
                    </a>.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="card border-0 rounded-4 p-4 text-white shadow-sm" style={{ background: 'linear-gradient(135deg, #0A3D62 0%, #07253D 100%)' }}>
            <div className="d-flex align-items-center gap-3 mb-2">
              <i className="bi bi-quote fs-2 text-info"></i>
              <h5 className="mb-0 fw-bold" style={{ fontFamily: "'Playfair Display', serif" }}>A Promise for You</h5>
            </div>
            <p className="fst-italic opacity-90 small mb-2">
              “The Lord is near to all who call on Him, to all who call on Him in truth. He fulfills the desire of those who fear Him; He also hears their cry and saves them.”
            </p>
            <span className="text-info small fw-semibold">— Psalm 145:18-19</span>
          </div>
        </motion.div>

        {/* Right Column: Prayer Form */}
        <motion.div
          className="col-lg-7"
          initial="hidden"
          animate="visible"
          variants={fadeInUp}
        >
          <div className="card border-0 shadow rounded-4 p-4 p-md-5 bg-white hover-lift">
            <h2 className="heading fw-bold display-6 mb-2" style={{ color: '#0A3D62' }}>
              Send Prayer Request
            </h2>
            <p className="text-muted small mb-4">
              Please fill in your details below and tell us how we can pray for you.
            </p>

            {responseMsg && (
              <div className={`alert alert-${responseMsg.type} alert-dismissible fade show mb-4`} role="alert">
                <i className={`bi ${responseMsg.type === 'success' ? 'bi-check-circle-fill' : 'bi-exclamation-triangle-fill'} me-2`}></i>
                {responseMsg.text}
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setResponseMsg(null)}
                  aria-label="Close"
                ></button>
              </div>
            )}

            <form onSubmit={handleSubmit} noValidate>
              <div className="row g-3">
                <div className="col-12 col-md-6 mb-2">
                  <label htmlFor="name" className="form-label fw-medium text-dark">
                    Your Full Name <span className="text-danger">*</span>
                  </label>
                  <input
                    type="text"
                    id="name"
                    className="form-control form-control-lg rounded-3 fs-6"
                    placeholder="e.g. John Doe"
                    value={formData.name}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="col-12 col-md-6 mb-2">
                  <label htmlFor="email" className="form-label fw-medium text-dark">
                    Email Address <span className="text-danger">*</span>
                  </label>
                  <input
                    type="email"
                    id="email"
                    className="form-control form-control-lg rounded-3 fs-6"
                    placeholder="e.g. john@example.com"
                    value={formData.email}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="col-12 mb-2">
                  <label htmlFor="phone" className="form-label fw-medium text-dark">
                    Phone / WhatsApp Number <span className="text-muted small">(Optional)</span>
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    className="form-control form-control-lg rounded-3 fs-6"
                    placeholder="e.g. +91 98765 43210"
                    value={formData.phone}
                    onChange={handleChange}
                  />
                </div>

                <div className="col-12 mb-3">
                  <label htmlFor="message" className="form-label fw-medium text-dark">
                    Your Prayer Request <span className="text-danger">*</span>
                  </label>
                  <textarea
                    id="message"
                    rows="6"
                    className="form-control rounded-3 fs-6"
                    placeholder="Share what is on your heart... God hears every prayer."
                    value={formData.message}
                    onChange={handleChange}
                    required
                  ></textarea>
                </div>

                <div className="col-12">
                  <button
                    type="submit"
                    className="btn btn-primary rounded-pill w-100 py-3 shadow fw-semibold d-flex align-items-center justify-content-center gap-2"
                    disabled={submitting}
                  >
                    {submitting ? (
                      <>
                        <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                        <span>Submitting Your Petition...</span>
                      </>
                    ) : (
                      <>
                        <i className="bi bi-send-fill"></i>
                        <span>Submit Prayer Request</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default PrayerRequestPage;
