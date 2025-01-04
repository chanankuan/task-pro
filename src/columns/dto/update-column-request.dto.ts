import { z } from 'zod';
import { createColumnSchema } from './create-column-request.dto';

export const updateColumnSchema = createColumnSchema.pick({ title: true });

export type UpdateColumnRequestDto = z.infer<typeof updateColumnSchema>;
