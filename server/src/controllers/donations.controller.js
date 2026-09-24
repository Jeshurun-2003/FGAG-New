const prisma = require('../config/db');

// =========================================================================
// 1. Donation Purposes (Causes)
// =========================================================================

// Public: Get active donation purposes (or all if admin)
const getPurposes = async (req, res, next) => {
  try {
    const isAdmin = req.query.admin === 'true';
    const where = isAdmin ? {} : { isActive: true };

    let purposes = await prisma.donationPurpose.findMany({
      where,
      orderBy: [{ order: 'asc' }, { createdAt: 'asc' }]
    });

    // If no purposes exist yet in DB, return standard default causes
    if (purposes.length === 0 && !isAdmin) {
      purposes = [
        {
          id: 1,
          title: 'Tithes & Offerings',
          description: 'Faithful general support for worship ministry, spiritual pastoral care, and daily church operations.',
          isActive: true,
          order: 1
        },
        {
          id: 2,
          title: 'Building & Sanctuary Fund',
          description: 'Contributions toward sanctuary maintenance, sound infrastructure, and church campus enhancement.',
          isActive: true,
          order: 2
        },
        {
          id: 3,
          title: 'Missions & Outreach',
          description: 'Spreading the Gospel in rural villages, supporting field missionaries, and church planting.',
          isActive: true,
          order: 3
        },
        {
          id: 4,
          title: 'Community Care & Charity',
          description: 'Aiding widows, underprivileged families, children’s education support, and emergency medical relief.',
          isActive: true,
          order: 4
        }
      ];
    }

    res.json({
      success: true,
      purposes
    });
  } catch (err) {
    next(err);
  }
};

// Admin: Create donation purpose
const createPurpose = async (req, res, next) => {
  try {
    const { title, description, isActive = true, order = 0 } = req.body;

    if (!title || !title.trim()) {
      return res.status(400).json({ success: false, message: 'Title is required.' });
    }

    const purpose = await prisma.donationPurpose.create({
      data: {
        title: title.trim(),
        description: description ? description.trim() : null,
        isActive: Boolean(isActive),
        order: parseInt(order, 10) || 0
      }
    });

    res.status(201).json({
      success: true,
      message: 'Donation purpose created successfully.',
      purpose
    });
  } catch (err) {
    next(err);
  }
};

// Admin: Update donation purpose
const updatePurpose = async (req, res, next) => {
  try {
    const id = parseInt(req.params.id, 10);
    const { title, description, isActive, order } = req.body;

    const data = {};
    if (title !== undefined) data.title = title.trim();
    if (description !== undefined) data.description = description ? description.trim() : null;
    if (isActive !== undefined) data.isActive = Boolean(isActive);
    if (order !== undefined) data.order = parseInt(order, 10) || 0;

    const updated = await prisma.donationPurpose.update({
      where: { id },
      data
    });

    res.json({
      success: true,
      message: 'Donation purpose updated successfully.',
      purpose: updated
    });
  } catch (err) {
    next(err);
  }
};

// Admin: Delete donation purpose
const deletePurpose = async (req, res, next) => {
  try {
    const id = parseInt(req.params.id, 10);
    await prisma.donationPurpose.delete({ where: { id } });

    res.json({
      success: true,
      message: 'Donation purpose deleted successfully.'
    });
  } catch (err) {
    next(err);
  }
};

// =========================================================================
// 2. Donation Ledger Records
// =========================================================================

// Admin: Get donation ledger records with search & aggregated total
const getRecords = async (req, res, next) => {
  try {
    const { search } = req.query;
    const where = {};

    if (search && search.trim()) {
      const q = search.trim();
      where.OR = [
        { donorName: { contains: q, mode: 'insensitive' } },
        { purpose: { contains: q, mode: 'insensitive' } },
        { mode: { contains: q, mode: 'insensitive' } },
        { note: { contains: q, mode: 'insensitive' } }
      ];
    }

    const [records, aggregate] = await Promise.all([
      prisma.donationRecord.findMany({
        where,
        orderBy: { date: 'desc' }
      }),
      prisma.donationRecord.aggregate({
        where,
        _sum: { amount: true },
        _count: { id: true }
      })
    ]);

    const totalAmount = aggregate._sum.amount || 0;
    const totalCount = aggregate._count.id || 0;

    res.json({
      success: true,
      records,
      totalAmount,
      totalCount
    });
  } catch (err) {
    next(err);
  }
};

// Admin: Create donation record
const createRecord = async (req, res, next) => {
  try {
    const { donorName, amount, purpose, date, mode, note } = req.body;

    if (!donorName || !donorName.trim()) {
      return res.status(400).json({ success: false, message: 'Donor name is required.' });
    }

    const parsedAmount = parseFloat(amount);
    if (isNaN(parsedAmount) || parsedAmount <= 0) {
      return res.status(400).json({ success: false, message: 'Valid positive donation amount is required.' });
    }

    const record = await prisma.donationRecord.create({
      data: {
        donorName: donorName.trim(),
        amount: parsedAmount,
        purpose: purpose ? purpose.trim() : 'General Offering',
        date: date ? new Date(date) : new Date(),
        mode: mode ? mode.trim() : 'UPI',
        note: note ? note.trim() : null
      }
    });

    res.status(201).json({
      success: true,
      message: 'Donation record added successfully.',
      record
    });
  } catch (err) {
    next(err);
  }
};

// Admin: Update donation record
const updateRecord = async (req, res, next) => {
  try {
    const id = parseInt(req.params.id, 10);
    const { donorName, amount, purpose, date, mode, note } = req.body;

    const data = {};
    if (donorName !== undefined) data.donorName = donorName.trim();
    if (amount !== undefined) {
      const parsedAmount = parseFloat(amount);
      if (isNaN(parsedAmount) || parsedAmount <= 0) {
        return res.status(400).json({ success: false, message: 'Valid positive donation amount is required.' });
      }
      data.amount = parsedAmount;
    }
    if (purpose !== undefined) data.purpose = purpose ? purpose.trim() : 'General Offering';
    if (date !== undefined) data.date = new Date(date);
    if (mode !== undefined) data.mode = mode ? mode.trim() : 'UPI';
    if (note !== undefined) data.note = note ? note.trim() : null;

    const updated = await prisma.donationRecord.update({
      where: { id },
      data
    });

    res.json({
      success: true,
      message: 'Donation record updated successfully.',
      record: updated
    });
  } catch (err) {
    next(err);
  }
};

// Admin: Delete donation record
const deleteRecord = async (req, res, next) => {
  try {
    const id = parseInt(req.params.id, 10);
    await prisma.donationRecord.delete({ where: { id } });

    res.json({
      success: true,
      message: 'Donation record removed successfully.'
    });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getPurposes,
  createPurpose,
  updatePurpose,
  deletePurpose,
  getRecords,
  createRecord,
  updateRecord,
  deleteRecord
};
