import { Router } from 'express';
import { body } from 'express-validator';
import { protect } from '../../../middleware/auth.middleware';
import { validate } from '../../../middleware/validate';
import roleController from '../controllers/role.controller';

const router = Router();

// Protected routes (require authentication)
router.use(protect);

/**
 * @swagger
 * /roles:
 *   post:
 *     summary: Create a new role (Admin only)
 *     tags: [Roles]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *             properties:
 *               name:
 *                 type: string
 *                 description: The name of the role
 *               permissions:
 *                 type: array
 *                 items:
 *                   type: string
 *                 description: Array of permission IDs
 *     responses:
 *       201:
 *         description: Role created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                     name:
 *                       type: string
 *                     permissions:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           id:
 *                             type: string
 *                           name:
 *                             type: string
 *                           description:
 *                             type: string
 *                     createdAt:
 *                       type: string
 *                       format: date-time
 *                     updatedAt:
 *                       type: string
 *                       format: date-time
 *       400:
 *         description: Invalid request body
 *       401:
 *         description: Not authenticated
 *       403:
 *         description: Not authorized to create roles
 */
router.post(
  '/',
  [
    body('name')
      .trim()
      .notEmpty()
      .withMessage('Role name is required')
      .isLength({ min: 2 })
      .withMessage('Role name must be at least 2 characters long')
      .matches(/^[a-zA-Z0-9_-]+$/)
      .withMessage('Role name can only contain letters, numbers, hyphens and underscores'),
    body('permissions')
      .optional()
      .isArray()
      .withMessage('Permissions must be an array')
      .custom((value) => {
        if (!Array.isArray(value)) return false;
        return value.every((id) => typeof id === 'string' && id.length > 0);
      })
      .withMessage('Each permission must be a valid ID'),
  ],
  validate,
  roleController.createRole,
);

/**
 * @swagger
 * /roles:
 *   get:
 *     summary: Get all roles (Admin only)
 *     tags: [Roles]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of roles retrieved successfully
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
 *                       permissions:
 *                         type: array
 *                         items:
 *                           type: object
 *                           properties:
 *                             id:
 *                               type: string
 *                             name:
 *                               type: string
 *                             description:
 *                               type: string
 *                       createdAt:
 *                         type: string
 *                         format: date-time
 *                       updatedAt:
 *                         type: string
 *                         format: date-time
 *       401:
 *         description: Not authenticated
 *       403:
 *         description: Not authorized to view roles
 */
router.get('/', roleController.getAllRoles);

/**
 * @swagger
 * /roles/{id}:
 *   put:
 *     summary: Update an existing role (Admin only)
 *     tags: [Roles]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The ID of the role to update
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *             properties:
 *               name:
 *                 type: string
 *                 description: The name of the role
 *               permissions:
 *                 type: array
 *                 items:
 *                   type: string
 *                 description: Array of permission IDs
 *     responses:
 *       200:
 *         description: Role updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                     name:
 *                       type: string
 *                     permissions:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           id:
 *                             type: string
 *                           name:
 *                             type: string
 *                           description:
 *                             type: string
 *                     createdAt:
 *                       type: string
 *                       format: date-time
 *                     updatedAt:
 *                       type: string
 *                       format: date-time
 *       400:
 *         description: Invalid request body
 *       401:
 *         description: Not authenticated
 *       403:
 *         description: Not authorized to update roles
 *       404:
 *         description: Role not found
 */
router.put(
  '/:id',
  [
    body('name')
      .trim()
      .notEmpty()
      .withMessage('Role name is required')
      .isLength({ min: 2 })
      .withMessage('Role name must be at least 2 characters long')
      .matches(/^[a-zA-Z0-9_-]+$/)
      .withMessage('Role name can only contain letters, numbers, hyphens and underscores'),
    body('permissions')
      .optional()
      .isArray()
      .withMessage('Permissions must be an array')
      .custom((value) => {
        if (!Array.isArray(value)) return false;
        return value.every((id) => typeof id === 'string' && id.length > 0);
      })
      .withMessage('Each permission must be a valid ID'),
  ],
  validate,
  roleController.updateRole,
);

/**
 * @swagger
 * /roles/{id}:
 *   delete:
 *     summary: Delete a role (Admin only)
 *     tags: [Roles]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The ID of the role to delete
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Role deleted successfully
 *       401:
 *         description: Not authenticated
 *       403:
 *         description: Not authorized to delete roles
 *       404:
 *         description: Role not found
 */
router.delete('/:id', roleController.deleteRole);

export default router;
