import { routeConfig } from '@/config/routeConfig';
import React, { lazy } from 'react';
import type { AppRoute } from './routes';

const DashboardLayout = lazy(() => import('@/components/layouts/DashboardLayout'));
const Dashboard = lazy(() => import('@/pages/Dashboard'));
const ProfilePage = lazy(() => import('@/pages/Profile/ProfilePage'));
const RolesPage = lazy(() => import('@/pages/Admin/RolesPage'));
const PermissionsPage = lazy(() => import('@/pages/Admin/PermissionsPage'));
const AdminUserManagementPage = lazy(() => import('@/pages/Admin/AdminUserManagementPage'));
const AdminUserApprovalPage = lazy(() => import('@/pages/Admin/AdminUserApprovalPage'));

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
      {
        routePath: routeConfig.profile.routePath,
        element: React.createElement(ProfilePage),
        requiredPermissions: routeConfig.profile.requiredPermissions,
        isProtected: true,
      },
      {
        routePath: routeConfig.roles.routePath,
        element: React.createElement(RolesPage),
        requiredPermissions: routeConfig.roles.requiredPermissions,
        isProtected: true,
      },
      {
        routePath: routeConfig.permissions.routePath,
        element: React.createElement(PermissionsPage),
        requiredPermissions: routeConfig.permissions.requiredPermissions,
        isProtected: true,
      },
      {
        routePath: routeConfig.adminUserManagement.routePath,
        element: React.createElement(AdminUserManagementPage),
        requiredPermissions: routeConfig.adminUserManagement.requiredPermissions,
        isProtected: true,
      },
      {
        routePath: routeConfig.adminUserApproval.routePath,
        element: React.createElement(AdminUserApprovalPage),
        requiredPermissions: routeConfig.adminUserApproval.requiredPermissions,
        isProtected: true,
      },
    ],
  },
];
