const prisma = require('../config/db');

// Public: Submit volunteer application
const submitVolunteer = async (req, res, next) => {
  try {
    const { name, age, gender, comingFrom, profession, phone, ministries, message } = req.body;

    if (!name || !age || !gender || !comingFrom || !profession || !phone) {
      return res.status(400).json({
        success: false,
        message: 'Name, age, gender, location, profession, and phone are required.'
      });
    }

    let ministriesStr = '[]';
    if (Array.isArray(ministries)) {
      ministriesStr = JSON.stringify(ministries);
    } else if (typeof ministries === 'string') {
      ministriesStr = ministries;
    }

    const submission = await prisma.volunteerSubmission.create({
      data: {
        name: name.trim(),
        age: parseInt(age, 10),
        gender: gender.trim(),
        comingFrom: comingFrom.trim(),
        profession: profession.trim(),
        phone: phone.trim(),
        ministries: ministriesStr,
        message: message ? message.trim() : null
      }
    });

    res.status(201).json({
      success: true,
      message: 'Thank you for stepping up to serve! We will reach out to you shortly.',
      submission
    });
  } catch (err) {
    next(err);
  }
};

// Admin: Get volunteer submissions
const getVolunteerSubmissions = async (req, res, next) => {
  try {
    const { status } = req.query;
    const where = status ? { status: status.toUpperCase() } : {};

    const submissions = await prisma.volunteerSubmission.findMany({
      where,
      orderBy: { createdAt: 'desc' }
    });

    // Parse ministries JSON for frontend convenience
    const formatted = submissions.map((sub) => {
      let parsedMinistries = [];
      try {
        parsedMinistries = JSON.parse(sub.ministries || '[]');
      } catch (e) {
        parsedMinistries = [sub.ministries];
      }
      return {
        ...sub,
        ministriesList: parsedMinistries
      };
    });

    res.json({
      success: true,
      submissions: formatted
    });
  } catch (err) {
    next(err);
  }
};

// Admin: Update volunteer status
const updateVolunteerStatus = async (req, res, next) => {
  try {
    const id = parseInt(req.params.id, 10);
    const { status } = req.body;

    if (!['PENDING', 'REVIEWED'].includes(status?.toUpperCase())) {
      return res.status(400).json({ success: false, message: 'Invalid status.' });
    }

    const updated = await prisma.volunteerSubmission.update({
      where: { id },
      data: { status: status.toUpperCase() }
    });

    res.json({
      success: true,
      message: `Submission marked as ${status}.`,
      submission: updated
    });
  } catch (err) {
    next(err);
  }
};

// Admin: Delete volunteer submission
const deleteVolunteerSubmission = async (req, res, next) => {
  try {
    const id = parseInt(req.params.id, 10);
    await prisma.volunteerSubmission.delete({ where: { id } });

    res.json({
      success: true,
      message: 'Submission deleted successfully.'
    });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  submitVolunteer,
  getVolunteerSubmissions,
  updateVolunteerStatus,
  deleteVolunteerSubmission
};
