export const BACKEND_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || 'http://3.253.31.137:8085';
export const CLIENT_ID = import.meta.env.VITE_API_CLIENT_ID || 'mobile-app';
export const CLIENT_SECRET =
  import.meta.env.VITE_API_CLIENT_SECRET || '1kfwIxOSyWfcSnrcSpFeRdX0j2kAYasi';

export const ERROR_CLASS = 'input_error';

export const LOCAL_STORAGE_KEYS = {
  ACCESS_TOKEN: 'access_token',
  REFRESH_TOKEN: 'refresh_token',
  TOKEN_EXPIRY: 'token_expiry',
  REFRESH_EXPIRY: 'refresh_expiry',
  USER: 'user',
  TEMP_USER: 'temp_user',
  TEMP_TOKEN: 'temp_token',
  PARTNER_FORM_STORAGE_KEY: 'partner_form_data',
} as const;

export const OTP_STORAGE_KEYS = {
  OTP_TOKEN_KEY: 'otp_token_key',
  OTP_EXPIRY_KEY: 'otp_expiry_key',
  OTP_INTERVAL_KEY: 'otp_interval_key',
  OTP_EXPIRY_TIMESTAMP_KEY: 'otp_expiry_timestamp_key',
  OTP_INTERVAL_TIMESTAMP_KEY: 'otp_interval_timestamp_key',
} as const;

export type LocalStorageKey = keyof typeof LOCAL_STORAGE_KEYS;

