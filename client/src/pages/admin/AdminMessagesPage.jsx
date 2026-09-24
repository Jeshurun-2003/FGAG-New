import React, { useState, useEffect } from 'react';
import { contactService } from '../../services/api';
import { CardSkeleton } from '../../components/common/SkeletonLoader';
import ConfirmDeleteModal from '../../components/admin/ConfirmDeleteModal';
import { useToast } from '../../context/ToastContext';
import SEO from '../../components/common/SEO';

const AdminMessagesPage = () => {
  const { addToast } = useToast();
  const [messages, setMessages] = useState([]);
  const [filter, setFilter] = useState('ALL');
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  const [selectedMessage, setSelectedMessage] = useState(null);
  const [deleteId, setDeleteId] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const fetchMessages = async () => {
    try {
      setLoading(true);
      const res = await contactService.getAll({ status: filter });
      if (res.data.success) {
        setMessages(res.data.messages || []);
      }
    } catch (err) {
      console.error(err);
      addToast('Failed to load contact messages.', 'danger');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMessages();
  }, [filter]);

  const handleStatusChange = async (id, newStatus) => {
    try {
      const res = await contactService.updateStatus(id, newStatus);
      if (res.data.success) {
        addToast(`Message marked as ${newStatus}.`, 'success');
        setMessages((prev) =>
          prev.map((msg) => (msg.id === id ? { ...msg, status: newStatus } : msg))
        );
        if (selectedMessage && selectedMessage.id === id) {
          setSelectedMessage((prev) => ({ ...prev, status: newStatus }));
        }
      }
    } catch (err) {
      console.error(err);
      addToast('Could not update message status.', 'danger');
    }
  };

  const confirmDelete = async () => {
    if (!deleteId) return;
    setDeleting(true);
    try {
      const res = await contactService.delete(deleteId);
      if (res.data.success) {
        addToast('Contact message deleted successfully.', 'success');
        setMessages((prev) => prev.filter((m) => m.id !== deleteId));
        if (selectedMessage && selectedMessage.id === deleteId) {
          setSelectedMessage(null);
        }
        setDeleteId(null);
      }
    } catch (err) {
      console.error(err);
      addToast('Failed to delete message.', 'danger');
    } finally {
      setDeleting(false);
    }
  };

  const filteredMessages = messages.filter((m) => {
    const q = searchQuery.toLowerCase();
    return (
      m.name?.toLowerCase().includes(q) ||
      m.email?.toLowerCase().includes(q) ||
      m.phone?.toLowerCase().includes(q) ||
      m.subject?.toLowerCase().includes(q) ||
      m.message?.toLowerCase().includes(q)
    );
  });

  const pendingCount = messages.filter((m) => m.status === 'PENDING').length;
  const readCount = messages.filter((m) => m.status === 'READ').length;

  return (
    <div>
      <SEO title="Manage Contact Messages" />

      {/* Header & Filter Controls */}
      <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-2">
        <div>
          <h2 className="heading fw-bold mb-1">Contact Messages</h2>
          <p className="text-muted small mb-0">Inquiries and messages submitted through the website</p>
        </div>

        <div className="btn-group rounded-pill overflow-hidden shadow-sm">
          <button
            className={`btn btn-sm px-3 ${filter === 'ALL' ? 'btn-primary' : 'btn-outline-primary'}`}
            onClick={() => setFilter('ALL')}
          >
            All ({messages.length})
          </button>
          <button
            className={`btn btn-sm px-3 ${filter === 'PENDING' ? 'btn-primary' : 'btn-outline-primary'}`}
            onClick={() => setFilter('PENDING')}
          >
            Pending ({pendingCount})
          </button>
          <button
            className={`btn btn-sm px-3 ${filter === 'READ' ? 'btn-primary' : 'btn-outline-primary'}`}
            onClick={() => setFilter('READ')}
          >
            Read ({readCount})
          </button>
        </div>
      </div>

      {/* Search Bar */}
      <div className="card border-0 shadow-sm rounded-4 p-3 bg-white mb-4">
        <div className="input-group">
          <span className="input-group-text bg-transparent border-end-0">
            <i className="bi bi-search text-muted"></i>
          </span>
          <input
            type="text"
            className="form-control border-start-0 ps-0"
            placeholder="Search by sender name, email, phone, subject, or message content..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          {searchQuery && (
            <button
              className="btn btn-outline-secondary border-start-0"
              type="button"
              onClick={() => setSearchQuery('')}
            >
              <i className="bi bi-x"></i>
            </button>
          )}
        </div>
      </div>

      {/* Content Area */}
      {loading ? (
        <CardSkeleton count={3} />
      ) : filteredMessages.length === 0 ? (
        <div className="card border-0 shadow-sm rounded-4 p-5 text-center bg-white">
          <div className="display-4 text-muted mb-3">
            <i className="bi bi-inbox"></i>
          </div>
          <h5 className="fw-bold text-dark">No Messages Found</h5>
          <p className="text-muted small mb-0">
            {searchQuery ? 'No messages match your search keyword.' : 'No contact messages found for the selected filter.'}
          </p>
        </div>
      ) : (
        <div className="row g-3">
          {filteredMessages.map((msg) => (
            <div className="col-12" key={msg.id}>
              <div
                className={`card border-0 shadow-sm rounded-4 p-4 bg-white hover-lift transition ${
                  msg.status === 'PENDING' ? 'border-start border-4 border-warning' : 'border-start border-4 border-success'
                }`}
              >
                <div className="row align-items-center g-3">
                  <div className="col-md-4">
                    <div className="d-flex align-items-center gap-2 mb-1">
                      <span className="fw-bold text-dark fs-6">{msg.name}</span>
                      <span
                        className={`badge rounded-pill small ${
                          msg.status === 'PENDING' ? 'bg-warning-subtle text-warning-emphasis' : 'bg-success-subtle text-success'
                        }`}
                      >
                        {msg.status}
                      </span>
                    </div>
                    <div className="small text-muted d-flex align-items-center gap-2">
                      <i className="bi bi-envelope"></i>
                      <a href={`mailto:${msg.email}`} className="text-secondary text-decoration-none">
                        {msg.email}
                      </a>
                    </div>
                    {msg.phone && (
                      <div className="small text-muted d-flex align-items-center gap-2 mt-1">
                        <i className="bi bi-telephone"></i>
                        <a href={`tel:${msg.phone.replace(/\s+/g, '')}`} className="text-secondary text-decoration-none">
                          {msg.phone}
                        </a>
                      </div>
                    )}
                    <div className="small text-muted mt-1" style={{ fontSize: '0.78rem' }}>
                      <i className="bi bi-clock me-1"></i>
                      {new Date(msg.createdAt).toLocaleString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                        hour: 'numeric',
                        minute: '2-digit'
                      })}
                    </div>
                  </div>

                  <div className="col-md-5">
                    <div className="fw-semibold text-primary mb-1 small">
                      <i className="bi bi-chat-left-dots me-1"></i>
                      {msg.subject || 'General Inquiry'}
                    </div>
                    <p
                      className="text-secondary small mb-0"
                      style={{
                        display: '-webkit-box',
                        WebkitLineClamp: 3,
                        WebkitBoxOrient: 'vertical',
                        overflow: 'hidden',
                        lineHeight: '1.6'
                      }}
                    >
                      {msg.message}
                    </p>
                  </div>

                  <div className="col-md-3 d-flex flex-column flex-sm-row justify-content-md-end align-items-center gap-2">
                    <button
                      className="btn btn-sm btn-outline-info rounded-pill px-3 w-100 w-sm-auto"
                      onClick={() => setSelectedMessage(msg)}
                      title="View Full Message"
                    >
                      <i className="bi bi-eye me-1"></i> View
                    </button>

                    {msg.status === 'PENDING' ? (
                      <button
                        className="btn btn-sm btn-success rounded-pill px-3 w-100 w-sm-auto"
                        onClick={() => handleStatusChange(msg.id, 'READ')}
                        title="Mark as Read"
                      >
                        <i className="bi bi-check2-circle me-1"></i> Mark Read
                      </button>
                    ) : (
                      <button
                        className="btn btn-sm btn-outline-warning rounded-pill px-3 w-100 w-sm-auto"
                        onClick={() => handleStatusChange(msg.id, 'PENDING')}
                        title="Mark as Pending"
                      >
                        <i className="bi bi-arrow-counterclockwise me-1"></i> Mark Pending
                      </button>
                    )}

                    <button
                      className="btn btn-sm btn-outline-danger rounded-circle p-2 d-flex align-items-center justify-content-center"
                      style={{ width: '34px', height: '34px' }}
                      onClick={() => setDeleteId(msg.id)}
                      title="Delete Message"
                      aria-label="Delete message"
                    >
                      <i className="bi bi-trash"></i>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* View Message Detail Modal */}
      {selectedMessage && (
        <div
          className="modal fade show d-block"
          tabIndex="-1"
          style={{ backgroundColor: 'rgba(10, 25, 41, 0.65)', zIndex: 1060 }}
          onClick={() => setSelectedMessage(null)}
        >
          <div
            className="modal-dialog modal-dialog-centered modal-lg"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="modal-content border-0 shadow-lg rounded-4 overflow-hidden">
              <div className="modal-header border-0 bg-primary text-white py-3">
                <h5 className="modal-title fw-bold fs-6 d-flex align-items-center gap-2">
                  <i className="bi bi-envelope-open"></i> Contact Message Details
                </h5>
                <button
                  type="button"
                  className="btn-close btn-close-white"
                  onClick={() => setSelectedMessage(null)}
                  aria-label="Close"
                ></button>
              </div>

              <div className="modal-body p-4">
                <div className="row g-3 mb-3 pb-3 border-bottom">
                  <div className="col-sm-6">
                    <span className="small text-muted text-uppercase fw-semibold d-block">Sender Name</span>
                    <strong className="fs-6 text-dark">{selectedMessage.name}</strong>
                  </div>
                  <div className="col-sm-6">
                    <span className="small text-muted text-uppercase fw-semibold d-block">Status</span>
                    <span
                      className={`badge rounded-pill small ${
                        selectedMessage.status === 'PENDING' ? 'bg-warning-subtle text-warning-emphasis' : 'bg-success-subtle text-success'
                      }`}
                    >
                      {selectedMessage.status}
                    </span>
                  </div>
                  <div className="col-sm-6">
                    <span className="small text-muted text-uppercase fw-semibold d-block">Email</span>
                    <a href={`mailto:${selectedMessage.email}`} className="text-primary text-decoration-none">
                      {selectedMessage.email}
                    </a>
                  </div>
                  {selectedMessage.phone && (
                    <div className="col-sm-6">
                      <span className="small text-muted text-uppercase fw-semibold d-block">Phone</span>
                      <a href={`tel:${selectedMessage.phone.replace(/\s+/g, '')}`} className="text-primary text-decoration-none">
                        {selectedMessage.phone}
                      </a>
                    </div>
                  )}
                  <div className="col-12">
                    <span className="small text-muted text-uppercase fw-semibold d-block">Subject</span>
                    <span className="fw-semibold text-dark">{selectedMessage.subject || 'General Inquiry'}</span>
                  </div>
                  <div className="col-12">
                    <span className="small text-muted text-uppercase fw-semibold d-block">Received At</span>
                    <span className="small text-secondary">
                      {new Date(selectedMessage.createdAt).toLocaleString('en-US', {
                        weekday: 'long',
                        month: 'long',
                        day: 'numeric',
                        year: 'numeric',
                        hour: 'numeric',
                        minute: '2-digit'
                      })}
                    </span>
                  </div>
                </div>

                <div>
                  <span className="small text-muted text-uppercase fw-semibold d-block mb-2">Message Content</span>
                  <div
                    className="p-3 rounded-3 bg-light border text-dark"
                    style={{ whiteSpace: 'pre-wrap', lineHeight: '1.7', maxHeight: '300px', overflowY: 'auto' }}
                  >
                    {selectedMessage.message}
                  </div>
                </div>
              </div>

              <div className="modal-footer border-0 bg-light p-3 d-flex justify-content-between">
                <div>
                  {selectedMessage.status === 'PENDING' ? (
                    <button
                      className="btn btn-sm btn-success rounded-pill px-3"
                      onClick={() => handleStatusChange(selectedMessage.id, 'READ')}
                    >
                      <i className="bi bi-check2-circle me-1"></i> Mark as Read
                    </button>
                  ) : (
                    <button
                      className="btn btn-sm btn-outline-warning rounded-pill px-3"
                      onClick={() => handleStatusChange(selectedMessage.id, 'PENDING')}
                    >
                      <i className="bi bi-arrow-counterclockwise me-1"></i> Mark as Pending
                    </button>
                  )}
                </div>

                <div className="d-flex gap-2">
                  <a
                    href={`mailto:${selectedMessage.email}?subject=${encodeURIComponent(`Re: ${selectedMessage.subject || 'FGAG Church Inquiry'}`)}`}
                    className="btn btn-sm btn-outline-primary rounded-pill px-3"
                  >
                    <i className="bi bi-reply me-1"></i> Reply via Email
                  </a>
                  <button
                    type="button"
                    className="btn btn-sm btn-secondary rounded-pill px-3"
                    onClick={() => setSelectedMessage(null)}
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      <ConfirmDeleteModal
        isOpen={Boolean(deleteId)}
        onClose={() => setDeleteId(null)}
        onConfirm={confirmDelete}
        title="Delete Contact Message"
        message="Are you sure you want to permanently delete this contact message? This action cannot be undone."
        loading={deleting}
      />
    </div>
  );
};

export default AdminMessagesPage;
