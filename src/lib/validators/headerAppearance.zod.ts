import { z } from "zod";

export const hslSchema = z.object({
  h: z.number().min(0).max(360),
  s: z.number().min(0).max(100),
  l: z.number().min(0).max(100),
  opacity: z.number().min(0).max(100).optional().default(100),
});

export const borderSchema = z.object({
  enabled: z.boolean().default(false),
  widthPx: z.number().min(0).max(16).default(1),
  color: hslSchema.partial().default({}).transform((c) => ({
    h: c.h ?? 0,
    s: c.s ?? 0,
    l: c.l ?? 0,
    opacity: c.opacity ?? 100,
  })),
  hex: z.string().regex(/^#([0-9A-Fa-f]{3}|[0-9A-Fa-f]{6})$/).optional().or(z.literal("")).default(""),
});

export const linkSchema = z.object({
  color: z.string().default("white"),
  hover: z.string().optional().default(""),
  size: z.number().min(10).max(48).optional().default(15),
  hex: z.string().regex(/^#([0-9A-Fa-f]{3}|[0-9A-Fa-f]{6})$/).optional().or(z.literal("")).default(""),
  hoverHex: z.string().regex(/^#([0-9A-Fa-f]{3}|[0-9A-Fa-f]{6})$/).optional().or(z.literal("")).default(""),
  menuIconColor: z.string().optional().default(""),
});

export const logoSchema = z.object({
  url: z.string().url().optional().default(""),
  alt: z.string().optional().default(""),
  maxWidth: z.number().min(40).max(400).default(120),
});

export const ctaSchema = z.object({
  enabled: z.boolean().default(false),
  label: z.string().optional().default(""),
  href: z.string().optional().default(""),
  linkType: z.enum(["internal", "external", "anchor"]).optional().default("external"),
  variant: z.string().optional().default("default"),
  size: z.string().optional().default("md"),
});

export const mobileFloatingSchema = z.object({
  enabled: z.boolean().default(false),
  position: z.enum(["br", "bl", "tr", "tl"]).optional().default("br"),
  size: z.string().optional().default("lg"),
  variant: z.string().optional().default("pill"),
  height: z.number().min(32).max(200).optional().default(110),
});

export const navLinkSchema = z.object({
  label: z.string(),
  href: z.string(),
});

export const appearanceSchema = z.object({
  isOverlay: z.boolean().optional().default(true),
  headerIsSticky: z.boolean().optional().default(true),
  headerHeight: z.number().min(56).max(200).optional().default(80),
  headerLogoWidth: z.number().min(60).max(400).optional().default(120),
  logo: logoSchema.optional().default({} as any),
  link: linkSchema.optional().default({} as any),
  topBg: hslSchema.optional().default({ h: 0, s: 0, l: 100, opacity: 0 }),
  scrolledBg: hslSchema.optional().default({ h: 210, s: 100, l: 95, opacity: 98 }),
  border: borderSchema.optional().default({} as any),
  cta: ctaSchema.optional().default({} as any),
  mobileFloating: mobileFloatingSchema.optional().default({} as any),
  navLinks: z.array(navLinkSchema).optional().default([]),
});

export const headerDocumentSchema = z.object({
  appearance: appearanceSchema,
  version: z.number().optional().default(1),
  updatedAt: z.string().optional(),
  updatedBy: z.string().optional(),
});

export type HeaderAppearance = z.infer<typeof appearanceSchema>;
export type HeaderDocument = z.infer<typeof headerDocumentSchema>;
export const headerAppearanceSchema = appearanceSchema;
export const HeaderAppearanceSchema = appearanceSchema;
