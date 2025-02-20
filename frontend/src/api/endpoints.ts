// /api/endpoints.ts

const BACKEND_ENDPOINTS = {
  AUTH: {
    LOGIN: '/auth/login',
    REGISTER: '/public/auth/register',
    FORGOT_PASSWORD: '/auth/forgot-password',
    RESET_PASSWORD: '/auth/reset-password',
    VERIFY_EMAIL: '/auth/verify-email',
    RESEND_VERIFICATION_EMAIL: '/auth/resend-verification-email',
    VERIFY_RESET_PASSWORD_TOKEN: '/auth/verify-reset-password-token',
    refreshToken: '/auth/refresh-token',
  },
};

export default BACKEND_ENDPOINTS;
