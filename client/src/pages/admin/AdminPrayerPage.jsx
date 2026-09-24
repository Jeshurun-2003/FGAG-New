import React, { useState, useEffect } from 'react';
import { prayerService } from '../../services/api';
import LoadingSpinner from '../../components/common/LoadingSpinner';

const AdminPrayerPage = () => {
  const [prayers, setPrayers] = useState([]);
  const [filter, setFilter] = useState('ALL');
  const [loading, setLoading] = useState(true);
  const [statusMsg, setStatusMsg] = useState(null);

  const fetchPrayers = async () => {
    try {
      setLoading(true);
      const queryStatus = filter === 'ALL' ? '' : filter;
      const res = await prayerService.getAll(queryStatus);
      if (res.data.success) {
        setPrayers(res.data.requests);
      }
    } catch (err) {
      console.error(err);
      setStatusMsg({ type: 'danger', text: 'Failed to fetch prayer requests.' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPrayers();
  }, [filter]);

  const handleStatusChange = async (id, newStatus) => {
    try {
      const res = await prayerService.updateStatus(id, newStatus);
      if (res.data.success) {
        setStatusMsg({ type: 'success', text: `Prayer request marked as ${newStatus}.` });
        fetchPrayers();
      }
    } catch (err) {
      console.error(err);
      setStatusMsg({ type: 'danger', text: 'Could not update status.' });
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this prayer request?')) return;
    try {
      const res = await prayerService.delete(id);
      if (res.data.success) {
        setStatusMsg({ type: 'success', text: 'Prayer request removed.' });
        fetchPrayers();
      }
    } catch (err) {
      console.error(err);
      setStatusMsg({ type: 'danger', text: 'Failed to delete prayer request.' });
    }
  };

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-2">
        <div>
          <h2 className="heading fw-bold mb-1">Prayer Requests</h2>
          <p className="text-muted small mb-0">Petitions submitted by believers and visitors</p>
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
            className={`btn btn-sm ${filter === 'PRAYED' ? 'btn-primary' : 'btn-outline-primary'}`}
            onClick={() => setFilter('PRAYED')}
          >
            Prayed For
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
        <LoadingSpinner message="Loading prayer requests..." />
      ) : prayers.length === 0 ? (
        <div className="card border-0 shadow-sm rounded-4 p-5 text-center bg-white">
          <i className="bi bi-chat-square-heart display-3 text-muted mb-3"></i>
          <h4>No Prayer Requests</h4>
          <p className="text-muted">No prayer requests match the selected filter.</p>
        </div>
      ) : (
        <div className="row g-3">
          {prayers.map((p) => (
            <div className="col-12" key={p.id}>
              <div
                className={`card border-0 shadow-sm rounded-4 p-4 bg-white border-start border-4 ${
                  p.status === 'PRAYED' ? 'border-success' : 'border-warning'
                }`}
              >
                <div className="d-flex justify-content-between align-items-start flex-wrap gap-2 mb-2">
                  <div>
                    <h5 className="fw-bold mb-1 text-dark">{p.name}</h5>
                    <div className="text-muted small d-flex flex-wrap gap-3">
                      <span>
                        <i className="bi bi-envelope me-1"></i>
                        <a href={`mailto:${p.email}`} className="text-decoration-none text-muted">
                          {p.email}
                        </a>
                      </span>
                      {p.phone && (
                        <span>
                          <i className="bi bi-telephone me-1"></i>
                          <a href={`tel:${p.phone}`} className="text-decoration-none text-muted">
                            {p.phone}
                          </a>
                        </span>
                      )}
                      <span>
                        <i className="bi bi-clock me-1"></i>
                        {new Date(p.createdAt).toLocaleString()}
                      </span>
                    </div>
                  </div>

                  <div className="d-flex align-items-center gap-2">
                    <span
                      className={`badge ${
                        p.status === 'PRAYED' ? 'bg-success' : 'bg-warning text-dark'
                      } px-3 py-2`}
                    >
                      {p.status}
                    </span>
                    {p.status !== 'PRAYED' && (
                      <button
                        className="btn btn-sm btn-outline-success"
                        onClick={() => handleStatusChange(p.id, 'PRAYED')}
                        title="Mark as Prayed"
                      >
                        <i className="bi bi-check-lg me-1"></i> Mark Prayed
                      </button>
                    )}
                    {p.status === 'PRAYED' && (
                      <button
                        className="btn btn-sm btn-outline-secondary"
                        onClick={() => handleStatusChange(p.id, 'PENDING')}
                        title="Mark as Pending"
                      >
                        Re-open
                      </button>
                    )}
                    <button
                      className="btn btn-sm btn-outline-danger"
                      onClick={() => handleDelete(p.id)}
                      title="Delete request"
                    >
                      <i className="bi bi-trash"></i>
                    </button>
                  </div>
                </div>

                <div className="p-3 bg-light rounded-3 mt-3">
                  <p className="mb-0 paragraph" style={{ whiteSpace: 'pre-line' }}>
                    {p.message}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminPrayerPage;
