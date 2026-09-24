import React, { useState, useEffect } from 'react';
import { sermonService } from '../../services/api';
import { TableSkeleton } from '../../components/common/SkeletonLoader';
import ImageUploadDropzone from '../../components/admin/ImageUploadDropzone';
import ConfirmDeleteModal from '../../components/admin/ConfirmDeleteModal';
import { useToast } from '../../context/ToastContext';
import SEO from '../../components/common/SEO';

const CATEGORIES = [
  'Sunday Service',
  'Faith & Prayer',
  'Grace & Salvation',
  'Youth & Family',
  'Revival & Outreach',
  'Special'
];

const AdminSermonsPage = () => {
  const { addToast } = useToast();
  const [sermons, setSermons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  const [modalOpen, setModalOpen] = useState(false);
  const [editingSermon, setEditingSermon] = useState(null);
  const [deleteId, setDeleteId] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const [formData, setFormData] = useState({
    title: '',
    speaker: '',
    date: new Date().toISOString().substring(0, 10),
    category: 'Sunday Service',
    type: 'YOUTUBE',
    mediaUrl: '',
    description: '',
    thumbnail: null,
    isFeatured: false,
    isPublished: true
  });

  const fetchSermons = async () => {
    try {
      setLoading(true);
      const res = await sermonService.getAll({
        all: true,
        limit: 100
      });
      if (res.data.success) {
        setSermons(res.data.sermons || []);
      }
    } catch (err) {
      console.error(err);
      addToast('Could not fetch sermons.', 'danger');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSermons();
  }, []);

  const openCreateModal = () => {
    setEditingSermon(null);
    setFormData({
      title: '',
      speaker: '',
      date: new Date().toISOString().substring(0, 10),
      category: 'Sunday Service',
      type: 'YOUTUBE',
      mediaUrl: '',
      description: '',
      thumbnail: null,
      isFeatured: false,
      isPublished: true
    });
    setModalOpen(true);
  };

  const openEditModal = (sermon) => {
    setEditingSermon(sermon);
    setFormData({
      title: sermon.title || '',
      speaker: sermon.speaker || '',
      date: sermon.date ? new Date(sermon.date).toISOString().substring(0, 10) : '',
      category: sermon.category || 'Sunday Service',
      type: sermon.type || 'YOUTUBE',
      mediaUrl: sermon.mediaUrl || '',
      description: sermon.description || '',
      thumbnail: null,
      isFeatured: sermon.isFeatured || false,
      isPublished: sermon.isPublished !== undefined ? sermon.isPublished : true
    });
    setModalOpen(true);
  };

  const confirmDelete = async () => {
    if (!deleteId) return;
    setDeleting(true);
    try {
      const res = await sermonService.delete(deleteId);
      if (res.data.success) {
        addToast('Sermon deleted successfully.', 'success');
        setSermons((prev) => prev.filter((s) => s.id !== deleteId));
      }
    } catch (err) {
      console.error(err);
      addToast('Failed to delete sermon.', 'danger');
    } finally {
      setDeleting(false);
      setDeleteId(null);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title.trim()) {
      addToast('Title is required.', 'warning');
      return;
    }
    if (!formData.mediaUrl.trim()) {
      addToast('Media URL is required.', 'warning');
      return;
    }

    setSaving(true);
    try {
      const payload = new FormData();
      payload.append('title', formData.title.trim());
      payload.append('speaker', formData.speaker.trim());
      payload.append('date', formData.date);
      payload.append('category', formData.category);
      payload.append('type', formData.type);
      payload.append('mediaUrl', formData.mediaUrl.trim());
      payload.append('description', formData.description.trim());
      payload.append('isFeatured', formData.isFeatured);
      payload.append('isPublished', formData.isPublished);

      if (formData.thumbnail) {
        payload.append('thumbnail', formData.thumbnail);
      }

      if (editingSermon) {
        const res = await sermonService.update(editingSermon.id, payload);
        if (res.data.success) {
          addToast('Sermon updated successfully.', 'success');
          setSermons((prev) =>
            prev.map((s) => (s.id === editingSermon.id ? res.data.sermon : s))
          );
          setModalOpen(false);
        }
      } else {
        const res = await sermonService.create(payload);
        if (res.data.success) {
          addToast('Sermon created successfully.', 'success');
          setSermons((prev) => [res.data.sermon, ...prev]);
          setModalOpen(false);
        }
      }
    } catch (err) {
      console.error(err);
      addToast(err.response?.data?.message || 'Error saving sermon.', 'danger');
    } finally {
      setSaving(false);
    }
  };

  const getYouTubeEmbedUrl = (url) => {
    if (!url) return null;
    const regExp = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?|shorts|live)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/;
    const match = url.match(regExp);
    return match && match[1] ? `https://www.youtube-nocookie.com/embed/${match[1]}` : null;
  };

  const filteredSermons = sermons.filter((s) => {
    const matchesSearch =
      s.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (s.speaker && s.speaker.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (s.description && s.description.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesCategory =
      selectedCategory === 'All' || s.category === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  const previewEmbedUrl = getYouTubeEmbedUrl(formData.mediaUrl);

  return (
    <div>
      <SEO title="Manage Sermons & Media - Admin" />

      {/* Header */}
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3 mb-4">
        <div>
          <h2 className="heading mb-1">📹 Sermons & Media CMS</h2>
          <p className="text-muted small mb-0">
            Publish, edit, and organize Sunday messages, teachings, and media.
          </p>
        </div>
        <button className="btn btn-primary d-flex align-items-center gap-2" onClick={openCreateModal}>
          <i className="bi bi-plus-circle"></i>
          <span>Add New Sermon</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="card shadow-sm border-0 rounded-4 mb-4 p-3 bg-white">
        <div className="row g-2 align-items-center">
          <div className="col-12 col-md-6 col-lg-4">
            <div className="input-group">
              <span className="input-group-text bg-light border-end-0">
                <i className="bi bi-search text-muted"></i>
              </span>
              <input
                type="text"
                className="form-control border-start-0"
                placeholder="Search by title, speaker..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
          <div className="col-12 col-md-6 col-lg-3">
            <select
              className="form-select"
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
            >
              <option value="All">All Categories</option>
              {CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>
          <div className="col-12 col-md-12 col-lg-5 text-md-end text-muted small">
            Showing {filteredSermons.length} of {sermons.length} sermons
          </div>
        </div>
      </div>

      {/* Sermons Table */}
      <div className="card shadow-sm border-0 rounded-4 overflow-hidden bg-white">
        <div className="table-responsive">
          <table className="table table-hover align-middle mb-0">
            <thead className="table-light text-muted small text-uppercase">
              <tr>
                <th style={{ width: '80px' }}>Thumbnail</th>
                <th>Title & Speaker</th>
                <th>Category & Type</th>
                <th>Date</th>
                <th>Status</th>
                <th className="text-end" style={{ width: '130px' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="6" className="p-4">
                    <TableSkeleton rows={4} columns={6} />
                  </td>
                </tr>
              ) : filteredSermons.length === 0 ? (
                <tr>
                  <td colSpan="6" className="text-center py-5 text-muted">
                    <i className="bi bi-camera-video fs-1 d-block mb-2 opacity-50"></i>
                    No sermons found. Click "Add New Sermon" to create one.
                  </td>
                </tr>
              ) : (
                filteredSermons.map((sermon) => (
                  <tr key={sermon.id}>
                    <td>
                      <img
                        src={sermon.thumbnailUrl || '/images/church_inside_2.jpg'}
                        alt={sermon.title}
                        className="rounded-3"
                        style={{ width: '70px', height: '42px', objectFit: 'cover' }}
                        onError={(e) => {
                          e.target.src = '/images/church_inside_2.jpg';
                        }}
                      />
                    </td>
                    <td>
                      <div className="fw-semibold text-dark">{sermon.title}</div>
                      <div className="small text-muted">
                        {sermon.speaker ? `Speaker: ${sermon.speaker}` : 'FGAG Ministry'}
                      </div>
                    </td>
                    <td>
                      <span className="badge bg-light text-primary border me-1">
                        {sermon.category}
                      </span>
                      <span className="small text-muted">{sermon.type}</span>
                    </td>
                    <td className="small text-muted">
                      {sermon.date ? new Date(sermon.date).toLocaleDateString() : '—'}
                    </td>
                    <td>
                      <div className="d-flex flex-column gap-1">
                        <span className={`badge ${sermon.isPublished ? 'bg-success-subtle text-success' : 'bg-secondary-subtle text-secondary'}`}>
                          {sermon.isPublished ? 'Published' : 'Draft'}
                        </span>
                        {sermon.isFeatured && (
                          <span className="badge bg-warning-subtle text-warning">
                            ⭐ Featured
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="text-end">
                      <div className="btn-group btn-group-sm">
                        <button
                          className="btn btn-outline-primary"
                          title="Edit"
                          onClick={() => openEditModal(sermon)}
                        >
                          <i className="bi bi-pencil"></i>
                        </button>
                        <button
                          className="btn btn-outline-danger"
                          title="Delete"
                          onClick={() => setDeleteId(sermon.id)}
                        >
                          <i className="bi bi-trash"></i>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal: Add / Edit Sermon */}
      {modalOpen && (
        <div
          className="modal fade show d-block"
          style={{ backgroundColor: 'rgba(0,0,0,0.55)', zIndex: 1050 }}
          tabIndex="-1"
          role="dialog"
        >
          <div className="modal-dialog modal-lg modal-dialog-centered modal-dialog-scrollable">
            <div className="modal-content rounded-4 border-0 shadow">
              <div className="modal-header border-bottom">
                <h5 className="modal-title fw-bold heading">
                  {editingSermon ? 'Edit Sermon' : 'Add New Sermon'}
                </h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setModalOpen(false)}
                  aria-label="Close"
                ></button>
              </div>

              <form onSubmit={handleSubmit}>
                <div className="modal-body p-4">
                  <div className="row g-3">
                    <div className="col-12">
                      <label className="form-label fw-medium small">
                        Sermon Title <span className="text-danger">*</span>
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        placeholder="e.g. Walking in the Anointing of the Holy Spirit"
                        value={formData.title}
                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                        required
                      />
                    </div>

                    <div className="col-12 col-md-6">
                      <label className="form-label fw-medium small">Speaker</label>
                      <input
                        type="text"
                        className="form-control"
                        placeholder="e.g. Pastor Amal M. Augustine"
                        value={formData.speaker}
                        onChange={(e) => setFormData({ ...formData, speaker: e.target.value })}
                      />
                    </div>

                    <div className="col-12 col-md-6">
                      <label className="form-label fw-medium small">Date</label>
                      <input
                        type="date"
                        className="form-control"
                        value={formData.date}
                        onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                      />
                    </div>

                    <div className="col-12 col-md-6">
                      <label className="form-label fw-medium small">Category</label>
                      <select
                        className="form-select"
                        value={formData.category}
                        onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                      >
                        {CATEGORIES.map((cat) => (
                          <option key={cat} value={cat}>{cat}</option>
                        ))}
                      </select>
                    </div>

                    <div className="col-12 col-md-6">
                      <label className="form-label fw-medium small">Media Type</label>
                      <select
                        className="form-select"
                        value={formData.type}
                        onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                      >
                        <option value="YOUTUBE">YouTube Video</option>
                        <option value="VIDEO_URL">Direct Video URL</option>
                        <option value="AUDIO_URL">Audio URL</option>
                      </select>
                    </div>

                    <div className="col-12">
                      <label className="form-label fw-medium small">
                        Media URL (YouTube link or video stream) <span className="text-danger">*</span>
                      </label>
                      <input
                        type="url"
                        className="form-control"
                        placeholder="https://www.youtube.com/watch?v=..."
                        value={formData.mediaUrl}
                        onChange={(e) => setFormData({ ...formData, mediaUrl: e.target.value })}
                        required
                      />
                      <div className="form-text small">
                        Supports standard YouTube URLs, Shorts, and Live links. The thumbnail will be automatically derived from YouTube if no custom image is uploaded.
                      </div>
                    </div>

                    {/* Live Video Preview if YouTube */}
                    {previewEmbedUrl && (
                      <div className="col-12">
                        <label className="form-label fw-medium small text-success">
                          <i className="bi bi-check-circle me-1"></i> Live URL Preview
                        </label>
                        <div className="video-responsive-16-9" style={{ maxHeight: '240px' }}>
                          <iframe
                            src={previewEmbedUrl}
                            title="Preview"
                            allowFullScreen
                          />
                        </div>
                      </div>
                    )}

                    <div className="col-12">
                      <label className="form-label fw-medium small">
                        Custom Thumbnail (Optional)
                      </label>
                      <ImageUploadDropzone
                        preview={
                          formData.thumbnail
                            ? URL.createObjectURL(formData.thumbnail)
                            : editingSermon?.thumbnailUrl || null
                        }
                        onFileSelect={(file) => setFormData({ ...formData, thumbnail: file })}
                        onClear={() => setFormData({ ...formData, thumbnail: null })}
                        height="140px"
                      />
                    </div>

                    <div className="col-12">
                      <label className="form-label fw-medium small">Description / Notes</label>
                      <textarea
                        className="form-control"
                        rows="3"
                        placeholder="Brief summary or scripture references for this sermon..."
                        value={formData.description}
                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      ></textarea>
                    </div>

                    <div className="col-12 col-md-6">
                      <div className="form-check form-switch pt-2">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          id="isFeaturedSwitch"
                          checked={formData.isFeatured}
                          onChange={(e) => setFormData({ ...formData, isFeatured: e.target.checked })}
                        />
                        <label className="form-check-label fw-medium small" htmlFor="isFeaturedSwitch">
                          Feature this sermon prominently
                        </label>
                      </div>
                    </div>

                    <div className="col-12 col-md-6">
                      <div className="form-check form-switch pt-2">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          id="isPublishedSwitch"
                          checked={formData.isPublished}
                          onChange={(e) => setFormData({ ...formData, isPublished: e.target.checked })}
                        />
                        <label className="form-check-label fw-medium small" htmlFor="isPublishedSwitch">
                          Publish immediately (visible to public)
                        </label>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="modal-footer border-top bg-light">
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={() => setModalOpen(false)}
                    disabled={saving}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="btn btn-primary d-inline-flex align-items-center gap-2"
                    disabled={saving}
                  >
                    {saving && <span className="spinner-border spinner-border-sm" role="status" />}
                    <span>{editingSermon ? 'Save Changes' : 'Create Sermon'}</span>
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Confirmation Modal for Deletion */}
      <ConfirmDeleteModal
        isOpen={Boolean(deleteId)}
        onClose={() => setDeleteId(null)}
        onConfirm={confirmDelete}
        loading={deleting}
        title="Delete Sermon"
        message="Are you sure you want to permanently delete this sermon? This action cannot be undone."
      />
    </div>
  );
};

export default AdminSermonsPage;
