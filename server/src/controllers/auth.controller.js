import bcrypt from 'bcrypt';
import crypto from 'crypto';
import jwt from 'jsonwebtoken';
import User from '../Models/UserModels.js';

const createToken = (user) =>
  jwt.sign({ id: user._id.toString(), role: user.role }, process.env.JWT_SECRET || process.env.jwt_secret || 'development-secret', {
    expiresIn: '7d',
  });

const publicUser = (user) => ({
  id: user._id,
  name: user.name,
  email: user.email,
  role: user.role,
});

const sendPasswordResetEmail = async (email, token) => {
  const clientUrl = (process.env.CLIENT_URL || 'http://localhost:5173').replace(/\/$/, '');
  const response = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from: process.env.RESEND_FROM_EMAIL,
      to: [email],
      subject: 'Reset your password',
      html: `<p>Reset your password by following this link:</p><p><a href="${clientUrl}/auth?resetToken=${encodeURIComponent(token)}">Reset password</a></p><p>This link expires in 15 minutes.</p>`,
    }),
  });

  if (!response.ok) {
    throw new Error(`Password reset email failed with status ${response.status}.`);
  }
};

// Login, Register, and Get Me functions for authentication


export const login = async (req, res, next) => {
  try {
    const user = await User.findOne({ email: req.body.email }).select('+password');

    if (!user || !(await bcrypt.compare(req.body.password, user.password))) {
      return res.status(401).json({ success: false, message: 'Invalid email or password.' });
    }

    return res.status(200).json({
      success: true,
      message: 'Login successful',
      user: publicUser(user),
      token: createToken(user),
    });
  } catch (error) {
    return next(error);
  }
};

export const register = async (req, res, next) => {
  try {
    const password = await bcrypt.hash(req.body.password, 12);
    const user = await User.create({ name: req.body.name, email: req.body.email, password });

    return res.status(201).json({
      success: true,
      message: 'User registered successfully',
      user: publicUser(user),
      token: createToken(user),
    });
  } catch (error) {
    if (error?.code === 11000) {
      return res.status(409).json({ success: false, message: 'An account with that email already exists.' });
    }
    return next(error);
  }
};

export const requestPasswordReset = async (req, res, next) => {
  try {
    const user = await User.findOne({ email: req.body.email }).select('+passwordResetTokenHash +passwordResetExpiresAt');

    if (user) {
      const token = crypto.randomBytes(32).toString('hex');
      user.passwordResetTokenHash = crypto.createHash('sha256').update(token).digest('hex');
      user.passwordResetExpiresAt = new Date(Date.now() + 15 * 60 * 1000);
      await user.save();
      await sendPasswordResetEmail(user.email, token);
    }

    return res.status(200).json({ success: true, message: 'If an account exists for that email, a reset link has been sent.' });
  } catch (error) {
    return next(error);
  }
};

export const resetPassword = async (req, res, next) => {
  try {
    const tokenHash = crypto.createHash('sha256').update(req.body.token).digest('hex');
    const user = await User.findOne({
      passwordResetTokenHash: tokenHash,
      passwordResetExpiresAt: { $gt: new Date() },
    }).select('+passwordResetTokenHash +passwordResetExpiresAt +password');

    if (!user) return res.status(400).json({ success: false, message: 'This password reset link is invalid or expired.' });

    user.password = await bcrypt.hash(req.body.password, 12);
    user.passwordResetTokenHash = undefined;
    user.passwordResetExpiresAt = undefined;
    await user.save();

    return res.status(200).json({ success: true, message: 'Password reset successfully.' });
  } catch (error) {
    return next(error);
  }
};

export const getMe = async (req, res, next) => {
  try {
    const token = (req.headers.authorization || '').replace(/^Bearer\s+/, '');
    if (!token) {
      return res.status(401).json({ success: false, message: 'Authentication required.' });
    }

    const payload = jwt.verify(token, process.env.JWT_SECRET || process.env.jwt_secret || 'development-secret');
    const user = await User.findById(payload.id);
    if (!user) {
      return res.status(401).json({ success: false, message: 'Authentication required.' });
    }

    return res.status(200).json({ success: true, user: publicUser(user) });
  } catch (error) {
    if (error.name === 'JsonWebTokenError' || error.name === 'TokenExpiredError') {
      return res.status(401).json({ success: false, message: 'Invalid or expired token.' });
    }
    return next(error);
  }
};
