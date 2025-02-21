import { Router } from 'express';
import { body } from 'express-validator';
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

/**
 * @swagger
 * /users/{id}:
 *   put:
 *     summary: Update user profile
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
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               jerseyName:
 *                 type: string
 *               sportType:
 *                 type: array
 *                 items:
 *                   type: string
 *               dateOfBirth:
 *                 type: string
 *                 format: date
 *               gender:
 *                 type: string
 *                 enum: [Male, Female, Other]
 *               contactNumber:
 *                 type: string
 *               profilePicture:
 *                 type: string
 *     responses:
 *       200:
 *         description: User profile updated successfully
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
 *         description: Unauthorized to update this profile
 *       404:
 *         description: User not found
 */
router
  .route('/:id')
  .put(
    protect,
    [
      body('name')
        .optional()
        .trim()
        .isLength({ min: 2 })
        .withMessage('Name must be at least 2 characters long'),
      body('jerseyName').optional().trim(),
      body('sportType').optional().isArray().withMessage('Sport type must be an array'),
      body('dateOfBirth').optional().isISO8601().toDate().withMessage('Invalid date format'),
      body('gender').optional().isIn(['Male', 'Female', 'Other']).withMessage('Invalid gender'),
      body('contactNumber').optional().trim(),
      body('profilePicture')
        .optional()
        .trim()
        .isURL()
        .withMessage('Invalid URL for profile picture'),
    ],
    userController.updateProfile,
  );

export default router;
