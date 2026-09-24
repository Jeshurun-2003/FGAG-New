import React, { useEffect } from 'react';

const LightboxModal = ({ isOpen, onClose, imageSrc, title, category }) => {
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      className="modal fade show d-block"
      tabIndex="-1"
      style={{ backgroundColor: 'rgba(0, 0, 0, 0.85)', zIndex: 1060 }}
      onClick={onClose}
    >
      <div
        className="modal-dialog modal-dialog-centered modal-lg"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="modal-content border-0 bg-transparent text-white">
          <div className="modal-header border-0 pb-0">
            <h5 className="modal-title text-white">
              {title || 'Gallery Image'}{' '}
              {category && <span className="badge bg-primary text-uppercase ms-2">{category}</span>}
            </h5>
            <button
              type="button"
              className="btn-close btn-close-white"
              onClick={onClose}
              aria-label="Close"
            ></button>
          </div>
          <div className="modal-body text-center p-2">
            <img
              src={imageSrc}
              alt={title || 'Enlarged photo'}
              className="img-fluid rounded-3 shadow-lg"
              style={{ maxHeight: '80vh', objectFit: 'contain' }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default LightboxModal;
