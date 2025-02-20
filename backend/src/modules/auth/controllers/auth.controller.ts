import { NextFunction, Request, Response } from 'express';
import { ValidationError, validationResult } from 'express-validator';
import { AppError } from '../../../middleware/errorHandler';
import { BaseController } from '../../../utils/baseController';
import logger from '../../../utils/logger';
import authService from '../services/auth.service';

class AuthController extends BaseController {
  protected service = authService;

  constructor() {
    super();
    // Bind methods to preserve 'this' context
    this.register = this.register.bind(this);
    this.verifyOTP = this.verifyOTP.bind(this);
    this.resendOTP = this.resendOTP.bind(this);
    this.login = this.login.bind(this);
    this.refreshToken = this.refreshToken.bind(this);
    this.resetPassword = this.resetPassword.bind(this);
    this.getMe = this.getMe.bind(this);
    this.logout = this.logout.bind(this);
  }

  private formatValidationErrors(errors: ValidationError[]): Record<string, string> {
    const validationErrors: Record<string, string> = {};
    errors.forEach((err) => {
      const field = err.type === 'field' ? err.path : err.type;
      validationErrors[field] = err.msg;
    });
    return validationErrors;
  }

  async register(req: Request, res: Response, next: NextFunction): Promise<void> {
    await this.handleRequest(req, res, next, async () => {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        const validationErrors = this.formatValidationErrors(errors.array());
        throw new AppError('Validation failed', 400, validationErrors);
      }

      const { email, password, fullName, officeId } = req.body;
      const result = await this.service.signUp({
        email,
        password,
        fullName,
        officeId,
      });

      // In production, send OTP via email/SMS
      logger.info(`OTP for user ${result.user.email}: ${result.otp}`);

      res.status(201);
      return {
        userId: result.user._id,
        token: result.token,
        expiryTime: result.expiryTime,
        intervalTime: result.intervalTime,
      };
    });
  }

  async verifyOTP(req: Request, res: Response, next: NextFunction): Promise<void> {
    await this.handleRequest(req, res, next, async () => {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        const validationErrors = this.formatValidationErrors(errors.array());
        throw new AppError('Validation failed', 400, validationErrors);
      }

      const { token, otp } = req.body;
      const result = await this.service.verifyOTP(token, otp.toString());

      return { message: result.message };
    });
  }

  async resendOTP(req: Request, res: Response, next: NextFunction): Promise<void> {
    await this.handleRequest(req, res, next, async () => {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        const validationErrors = this.formatValidationErrors(errors.array());
        throw new AppError('Validation failed', 400, validationErrors);
      }

      const { email } = req.body;
      const otp = await this.service.resendOTP(email);

      // In production, send OTP via email/SMS
      logger.info(`New OTP for user ${email}: ${otp}`);

      return null;
    });
  }

  async login(req: Request, res: Response, next: NextFunction): Promise<void> {
    await this.handleRequest(req, res, next, async () => {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        const validationErrors = this.formatValidationErrors(errors.array());
        throw new AppError('Validation failed', 400, validationErrors);
      }

      const { email, password } = req.body;
      const result = await this.service.login(email, password);

      if ('passwordChangeRequired' in result) {
        return {
          passwordChangeRequired: result.passwordChangeRequired,
        };
      }

      return {
        email: result.email,
        fullName: result.fullName,
        officeId: result.officeId,
        accessToken: result.accessToken,
        accessTokenExpiresIn: result.accessTokenExpiresIn,
        refreshToken: result.refreshToken,
        refreshTokenExpiresIn: result.refreshTokenExpiresIn,
      };
    });
  }

  async refreshToken(req: Request, res: Response, next: NextFunction): Promise<void> {
    await this.handleRequest(req, res, next, async () => {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        const validationErrors = this.formatValidationErrors(errors.array());
        throw new AppError('Validation failed', 400, validationErrors);
      }

      const { refreshToken } = req.body;
      const tokens = await this.service.refreshToken(refreshToken);

      return { accessTokenResponse: tokens };
    });
  }

  async resetPassword(req: Request, res: Response, next: NextFunction): Promise<void> {
    await this.handleRequest(req, res, next, async () => {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        const validationErrors = this.formatValidationErrors(errors.array());
        throw new AppError('Validation failed', 400, validationErrors);
      }

      const { email, tempPassword, newPassword } = req.body;
      await this.service.resetPassword(email, tempPassword, newPassword);

      return { message: 'Password reset successfully' };
    });
  }

  async getMe(req: Request, res: Response, next: NextFunction): Promise<void> {
    await this.handleRequest(req, res, next, async () => {
      const user = req.user;
      if (!user) {
        throw new AppError('Not authenticated', 401);
      }

      return {
        user: {
          email: user.email,
          name: user.fullName,
        },
      };
    });
  }

  async logout(req: Request, res: Response, next: NextFunction): Promise<void> {
    await this.handleRequest(req, res, next, async () => {
      // No need to do anything special here since we're using JWTs
      // The frontend will remove the tokens
      return { message: 'Logged out successfully' };
    });
  }
}

export default new AuthController();
