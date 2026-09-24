const express = require('express');
const router = express.Router();
const contactController = require('../controllers/contact.controller');
const { requireAuth } = require('../middleware/auth.middleware');

// Public
router.post('/', contactController.submitContactMessage);

// Admin Protected
router.get('/', requireAuth, contactController.getContactMessages);
router.put('/:id/status', requireAuth, contactController.updateContactStatus);
router.delete('/:id', requireAuth, contactController.deleteContactMessage);

module.exports = router;
