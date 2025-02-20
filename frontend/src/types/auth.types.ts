import { IPermissionValue } from '@/config/permission';

export interface ITokenData {
  accessToken: string;
  refreshToken: string;
  accessTokenExpiresIn: number;
  refreshTokenExpiresIn: number;
}

export interface ILoginResponse {
  data: ITokenData;
  type: IUserType;
  role: string;
  permissions: string[];
}

export interface IUser {
  // id: string;
  email: string;
  name: string;
  type: IUserType;
  permissions: IPermissionValue[];
  accessToken: string;
  refreshToken: string;
  accessTokenExpiresIn: number;
  refreshTokenExpiresIn: number;
}

export const AUTH_STATUS = {
  AUTHENTICATED: 'AUTHENTICATED',
  UNAUTHENTICATED: 'UNAUTHENTICATED',
  LOADING: 'LOADING',
} as const;

export type IAuthStatus = (typeof AUTH_STATUS)[keyof typeof AUTH_STATUS];

export const USER_TYPES = {
  SYSTEM_ADMIN: 'System Admin',
} as const;

export type IUserType = (typeof USER_TYPES)[keyof typeof USER_TYPES];

export interface IAuthState {
  user: IUser | null;
  status: IAuthStatus;
  userPermissions: string[];
  isInitialized: boolean;
  isLoading: boolean;
  error: string | null;
}

export interface IRefreshTokenResponse {
  data: ITokenData;
}

export interface ILoginCredentials {
  email: string;
  password: string;
}

export interface IRegistrationData extends ILoginCredentials {
  name: string;
  role?: IUserType;
}

export interface IAuthError {
  message: string;
  code?: string;
  status?: number;
}
