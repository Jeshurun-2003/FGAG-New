import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { authService } from '../../services/api';
import { useToast } from '../../context/ToastContext';
import SEO from '../../components/common/SEO';

const AdminProfilePage = () => {
  const { admin, updateAdminState } = useAuth();
  const { addToast } = useToast();

  const [profileName, setProfileName] = useState(admin?.name || '');
  const [profileEmail, setProfileEmail] = useState(admin?.email || '');
  const [profileLoading, setProfileLoading] = useState(false);

  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [passwordLoading, setPasswordLoading] = useState(false);

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setProfileLoading(true);

    try {
      const res = await authService.updateProfile({ name: profileName, email: profileEmail });
      if (res.data.success) {
        updateAdminState(res.data.admin);
        addToast('Admin profile updated successfully!', 'success');
      }
    } catch (err) {
      console.error(err);
      addToast(err.response?.data?.message || 'Failed to update profile.', 'danger');
    } finally {
      setProfileLoading(false);
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();

    if (newPassword !== confirmPassword) {
      addToast('New password and confirmation do not match.', 'danger');
      return;
    }

    if (newPassword.length < 6) {
      addToast('New password must be at least 6 characters long.', 'danger');
      return;
    }

    setPasswordLoading(true);
    try {
      const res = await authService.changePassword({ currentPassword, newPassword });
      if (res.data.success) {
        addToast('Password changed successfully!', 'success');
        setCurrentPassword('');
        setNewPassword('');
        setConfirmPassword('');
      }
    } catch (err) {
      console.error(err);
      addToast(err.response?.data?.message || 'Failed to change password.', 'danger');
    } finally {
      setPasswordLoading(false);
    }
  };

  return (
    <div>
      <SEO title="Profile & Security" />

      <div className="mb-4">
        <h2 className="heading fw-bold mb-1">Admin Profile & Security</h2>
        <p className="text-muted small mb-0">Update your administrator details and password credentials</p>
      </div>

      <div className="row g-4">
        {/* Profile Information */}
        <div className="col-lg-6">
          <div className="card border-0 shadow-sm rounded-4 p-4 p-md-5 bg-white h-100 hover-lift">
            <h4 className="heading fw-bold mb-3 pb-2 border-bottom d-flex align-items-center gap-2">
              <i className="bi bi-person-circle text-primary"></i> Profile Information
            </h4>

            <form onSubmit={handleUpdateProfile}>
              <div className="mb-3">
                <label className="form-label fw-medium text-dark">Display Name</label>
                <input
                  type="text"
                  className="form-control"
                  value={profileName}
                  onChange={(e) => setProfileName(e.target.value)}
                  required
                />
              </div>

              <div className="mb-4">
                <label className="form-label fw-medium text-dark">Admin Email Address</label>
                <input
                  type="email"
                  className="form-control"
                  value={profileEmail}
                  onChange={(e) => setProfileEmail(e.target.value)}
                  required
                />
                <span className="small text-muted d-block mt-1">Used to sign in to this admin dashboard.</span>
              </div>

              <button type="submit" className="btn btn-primary rounded-pill px-4 py-2" disabled={profileLoading}>
                {profileLoading ? (
                  <>
                    <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                    Saving...
                  </>
                ) : (
                  'Update Profile'
                )}
              </button>
            </form>
          </div>
        </div>

        {/* Change Password */}
        <div className="col-lg-6">
          <div className="card border-0 shadow-sm rounded-4 p-4 p-md-5 bg-white h-100 hover-lift">
            <h4 className="heading fw-bold mb-3 pb-2 border-bottom d-flex align-items-center gap-2">
              <i className="bi bi-shield-lock text-primary"></i> Change Password
            </h4>

            <form onSubmit={handleChangePassword}>
              <div className="mb-3">
                <label className="form-label fw-medium text-dark">Current Password</label>
                <div className="input-group">
                  <input
                    type={showCurrent ? 'text' : 'password'}
                    className="form-control"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    required
                  />
                  <button
                    type="button"
                    className="btn btn-outline-secondary"
                    onClick={() => setShowCurrent(!showCurrent)}
                    aria-label="Toggle password visibility"
                  >
                    <i className={`bi ${showCurrent ? 'bi-eye-slash' : 'bi-eye'}`}></i>
                  </button>
                </div>
              </div>

              <div className="mb-3">
                <label className="form-label fw-medium text-dark">New Password</label>
                <div className="input-group">
                  <input
                    type={showNew ? 'text' : 'password'}
                    className="form-control"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    required
                    placeholder="Min 6 characters"
                  />
                  <button
                    type="button"
                    className="btn btn-outline-secondary"
                    onClick={() => setShowNew(!showNew)}
                    aria-label="Toggle password visibility"
                  >
                    <i className={`bi ${showNew ? 'bi-eye-slash' : 'bi-eye'}`}></i>
                  </button>
                </div>
              </div>

              <div className="mb-4">
                <label className="form-label fw-medium text-dark">Confirm New Password</label>
                <input
                  type={showNew ? 'text' : 'password'}
                  className="form-control"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                />
              </div>

              <button type="submit" className="btn btn-primary rounded-pill px-4 py-2" disabled={passwordLoading}>
                {passwordLoading ? (
                  <>
                    <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                    Updating...
                  </>
                ) : (
                  'Change Password'
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminProfilePage;
