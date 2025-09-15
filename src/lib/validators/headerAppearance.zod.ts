import { z } from "zod";

export const HslaSchema = z.object({
  h: z.number().min(0).max(360),
  s: z.number().min(0).max(100),
  l: z.number().min(0).max(100),
  opacity: z.number().min(0).max(100).optional(),
});

export const HeaderAppearanceSchema = z.object({
  headerIsSticky: z.boolean().optional(),
  headerHeight: z.number().int().min(40).max(160).optional(),
  headerLogoWidth: z.number().int().min(40).max(480).optional(),
  headerInitialBackgroundColor: HslaSchema.optional(),
  headerInitialBackgroundOpacity: z.number().min(0).max(100).optional(),
  headerScrolledBackgroundColor: HslaSchema.optional(),
  headerScrolledBackgroundOpacity: z.number().min(0).max(100).optional(),
  headerLinkColor: z.string().optional(),
});

export type HeaderAppearanceInput = z.infer<typeof HeaderAppearanceSchema>;

// Navngivet export i lille bogstav for bagudkompatibilitet
export const headerAppearanceSchema = HeaderAppearanceSchema;

// Default export for standard-import
export default HeaderAppearanceSchema;
