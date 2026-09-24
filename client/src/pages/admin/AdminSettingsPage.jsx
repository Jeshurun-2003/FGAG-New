import React, { useState, useEffect } from 'react';
import { settingsService } from '../../services/api';
import { CardSkeleton } from '../../components/common/SkeletonLoader';
import { useToast } from '../../context/ToastContext';
import SEO from '../../components/common/SEO';

const AdminSettingsPage = () => {
  const { addToast } = useToast();
  const [settings, setSettings] = useState({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const res = await settingsService.getPublic();
        if (res.data.success) {
          setSettings(res.data.settings);
        }
      } catch (err) {
        console.error('Failed to load settings', err);
        addToast('Failed to load website settings.', 'danger');
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

    try {
      const res = await settingsService.update(settings);
      if (res.data.success) {
        addToast('Website settings saved successfully!', 'success');
      }
    } catch (err) {
      console.error(err);
      addToast('Error saving settings. Please try again.', 'danger');
    } finally {
      setSaving(false);
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
      <SEO title="Website Settings" />

      <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-2">
        <div>
          <h2 className="heading fw-bold mb-1">Website Settings</h2>
          <p className="text-muted small mb-0">Contact coordinates, social media, and banking details</p>
        </div>
        <button
          type="button"
          className="btn btn-primary rounded-pill px-4 py-2 shadow-sm d-flex align-items-center gap-2"
          onClick={handleSubmit}
          disabled={saving}
        >
          {saving ? (
            <>
              <span className="spinner-border spinner-border-sm" role="status"></span>
              Saving...
            </>
          ) : (
            <>
              <i className="bi bi-check2-circle"></i> Save Settings
            </>
          )}
        </button>
      </div>

      <form onSubmit={handleSubmit}>
        {/* Contact Coordinates */}
        <div className="card border-0 shadow-sm rounded-4 p-4 p-md-5 bg-white mb-4 hover-lift">
          <h4 className="fw-bold heading mb-3 pb-2 border-bottom d-flex align-items-center gap-2">
            <i className="bi bi-geo-alt text-primary"></i> Church Contact Details
          </h4>
          <div className="row g-3">
            <div className="col-12">
              <label className="form-label fw-medium text-dark">Physical Address</label>
              <input
                type="text"
                className="form-control"
                value={settings.contact_address || ''}
                onChange={(e) => handleChange('contact_address', e.target.value)}
              />
            </div>
            <div className="col-md-4">
              <label className="form-label fw-medium text-dark">Official Email</label>
              <input
                type="email"
                className="form-control"
                value={settings.contact_email || ''}
                onChange={(e) => handleChange('contact_email', e.target.value)}
              />
            </div>
            <div className="col-md-4">
              <label className="form-label fw-medium text-dark">Phone / WhatsApp Helpline</label>
              <input
                type="text"
                className="form-control"
                value={settings.contact_phone || ''}
                onChange={(e) => handleChange('contact_phone', e.target.value)}
              />
            </div>
            <div className="col-md-4">
              <label className="form-label fw-medium text-dark">Office Hours</label>
              <input
                type="text"
                className="form-control"
                value={settings.contact_hours || ''}
                onChange={(e) => handleChange('contact_hours', e.target.value)}
              />
            </div>
            <div className="col-12">
              <label className="form-label fw-medium text-dark">Google Maps Embed URL</label>
              <input
                type="text"
                className="form-control"
                value={settings.contact_map_embed || ''}
                onChange={(e) => handleChange('contact_map_embed', e.target.value)}
              />
            </div>
            <div className="col-12">
              <label className="form-label fw-medium text-dark">Google Maps Direct Link</label>
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
        <div className="card border-0 shadow-sm rounded-4 p-4 p-md-5 bg-white mb-4 hover-lift">
          <h4 className="fw-bold heading mb-3 pb-2 border-bottom d-flex align-items-center gap-2">
            <i className="bi bi-share text-primary"></i> Social Media Links
          </h4>
          <div className="row g-3">
            <div className="col-md-6">
              <label className="form-label fw-medium text-dark">Instagram URL</label>
              <input
                type="url"
                className="form-control"
                value={settings.social_instagram || ''}
                onChange={(e) => handleChange('social_instagram', e.target.value)}
              />
            </div>
            <div className="col-md-6">
              <label className="form-label fw-medium text-dark">Facebook URL</label>
              <input
                type="url"
                className="form-control"
                value={settings.social_facebook || ''}
                onChange={(e) => handleChange('social_facebook', e.target.value)}
              />
            </div>
            <div className="col-md-6">
              <label className="form-label fw-medium text-dark">Twitter / X URL</label>
              <input
                type="url"
                className="form-control"
                value={settings.social_twitter || ''}
                onChange={(e) => handleChange('social_twitter', e.target.value)}
              />
            </div>
            <div className="col-md-6">
              <label className="form-label fw-medium text-dark">WhatsApp Link</label>
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
        <div className="card border-0 shadow-sm rounded-4 p-4 p-md-5 bg-white mb-4 hover-lift">
          <h4 className="fw-bold heading mb-3 pb-2 border-bottom d-flex align-items-center gap-2">
            <i className="bi bi-bank text-primary"></i> Bank Details for Offerings & Giving
          </h4>
          <div className="row g-3">
            <div className="col-md-6">
              <label className="form-label fw-medium text-dark">Account Name</label>
              <input
                type="text"
                className="form-control"
                value={settings.donate_account_name || ''}
                onChange={(e) => handleChange('donate_account_name', e.target.value)}
              />
            </div>
            <div className="col-md-6">
              <label className="form-label fw-medium text-dark">Account Number</label>
              <input
                type="text"
                className="form-control"
                value={settings.donate_account_number || ''}
                onChange={(e) => handleChange('donate_account_number', e.target.value)}
              />
            </div>
            <div className="col-md-4">
              <label className="form-label fw-medium text-dark">IFSC Code</label>
              <input
                type="text"
                className="form-control"
                value={settings.donate_ifsc || ''}
                onChange={(e) => handleChange('donate_ifsc', e.target.value)}
              />
            </div>
            <div className="col-md-4">
              <label className="form-label fw-medium text-dark">MICR Code</label>
              <input
                type="text"
                className="form-control"
                value={settings.donate_micr || ''}
                onChange={(e) => handleChange('donate_micr', e.target.value)}
              />
            </div>
            <div className="col-md-4">
              <label className="form-label fw-medium text-dark">SWIFT Code</label>
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
          <button type="submit" className="btn btn-primary px-5 py-3 rounded-pill shadow fw-semibold" disabled={saving}>
            {saving ? (
              <>
                <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                Saving...
              </>
            ) : (
              'Save Settings'
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AdminSettingsPage;
