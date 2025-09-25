
export type Hsl = { h: number; s: number; l: number; opacity?: number };

export type CmsNavLink = { label: string; href: string };

export type CmsHeaderAppearance = {
  headerHeight: number;
  headerIsSticky: boolean;
  headerLinkColor: "black" | "white";
  navLinks: CmsNavLink[];
  topBg: Hsl;
  scrolledBg: Hsl;
  isOverlay: boolean;
  border: {
    enabled: boolean;
    widthPx: number;
    colorHex: string;
    color: { h: number; s: number; l: number; opacity: number };
    visible?: boolean;
  };
  headerLogoWidth: number;
  logo: { src: string; alt: string; maxWidth: number };
};

export type CmsHeaderDoc = {
  appearance: CmsHeaderAppearance;
  version: number;
  updatedAt?: any;
};
