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

const defaultLinks: NavLink[] = [
  { label: 'Online ordre', href: '/#online-orders' },
  { label: 'Priser', href: '/#pricing' },
  { label: 'Kunder', href: '/#customers' },
  { label: 'Kontakt', href: '/#contact' },
];

async function fetchSettings(): Promise<HeaderSettings | undefined> {
  const res = await fetch('/api/pages/header/appearance', { cache: 'no-store' });
  const json = await res.json();
  if (json?.success && json?.data?.header) return json.data.header as HeaderSettings;
  return undefined;
}

async function saveSettings(payload: Partial<HeaderSettings>): Promise<boolean> {
  const res = await fetch('/api/pages/header/appearance/save', {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ header: payload }),
  });
  const json = await res.json();
  return Boolean(json?.success);
}

export default function HeaderPage() {
  const [settings, setSettings] = useState<HeaderSettings | undefined>(undefined);
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
    setSettings((prev) => ({ ...prev, ...patch } as HeaderSettings));
  };

  const setBgInitial = (patch: Partial<HeaderSettings['bg']['initial']>) => {
    setSettings((prev) =>
      prev
        ? { ...prev, bg: { ...prev.bg, initial: { ...prev.bg.initial, ...patch } } }
        : prev
    );
  };

  const setBgScrolled = (patch: Partial<HeaderSettings['bg']['scrolled']>) => {
    setSettings((prev) =>
      prev
        ? { ...prev, bg: { ...prev.bg, scrolled: { ...prev.bg.scrolled, ...patch } } }
        : prev
    );
  };

  const setBorder = (patch: any) => {
    setSettings((prev) =>
      prev
        ? { ...prev, border: { ...prev.border, ...patch } }
        : prev
    );
  };

  const setLogo = (patch: any) => {
    setSettings((prev) =>
      prev
        ? { ...prev, logo: { ...prev.logo, ...patch } }
        : prev
    );
  };

  const setNavLink = (idx: number, field: keyof NavLink, value: string) => {
    const arr = [...(s?.navLinks ?? defaultLinks)];
    arr[idx] = { ...arr[idx], [field]: value };
    setHeader({ navLinks: arr });
  };

  const addNavLink = () => {
    setHeader({ navLinks: [...(s?.navLinks ?? defaultLinks), { label: 'New Link', href: '#' }] });
  };

  const removeNavLink = (idx: number) => {
    setHeader({ navLinks: (s?.navLinks ?? defaultLinks).filter((_, i) => i !== idx) });
  };

  const onSave = () => {
    if (!settings) return;
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

      <Accordion type="multiple" defaultValue={['appearance', 'bg', 'border', 'nav', 'brand']}>
        <AccordionItem value="appearance">
          <AccordionTrigger>Appearance</AccordionTrigger>
          <AccordionContent>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div className="flex items-center justify-between rounded border p-3">
                <Label>Overlay</Label>
                <Switch checked={Boolean(s?.overlay)} onCheckedChange={(v) => setHeader({ overlay: v })} />
              </div>
              <div className="flex items-center justify-between rounded border p-3">
                <Label>Sticky</Label>
                <Switch checked={Boolean(s?.sticky)} onCheckedChange={(v) => setHeader({ sticky: v })} />
              </div>
              <div className="rounded border p-3">
                <Label>Height (px)</Label>
                <Input
                  type="number"
                  value={s?.height ?? 72}
                  onChange={(e) => setHeader({ height: Number(e.target.value) })}
                />
              </div>
              <div className="rounded border p-3">
                <Label>Logo max width (px)</Label>
                <Input
                  type="number"
                  value={s?.logo?.maxWidth ?? 140}
                  onChange={(e) => setLogo({ maxWidth: Number(e.target.value) })}
                />
              </div>
              <div className="rounded border p-3">
                <Label>Link color</Label>
                <Select value={s?.linkColor ?? 'white'} onValueChange={(v) => setHeader({ linkColor: v as any })}>
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
                <Input type="number" value={s?.bg?.initial?.h ?? 0} onChange={(e) => setBgInitial({ h: Number(e.target.value) })} />
                <Label>S</Label>
                <Input type="number" value={s?.bg?.initial?.s ?? 0} onChange={(e) => setBgInitial({ s: Number(e.target.value) })} />
                <Label>L</Label>
                <Input type="number" value={s?.bg?.initial?.l ?? 100} onChange={(e) => setBgInitial({ l: Number(e.target.value) })} />
                <OpacitySlider label="Opacity" value01={s?.bg?.initial?.opacity ?? 1} onChange01={(v) => setBgInitial({ opacity: v })} />
              </div>

              <div className="rounded border p-3 space-y-3">
                <div className="font-medium">Scrolled</div>
                <Label>H</Label>
                <Input type="number" value={s?.bg?.scrolled?.h ?? 210} onChange={(e) => setBgScrolled({ h: Number(e.target.value) })} />
                <Label>S</Label>
                <Input type="number" value={s?.bg?.scrolled?.s ?? 100} onChange={(e) => setBgScrolled({ s: Number(e.target.value) })} />
                <Label>L</Label>
                <Input type="number" value={s?.bg?.scrolled?.l ?? 95} onChange={(e) => setBgScrolled({ l: Number(e.target.value) })} />
                <OpacitySlider label="Opacity" value01={s?.bg?.scrolled?.opacity ?? 0.98} onChange01={(v) => setBgScrolled({ opacity: v })} />
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
                <Switch checked={Boolean(s?.border?.enabled)} onCheckedChange={(v) => setBorder({ enabled: v })} />
              </div>
              <div className="rounded border p-3">
                <Label>Width (px)</Label>
                <Input type="number" value={s?.border?.width ?? 1} onChange={(e) => setBorder({ width: Number(e.target.value) })} />
              </div>
              <div className="rounded border p-3">
                <Label>Color H</Label>
                <Input type="number" value={s?.border?.color?.h ?? 220} onChange={(e) => setBorder({ color: { ...(s?.border?.color ?? {}), h: Number(e.target.value) } })} />
                <Label>Color S</Label>
                <Input type="number" value={s?.border?.color?.s ?? 13} onChange={(e) => setBorder({ color: { ...(s?.border?.color ?? {}), s: Number(e.target.value) } })} />
                <Label>Color L</Label>
                <Input type="number" value={s?.border?.color?.l ?? 91} onChange={(e) => setBorder({ color: { ...(s?.border?.color ?? {}), l: Number(e.target.value) } })} />
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="nav">
          <AccordionTrigger>Navigation links</AccordionTrigger>
          <AccordionContent>
            <div className="space-y-3">
              {(s?.navLinks ?? defaultLinks).map((lnk, i) => (
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
