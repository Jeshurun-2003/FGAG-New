import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

// Layouts
import PublicLayout from '../layouts/PublicLayout';
import AdminLayout from '../layouts/AdminLayout';
import ProtectedRoute from './ProtectedRoute';

// Public Pages
import HomePage from '../pages/public/HomePage';
import AboutPage from '../pages/public/AboutPage';
import EventsPage from '../pages/public/EventsPage';
import MinistriesPage from '../pages/public/MinistriesPage';
import GalleryPage from '../pages/public/GalleryPage';
import GetInvolvedPage from '../pages/public/GetInvolvedPage';
import ContactPage from '../pages/public/ContactPage';
import DonatePage from '../pages/public/DonatePage';

// Admin Pages
import AdminLoginPage from '../pages/admin/AdminLoginPage';
import AdminDashboardPage from '../pages/admin/AdminDashboardPage';
import AdminHeroAboutPage from '../pages/admin/AdminHeroAboutPage';
import AdminEventsPage from '../pages/admin/AdminEventsPage';
import AdminMinistriesPage from '../pages/admin/AdminMinistriesPage';
import AdminGalleryPage from '../pages/admin/AdminGalleryPage';
import AdminPrayerPage from '../pages/admin/AdminPrayerPage';
import AdminVolunteersPage from '../pages/admin/AdminVolunteersPage';
import AdminSettingsPage from '../pages/admin/AdminSettingsPage';
import AdminProfilePage from '../pages/admin/AdminProfilePage';

const AppRoutes = () => {
  return (
    <Routes>
      {/* Public Church Website Routes */}
      <Route element={<PublicLayout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/events" element={<EventsPage />} />
        <Route path="/ministries" element={<MinistriesPage />} />
        <Route path="/gallery" element={<GalleryPage />} />
        <Route path="/get-involved" element={<GetInvolvedPage />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="/donate" element={<DonatePage />} />
      </Route>

      {/* Admin Authentication */}
      <Route path="/admin/login" element={<AdminLoginPage />} />

      {/* Protected Admin CMS Dashboard Routes */}
      <Route element={<ProtectedRoute />}>
        <Route element={<AdminLayout />}>
          <Route path="/admin" element={<AdminDashboardPage />} />
          <Route path="/admin/hero-about" element={<AdminHeroAboutPage />} />
          <Route path="/admin/events" element={<AdminEventsPage />} />
          <Route path="/admin/ministries" element={<AdminMinistriesPage />} />
          <Route path="/admin/gallery" element={<AdminGalleryPage />} />
          <Route path="/admin/prayers" element={<AdminPrayerPage />} />
          <Route path="/admin/volunteers" element={<AdminVolunteersPage />} />
          <Route path="/admin/settings" element={<AdminSettingsPage />} />
          <Route path="/admin/profile" element={<AdminProfilePage />} />
        </Route>
      </Route>

      {/* Fallback to Home */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export default AppRoutes;
