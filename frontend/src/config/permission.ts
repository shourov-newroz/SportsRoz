import { IUserType } from '@/types/auth.types';

// Unified Permission Structure
export const PERMISSIONS = {} as const;

export const getPermissionsByUserType = (
  type: IUserType,
  permissions: IPermissionValue[]
): IPermissionValue[] => {
  console.log('🚀 ~ getPermissionsByUserType ~ type:', type);
  return [...permissions];
};

// Type Definitions
export type IPermissionCategory = keyof typeof PERMISSIONS;
export type IPermissionAction<T extends IPermissionCategory> = keyof (typeof PERMISSIONS)[T];

// Create a union type of all permission string literals
type ValueOf<T> = T[keyof T];

export type IPermissionValue = ValueOf<{
  [K in IPermissionCategory]: ValueOf<(typeof PERMISSIONS)[K]>;
}>;

// Permission Check Cache
const permissionCheckCache = new Map<string, boolean>();

// Helper function to generate cache key
const getCacheKey = (
  userPermissions: readonly string[],
  requiredPermissions: readonly string[],
  type: 'any' | 'all'
): string => {
  const sortedUserPerms = [...userPermissions].sort().join(',');
  const sortedReqPerms = [...requiredPermissions].sort().join(',');
  return `${sortedUserPerms}|${sortedReqPerms}|${type}`;
};

// Permission Check Utilities
export const hasPermission = (
  userPermissions: readonly string[] | undefined,
  requiredPermission: IPermissionValue | undefined
): boolean => {
  if (!userPermissions || !requiredPermission) return false;
  const cacheKey = getCacheKey(userPermissions, [requiredPermission], 'any');

  if (permissionCheckCache.has(cacheKey)) {
    return permissionCheckCache.get(cacheKey)!;
  }

  const result = userPermissions.includes(requiredPermission);
  permissionCheckCache.set(cacheKey, result);
  return result;
};

export const hasAnyPermission = (
  userPermissions: readonly string[],
  requiredPermissions: readonly IPermissionValue[]
): boolean => {
  if (!requiredPermissions.length) return true;

  const cacheKey = getCacheKey(userPermissions, requiredPermissions, 'any');

  if (permissionCheckCache.has(cacheKey)) {
    return permissionCheckCache.get(cacheKey)!;
  }

  const result = requiredPermissions.some((permission) => userPermissions.includes(permission));
  permissionCheckCache.set(cacheKey, result);
  return result;
};

export const hasAllPermissions = (
  userPermissions: readonly string[],
  requiredPermissions: readonly IPermissionValue[]
): boolean => {
  if (!requiredPermissions.length) return true;

  const cacheKey = getCacheKey(userPermissions, requiredPermissions, 'all');

  if (permissionCheckCache.has(cacheKey)) {
    return permissionCheckCache.get(cacheKey)!;
  }

  const result = requiredPermissions.every((permission) => userPermissions.includes(permission));
  permissionCheckCache.set(cacheKey, result);
  return result;
};

// Helper function to get all permissions for a category
export const getCategoryPermissions = (
  category: IPermissionCategory
): readonly IPermissionValue[] => {
  return Object.values(PERMISSIONS[category]) as IPermissionValue[];
};

// Helper function to check if user has any permission in a category
export const hasAnyCategoryPermission = (
  userPermissions: readonly string[],
  category: IPermissionCategory
): boolean => {
  const categoryPermissions = getCategoryPermissions(category);
  return hasAnyPermission(userPermissions, categoryPermissions);
};

// Clear permission check cache (useful when permissions change)
export const clearPermissionCache = (): void => {
  permissionCheckCache.clear();
};
