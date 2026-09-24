import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { galleryService } from '../../services/api';
import LightboxModal from '../../components/common/LightboxModal';
import LoadingSpinner from '../../components/common/LoadingSpinner';

const categoriesList = [
  { id: 'all', label: 'All Photos' },
  { id: 'sunday service', label: 'Sunday Service' },
  { id: 'kids', label: 'Kids' },
  { id: 'youth', label: 'Youth Pics' },
  { id: 'outreach', label: 'Outreach' },
  { id: 'christmas', label: 'Christmas' },
  { id: 'special events', label: 'Special Events' }
];

const GalleryPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const activeCategory = searchParams.get('category') || 'all';

  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [lightboxImg, setLightboxImg] = useState(null);

  useEffect(() => {
    const fetchImages = async () => {
      setLoading(true);
      try {
        const catQuery = activeCategory === 'all' ? '' : activeCategory;
        const res = await galleryService.getImages(catQuery);
        if (res.data.success) {
          setImages(res.data.images);
        }
      } catch (err) {
        console.error('Failed to load gallery images', err);
      } finally {
        setLoading(false);
      }
    };

    fetchImages();
  }, [activeCategory]);

  const setCategory = (catId) => {
    if (catId === 'all') {
      searchParams.delete('category');
      setSearchParams(searchParams);
    } else {
      setSearchParams({ category: catId });
    }
  };

  return (
    <div className="container py-5">
      <div className="text-center mb-4">
        <h1 className="heading display-5 fw-bold mb-2">Church Gallery</h1>
        <p className="paragraph lead text-muted">
          Capturing joyous moments of worship, fellowship, and ministry in God's presence.
        </p>
      </div>

      {/* Category Tabs */}
      <div className="d-flex flex-wrap justify-content-center gap-2 mb-5">
        {categoriesList.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setCategory(cat.id)}
            className={`btn rounded-pill px-3 py-2 fw-medium ${
              activeCategory === cat.id ? 'btn-primary' : 'btn-outline-primary'
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Images Grid */}
      {loading ? (
        <LoadingSpinner message="Loading gallery photos..." />
      ) : images.length === 0 ? (
        <div className="text-center py-5">
          <i className="bi bi-images display-1 text-muted opacity-50 d-block mb-3"></i>
          <h4 className="text-secondary">No photos found in this category yet.</h4>
        </div>
      ) : (
        <div className="row row-cols-1 row-cols-sm-2 row-cols-md-3 row-cols-lg-4 g-4">
          {images.map((img) => (
            <div className="col" key={img.id}>
              <div
                className="gallery-image-card shadow-sm h-100 bg-white"
                onClick={() => setLightboxImg(img)}
              >
                <img src={img.imageUrl} alt={img.title || 'Church photo'} loading="lazy" />
                <div className="p-3 text-center">
                  <span className="badge bg-light text-primary text-uppercase mb-1 small">
                    {img.category}
                  </span>
                  {img.title && <h6 className="heading fw-bold mb-0 text-truncate">{img.title}</h6>}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Lightbox Modal */}
      <LightboxModal
        isOpen={!!lightboxImg}
        onClose={() => setLightboxImg(null)}
        imageSrc={lightboxImg?.imageUrl}
        title={lightboxImg?.title}
        category={lightboxImg?.category}
      />
    </div>
  );
};

export default GalleryPage;
