import React, { createContext, useContext, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const ToastContext = createContext(null);

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const addToast = useCallback((message, type = 'success', duration = 4000) => {
    const id = Date.now() + Math.random();
    setToasts((prev) => [...prev, { id, message, type }]);

    if (duration > 0) {
      setTimeout(() => {
        removeToast(id);
      }, duration);
    }
  }, []);

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const getToastIcon = (type) => {
    switch (type) {
      case 'success':
        return 'bi-check-circle-fill text-success';
      case 'danger':
      case 'error':
        return 'bi-exclamation-triangle-fill text-danger';
      case 'warning':
        return 'bi-exclamation-circle-fill text-warning';
      default:
        return 'bi-info-circle-fill text-primary';
    }
  };

  const getBorderColor = (type) => {
    switch (type) {
      case 'success':
        return '#198754';
      case 'danger':
      case 'error':
        return '#dc3545';
      case 'warning':
        return '#ffc107';
      default:
        return '#38a1db';
    }
  };

  return (
    <ToastContext.Provider value={{ addToast, removeToast }}>
      {children}
      <div
        className="toast-container position-fixed bottom-0 end-0 p-3"
        style={{ zIndex: 9999, pointerEvents: 'none' }}
        aria-live="polite"
      >
        <AnimatePresence>
          {toasts.map((toast) => (
            <motion.div
              key={toast.id}
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.9 }}
              transition={{ duration: 0.25 }}
              className="card shadow-lg border-0 mb-2 overflow-hidden"
              style={{
                pointerEvents: 'auto',
                minWidth: '280px',
                maxWidth: '380px',
                borderRadius: '12px',
                borderLeft: `4px solid ${getBorderColor(toast.type)}`,
                backgroundColor: '#ffffff'
              }}
              role="alert"
            >
              <div className="card-body p-3 d-flex align-items-center justify-content-between gap-3">
                <div className="d-flex align-items-center gap-2">
                  <i className={`bi ${getToastIcon(toast.type)} fs-5`}></i>
                  <span className="small fw-medium text-dark">{toast.message}</span>
                </div>
                <button
                  type="button"
                  className="btn-close btn-close-sm"
                  aria-label="Close"
                  onClick={() => removeToast(toast.id)}
                  style={{ fontSize: '0.75rem' }}
                />
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};
