import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { analyticsService } from '../../services/api';
import LoadingSpinner from '../../components/common/LoadingSpinner';

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
    return <LoadingSpinner message="Loading dashboard analytics..." />;
  }

  const stats = data?.stats || {};
  const recentPrayers = data?.recentPrayers || [];
  const recentVolunteers = data?.recentVolunteers || [];

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-2">
        <div>
          <h2 className="heading fw-bold mb-1">Church CMS Overview</h2>
          <p className="text-muted small mb-0">Real-time metrics and website management shortcuts</p>
        </div>
        <div className="d-flex gap-2">
          <Link to="/admin/events" className="btn btn-sm btn-primary">
            <i className="bi bi-plus-circle me-1"></i> Add Event
          </Link>
          <Link to="/admin/gallery" className="btn btn-sm btn-outline-primary">
            <i className="bi bi-upload me-1"></i> Upload Photo
          </Link>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="row g-3 mb-4">
        <div className="col-sm-6 col-xl-3">
          <div className="card border-0 shadow-sm rounded-4 p-3 bg-white h-100 border-start border-4 border-primary">
            <div className="d-flex justify-content-between align-items-center">
              <div>
                <span className="text-muted small text-uppercase fw-semibold">Upcoming Events</span>
                <h3 className="fw-bold mb-0 mt-1">{stats.totalEvents ?? 0}</h3>
              </div>
              <div className="bg-primary-subtle text-primary p-3 rounded-circle">
                <i className="bi bi-calendar-event fs-4"></i>
              </div>
            </div>
            <Link to="/admin/events" className="stretched-link small text-decoration-none mt-2 d-inline-block">
              Manage events &rarr;
            </Link>
          </div>
        </div>

        <div className="col-sm-6 col-xl-3">
          <div className="card border-0 shadow-sm rounded-4 p-3 bg-white h-100 border-start border-4 border-info">
            <div className="d-flex justify-content-between align-items-center">
              <div>
                <span className="text-muted small text-uppercase fw-semibold">Active Ministries</span>
                <h3 className="fw-bold mb-0 mt-1">{stats.totalMinistries ?? 0}</h3>
              </div>
              <div className="bg-info-subtle text-info p-3 rounded-circle">
                <i className="bi bi-people fs-4"></i>
              </div>
            </div>
            <Link to="/admin/ministries" className="stretched-link small text-decoration-none mt-2 d-inline-block">
              Manage ministries &rarr;
            </Link>
          </div>
        </div>

        <div className="col-sm-6 col-xl-3">
          <div className="card border-0 shadow-sm rounded-4 p-3 bg-white h-100 border-start border-4 border-success">
            <div className="d-flex justify-content-between align-items-center">
              <div>
                <span className="text-muted small text-uppercase fw-semibold">Gallery Photos</span>
                <h3 className="fw-bold mb-0 mt-1">{stats.totalPhotos ?? 0}</h3>
              </div>
              <div className="bg-success-subtle text-success p-3 rounded-circle">
                <i className="bi bi-images fs-4"></i>
              </div>
            </div>
            <Link to="/admin/gallery" className="stretched-link small text-decoration-none mt-2 d-inline-block">
              Manage photos &rarr;
            </Link>
          </div>
        </div>

        <div className="col-sm-6 col-xl-3">
          <div className="card border-0 shadow-sm rounded-4 p-3 bg-white h-100 border-start border-4 border-warning">
            <div className="d-flex justify-content-between align-items-center">
              <div>
                <span className="text-muted small text-uppercase fw-semibold">Pending Requests</span>
                <h3 className="fw-bold mb-0 mt-1">
                  {(stats.pendingPrayers ?? 0) + (stats.pendingVolunteers ?? 0)}
                </h3>
              </div>
              <div className="bg-warning-subtle text-warning p-3 rounded-circle">
                <i className="bi bi-envelope-open fs-4"></i>
              </div>
            </div>
            <div className="d-flex gap-2 small mt-2">
              <Link to="/admin/prayers" className="text-decoration-none">
                {stats.pendingPrayers ?? 0} prayers
              </Link>
              <span>•</span>
              <Link to="/admin/volunteers" className="text-decoration-none">
                {stats.pendingVolunteers ?? 0} volunteers
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Access Cards */}
      <div className="row g-3 mb-5">
        <div className="col-md-4">
          <div className="card border-0 shadow-sm rounded-4 p-3 bg-white">
            <h5 className="fw-bold heading mb-2">
              <i className="bi bi-pencil-square text-primary me-2"></i> Content Editor
            </h5>
            <p className="text-muted small mb-3">
              Change the Hero banners, Scripture promises, Pastor's welcome, and About page paragraphs directly.
            </p>
            <Link to="/admin/hero-about" className="btn btn-outline-primary btn-sm">
              Open Content Editor
            </Link>
          </div>
        </div>

        <div className="col-md-4">
          <div className="card border-0 shadow-sm rounded-4 p-3 bg-white">
            <h5 className="fw-bold heading mb-2">
              <i className="bi bi-gear text-primary me-2"></i> Church Details & Settings
            </h5>
            <p className="text-muted small mb-3">
              Update phone numbers, church address, bank accounts for offerings, and social media handles.
            </p>
            <Link to="/admin/settings" className="btn btn-outline-primary btn-sm">
              Edit Settings
            </Link>
          </div>
        </div>

        <div className="col-md-4">
          <div className="card border-0 shadow-sm rounded-4 p-3 bg-white">
            <h5 className="fw-bold heading mb-2">
              <i className="bi bi-person-badge text-primary me-2"></i> Volunteer Applications
            </h5>
            <p className="text-muted small mb-3">
              Review believers who signed up to serve in choir, media, cleaning, and teaching ministries.
            </p>
            <Link to="/admin/volunteers" className="btn btn-outline-primary btn-sm">
              Review Submissions ({stats.totalVolunteers ?? 0})
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
              <Link to="/admin/prayers" className="small text-decoration-none">
                View All &rarr;
              </Link>
            </div>
            {recentPrayers.length === 0 ? (
              <p className="text-muted small my-3">No prayer requests received yet.</p>
            ) : (
              <div className="list-group list-group-flush">
                {recentPrayers.map((p) => (
                  <div className="list-group-item px-0 py-2 border-light-subtle" key={p.id}>
                    <div className="d-flex justify-content-between align-items-start mb-1">
                      <strong className="text-dark small">{p.name}</strong>
                      <span className={`badge ${p.status === 'PRAYED' ? 'bg-success' : 'bg-warning text-dark'} small`}>
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
              <Link to="/admin/volunteers" className="small text-decoration-none">
                View All &rarr;
              </Link>
            </div>
            {recentVolunteers.length === 0 ? (
              <p className="text-muted small my-3">No volunteer submissions yet.</p>
            ) : (
              <div className="list-group list-group-flush">
                {recentVolunteers.map((v) => (
                  <div className="list-group-item px-0 py-2 border-light-subtle" key={v.id}>
                    <div className="d-flex justify-content-between align-items-start mb-1">
                      <div>
                        <strong className="text-dark small">{v.name}</strong>
                        <span className="text-muted small ms-2">
                          ({v.profession || 'Volunteer'}, {v.comingFrom})
                        </span>
                      </div>
                      <span className={`badge ${v.status === 'REVIEWED' ? 'bg-success' : 'bg-primary'} small`}>
                        {v.status}
                      </span>
                    </div>
                    <div className="d-flex flex-wrap gap-1 mb-1">
                      {(v.ministriesList || []).map((m, idx) => (
                        <span className="badge bg-light text-primary border small" key={idx}>
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
