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

  async getRoleById(id: string | undefined): Promise<IRole | null> {
    if (!id) return null;
    try {
      const role = await this.model.findById(id).populate('permissions');
      return role;
    } catch (error) {
      throw new AppError('Error fetching role', 500);
    }
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

  async updateRole(id: string, data: CreateRoleData): Promise<IRole> {
    try {
      const role = await this.model
        .findByIdAndUpdate(id, data, { new: true })
        .populate('permissions');

      if (!role) {
        throw new AppError('Role not found', 404);
      }

      return role;
    } catch (error) {
      if (error instanceof AppError) {
        throw error;
      }
      throw new AppError('Error updating role', 500);
    }
  }

  async deleteRole(id: string): Promise<IRole | null> {
    try {
      const role = await this.model.findByIdAndDelete(id);

      if (!role) {
        throw new AppError('Role not found', 404);
      }

      return role;
    } catch (error) {
      if (error instanceof AppError) {
        throw error;
      }
      throw new AppError('Error deleting role', 500);
    }
  }
}

export default new RoleService();
