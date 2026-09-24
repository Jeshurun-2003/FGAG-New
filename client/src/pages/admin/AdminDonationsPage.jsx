import React, { useState, useEffect } from 'react';
import { settingsService, donationsService } from '../../services/api';
import { CardSkeleton } from '../../components/common/SkeletonLoader';
import ImageUploadDropzone from '../../components/admin/ImageUploadDropzone';
import ConfirmDeleteModal from '../../components/admin/ConfirmDeleteModal';
import { useToast } from '../../context/ToastContext';
import SEO from '../../components/common/SEO';

const AdminDonationsPage = () => {
  const { addToast } = useToast();
  const [activeTab, setActiveTab] = useState('bank'); // 'bank' | 'purposes' | 'ledger'
  const [loading, setLoading] = useState(true);

  // ==========================================
  // Tab 1: Bank & UPI Settings
  // ==========================================
  const [bankSettings, setBankSettings] = useState({
    donate_account_name: 'ASSEMBLY OF GOD KOLLIDAM',
    donate_account_number: '0796053000004801',
    donate_ifsc: 'SIBL0000796',
    donate_bank_name: 'South Indian Bank',
    donate_branch: 'Kollidam Branch',
    donate_upi_id: 'kollidamag@upi',
    donate_qr_code: '',
    donate_micr: '609059002',
    donate_swift: 'SOININ55XXX'
  });
  const [savingSettings, setSavingSettings] = useState(false);

  // ==========================================
  // Tab 2: Donation Purposes / Causes
  // ==========================================
  const [purposes, setPurposes] = useState([]);
  const [loadingPurposes, setLoadingPurposes] = useState(false);
  const [purposeModalOpen, setPurposeModalOpen] = useState(false);
  const [editingPurpose, setEditingPurpose] = useState(null);
  const [purposeForm, setPurposeForm] = useState({
    title: '',
    description: '',
    isActive: true,
    order: 0
  });
  const [savingPurpose, setSavingPurpose] = useState(false);
  const [deletePurposeId, setDeletePurposeId] = useState(null);
  const [deletingPurpose, setDeletingPurpose] = useState(false);

  // ==========================================
  // Tab 3: Donation Ledger Records
  // ==========================================
  const [records, setRecords] = useState([]);
  const [totalAmount, setTotalAmount] = useState(0);
  const [loadingRecords, setLoadingRecords] = useState(false);
  const [ledgerSearch, setLedgerSearch] = useState('');
  const [recordModalOpen, setRecordModalOpen] = useState(false);
  const [editingRecord, setEditingRecord] = useState(null);
  const [recordForm, setRecordForm] = useState({
    donorName: '',
    amount: '',
    purpose: 'Tithes & Offerings',
    date: new Date().toISOString().split('T')[0],
    mode: 'UPI',
    note: ''
  });
  const [savingRecord, setSavingRecord] = useState(false);
  const [deleteRecordId, setDeleteRecordId] = useState(null);
  const [deletingRecord, setDeletingRecord] = useState(false);

  // Load initial settings and purposes
  useEffect(() => {
    const initData = async () => {
      try {
        setLoading(true);
        const [settingsRes, purposesRes] = await Promise.all([
          settingsService.getPublic(),
          donationsService.getPurposes(true)
        ]);

        if (settingsRes.data && settingsRes.data.success) {
          const s = settingsRes.data.settings || {};
          setBankSettings((prev) => ({
            ...prev,
            donate_account_name: s.donate_account_name || prev.donate_account_name,
            donate_account_number: s.donate_account_number || prev.donate_account_number,
            donate_ifsc: s.donate_ifsc || prev.donate_ifsc,
            donate_bank_name: s.donate_bank_name || prev.donate_bank_name,
            donate_branch: s.donate_branch || prev.donate_branch,
            donate_upi_id: s.donate_upi_id || prev.donate_upi_id,
            donate_qr_code: s.donate_qr_code || '',
            donate_micr: s.donate_micr || prev.donate_micr,
            donate_swift: s.donate_swift || prev.donate_swift
          }));
        }

        if (purposesRes.data && purposesRes.data.success) {
          setPurposes(purposesRes.data.purposes || []);
        }
      } catch (err) {
        console.error(err);
        addToast('Failed to load donation configuration.', 'danger');
      } finally {
        setLoading(false);
      }
    };

    initData();
  }, []);

  // Fetch purposes
  const fetchPurposes = async () => {
    try {
      setLoadingPurposes(true);
      const res = await donationsService.getPurposes(true);
      if (res.data.success) {
        setPurposes(res.data.purposes || []);
      }
    } catch (err) {
      console.error(err);
      addToast('Failed to fetch donation causes.', 'danger');
    } finally {
      setLoadingPurposes(false);
    }
  };

  // Fetch ledger records
  const fetchRecords = async () => {
    try {
      setLoadingRecords(true);
      const res = await donationsService.getRecords({ search: ledgerSearch });
      if (res.data.success) {
        setRecords(res.data.records || []);
        setTotalAmount(res.data.totalAmount || 0);
      }
    } catch (err) {
      console.error(err);
      addToast('Failed to fetch ledger records.', 'danger');
    } finally {
      setLoadingRecords(false);
    }
  };

  useEffect(() => {
    if (activeTab === 'ledger') {
      fetchRecords();
    } else if (activeTab === 'purposes') {
      fetchPurposes();
    }
  }, [activeTab]);

  // Handle Bank Settings change
  const handleBankSettingChange = (field, val) => {
    setBankSettings((prev) => ({ ...prev, [field]: val }));
  };

  // QR Code Upload as Base64
  const handleQrImageSelected = (file) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      setBankSettings((prev) => ({ ...prev, donate_qr_code: reader.result }));
      addToast('QR Code loaded. Click "Save Bank Details" to persist.', 'info');
    };
    reader.readAsDataURL(file);
  };

  const handleQrImageCleared = () => {
    setBankSettings((prev) => ({ ...prev, donate_qr_code: '' }));
  };

  const handleSaveBankSettings = async (e) => {
    e.preventDefault();
    setSavingSettings(true);
    try {
      const res = await settingsService.update(bankSettings);
      if (res.data.success) {
        addToast('Donation details and QR code updated successfully!', 'success');
      }
    } catch (err) {
      console.error(err);
      addToast('Failed to save donation details.', 'danger');
    } finally {
      setSavingSettings(false);
    }
  };

  // ==========================================
  // Purpose Handlers
  // ==========================================
  const openAddPurposeModal = () => {
    setEditingPurpose(null);
    setPurposeForm({
      title: '',
      description: '',
      isActive: true,
      order: purposes.length + 1
    });
    setPurposeModalOpen(true);
  };

  const openEditPurposeModal = (p) => {
    setEditingPurpose(p);
    setPurposeForm({
      title: p.title,
      description: p.description || '',
      isActive: p.isActive,
      order: p.order || 0
    });
    setPurposeModalOpen(true);
  };

  const handleSavePurpose = async (e) => {
    e.preventDefault();
    if (!purposeForm.title.trim()) {
      addToast('Please enter a cause title.', 'warning');
      return;
    }

    setSavingPurpose(true);
    try {
      if (editingPurpose) {
        const res = await donationsService.updatePurpose(editingPurpose.id, purposeForm);
        if (res.data.success) {
          addToast('Donation purpose updated successfully.', 'success');
          setPurposeModalOpen(false);
          fetchPurposes();
        }
      } else {
        const res = await donationsService.createPurpose(purposeForm);
        if (res.data.success) {
          addToast('New donation cause added.', 'success');
          setPurposeModalOpen(false);
          fetchPurposes();
        }
      }
    } catch (err) {
      console.error(err);
      addToast('Error saving purpose.', 'danger');
    } finally {
      setSavingPurpose(false);
    }
  };

  const handleTogglePurposeActive = async (p) => {
    try {
      const updatedStatus = !p.isActive;
      const res = await donationsService.updatePurpose(p.id, { isActive: updatedStatus });
      if (res.data.success) {
        addToast(`Cause ${updatedStatus ? 'activated' : 'deactivated'}.`, 'info');
        setPurposes((prev) =>
          prev.map((item) => (item.id === p.id ? { ...item, isActive: updatedStatus } : item))
        );
      }
    } catch (err) {
      console.error(err);
      addToast('Could not update status.', 'danger');
    }
  };

  const confirmDeletePurpose = async () => {
    if (!deletePurposeId) return;
    setDeletingPurpose(true);
    try {
      const res = await donationsService.deletePurpose(deletePurposeId);
      if (res.data.success) {
        addToast('Donation purpose deleted.', 'success');
        setDeletePurposeId(null);
        fetchPurposes();
      }
    } catch (err) {
      console.error(err);
      addToast('Failed to delete purpose.', 'danger');
    } finally {
      setDeletingPurpose(false);
    }
  };

  // ==========================================
  // Ledger Handlers
  // ==========================================
  const openAddRecordModal = () => {
    setEditingRecord(null);
    setRecordForm({
      donorName: '',
      amount: '',
      purpose: purposes.length > 0 ? purposes[0].title : 'Tithes & Offerings',
      date: new Date().toISOString().split('T')[0],
      mode: 'UPI',
      note: ''
    });
    setRecordModalOpen(true);
  };

  const openEditRecordModal = (r) => {
    setEditingRecord(r);
    setRecordForm({
      donorName: r.donorName,
      amount: r.amount,
      purpose: r.purpose || 'General Offering',
      date: new Date(r.date).toISOString().split('T')[0],
      mode: r.mode || 'UPI',
      note: r.note || ''
    });
    setRecordModalOpen(true);
  };

  const handleSaveRecord = async (e) => {
    e.preventDefault();
    if (!recordForm.donorName.trim() || !recordForm.amount) {
      addToast('Donor name and amount are required.', 'warning');
      return;
    }

    setSavingRecord(true);
    try {
      if (editingRecord) {
        const res = await donationsService.updateRecord(editingRecord.id, recordForm);
        if (res.data.success) {
          addToast('Donation entry updated.', 'success');
          setRecordModalOpen(false);
          fetchRecords();
        }
      } else {
        const res = await donationsService.createRecord(recordForm);
        if (res.data.success) {
          addToast('Donation record created.', 'success');
          setRecordModalOpen(false);
          fetchRecords();
        }
      }
    } catch (err) {
      console.error(err);
      addToast('Error saving donation record.', 'danger');
    } finally {
      setSavingRecord(false);
    }
  };

  const confirmDeleteRecord = async () => {
    if (!deleteRecordId) return;
    setDeletingRecord(true);
    try {
      const res = await donationsService.deleteRecord(deleteRecordId);
      if (res.data.success) {
        addToast('Donation entry deleted.', 'success');
        setDeleteRecordId(null);
        fetchRecords();
      }
    } catch (err) {
      console.error(err);
      addToast('Failed to delete entry.', 'danger');
    } finally {
      setDeletingRecord(false);
    }
  };

  if (loading) {
    return (
      <div className="py-4">
        <div className="skeleton-box rounded-3 w-25 mb-4" style={{ height: '32px' }} />
        <CardSkeleton count={3} />
      </div>
    );
  }

  return (
    <div>
      <SEO title="Manage Donations & Giving" />

      {/* Header */}
      <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-2">
        <div>
          <h2 className="heading fw-bold mb-1">Donations & Stewardship Management</h2>
          <p className="text-muted small mb-0">
            Manage public bank details, QR code, giving causes, and received donations ledger
          </p>
        </div>
      </div>

      {/* Navigation Tabs */}
      <ul className="nav nav-pills mb-4 gap-2 bg-white p-2 rounded-4 shadow-sm">
        <li className="nav-item">
          <button
            className={`nav-link rounded-pill px-4 ${activeTab === 'bank' ? 'active' : ''}`}
            onClick={() => setActiveTab('bank')}
          >
            <i className="bi bi-bank me-2"></i> Bank & UPI Details
          </button>
        </li>
        <li className="nav-item">
          <button
            className={`nav-link rounded-pill px-4 ${activeTab === 'purposes' ? 'active' : ''}`}
            onClick={() => setActiveTab('purposes')}
          >
            <i className="bi bi-tag-fill me-2"></i> Giving Causes ({purposes.length})
          </button>
        </li>
        <li className="nav-item">
          <button
            className={`nav-link rounded-pill px-4 ${activeTab === 'ledger' ? 'active' : ''}`}
            onClick={() => setActiveTab('ledger')}
          >
            <i className="bi bi-journal-text me-2"></i> Donation Ledger
          </button>
        </li>
      </ul>

      {/* ===================================================================== */}
      {/* TAB 1: BANK & UPI DETAILS                                             */}
      {/* ===================================================================== */}
      {activeTab === 'bank' && (
        <form onSubmit={handleSaveBankSettings}>
          <div className="row g-4">
            <div className="col-lg-7">
              <div className="card border-0 shadow-sm rounded-4 p-4 p-md-5 bg-white hover-lift">
                <h5 className="fw-bold heading mb-4 pb-2 border-bottom d-flex align-items-center gap-2">
                  <i className="bi bi-building text-primary"></i> Bank Account Information
                </h5>

                <div className="row g-3">
                  <div className="col-12">
                    <label className="form-label fw-medium text-dark">Beneficiary Account Name</label>
                    <input
                      type="text"
                      className="form-control"
                      value={bankSettings.donate_account_name}
                      onChange={(e) => handleBankSettingChange('donate_account_name', e.target.value)}
                      required
                    />
                  </div>

                  <div className="col-md-6">
                    <label className="form-label fw-medium text-dark">Bank Name</label>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="e.g. South Indian Bank"
                      value={bankSettings.donate_bank_name}
                      onChange={(e) => handleBankSettingChange('donate_bank_name', e.target.value)}
                    />
                  </div>

                  <div className="col-md-6">
                    <label className="form-label fw-medium text-dark">Branch Name</label>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="e.g. Kollidam Branch"
                      value={bankSettings.donate_branch}
                      onChange={(e) => handleBankSettingChange('donate_branch', e.target.value)}
                    />
                  </div>

                  <div className="col-md-6">
                    <label className="form-label fw-medium text-dark">Account Number</label>
                    <input
                      type="text"
                      className="form-control font-monospace"
                      value={bankSettings.donate_account_number}
                      onChange={(e) => handleBankSettingChange('donate_account_number', e.target.value)}
                      required
                    />
                  </div>

                  <div className="col-md-6">
                    <label className="form-label fw-medium text-dark">IFSC Code</label>
                    <input
                      type="text"
                      className="form-control text-uppercase font-monospace"
                      value={bankSettings.donate_ifsc}
                      onChange={(e) => handleBankSettingChange('donate_ifsc', e.target.value)}
                      required
                    />
                  </div>

                  <div className="col-md-6">
                    <label className="form-label fw-medium text-dark">MICR Code</label>
                    <input
                      type="text"
                      className="form-control font-monospace"
                      value={bankSettings.donate_micr}
                      onChange={(e) => handleBankSettingChange('donate_micr', e.target.value)}
                    />
                  </div>

                  <div className="col-md-6">
                    <label className="form-label fw-medium text-dark">SWIFT Code</label>
                    <input
                      type="text"
                      className="form-control text-uppercase font-monospace"
                      value={bankSettings.donate_swift}
                      onChange={(e) => handleBankSettingChange('donate_swift', e.target.value)}
                    />
                  </div>
                </div>

                <h5 className="fw-bold heading mt-5 mb-4 pb-2 border-bottom d-flex align-items-center gap-2">
                  <i className="bi bi-qr-code-scan text-success"></i> Instant UPI Transfer Details
                </h5>

                <div className="row g-3">
                  <div className="col-12">
                    <label className="form-label fw-medium text-dark">UPI ID / VPA</label>
                    <input
                      type="text"
                      className="form-control font-monospace"
                      placeholder="e.g. kollidamag@upi or 9865681983@upi"
                      value={bankSettings.donate_upi_id}
                      onChange={(e) => handleBankSettingChange('donate_upi_id', e.target.value)}
                    />
                    <div className="form-text small">
                      This UPI ID will be displayed prominently on the public Donate page with a convenient copy button.
                    </div>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-top text-end">
                  <button
                    type="submit"
                    className="btn btn-primary rounded-pill px-5 py-2 shadow-sm fw-semibold"
                    disabled={savingSettings}
                  >
                    {savingSettings ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                        Saving Details...
                      </>
                    ) : (
                      <>
                        <i className="bi bi-check2-circle me-1"></i> Save Bank & UPI Details
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>

            {/* QR Code Upload Column */}
            <div className="col-lg-5">
              <div className="card border-0 shadow-sm rounded-4 p-4 p-md-5 bg-white hover-lift h-100">
                <h5 className="fw-bold heading mb-3 pb-2 border-bottom d-flex align-items-center gap-2">
                  <i className="bi bi-qr-code text-info"></i> Church QR Code
                </h5>
                <p className="text-muted small mb-4">
                  Upload an official UPI QR code (GPay, PhonePe, Paytm, BHIM) for scan-and-pay giving.
                </p>

                <ImageUploadDropzone
                  currentImage={bankSettings.donate_qr_code}
                  onImageSelected={handleQrImageSelected}
                  onImageCleared={handleQrImageCleared}
                  label="Drop QR Code Image (JPG, PNG, WEBP)"
                />

                {bankSettings.donate_qr_code && (
                  <div className="text-center mt-3 p-3 bg-light rounded-3 border">
                    <img
                      src={bankSettings.donate_qr_code}
                      alt="Donation QR Code"
                      className="img-fluid rounded shadow-sm"
                      style={{ maxHeight: '200px' }}
                    />
                    <div className="small text-success mt-2 fw-medium">
                      <i className="bi bi-check2-circle me-1"></i> QR Code Ready
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </form>
      )}

      {/* ===================================================================== */}
      {/* TAB 2: DONATION CAUSES & PURPOSES                                     */}
      {/* ===================================================================== */}
      {activeTab === 'purposes' && (
        <div>
          <div className="d-flex justify-content-between align-items-center mb-3">
            <h5 className="heading fw-bold mb-0">Donation Causes</h5>
            <button
              type="button"
              className="btn btn-primary btn-sm rounded-pill px-3 shadow-sm d-flex align-items-center gap-1"
              onClick={openAddPurposeModal}
            >
              <i className="bi bi-plus-lg"></i> Add New Cause
            </button>
          </div>

          {loadingPurposes ? (
            <CardSkeleton count={3} />
          ) : purposes.length === 0 ? (
            <div className="card border-0 shadow-sm rounded-4 p-5 text-center bg-white">
              <i className="bi bi-tags text-muted display-4 mb-3"></i>
              <h5 className="fw-bold text-dark">No Donation Causes Found</h5>
              <p className="text-muted small mb-3">Click below to add your first church giving purpose.</p>
              <button className="btn btn-primary rounded-pill px-4 mx-auto" onClick={openAddPurposeModal}>
                Add Cause
              </button>
            </div>
          ) : (
            <div className="row g-3">
              {purposes.map((p) => (
                <div className="col-md-6 col-lg-4" key={p.id}>
                  <div
                    className={`card border-0 shadow-sm rounded-4 p-4 bg-white h-100 hover-lift ${
                      p.isActive ? 'border-top border-4 border-primary' : 'opacity-75'
                    }`}
                  >
                    <div className="d-flex justify-content-between align-items-start mb-2">
                      <span className="badge bg-light text-dark border small fw-semibold">
                        Order: {p.order}
                      </span>
                      <div className="form-check form-switch mb-0">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          role="switch"
                          id={`purpose-toggle-${p.id}`}
                          checked={p.isActive}
                          onChange={() => handleTogglePurposeActive(p)}
                        />
                        <label className="form-check-label small" htmlFor={`purpose-toggle-${p.id}`}>
                          {p.isActive ? 'Active' : 'Inactive'}
                        </label>
                      </div>
                    </div>

                    <h5 className="fw-bold text-dark mb-2" style={{ fontFamily: "'Playfair Display', serif" }}>
                      {p.title}
                    </h5>

                    <p className="text-muted small mb-4 flex-grow-1" style={{ lineHeight: '1.6' }}>
                      {p.description || 'No description provided.'}
                    </p>

                    <div className="d-flex justify-content-end gap-2 pt-3 border-top">
                      <button
                        className="btn btn-sm btn-outline-primary rounded-pill px-3"
                        onClick={() => openEditPurposeModal(p)}
                      >
                        <i className="bi bi-pencil me-1"></i> Edit
                      </button>
                      <button
                        className="btn btn-sm btn-outline-danger rounded-circle p-2 d-flex align-items-center justify-content-center"
                        style={{ width: '32px', height: '32px' }}
                        onClick={() => setDeletePurposeId(p.id)}
                        aria-label="Delete cause"
                      >
                        <i className="bi bi-trash"></i>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ===================================================================== */}
      {/* TAB 3: DONATION LEDGER                                                */}
      {/* ===================================================================== */}
      {activeTab === 'ledger' && (
        <div>
          {/* Total Metric Card & Actions */}
          <div className="row g-3 mb-4 align-items-center">
            <div className="col-md-5">
              <div className="card border-0 shadow-sm rounded-4 p-4 text-white" style={{ background: 'linear-gradient(135deg, #0A3D62 0%, #07253D 100%)' }}>
                <span className="text-info small text-uppercase fw-semibold mb-1">Total Recorded Giving</span>
                <h2 className="display-6 fw-bold mb-0">
                  ₹{Number(totalAmount).toLocaleString('en-IN')}
                </h2>
                <span className="small text-light opacity-75 mt-1 d-block">
                  Across {records.length} donation records
                </span>
              </div>
            </div>

            <div className="col-md-7 d-flex flex-column flex-sm-row justify-content-md-end gap-2">
              <div className="input-group">
                <span className="input-group-text bg-white border-end-0">
                  <i className="bi bi-search text-muted"></i>
                </span>
                <input
                  type="text"
                  className="form-control border-start-0"
                  placeholder="Search donor, purpose, mode..."
                  value={ledgerSearch}
                  onChange={(e) => setLedgerSearch(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && fetchRecords()}
                />
                <button className="btn btn-outline-secondary" type="button" onClick={fetchRecords}>
                  Search
                </button>
              </div>

              <button
                type="button"
                className="btn btn-primary rounded-pill px-4 shadow-sm flex-shrink-0 d-flex align-items-center gap-1 justify-content-center"
                onClick={openAddRecordModal}
              >
                <i className="bi bi-plus-circle"></i> Add Entry
              </button>
            </div>
          </div>

          {/* Ledger Table */}
          {loadingRecords ? (
            <CardSkeleton count={3} />
          ) : records.length === 0 ? (
            <div className="card border-0 shadow-sm rounded-4 p-5 text-center bg-white">
              <i className="bi bi-journal-x text-muted display-4 mb-3"></i>
              <h5 className="fw-bold text-dark">No Donation Records Found</h5>
              <p className="text-muted small mb-3">Record tithes and offerings to track your church ledger.</p>
              <button className="btn btn-primary rounded-pill px-4 mx-auto" onClick={openAddRecordModal}>
                Record First Donation
              </button>
            </div>
          ) : (
            <div className="card border-0 shadow-sm rounded-4 overflow-hidden bg-white">
              <div className="table-responsive">
                <table className="table table-hover align-middle mb-0">
                  <thead className="bg-light">
                    <tr>
                      <th className="py-3 px-4">Date</th>
                      <th className="py-3">Donor Name</th>
                      <th className="py-3">Purpose</th>
                      <th className="py-3">Amount</th>
                      <th className="py-3">Payment Mode</th>
                      <th className="py-3">Notes</th>
                      <th className="py-3 px-4 text-end">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {records.map((r) => (
                      <tr key={r.id}>
                        <td className="py-3 px-4 small text-secondary">
                          {new Date(r.date).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric'
                          })}
                        </td>
                        <td className="fw-semibold text-dark">{r.donorName}</td>
                        <td>
                          <span className="badge bg-primary-subtle text-primary rounded-pill px-3 py-1 small">
                            {r.purpose || 'General Offering'}
                          </span>
                        </td>
                        <td className="fw-bold text-success fs-6">
                          ₹{Number(r.amount).toLocaleString('en-IN')}
                        </td>
                        <td>
                          <span className="badge bg-light text-dark border small">
                            {r.mode || 'UPI'}
                          </span>
                        </td>
                        <td className="small text-muted" style={{ maxWidth: '180px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                          {r.note || '—'}
                        </td>
                        <td className="py-3 px-4 text-end">
                          <button
                            className="btn btn-sm btn-outline-primary rounded-circle me-1 p-2 d-inline-flex align-items-center justify-content-center"
                            style={{ width: '32px', height: '32px' }}
                            onClick={() => openEditRecordModal(r)}
                            title="Edit Record"
                          >
                            <i className="bi bi-pencil"></i>
                          </button>
                          <button
                            className="btn btn-sm btn-outline-danger rounded-circle p-2 d-inline-flex align-items-center justify-content-center"
                            style={{ width: '32px', height: '32px' }}
                            onClick={() => setDeleteRecordId(r.id)}
                            title="Delete Record"
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
        </div>
      )}

      {/* ===================================================================== */}
      {/* MODAL: ADD / EDIT PURPOSE                                             */}
      {/* ===================================================================== */}
      {purposeModalOpen && (
        <div
          className="modal fade show d-block"
          tabIndex="-1"
          style={{ backgroundColor: 'rgba(10, 25, 41, 0.65)', zIndex: 1060 }}
          onClick={() => setPurposeModalOpen(false)}
        >
          <div className="modal-dialog modal-dialog-centered" onClick={(e) => e.stopPropagation()}>
            <div className="modal-content border-0 shadow-lg rounded-4 overflow-hidden">
              <div className="modal-header border-0 bg-primary text-white py-3">
                <h5 className="modal-title fw-bold fs-6">
                  {editingPurpose ? 'Edit Giving Cause' : 'Add New Giving Cause'}
                </h5>
                <button
                  type="button"
                  className="btn-close btn-close-white"
                  onClick={() => setPurposeModalOpen(false)}
                ></button>
              </div>
              <form onSubmit={handleSavePurpose}>
                <div className="modal-body p-4">
                  <div className="mb-3">
                    <label className="form-label fw-medium text-dark">Cause / Purpose Title <span className="text-danger">*</span></label>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="e.g. Tithes, Building Fund, Missions"
                      value={purposeForm.title}
                      onChange={(e) => setPurposeForm((prev) => ({ ...prev, title: e.target.value }))}
                      required
                    />
                  </div>

                  <div className="mb-3">
                    <label className="form-label fw-medium text-dark">Description</label>
                    <textarea
                      rows="3"
                      className="form-control"
                      placeholder="Short explanation shown on the public Donate page..."
                      value={purposeForm.description}
                      onChange={(e) => setPurposeForm((prev) => ({ ...prev, description: e.target.value }))}
                    ></textarea>
                  </div>

                  <div className="row g-3">
                    <div className="col-6">
                      <label className="form-label fw-medium text-dark">Display Order</label>
                      <input
                        type="number"
                        className="form-control"
                        value={purposeForm.order}
                        onChange={(e) => setPurposeForm((prev) => ({ ...prev, order: e.target.value }))}
                      />
                    </div>
                    <div className="col-6 d-flex align-items-center mt-4">
                      <div className="form-check form-switch">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          role="switch"
                          id="modal-purpose-active"
                          checked={purposeForm.isActive}
                          onChange={(e) => setPurposeForm((prev) => ({ ...prev, isActive: e.target.checked }))}
                        />
                        <label className="form-check-label fw-medium" htmlFor="modal-purpose-active">
                          Active & Visible
                        </label>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="modal-footer border-0 bg-light p-3">
                  <button
                    type="button"
                    className="btn btn-sm btn-secondary rounded-pill px-3"
                    onClick={() => setPurposeModalOpen(false)}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="btn btn-sm btn-primary rounded-pill px-4"
                    disabled={savingPurpose}
                  >
                    {savingPurpose ? 'Saving...' : 'Save Cause'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* ===================================================================== */}
      {/* MODAL: ADD / EDIT DONATION RECORD                                     */}
      {/* ===================================================================== */}
      {recordModalOpen && (
        <div
          className="modal fade show d-block"
          tabIndex="-1"
          style={{ backgroundColor: 'rgba(10, 25, 41, 0.65)', zIndex: 1060 }}
          onClick={() => setRecordModalOpen(false)}
        >
          <div className="modal-dialog modal-dialog-centered" onClick={(e) => e.stopPropagation()}>
            <div className="modal-content border-0 shadow-lg rounded-4 overflow-hidden">
              <div className="modal-header border-0 bg-primary text-white py-3">
                <h5 className="modal-title fw-bold fs-6">
                  {editingRecord ? 'Edit Donation Entry' : 'Record Received Donation'}
                </h5>
                <button
                  type="button"
                  className="btn-close btn-close-white"
                  onClick={() => setRecordModalOpen(false)}
                ></button>
              </div>
              <form onSubmit={handleSaveRecord}>
                <div className="modal-body p-4">
                  <div className="mb-3">
                    <label className="form-label fw-medium text-dark">Donor Name <span className="text-danger">*</span></label>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="e.g. Bro. David or Anonymous"
                      value={recordForm.donorName}
                      onChange={(e) => setRecordForm((prev) => ({ ...prev, donorName: e.target.value }))}
                      required
                    />
                  </div>

                  <div className="row g-3 mb-3">
                    <div className="col-6">
                      <label className="form-label fw-medium text-dark">Amount (₹) <span className="text-danger">*</span></label>
                      <input
                        type="number"
                        step="any"
                        className="form-control"
                        placeholder="e.g. 5000"
                        value={recordForm.amount}
                        onChange={(e) => setRecordForm((prev) => ({ ...prev, amount: e.target.value }))}
                        required
                      />
                    </div>
                    <div className="col-6">
                      <label className="form-label fw-medium text-dark">Payment Mode</label>
                      <select
                        className="form-select"
                        value={recordForm.mode}
                        onChange={(e) => setRecordForm((prev) => ({ ...prev, mode: e.target.value }))}
                      >
                        <option value="UPI">UPI (GPay / PhonePe)</option>
                        <option value="Bank Transfer">Bank Transfer / NEFT</option>
                        <option value="Cash">Cash Offering</option>
                        <option value="Cheque">Cheque</option>
                        <option value="Other">Other</option>
                      </select>
                    </div>
                  </div>

                  <div className="row g-3 mb-3">
                    <div className="col-6">
                      <label className="form-label fw-medium text-dark">Giving Purpose</label>
                      <input
                        type="text"
                        className="form-control"
                        placeholder="e.g. Tithes, Offering"
                        value={recordForm.purpose}
                        onChange={(e) => setRecordForm((prev) => ({ ...prev, purpose: e.target.value }))}
                        list="purpose-suggestions"
                      />
                      <datalist id="purpose-suggestions">
                        {purposes.map((p) => (
                          <option key={p.id} value={p.title} />
                        ))}
                      </datalist>
                    </div>
                    <div className="col-6">
                      <label className="form-label fw-medium text-dark">Date</label>
                      <input
                        type="date"
                        className="form-control"
                        value={recordForm.date}
                        onChange={(e) => setRecordForm((prev) => ({ ...prev, date: e.target.value }))}
                      />
                    </div>
                  </div>

                  <div className="mb-2">
                    <label className="form-label fw-medium text-dark">Notes / Reference (Optional)</label>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="e.g. Transaction Ref ID, check number"
                      value={recordForm.note}
                      onChange={(e) => setRecordForm((prev) => ({ ...prev, note: e.target.value }))}
                    />
                  </div>
                </div>

                <div className="modal-footer border-0 bg-light p-3">
                  <button
                    type="button"
                    className="btn btn-sm btn-secondary rounded-pill px-3"
                    onClick={() => setRecordModalOpen(false)}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="btn btn-sm btn-primary rounded-pill px-4"
                    disabled={savingRecord}
                  >
                    {savingRecord ? 'Saving...' : 'Save Record'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal for Purpose */}
      <ConfirmDeleteModal
        isOpen={Boolean(deletePurposeId)}
        onClose={() => setDeletePurposeId(null)}
        onConfirm={confirmDeletePurpose}
        title="Delete Giving Cause"
        message="Are you sure you want to delete this donation cause? This will remove it from the public Donate page."
        loading={deletingPurpose}
      />

      {/* Delete Confirmation Modal for Ledger Record */}
      <ConfirmDeleteModal
        isOpen={Boolean(deleteRecordId)}
        onClose={() => setDeleteRecordId(null)}
        onConfirm={confirmDeleteRecord}
        title="Delete Donation Record"
        message="Are you sure you want to delete this donation ledger record? This will adjust the total amount accordingly."
        loading={deletingRecord}
      />
    </div>
  );
};

export default AdminDonationsPage;
