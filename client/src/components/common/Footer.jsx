import React from 'react';
import { Link } from 'react-router-dom';

const Footer = ({ settings = {} }) => {
  const currentYear = new Date().getFullYear();

  const ig = settings.social_instagram || 'https://instagram.com';
  const fb = settings.social_facebook || 'https://facebook.com';
  const tw = settings.social_twitter || 'https://twitter.com';
  const wa = settings.social_whatsapp || 'https://whatsapp.com';

  return (
    <footer className="footer-custom text-center">
      <div className="container">
        <h4 className="mb-3" style={{ color: '#c5dced', fontFamily: "'Playfair Display', serif" }}>
          Follow Us
        </h4>

        <div className="d-flex justify-content-center flex-wrap gap-4 fs-5 mb-4">
          <a href={ig} target="_blank" rel="noopener noreferrer">
            📸 Instagram
          </a>
          <a href={fb} target="_blank" rel="noopener noreferrer">
            📘 Facebook
          </a>
          <a href={tw} target="_blank" rel="noopener noreferrer">
            🐦 Twitter
          </a>
          <a href={wa} target="_blank" rel="noopener noreferrer">
            💬 WhatsApp
          </a>
        </div>

        <p className="small mb-2" style={{ color: '#e9f1f7' }}>
          &copy; {currentYear} Friends Garden AG Church. All rights reserved.
        </p>
        <p className="small mb-0">
          <Link to="/admin" className="text-decoration-none text-light opacity-50">
            <i className="bi bi-shield-lock me-1"></i> Admin CMS Login
          </Link>
        </p>
      </div>
    </footer>
  );
};

export default Footer;
