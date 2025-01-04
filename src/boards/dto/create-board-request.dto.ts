import { z } from 'zod';

export const createBoardSchema = z
  .object({
    title: z.string().min(1).max(255),
    bgName: z.string().min(1),
    iconId: z.string().transform((val, ctx) => {
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

      if (parsed < 0 || parsed > 7) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Must be between 0 and 7',
        });
        return z.NEVER;
      }
      return parsed;
    }),
  })
  .required()
  .strict(); // Ensure no extra fields are allowed;

export type CreateBoardRequestDto = z.infer<typeof createBoardSchema>;
