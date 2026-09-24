const express = require('express');
const router = express.Router();
const eventsController = require('../controllers/events.controller');
const upload = require('../middleware/upload.middleware');
const { requireAuth } = require('../middleware/auth.middleware');

// Public
router.get('/', eventsController.getEvents);
router.get('/featured', eventsController.getFeaturedEvent);
router.get('/:id', eventsController.getEventById);

// Admin protected
router.post('/', requireAuth, upload.single('image'), eventsController.createEvent);
router.put('/:id', requireAuth, upload.single('image'), eventsController.updateEvent);
router.delete('/:id', requireAuth, eventsController.deleteEvent);

module.exports = router;
