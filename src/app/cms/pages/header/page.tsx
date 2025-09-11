
'use client';
import { useState, useEffect, useTransition } from 'react';
import type { GeneralSettings, HeaderCTASettings, NavLink, HSLColor } from '@/types/settings';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Trash2 } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Slider } from '@/components/ui/slider';
import { useHeaderSettings } from '@/lib/hooks/useHeaderSettings';
import { ConflictDialog } from '@/components/admin/ConflictDialog';
import { type HeaderAppearanceInput } from '@/lib/validators/headerAppearance.zod';

const variants = ['default', 'destructive', 'outline', 'secondary', 'ghost', 'link', 'pill'] as const;
const sizes = ['default', 'sm', 'lg', 'icon'] as const;
const defaultNavLinks: NavLink[] = [
  { href: '#services', label: 'Services' },
  { href: '#cases', label: 'Cases' },
  { href: '#om-os', label: 'Om os' },
  { href: '#kontakt', label: 'Kontakt' },
];

function HslColorPicker({
  label,
  color,
  onChange,
}: {
  label: string;
  color: HSLColor;
  onChange: (hsl: HSLColor) => void;
}) {
    function hslToHex(h: number, s: number, l: number) {
      l /= 100;
      const a = (s * Math.min(l, 1 - l)) / 100;
      const f = (n: number) => {
        const k = (n + h / 30) % 12;
        const color = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
        return Math.round(255 * color).toString(16).padStart(2, "0");
      };
      return `#${f(0)}${f(8)}${f(4)}`;
    }
    function hexToHsl(hex: string): { h: number, s: number, l: number } | null {
        const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
        if (!result) return null;
        let r = parseInt(result[1], 16) / 255, g = parseInt(result[2], 16) / 255, b = parseInt(result[3], 16) / 255;
        let max = Math.max(r, g, b), min = Math.min(r, g, b);
        let h = 0, s = 0, l = (max + min) / 2;
        if (max === min) { h = s = 0; } else {
            var d = max - min;
            s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
            switch (max) {
                case r: h = (g - b) / d + (g < b ? 6 : 0); break;
                case g: h = (b - r) / d + 2; break;
                case b: h = (r - g) / d + 4; break;
            }
            h /= 6;
        }
        return { h: Math.round(h * 360), s: Math.round(s * 100), l: Math.round(l * 100) };
    }
    const [hexInputValue, setHexInputValue] = useState(hslToHex(color.h, color.s, color.l));
    useEffect(() => { setHexInputValue(hslToHex(color.h, color.s, color.l)); }, [color]);
    const handleColorChange = (part: 'h' | 's' | 'l', value: number) => { onChange({ ...color, [part]: value }); };
    const handleHexChange = (e: React.ChangeEvent<HTMLInputElement>) => { setHexInputValue(e.target.value); }
    const handleHexBlur = () => {
        const newHsl = hexToHsl(hexInputValue);
        if(newHsl) { onChange(newHsl); } else { setHexInputValue(hslToHex(color.h, color.s, color.l)); }
    }
    const handleHexKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => { if (e.key === 'Enter') { handleHexBlur(); (e.target as HTMLInputElement).blur(); } }
    return (
        <div className="space-y-4 p-4 border rounded-lg" style={{ backgroundColor: `hsl(${color.h}, ${color.s}%, ${color.l}%)` }}>
             <div className="flex justify-between items-center">
                 <h3 className="font-semibold text-lg" style={{ color: color.l > 50 ? '#000' : '#FFF' }}>{label}</h3>
                 <div className="flex items-center gap-2">
                    <span className="font-mono text-sm uppercase" style={{ color: color.l > 50 ? '#000' : '#FFF' }}>HEX</span>
                    <Input value={hexInputValue} onChange={handleHexChange} onBlur={handleHexBlur} onKeyDown={handleHexKeyPress} className="w-24 font-mono" style={{ backgroundColor: 'hsla(0, 0%, 100%, 0.2)', color: color.l > 50 ? '#000' : '#FFF', borderColor: 'hsla(0, 0%, 100%, 0.3)' }}/>
                </div>
            </div>
            <div className="space-y-2"> <Label style={{ color: color.l > 50 ? '#000' : '#FFF' }}>Hue ({color.h})</Label> <Slider value={[color.h]} onValueChange={([v]) => handleColorChange('h', v)} max={360} step={1} /> </div>
            <div className="space-y-2"> <Label style={{ color: color.l > 50 ? '#000' : '#FFF' }}>Saturation ({color.s}%)</Label> <Slider value={[color.s]} onValueChange={([v]) => handleColorChange('s', v)} max={100} step={1} /> </div>
            <div className="space-y-2"> <Label style={{ color: color.l > 50 ? '#000' : '#FFF' }}>Lightness ({color.l}%)</Label> <Slider value={[color.l]} onValueChange={([v]) => handleColorChange('l', v)} max={100} step={1} /> </div>
        </div>
    )
}

