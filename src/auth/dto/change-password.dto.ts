import { z } from 'zod';
import { registerSchema } from './register-request.dto';

export const changePasswordSchema = registerSchema
  .pick({ password: true })
  .extend({ oldPassword: z.string().min(1) })
  .required()
  .strict(); // Ensure no extra fields are allowed

export type ChangePasswordDto = z.infer<typeof changePasswordSchema>;
