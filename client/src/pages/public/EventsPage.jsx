import React, { useState, useEffect } from 'react';
import { eventsService } from '../../services/api';
import LoadingSpinner from '../../components/common/LoadingSpinner';

const EventsPage = () => {
  const [featuredEvent, setFeaturedEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showDetail, setShowDetail] = useState(false);

  useEffect(() => {
    const fetchFeatured = async () => {
      try {
        const res = await eventsService.getFeatured();
        if (res.data.success && res.data.event) {
          setFeaturedEvent(res.data.event);
        }
      } catch (err) {
        console.warn('Could not load featured event', err);
      } finally {
        setLoading(false);
      }
    };

    fetchFeatured();
  }, []);

  const weeklySchedule = [
    {
      day: 'Sunday',
      title: 'Sunday Worship Service',
      time: '9:00 AM – 11:30 AM',
      location: 'Main Sanctuary',
      image: '/images/Sunday_service.png',
      desc: 'Join us for uplifting worship, powerful prayer, and life-changing biblical preaching for the entire family.'
    },
    {
      day: 'Tuesday',
      title: 'Fasting & Healing Prayer',
      time: '10:00 AM – 1:00 PM',
      location: 'Prayer Hall',
      image: '/images/healing_service.png',
      desc: 'A dedicated time of seeking God’s presence, intercession, and praying for healing and breakthroughs.'
    },
    {
      day: 'Wednesday',
      title: 'Night Prayer Gathering',
      time: '8:00 PM – 9:30 PM',
      location: 'Church Sanctuary / Online',
      image: '/images/night_prayer.png',
      desc: 'Uniting in prayer in the stillness of the evening to lift up families, church ministries, and our community.'
    },
    {
      day: 'Thursday',
      title: 'Cottage / House Prayer',
      time: '6:30 PM – 8:00 PM',
      location: 'Believers’ Homes (Rotating)',
      image: '/images/men_fellowship.jpeg',
      desc: 'Intimate fellowship, sharing testimonies, and praying together in local neighbourhood homes.'
    },
    {
      day: 'Friday',
      title: 'Morning Prayer & Devotion',
      time: '6:00 AM – 7:00 AM',
      location: 'Online via Google Meet',
      image: '/images/Morning_prayer.jpg',
      desc: 'Starting the day in communion with God with guided scripture reading and morning intercession.'
    },
    {
      day: 'Saturday',
      title: 'Youth & Worship Service',
      time: '5:30 PM – 7:30 PM',
      location: 'Youth Hall',
      image: '/images/youth_service.jpg',
      desc: 'Vibrant praise, music rehearsals, group discussions, and games for teenagers and young adults.'
    }
  ];

  return (
    <div className="container my-5 pt-3">
      <div className="text-center mb-5">
        <h1 className="heading display-5 fw-bold">Church Events & Gatherings</h1>
        <p className="paragraph lead text-muted">
          Stay updated with our upcoming services, special events, and spiritual gatherings.
        </p>
      </div>

      {/* Featured / Dynamic Event */}
      {loading ? (
        <LoadingSpinner message="Checking for upcoming events..." />
      ) : (
        featuredEvent && (
          <div className="card event-card mb-5 p-4 border-0 shadow-sm rounded-4 bg-white">
            <div className="d-flex flex-wrap justify-content-between align-items-start gap-2">
              <div>
                <span className="badge bg-primary mb-2 text-uppercase">Featured Event</span>
                <h3 className="heading fw-bold mb-2">{featuredEvent.title}</h3>
                {featuredEvent.summary && <p className="paragraph mb-2 fs-5">{featuredEvent.summary}</p>}
                <p className="paragraph text-secondary mb-3">
                  {featuredEvent.time && (
                    <span className="me-3">
                      <strong>🕒 Time:</strong> {featuredEvent.time}
                    </span>
                  )}
                  {featuredEvent.location && (
                    <span>
                      <strong>📍 Location:</strong> {featuredEvent.location}
                    </span>
                  )}
                </p>
              </div>
              <button
                className="btn btn-outline-primary"
                onClick={() => setShowDetail(!showDetail)}
              >
                {showDetail ? 'Hide Details' : 'Learn More'}
              </button>
            </div>

            {/* Collapsible Details */}
            {showDetail && (
              <div className="card shadow-sm border-0 rounded-4 bg-light mt-3 p-4">
                <div className="row align-items-center g-4">
                  {featuredEvent.imageUrl && (
                    <div className="col-lg-5 text-center">
                      <img
                        src={featuredEvent.imageUrl}
                        alt={featuredEvent.title}
                        className="img-fluid rounded-4 shadow-sm"
                        style={{ maxHeight: '400px', width: '100%', objectFit: 'cover' }}
                      />
                    </div>
                  )}
                  <div className={featuredEvent.imageUrl ? 'col-lg-7' : 'col-12'}>
                    <h4 className="fw-bold heading mb-3">{featuredEvent.title}</h4>
                    {featuredEvent.time && (
                      <p className="paragraph mb-1">
                        <strong>🕒 Time:</strong> {featuredEvent.time}
                      </p>
                    )}
                    {featuredEvent.location && (
                      <p className="paragraph mb-1">
                        <strong>📍 Location:</strong> {featuredEvent.location}
                      </p>
                    )}
                    {featuredEvent.details && (
                      <div className="paragraph text-muted mt-3" style={{ whiteSpace: 'pre-line' }}>
                        {featuredEvent.details}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        )
      )}

      {/* Weekly Church Schedule */}
      <div className="mb-5">
        <h2 className="heading mt-5 mb-4 fw-bold display-6 text-center">
          ⛪ Weekly Church Schedule
        </h2>
        <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4">
          {weeklySchedule.map((item, idx) => (
            <div className="col" key={idx}>
              <div className="card h-100 rounded-4 shadow-sm border-0 bg-white hover-lift overflow-hidden">
                <img
                  src={item.image}
                  className="card-img-top"
                  style={{ height: '220px', objectFit: 'cover' }}
                  alt={item.title}
                />
                <div className="card-body p-4 d-flex flex-column">
                  <div className="mb-2">
                    <span className="badge bg-secondary-subtle text-primary fw-bold text-uppercase">
                      {item.day}
                    </span>
                  </div>
                  <h4 className="heading fw-bold mb-2">{item.title}</h4>
                  <p className="text-secondary small mb-2">
                    <i className="bi bi-clock me-1"></i> {item.time}
                  </p>
                  <p className="text-secondary small mb-3">
                    <i className="bi bi-geo-alt me-1"></i> {item.location}
                  </p>
                  <p className="paragraph small text-muted mt-auto mb-0">{item.desc}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default EventsPage;
