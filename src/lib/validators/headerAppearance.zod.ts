import { z } from "zod";

const HexColor = z.string().regex(/^#([0-9A-Fa-f]{3}|[0-9A-Fa-f]{6})$/);

const ColorHex = z.object({
  hex: HexColor,
  opacity: z.number().min(0).max(100).optional(),
});

const ColorHsl = z.object({
  h: z.number().min(0).max(360),
  s: z.number().min(0).max(100),
  l: z.number().min(0).max(100),
  opacity: z.number().min(0).max(100).optional(),
});

const AnyColor = z.union([ColorHex, ColorHsl]);

const Border = z.object({
  enabled: z.boolean().optional(),
  width: z.number().int().min(0).max(8).optional(),
  color: AnyColor.optional(),
});

export const HeaderAppearanceSchema = z.object({
  isOverlay: z.boolean().optional(),
  headerIsSticky: z.boolean().optional(),
  headerHeight: z.number().int().min(40).max(160).optional(),
  headerLogoWidth: z.number().int().min(40).max(480).optional(),
  headerLinkColor: z.string().optional(),
  topBg: AnyColor.optional(),
  scrolledBg: AnyColor.optional(),
  border: Border.optional(),
  navLinks: z.array(z.object({ label: z.string(), href: z.string() })).optional(),
});

export type HeaderAppearanceInput = z.infer<typeof HeaderAppearanceSchema>;

export default HeaderAppearanceSchema;
