import { z } from 'zod';

export const supportSchema = z
  .object({
    email: z.string().email(),
    description: z.string().min(1).max(1000),
  })
  .required()
  .strict();

export type SupportDto = z.infer<typeof supportSchema>;
