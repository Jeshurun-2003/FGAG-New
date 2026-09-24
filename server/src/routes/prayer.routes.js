const express = require('express');
const router = express.Router();
const prayerController = require('../controllers/prayer.controller');
const { requireAuth } = require('../middleware/auth.middleware');

// Public
router.post('/', prayerController.submitPrayerRequest);

// Admin protected
router.get('/', requireAuth, prayerController.getPrayerRequests);
router.put('/:id/status', requireAuth, prayerController.updatePrayerStatus);
router.delete('/:id', requireAuth, prayerController.deletePrayerRequest);

module.exports = router;
