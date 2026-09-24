import React, { useState, useEffect } from 'react';
import { volunteerService } from '../../services/api';
import LoadingSpinner from '../../components/common/LoadingSpinner';

const AdminVolunteersPage = () => {
  const [volunteers, setVolunteers] = useState([]);
  const [filter, setFilter] = useState('ALL');
  const [loading, setLoading] = useState(true);
  const [statusMsg, setStatusMsg] = useState(null);

  const fetchVolunteers = async () => {
    try {
      setLoading(true);
      const q = filter === 'ALL' ? '' : filter;
      const res = await volunteerService.getAll(q);
      if (res.data.success) {
        setVolunteers(res.data.submissions);
      }
    } catch (err) {
      console.error(err);
      setStatusMsg({ type: 'danger', text: 'Failed to fetch volunteer submissions.' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVolunteers();
  }, [filter]);

  const handleStatusChange = async (id, newStatus) => {
    try {
      const res = await volunteerService.updateStatus(id, newStatus);
      if (res.data.success) {
        setStatusMsg({ type: 'success', text: `Submission marked as ${newStatus}.` });
        fetchVolunteers();
      }
    } catch (err) {
      console.error(err);
      setStatusMsg({ type: 'danger', text: 'Status update failed.' });
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this volunteer submission?')) return;
    try {
      const res = await volunteerService.delete(id);
      if (res.data.success) {
        setStatusMsg({ type: 'success', text: 'Volunteer submission deleted.' });
        fetchVolunteers();
      }
    } catch (err) {
      console.error(err);
      setStatusMsg({ type: 'danger', text: 'Delete failed.' });
    }
  };

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-2">
        <div>
          <h2 className="heading fw-bold mb-1">Volunteer Submissions</h2>
          <p className="text-muted small mb-0">Review believers stepping up to serve in church ministries</p>
        </div>

        <div className="btn-group">
          <button
            className={`btn btn-sm ${filter === 'ALL' ? 'btn-primary' : 'btn-outline-primary'}`}
            onClick={() => setFilter('ALL')}
          >
            All
          </button>
          <button
            className={`btn btn-sm ${filter === 'PENDING' ? 'btn-primary' : 'btn-outline-primary'}`}
            onClick={() => setFilter('PENDING')}
          >
            Pending
          </button>
          <button
            className={`btn btn-sm ${filter === 'REVIEWED' ? 'btn-primary' : 'btn-outline-primary'}`}
            onClick={() => setFilter('REVIEWED')}
          >
            Reviewed
          </button>
        </div>
      </div>

      {statusMsg && (
        <div className={`alert alert-${statusMsg.type} alert-dismissible fade show mb-4`} role="alert">
          {statusMsg.text}
          <button type="button" className="btn-close" onClick={() => setStatusMsg(null)}></button>
        </div>
      )}

      {loading ? (
        <LoadingSpinner message="Loading volunteer applications..." />
      ) : volunteers.length === 0 ? (
        <div className="card border-0 shadow-sm rounded-4 p-5 text-center bg-white">
          <i className="bi bi-people display-3 text-muted mb-3"></i>
          <h4>No Submissions</h4>
          <p className="text-muted">No volunteer submissions match the current filter.</p>
        </div>
      ) : (
        <div className="row g-3">
          {volunteers.map((v) => (
            <div className="col-12" key={v.id}>
              <div
                className={`card border-0 shadow-sm rounded-4 p-4 bg-white border-start border-4 ${
                  v.status === 'REVIEWED' ? 'border-success' : 'border-primary'
                }`}
              >
                <div className="d-flex justify-content-between align-items-start flex-wrap gap-2 mb-2">
                  <div>
                    <h5 className="fw-bold mb-1 text-dark">
                      {v.name}
                      <span className="badge bg-light text-secondary border ms-2 fw-normal small">
                        {v.gender} • {v.age} yrs
                      </span>
                    </h5>
                    <p className="text-muted small mb-2">
                      <span className="me-3">
                        <i className="bi bi-geo-alt me-1 text-primary"></i>
                        From: <strong>{v.comingFrom}</strong>
                      </span>
                      <span className="me-3">
                        <i className="bi bi-briefcase me-1 text-primary"></i>
                        Profession: <strong>{v.profession}</strong>
                      </span>
                      <span>
                        <i className="bi bi-telephone me-1 text-primary"></i>
                        <a href={`tel:${v.phone}`} className="text-decoration-none text-dark fw-semibold">
                          {v.phone}
                        </a>
                      </span>
                    </p>
                  </div>

                  <div className="d-flex align-items-center gap-2">
                    <span className={`badge ${v.status === 'REVIEWED' ? 'bg-success' : 'bg-primary'} px-3 py-2`}>
                      {v.status}
                    </span>
                    {v.status !== 'REVIEWED' ? (
                      <button
                        className="btn btn-sm btn-outline-success"
                        onClick={() => handleStatusChange(v.id, 'REVIEWED')}
                        title="Mark as Reviewed"
                      >
                        <i className="bi bi-check-lg me-1"></i> Mark Reviewed
                      </button>
                    ) : (
                      <button
                        className="btn btn-sm btn-outline-secondary"
                        onClick={() => handleStatusChange(v.id, 'PENDING')}
                        title="Mark as Pending"
                      >
                        Set Pending
                      </button>
                    )}
                    <button
                      className="btn btn-sm btn-outline-danger"
                      onClick={() => handleDelete(v.id)}
                      title="Delete submission"
                    >
                      <i className="bi bi-trash"></i>
                    </button>
                  </div>
                </div>

                {/* Selected Ministries */}
                <div className="mb-3">
                  <span className="small text-muted d-block mb-1 fw-semibold">Ministries Chosen to Serve:</span>
                  <div className="d-flex flex-wrap gap-2">
                    {(v.ministriesList || []).length > 0 ? (
                      v.ministriesList.map((m, idx) => (
                        <span className="badge bg-primary-subtle text-primary border border-primary-subtle px-2 py-1" key={idx}>
                          <i className="bi bi-tag-fill me-1 small"></i> {m}
                        </span>
                      ))
                    ) : (
                      <span className="text-muted small">No specific ministry selected</span>
                    )}
                  </div>
                </div>

                {/* Optional Message */}
                {v.message && (
                  <div className="p-3 bg-light rounded-3 mt-2">
                    <span className="small text-muted fw-bold d-block mb-1">Personal Note:</span>
                    <p className="mb-0 small text-secondary" style={{ whiteSpace: 'pre-line' }}>
                      {v.message}
                    </p>
                  </div>
                )}

                <div className="mt-2 text-end text-muted small" style={{ fontSize: '0.75rem' }}>
                  Submitted on: {new Date(v.createdAt).toLocaleString()}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminVolunteersPage;
