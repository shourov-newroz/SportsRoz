import { Router } from 'express';
import { protect } from '../../../middleware/auth.middleware';
import permissionController from '../controllers/permission.controller';

const router = Router();

// Protected routes (require authentication)
router.use(protect);

/**
 * @swagger
 * /permissions:
 *   get:
 *     summary: Get all permissions (Admin only)
 *     tags: [Permissions]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of permissions retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: string
 *                       name:
 *                         type: string
 *                       description:
 *                         type: string
 *                       createdAt:
 *                         type: string
 *                         format: date-time
 *                       updatedAt:
 *                         type: string
 *                         format: date-time
 *       401:
 *         description: Not authenticated
 *       403:
 *         description: Not authorized to view permissions
 */
router.get('/', permissionController.getAllPermissions);

export default router;
