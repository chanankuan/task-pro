import { z } from 'zod';
import { createCardSchema } from './create-card-request.dto';

export const updateCardSchema = createCardSchema
  .partial() // .strict() // Ensure no extra fields are allowed;
  .refine((data) => Object.values(data).some((value) => value !== undefined), {
    message: `At least one of the following fields must be provided: ${Object.keys(createCardSchema.shape).join(', ')}`,
    // path: [], // General error path
  });

export type UpdateCardRequestDto = z.infer<typeof updateCardSchema>;
