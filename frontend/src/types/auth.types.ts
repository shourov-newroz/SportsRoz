
export interface ITokenData {
  accessToken: string;
  refreshToken: string;
  accessTokenExpiresIn: number;
  refreshTokenExpiresIn: number;
}

export interface ILoginResponse {
  tokens: {
    accessToken: string;
    accessTokenExpiresIn: number;
    refreshToken: string;
    refreshTokenExpiresIn: number;
  };
  user: IAuthUser;
}

export interface IAuthUser {
  id: string;
  name: string;
  role: string;
  email: string;
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
  user: IAuthUser | null;
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

export interface ILoginData {
  email: string;
  password: string;
}

export interface IRegisterData {
  email: string;
  password: string;
  confirmPassword: string;
  name: string;
  officeId: string;
}

export interface IVerifyOTPData {
  email: string;
  otp: string;
}

export interface IForgotPasswordData {
  email: string;
}

export interface IResetPasswordData {
  token: string;
  password: string;
  confirmPassword: string;
}

export interface IVerifyResetPasswordTokenData {
  token: string;
}
