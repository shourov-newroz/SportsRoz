import { Router } from 'express';
import { protect } from '../../../middleware/auth.middleware';
import userController from '../controllers/user.controller';

const router = Router();
// Protected routes (require authentication)
router.use(protect);

/**
 * @swagger
 * /users/{id}:
 *   get:
 *     summary: Get user profile
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: User ID
 *     responses:
 *       200:
 *         description: User profile retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: object
 *                   properties:
 *                     userId:
 *                       type: string
 *                     email:
 *                       type: string
 *                     name:
 *                       type: string
 *                     jerseyName:
 *                       type: string
 *                     officeId:
 *                       type: string
 *                     sportType:
 *                       type: array
 *                       items:
 *                         type: string
 *                     dateOfBirth:
 *                       type: string
 *                       format: date
 *                     role:
 *                       type: string
 *                     gender:
 *                       type: string
 *                     contactNumber:
 *                       type: string
 *                     profilePicture:
 *                       type: string
 *       401:
 *         description: Not authenticated
 *       403:
 *         description: Unauthorized to access this profile
 *       404:
 *         description: User not found
 */
router.route('/:id').get(protect, userController.getProfile);

export default router;
