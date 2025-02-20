import { IRequestMetaInfo } from '@/types/common';
import { z } from 'zod';

// Common password validation schema
export const passwordValidationSchema = z
  .string()
  .min(8, 'Password must be at least 8 characters')
  .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
  .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
  .regex(/[0-9]/, 'Password must contain at least one digit')
  .regex(/[@$!%*?&]/, 'Password must contain at least one special character');

// OTP validation schema
export const otpSchema = z.string().length(4, 'OTP must be 4 digits');

// Contact type schema
export const contactTypeSchema = z.enum(['email', 'mobile']);

// Forgot password schema
export const forgotPasswordSchema = z
  .object({
    type: contactTypeSchema,
    email: z.string().trim().toLowerCase().optional(),
    mobileNumber: z.string().trim().optional(),
  })
  .superRefine((data, ctx) => {
    if (data.type === 'email') {
      if (!data.email) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Email is required',
          path: ['email'],
        });
      } else if (!z.string().email().safeParse(data.email).success) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Please enter a valid email address',
          path: ['email'],
        });
      }
    } else {
      if (!data.mobileNumber) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Mobile number is required',
          path: ['mobileNumber'],
        });
      } else if (
        !z
          .string()
          .regex(/^\d{10}$/)
          .safeParse(data.mobileNumber).success
      ) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Phone number must be in 10 digits',
          path: ['mobileNumber'],
        });
      }
    }
  });

// Verify OTP schema
export const verifyOTPSchema = z.object({
  otp: otpSchema,
});

// Reset password schema
export const resetPasswordSchema = z
  .object({
    temporaryPassword: z
      .string()
      // .min(1, 'Temporary password is required')
      .optional(),
    password: passwordValidationSchema,
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ['confirmPassword'],
  });

// API Response Types
export type ForgotPasswordResponse = {
  data: {
    data: {
      token: string;
      expiryTime: number;
      intervalTime: number;
    };
  };
};

export type VerifyOTPResponse = {
  data: {
    data: {
      token: string;
    };
  };
};

export type ResetPasswordResponse = {
  data: {
    data: {
      message: string;
    };
  };
};

// Form Types
export type ForgotPasswordFormValues = z.infer<typeof forgotPasswordSchema>;
export type VerifyOTPFormValues = z.infer<typeof verifyOTPSchema>;
export type ResetPasswordFormValues = z.infer<typeof resetPasswordSchema>;

// Navigation State Types
export type VerifyOTPLocationState = {
  contactInfo: string;
  type: z.infer<typeof contactTypeSchema>;
};

export type ResetPasswordLocationState = VerifyOTPLocationState & {
  isVerified: boolean;
  otp: number;
  token: never;
};

// Request Payload Types
export type ForgotPasswordPayload = {
  metaInfo: IRequestMetaInfo;
  attributes: {
    email?: string;
    mobileNumber?: string;
  };
};

export type ResendOTPPayload = ForgotPasswordPayload;

export type VerifyOTPPayload = {
  metaInfo: IRequestMetaInfo;
  attributes: {
    // email?: string;
    // mobileNumber?: string;
    otp: number;
    token: string;
  };
};

export interface ResetPasswordPayloadBase {
  newPassword: string;
}

export interface ResetPasswordPayloadOTPMobile
  extends ResetPasswordPayloadBase {
  mobileNumber: string;
  otp: number;
  confirmNewPassword: string;
  email?: never;
  tempPassword?: never;
  token?: never;
}

export interface ResetPasswordPayloadOTPEmail extends ResetPasswordPayloadBase {
  email: string;
  otp: number;
  confirmNewPassword: string;
  mobileNumber?: never;
  tempPassword?: never;
  token?: never;
}

export interface ResetPasswordPayloadTempPassword {
  password: string;
  tempPassword: string;
  token: string;
  otp?: never;
  mobileNumber?: never;
  email?: never;
  confirmNewPassword?: never;
}

export type ResetPasswordPayload =
  | {
      metaInfo: IRequestMetaInfo;
      attributes: ResetPasswordPayloadOTPMobile | ResetPasswordPayloadOTPEmail;
    }
  | ResetPasswordPayloadTempPassword;
