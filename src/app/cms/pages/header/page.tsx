
'use client';

import React, { useState, useCallback, useEffect, useTransition } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import OpacitySlider from '@/components/cms/OpacitySlider';
import type { NavLink } from '@/types/settings';
import { notifySuccess, notifyError } from "@/lib/ui/notify";

// Helper functions (previously inside the component)
async function loadHeaderAppearance() {
  const r = await fetch("/api/pages/header/appearance", { cache: "no-store" });
  const j = await r.json();
  if (!j?.ok) throw new Error(j?.message || "Load failed");
  return j.data;
}

async function saveHeaderAppearance(payload: any) {
  const r = await fetch("/api/pages/header/appearance/save", {
    method: "POST",
    headers: { "Content-Type": "application/json", Accept: "application/json" },
    body: JSON.stringify(payload),
  });
  const j = await r.json();
  if (!j?.ok) throw new Error(j?.message || "Save failed");
  return true;
}

function effectiveColorHex(opt: {
  hex?: string | null;
  h?: number; s?: number; l?: number;
  opacity?: number;
}): string | null {
  const hex = opt.hex?.trim();
  if (hex) return hex;
  if (typeof opt.h === "number" && typeof opt.s === "number" && typeof opt.l === "number") {
    // Re-implementing a simple hslToHex for this scope
    const _s = Math.max(0, Math.min(1, opt.s / 100));
    const _l = Math.max(0, Math.min(1, opt.l / 100));
    const c = (1 - Math.abs(2 * _l - 1)) * _s;
    const hp = (opt.h % 360) / 60;
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
  return null;
}


export default function HeaderCmsPage() {
  const [form, setForm] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isSaving, startSaving] = useTransition();

  // 1) LOAD
  useEffect(() => {
    (async () => {
      try {
        const data = await loadHeaderAppearance();
        setForm(data);
      } catch (e: any) {
        notifyError("Kunne ikke hente header-data: " + (e?.message ?? "Ukendt fejl"));
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  // 2) SAVE (shared by button, shortcut, global hook)
  const onSave = useCallback(() => {
    if (!form || isSaving) return;
    startSaving(async () => {
      try {
        await saveHeaderAppearance(form);
        notifySuccess("Header gemt", 1000); // auto-hide ~1s
      } catch (e: any) {
        notifyError("Fejl under gemning: " + (e?.message ?? "Ukendt fejl"));
      }
    });
  }, [form, isSaving]);


  // 3) Global save-hook for CMS shell
  useEffect(() => {
    (globalThis as any).__HEADER_SAVE__ = onSave;
    return () => {
      if ((globalThis as any).__HEADER_SAVE__ === onSave) {
        (globalThis as any).__HEADER_SAVE__ = undefined;
      }
    };
  }, [onSave]);

  // 4) Keyboard shortcut: Cmd/Ctrl + S
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      const isMac = navigator.platform.toUpperCase().includes("MAC");
      const pressed = isMac ? e.metaKey : e.ctrlKey;
      if (pressed && e.key.toLowerCase() === "s") {
        e.preventDefault();
        onSave();
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onSave]);


  if (loading) return <div className="p-4 text-sm text-muted-foreground">Indlæser…</div>;
  if (!form) return <div className="p-4 text-sm text-red-600">Ingen data</div>;

  const s = form; // short alias for form state

  // State updaters
  const setHeader = (patch: Partial<any>) => setForm((prev: any) => ({ ...prev, ...patch }));
  const setBgInitial = (patch: Partial<any>) => setForm((prev: any) => ({ ...prev, topBg: { ...(prev.topBg ?? {}), ...patch } }));
  const setBgScrolled = (patch: Partial<any>) => setForm((prev: any) => ({ ...prev, scrolledBg: { ...(prev.scrolledBg ?? {}), ...patch } }));
  const setBorder = (patch: Partial<any>) => setForm((prev: any) => ({ ...prev, border: { ...(prev.border ?? {}), ...patch } }));
  const setLogo = (patch: Partial<any>) => setForm((prev: any) => ({ ...prev, logo: { ...(prev.logo ?? {}), ...patch } }));

  const setNavLink = (idx: number, field: keyof NavLink, value: string) => {
    const arr = [...(s.navLinks ?? [])];
    arr[idx] = { ...arr[idx], [field]: value };
    setHeader({ navLinks: arr });
  };
  const addNavLink = () => setHeader({ navLinks: [...(s.navLinks ?? []), { label: 'New Link', href: '#' }] });
  const removeNavLink = (idx: number) => setHeader({ navLinks: (s.navLinks ?? []).filter((_: any, i: number) => i !== idx) });


  return (
    <div className="flex flex-col">
      {/* === TOP ACTION BAR (sticky) === */}
      <div className="sticky top-0 z-40 border-b bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="mx-auto flex items-center gap-3 px-4 py-3 max-w-7xl">
          <h1 className="text-sm font-medium">Header · Udseende</h1>
          <div className="ml-auto">
            <button
              onClick={onSave}
              disabled={isSaving}
              className="inline-flex items-center rounded-md bg-primary px-4 py-2 text-primary-foreground text-sm font-medium hover:opacity-90 disabled:opacity-50"
            >
              {isSaving ? "Gemmer…" : "Gem"}
            </button>
          </div>
        </div>
      </div>

      {/* === FORM FIELDS === */}
      <div className="mx-auto px-4 py-6 space-y-8 max-w-7xl">
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
                          onChange={(e) => setLogo({ src: e.target.value })}
                          className="w-full rounded-md border px-3 py-2"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="font-medium">Logo URL (scrolled)</label>
                        <input
                          type="url"
                          placeholder="https://…/logo-scrolled.png"
                          value={form?.logo?.scrolledSrc ?? ""}
                          onChange={(e) => setLogo({ scrolledSrc: e.target.value })}
                          className="w-full rounded-md border px-3 py-2"
                        />
                      </div>
                    </section>
                  <div className="flex items-center justify-between rounded border p-3">
                    <Label>Overlay</Label>
                    <Switch checked={Boolean(s.isOverlay)} onCheckedChange={(v) => setHeader({ isOverlay: v })} />
                  </div>
                  <div className="flex items-center justify-between rounded border p-3">
                    <Label>Sticky</Label>
                    <Switch checked={Boolean(s.headerIsSticky)} onCheckedChange={(v) => setHeader({ headerIsSticky: v })} />
                  </div>
                  <div className="rounded border p-3">
                    <Label>Height (px)</Label>
                    <Input type="number" value={s.headerHeight ?? 72} onChange={(e) => setHeader({ headerHeight: Number(e.target.value) })} />
                  </div>
                  <div className="rounded border p-3">
                    <Label>Logo max width (px)</Label>
                    <Input type="number" value={s.headerLogoWidth ?? 140} onChange={(e) => setHeader({ headerLogoWidth: Number(e.target.value) })} />
                  </div>
                  <div className="rounded border p-3">
                    <Label>Link color</Label>
                    <Select value={s.headerLinkColor ?? 'white'} onValueChange={(v) => setHeader({ headerLinkColor: v as any })}>
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
                        value={form?.headerLinkColorHex ?? ""}
                        onChange={(e) => setHeader({ headerLinkColorHex: e.target.value })}
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
                        <div className="space-y-1">
                          <label className="block text-sm font-medium">Baggrund (normal) – HEX</label>
                          <input
                            type="text"
                            placeholder="#ffffff"
                            className="w-full rounded border bg-background px-3 py-2 text-sm"
                            value={form?.topBg?.hex ?? ""}
                            onChange={(e) =>
                              setForm((f: any) => ({
                                ...f,
                                topBg: { ...(f.topBg ?? {}), hex: e.target.value }
                              }))
                            }
                          />
                          <p className="text-xs text-muted-foreground">Brug HEX. Hvis udfyldt, har den højere prioritet end HSL.</p>
                        </div>
                        {(() => {
                          const eff = effectiveColorHex({
                            hex: form?.topBg?.hex,
                            h: form?.topBg?.h,
                            s: form?.topBg?.s,
                            l: form?.topBg?.l,
                            opacity: form?.topBg?.opacity
                          });
                          const label = form?.topBg?.hex ? "Kilde: HEX" : "Kilde: HSL (fallback)";
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
                                  setBgInitial({ hex: next });
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
                    <Input type="number" value={s.topBg.h} onChange={(e) => setBgInitial({ h: Number(e.target.value) })} />
                    <Label>S</Label>
                    <Input type="number" value={s.topBg.s} onChange={(e) => setBgInitial({ s: Number(e.target.value) })} />
                    <Label>L</Label>
                    <Input type="number" value={s.topBg.l} onChange={(e) => setBgInitial({ l: Number(e.target.value) })} />
                    <OpacitySlider label="Opacity" value01={(s.topBg.opacity ?? 0) / 100} onChange01={(v) => setBgInitial({ opacity: v * 100 })} />
                  </div>

                  <div className="rounded border p-3 space-y-3">
                    <div className="font-medium">Scrolled</div>
                    <div className="space-y-2">
                        <div className="space-y-1">
                          <label className="block text-sm font-medium">Baggrund (scrolled) – HEX</label>
                          <input
                            type="text"
                            placeholder="#ffffff"
                            className="w-full rounded border bg-background px-3 py-2 text-sm"
                            value={form?.scrolledBg?.hex ?? ""}
                            onChange={(e) =>
                              setForm((f: any) => ({
                                ...f,
                                scrolledBg: { ...(f.scrolledBg ?? {}), hex: e.target.value } 
                              }))
                            }
                          />
                        </div>
                         {(() => {
                          const eff = effectiveColorHex({
                            hex: form?.scrolledBg?.hex,
                            h: form?.scrolledBg?.h,
                            s: form?.scrolledBg?.s,
                            l: form?.scrolledBg?.l,
                            opacity: form?.scrolledBg?.opacity
                          });
                          const label = form?.scrolledBg?.hex ? "Kilde: HEX" : "Kilde: HSL (fallback)";
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
                                  setBgScrolled({ hex: next });
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
                    <Input type="number" value={s.scrolledBg.h} onChange={(e) => setBgScrolled({ h: Number(e.target.value) })} />
                    <Label>S</Label>
                    <Input type="number" value={s.scrolledBg.s} onChange={(e) => setBgScrolled({ s: Number(e.target.value) })} />
                    <Label>L</Label>
                    <Input type="number" value={s.scrolledBg.l} onChange={(e) => setBgScrolled({ l: Number(e.target.value) })} />
                    <OpacitySlider label="Opacity" value01={(s.scrolledBg.opacity ?? 0) / 100} onChange01={(v) => setBgScrolled({ opacity: v * 100 })} />
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
                    <Input type="number" value={s.border.widthPx} onChange={(e) => setBorder({ widthPx: Number(e.target.value) })} />
                  </div>
                  <div className="rounded border p-3 space-y-3">
                     <div className="space-y-1">
                      <label className="block text-sm font-medium">Border – HEX</label>
                      <input
                        type="text"
                        placeholder="#000000"
                        className="w-full rounded border bg-background px-3 py-2 text-sm"
                        value={form?.border?.colorHex ?? ""}
                        onChange={(e) =>
                          setForm((f: any) => ({
                            ...f,
                            border: { ...(f.border ?? {}), colorHex: e.target.value },
                          }))
                        }
                      />
                      <p className="text-xs text-muted-foreground">Bruges hvis sat; ellers falder vi tilbage til HSL-farven.</p>
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
                  {(s.navLinks ?? []).map((lnk: NavLink, i: number) => (
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
      </div>
    </div>
  );
}
