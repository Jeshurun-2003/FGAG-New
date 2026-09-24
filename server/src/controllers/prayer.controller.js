const prisma = require('../config/db');

// Public: Submit prayer request
const submitPrayerRequest = async (req, res, next) => {
  try {
    const { name, email, phone, message } = req.body;

    if (!name || !email || !message) {
      return res.status(400).json({
        success: false,
        message: 'Name, email, and prayer message are required.'
      });
    }

    const prayer = await prisma.prayerRequest.create({
      data: {
        name: name.trim(),
        email: email.trim(),
        phone: phone ? phone.trim() : null,
        message: message.trim()
      }
    });

    res.status(201).json({
      success: true,
      message: 'Your prayer request has been received. Our prayer team will lift you up in prayer.',
      prayer
    });
  } catch (err) {
    next(err);
  }
};

// Admin: Get prayer requests
const getPrayerRequests = async (req, res, next) => {
  try {
    const { status } = req.query;
    const where = status ? { status: status.toUpperCase() } : {};

    const requests = await prisma.prayerRequest.findMany({
      where,
      orderBy: { createdAt: 'desc' }
    });

    res.json({
      success: true,
      requests
    });
  } catch (err) {
    next(err);
  }
};

// Admin: Update status (PENDING, PRAYED, ARCHIVED)
const updatePrayerStatus = async (req, res, next) => {
  try {
    const id = parseInt(req.params.id, 10);
    const { status } = req.body;

    if (!['PENDING', 'PRAYED', 'ARCHIVED'].includes(status?.toUpperCase())) {
      return res.status(400).json({ success: false, message: 'Invalid status.' });
    }

    const updated = await prisma.prayerRequest.update({
      where: { id },
      data: { status: status.toUpperCase() }
    });

    res.json({
      success: true,
      message: `Prayer request marked as ${status}.`,
      prayer: updated
    });
  } catch (err) {
    next(err);
  }
};

// Admin: Delete prayer request
const deletePrayerRequest = async (req, res, next) => {
  try {
    const id = parseInt(req.params.id, 10);
    await prisma.prayerRequest.delete({ where: { id } });

    res.json({
      success: true,
      message: 'Prayer request deleted successfully.'
    });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  submitPrayerRequest,
  getPrayerRequests,
  updatePrayerStatus,
  deletePrayerRequest
};
