import type { IPermissionValue } from '@/config/permission';
import { routeConfig } from '@/config/routeConfig';
import React, { lazy } from 'react';
import { protectedRoutes } from './protected.routes';
import { publicRoutes } from './public.routes';

const NotFound = lazy(() => import('@/pages/NotFound'));

type BaseRoute = {
  element?: React.ReactNode;
  title?: string;
  requiredPermissions?: readonly IPermissionValue[];
  children?: AppRoute[];
};

type PublicRoute = BaseRoute & {
  isPublic?: true;
  isProtected?: never;
};

type ProtectedRoute = BaseRoute & {
  isPublic?: never;
  isProtected?: true;
};

type BaseRouteWithAuth = PublicRoute | ProtectedRoute;

type LayoutRoute = BaseRouteWithAuth & {
  isLayout: true;
  path?: never;
  index?: never;
};

type PathRoute = BaseRouteWithAuth & {
  isLayout?: never;
  routePath?: string;
  index?: boolean;
};

export type AppRoute = LayoutRoute | PathRoute;

export const reactRoutes: AppRoute[] = [
  ...publicRoutes,
  ...protectedRoutes,
  {
    routePath: routeConfig.notFound.path(),
    element: React.createElement(NotFound),
    title: 'Not Found',
  },
];
