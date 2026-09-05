import jwt from 'jsonwebtoken';
import User from '../Models/UserModels.js';

export const requireAuth = async (req, res, next) => {
  try {
    const token = (req.headers.authorization || '').replace(/^Bearer\s+/, '');
    if (!token) return res.status(401).json({ success: false, message: 'Authentication required.' });

    const payload = jwt.verify(token, process.env.JWT_SECRET || process.env.jwt_secret || 'development-secret');
    const user = await User.findById(payload.id);
    if (!user) return res.status(401).json({ success: false, message: 'Authentication required.' });

    req.user = user;
    return next();
  } catch (error) {
    if (error.name === 'JsonWebTokenError' || error.name === 'TokenExpiredError') {
      return res.status(401).json({ success: false, message: 'Invalid or expired token.' });
    }
    return next(error);
  }
};

export const requireAdmin = (req, res, next) => {
  if (req.user?.role !== 'admin') {
    return res.status(403).json({ success: false, message: 'Administrator access required.' });
  }
  return next();
};
