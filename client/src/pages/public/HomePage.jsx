import React, { useState, useEffect } from 'react';
import { Link, useOutletContext } from 'react-router-dom';
import { motion, useReducedMotion } from 'framer-motion';
import SEO from '../../components/common/SEO';
import { sermonService, verseService, eventsService } from '../../services/api';
import Logo from '../../components/common/Logo';
import WeeklySchedule from '../../components/common/WeeklySchedule';

const PASTOR_SONG_URL = 'https://www.youtube.com/watch?v=RuFPYAPTdbQ';

const MONTH_NAMES = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

const fadeInUp = {
  hidden: { opacity: 0, y: 28 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.55, ease: [0.16, 1, 0.3, 1] } }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.12
    }
  }
};

const exploreLinks = [
  {
    to: '/about',
    icon: 'bi-bank2',
    iconBg: 'rgba(10, 61, 98, 0.1)',
    iconColor: '#0A3D62',
    title: 'About Our Church',
    desc: 'Our journey of faith, pastoral leadership, and Christ-centered mission in Kollidam.'
  },
  {
    to: '/events',
    icon: 'bi-calendar3-event',
    iconBg: 'rgba(56, 161, 219, 0.12)',
    iconColor: '#38A1DB',
    title: 'Events & Gatherings',
    desc: 'Upcoming special meetings, spiritual conventions, and church gatherings.'
  },
  {
    to: '/ministries',
    icon: 'bi-people-fill',
    iconBg: 'rgba(25, 135, 84, 0.1)',
    iconColor: '#198754',
    title: 'Our Ministries',
    desc: 'Vibrant fellowships serving kids, youth, women, men, and outreach missions.'
  },
  {
    to: '/gallery',
    icon: 'bi-images',
    iconBg: 'rgba(243, 156, 18, 0.12)',
    iconColor: '#F39C12',
    title: 'Photo Gallery',
    desc: 'Moments of joyful celebration, youth camps, and spiritual fellowship.'
  },
  {
    to: '/sermons',
    icon: 'bi-play-circle-fill',
    iconBg: 'rgba(220, 53, 69, 0.1)',
    iconColor: '#DC3545',
    title: 'Sermons & Media',
    desc: 'Watch and listen to inspiring Sunday sermons and uplifting biblical teachings.'
  },
  {
    to: '/prayer-request',
    icon: 'bi-chat-heart-fill',
    iconBg: 'rgba(235, 47, 150, 0.12)',
    iconColor: '#eb2f96',
    title: 'Prayer Request',
    desc: 'Share your prayer needs with our pastoral intercession team for faithful prayer.'
  },
  {
    to: '/get-involved',
    icon: 'bi-heart-fill',
    iconBg: 'rgba(111, 66, 193, 0.1)',
    iconColor: '#6f42c1',
    title: 'Get Involved',
    desc: 'Submit your volunteer interests to serve joyfully in various church ministries.'
  },
  {
    to: '/donate',
    icon: 'bi-gift-fill',
    iconBg: 'rgba(13, 110, 253, 0.1)',
    iconColor: '#0d6efd',
    title: 'Give & Support',
    desc: 'Partner with our mission through faithful online tithes and church offerings.'
  },
  {
    to: '/contact',
    icon: 'bi-geo-alt-fill',
    iconBg: 'rgba(32, 201, 151, 0.12)',
    iconColor: '#20c997',
    title: 'Contact & Visit',
    desc: 'Find directions to our church, meeting hours, and pastoral helpline details.'
  }
];

