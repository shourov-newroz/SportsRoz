import { z } from 'zod';

// OTP verification schema
export const verifyOTPSchema = z.object({
  otp: z.string().length(6, 'OTP must be 6 digits').regex(/^\d+$/, 'OTP must be numeric'),
});

export type VerifyOTPFormValues = z.infer<typeof verifyOTPSchema>;

export interface VerifyOTPPayload {
  token: string;
  otp: string;
}

export interface VerifyOTPResponse {
  message: string;
  data: {
    token: string;
    expiryTime: number;
    intervalTime: number;
  };
}

export interface VerifyOTPLocationState {
  token: string;
  expiryTime: number;
  intervalTime: number;
}

export interface ResendOTPPayload {
  email: string;
}

export interface OTPResponse {
  token: string;
  expiryTime: number;
  intervalTime: number;
}

export interface ResendOTPLocationState {
  token: string;
  expiryTime: number;
  intervalTime: number;
}

export interface ForgotPasswordPayload {
  email: string;
}
