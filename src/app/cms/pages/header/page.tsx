
'use client';

import React, { useMemo, useState, useCallback, useEffect } from 'react';
import type { HeaderSettings, NavLink } from '@/types/settings';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import OpacitySlider from '@/components/cms/OpacitySlider';

type HSLA = { h: number; s: number; l: number; opacity: number; hex?: string };
type HSL = { h: number; s: number; l: number; hex?: string };

function clamp01(n: number) { return Math.max(0, Math.min(1, n)); }
function pct(n: number) { return Math.max(0, Math.min(100, Math.round(n))); }

/** H, S, L i procent → HEX (uden alpha) */
function hslToHex(h: number, s: number, l: number): string {
  // h: 0–360, s/l: 0–100
  const _s = clamp01(s / 100);
  const _l = clamp01(l / 100);
  const c = (1 - Math.abs(2 * _l - 1)) * _s;
  const hp = (h % 360) / 60;
  const x = c * (1 - Math.abs((hp % 2) - 1));
  let r = 0, g = 0, b = 0;
  if (0 <= hp && hp < 1) { r = c; g = x; b = 0; }
  else if (1 <= hp && hp < 2) { r = x; g = c; b = 0; }
  else if (2 <= hp && hp < 3) { r = 0; g = c; b = x; }
  else if (3 <= hp && hp < 4) { r = 0; g = x; b = c; }
  else if (4 <= hp && hp < 5) { r = x; g = 0; b = c; }
  else if (5 <= hp && hp < 6) { r = c; g = 0; b = x; }
  const m = _l - c / 2;
  const R = Math.round((r + m) * 255);
  const G = Math.round((g + m) * 255);
  const B = Math.round((b + m) * 255);
  const toHex = (v: number) => v.toString(16).padStart(2, "0");
  return `#${toHex(R)}${toHex(G)}${toHex(B)}`;
}

function effectiveColorHex(opt: {
  hex?: string | null;
  h?: number; s?: number; l?: number;
  opacity?: number;
}): string | null {
  const hex = opt.hex?.trim();
  if (hex) return hex; // HEX har prioritet
  if (typeof opt.h === "number" && typeof opt.s === "number" && typeof opt.l === "number") {
    return hslToHex(opt.h, opt.s, opt.l);
  }
  return null;
}

function Toast({ text }: { text: string }) {
  const [open, setOpen] = React.useState(true);
  React.useEffect(() => {
    const t = setTimeout(() => setOpen(false), 1000); // auto close 1s
    return () => clearTimeout(t);
  }, []);
  if (!open) return null;
  return (
    <div
      role="status"
      aria-live="polite"
      style={{
        position: "fixed",
        top: 16,
        right: 16,
        display: "flex",
        alignItems: "center",
        gap: 8,
        padding: "10px 12px",
        borderRadius: 10,
        border: "1px solid rgba(16,185,129,0.35)",
        background: "#ECFDF5",
        color: "#065F46",
        boxShadow: "0 10px 30px rgba(0,0,0,0.12)",
        zIndex: 9999,
        fontSize: 14,
        transform: "translateY(0)",
        animation: "toast-in .18s ease-out",
      }}
    >
      <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
        <path d="M12 2a10 10 0 1 0 .001 20.001A10 10 0 0 0 12 2Zm-1 14-4-4 1.414-1.414L11 12.172l5.586-5.586L18 8l-7 8Z" />
      </svg>
      <span>{text}</span>
      <style>{`
        @keyframes toast-in { from { opacity: 0; transform: translateY(-6px); } to { opacity: 1; transform: translateY(0); } }
      `}</style>
    </div>
  );
}


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

function AlertBanner({ type = "error", title, message }: { type?: "error" | "success"; title: string; message?: string }) {
  const tone = type === "error" ? "bg-red-50 text-red-800 border-red-200" : "bg-green-50 text-green-800 border-green-200";
  return (
    <div className={`mb-4 border rounded-lg p-3 ${tone}`}>
      <div className="font-medium">{title}</div>
      {message ? <div className="text-sm mt-1">{message}</div> : null}
    </div>
  );
}


