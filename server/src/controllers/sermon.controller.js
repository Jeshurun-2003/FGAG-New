const prisma = require('../config/db');

/**
 * Extract YouTube 11-character video ID from various YouTube URL formats:
 * - standard: https://www.youtube.com/watch?v=VIDEO_ID
 * - short: https://youtu.be/VIDEO_ID
 * - shorts: https://www.youtube.com/shorts/VIDEO_ID
 * - live: https://www.youtube.com/live/VIDEO_ID
 * - embed: https://www.youtube.com/embed/VIDEO_ID
 */
const extractYouTubeId = (url) => {
  if (!url || typeof url !== 'string') return null;
  const regExp = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?|shorts|live)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/;
  const match = url.match(regExp);
  return match && match[1] ? match[1] : null;
};

// Helper to extract image URL from file buffer or URL string
const extractThumbnailUrl = (req, mediaUrl, fallback = null) => {
  if (req.file && req.file.buffer) {
    return `data:${req.file.mimetype};base64,${req.file.buffer.toString('base64')}`;
  }
  if (req.body.thumbnailUrl !== undefined && req.body.thumbnailUrl !== null && req.body.thumbnailUrl !== '') {
    return req.body.thumbnailUrl;
  }
  const ytId = extractYouTubeId(mediaUrl);
  if (ytId) {
    return `https://img.youtube.com/vi/${ytId}/hqdefault.jpg`;
  }
  return fallback;
};

// GET /api/sermons
// Query parameters: category, search, page (default 1), limit (default 9), all (boolean)
const getSermons = async (req, res, next) => {
  try {
    const { category, search, all } = req.query;
    const page = Math.max(1, parseInt(req.query.page, 10) || 1);
    const limit = Math.max(1, Math.min(50, parseInt(req.query.limit, 10) || 9));
    const skip = (page - 1) * limit;

    const where = {};

    // Filter published status unless all=true (for admin management)
    if (all !== 'true') {
      where.isPublished = true;
    }

    // Category filter
    if (category && category !== 'All') {
      where.category = {
        equals: category,
        mode: 'insensitive'
      };
    }

    // Search filter across title, speaker, description
    if (search && search.trim() !== '') {
      where.OR = [
        { title: { contains: search.trim(), mode: 'insensitive' } },
        { speaker: { contains: search.trim(), mode: 'insensitive' } },
        { description: { contains: search.trim(), mode: 'insensitive' } }
      ];
    }

    const [total, sermons] = await Promise.all([
      prisma.sermon.count({ where }),
      prisma.sermon.findMany({
        where,
        skip,
        take: limit,
        orderBy: [{ isFeatured: 'desc' }, { date: 'desc' }, { createdAt: 'desc' }]
      })
    ]);

    const totalPages = Math.ceil(total / limit) || 1;

    res.json({
      success: true,
      sermons,
      pagination: {
        total,
        page,
        limit,
        totalPages
      }
    });
  } catch (err) {
    next(err);
  }
};

// GET /api/sermons/:id
const getSermonById = async (req, res, next) => {
  try {
    const id = parseInt(req.params.id, 10);
    if (isNaN(id)) {
      return res.status(400).json({ success: false, message: 'Invalid sermon ID.' });
    }

    const sermon = await prisma.sermon.findUnique({ where: { id } });

    if (!sermon) {
      return res.status(404).json({ success: false, message: 'Sermon not found.' });
    }

    // Fetch up to 3 related sermons in the same category or latest
    const related = await prisma.sermon.findMany({
      where: {
        id: { not: id },
        isPublished: true,
        ...(sermon.category ? { category: sermon.category } : {})
      },
      take: 3,
      orderBy: { date: 'desc' }
    });

    res.json({
      success: true,
      sermon,
      related
    });
  } catch (err) {
    next(err);
  }
};

