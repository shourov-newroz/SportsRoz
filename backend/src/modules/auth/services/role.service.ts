import { AppError } from '../../../middleware/errorHandler';
import { BaseService } from '../../../utils/baseService';
import Role, { IRole } from '../models/role.model';

interface CreateRoleData {
  name: string;
  permissions: string[];
}

class RoleService extends BaseService<IRole> {
  constructor() {
    super(Role);
  }

  async createRole(data: CreateRoleData): Promise<IRole> {
    try {
      // Check if role already exists
      const existingRole = await this.model.findOne({ name: data.name });
      if (existingRole) {
        throw new AppError('Role already exists', 400);
      }

      // Create new role with permissions
      const role = await this.model.create({
        name: data.name,
        permissions: data.permissions,
      });

      // Populate permissions
      await role.populate('permissions');
      return role;
    } catch (error) {
      if (error instanceof AppError) {
        throw error;
      }
      throw new AppError('Error creating role', 500);
    }
  }

  async getAllRoles(): Promise<IRole[]> {
    try {
      const roles = await this.model.find().populate('permissions').sort({ name: 1 });
      return roles;
    } catch (error) {
      throw new AppError('Error fetching roles', 500);
    }
  }
}

export default new RoleService();
