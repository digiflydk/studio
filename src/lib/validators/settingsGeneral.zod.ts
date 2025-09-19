
import { z } from "zod";

// Hjælpere
const zNum = z.coerce.number();
const zBool = z.coerce.boolean();
const zUrl = z.string().url();
const zHex = z.string().regex(/^#([0-9A-Fa-f]{6}|[0-9A-Fa-f]{8})$/);


// Brand / kontakt / SEO er eksempler på typiske felter.
// Skema er *tolerant*: alt ukendt fanges i `extra`.
export const SettingsGeneralSchema = z.object({
  // Brand
  brand: z.object({
    name: z.string().optional(),
    tagline: z.string().optional(),
    primaryColorHex: z.string().regex(/^#([0-9A-Fa-f]{6}|[0-9A-Fa-f]{8})$/).optional(),
    secondaryColorHex: z.string().regex(/^#([0-9A-Fa-f]{6}|[0-9A-Fa-f]{8})$/).optional(),
    logo: z.object({
      src: z.string().url().optional(),
      scrolledSrc: z.string().url().optional(),
      alt: z.string().optional(),
      maxWidth: zNum.optional(),
    }).partial().optional(),
  }).partial().optional(),

  // Kontakt
  contact: z.object({
    email: z.string().email().optional(),
    phone: z.string().optional(),
    address: z.string().optional(),
    links: z.array(z.object({ label: z.string(), href: zUrl })).optional(),
  }).partial().optional(),

  // SEO / meta
  seo: z.object({
    title: z.string().optional(),
    description: z.string().optional(),
    ogImage: z.string().url().optional(),
  }).partial().optional(),

  // Feature flags
  flags: z.record(z.string(), zBool).optional(),

  // NYT: extra logo til scroll
  logoUrl: z.string().url().optional(),
  logoAlt: z.string().optional(),
  logoScrolledUrl: z.string().url().optional(),

  // NYT: header HEX felter
  headerInitialBackgroundHex: zHex.optional(),
  headerScrolledBackgroundHex: zHex.optional(),
  headerBorderColorHex: zHex.optional(),

  // Opacity kan eksistere i 0–1 eller 0–100 i legacy
  headerInitialBackgroundOpacity: z.union([z.number(), z.string()]).optional(),
  headerScrolledBackgroundOpacity: z.union([z.number(), z.string()]).optional(),


  // Alt andet vi ikke kender endnu
  extra: z.record(z.any()).optional(),
})
.partial() // Make all fields optional for partial updates
.transform((v) => {
  // Flyt ukendte top-level keys ind i extra (tolerant “pass-through”)
  const known = ["brand", "contact", "seo", "flags", "extra", "logoUrl", "logoAlt", "logoScrolledUrl", "headerInitialBackgroundHex", "headerScrolledBackgroundHex", "headerBorderColorHex", "headerInitialBackgroundOpacity", "headerScrolledBackgroundOpacity"];
  const extra: Record<string, any> = { ...(v.extra ?? {}) };
  for (const [k, val] of Object.entries(v as any)) {
    if (!known.includes(k) && typeof val !== "undefined") {
      extra[k] = val;
    }
  }

  const toNum = (x: any, def: number) => {
    const n = Number(x ?? def);
    if (n > 0 && n <= 1) return Math.round(n * 100); // normaliser 0–1 → %
    return n;
  };

  const transformed = { ...v };

  if (v.headerInitialBackgroundOpacity !== undefined) {
    transformed.headerInitialBackgroundOpacity = toNum(v.headerInitialBackgroundOpacity, 100);
  }
  if (v.headerScrolledBackgroundOpacity !== undefined) {
    transformed.headerScrolledBackgroundOpacity = toNum(v.headerScrolledBackgroundOpacity, 100);
  }

  return {
    ...transformed,
    extra,
  };
});

export type SettingsGeneral = z.infer<typeof SettingsGeneralSchema>;
