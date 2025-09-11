
import { adminDb } from '@/lib/server/firebaseAdmin';

function pctTo01(v:number|undefined) {
    if (typeof v !== 'number' || !isFinite(v)) return undefined;
    return Math.max(0, Math.min(1, v/100));
}

export async function migrateHeaderAppearance() {
  const ref = adminDb.doc('settings/general');
  return adminDb.runTransaction(async tx => {
    const snap = await tx.get(ref);
    if (!snap.exists) return { ok:true, changed:false, reason: 'doc_not_found' };
    const cur = snap.data() as any;
    
    const hasFlat =
      'headerHeight' in cur || 'headerLogoWidth' in cur ||
      'headerTopBorderEnabled' in cur || 'headerInitialBackgroundOpacity' in cur ||
      'headerCtaSettings' in cur;

    if (!hasFlat) return { ok:true, changed:false, reason: 'no_flat_keys' };

    const next = { ...cur, header: { ...(cur.header ?? {}) } };
    
    // Map flade → nested
    if (cur.headerHeight != null) next.header.height = cur.headerHeight;
    if (cur.headerLogoWidth != null) next.header.logo = { ...(next.header.logo ?? {}), maxWidth: cur.headerLogoWidth };

    next.header.border = {
      ...(next.header.border ?? {}),
      ...(cur.headerTopBorderEnabled != null ? { enabled: !!cur.headerTopBorderEnabled } : {}),
      ...(cur.headerTopBorderHeight != null ? { width: cur.headerTopBorderHeight } : {}),
      ...(cur.headerTopBorderColor ? { color: cur.headerTopBorderColor } : {}),
    };

    const initialOpacity = pctTo01(cur.headerInitialBackgroundOpacity);
    if (cur.headerInitialBackgroundColor || initialOpacity !== undefined) {
      next.header.bg = { ...(next.header.bg ?? {}), initial: {
        ...(next.header.bg?.initial ?? {}),
        ...(cur.headerInitialBackgroundColor ?? {}),
        ...(initialOpacity !== undefined ? { opacity: initialOpacity } : {}),
      }};
    }
    
    const scrolledOpacity = pctTo01(cur.headerScrolledBackgroundOpacity);
    if (cur.headerScrolledBackgroundColor || scrolledOpacity !== undefined) {
      next.header.bg = { ...(next.header.bg ?? {}), scrolled: {
        ...(next.header.bg?.scrolled ?? {}),
        ...(cur.headerScrolledBackgroundColor ?? {}),
        ...(scrolledOpacity !== undefined ? { opacity: scrolledOpacity } : {}),
      }};
    }

    if (Array.isArray(cur.headerNavLinks)) next.header.navLinks = cur.headerNavLinks;

    if (cur.headerCtaSettings) next.header.cta = { ...(next.header.cta ?? {}), ...cur.headerCtaSettings };

    // Ryd gamle keys
    const toDelete = [
      'headerHeight','headerLogoWidth','headerTopBorderEnabled','headerTopBorderHeight','headerTopBorderColor',
      'headerInitialBackgroundColor','headerInitialBackgroundOpacity','headerScrolledBackgroundColor','headerScrolledBackgroundOpacity',
      'headerNavLinks','headerCtaSettings'
    ];
    for (const k of toDelete) if (k in next) delete (next as any)[k];

    next.updatedAt = new Date().toISOString();
    next.updatedBy = 'migration:DF-246';

    tx.set(ref, next, { merge:false });
    return { ok:true, changed:true };
  });
}
