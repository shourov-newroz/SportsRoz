import { hasAllPermissions, IPermissionValue } from '@/config/permission';
import useAuth from '@/hooks/useAuth';
import React from 'react';

// UI Permission Components
interface PermissionElementProps {
  children: React.ReactNode;
  requiredPermissions: IPermissionValue[];
  fallback?: React.ReactNode;
}

export const PermissionElement: React.FC<PermissionElementProps> = ({
  children,
  requiredPermissions,
  fallback = null,
}) => {
  const { user } = useAuth();

  if (!user?.permissions || !requiredPermissions?.length) {
    return null;
  }

  const hasAccess = hasAllPermissions(user.permissions, requiredPermissions);

  return hasAccess ? <>{children}</> : <>{fallback}</>;
};
