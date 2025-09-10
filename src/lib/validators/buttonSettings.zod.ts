
import { z } from 'zod';

export const buttonSettingsSchema = z.object({
  fontFamily: z.string().optional(),
  fontWeight: z.number().int().optional(),
  defaultVariant: z.string().optional(), // fx 'primary'
  defaultSize: z.string().optional(),    // fx 'md'
  defaultTextSize: z.number().int().optional(), // fx 16
  designType: z.string().optional(), // fx 'pill' | 'default'
  colors: z.object({
    primary: z.string().min(1),
    secondary: z.string().optional(),
    hover: z.string().optional(),
  }).partial({ secondary: true, hover: true }),
});
export type ButtonSettingsInput = z.infer<typeof buttonSettingsSchema>;
