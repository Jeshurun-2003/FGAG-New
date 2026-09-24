const express = require('express');
const router = express.Router();
const versesController = require('../controllers/verses.controller');
const { requireAuth } = require('../middleware/auth.middleware');

// Public
router.get('/monthly/current', versesController.getCurrentMonthlyVerse);

// Admin protected
router.get('/monthly', requireAuth, versesController.getAllMonthlyVerses);
router.post('/monthly', requireAuth, versesController.createMonthlyVerse);
router.put('/monthly/:id', requireAuth, versesController.updateMonthlyVerse);
router.delete('/monthly/:id', requireAuth, versesController.deleteMonthlyVerse);

module.exports = router;
