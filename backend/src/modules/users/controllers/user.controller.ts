import { NextFunction, Request, Response } from 'express';
import { ValidationError } from 'express-validator';
import { AppError } from '../../../middleware/errorHandler';
import { BaseController } from '../../../utils/baseController';
import userService from '../services/user.service';

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

  async getProfile(req: Request, res: Response, next: NextFunction): Promise<void> {
    await this.handleRequest(req, res, next, async () => {
      const userId = req.params.id;
      const user = await this.service.getProfile(userId);

      if (!user) {
        throw new AppError('User not found', 404);
      }

      // Check if user is requesting their own profile
      if (req.user?._id.toString() !== userId) {
        throw new AppError('Unauthorized', 403);
      }

      return {
        userId: user._id,
        email: user.email,
        name: user.name,
        jerseyName: user.jerseyName,
        officeId: user.officeId,
        sportType: user.sportType,
        dateOfBirth: user.dateOfBirth,
        role: user.role,
        gender: user.gender,
        contactNumber: user.contactNumber,
        profilePicture: user.profilePicture,
      };
    });
  }
}

export default new UserController();
