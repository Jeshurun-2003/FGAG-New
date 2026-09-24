import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import SEO from '../../components/common/SEO';
import Logo from '../../components/common/Logo';

const AdminLoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const { login, isAuthenticated } = useAuth();
  const { addToast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/admin', { replace: true });
    }
  }, [isAuthenticated, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      await login(email, password);
      addToast('Welcome back, Administrator!', 'success');
      navigate('/admin');
    } catch (err) {
      console.error(err);
      const errMsg = err.response?.data?.message || err.message || 'Invalid email or password.';
      setError(errMsg);
      addToast(errMsg, 'danger');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="d-flex align-items-center justify-content-center min-vh-100 p-3 position-relative overflow-hidden"
      style={{
        background: 'radial-gradient(circle at 50% 20%, #0d4b78 0%, #072a44 60%, #041929 100%)'
      }}
    >
      <SEO title="Admin Login" />

      <motion.div
        className="card shadow-lg border-0 rounded-4 p-4 p-sm-5 bg-white position-relative"
        style={{ maxWidth: '440px', width: '100%', zIndex: 2 }}
        initial={{ opacity: 0, y: 25, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
      >
        <div className="text-center mb-4">
          <div className="mb-3 d-inline-block">
            <Logo variant="dark" size={84} alt="FGAG Church Logo" />
          </div>
          <h3 className="fw-bold heading mb-1">⛪ FGAG Admin</h3>
          <p className="text-muted small mb-0">Sign in to manage the church website</p>
        </div>

        {error && (
          <div className="alert alert-danger py-2 small mb-3 text-center rounded-3 d-flex align-items-center justify-content-center gap-2" role="alert">
            <i className="bi bi-exclamation-triangle-fill"></i>
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label fw-medium small text-dark">Admin Email</label>
            <div className="input-group">
              <span className="input-group-text bg-light border-end-0">
                <i className="bi bi-envelope text-muted"></i>
              </span>
              <input
                type="email"
                className="form-control border-start-0"
                placeholder="admin@fgag.test"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="mb-4">
            <label className="form-label fw-medium small text-dark">Password</label>
            <div className="input-group">
              <span className="input-group-text bg-light border-end-0">
                <i className="bi bi-lock text-muted"></i>
              </span>
              <input
                type={showPassword ? 'text' : 'password'}
                className="form-control border-start-0 border-end-0"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <button
                type="button"
                className="btn btn-light border border-start-0 text-muted"
                onClick={() => setShowPassword(!showPassword)}
                aria-label="Toggle password visibility"
              >
                <i className={`bi ${showPassword ? 'bi-eye-slash' : 'bi-eye'}`}></i>
              </button>
            </div>
          </div>

          <motion.button
            type="submit"
            className="btn btn-primary w-100 py-3 fw-semibold rounded-pill shadow-sm"
            disabled={loading}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            {loading ? (
              <>
                <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                Authenticating...
              </>
            ) : (
              'Sign In'
            )}
          </motion.button>
        </form>

        <div className="text-center mt-4 pt-3 border-top">
          <Link to="/" className="text-decoration-none small text-secondary d-inline-flex align-items-center gap-1 hover-primary">
            <i className="bi bi-arrow-left"></i> Back to Church Website
          </Link>
        </div>
      </motion.div>
    </div>
  );
};

export default AdminLoginPage;
