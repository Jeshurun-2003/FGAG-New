import React, { useState, useEffect } from 'react';
import { settingsService } from '../../services/api';
import LoadingSpinner from '../../components/common/LoadingSpinner';

const AdminSettingsPage = () => {
  const [settings, setSettings] = useState({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [statusMsg, setStatusMsg] = useState(null);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const res = await settingsService.getPublic();
        if (res.data.success) {
          setSettings(res.data.settings);
        }
      } catch (err) {
        console.error('Failed to load settings', err);
      } finally {
        setLoading(false);
      }
    };
    fetchSettings();
  }, []);

  const handleChange = (key, value) => {
    setSettings((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setStatusMsg(null);

    try {
      const res = await settingsService.update(settings);
      if (res.data.success) {
        setStatusMsg({ type: 'success', text: 'Website settings saved successfully!' });
      }
    } catch (err) {
      console.error(err);
      setStatusMsg({ type: 'danger', text: 'Error saving settings. Please try again.' });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <LoadingSpinner message="Loading website settings..." />;
  }

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-2">
        <div>
          <h2 className="heading fw-bold mb-1">Website Settings</h2>
          <p className="text-muted small mb-0">Contact coordinates, social media, and banking details</p>
        </div>
        <button type="button" className="btn btn-primary" onClick={handleSubmit} disabled={saving}>
          {saving ? 'Saving...' : 'Save Settings'}
        </button>
      </div>

      {statusMsg && (
        <div className={`alert alert-${statusMsg.type} alert-dismissible fade show mb-4`} role="alert">
          {statusMsg.text}
          <button type="button" className="btn-close" onClick={() => setStatusMsg(null)}></button>
        </div>
      )}

      <form onSubmit={handleSubmit}>
        {/* Contact Coordinates */}
        <div className="card border-0 shadow-sm rounded-4 p-4 bg-white mb-4">
          <h4 className="fw-bold heading mb-3 pb-2 border-bottom">
            <i className="bi bi-geo-alt text-primary me-2"></i> Church Contact Details
          </h4>
          <div className="row g-3">
            <div className="col-12">
              <label className="form-label fw-medium">Physical Address</label>
              <input
                type="text"
                className="form-control"
                value={settings.contact_address || ''}
                onChange={(e) => handleChange('contact_address', e.target.value)}
              />
            </div>
            <div className="col-md-4">
              <label className="form-label fw-medium">Official Email</label>
              <input
                type="email"
                className="form-control"
                value={settings.contact_email || ''}
                onChange={(e) => handleChange('contact_email', e.target.value)}
              />
            </div>
            <div className="col-md-4">
              <label className="form-label fw-medium">Phone / WhatsApp Helpline</label>
              <input
                type="text"
                className="form-control"
                value={settings.contact_phone || ''}
                onChange={(e) => handleChange('contact_phone', e.target.value)}
              />
            </div>
            <div className="col-md-4">
              <label className="form-label fw-medium">Office Hours</label>
              <input
                type="text"
                className="form-control"
                value={settings.contact_hours || ''}
                onChange={(e) => handleChange('contact_hours', e.target.value)}
              />
            </div>
            <div className="col-12">
              <label className="form-label fw-medium">Google Maps Embed URL</label>
              <input
                type="text"
                className="form-control"
                value={settings.contact_map_embed || ''}
                onChange={(e) => handleChange('contact_map_embed', e.target.value)}
              />
            </div>
            <div className="col-12">
              <label className="form-label fw-medium">Google Maps Direct Link</label>
              <input
                type="url"
                className="form-control"
                value={settings.contact_map_link || ''}
                onChange={(e) => handleChange('contact_map_link', e.target.value)}
              />
            </div>
          </div>
        </div>

        {/* Social Media Links */}
        <div className="card border-0 shadow-sm rounded-4 p-4 bg-white mb-4">
          <h4 className="fw-bold heading mb-3 pb-2 border-bottom">
            <i className="bi bi-share text-primary me-2"></i> Social Media Links
          </h4>
          <div className="row g-3">
            <div className="col-md-6">
              <label className="form-label fw-medium">Instagram URL</label>
              <input
                type="url"
                className="form-control"
                value={settings.social_instagram || ''}
                onChange={(e) => handleChange('social_instagram', e.target.value)}
              />
            </div>
            <div className="col-md-6">
              <label className="form-label fw-medium">Facebook URL</label>
              <input
                type="url"
                className="form-control"
                value={settings.social_facebook || ''}
                onChange={(e) => handleChange('social_facebook', e.target.value)}
              />
            </div>
            <div className="col-md-6">
              <label className="form-label fw-medium">Twitter / X URL</label>
              <input
                type="url"
                className="form-control"
                value={settings.social_twitter || ''}
                onChange={(e) => handleChange('social_twitter', e.target.value)}
              />
            </div>
            <div className="col-md-6">
              <label className="form-label fw-medium">WhatsApp Link</label>
              <input
                type="url"
                className="form-control"
                value={settings.social_whatsapp || ''}
                onChange={(e) => handleChange('social_whatsapp', e.target.value)}
              />
            </div>
          </div>
        </div>

        {/* Banking Details */}
        <div className="card border-0 shadow-sm rounded-4 p-4 bg-white mb-4">
          <h4 className="fw-bold heading mb-3 pb-2 border-bottom">
            <i className="bi bi-bank text-primary me-2"></i> Bank Details for Offerings & Giving
          </h4>
          <div className="row g-3">
            <div className="col-md-6">
              <label className="form-label fw-medium">Account Name</label>
              <input
                type="text"
                className="form-control"
                value={settings.donate_account_name || ''}
                onChange={(e) => handleChange('donate_account_name', e.target.value)}
              />
            </div>
            <div className="col-md-6">
              <label className="form-label fw-medium">Account Number</label>
              <input
                type="text"
                className="form-control"
                value={settings.donate_account_number || ''}
                onChange={(e) => handleChange('donate_account_number', e.target.value)}
              />
            </div>
            <div className="col-md-4">
              <label className="form-label fw-medium">IFSC Code</label>
              <input
                type="text"
                className="form-control"
                value={settings.donate_ifsc || ''}
                onChange={(e) => handleChange('donate_ifsc', e.target.value)}
              />
            </div>
            <div className="col-md-4">
              <label className="form-label fw-medium">MICR Code</label>
              <input
                type="text"
                className="form-control"
                value={settings.donate_micr || ''}
                onChange={(e) => handleChange('donate_micr', e.target.value)}
              />
            </div>
            <div className="col-md-4">
              <label className="form-label fw-medium">SWIFT Code</label>
              <input
                type="text"
                className="form-control"
                value={settings.donate_swift || ''}
                onChange={(e) => handleChange('donate_swift', e.target.value)}
              />
            </div>
          </div>
        </div>

        <div className="text-end mb-5">
          <button type="submit" className="btn btn-primary px-5 py-2" disabled={saving}>
            {saving ? 'Saving...' : 'Save Settings'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AdminSettingsPage;
