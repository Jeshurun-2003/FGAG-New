import React from 'react';
import { Link, useOutletContext } from 'react-router-dom';

const HomePage = () => {
  const { settings = {} } = useOutletContext() || {};

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
      {/* Hero Section */}
      <section
        className="px-3 position-relative d-flex align-items-center justify-content-center text-center text-white"
        style={{
          backgroundImage: `url('${heroBg}')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          minHeight: '75vh',
          padding: '80px 0'
        }}
      >
        {/* Dark Overlay */}
        <div
          className="position-absolute top-0 start-0 w-100 h-100"
          style={{ backgroundColor: 'rgba(0, 0, 0, 0.72)', zIndex: 1 }}
        />

        {/* Content */}
        <div className="container position-relative py-5" style={{ zIndex: 2 }}>
          <div className="row justify-content-center">
            <div className="col-12 col-md-11 col-lg-9 col-xl-8">
              <h1 className="display-3 fw-bold mb-4 text-white" style={{ fontFamily: "'Playfair Display', serif" }}>
                {heroTitle}
              </h1>
              <p className="lead fs-3 mb-5 fw-medium text-light opacity-90">
                {heroSubtitle}
              </p>
              <div className="d-flex flex-wrap gap-3 justify-content-center">
                <a
                  href={heroYoutube}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-enhanced btn-outline-light d-inline-flex align-items-center gap-2"
                >
                  <i className="bi bi-youtube text-danger fs-5"></i>
                  Visit YouTube
                </a>
                <Link
                  to="/contact"
                  className="btn btn-enhanced btn-outline-light d-inline-flex align-items-center gap-2"
                >
                  <i className="bi bi-envelope fs-5"></i>
                  Contact Us
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Welcome Section */}
      <section className="py-5 bg-light">
        <div className="container py-4">
          <div className="text-center mb-5">
            <h2 className="heading_1 display-5 fw-bold mb-2">
              Welcome to Friends Garden A.G Church
            </h2>
            <p className="lead fst-italic paragraph mb-0">
              A Place to Belong, Believe, and Become.
            </p>
          </div>

          <div className="row justify-content-center g-4">
            <div className="col-md-4">
              <div className="card border-0 shadow-sm h-100 rounded-4 hover-lift p-3 bg-white">
                <div className="card-body text-center">
                  <i className="bi bi-heart-fill display-5 text-danger mb-3 d-block"></i>
                  <h4 className="heading fw-bold mb-3">Celebrate with Gratitude</h4>
                  <p className="paragraph mb-0">{celebrateDesc}</p>
                </div>
              </div>
            </div>

            <div className="col-md-4">
              <div className="card border-0 shadow-sm h-100 rounded-4 hover-lift p-3 bg-white">
                <div className="card-body text-center">
                  <i className="bi bi-people-fill display-5 text-success mb-3 d-block"></i>
                  <h4 className="heading fw-bold mb-3">Grow in His Kingdom</h4>
                  <p className="paragraph mb-0">{growDesc}</p>
                </div>
              </div>
            </div>

            <div className="col-md-4">
              <div className="card border-0 shadow-sm h-100 rounded-4 hover-lift p-3 bg-white">
                <div className="card-body text-center">
                  <i className="bi bi-chat-dots-fill display-5 text-primary mb-3 d-block"></i>
                  <h4 className="heading fw-bold mb-3">Encourage & Uplift</h4>
                  <p className="paragraph mb-0">{upliftDesc}</p>
                </div>
              </div>
            </div>
          </div>

          <p className="text-center fs-5 text-muted mt-5 mx-auto" style={{ maxWidth: '820px' }}>
            {welcomeFooter}
          </p>
        </div>
      </section>

      {/* Church Promise Section */}
      <section className="py-5 promise-section text-white text-center">
        <div className="container py-4">
          <h2 className="fw-bold mb-4 text-white">Our Church Promise {promiseYear}</h2>
          <h4 className="fw-bold mx-auto mb-3 text-white lh-base" style={{ maxWidth: '900px', fontStyle: 'italic' }}>
            {promiseVerse}
          </h4>
          <p className="text-light fw-semibold fs-5 mb-0">{promiseRef}</p>
        </div>
      </section>

      {/* Pastor's Welcome Message */}
      <section className="py-5 px-2 bg-light">
        <div className="container py-4">
          <div className="card border-0 shadow-sm rounded-4 overflow-hidden">
            <div className="row g-0 align-items-center section-bg">
              {/* Pastor Image */}
              <div className="col-md-5 d-flex justify-content-center align-items-center p-3 p-md-4">
                <img
                  src={pastorImg}
                  alt={pastorName}
                  className="img-fluid rounded-4 shadow-sm"
                  style={{
                    maxHeight: '420px',
                    width: 'auto',
                    maxWidth: '100%',
                    objectFit: 'contain',
                    borderRadius: '20px'
                  }}
                />
              </div>

              {/* Message Content */}
              <div className="col-md-7 p-4 p-md-5">
                <h2 className="fw-bold heading text-start mb-4">{pastorTitle}</h2>
                <div className="paragraph mb-4 text-muted" style={{ whiteSpace: 'pre-line' }}>
                  {pastorMsg}
                </div>
                <h5 className="fw-bold text-dark mb-1">– {pastorName}</h5>
                <p className="text-secondary mb-0">{pastorRole}</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Uvamaigal App Section */}
      <section className="py-5 bg-white">
        <div className="container py-4">
          <div className="row align-items-center gy-4">
            <div className="col-md-5 text-center p-3">
              <img
                src={appImg}
                alt="Uvamaigal Bible Stories App"
                className="img-fluid rounded-4 shadow-sm"
                style={{ maxHeight: '380px', width: 'auto', maxWidth: '100%', objectFit: 'contain' }}
              />
            </div>

            <div className="col-md-7 text-center text-md-start">
              <h2 className="fw-bold heading mb-3">{appTitle}</h2>
              <div className="paragraph text-muted fs-5 mb-4" style={{ whiteSpace: 'pre-line' }}>
                {appDesc}
              </div>
              <a
                href={appPlaystore}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-success rounded-pill px-4 py-2 shadow-sm d-inline-flex align-items-center gap-2"
              >
                <i className="bi bi-google-play fs-5"></i>
                Download Uvamaigal
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
