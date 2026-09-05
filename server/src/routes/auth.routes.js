import { Router } from 'express';
import { getMe, login, register, requestPasswordReset, resetPassword } from '../controllers/auth.controller.js';
import { body } from 'express-validator';
import { handleValidationErrors } from '../middleware/validation.js';
import { authRateLimiter } from '../middleware/rateLimiters.js';

const router = Router();

router.post(
  '/login',
  authRateLimiter,
  body('email').trim().isEmail().normalizeEmail(),
  body('password').isString().notEmpty(),
  handleValidationErrors,
  login,
);
router.post(
  '/register',
  authRateLimiter,
  body('name').trim().isLength({ min: 2, max: 100 }),
  body('email').isEmail().normalizeEmail(),
  body('password').isString().isLength({ min: 6, max: 128 }),
  handleValidationErrors,
  register,
);
router.post(
  '/forgot-password',
  authRateLimiter,
  body('email').trim().isEmail().normalizeEmail(),
  handleValidationErrors,
  requestPasswordReset,
);
router.post(
  '/reset-password',
  authRateLimiter,
  body('token').isString().isLength({ min: 64, max: 64 }),
  body('password').isString().isLength({ min: 6, max: 128 }),
  handleValidationErrors,
  resetPassword,
);
router.get('/me', getMe);

export default router;
