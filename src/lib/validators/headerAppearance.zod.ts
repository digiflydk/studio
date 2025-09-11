
import { z } from "zod";

const hsl = z.object({
  h: z.number().min(0).max(360),
  s: z.number().min(0).max(100),
  l: z.number().min(0).max(100),
});

export const headerAppearanceSchema = z.object({
  headerHeight: z.number().int().min(40).max(160).optional(),
  headerLogoWidth: z.number().int().min(60).max(320).optional(),

  // Border (bundlinje – vi bruger eksisterende felter)
  headerTopBorderEnabled: z.boolean().optional(),
  headerTopBorderHeight: z.number().int().min(0).max(8).optional(),
  headerTopBorderColor: hsl.optional(),

  // Normal (initial) background
  headerInitialBackgroundColor: hsl.optional(),
  headerInitialBackgroundOpacity: z.number().min(0).max(100).optional(),

  // Scrolled background (beholdes også her)
  headerScrolledBackgroundColor: hsl.optional(),
  headerScrolledBackgroundOpacity: z.number().min(0).max(100).optional(),
  
  headerNavLinks: z.array(z.object({
    label: z.string(),
    href: z.string(),
  })).optional(),

  version: z.number().optional(),
});
export type HeaderAppearanceInput = z.infer<typeof headerAppearanceSchema>;
