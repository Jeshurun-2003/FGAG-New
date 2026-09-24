import React, { useState } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';

const Navbar = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();

  const toggleMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const closeMenu = () => {
    setMobileMenuOpen(false);
  };

  const navLinks = [
    { to: '/', label: 'Home' },
    { to: '/about', label: 'About Us' },
    { to: '/events', label: 'Events' },
    { to: '/ministries', label: 'Ministries' },
    { to: '/gallery', label: 'Gallery' },
    { to: '/get-involved', label: 'Get Involved' },
    { to: '/contact', label: 'Contact Us' },
    { to: '/donate', label: 'Donate' }
  ];

  return (
    <>
      <nav className="navbar navbar-expand-lg navbar-dark navbar-custom sticky-top">
        <div className="container">
          <Link className="navbar-brand py-0" to="/" onClick={closeMenu}>
            <img src="/images/Church_logo.png" alt="Friends Garden AG Church Logo" />
          </Link>

          {/* Hamburger Button */}
          <button
            className="navbar-toggler border-0"
            type="button"
            aria-label="Toggle navigation"
            onClick={toggleMenu}
          >
            <span className="navbar-toggler-icon"></span>
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

      {/* Backdrop overlay for mobile menu */}
      <div
        className={`mobile-menu-overlay ${mobileMenuOpen ? 'active' : ''}`}
        onClick={closeMenu}
      />

      {/* Mobile Slide-in Drawer */}
      <div className={`mobile-slide-menu ${mobileMenuOpen ? 'active' : ''}`}>
        <button className="close-btn" onClick={closeMenu} aria-label="Close navigation">
          &times;
        </button>
        <ul className="navbar-nav text-end pe-2 pt-2">
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
          <li className="nav-item mt-3 pt-3 border-top border-light-subtle">
            <Link to="/admin" className="btn btn-outline-light btn-sm w-100" onClick={closeMenu}>
              <i className="bi bi-shield-lock me-1"></i> Admin Portal
            </Link>
          </li>
        </ul>
      </div>
    </>
  );
};

export default Navbar;
