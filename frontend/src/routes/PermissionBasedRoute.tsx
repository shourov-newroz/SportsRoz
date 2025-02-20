import type { IPermissionValue } from '@/config/permission';
import { hasAnyPermission } from '@/config/permission';
import { routeConfig } from '@/config/routeConfig';
import React from 'react';
import { Navigate } from 'react-router-dom';

interface PermissionBasedRouteProps {
  isAuthenticated: boolean;
  userPermissions: string[];
  requiredPermissions: readonly IPermissionValue[];
  children: React.ReactNode;
}

const PermissionBasedRoute: React.FC<PermissionBasedRouteProps> = ({
  isAuthenticated,
  userPermissions,
  requiredPermissions,
  children,
}) => {
  if (!isAuthenticated) {
    return <Navigate to={routeConfig.login.path()} replace />;
  }

  // If no permissions are specified, allow access to authenticated users
  if (requiredPermissions.length === 0) {
    return <>{children}</>;
  }

  // Check if user has any of the required permissions
  const hasAccess = hasAnyPermission(userPermissions, requiredPermissions);

  if (!hasAccess) {
    return <Navigate to={routeConfig.unauthorized.path()} replace />;
  }

  return <>{children}</>;
};

export default PermissionBasedRoute;
