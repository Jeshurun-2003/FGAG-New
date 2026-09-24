import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import SEO from '../../components/common/SEO';
import { CardSkeleton } from '../../components/common/SkeletonLoader';
import { sermonService } from '../../services/api';

const CATEGORIES = [
  'All',
  'Sunday Service',
  'Faith & Prayer',
  'Grace & Salvation',
  'Youth & Family',
  'Revival & Outreach'
];

const SermonsPage = () => {
  const [sermons, setSermons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState({ total: 0, totalPages: 1 });

  const fetchSermons = async (cat, search, pageNum) => {
    try {
      setLoading(true);
      const res = await sermonService.getAll({
        category: cat !== 'All' ? cat : undefined,
        search: search.trim() || undefined,
        page: pageNum,
        limit: 9
      });
      if (res.data && res.data.success) {
        setSermons(res.data.sermons || []);
        if (res.data.pagination) {
          setPagination(res.data.pagination);
        }
      }
    } catch (err) {
      console.error('Failed to load sermons:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSermons(activeCategory, searchQuery, page);
  }, [activeCategory, page]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setPage(1);
    fetchSermons(activeCategory, searchQuery, 1);
  };

  const handleCategoryClick = (cat) => {
    setActiveCategory(cat);
    setPage(1);
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return '';
    try {
      return new Date(dateStr).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
      });
    } catch (e) {
      return '';
    }
  };

  return (
    <div>
      <SEO
        title="Sermons & Media"
        description="Listen to life-transforming messages and biblical teachings from Friends Garden AG Church, Kollidam."
      />

      {/* Header Banner */}
      <section
        className="position-relative text-white py-5 text-center"
        style={{
          background: 'linear-gradient(135deg, #072a44 0%, #0a3d62 50%, #175480 100%)',
          paddingTop: '110px'
        }}
      >
        <div className="container py-4">
          <span className="section-eyebrow" style={{ backgroundColor: 'rgba(56, 161, 219, 0.25)', color: '#ffffff', borderColor: 'rgba(255, 255, 255, 0.2)' }}>
            Biblical Teaching & Worship
          </span>
          <h1
            className="display-4 fw-bold text-white mb-3"
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            Sermons & Media
          </h1>
          <p className="lead mx-auto text-light opacity-90 mb-0" style={{ maxWidth: '640px' }}>
            Be encouraged and strengthened in your faith through the inspiring messages and worship services of Friends Garden AG Church.
          </p>
        </div>
      </section>

      {/* Filters & Search Section */}
      <section className="py-4 border-bottom bg-white">
        <div className="container">
          <div className="row g-3 align-items-center justify-content-between">
            {/* Category Pills */}
            <div className="col-12 col-lg-8">
              <div className="d-flex flex-wrap gap-2">
                {CATEGORIES.map((cat) => (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => handleCategoryClick(cat)}
                    className={`filter-pill ${activeCategory === cat ? 'active' : ''}`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            {/* Search Input */}
            <div className="col-12 col-lg-4">
              <form onSubmit={handleSearchSubmit} className="d-flex gap-2">
                <div className="input-group">
                  <span className="input-group-text bg-light border-end-0">
                    <i className="bi bi-search text-muted"></i>
                  </span>
                  <input
                    type="text"
                    className="form-control border-start-0"
                    placeholder="Search sermons or speaker..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                  {searchQuery && (
                    <button
                      type="button"
                      className="btn btn-outline-secondary border-start-0"
                      onClick={() => {
                        setSearchQuery('');
                        fetchSermons(activeCategory, '', 1);
                      }}
                    >
                      &times;
                    </button>
                  )}
                </div>
                <button type="submit" className="btn btn-primary px-3">
                  Search
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* Sermons Grid Section */}
      <section className="section-padding section-ice">
        <div className="container">
          {loading ? (
            <div className="row g-4">
              {[1, 2, 3, 4, 5, 6].map((n) => (
                <div key={n} className="col-12 col-md-6 col-lg-4">
                  <CardSkeleton />
                </div>
              ))}
            </div>
          ) : sermons.length === 0 ? (
            <div className="card shadow-sm border-0 rounded-4 text-center p-5 bg-white mx-auto" style={{ maxWidth: '580px' }}>
              <div className="mb-3 text-muted display-4">
                <i className="bi bi-collection-play"></i>
              </div>
              <h3 className="fw-bold heading mb-2">No Sermons Found</h3>
              <p className="text-muted mb-4">
                We couldn't find any sermons matching your current filter. Please try a different category or search keyword.
              </p>
              <div>
                <button
                  onClick={() => {
                    setActiveCategory('All');
                    setSearchQuery('');
                    fetchSermons('All', '', 1);
                  }}
                  className="btn btn-primary"
                >
                  Reset Filters
                </button>
              </div>
            </div>
          ) : (
            <>
              <div className="row g-4">
                {sermons.map((sermon, index) => {
                  const thumb = sermon.thumbnailUrl || '/images/church_inside_2.jpg';
                  return (
                    <motion.div
                      key={sermon.id}
                      className="col-12 col-md-6 col-lg-4"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.35, delay: index * 0.05 }}
                    >
                      <div className="card sermon-card h-100 shadow-sm">
                        <Link to={`/sermons/${sermon.id}`} className="text-decoration-none">
                          <div className="sermon-thumbnail-wrap">
                            <img
                              src={thumb}
                              alt={sermon.title}
                              loading="lazy"
                              onError={(e) => {
                                e.target.src = '/images/church_inside_2.jpg';
                              }}
                            />
                            <div className="play-button-overlay">
                              <div className="play-icon-circle">
                                <i className="bi bi-play-fill ms-1"></i>
                              </div>
                            </div>
                            {sermon.isFeatured && (
                              <span className="featured-ribbon">
                                <i className="bi bi-star-fill me-1"></i> Featured
                              </span>
                            )}
                          </div>
                        </Link>

                        <div className="card-body p-4 d-flex flex-column">
                          <div className="d-flex align-items-center justify-content-between mb-2">
                            <span className="sermon-category-pill">
                              {sermon.category || 'Sunday Service'}
                            </span>
                            <span className="text-muted small">
                              <i className="bi bi-calendar3 me-1"></i>
                              {formatDate(sermon.date)}
                            </span>
                          </div>

                          <h5
                            className="card-title fw-bold mb-2"
                            style={{ fontFamily: "'Playfair Display', serif", lineHeight: '1.35' }}
                          >
                            <Link to={`/sermons/${sermon.id}`} className="text-decoration-none text-dark hover-blue">
                              {sermon.title}
                            </Link>
                          </h5>

                          {sermon.speaker && (
                            <p className="text-muted small mb-2 d-flex align-items-center gap-1">
                              <i className="bi bi-mic text-primary"></i>
                              <span className="fw-medium">{sermon.speaker}</span>
                            </p>
                          )}

                          {sermon.description && (
                            <p
                              className="text-muted small mb-4 flex-grow-1"
                              style={{
                                display: '-webkit-box',
                                WebkitLineClamp: 3,
                                WebkitBoxOrient: 'vertical',
                                overflow: 'hidden'
                              }}
                            >
                              {sermon.description}
                            </p>
                          )}

                          <div className="mt-auto pt-3 border-top border-light-subtle d-flex align-items-center justify-content-between">
                            <Link
                              to={`/sermons/${sermon.id}`}
                              className="btn btn-outline-primary btn-sm rounded-pill px-3 d-inline-flex align-items-center gap-1"
                            >
                              <span>Watch Now</span>
                              <i className="bi bi-arrow-right"></i>
                            </Link>

                            <span className="text-muted small">
                              <i className={`bi ${sermon.type === 'AUDIO_URL' ? 'bi-soundwave' : 'bi-youtube text-danger'}`}></i>
                            </span>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>

              {/* Pagination Controls */}
              {pagination.totalPages > 1 && (
                <div className="d-flex justify-content-center align-items-center gap-2 mt-5">
                  <button
                    className="btn btn-outline-primary btn-sm px-3"
                    disabled={page <= 1}
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                  >
                    <i className="bi bi-chevron-left me-1"></i> Previous
                  </button>

                  <span className="small text-muted px-2">
                    Page {page} of {pagination.totalPages}
                  </span>

                  <button
                    className="btn btn-outline-primary btn-sm px-3"
                    disabled={page >= pagination.totalPages}
                    onClick={() => setPage((p) => Math.min(pagination.totalPages, p + 1))}
                  >
                    Next <i className="bi bi-chevron-right ms-1"></i>
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </section>
    </div>
  );
};

export default SermonsPage;
