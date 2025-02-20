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

/**
 * @swagger
 * components:
 *   schemas:
 *     RegisterRequest:
 *       type: object
 *       required:
 *         - email
 *         - password
 *         - fullName
 *         - officeId
 *       properties:
 *         email:
 *           type: string
 *           format: email
 *           description: User's email address
 *         password:
 *           type: string
 *           format: password
 *           description: User's password (min 8 chars, 1 uppercase, 1 lowercase, 1 number, 1 special char)
 *         fullName:
 *           type: string
 *           description: User's full name
 *         officeId:
 *           type: string
 *           description: User's office ID
 *     VerifyOTPRequest:
 *       type: object
 *       required:
 *         - token
 *         - otp
 *       properties:
 *         token:
 *           type: string
 *           description: Verification token received during registration
 *         otp:
 *           type: string
 *           description: 6-digit OTP code
 *     LoginRequest:
 *       type: object
 *       required:
 *         - email
 *         - password
 *       properties:
 *         email:
 *           type: string
 *           format: email
 *         password:
 *           type: string
 *           format: password
 *     TokenResponse:
 *       type: object
 *       properties:
 *         accessToken:
 *           type: string
 *         accessTokenExpiresIn:
 *           type: number
 *         refreshToken:
 *           type: string
 *         refreshTokenExpiresIn:
 *           type: number
 */

/**
 * @swagger
 * tags:
 *   name: Auth
 *   description: Authentication endpoints
 */

/**
 * @swagger
 * /api/auth/register:
 *   post:
 *     summary: Register a new user
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/RegisterRequest'
 *     responses:
 *       201:
 *         description: Registration successful
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 data:
 *                   type: object
 *       400:
 *         description: Validation error
 *       409:
 *         description: Email already exists
 */
publicRouter.route('/auth/register').post(
  [
    body('fullName')
      .trim()
      .notEmpty()
      .withMessage('Full name is required')
      .isLength({ min: 2, max: 50 })
      .withMessage('Full name must be between 2 and 50 characters')
      .matches(/^[a-zA-Z\s'-]+$/)
      .withMessage('Full name can only contain letters, spaces, hyphens and apostrophes'),
    body('officeId')
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
 * /api/auth/verify-otp:
 *   post:
 *     summary: Verify OTP for email verification
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/VerifyOTPRequest'
 *     responses:
 *       200:
 *         description: OTP verified successfully
 *       400:
 *         description: Invalid or expired OTP
 *       401:
 *         description: Invalid token
 */
publicRouter
  .route('/auth/verify-otp')
  .post(
    [
      body('token').notEmpty().withMessage('Token is required'),
      body('otp')
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
 * /api/auth/resend-otp:
 *   post:
 *     summary: Resend OTP for email verification
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *     responses:
 *       200:
 *         description: OTP sent successfully
 *       404:
 *         description: User not found
 */
publicRouter
  .route('/auth/resend-otp')
  .post(
    [body('email').isEmail().withMessage('Please enter a valid email')],
    authController.resendOTP,
  );

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: Login user
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/LoginRequest'
 *     responses:
 *       200:
 *         description: Login successful
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/TokenResponse'
 *       401:
 *         description: Invalid credentials
 *       403:
 *         description: Email not verified
 */
publicRouter
  .route('/auth/login')
  .post(
    [
      body('email').isEmail().withMessage('Please enter a valid email'),
      body('password').notEmpty().withMessage('Password is required'),
    ],
    authController.login,
  );

/**
 * @swagger
 * /api/auth/refresh-token:
 *   post:
 *     summary: Refresh access token
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - refreshToken
 *             properties:
 *               refreshToken:
 *                 type: string
 *     responses:
 *       200:
 *         description: Token refreshed successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/TokenResponse'
 *       401:
 *         description: Invalid or expired refresh token
 */
publicRouter
  .route('/auth/refresh-token')
  .post(
    [body('refreshToken').notEmpty().withMessage('Refresh token is required')],
    authController.refreshToken,
  );

/**
 * @swagger
 * /api/auth/reset-password:
 *   post:
 *     summary: Reset password using temporary password
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - temp_password
 *               - new_password
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *               temp_password:
 *                 type: string
 *               new_password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Password reset successful
 *       401:
 *         description: Invalid temporary password
 *       404:
 *         description: User not found
 */
publicRouter
  .route('/auth/reset-password')
  .post(
    [
      body('email').isEmail().withMessage('Please enter a valid email'),
      body('temp_password').notEmpty().withMessage('Temporary password is required'),
      body('new_password')
        .isLength({ min: 8 })
        .withMessage('New password must be at least 8 characters long')
        .matches(passwordRegex)
        .withMessage('Please enter a valid password'),
    ],
    authController.resetPassword,
  );

// Private routes (protected)
privateRouter.use(protect);

/**
 * @swagger
 * /api/auth/me:
 *   get:
 *     summary: Get current user profile
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User profile retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 email:
 *                   type: string
 *                 name:
 *                   type: string
 *       401:
 *         description: Not authenticated
 */
privateRouter.route('/auth/me').get(authController.getMe);

// Combine routers
const router = Router();
router.use(`/${env.API_PUBLIC_PREFIX}`, publicRouter);
router.use(`/${env.API_PRIVATE_PREFIX}`, privateRouter);

export default router;
