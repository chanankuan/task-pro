import { registerSchema } from 'src/auth/dto';
import { z } from 'zod';

export const updateProfileSchema = registerSchema
  .partial()
  .strict() // Ensure no extra fields are allowed;
  .refine((data) => Object.values(data).some((value) => value !== undefined), {
    message: `At least one of the following fields must be provided: ${Object.keys(registerSchema.shape).join(', ')}`,
    // path: [], // General error path
  });

export type UpdateProfileDto = z.infer<typeof updateProfileSchema>;