function apiToHeaderSettings(api: any) {
  const a = api?.appearance ?? api ?? {};
  return {
    overlay: !!a.isOverlay,
    sticky: !!a.headerIsSticky,
    height: Number(a.headerHeight ?? 72),
    logo: {
      maxWidth: Number(a.headerLogoWidth ?? a?.logo?.maxWidth ?? 140),
      src: a?.logo?.src,
      scrolledSrc: a?.logo?.scrolledSrc,
      alt: a?.logo?.alt ?? "Logo",
    },
    linkColor: a.headerLinkColor ?? a?.link?.hex ?? a?.link?.color ?? 'white',
    linkColorHex: a.headerLinkColorHex ?? a?.link?.hex,                 // NYT
    border: {
      enabled: !!(a?.border?.enabled ?? a?.border?.visible),
      width: Number(a?.border?.widthPx ?? a?.border?.width ?? 1),
      color: {
        h: Number(a?.border?.color?.h ?? 220),
        s: Number(a?.border?.color?.s ?? 13),
        l: Number(a?.border?.color?.l ?? 91),
      },
      colorHex: a?.border?.colorHex,                                   // NYT
    },
    bg: {
      initial: {
        h: Number(a?.topBg?.h ?? 0),
        s: Number(a?.topBg?.s ?? 0),
        l: Number(a?.topBg?.l ?? 100),
        opacity: Number(a?.topBg?.opacity ?? 0),
        hex: a?.topBg?.hex,                                            // NYT
      },
      scrolled: {
        h: Number(a?.scrolledBg?.h ?? 210),
        s: Number(a?.scrolledBg?.s ?? 100),
        l: Number(a?.scrolledBg?.l ?? 95),
        opacity: Number(a?.scrolledBg?.opacity ?? 98),
        hex: a?.scrolledBg?.hex,                                       // NYT
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
    headerLinkColorHex: h?.linkColorHex,                 // NYT
    logo: {
      src: h?.logo?.src,                                 // NYT
      scrolledSrc: h?.logo?.scrolledSrc,                 // NYT
      alt: h?.logo?.alt ?? 'Logo',
      maxWidth: Number(h?.logo?.maxWidth ?? 140),
    },
    border: {
      enabled: !!h?.border?.enabled,
      widthPx: Number(h?.border?.width ?? 1),
      color: {
        h: Number(h?.border?.color?.h ?? 220),
        s: Number(h?.border?.color?.s ?? 13),
        l: Number(h?.border?.color?.l ?? 91),
      },
      colorHex: h?.border?.colorHex,                     // NYT
    },
    topBg: {
      h: Number(h?.bg?.initial?.h ?? 0),
      s: Number(h?.bg?.initial?.s ?? 0),
      l: Number(h?.bg?.initial?.l ?? 100),
      opacity: Number(h?.bg?.initial?.opacity ?? 0),
      hex: h?.bg?.initial?.hex,                          // NYT
    },
    scrolledBg: {
      h: Number(h?.bg?.scrolled?.h ?? 210),
      s: Number(h?.bg?.scrolled?.s ?? 100),
      l: Number(h?.bg?.scrolled?.l ?? 95),
      opacity: Number(h?.bg?.scrolled?.opacity ?? 98),
      hex: h?.bg?.scrolled?.hex,                         // NYT
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

async function saveSettings(payload: Partial<HeaderSettings>): Promise<{ ok: boolean; error?: string; details?: any }> {
  const normalized = normalizeHeader(payload);
  const appearance = headerSettingsToAppearance(normalized);

  const res = await fetch('/api/pages/header/appearance/save', {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ appearance }),
  });

  const json = await res.json();
  if (!json?.ok) {
    // Returnér fejl til UI
    return { ok: false, error: json?.error || 'Save failed', details: json?.details || json?.message };
  }
  return { ok: true };
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
  const logo = { 
    maxWidth: typeof h?.logo?.maxWidth === 'number' ? h.logo.maxWidth : D_HEADER.logo.maxWidth,
    src: h?.logo?.src,
    scrolledSrc: h?.logo?.scrolledSrc,
    alt: h?.logo?.alt,
  };
  const linkColor = h?.linkColor ?? D_HEADER.linkColor;
  const linkColorHex = h?.linkColorHex;
  const border = {
    enabled: h?.border?.enabled ?? D_HEADER.border.enabled,
    width: typeof h?.border?.width === 'number' ? h.border.width : D_HEADER.border.width,
    color: normHsl(h?.border?.color, D_HEADER.border.color),
    colorHex: h?.border?.colorHex
  };
  const bg = {
    initial: normHsla(h?.bg?.initial, D_INITIAL),
    scrolled: normHsla(h?.bg?.scrolled, D_SCROLLED),
  };
  const navLinks = Array.isArray(h?.navLinks) && h.navLinks.length ? h.navLinks : D_LINKS;
  return { overlay, sticky, height, logo, linkColor, linkColorHex, border, bg, navLinks };
}

export default function HeaderPage() {
  const [form, setForm] = useState<HeaderSettings | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [saving, setSaving] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [showToast, setShowToast] = React.useState(false);


  const load = useCallback(async () => {
    setLoading(true);
    setErrorMsg(null);
    try {
      const data = await fetchSettings();
      setForm(data);
    } catch (e: any) {
      setErrorMsg('Kunne ikke indlæse header-data.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  async function handleSave() {
    if (!form) return;
    setSaving(true);
    setErrorMsg(null);
    setSuccessMsg(null);
    const res = await saveSettings(form);
    setSaving(false);
    if (!res.ok) {
      // Viser både kort fejl og tekstdetaljer hvis tilgængelig
      const details = typeof res.details === 'string'
        ? res.details
        : res.details?.formErrors?.join(', ') || JSON.stringify(res.details, null, 2);
      setErrorMsg(`${res.error}${details ? ` — ${details}` : ''}`);
      return;
    }
    setSuccessMsg("Gemt! Dine ændringer er nu lagret.");
    setShowToast(true);
    // reload settings + auto-hide banner (hvis du bruger banneret også)
    try {
      const fresh = await fetchSettings();
      setForm(fresh);
    } catch {}
    setTimeout(() => setShowToast(false), 1100);
  }

  if (loading) return <div className="p-4">Indlæser…</div>;
  if (!form) return <div className="p-4">Ingen data.</div>;
  
  const s = form;

  const setHeader = (patch: Partial<HeaderSettings>) => {
    setForm((prev) => prev ? normalizeHeader({ ...prev, ...patch }) : null);
  };

  const setBgInitial = (patch: Partial<HSLA>) => {
    setForm((prev) => prev ? normalizeHeader({ ...prev, bg: { ...prev.bg, initial: { ...prev.bg.initial, ...patch } } }) : null);
  };

  const setBgScrolled = (patch: Partial<HSLA>) => {
    setForm((prev) => prev ? normalizeHeader({ ...prev, bg: { ...prev.bg, scrolled: { ...prev.bg.scrolled, ...patch } } }) : null);
  };

  const setBorder = (patch: Partial<{ enabled: boolean; width: number; color: HSL }>) => {
    setForm((prev) => prev ? normalizeHeader({ ...prev, border: { ...prev.border, ...patch, color: { ...prev.border.color, ...(patch.color ?? {}) } } }) : null);
  };

  const setLogo = (patch: Partial<{ maxWidth: number }>) => {
    setForm((prev) => prev ? normalizeHeader({ ...prev, logo: { ...prev.logo, ...patch } }) : null);
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

  return (
    <div className="space-y-6">
       <div style={{
        position: "sticky",
        top: 0,
        zIndex: 50,
        background: "white",
        borderBottom: "1px solid rgba(0,0,0,0.08)",
        padding: "10px 12px",
        display: "flex",
        alignItems: "center",
        gap: 8
      }}>
        <div style={{ fontWeight: 600 }}>Header indstillinger</div>
        <div style={{ marginLeft: "auto" }}>
          <button
            onClick={handleSave}
            disabled={saving}
            style={{
              border: "1px solid rgba(0,0,0,0.1)",
              borderRadius: 8,
              padding: "8px 12px",
              fontSize: 14,
              background: saving ? "#F3F4F6" : "white",
              cursor: saving ? "not-allowed" : "pointer",
            }}
          >
            {saving ? "Gemmer…" : "Gem"}
          </button>
        </div>
      </div>
      {errorMsg ? <AlertBanner type="error" title="Gem fejlede" message={errorMsg} /> : null}
      
      <div>
        <h1 className="text-2xl font-bold">Header Settings</h1>
        <p className="text-muted-foreground">Manage the content and appearance of the site header.</p>
      </div>

      <Accordion type="multiple" defaultValue={['appearance', 'bg', 'border', 'nav']}>
        <AccordionItem value="appearance">
          <AccordionTrigger>Appearance</AccordionTrigger>
          <AccordionContent>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
               <section className="grid grid-cols-1 md:grid-cols-2 gap-4 col-span-full">
                  <div className="space-y-2">
                    <label className="font-medium">Logo URL (normal)</label>
                    <input
                      type="url"
                      placeholder="https://…/logo.png"
                      value={form?.logo?.src ?? ""}
                      onChange={(e) => setForm((f: any) => ({ ...f, logo: { ...(f.logo ?? {}), src: e.target.value } }))}
                      className="w-full rounded-md border px-3 py-2"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="font-medium">Logo URL (scrolled)</label>
                    <input
                      type="url"
                      placeholder="https://…/logo-scrolled.png"
                      value={form?.logo?.scrolledSrc ?? ""}
                      onChange={(e) => setForm((f: any) => ({ ...f, logo: { ...(f.logo ?? {}), scrolledSrc: e.target.value } }))}
                      className="w-full rounded-md border px-3 py-2"
                    />
                  </div>
                </section>
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
               <div className="space-y-2 rounded border p-3">
                  <label className="font-medium">Link color (HEX)</label>
                  <input
                    type="text"
                    placeholder="#111827"
                    value={form?.linkColorHex ?? ""}
                    onChange={(e) => setForm((f: any) => ({ ...f, linkColorHex: e.target.value }))}
                    className="w-full rounded-md border px-3 py-2"
                    onBlur={(e) => {
                      const v = e.target.value.trim();
                      if (v && !v.startsWith("#")) {
                        e.target.value = `#${v}`;
                        e.target.dispatchEvent(new Event("input", { bubbles: true }));
                      }
                    }}
                  />
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
                 <div className="space-y-2">
                    <label className="font-medium">Normal Background (HEX)</label>
                    <input
                      type="text"
                      placeholder="#FFFFFF"
                      value={form?.bg?.initial?.hex ?? ""}
                      onChange={(e) => setForm((f: any) => ({ 
                        ...f, 
                        bg: { ...(f.bg ?? {}), initial: { ...(f.bg?.initial ?? {}), hex: e.target.value } } 
                      }))}
                      className="w-full rounded-md border px-3 py-2"
                      onBlur={(e) => {
                          const v = e.target.value.trim();
                          if (v && !v.startsWith("#")) {
                            e.target.value = `#${v}`;
                            e.target.dispatchEvent(new Event("input", { bubbles: true }));
                          }
                      }}
                    />
                    {(() => {
                      const eff = effectiveColorHex({
                        hex: form?.bg?.initial?.hex,
                        h: form?.bg?.initial?.h,
                        s: form?.bg?.initial?.s,
                        l: form?.bg?.initial?.l,
                        opacity: form?.bg?.initial?.opacity
                      });
                      const label = form?.bg?.initial?.hex ? "Kilde: HEX" : "Kilde: HSL (fallback)";
                      return (
                        <div className="flex items-center gap-3 mt-2">
                          <div className="w-8 h-5 rounded border" style={{ background: eff ?? "transparent" }} />
                          <div className="text-sm text-muted-foreground">
                            Effektiv farve: <span className="font-medium">{eff ?? "—"}</span> <span>({label})</span>
                          </div>
                          <button
                            type="button"
                            onClick={() => {
                              const next = eff ?? "#FFFFFF";
                              setForm((f: any) => ({
                                ...f,
                                bg: {
                                  ...(f.bg ?? {}),
                                  initial: { ...(f.bg?.initial ?? {}), hex: next }
                                }
                              }));
                            }}
                            className="ml-auto rounded-md border px-2 py-1 text-sm"
                            title="Kopier effektiv farve til HEX-feltet"
                          >
                            Brug denne farve som HEX
                          </button>
                        </div>
                      );
                    })()}
                  </div>
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
                <div className="space-y-2">
                    <label className="font-medium">Scrolled Background (HEX)</label>
                    <input
                      type="text"
                      placeholder="#FFFFFF"
                      value={form?.bg?.scrolled?.hex ?? ""}
                      onChange={(e) => setForm((f: any) => ({ 
                        ...f, 
                        bg: { ...(f.bg ?? {}), scrolled: { ...(f.bg?.scrolled ?? {}), hex: e.target.value } } 
                      }))}
                      className="w-full rounded-md border px-3 py-2"
                       onBlur={(e) => {
                          const v = e.target.value.trim();
                          if (v && !v.startsWith("#")) {
                            e.target.value = `#${v}`;
                            e.target.dispatchEvent(new Event("input", { bubbles: true }));
                          }
                       }}
                    />
                     {(() => {
                      const eff = effectiveColorHex({
                        hex: form?.bg?.scrolled?.hex,
                        h: form?.bg?.scrolled?.h,
                        s: form?.bg?.scrolled?.s,
                        l: form?.bg?.scrolled?.l,
                        opacity: form?.bg?.scrolled?.opacity
                      });
                      const label = form?.bg?.scrolled?.hex ? "Kilde: HEX" : "Kilde: HSL (fallback)";
                      return (
                        <div className="flex items-center gap-3 mt-2">
                          <div className="w-8 h-5 rounded border" style={{ background: eff ?? "transparent" }} />
                          <div className="text-sm text-muted-foreground">
                            Effektiv farve: <span className="font-medium">{eff ?? "—"}</span> <span>({label})</span>
                          </div>
                          <button
                            type="button"
                            onClick={() => {
                              const next = eff ?? "#FFFFFF";
                              setForm((f: any) => ({
                                ...f,
                                bg: {
                                  ...(f.bg ?? {}),
                                  scrolled: { ...(f.bg?.scrolled ?? {}), hex: next }
                                }
                              }));
                            }}
                            className="ml-auto rounded-md border px-2 py-1 text-sm"
                            title="Kopier effektiv farve til HEX-feltet"
                          >
                            Brug denne farve som HEX
                          </button>
                        </div>
                      );
                    })()}
                  </div>
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
              <div className="rounded border p-3 space-y-3">
                 <div className="space-y-2">
                  <label className="font-medium">Border color (HEX)</label>
                  <input
                    type="text"
                    placeholder="#000000"
                    value={form?.border?.colorHex ?? ""}
                    onChange={(e) => setForm((f: any) => ({ 
                      ...f, 
                      border: { ...(f.border ?? {}), colorHex: e.target.value } 
                    }))}
                    className="w-full rounded-md border px-3 py-2"
                     onBlur={(e) => {
                        const v = e.target.value.trim();
                        if (v && !v.startsWith("#")) {
                          e.target.value = `#${v}`;
                          e.target.dispatchEvent(new Event("input", { bubbles: true }));
                        }
                     }}
                  />
                </div>
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
      {showToast ? <Toast text="Gemt ✔" /> : null}
    </div>
  );
}
