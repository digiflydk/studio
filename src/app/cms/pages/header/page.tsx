'use client';

import { useState, useEffect, useTransition, useCallback } from 'react';
import type { HeaderSettings, NavLink } from '@/types/settings';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import OpacitySlider from '@/components/cms/OpacitySlider';

type HSLA = { h: number; s: number; l: number; opacity: number };
type HSL = { h: number; s: number; l: number };

const D_LINKS: NavLink[] = [
  { label: 'Online ordre', href: '/#online-orders' },
  { label: 'Priser', href: '/#pricing' },
  { label: 'Kunder', href: '/#customers' },
  { label: 'Kontakt', href: '/#contact' },
];

const D_BORDER_COLOR: HSL = { h: 220, s: 13, l: 91 };
const D_BORDER = { enabled: false, width: 1, color: D_BORDER_COLOR };
const D_INITIAL: HSLA = { h: 0, s: 0, l: 100, opacity: 1 };
const D_SCROLLED: HSLA = { h: 210, s: 100, l: 95, opacity: 0.98 };
const D_HEADER: HeaderSettings = {
  overlay: true,
  sticky: true,
  height: 72,
  logo: { maxWidth: 140 },
  linkColor: 'white',
  border: D_BORDER,
  bg: { initial: D_INITIAL, scrolled: D_SCROLLED },
  navLinks: D_LINKS,
};

function apiToHeaderSettings(api: any) {
  const a = api?.appearance ?? api ?? {};
  return {
    overlay: !!a.isOverlay,
    sticky: !!a.headerIsSticky,
    height: Number(a.headerHeight ?? 72),
    logo: { maxWidth: Number(a.headerLogoWidth ?? a?.logo?.maxWidth ?? 140) },
    linkColor: a.headerLinkColor ?? a?.link?.hex ?? a?.link?.color ?? 'white',
    border: {
      enabled: !!(a?.border?.enabled ?? a?.border?.visible),
      width: Number(a?.border?.width ?? a?.border?.widthPx ?? 1),
      color: {
        h: Number(a?.border?.color?.h ?? 220),
        s: Number(a?.border?.color?.s ?? 13),
        l: Number(a?.border?.color?.l ?? 91),
      },
    },
    bg: {
      initial: {
        h: Number(a?.topBg?.h ?? 0),
        s: Number(a?.topBg?.s ?? 0),
        l: Number(a?.topBg?.l ?? 100),
        opacity: Number(a?.topBg?.opacity ?? 0),
      },
      scrolled: {
        h: Number(a?.scrolledBg?.h ?? 210),
        s: Number(a?.scrolledBg?.s ?? 100),
        l: Number(a?.scrolledBg?.l ?? 95),
        opacity: Number(a?.scrolledBg?.opacity ?? 98),
      },
    },
    navLinks: Array.isArray(a?.navLinks) ? a.navLinks : [],
  };
}

function headerSettingsToAppearance(h: any) {
  return {
    isOverlay: !!h?.overlay,
    headerIsSticky: !!h?.sticky,
    headerHeight: Number(h?.height ?? 72),
    headerLogoWidth: Number(h?.logo?.maxWidth ?? 140),
    headerLinkColor: h?.linkColor ?? 'white',
    border: {
      enabled: !!h?.border?.enabled,
      widthPx: Number(h?.border?.width ?? 1),
      color: {
        h: Number(h?.border?.color?.h ?? 220),
        s: Number(h?.border?.color?.s ?? 13),
        l: Number(h?.border?.color?.l ?? 91),
      },
    },
    topBg: {
      h: Number(h?.bg?.initial?.h ?? 0),
      s: Number(h?.bg?.initial?.s ?? 0),
      l: Number(h?.bg?.initial?.l ?? 100),
      opacity: Number(h?.bg?.initial?.opacity ?? 0),
    },
    scrolledBg: {
      h: Number(h?.bg?.scrolled?.h ?? 210),
      s: Number(h?.bg?.scrolled?.s ?? 100),
      l: Number(h?.bg?.scrolled?.l ?? 95),
      opacity: Number(h?.bg?.scrolled?.opacity ?? 98),
    },
    navLinks: Array.isArray(h?.navLinks) ? h.navLinks : [],
  };
}

async function fetchSettings(): Promise<HeaderSettings> {
  const res = await fetch('/api/pages/header/appearance', { cache: 'no-store' });
  const json = await res.json();
  const raw = (json?.ok && json?.data) ? json.data : {};
  const mapped = apiToHeaderSettings(raw);
  const safe = normalizeHeader(mapped);
  return safe;
}

async function saveSettings(payload: Partial<HeaderSettings>): Promise<boolean> {
  // 1) Normaliser til vores lokale HeaderSettings-form
  const normalized = normalizeHeader(payload);
  // 2) Map til API’ets appearance-form
  const appearance = headerSettingsToAppearance(normalized);

  const res = await fetch('/api/pages/header/appearance/save', {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ appearance }),
  });

  const json = await res.json();
  return Boolean(json?.ok);
}

