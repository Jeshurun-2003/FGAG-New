import React, { useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const LightboxModal = ({ isOpen, onClose, imageSrc, title, category, onPrev, onNext, hasPrev, hasNext }) => {
  const touchStartX = useRef(null);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!isOpen) return;
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowLeft' && hasPrev && onPrev) onPrev();
      if (e.key === 'ArrowRight' && hasNext && onNext) onNext();
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose, onPrev, onNext, hasPrev, hasNext]);

  // Touch Swipe Support
  const handleTouchStart = (e) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e) => {
    if (touchStartX.current === null) return;
    const touchEndX = e.changedTouches[0].clientX;
    const diff = touchStartX.current - touchEndX;

    if (Math.abs(diff) > 50) {
      if (diff > 0 && hasNext && onNext) {
        // Swiped left -> Next
        onNext();
      } else if (diff < 0 && hasPrev && onPrev) {
        // Swiped right -> Prev
        onPrev();
      }
    }
    touchStartX.current = null;
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="modal fade show d-block"
          tabIndex="-1"
          style={{ backgroundColor: 'rgba(5, 20, 35, 0.92)', zIndex: 1060, backdropFilter: 'blur(8px)' }}
          onClick={onClose}
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
        >
          {/* Navigation Controls */}
          {hasPrev && onPrev && (
            <button
              className="btn btn-dark position-absolute start-0 top-50 translate-middle-y ms-2 ms-md-4 rounded-circle p-2 d-flex align-items-center justify-content-center shadow-lg"
              style={{ zIndex: 1070, width: '48px', height: '48px', backgroundColor: 'rgba(10, 61, 98, 0.75)', border: '1px solid rgba(255,255,255,0.2)' }}
              onClick={(e) => {
                e.stopPropagation();
                onPrev();
              }}
              aria-label="Previous photo"
            >
              <i className="bi bi-chevron-left text-white fs-5"></i>
            </button>
          )}

          {hasNext && onNext && (
            <button
              className="btn btn-dark position-absolute end-0 top-50 translate-middle-y me-2 me-md-4 rounded-circle p-2 d-flex align-items-center justify-content-center shadow-lg"
              style={{ zIndex: 1070, width: '48px', height: '48px', backgroundColor: 'rgba(10, 61, 98, 0.75)', border: '1px solid rgba(255,255,255,0.2)' }}
              onClick={(e) => {
                e.stopPropagation();
                onNext();
              }}
              aria-label="Next photo"
            >
              <i className="bi bi-chevron-right text-white fs-5"></i>
            </button>
          )}

          <div
            className="modal-dialog modal-dialog-centered modal-xl"
            onClick={(e) => e.stopPropagation()}
            style={{ maxWidth: '92vw' }}
          >
            <motion.div
              initial={{ scale: 0.92, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.92, opacity: 0 }}
              transition={{ duration: 0.25 }}
              className="modal-content border-0 bg-transparent text-white"
            >
              <div className="modal-header border-0 pb-2 pt-0 px-2 d-flex justify-content-between align-items-center">
                <div className="d-flex align-items-center gap-2">
                  <h5 className="modal-title text-white fw-bold mb-0" style={{ fontFamily: "'Playfair Display', serif" }}>
                    {title || 'Church Gallery'}
                  </h5>
                  {category && (
                    <span className="badge px-3 py-1 text-uppercase rounded-pill" style={{ backgroundColor: '#38a1db' }}>
                      {category}
                    </span>
                  )}
                </div>
                <button
                  type="button"
                  className="btn-close btn-close-white fs-5"
                  onClick={onClose}
                  aria-label="Close"
                ></button>
              </div>

              <div className="modal-body text-center p-0 mt-2 position-relative">
                <img
                  src={imageSrc}
                  alt={title || 'Enlarged photo'}
                  className="img-fluid rounded-4 shadow-lg"
                  style={{ maxHeight: '82vh', width: 'auto', maxWidth: '100%', objectFit: 'contain' }}
                />
              </div>
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default LightboxModal;
