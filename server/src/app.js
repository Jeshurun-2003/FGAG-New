const express = require('express');
const cors = require('cors');
const path = require('path');
const morgan = require('morgan');
const { errorHandler } = require('./middleware/error.middleware');

// Routes
const authRoutes = require('./routes/auth.routes');
const settingsRoutes = require('./routes/settings.routes');
const eventsRoutes = require('./routes/events.routes');
const ministriesRoutes = require('./routes/ministries.routes');
const leadershipRoutes = require('./routes/leadership.routes');
const galleryRoutes = require('./routes/gallery.routes');
const prayerRoutes = require('./routes/prayer.routes');
const volunteerRoutes = require('./routes/volunteer.routes');
const analyticsRoutes = require('./routes/analytics.routes');
const sermonsRoutes = require('./routes/sermons.routes');
const versesRoutes = require('./routes/verses.routes');

const app = express();

// CORS Configuration
const clientUrls = process.env.CLIENT_URL
  ? process.env.CLIENT_URL.split(',').map((url) => url.trim().replace(/\/$/, ''))
  : ['http://localhost:3000', 'http://localhost:5173'];

const corsOptions = {
  origin: (origin, callback) => {
    // Allow non-browser requests (Postman, curl, server-to-server)
    if (!origin) return callback(null, true);

    const isAllowed =
      clientUrls.includes(origin) ||
      process.env.NODE_ENV !== 'production' ||
      origin.includes('localhost') ||
      origin.includes('127.0.0.1');

    if (isAllowed) {
      return callback(null, true);
    }
    return callback(new Error(`CORS policy error: Origin ${origin} is not allowed.`));
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
};

app.use(cors(corsOptions));

// 10 MB Payload Limit for Base64 image uploads
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// Serve legacy image assets if requested directly through backend
app.use('/images', express.static(path.join(__dirname, '../../images')));
app.use('/Gallery_images', express.static(path.join(__dirname, '../../Gallery_images')));

// Health Check Endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    service: 'FGAG Church REST API',
    environment: process.env.NODE_ENV || 'development'
  });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/settings', settingsRoutes);
app.use('/api/events', eventsRoutes);
app.use('/api/ministries', ministriesRoutes);
app.use('/api/leadership', leadershipRoutes);
app.use('/api/gallery', galleryRoutes);
app.use('/api/prayer', prayerRoutes);
app.use('/api/volunteer', volunteerRoutes);
app.use('/api/analytics', analyticsRoutes);
app.use('/api/sermons', sermonsRoutes);
app.use('/api/verses', versesRoutes);

// Centralized error handling
app.use(errorHandler);

module.exports = app;
