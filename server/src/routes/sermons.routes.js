const express = require('express');
const router = express.Router();
const sermonController = require('../controllers/sermon.controller');
const upload = require('../middleware/upload.middleware');
const { requireAuth } = require('../middleware/auth.middleware');

// Public endpoints
router.get('/', sermonController.getSermons);
router.get('/:id', sermonController.getSermonById);

// Admin protected endpoints
router.post('/', requireAuth, upload.single('thumbnail'), sermonController.createSermon);
router.put('/:id', requireAuth, upload.single('thumbnail'), sermonController.updateSermon);
router.delete('/:id', requireAuth, sermonController.deleteSermon);

module.exports = router;
