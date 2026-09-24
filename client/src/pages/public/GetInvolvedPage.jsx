import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { volunteerService } from '../../services/api';
import { useToast } from '../../context/ToastContext';
import SEO from '../../components/common/SEO';

const GetInvolvedPage = () => {
  const { addToast } = useToast();

  const [formData, setFormData] = useState({
    name: '',
    age: '',
    gender: '',
    comingFrom: '',
    profession: '',
    phone: '',
    ministries: [],
    message: ''
  });

  const [submitting, setSubmitting] = useState(false);
  const [statusMsg, setStatusMsg] = useState(null);

  const ministryOptions = [
    'Choir Team',
    'Cleaning Ministry',
    'Music Team',
    'Media/Projection',
    "Children's Ministry",
    'Hospitality/Greeters'
  ];

  const handleCheckboxChange = (opt) => {
    setFormData((prev) => {
      const exists = prev.ministries.includes(opt);
      const updated = exists
        ? prev.ministries.filter((m) => m !== opt)
        : [...prev.ministries, opt];
      return { ...prev, ministries: updated };
    });
  };

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setStatusMsg(null);

    try {
      const res = await volunteerService.submit(formData);
      if (res.data.success) {
        const successText = 'Thank you for stepping up to serve! Your submission has been received. God bless you!';
        setStatusMsg({
          type: 'success',
          text: successText
        });
        addToast(successText, 'success');
        setFormData({
          name: '',
          age: '',
          gender: '',
          comingFrom: '',
          profession: '',
          phone: '',
          ministries: [],
          message: ''
        });
      }
    } catch (err) {
      console.error(err);
      const errorText = err.response?.data?.message || 'Something went wrong. Please check your information and try again.';
      setStatusMsg({
        type: 'danger',
        text: errorText
      });
      addToast(errorText, 'danger');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="container my-5 pt-3">
      <SEO
        title="Get Involved"
        description="Volunteer your talents and gifts in choir, media, cleaning, children, and hospitality ministries at Friends Garden AG Church."
      />

      <motion.div
        className="card border-0 shadow rounded-4 p-4 p-md-5 bg-white mx-auto hover-lift"
        style={{ maxWidth: '860px' }}
        initial={{ opacity: 0, y: 25 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      >
        <div className="text-center mb-5">
          <span className="badge px-3 py-2 rounded-pill text-uppercase mb-3" style={{ backgroundColor: 'rgba(56, 161, 219, 0.15)', color: '#0a3d62', fontWeight: 600 }}>
            Join the Ministry Team
          </span>
          <h1 className="heading_1 display-5 fw-bold mb-2">Serve With Us</h1>
          <div className="section-divider">
            <i className="bi bi-diamond-fill section-divider-icon"></i>
          </div>
          <p className="lead text-muted paragraph mb-0 fs-5">
            Be the hands and feet of Christ. Use your gifts for His glory.
          </p>
        </div>

        <h3 className="heading fw-bold mb-4 pb-2 border-bottom">Get Involved in Our Church</h3>

        {statusMsg && (
          <div className={`alert alert-${statusMsg.type} alert-dismissible fade show mb-4`} role="alert">
            <i className={`bi ${statusMsg.type === 'success' ? 'bi-check-circle-fill' : 'bi-exclamation-triangle-fill'} me-2`}></i>
            {statusMsg.text}
            <button
              type="button"
              className="btn-close"
              onClick={() => setStatusMsg(null)}
              aria-label="Close"
            ></button>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="row g-3">
            <div className="col-md-6">
              <label htmlFor="name" className="form-label fw-medium text-dark">
                Full Name <span className="text-danger">*</span>
              </label>
              <input
                type="text"
                id="name"
                className="form-control"
                value={formData.name}
                onChange={handleChange}
                required
                placeholder="Your name"
              />
            </div>

            <div className="col-md-3">
              <label htmlFor="age" className="form-label fw-medium text-dark">
                Age <span className="text-danger">*</span>
              </label>
              <input
                type="number"
                id="age"
                className="form-control"
                value={formData.age}
                onChange={handleChange}
                required
                min="5"
                max="100"
                placeholder="Age"
              />
            </div>

            <div className="col-md-3">
              <label htmlFor="gender" className="form-label fw-medium text-dark">
                Gender <span className="text-danger">*</span>
              </label>
              <select
                id="gender"
                className="form-select"
                value={formData.gender}
                onChange={handleChange}
                required
              >
                <option value="" disabled>
                  Choose...
                </option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div className="col-md-6">
              <label htmlFor="comingFrom" className="form-label fw-medium text-dark">
                Coming From (City/Town) <span className="text-danger">*</span>
              </label>
              <input
                type="text"
                id="comingFrom"
                className="form-control"
                value={formData.comingFrom}
                onChange={handleChange}
                required
                placeholder="e.g. Kollidam, Sirkazhi"
              />
            </div>

            <div className="col-md-6">
              <label htmlFor="profession" className="form-label fw-medium text-dark">
                Profession <span className="text-danger">*</span>
              </label>
              <input
                type="text"
                id="profession"
                className="form-control"
                value={formData.profession}
                onChange={handleChange}
                required
                placeholder="e.g. Student, Engineer, Teacher"
              />
            </div>

            <div className="col-md-6">
              <label htmlFor="phone" className="form-label fw-medium text-dark">
                Phone Number <span className="text-danger">*</span>
              </label>
              <input
                type="tel"
                id="phone"
                className="form-control"
                value={formData.phone}
                onChange={handleChange}
                required
                placeholder="+91 98765 43210"
              />
            </div>

            <div className="col-12 mt-4">
              <label className="form-label fw-medium d-block mb-3 text-dark">
                How would you like to contribute?
              </label>
              <div className="row g-2">
                {ministryOptions.map((opt) => {
                  const isChecked = formData.ministries.includes(opt);
                  return (
                    <div className="col-sm-6" key={opt}>
                      <div
                        className={`p-3 border rounded-3 transition-base cursor-pointer d-flex align-items-center gap-2 ${
                          isChecked ? 'bg-primary-subtle border-primary' : 'bg-light border-light-subtle'
                        }`}
                        onClick={() => handleCheckboxChange(opt)}
                        style={{ cursor: 'pointer' }}
                      >
                        <input
                          className="form-check-input mt-0"
                          type="checkbox"
                          id={`check-${opt}`}
                          checked={isChecked}
                          onChange={() => {}}
                        />
                        <label className="form-check-label ms-1 fw-medium user-select-none" style={{ cursor: 'pointer' }}>
                          {opt}
                        </label>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="col-12 mt-4">
              <label htmlFor="message" className="form-label fw-medium text-dark">
                Tell us more (optional, max 300 characters)
              </label>
              <textarea
                className="form-control"
                id="message"
                rows="4"
                maxLength="300"
                value={formData.message}
                onChange={handleChange}
                placeholder="I want to contribute to the church by..."
              ></textarea>
            </div>

            <div className="col-12 text-end mt-4">
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
                    Submitting...
                  </>
                ) : (
                  'Submit Registration'
                )}
              </motion.button>
            </div>
          </div>
        </form>
      </motion.div>
    </div>
  );
};

export default GetInvolvedPage;
