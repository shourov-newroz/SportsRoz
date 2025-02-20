import { Router } from 'express';
import { body } from 'express-validator';
import validateEnv from '../../../config/env';
import { protect } from '../../../middleware/auth.middleware';
import authController from '../controllers/auth.controller';

const env = validateEnv();

// Create separate routers for public and private routes
export const publicRouter = Router();
export const privateRouter = Router();

const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

// Public routes
/**
 * @swagger
 * /public/auth/save-business-profile:
 *   post:
 *     summary: Register a new business user
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - metaInfo
 *               - attributes
 *             properties:
 *               metaInfo:
 *                 type: object
 *                 properties:
 *                   deviceId: string
 *                   deviceType: string
 *                   deviceName: string
 *                   appVersion: string
 *                   osVersion: string
 *                   ipAddress: string
 *                   timestamp: string
 *               attributes:
 *                 type: object
 *                 required:
 *                   - firstName
 *                   - lastName
 *                   - emailAddress
 *                   - mobileNumber
 *                   - countryId
 *                 properties:
 *                   firstName:
 *                     type: string
 *                   lastName:
 *                     type: string
 *                   emailAddress:
 *                     type: string
 *                     format: email
 *                   mobileNumber:
 *                     type: string
 *                   countryId:
 *                     type: string
 */
publicRouter.route('/auth/register').post(
  [
    body('full_name')
      .trim()
      .notEmpty()
      .withMessage('Full name is required')
      .isLength({ min: 2, max: 50 })
      .withMessage('Full name must be between 2 and 50 characters')
      .matches(/^[a-zA-Z\s'-]+$/)
      .withMessage('Full name can only contain letters, spaces, hyphens and apostrophes'),
    body('office_id')
      .trim()
      .notEmpty()
      .withMessage('Office ID is required')
      .isLength({ min: 2, max: 50 })
      .withMessage('Office ID must be between 2 and 50 characters'),
    body('email')
      .trim()
      .notEmpty()
      .withMessage('Email is required')
      .isEmail()
      .withMessage('Please enter a valid email')
      .normalizeEmail(),
    body('password')
      .trim()
      .notEmpty()
      .withMessage('Password is required')
      .matches(passwordRegex)
      .withMessage('Please enter a valid password'),
  ],
  authController.register,
);

/**
 * @swagger
 * /public/auth/verify-otp:
 *   post:
 *     summary: Verify OTP
 *     tags: [Auth]
 */
publicRouter
  .route('/auth/verify-otp')
  .post(
    [
      body('metaInfo').notEmpty().withMessage('Meta info is required'),
      body('attributes').notEmpty().withMessage('Attributes are required'),
      body('attributes.token').notEmpty().withMessage('Token is required'),
      body('attributes.otp')
        .notEmpty()
        .withMessage('OTP is required')
        .isNumeric()
        .withMessage('OTP must be a number')
        .isLength({ min: 6, max: 6 })
        .withMessage('OTP must be 6 digits'),
    ],
    authController.verifyOTP,
  );

/**
 * @swagger
 * /public/sign-up/send-mobile-otp:
 *   post:
 *     summary: Resend OTP
 *     tags: [Auth]
 */
publicRouter
  .route('/sign-up/send-mobile-otp')
  .post(
    [body('email').isEmail().withMessage('Please enter a valid email')],
    authController.resendOTP,
  );

/**
 * @swagger
 * /public/auth/login:
 *   post:
 *     summary: Sign in business user
 *     tags: [Auth]
 */
publicRouter
  .route('/auth/login')
  .post(
    [
      body('attributes.email').isEmail().withMessage('Please enter a valid email'),
      body('attributes.password').notEmpty().withMessage('Password is required'),
    ],
    authController.login,
  );

/**
 * @swagger
 * /public/auth/refresh-token:
 *   post:
 *     summary: Refresh access token
 *     tags: [Auth]
 */
publicRouter
  .route('/auth/refresh-token')
  .post(
    [body('attributes.refresh_token').notEmpty().withMessage('Refresh token is required')],
    authController.refreshToken,
  );

/**
 * @swagger
 * /public/auth/first-time/change-password:
 *   post:
 *     summary: Reset password
 *     tags: [Auth]
 */
publicRouter
  .route('/auth/first-time/change-password')
  .post(
    [
      body('attributes.email').isEmail().withMessage('Please enter a valid email'),
      body('attributes.tempPassword').notEmpty().withMessage('Temporary password is required'),
      body('attributes.newPassword')
        .isLength({ min: 6 })
        .withMessage('New password must be at least 6 characters long'),
    ],
    authController.resetPassword,
  );

// Private routes (protected)
privateRouter.use(protect); // Apply authentication middleware to all private routes

/**
 * @swagger
 * /private/auth/me:
 *   get:
 *     summary: Get current user profile
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 */
privateRouter.route('/auth/me').get(authController.getMe);

// Combine routers
const router = Router();
router.use(`/${env.API_PUBLIC_PREFIX}`, publicRouter);
router.use(`/${env.API_PRIVATE_PREFIX}`, privateRouter);

export default router;
