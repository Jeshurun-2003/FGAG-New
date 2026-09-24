import React, { useState } from 'react';
import { NavLink, Link, Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import Logo from '../components/common/Logo';

const AdminLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { admin, logout } = useAuth();
  const { addToast } = useToast();
  const navigate = useNavigate();

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);
  const closeSidebar = () => setSidebarOpen(false);

  const handleLogout = () => {
    logout();
    addToast('Signed out successfully.', 'info');
    navigate('/admin/login');
  };

  const navItems = [
    { to: '/admin', end: true, label: 'Dashboard', icon: 'bi-speedometer2' },
    { to: '/admin/hero-about', label: 'Hero & About CMS', icon: 'bi-pencil-square' },
    { to: '/admin/promises', label: 'Promise Verses', icon: 'bi-quote' },
    { to: '/admin/events', label: 'Events CRUD', icon: 'bi-calendar-event' },
    { to: '/admin/sermons', label: 'Sermons / Media', icon: 'bi-play-btn' },
    { to: '/admin/ministries', label: 'Ministries CRUD', icon: 'bi-people' },
    { to: '/admin/gallery', label: 'Gallery Upload & CMS', icon: 'bi-images' },
    { to: '/admin/prayers', label: 'Prayer Requests', icon: 'bi-chat-heart' },
    { to: '/admin/volunteers', label: 'Volunteer Submissions', icon: 'bi-person-check' },
    { to: '/admin/settings', label: 'Website Settings', icon: 'bi-gear' },
    { to: '/admin/profile', label: 'Profile & Password', icon: 'bi-shield-lock' }
  ];

  return (
    <div className="d-flex flex-column min-vh-100">
      {/* Mobile Topbar */}
      <header className="d-lg-none d-flex align-items-center justify-content-between px-3 py-3 text-white sticky-top shadow-sm" style={{ backgroundColor: '#072a44', zIndex: 1035 }}>
        <button
          className="btn btn-link text-white p-1 fs-3"
          onClick={toggleSidebar}
          aria-label="Toggle navigation menu"
        >
          <i className="bi bi-list"></i>
        </button>
        <span className="fw-bold fs-6 d-flex align-items-center gap-2">
          <Logo variant="light" size={32} alt="FGAG" />
          <span>FGAG Admin</span>
        </span>
        <button
          className="btn btn-sm btn-outline-light"
          onClick={handleLogout}
          aria-label="Logout"
          title="Sign Out"
        >
          <i className="bi bi-box-arrow-right"></i>
        </button>
      </header>

      {/* Dark overlay for mobile */}
      {sidebarOpen && (
        <div
          className="position-fixed inset-0 w-100 h-100"
          style={{ backgroundColor: 'rgba(7, 26, 42, 0.65)', zIndex: 1038, backdropFilter: 'blur(3px)' }}
          onClick={closeSidebar}
          aria-hidden="true"
        />
      )}

      {/* Sidebar */}
      <aside className={`admin-sidebar ${sidebarOpen ? 'open' : ''}`}>
        <div className="sidebar-heading d-flex align-items-center justify-content-between px-3 py-3">
          <div className="d-flex align-items-center gap-2">
            <Logo variant="light" size={40} alt="FGAG Logo" />
            <div>
              <span className="fw-bold d-block text-white" style={{ fontSize: '1.05rem' }}>FGAG Church</span>
              <span className="text-info small" style={{ fontSize: '0.75rem', letterSpacing: '0.05em' }}>ADMIN PORTAL</span>
            </div>
          </div>
          <button className="btn btn-link text-white d-lg-none p-0" onClick={closeSidebar} aria-label="Close menu">
            <i className="bi bi-x-lg fs-5"></i>
          </button>
        </div>

        <div className="px-3 py-3 mx-3 my-2 rounded-3 text-white-50 small bg-white bg-opacity-10 d-flex align-items-center gap-2">
          <div className="rounded-circle bg-info text-dark d-flex align-items-center justify-content-center fw-bold" style={{ width: '34px', height: '34px' }}>
            {(admin?.name || admin?.email || 'A').charAt(0).toUpperCase()}
          </div>
          <div className="overflow-hidden">
            <span className="text-white fw-semibold d-block text-truncate small">{admin?.name || 'Administrator'}</span>
            <span className="text-white-50 d-block text-truncate" style={{ fontSize: '0.72rem' }}>{admin?.email}</span>
          </div>
        </div>

        <nav className="mt-2 flex-grow-1 overflow-y-auto px-2">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={({ isActive }) => `nav-link rounded-3 mb-1 ${isActive ? 'active' : ''}`}
              onClick={closeSidebar}
            >
              <i className={`bi ${item.icon} fs-5`}></i>
              <span>{item.label}</span>
            </NavLink>
          ))}
        </nav>

        <div className="px-3 py-3 border-top border-light border-opacity-10 mt-auto">
          <Link to="/" target="_blank" className="btn btn-sm btn-outline-light w-100 mb-2 rounded-pill py-2">
            <i className="bi bi-box-arrow-up-right me-1"></i> View Live Site
          </Link>
          <button className="btn btn-sm btn-danger w-100 rounded-pill py-2" onClick={handleLogout}>
            <i className="bi bi-box-arrow-right me-1"></i> Logout
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="admin-main-content flex-grow-1">
        <header className="d-none d-lg-flex align-items-center justify-content-between mb-4 pb-3 border-bottom">
          <div>
            <h4 className="fw-bold heading mb-0">Management Portal</h4>
            <span className="text-muted small">Friends Garden AG Church Content Management System</span>
          </div>
          <div className="d-flex align-items-center gap-3">
            <Link to="/" target="_blank" className="btn btn-outline-primary btn-sm rounded-pill px-3 py-2">
              <i className="bi bi-globe me-1"></i> View Website
            </Link>
            <div className="d-flex align-items-center gap-2 bg-white px-3 py-2 rounded-pill shadow-sm border">
              <i className="bi bi-person-circle text-primary fs-5"></i>
              <span className="small fw-semibold text-dark">{admin?.name || admin?.email}</span>
            </div>
            <button className="btn btn-outline-danger btn-sm rounded-pill px-3 py-2" onClick={handleLogout}>
              <i className="bi bi-box-arrow-right me-1"></i> Logout
            </button>
          </div>
        </header>

        <Outlet />
      </div>
    </div>
  );
};

export default AdminLayout;
