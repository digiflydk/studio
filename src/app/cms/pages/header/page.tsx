
'use client';

import { useState, useEffect, useTransition } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { useToast } from '@/hooks/use-toast';
import type { GeneralSettings, NavLink, HeaderCTASettings } from '@/types/settings';
import { getSettingsAction, saveSettingsAction } from '@/app/actions';
import { Loader2, Trash2 } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';

function hslToHex(h: number, s: number, l: number) {
  l /= 100;
  const a = (s * Math.min(l, 1 - l)) / 100;
  const f = (n: number) => {
    const k = (n + h / 30) % 12;
    const color = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
    return Math.round(255 * color)
      .toString(16)
      .padStart(2, "0");
  };
  return `#${f(0)}${f(8)}${f(4)}`;
}

function hexToHsl(hex: string): { h: number, s: number, l: number } | null {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  if (!result) return null;

  let r = parseInt(result[1], 16) / 255;
  let g = parseInt(result[2], 16) / 255;
  let b = parseInt(result[3], 16) / 255;

  let max = Math.max(r, g, b), min = Math.min(r, g, b);
  let h = 0, s = 0, l = (max + min) / 2;

  if (max === min) {
    h = s = 0; // achromatic
  } else {
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

function HslColorPicker({
  label,
  color,
  onChange,
}: {
  label: string;
  color: { h: number; s: number; l: number };
  onChange: (hsl: { h: number; s: number; l: number }) => void;
}) {
    const [hexInputValue, setHexInputValue] = useState('');
    
    useEffect(() => {
        if (color) {
            setHexInputValue(hslToHex(color.h, color.s, color.l));
        }
    }, [color]);

    const handleColorChange = (part: 'h' | 's' | 'l', value: number) => {
        onChange({ ...(color || {h:0,s:0,l:100}), [part]: value });
    };

    const handleHexChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setHexInputValue(e.target.value);
    }

    const handleHexBlur = () => {
        const newHsl = hexToHsl(hexInputValue);
        if(newHsl) {
            onChange(newHsl);
        } else {
            if (color) {
                setHexInputValue(hslToHex(color.h, color.s, color.l));
            }
        }
    }
  
    const handleHexKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            handleHexBlur();
            (e.target as HTMLInputElement).blur();
        }
    }

    if (!color) return null;

    return (
        <div className="space-y-4 p-4 border rounded-lg" style={{ backgroundColor: `hsl(${color.h}, ${color.s}%, ${color.l}%)` }}>
            <div className="flex justify-between items-center">
                 <h3 className="font-semibold text-lg" style={{ color: color.l > 50 ? '#000' : '#FFF' }}>{label}</h3>
                 <div className="flex items-center gap-2">
                    <span className="font-mono text-sm uppercase" style={{ color: color.l > 50 ? '#000' : '#FFF' }}>HEX</span>
                    <Input 
                        value={hexInputValue}
                        onChange={handleHexChange}
                        onBlur={handleHexBlur}
                        onKeyDown={handleHexKeyPress}
                        className="w-24 font-mono"
                        style={{
                            backgroundColor: 'hsla(0, 0%, 100%, 0.2)',
                            color: color.l > 50 ? '#000' : '#FFF',
                            borderColor: 'hsla(0, 0%, 100%, 0.3)'
                        }}
                    />
                </div>
            </div>
            <div className="space-y-2">
                <Label style={{ color: color.l > 50 ? '#000' : '#FFF' }}>Hue ({color.h})</Label>
                <Slider value={[color.h]} onValueChange={([v]) => handleColorChange('h', v)} max={360} step={1} />
            </div>
            <div className="space-y-2">
                <Label style={{ color: color.l > 50 ? '#000' : '#FFF' }}>Saturation ({color.s}%)</Label>
                <Slider value={[color.s]} onValueChange={([v]) => handleColorChange('s', v)} max={100} step={1} />
            </div>
            <div className="space-y-2">
                <Label style={{ color: color.l > 50 ? '#000' : '#FFF' }}>Lightness ({color.l}%)</Label>
                <Slider value={[color.l]} onValueChange={([v]) => handleColorChange('l', v)} max={100} step={1} />
            </div>
        </div>
    )
}

const themeColorOptions = [
    { value: 'text-primary', label: 'Primary' },
    { value: 'text-secondary-foreground', label: 'Secondary' },
    { value: 'text-accent', label: 'Accent' },
    { value: 'text-foreground', label: 'Default Text' },
    { value: 'text-muted-foreground', label: 'Muted Text' },
    { value: 'text-white', label: 'White' },
    { value: 'text-black', label: 'Black' },
] as const;

