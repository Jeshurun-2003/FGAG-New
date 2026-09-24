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

// Get all leadership members
const getLeadership = async (req, res, next) => {
  try {
    const leaders = await prisma.leadership.findMany({
      orderBy: [{ order: 'asc' }, { id: 'asc' }]
    });

    res.json({
      success: true,
      leaders
    });
  } catch (err) {
    next(err);
  }
};

// Create leadership member
const createLeadership = async (req, res, next) => {
  try {
    const { name, role, bio, order } = req.body;

    if (!name || !role) {
      return res.status(400).json({ success: false, message: 'Name and role are required.' });
    }

    const imageUrl = extractImageUrl(req, null);

    const leader = await prisma.leadership.create({
      data: {
        name: name.trim(),
        role: role.trim(),
        bio: bio ? bio.trim() : null,
        imageUrl,
        order: order !== undefined ? parseInt(order, 10) : 0
      }
    });

    res.status(201).json({
      success: true,
      message: 'Leader added successfully.',
      leader
    });
  } catch (err) {
    next(err);
  }
};

// Update leadership member
const updateLeadership = async (req, res, next) => {
  try {
    const id = parseInt(req.params.id, 10);
    const { name, role, bio, order } = req.body;

    const existing = await prisma.leadership.findUnique({ where: { id } });
    if (!existing) {
      return res.status(404).json({ success: false, message: 'Leader not found.' });
    }

    const imageUrl = extractImageUrl(req, existing.imageUrl);

    const updated = await prisma.leadership.update({
      where: { id },
      data: {
        name: name !== undefined ? name.trim() : existing.name,
        role: role !== undefined ? role.trim() : existing.role,
        bio: bio !== undefined ? bio.trim() : existing.bio,
        imageUrl,
        order: order !== undefined ? parseInt(order, 10) : existing.order
      }
    });

    res.json({
      success: true,
      message: 'Leader updated successfully.',
      leader: updated
    });
  } catch (err) {
    next(err);
  }
};

// Delete leadership member
const deleteLeadership = async (req, res, next) => {
  try {
    const id = parseInt(req.params.id, 10);
    await prisma.leadership.delete({ where: { id } });

    res.json({
      success: true,
      message: 'Leader removed successfully.'
    });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getLeadership,
  createLeadership,
  updateLeadership,
  deleteLeadership
};
