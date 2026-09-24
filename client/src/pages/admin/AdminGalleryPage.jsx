import React, { useState, useEffect } from 'react';
import { galleryService } from '../../services/api';
import LoadingSpinner from '../../components/common/LoadingSpinner';

const categories = [
  'sunday service',
  'kids',
  'youth',
  'outreach',
  'christmas',
  'special events'
];

const AdminGalleryPage = () => {
  const [activeCategory, setActiveCategory] = useState('all');
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [statusMsg, setStatusMsg] = useState(null);

  const [newTitle, setNewTitle] = useState('');
  const [newCategory, setNewCategory] = useState('sunday service');
  const [newFile, setNewFile] = useState(null);

  const fetchImages = async () => {
    try {
      setLoading(true);
      const cat = activeCategory === 'all' ? '' : activeCategory;
      const res = await galleryService.getImages(cat);
      if (res.data.success) {
        setImages(res.data.images);
      }
    } catch (err) {
      console.error(err);
      setStatusMsg({ type: 'danger', text: 'Failed to load gallery photos.' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchImages();
  }, [activeCategory]);

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!newFile) {
      setStatusMsg({ type: 'danger', text: 'Please select an image file to upload.' });
      return;
    }

    setUploading(true);
    setStatusMsg(null);

    const formData = new FormData();
    formData.append('title', newTitle);
    formData.append('category', newCategory);
    formData.append('image', newFile);

    try {
      const res = await galleryService.upload(formData);
      if (res.data.success) {
        setStatusMsg({ type: 'success', text: 'Photo uploaded successfully!' });
        setNewTitle('');
        setNewFile(null);
        // Reset file input value
        const fileInput = document.getElementById('galleryFileInput');
        if (fileInput) fileInput.value = '';
        fetchImages();
      }
    } catch (err) {
      console.error(err);
      setStatusMsg({ type: 'danger', text: err.response?.data?.message || 'Upload failed.' });
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this photo?')) return;
    try {
      const res = await galleryService.delete(id);
      if (res.data.success) {
        setStatusMsg({ type: 'success', text: 'Photo deleted successfully.' });
        fetchImages();
      }
    } catch (err) {
      console.error(err);
      setStatusMsg({ type: 'danger', text: 'Failed to delete photo.' });
    }
  };

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-2">
        <div>
          <h2 className="heading fw-bold mb-1">Gallery Management</h2>
          <p className="text-muted small mb-0">Upload photos into categories, edit titles, and organize pictures</p>
        </div>
      </div>

      {statusMsg && (
        <div className={`alert alert-${statusMsg.type} alert-dismissible fade show mb-4`} role="alert">
          {statusMsg.text}
          <button type="button" className="btn-close" onClick={() => setStatusMsg(null)}></button>
        </div>
      )}

      {/* Upload Box */}
      <div className="card border-0 shadow-sm rounded-4 p-4 bg-white mb-5">
        <h5 className="fw-bold heading mb-3">
          <i className="bi bi-cloud-arrow-up text-primary me-2"></i> Upload New Photo
        </h5>
        <form onSubmit={handleUpload}>
          <div className="row g-3 align-items-end">
            <div className="col-md-4">
              <label className="form-label fw-medium small">Photo Title / Caption</label>
              <input
                type="text"
                className="form-control"
                placeholder="e.g. Sunday Morning Worship"
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
              />
            </div>

            <div className="col-md-3">
              <label className="form-label fw-medium small">Category *</label>
              <select
                className="form-select text-capitalize"
                value={newCategory}
                onChange={(e) => setNewCategory(e.target.value)}
                required
              >
                {categories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            <div className="col-md-3">
              <label className="form-label fw-medium small">Image File (JPG, PNG) *</label>
              <input
                type="file"
                id="galleryFileInput"
                className="form-control"
                accept="image/*"
                onChange={(e) => setNewFile(e.target.files[0])}
                required
              />
            </div>

            <div className="col-md-2">
              <button
                type="submit"
                className="btn btn-primary w-100 py-2"
                disabled={uploading}
              >
                {uploading ? (
                  <>
                    <span className="spinner-border spinner-border-sm me-1" role="status"></span>
                    Uploading...
                  </>
                ) : (
                  <>
                    <i className="bi bi-upload me-1"></i> Upload
                  </>
                )}
              </button>
            </div>
          </div>
        </form>
      </div>

      {/* Category Filter Pills */}
      <div className="d-flex flex-wrap gap-2 mb-4">
        <button
          className={`btn btn-sm rounded-pill px-3 py-1 ${
            activeCategory === 'all' ? 'btn-primary' : 'btn-outline-secondary'
          }`}
          onClick={() => setActiveCategory('all')}
        >
          All Photos
        </button>
        {categories.map((cat) => (
          <button
            key={cat}
            className={`btn btn-sm rounded-pill text-capitalize px-3 py-1 ${
              activeCategory === cat ? 'btn-primary' : 'btn-outline-secondary'
            }`}
            onClick={() => setActiveCategory(cat)}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Photos Grid */}
      {loading ? (
        <LoadingSpinner message="Loading gallery..." />
      ) : images.length === 0 ? (
        <div className="card border-0 shadow-sm rounded-4 p-5 text-center bg-white">
          <i className="bi bi-images display-3 text-muted mb-3"></i>
          <h4>No Photos Found</h4>
          <p className="text-muted">No images found for this category. Upload one above!</p>
        </div>
      ) : (
        <div className="row row-cols-2 row-cols-sm-3 row-cols-md-4 row-cols-xl-5 g-3">
          {images.map((img) => (
            <div className="col" key={img.id}>
              <div className="card h-100 rounded-3 border-0 shadow-sm overflow-hidden bg-white">
                <img
                  src={img.imageUrl}
                  alt={img.title || 'Church photo'}
                  style={{ height: '160px', objectFit: 'cover' }}
                  loading="lazy"
                />
                <div className="card-body p-2 d-flex flex-column">
                  <span className="badge bg-light text-secondary text-uppercase small text-truncate mb-1">
                    {img.category}
                  </span>
                  <strong className="small text-truncate mb-2 text-dark" title={img.title || ''}>
                    {img.title || 'Untitled Photo'}
                  </strong>
                  <button
                    className="btn btn-outline-danger btn-sm mt-auto w-100"
                    onClick={() => handleDelete(img.id)}
                    title="Delete photo"
                  >
                    <i className="bi bi-trash me-1"></i> Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminGalleryPage;