type ThemeColor = typeof themeColorOptions[number]['value'];

function NavLinkStyleEditor({
    label,
    colorValue,
    onColorChange,
    hoverColorValue,
    onHoverColorChange,
    sizeValue,
    onSizeChange,
    iconColorValue,
    onIconColorChange,
}: {
    label: string;
    colorValue: ThemeColor;
    onColorChange: (value: ThemeColor) => void;
    hoverColorValue: ThemeColor;
    onHoverColorChange: (value: ThemeColor) => void;
    sizeValue: number;
    onSizeChange: (value: number) => void;
    iconColorValue: ThemeColor;
    onIconColorChange: (value: ThemeColor) => void;
}) {
    return (
        <div className="p-4 border rounded-lg space-y-4">
            <h3 className="font-semibold">{label}</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Label>Text Color</Label>
                    <Select value={colorValue} onValueChange={onColorChange}>
                        <SelectTrigger><SelectValue/></SelectTrigger>
                        <SelectContent>
                            {themeColorOptions.map(opt => (
                                <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
                 <div className="space-y-2">
                    <Label>Hover Color</Label>
                    <Select value={hoverColorValue} onValueChange={onHoverColorChange}>
                        <SelectTrigger><SelectValue/></SelectTrigger>
                        <SelectContent>
                            {themeColorOptions.map(opt => (
                                <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
            </div>
            <div className="space-y-2">
                <div className="flex justify-between items-center">
                    <Label>Text Size</Label>
                    <span className="text-sm text-muted-foreground">{sizeValue}px</span>
                </div>
                <Slider 
                    value={[sizeValue]} 
                    onValueChange={([v]) => onSizeChange(v)}
                    min={12}
                    max={24}
                    step={1}
                />
            </div>
            <div className="space-y-2">
                <Label>Mobile Menu Icon Color</Label>
                <Select value={iconColorValue} onValueChange={onIconColorChange}>
                    <SelectTrigger><SelectValue/></SelectTrigger>
                    <SelectContent>
                        {themeColorOptions.map(opt => (
                            <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>
        </div>
    );
}

const sectionLinks = [
    { value: '#hero', label: 'Hero Section' },
    { value: '#services', label: 'Services' },
    { value: '#ai-project', label: 'AI Project' },
    { value: '#cases', label: 'Cases' },
    { value: '#om-os', label: 'About Us' },
    { value: '#kontakt', label: 'Contact' },
    { value: 'custom', label: 'Custom link' },
]

function NavLinkEditor({ item, updateItem }: { item: NavLink, updateItem: (data: NavLink) => void }) {
    const isCustomLink = !sectionLinks.some(l => l.value === item.href);
    const selectValue = isCustomLink ? 'custom' : item.href;

    const handleSelectChange = (value: string) => {
        if (value === 'custom') {
            updateItem({ ...item, href: '' });
        } else {
            updateItem({ ...item, href: value });
        }
    };
    
    return (
        <div className="space-y-4">
            <div className="space-y-2">
                <Label htmlFor={`label-${item.label}`}>Text</Label>
                <Input
                    id={`label-${item.label}`}
                    value={item.label}
                    onChange={e => updateItem({ ...item, label: e.target.value })}
                />
            </div>
            <div className="space-y-2">
                <Label htmlFor={`href-select-${item.label}`}>Link To</Label>
                <Select value={selectValue} onValueChange={handleSelectChange}>
                    <SelectTrigger id={`href-select-${item.label}`}><SelectValue/></SelectTrigger>
                    <SelectContent>
                        {sectionLinks.map(link => (
                            <SelectItem key={link.value} value={link.value}>{link.label}</SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>
            {selectValue === 'custom' && (
                <div className="space-y-2">
                    <Label htmlFor={`href-input-${item.label}`}>Custom Link</Label>
                     <Input
                        id={`href-input-${item.label}`}
                        value={item.href}
                        placeholder="e.g. https://example.com"
                        onChange={e => updateItem({ ...item, href: e.target.value })}
                    />
                </div>
            )}
        </div>
    );
}


function EditableNavLinkItem({ index, item, updateItem, removeItem }: { 
    index: number, 
    item: NavLink, 
    updateItem: (index: number, data: NavLink) => void, 
    removeItem: (index: number) => void
}) {
    return (
        <AccordionItem value={`item-${index}`}>
            <div className="flex justify-between w-full items-center">
                <AccordionTrigger className="flex-1 pr-4 text-left">
                    <span>{item.label || `New Link`}</span>
                </AccordionTrigger>
                <Button variant="ghost" size="icon" onClick={() => removeItem(index)}>
                    <Trash2 className="h-4 w-4 text-destructive" />
                </Button>
            </div>
            <AccordionContent className="p-4 border-t">
                <NavLinkEditor item={item} updateItem={(data) => updateItem(index, data)} />
            </AccordionContent>
        </AccordionItem>
    );
}

const defaultNavLinks: NavLink[] = [
  { href: '#services', label: 'Services' },
  { href: '#cases', label: 'Cases' },
  { href: '#om-os', label: 'About Us' },
  { href: '#kontakt', label: 'Contact' },
];

const defaultCtaSettings: HeaderCTASettings = {
    enabled: false,
    label: 'Get started',
    href: '#kontakt',
    linkType: 'internal',
    variant: 'default',
    size: 'default',
}


export default function CmsHeaderPage() {
    const [settings, setSettings] = useState<Partial<GeneralSettings>>({});
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, startSaving] = useTransition();
    const { toast } = useToast();

    useEffect(() => {
        async function loadSettings() {
            setIsLoading(true);
            const loadedSettings = await getSettingsAction();
            
            const newSettings: Partial<GeneralSettings> = { ...loadedSettings };

            newSettings.headerNavLinks = newSettings.headerNavLinks && newSettings.headerNavLinks.length > 0 ? newSettings.headerNavLinks : defaultNavLinks;
            newSettings.headerInitialBackgroundColor = newSettings.headerInitialBackgroundColor || { h: 0, s: 0, l: 100 };
            newSettings.headerInitialBackgroundOpacity = newSettings.headerInitialBackgroundOpacity ?? 0;
            newSettings.headerScrolledBackgroundColor = newSettings.headerScrolledBackgroundColor || { h: 210, s: 100, l: 95 };
            newSettings.headerScrolledBackgroundOpacity = newSettings.headerScrolledBackgroundOpacity ?? 95;
            newSettings.headerIsSticky = newSettings.headerIsSticky ?? true;
            newSettings.headerLogoWidth = newSettings.headerLogoWidth || 96;
            newSettings.headerHeight = newSettings.headerHeight || 64;
            newSettings.headerLinkColor = newSettings.headerLinkColor || 'text-foreground';
            newSettings.headerLinkHoverColor = newSettings.headerLinkHoverColor || 'text-primary';
            newSettings.headerLinkSize = newSettings.headerLinkSize || 14;
            newSettings.headerMenuIconColor = newSettings.headerMenuIconColor || 'text-foreground';
            newSettings.headerTopBorderEnabled = newSettings.headerTopBorderEnabled ?? false;
            newSettings.headerTopBorderColor = newSettings.headerTopBorderColor || { h: 211, s: 100, l: 50 };
            newSettings.headerCtaSettings = newSettings.headerCtaSettings || defaultCtaSettings;
            
            setSettings(newSettings);
            setIsLoading(false);
        }
        loadSettings();
    }, []);

    const handleInputChange = (field: keyof GeneralSettings, value: any) => {
        setSettings(prev => ({ ...prev, [field]: value }));
    };
    
    const handleCtaChange = (field: keyof HeaderCTASettings, value: any) => {
        setSettings(prev => ({
            ...prev,
            headerCtaSettings: {
                ...(prev.headerCtaSettings ?? defaultCtaSettings),
                [field]: value
            }
        }));
    };

    const handleListUpdate = <T,>(listName: keyof GeneralSettings, index: number, data: T) => {
        const list = (settings[listName] as T[] || []);
        const newList = [...list];
        newList[index] = data;
        handleInputChange(listName, newList);
    };

    const handleListAdd = <T extends object,>(listName: keyof GeneralSettings, newItem: T) => {
        const list = (settings[listName] as T[] || []);
        handleInputChange(listName, [...list, newItem]);
    }
  
    const handleListRemove = (listName: keyof GeneralSettings, index: number) => {
        const list = (settings[listName] as any[] || []);
        const newList = list.filter((_, i) => i !== index);
        handleInputChange(listName, newList);
    };

    const handleSaveChanges = () => {
        startSaving(async () => {
            const result = await saveSettingsAction(settings);
            toast({
                title: result.success ? "Saved!" : "Error!",
                description: result.message,
                variant: result.success ? "default" : "destructive",
            });
        });
    };

    if (isLoading) {
        return (
          <div className="flex justify-center items-center h-full">
            <Loader2 className="h-8 w-8 animate-spin" />
          </div>
        );
    }
  
    return (
        <div className="space-y-8">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold">Header Settings</h1>
                    <p className="text-muted-foreground">Customize the appearance of your site's header.</p>
                </div>
                <Button size="lg" onClick={handleSaveChanges} disabled={isSaving}>
                    {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Save Changes
                </Button>
            </div>
            
            <Card className="shadow-lg">
                <CardHeader>
                    <CardTitle>General Design & Function</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="flex items-center justify-between rounded-lg border p-4">
                        <div className="space-y-0.5">
                            <Label htmlFor="sticky-header" className="text-base">Sticky Header</Label>
                            <p className="text-sm text-muted-foreground">Makes the header fixed at the top of the page.</p>
                        </div>
                        <Switch
                            id="sticky-header"
                            checked={settings.headerIsSticky}
                            onCheckedChange={(value) => handleInputChange('headerIsSticky', value)}
                        />
                    </div>
                    <div className="space-y-2">
                        <div className="flex justify-between items-center">
                            <Label>Header Height</Label>
                            <span className="text-sm text-muted-foreground">{settings.headerHeight || 64}px</span>
                        </div>
                        <Slider 
                            value={[settings.headerHeight || 64]} 
                            onValueChange={([v]) => handleInputChange('headerHeight', v)}
                            min={48}
                            max={120}
                            step={1}
                        />
                    </div>
                    <div className="space-y-2">
                        <div className="flex justify-between items-center">
                            <Label>Logo Width</Label>
                            <span className="text-sm text-muted-foreground">{settings.headerLogoWidth || 96}px</span>
                        </div>
                        <Slider 
                            value={[settings.headerLogoWidth || 96]} 
                            onValueChange={([v]) => handleInputChange('headerLogoWidth', v)}
                            min={50}
                            max={250}
                            step={1}
                        />
                    </div>
                </CardContent>
            </Card>

             <Card className="shadow-lg">
                <CardHeader>
                    <CardTitle>Bottom Border</CardTitle>
                    <CardDescription>Add a colored line at the bottom of the header.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                     <div className="flex items-center justify-between rounded-lg border p-4">
                        <div className="space-y-0.5">
                            <Label htmlFor="top-border-enabled" className="text-base">Enable Bottom Border</Label>
                            <p className="text-sm text-muted-foreground">Shows a colored line at the bottom of the header.</p>
                        </div>
                        <Switch
                            id="top-border-enabled"
                            checked={settings.headerTopBorderEnabled}
                            onCheckedChange={(value) => handleInputChange('headerTopBorderEnabled', value)}
                        />
                    </div>
                    {settings.headerTopBorderEnabled && (
                        <div className="space-y-4">
                            {settings.headerTopBorderColor && (
                                <HslColorPicker
                                    label="Border Color"
                                    color={settings.headerTopBorderColor}
                                    onChange={(hsl) => handleInputChange('headerTopBorderColor', hsl)}
                                />
                            )}
                        </div>
                    )}
                </CardContent>
            </Card>

            <Card className="shadow-lg">
                 <CardHeader>
                    <CardTitle>Background Color</CardTitle>
                    <CardDescription>Control the header's appearance at the top of the page and on scroll.</CardDescription>
                </CardHeader>
                 <CardContent className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div className="space-y-4 p-4 border rounded-lg">
                         <h3 className="font-semibold">Normal State (Top)</h3>
                        {settings.headerInitialBackgroundColor &&
                            <HslColorPicker 
                                label="Background Color"
                                color={settings.headerInitialBackgroundColor}
                                onChange={(hsl) => handleInputChange('headerInitialBackgroundColor', hsl)}
                            />
                        }
                        <div className="space-y-2">
                            <div className="flex justify-between items-center">
                                <Label>Opacity</Label>
                                <span className="text-sm text-muted-foreground">{settings.headerInitialBackgroundOpacity || 0}%</span>
                            </div>
                            <Slider 
                                value={[settings.headerInitialBackgroundOpacity || 0]} 
                                onValueChange={([v]) => handleInputChange('headerInitialBackgroundOpacity', v)}
                                min={0}
                                max={100}
                                step={1}
                            />
                        </div>
                    </div>
                     <div className="space-y-4 p-4 border rounded-lg">
                        <h3 className="font-semibold">Scrolled State</h3>
                        {settings.headerScrolledBackgroundColor &&
                            <HslColorPicker 
                                label="Background Color"
                                color={settings.headerScrolledBackgroundColor}
                                onChange={(hsl) => handleInputChange('headerScrolledBackgroundColor', hsl)}
                            />
                        }
                        <div className="space-y-2">
                            <div className="flex justify-between items-center">
                                <Label>Opacity</Label>
                                <span className="text-sm text-muted-foreground">{settings.headerScrolledBackgroundOpacity || 95}%</span>
                            </div>
                            <Slider 
                                value={[settings.headerScrolledBackgroundOpacity || 95]} 
                                onValueChange={([v]) => handleInputChange('headerScrolledBackgroundOpacity', v)}
                                min={0}
                                max={100}
                                step={1}
                            />
                        </div>
                    </div>
                 </CardContent>
            </Card>
            
            <Card className="shadow-lg">
                <CardHeader>
                    <CardTitle>Header Call-to-Action Button</CardTitle>
                    <CardDescription>Configure the main CTA button in the header.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                     <div className="flex items-center justify-between rounded-lg border p-4">
                        <div className="space-y-0.5">
                            <Label htmlFor="cta-enabled" className="text-base">Enable CTA Button</Label>
                        </div>
                        <Switch
                            id="cta-enabled"
                            checked={settings.headerCtaSettings?.enabled}
                            onCheckedChange={(value) => handleCtaChange('enabled', value)}
                        />
                    </div>
                    {settings.headerCtaSettings?.enabled && (
                        <div className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label>Label</Label>
                                    <Input value={settings.headerCtaSettings.label} onChange={(e) => handleCtaChange('label', e.target.value)} />
                                </div>
                                <div className="space-y-2">
                                    <Label>Link Type</Label>
                                    <Select value={settings.headerCtaSettings.linkType} onValueChange={(v: 'internal'|'external') => handleCtaChange('linkType', v)}>
                                        <SelectTrigger><SelectValue/></SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="internal">Internal (anchor)</SelectItem>
                                            <SelectItem value="external">External (URL)</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>
                             <div className="space-y-2">
                                <Label>Link (Href)</Label>
                                <Input value={settings.headerCtaSettings.href} onChange={(e) => handleCtaChange('href', e.target.value)} placeholder={settings.headerCtaSettings.linkType === 'internal' ? '#section-id' : 'https://example.com'} />
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label>Variant</Label>
                                    <Select value={settings.headerCtaSettings.variant} onValueChange={(v) => handleCtaChange('variant', v)}>
                                        <SelectTrigger><SelectValue/></SelectTrigger>
                                        <SelectContent>
                                             {['default', 'destructive', 'outline', 'secondary', 'ghost', 'link', 'pill'].map(v => <SelectItem key={v} value={v}>{v}</SelectItem>)}
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="space-y-2">
                                    <Label>Size</Label>
                                    <Select value={settings.headerCtaSettings.size} onValueChange={(v) => handleCtaChange('size', v)}>
                                        <SelectTrigger><SelectValue/></SelectTrigger>
                                        <SelectContent>
                                            {['default', 'sm', 'lg', 'icon'].map(v => <SelectItem key={v} value={v}>{v}</SelectItem>)}
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>
                        </div>
                    )}
                </CardContent>
            </Card>


            <Card className="shadow-lg">
                <CardHeader>
                    <CardTitle>Navigation Links & Menu</CardTitle>
                    <CardDescription>Customize the appearance and content of links and icons in the header.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    <Label>Navigation Links</Label>
                    <Accordion type="multiple" className="w-full border rounded-md">
                        {(settings.headerNavLinks || []).map((link, index) => (
                           <EditableNavLinkItem
                                key={index}
                                index={index}
                                item={link}
                                updateItem={(i, data) => handleListUpdate('headerNavLinks', i, data)}
                                removeItem={(i) => handleListRemove('headerNavLinks', i)}
                           />
                        ))}
                    </Accordion>
                    <Button variant="outline" onClick={() => handleListAdd('headerNavLinks', { label: 'New Link', href: '#' })}>Add Link</Button>
                    <hr/>
                   {settings.headerLinkColor && typeof settings.headerLinkSize !== 'undefined' && settings.headerLinkHoverColor && settings.headerMenuIconColor &&
                        <NavLinkStyleEditor 
                            label="Styling for links and icons"
                            colorValue={settings.headerLinkColor as ThemeColor}
                            onColorChange={(v) => handleInputChange('headerLinkColor', v)}
                            hoverColorValue={settings.headerLinkHoverColor as ThemeColor}
                            onHoverColorChange={(v) => handleInputChange('headerLinkHoverColor', v)}
                            sizeValue={settings.headerLinkSize}
                            onSizeChange={(v) => handleInputChange('headerLinkSize', v)}
                            iconColorValue={settings.headerMenuIconColor as ThemeColor}
                            onIconColorChange={(v) => handleInputChange('headerMenuIconColor', v)}
                        />
                    }
                </CardContent>
            </Card>
        </div>
    );
}
