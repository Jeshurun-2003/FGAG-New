import React, { useState, useRef } from 'react';

const ImageUploadDropzone = ({
  currentImage,
  onImageSelected,
  onImageCleared,
  label = 'Upload Image (Max 10MB: JPG, PNG, WEBP)'
}) => {
  const [isDragOver, setIsDragOver] = useState(false);
  const [preview, setPreview] = useState(currentImage || null);
  const [error, setError] = useState(null);
  const fileInputRef = useRef(null);

  const validateAndProcessFile = (file) => {
    setError(null);
    if (!file) return;

    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
    if (!allowedTypes.includes(file.type)) {
      setError('Invalid file type! Please upload a JPG, PNG, WEBP, or GIF image.');
      return;
    }

    // 10MB Limit
    if (file.size > 10 * 1024 * 1024) {
      setError('File is too large! Maximum allowed size is 10MB.');
      return;
    }

    const previewUrl = URL.createObjectURL(file);
    setPreview(previewUrl);
    if (onImageSelected) {
      onImageSelected(file);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = () => {
    setIsDragOver(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      validateAndProcessFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      validateAndProcessFile(e.target.files[0]);
    }
  };

  const handleClear = (e) => {
    e.stopPropagation();
    setPreview(null);
    setError(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    if (onImageCleared) {
      onImageCleared();
    }
  };

  return (
    <div className="mb-3">
      {label && <label className="form-label fw-medium small text-dark">{label}</label>}

      {error && (
        <div className="alert alert-danger py-2 small mb-2 d-flex align-items-center gap-2">
          <i className="bi bi-exclamation-octagon-fill"></i>
          <span>{error}</span>
        </div>
      )}

      <div
        className={`dropzone-box position-relative ${isDragOver ? 'drag-over' : ''}`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
      >
        <input
          type="file"
          ref={fileInputRef}
          className="d-none"
          accept="image/jpeg,image/png,image/webp,image/gif"
          onChange={handleFileChange}
        />

        {preview ? (
          <div className="position-relative text-center">
            <img
              src={preview}
              alt="Preview"
              className="img-fluid rounded-3 shadow-sm mb-2"
              style={{ maxHeight: '200px', objectFit: 'contain' }}
            />
            <div className="d-flex justify-content-center gap-2 mt-2">
              <button
                type="button"
                className="btn btn-sm btn-outline-secondary"
                onClick={(e) => {
                  e.stopPropagation();
                  fileInputRef.current?.click();
                }}
              >
                <i className="bi bi-arrow-repeat me-1"></i> Change Image
              </button>
              <button
                type="button"
                className="btn btn-sm btn-outline-danger"
                onClick={handleClear}
              >
                <i className="bi bi-trash me-1"></i> Remove
              </button>
            </div>
          </div>
        ) : (
          <div className="py-3 text-center">
            <i className="bi bi-cloud-arrow-up display-5 text-primary mb-2 d-block"></i>
            <p className="fw-semibold mb-1 text-dark">Drag and drop your image here, or browse</p>
            <span className="text-muted small">Supports JPG, PNG, WEBP (Up to 10MB)</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default ImageUploadDropzone;
