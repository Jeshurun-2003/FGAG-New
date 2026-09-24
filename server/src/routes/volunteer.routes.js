const express = require('express');
const router = express.Router();
const volunteerController = require('../controllers/volunteer.controller');
const { requireAuth } = require('../middleware/auth.middleware');

// Public
router.post('/', volunteerController.submitVolunteer);

// Admin protected
router.get('/', requireAuth, volunteerController.getVolunteerSubmissions);
router.put('/:id/status', requireAuth, volunteerController.updateVolunteerStatus);
router.delete('/:id', requireAuth, volunteerController.deleteVolunteerSubmission);

module.exports = router;
