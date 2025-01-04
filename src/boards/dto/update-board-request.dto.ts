import { z } from 'zod';
import { createBoardSchema } from './create-board-request.dto';

export const updateBoardSchema = createBoardSchema
  .partial()
  // .strict() // Ensure no extra fields are allowed;
  .refine((data) => Object.values(data).some((value) => value !== undefined), {
    message: `At least one of the following fields must be provided: ${Object.keys(createBoardSchema.shape).join(', ')}`,
    // path: [], // General error path
  });

export type UpdateBoardRequestDto = z.infer<typeof updateBoardSchema>;