function HeaderAppearanceForm() {
  const [settings, setSettings] = useState<Partial<HeaderAppearanceInput>>({});
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, startSaving] = useTransition();
  const [conflict, setConflict] = useState<any>(null);
  const { toast } = useToast();

  const fetchAppearance = useCallback(async () => {
    setIsLoading(true);
    try {
        const res = await fetch('/api/pages/header/appearance');
        const json = await res.json();
        if (json.ok) {
            setSettings(json.data);
        } else {
            throw new Error(json.error || 'Failed to fetch appearance');
        }
    } catch (e) {
        console.error(e);
        toast({ title: 'Error', description: 'Could not load header appearance.', variant: 'destructive' });
    } finally {
        setIsLoading(false);
    }
  }, [toast]);
  
  useEffect(() => {
    fetchAppearance();
  }, [fetchAppearance]);
  
  const handleInputChange = (field: keyof HeaderAppearanceInput, value: any) => {
    setSettings(prev => ({ ...prev, [field]: value }));
  };

  const handleNavLinkChange = (index: number, field: keyof NavLink, value: string) => {
    const updatedLinks = [...(settings.headerNavLinks || defaultNavLinks)];
    updatedLinks[index] = { ...updatedLinks[index], [field]: value };
    handleInputChange('headerNavLinks', updatedLinks);
  };

  const addNavLink = () => {
    const updatedLinks = [...(settings.headerNavLinks || defaultNavLinks), { label: 'New Link', href: '#' }];
    handleInputChange('headerNavLinks', updatedLinks);
  };

  const removeNavLink = (index: number) => {
    const updatedLinks = (settings.headerNavLinks || defaultNavLinks).filter((_, i) => i !== index);
    handleInputChange('headerNavLinks', updatedLinks);
  };

  const handleSaveChanges = async (force = false, useVersion?: number) => {
    startSaving(async () => {
        setConflict(null);
        const payload: Partial<HeaderAppearanceInput> = { ...settings, version: useVersion ?? settings.version };
        try {
            const res = await fetch('/api/pages/header/appearance/save', {
                method: 'POST',
                headers: { 'content-type': 'application/json' },
                body: JSON.stringify(payload),
            });
            const json = await res.json();

            if (res.status === 409) {
                setConflict({ server: json.current, serverVersion: json.currentVersion });
                toast({ title: 'Conflict', description: 'Settings have been updated by someone else.', variant: 'destructive' });
                return;
            }
            if (!json.ok) throw new Error(json.error || 'Save failed');
            
            setSettings(json.data);
            toast({ title: "Saved!", description: "Header appearance has been saved." });
            window.dispatchEvent(new CustomEvent('design:updated', { detail: json.data }));

        } catch (e: any) {
            toast({ title: 'Error', description: e.message, variant: 'destructive' });
        }
    });
  };

  if (isLoading) {
    return <div className="flex justify-center items-center h-48"><Loader2 className="h-8 w-8 animate-spin" /></div>
  }

  return (
    <AccordionItem value="appearance" className="border rounded-lg shadow-sm">
         <ConflictDialog
            isOpen={!!conflict}
            onOpenChange={() => setConflict(null)}
            onReload={(serverData, serverVersion) => {
                setSettings({ ...settings, ...serverData, version: serverVersion });
                setConflict(null);
            }}
            onOverwrite={(serverVersion) => handleSaveChanges(true, serverVersion)}
            serverData={conflict?.server}
            serverVersion={conflict?.serverVersion}
        />
        <AccordionTrigger className="px-6 py-4 flex justify-between items-center w-full">
            <h3 className="font-semibold text-lg text-left">Header Appearance</h3>
        </AccordionTrigger>
        <AccordionContent className="p-6 border-t">
            <div className="flex justify-end mb-6">
                <Button onClick={() => handleSaveChanges()} disabled={isSaving}>
                    {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Save Appearance Settings
                </Button>
            </div>
            <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <div className="flex justify-between items-center">
                           <Label>Header Height</Label>
                           <span className="text-sm text-muted-foreground">{settings.headerHeight || 72}px</span>
                       </div>
                       <Slider 
                           value={[settings.headerHeight || 72]} 
                           onValueChange={([v]) => handleInputChange('headerHeight', v)}
                           min={50} max={120} step={1}
                       />
                    </div>
                     <div className="space-y-2">
                        <div className="flex justify-between items-center">
                           <Label>Logo Width</Label>
                           <span className="text-sm text-muted-foreground">{settings.headerLogoWidth || 120}px</span>
                       </div>
                       <Slider 
                           value={[settings.headerLogoWidth || 120]} 
                           onValueChange={([v]) => handleInputChange('headerLogoWidth', v)}
                           min={60} max={320} step={1}
                       />
                    </div>
                </div>

                 <div className="p-4 border rounded-lg space-y-4">
                    <h4 className='font-semibold'>Top Border</h4>
                     <div className="flex items-center justify-between">
                        <Label htmlFor='border-enabled'>Enable Top Border</Label>
                        <Switch id="border-enabled" checked={settings.headerTopBorderEnabled} onCheckedChange={v => handleInputChange('headerTopBorderEnabled', v)} />
                     </div>
                      <div className="space-y-2">
                        <div className="flex justify-between items-center">
                           <Label>Border Thickness</Label>
                           <span className="text-sm text-muted-foreground">{settings.headerTopBorderHeight || 0}px</span>
                       </div>
                       <Slider 
                           value={[settings.headerTopBorderHeight || 0]} 
                           onValueChange={([v]) => handleInputChange('headerTopBorderHeight', v)}
                           min={0} max={8} step={1}
                       />
                    </div>
                     <HslColorPicker
                        label="Border Color"
                        color={settings.headerTopBorderColor || { h: 0, s: 0, l: 85 }}
                        onChange={(hsl) => handleInputChange('headerTopBorderColor', hsl)}
                    />
                </div>

                <div className="p-4 border rounded-lg space-y-4">
                    <h4 className='font-semibold'>Normal Background</h4>
                     <div className="space-y-2">
                        <div className="flex justify-between items-center">
                           <Label>Opacity</Label>
                           <span className="text-sm text-muted-foreground">{settings.headerInitialBackgroundOpacity || 0}%</span>
                       </div>
                       <Slider 
                           value={[settings.headerInitialBackgroundOpacity || 0]} 
                           onValueChange={([v]) => handleInputChange('headerInitialBackgroundOpacity', v)}
                           min={0} max={100} step={1}
                       />
                    </div>
                     <HslColorPicker
                        label="Background Color"
                        color={settings.headerInitialBackgroundColor || { h: 0, s: 0, l: 100 }}
                        onChange={(hsl) => handleInputChange('headerInitialBackgroundColor', hsl)}
                    />
                </div>
                 <div className="p-4 border rounded-lg space-y-4">
                    <h4 className='font-semibold'>Scrolled Background</h4>
                     <div className="space-y-2">
                        <div className="flex justify-between items-center">
                           <Label>Opacity</Label>
                           <span className="text-sm text-muted-foreground">{settings.headerScrolledBackgroundOpacity || 100}%</span>
                       </div>
                       <Slider 
                           value={[settings.headerScrolledBackgroundOpacity || 100]} 
                           onValueChange={([v]) => handleInputChange('headerScrolledBackgroundOpacity', v)}
                           min={0} max={100} step={1}
                       />
                    </div>
                     <HslColorPicker
                        label="Scrolled Background Color"
                        color={settings.headerScrolledBackgroundColor || { h: 0, s: 0, l: 100 }}
                        onChange={(hsl) => handleInputChange('headerScrolledBackgroundColor', hsl)}
                    />
                </div>

                 <div className="space-y-4">
                    <Label>Navigation Links</Label>
                    {(settings.headerNavLinks || defaultNavLinks).map((link, index) => (
                        <div key={index} className="flex items-center gap-2 p-2 border rounded-md">
                            <Input value={link.label} onChange={(e) => handleNavLinkChange(index, 'label', e.target.value)} placeholder="Label" />
                            <Input value={link.href} onChange={(e) => handleNavLinkChange(index, 'href', e.target.value)} placeholder="Href (#section or /path)" />
                            <Button variant="ghost" size="icon" onClick={() => removeNavLink(index)}><Trash2 className="h-4 w-4 text-destructive" /></Button>
                        </div>
                    ))}
                    <Button variant="outline" onClick={addNavLink}>Add Link</Button>
                </div>
            </div>
        </AccordionContent>
    </AccordionItem>
  )
}

