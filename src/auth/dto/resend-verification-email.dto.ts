import { z } from 'zod';
import { registerSchema } from './register-request.dto';

export const resendVerificationEmailSchema = registerSchema
  .pick({ email: true })
  .required()
  .strict(); // Ensure no extra fields are allowed

export type ResendVerificationEmailDto = z.infer<
  typeof resendVerificationEmailSchema
>;
