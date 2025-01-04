import { z } from 'zod';

export const loginSchema = z
  .object({
    email: z.string().email(),
    password: z.string(),
  })
  .required()
  .strict(); // Ensure no extra fields are allowed

export type LoginRequestDto = z.infer<typeof loginSchema>;
