const prisma = require('../config/db');

// GET /api/verses/monthly/current - Public
const getCurrentMonthlyVerse = async (req, res, next) => {
  try {
    const now = new Date();
    const currentMonth = now.getMonth() + 1; // 1-12
    const currentYear = now.getFullYear();

    // 1. Try to find the active verse for the current month and year
    let verse = await prisma.monthlyVerse.findFirst({
      where: {
        month: currentMonth,
        year: currentYear,
        isActive: true
      }
    });

    // 2. If not found, fall back to the most recent active monthly verse
    if (!verse) {
      verse = await prisma.monthlyVerse.findFirst({
        where: {
          isActive: true
        },
        orderBy: [
          { year: 'desc' },
          { month: 'desc' }
        ]
      });
    }

    res.json({
      success: true,
      verse: verse || null
    });
  } catch (err) {
    next(err);
  }
};

// GET /api/verses/monthly - Admin protected
const getAllMonthlyVerses = async (req, res, next) => {
  try {
    const verses = await prisma.monthlyVerse.findMany({
      orderBy: [
        { year: 'desc' },
        { month: 'desc' }
      ]
    });

    res.json({
      success: true,
      verses
    });
  } catch (err) {
    next(err);
  }
};

// POST /api/verses/monthly - Admin protected
const createMonthlyVerse = async (req, res, next) => {
  try {
    const { month, year, verseText, reference, isActive } = req.body;

    if (!month || !year || !verseText || !reference) {
      return res.status(400).json({
        success: false,
        message: 'Month, year, verse text, and reference are required.'
      });
    }

    const monthNum = parseInt(month, 10);
    const yearNum = parseInt(year, 10);

    if (monthNum < 1 || monthNum > 12) {
      return res.status(400).json({
        success: false,
        message: 'Month must be between 1 and 12.'
      });
    }

    // Check if a record already exists for this month/year
    const existing = await prisma.monthlyVerse.findUnique({
      where: {
        month_year: {
          month: monthNum,
          year: yearNum
        }
      }
    });

    if (existing) {
      return res.status(400).json({
        success: false,
        message: `A promise verse for ${monthNum}/${yearNum} already exists.`
      });
    }

    const verse = await prisma.monthlyVerse.create({
      data: {
        month: monthNum,
        year: yearNum,
        verseText: verseText.trim(),
        reference: reference.trim(),
        isActive: isActive !== undefined ? Boolean(isActive) : true
      }
    });

    res.status(201).json({
      success: true,
      message: 'Monthly promise verse created successfully.',
      verse
    });
  } catch (err) {
    next(err);
  }
};

// PUT /api/verses/monthly/:id - Admin protected
const updateMonthlyVerse = async (req, res, next) => {
  try {
    const id = parseInt(req.params.id, 10);
    const { month, year, verseText, reference, isActive } = req.body;

    const existing = await prisma.monthlyVerse.findUnique({
      where: { id }
    });

    if (!existing) {
      return res.status(404).json({
        success: false,
        message: 'Monthly promise verse not found.'
      });
    }

    const data = {};
    if (verseText !== undefined) data.verseText = verseText.trim();
    if (reference !== undefined) data.reference = reference.trim();
    if (isActive !== undefined) data.isActive = Boolean(isActive);

    if (month !== undefined || year !== undefined) {
      const monthNum = month !== undefined ? parseInt(month, 10) : existing.month;
      const yearNum = year !== undefined ? parseInt(year, 10) : existing.year;

      if (monthNum < 1 || monthNum > 12) {
        return res.status(400).json({
          success: false,
          message: 'Month must be between 1 and 12.'
        });
      }

      // Check collision with another verse
      const conflict = await prisma.monthlyVerse.findFirst({
        where: {
          month: monthNum,
          year: yearNum,
          id: { not: id }
        }
      });

      if (conflict) {
        return res.status(400).json({
          success: false,
          message: `A promise verse for ${monthNum}/${yearNum} already exists.`
        });
      }

      data.month = monthNum;
      data.year = yearNum;
    }

    const verse = await prisma.monthlyVerse.update({
      where: { id },
      data
    });

    res.json({
      success: true,
      message: 'Monthly promise verse updated successfully.',
      verse
    });
  } catch (err) {
    next(err);
  }
};

// DELETE /api/verses/monthly/:id - Admin protected
const deleteMonthlyVerse = async (req, res, next) => {
  try {
    const id = parseInt(req.params.id, 10);

    const existing = await prisma.monthlyVerse.findUnique({
      where: { id }
    });

    if (!existing) {
      return res.status(404).json({
        success: false,
        message: 'Monthly promise verse not found.'
      });
    }

    await prisma.monthlyVerse.delete({
      where: { id }
    });

    res.json({
      success: true,
      message: 'Monthly promise verse deleted successfully.'
    });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getCurrentMonthlyVerse,
  getAllMonthlyVerses,
  createMonthlyVerse,
  updateMonthlyVerse,
  deleteMonthlyVerse
};
