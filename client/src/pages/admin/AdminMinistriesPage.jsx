import React, { useState, useEffect } from 'react';
import { ministriesService } from '../../services/api';
import LoadingSpinner from '../../components/common/LoadingSpinner';

const AdminMinistriesPage = () => {
  const [ministries, setMinistries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [statusMsg, setStatusMsg] = useState(null);

  const [modalOpen, setModalOpen] = useState(false);
  const [editingMinistry, setEditingMinistry] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    details: '',
    order: 0,
    isActive: true,
    image: null
  });

  const fetchMinistries = async () => {
    try {
      setLoading(true);
      const res = await ministriesService.getAllAdmin();
      if (res.data.success) {
        setMinistries(res.data.ministries);
      }
    } catch (err) {
      console.error(err);
      setStatusMsg({ type: 'danger', text: 'Failed to fetch ministries.' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMinistries();
  }, []);

  const openCreateModal = () => {
    setEditingMinistry(null);
    setFormData({
      title: '',
      description: '',
      details: '',
      order: ministries.length + 1,
      isActive: true,
      image: null
    });
    setModalOpen(true);
  };

  const openEditModal = (m) => {
    setEditingMinistry(m);
    setFormData({
      title: m.title || '',
      description: m.description || '',
      details: m.details || '',
      order: m.order || 0,
      isActive: m.isActive,
      image: null
    });
    setModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this ministry?')) return;
    try {
      const res = await ministriesService.delete(id);
      if (res.data.success) {
        setStatusMsg({ type: 'success', text: 'Ministry deleted successfully.' });
        fetchMinistries();
      }
    } catch (err) {
      console.error(err);
      setStatusMsg({ type: 'danger', text: 'Failed to delete ministry.' });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setStatusMsg(null);

    const payload = new FormData();
    payload.append('title', formData.title);
    payload.append('description', formData.description);
    payload.append('details', formData.details);
    payload.append('order', formData.order);
    payload.append('isActive', formData.isActive);
    if (formData.image) {
      payload.append('image', formData.image);
    }

    try {
      if (editingMinistry) {
        await ministriesService.update(editingMinistry.id, payload);
        setStatusMsg({ type: 'success', text: 'Ministry updated successfully.' });
      } else {
        await ministriesService.create(payload);
        setStatusMsg({ type: 'success', text: 'New ministry created.' });
      }
      setModalOpen(false);
      fetchMinistries();
    } catch (err) {
      console.error(err);
      setStatusMsg({ type: 'danger', text: 'Error saving ministry.' });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-2">
        <div>
          <h2 className="heading fw-bold mb-1">Ministries Management</h2>
          <p className="text-muted small mb-0">Manage church departments and serving opportunities</p>
        </div>
        <button className="btn btn-primary" onClick={openCreateModal}>
          <i className="bi bi-plus-circle me-1"></i> Add New Ministry
        </button>
      </div>

      {statusMsg && (
        <div className={`alert alert-${statusMsg.type} alert-dismissible fade show mb-4`} role="alert">
          {statusMsg.text}
          <button type="button" className="btn-close" onClick={() => setStatusMsg(null)}></button>
        </div>
      )}

      {loading ? (
        <LoadingSpinner message="Loading ministries..." />
      ) : ministries.length === 0 ? (
        <div className="card border-0 shadow-sm rounded-4 p-5 text-center bg-white">
          <i className="bi bi-people display-3 text-muted mb-3"></i>
          <h4>No Ministries Listed</h4>
          <p className="text-muted">Click the button above to add a ministry department.</p>
        </div>
      ) : (
        <div className="card border-0 shadow-sm rounded-4 bg-white overflow-hidden">
          <div className="table-responsive">
            <table className="table table-hover align-middle mb-0">
              <thead className="table-light">
                <tr>
                  <th style={{ width: '80px' }}>Photo</th>
                  <th>Ministry Name</th>
                  <th>Description</th>
                  <th>Sort Order</th>
                  <th>Status</th>
                  <th className="text-end" style={{ width: '130px' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {ministries.map((m) => (
                  <tr key={m.id}>
                    <td>
                      <img
                        src={m.imageUrl || '/images/coming_soon.png'}
                        alt={m.title}
                        className="rounded-3 shadow-sm"
                        style={{ width: '60px', height: '60px', objectFit: 'cover' }}
                      />
                    </td>
                    <td>
                      <strong className="text-dark">{m.title}</strong>
                    </td>
                    <td>
                      <p className="text-muted small mb-0 text-truncate" style={{ maxWidth: '350px' }}>
                        {m.description}
                      </p>
                    </td>
                    <td>{m.order}</td>
                    <td>
                      {m.isActive ? (
                        <span className="badge bg-success-subtle text-success border border-success-subtle">
                          Active
                        </span>
                      ) : (
                        <span className="badge bg-secondary-subtle text-secondary border">
                          Hidden
                        </span>
                      )}
                    </td>
                    <td className="text-end">
                      <button
                        className="btn btn-sm btn-outline-secondary me-2"
                        onClick={() => openEditModal(m)}
                        title="Edit ministry"
                      >
                        <i className="bi bi-pencil"></i>
                      </button>
                      <button
                        className="btn btn-sm btn-outline-danger"
                        onClick={() => handleDelete(m.id)}
                        title="Delete ministry"
                      >
                        <i className="bi bi-trash"></i>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Ministry Modal */}
      {modalOpen && (
        <div className="modal fade show d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.6)', zIndex: 1055 }}>
          <div className="modal-dialog modal-dialog-centered modal-lg">
            <div className="modal-content border-0 rounded-4 shadow">
              <form onSubmit={handleSubmit}>
                <div className="modal-header border-bottom">
                  <h5 className="modal-title fw-bold heading">
                    {editingMinistry ? 'Edit Ministry' : 'Add New Ministry'}
                  </h5>
                  <button type="button" className="btn-close" onClick={() => setModalOpen(false)}></button>
                </div>

                <div className="modal-body p-4">
                  <div className="row g-3">
                    <div className="col-md-8">
                      <label className="form-label fw-medium">Ministry Title *</label>
                      <input
                        type="text"
                        className="form-control"
                        required
                        value={formData.title}
                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                        placeholder="e.g. Media & Sound Ministry"
                      />
                    </div>

                    <div className="col-md-4">
                      <label className="form-label fw-medium">Display Order</label>
                      <input
                        type="number"
                        className="form-control"
                        value={formData.order}
                        onChange={(e) => setFormData({ ...formData, order: e.target.value })}
                      />
                    </div>

                    <div className="col-12">
                      <label className="form-label fw-medium">Brief Description</label>
                      <textarea
                        className="form-control"
                        rows="2"
                        value={formData.description}
                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                        placeholder="Short summary shown on the card"
                      ></textarea>
                    </div>

                    <div className="col-12">
                      <label className="form-label fw-medium">Detailed Overview (More Info Collapse)</label>
                      <textarea
                        className="form-control"
                        rows="4"
                        value={formData.details}
                        onChange={(e) => setFormData({ ...formData, details: e.target.value })}
                        placeholder="In-depth details about responsibilities, meeting times..."
                      ></textarea>
                    </div>

                    <div className="col-md-8">
                      <label className="form-label fw-medium">Cover Photo</label>
                      <input
                        type="file"
                        className="form-control"
                        accept="image/*"
                        onChange={(e) => setFormData({ ...formData, image: e.target.files[0] })}
                      />
                    </div>

                    <div className="col-md-4 d-flex align-items-end pb-2">
                      <div className="form-check form-switch">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          id="isActiveSwitch"
                          checked={formData.isActive}
                          onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                        />
                        <label className="form-check-label fw-medium" htmlFor="isActiveSwitch">
                          Visible on Website
                        </label>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="modal-footer border-top">
                  <button type="button" className="btn btn-light" onClick={() => setModalOpen(false)}>
                    Cancel
                  </button>
                  <button type="submit" className="btn btn-primary" disabled={saving}>
                    {saving ? 'Saving...' : editingMinistry ? 'Update Ministry' : 'Add Ministry'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminMinistriesPage;
