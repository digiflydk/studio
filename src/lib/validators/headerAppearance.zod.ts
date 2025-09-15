import { z } from "zod";

export const HslSchema = z.object({
  h: z.number().min(0).max(360),
  s: z.number().min(0).max(100),
  l: z.number().min(0).max(100),
});

export const HeaderAppearanceSchema = z.object({
  headerIsSticky: z.boolean().optional(),
  headerHeight: z.number().int().min(40).max(160).optional(),
  headerLogoWidth: z.number().int().min(40).max(480).optional(),
  headerInitialBackgroundColor: HslSchema.optional(),
  headerInitialBackgroundOpacity: z.number().min(0).max(100).optional(),
  headerScrolledBackgroundColor: HslSchema.optional(),
  headerScrolledBackgroundOpacity: z.number().min(0).max(100).optional(),
  headerLinkColor: z.string().optional(),
});

export type HeaderAppearanceInput = z.infer<typeof HeaderAppearanceSchema>;

export const headerAppearanceSchema = HeaderAppearanceSchema;

export default HeaderAppearanceSchema;
