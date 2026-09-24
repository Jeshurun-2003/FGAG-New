const express = require('express');
const router = express.Router();
const galleryController = require('../controllers/gallery.controller');
const upload = require('../middleware/upload.middleware');
const { requireAuth } = require('../middleware/auth.middleware');

// Public
router.get('/', galleryController.getGallery);
router.get('/categories', galleryController.getGalleryCategories);

// Admin protected
router.post('/', requireAuth, upload.single('image'), galleryController.uploadPhoto);
router.put('/:id', requireAuth, galleryController.updatePhoto);
router.delete('/:id', requireAuth, galleryController.deletePhoto);

module.exports = router;
