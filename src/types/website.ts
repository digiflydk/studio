export type HSL = { h: number, s: number, l: number, opacity: number };

export interface WebsiteHeaderConfig {
  isOverlay: boolean;
  sticky: boolean;
  heightPx: number;
  logoWidthPx: number;
  topBg: HSL;
  scrolledBg: HSL;
  linkClass: string;
}
