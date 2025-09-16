import { z } from "zod";

// Helper: coerce number (accept både string og number)
const zNum = z.coerce.number();

// Border: acceptér både enabled/visible og widthPx/width
const BorderSchema = z.object({
  enabled: z.boolean().optional(),
  visible: z.boolean().optional(),         // legacy
  widthPx: zNum.optional(),
  width: zNum.optional(),                  // legacy
  color: z.object({
    h: zNum.default(220),
    s: zNum.default(13),
    l: zNum.default(91),
  }).default({ h: 220, s: 13, l: 91 }),
}).transform((b) => ({
  enabled: typeof b.enabled === "boolean" ? b.enabled : !!b.visible,
  widthPx: typeof b.widthPx === "number" ? b.widthPx : (typeof b.width === "number" ? b.width : 1),
  color: b.color,
}));

const BgPart = z.object({
  h: zNum.default(0),
  s: zNum.default(0),
  l: zNum.default(100),
  opacity: zNum.default(0),
});

export const HeaderAppearanceSchema = z.object({
  // Nye felter
  isOverlay: z.boolean().optional(),
  headerIsSticky: z.boolean().optional(),
  headerHeight: zNum.optional(),
  headerLogoWidth: zNum.optional(),
  headerLinkColor: z.string().default("white"),
  link: z.object({ color: z.string().optional(), hex: z.string().optional() }).partial().optional(),

  border: BorderSchema.optional(),

  // Legacy aliaser
  overlay: z.boolean().optional(),
  sticky: z.boolean().optional(),
  height: zNum.optional(),
  logo: z.object({ maxWidth: zNum.optional() }).partial().optional(),

  topBg: BgPart.default({ h: 0, s: 0, l: 100, opacity: 0 }),
  scrolledBg: BgPart.default({ h: 210, s: 100, l: 95, opacity: 98 }),

  navLinks: z.array(z.any()).default([]),
}).transform((a) => {
  const linkColor = a.headerLinkColor ?? a.link?.color ?? a.link?.hex ?? "white";
  return {
    isOverlay: typeof a.isOverlay === "boolean" ? a.isOverlay : !!a.overlay,
    headerIsSticky: typeof a.headerIsSticky === "boolean" ? a.headerIsSticky : !!a.sticky,
    headerHeight: typeof a.headerHeight === "number" ? a.headerHeight : (typeof a.height === "number" ? a.height : 72),
    headerLogoWidth: typeof a.headerLogoWidth === "number" ? a.headerLogoWidth : (a.logo?.maxWidth ?? 140),
    headerLinkColor: linkColor,
    border: a.border ?? { enabled: false, widthPx: 1, color: { h: 220, s: 13, l: 91 } },
    topBg: a.topBg,
    scrolledBg: a.scrolledBg,
    navLinks: Array.isArray(a.navLinks) ? a.navLinks : [],
  };
});

// Top-level: acceptér { appearance: {...} } ELLER fladt objekt {...}
export const SavePayloadSchema = z.union([
  z.object({ appearance: HeaderAppearanceSchema }),
  HeaderAppearanceSchema.transform((appearance) => ({ appearance })),
]);