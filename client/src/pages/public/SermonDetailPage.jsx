import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import SEO from '../../components/common/SEO';
import { PageSkeleton } from '../../components/common/SkeletonLoader';
import { useToast } from '../../context/ToastContext';
import { sermonService } from '../../services/api';

const SermonDetailPage = () => {
  const { id } = useParams();
  const { addToast } = useToast();
  const [sermon, setSermon] = useState(null);
  const [related, setRelated] = useState([]);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const fetchSermon = async () => {
      try {
        setLoading(true);
        const res = await sermonService.getById(id);
        if (res.data && res.data.success) {
          setSermon(res.data.sermon);
          setRelated(res.data.related || []);
        }
      } catch (err) {
        console.error('Failed to load sermon detail:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchSermon();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [id]);

  const getYouTubeEmbedUrl = (url) => {
    if (!url) return '';
    const regExp = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?|shorts|live)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/;
    const match = url.match(regExp);
    if (match && match[1]) {
      return `https://www.youtube-nocookie.com/embed/${match[1]}?rel=0&autoplay=0`;
    }
    return url;
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    addToast('Link copied to clipboard!', 'success');
    setTimeout(() => setCopied(false), 3000);
  };

  const currentUrl = typeof window !== 'undefined' ? window.location.href : '';
  const shareText = sermon ? `Listen to "${sermon.title}" at Friends Garden AG Church:` : '';

  if (loading) {
    return <PageSkeleton />;
  }

  if (!sermon) {
    return (
      <div className="container py-5 text-center my-5">
        <h2 className="heading mb-3">Sermon Not Found</h2>
        <p className="text-muted mb-4">The sermon you are looking for does not exist or has been removed.</p>
        <Link to="/sermons" className="btn btn-primary">
          <i className="bi bi-arrow-left me-2"></i>Back to All Sermons
        </Link>
      </div>
    );
  }

  const isYouTube = sermon.type === 'YOUTUBE' || sermon.mediaUrl.includes('youtube.com') || sermon.mediaUrl.includes('youtu.be');
  const embedUrl = isYouTube ? getYouTubeEmbedUrl(sermon.mediaUrl) : null;

  const formattedDate = new Date(sermon.date).toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric'
  });

  return (
    <div>
      <SEO
        title={sermon.title}
        description={sermon.description || 'Watch message from Friends Garden AG Church.'}
      />

      {/* Breadcrumb / Top bar */}
      <section className="bg-light py-3 border-bottom">
        <div className="container d-flex align-items-center justify-content-between">
          <Link to="/sermons" className="text-decoration-none text-muted d-inline-flex align-items-center gap-1 small hover-blue">
            <i className="bi bi-arrow-left"></i>
            <span>Back to All Sermons</span>
          </Link>
          <span className="sermon-category-pill">{sermon.category}</span>
        </div>
      </section>

      {/* Main Content & Video Player */}
      <section className="section-padding bg-white">
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-12 col-lg-10">
              {/* Responsive Video/Audio Container */}
              <div className="mb-4">
                {isYouTube && embedUrl ? (
                  <div className="video-responsive-16-9">
                    <iframe
                      src={embedUrl}
                      title={sermon.title}
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    />
                  </div>
                ) : sermon.type === 'AUDIO_URL' ? (
                  <div className="p-4 bg-light rounded-4 border text-center my-3">
                    <i className="bi bi-soundwave fs-1 text-primary mb-2 d-block"></i>
                    <audio controls className="w-100" style={{ maxWidth: '600px' }}>
                      <source src={sermon.mediaUrl} />
                      Your browser does not support the audio element.
                    </audio>
                  </div>
                ) : (
                  <div className="video-responsive-16-9">
                    <video controls poster={sermon.thumbnailUrl}>
                      <source src={sermon.mediaUrl} />
                      Your browser does not support the video tag.
                    </video>
                  </div>
                )}
              </div>

              {/* Title & Metadata */}
              <div className="border-bottom pb-4 mb-4">
                <div className="d-flex flex-wrap align-items-center justify-content-between gap-3 mb-2">
                  <span className="badge px-3 py-2 rounded-pill bg-light text-primary border">
                    <i className="bi bi-calendar3 me-1"></i> {formattedDate}
                  </span>
                  {sermon.speaker && (
                    <span className="text-muted fw-medium d-inline-flex align-items-center gap-1">
                      <i className="bi bi-person-fill text-primary"></i> Speaker: {sermon.speaker}
                    </span>
                  )}
                </div>

                <h1
                  className="fw-bold mb-3"
                  style={{ fontFamily: "'Playfair Display', serif", fontSize: 'clamp(1.75rem, 3.5vw, 2.4rem)' }}
                >
                  {sermon.title}
                </h1>

                {/* Share bar */}
                <div className="d-flex flex-wrap align-items-center gap-2 pt-2">
                  <span className="small text-muted me-2 fw-medium">Share this message:</span>
                  <a
                    href={`https://api.whatsapp.com/send?text=${encodeURIComponent(`${shareText} ${currentUrl}`)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn-sm btn-outline-success rounded-pill px-3"
                  >
                    <i className="bi bi-whatsapp me-1"></i> WhatsApp
                  </a>
                  <a
                    href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(currentUrl)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn-sm btn-outline-primary rounded-pill px-3"
                  >
                    <i className="bi bi-facebook me-1"></i> Facebook
                  </a>
                  <a
                    href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(currentUrl)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn-sm btn-outline-secondary rounded-pill px-3"
                  >
                    <i className="bi bi-twitter-x me-1"></i> Twitter
                  </a>
                  <button
                    onClick={handleCopyLink}
                    type="button"
                    className="btn btn-sm btn-outline-dark rounded-pill px-3 d-inline-flex align-items-center gap-1"
                  >
                    <i className={`bi ${copied ? 'bi-check2' : 'bi-link-45deg'}`}></i>
                    <span>{copied ? 'Link Copied!' : 'Copy Link'}</span>
                  </button>
                </div>
              </div>

              {/* Description & Notes */}
              {sermon.description && (
                <div className="mb-5">
                  <h4 className="fw-bold heading mb-3">About This Message</h4>
                  <div
                    className="paragraph text-dark"
                    style={{ whiteSpace: 'pre-line', lineHeight: '1.9' }}
                  >
                    {sermon.description}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Related Sermons */}
      {related.length > 0 && (
        <section className="section-padding section-ice border-top">
          <div className="container">
            <div className="text-center mb-5">
              <span className="section-eyebrow">More Teachings</span>
              <h2 className="heading mb-2">Related Sermons</h2>
              <div className="section-divider">
                <i className="bi bi-cross section-divider-icon"></i>
              </div>
            </div>

            <div className="row g-4 justify-content-center">
              {related.map((item) => (
                <div key={item.id} className="col-12 col-md-6 col-lg-4">
                  <div className="card sermon-card h-100 shadow-sm">
                    <Link to={`/sermons/${item.id}`} className="text-decoration-none">
                      <div className="sermon-thumbnail-wrap">
                        <img
                          src={item.thumbnailUrl || '/images/church_inside_2.jpg'}
                          alt={item.title}
                          loading="lazy"
                        />
                        <div className="play-button-overlay">
                          <div className="play-icon-circle">
                            <i className="bi bi-play-fill ms-1"></i>
                          </div>
                        </div>
                      </div>
                    </Link>
                    <div className="card-body p-4 d-flex flex-column">
                      <span className="sermon-category-pill align-self-start mb-2">{item.category}</span>
                      <h6 className="card-title fw-bold mb-2" style={{ fontFamily: "'Playfair Display', serif" }}>
                        <Link to={`/sermons/${item.id}`} className="text-decoration-none text-dark hover-blue">
                          {item.title}
                        </Link>
                      </h6>
                      {item.speaker && (
                        <p className="text-muted small mb-3">
                          <i className="bi bi-mic me-1 text-primary"></i>{item.speaker}
                        </p>
                      )}
                      <div className="mt-auto pt-2">
                        <Link to={`/sermons/${item.id}`} className="btn btn-sm btn-outline-primary rounded-pill">
                          Watch Message
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  );
};

export default SermonDetailPage;