// POST /api/sermons (Admin protected)
const createSermon = async (req, res, next) => {
  try {
    const {
      title,
      description,
      speaker,
      date,
      category = 'Sunday Service',
      type = 'YOUTUBE',
      mediaUrl,
      isFeatured,
      isPublished
    } = req.body;

    if (!title || !title.trim()) {
      return res.status(400).json({ success: false, message: 'Title is required.' });
    }

    if (!mediaUrl || !mediaUrl.trim()) {
      return res.status(400).json({ success: false, message: 'Media URL is required.' });
    }

    // Auto-detect type if YouTube URL
    let sermonType = type;
    const ytId = extractYouTubeId(mediaUrl.trim());
    if (ytId && sermonType !== 'YOUTUBE') {
      sermonType = 'YOUTUBE';
    }

    const thumbnailUrl = extractThumbnailUrl(req, mediaUrl.trim());

    const sermon = await prisma.sermon.create({
      data: {
        title: title.trim(),
        description: description ? description.trim() : null,
        speaker: speaker ? speaker.trim() : null,
        date: date ? new Date(date) : new Date(),
        category: category.trim(),
        type: sermonType,
        mediaUrl: mediaUrl.trim(),
        thumbnailUrl: thumbnailUrl || null,
        isFeatured: isFeatured === true || isFeatured === 'true',
        isPublished: isPublished === undefined || isPublished === true || isPublished === 'true'
      }
    });

    res.status(201).json({
      success: true,
      message: 'Sermon created successfully.',
      sermon
    });
  } catch (err) {
    next(err);
  }
};

// PUT /api/sermons/:id (Admin protected)
const updateSermon = async (req, res, next) => {
  try {
    const id = parseInt(req.params.id, 10);
    if (isNaN(id)) {
      return res.status(400).json({ success: false, message: 'Invalid sermon ID.' });
    }

    const existing = await prisma.sermon.findUnique({ where: { id } });
    if (!existing) {
      return res.status(404).json({ success: false, message: 'Sermon not found.' });
    }

    const {
      title,
      description,
      speaker,
      date,
      category,
      type,
      mediaUrl,
      isFeatured,
      isPublished
    } = req.body;

    const targetMediaUrl = mediaUrl !== undefined ? mediaUrl.trim() : existing.mediaUrl;
    const thumbnailUrl = extractThumbnailUrl(req, targetMediaUrl, existing.thumbnailUrl);

    let sermonType = type !== undefined ? type : existing.type;
    const ytId = extractYouTubeId(targetMediaUrl);
    if (ytId && sermonType !== 'YOUTUBE') {
      sermonType = 'YOUTUBE';
    }

    const updated = await prisma.sermon.update({
      where: { id },
      data: {
        title: title !== undefined ? title.trim() : existing.title,
        description: description !== undefined ? (description ? description.trim() : null) : existing.description,
        speaker: speaker !== undefined ? (speaker ? speaker.trim() : null) : existing.speaker,
        date: date !== undefined ? new Date(date) : existing.date,
        category: category !== undefined ? category.trim() : existing.category,
        type: sermonType,
        mediaUrl: targetMediaUrl,
        thumbnailUrl: thumbnailUrl || null,
        isFeatured: isFeatured !== undefined ? (isFeatured === true || isFeatured === 'true') : existing.isFeatured,
        isPublished: isPublished !== undefined ? (isPublished === true || isPublished === 'true') : existing.isPublished
      }
    });

    res.json({
      success: true,
      message: 'Sermon updated successfully.',
      sermon: updated
    });
  } catch (err) {
    next(err);
  }
};

// DELETE /api/sermons/:id (Admin protected)
const deleteSermon = async (req, res, next) => {
  try {
    const id = parseInt(req.params.id, 10);
    if (isNaN(id)) {
      return res.status(400).json({ success: false, message: 'Invalid sermon ID.' });
    }

    const existing = await prisma.sermon.findUnique({ where: { id } });
    if (!existing) {
      return res.status(404).json({ success: false, message: 'Sermon not found.' });
    }

    await prisma.sermon.delete({ where: { id } });

    res.json({
      success: true,
      message: 'Sermon deleted successfully.'
    });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  extractYouTubeId,
  getSermons,
  getSermonById,
  createSermon,
  updateSermon,
  deleteSermon
};
