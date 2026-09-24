import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { galleryService } from '../../services/api';
import { GallerySkeleton } from '../../components/common/SkeletonLoader';
import ImageUploadDropzone from '../../components/admin/ImageUploadDropzone';
import ConfirmDeleteModal from '../../components/admin/ConfirmDeleteModal';
import { useToast } from '../../context/ToastContext';
import SEO from '../../components/common/SEO';

const categories = [
  'sunday service',
  'kids',
  'youth',
  'outreach',
  'christmas',
  'special events'
];

const AdminGalleryPage = () => {
  const { addToast } = useToast();
  const [activeCategory, setActiveCategory] = useState('all');
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);

  const [newTitle, setNewTitle] = useState('');
  const [newCategory, setNewCategory] = useState('sunday service');
  const [newFile, setNewFile] = useState(null);

  const [deleteId, setDeleteId] = useState(null);
  const [deleting, setDeleting] = useState(false);

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
      addToast('Failed to load gallery photos.', 'danger');
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
      addToast('Please select or drop an image file to upload.', 'warning');
      return;
    }

    setUploading(true);
    const formData = new FormData();
    formData.append('title', newTitle);
    formData.append('category', newCategory);
    formData.append('image', newFile);

    try {
      const res = await galleryService.upload(formData);
      if (res.data.success) {
        addToast('Photo uploaded successfully!', 'success');
        setNewTitle('');
        setNewFile(null);
        fetchImages();
      }
    } catch (err) {
      console.error(err);
      addToast(err.response?.data?.message || 'Upload failed.', 'danger');
    } finally {
      setUploading(false);
    }
  };

  const confirmDelete = async () => {
    if (!deleteId) return;
    setDeleting(true);
    try {
      const res = await galleryService.delete(deleteId);
      if (res.data.success) {
        addToast('Photo deleted successfully.', 'success');
        setDeleteId(null);
        fetchImages();
      }
    } catch (err) {
      console.error(err);
      addToast('Failed to delete photo.', 'danger');
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div>
      <SEO title="Manage Gallery" />

      <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-2">
        <div>
          <h2 className="heading fw-bold mb-1">Gallery Management</h2>
          <p className="text-muted small mb-0">Upload photos into categories, edit titles, and organize pictures</p>
        </div>
      </div>

      {/* Upload Box */}
      <div className="card border-0 shadow-sm rounded-4 p-4 p-md-5 bg-white mb-5">
        <h4 className="heading fw-bold mb-3 d-flex align-items-center gap-2">
          <i className="bi bi-cloud-arrow-up text-primary"></i> Upload New Photo
        </h4>

        <form onSubmit={handleUpload}>
          <div className="row g-3">
            <div className="col-md-6">
              <label className="form-label fw-medium text-dark">Photo Caption / Title (Optional)</label>
              <input
                type="text"
                className="form-control"
                placeholder="e.g. Easter Celebration Choir"
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
              />
            </div>

            <div className="col-md-6">
              <label className="form-label fw-medium text-dark">Category *</label>
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

            {/* Drag & Drop Upload Zone */}
            <div className="col-12">
              <ImageUploadDropzone
                currentImage={null}
                onImageSelected={(file) => setNewFile(file)}
                onImageCleared={() => setNewFile(null)}
                label="Choose or Drag Photo"
              />
            </div>

            <div className="col-12 text-end">
              <button
                type="submit"
                className="btn btn-primary px-4 py-2 rounded-pill shadow-sm d-inline-flex align-items-center gap-2"
                disabled={uploading || !newFile}
              >
                {uploading ? (
                  <>
                    <span className="spinner-border spinner-border-sm" role="status"></span>
                    Uploading & Storing...
                  </>
                ) : (
                  <>
                    <i className="bi bi-upload"></i> Upload to Gallery
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
          className={`btn rounded-pill px-3 py-2 fw-medium ${
            activeCategory === 'all' ? 'btn-primary' : 'btn-outline-primary'
          }`}
          onClick={() => setActiveCategory('all')}
        >
          All Photos ({images.length})
        </button>
        {categories.map((cat) => (
          <button
            key={cat}
            className={`btn rounded-pill px-3 py-2 text-capitalize fw-medium ${
              activeCategory === cat ? 'btn-primary' : 'btn-outline-primary'
            }`}
            onClick={() => setActiveCategory(cat)}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Photos Grid */}
      {loading ? (
        <GallerySkeleton count={8} />
      ) : images.length === 0 ? (
        <div className="card border-0 shadow-sm rounded-4 p-5 text-center bg-white">
          <i className="bi bi-images display-3 text-muted mb-3"></i>
          <h4>No Photos in this Category</h4>
          <p className="text-muted">Upload a photo using the box above to get started.</p>
        </div>
      ) : (
        <div className="row row-cols-1 row-cols-sm-2 row-cols-md-3 row-cols-lg-4 g-4">
          {images.map((img) => (
            <div className="col" key={img.id}>
              <div className="card h-100 border-0 shadow-sm rounded-4 bg-white overflow-hidden hover-lift">
                <div className="position-relative">
                  <img
                    src={img.imageUrl}
                    alt={img.title || 'Church photo'}
                    style={{ height: '200px', width: '100%', objectFit: 'cover' }}
                    loading="lazy"
                  />
                  <button
                    className="btn btn-sm btn-danger position-absolute top-0 end-0 m-2 rounded-circle shadow"
                    style={{ width: '32px', height: '32px', padding: 0 }}
                    onClick={() => setDeleteId(img.id)}
                    title="Delete photo"
                    aria-label="Delete photo"
                  >
                    <i className="bi bi-trash"></i>
                  </button>
                </div>
                <div className="card-body p-3 text-center">
                  <span className="badge bg-light text-primary text-uppercase mb-1 small">
                    {img.category}
                  </span>
                  <h6 className="heading fw-bold mb-0 text-truncate" title={img.title}>
                    {img.title || <span className="text-muted fst-italic">Untitled Photo</span>}
                  </h6>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Delete Confirmation Modal */}
      <ConfirmDeleteModal
        isOpen={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={confirmDelete}
        loading={deleting}
        title="Delete Photo"
        message="Are you sure you want to delete this photo from the gallery? It will be permanently removed."
      />
    </div>
  );
};

export default AdminGalleryPage;
