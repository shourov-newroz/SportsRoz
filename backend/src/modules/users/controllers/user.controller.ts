import { IUser } from '@/modules/auth/models/user.model';
import { BaseController } from '@/utils/baseController';
import { NextFunction, Request, Response } from 'express';
import { ValidationError } from 'express-validator';
import { AppError } from '../../../middleware/errorHandler';
import { userService } from '../services/user.service';

class UserController extends BaseController {
  protected service = userService;

  constructor() {
    super();
    // Bind methods to preserve 'this' context
    this.getProfile = this.getProfile.bind(this);
  }

  private formatValidationErrors(errors: ValidationError[]): Record<string, string> {
    const validationErrors: Record<string, string> = {};
    errors.forEach((err) => {
      const field = err.type === 'field' ? err.path : err.type;
      validationErrors[field] = err.msg;
    });
    return validationErrors;
  }

  async getProfile(req: Request, res: Response, next: NextFunction): Promise<IUser> {
    await this.handleRequest(req, res, next, async () => {
      const userId = req.params.id;

      // Ensure user can only access their own profile
      if (userId !== req.user?._id) {
        throw new AppError('Unauthorized', 403);
      }

      const user = await userService.getUserById(userId);
      if (!user) {
        throw new AppError('User not found', 404);
      }

      // Remove sensitive data
      const { ...userProfile } = user;

      return {
        userProfile,
      };
    });
  }
}

export default new UserController();
