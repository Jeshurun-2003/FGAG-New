const express = require('express');
const router = express.Router();
const leadershipController = require('../controllers/leadership.controller');
const upload = require('../middleware/upload.middleware');
const { requireAuth } = require('../middleware/auth.middleware');

// Public
router.get('/', leadershipController.getLeadership);

// Admin protected
router.post('/', requireAuth, upload.single('image'), leadershipController.createLeadership);
router.put('/:id', requireAuth, upload.single('image'), leadershipController.updateLeadership);
router.delete('/:id', requireAuth, leadershipController.deleteLeadership);

module.exports = router;
