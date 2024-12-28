import { z } from 'zod';

export const registerSchema = z
  .object({
    name: z.string(),
    email: z.string().email(),
    password: z
      .string()
      .min(8, { message: 'Password must be at least 8 characters long' }) // Minimum length
      .regex(/[A-Z]/, {
        message: 'Password must contain at least one uppercase letter',
      }) // At least one uppercase
      .regex(/[a-z]/, {
        message: 'Password must contain at least one lowercase letter',
      }) // At least one lowercase
      .regex(/\d/, { message: 'Password must contain at least one number' }) // At least one number
      .regex(/[!@#$%^&*(),.?":{}|<>-]/, {
        message: 'Password must contain at least one special character',
      }), // At least one special character,
  })
  .required();

export type RegisterRequestDto = z.infer<typeof registerSchema>;
