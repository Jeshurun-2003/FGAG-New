import React, { useState, useEffect } from 'react';
import { ministriesService } from '../../services/api';
import { TableSkeleton } from '../../components/common/SkeletonLoader';
import ImageUploadDropzone from '../../components/admin/ImageUploadDropzone';
import ConfirmDeleteModal from '../../components/admin/ConfirmDeleteModal';
import { useToast } from '../../context/ToastContext';
import SEO from '../../components/common/SEO';

const AdminMinistriesPage = () => {
  const { addToast } = useToast();
  const [ministries, setMinistries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const [modalOpen, setModalOpen] = useState(false);
  const [editingMinistry, setEditingMinistry] = useState(null);
  const [deleteId, setDeleteId] = useState(null);
  const [deleting, setDeleting] = useState(false);

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
      addToast('Failed to fetch ministries.', 'danger');
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

  const confirmDelete = async () => {
    if (!deleteId) return;
    setDeleting(true);
    try {
      const res = await ministriesService.delete(deleteId);
      if (res.data.success) {
        addToast('Ministry deleted successfully.', 'success');
        setDeleteId(null);
        fetchMinistries();
      }
    } catch (err) {
      console.error(err);
      addToast('Failed to delete ministry.', 'danger');
    } finally {
      setDeleting(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);

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
        addToast('Ministry updated successfully.', 'success');
      } else {
        await ministriesService.create(payload);
        addToast('Ministry created successfully.', 'success');
      }
      setModalOpen(false);
      fetchMinistries();
    } catch (err) {
      console.error(err);
      addToast(err.response?.data?.message || 'Error saving ministry.', 'danger');
    } finally {
      setSaving(false);
    }
  };

  const filteredMinistries = ministries.filter((m) => {
    const q = searchQuery.toLowerCase();
    return (
      m.title?.toLowerCase().includes(q) ||
      m.description?.toLowerCase().includes(q)
    );
  });

  return (
    <div>
      <SEO title="Manage Ministries" />

      <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-2">
        <div>
          <h2 className="heading fw-bold mb-1">Ministries Management</h2>
          <p className="text-muted small mb-0">Create, edit, reorder, and activate church ministries</p>
        </div>
        <button className="btn btn-primary rounded-pill px-3 py-2 d-flex align-items-center gap-1 shadow-sm" onClick={openCreateModal}>
          <i className="bi bi-plus-circle"></i> Add Ministry
        </button>
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
            placeholder="Search ministries by title or description..."
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
        <TableSkeleton rows={5} cols={5} />
      ) : filteredMinistries.length === 0 ? (
        <div className="card border-0 shadow-sm rounded-4 p-5 text-center bg-white">
          <i className="bi bi-people display-3 text-muted mb-3"></i>
          <h4>No Ministries Found</h4>
          <p className="text-muted">
            {searchQuery ? 'No ministries match your search criteria.' : 'Click Add Ministry to create your first ministry.'}
          </p>
        </div>
      ) : (
        <div className="card border-0 shadow-sm rounded-4 bg-white overflow-hidden">
          <div className="table-responsive">
            <table className="table table-hover align-middle mb-0">
              <thead className="table-light">
                <tr>
                  <th style={{ width: '80px' }}>Image</th>
                  <th>Title & Description</th>
                  <th style={{ width: '100px' }}>Order</th>
                  <th style={{ width: '120px' }}>Status</th>
                  <th className="text-end" style={{ width: '130px' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredMinistries.map((m) => (
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
                      <strong className="d-block text-dark">{m.title}</strong>
                      <span className="text-muted small text-truncate d-inline-block" style={{ maxWidth: '350px' }}>
                        {m.description || 'No description'}
                      </span>
                    </td>
                    <td>
                      <span className="badge bg-light text-dark border px-2 py-1">#{m.order}</span>
                    </td>
                    <td>
                      {m.isActive ? (
                        <span className="badge bg-success-subtle text-success border border-success-subtle rounded-pill px-3 py-1">
                          Active
                        </span>
                      ) : (
                        <span className="badge bg-secondary-subtle text-secondary rounded-pill px-3 py-1">
                          Inactive
                        </span>
                      )}
                    </td>
                    <td className="text-end">
                      <button
                        className="btn btn-sm btn-outline-secondary me-2 rounded-circle"
                        style={{ width: '34px', height: '34px', padding: 0 }}
                        onClick={() => openEditModal(m)}
                        title="Edit ministry"
                      >
                        <i className="bi bi-pencil"></i>
                      </button>
                      <button
                        className="btn btn-sm btn-outline-danger rounded-circle"
                        style={{ width: '34px', height: '34px', padding: 0 }}
                        onClick={() => setDeleteId(m.id)}
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

      {/* Modal with Drag-and-Drop Image Upload */}
      {modalOpen && (
        <div className="modal fade show d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(10,25,41,0.65)', zIndex: 1055 }}>
          <div className="modal-dialog modal-dialog-centered modal-lg">
            <div className="modal-content border-0 rounded-4 shadow-lg overflow-hidden">
              <form onSubmit={handleSubmit}>
                <div className="modal-header border-bottom py-3">
                  <h5 className="modal-title fw-bold heading mb-0">
                    {editingMinistry ? 'Edit Ministry' : 'Add Ministry'}
                  </h5>
                  <button type="button" className="btn-close" onClick={() => setModalOpen(false)} aria-label="Close"></button>
                </div>

                <div className="modal-body p-4">
                  <div className="row g-3">
                    <div className="col-md-8">
                      <label className="form-label fw-medium text-dark">Ministry Title *</label>
                      <input
                        type="text"
                        className="form-control"
                        required
                        value={formData.title}
                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                        placeholder="e.g. Youth Ministry, Choir"
                      />
                    </div>

                    <div className="col-md-4">
                      <label className="form-label fw-medium text-dark">Display Order</label>
                      <input
                        type="number"
                        className="form-control"
                        value={formData.order}
                        onChange={(e) => setFormData({ ...formData, order: parseInt(e.target.value, 10) || 0 })}
                      />
                    </div>

                    <div className="col-12">
                      <label className="form-label fw-medium text-dark">Short Description</label>
                      <input
                        type="text"
                        className="form-control"
                        value={formData.description}
                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                        placeholder="Brief 1-2 sentence overview"
                      />
                    </div>

                    <div className="col-12">
                      <label className="form-label fw-medium text-dark">Full Details</label>
                      <textarea
                        className="form-control"
                        rows="3"
                        value={formData.details}
                        onChange={(e) => setFormData({ ...formData, details: e.target.value })}
                        placeholder="Detailed ministry vision, activities, leaders, etc."
                      ></textarea>
                    </div>

                    {/* Drag and Drop Image Box */}
                    <div className="col-12">
                      <ImageUploadDropzone
                        currentImage={editingMinistry?.imageUrl}
                        onImageSelected={(file) => setFormData({ ...formData, image: file })}
                        onImageCleared={() => setFormData({ ...formData, image: null })}
                        label="Ministry Photo"
                      />
                    </div>

                    <div className="col-12">
                      <div className="form-check form-switch p-3 bg-light rounded-3 d-flex align-items-center gap-3">
                        <input
                          className="form-check-input ms-0 mt-0"
                          type="checkbox"
                          id="isActiveSwitch"
                          checked={formData.isActive}
                          onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                          style={{ width: '2.5rem', height: '1.4rem' }}
                        />
                        <label className="form-check-label fw-medium text-dark user-select-none" htmlFor="isActiveSwitch">
                          Active (Visible on public ministries page)
                        </label>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="modal-footer border-top py-3 bg-light">
                  <button type="button" className="btn btn-outline-secondary px-3" onClick={() => setModalOpen(false)}>
                    Cancel
                  </button>
                  <button type="submit" className="btn btn-primary px-4 d-flex align-items-center gap-2" disabled={saving}>
                    {saving ? (
                      <>
                        <span className="spinner-border spinner-border-sm" role="status"></span>
                        Saving...
                      </>
                    ) : (
                      editingMinistry ? 'Update Ministry' : 'Create Ministry'
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      <ConfirmDeleteModal
        isOpen={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={confirmDelete}
        loading={deleting}
        title="Delete Ministry"
        message="Are you sure you want to delete this ministry from the database?"
      />
    </div>
  );
};

export default AdminMinistriesPage;
