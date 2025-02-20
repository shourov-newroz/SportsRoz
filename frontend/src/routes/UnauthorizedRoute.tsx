import { routeConfig } from '@/config/routeConfig';
import React from 'react';
import { Navigate } from 'react-router-dom';

interface UnauthorizedRouteProps {
  isAuthenticated: boolean;
  children: React.ReactNode;
}

/**
 * A route component that only allows access to unauthorized users.
 * If a user is authenticated, they will be redirected to the dashboard.
 */
const UnauthorizedRoute: React.FC<UnauthorizedRouteProps> = ({
  isAuthenticated,
  children,
}) => {
  if (isAuthenticated) {
    return <Navigate to={routeConfig.dashboard.path()} replace />;
  }

  return <>{children}</>;
};

export default UnauthorizedRoute;
