export type WebsiteHeaderConfig = {
  sticky: boolean;
  heightPx: number;
  logoWidthPx: number;
  linkClass: string;
  logoUrl?: string | null;
  navLinks: Array<{ label: string; href: string }>;
  bg: {
    initial: { h: number; s: number; l: number; opacity: number };
    scrolled: { h: number; s: number; l: number; opacity: number };
  };
};
