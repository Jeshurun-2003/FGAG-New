const express = require('express');
const router = express.Router();
const ministriesController = require('../controllers/ministries.controller');
const upload = require('../middleware/upload.middleware');
const { requireAuth } = require('../middleware/auth.middleware');

// Public
router.get('/', ministriesController.getMinistries);

// Admin protected
router.get('/all', requireAuth, ministriesController.getAllMinistriesAdmin);
router.post('/', requireAuth, upload.single('image'), ministriesController.createMinistry);
router.put('/:id', requireAuth, upload.single('image'), ministriesController.updateMinistry);
router.delete('/:id', requireAuth, ministriesController.deleteMinistry);

module.exports = router;