function to01(v: unknown, fb = 1): number {
  if (typeof v === 'number') {
    if (v >= 0 && v <= 1) return v;
    if (v > 1 && v <= 100) return Math.max(0, Math.min(1, v / 100));
  }
  return fb;
}

function normHsl(input: any, fb: HSL): HSL {
  const h = typeof input?.h === 'number' ? input.h : fb.h;
  const s = typeof input?.s === 'number' ? input.s : fb.s;
  const l = typeof input?.l === 'number' ? input.l : fb.l;
  return { h, s, l };
}

function normHsla(input: any, fb: HSLA): HSLA {
  const base = normHsl(input, fb);
  const opacity = to01(input?.opacity, fb.opacity);
  return { ...base, opacity };
}

function normalizeHeader(h: any): HeaderSettings {
  const overlay = h?.overlay ?? D_HEADER.overlay;
  const sticky = h?.sticky ?? D_HEADER.sticky;
  const height = typeof h?.height === 'number' ? h.height : D_HEADER.height;
  const logo = { maxWidth: typeof h?.logo?.maxWidth === 'number' ? h.logo.maxWidth : D_HEADER.logo.maxWidth };
  const linkColor = h?.linkColor ?? D_HEADER.linkColor;
  const border = {
    enabled: h?.border?.enabled ?? D_HEADER.border.enabled,
    width: typeof h?.border?.width === 'number' ? h.border.width : D_HEADER.border.width,
    color: normHsl(h?.border?.color, D_HEADER.border.color),
  };
  const bg = {
    initial: normHsla(h?.bg?.initial, D_INITIAL),
    scrolled: normHsla(h?.bg?.scrolled, D_SCROLLED),
  };
  const navLinks = Array.isArray(h?.navLinks) && h.navLinks.length ? h.navLinks : D_LINKS;
  return { overlay, sticky, height, logo, linkColor, border, bg, navLinks };
}

