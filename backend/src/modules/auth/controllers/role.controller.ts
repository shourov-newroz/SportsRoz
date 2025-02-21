import { NextFunction, Request, Response } from 'express';
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
      const { name } = req.body;
      const role = await this.service.createRole(name);

      return {
        id: role._id,
        name: role.name,
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
        createdAt: role.createdAt,
        updatedAt: role.updatedAt,
      }));
    });
  }
}

export default new RoleController();
