import { Router } from 'express';
import { protect } from '../../../middleware/auth.middleware';
import userController from '../controllers/user.controller';

const router = Router();

// Protected routes (require authentication)
router.use(protect);

// Get user profile
router.get('/:id', userController.getProfile);

export default router;
