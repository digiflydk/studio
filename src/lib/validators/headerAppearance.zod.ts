import { z } from "zod";

const clamp01 = (n: number) => (n < 0 ? 0 : n > 1 ? 1 : n);
const toUnit = (v: unknown) => {
  if (typeof v !== "number") return 0;
  if (v > 1 && v <= 100) return clamp01(v / 100);
  return clamp01(v);
};

export const HslSchema = z.object({
  h: z.number().min(0).max(360),
  s: z.number().min(0).max(100),
  l: z.number().min(0).max(100),
});

export const HslaSchema = HslSchema.extend({
  opacity: z.preprocess(toUnit, z.number().min(0).max(1)),
});

export const BorderSchema = z.object({
  enabled: z.boolean().optional(),
  width: z.number().int().min(0).max(8).optional(),
  color: HslSchema.optional(),
});

export const NavLinkSchema = z.object({
  label: z.string(),
  href: z.string(),
});

export const HeaderAppearanceSchema = z.object({
  overlay: z.boolean().optional(),
  sticky: z.boolean().optional(),
  height: z.number().int().min(40).max(160).optional(),
  logo: z.object({
    maxWidth: z.number().int().min(40).max(360).optional(),
  }).optional(),
  linkColor: z.enum(["white", "black", "primary", "secondary"]).optional(),
  border: BorderSchema.optional(),
  bg: z.object({
    initial: HslaSchema.optional(),
    scrolled: HslaSchema.optional(),
  }).optional(),
  navLinks: z.array(NavLinkSchema).optional(),
});

export type HeaderAppearanceInput = z.infer<typeof HeaderAppearanceSchema>;
