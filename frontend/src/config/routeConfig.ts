import { DashboardOutlined, HomeOutlined, UserOutlined } from '@ant-design/icons';

// interface RouteConfig {
//   routePath: string;
//   path: (id?: string) => string;
//   title: string;
//   icon?: React.ElementType;
//   requiredPermissions?: IPermissionValue[];
//   isPublic?: boolean;
// }

// Main route configuration
export const routeConfig = {
  unauthorized: {
    routePath: '/unauthorized',
    path: () => '/unauthorized',
    title: 'Unauthorized',
    isPublic: true,
  },
  register: {
    routePath: '/register',
    path: () => '/register',
    title: 'Register',
    isPublic: true,
  },
  login: {
    routePath: '/login',
    path: () => '/login',
    title: 'Login',
    isPublic: true,
  },
  forgotPassword: {
    routePath: '/forgot-password',
    path: () => '/forgot-password',
    title: 'Forgot Password',
    isPublic: true,
  },
  verifyOTP: {
    routePath: '/otp-verify',
    path: () => '/otp-verify',
    title: 'OTP Verification',
    isPublic: true,
  },
  resetPassword: {
    routePath: '/reset-password',
    path: () => '/reset-password',
    title: 'Reset Password',
    isPublic: true,
  },

  // Dashboard Route
  dashboard: {
    routePath: '/dashboard',
    path: () => '/dashboard',
    title: 'Dashboard',
    icon: DashboardOutlined,
    requiredPermissions: [],
  },

  // Home Route
  home: {
    routePath: '/',
    path: () => '/',
    title: 'Home',
    icon: HomeOutlined,
    requiredPermissions: [],
  },

  profile: {
    routePath: '/profile',
    path: () => '/profile',
    title: 'Profile',
    icon: UserOutlined,
    requiredPermissions: [],
  },

  // Not Found Route
  notFound: {
    routePath: '*',
    path: () => '*',
    title: 'Not Found',
    isPublic: true,
  },
};
