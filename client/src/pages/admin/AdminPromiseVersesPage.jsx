import React, { useState, useEffect } from 'react';
import { settingsService, verseService } from '../../services/api';
import { TableSkeleton, CardSkeleton } from '../../components/common/SkeletonLoader';
import ConfirmDeleteModal from '../../components/admin/ConfirmDeleteModal';
import { useToast } from '../../context/ToastContext';
import SEO from '../../components/common/SEO';

const MONTH_NAMES = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

const AdminPromiseVersesPage = () => {
  const { addToast } = useToast();

  // Yearly Promise State
  const [yearlyPromise, setYearlyPromise] = useState({
    promise_year: new Date().getFullYear().toString(),
    promise_verse: '',
    promise_ref: ''
  });
  const [savingYearly, setSavingYearly] = useState(false);

  // Monthly Verses State
  const [monthlyVerses, setMonthlyVerses] = useState([]);
  const [loading, setLoading] = useState(true);

  // Monthly Modal & Delete State
  const [modalOpen, setModalOpen] = useState(false);
  const [editingVerse, setEditingVerse] = useState(null);
  const [savingMonthly, setSavingMonthly] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const [formData, setFormData] = useState({
    month: new Date().getMonth() + 1,
    year: new Date().getFullYear(),
    verseText: '',
    reference: '',
    isActive: true
  });

  const loadData = async () => {
    try {
      setLoading(true);
      const [settingsRes, versesRes] = await Promise.all([
        settingsService.getPublic(),
        verseService.getAllMonthly()
      ]);

      if (settingsRes.data.success) {
        const s = settingsRes.data.settings;
        setYearlyPromise({
          promise_year: s.promise_year || new Date().getFullYear().toString(),
          promise_verse: s.promise_verse || '',
          promise_ref: s.promise_ref || ''
        });
      }

      if (versesRes.data.success) {
        setMonthlyVerses(versesRes.data.verses || []);
      }
    } catch (err) {
      console.error('Failed to load promise verses:', err);
      addToast('Could not load promise verses data.', 'danger');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // Save Yearly Promise
  const handleSaveYearly = async (e) => {
    e.preventDefault();
    setSavingYearly(true);
    try {
      const res = await settingsService.update({
        promise_year: yearlyPromise.promise_year,
        promise_verse: yearlyPromise.promise_verse,
        promise_ref: yearlyPromise.promise_ref
      });
      if (res.data.success) {
        addToast('Yearly Promise Verse saved successfully!', 'success');
      }
    } catch (err) {
      console.error(err);
      addToast('Failed to update yearly promise verse.', 'danger');
    } finally {
      setSavingYearly(false);
    }
  };

  // Clear Yearly Promise
  const handleClearYearly = async () => {
    if (!window.confirm('Are you sure you want to clear the yearly promise verse?')) return;
    setSavingYearly(true);
    try {
      const res = await settingsService.update({
        promise_year: '',
        promise_verse: '',
        promise_ref: ''
      });
      if (res.data.success) {
        setYearlyPromise({
          promise_year: '',
          promise_verse: '',
          promise_ref: ''
        });
        addToast('Yearly Promise Verse cleared.', 'info');
      }
    } catch (err) {
      console.error(err);
      addToast('Failed to clear yearly promise verse.', 'danger');
    } finally {
      setSavingYearly(false);
    }
  };

  // Open modal for Create
  const handleOpenCreateModal = () => {
    setEditingVerse(null);
    setFormData({
      month: new Date().getMonth() + 1,
      year: new Date().getFullYear(),
      verseText: '',
      reference: '',
      isActive: true
    });
    setModalOpen(true);
  };

  // Open modal for Edit
  const handleOpenEditModal = (verse) => {
    setEditingVerse(verse);
    setFormData({
      month: verse.month,
      year: verse.year,
      verseText: verse.verseText,
      reference: verse.reference,
      isActive: verse.isActive
    });
    setModalOpen(true);
  };

  // Submit Monthly Modal Form
  const handleSubmitMonthly = async (e) => {
    e.preventDefault();
    if (!formData.verseText.trim() || !formData.reference.trim()) {
      addToast('Please enter both the verse text and biblical reference.', 'warning');
      return;
    }

    setSavingMonthly(true);
    try {
      if (editingVerse) {
        const res = await verseService.updateMonthly(editingVerse.id, formData);
        if (res.data.success) {
          addToast('Monthly verse updated successfully!', 'success');
          setModalOpen(false);
          loadData();
        }
      } else {
        const res = await verseService.createMonthly(formData);
        if (res.data.success) {
          addToast('Monthly verse created successfully!', 'success');
          setModalOpen(false);
          loadData();
        }
      }
    } catch (err) {
      console.error(err);
      const msg = err.response?.data?.message || 'Failed to save monthly verse.';
      addToast(msg, 'danger');
    } finally {
      setSavingMonthly(false);
    }
  };

  // Delete Monthly Verse
  const handleConfirmDelete = async () => {
    if (!deleteId) return;
    setDeleting(true);
    try {
      const res = await verseService.deleteMonthly(deleteId);
      if (res.data.success) {
        addToast('Monthly verse deleted successfully.', 'success');
        setDeleteId(null);
        loadData();
      }
    } catch (err) {
      console.error(err);
      addToast('Failed to delete monthly verse.', 'danger');
    } finally {
      setDeleting(false);
    }
  };

  // Toggle active status inline
  const handleToggleStatus = async (verse) => {
    try {
      const updated = !verse.isActive;
      const res = await verseService.updateMonthly(verse.id, { isActive: updated });
      if (res.data.success) {
        setMonthlyVerses((prev) =>
          prev.map((v) => (v.id === verse.id ? { ...v, isActive: updated } : v))
        );
        addToast(`Verse marked as ${updated ? 'Active' : 'Inactive'}.`, 'info');
      }
    } catch (err) {
      console.error(err);
      addToast('Failed to update status.', 'danger');
    }
  };

  if (loading) {
    return (
      <div className="py-4">
        <SEO title="Promise Verses Management" />
        <div className="skeleton-box rounded-3 w-25 mb-4" style={{ height: '32px' }} />
        <CardSkeleton count={2} />
      </div>
    );
  }

  return (
    <div className="py-2">
      <SEO title="Promise Verses Management" />

      {/* Page Header */}
      <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-2">
        <div>
          <h2 className="heading fw-bold mb-1" style={{ color: 'var(--fgag-primary, #0A3D62)' }}>
            <i className="bi bi-book-half me-2" style={{ color: 'var(--fgag-sky, #38A1DB)' }}></i>
            Promise Verses CMS
          </h2>
          <p className="text-muted small mb-0">
            Manage the Yearly Church Theme Promise and Monthly God's Word scriptures displayed on the website.
          </p>
        </div>
      </div>

      <div className="row g-4">
        {/* ============================================================== */}
        {/* SECTION 1: Yearly Church Promise                               */}
        {/* ============================================================== */}
        <div className="col-12 col-xl-5">
          <div className="card border-0 shadow-sm rounded-4 h-100">
            <div
              className="card-header bg-white border-bottom border-light-subtle py-3 px-4 d-flex justify-content-between align-items-center"
              style={{ borderTop: '4px solid var(--fgag-primary, #0A3D62)' }}
            >
              <div className="d-flex align-items-center gap-2">
                <i className="bi bi-calendar-check fs-5 text-primary"></i>
                <h5 className="fw-bold mb-0" style={{ color: 'var(--fgag-primary, #0A3D62)' }}>
                  Yearly Promise
                </h5>
              </div>
              <span className="badge bg-primary-subtle text-primary border border-primary-subtle px-3 py-2 rounded-pill">
                Annual Motto
              </span>
            </div>

            <div className="card-body p-4">
              <p className="text-muted small mb-4">
                The yearly scripture is prominently displayed on the Home Page as the guiding theme and spiritual motto for the congregation.
              </p>

              <form onSubmit={handleSaveYearly}>
                <div className="mb-3">
                  <label className="form-label fw-semibold text-secondary small">
                    Promise Year <span className="text-danger">*</span>
                  </label>
                  <input
                    type="text"
                    className="form-control rounded-3"
                    placeholder="e.g. 2025"
                    value={yearlyPromise.promise_year}
                    onChange={(e) =>
                      setYearlyPromise((prev) => ({ ...prev, promise_year: e.target.value }))
                    }
                    required
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label fw-semibold text-secondary small">
                    Promise Verse Scripture <span className="text-danger">*</span>
                  </label>
                  <textarea
                    rows={4}
                    className="form-control rounded-3"
                    placeholder="e.g. &quot;Because he loves me,&quot; says the Lord, &quot;I will rescue him; I will protect him, for he acknowledges my name.&quot;"
                    value={yearlyPromise.promise_verse}
                    onChange={(e) =>
                      setYearlyPromise((prev) => ({ ...prev, promise_verse: e.target.value }))
                    }
                    required
                  />
                </div>

                <div className="mb-4">
                  <label className="form-label fw-semibold text-secondary small">
                    Scripture Reference <span className="text-danger">*</span>
                  </label>
                  <input
                    type="text"
                    className="form-control rounded-3"
                    placeholder="e.g. — Psalm 91:14"
                    value={yearlyPromise.promise_ref}
                    onChange={(e) =>
                      setYearlyPromise((prev) => ({ ...prev, promise_ref: e.target.value }))
                    }
                    required
                  />
                </div>

                {/* Preview Box */}
                {yearlyPromise.promise_verse && (
                  <div
                    className="p-3 mb-4 rounded-3 border-start border-4 border-primary"
                    style={{ backgroundColor: 'var(--fgag-surface, #F8F9FA)' }}
                  >
                    <div className="small text-uppercase tracking-wider fw-bold text-primary mb-1">
                      Preview ({yearlyPromise.promise_year || 'Year'})
                    </div>
                    <div className="fst-italic text-dark mb-1" style={{ fontFamily: 'Lora, serif' }}>
                      "{yearlyPromise.promise_verse.replace(/^["“”]|["“”]$/g, '')}"
                    </div>
                    <div className="text-end fw-semibold small text-muted">
                      {yearlyPromise.promise_ref}
                    </div>
                  </div>
                )}

                <div className="d-flex gap-2 justify-content-end pt-2 border-top">
                  <button
                    type="button"
                    onClick={handleClearYearly}
                    className="btn btn-outline-danger btn-sm px-3 rounded-pill"
                    disabled={savingYearly}
                  >
                    <i className="bi bi-eraser me-1"></i> Clear
                  </button>
                  <button
                    type="submit"
                    className="btn btn-primary btn-sm px-4 rounded-pill shadow-sm"
                    disabled={savingYearly}
                  >
                    {savingYearly ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-1" role="status" />
                        Saving...
                      </>
                    ) : (
                      <>
                        <i className="bi bi-check-lg me-1"></i> Save Yearly Promise
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>

        {/* ============================================================== */}
        {/* SECTION 2: Monthly Promise Verses                              */}
        {/* ============================================================== */}
        <div className="col-12 col-xl-7">
          <div className="card border-0 shadow-sm rounded-4 h-100">
            <div
              className="card-header bg-white border-bottom border-light-subtle py-3 px-4 d-flex justify-content-between align-items-center flex-wrap gap-2"
              style={{ borderTop: '4px solid var(--fgag-sky, #38A1DB)' }}
            >
              <div className="d-flex align-items-center gap-2">
                <i className="bi bi-calendar-month fs-5" style={{ color: 'var(--fgag-sky, #38A1DB)' }}></i>
                <div>
                  <h5 className="fw-bold mb-0" style={{ color: 'var(--fgag-primary, #0A3D62)' }}>
                    Monthly Promise Verses
                  </h5>
                  <span className="text-muted small">
                    {monthlyVerses.length} total entries recorded
                  </span>
                </div>
              </div>

              <button
                type="button"
                onClick={handleOpenCreateModal}
                className="btn btn-sm btn-primary rounded-pill px-3 py-2 shadow-sm d-flex align-items-center gap-2"
              >
                <i className="bi bi-plus-lg"></i>
                <span>Add Monthly Verse</span>
              </button>
            </div>

            <div className="card-body p-0">
              {monthlyVerses.length === 0 ? (
                <div className="text-center py-5 px-3">
                  <div
                    className="rounded-circle bg-light d-inline-flex align-items-center justify-content-center mb-3"
                    style={{ width: '64px', height: '64px' }}
                  >
                    <i className="bi bi-journal-text fs-2 text-muted"></i>
                  </div>
                  <h6 className="fw-bold text-dark">No Monthly Verses Found</h6>
                  <p className="text-muted small mb-3">
                    Click "Add Monthly Verse" above to add God's promise word for the current or upcoming month.
                  </p>
                </div>
              ) : (
                <div className="table-responsive">
                  <table className="table table-hover align-middle mb-0">
                    <thead className="table-light">
                      <tr className="small text-uppercase text-secondary">
                        <th className="ps-4 py-3" style={{ width: '150px' }}>Month / Year</th>
                        <th className="py-3">Verse & Reference</th>
                        <th className="py-3 text-center" style={{ width: '90px' }}>Status</th>
                        <th className="pe-4 py-3 text-end" style={{ width: '120px' }}>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {monthlyVerses.map((verse) => {
                        const monthName = MONTH_NAMES[verse.month - 1] || `Month ${verse.month}`;
                        return (
                          <tr key={verse.id}>
                            <td className="ps-4">
                              <div className="fw-bold text-dark">{monthName}</div>
                              <span className="badge bg-light text-secondary border small">
                                {verse.year}
                              </span>
                            </td>

                            <td className="py-3">
                              <p
                                className="mb-1 text-dark text-truncate"
                                style={{
                                  maxWidth: '380px',
                                  fontFamily: 'Lora, serif',
                                  fontSize: '0.92rem'
                                }}
                                title={verse.verseText}
                              >
                                "{verse.verseText}"
                              </p>
                              <span className="badge bg-primary-subtle text-primary fw-medium font-monospace small">
                                {verse.reference}
                              </span>
                            </td>

                            <td className="text-center">
                              <button
                                type="button"
                                onClick={() => handleToggleStatus(verse)}
                                className={`btn btn-sm rounded-pill px-2 py-0 border-0 ${
                                  verse.isActive
                                    ? 'btn-success-subtle text-success'
                                    : 'btn-secondary-subtle text-secondary'
                                }`}
                                title="Click to toggle status"
                                style={{ fontSize: '0.75rem', fontWeight: 600 }}
                              >
                                {verse.isActive ? 'Active' : 'Inactive'}
                              </button>
                            </td>

                            <td className="pe-4 text-end">
                              <div className="btn-group btn-group-sm">
                                <button
                                  type="button"
                                  onClick={() => handleOpenEditModal(verse)}
                                  className="btn btn-outline-primary"
                                  title="Edit verse"
                                >
                                  <i className="bi bi-pencil"></i>
                                </button>
                                <button
                                  type="button"
                                  onClick={() => setDeleteId(verse.id)}
                                  className="btn btn-outline-danger"
                                  title="Delete verse"
                                >
                                  <i className="bi bi-trash"></i>
                                </button>
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* ============================================================== */}
      {/* Modal: Add / Edit Monthly Verse                                */}
      {/* ============================================================== */}
      {modalOpen && (
        <div
          className="modal fade show d-block"
          tabIndex="-1"
          style={{ backgroundColor: 'rgba(10, 25, 41, 0.65)', zIndex: 1055 }}
          onClick={() => !savingMonthly && setModalOpen(false)}
        >
          <div
            className="modal-dialog modal-dialog-centered"
            onClick={(e) => e.stopPropagation()}
            style={{ maxWidth: '520px' }}
          >
            <div className="modal-content border-0 shadow-lg rounded-4 overflow-hidden">
              <div
                className="modal-header text-white py-3 px-4"
                style={{ backgroundColor: 'var(--fgag-primary, #0A3D62)' }}
              >
                <h5 className="modal-title fw-bold fs-6 d-flex align-items-center gap-2">
                  <i className="bi bi-calendar-event"></i>
                  {editingVerse ? 'Edit Monthly Promise Verse' : 'Add Monthly Promise Verse'}
                </h5>
                <button
                  type="button"
                  className="btn-close btn-close-white"
                  onClick={() => !savingMonthly && setModalOpen(false)}
                  disabled={savingMonthly}
                  aria-label="Close"
                ></button>
              </div>

              <form onSubmit={handleSubmitMonthly}>
                <div className="modal-body p-4">
                  <div className="row g-3 mb-3">
                    <div className="col-7">
                      <label className="form-label fw-semibold text-secondary small">
                        Month <span className="text-danger">*</span>
                      </label>
                      <select
                        className="form-select rounded-3"
                        value={formData.month}
                        onChange={(e) =>
                          setFormData((prev) => ({ ...prev, month: parseInt(e.target.value, 10) }))
                        }
                        required
                      >
                        {MONTH_NAMES.map((name, idx) => (
                          <option key={name} value={idx + 1}>
                            {idx + 1} - {name}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="col-5">
                      <label className="form-label fw-semibold text-secondary small">
                        Year <span className="text-danger">*</span>
                      </label>
                      <input
                        type="number"
                        min="2020"
                        max="2035"
                        className="form-control rounded-3"
                        value={formData.year}
                        onChange={(e) =>
                          setFormData((prev) => ({ ...prev, year: parseInt(e.target.value, 10) }))
                        }
                        required
                      />
                    </div>
                  </div>

                  <div className="mb-3">
                    <label className="form-label fw-semibold text-secondary small">
                      Verse Scripture <span className="text-danger">*</span>
                    </label>
                    <textarea
                      rows={4}
                      className="form-control rounded-3"
                      placeholder="e.g. “The Lord will guide you always; he will satisfy your needs in a sun-scorched land...”"
                      value={formData.verseText}
                      onChange={(e) =>
                        setFormData((prev) => ({ ...prev, verseText: e.target.value }))
                      }
                      required
                    />
                  </div>

                  <div className="mb-3">
                    <label className="form-label fw-semibold text-secondary small">
                      Biblical Reference <span className="text-danger">*</span>
                    </label>
                    <input
                      type="text"
                      className="form-control rounded-3"
                      placeholder="e.g. Isaiah 58:11"
                      value={formData.reference}
                      onChange={(e) =>
                        setFormData((prev) => ({ ...prev, reference: e.target.value }))
                      }
                      required
                    />
                  </div>

                  <div className="form-check form-switch pt-2">
                    <input
                      className="form-check-input"
                      type="checkbox"
                      id="activeCheck"
                      checked={formData.isActive}
                      onChange={(e) =>
                        setFormData((prev) => ({ ...prev, isActive: e.target.checked }))
                      }
                    />
                    <label className="form-check-label text-dark small fw-medium" htmlFor="activeCheck">
                      Active (Display on website if current)
                    </label>
                  </div>
                </div>

                <div className="modal-footer border-0 bg-light p-3">
                  <button
                    type="button"
                    className="btn btn-outline-secondary btn-sm px-3 rounded-pill"
                    onClick={() => setModalOpen(false)}
                    disabled={savingMonthly}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="btn btn-primary btn-sm px-4 rounded-pill shadow-sm"
                    disabled={savingMonthly}
                  >
                    {savingMonthly ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-1" role="status" />
                        Saving...
                      </>
                    ) : (
                      <>
                        <i className="bi bi-save me-1"></i> {editingVerse ? 'Update Verse' : 'Save Verse'}
                      </>
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
        isOpen={Boolean(deleteId)}
        onClose={() => setDeleteId(null)}
        onConfirm={handleConfirmDelete}
        title="Delete Monthly Verse"
        message="Are you sure you want to permanently delete this monthly promise verse? This action cannot be undone."
        loading={deleting}
      />
    </div>
  );
};

export default AdminPromiseVersesPage;
