import React, { useState, useEffect } from 'react';
import { eventsService } from '../../services/api';
import { TableSkeleton } from '../../components/common/SkeletonLoader';
import ImageUploadDropzone from '../../components/admin/ImageUploadDropzone';
import ConfirmDeleteModal from '../../components/admin/ConfirmDeleteModal';
import { useToast } from '../../context/ToastContext';
import SEO from '../../components/common/SEO';

const AdminEventsPage = () => {
  const { addToast } = useToast();
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const [modalOpen, setModalOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState(null);
  const [deleteId, setDeleteId] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const [formData, setFormData] = useState({
    title: '',
    summary: '',
    time: '',
    location: '',
    details: '',
    isFeatured: false,
    image: null
  });

  const fetchEvents = async () => {
    try {
      setLoading(true);
      const res = await eventsService.getAll();
      if (res.data.success) {
        setEvents(res.data.events);
      }
    } catch (err) {
      console.error(err);
      addToast('Could not fetch events.', 'danger');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  const openCreateModal = () => {
    setEditingEvent(null);
    setFormData({
      title: '',
      summary: '',
      time: '',
      location: '',
      details: '',
      isFeatured: false,
      image: null
    });
    setModalOpen(true);
  };

  const openEditModal = (ev) => {
    setEditingEvent(ev);
    setFormData({
      title: ev.title || '',
      summary: ev.summary || '',
      time: ev.time || '',
      location: ev.location || '',
      details: ev.details || '',
      isFeatured: ev.isFeatured || false,
      image: null
    });
    setModalOpen(true);
  };

  const confirmDelete = async () => {
    if (!deleteId) return;
    setDeleting(true);
    try {
      const res = await eventsService.delete(deleteId);
      if (res.data.success) {
        addToast('Event deleted successfully.', 'success');
        setDeleteId(null);
        fetchEvents();
      }
    } catch (err) {
      console.error(err);
      addToast('Failed to delete event.', 'danger');
    } finally {
      setDeleting(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);

    const payload = new FormData();
    payload.append('title', formData.title);
    payload.append('summary', formData.summary);
    payload.append('time', formData.time);
    payload.append('location', formData.location);
    payload.append('details', formData.details);
    payload.append('isFeatured', formData.isFeatured);
    if (formData.image) {
      payload.append('image', formData.image);
    }

    try {
      if (editingEvent) {
        await eventsService.update(editingEvent.id, payload);
        addToast('Event updated successfully.', 'success');
      } else {
        await eventsService.create(payload);
        addToast('New event created successfully.', 'success');
      }
      setModalOpen(false);
      fetchEvents();
    } catch (err) {
      console.error(err);
      addToast(err.response?.data?.message || 'Error saving event.', 'danger');
    } finally {
      setSaving(false);
    }
  };

  const filteredEvents = events.filter((ev) => {
    const q = searchQuery.toLowerCase();
    return (
      ev.title?.toLowerCase().includes(q) ||
      ev.location?.toLowerCase().includes(q) ||
      ev.summary?.toLowerCase().includes(q)
    );
  });

  return (
    <div>
      <SEO title="Manage Events" />

      <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-2">
        <div>
          <h2 className="heading fw-bold mb-1">Events Management</h2>
          <p className="text-muted small mb-0">Create, edit, feature, and delete church events</p>
        </div>
        <button className="btn btn-primary rounded-pill px-3 py-2 d-flex align-items-center gap-1 shadow-sm" onClick={openCreateModal}>
          <i className="bi bi-plus-circle"></i> Add New Event
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
            placeholder="Search events by title, location or summary..."
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
        <TableSkeleton rows={4} cols={5} />
      ) : filteredEvents.length === 0 ? (
        <div className="card border-0 shadow-sm rounded-4 p-5 text-center bg-white">
          <i className="bi bi-calendar-x display-3 text-muted mb-3"></i>
          <h4>No Events Found</h4>
          <p className="text-muted">
            {searchQuery ? 'No events matched your search query.' : 'Click the button above to add your first church gathering or service.'}
          </p>
        </div>
      ) : (
        <div className="card border-0 shadow-sm rounded-4 bg-white overflow-hidden">
          <div className="table-responsive">
            <table className="table table-hover align-middle mb-0">
              <thead className="table-light">
                <tr>
                  <th style={{ width: '80px' }}>Poster</th>
                  <th>Title & Summary</th>
                  <th>Time & Location</th>
                  <th>Status</th>
                  <th className="text-end" style={{ width: '130px' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredEvents.map((ev) => (
                  <tr key={ev.id}>
                    <td>
                      <img
                        src={ev.imageUrl || '/images/coming_soon.png'}
                        alt={ev.title}
                        className="rounded-3 shadow-sm"
                        style={{ width: '60px', height: '60px', objectFit: 'cover' }}
                      />
                    </td>
                    <td>
                      <strong className="d-block text-dark">{ev.title}</strong>
                      <span className="text-muted small text-truncate d-inline-block" style={{ maxWidth: '320px' }}>
                        {ev.summary || 'No summary'}
                      </span>
                    </td>
                    <td>
                      <div className="small">
                        <i className="bi bi-clock me-1 text-primary"></i> {ev.time || 'TBA'}
                      </div>
                      <div className="small text-muted">
                        <i className="bi bi-geo-alt me-1 text-danger"></i> {ev.location || 'Church'}
                      </div>
                    </td>
                    <td>
                      {ev.isFeatured ? (
                        <span className="badge bg-primary rounded-pill px-3 py-1">Featured Event</span>
                      ) : (
                        <span className="badge bg-light text-secondary border rounded-pill px-3 py-1">Standard</span>
                      )}
                    </td>
                    <td className="text-end">
                      <button
                        className="btn btn-sm btn-outline-secondary me-2 rounded-circle"
                        style={{ width: '34px', height: '34px', padding: 0 }}
                        onClick={() => openEditModal(ev)}
                        title="Edit event"
                      >
                        <i className="bi bi-pencil"></i>
                      </button>
                      <button
                        className="btn btn-sm btn-outline-danger rounded-circle"
                        style={{ width: '34px', height: '34px', padding: 0 }}
                        onClick={() => setDeleteId(ev.id)}
                        title="Delete event"
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

      {/* Create / Edit Modal with Drag-and-Drop Image Upload */}
      {modalOpen && (
        <div className="modal fade show d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(10,25,41,0.65)', zIndex: 1055 }}>
          <div className="modal-dialog modal-dialog-centered modal-lg">
            <div className="modal-content border-0 rounded-4 shadow-lg overflow-hidden">
              <form onSubmit={handleSubmit}>
                <div className="modal-header border-bottom py-3">
                  <h5 className="modal-title fw-bold heading mb-0">
                    {editingEvent ? 'Edit Event' : 'Create New Event'}
                  </h5>
                  <button type="button" className="btn-close" onClick={() => setModalOpen(false)} aria-label="Close"></button>
                </div>

                <div className="modal-body p-4">
                  <div className="row g-3">
                    <div className="col-12">
                      <label className="form-label fw-medium text-dark">Event Title *</label>
                      <input
                        type="text"
                        className="form-control"
                        required
                        value={formData.title}
                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                        placeholder="e.g. Sunday Miracle & Worship Service"
                      />
                    </div>

                    <div className="col-md-6">
                      <label className="form-label fw-medium text-dark">Time / Schedule</label>
                      <input
                        type="text"
                        className="form-control"
                        value={formData.time}
                        onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                        placeholder="e.g. 9:00 AM – 11:30 AM"
                      />
                    </div>

                    <div className="col-md-6">
                      <label className="form-label fw-medium text-dark">Location</label>
                      <input
                        type="text"
                        className="form-control"
                        value={formData.location}
                        onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                        placeholder="e.g. Main Church Sanctuary, Kollidam"
                      />
                    </div>

                    <div className="col-12">
                      <label className="form-label fw-medium text-dark">Short Summary</label>
                      <input
                        type="text"
                        className="form-control"
                        value={formData.summary}
                        onChange={(e) => setFormData({ ...formData, summary: e.target.value })}
                        placeholder="Brief 1-2 sentence description"
                      />
                    </div>

                    <div className="col-12">
                      <label className="form-label fw-medium text-dark">Full Details</label>
                      <textarea
                        className="form-control"
                        rows="3"
                        value={formData.details}
                        onChange={(e) => setFormData({ ...formData, details: e.target.value })}
                        placeholder="Full program notes, guest ministers, special instructions..."
                      ></textarea>
                    </div>

                    {/* Image Drag and Drop */}
                    <div className="col-12">
                      <ImageUploadDropzone
                        currentImage={editingEvent?.imageUrl}
                        onImageSelected={(file) => setFormData({ ...formData, image: file })}
                        onImageCleared={() => setFormData({ ...formData, image: null })}
                        label="Event Poster / Banner Image"
                      />
                    </div>

                    <div className="col-12">
                      <div className="form-check form-switch p-3 bg-light rounded-3 d-flex align-items-center gap-3">
                        <input
                          className="form-check-input ms-0 mt-0"
                          type="checkbox"
                          id="isFeaturedSwitch"
                          checked={formData.isFeatured}
                          onChange={(e) => setFormData({ ...formData, isFeatured: e.target.checked })}
                          style={{ width: '2.5rem', height: '1.4rem' }}
                        />
                        <label className="form-check-label fw-medium user-select-none text-dark" htmlFor="isFeaturedSwitch">
                          Feature this event prominently on Home & Events pages
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
                      editingEvent ? 'Update Event' : 'Create Event'
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
        title="Delete Event"
        message="Are you sure you want to delete this event? Believers will no longer see it on the website."
      />
    </div>
  );
};

export default AdminEventsPage;
