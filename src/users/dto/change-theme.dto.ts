import { Theme } from '../interfaces';
import { z } from 'zod';

export const changeThemeSchema = z.object({
  theme: z.nativeEnum(Theme),
});

export type ChangeThemeDto = z.infer<typeof changeThemeSchema>;
