import { routeConfig } from '@/config/routeConfig';
import React, { lazy } from 'react';
import type { AppRoute } from './routes';

const DashboardLayout = lazy(() => import('@/components/layouts/DashboardLayout'));
const Dashboard = lazy(() => import('@/pages/Dashboard'));

export const protectedRoutes: AppRoute[] = [
  {
    element: React.createElement(DashboardLayout),
    isProtected: true,
    children: [
      {
        routePath: routeConfig.dashboard.routePath,
        element: React.createElement(Dashboard),
        requiredPermissions: routeConfig.dashboard.requiredPermissions,
        isProtected: true,
      },
    ],
  },
];
