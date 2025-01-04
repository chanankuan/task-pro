import { z } from 'zod';

export const createColumnSchema = z
  .object({
    title: z.string().min(1).max(255),
    boardId: z.string().transform((val, ctx) => {
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

export type CreateColumnRequestDto = z.infer<typeof createColumnSchema>;
