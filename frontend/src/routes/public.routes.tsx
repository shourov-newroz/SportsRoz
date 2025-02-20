import { routeConfig } from '@/config/routeConfig';
import React, { lazy } from 'react';
import type { AppRoute } from './routes';

const PublicLayout = lazy(() => import('@/components/layouts/PublicLayout'));
const AuthLayout = lazy(() => import('@/components/layouts/AuthLayout'));

const Unauthorized = lazy(() => import('@/pages/Unauthorized'));
const Login = lazy(() => import('@/pages/auth/LoginPage'));
const Register = lazy(() => import('@/pages/auth/RegisterPage'));

export const publicRoutes: AppRoute[] = [
  {
    element: React.createElement(PublicLayout),
    isLayout: true,
    children: [
      {
        routePath: routeConfig.unauthorized.routePath,
        element: React.createElement(Unauthorized),
      },
    ],
  },
  {
    element: React.createElement(AuthLayout),
    isLayout: true,
    children: [
      {
        routePath: routeConfig.register.routePath,
        element: React.createElement(Register),
        isPublic: true,
      },
      {
        routePath: routeConfig.login.routePath,
        element: React.createElement(Login),
        isPublic: true,
      },
    ],
  },
];
