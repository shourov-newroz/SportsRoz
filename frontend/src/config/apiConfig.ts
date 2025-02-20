import BACKEND_ENDPOINTS from '@/api/endpoints';
import { authService } from '@/utils/authService';
import axios, {
  AxiosError,
  AxiosResponse,
  InternalAxiosRequestConfig,
} from 'axios';
import { BACKEND_BASE_URL } from './config';

// Create axios instance
const api = axios.create({
  baseURL: BACKEND_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor
api.interceptors.request.use(async (config: InternalAxiosRequestConfig) => {
  const { accessToken, refreshToken, expiresAt } =
    authService.getTokenDetails();

  // Skip token logic if tokens are missing (public APIs) or if the request is for refreshing token
  if (
    !accessToken ||
    !refreshToken ||
    config.url === BACKEND_ENDPOINTS.AUTH.REFRESH_TOKEN
  ) {
    return config;
  }

  // Check if token needs refreshing
  if (authService.isTokenExpired(expiresAt)) {
    try {
      const { access_token } = await authService.refreshToken();
      config.headers.Authorization = `Bearer ${access_token}`;
      return config;
    } catch (error) {
      return Promise.reject(error);
    }
  }

  // Add token to request if available
  if (accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`;
  }

  return config;
});

// Response interceptor
api.interceptors.response.use(
  (response: AxiosResponse) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config;

    // If tokens are missing, reject the request (skip retrying)
    const { accessToken, refreshToken } = authService.getTokenDetails();
    if (
      !originalRequest ||
      !accessToken ||
      !refreshToken ||
      originalRequest.url === BACKEND_ENDPOINTS.AUTH.REFRESH_TOKEN
    ) {
      return Promise.reject(error);
    }

    // Handle 401 errors
    if (error.response?.status === 401) {
      const errorMessage = error.response?.data || '';

      // Handle invalid access/refresh token before expiry
      if (
        errorMessage === 'invalid_token' ||
        errorMessage === 'token_revoked'
      ) {
        authService.logout(); // Clear tokens and redirect to login
        return Promise.reject(
          new Error('Session expired. Please log in again.')
        );
      }

      try {
        const { access_token } = await authService.refreshToken();
        if (originalRequest.headers) {
          originalRequest.headers.Authorization = `Bearer ${access_token}`;
        }
        return api(originalRequest);
      } catch (refreshError) {
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default api;
