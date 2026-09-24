const prisma = require('../config/db');
const { comparePassword, hashPassword, generateToken } = require('../utils/auth.utils');

const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Email and password are required.' });
    }

    const cleanEmail = email.toLowerCase().trim();

    const admin = await prisma.admin.findUnique({
      where: { email: cleanEmail }
    });

    if (!admin) {
      return res.status(401).json({ success: false, message: 'Invalid email or password.' });
    }

    const isMatch = await comparePassword(password, admin.password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Invalid email or password.' });
    }

    const token = generateToken({ id: admin.id, email: admin.email });
    return res.json({
      success: true,
      token,
      admin: {
        id: admin.id,
        email: admin.email,
        name: admin.name
      }
    });
  } catch (err) {
    next(err);
  }
};

const getMe = async (req, res, next) => {
  try {
    const admin = await prisma.admin.findUnique({
      where: { id: req.user.id },
      select: { id: true, email: true, name: true }
    });

    if (!admin) {
      return res.status(404).json({ success: false, message: 'Admin not found.' });
    }

    res.json({
      success: true,
      admin
    });
  } catch (err) {
    next(err);
  }
};

const updateProfile = async (req, res, next) => {
  try {
    const { name, email } = req.body;
    const adminId = req.user.id;

    if (!email) {
      return res.status(400).json({ success: false, message: 'Email cannot be empty.' });
    }

    const existing = await prisma.admin.findFirst({
      where: {
        email: email.toLowerCase().trim(),
        NOT: { id: adminId }
      }
    });

    if (existing) {
      return res.status(400).json({ success: false, message: 'Email already in use by another admin.' });
    }

    const updated = await prisma.admin.update({
      where: { id: adminId },
      data: {
        name: name ? name.trim() : undefined,
        email: email.toLowerCase().trim()
      },
      select: { id: true, email: true, name: true }
    });

    return res.json({
      success: true,
      message: 'Profile updated successfully.',
      admin: updated
    });
  } catch (err) {
    next(err);
  }
};

const changePassword = async (req, res, next) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const adminId = req.user.id;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({ success: false, message: 'Current and new password are required.' });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({ success: false, message: 'New password must be at least 6 characters.' });
    }

    const admin = await prisma.admin.findUnique({ where: { id: adminId } });
    if (!admin) {
      return res.status(404).json({ success: false, message: 'Admin not found.' });
    }

    const isMatch = await comparePassword(currentPassword, admin.password);
    if (!isMatch) {
      return res.status(400).json({ success: false, message: 'Current password is incorrect.' });
    }

    const hashedNewPassword = await hashPassword(newPassword);
    await prisma.admin.update({
      where: { id: adminId },
      data: { password: hashedNewPassword }
    });

    res.json({
      success: true,
      message: 'Password changed successfully.'
    });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  login,
  getMe,
  updateProfile,
  changePassword
};
