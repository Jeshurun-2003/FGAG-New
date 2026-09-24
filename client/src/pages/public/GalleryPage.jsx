import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { galleryService } from '../../services/api';
import LightboxModal from '../../components/common/LightboxModal';
import { GallerySkeleton } from '../../components/common/SkeletonLoader';
import SEO from '../../components/common/SEO';

const categoriesList = [
  { id: 'all', label: 'All Photos' },
  { id: 'sunday service', label: 'Sunday Service' },
  { id: 'kids', label: 'Kids' },
  { id: 'youth', label: 'Youth Pics' },
  { id: 'outreach', label: 'Outreach' },
  { id: 'christmas', label: 'Christmas' },
  { id: 'special events', label: 'Special Events' }
];

const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.45, ease: [0.16, 1, 0.3, 1] } }
};

const GalleryPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const activeCategory = searchParams.get('category') || 'all';

  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activePhotoIndex, setActivePhotoIndex] = useState(null);

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

  const currentPhoto = activePhotoIndex !== null ? images[activePhotoIndex] : null;

  const handlePrev = () => {
    if (activePhotoIndex !== null && activePhotoIndex > 0) {
      setActivePhotoIndex(activePhotoIndex - 1);
    }
  };

  const handleNext = () => {
    if (activePhotoIndex !== null && activePhotoIndex < images.length - 1) {
      setActivePhotoIndex(activePhotoIndex + 1);
    }
  };

  return (
    <div className="container py-5">
      <SEO
        title="Gallery"
        description="View photo moments of worship, Sunday school, youth gatherings, outreach, and church celebrations at Friends Garden AG Church."
      />

      <motion.div
        className="text-center mb-4"
        initial={{ opacity: 0, y: -15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="heading display-5 fw-bold mb-2">Church Gallery</h1>
        <div className="section-divider">
          <i className="bi bi-diamond-fill section-divider-icon"></i>
        </div>
        <p className="paragraph lead text-muted mx-auto" style={{ maxWidth: '680px' }}>
          Capturing joyous moments of worship, fellowship, and ministry in God's presence.
        </p>
      </motion.div>

      {/* Category Tabs with Animated Pill Buttons */}
      <div className="d-flex flex-wrap justify-content-center gap-2 mb-5">
        {categoriesList.map((cat) => {
          const isActive = activeCategory === cat.id;
          return (
            <motion.button
              key={cat.id}
              onClick={() => setCategory(cat.id)}
              className={`btn rounded-pill px-3 py-2 fw-medium ${
                isActive ? 'btn-primary' : 'btn-outline-primary'
              }`}
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.97 }}
              aria-pressed={isActive}
            >
              {cat.label}
            </motion.button>
          );
        })}
      </div>

      {/* Images Grid */}
      {loading ? (
        <GallerySkeleton count={8} />
      ) : images.length === 0 ? (
        <motion.div
          className="text-center py-5"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <i className="bi bi-images display-1 text-muted opacity-50 d-block mb-3"></i>
          <h4 className="text-secondary">No photos found in this category yet.</h4>
        </motion.div>
      ) : (
        <motion.div
          className="row row-cols-1 row-cols-sm-2 row-cols-md-3 row-cols-lg-4 g-4"
          initial="hidden"
          animate="visible"
          variants={{
            hidden: { opacity: 0 },
            visible: { opacity: 1, transition: { staggerChildren: 0.08 } }
          }}
        >
          {images.map((img, idx) => (
            <motion.div className="col" key={img.id} variants={fadeInUp}>
              <div
                className="gallery-image-card shadow-sm h-100 bg-white"
                onClick={() => setActivePhotoIndex(idx)}
                role="button"
                tabIndex="0"
                onKeyDown={(e) => e.key === 'Enter' && setActivePhotoIndex(idx)}
                aria-label={`View photo: ${img.title || img.category}`}
              >
                <div className="position-relative overflow-hidden" style={{ aspectRatio: '4 / 3', backgroundColor: '#e2e8f0' }}>
                  <img
                    src={img.imageUrl}
                    alt={img.title || 'Church photo'}
                    className="w-100 h-100"
                    style={{ objectFit: 'cover' }}
                    loading="lazy"
                    onError={(e) => {
                      e.target.src = '/images/church_inside_2.jpg';
                    }}
                  />
                  {/* Subtle hover overlay */}
                  <div className="gallery-overlay">
                    <div className="text-white w-100">
                      <span className="badge bg-primary text-uppercase mb-1 small">
                        {img.category}
                      </span>
                      {img.title && <h6 className="fw-bold mb-0 text-truncate text-white">{img.title}</h6>}
                    </div>
                  </div>
                </div>

                <div className="p-3 text-center">
                  <span className="badge bg-light text-primary text-uppercase mb-1 small">
                    {img.category}
                  </span>
                  {img.title && <h6 className="heading fw-bold mb-0 text-truncate">{img.title}</h6>}
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      )}

      {/* Enhanced Lightbox Modal with Next/Prev & Swipe */}
      <LightboxModal
        isOpen={activePhotoIndex !== null}
        onClose={() => setActivePhotoIndex(null)}
        imageSrc={currentPhoto?.imageUrl}
        title={currentPhoto?.title}
        category={currentPhoto?.category}
        onPrev={handlePrev}
        onNext={handleNext}
        hasPrev={activePhotoIndex !== null && activePhotoIndex > 0}
        hasNext={activePhotoIndex !== null && activePhotoIndex < images.length - 1}
      />
    </div>
  );
};

export default GalleryPage;
