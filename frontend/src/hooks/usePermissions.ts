import {
  hasAllPermissions,
  hasAnyCategoryPermission,
  hasAnyPermission,
  hasPermission,
  IPermissionCategory,
  IPermissionValue,
  PERMISSIONS,
} from '@/config/permission';
import { useCallback, useMemo } from 'react';
import useAuth from './useAuth';

interface UsePermissionsReturn {
  isAdmin: boolean;
  can: (permission: IPermissionValue) => boolean;
  canAll: (permissions: IPermissionValue[]) => boolean;
  canAny: (permissions: IPermissionValue[]) => boolean;
  canInCategory: (category: IPermissionCategory) => boolean;
  getActionPermissions: (category: IPermissionCategory) => {
    canView: boolean;
    canCreate: boolean;
    canEdit: boolean;
    canDelete: boolean;
    canApprove?: boolean;
  };
}

interface ActionPermissions {
  canView: boolean;
  canCreate: boolean;
  canEdit: boolean;
  canDelete: boolean;
  canApprove?: boolean;
}

export const usePermissions = (): UsePermissionsReturn => {
  const { user } = useAuth();
  const userPermissions = user?.permissions || [];

  const can = useCallback(
    (permission: IPermissionValue) => hasPermission(userPermissions, permission),
    [userPermissions]
  );

  const canAll = useCallback(
    (permissions: IPermissionValue[]) => hasAllPermissions(userPermissions, permissions),
    [userPermissions]
  );

  const canAny = useCallback(
    (permissions: IPermissionValue[]) => hasAnyPermission(userPermissions, permissions),
    [userPermissions]
  );

  const canInCategory = useCallback(
    (category: IPermissionCategory) => hasAnyCategoryPermission(userPermissions, category),
    [userPermissions]
  );

  const isAdmin = useMemo(() => user?.type === 'System Admin', [user?.type]);

  const getActionPermissions = useCallback(
    (category: IPermissionCategory): ActionPermissions => {
      const categoryPerms = PERMISSIONS[category];
      const result = {
        canView: false,
        canCreate: false,
        canEdit: false,
        canDelete: false,
        canApprove: false,
      };

      // Safely check each permission
      if ('VIEW' in categoryPerms) {
        result.canView = hasPermission(
          userPermissions,
          categoryPerms['VIEW' as keyof typeof categoryPerms]
        );
      }
      if ('CREATE' in categoryPerms) {
        result.canCreate = hasPermission(
          userPermissions,
          categoryPerms['CREATE' as keyof typeof categoryPerms]
        );
      }
      if ('EDIT' in categoryPerms) {
        result.canEdit = hasPermission(
          userPermissions,
          categoryPerms['EDIT' as keyof typeof categoryPerms]
        );
      }
      if ('DELETE' in categoryPerms) {
        result.canDelete = hasPermission(
          userPermissions,
          categoryPerms['DELETE' as keyof typeof categoryPerms]
        );
      }
      if ('APPROVE' in categoryPerms) {
        result.canApprove = hasPermission(
          userPermissions,
          categoryPerms['APPROVE' as keyof typeof categoryPerms]
        );
      }

      return result;
    },
    [userPermissions]
  );

  return useMemo(
    () => ({
      can,
      canAll,
      canAny,
      canInCategory,
      getActionPermissions,
      isAdmin,
    }),
    [can, canAll, canAny, canInCategory, getActionPermissions, isAdmin]
  );
};

export default usePermissions;
