const express = require('express');
const router = express.Router();
const donationsController = require('../controllers/donations.controller');
const { requireAuth } = require('../middleware/auth.middleware');

// Public
router.get('/purposes', donationsController.getPurposes);

// Admin Protected - Purposes
router.post('/purposes', requireAuth, donationsController.createPurpose);
router.put('/purposes/:id', requireAuth, donationsController.updatePurpose);
router.delete('/purposes/:id', requireAuth, donationsController.deletePurpose);

// Admin Protected - Donation Ledger Records
router.get('/records', requireAuth, donationsController.getRecords);
router.post('/records', requireAuth, donationsController.createRecord);
router.put('/records/:id', requireAuth, donationsController.updateRecord);
router.delete('/records/:id', requireAuth, donationsController.deleteRecord);

module.exports = router;
