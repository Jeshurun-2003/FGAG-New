import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ministriesService } from '../../services/api';
import SEO from '../../components/common/SEO';

const defaultMinistries = [
  {
    id: 1,
    title: 'Youth Ministry',
    description: 'Our Youth Ministry is a vibrant and passionate community of young believers growing in faith and purpose.',
    details: 'Our Youth Ministry is a vibrant and passionate community of young believers growing in faith and purpose. We equip and empower the next generation to stand strong in Christ and impact the world. Through worship, Bible study, mentoring, and outreach, youth are nurtured spiritually and socially. Join us as we pursue God’s calling with energy, creativity, and unity.',
    imageUrl: '/images/Youth_ministry.jpeg',
    objectPosition: '50% 100%'
  },
  {
    id: 2,
    title: 'Children ministry',
    description: 'Our Children’s Ministry is a joyful space where kids discover God’s love in fun and meaningful ways.',
    details: 'Our Children’s Ministry is a joyful space where kids discover God’s love in fun and meaningful ways. We teach biblical values through songs, stories, crafts, and interactive lessons. Each child is nurtured in a safe, loving environment to grow in faith and character. We believe children are a gift from God and a vital part of His Kingdom.',
    imageUrl: '/images/Children_minstry.jpeg',
    objectPosition: 'center'
  },
  {
    id: 3,
    title: 'Outreach Ministry',
    description: 'Our Outreach Ministry is dedicated to sharing God’s love beyond the church walls.',
    details: 'Our Outreach Ministry is dedicated to sharing God’s love beyond the church walls. We serve communities through acts of compassion, prayer, and practical support. By reaching the unreached and uplifting the needy, we reflect the heart of Christ. Join us in being the hands and feet of Jesus to a world in need.',
    imageUrl: '/images/Outreach_ministry.jpeg',
    objectPosition: '50% 90%'
  },
  {
    id: 4,
    title: 'Men’s Ministry',
    description: 'Our Men’s Ministry empowers men to grow in faith, character, and leadership.',
    details: 'Our Men’s Ministry empowers men to grow in faith, character, and leadership. We gather for fellowship, prayer, and teaching that strengthens spiritual foundations. Through accountability and brotherhood, men are equipped to lead their families and communities. Together, we pursue God’s purpose and become men after His own heart.',
    imageUrl: "/images/Men's_ministry.jpeg",
    objectPosition: 'center'
  },
  {
    id: 5,
    title: "Women's Ministry",
    description: 'Our Women’s Ministry is a nurturing community where women grow in faith, strength, and purpose.',
    details: 'Our Women’s Ministry is a nurturing community where women grow in faith, strength, and purpose. We come together for prayer, fellowship, and encouragement rooted in God’s Word. Through discipleship and support, women are empowered to impact their homes and communities. Join us as we walk in grace, wisdom, and the beauty of God\'s calling for women.',
    imageUrl: "/images/Women's_ministry.jpeg",
    objectPosition: '50% 60%'
  },
  {
    id: 6,
    title: 'Volunteer Ministry',
    description: 'Our Volunteer Ministry is the heartbeat of service within the church and beyond.',
    details: 'Our Volunteer Ministry is the heartbeat of service within the church and beyond. We believe every act of service, big or small, makes a lasting impact for God’s Kingdom. From welcoming guests to organizing events, our volunteers serve with joy and excellence. Join us and discover the blessing of using your time and talents for God’s glory.',
    imageUrl: '/images/Volunteer_ministry.jpeg',
    objectPosition: '50% 20%'
  }
];

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
  const [ministries, setMinistries] = useState(defaultMinistries);
  const [openIds, setOpenIds] = useState({});

  useEffect(() => {
    const fetchMinistries = async () => {
      try {
        const res = await ministriesService.getPublic();
        if (res.data.success && res.data.ministries && res.data.ministries.length > 0) {
          setMinistries(res.data.ministries);
        }
      } catch (err) {
        console.warn('Using default ministries list.', err);
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
        className="position-relative d-flex align-items-center justify-content-center text-center text-white overflow-hidden"
        style={{
          background: "linear-gradient(rgba(7, 42, 68, 0.75), rgba(10, 61, 98, 0.85)), url('/images/Church_img.jpg')",
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          minHeight: '65vh',
          padding: '80px 20px'
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

          <motion.div
            className="row row-cols-1 row-cols-sm-2 row-cols-lg-3 g-4"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-40px' }}
            variants={staggerContainer}
          >
            {ministries.map((m) => {
              const defaultMatch = defaultMinistries.find((dm) => dm.title.toLowerCase() === m.title.toLowerCase());
              const objPos = m.objectPosition || defaultMatch?.objectPosition || 'center';

              return (
                <motion.div className="col" key={m.id} variants={fadeInUp}>
                  <div className="card h-100 rounded-4 shadow-sm border-0 bg-white hover-lift overflow-hidden">
                    <div className="image-zoom-card">
                      <img
                        src={m.imageUrl || '/images/coming_soon.png'}
                        className="card-img-top"
                        style={{
                          height: '250px',
                          objectFit: 'cover',
                          objectPosition: objPos
                        }}
                        alt={m.title}
                        loading="lazy"
                      />
                    </div>
                    <div className="card-body p-4 d-flex flex-column">
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
