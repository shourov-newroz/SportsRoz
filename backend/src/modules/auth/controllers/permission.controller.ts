import { NextFunction, Request, Response } from 'express';
import { BaseController } from '../../../utils/baseController';
import permissionService from '../services/permission.service';

class PermissionController extends BaseController {
  protected service = permissionService;

  constructor() {
    super();
    // Bind methods to preserve 'this' context
    this.getAllPermissions = this.getAllPermissions.bind(this);
  }

  async getAllPermissions(req: Request, res: Response, next: NextFunction): Promise<void> {
    await this.handleRequest(req, res, next, async () => {
      // Check if user is admin
      // if (req.user?.role !== 'admin') {
      //   throw new AppError('Unauthorized - Admin access required', 403);
      // }

      const permissions = await this.service.getAllPermissions();
      return permissions.map((permission) => ({
        id: permission._id,
        name: permission.name,
        description: permission.description,
        createdAt: permission.createdAt,
        updatedAt: permission.updatedAt,
      }));
    });
  }
}

export default new PermissionController();
