import { z } from "zod";

const hslo = z.object({
  h: z.number().min(0).max(360),
  s: z.number().min(0).max(100),
  l: z.number().min(0).max(100),
  opacity: z.number().min(0).max(100).optional(),
});

const borderSchema = z.object({
  enabled: z.boolean().default(false),
  widthPx: z.number().min(0).max(8).default(0),
  color: hslo.partial({ opacity: true }).extend({ opacity: z.number().min(0).max(100).default(100) }),
});

const bgSchema = z.object({
  topBg: hslo,
  scrolledBg: hslo,
});

const navLink = z.object({
  label: z.string().min(1),
  href: z.string().min(1),
});

export const headerAppearanceSchema = z.object({
  isOverlay: z.boolean().default(true),
  headerIsSticky: z.boolean().default(true),
  headerHeight: z.number().min(48).max(160).default(80),
  headerLogoWidth: z.number().min(60).max(320).default(120),
  headerLinkColor: z.string().min(1), // accepterer “white/black/…/hex”
  border: borderSchema.optional(),
  ...bgSchema.shape,
  navLinks: z.array(navLink).optional().default([]),
});

export type HeaderAppearanceInput = z.infer<typeof headerAppearanceSchema>;
