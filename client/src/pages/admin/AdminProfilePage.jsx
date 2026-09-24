import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { authService } from '../../services/api';

const AdminProfilePage = () => {
  const { admin, updateAdminState } = useAuth();

  const [profileName, setProfileName] = useState(admin?.name || '');
  const [profileEmail, setProfileEmail] = useState(admin?.email || '');
  const [profileLoading, setProfileLoading] = useState(false);
  const [profileMsg, setProfileMsg] = useState(null);

  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [passwordMsg, setPasswordMsg] = useState(null);

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setProfileLoading(true);
    setProfileMsg(null);

    try {
      const res = await authService.updateProfile({ name: profileName, email: profileEmail });
      if (res.data.success) {
        updateAdminState(res.data.admin);
        setProfileMsg({ type: 'success', text: 'Admin profile updated successfully!' });
      }
    } catch (err) {
      console.error(err);
      setProfileMsg({ type: 'danger', text: err.response?.data?.message || 'Failed to update profile.' });
    } finally {
      setProfileLoading(false);
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    setPasswordMsg(null);

    if (newPassword !== confirmPassword) {
      setPasswordMsg({ type: 'danger', text: 'New password and confirmation do not match.' });
      return;
    }

    if (newPassword.length < 6) {
      setPasswordMsg({ type: 'danger', text: 'New password must be at least 6 characters long.' });
      return;
    }

    setPasswordLoading(true);
    try {
      const res = await authService.changePassword({ currentPassword, newPassword });
      if (res.data.success) {
        setPasswordMsg({ type: 'success', text: 'Password changed successfully!' });
        setCurrentPassword('');
        setNewPassword('');
        setConfirmPassword('');
      }
    } catch (err) {
      console.error(err);
      setPasswordMsg({ type: 'danger', text: err.response?.data?.message || 'Failed to change password.' });
    } finally {
      setPasswordLoading(false);
    }
  };

  return (
    <div>
      <div className="mb-4">
        <h2 className="heading fw-bold mb-1">Admin Profile & Security</h2>
        <p className="text-muted small mb-0">Update your administrator details and password credentials</p>
      </div>

      <div className="row g-4">
        {/* Profile Information */}
        <div className="col-lg-6">
          <div className="card border-0 shadow-sm rounded-4 p-4 bg-white h-100">
            <h4 className="heading fw-bold mb-3 pb-2 border-bottom">
              <i className="bi bi-person-circle text-primary me-2"></i> Profile Information
            </h4>

            {profileMsg && (
              <div className={`alert alert-${profileMsg.type} alert-dismissible fade show`} role="alert">
                {profileMsg.text}
                <button type="button" className="btn-close" onClick={() => setProfileMsg(null)}></button>
              </div>
            )}

            <form onSubmit={handleUpdateProfile}>
              <div className="mb-3">
                <label className="form-label fw-medium">Display Name</label>
                <input
                  type="text"
                  className="form-control"
                  value={profileName}
                  onChange={(e) => setProfileName(e.target.value)}
                  required
                />
              </div>

              <div className="mb-4">
                <label className="form-label fw-medium">Admin Email Address</label>
                <input
                  type="email"
                  className="form-control"
                  value={profileEmail}
                  onChange={(e) => setProfileEmail(e.target.value)}
                  required
                />
                <span className="small text-muted">Used to sign in to this admin dashboard.</span>
              </div>

              <button type="submit" className="btn btn-primary" disabled={profileLoading}>
                {profileLoading ? 'Saving...' : 'Update Profile'}
              </button>
            </form>
          </div>
        </div>

        {/* Change Password */}
        <div className="col-lg-6">
          <div className="card border-0 shadow-sm rounded-4 p-4 bg-white h-100">
            <h4 className="heading fw-bold mb-3 pb-2 border-bottom">
              <i className="bi bi-key text-primary me-2"></i> Change Password
            </h4>

            {passwordMsg && (
              <div className={`alert alert-${passwordMsg.type} alert-dismissible fade show`} role="alert">
                {passwordMsg.text}
                <button type="button" className="btn-close" onClick={() => setPasswordMsg(null)}></button>
              </div>
            )}

            <form onSubmit={handleChangePassword}>
              <div className="mb-3">
                <label className="form-label fw-medium">Current Password</label>
                <input
                  type="password"
                  className="form-control"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  required
                />
              </div>

              <div className="mb-3">
                <label className="form-label fw-medium">New Password</label>
                <input
                  type="password"
                  className="form-control"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  required
                  placeholder="Min 6 characters"
                />
              </div>

              <div className="mb-4">
                <label className="form-label fw-medium">Confirm New Password</label>
                <input
                  type="password"
                  className="form-control"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                />
              </div>

              <button type="submit" className="btn btn-primary" disabled={passwordLoading}>
                {passwordLoading ? 'Updating...' : 'Change Password'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminProfilePage;
