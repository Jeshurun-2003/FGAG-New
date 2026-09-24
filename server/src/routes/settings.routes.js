const express = require('express');
const router = express.Router();
const settingsController = require('../controllers/settings.controller');
const { requireAuth } = require('../middleware/auth.middleware');

// Public
router.get('/public', settingsController.getPublicSettings);

// Admin protected
router.get('/admin', requireAuth, settingsController.getAdminSettings);
router.post('/', requireAuth, settingsController.updateSettings);

module.exports = router;
