// /api/endpoints.ts

const BACKEND_ENDPOINTS = {
  USERS: {
    GET_PROFILE: (id: string) => `/users/${id}`,
    UPDATE_PROFILE: (id: string) => `/users/${id}`,
  },
  AUTH: {
    LOGIN: '/public/auth/login',
    REGISTER: '/public/auth/register',
    RESEND_OTP: '/public/auth/resend-otp',
    FORGOT_PASSWORD: '/public/auth/forgot-password',
    RESET_PASSWORD: '/public/auth/reset-password',
    VERIFY_EMAIL: '/public/auth/verify-email',
    RESEND_VERIFICATION_EMAIL: '/public/auth/resend-verification-email',
    VERIFY_RESET_PASSWORD_TOKEN: '/public/auth/verify-reset-password-token',
    VERIFY_OTP: '/public/auth/verify-otp',
    refreshToken: '/public/auth/refresh-token',
  },
  ROLES: {
    CREATE: '/roles',
    GET_ALL: '/roles',
    UPDATE: (id: string) => `/roles/${id}`,
  },
  PERMISSIONS: {
    GET_ALL: '/permissions',
  },
};

export default BACKEND_ENDPOINTS;
