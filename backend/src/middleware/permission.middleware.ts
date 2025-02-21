import { NextFunction, Request, Response } from 'express';
import { IPermission } from '../modules/auth/models/permission.model';
import Role from '../modules/auth/models/role.model';
import { AppError } from './errorHandler';

export const checkPermission = (requiredPermission: string) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      // Get user role from JWT middleware
      const userRole = req.user?.role;
      if (!userRole) {
        throw new AppError('Unauthorized - No role found', 403);
      }

      // Get role with populated permissions
      const role = await Role.findById(userRole).populate<{ permissions: IPermission[] }>(
        'permissions',
      );
      if (!role) {
        throw new AppError('Role not found', 404);
      }

      // Check if role has required permission
      const hasPermission = role.permissions.some(
        (permission) => permission.name === requiredPermission,
      );

      if (!hasPermission) {
        throw new AppError('Unauthorized - Insufficient permissions', 403);
      }

      next();
    } catch (error) {
      next(error);
    }
  };
};
