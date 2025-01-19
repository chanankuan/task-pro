import { z } from 'zod';
import { registerSchema } from './register-request.dto';

export const forgotPasswordSchema = registerSchema
  .pick({ email: true })
  .required()
  .strict(); // Ensure no extra fields are allowed

export type ForgotPasswordDto = z.infer<typeof forgotPasswordSchema>;
