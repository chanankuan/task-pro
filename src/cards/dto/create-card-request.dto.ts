import { z } from 'zod';
import { Priority } from '../interfaces';

export const createCardSchema = z
  .object({
    title: z.string().min(1).max(255),
    description: z.string().min(1).max(1000),
    deadline: z.string().date(),
    priority: z.nativeEnum(Priority),
    columnId: z.string().transform((val, ctx) => {
      // Transform to integer
      const parsed = parseInt(val);
      if (isNaN(parsed)) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Not a number',
        });

        // This is a special symbol you can use to
        // return early from the transform function.
        // It has type `never` so it does not affect the
        // inferred return type.
        return z.NEVER;
      }

      return parsed;
    }),
  })
  .required()
  .strict(); // Ensure no extra fields are allowed

export type CreateCardRequestDto = z.infer<typeof createCardSchema>;
