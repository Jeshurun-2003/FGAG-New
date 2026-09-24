const prisma = require('../config/db');

// Public: Submit general contact message
const submitContactMessage = async (req, res, next) => {
  try {
    const { name, email, phone, subject, message } = req.body;

    if (!name || !name.trim() || !email || !email.trim() || !message || !message.trim()) {
      return res.status(400).json({
        success: false,
        message: 'Name, email, and message are required fields.'
      });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a valid email address.'
      });
    }

    const contactMessage = await prisma.contactMessage.create({
      data: {
        name: name.trim(),
        email: email.trim().toLowerCase(),
        phone: phone ? phone.trim() : null,
        subject: subject ? subject.trim() : 'General Inquiry',
        message: message.trim(),
        status: 'PENDING'
      }
    });

    res.status(201).json({
      success: true,
      message: 'Thank you for contacting Friends Garden AG Church. We have received your message.',
      contact: contactMessage
    });
  } catch (err) {
    next(err);
  }
};

// Admin: Get all contact messages with search & status filters
const getContactMessages = async (req, res, next) => {
  try {
    const { status, search } = req.query;
    const where = {};

    if (status && ['PENDING', 'READ'].includes(status.toUpperCase())) {
      where.status = status.toUpperCase();
    }

    if (search && search.trim()) {
      const q = search.trim();
      where.OR = [
        { name: { contains: q, mode: 'insensitive' } },
        { email: { contains: q, mode: 'insensitive' } },
        { phone: { contains: q, mode: 'insensitive' } },
        { subject: { contains: q, mode: 'insensitive' } },
        { message: { contains: q, mode: 'insensitive' } }
      ];
    }

    const messages = await prisma.contactMessage.findMany({
      where,
      orderBy: { createdAt: 'desc' }
    });

    res.json({
      success: true,
      messages
    });
  } catch (err) {
    next(err);
  }
};

// Admin: Update status (PENDING / READ)
const updateContactStatus = async (req, res, next) => {
  try {
    const id = parseInt(req.params.id, 10);
    const { status } = req.body;

    if (!status || !['PENDING', 'READ'].includes(status.toUpperCase())) {
      return res.status(400).json({
        success: false,
        message: 'Valid status (PENDING or READ) is required.'
      });
    }

    const updated = await prisma.contactMessage.update({
      where: { id },
      data: { status: status.toUpperCase() }
    });

    res.json({
      success: true,
      message: `Message marked as ${status.toUpperCase()}.`,
      contact: updated
    });
  } catch (err) {
    next(err);
  }
};

// Admin: Delete contact message
const deleteContactMessage = async (req, res, next) => {
  try {
    const id = parseInt(req.params.id, 10);
    await prisma.contactMessage.delete({ where: { id } });

    res.json({
      success: true,
      message: 'Contact message deleted successfully.'
    });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  submitContactMessage,
  getContactMessages,
  updateContactStatus,
  deleteContactMessage
};
