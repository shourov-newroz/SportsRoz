import { NextFunction, Request, Response } from 'express';
import { AppError } from '../../../middleware/errorHandler';
import { BaseController } from '../../../utils/baseController';
import { IPermission } from '../models/permission.model';
import roleService from '../services/role.service';

class RoleController extends BaseController {
  protected service = roleService;

  constructor() {
    super();
    // Bind methods to preserve 'this' context
    this.createRole = this.createRole.bind(this);
    this.getAllRoles = this.getAllRoles.bind(this);
    this.updateRole = this.updateRole.bind(this);
    this.deleteRole = this.deleteRole.bind(this);
  }

  async createRole(req: Request, res: Response, next: NextFunction): Promise<void> {
    await this.handleRequest(req, res, next, async () => {
      const { name, permissions } = req.body;
      const role = await this.service.createRole({ name, permissions });

      return {
        id: role._id,
        name: role.name,
        permissions: (role.permissions as IPermission[]).map((permission) => ({
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
      const roles = await this.service.getAllRoles();
      return roles.map((role) => ({
        id: role._id,
        name: role.name,
        permissions: (role.permissions as IPermission[]).map((permission) => ({
          id: permission._id,
          name: permission.name,
          description: permission.description,
        })),
        createdAt: role.createdAt,
        updatedAt: role.updatedAt,
      }));
    });
  }

  async updateRole(req: Request, res: Response, next: NextFunction): Promise<void> {
    await this.handleRequest(req, res, next, async () => {
      const { id } = req.params;
      const { name, permissions } = req.body;

      const role = await this.service.updateRole(id, { name, permissions });

      return {
        id: role._id,
        name: role.name,
        permissions: (role.permissions as IPermission[]).map((permission) => ({
          id: permission._id,
          name: permission.name,
          description: permission.description,
        })),
        createdAt: role.createdAt,
        updatedAt: role.updatedAt,
      };
    });
  }

  async deleteRole(req: Request, res: Response, next: NextFunction): Promise<void> {
    await this.handleRequest(req, res, next, async () => {
      const { id } = req.params;
      const role = await this.service.deleteRole(id);

      if (!role) {
        throw new AppError('Role not found', 404);
      }

      return { message: 'Role deleted successfully' };
    });
  }
}

export default new RoleController();
