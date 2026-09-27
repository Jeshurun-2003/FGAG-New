import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ministriesService } from '../../services/api';
import SEO from '../../components/common/SEO';
import { getMinistryImageUrl } from '../../utils/imageUtils';
import { CardSkeleton } from '../../components/common/SkeletonLoader';

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

const MinistriesPage = () => {
  const [ministries, setMinistries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openIds, setOpenIds] = useState({});

  useEffect(() => {
    const fetchMinistries = async () => {
      try {
        setLoading(true);
        const res = await ministriesService.getPublic();
        if (res.data && res.data.success && Array.isArray(res.data.ministries)) {
          setMinistries(res.data.ministries);
        } else {
          setMinistries([]);
        }
      } catch (err) {
        console.error('Failed to load ministries:', err);
        setMinistries([]);
      } finally {
        setLoading(false);
      }
    };
    fetchMinistries();
  }, []);

  const toggleCollapse = (id) => {
    setOpenIds((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <div>
      <SEO
        title="Ministries"
        description="Explore the ministries of Friends Garden AG Church: Youth, Children, Outreach, Men's, Women's, and Volunteer ministries."
      />

      {/* Hero Banner */}
      <section
        className="hero-merged position-relative d-flex align-items-center justify-content-center text-center text-white overflow-hidden"
        style={{
          background: "linear-gradient(rgba(7, 42, 68, 0.75), rgba(10, 61, 98, 0.85)), url('/images/Church_img.jpg')",
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          minHeight: '65vh',
          padding: 'calc(var(--navbar-height) + 50px) 20px 80px'
        }}
      >
        <motion.div
          className="container position-relative"
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55 }}
        >
          <span className="badge px-3 py-2 mb-3 rounded-pill text-uppercase" style={{ backgroundColor: 'rgba(56, 161, 219, 0.25)', border: '1px solid rgba(56, 161, 219, 0.4)' }}>
            Serving Christ & Community
          </span>
          <h1 className="display-4 fw-bold text-white mb-3" style={{ fontFamily: "'Playfair Display', serif" }}>
            Serve With Purpose
          </h1>
          <p className="lead fs-4 text-light opacity-90 mb-4 mx-auto" style={{ maxWidth: '650px' }}>
            Explore ministries that make a difference
          </p>
          <motion.a
            href="#ministries"
            className="btn btn-primary btn-lg px-4 py-2 rounded-pill shadow"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.98 }}
          >
            Explore Ministries
          </motion.a>
        </motion.div>
      </section>

      {/* Ministries Grid Section */}
      <section className="py-5" id="ministries">
        <div className="container py-4">
          <motion.div
            className="text-center mb-5"
            initial={{ opacity: 0, y: -15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="heading display-5 fw-bold mb-2">Our Ministries</h2>
            <div className="section-divider">
              <i className="bi bi-diamond-fill section-divider-icon"></i>
            </div>
          </motion.div>

          {loading ? (
            <div className="py-4">
              <CardSkeleton count={3} />
            </div>
          ) : ministries.length === 0 ? (
            <div className="card border-0 shadow-sm rounded-4 p-5 text-center bg-white my-4">
              <div
                className="rounded-circle bg-light d-inline-flex align-items-center justify-content-center mx-auto mb-3"
                style={{ width: '64px', height: '64px' }}
              >
                <i className="bi bi-people fs-2 text-muted"></i>
              </div>
              <h4 className="heading fw-bold mb-2">No Ministries Found</h4>
              <p className="text-muted mx-auto mb-0" style={{ maxWidth: '480px' }}>
                We are currently updating our ministry listings. Please check back soon or contact us to learn more!
              </p>
            </div>
          ) : (
            <motion.div
              className="row row-cols-1 row-cols-sm-2 row-cols-lg-3 g-4"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: '-40px' }}
              variants={staggerContainer}
            >
              {ministries.map((m) => {
                const objPos = m.objectPosition || 'center';

                return (
                  <motion.div className="col" key={m.id} variants={fadeInUp}>
                    <div className="card h-100 rounded-4 shadow-sm border-0 bg-white hover-lift overflow-hidden d-flex flex-column">
                      <div className="image-zoom-card" style={{ aspectRatio: '16 / 10', overflow: 'hidden', backgroundColor: '#e2e8f0' }}>
                        <img
                          src={getMinistryImageUrl(m.imageUrl, m.updatedAt) || '/images/coming_soon.png'}
                          className="card-img-top w-100 h-100"
                          style={{
                            objectFit: 'cover',
                            objectPosition: objPos
                          }}
                          alt={m.title}
                          loading="lazy"
                          onError={(e) => {
                            e.target.src = '/images/coming_soon.png';
                          }}
                        />
                      </div>
                      <div className="card-body p-4 d-flex flex-column flex-grow-1">
                        <h4 className="heading fw-bold mb-2">{m.title}</h4>
                        <p className="paragraph text-muted small mb-3">
                          {m.description}
                        </p>

                        <div className="mt-auto">
                          <motion.button
                            className="btn btn-sm btn-outline-primary"
                            type="button"
                            onClick={() => toggleCollapse(m.id)}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                          >
                            {openIds[m.id] ? 'Hide Info' : 'More Info'}
                          </motion.button>

                          <AnimatePresence>
                            {openIds[m.id] && (
                              <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                exit={{ opacity: 0, height: 0 }}
                                transition={{ duration: 0.3, ease: 'easeInOut' }}
                                className="overflow-hidden"
                              >
                                <div className="card card-body p-3 small bg-light border-0 rounded-3 mt-3 text-secondary lh-base">
                                  {m.details || m.description}
                                </div>
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </motion.div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta section-bg text-center py-5">
        <div className="container py-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="heading fw-bold display-6 mb-3">Ready to Serve?</h2>
            <div className="section-divider">
              <i className="bi bi-diamond-fill section-divider-icon"></i>
            </div>
            <p className="paragraph fs-5 text-muted mb-4 mx-auto" style={{ maxWidth: '650px' }}>
              Use your gifts for His glory. Get involved in one of our ministries today!
            </p>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.98 }} className="d-inline-block">
              <Link to="/get-involved" className="btn btn-primary btn-lg px-4 py-3 rounded-pill shadow">
                Get into ministry
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default MinistriesPage;
