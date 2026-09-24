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

  return (
    <footer className="footer-custom text-center text-md-start">
      <div className="container">
        <div className="row gy-4 mb-4 align-items-center">
          {/* Church Info */}
          <div className="col-lg-5 text-center text-lg-start">
            <div className="d-flex align-items-center justify-content-center justify-content-lg-start gap-2 mb-2">
              <img
                src="/images/Church_logo.png"
                alt="Friends Garden AG Church"
                style={{ height: '54px', objectFit: 'contain' }}
              />
            </div>
            <p className="small text-light opacity-75 mb-2" style={{ maxWidth: '420px' }}>
              {address}
            </p>
            <p className="small text-light opacity-75 mb-0">
              <i className="bi bi-telephone me-2 text-info"></i>{phone} &nbsp;|&nbsp;{' '}
              <i className="bi bi-envelope me-2 text-info"></i>{email}
            </p>
          </div>

          {/* Social Links */}
          <div className="col-lg-7 text-center text-lg-end">
            <h5 className="mb-3 text-white fw-bold" style={{ fontFamily: "'Playfair Display', serif" }}>
              Follow Us
            </h5>
            <div className="d-flex justify-content-center justify-content-lg-end flex-wrap gap-2">
              <a
                href={ig}
                target="_blank"
                rel="noopener noreferrer"
                className="social-pill-btn"
                aria-label="Follow us on Instagram"
              >
                <i className="bi bi-instagram text-danger"></i> Instagram
              </a>
              <a
                href={fb}
                target="_blank"
                rel="noopener noreferrer"
                className="social-pill-btn"
                aria-label="Follow us on Facebook"
              >
                <i className="bi bi-facebook text-primary"></i> Facebook
              </a>
              <a
                href={tw}
                target="_blank"
                rel="noopener noreferrer"
                className="social-pill-btn"
                aria-label="Follow us on Twitter"
              >
                <i className="bi bi-twitter-x text-info"></i> Twitter
              </a>
              <a
                href={wa}
                target="_blank"
                rel="noopener noreferrer"
                className="social-pill-btn"
                aria-label="Chat with us on WhatsApp"
              >
                <i className="bi bi-whatsapp text-success"></i> WhatsApp
              </a>
            </div>
          </div>
        </div>

        <div className="pt-3 border-top border-white border-opacity-10 d-flex flex-column flex-sm-row justify-content-between align-items-center gap-2">
          <p className="small mb-0 text-light opacity-75 text-center text-sm-start">
            &copy; {currentYear} Friends Garden AG Church. All rights reserved.
          </p>
          <p className="small mb-0">
            <Link to="/admin" className="text-decoration-none text-light opacity-60 hover-opacity-100 d-inline-flex align-items-center gap-1">
              <i className="bi bi-shield-lock"></i> Admin CMS Login
            </Link>
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
