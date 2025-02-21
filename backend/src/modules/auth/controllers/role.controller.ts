import { NextFunction, Request, Response } from 'express';
import { AppError } from '../../../middleware/errorHandler';
import { BaseController } from '../../../utils/baseController';
import roleService from '../services/role.service';

class RoleController extends BaseController {
  protected service = roleService;

  constructor() {
    super();
    // Bind methods to preserve 'this' context
    this.createRole = this.createRole.bind(this);
    this.getAllRoles = this.getAllRoles.bind(this);
  }

  async createRole(req: Request, res: Response, next: NextFunction): Promise<void> {
    await this.handleRequest(req, res, next, async () => {
      // Check if user is admin
      if (req.user?.role !== 'admin') {
        throw new AppError('Unauthorized - Admin access required', 403);
      }

      const { name, permissions } = req.body;
      const role = await this.service.createRole({ name, permissions });

      return {
        id: role._id,
        name: role.name,
        permissions: role.permissions.map((permission) => ({
          id: permission._id,
          name: permission.name,
          description: permission.description,
        })),
        createdAt: role.createdAt,
        updatedAt: role.updatedAt,
      };
    });
  }

  async getAllRoles(req: Request, res: Response, next: NextFunction): Promise<void> {
    await this.handleRequest(req, res, next, async () => {
      // Check if user is admin
      if (req.user?.role !== 'admin') {
        throw new AppError('Unauthorized - Admin access required', 403);
      }

      const roles = await this.service.getAllRoles();
      return roles.map((role) => ({
        id: role._id,
        name: role.name,
        permissions: role.permissions.map((permission) => ({
          id: permission._id,
          name: permission.name,
          description: permission.description,
        })),
        createdAt: role.createdAt,
        updatedAt: role.updatedAt,
      }));
    });
  }
}

export default new RoleController();
