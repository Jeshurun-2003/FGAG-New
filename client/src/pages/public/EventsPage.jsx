import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { eventsService } from '../../services/api';
import { CardSkeleton } from '../../components/common/SkeletonLoader';
import SEO from '../../components/common/SEO';

const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] } }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 }
  }
};

const EventsPage = () => {
  const [events, setEvents] = useState([]);
  const [featuredEvent, setFeaturedEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('ALL'); // 'ALL' | 'FEATURED' | 'UPCOMING'
  const [selectedEventModal, setSelectedEventModal] = useState(null);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        setLoading(true);
        const [allRes, featRes] = await Promise.all([
          eventsService.getAll(),
          eventsService.getFeatured()
        ]);

        if (allRes.data && allRes.data.success) {
          setEvents(allRes.data.events || []);
        }

        if (featRes.data && featRes.data.success && featRes.data.event) {
          setFeaturedEvent(featRes.data.event);
        } else if (allRes.data && allRes.data.events && allRes.data.events.length > 0) {
          const featured = allRes.data.events.find((e) => e.isFeatured) || allRes.data.events[0];
          setFeaturedEvent(featured);
        }
      } catch (err) {
        console.warn('Could not load events:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  // Filter events based on search query and active tab
  const filteredEvents = events.filter((e) => {
    const matchesSearch =
      e.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (e.location && e.location.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (e.summary && e.summary.toLowerCase().includes(searchQuery.toLowerCase()));

    if (!matchesSearch) return false;

    if (activeTab === 'FEATURED') return e.isFeatured;
    return true;
  });

  const formatDate = (dateStr) => {
    if (!dateStr) return { month: 'TBA', day: '•', year: '', full: 'Date to be announced' };
    const date = new Date(dateStr);
    if (isNaN(date.getTime())) return { month: 'TBA', day: '•', year: '', full: dateStr };

    const month = date.toLocaleString('en-US', { month: 'short' }).toUpperCase();
    const day = date.getDate();
    const year = date.getFullYear();
    const full = date.toLocaleDateString('en-US', {
      weekday: 'long',
      month: 'long',
      day: 'numeric',
      year: 'numeric'
    });

    return { month, day, year, full };
  };

  const handleShareWhatsApp = (event) => {
    const text = encodeURIComponent(
      `⛪ *${event.title}*\n📍 ${event.location || 'Friends Garden AG Church, Kollidam'}\n🕒 ${event.time || ''}\n\nJoin us! More info: ${window.location.href}`
    );
    window.open(`https://api.whatsapp.com/send?text=${text}`, '_blank');
  };

  return (
    <div className="container my-5 pt-3">
      <SEO
        title="Events & Gatherings"
        description="Join us for Sunday worship, revival conventions, youth summits, and special church gatherings at Friends Garden AG Church, Kollidam."
      />

      {/* Header Section */}
      <motion.div
        className="text-center mb-5"
        initial={{ opacity: 0, y: -15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="d-inline-flex align-items-center gap-2 px-3 py-1 rounded-pill bg-primary-subtle text-primary fw-semibold small mb-2">
          <i className="bi bi-calendar-event"></i>
          <span>Church Calendar & Conventions</span>
        </div>
        <h1 className="heading display-5 fw-bold mb-2" style={{ color: 'var(--fgag-primary, #0A3D62)' }}>
          Church Events & Gatherings
        </h1>
        <div className="section-divider">
          <i className="bi bi-diamond-fill section-divider-icon"></i>
        </div>
        <p className="paragraph lead text-muted mx-auto" style={{ maxWidth: '680px' }}>
          Experience transformative revival, fellowship, and worship at our upcoming conventions, special meetings, and conferences.
        </p>
      </motion.div>

      {/* Loading Skeleton */}
      {loading ? (
        <div className="py-4">
          <CardSkeleton count={2} />
        </div>
      ) : (
        <>
          {/* ============================================================== */}
          {/* 1. Grand Spotlight Banner: Featured Church Event               */}
          {/* ============================================================== */}
          {featuredEvent && (
            <motion.div
              className="card border-0 shadow-lg rounded-4 overflow-hidden mb-5 hover-lift"
              style={{
                background: 'linear-gradient(135deg, #0A3D62 0%, #062238 100%)',
                color: '#FFFFFF'
              }}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeInUp}
            >
              <div className="row g-0 align-items-stretch">
                {/* Event Poster Column */}
                <div className="col-12 col-lg-6 position-relative overflow-hidden" style={{ minHeight: '340px' }}>
                  <img
                    src={featuredEvent.imageUrl || '/images/Church_img.jpg'}
                    alt={featuredEvent.title}
                    className="w-100 h-100 position-absolute top-0 start-0"
                    style={{
                      objectFit: 'cover',
                      objectPosition: 'center'
                    }}
                    onError={(e) => {
                      e.target.src = '/images/Church_img.jpg';
                    }}
                  />
                  <div
                    className="position-absolute top-0 start-0 w-100 h-100"
                    style={{
                      background: 'linear-gradient(to right, rgba(10, 61, 98, 0.4) 0%, rgba(6, 34, 56, 0.75) 100%)'
                    }}
                  />

                  {/* Spotlight Ribbon */}
                  <div className="position-absolute top-0 start-0 m-3 m-md-4">
                    <span
                      className="badge px-3 py-2 rounded-pill text-uppercase fw-bold shadow-sm d-inline-flex align-items-center gap-1"
                      style={{
                        backgroundColor: '#F39C12',
                        color: '#FFFFFF',
                        letterSpacing: '0.06em',
                        fontSize: '0.78rem'
                      }}
                    >
                      <i className="bi bi-star-fill"></i> Spotlight Event
                    </span>
                  </div>
                </div>

                {/* Event Details Content Column */}
                <div className="col-12 col-lg-6 p-4 p-md-5 d-flex flex-column justify-content-between">
                  <div>
                    {featuredEvent.date && (
                      <div className="d-flex align-items-center gap-2 mb-3">
                        <span className="badge bg-light text-dark px-3 py-1 rounded-pill small fw-semibold">
                          <i className="bi bi-calendar3 me-1 text-primary"></i>
                          {formatDate(featuredEvent.date).full}
                        </span>
                      </div>
                    )}

                    <h2
                      className="fw-bold mb-3 text-white"
                      style={{
                        fontFamily: "'Playfair Display', serif",
                        fontSize: 'clamp(1.45rem, 2.5vw, 2.1rem)',
                        lineHeight: '1.25'
                      }}
                    >
                      {featuredEvent.title}
                    </h2>

                    {featuredEvent.summary && (
                      <p
                        className="text-light opacity-90 mb-4"
                        style={{
                          fontSize: '1.02rem',
                          lineHeight: '1.7',
                          fontFamily: "'Lora', serif"
                        }}
                      >
                        {featuredEvent.summary}
                      </p>
                    )}

                    <div className="row g-2 mb-4">
                      {featuredEvent.time && (
                        <div className="col-12 col-sm-6">
                          <div
                            className="p-2 px-3 rounded-3 d-flex align-items-center gap-2"
                            style={{ backgroundColor: 'rgba(255, 255, 255, 0.1)' }}
                          >
                            <i className="bi bi-clock-fill text-info fs-5"></i>
                            <div>
                              <div className="text-light opacity-75 small text-uppercase" style={{ fontSize: '0.68rem' }}>
                                Time
                              </div>
                              <div className="fw-semibold text-white small">{featuredEvent.time}</div>
                            </div>
                          </div>
                        </div>
                      )}

                      {featuredEvent.location && (
                        <div className="col-12 col-sm-6">
                          <div
                            className="p-2 px-3 rounded-3 d-flex align-items-center gap-2"
                            style={{ backgroundColor: 'rgba(255, 255, 255, 0.1)' }}
                          >
                            <i className="bi bi-geo-alt-fill text-danger fs-5"></i>
                            <div>
                              <div className="text-light opacity-75 small text-uppercase" style={{ fontSize: '0.68rem' }}>
                                Location
                              </div>
                              <div className="fw-semibold text-white small text-truncate">
                                {featuredEvent.location}
                              </div>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="d-flex flex-wrap gap-2 pt-2 border-top border-white-50">
                    <button
                      type="button"
                      onClick={() => setSelectedEventModal(featuredEvent)}
                      className="btn btn-primary rounded-pill px-4 py-2 fw-semibold d-inline-flex align-items-center gap-2 shadow-sm"
                    >
                      <i className="bi bi-info-circle"></i>
                      <span>View Full Details</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => handleShareWhatsApp(featuredEvent)}
                      className="btn btn-outline-light rounded-pill px-3 py-2 fw-semibold d-inline-flex align-items-center gap-2"
                      style={{ backgroundColor: 'rgba(255, 255, 255, 0.08)' }}
                    >
                      <i className="bi bi-whatsapp text-success"></i>
                      <span>Share Event</span>
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* ============================================================== */}
          {/* 2. Search, Filter Bar & Section Header                         */}
          {/* ============================================================== */}
          <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3 mb-4 pt-3">
            <div>
              <h3 className="heading fw-bold mb-1" style={{ color: 'var(--fgag-primary, #0A3D62)' }}>
                Upcoming Gatherings & Conferences
              </h3>
              <p className="text-muted small mb-0">
                Browse our scheduled services, special conventions, and ministry events.
              </p>
            </div>

            <div className="d-flex flex-wrap gap-2 align-items-center">
              {/* Search Box */}
              <div className="input-group" style={{ maxWidth: '280px' }}>
                <span className="input-group-text bg-white border-end-0 rounded-start-pill text-muted">
                  <i className="bi bi-search"></i>
                </span>
                <input
                  type="text"
                  className="form-control border-start-0 rounded-end-pill ps-0"
                  placeholder="Search events..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>

              {/* Filter Tabs */}
              <div className="btn-group rounded-pill p-1 bg-light border">
                <button
                  type="button"
                  onClick={() => setActiveTab('ALL')}
                  className={`btn btn-sm rounded-pill px-3 ${activeTab === 'ALL' ? 'btn-primary shadow-sm' : 'btn-light border-0'}`}
                >
                  All ({events.length})
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab('FEATURED')}
                  className={`btn btn-sm rounded-pill px-3 ${activeTab === 'FEATURED' ? 'btn-primary shadow-sm' : 'btn-light border-0'}`}
                >
                  Featured
                </button>
              </div>
            </div>
          </div>

          {/* ============================================================== */}
          {/* 3. All Events Grid (Premium Card Structure)                    */}
          {/* ============================================================== */}
          {filteredEvents.length === 0 ? (
            <div className="card border-0 shadow-sm rounded-4 p-5 text-center bg-white my-4">
              <div
                className="rounded-circle bg-light d-inline-flex align-items-center justify-content-center mx-auto mb-3"
                style={{ width: '64px', height: '64px' }}
              >
                <i className="bi bi-calendar-x fs-2 text-muted"></i>
              </div>
              <h4 className="heading fw-bold mb-2">No Events Found</h4>
              <p className="text-muted mx-auto mb-3" style={{ maxWidth: '480px' }}>
                {searchQuery
                  ? `No gatherings matched your search "${searchQuery}". Try a different keyword.`
                  : 'Check back soon for new announcements and upcoming conventions.'}
              </p>
              {searchQuery && (
                <div>
                  <button
                    type="button"
                    onClick={() => setSearchQuery('')}
                    className="btn btn-outline-primary btn-sm rounded-pill px-3"
                  >
                    Clear Search Filter
                  </button>
                </div>
              )}
            </div>
          ) : (
            <motion.div
              className="row g-4"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: '-40px' }}
              variants={staggerContainer}
            >
              {filteredEvents.map((event) => {
                const dateInfo = formatDate(event.date);
                return (
                  <motion.div className="col-12 col-md-6 col-lg-4 d-flex" key={event.id} variants={fadeInUp}>
                    <div className="card h-100 w-100 rounded-4 shadow-sm border-0 bg-white hover-lift overflow-hidden d-flex flex-column justify-content-between">
                      <div>
                        {/* Event Poster with Aspect Ratio & Date Badge Overlay */}
                        <div
                          className="position-relative overflow-hidden image-zoom-card"
                          style={{
                            aspectRatio: '16 / 10',
                            backgroundColor: '#E2E8F0'
                          }}
                        >
                          <img
                            src={event.imageUrl || '/images/Church_img.jpg'}
                            alt={event.title}
                            className="w-100 h-100"
                            style={{ objectFit: 'cover' }}
                            loading="lazy"
                            onError={(e) => {
                              e.target.src = '/images/Church_img.jpg';
                            }}
                          />

                          {/* Date Ribbon Badge */}
                          <div
                            className="position-absolute top-0 start-0 m-3 rounded-3 text-center bg-white shadow-sm p-2"
                            style={{
                              minWidth: '52px',
                              lineHeight: 1,
                              border: '1px solid rgba(0, 0, 0, 0.08)'
                            }}
                          >
                            <div
                              className="fw-bold text-uppercase"
                              style={{ fontSize: '0.7rem', color: 'var(--fgag-primary, #0A3D62)' }}
                            >
                              {dateInfo.month}
                            </div>
                            <div className="fs-5 fw-bold text-dark pt-1">{dateInfo.day}</div>
                          </div>

                          {/* Featured Pill */}
                          {event.isFeatured && (
                            <span
                              className="position-absolute top-0 end-0 m-3 badge rounded-pill px-3 py-1 shadow-sm small"
                              style={{ backgroundColor: '#F39C12', color: '#FFFFFF' }}
                            >
                              Featured
                            </span>
                          )}
                        </div>

                        {/* Card Body */}
                        <div className="p-4">
                          <h4
                            className="card-title fw-bold mb-2 text-dark fs-5"
                            style={{ fontFamily: "'Playfair Display', serif" }}
                          >
                            {event.title}
                          </h4>

                          {/* Time & Location Chips */}
                          <div className="mb-3">
                            {event.time && (
                              <div className="text-secondary small mb-1 d-flex align-items-center gap-2">
                                <i className="bi bi-clock text-primary"></i>
                                <span className="fw-medium text-dark">{event.time}</span>
                              </div>
                            )}
                            {event.location && (
                              <div className="text-muted small d-flex align-items-center gap-2">
                                <i className="bi bi-geo-alt text-danger"></i>
                                <span className="text-truncate">{event.location}</span>
                              </div>
                            )}
                          </div>

                          {event.summary && (
                            <p
                              className="paragraph small text-muted mb-0"
                              style={{
                                display: '-webkit-box',
                                WebkitLineClamp: 3,
                                WebkitBoxOrient: 'vertical',
                                overflow: 'hidden',
                                lineHeight: '1.6'
                              }}
                            >
                              {event.summary}
                            </p>
                          )}
                        </div>
                      </div>

                      {/* Card Footer with Details Modal Trigger */}
                      <div className="p-4 pt-0">
                        <div className="pt-3 border-top border-light-subtle d-flex justify-content-between align-items-center">
                          <button
                            type="button"
                            onClick={() => setSelectedEventModal(event)}
                            className="btn btn-sm btn-outline-primary rounded-pill px-3 fw-semibold d-inline-flex align-items-center gap-1"
                          >
                            <span>Event Details</span>
                            <i className="bi bi-arrow-right"></i>
                          </button>

                          <button
                            type="button"
                            onClick={() => handleShareWhatsApp(event)}
                            className="btn btn-sm btn-light text-secondary rounded-circle p-2"
                            title="Share on WhatsApp"
                            aria-label="Share on WhatsApp"
                          >
                            <i className="bi bi-whatsapp text-success"></i>
                          </button>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </motion.div>
          )}

          {/* Regular Weekly Services Callout */}
          <div className="mt-5 p-4 rounded-4 text-center section-ice border border-light-subtle">
            <h5 className="fw-bold mb-2" style={{ color: 'var(--fgag-primary, #0A3D62)' }}>
              Looking for our regular Sunday services or midweek prayer times?
            </h5>
            <p className="text-muted small mb-3">
              We gather every week across Sunday worship, Tuesday fasting prayer, Wednesday night gathering, and Saturday youth service.
            </p>
            <a href="/#weekly-schedule" className="btn btn-primary btn-sm rounded-pill px-4 shadow-sm">
              <i className="bi bi-clock-history me-1"></i> View Weekly Schedule on Home Page
            </a>
          </div>
        </>
      )}

      {/* ============================================================== */}
      {/* 4. Interactive Event Details Modal                             */}
      {/* ============================================================== */}
      {selectedEventModal && (
        <div
          className="modal fade show d-block"
          tabIndex="-1"
          style={{ backgroundColor: 'rgba(10, 25, 41, 0.7)', zIndex: 1055 }}
          onClick={() => setSelectedEventModal(null)}
        >
          <div
            className="modal-dialog modal-dialog-centered modal-lg"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="modal-content border-0 shadow-lg rounded-4 overflow-hidden">
              {/* Modal Header / Banner */}
              <div
                className="position-relative overflow-hidden"
                style={{ height: '240px', backgroundColor: '#0A3D62' }}
              >
                <img
                  src={selectedEventModal.imageUrl || '/images/Church_img.jpg'}
                  alt={selectedEventModal.title}
                  className="w-100 h-100"
                  style={{ objectFit: 'cover' }}
                  onError={(e) => {
                    e.target.src = '/images/Church_img.jpg';
                  }}
                />
                <div
                  className="position-absolute top-0 start-0 w-100 h-100"
                  style={{
                    background: 'linear-gradient(to top, rgba(10, 61, 98, 0.92) 0%, rgba(10, 61, 98, 0.3) 100%)'
                  }}
                />
                <button
                  type="button"
                  className="btn-close btn-close-white position-absolute top-0 end-0 m-3 shadow"
                  onClick={() => setSelectedEventModal(null)}
                  aria-label="Close"
                ></button>

                <div className="position-absolute bottom-0 start-0 p-4 text-white">
                  {selectedEventModal.isFeatured && (
                    <span className="badge bg-warning text-dark mb-2 px-3 py-1 rounded-pill small fw-bold">
                      ⭐ Featured Event
                    </span>
                  )}
                  <h3
                    className="fw-bold mb-0 text-white"
                    style={{ fontFamily: "'Playfair Display', serif" }}
                  >
                    {selectedEventModal.title}
                  </h3>
                </div>
              </div>

              {/* Modal Body */}
              <div className="modal-body p-4 p-md-5">
                {/* Meta Highlights Row */}
                <div className="row g-3 mb-4">
                  {selectedEventModal.date && (
                    <div className="col-12 col-sm-4">
                      <div className="p-3 rounded-3 bg-light border text-center">
                        <i className="bi bi-calendar3 fs-4 text-primary mb-1 d-block"></i>
                        <div className="small text-muted text-uppercase" style={{ fontSize: '0.68rem' }}>Date</div>
                        <div className="fw-bold text-dark small">{formatDate(selectedEventModal.date).full}</div>
                      </div>
                    </div>
                  )}

                  {selectedEventModal.time && (
                    <div className="col-12 col-sm-4">
                      <div className="p-3 rounded-3 bg-light border text-center">
                        <i className="bi bi-clock-fill fs-4 text-primary mb-1 d-block"></i>
                        <div className="small text-muted text-uppercase" style={{ fontSize: '0.68rem' }}>Time</div>
                        <div className="fw-bold text-dark small">{selectedEventModal.time}</div>
                      </div>
                    </div>
                  )}

                  {selectedEventModal.location && (
                    <div className="col-12 col-sm-4">
                      <div className="p-3 rounded-3 bg-light border text-center">
                        <i className="bi bi-geo-alt-fill fs-4 text-danger mb-1 d-block"></i>
                        <div className="small text-muted text-uppercase" style={{ fontSize: '0.68rem' }}>Venue</div>
                        <div className="fw-bold text-dark small">{selectedEventModal.location}</div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Summary */}
                {selectedEventModal.summary && (
                  <div className="mb-4">
                    <h6 className="fw-bold text-dark">Overview</h6>
                    <p className="lead text-muted fs-6 mb-0" style={{ fontFamily: "'Lora', serif" }}>
                      {selectedEventModal.summary}
                    </p>
                  </div>
                )}

                {/* Full Details */}
                {selectedEventModal.details && (
                  <div className="mb-4 pt-3 border-top">
                    <h6 className="fw-bold text-dark mb-2">Event Description & Schedule</h6>
                    <div
                      className="text-secondary small"
                      style={{ whiteSpace: 'pre-line', lineHeight: '1.8' }}
                    >
                      {selectedEventModal.details}
                    </div>
                  </div>
                )}
              </div>

              {/* Modal Footer */}
              <div className="modal-footer border-0 bg-light p-3 px-4 d-flex justify-content-between">
                <button
                  type="button"
                  onClick={() => handleShareWhatsApp(selectedEventModal)}
                  className="btn btn-outline-success btn-sm rounded-pill px-3 d-inline-flex align-items-center gap-2"
                >
                  <i className="bi bi-whatsapp"></i>
                  <span>Share on WhatsApp</span>
                </button>

                <button
                  type="button"
                  className="btn btn-secondary btn-sm rounded-pill px-4"
                  onClick={() => setSelectedEventModal(null)}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EventsPage;
