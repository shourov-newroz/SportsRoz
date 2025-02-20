import ErrorBoundary from '@/components/ErrorBoundary';
import useAuth from '@/hooks/useAuth';
import React, { Suspense } from 'react';
import { Route, Routes } from 'react-router-dom';
import PermissionBasedRoute from './PermissionBasedRoute';
import UnauthorizedRoute from './UnauthorizedRoute';
import { AppRoute, reactRoutes } from './routes';

export const LoadingFallback = () => (
  <div className="flex justify-center items-center h-screen">
    <div className="w-8 h-8 rounded-full border-t-2 border-b-2 animate-spin border-primary"></div>
  </div>
);

const AppRoutes: React.FC = () => {
  const { status, userPermissions } = useAuth();
  const isAuthenticated = status === 'AUTHENTICATED';

  const renderRouteElement = (route: AppRoute) => {
    let element;

    if (route.isProtected) {
      // Protected routes
      element = (
        <PermissionBasedRoute
          isAuthenticated={isAuthenticated}
          userPermissions={userPermissions}
          requiredPermissions={route.requiredPermissions || []}
        >
          {route.element}
        </PermissionBasedRoute>
      );
    } else if (route.isPublic) {
      // Public routes that should redirect to dashboard if authenticated
      element = (
        <UnauthorizedRoute isAuthenticated={isAuthenticated}>{route.element}</UnauthorizedRoute>
      );
    } else {
      // Regular public routes
      element = route.element;
    }

    return <Suspense fallback={<LoadingFallback />}>{element}</Suspense>;
  };

  const renderRoutes = (routes: AppRoute[]) => {
    return routes.map((route) => {
      // For layout routes, we want to render the layout element with its children
      if (route.isLayout) {
        return (
          <Route key={'layout'} element={renderRouteElement(route)}>
            {route.children && renderRoutes(route.children)}
          </Route>
        );
      }

      // For index routes
      if (route.index) {
        return <Route key="index" index element={renderRouteElement(route)} />;
      }

      // For regular routes
      return (
        <Route key={route.routePath} path={route.routePath} element={renderRouteElement(route)}>
          {route.children && renderRoutes(route.children)}
        </Route>
      );
    });
  };

  return (
    <ErrorBoundary>
      <Routes>{renderRoutes(reactRoutes)}</Routes>
    </ErrorBoundary>
  );
};

export default AppRoutes;
