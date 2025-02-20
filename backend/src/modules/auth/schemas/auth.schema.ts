import { z } from 'zod';

// Password validation regex
const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,}$/;

// Email validation regex
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const registerSchema = z
  .object({
    email: z.string().email('Invalid email format'),
    password: z
      .string()
      .regex(
        passwordRegex,
        'Password must be at least 8 characters and contain at least one uppercase letter, one lowercase letter, one number, and one special character',
      ),
    password_confirmation: z.string(),
    full_name: z.string().min(1, 'Full name is required'),
    office_id: z.string().min(1, 'Office ID is required'),
  })
  .refine((data) => data.password === data.password_confirmation, {
    message: "Passwords don't match",
    path: ['password_confirmation'],
  });

export const loginSchema = z.object({
  body: z.object({
    email: z.string().regex(emailRegex, 'Invalid email format'),
    password: z.string().min(1, 'Password is required'),
  }),
});
