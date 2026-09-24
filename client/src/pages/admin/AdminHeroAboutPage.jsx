import React, { useState, useEffect } from 'react';
import { settingsService } from '../../services/api';
import LoadingSpinner from '../../components/common/LoadingSpinner';

const AdminHeroAboutPage = () => {
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

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    setStatusMsg(null);

    try {
      const res = await settingsService.update(settings);
      if (res.data.success) {
        setStatusMsg({ type: 'success', text: 'All content settings saved successfully!' });
      }
    } catch (err) {
      console.error(err);
      setStatusMsg({ type: 'danger', text: 'Failed to update settings. Please try again.' });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <LoadingSpinner message="Loading content settings..." />;
  }

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-2">
        <div>
          <h2 className="heading fw-bold mb-1">Hero & Content CMS</h2>
          <p className="text-muted small mb-0">
            Edit text, scriptures, pastor welcome, and about page content across the website
          </p>
        </div>
        <button
          type="button"
          onClick={handleSave}
          className="btn btn-primary"
          disabled={saving}
        >
          {saving ? (
            <>
              <span className="spinner-border spinner-border-sm me-2" role="status"></span>
              Saving...
            </>
          ) : (
            <>
              <i className="bi bi-check2-circle me-1"></i> Save Changes
            </>
          )}
        </button>
      </div>

      {statusMsg && (
        <div className={`alert alert-${statusMsg.type} alert-dismissible fade show mb-4`} role="alert">
          {statusMsg.text}
          <button type="button" className="btn-close" onClick={() => setStatusMsg(null)}></button>
        </div>
      )}

      <form onSubmit={handleSave}>
        {/* 1. Hero Section */}
        <div className="card border-0 shadow-sm rounded-4 p-4 bg-white mb-4">
          <h4 className="fw-bold heading mb-3 pb-2 border-bottom">
            <i className="bi bi-window-fullscreen text-primary me-2"></i> Hero Banner Section
          </h4>
          <div className="row g-3">
            <div className="col-md-6">
              <label className="form-label fw-medium">Church Name / Hero Title</label>
              <input
                type="text"
                className="form-control"
                value={settings.hero_title || ''}
                onChange={(e) => handleChange('hero_title', e.target.value)}
              />
            </div>
            <div className="col-md-6">
              <label className="form-label fw-medium">Hero Subtitle / Tagline</label>
              <input
                type="text"
                className="form-control"
                value={settings.hero_subtitle || ''}
                onChange={(e) => handleChange('hero_subtitle', e.target.value)}
              />
            </div>
            <div className="col-md-6">
              <label className="form-label fw-medium">YouTube Channel URL</label>
              <input
                type="url"
                className="form-control"
                value={settings.hero_youtube_url || ''}
                onChange={(e) => handleChange('hero_youtube_url', e.target.value)}
              />
            </div>
            <div className="col-md-6">
              <label className="form-label fw-medium">Hero Background Image Path</label>
              <input
                type="text"
                className="form-control"
                value={settings.hero_bg_image || ''}
                onChange={(e) => handleChange('hero_bg_image', e.target.value)}
              />
            </div>
          </div>
        </div>

        {/* 2. Church Promise Section */}
        <div className="card border-0 shadow-sm rounded-4 p-4 bg-white mb-4">
          <h4 className="fw-bold heading mb-3 pb-2 border-bottom">
            <i className="bi bi-bookmark-star text-primary me-2"></i> Church Promise Verse
          </h4>
          <div className="row g-3">
            <div className="col-md-4">
              <label className="form-label fw-medium">Promise Year</label>
              <input
                type="text"
                className="form-control"
                value={settings.promise_year || ''}
                onChange={(e) => handleChange('promise_year', e.target.value)}
              />
            </div>
            <div className="col-md-8">
              <label className="form-label fw-medium">Scripture Reference</label>
              <input
                type="text"
                className="form-control"
                value={settings.promise_ref || ''}
                onChange={(e) => handleChange('promise_ref', e.target.value)}
              />
            </div>
            <div className="col-12">
              <label className="form-label fw-medium">Promise Scripture Text</label>
              <textarea
                className="form-control"
                rows="3"
                value={settings.promise_verse || ''}
                onChange={(e) => handleChange('promise_verse', e.target.value)}
              ></textarea>
            </div>
          </div>
        </div>

        {/* 3. Pastor Welcome Message */}
        <div className="card border-0 shadow-sm rounded-4 p-4 bg-white mb-4">
          <h4 className="fw-bold heading mb-3 pb-2 border-bottom">
            <i className="bi bi-person-lines-fill text-primary me-2"></i> Pastor's Welcome Section (Home Page)
          </h4>
          <div className="row g-3">
            <div className="col-md-6">
              <label className="form-label fw-medium">Section Title</label>
              <input
                type="text"
                className="form-control"
                value={settings.pastor_welcome_title || ''}
                onChange={(e) => handleChange('pastor_welcome_title', e.target.value)}
              />
            </div>
            <div className="col-md-3">
              <label className="form-label fw-medium">Pastor's Name</label>
              <input
                type="text"
                className="form-control"
                value={settings.pastor_name || ''}
                onChange={(e) => handleChange('pastor_name', e.target.value)}
              />
            </div>
            <div className="col-md-3">
              <label className="form-label fw-medium">Pastor's Designation</label>
              <input
                type="text"
                className="form-control"
                value={settings.pastor_role || ''}
                onChange={(e) => handleChange('pastor_role', e.target.value)}
              />
            </div>
            <div className="col-md-6">
              <label className="form-label fw-medium">Pastor Image Path</label>
              <input
                type="text"
                className="form-control"
                value={settings.pastor_image || ''}
                onChange={(e) => handleChange('pastor_image', e.target.value)}
              />
            </div>
            <div className="col-12">
              <label className="form-label fw-medium">Welcome Message Content</label>
              <textarea
                className="form-control"
                rows="6"
                value={settings.pastor_welcome_message || ''}
                onChange={(e) => handleChange('pastor_welcome_message', e.target.value)}
              ></textarea>
            </div>
          </div>
        </div>

        {/* 4. Uvamaigal App Section */}
        <div className="card border-0 shadow-sm rounded-4 p-4 bg-white mb-4">
          <h4 className="fw-bold heading mb-3 pb-2 border-bottom">
            <i className="bi bi-phone text-primary me-2"></i> Uvamaigal App Promotion
          </h4>
          <div className="row g-3">
            <div className="col-md-6">
              <label className="form-label fw-medium">App Heading</label>
              <input
                type="text"
                className="form-control"
                value={settings.app_title || ''}
                onChange={(e) => handleChange('app_title', e.target.value)}
              />
            </div>
            <div className="col-md-6">
              <label className="form-label fw-medium">Google Play Store Link</label>
              <input
                type="url"
                className="form-control"
                value={settings.app_playstore_url || ''}
                onChange={(e) => handleChange('app_playstore_url', e.target.value)}
              />
            </div>
            <div className="col-12">
              <label className="form-label fw-medium">App Description</label>
              <textarea
                className="form-control"
                rows="4"
                value={settings.app_desc || ''}
                onChange={(e) => handleChange('app_desc', e.target.value)}
              ></textarea>
            </div>
          </div>
        </div>

        {/* 5. About Page Content */}
        <div className="card border-0 shadow-sm rounded-4 p-4 bg-white mb-4">
          <h4 className="fw-bold heading mb-3 pb-2 border-bottom">
            <i className="bi bi-info-circle text-primary me-2"></i> About Us Page Content
          </h4>
          <div className="row g-3">
            <div className="col-md-6">
              <label className="form-label fw-medium">Pastor Family Image Path</label>
              <input
                type="text"
                className="form-control"
                value={settings.pastor_family_image || ''}
                onChange={(e) => handleChange('pastor_family_image', e.target.value)}
              />
            </div>
            <div className="col-12">
              <label className="form-label fw-medium">Church Story & Description</label>
              <textarea
                className="form-control"
                rows="6"
                value={settings.about_story || ''}
                onChange={(e) => handleChange('about_story', e.target.value)}
              ></textarea>
            </div>
            <div className="col-12">
              <label className="form-label fw-medium">Senior Pastor Biography</label>
              <textarea
                className="form-control"
                rows="5"
                value={settings.pastor_bio || ''}
                onChange={(e) => handleChange('pastor_bio', e.target.value)}
              ></textarea>
            </div>
          </div>
        </div>

        <div className="text-end mb-5">
          <button type="submit" className="btn btn-primary px-5 py-2" disabled={saving}>
            {saving ? 'Saving...' : 'Save All Settings'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AdminHeroAboutPage;
