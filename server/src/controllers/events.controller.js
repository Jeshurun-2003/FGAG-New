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

// Get all events
const getEvents = async (req, res, next) => {
  try {
    const events = await prisma.event.findMany({
      orderBy: [{ isFeatured: 'desc' }, { createdAt: 'desc' }]
    });

    res.json({
      success: true,
      events
    });
  } catch (err) {
    next(err);
  }
};

// Get featured event
const getFeaturedEvent = async (req, res, next) => {
  try {
    let event = await prisma.event.findFirst({
      where: { isFeatured: true },
      orderBy: { createdAt: 'desc' }
    });

    if (!event) {
      event = await prisma.event.findFirst({
        orderBy: { createdAt: 'desc' }
      });
    }

    res.json({
      success: true,
      event: event || null
    });
  } catch (err) {
    next(err);
  }
};

// Get single event
const getEventById = async (req, res, next) => {
  try {
    const id = parseInt(req.params.id, 10);
    const event = await prisma.event.findUnique({ where: { id } });

    if (!event) {
      return res.status(404).json({ success: false, message: 'Event not found.' });
    }

    res.json({
      success: true,
      event
    });
  } catch (err) {
    next(err);
  }
};

// Create event
const createEvent = async (req, res, next) => {
  try {
    const { title, summary, time, location, details, isFeatured, date } = req.body;

    if (!title) {
      return res.status(400).json({ success: false, message: 'Title is required.' });
    }

    const imageUrl = extractImageUrl(req, null);
    const featuredBool = isFeatured === 'true' || isFeatured === true;

    // If this event is featured, unfeature others
    if (featuredBool) {
      await prisma.event.updateMany({
        where: { isFeatured: true },
        data: { isFeatured: false }
      });
    }

    const newEvent = await prisma.event.create({
      data: {
        title: title.trim(),
        summary: summary ? summary.trim() : null,
        time: time ? time.trim() : null,
        location: location ? location.trim() : null,
        details: details ? details.trim() : null,
        imageUrl,
        isFeatured: featuredBool,
        date: date ? new Date(date) : null
      }
    });

    res.status(201).json({
      success: true,
      message: 'Event created successfully.',
      event: newEvent
    });
  } catch (err) {
    next(err);
  }
};

// Update event
const updateEvent = async (req, res, next) => {
  try {
    const id = parseInt(req.params.id, 10);
    const { title, summary, time, location, details, isFeatured, date } = req.body;

    const existing = await prisma.event.findUnique({ where: { id } });
    if (!existing) {
      return res.status(404).json({ success: false, message: 'Event not found.' });
    }

    const imageUrl = extractImageUrl(req, existing.imageUrl);
    const featuredBool = isFeatured === 'true' || isFeatured === true;

    if (featuredBool && !existing.isFeatured) {
      await prisma.event.updateMany({
        where: { isFeatured: true },
        data: { isFeatured: false }
      });
    }

    const updated = await prisma.event.update({
      where: { id },
      data: {
        title: title !== undefined ? title.trim() : existing.title,
        summary: summary !== undefined ? summary.trim() : existing.summary,
        time: time !== undefined ? time.trim() : existing.time,
        location: location !== undefined ? location.trim() : existing.location,
        details: details !== undefined ? details.trim() : existing.details,
        imageUrl,
        isFeatured: isFeatured !== undefined ? featuredBool : existing.isFeatured,
        date: date !== undefined ? (date ? new Date(date) : null) : existing.date
      }
    });

    res.json({
      success: true,
      message: 'Event updated successfully.',
      event: updated
    });
  } catch (err) {
    next(err);
  }
};

// Delete event
const deleteEvent = async (req, res, next) => {
  try {
    const id = parseInt(req.params.id, 10);
    await prisma.event.delete({ where: { id } });

    res.json({
      success: true,
      message: 'Event deleted successfully.'
    });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getEvents,
  getFeaturedEvent,
  getEventById,
  createEvent,
  updateEvent,
  deleteEvent
};
