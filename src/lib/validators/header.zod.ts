import { z } from "zod";

/** HSL + opacity shape */
const HslZ = z.object({
  h: z.number().optional(),
  s: z.number().optional(),
  l: z.number().optional(),
  opacity: z.number().optional(), // kan være 0–1 eller 0–100 (normaliseres senere)
});

/** Border shape (både width og widthPx tillades) */
const BorderZ = z.object({
  enabled: z.boolean().optional(),
  width: z.number().optional(),
  widthPx: z.number().optional(),
  colorHex: z.string().optional(),
  color: HslZ.optional(),
});

/** Logo shape (scrolledSrc valgfrit) */
const LogoZ = z.object({
  src: z.string().url().optional(),
  scrolledSrc: z.string().url().optional(),
  alt: z.string().optional(),
  maxWidth: z.number().optional(),
});

/** NavLink */
const NavLinkZ = z.object({
  label: z.string(),
  href: z.string(),
});

/** Variant A: nested bg = { initial, scrolled } */
const BgNestedZ = z.object({
  initial: HslZ.optional(),
  scrolled: HslZ.optional(),
});

/** Variant B: flade felter topBg / scrolledBg */
const BgFlatZ = z.object({
  topBg: HslZ.optional(),
  scrolledBg: HslZ.optional(),
});

/** Eksporteret union der accepterer begge måder */
const BgEitherZ = z
  .object({
    bg: BgNestedZ.optional(),
    topBg: HslZ.optional(),
    scrolledBg: HslZ.optional(),
  })
  .partial();

/** Hele header-settings fra CMS eller Settings.general.header */
export const HeaderSettingsZ = z
  .object({
    // Højde / sticky / overlay
    headerHeight: z.number().optional(),
    height: z.number().optional(),
    heightPx: z.number().optional(),
    headerIsSticky: z.boolean().optional(),
    sticky: z.boolean().optional(),
    isOverlay: z.boolean().optional(),
    overlay: z.boolean().optional(),

    // Linkfarver
    headerLinkColor: z.enum(["black", "white"]).optional(),
    linkColor: z.enum(["black", "white"]).optional(),

    // Border, Logo, Navlinks, CTA
    border: BorderZ.optional(),
    logo: LogoZ.optional(),
    navLinks: z.array(NavLinkZ).optional(),
    cta: z
      .object({
        enabled: z.boolean().optional(),
        label: z.string().optional(),
        href: z.string().optional(),
        linkType: z.enum(["internal", "external"]).optional(),
        size: z.string().optional(),
        variant: z.string().optional(),
      })
      .optional(),
  })
  .merge(BgEitherZ) // tilføj bg felter
  .strict(false);

export type HeaderSettings = z.infer<typeof HeaderSettingsZ>;