export default function HeaderPage() {
  const [settings, setSettings] = useState<HeaderSettings>(D_HEADER);
  const [isPending, startTransition] = useTransition();

  const load = useCallback(async () => {
    const s = await fetchSettings();
    setSettings(s);
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const s = settings;

  const setHeader = (patch: Partial<HeaderSettings>) => {
    setSettings((prev) => normalizeHeader({ ...prev, ...patch }));
  };

  const setBgInitial = (patch: Partial<HSLA>) => {
    setSettings((prev) => normalizeHeader({ ...prev, bg: { ...prev.bg, initial: { ...prev.bg.initial, ...patch } } }));
  };

  const setBgScrolled = (patch: Partial<HSLA>) => {
    setSettings((prev) => normalizeHeader({ ...prev, bg: { ...prev.bg, scrolled: { ...prev.bg.scrolled, ...patch } } }));
  };

  const setBorder = (patch: Partial<{ enabled: boolean; width: number; color: HSL }>) => {
    setSettings((prev) => normalizeHeader({ ...prev, border: { ...prev.border, ...patch, color: { ...prev.border.color, ...(patch.color ?? {}) } } }));
  };

  const setLogo = (patch: Partial<{ maxWidth: number }>) => {
    setSettings((prev) => normalizeHeader({ ...prev, logo: { ...prev.logo, ...patch } }));
  };

  const setNavLink = (idx: number, field: keyof NavLink, value: string) => {
    const base = Array.isArray(s.navLinks) ? s.navLinks : D_LINKS;
    const arr = [...base];
    arr[idx] = { ...arr[idx], [field]: value };
    setHeader({ navLinks: arr });
  };

  const addNavLink = () => {
    const base = Array.isArray(s.navLinks) ? s.navLinks : D_LINKS;
    setHeader({ navLinks: [...base, { label: 'New Link', href: '#' }] });
  };

  const removeNavLink = (idx: number) => {
    const base = Array.isArray(s.navLinks) ? s.navLinks : D_LINKS;
    setHeader({ navLinks: base.filter((_, i) => i !== idx) });
  };

  const onSave = () => {
    startTransition(async () => {
      const ok = await saveSettings(settings);
      if (ok) {
        window.dispatchEvent(new CustomEvent('design:updated'));
        await load();
      }
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Header Settings</h1>
        <p className="text-muted-foreground">Manage the content and appearance of the site header.</p>
      </div>

      <Accordion type="multiple" defaultValue={['appearance', 'bg', 'border', 'nav']}>
        <AccordionItem value="appearance">
          <AccordionTrigger>Appearance</AccordionTrigger>
          <AccordionContent>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div className="flex items-center justify-between rounded border p-3">
                <Label>Overlay</Label>
                <Switch checked={Boolean(s.overlay)} onCheckedChange={(v) => setHeader({ overlay: v })} />
              </div>
              <div className="flex items-center justify-between rounded border p-3">
                <Label>Sticky</Label>
                <Switch checked={Boolean(s.sticky)} onCheckedChange={(v) => setHeader({ sticky: v })} />
              </div>
              <div className="rounded border p-3">
                <Label>Height (px)</Label>
                <Input type="number" value={s.height ?? 72} onChange={(e) => setHeader({ height: Number(e.target.value) })} />
              </div>
              <div className="rounded border p-3">
                <Label>Logo max width (px)</Label>
                <Input type="number" value={s.logo?.maxWidth ?? 140} onChange={(e) => setLogo({ maxWidth: Number(e.target.value) })} />
              </div>
              <div className="rounded border p-3">
                <Label>Link color</Label>
                <Select value={s.linkColor ?? 'white'} onValueChange={(v) => setHeader({ linkColor: v as any })}>
                  <SelectTrigger><SelectValue placeholder="Choose" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="white">White</SelectItem>
                    <SelectItem value="black">Black</SelectItem>
                    <SelectItem value="primary">Primary</SelectItem>
                    <SelectItem value="secondary">Secondary</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="bg">
          <AccordionTrigger>Backgrounds</AccordionTrigger>
          <AccordionContent>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div className="rounded border p-3 space-y-3">
                <div className="font-medium">Normal</div>
                <Label>H</Label>
                <Input type="number" value={s.bg.initial.h} onChange={(e) => setBgInitial({ h: Number(e.target.value) })} />
                <Label>S</Label>
                <Input type="number" value={s.bg.initial.s} onChange={(e) => setBgInitial({ s: Number(e.target.value) })} />
                <Label>L</Label>
                <Input type="number" value={s.bg.initial.l} onChange={(e) => setBgInitial({ l: Number(e.target.value) })} />
                <OpacitySlider label="Opacity" value01={s.bg.initial.opacity} onChange01={(v) => setBgInitial({ opacity: v })} />
              </div>

              <div className="rounded border p-3 space-y-3">
                <div className="font-medium">Scrolled</div>
                <Label>H</Label>
                <Input type="number" value={s.bg.scrolled.h} onChange={(e) => setBgScrolled({ h: Number(e.target.value) })} />
                <Label>S</Label>
                <Input type="number" value={s.bg.scrolled.s} onChange={(e) => setBgScrolled({ s: Number(e.target.value) })} />
                <Label>L</Label>
                <Input type="number" value={s.bg.scrolled.l} onChange={(e) => setBgScrolled({ l: Number(e.target.value) })} />
                <OpacitySlider label="Opacity" value01={s.bg.scrolled.opacity} onChange01={(v) => setBgScrolled({ opacity: v })} />
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="border">
          <AccordionTrigger>Border</AccordionTrigger>
          <AccordionContent>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
              <div className="flex items-center justify-between rounded border p-3">
                <Label>Enabled</Label>
                <Switch checked={Boolean(s.border.enabled)} onCheckedChange={(v) => setBorder({ enabled: v })} />
              </div>
              <div className="rounded border p-3">
                <Label>Width (px)</Label>
                <Input type="number" value={s.border.width} onChange={(e) => setBorder({ width: Number(e.target.value) })} />
              </div>
              <div className="rounded border p-3">
                <Label>Color H</Label>
                <Input type="number" value={s.border.color.h} onChange={(e) => setBorder({ color: { ...s.border.color, h: Number(e.target.value) } })} />
                <Label>Color S</Label>
                <Input type="number" value={s.border.color.s} onChange={(e) => setBorder({ color: { ...s.border.color, s: Number(e.target.value) } })} />
                <Label>Color L</Label>
                <Input type="number" value={s.border.color.l} onChange={(e) => setBorder({ color: { ...s.border.color, l: Number(e.target.value) } })} />
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="nav">
          <AccordionTrigger>Navigation links</AccordionTrigger>
          <AccordionContent>
            <div className="space-y-3">
              {(s.navLinks ?? D_LINKS).map((lnk, i) => (
                <div key={i} className="grid grid-cols-1 gap-2 md:grid-cols-3 items-center rounded border p-3">
                  <Input value={lnk.label} onChange={(e) => setNavLink(i, 'label', e.target.value)} placeholder="Label" />
                  <Input value={lnk.href} onChange={(e) => setNavLink(i, 'href', e.target.value)} placeholder="Href" />
                  <div className="flex gap-2">
                    <Button variant="secondary" onClick={() => removeNavLink(i)}>Remove</Button>
                  </div>
                </div>
              ))}
              <Button onClick={addNavLink}>Add link</Button>
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>

      <div className="flex gap-3">
        <Button onClick={onSave} disabled={isPending}>{isPending ? 'Saving…' : 'Save changes'}</Button>
        <Button variant="secondary" onClick={load} disabled={isPending}>Reload</Button>
      </div>
    </div>
  );
}