const HomePage = () => {
  const { settings = {} } = useOutletContext() || {};
  const [latestSermons, setLatestSermons] = useState([]);
  const [monthlyVerse, setMonthlyVerse] = useState(null);
  const [featuredEvent, setFeaturedEvent] = useState(null);
  const [loadingFeatured, setLoadingFeatured] = useState(true);
  const shouldReduceMotion = useReducedMotion();

  useEffect(() => {
    const fetchFeaturedEvent = async () => {
      try {
        setLoadingFeatured(true);
        const res = await eventsService.getFeatured();
        if (res.data && res.data.success && res.data.event && res.data.event.isFeatured) {
          setFeaturedEvent(res.data.event);
        } else {
          setFeaturedEvent(null);
        }
      } catch (e) {
        setFeaturedEvent(null);
      } finally {
        setLoadingFeatured(false);
      }
    };

    fetchFeaturedEvent();

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

    const fetchMonthlyVerse = async () => {
      try {
        const res = await verseService.getCurrentMonthly();
        if (res.data && res.data.success && res.data.verse) {
          setMonthlyVerse(res.data.verse);
        }
      } catch (e) {
        // Fallback gracefully
      }
    };

    fetchLatestSermons();
    fetchMonthlyVerse();
  }, []);

  const heroTitle = settings.hero_title || 'Friends Garden AG Church';
  const heroSubtitle = settings.hero_subtitle || 'A Place to Belong, Believe, and Become.';
  const heroYoutube = settings.hero_youtube_url || 'https://youtube.com/@lifeparktv?feature=shared';
  const heroBg = settings.hero_bg_image || '/images/church_inside_2.jpg';

  const celebrateDesc = settings.welcome_celebrate_desc || 'We worship our Heavenly Father with thankfulness and reverence.';
  const growDesc = settings.welcome_grow_desc || "We grow in love, unity, and knowledge of God's Word together.";
  const upliftDesc = settings.welcome_uplift_desc || 'We learn from each other and live out God’s will with joy.';
  const welcomeFooter = settings.welcome_footer_text || "Whether you're new or seeking deeper connection, you're always welcome here. We're a family growing in faith and sharing Christ’s love with joy.";

  const promiseYear = settings.promise_year !== undefined ? settings.promise_year : '2025';
  const promiseVerse = settings.promise_verse !== undefined ? settings.promise_verse : '"Because he loves me,” says the Lord, “I will rescue him; I will protect him, for he acknowledges my name."';
  const promiseRef = settings.promise_ref !== undefined ? settings.promise_ref : '— Psalm 91:14';

  const hasYearly = Boolean(promiseVerse && promiseVerse.trim());
  const hasMonthly = Boolean(monthlyVerse && monthlyVerse.verseText && monthlyVerse.verseText.trim());
  const monthlyMonthName = monthlyVerse
    ? (MONTH_NAMES[monthlyVerse.month - 1] || `Month ${monthlyVerse.month}`)
    : '';

  const pastorTitle = settings.pastor_welcome_title || 'A Warm Welcome from Our Pastor';
  const pastorMsg = settings.pastor_welcome_message || "Greetings in the precious name of our Lord and Savior Jesus Christ!\n\nAt Friends Garden A.G Church, we believe that every person is valued, loved, and called by God for a purpose. It’s our joy to welcome you into a place where you can grow in faith, connect in fellowship, and experience the transforming power of God’s Word.\n\nWe invite you to join us in worship, serve alongside us, and discover the abundant life found in Christ. May you be blessed, strengthened, and encouraged as you journey with us in faith.";
  const pastorName = settings.pastor_name || 'Amal M. Augustine';
  const pastorRole = settings.pastor_role || 'Senior Pastor, Friends Garden A.G Church';
  const pastorImg = settings.pastor_image || '/images/Pastor_pic.jpg';

  const appTitle = settings.app_title || '📖 Uvamaigal – Bible Short Stories App';
  const appDesc = settings.app_desc || 'Uvamaigal is a meaningful app developed by Pastor Amal M. Augustine, filled with impactful short stories rooted in biblical teachings. These inspiring parables make spiritual lessons easy to grasp.\n\nWhether you’re reading personally or teaching others, Uvamaigal helps bring God’s Word alive in a simple, memorable, and heart-touching way.';
  const appPlaystore = settings.app_playstore_url || 'https://play.google.com/store/apps/details?id=com.gnanadurai.uvamaigal';
  const appImg = settings.app_image || '/images/uvamaigal.jpg';

  const pastorSongUrl = PASTOR_SONG_URL;

  const handleShareWhatsApp = (event) => {
    if (!event) return;
    const shareUrl = window.location.origin + '/events';
    const text = encodeURIComponent(
      `⛪ *${event.title}*\n📍 ${event.location || 'Friends Garden AG Church, Kollidam'}\n🕒 ${event.time || ''}\n\nJoin us! More info: ${shareUrl}`
    );
    window.open(`https://api.whatsapp.com/send?text=${text}`, '_blank');
  };

  const formatEventDate = (dateStr) => {
    if (!dateStr) return null;
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return dateStr;
    return d.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  return (
    <div>
      <SEO
        title="Home"
        description="Welcome to Friends Garden AG Church, Kollidam. A Place to Belong, Believe, and Become."
      />

      {/* Redesigned Modern Hero Section */}
      <section
        className="position-relative d-flex align-items-center justify-content-center text-center text-white overflow-hidden"
        style={{
          minHeight: '88vh',
          padding: 'clamp(36px, 5vw, 64px) 20px 70px'
        }}
        aria-label="Welcome banner"
      >
        {/* Background Image Container with Subtle Ken Burns Scale */}
        <motion.div
          className="position-absolute top-0 start-0 w-100 h-100"
          initial={shouldReduceMotion ? { scale: 1 } : { scale: 1 }}
          animate={shouldReduceMotion ? { scale: 1 } : { scale: 1.04 }}
          transition={{
            duration: 20,
            repeat: Infinity,
            repeatType: 'reverse',
            ease: 'easeInOut'
          }}
          style={{
            backgroundImage: `url('${heroBg}')`,
            backgroundSize: 'cover',
            backgroundPosition: 'center 40%',
            zIndex: 0
          }}
        />

        {/* Soft, Natural Ambient Overlay (25-35% feel, preserving sanctuary photo clarity) */}
        <div
          className="position-absolute top-0 start-0 w-100 h-100"
          style={{
            background: 'linear-gradient(180deg, rgba(7, 30, 48, 0.38) 0%, rgba(10, 61, 98, 0.18) 45%, rgba(7, 30, 48, 0.40) 100%)',
            zIndex: 1,
            pointerEvents: 'none'
          }}
        />

        {/* Hero Content on Soft Frosted-Glass Panel for WCAG AA Contrast */}
        <div className="container position-relative py-4" style={{ zIndex: 2 }}>
          <div className="row justify-content-center">
            <motion.div
              className="col-12 col-md-11 col-lg-10 col-xl-9"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1] }}
            >
              <div
                className="mx-auto rounded-4 p-4 p-md-5"
                style={{
                  background: 'rgba(7, 32, 52, 0.62)',
                  backdropFilter: 'blur(12px)',
                  WebkitBackdropFilter: 'blur(12px)',
                  border: '1px solid rgba(255, 255, 255, 0.18)',
                  boxShadow: '0 20px 50px rgba(0, 0, 0, 0.35)',
                  maxWidth: '920px'
                }}
              >
                {/* Emblem Logo */}
                <motion.div
                  className="mb-3 d-inline-block"
                  initial={{ opacity: 0, scale: 0.85 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.6, delay: 0.1 }}
                >
                  <div
                    className="d-inline-flex align-items-center justify-content-center p-2 rounded-circle shadow-lg"
                    style={{
                      background: 'rgba(255, 255, 255, 0.08)',
                      backdropFilter: 'blur(12px)',
                      border: '1.5px solid rgba(56, 161, 219, 0.35)'
                    }}
                  >
                    <Logo variant="light" size={72} alt="Friends Garden AG Church Emblem" />
                  </div>
                </motion.div>

                {/* Eyebrow Pill */}
                <div>
                  <span
                    className="badge px-3 py-2 mb-3 rounded-pill text-uppercase fw-semibold"
                    style={{
                      backgroundColor: 'rgba(56, 161, 219, 0.2)',
                      border: '1px solid rgba(56, 161, 219, 0.45)',
                      color: '#e9f1f7',
                      letterSpacing: '0.1em',
                      fontSize: '0.82rem'
                    }}
                  >
                    Assemblies of God • Kollidam
                  </span>
                </div>

                {/* Main Headline */}
                <h1
                  className="display-3 fw-bold mb-4 text-white"
                  style={{
                    fontFamily: "'Playfair Display', serif",
                    lineHeight: '1.2',
                    textShadow: '0 4px 20px rgba(0, 0, 0, 0.6)'
                  }}
                >
                  {heroTitle}
                </h1>

                {/* Subtitle */}
                <p
                  className="lead fs-3 mb-5 fw-medium text-light opacity-95 mx-auto"
                  style={{
                    maxWidth: '720px',
                    lineHeight: '1.65',
                    fontFamily: "'Lora', serif",
                    textShadow: '0 2px 10px rgba(0, 0, 0, 0.5)'
                  }}
                >
                  {heroSubtitle}
                </p>

                {/* Call to Action Buttons */}
                <div className="d-flex flex-wrap gap-3 justify-content-center align-items-center">
                  <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.98 }}>
                    <Link
                      to="/contact"
                      className="btn btn-primary btn-enhanced d-inline-flex align-items-center gap-2"
                    >
                      <i className="bi bi-envelope-fill fs-5"></i>
                      <span>Contact Us</span>
                    </Link>
                  </motion.div>

                  <motion.a
                    href={heroYoutube}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn-outline-light btn-enhanced d-inline-flex align-items-center gap-2"
                    style={{
                      backgroundColor: 'rgba(255, 255, 255, 0.08)',
                      borderColor: 'rgba(255, 255, 255, 0.45)'
                    }}
                    whileHover={{ scale: 1.04 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <i className="bi bi-youtube text-danger fs-5"></i>
                    <span>Visit YouTube</span>
                  </motion.a>
                </div>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Scroll-down Floating Indicator */}
        <motion.div
          className="position-absolute bottom-0 start-50 translate-middle-x mb-3 text-center"
          animate={shouldReduceMotion ? { y: 0 } : { y: [0, 8, 0] }}
          transition={{ repeat: Infinity, duration: 2, ease: 'easeInOut' }}
          style={{ zIndex: 3, cursor: 'pointer' }}
          onClick={() => {
            window.scrollTo({
              top: window.innerHeight * 0.88,
              behavior: 'smooth'
            });
          }}
          aria-label="Scroll down"
        >
          <span
            className="small text-uppercase d-block mb-1 text-light opacity-75"
            style={{ fontSize: '0.68rem', letterSpacing: '0.16em', textShadow: '0 1px 4px rgba(0,0,0,0.8)' }}
          >
            Scroll Down
          </span>
          <i className="bi bi-chevron-down fs-5 text-info" style={{ filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.8))' }}></i>
        </motion.div>
      </section>

      {/* Featured Event Spotlight Section (TASK 1) */}
      {loadingFeatured ? (
        <section className="py-4" style={{ backgroundColor: '#07253D' }} aria-label="Loading featured event">
          <div className="container py-2">
            <div className="card border-0 rounded-4 overflow-hidden p-4 shadow-lg" style={{ background: '#0A3D62' }}>
              <div className="row g-4 align-items-center">
                <div className="col-12 col-lg-5">
                  <div className="skeleton-box rounded-4" style={{ height: '260px', backgroundColor: 'rgba(56, 161, 219, 0.15)' }} />
                </div>
                <div className="col-12 col-lg-7">
                  <div className="skeleton-box rounded-pill w-25 mb-3" style={{ height: '24px', backgroundColor: 'rgba(56, 161, 219, 0.25)' }} />
                  <div className="skeleton-box rounded-3 w-75 mb-3" style={{ height: '36px', backgroundColor: 'rgba(255, 255, 255, 0.2)' }} />
                  <div className="skeleton-box rounded-2 w-100 mb-2" style={{ height: '16px', backgroundColor: 'rgba(255, 255, 255, 0.15)' }} />
                  <div className="skeleton-box rounded-2 w-50 mb-4" style={{ height: '16px', backgroundColor: 'rgba(255, 255, 255, 0.15)' }} />
                  <div className="skeleton-box rounded-pill w-25" style={{ height: '40px', backgroundColor: 'rgba(56, 161, 219, 0.3)' }} />
                </div>
              </div>
            </div>
          </div>
        </section>
      ) : featuredEvent && featuredEvent.isFeatured ? (
        <section className="py-5" style={{ background: 'linear-gradient(180deg, #07253D 0%, #0A3D62 100%)' }} aria-label="Featured church event">
          <div className="container">
            <motion.div
              className="card border-0 shadow-lg rounded-4 overflow-hidden hover-lift"
              style={{
                background: 'linear-gradient(135deg, #0A3D62 0%, #062238 100%)',
                border: '1.5px solid rgba(56, 161, 219, 0.35)',
                color: '#FFFFFF'
              }}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: '-40px' }}
              variants={fadeInUp}
            >
              <div className="row g-0 align-items-stretch">
                {/* Event Poster Column */}
                <div className="col-12 col-lg-5 position-relative overflow-hidden" style={{ minHeight: '320px', backgroundColor: '#07253D' }}>
                  <img
                    src={featuredEvent.imageUrl || '/images/Sunday_service.png'}
                    alt={featuredEvent.title}
                    className="w-100 h-100 position-absolute top-0 start-0"
                    style={{ objectFit: 'cover', objectPosition: 'center' }}
                    loading="lazy"
                    onError={(e) => {
                      e.currentTarget.src = '/images/Sunday_service.png';
                    }}
                  />
                  <div
                    className="position-absolute top-0 start-0 w-100 h-100"
                    style={{ background: 'linear-gradient(to right, rgba(10, 61, 98, 0.3) 0%, rgba(6, 34, 56, 0.72) 100%)' }}
                  />
                  <div className="position-absolute top-0 start-0 m-3 m-md-4">
                    <span
                      className="badge px-3 py-2 rounded-pill text-uppercase fw-bold shadow-sm d-inline-flex align-items-center gap-1"
                      style={{ backgroundColor: '#F39C12', color: '#FFFFFF', letterSpacing: '0.06em', fontSize: '0.78rem' }}
                    >
                      <i className="bi bi-star-fill text-white"></i> Spotlight Event
                    </span>
                  </div>
                </div>

                {/* Event Details Content Column */}
                <div className="col-12 col-lg-7 p-4 p-md-5 d-flex flex-column justify-content-between">
                  <div>
                    {featuredEvent.date && (
                      <div className="mb-3">
                        <span
                          className="badge px-3 py-2 rounded-pill d-inline-flex align-items-center gap-2 fw-semibold"
                          style={{
                            backgroundColor: 'rgba(56, 161, 219, 0.18)',
                            color: '#38A1DB',
                            border: '1px solid rgba(56, 161, 219, 0.45)',
                            fontSize: '0.88rem'
                          }}
                        >
                          <i className="bi bi-calendar3"></i>
                          <span>{formatEventDate(featuredEvent.date)}</span>
                        </span>
                      </div>
                    )}

                    <h2
                      className="fw-bold mb-3 text-white"
                      style={{
                        fontFamily: "'Playfair Display', serif",
                        fontSize: 'clamp(1.5rem, 2.6vw, 2.25rem)',
                        lineHeight: '1.25'
                      }}
                    >
                      {featuredEvent.title}
                    </h2>

                    {featuredEvent.summary && (
                      <p
                        className="text-light opacity-90 mb-4"
                        style={{ fontSize: '1.05rem', lineHeight: '1.75', fontFamily: "'Lora', serif" }}
                      >
                        {featuredEvent.summary}
                      </p>
                    )}

                    <div className="row g-2 mb-4">
                      {featuredEvent.time && (
                        <div className="col-12 col-sm-6">
                          <div className="p-2 px-3 rounded-3 d-flex align-items-center gap-2" style={{ backgroundColor: 'rgba(255, 255, 255, 0.08)' }}>
                            <i className="bi bi-clock-fill text-info fs-5"></i>
                            <div>
                              <div className="text-light opacity-75 small text-uppercase" style={{ fontSize: '0.68rem', letterSpacing: '0.05em' }}>Time</div>
                              <div className="fw-semibold text-white small">{featuredEvent.time}</div>
                            </div>
                          </div>
                        </div>
                      )}

                      {featuredEvent.location && (
                        <div className="col-12 col-sm-6">
                          <div className="p-2 px-3 rounded-3 d-flex align-items-center gap-2" style={{ backgroundColor: 'rgba(255, 255, 255, 0.08)' }}>
                            <i className="bi bi-geo-alt-fill text-danger fs-5"></i>
                            <div>
                              <div className="text-light opacity-75 small text-uppercase" style={{ fontSize: '0.68rem', letterSpacing: '0.05em' }}>Location</div>
                              <div className="fw-semibold text-white small text-truncate">{featuredEvent.location}</div>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="d-flex flex-wrap align-items-center gap-3 pt-3 border-top border-white border-opacity-15">
                    <Link
                      to="/events"
                      className="btn rounded-pill px-4 py-2 fw-semibold d-inline-flex align-items-center gap-2 shadow-sm text-white"
                      style={{ backgroundColor: '#38A1DB', border: '1px solid #38A1DB' }}
                    >
                      <i className="bi bi-calendar-event"></i>
                      <span>View All Events</span>
                    </Link>

                    <button
                      type="button"
                      onClick={() => handleShareWhatsApp(featuredEvent)}
                      className="btn btn-outline-light rounded-pill px-3 py-2 fw-semibold d-inline-flex align-items-center gap-2"
                      style={{ borderColor: 'rgba(255, 255, 255, 0.45)' }}
                      title="Share event on WhatsApp"
                    >
                      <i className="bi bi-whatsapp text-success fs-5"></i>
                      <span>Share on WhatsApp</span>
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </section>
      ) : null}

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

      {/* Church Promise Section (Yearly & Monthly - Stacked Vertically as Distinct Cards) */}
      {(hasYearly || hasMonthly) && (
        <section className="py-5" style={{ backgroundColor: 'var(--fgag-surface, #F8F9FA)' }}>
          <div className="container py-3">
            <div className="d-flex flex-column align-items-center gap-4">
              {/* 1. Yearly Promise Card: Large, Prominent, Deep Navy with Gold Accent */}
              {hasYearly && (
                <motion.div
                  className="w-100"
                  style={{ maxWidth: '980px' }}
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-40px' }}
                  transition={{ duration: 0.55 }}
                >
                  <div
                    className="card border-0 rounded-4 text-center position-relative overflow-hidden p-4 p-md-5"
                    style={{
                      background: 'linear-gradient(135deg, #0A3D62 0%, #07253D 100%)',
                      boxShadow: '0 16px 36px rgba(10, 61, 98, 0.22)',
                      border: '1.5px solid rgba(243, 156, 18, 0.35)'
                    }}
                  >
                    {/* Top Gold Accent Line */}
                    <div
                      className="position-absolute top-0 start-0 w-100"
                      style={{ height: '4px', background: 'linear-gradient(90deg, #F39C12, #F7DC6F, #F39C12)' }}
                    />

                    <div>
                      <span
                        className="badge px-3 py-2 mb-3 rounded-pill text-uppercase fw-semibold"
                        style={{
                          backgroundColor: 'rgba(243, 156, 18, 0.18)',
                          color: '#F7DC6F',
                          border: '1px solid rgba(243, 156, 18, 0.4)',
                          letterSpacing: '0.08em',
                          fontSize: '0.78rem'
                        }}
                      >
                        Promise for {promiseYear}
                      </span>

                      <div className="d-flex justify-content-center my-2">
                        <i className="bi bi-quote fs-1" style={{ color: '#F7DC6F', opacity: 0.85 }}></i>
                      </div>

                      <blockquote
                        className="fw-normal mx-auto mb-4 text-white lh-base fst-italic"
                        style={{
                          fontFamily: "'Lora', serif",
                          fontSize: 'clamp(1.2rem, 2.4vw, 1.6rem)',
                          maxWidth: '820px'
                        }}
                      >
                        "{promiseVerse.replace(/^["“”]|["“”]$/g, '')}"
                      </blockquote>

                      <div
                        className="fw-bold fs-5 pt-1"
                        style={{
                          fontFamily: "'Playfair Display', serif",
                          letterSpacing: '0.04em',
                          color: '#F7DC6F'
                        }}
                      >
                        {promiseRef}
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* 2. Monthly Promise Card: Separate, Distinct, Ice-Blue with Blue Accent */}
              {hasMonthly && (
                <motion.div
                  className="w-100"
                  style={{ maxWidth: '880px' }}
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-40px' }}
                  transition={{ duration: 0.55, delay: hasYearly ? 0.12 : 0 }}
                >
                  <div
                    className="card border-0 rounded-4 text-center position-relative overflow-hidden mt-4 p-4 p-md-5"
                    style={{
                      background: 'linear-gradient(135deg, #E9F1F7 0%, #D8E7F3 100%)',
                      boxShadow: '0 10px 28px rgba(10, 61, 98, 0.08)',
                      border: '1.5px solid rgba(56, 161, 219, 0.35)'
                    }}
                  >
                    {/* Top Sky Blue Accent Line */}
                    <div
                      className="position-absolute top-0 start-0 w-100"
                      style={{ height: '4px', background: 'linear-gradient(90deg, #38A1DB, #5DADE2, #38A1DB)' }}
                    />

                    <div>
                      <span
                        className="badge px-3 py-2 mb-3 rounded-pill text-uppercase fw-semibold"
                        style={{
                          backgroundColor: 'rgba(56, 161, 219, 0.2)',
                          color: '#0A3D62',
                          border: '1px solid rgba(56, 161, 219, 0.45)',
                          letterSpacing: '0.08em',
                          fontSize: '0.78rem'
                        }}
                      >
                        Promise for {monthlyMonthName}
                      </span>

                      <div className="d-flex justify-content-center my-2">
                        <i className="bi bi-quote fs-1" style={{ color: '#38A1DB', opacity: 0.9 }}></i>
                      </div>

                      <blockquote
                        className="fw-normal mx-auto mb-4 lh-base fst-italic"
                        style={{
                          color: '#0A3D62',
                          fontFamily: "'Lora', serif",
                          fontSize: 'clamp(1.1rem, 2.1vw, 1.4rem)',
                          maxWidth: '740px'
                        }}
                      >
                        "{monthlyVerse.verseText.replace(/^["“”]|["“”]$/g, '')}"
                      </blockquote>

                      <div
                        className="fw-bold fs-5 pt-1"
                        style={{
                          fontFamily: "'Playfair Display', serif",
                          letterSpacing: '0.04em',
                          color: '#38A1DB'
                        }}
                      >
                        {monthlyVerse.reference}
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </div>
          </div>
        </section>
      )}

      {/* Weekly Church Schedule Section */}
      <WeeklySchedule />

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
                <div className="position-relative w-100" style={{ maxWidth: '380px' }}>
                  <div className="shadow-sm rounded-4 overflow-hidden" style={{ aspectRatio: '4 / 5', backgroundColor: '#f1f5f9' }}>
                    <img
                      src={pastorImg}
                      alt={pastorName}
                      className="w-100 h-100 rounded-4"
                      style={{
                        objectFit: 'cover',
                        objectPosition: 'center top'
                      }}
                      loading="lazy"
                      onError={(e) => {
                        e.target.src = '/images/Pastor_pic.jpg';
                      }}
                    />
                  </div>
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

      {/* Pastor's YouTube Song Section (TASK 3) */}
      <section className="py-5" style={{ backgroundColor: 'var(--fgag-surface, #F8F9FA)' }} aria-label="Pastor's Gospel Song">
        <div className="container py-3">
          <motion.div
            className="text-center mb-4"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-40px' }}
            variants={fadeInUp}
          >
            <span className="section-eyebrow">Worship & Melody</span>
            <h2 className="heading_1 display-6 fw-bold mb-2">
              Listen to Our Pastor's Song
            </h2>
            <div className="section-divider">
              <i className="bi bi-music-note-beamed section-divider-icon text-primary"></i>
            </div>
            <p className="text-muted mx-auto mb-0" style={{ maxWidth: '640px' }}>
              Experience the divine presence through this heartfelt Gospel song written, composed, and rendered by Pastor Amal M. Augustine.
            </p>
          </motion.div>

          <motion.div
            className="row justify-content-center"
            initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-40px' }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className="col-12 col-md-10 col-lg-8">
              <motion.a
                href={pastorSongUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="d-block text-decoration-none card border-0 shadow-lg rounded-4 overflow-hidden position-relative"
                style={{
                  transition: 'box-shadow 0.35s ease',
                  cursor: 'pointer',
                  border: '1.5px solid rgba(56, 161, 219, 0.25)'
                }}
                whileHover={shouldReduceMotion ? {} : { y: -4, boxShadow: '0 20px 40px rgba(10, 61, 98, 0.22)' }}
              >
                <div
                  className="position-relative w-100 overflow-hidden"
                  style={{ aspectRatio: '16 / 9', backgroundColor: '#07253D' }}
                >
                  <motion.img
                    src="https://img.youtube.com/vi/RuFPYAPTdbQ/maxresdefault.jpg"
                    alt="Listen to Our Pastor's Song - YouTube"
                    className="w-100 h-100"
                    style={{ objectFit: 'cover' }}
                    loading="lazy"
                    whileHover={shouldReduceMotion ? {} : { scale: 1.04 }}
                    transition={{ duration: 0.4 }}
                    onError={(e) => {
                      e.currentTarget.src = 'https://img.youtube.com/vi/RuFPYAPTdbQ/hqdefault.jpg';
                    }}
                  />

                  {/* Gradient Shadow Overlay */}
                  <div
                    className="position-absolute top-0 start-0 w-100 h-100"
                    style={{
                      background: 'radial-gradient(circle at center, rgba(0, 0, 0, 0.1) 0%, rgba(7, 37, 61, 0.55) 100%)',
                      pointerEvents: 'none'
                    }}
                  />

                  {/* Centered Red YouTube-style Play Button Overlay */}
                  <div
                    className="position-absolute top-50 start-50 translate-middle d-flex align-items-center justify-content-center"
                    style={{ pointerEvents: 'none' }}
                  >
                    <motion.div
                      className="d-flex align-items-center justify-content-center rounded-4 shadow-lg"
                      style={{
                        width: '84px',
                        height: '58px',
                        backgroundColor: '#FF0000',
                        color: '#FFFFFF'
                      }}
                      whileHover={shouldReduceMotion ? {} : { scale: 1.12 }}
                      transition={{ duration: 0.2 }}
                      aria-label="Play on YouTube"
                    >
                      <i className="bi bi-play-fill" style={{ fontSize: '2.5rem', marginLeft: '4px' }}></i>
                    </motion.div>
                  </div>

                  {/* Bottom Video Info Ribbon */}
                  <div
                    className="position-absolute bottom-0 start-0 w-100 p-3 p-md-4 d-flex justify-content-between align-items-end"
                    style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.82) 0%, transparent 100%)' }}
                  >
                    <div className="text-white text-start">
                      <span className="badge bg-danger px-3 py-1 rounded-pill small fw-semibold text-uppercase mb-2 d-inline-flex align-items-center gap-1">
                        <i className="bi bi-youtube"></i> Watch on YouTube
                      </span>
                      <h4 className="fw-bold mb-0 text-white" style={{ fontFamily: "'Playfair Display', serif", fontSize: 'clamp(1.1rem, 2vw, 1.45rem)' }}>
                        Pastor Amal M. Augustine Song
                      </h4>
                    </div>
                    <span className="btn btn-sm btn-outline-light rounded-pill px-3 py-1 d-none d-sm-inline-flex align-items-center gap-1">
                      <span>Watch</span>
                      <i className="bi bi-box-arrow-up-right small"></i>
                    </span>
                  </div>
                </div>
              </motion.a>
            </div>
          </motion.div>
        </div>
      </section>

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
                <div className="image-zoom-card shadow-sm d-inline-block rounded-4 overflow-hidden" style={{ maxWidth: '340px', width: '100%', aspectRatio: '1 / 1', backgroundColor: '#f1f5f9' }}>
                  <img
                    src={appImg}
                    alt="Uvamaigal Bible Stories App"
                    className="w-100 h-100 rounded-4"
                    style={{ objectFit: 'cover' }}
                    loading="lazy"
                    onError={(e) => {
                      e.target.src = '/images/uvamaigal.jpg';
                    }}
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

      {/* Explore Our Church Navigation Section */}
      <section className="py-5" style={{ backgroundColor: 'var(--fgag-surface, #F8F9FA)' }}>
        <div className="container py-4">
          <motion.div
            className="text-center mb-5"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-40px' }}
            variants={fadeInUp}
          >
            <div className="d-inline-flex align-items-center gap-2 px-3 py-1 rounded-pill bg-primary-subtle text-primary fw-semibold small mb-2">
              <i className="bi bi-compass"></i>
              <span>Discover Our Community</span>
            </div>
            <h2 className="heading display-6 fw-bold mb-2" style={{ color: 'var(--fgag-primary, #0A3D62)' }}>
              Explore Our Church
            </h2>
            <div className="section-divider">
              <i className="bi bi-diamond-fill section-divider-icon"></i>
            </div>
            <p className="lead paragraph text-muted mx-auto mb-0" style={{ maxWidth: '640px' }}>
              Connect with our church ministries, upcoming gatherings, spiritual sermons, and mission outreach.
            </p>
          </motion.div>

          <motion.div
            className="row g-4"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-40px' }}
            variants={staggerContainer}
          >
            {exploreLinks.map((item, idx) => (
              <motion.div className="col-12 col-sm-6 col-lg-3 d-flex" key={idx} variants={fadeInUp}>
                <div className="card h-100 w-100 rounded-4 shadow-sm border-0 bg-white hover-lift p-4 d-flex flex-column justify-content-between">
                  <div>
                    <div
                      className="d-inline-flex align-items-center justify-content-center p-3 rounded-circle mb-3"
                      style={{ backgroundColor: item.iconBg }}
                    >
                      <i className={`bi ${item.icon} fs-4`} style={{ color: item.iconColor }}></i>
                    </div>
                    <h5 className="heading fw-bold mb-2 text-dark fs-6">
                      {item.title}
                    </h5>
                    <p className="paragraph small text-muted mb-3" style={{ lineHeight: '1.6' }}>
                      {item.desc}
                    </p>
                  </div>
                  <div className="pt-2 border-top border-light-subtle">
                    <Link
                      to={item.to}
                      className="text-decoration-none fw-semibold small d-inline-flex align-items-center gap-1"
                      style={{ color: 'var(--fgag-sky, #38A1DB)' }}
                    >
                      <span>Explore</span>
                      <i className="bi bi-arrow-right"></i>
                    </Link>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
