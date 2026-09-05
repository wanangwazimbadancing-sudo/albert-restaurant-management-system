import { Router } from 'express';
import {
  createMenuItem,
  deleteMenuItem,
  getMenuItem,
  getMenuItems,
  updateMenuItem,
} from '../controllers/menu.controller.js';
import { body, param } from 'express-validator';
import { handleValidationErrors } from '../middleware/validation.js';
import { writeRateLimiter } from '../middleware/rateLimiters.js';
import { requireAdmin, requireAuth } from '../middleware/auth.js';

const router = Router();

router.get('/', getMenuItems);
router.get('/:id', param('id').isMongoId(), handleValidationErrors, getMenuItem);
router.post(
  '/',
  writeRateLimiter,
  requireAuth,
  requireAdmin,
  body('name').trim().isLength({ min: 1, max: 100 }),
  body('category').trim().isLength({ min: 1 }),
  body('price').isFloat({ min: 0 }).toFloat(),
  body('desc').optional().trim().isLength({ max: 500 }),
  handleValidationErrors,
  createMenuItem,
);
router.patch(
  '/:id',
  writeRateLimiter,
  requireAuth,
  requireAdmin,
  param('id').isMongoId(),
  body('name').optional().trim().isLength({ min: 1, max: 100 }),
  body('category').optional().trim().isLength({ min: 1 }),
  body('price').optional().isFloat({ min: 0 }).toFloat(),
  body('desc').optional().trim().isLength({ max: 500 }),
  body('isAvailable').optional().isBoolean().toBoolean(),
  handleValidationErrors,
  updateMenuItem,
);
router.delete('/:id', writeRateLimiter, requireAuth, requireAdmin, param('id').isMongoId(), handleValidationErrors, deleteMenuItem);

export default router;
