import React, { lazy, Suspense } from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';

// Layouts
import PublicLayout from '../layouts/PublicLayout';
import AdminLayout from '../layouts/AdminLayout';
import ProtectedRoute from './ProtectedRoute';
import { PageSkeleton } from '../components/common/SkeletonLoader';
import PageTransition from '../components/common/PageTransition';

// Lazy-loaded Public Pages
const HomePage = lazy(() => import('../pages/public/HomePage'));
const AboutPage = lazy(() => import('../pages/public/AboutPage'));
const EventsPage = lazy(() => import('../pages/public/EventsPage'));
const MinistriesPage = lazy(() => import('../pages/public/MinistriesPage'));
const SermonsPage = lazy(() => import('../pages/public/SermonsPage'));
const SermonDetailPage = lazy(() => import('../pages/public/SermonDetailPage'));
const GalleryPage = lazy(() => import('../pages/public/GalleryPage'));
const GetInvolvedPage = lazy(() => import('../pages/public/GetInvolvedPage'));
const ContactPage = lazy(() => import('../pages/public/ContactPage'));
const PrayerRequestPage = lazy(() => import('../pages/public/PrayerRequestPage'));
const DonatePage = lazy(() => import('../pages/public/DonatePage'));

// Lazy-loaded Admin Pages
const AdminLoginPage = lazy(() => import('../pages/admin/AdminLoginPage'));
const AdminDashboardPage = lazy(() => import('../pages/admin/AdminDashboardPage'));
const AdminHeroAboutPage = lazy(() => import('../pages/admin/AdminHeroAboutPage'));
const AdminEventsPage = lazy(() => import('../pages/admin/AdminEventsPage'));
const AdminSermonsPage = lazy(() => import('../pages/admin/AdminSermonsPage'));
const AdminMinistriesPage = lazy(() => import('../pages/admin/AdminMinistriesPage'));
const AdminGalleryPage = lazy(() => import('../pages/admin/AdminGalleryPage'));
const AdminPrayerPage = lazy(() => import('../pages/admin/AdminPrayerPage'));
const AdminMessagesPage = lazy(() => import('../pages/admin/AdminMessagesPage'));
const AdminVolunteersPage = lazy(() => import('../pages/admin/AdminVolunteersPage'));
const AdminDonationsPage = lazy(() => import('../pages/admin/AdminDonationsPage'));
const AdminPromiseVersesPage = lazy(() => import('../pages/admin/AdminPromiseVersesPage'));
const AdminSettingsPage = lazy(() => import('../pages/admin/AdminSettingsPage'));
const AdminProfilePage = lazy(() => import('../pages/admin/AdminProfilePage'));

const AppRoutes = () => {
  const location = useLocation();

  return (
    <Suspense fallback={<PageSkeleton />}>
      <AnimatePresence mode="wait">
        <Routes location={location} key={location.pathname}>
          {/* Public Church Website Routes */}
          <Route element={<PublicLayout />}>
            <Route path="/" element={<PageTransition><HomePage /></PageTransition>} />
            <Route path="/about" element={<PageTransition><AboutPage /></PageTransition>} />
            <Route path="/events" element={<PageTransition><EventsPage /></PageTransition>} />
            <Route path="/ministries" element={<PageTransition><MinistriesPage /></PageTransition>} />
            <Route path="/sermons" element={<PageTransition><SermonsPage /></PageTransition>} />
            <Route path="/sermons/:id" element={<PageTransition><SermonDetailPage /></PageTransition>} />
            <Route path="/gallery" element={<PageTransition><GalleryPage /></PageTransition>} />
            <Route path="/get-involved" element={<PageTransition><GetInvolvedPage /></PageTransition>} />
            <Route path="/prayer-request" element={<PageTransition><PrayerRequestPage /></PageTransition>} />
            <Route path="/contact" element={<PageTransition><ContactPage /></PageTransition>} />
            <Route path="/donate" element={<PageTransition><DonatePage /></PageTransition>} />
          </Route>

          {/* Admin Authentication */}
          <Route path="/admin/login" element={<PageTransition><AdminLoginPage /></PageTransition>} />

          {/* Protected Admin CMS Dashboard Routes */}
          <Route element={<ProtectedRoute />}>
            <Route element={<AdminLayout />}>
              <Route path="/admin" element={<PageTransition><AdminDashboardPage /></PageTransition>} />
              <Route path="/admin/hero-about" element={<PageTransition><AdminHeroAboutPage /></PageTransition>} />
              <Route path="/admin/events" element={<PageTransition><AdminEventsPage /></PageTransition>} />
              <Route path="/admin/sermons" element={<PageTransition><AdminSermonsPage /></PageTransition>} />
              <Route path="/admin/ministries" element={<PageTransition><AdminMinistriesPage /></PageTransition>} />
              <Route path="/admin/gallery" element={<PageTransition><AdminGalleryPage /></PageTransition>} />
              <Route path="/admin/prayers" element={<PageTransition><AdminPrayerPage /></PageTransition>} />
              <Route path="/admin/messages" element={<PageTransition><AdminMessagesPage /></PageTransition>} />
              <Route path="/admin/volunteers" element={<PageTransition><AdminVolunteersPage /></PageTransition>} />
              <Route path="/admin/donations" element={<PageTransition><AdminDonationsPage /></PageTransition>} />
              <Route path="/admin/promises" element={<PageTransition><AdminPromiseVersesPage /></PageTransition>} />
              <Route path="/admin/settings" element={<PageTransition><AdminSettingsPage /></PageTransition>} />
              <Route path="/admin/profile" element={<PageTransition><AdminProfilePage /></PageTransition>} />
            </Route>
          </Route>

          {/* Fallback to Home */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AnimatePresence>
    </Suspense>
  );
};

export default AppRoutes;
