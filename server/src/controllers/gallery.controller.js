const prisma = require('../config/db');

// Get gallery images, optionally filtered by category
const getGallery = async (req, res, next) => {
  try {
    const { category } = req.query;
    let where = {};
    if (category && category.toLowerCase() !== 'all') {
      where.category = {
        equals: category.toLowerCase().trim(),
        mode: 'insensitive'
      };
    }

    const images = await prisma.galleryImage.findMany({
      where,
      orderBy: [{ order: 'asc' }, { createdAt: 'desc' }]
    });

    res.json({
      success: true,
      images
    });
  } catch (err) {
    next(err);
  }
};

// Get image count by categories
const getGalleryCategories = async (req, res, next) => {
  try {
    const categories = [
      'sunday service',
      'kids',
      'youth',
      'outreach',
      'christmas',
      'special events'
    ];

    const counts = {};
    for (const cat of categories) {
      const count = await prisma.galleryImage.count({
        where: { category: { equals: cat, mode: 'insensitive' } }
      });
      const cover = await prisma.galleryImage.findFirst({
        where: { category: { equals: cat, mode: 'insensitive' } },
        orderBy: { id: 'asc' }
      });
      counts[cat] = {
        count,
        coverUrl: cover ? cover.imageUrl : null
      };
    }

    res.json({
      success: true,
      categories: counts
    });
  } catch (err) {
    next(err);
  }
};

// Upload photo (stores base64 data URI in PostgreSQL or accepts URL)
const uploadPhoto = async (req, res, next) => {
  try {
    const { title, category, order } = req.body;

    if (!category) {
      return res.status(400).json({ success: false, message: 'Category is required.' });
    }

    let imageUrl = null;
    if (req.file && req.file.buffer) {
      imageUrl = `data:${req.file.mimetype};base64,${req.file.buffer.toString('base64')}`;
    } else if (req.body.imageUrl) {
      imageUrl = req.body.imageUrl;
    } else {
      return res.status(400).json({ success: false, message: 'An image file or imageUrl is required.' });
    }

    const photo = await prisma.galleryImage.create({
      data: {
        title: title ? title.trim() : null,
        category: category.toLowerCase().trim(),
        imageUrl,
        order: order !== undefined ? parseInt(order, 10) : 0
      }
    });

    res.status(201).json({
      success: true,
      message: 'Photo uploaded successfully.',
      photo
    });
  } catch (err) {
    next(err);
  }
};

// Update photo
const updatePhoto = async (req, res, next) => {
  try {
    const id = parseInt(req.params.id, 10);
    const { title, category, order, imageUrl } = req.body;

    const existing = await prisma.galleryImage.findUnique({ where: { id } });
    if (!existing) {
      return res.status(404).json({ success: false, message: 'Photo not found.' });
    }

    let finalImageUrl = existing.imageUrl;
    if (req.file && req.file.buffer) {
      finalImageUrl = `data:${req.file.mimetype};base64,${req.file.buffer.toString('base64')}`;
    } else if (imageUrl !== undefined) {
      finalImageUrl = imageUrl;
    }

    const updated = await prisma.galleryImage.update({
      where: { id },
      data: {
        title: title !== undefined ? title.trim() : existing.title,
        category: category !== undefined ? category.toLowerCase().trim() : existing.category,
        imageUrl: finalImageUrl,
        order: order !== undefined ? parseInt(order, 10) : existing.order
      }
    });

    res.json({
      success: true,
      message: 'Photo updated successfully.',
      photo: updated
    });
  } catch (err) {
    next(err);
  }
};

// Delete photo
const deletePhoto = async (req, res, next) => {
  try {
    const id = parseInt(req.params.id, 10);
    await prisma.galleryImage.delete({ where: { id } });

    res.json({
      success: true,
      message: 'Photo deleted successfully.'
    });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getGallery,
  getGalleryCategories,
  uploadPhoto,
  updatePhoto,
  deletePhoto
};
