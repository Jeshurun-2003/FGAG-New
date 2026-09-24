import React, { useState, useEffect } from 'react';
import { volunteerService } from '../../services/api';
import { CardSkeleton } from '../../components/common/SkeletonLoader';
import ConfirmDeleteModal from '../../components/admin/ConfirmDeleteModal';
import { useToast } from '../../context/ToastContext';
import SEO from '../../components/common/SEO';

const AdminVolunteersPage = () => {
  const { addToast } = useToast();
  const [volunteers, setVolunteers] = useState([]);
  const [filter, setFilter] = useState('ALL');
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  const [deleteId, setDeleteId] = useState(null);
  const [deleting, setDeleting] = useState(false);

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
      addToast('Failed to fetch volunteer submissions.', 'danger');
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
        addToast(`Submission marked as ${newStatus}.`, 'success');
        fetchVolunteers();
      }
    } catch (err) {
      console.error(err);
      addToast('Status update failed.', 'danger');
    }
  };

  const confirmDelete = async () => {
    if (!deleteId) return;
    setDeleting(true);
    try {
      const res = await volunteerService.delete(deleteId);
      if (res.data.success) {
        addToast('Volunteer submission deleted.', 'success');
        setDeleteId(null);
        fetchVolunteers();
      }
    } catch (err) {
      console.error(err);
      addToast('Delete failed.', 'danger');
    } finally {
      setDeleting(false);
    }
  };

  const filteredVolunteers = volunteers.filter((v) => {
    const q = searchQuery.toLowerCase();
    const ministriesStr = (v.ministriesList || []).join(' ').toLowerCase();
    return (
      v.name?.toLowerCase().includes(q) ||
      v.comingFrom?.toLowerCase().includes(q) ||
      v.profession?.toLowerCase().includes(q) ||
      v.phone?.toLowerCase().includes(q) ||
      ministriesStr.includes(q)
    );
  });

  return (
    <div>
      <SEO title="Manage Volunteer Applications" />

      <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-2">
        <div>
          <h2 className="heading fw-bold mb-1">Volunteer Submissions</h2>
          <p className="text-muted small mb-0">Review believers stepping up to serve in church ministries</p>
        </div>

        <div className="btn-group rounded-pill overflow-hidden shadow-sm">
          <button
            className={`btn btn-sm px-3 ${filter === 'ALL' ? 'btn-primary' : 'btn-outline-primary'}`}
            onClick={() => setFilter('ALL')}
          >
            All
          </button>
          <button
            className={`btn btn-sm px-3 ${filter === 'PENDING' ? 'btn-primary' : 'btn-outline-primary'}`}
            onClick={() => setFilter('PENDING')}
          >
            Pending
          </button>
          <button
            className={`btn btn-sm px-3 ${filter === 'REVIEWED' ? 'btn-primary' : 'btn-outline-primary'}`}
            onClick={() => setFilter('REVIEWED')}
          >
            Reviewed
          </button>
        </div>
      </div>

      {/* Search Bar */}
      <div className="card border-0 shadow-sm rounded-4 p-3 bg-white mb-4">
        <div className="input-group">
          <span className="input-group-text bg-light border-end-0">
            <i className="bi bi-search text-muted"></i>
          </span>
          <input
            type="text"
            className="form-control border-start-0"
            placeholder="Search volunteers by name, town, profession, phone or ministry..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          {searchQuery && (
            <button
              className="btn btn-outline-secondary"
              onClick={() => setSearchQuery('')}
            >
              Clear
            </button>
          )}
        </div>
      </div>

      {loading ? (
        <CardSkeleton count={3} />
      ) : filteredVolunteers.length === 0 ? (
        <div className="card border-0 shadow-sm rounded-4 p-5 text-center bg-white">
          <i className="bi bi-people display-3 text-muted mb-3"></i>
          <h4>No Submissions</h4>
          <p className="text-muted">
            {searchQuery ? 'No volunteer applications match your search query.' : 'No volunteer applications match the selected filter.'}
          </p>
        </div>
      ) : (
        <div className="row g-3">
          {filteredVolunteers.map((v) => (
            <div className="col-12" key={v.id}>
              <div
                className={`card border-0 shadow-sm rounded-4 p-4 bg-white border-start border-4 hover-lift ${
                  v.status === 'REVIEWED' ? 'border-success' : 'border-primary'
                }`}
              >
                <div className="d-flex justify-content-between align-items-start flex-wrap gap-2 mb-2">
                  <div>
                    <h5 className="fw-bold mb-1 text-dark d-flex align-items-center gap-2">
                      <i className="bi bi-person-check-fill text-primary"></i>
                      {v.name}
                      <span className="badge bg-light text-secondary border small fw-normal ms-2">
                        {v.age} yrs • {v.gender}
                      </span>
                    </h5>
                    <div className="text-muted small d-flex flex-wrap gap-3 mt-1">
                      <span>
                        <i className="bi bi-geo-alt me-1 text-danger"></i> From: {v.comingFrom}
                      </span>
                      <span>
                        <i className="bi bi-briefcase me-1 text-info"></i> Profession: {v.profession}
                      </span>
                      <span>
                        <i className="bi bi-telephone me-1 text-success"></i>
                        <a href={`tel:${v.phone}`} className="text-decoration-none text-muted">
                          {v.phone}
                        </a>
                      </span>
                      <span>
                        <i className="bi bi-clock me-1"></i> {new Date(v.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>

                  <div className="d-flex align-items-center gap-2">
                    <span
                      className={`badge ${
                        v.status === 'REVIEWED' ? 'bg-success-subtle text-success border border-success-subtle' : 'bg-primary-subtle text-primary border border-primary-subtle'
                      } px-3 py-2 rounded-pill fw-semibold`}
                    >
                      {v.status}
                    </span>
                    {v.status !== 'REVIEWED' && (
                      <button
                        className="btn btn-sm btn-outline-success rounded-pill px-3"
                        onClick={() => handleStatusChange(v.id, 'REVIEWED')}
                        title="Mark as Reviewed"
                      >
                        <i className="bi bi-check-lg me-1"></i> Mark Reviewed
                      </button>
                    )}
                    {v.status === 'REVIEWED' && (
                      <button
                        className="btn btn-sm btn-outline-secondary rounded-pill px-3"
                        onClick={() => handleStatusChange(v.id, 'PENDING')}
                        title="Mark as Pending"
                      >
                        Re-open
                      </button>
                    )}
                    <button
                      className="btn btn-sm btn-outline-danger rounded-circle"
                      style={{ width: '34px', height: '34px', padding: 0 }}
                      onClick={() => setDeleteId(v.id)}
                      title="Delete submission"
                    >
                      <i className="bi bi-trash"></i>
                    </button>
                  </div>
                </div>

                <div className="mt-3">
                  <strong className="small text-secondary d-block mb-1">Preferred Ministries:</strong>
                  <div className="d-flex flex-wrap gap-1">
                    {(v.ministriesList || []).map((m, idx) => (
                      <span className="badge bg-light text-primary border rounded-pill px-3 py-2 small" key={idx}>
                        <i className="bi bi-check2 text-primary me-1"></i>{m}
                      </span>
                    ))}
                  </div>
                </div>

                {v.message && (
                  <div className="p-3 bg-light rounded-3 mt-3">
                    <strong className="small text-muted d-block mb-1">Message from Volunteer:</strong>
                    <p className="mb-0 paragraph small" style={{ whiteSpace: 'pre-line' }}>
                      {v.message}
                    </p>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Delete Confirmation Modal */}
      <ConfirmDeleteModal
        isOpen={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={confirmDelete}
        loading={deleting}
        title="Delete Volunteer Submission"
        message="Are you sure you want to delete this volunteer application? This cannot be undone."
      />
    </div>
  );
};

export default AdminVolunteersPage;
