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
    this.updateProfile = this.updateProfile.bind(this);
    this.getAllApproved = this.getAllApproved.bind(this);
    this.getAllPending = this.getAllPending.bind(this);
    this.updateStatus = this.updateStatus.bind(this);
    this.updateRole = this.updateRole.bind(this);
    this.getAllUsers = this.getAllUsers.bind(this);
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

  async updateProfile(req: Request, res: Response, next: NextFunction): Promise<void> {
    await this.handleRequest(req, res, next, async () => {
      const userId = req.params.id;
      const updateData = req.body;

      // Check if user is updating their own profile
      if (req.user?._id.toString() !== userId) {
        throw new AppError('Unauthorized', 403);
      }

      // Remove fields that shouldn't be updated
      delete updateData.email;
      delete updateData.officeId;
      delete updateData.role;
      delete updateData.password;

      const updatedUser = await this.service.updateProfile(userId, updateData);

      if (!updatedUser) {
        throw new AppError('User not found', 404);
      }

      return {
        userId: updatedUser._id,
        email: updatedUser.email,
        name: updatedUser.name,
        jerseyName: updatedUser.jerseyName,
        officeId: updatedUser.officeId,
        sportType: updatedUser.sportType,
        dateOfBirth: updatedUser.dateOfBirth,
        role: updatedUser.role,
        gender: updatedUser.gender,
        contactNumber: updatedUser.contactNumber,
        profilePicture: updatedUser.profilePicture,
      };
    });
  }

  async getAllApproved(req: Request, res: Response, next: NextFunction): Promise<void> {
    await this.handleRequest(req, res, next, async () => {
      const users = await this.service.getAllApproved();
      return users;
    });
  }

  async getAllPending(req: Request, res: Response, next: NextFunction): Promise<void> {
    await this.handleRequest(req, res, next, async () => {
      const users = await this.service.getAllPending();
      return users;
    });
  }

  async updateStatus(req: Request, res: Response, next: NextFunction): Promise<void> {
    await this.handleRequest(req, res, next, async () => {
      const userId = req.params.id;
      const { isApproved } = req.body;
      const updatedUser = await this.service.updateStatus(userId, isApproved);

      if (!updatedUser) {
        throw new AppError('User not found', 404);
      }

      return updatedUser;
    });
  }

  async updateRole(req: Request, res: Response, next: NextFunction): Promise<void> {
    await this.handleRequest(req, res, next, async () => {
      const userId = req.params.id;
      const { role } = req.body;
      const updatedUser = await this.service.updateRole(userId, role);

      if (!updatedUser) {
        throw new AppError('User not found', 404);
      }

      return updatedUser;
    });
  }

  async getAllUsers(req: Request, res: Response, next: NextFunction): Promise<void> {
    await this.handleRequest(req, res, next, async () => {
      const { approved } = req.query;
      const users = await this.service.getAllUsers(approved === 'true');
      return users;
    });
  }
}

export default new UserController();
