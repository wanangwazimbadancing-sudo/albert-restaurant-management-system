import { Router } from 'express';
import {createOrder,deleteOrder,getOrder,getOrders,updateOrderStatus} from '../controllers/orders.controller.js';
import { body, param } from 'express-validator';
import { handleValidationErrors } from '../middleware/validation.js';
import { writeRateLimiter } from '../middleware/rateLimiters.js';
import { requireAdmin, requireAuth } from '../middleware/auth.js';

const router = Router();

router.get('/', requireAuth, getOrders);
router.get('/:id', requireAuth, requireAdmin, param('id').isMongoId(), handleValidationErrors, getOrder);
router.post(
  '/',
  writeRateLimiter,
  requireAuth,
  body('items').isArray({ min: 1 }),
  body('items.*.menuItem').isMongoId(),
  body('items.*.qty').isInt({ min: 1 }).toInt(),
  handleValidationErrors,
  createOrder,
);
router.patch(
  '/:id/status',
  writeRateLimiter,
  requireAuth,
  requireAdmin,
  param('id').isMongoId(),
  body('status').isIn(['pending', 'confirmed', 'preparing', 'ready', 'completed', 'cancelled']),
  handleValidationErrors,
  updateOrderStatus,
);
router.delete('/:id', writeRateLimiter, requireAuth, requireAdmin, param('id').isMongoId(), handleValidationErrors, deleteOrder);

export default router;
