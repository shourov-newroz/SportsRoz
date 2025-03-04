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
    confirmPassword: z.string(),
    name: z.string().min(1, 'Full name is required'),
    officeId: z.string().min(1, 'Office ID is required'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ['confirmPassword'],
  });

export const loginSchema = z.object({
  body: z.object({
    email: z.string().regex(emailRegex, 'Invalid email format'),
    password: z.string().min(1, 'Password is required'),
  }),
});

export const updateUserSchema = z.object({
  name: z.string().min(1, 'Full name is required').optional(),
  jerseyName: z.string().optional(),
  sportType: z.array(z.string()).optional(),
  dateOfBirth: z
    .string()
    .transform((str) => new Date(str))
    .optional(),
  gender: z.enum(['male', 'female', 'other']).optional(),
  contactNumber: z.string().optional(),
  profilePicture: z.string().url('Invalid profile picture URL').optional(),
});
