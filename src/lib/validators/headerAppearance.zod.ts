import { z } from "zod";

// Helper: coerce number (accept både string og number)
const zNum = z.coerce.number();

// Acceptér simple hex-strenge som "#RRGGBB" eller "#RRGGBBAA" eller "#RGB"
const zHex = z.string().regex(/^#([0-9A-Fa-f]{3}|[0-9A-Fa-f]{6}|[0-9A-Fa-f]{8})$/, { message: "Invalid hex color" }).optional();


const BorderSchema = z.object({
  enabled: z.boolean().optional(),
  visible: z.boolean().optional(),
  widthPx: zNum.optional(),
  width: zNum.optional(),
  colorHex: zHex,
  color: z.object({
    h: zNum.default(220),
    s: zNum.default(13),
    l: zNum.default(91),
  }).default({ h: 220, s: 13, l: 91 }),
}).transform((b) => ({
  enabled: typeof b.enabled === "boolean" ? b.enabled : !!b.visible,
  widthPx: typeof b.widthPx === "number" ? b.widthPx : (typeof b.width === "number" ? b.width : 1),
  colorHex: b.colorHex, // kan være undefined
  color: b.color,
}));

const BgPart = z.object({
  h: zNum.default(0),
  s: zNum.default(0),
  l: zNum.default(100),
  opacity: zNum.default(0),
  hex: zHex,
});

export const HeaderAppearanceSchema = z.object({
  isOverlay: z.boolean().optional(),
  headerIsSticky: z.boolean().optional(),
  headerHeight: zNum.optional(),
  headerLogoWidth: zNum.optional(),

  // Link color – både tekst og hex
  headerLinkColor: z.string().default("white"),
  headerLinkColorHex: zHex, // NYT

  link: z.object({ color: z.string().optional(), hex: z.string().optional() }).partial().optional(),

  border: BorderSchema.optional(),

  overlay: z.boolean().optional(),
  sticky: z.boolean().optional(),
  height: zNum.optional(),
  logo: z.object({
    maxWidth: zNum.optional(),
    src: z.string().url().optional(),           // NYT: normal logo
    scrolledSrc: z.string().url().optional(),   // NYT: scrolled logo
    alt: z.string().optional(),
  }).partial().optional(),

  topBg: BgPart.default({ h: 0, s: 0, l: 100, opacity: 0 }),
  scrolledBg: BgPart.default({ h: 210, s: 100, l: 95, opacity: 98 }),
  
  bg: z.object({
    initial: BgPart.optional(),
    scrolled: BgPart.optional()
  }).optional(),


  navLinks: z.array(z.any()).default([]),
}).transform((a) => {
  const linkColor =
    a.headerLinkColorHex ??
    a.headerLinkColor ??
    a.link?.hex ??
    a.link?.color ??
    "white";

  return {
    isOverlay: typeof a.isOverlay === "boolean" ? a.isOverlay : !!a.overlay,
    headerIsSticky: typeof a.headerIsSticky === "boolean" ? a.headerIsSticky : !!a.sticky,
    headerHeight: typeof a.headerHeight === "number" ? a.headerHeight : (typeof a.height === "number" ? a.height : 72),
    headerLogoWidth: typeof a.headerLogoWidth === "number" ? a.headerLogoWidth : (a.logo?.maxWidth ?? 140),
    headerLinkColor: linkColor,
    headerLinkColorHex: a.headerLinkColorHex ?? a.link?.hex, // bevar hex hvis sat
    logo: { src: a.logo?.src, scrolledSrc: a.logo?.scrolledSrc, alt: a.logo?.alt, maxWidth: a.logo?.maxWidth },
    border: a.border ?? { enabled: false, widthPx: 1, color: { h: 220, s: 13, l: 91 } },
    topBg: a.topBg,
    scrolledBg: a.scrolledBg,
    navLinks: Array.isArray(a.navLinks) ? a.navLinks : [],
  };
});

// Wrapper som før
export const SavePayloadSchema = z.union([
  z.object({ appearance: HeaderAppearanceSchema }),
  HeaderAppearanceSchema.transform((appearance) => ({ appearance })),
]);
