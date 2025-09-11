
import { z } from "zod";

const hslSchema = z.object({
  h: z.number().min(0).max(360),
  s: z.number().min(0).max(100),
  l: z.number().min(0).max(100),
});

const backgroundSchema = z.object({
    h: z.number().min(0).max(360).optional(),
    s: z.number().min(0).max(100).optional(),
    l: z.number().min(0).max(100).optional(),
    opacity: z.number().min(0).max(1).optional(),
}).partial();

export const headerAppearanceSchema = z.object({
  height: z.number().int().min(40).max(160).optional(),
  logo: z.object({
      maxWidth: z.number().int().min(60).max(320).optional(),
  }).optional(),
  border: z.object({
      enabled: z.boolean().optional(),
      width: z.number().int().min(0).max(8).optional(),
      color: hslSchema.optional(),
  }).optional(),
  bg: z.object({
    initial: backgroundSchema.optional(),
    scrolled: backgroundSchema.optional(),
  }).optional(),
  navLinks: z.array(z.object({
    label: z.string(),
    href: z.string(),
  })).optional(),
  version: z.number().optional(),
});

export type HeaderAppearanceInput = z.infer<typeof headerAppearanceSchema>;
