const prisma = require('../config/db');

// Helper to extract image URL from file buffer or URL string
const extractImageUrl = (req, fallback = null) => {
  if (req.file && req.file.buffer) {
    return `data:${req.file.mimetype};base64,${req.file.buffer.toString('base64')}`;
  }
  if (req.body.imageUrl !== undefined && req.body.imageUrl !== null && req.body.imageUrl !== '') {
    return req.body.imageUrl;
  }
  return fallback;
};

// Get active ministries (public)
const getMinistries = async (req, res, next) => {
  try {
    const ministries = await prisma.ministry.findMany({
      where: { isActive: true },
      orderBy: [{ order: 'asc' }, { id: 'asc' }]
    });

    res.json({
      success: true,
      ministries
    });
  } catch (err) {
    next(err);
  }
};

// Get all ministries for admin
const getAllMinistriesAdmin = async (req, res, next) => {
  try {
    const ministries = await prisma.ministry.findMany({
      orderBy: [{ order: 'asc' }, { id: 'asc' }]
    });

    res.json({
      success: true,
      ministries
    });
  } catch (err) {
    next(err);
  }
};

// Create ministry
const createMinistry = async (req, res, next) => {
  try {
    const { title, description, details, order, isActive } = req.body;

    if (!title) {
      return res.status(400).json({ success: false, message: 'Ministry title is required.' });
    }

    const imageUrl = extractImageUrl(req, null);

    const ministry = await prisma.ministry.create({
      data: {
        title: title.trim(),
        description: description ? description.trim() : null,
        details: details ? details.trim() : null,
        imageUrl,
        order: order !== undefined ? parseInt(order, 10) : 0,
        isActive: isActive !== undefined ? (isActive === 'true' || isActive === true) : true
      }
    });

    res.status(201).json({
      success: true,
      message: 'Ministry created successfully.',
      ministry
    });
  } catch (err) {
    next(err);
  }
};

// Update ministry
const updateMinistry = async (req, res, next) => {
  try {
    const id = parseInt(req.params.id, 10);
    const { title, description, details, order, isActive } = req.body;

    const existing = await prisma.ministry.findUnique({ where: { id } });
    if (!existing) {
      return res.status(404).json({ success: false, message: 'Ministry not found.' });
    }

    const imageUrl = extractImageUrl(req, existing.imageUrl);

    const updated = await prisma.ministry.update({
      where: { id },
      data: {
        title: title !== undefined ? title.trim() : existing.title,
        description: description !== undefined ? description.trim() : existing.description,
        details: details !== undefined ? details.trim() : existing.details,
        imageUrl,
        order: order !== undefined ? parseInt(order, 10) : existing.order,
        isActive: isActive !== undefined ? (isActive === 'true' || isActive === true) : existing.isActive
      }
    });

    res.json({
      success: true,
      message: 'Ministry updated successfully.',
      ministry: updated
    });
  } catch (err) {
    next(err);
  }
};

// Delete ministry
const deleteMinistry = async (req, res, next) => {
  try {
    const id = parseInt(req.params.id, 10);
    await prisma.ministry.delete({ where: { id } });

    res.json({
      success: true,
      message: 'Ministry deleted successfully.'
    });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getMinistries,
  getAllMinistriesAdmin,
  createMinistry,
  updateMinistry,
  deleteMinistry
};
