import React, { useState, useEffect } from 'react';
import { eventsService } from '../../services/api';
import LoadingSpinner from '../../components/common/LoadingSpinner';

const AdminEventsPage = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [statusMsg, setStatusMsg] = useState(null);

  const [modalOpen, setModalOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState(null);
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
      setStatusMsg({ type: 'danger', text: 'Could not fetch events.' });
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

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this event?')) return;
    try {
      const res = await eventsService.delete(id);
      if (res.data.success) {
        setStatusMsg({ type: 'success', text: 'Event deleted successfully.' });
        fetchEvents();
      }
    } catch (err) {
      console.error(err);
      setStatusMsg({ type: 'danger', text: 'Failed to delete event.' });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setStatusMsg(null);

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
        setStatusMsg({ type: 'success', text: 'Event updated successfully.' });
      } else {
        await eventsService.create(payload);
        setStatusMsg({ type: 'success', text: 'New event created successfully.' });
      }
      setModalOpen(false);
      fetchEvents();
    } catch (err) {
      console.error(err);
      setStatusMsg({ type: 'danger', text: err.response?.data?.message || 'Error saving event.' });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-2">
        <div>
          <h2 className="heading fw-bold mb-1">Events Management</h2>
          <p className="text-muted small mb-0">Create, edit, feature, and delete church events</p>
        </div>
        <button className="btn btn-primary" onClick={openCreateModal}>
          <i className="bi bi-plus-circle me-1"></i> Add New Event
        </button>
      </div>

      {statusMsg && (
        <div className={`alert alert-${statusMsg.type} alert-dismissible fade show mb-4`} role="alert">
          {statusMsg.text}
          <button type="button" className="btn-close" onClick={() => setStatusMsg(null)}></button>
        </div>
      )}

      {loading ? (
        <LoadingSpinner message="Loading events..." />
      ) : events.length === 0 ? (
        <div className="card border-0 shadow-sm rounded-4 p-5 text-center bg-white">
          <i className="bi bi-calendar-x display-3 text-muted mb-3"></i>
          <h4>No Events Scheduled</h4>
          <p className="text-muted">Click the button above to add your first church gathering or service.</p>
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
                  <th className="text-end" style={{ width: '140px' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {events.map((ev) => (
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
                      <span className="text-muted small text-truncate d-inline-block" style={{ maxWidth: '300px' }}>
                        {ev.summary || 'No summary'}
                      </span>
                    </td>
                    <td>
                      <div className="small">
                        <i className="bi bi-clock me-1 text-muted"></i> {ev.time || 'TBA'}
                      </div>
                      <div className="small text-muted">
                        <i className="bi bi-geo-alt me-1 text-muted"></i> {ev.location || 'Church'}
                      </div>
                    </td>
                    <td>
                      {ev.isFeatured ? (
                        <span className="badge bg-primary">Featured Event</span>
                      ) : (
                        <span className="badge bg-light text-secondary border">Standard</span>
                      )}
                    </td>
                    <td className="text-end">
                      <button
                        className="btn btn-sm btn-outline-secondary me-2"
                        onClick={() => openEditModal(ev)}
                        title="Edit event"
                      >
                        <i className="bi bi-pencil"></i>
                      </button>
                      <button
                        className="btn btn-sm btn-outline-danger"
                        onClick={() => handleDelete(ev.id)}
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

      {/* Create / Edit Modal */}
      {modalOpen && (
        <div className="modal fade show d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.6)', zIndex: 1055 }}>
          <div className="modal-dialog modal-dialog-centered modal-lg">
            <div className="modal-content border-0 rounded-4 shadow">
              <form onSubmit={handleSubmit}>
                <div className="modal-header border-bottom">
                  <h5 className="modal-title fw-bold heading">
                    {editingEvent ? 'Edit Event' : 'Create New Event'}
                  </h5>
                  <button type="button" className="btn-close" onClick={() => setModalOpen(false)}></button>
                </div>

                <div className="modal-body p-4">
                  <div className="row g-3">
                    <div className="col-12">
                      <label className="form-label fw-medium">Event Title *</label>
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
                      <label className="form-label fw-medium">Time / Schedule</label>
                      <input
                        type="text"
                        className="form-control"
                        value={formData.time}
                        onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                        placeholder="e.g. 9:00 AM – 11:30 AM"
                      />
                    </div>

                    <div className="col-md-6">
                      <label className="form-label fw-medium">Location</label>
                      <input
                        type="text"
                        className="form-control"
                        value={formData.location}
                        onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                        placeholder="e.g. Main Church Sanctuary, Kollidam"
                      />
                    </div>

                    <div className="col-12">
                      <label className="form-label fw-medium">Short Summary</label>
                      <input
                        type="text"
                        className="form-control"
                        value={formData.summary}
                        onChange={(e) => setFormData({ ...formData, summary: e.target.value })}
                        placeholder="Brief 1-2 sentence description"
                      />
                    </div>

                    <div className="col-12">
                      <label className="form-label fw-medium">Full Details</label>
                      <textarea
                        className="form-control"
                        rows="4"
                        value={formData.details}
                        onChange={(e) => setFormData({ ...formData, details: e.target.value })}
                        placeholder="Full program notes, guest ministers, special instructions..."
                      ></textarea>
                    </div>

                    <div className="col-md-8">
                      <label className="form-label fw-medium">Upload Poster / Flyer Image</label>
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
                          id="isFeaturedSwitch"
                          checked={formData.isFeatured}
                          onChange={(e) => setFormData({ ...formData, isFeatured: e.target.checked })}
                        />
                        <label className="form-check-label fw-medium" htmlFor="isFeaturedSwitch">
                          Feature this event on Home & Events
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
                    {saving ? 'Saving...' : editingEvent ? 'Update Event' : 'Create Event'}
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

export default AdminEventsPage;
