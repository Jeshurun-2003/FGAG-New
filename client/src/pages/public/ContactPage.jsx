import React, { useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import { prayerService } from '../../services/api';

const ContactPage = () => {
  const { settings = {} } = useOutletContext() || {};

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
    setSubmitting(true);
    setResponseMsg(null);

    try {
      const res = await prayerService.submit(formData);
      if (res.data.success) {
        setResponseMsg({
          type: 'success',
          text: 'Your prayer request has been received. Our prayer team will faithfully lift your request before the Lord.'
        });
        setFormData({ name: '', email: '', phone: '', message: '' });
      }
    } catch (err) {
      console.error(err);
      setResponseMsg({
        type: 'danger',
        text: err.response?.data?.message || 'Something went wrong. Please try again.'
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="container my-5 pt-3">
      {/* Map Header */}
      <div className="mb-5">
        <h2 className="heading_2 display-6 fw-bold mb-4">Find Us on the Map</h2>
        <div className="rounded-4 overflow-hidden shadow-sm border">
          <iframe
            src={mapEmbed}
            width="100%"
            height="400"
            style={{ border: 0 }}
            allowFullScreen=""
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            title="Friends Garden AG Church Location"
          ></iframe>
        </div>
        <div className="mt-3">
          <a
            href={mapLink}
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-outline-primary btn-sm"
          >
            <i className="bi bi-geo-alt me-1"></i> Open in Google Maps
          </a>
        </div>
      </div>

      <div className="row g-5">
        {/* Contact Info */}
        <div className="col-lg-6">
          <h2 className="heading fw-bold display-6 mb-4">Get in Touch</h2>

          <div className="card border-0 shadow-sm rounded-3 p-3 mb-3 bg-white border-start border-4 border-primary">
            <div className="d-flex align-items-start gap-3">
              <i className="bi bi-geo-alt-fill fs-3 text-primary"></i>
              <div>
                <strong className="heading d-block mb-1">Address:</strong>
                <span className="paragraph text-secondary">{address}</span>
              </div>
            </div>
          </div>

          <div className="card border-0 shadow-sm rounded-3 p-3 mb-3 bg-white border-start border-4 border-primary">
            <div className="d-flex align-items-center gap-3">
              <i className="bi bi-envelope-fill fs-3 text-primary"></i>
              <div>
                <strong className="heading d-block mb-1">Email:</strong>
                <a href={`mailto:${email}`} className="text-secondary text-decoration-none paragraph">
                  {email}
                </a>
              </div>
            </div>
          </div>

          <div className="card border-0 shadow-sm rounded-3 p-3 mb-3 bg-white border-start border-4 border-primary">
            <div className="d-flex align-items-center gap-3">
              <i className="bi bi-telephone-fill fs-3 text-primary"></i>
              <div>
                <strong className="heading d-block mb-1">Phone:</strong>
                <a href={`tel:${phone.replace(/\s+/g, '')}`} className="text-secondary text-decoration-none paragraph">
                  {phone}
                </a>
              </div>
            </div>
          </div>

          <div className="card border-0 shadow-sm rounded-3 p-3 mb-4 bg-white border-start border-4 border-primary">
            <div className="d-flex align-items-center gap-3">
              <i className="bi bi-clock-fill fs-3 text-primary"></i>
              <div>
                <strong className="heading d-block mb-1">Office Hours:</strong>
                <span className="paragraph text-secondary">{officeHours}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Prayer Request Form */}
        <div className="col-lg-6">
          <div className="card border-0 shadow-sm rounded-4 p-4 p-md-5 bg-white">
            <h2 className="heading fw-bold display-6 mb-4">Prayer Request Form</h2>

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
                <label htmlFor="name" className="form-label fw-medium">
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
                <label htmlFor="email" className="form-label fw-medium">
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
                <label htmlFor="phone" className="form-label fw-medium">
                  Your Phone (Optional)
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

              <div className="mb-4">
                <label htmlFor="message" className="form-label fw-medium">
                  Prayer Message <span className="text-danger">*</span>
                </label>
                <textarea
                  className="form-control"
                  id="message"
                  rows="5"
                  placeholder="Share your prayer need, petition, or thanksgiving..."
                  value={formData.message}
                  onChange={handleChange}
                  required
                ></textarea>
              </div>

              <div className="text-end">
                <button
                  type="submit"
                  className="btn btn-primary px-4 py-2"
                  disabled={submitting}
                >
                  {submitting ? (
                    <>
                      <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                      Sending...
                    </>
                  ) : (
                    'Send Request'
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactPage;
