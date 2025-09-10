import { z } from 'zod';

export const headerSettingsSchema = z.object({
  enabled: z.boolean(),
  label: z.string().min(1, { message: 'Label is required' }),
  linkType: z.enum(['internal','external']),
  href: z.string()
    .min(1, { message: 'Link is required' })
    .refine(v => v.startsWith('#') || /^https?:\/\//i.test(v), {
      message: 'Href must be an anchor link (#) or a full URL (http/https)',
    }),
  variant: z.enum(['default', 'destructive', 'outline', 'secondary', 'ghost', 'link', 'pill']).default('default'),
  size: z.enum(['default', 'sm', 'lg', 'icon']).default('default'),
  mobileFloating: z.object({
    enabled: z.boolean(),
    position: z.enum(['br','bl']).default('br'),
    offsetX: z.number().int().min(0).optional(),
    offsetY: z.number().int().min(0).optional(),
  }),
  version: z.number().optional(),
});

export type HeaderCTASettings = z.infer<typeof headerSettingsSchema>;
