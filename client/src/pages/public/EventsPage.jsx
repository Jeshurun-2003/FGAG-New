import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { eventsService } from '../../services/api';
import { CardSkeleton } from '../../components/common/SkeletonLoader';
import SEO from '../../components/common/SEO';

const fadeInUp = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] } }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.12 }
  }
};

const EventsPage = () => {
  const [featuredEvent, setFeaturedEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showDetail, setShowDetail] = useState(false);

  useEffect(() => {
    const fetchFeatured = async () => {
      try {
        const res = await eventsService.getFeatured();
        if (res.data.success && res.data.event) {
          setFeaturedEvent(res.data.event);
        }
      } catch (err) {
        console.warn('Could not load featured event', err);
      } finally {
        setLoading(false);
      }
    };

    fetchFeatured();
  }, []);

  const weeklySchedule = [
    {
      day: 'Sunday',
      title: 'Sunday Worship Service',
      time: '9:00 AM – 11:30 AM',
      location: 'Main Sanctuary',
      image: '/images/Sunday_service.png',
      desc: 'Join us for uplifting worship, powerful prayer, and life-changing biblical preaching for the entire family.'
    },
    {
      day: 'Tuesday',
      title: 'Fasting & Healing Prayer',
      time: '10:00 AM – 1:00 PM',
      location: 'Prayer Hall',
      image: '/images/healing_service.png',
      desc: 'A dedicated time of seeking God’s presence, intercession, and praying for healing and breakthroughs.'
    },
    {
      day: 'Wednesday',
      title: 'Night Prayer Gathering',
      time: '8:00 PM – 9:30 PM',
      location: 'Church Sanctuary / Online',
      image: '/images/night_prayer.png',
      desc: 'Uniting in prayer in the stillness of the evening to lift up families, church ministries, and our community.'
    },
    {
      day: 'Thursday',
      title: 'Cottage / House Prayer',
      time: '6:30 PM – 8:00 PM',
      location: 'Believers’ Homes (Rotating)',
      image: '/images/men_fellowship.jpeg',
      desc: 'Intimate fellowship, sharing testimonies, and praying together in local neighbourhood homes.'
    },
    {
      day: 'Friday',
      title: 'Morning Prayer & Devotion',
      time: '6:00 AM – 7:00 AM',
      location: 'Online via Google Meet',
      image: '/images/Morning_prayer.jpg',
      desc: 'Starting the day in communion with God with guided scripture reading and morning intercession.'
    },
    {
      day: 'Saturday',
      title: 'Youth & Worship Service',
      time: '5:30 PM – 7:30 PM',
      location: 'Youth Hall',
      image: '/images/youth_service.jpg',
      desc: 'Vibrant praise, music rehearsals, group discussions, and games for teenagers and young adults.'
    }
  ];

  return (
    <div className="container my-5 pt-3">
      <SEO
        title="Events & Gatherings"
        description="Join us for Sunday worship, weekly prayer meetings, and special church gatherings at Friends Garden AG Church, Kollidam."
      />

      <motion.div
        className="text-center mb-5"
        initial={{ opacity: 0, y: -15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="heading display-5 fw-bold mb-2">Church Events & Gatherings</h1>
        <div className="section-divider">
          <i className="bi bi-diamond-fill section-divider-icon"></i>
        </div>
        <p className="paragraph lead text-muted mx-auto" style={{ maxWidth: '680px' }}>
          Stay updated with our upcoming services, special events, and spiritual gatherings.
        </p>
      </motion.div>

      {/* Featured / Dynamic Event */}
      {loading ? (
        <CardSkeleton count={1} />
      ) : (
        featuredEvent && (
          <motion.div
            className="card event-card mb-5 p-4 border-0 shadow-sm rounded-4 bg-white hover-lift"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeInUp}
          >
            <div className="d-flex flex-wrap justify-content-between align-items-start gap-3">
              <div>
                <span className="badge px-3 py-2 rounded-pill text-uppercase mb-3" style={{ backgroundColor: '#38a1db' }}>
                  <i className="bi bi-star-fill me-1"></i> Featured Event
                </span>
                <h3 className="heading fw-bold mb-2">{featuredEvent.title}</h3>
                {featuredEvent.summary && <p className="paragraph mb-2 fs-5 text-muted">{featuredEvent.summary}</p>}
                <p className="paragraph text-secondary mb-3">
                  {featuredEvent.time && (
                    <span className="me-3 d-inline-block">
                      <strong>🕒 Time:</strong> {featuredEvent.time}
                    </span>
                  )}
                  {featuredEvent.location && (
                    <span className="d-inline-block">
                      <strong>📍 Location:</strong> {featuredEvent.location}
                    </span>
                  )}
                </p>
              </div>
              <motion.button
                className="btn btn-outline-primary"
                onClick={() => setShowDetail(!showDetail)}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.98 }}
              >
                {showDetail ? 'Hide Details' : 'Learn More'}
              </motion.button>
            </div>

            {/* Animated Collapsible Details */}
            <AnimatePresence>
              {showDetail && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                  className="overflow-hidden"
                >
                  <div className="card shadow-sm border-0 rounded-4 bg-light mt-4 p-4">
                    <div className="row align-items-center g-4">
                      {featuredEvent.imageUrl && (
                        <div className="col-lg-5 text-center">
                          <div className="image-zoom-card rounded-4 shadow-sm overflow-hidden w-100" style={{ aspectRatio: '16 / 10', backgroundColor: '#e2e8f0' }}>
                            <img
                              src={featuredEvent.imageUrl}
                              alt={featuredEvent.title}
                              className="w-100 h-100 rounded-4"
                              style={{ objectFit: 'cover' }}
                              loading="lazy"
                              onError={(e) => {
                                e.target.src = '/images/church_inside_2.jpg';
                              }}
                            />
                          </div>
                        </div>
                      )}
                      <div className={featuredEvent.imageUrl ? 'col-lg-7' : 'col-12'}>
                        <h4 className="fw-bold heading mb-3">{featuredEvent.title}</h4>
                        {featuredEvent.time && (
                          <p className="paragraph mb-1">
                            <strong>🕒 Time:</strong> {featuredEvent.time}
                          </p>
                        )}
                        {featuredEvent.location && (
                          <p className="paragraph mb-1">
                            <strong>📍 Location:</strong> {featuredEvent.location}
                          </p>
                        )}
                        {featuredEvent.details && (
                          <div className="paragraph text-muted mt-3" style={{ whiteSpace: 'pre-line' }}>
                            {featuredEvent.details}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        )
      )}

      {/* Weekly Church Schedule */}
      <div className="mb-5">
        <div className="text-center mt-5 mb-4">
          <h2 className="heading fw-bold display-6 mb-2">
            ⛪ Weekly Church Schedule
          </h2>
          <div className="section-divider">
            <i className="bi bi-diamond-fill section-divider-icon"></i>
          </div>
        </div>

        <motion.div
          className="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-40px' }}
          variants={staggerContainer}
        >
          {weeklySchedule.map((item, idx) => (
            <motion.div className="col" key={idx} variants={fadeInUp}>
              <div className="card h-100 rounded-4 shadow-sm border-0 bg-white hover-lift overflow-hidden d-flex flex-column">
                <div className="image-zoom-card" style={{ aspectRatio: '16 / 10', overflow: 'hidden', backgroundColor: '#e2e8f0' }}>
                  <img
                    src={item.image}
                    className="card-img-top w-100 h-100"
                    style={{ objectFit: 'cover' }}
                    alt={item.title}
                    loading="lazy"
                    onError={(e) => {
                      e.target.src = '/images/Sunday_service.png';
                    }}
                  />
                </div>
                <div className="card-body p-4 d-flex flex-column flex-grow-1">
                  <div className="mb-2">
                    <span className="badge px-3 py-1 rounded-pill bg-primary-subtle text-primary fw-bold text-uppercase small">
                      {item.day}
                    </span>
                  </div>
                  <h4 className="heading fw-bold mb-2">{item.title}</h4>
                  <p className="text-secondary small mb-2">
                    <i className="bi bi-clock text-primary me-2"></i> {item.time}
                  </p>
                  <p className="text-secondary small mb-3">
                    <i className="bi bi-geo-alt text-danger me-2"></i> {item.location}
                  </p>
                  <p className="paragraph small text-muted mt-auto mb-0">{item.desc}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </div>
  );
};

export default EventsPage;
