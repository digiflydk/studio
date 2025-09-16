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

// Tolerér "a" (0..1) fra visse color pickers
const ColorAny = z.union([ColorHex, ColorHsl, z.object({
  h: z.number(),
  s: z.number(),
  l: z.number(),
  a: z.number().min(0).max(1),
})]);

const Border = z.object({
  visible: z.boolean().optional(),
  widthPx: z.number().int().min(0).max(8).optional(),
  color: ColorAny.optional(),
});

const NavLink = z.object({ label: z.string(), href: z.string() });

export const HeaderAppearanceSchema = z.object({
  isOverlay: z.boolean().optional(),
  headerIsSticky: z.boolean().optional(),
  headerHeight: z.number().int().min(40).max(160).optional(),
  headerLogoWidth: z.number().int().min(40).max(480).optional(),
  headerLinkColor: z.string().optional(),
  topBg: ColorAny.optional(),
  scrolledBg: ColorAny.optional(),
  border: Border.optional(),
  navLinks: z.array(NavLink).optional(),
});

export type HeaderAppearanceInput = z.infer<typeof HeaderAppearanceSchema>;
export default HeaderAppearanceSchema;