function CtaSettingsForm() {
    const { settings: ctaSettings, isLoading, setSettings } = useHeaderSettings();
    const [isSaving, startSaving] = useTransition();
    const [conflict, setConflict] = useState<any>(null);
    const { toast } = useToast();

    if (isLoading || !ctaSettings) {
        return (
          <div className="flex justify-center items-center h-48">
            <Loader2 className="h-8 w-8 animate-spin" />
          </div>
        );
    }
  
    const handleCtaChange = (field: keyof HeaderCTASettings, value: any) => {
        setSettings(prev => prev ? ({ ...prev, [field]: value }) : undefined);
    }

    const handleMobileCtaChange = (field: keyof HeaderCTASettings['mobileFloating'], value: any) => {
        setSettings(prev => prev ? ({
            ...prev,
            mobileFloating: {
                ...(prev.mobileFloating ?? { enabled: false, position: 'br' }),
                [field]: value,
            }
        }) : undefined)
    }

    const handleSaveChanges = async (force = false, useVersion?: number) => {
        if (!ctaSettings) return;

        startSaving(async () => {
            setConflict(null);
            const payload = {
                ...ctaSettings,
                version: useVersion ?? (ctaSettings as any).version,
            };

            const res = await fetch('/api/pages/header/save', {
                method: 'POST',
                headers: { 'content-type': 'application/json', 'x-user': 'cms-user' },
                body: JSON.stringify(payload),
                cache: 'no-store',
            });

            const json = await res.json();

            if (res.status === 409) {
                setConflict({ server: json.data, serverVersion: json.version });
                toast({ title: 'Conflict', description: 'Settings have been updated by someone else.', variant: 'destructive' });
                return;
            }

            if (!json.ok) {
                 toast({ title: "Error!", description: json.error || 'Save failed', variant: 'destructive' });
                 return;
            }
            
            setSettings(json.data);
            toast({ title: "Saved!", description: "CTA settings have been saved." });
            window.dispatchEvent(new CustomEvent('pages:header:updated', { detail: json.data }));
        });
    }

    return (
        <AccordionItem value="cta" className="border rounded-lg shadow-sm">
             <ConflictDialog
                isOpen={!!conflict}
                onOpenChange={() => setConflict(null)}
                onReload={(serverData, serverVersion) => {
                    setSettings({ ...serverData, version: serverVersion } as HeaderCTASettings);
                    setConflict(null);
                }}
                onOverwrite={(serverVersion) => handleSaveChanges(true, serverVersion)}
                serverData={conflict?.server}
                serverVersion={conflict?.serverVersion}
            />
            <AccordionTrigger className="px-6 py-4 flex justify-between items-center w-full">
                <h3 className="font-semibold text-lg text-left">Header CTA Settings</h3>
            </AccordionTrigger>
            <AccordionContent className="p-6 border-t">
                 <div className="flex justify-end mb-6">
                    <Button onClick={() => handleSaveChanges()} disabled={isSaving}>
                        {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        Save CTA Settings
                    </Button>
                </div>
                <div className="space-y-6">
                    <div className="flex items-center justify-between rounded-lg border p-4">
                        <div className="space-y-0.5">
                            <Label htmlFor="cta-enabled" className="text-base">Enable Header CTA</Label>
                             <p className="text-sm text-muted-foreground">Show a Call-to-Action button in the header.</p>
                        </div>
                        <Switch
                            id="cta-enabled"
                            checked={ctaSettings.enabled}
                            onCheckedChange={checked => handleCtaChange('enabled', checked)}
                        />
                    </div>

                  {ctaSettings.enabled && (
                    <div className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                            <Label>Label</Label>
                            <Input value={ctaSettings.label} onChange={e=>handleCtaChange('label',e.target.value)}/>
                            </div>

                            <div className="space-y-2">
                            <Label>Link Type</Label>
                            <Select value={ctaSettings.linkType} onValueChange={(v: 'internal' | 'external') => handleCtaChange('linkType', v)}>
                                <SelectTrigger><SelectValue/></SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="internal">Internal (#section)</SelectItem>
                                    <SelectItem value="external">External (URL)</SelectItem>
                                </SelectContent>
                            </Select>
                            </div>

                            <div className="md:col-span-2 space-y-2">
                            <Label>Href</Label>
                            <Input placeholder={ctaSettings.linkType==='internal'?'#section-id':'https://domain.com'}
                                    value={ctaSettings.href} onChange={e=>handleCtaChange('href',e.target.value)}/>
                            </div>

                            <div className="space-y-2">
                            <Label>Variant</Label>
                            <Select value={ctaSettings.variant} onValueChange={(v: any) => handleCtaChange('variant', v)}>
                                <SelectTrigger><SelectValue/></SelectTrigger>
                                <SelectContent>
                                    {variants.map(v=> <SelectItem key={v} value={v}>{v}</SelectItem>)}
                                </SelectContent>
                            </Select>
                            </div>

                            <div className="space-y-2">
                            <Label>Size</Label>
                            <Select value={ctaSettings.size} onValueChange={(v: any) => handleCtaChange('size', v)}>
                                <SelectTrigger><SelectValue/></SelectTrigger>
                                <SelectContent>
                                     {sizes.map(v=> <SelectItem key={v} value={v}>{v}</SelectItem>)}
                                </SelectContent>
                            </Select>
                            </div>
                        </div>

                        <fieldset className="border rounded-lg p-4 space-y-4">
                            <legend className="px-1 text-sm font-medium -ml-1">Mobile: Floating CTA</legend>
                             <div className="flex items-center justify-between">
                                <div className="space-y-0.5">
                                    <Label htmlFor="mobile-cta-enabled" className="text-base">Enable Mobile Floating</Label>
                                    <p className="text-sm text-muted-foreground">Show a fixed button at the bottom on mobile screens.</p>
                                </div>
                                 <Switch
                                    id="mobile-cta-enabled"
                                    checked={ctaSettings.mobileFloating?.enabled}
                                    onCheckedChange={checked => handleMobileCtaChange('enabled', checked)}
                                />
                            </div>

                            {ctaSettings.mobileFloating?.enabled && (
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div className="space-y-2">
                                <Label>Position</Label>
                                 <Select value={ctaSettings.mobileFloating?.position} onValueChange={(v: any) => handleMobileCtaChange('position', v)}>
                                    <SelectTrigger><SelectValue/></SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="br">Bottom Right</SelectItem>
                                        <SelectItem value="bl">Bottom Left</SelectItem>
                                    </SelectContent>
                                </Select>
                                </div>
                                <div className="space-y-2">
                                    <Label>Offset X (px)</Label>
                                    <Input type="number" min={0} value={ctaSettings.mobileFloating?.offsetX ?? 16}
                                            onChange={e=>handleMobileCtaChange('offsetX', Number(e.target.value))}/>
                                </div>
                                <div className="space-y-2">
                                    <Label>Offset Y (px)</Label>
                                    <Input type="number" min={0} value={ctaSettings.mobileFloating?.offsetY ?? 16}
                                            onChange={e=>handleMobileCtaChange('offsetY', Number(e.target.value))}/>
                                </div>
                            </div>
                            )}
                        </fieldset>
                    </div>
                  )}
                </div>
            </AccordionContent>
        </AccordionItem>
    );
}

export default function HeaderPage(){
  return (
    <div className="space-y-6">
        <div>
            <h1 className="text-2xl font-bold">Header Settings</h1>
            <p className="text-muted-foreground">Manage the content and appearance of the site header.</p>
        </div>
      <Accordion type="multiple" defaultValue={['appearance', 'cta']} className="w-full space-y-4">
        <HeaderAppearanceForm />
        <CtaSettingsForm />
      </Accordion>
    </div>
  );
}
