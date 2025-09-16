import { z } from "zod";

const ColorHexSchema = z.object({
  hex: z.string().regex(/^#([0-9A-Fa-f]{3}|[0-9A-Fa-f]{6})$/),
  opacity: z.number().min(0).max(100).optional(),
});

const ColorHslSchema = z.object({
  h: z.number().min(0).max(360),
  s: z.number().min(0).max(100),
  l: z.number().min(0).max(100),
  opacity: z.number().min(0).max(100).optional(),
});

const ColorSchema = z.union([ColorHexSchema, ColorHslSchema]);

const BorderSchema = z.object({
  visible: z.boolean().optional(),
  widthPx: z.number().int().min(0).max(8).optional(),
  color: ColorSchema.optional(),
});

export const HeaderAppearanceSchema = z.object({
  isOverlay: z.boolean().optional(),
  headerIsSticky: z.boolean().optional(),
  headerHeight: z.number().int().min(40).max(160).optional(),
  headerLogoWidth: z.number().int().min(40).max(480).optional(),
  headerLinkColor: z.string().optional(),
  topBg: ColorSchema.optional(),
  scrolledBg: ColorSchema.optional(),
  headerInitialBackgroundColor: ColorHslSchema.optional(),
  headerInitialBackgroundOpacity: z.number().min(0).max(100).optional(),
  headerScrolledBackgroundColor: ColorHslSchema.optional(),
  headerScrolledBackgroundOpacity: z.number().min(0).max(100).optional(),
  border: BorderSchema.optional(),
});

export type HeaderAppearanceInput = z.infer<typeof HeaderAppearanceSchema>;

export default HeaderAppearanceSchema;
