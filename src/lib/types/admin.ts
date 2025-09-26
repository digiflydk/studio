export type AdminHeaderDoc = {
  version: number;
  logo: { src: string; alt: string; maxWidth: number };
  height: number;
  sticky: boolean;
  overlay: boolean;
  linkColor: "black" | "white";
  nav: Array<{ label: string; href: string }>;
  cta: {
    enabled: boolean;
    label: string;
    href: string;
    variant: "default" | "pill" | "outline";
    size: "sm" | "md" | "lg";
  };
  bg: {
    initial: { h: number; s: number; l: number; opacity: number };
    scrolled: { h: number; s: number; l: number; opacity: number };
  };
  border: { enabled: boolean; widthPx: number; colorHex: string };
  updatedAt: string;
  updatedBy: string;
};

export type AdminHomeDoc = {
  hero: {
    enabled: boolean;
    headline: string;
    description: string;
    ctaText: string;
    ctaLink: string;
    images: {
      tl: string; // portrait
      tr: string; // square
      bl: string; // square
      br: string; // portrait
    };
    spacing: { top: number; bottom: number };
    align: "left" | "center";
    maxTextWidth: number;
  };
  sectionOrder: string[]; // f.eks. ["feature","services","cases","about","contact","tabs"]
  updatedAt: string;
  updatedBy: string;
};
