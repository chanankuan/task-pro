import { z } from 'zod';
import { registerSchema } from './register-request.dto';

export const resetPasswordSchema = registerSchema
  .pick({ password: true })
  .extend({
    token: z.string().min(1),
  })
  .required()
  .strict(); // Ensure no extra fields are allowed

export type ResetPasswordDto = z.infer<typeof resetPasswordSchema>;
