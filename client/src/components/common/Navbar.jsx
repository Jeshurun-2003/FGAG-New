import React, { useState, useEffect } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import Logo from './Logo';

const Navbar = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 40);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile drawer when route changes
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && mobileMenuOpen) {
        setMobileMenuOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [mobileMenuOpen]);

  const toggleMenu = () => {
    setMobileMenuOpen((prev) => !prev);
  };

  const closeMenu = () => {
    setMobileMenuOpen(false);
  };

  const navLinks = [
    { to: '/', label: 'Home' },
    { to: '/about', label: 'About Us' },
    { to: '/events', label: 'Events' },
    { to: '/ministries', label: 'Ministries' },
    { to: '/sermons', label: 'Sermons' },
    { to: '/gallery', label: 'Gallery' },
    { to: '/get-involved', label: 'Get Involved' },
    { to: '/contact', label: 'Contact Us' },
    { to: '/donate', label: 'Donate' }
  ];

  return (
    <>
      <header>
        <nav
          className={`navbar navbar-expand-lg navbar-dark navbar-custom ${scrolled ? 'navbar-scrolled' : ''}`}
          role="navigation"
          aria-label="Main navigation"
        >
          <div className="container">
            <Link className="navbar-brand py-0 d-flex align-items-center gap-2" to="/" onClick={closeMenu}>
              <div className="d-flex align-items-center">
                <Logo variant="light" size={scrolled ? 48 : 56} className="navbar-logo-img" />
              </div>
              <div className="d-flex flex-column text-start">
                <span className="navbar-brand-name">Friends Garden AG</span>
                <span className="navbar-brand-sub">Kollidam</span>
              </div>
            </Link>

            {/* Hamburger Button */}
            <button
              className="navbar-toggler border-0 p-2 shadow-none"
              type="button"
              aria-label="Toggle navigation"
              aria-expanded={mobileMenuOpen}
              onClick={toggleMenu}
            >
              <i className={`bi ${mobileMenuOpen ? 'bi-x-lg' : 'bi-list'} fs-2 text-white`}></i>
            </button>

            {/* Desktop Navigation */}
            <div className="collapse navbar-collapse justify-content-end" id="navbarNav">
              <ul className="navbar-nav ms-lg-auto me-2 align-items-center">
                {navLinks.map((link) => (
                  <li className="nav-item" key={link.to}>
                    <NavLink
                      to={link.to}
                      className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
                    >
                      {link.label}
                    </NavLink>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </nav>
      </header>

      {/* Backdrop overlay for mobile menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="mobile-menu-overlay active"
            onClick={closeMenu}
            aria-hidden="true"
          />
        )}
      </AnimatePresence>

      {/* Mobile Slide-in Drawer */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.aside
            initial={{ x: '100%', opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: '100%', opacity: 0 }}
            transition={{ type: 'spring', damping: 25, stiffness: 220 }}
            className="mobile-slide-menu active"
            aria-label="Mobile menu"
          >
            <div className="d-flex justify-content-between align-items-center mb-3">
              <span className="text-white fw-bold fs-5" style={{ fontFamily: "'Playfair Display', serif" }}>
                Menu
              </span>
              <button
                className="close-btn"
                onClick={closeMenu}
                aria-label="Close navigation"
              >
                &times;
              </button>
            </div>

            <ul className="navbar-nav text-start pe-2 pt-2 flex-grow-1">
              {navLinks.map((link) => (
                <li className="nav-item" key={link.to}>
                  <NavLink
                    to={link.to}
                    className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
                    onClick={closeMenu}
                  >
                    {link.label}
                  </NavLink>
                </li>
              ))}
              <li className="nav-item mt-4 pt-3 border-top border-light-subtle">
                <Link
                  to="/admin"
                  className="btn btn-outline-light btn-sm w-100 py-2 d-flex align-items-center justify-content-center gap-2"
                  onClick={closeMenu}
                >
                  <i className="bi bi-shield-lock"></i> Admin Portal
                </Link>
              </li>
            </ul>

            <div className="text-white-50 small mt-auto text-center pt-3 border-top border-white border-opacity-10">
              Friends Garden AG Church, Kollidam
            </div>
          </motion.aside>
        )}
      </AnimatePresence>

      {/* Spacer so page content starts below the fixed navbar */}
      <div className="navbar-spacer" aria-hidden="true" />
    </>
  );
};

export default Navbar;
