import { z } from 'zod';

export const headerSettingsSchema = z.object({
  enabled: z.boolean(),
  label: z.string().min(1, { message: 'Label is required' }),
  linkType: z.enum(['internal','external']),
  href: z.string().min(1, { message: 'Link is required' }).refine(v => v.startsWith('#') || /^https?:\/\//.test(v), 'Href must be an anchor link (#) or a full URL (http/https)'),
  variant: z.enum(['default', 'destructive', 'outline', 'secondary', 'ghost', 'link', 'pill']),
  size: z.enum(['default', 'sm', 'lg', 'icon']),
  mobileFloating: z.object({
    enabled: z.boolean(),
    position: z.enum(['br','bl']),
    offsetX: z.number().int().min(0).optional(),
    offsetY: z.number().int().min(0).optional(),
  }),
});

export type HeaderSettingsInput = z.infer<typeof headerSettingsSchema>;
