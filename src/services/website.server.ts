import { getGeneralSettings } from '@/services/settings';
import type { WebsiteHeaderConfig } from './website';

function linkClassFromInput(c?: string) {
  return c === 'white' ? 'text-white hover:text-primary' : 'text-black hover:text-primary';
}

export async function getWebsiteHeaderConfig(): Promise<WebsiteHeaderConfig> {
  const s = await getGeneralSettings();
  const header = s?.header ?? {};
  const bgInit = s?.headerInitialBackgroundColor ?? { h: 0, s: 0, l: 100 };
  const bgScroll = s?.headerScrolledBackgroundColor ?? { h: 0, s: 0, l: 100 };
  const opInit = typeof s?.headerInitialBackgroundOpacity === 'number' ? s!.headerInitialBackgroundOpacity : 100;
  const opScroll = typeof s?.headerScrolledBackgroundOpacity === 'number' ? s!.headerScrolledBackgroundOpacity : 98;

  return {
    sticky: !!s?.headerIsSticky,
    heightPx: s?.headerHeight ?? 80,
    logoWidthPx: s?.headerLogoWidth ?? 120,
    linkClass: linkClassFromInput(s?.headerLinkColor),
    logoUrl: s?.logoUrl,
    navLinks: Array.isArray(s?.headerNavLinks) ? s!.headerNavLinks : [],
    bg: {
      initial: { h: bgInit.h ?? 0, s: bgInit.s ?? 0, l: bgInit.l ?? 100, opacity: opInit },
      scrolled: { h: bgScroll.h ?? 0, s: bgScroll.s ?? 0, l: bgScroll.l ?? 100, opacity: opScroll },
    },
  };
}
