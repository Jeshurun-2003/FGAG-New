import React from 'react';
import { Link } from 'react-router-dom';

const Footer = ({ settings = {} }) => {
  const currentYear = new Date().getFullYear();

  const ig = settings.social_instagram || 'https://instagram.com';
  const fb = settings.social_facebook || 'https://facebook.com';
  const tw = settings.social_twitter || 'https://twitter.com';
  const wa = settings.social_whatsapp || 'https://whatsapp.com';
  const address = settings.contact_address || 'Friends Garden A.G church, Near Keezhvallam Railway Gate, Thaikal Via.Kollidam - 609102';
  const phone = settings.contact_phone || '+91 98656 81983';
  const email = settings.contact_email || 'kollidamag@gmail.com';
  const hours = settings.contact_hours || 'Sunday Service: 9:00 AM | Mon–Fri: 10am–6pm';

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="footer-custom text-light position-relative">
      <div className="container py-5">
        <div className="row g-4 g-lg-5">
          {/* Column 1: About */}
          <div className="col-12 col-md-6 col-lg-4 text-center text-md-start">
            <div className="d-flex flex-column align-items-center align-items-md-start mb-3">
              <div
                className="d-inline-flex align-items-center justify-content-center p-2 mb-2 rounded-3"
                style={{
                  background: 'rgba(255, 255, 255, 0.06)',
                  border: '1px solid rgba(255, 255, 255, 0.12)'
                }}
              >
                <img
                  src="/images/Church_logo.png"
                  alt="Friends Garden AG Church"
                  style={{ height: '96px', maxWidth: '240px', objectFit: 'contain' }}
                />
              </div>
              <h4
                className="text-white fw-bold mb-1"
                style={{ fontFamily: "'Playfair Display', serif", fontSize: '1.35rem' }}
              >
                Friends Garden AG Church
              </h4>
              <p className="text-info small fw-medium mb-2" style={{ letterSpacing: '0.04em' }}>
                Rooted in Christ. Growing in Love.
              </p>
            </div>
            <p className="small text-light opacity-75 mb-0" style={{ lineHeight: '1.8' }}>
              A welcoming Assemblies of God fellowship in Kollidam dedicated to worship, discipleship, and Christ-centered community transformation.
            </p>
          </div>

          {/* Column 2: Quick Links */}
          <div className="col-6 col-md-3 col-lg-2">
            <h5 className="footer-heading mb-3 text-white fw-bold">Quick Links</h5>
            <ul className="list-unstyled small d-flex flex-column gap-2 mb-0">
              <li><Link to="/" className="footer-link">Home</Link></li>
              <li><Link to="/about" className="footer-link">About Us</Link></li>
              <li><Link to="/events" className="footer-link">Events</Link></li>
              <li><Link to="/gallery" className="footer-link">Gallery</Link></li>
              <li><Link to="/get-involved" className="footer-link">Get Involved</Link></li>
              <li><Link to="/donate" className="footer-link">Donate / Giving</Link></li>
              <li><Link to="/contact" className="footer-link">Contact Us</Link></li>
            </ul>
          </div>

          {/* Column 3: Ministries & Media */}
          <div className="col-6 col-md-3 col-lg-2">
            <h5 className="footer-heading mb-3 text-white fw-bold">Ministries & Media</h5>
            <ul className="list-unstyled small d-flex flex-column gap-2 mb-0">
              <li><Link to="/ministries" className="footer-link">Sunday Worship</Link></li>
              <li><Link to="/ministries" className="footer-link">Youth Ministry</Link></li>
              <li><Link to="/ministries" className="footer-link">Sunday School</Link></li>
              <li><Link to="/ministries" className="footer-link">Women's Fellowship</Link></li>
              <li><Link to="/ministries" className="footer-link">Men's Fellowship</Link></li>
              <li><Link to="/ministries" className="footer-link">Outreach & Missions</Link></li>
              <li>
                <Link to="/sermons" className="footer-link text-info fw-semibold">
                  <i className="bi bi-play-circle me-1"></i> Sermons & Media
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 4: Contact & Social */}
          <div className="col-12 col-md-12 col-lg-4 text-center text-md-start">
            <h5 className="footer-heading mb-3 text-white fw-bold">Contact & Service Times</h5>
            <div className="small text-light opacity-80 d-flex flex-column gap-2 mb-4">
              <div className="d-flex align-items-start gap-2 justify-content-center justify-content-md-start">
                <i className="bi bi-geo-alt-fill text-info mt-1 flex-shrink-0"></i>
                <span>{address}</span>
              </div>
              <div className="d-flex align-items-center gap-2 justify-content-center justify-content-md-start">
                <i className="bi bi-telephone-fill text-info flex-shrink-0"></i>
                <a href={`tel:${phone.replace(/\s+/g, '')}`} className="footer-link">{phone}</a>
              </div>
              <div className="d-flex align-items-center gap-2 justify-content-center justify-content-md-start">
                <i className="bi bi-envelope-fill text-info flex-shrink-0"></i>
                <a href={`mailto:${email}`} className="footer-link">{email}</a>
              </div>
              <div className="d-flex align-items-center gap-2 justify-content-center justify-content-md-start">
                <i className="bi bi-clock-fill text-info flex-shrink-0"></i>
                <span>{hours}</span>
              </div>
            </div>

            <div className="d-flex flex-wrap gap-2 justify-content-center justify-content-md-start">
              <a
                href={ig}
                target="_blank"
                rel="noopener noreferrer"
                className="social-pill-btn"
                aria-label="Instagram"
              >
                <i className="bi bi-instagram text-danger"></i>
                <span>Instagram</span>
              </a>
              <a
                href={fb}
                target="_blank"
                rel="noopener noreferrer"
                className="social-pill-btn"
                aria-label="Facebook"
              >
                <i className="bi bi-facebook text-primary"></i>
                <span>Facebook</span>
              </a>
              <a
                href={tw}
                target="_blank"
                rel="noopener noreferrer"
                className="social-pill-btn"
                aria-label="Twitter"
              >
                <i className="bi bi-twitter-x text-info"></i>
                <span>Twitter</span>
              </a>
              <a
                href={wa}
                target="_blank"
                rel="noopener noreferrer"
                className="social-pill-btn"
                aria-label="WhatsApp"
              >
                <i className="bi bi-whatsapp text-success"></i>
                <span>WhatsApp</span>
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Bar with Back to Top */}
        <div className="pt-4 mt-4 border-top border-white border-opacity-10 d-flex flex-column flex-md-row justify-content-between align-items-center gap-3">
          <p className="small mb-0 text-light opacity-75 text-center text-md-start">
            &copy; {currentYear} Friends Garden AG Church, Kollidam. All rights reserved.
            <span className="ms-2">
              <Link to="/admin" className="text-decoration-none text-light opacity-50 hover-opacity-100">
                <i className="bi bi-shield-lock me-1"></i>Admin Portal
              </Link>
            </span>
          </p>

          <button
            onClick={scrollToTop}
            className="btn btn-outline-light btn-sm rounded-pill px-3 py-1 d-inline-flex align-items-center gap-1 opacity-80 hover-opacity-100"
            aria-label="Scroll back to top"
            style={{ fontSize: '0.85rem' }}
          >
            <span>Back to top</span>
            <i className="bi bi-arrow-up-short fs-5"></i>
          </button>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
