import React, { useState } from 'react';
import { volunteerService } from '../../services/api';

const GetInvolvedPage = () => {
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
        setStatusMsg({
          type: 'success',
          text: 'Thank you for stepping up to serve! Your submission has been received. God bless you!'
        });
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
      setStatusMsg({
        type: 'danger',
        text: err.response?.data?.message || 'Something went wrong. Please check your information and try again.'
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="container my-5 pt-3">
      <div className="card border-0 shadow-sm rounded-4 p-4 p-md-5 bg-white mx-auto" style={{ maxWidth: '850px' }}>
        <div className="text-center mb-5">
          <h1 className="heading_1 display-5 fw-bold mb-2">Serve With Us</h1>
          <p className="lead text-muted paragraph mb-0">
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
              <label htmlFor="name" className="form-label fw-medium">
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
              <label htmlFor="age" className="form-label fw-medium">
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
              <label htmlFor="gender" className="form-label fw-medium">
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
              <label htmlFor="comingFrom" className="form-label fw-medium">
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
              <label htmlFor="profession" className="form-label fw-medium">
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
              <label htmlFor="phone" className="form-label fw-medium">
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
              <label className="form-label fw-medium d-block mb-2">
                How would you like to contribute?
              </label>
              <div className="row g-2">
                {ministryOptions.map((opt) => (
                  <div className="col-sm-6" key={opt}>
                    <div className="form-check p-2 border rounded-3 bg-light-subtle">
                      <input
                        className="form-check-input ms-1"
                        type="checkbox"
                        id={`check-${opt}`}
                        checked={formData.ministries.includes(opt)}
                        onChange={() => handleCheckboxChange(opt)}
                      />
                      <label className="form-check-label ms-2" htmlFor={`check-${opt}`}>
                        {opt}
                      </label>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="col-12 mt-4">
              <label htmlFor="message" className="form-label fw-medium">
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
              <button
                type="submit"
                className="btn btn-primary px-5 py-2"
                disabled={submitting}
              >
                {submitting ? (
                  <>
                    <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                    Submitting...
                  </>
                ) : (
                  'Submit Registration'
                )}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default GetInvolvedPage;
