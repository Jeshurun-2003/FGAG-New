import React, { useState } from 'react';
import { NavLink, Link, Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const AdminLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { admin, logout } = useAuth();
  const navigate = useNavigate();

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);
  const closeSidebar = () => setSidebarOpen(false);

  const handleLogout = () => {
    logout();
    navigate('/admin/login');
  };

  const navItems = [
    { to: '/admin', end: true, label: 'Dashboard', icon: 'bi-speedometer2' },
    { to: '/admin/hero-about', label: 'Hero & About CMS', icon: 'bi-pencil-square' },
    { to: '/admin/events', label: 'Events CRUD', icon: 'bi-calendar-event' },
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
      <div className="d-lg-none d-flex align-items-center justify-content-between px-3 py-3 text-white sticky-top shadow-sm" style={{ backgroundColor: '#0a3d62', zIndex: 1035 }}>
        <button className="btn btn-link text-white p-0 fs-3" onClick={toggleSidebar}>
          <i className="bi bi-list"></i>
        </button>
        <span className="fw-bold fs-5">⛪ FGAG Admin CMS</span>
        <button className="btn btn-sm btn-outline-light" onClick={handleLogout}>
          <i className="bi bi-box-arrow-right"></i>
        </button>
      </div>

      {/* Dark overlay for mobile */}
      {sidebarOpen && (
        <div
          className="position-fixed inset-0 w-100 h-100"
          style={{ backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 1038 }}
          onClick={closeSidebar}
        />
      )}

      {/* Sidebar */}
      <aside className={`admin-sidebar ${sidebarOpen ? 'open' : ''}`}>
        <div className="sidebar-heading d-flex align-items-center justify-content-between">
          <span>⛪ FGAG Admin</span>
          <button className="btn btn-link text-white d-lg-none p-0" onClick={closeSidebar}>
            <i className="bi bi-x-lg"></i>
          </button>
        </div>

        <div className="px-3 py-2 text-white-50 small">
          Signed in as <br />
          <strong className="text-white">{admin?.name || admin?.email}</strong>
        </div>

        <nav className="mt-2">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
              onClick={closeSidebar}
            >
              <i className={`bi ${item.icon}`}></i>
              <span>{item.label}</span>
            </NavLink>
          ))}
          <div className="px-3 mt-4 pt-3 border-top border-light border-opacity-10">
            <Link to="/" target="_blank" className="btn btn-sm btn-outline-light w-100 mb-2">
              <i className="bi bi-box-arrow-up-right me-1"></i> View Live Site
            </Link>
            <button className="btn btn-sm btn-danger w-100" onClick={handleLogout}>
              <i className="bi bi-box-arrow-right me-1"></i> Logout
            </button>
          </div>
        </nav>
      </aside>

      {/* Main Content Area */}
      <div className="admin-main-content flex-grow-1">
        <header className="d-none d-lg-flex align-items-center justify-content-between mb-4 pb-3 border-bottom">
          <div>
            <h4 className="fw-bold heading mb-0">Management Portal</h4>
            <span className="text-muted small">Friends Garden AG Church CMS</span>
          </div>
          <div className="d-flex align-items-center gap-3">
            <Link to="/" target="_blank" className="btn btn-outline-primary btn-sm">
              <i className="bi bi-globe me-1"></i> View Website
            </Link>
            <span className="badge bg-primary-subtle text-primary p-2">
              <i className="bi bi-person-circle me-1"></i> {admin?.name || admin?.email}
            </span>
            <button className="btn btn-outline-danger btn-sm" onClick={handleLogout}>
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
