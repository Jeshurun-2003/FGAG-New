import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { weeklySchedule } from '../../data/weeklySchedule';

const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] } }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.08 }
  }
};

const CATEGORIES = ['All', 'Worship', 'Prayer', 'Fellowship', 'Youth'];

const WeeklySchedule = () => {
  const [activeCategory, setActiveCategory] = useState('All');

  const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const todayName = dayNames[new Date().getDay()];

  const filteredSchedule = activeCategory === 'All'
    ? weeklySchedule
    : weeklySchedule.filter((item) => item.category === activeCategory);

  return (
    <section className="py-5 bg-white position-relative overflow-hidden" id="weekly-schedule">
      <div className="container py-4">
        {/* Section Heading */}
        <motion.div
          className="text-center mb-4"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-40px' }}
          variants={fadeInUp}
        >
          <div className="d-inline-flex align-items-center gap-2 px-3 py-1 rounded-pill bg-primary-subtle text-primary fw-semibold small mb-2">
            <i className="bi bi-clock-history"></i>
            <span>Gatherings & Service Times</span>
          </div>
          <h2 className="heading display-6 fw-bold mb-2" style={{ color: 'var(--fgag-primary, #0A3D62)' }}>
            Weekly Church Schedule
          </h2>
          <div className="section-divider">
            <i className="bi bi-diamond-fill section-divider-icon"></i>
          </div>
          <p className="lead paragraph text-muted mx-auto mb-0" style={{ maxWidth: '640px' }}>
            Join us throughout the week for uplifting worship, earnest prayer, and spiritual fellowship.
          </p>
        </motion.div>

        {/* Category Filter Pills */}
        <motion.div
          className="d-flex flex-wrap justify-content-center gap-2 mb-5"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeInUp}
        >
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setActiveCategory(cat)}
              className={`btn btn-sm rounded-pill px-3 py-2 fw-semibold transition-all ${
                activeCategory === cat
                  ? 'btn-primary shadow-sm'
                  : 'btn-outline-secondary border-light-subtle bg-light text-secondary'
              }`}
              style={{ fontSize: '0.84rem' }}
            >
              {cat === 'All' ? 'All Gatherings (6)' : cat}
            </button>
          ))}
        </motion.div>

        {/* Enhanced Card Grid */}
        <motion.div
          className="row g-4"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-40px' }}
          variants={staggerContainer}
        >
          <AnimatePresence mode="popLayout">
            {filteredSchedule.map((item) => {
              const isToday = item.day.toLowerCase() === todayName.toLowerCase();
              return (
                <motion.div
                  className="col-12 col-md-6 col-lg-4 d-flex"
                  key={item.day}
                  layout
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.35 }}
                >
                  <div
                    className={`card h-100 w-100 rounded-4 border-0 p-4 d-flex flex-column justify-content-between position-relative overflow-hidden hover-lift ${
                      isToday ? 'shadow' : 'shadow-sm'
                    }`}
                    style={{
                      backgroundColor: isToday ? '#FFFFFF' : '#FFFFFF',
                      border: isToday
                        ? '2px solid var(--fgag-sky, #38A1DB)'
                        : '1px solid #E9F1F7',
                      boxShadow: isToday
                        ? '0 12px 32px rgba(56, 161, 219, 0.18)'
                        : '0 4px 16px rgba(10, 61, 98, 0.05)'
                    }}
                  >
                    {/* Top Decorative Stripe */}
                    <div
                      className="position-absolute top-0 start-0 w-100"
                      style={{
                        height: '4px',
                        background: isToday
                          ? 'linear-gradient(90deg, #38A1DB, #20c997)'
                          : item.day === 'Sunday'
                          ? 'linear-gradient(90deg, #F39C12, #F7DC6F)'
                          : 'linear-gradient(90deg, #0A3D62, #38A1DB)'
                      }}
                    />

                    <div>
                      {/* Top Bar: Day Badge + Today Indicator */}
                      <div className="d-flex justify-content-between align-items-center mb-3">
                        <span
                          className="badge px-3 py-2 rounded-pill text-uppercase fw-bold small d-inline-flex align-items-center gap-1"
                          style={{
                            backgroundColor: item.day === 'Sunday' ? 'rgba(243, 156, 18, 0.15)' : 'rgba(10, 61, 98, 0.08)',
                            color: item.day === 'Sunday' ? '#B7791F' : 'var(--fgag-primary, #0A3D62)',
                            letterSpacing: '0.04em'
                          }}
                        >
                          <i className="bi bi-calendar3"></i>
                          <span>{item.day}</span>
                        </span>

                        {isToday && (
                          <span
                            className="badge bg-success text-white px-2 py-1 rounded-pill small d-inline-flex align-items-center gap-1 shadow-sm"
                            style={{ fontSize: '0.72rem' }}
                          >
                            <span
                              className="spinner-grow spinner-grow-sm"
                              style={{ width: '7px', height: '7px' }}
                              role="status"
                            />
                            <span>Today</span>
                          </span>
                        )}
                      </div>

                      {/* Service / Prayer Title */}
                      <h4
                        className="fw-bold mb-3"
                        style={{
                          color: 'var(--fgag-primary, #0A3D62)',
                          fontFamily: "'Playfair Display', serif",
                          fontSize: '1.25rem',
                          lineHeight: '1.35'
                        }}
                      >
                        {item.title}
                      </h4>

                      {/* Service Time Block */}
                      <div
                        className="d-flex align-items-center gap-3 p-3 rounded-3 mb-2"
                        style={{
                          backgroundColor: 'rgba(56, 161, 219, 0.08)',
                          border: '1px solid rgba(56, 161, 219, 0.16)'
                        }}
                      >
                        <div
                          className="rounded-circle d-flex align-items-center justify-content-center flex-shrink-0"
                          style={{
                            width: '36px',
                            height: '36px',
                            backgroundColor: 'var(--fgag-sky, #38A1DB)',
                            color: '#FFFFFF'
                          }}
                        >
                          <i className="bi bi-clock-fill fs-6"></i>
                        </div>
                        <div className="overflow-hidden">
                          <div
                            className="text-muted text-uppercase fw-semibold"
                            style={{ fontSize: '0.68rem', letterSpacing: '0.06em' }}
                          >
                            Service Time
                          </div>
                          <div className="fw-bold text-dark fs-6 text-truncate">
                            {item.time}
                          </div>
                        </div>
                      </div>

                      {/* Venue / Location Block */}
                      <div
                        className="d-flex align-items-center gap-3 p-3 rounded-3"
                        style={{
                          backgroundColor: 'rgba(10, 61, 98, 0.04)',
                          border: '1px solid rgba(10, 61, 98, 0.08)'
                        }}
                      >
                        <div
                          className="rounded-circle d-flex align-items-center justify-content-center flex-shrink-0"
                          style={{
                            width: '36px',
                            height: '36px',
                            backgroundColor: 'var(--fgag-primary, #0A3D62)',
                            color: '#FFFFFF'
                          }}
                        >
                          <i className="bi bi-geo-alt-fill fs-6"></i>
                        </div>
                        <div className="overflow-hidden">
                          <div
                            className="text-muted text-uppercase fw-semibold"
                            style={{ fontSize: '0.68rem', letterSpacing: '0.06em' }}
                          >
                            Venue
                          </div>
                          <div className="fw-semibold text-secondary small text-truncate">
                            {item.location}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Card Subtle Bottom Tag */}
                    <div className="mt-3 pt-3 border-top border-light-subtle d-flex justify-content-between align-items-center">
                      <span className="small text-muted" style={{ fontSize: '0.78rem' }}>
                        <i className="bi bi-people me-1"></i> Open to all
                      </span>
                      <span
                        className="badge bg-light text-secondary border small"
                        style={{ fontSize: '0.72rem' }}
                      >
                        {item.category}
                      </span>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </motion.div>

        {/* Sanctuary Location Quick Link */}
        <div className="text-center mt-4 pt-2">
          <p className="small text-muted mb-0">
            Need directions to Friends Garden AG Church, Kollidam?{' '}
            <Link to="/contact" className="fw-semibold text-decoration-none text-primary">
              View on Google Maps <i className="bi bi-arrow-right"></i>
            </Link>
          </p>
        </div>
      </div>
    </section>
  );
};

export default WeeklySchedule;
