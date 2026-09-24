import React, { useState, useEffect } from 'react';
import { Link, useOutletContext } from 'react-router-dom';
import { motion } from 'framer-motion';
import SEO from '../../components/common/SEO';
import { sermonService } from '../../services/api';

const fadeInUp = {
  hidden: { opacity: 0, y: 28 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.55, ease: [0.16, 1, 0.3, 1] } }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15
    }
  }
};

const HomePage = () => {
  const { settings = {} } = useOutletContext() || {};
  const [latestSermons, setLatestSermons] = useState([]);

  useEffect(() => {
    const fetchLatestSermons = async () => {
      try {
        const res = await sermonService.getAll({ limit: 3 });
        if (res.data && res.data.success) {
          setLatestSermons(res.data.sermons || []);
        }
      } catch (e) {
        // Fallback gracefully if database or network is not available
      }
    };
    fetchLatestSermons();
  }, []);

  const heroTitle = settings.hero_title || 'Friends Garden AG Church';
  const heroSubtitle = settings.hero_subtitle || 'A Place to Belong, Believe, and Become.';
  const heroYoutube = settings.hero_youtube_url || 'https://youtube.com/@lifeparktv?feature=shared';
  const heroBg = settings.hero_bg_image || '/images/church_inside_2.jpg';

  const celebrateDesc = settings.welcome_celebrate_desc || 'We worship our Heavenly Father with thankfulness and reverence.';
  const growDesc = settings.welcome_grow_desc || "We grow in love, unity, and knowledge of God's Word together.";
  const upliftDesc = settings.welcome_uplift_desc || 'We learn from each other and live out God’s will with joy.';
  const welcomeFooter = settings.welcome_footer_text || "Whether you're new or seeking deeper connection, you're always welcome here. We're a family growing in faith and sharing Christ’s love with joy.";

  const promiseYear = settings.promise_year || '2025';
  const promiseVerse = settings.promise_verse || '"Because he loves me,” says the Lord, “I will rescue him; I will protect him, for he acknowledges my name."';
  const promiseRef = settings.promise_ref || '— Psalm 91:14';

  const pastorTitle = settings.pastor_welcome_title || 'A Warm Welcome from Our Pastor';
  const pastorMsg = settings.pastor_welcome_message || "Greetings in the precious name of our Lord and Savior Jesus Christ!\n\nAt Friends Garden A.G Church, we believe that every person is valued, loved, and called by God for a purpose. It’s our joy to welcome you into a place where you can grow in faith, connect in fellowship, and experience the transforming power of God’s Word.\n\nWe invite you to join us in worship, serve alongside us, and discover the abundant life found in Christ. May you be blessed, strengthened, and encouraged as you journey with us in faith.";
  const pastorName = settings.pastor_name || 'Amal M. Augustine';
  const pastorRole = settings.pastor_role || 'Senior Pastor, Friends Garden A.G Church';
  const pastorImg = settings.pastor_image || '/images/Pastor_pic.jpg';

  const appTitle = settings.app_title || '📖 Uvamaigal – Bible Short Stories App';
  const appDesc = settings.app_desc || 'Uvamaigal is a meaningful app developed by Pastor Amal M. Augustine, filled with impactful short stories rooted in biblical teachings. These inspiring parables make spiritual lessons easy to grasp.\n\nWhether you’re reading personally or teaching others, Uvamaigal helps bring God’s Word alive in a simple, memorable, and heart-touching way.';
  const appPlaystore = settings.app_playstore_url || 'https://play.google.com/store/apps/details?id=com.gnanadurai.uvamaigal';
  const appImg = settings.app_image || '/images/uvamaigal.jpg';

  return (
    <div>
      <SEO
        title="Home"
        description="Welcome to Friends Garden AG Church, Kollidam. A Place to Belong, Believe, and Become."
      />

      {/* Hero Section */}
      <section
        className="position-relative d-flex align-items-center justify-content-center text-center text-white overflow-hidden"
        style={{
          backgroundImage: `url('${heroBg}')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          minHeight: '88vh',
          padding: '120px 20px 80px'
        }}
      >
        {/* Soft Radial & Linear Gradient Overlay */}
        <div
          className="position-absolute top-0 start-0 w-100 h-100"
          style={{
            background: 'linear-gradient(180deg, rgba(7, 42, 68, 0.82) 0%, rgba(10, 61, 98, 0.88) 60%, rgba(5, 20, 35, 0.94) 100%)',
            zIndex: 1
          }}
        />

        {/* Hero Content with Fade + Slide Up Animation */}
        <div className="container position-relative py-5" style={{ zIndex: 2 }}>
          <div className="row justify-content-center">
            <motion.div
              className="col-12 col-md-11 col-lg-9 col-xl-8"
              initial={{ opacity: 0, y: 35 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            >
              <div className="mb-3">
                <div
                  className="d-inline-flex align-items-center justify-content-center p-2 rounded-4"
                  style={{
                    background: 'rgba(255, 255, 255, 0.08)',
                    backdropFilter: 'blur(10px)',
                    border: '1px solid rgba(255, 255, 255, 0.2)',
                    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)'
                  }}
                >
                  <img
                    src="/images/Church_logo.png"
                    alt="Friends Garden AG Church"
                    style={{ height: '76px', maxWidth: '240px', objectFit: 'contain' }}
                  />
                </div>
              </div>
              <span className="badge px-3 py-2 mb-3 rounded-pill text-uppercase tracking-wide" style={{ backgroundColor: 'rgba(56, 161, 219, 0.25)', border: '1px solid rgba(56, 161, 219, 0.5)', color: '#ffffff', letterSpacing: '0.08em' }}>
                Assemblies of God • Kollidam
              </span>
              <h1
                className="display-3 fw-bold mb-4 text-white"
                style={{
                  fontFamily: "'Playfair Display', serif",
                  textShadow: '0 4px 20px rgba(0, 0, 0, 0.4)'
                }}
              >
                {heroTitle}
              </h1>
              <p
                className="lead fs-3 mb-5 fw-medium text-light opacity-90 mx-auto"
                style={{ maxWidth: '680px', lineHeight: '1.6' }}
              >
                {heroSubtitle}
              </p>
              <div className="d-flex flex-wrap gap-3 justify-content-center">
                <motion.a
                  href={heroYoutube}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-enhanced btn-outline-light d-inline-flex align-items-center gap-2"
                  whileHover={{ scale: 1.04 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <i className="bi bi-youtube text-danger fs-5"></i>
                  Visit YouTube
                </motion.a>
                <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.98 }}>
                  <Link
                    to="/contact"
                    className="btn btn-enhanced btn-primary d-inline-flex align-items-center gap-2"
                  >
                    <i className="bi bi-envelope fs-5"></i>
                    Contact Us
                  </Link>
                </motion.div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Welcome Section */}
      <section className="py-5 bg-light">
        <div className="container py-4">
          <motion.div
            className="text-center mb-5"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-40px' }}
            variants={fadeInUp}
          >
            <h2 className="heading_1 display-5 fw-bold mb-2">
              Welcome to Friends Garden A.G Church
            </h2>
            <div className="section-divider">
              <i className="bi bi-diamond-fill section-divider-icon"></i>
            </div>
            <p className="lead fst-italic paragraph mb-0 fs-4">
              A Place to Belong, Believe, and Become.
            </p>
          </motion.div>

          <motion.div
            className="row justify-content-center g-4"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-40px' }}
            variants={staggerContainer}
          >
            <motion.div className="col-md-4" variants={fadeInUp}>
              <div className="card border-0 shadow-sm h-100 rounded-4 hover-lift p-4 bg-white text-center">
                <div className="card-body p-0">
                  <div className="d-inline-flex p-3 rounded-circle mb-3" style={{ backgroundColor: 'rgba(220, 53, 69, 0.1)' }}>
                    <i className="bi bi-heart-fill fs-2 text-danger"></i>
                  </div>
                  <h4 className="heading fw-bold mb-3">Celebrate with Gratitude</h4>
                  <p className="paragraph mb-0 text-muted">{celebrateDesc}</p>
                </div>
              </div>
            </motion.div>

            <motion.div className="col-md-4" variants={fadeInUp}>
              <div className="card border-0 shadow-sm h-100 rounded-4 hover-lift p-4 bg-white text-center">
                <div className="card-body p-0">
                  <div className="d-inline-flex p-3 rounded-circle mb-3" style={{ backgroundColor: 'rgba(25, 135, 84, 0.1)' }}>
                    <i className="bi bi-people-fill fs-2 text-success"></i>
                  </div>
                  <h4 className="heading fw-bold mb-3">Grow in His Kingdom</h4>
                  <p className="paragraph mb-0 text-muted">{growDesc}</p>
                </div>
              </div>
            </motion.div>

            <motion.div className="col-md-4" variants={fadeInUp}>
              <div className="card border-0 shadow-sm h-100 rounded-4 hover-lift p-4 bg-white text-center">
                <div className="card-body p-0">
                  <div className="d-inline-flex p-3 rounded-circle mb-3" style={{ backgroundColor: 'rgba(56, 161, 219, 0.12)' }}>
                    <i className="bi bi-chat-dots-fill fs-2 text-primary"></i>
                  </div>
                  <h4 className="heading fw-bold mb-3">Encourage & Uplift</h4>
                  <p className="paragraph mb-0 text-muted">{upliftDesc}</p>
                </div>
              </div>
            </motion.div>
          </motion.div>

          <motion.p
            className="text-center fs-5 text-muted mt-5 mx-auto"
            style={{ maxWidth: '820px', lineHeight: '1.9' }}
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            {welcomeFooter}
          </motion.p>
        </div>
      </section>

      {/* Church Promise Section */}
      <section className="py-5 promise-section text-white text-center">
        <div className="container py-5 position-relative" style={{ zIndex: 2 }}>
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.55 }}
          >
            <span className="badge px-3 py-2 mb-3 rounded-pill text-uppercase" style={{ backgroundColor: 'rgba(255, 255, 255, 0.15)', letterSpacing: '0.05em' }}>
              Scripture for the Year
            </span>
            <h2 className="fw-bold mb-4 text-white display-6">Our Church Promise {promiseYear}</h2>
            <h3
              className="fw-bold mx-auto mb-4 text-white lh-base"
              style={{
                maxWidth: '920px',
                fontStyle: 'italic',
                fontFamily: "'Playfair Display', serif",
                fontSize: 'clamp(1.35rem, 2.8vw, 1.85rem)'
              }}
            >
              {promiseVerse}
            </h3>
            <p className="text-info fw-semibold fs-5 mb-0" style={{ letterSpacing: '0.05em' }}>
              {promiseRef}
            </p>
          </motion.div>
        </div>
      </section>

      {/* Pastor's Welcome Message */}
      <section className="py-5 px-2 bg-light">
        <div className="container py-4">
          <motion.div
            className="card border-0 shadow-sm rounded-4 overflow-hidden bg-white hover-lift"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-40px' }}
            variants={fadeInUp}
          >
            <div className="row g-0 align-items-center section-bg">
              {/* Pastor Image */}
              <div className="col-md-5 d-flex justify-content-center align-items-center p-4 p-md-5">
                <div className="position-relative">
                  <img
                    src={pastorImg}
                    alt={pastorName}
                    className="img-fluid rounded-4 shadow"
                    style={{
                      maxHeight: '440px',
                      width: 'auto',
                      maxWidth: '100%',
                      objectFit: 'contain'
                    }}
                  />
                </div>
              </div>

              {/* Message Content */}
              <div className="col-md-7 p-4 p-md-5 bg-white">
                <h2 className="fw-bold heading text-start mb-3">{pastorTitle}</h2>
                <div className="paragraph mb-4 text-muted" style={{ whiteSpace: 'pre-line' }}>
                  {pastorMsg}
                </div>
                <div className="pt-3 border-top border-light-subtle">
                  <h5 className="fw-bold text-dark mb-1">– {pastorName}</h5>
                  <p className="text-secondary small mb-0">{pastorRole}</p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Latest Sermons Section (Hidden if 0 sermons) */}
      {latestSermons.length > 0 && (
        <section className="section-padding section-ice">
          <div className="container">
            <div className="text-center mb-5">
              <span className="section-eyebrow">Biblical Truth</span>
              <h2 className="heading_1 mb-2">Latest Sermons & Messages</h2>
              <div className="section-divider">
                <i className="bi bi-cross section-divider-icon"></i>
              </div>
              <p className="text-muted mx-auto" style={{ maxWidth: '600px' }}>
                Listen to life-transforming messages from God's Word preached at Friends Garden AG Church.
              </p>
            </div>

            <div className="row g-4 justify-content-center">
              {latestSermons.map((sermon) => (
                <div key={sermon.id} className="col-12 col-md-6 col-lg-4">
                  <div className="card sermon-card h-100 shadow-sm">
                    <Link to={`/sermons/${sermon.id}`} className="text-decoration-none">
                      <div className="sermon-thumbnail-wrap">
                        <img
                          src={sermon.thumbnailUrl || '/images/church_inside_2.jpg'}
                          alt={sermon.title}
                          loading="lazy"
                        />
                        <div className="play-button-overlay">
                          <div className="play-icon-circle">
                            <i className="bi bi-play-fill ms-1"></i>
                          </div>
                        </div>
                      </div>
                    </Link>
                    <div className="card-body p-4 d-flex flex-column">
                      <div className="d-flex align-items-center justify-content-between mb-2">
                        <span className="sermon-category-pill">{sermon.category}</span>
                        <span className="text-muted small">
                          <i className="bi bi-calendar3 me-1"></i>
                          {new Date(sermon.date).toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric',
                            year: 'numeric'
                          })}
                        </span>
                      </div>
                      <h5 className="card-title fw-bold mb-2" style={{ fontFamily: "'Playfair Display', serif" }}>
                        <Link to={`/sermons/${sermon.id}`} className="text-decoration-none text-dark hover-blue">
                          {sermon.title}
                        </Link>
                      </h5>
                      {sermon.speaker && (
                        <p className="text-muted small mb-2">
                          <i className="bi bi-mic me-1 text-primary"></i>{sermon.speaker}
                        </p>
                      )}
                      {sermon.description && (
                        <p
                          className="text-muted small mb-3 flex-grow-1"
                          style={{
                            display: '-webkit-box',
                            WebkitLineClamp: 2,
                            WebkitBoxOrient: 'vertical',
                            overflow: 'hidden'
                          }}
                        >
                          {sermon.description}
                        </p>
                      )}
                      <div className="mt-auto pt-3 border-top border-light-subtle d-flex justify-content-between align-items-center">
                        <Link to={`/sermons/${sermon.id}`} className="btn btn-outline-primary btn-sm rounded-pill">
                          Watch Message &rarr;
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="text-center mt-5">
              <Link to="/sermons" className="btn btn-primary rounded-pill px-4 py-2 shadow-sm">
                View All Sermons <i className="bi bi-arrow-right ms-1"></i>
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* Uvamaigal App Section */}
      <section className="py-5 bg-white">
        <div className="container py-4">
          <motion.div
            className="card border-0 shadow-sm rounded-4 p-4 p-md-5 section-bg"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-40px' }}
            variants={fadeInUp}
          >
            <div className="row align-items-center gy-4">
              <div className="col-md-5 text-center p-3">
                <div className="image-zoom-card shadow-sm d-inline-block rounded-4">
                  <img
                    src={appImg}
                    alt="Uvamaigal Bible Stories App"
                    className="img-fluid rounded-4"
                    style={{ maxHeight: '380px', width: 'auto', maxWidth: '100%', objectFit: 'contain' }}
                  />
                </div>
              </div>

              <div className="col-md-7 text-center text-md-start">
                <h2 className="fw-bold heading mb-3">{appTitle}</h2>
                <div className="paragraph text-muted fs-5 mb-4" style={{ whiteSpace: 'pre-line' }}>
                  {appDesc}
                </div>
                <motion.a
                  href={appPlaystore}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-success rounded-pill px-4 py-3 shadow d-inline-flex align-items-center gap-2 fw-semibold"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <i className="bi bi-google-play fs-5"></i>
                  Download Uvamaigal
                </motion.a>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
