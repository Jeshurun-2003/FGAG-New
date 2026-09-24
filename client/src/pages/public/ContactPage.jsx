import React, { useState } from 'react';
import { useOutletContext, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { contactService } from '../../services/api';
import { useToast } from '../../context/ToastContext';
import SEO from '../../components/common/SEO';

const ContactPage = () => {
  const { settings = {} } = useOutletContext() || {};
  const { addToast } = useToast();

  const address = settings.contact_address || 'Friends Garden A.G church, Near Keezhvallam Railway Gate, Thaikal Via.Kollidam - 609102, Mayiladuthurai District';
  const email = settings.contact_email || 'kollidamag@gmail.com';
  const phone = settings.contact_phone || '+91 98656 81983';
  const officeHours = settings.contact_hours || 'Mon–Fri: 10am–6pm';
  const mapEmbed = settings.contact_map_embed || 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3912.2444780831706!2d79.7227746!3d11.316832999999999!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3a54dd02183b6739%3A0x10498d09bef5eb5c!2sAssemblies%20of%20God%20Church!5e0!3m2!1sen!2sin!4v1752774351992!5m2!1sen!2sin';
  const mapLink = settings.contact_map_link || 'https://goo.gl/maps/kLvnhfWSPSwtAb619';

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
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
      const err = 'Please provide your name, email, and message.';
      setResponseMsg({ type: 'danger', text: err });
      addToast(err, 'danger');
      return;
    }

    setSubmitting(true);

    try {
      const res = await contactService.submit(formData);
      if (res.data.success) {
        const successMsg = 'Thank you for contacting Friends Garden AG Church. We have received your message and will respond promptly.';
        setResponseMsg({
          type: 'success',
          text: successMsg
        });
        addToast(successMsg, 'success');
        setFormData({ name: '', email: '', phone: '', subject: '', message: '' });
      }
    } catch (err) {
      console.error(err);
      const errMsg = err.response?.data?.message || 'Something went wrong. Please try again.';
      setResponseMsg({
        type: 'danger',
        text: errMsg
      });
      addToast(errMsg, 'danger');
    } finally {
      setSubmitting(false);
    }
  };

  const [copiedField, setCopiedField] = useState(null);

  const copyContact = (text, field) => {
    navigator.clipboard.writeText(text);
    setCopiedField(field);
    addToast(`${field} copied to clipboard!`, 'info');
    setTimeout(() => setCopiedField(null), 2000);
  };

  return (
    <div className="container my-5 pt-3">
      <SEO
        title="Contact Us"
        description="Get in touch with Friends Garden AG Church, Kollidam. View service location, directions, office hours, and contact details."
      />

      {/* Map Header */}
      <motion.div
        className="mb-5"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="text-center mb-4">
          <span className="section-eyebrow">Visit & Connect</span>
          <h1 className="heading_2 display-6 fw-bold mb-2">Find Us on the Map</h1>
          <div className="section-divider">
            <i className="bi bi-diamond-fill section-divider-icon"></i>
          </div>
        </div>

        <div className="rounded-4 overflow-hidden shadow border" style={{ maxHeight: '420px' }}>
          <iframe
            src={mapEmbed}
            width="100%"
            height="400"
            style={{ border: 0, display: 'block' }}
            allowFullScreen=""
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            title="Friends Garden AG Church Location"
          ></iframe>
        </div>
        <div className="mt-3 text-end">
          <motion.a
            href={mapLink}
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-outline-primary btn-sm rounded-pill px-3 py-2"
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.98 }}
          >
            <i className="bi bi-geo-alt me-1 text-danger"></i> Open in Google Maps
          </motion.a>
        </div>
      </motion.div>

      <div className="row g-5">
        {/* Contact Info */}
        <motion.div
          className="col-lg-6"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <span className="section-eyebrow mb-2">Reach Out</span>
          <h2 className="heading fw-bold display-6 mb-4">Get in Touch</h2>

          <div className="card border-0 shadow-sm rounded-4 p-4 mb-3 bg-white border-start border-4 border-primary hover-lift">
            <div className="d-flex align-items-start gap-3">
              <div className="p-3 rounded-circle bg-primary-subtle text-primary flex-shrink-0">
                <i className="bi bi-geo-alt-fill fs-4"></i>
              </div>
              <div className="flex-grow-1">
                <div className="d-flex justify-content-between align-items-center mb-1">
                  <strong className="heading fs-5">Address:</strong>
                  <button
                    className="btn btn-sm btn-outline-secondary rounded-pill py-0 px-2"
                    onClick={() => copyContact(address, 'Address')}
                    title="Copy address"
                  >
                    <i className={`bi ${copiedField === 'Address' ? 'bi-check2 text-success' : 'bi-clipboard'} me-1`}></i>
                    <span className="small">{copiedField === 'Address' ? 'Copied' : 'Copy'}</span>
                  </button>
                </div>
                <span className="paragraph text-secondary small">{address}</span>
              </div>
            </div>
          </div>

          <div className="card border-0 shadow-sm rounded-4 p-4 mb-3 bg-white border-start border-4 border-primary hover-lift">
            <div className="d-flex align-items-center gap-3">
              <div className="p-3 rounded-circle bg-primary-subtle text-primary flex-shrink-0">
                <i className="bi bi-envelope-fill fs-4"></i>
              </div>
              <div className="flex-grow-1">
                <div className="d-flex justify-content-between align-items-center mb-1">
                  <strong className="heading fs-5">Email:</strong>
                  <button
                    className="btn btn-sm btn-outline-secondary rounded-pill py-0 px-2"
                    onClick={() => copyContact(email, 'Email')}
                    title="Copy email"
                  >
                    <i className={`bi ${copiedField === 'Email' ? 'bi-check2 text-success' : 'bi-clipboard'} me-1`}></i>
                    <span className="small">{copiedField === 'Email' ? 'Copied' : 'Copy'}</span>
                  </button>
                </div>
                <a href={`mailto:${email}`} className="text-secondary text-decoration-none paragraph">
                  {email}
                </a>
              </div>
            </div>
          </div>

          <div className="card border-0 shadow-sm rounded-4 p-4 mb-3 bg-white border-start border-4 border-primary hover-lift">
            <div className="d-flex align-items-center gap-3">
              <div className="p-3 rounded-circle bg-primary-subtle text-primary flex-shrink-0">
                <i className="bi bi-telephone-fill fs-4"></i>
              </div>
              <div className="flex-grow-1">
                <div className="d-flex justify-content-between align-items-center mb-1">
                  <strong className="heading fs-5">Phone:</strong>
                  <button
                    className="btn btn-sm btn-outline-secondary rounded-pill py-0 px-2"
                    onClick={() => copyContact(phone, 'Phone')}
                    title="Copy phone"
                  >
                    <i className={`bi ${copiedField === 'Phone' ? 'bi-check2 text-success' : 'bi-clipboard'} me-1`}></i>
                    <span className="small">{copiedField === 'Phone' ? 'Copied' : 'Copy'}</span>
                  </button>
                </div>
                <a href={`tel:${phone.replace(/\s+/g, '')}`} className="text-secondary text-decoration-none paragraph">
                  {phone}
                </a>
              </div>
            </div>
          </div>

          <div className="card border-0 shadow-sm rounded-4 p-4 mb-4 bg-white border-start border-4 border-primary hover-lift">
            <div className="d-flex align-items-center gap-3">
              <div className="p-3 rounded-circle bg-primary-subtle text-primary flex-shrink-0">
                <i className="bi bi-clock-fill fs-4"></i>
              </div>
              <div>
                <strong className="heading d-block mb-1 fs-5">Office Hours:</strong>
                <span className="paragraph text-secondary">{officeHours}</span>
              </div>
            </div>
          </div>

          {/* Quick link to prayer request page */}
          <div className="p-4 rounded-4 bg-light border d-flex align-items-center justify-content-between">
            <div>
              <h6 className="fw-bold mb-1 text-dark">Looking for Prayer?</h6>
              <p className="small text-muted mb-0">Share your burden with our dedicated intercession team.</p>
            </div>
            <Link to="/prayer-request" className="btn btn-outline-primary btn-sm rounded-pill px-3 py-2 fw-semibold">
              Prayer Request &rarr;
            </Link>
          </div>
        </motion.div>

        {/* General Contact Us Form */}
        <motion.div
          className="col-lg-6"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.15 }}
        >
          <div className="card border-0 shadow rounded-4 p-4 p-md-5 bg-white hover-lift">
            <h2 className="heading fw-bold display-6 mb-2">Send Us a Message</h2>
            <p className="text-muted small mb-4">
              Have questions, need information, or want to connect with our church staff? Drop us a note below.
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

            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label htmlFor="name" className="form-label fw-medium text-dark">
                  Your Name <span className="text-danger">*</span>
                </label>
                <input
                  type="text"
                  id="name"
                  className="form-control"
                  placeholder="Enter your full name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="mb-3">
                <label htmlFor="email" className="form-label fw-medium text-dark">
                  Your Email <span className="text-danger">*</span>
                </label>
                <input
                  type="email"
                  id="email"
                  className="form-control"
                  placeholder="example@mail.com"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="mb-3">
                <label htmlFor="phone" className="form-label fw-medium text-dark">
                  Phone Number <span className="text-muted small">(Optional)</span>
                </label>
                <input
                  type="tel"
                  id="phone"
                  className="form-control"
                  placeholder="+91 98765 43210"
                  value={formData.phone}
                  onChange={handleChange}
                />
              </div>

              <div className="mb-3">
                <label htmlFor="subject" className="form-label fw-medium text-dark">
                  Subject
                </label>
                <input
                  type="text"
                  id="subject"
                  className="form-control"
                  placeholder="e.g. Service timings, Visiting inquiry, General question"
                  value={formData.subject}
                  onChange={handleChange}
                />
              </div>

              <div className="mb-4">
                <label htmlFor="message" className="form-label fw-medium text-dark">
                  Message <span className="text-danger">*</span>
                </label>
                <textarea
                  className="form-control"
                  id="message"
                  rows="5"
                  placeholder="Write your message here..."
                  value={formData.message}
                  onChange={handleChange}
                  required
                ></textarea>
              </div>

              <div className="text-end">
                <motion.button
                  type="submit"
                  className="btn btn-primary px-5 py-3 rounded-pill shadow fw-semibold"
                  disabled={submitting}
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.98 }}
                >
                  {submitting ? (
                    <>
                      <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                      Sending Message...
                    </>
                  ) : (
                    <>
                      <i className="bi bi-send me-1"></i> Send Message
                    </>
                  )}
                </motion.button>
              </div>
            </form>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default ContactPage;
