import { AppError } from '../../../middleware/errorHandler';
import { BaseService } from '../../../utils/baseService';
import Permission, { IPermission } from '../models/permission.model';

class PermissionService extends BaseService<IPermission> {
  constructor() {
    super(Permission);
  }

  async getAllPermissions(): Promise<IPermission[]> {
    try {
      const permissions = await this.model.find().sort({ name: 1 });
      return permissions;
    } catch (error) {
      throw new AppError('Error fetching permissions', 500);
    }
  }

  // Helper method to seed initial permissions if needed
  async seedPermissions(permissions: { name: string; description?: string }[]): Promise<void> {
    try {
      for (const permission of permissions) {
        await this.model.findOneAndUpdate(
          { name: permission.name },
          { ...permission },
          { upsert: true, new: true },
        );
      }
    } catch (error) {
      throw new AppError('Error seeding permissions', 500);
    }
  }
}

export default new PermissionService();
