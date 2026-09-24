import React, { useState, useEffect } from 'react';
import { prayerService } from '../../services/api';
import { CardSkeleton } from '../../components/common/SkeletonLoader';
import ConfirmDeleteModal from '../../components/admin/ConfirmDeleteModal';
import { useToast } from '../../context/ToastContext';
import SEO from '../../components/common/SEO';

const AdminPrayerPage = () => {
  const { addToast } = useToast();
  const [prayers, setPrayers] = useState([]);
  const [filter, setFilter] = useState('ALL');
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  const [deleteId, setDeleteId] = useState(null);
  const [deleting, setDeleting] = useState(false);

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
      addToast('Failed to fetch prayer requests.', 'danger');
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
        addToast(`Prayer request marked as ${newStatus}.`, 'success');
        fetchPrayers();
      }
    } catch (err) {
      console.error(err);
      addToast('Could not update status.', 'danger');
    }
  };

  const confirmDelete = async () => {
    if (!deleteId) return;
    setDeleting(true);
    try {
      const res = await prayerService.delete(deleteId);
      if (res.data.success) {
        addToast('Prayer request removed.', 'success');
        setDeleteId(null);
        fetchPrayers();
      }
    } catch (err) {
      console.error(err);
      addToast('Failed to delete prayer request.', 'danger');
    } finally {
      setDeleting(false);
    }
  };

  const filteredPrayers = prayers.filter((p) => {
    const q = searchQuery.toLowerCase();
    return (
      p.name?.toLowerCase().includes(q) ||
      p.email?.toLowerCase().includes(q) ||
      p.phone?.toLowerCase().includes(q) ||
      p.message?.toLowerCase().includes(q)
    );
  });

  return (
    <div>
      <SEO title="Manage Prayer Requests" />

      <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-2">
        <div>
          <h2 className="heading fw-bold mb-1">Prayer Requests</h2>
          <p className="text-muted small mb-0">Petitions submitted by believers and visitors</p>
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
            className={`btn btn-sm px-3 ${filter === 'PRAYED' ? 'btn-primary' : 'btn-outline-primary'}`}
            onClick={() => setFilter('PRAYED')}
          >
            Prayed For
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
            placeholder="Search prayers by person's name, email, phone or keywords..."
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
      ) : filteredPrayers.length === 0 ? (
        <div className="card border-0 shadow-sm rounded-4 p-5 text-center bg-white">
          <i className="bi bi-chat-square-heart display-3 text-muted mb-3"></i>
          <h4>No Prayer Requests</h4>
          <p className="text-muted">
            {searchQuery ? 'No prayer requests matched your search query.' : 'No prayer requests match the selected filter.'}
          </p>
        </div>
      ) : (
        <div className="row g-3">
          {filteredPrayers.map((p) => (
            <div className="col-12" key={p.id}>
              <div
                className={`card border-0 shadow-sm rounded-4 p-4 bg-white border-start border-4 hover-lift ${
                  p.status === 'PRAYED' ? 'border-success' : 'border-warning'
                }`}
              >
                <div className="d-flex justify-content-between align-items-start flex-wrap gap-2 mb-2">
                  <div>
                    <h5 className="fw-bold mb-1 text-dark d-flex align-items-center gap-2">
                      <i className="bi bi-person-fill text-primary"></i>
                      {p.name}
                    </h5>
                    <div className="text-muted small d-flex flex-wrap gap-3 mt-1">
                      <span>
                        <i className="bi bi-envelope me-1 text-info"></i>
                        <a href={`mailto:${p.email}`} className="text-decoration-none text-muted">
                          {p.email}
                        </a>
                      </span>
                      {p.phone && (
                        <span>
                          <i className="bi bi-telephone me-1 text-success"></i>
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
                        p.status === 'PRAYED' ? 'bg-success-subtle text-success border border-success-subtle' : 'bg-warning-subtle text-warning-emphasis border border-warning-subtle'
                      } px-3 py-2 rounded-pill fw-semibold`}
                    >
                      {p.status}
                    </span>
                    {p.status !== 'PRAYED' && (
                      <button
                        className="btn btn-sm btn-outline-success rounded-pill px-3"
                        onClick={() => handleStatusChange(p.id, 'PRAYED')}
                        title="Mark as Prayed"
                      >
                        <i className="bi bi-check-lg me-1"></i> Mark Prayed
                      </button>
                    )}
                    {p.status === 'PRAYED' && (
                      <button
                        className="btn btn-sm btn-outline-secondary rounded-pill px-3"
                        onClick={() => handleStatusChange(p.id, 'PENDING')}
                        title="Mark as Pending"
                      >
                        Re-open
                      </button>
                    )}
                    <button
                      className="btn btn-sm btn-outline-danger rounded-circle"
                      style={{ width: '34px', height: '34px', padding: 0 }}
                      onClick={() => setDeleteId(p.id)}
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

      {/* Delete Confirmation Modal */}
      <ConfirmDeleteModal
        isOpen={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={confirmDelete}
        loading={deleting}
        title="Delete Prayer Request"
        message="Are you sure you want to delete this prayer request? This will remove it permanently."
      />
    </div>
  );
};

export default AdminPrayerPage;
