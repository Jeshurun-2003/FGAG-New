import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { analyticsService } from '../../services/api';
import AnimatedCounter from '../../components/common/AnimatedCounter';
import { CardSkeleton } from '../../components/common/SkeletonLoader';
import SEO from '../../components/common/SEO';

const AdminDashboardPage = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await analyticsService.getDashboardStats();
        if (res.data.success) {
          setData(res.data);
        }
      } catch (err) {
        console.error('Failed to load dashboard metrics', err);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="py-4">
        <div className="skeleton-box rounded-3 w-25 mb-4" style={{ height: '32px' }} />
        <CardSkeleton count={4} />
      </div>
    );
  }

  const stats = data?.stats || {};
  const recentPrayers = data?.recentPrayers || [];
  const recentVolunteers = data?.recentVolunteers || [];

  return (
    <div>
      <SEO title="Admin Dashboard" />

      <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-2">
        <div>
          <h2 className="heading fw-bold mb-1">Church CMS Overview</h2>
          <p className="text-muted small mb-0">Real-time metrics and website management shortcuts</p>
        </div>
        <div className="d-flex gap-2 flex-wrap">
          <Link to="/admin/sermons" className="btn btn-sm btn-primary rounded-pill px-3 py-2 d-flex align-items-center gap-1 shadow-sm">
            <i className="bi bi-play-circle"></i> Add Sermon
          </Link>
          <Link to="/admin/events" className="btn btn-sm btn-outline-primary rounded-pill px-3 py-2 d-flex align-items-center gap-1 shadow-sm">
            <i className="bi bi-calendar-plus"></i> Add Event
          </Link>
          <Link to="/admin/messages" className="btn btn-sm btn-outline-info rounded-pill px-3 py-2 d-flex align-items-center gap-1 shadow-sm">
            <i className="bi bi-envelope"></i> Messages
            {stats.pendingMessages > 0 && (
              <span className="badge bg-warning text-dark rounded-pill ms-1">{stats.pendingMessages}</span>
            )}
          </Link>
          <Link to="/admin/donations" className="btn btn-sm btn-outline-success rounded-pill px-3 py-2 d-flex align-items-center gap-1 shadow-sm">
            <i className="bi bi-cash-coin"></i> Donations
          </Link>
          <Link to="/admin/gallery" className="btn btn-sm btn-outline-secondary rounded-pill px-3 py-2 d-flex align-items-center gap-1 shadow-sm">
            <i className="bi bi-upload"></i> Upload Photo
          </Link>
        </div>
      </div>

      {/* Metrics Row with Animated Counters */}
      <div className="row g-3 mb-4">
        <div className="col-sm-6 col-md-4 col-xl">
          <motion.div
            className="card border-0 shadow-sm rounded-4 p-3 bg-white h-100 border-start border-4 border-primary hover-lift"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="d-flex justify-content-between align-items-center">
              <div>
                <span className="text-muted small text-uppercase fw-semibold">Upcoming Events</span>
                <h3 className="fw-bold mb-0 mt-1 text-dark display-6 fs-2">
                  <AnimatedCounter to={stats.totalEvents ?? 0} />
                </h3>
              </div>
              <div className="bg-primary-subtle text-primary p-3 rounded-circle">
                <i className="bi bi-calendar-event fs-4"></i>
              </div>
            </div>
            <Link to="/admin/events" className="stretched-link small text-decoration-none mt-3 d-inline-flex align-items-center gap-1 text-primary fw-medium">
              Manage events <i className="bi bi-arrow-right"></i>
            </Link>
          </motion.div>
        </div>

        <div className="col-sm-6 col-md-4 col-xl">
          <motion.div
            className="card border-0 shadow-sm rounded-4 p-3 bg-white h-100 border-start border-4 border-danger hover-lift"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.05 }}
          >
            <div className="d-flex justify-content-between align-items-center">
              <div>
                <span className="text-muted small text-uppercase fw-semibold">Sermons & Media</span>
                <h3 className="fw-bold mb-0 mt-1 text-dark display-6 fs-2">
                  <AnimatedCounter to={stats.totalSermons ?? 0} />
                </h3>
              </div>
              <div className="bg-danger-subtle text-danger p-3 rounded-circle">
                <i className="bi bi-play-btn fs-4"></i>
              </div>
            </div>
            <Link to="/admin/sermons" className="stretched-link small text-decoration-none mt-3 d-inline-flex align-items-center gap-1 text-danger fw-medium">
              Manage sermons <i className="bi bi-arrow-right"></i>
            </Link>
          </motion.div>
        </div>

        <div className="col-sm-6 col-md-4 col-xl">
          <motion.div
            className="card border-0 shadow-sm rounded-4 p-3 bg-white h-100 border-start border-4 border-info hover-lift"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.1 }}
          >
            <div className="d-flex justify-content-between align-items-center">
              <div>
                <span className="text-muted small text-uppercase fw-semibold">Active Ministries</span>
                <h3 className="fw-bold mb-0 mt-1 text-dark display-6 fs-2">
                  <AnimatedCounter to={stats.totalMinistries ?? 0} />
                </h3>
              </div>
              <div className="bg-info-subtle text-info p-3 rounded-circle">
                <i className="bi bi-people fs-4"></i>
              </div>
            </div>
            <Link to="/admin/ministries" className="stretched-link small text-decoration-none mt-3 d-inline-flex align-items-center gap-1 text-info fw-medium">
              Manage ministries <i className="bi bi-arrow-right"></i>
            </Link>
          </motion.div>
        </div>

        <div className="col-sm-6 col-md-6 col-xl">
          <motion.div
            className="card border-0 shadow-sm rounded-4 p-3 bg-white h-100 border-start border-4 border-success hover-lift"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.15 }}
          >
            <div className="d-flex justify-content-between align-items-center">
              <div>
                <span className="text-muted small text-uppercase fw-semibold">Contact Messages</span>
                <h3 className="fw-bold mb-0 mt-1 text-dark display-6 fs-2">
                  <AnimatedCounter to={stats.totalMessages ?? 0} />
                </h3>
              </div>
              <div className="bg-success-subtle text-success p-3 rounded-circle">
                <i className="bi bi-envelope fs-4"></i>
              </div>
            </div>
            <div className="d-flex justify-content-between align-items-center small mt-3">
              <Link to="/admin/messages" className="text-decoration-none text-success fw-medium">
                Manage messages <i className="bi bi-arrow-right"></i>
              </Link>
              {stats.pendingMessages > 0 && (
                <span className="badge bg-warning-subtle text-warning-emphasis rounded-pill">
                  {stats.pendingMessages} pending
                </span>
              )}
            </div>
          </motion.div>
        </div>

        <div className="col-sm-6 col-md-6 col-xl">
          <motion.div
            className="card border-0 shadow-sm rounded-4 p-3 bg-white h-100 border-start border-4 border-warning hover-lift"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.2 }}
          >
            <div className="d-flex justify-content-between align-items-center">
              <div>
                <span className="text-muted small text-uppercase fw-semibold">Pending Prayers</span>
                <h3 className="fw-bold mb-0 mt-1 text-dark display-6 fs-2">
                  <AnimatedCounter to={stats.pendingPrayers ?? 0} />
                </h3>
              </div>
              <div className="bg-warning-subtle text-warning p-3 rounded-circle">
                <i className="bi bi-chat-heart fs-4"></i>
              </div>
            </div>
            <div className="d-flex gap-2 small mt-3">
              <Link to="/admin/prayers" className="text-decoration-none text-warning-emphasis fw-medium">
                {stats.pendingPrayers ?? 0} prayers
              </Link>
              <span>•</span>
              <Link to="/admin/volunteers" className="text-decoration-none text-warning-emphasis fw-medium">
                {stats.pendingVolunteers ?? 0} volunteers
              </Link>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Quick Access Cards */}
      <div className="row g-3 mb-5">
        <div className="col-md-4">
          <div className="card border-0 shadow-sm rounded-4 p-4 bg-white h-100 hover-lift">
            <h5 className="fw-bold heading mb-2 d-flex align-items-center gap-2">
              <i className="bi bi-pencil-square text-primary"></i> Content Editor
            </h5>
            <p className="text-muted small mb-3">
              Change the Hero banners, Scripture promises, Pastor's welcome, and About page paragraphs directly.
            </p>
            <Link to="/admin/hero-about" className="btn btn-outline-primary btn-sm rounded-pill mt-auto">
              Open Content Editor &rarr;
            </Link>
          </div>
        </div>

        <div className="col-md-4">
          <div className="card border-0 shadow-sm rounded-4 p-4 bg-white h-100 hover-lift">
            <h5 className="fw-bold heading mb-2 d-flex align-items-center gap-2">
              <i className="bi bi-gear text-primary"></i> Church Details & Settings
            </h5>
            <p className="text-muted small mb-3">
              Update phone numbers, church address, bank accounts for offerings, and social media handles.
            </p>
            <Link to="/admin/settings" className="btn btn-outline-primary btn-sm rounded-pill mt-auto">
              Edit Settings &rarr;
            </Link>
          </div>
        </div>

        <div className="col-md-4">
          <div className="card border-0 shadow-sm rounded-4 p-4 bg-white h-100 hover-lift">
            <h5 className="fw-bold heading mb-2 d-flex align-items-center gap-2">
              <i className="bi bi-person-badge text-primary"></i> Volunteer Applications
            </h5>
            <p className="text-muted small mb-3">
              Review believers who signed up to serve in choir, media, cleaning, and teaching ministries.
            </p>
            <Link to="/admin/volunteers" className="btn btn-outline-primary btn-sm rounded-pill mt-auto">
              Review Submissions ({stats.totalVolunteers ?? 0}) &rarr;
            </Link>
          </div>
        </div>
      </div>

      {/* Recent Tables Row */}
      <div className="row g-4">
        {/* Recent Prayers */}
        <div className="col-lg-6">
          <div className="card border-0 shadow-sm rounded-4 bg-white p-4 h-100">
            <div className="d-flex justify-content-between align-items-center mb-3">
              <h5 className="fw-bold heading mb-0">Recent Prayer Requests</h5>
              <Link to="/admin/prayers" className="small text-decoration-none fw-semibold">
                View All &rarr;
              </Link>
            </div>
            {recentPrayers.length === 0 ? (
              <p className="text-muted small my-3">No prayer requests received yet.</p>
            ) : (
              <div className="list-group list-group-flush">
                {recentPrayers.map((p) => (
                  <div className="list-group-item px-0 py-3 border-light-subtle" key={p.id}>
                    <div className="d-flex justify-content-between align-items-start mb-1">
                      <strong className="text-dark small">{p.name}</strong>
                      <span className={`badge ${p.status === 'PRAYED' ? 'bg-success' : 'bg-warning text-dark'} small rounded-pill px-2 py-1`}>
                        {p.status}
                      </span>
                    </div>
                    <p className="text-muted small mb-1 text-truncate">{p.message}</p>
                    <span className="text-secondary small" style={{ fontSize: '0.75rem' }}>
                      {new Date(p.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Recent Volunteers */}
        <div className="col-lg-6">
          <div className="card border-0 shadow-sm rounded-4 bg-white p-4 h-100">
            <div className="d-flex justify-content-between align-items-center mb-3">
              <h5 className="fw-bold heading mb-0">Recent Volunteer Signups</h5>
              <Link to="/admin/volunteers" className="small text-decoration-none fw-semibold">
                View All &rarr;
              </Link>
            </div>
            {recentVolunteers.length === 0 ? (
              <p className="text-muted small my-3">No volunteer submissions yet.</p>
            ) : (
              <div className="list-group list-group-flush">
                {recentVolunteers.map((v) => (
                  <div className="list-group-item px-0 py-3 border-light-subtle" key={v.id}>
                    <div className="d-flex justify-content-between align-items-start mb-1">
                      <div>
                        <strong className="text-dark small">{v.name}</strong>
                        <span className="text-muted small ms-2">
                          ({v.profession || 'Volunteer'}, {v.comingFrom})
                        </span>
                      </div>
                      <span className={`badge ${v.status === 'REVIEWED' ? 'bg-success' : 'bg-primary'} small rounded-pill px-2 py-1`}>
                        {v.status}
                      </span>
                    </div>
                    <div className="d-flex flex-wrap gap-1 mb-1">
                      {(v.ministriesList || []).map((m, idx) => (
                        <span className="badge bg-light text-primary border small rounded-pill" key={idx}>
                          {m}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboardPage;
