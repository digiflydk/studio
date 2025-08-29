
'use client';

import { useState, useEffect, useTransition } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { useToast } from '@/hooks/use-toast';
import { GeneralSettings } from '@/services/settings';
import { getSettingsAction, saveSettingsAction } from '@/app/actions';
import { Loader2 } from 'lucide-react';
import { useTheme } from '@/context/ThemeContext';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';

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
    const [hexInputValue, setHexInputValue] = useState(hslToHex(color.h, color.s, color.l));
    
    useEffect(() => {
        setHexInputValue(hslToHex(color.h, color.s, color.l));
    }, [color]);

    const handleColorChange = (part: 'h' | 's' | 'l', value: number) => {
        onChange({ ...color, [part]: value });
    };

    const handleHexChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setHexInputValue(e.target.value);
    }

    const handleHexBlur = () => {
        const newHsl = hexToHsl(hexInputValue);
        if(newHsl) {
            onChange(newHsl);
        } else {
            // If invalid hex, reset input to current valid color
            setHexInputValue(hslToHex(color.h, color.s, color.l));
        }
    }
  
    const handleHexKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            handleHexBlur();
            (e.target as HTMLInputElement).blur();
        }
    }


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

function TextStyleEditor({
    label,
    colorValue,
    onColorChange,
    sizeValue,
    onSizeChange
}: {
    label: string;
    colorValue: ThemeColor;
    onColorChange: (value: ThemeColor) => void;
    sizeValue: number;
    onSizeChange: (value: number) => void;
}) {
    return (
        <div className="p-4 border rounded-lg grid grid-cols-1 md:grid-cols-2 gap-4">
            <h3 className="font-semibold md:col-span-2">{label}</h3>
            <div className="space-y-2">
                <Label>Farve</Label>
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
                <div className="flex justify-between items-center">
                    <Label>Tekststørrelse</Label>
                    <span className="text-sm text-muted-foreground">{sizeValue}px</span>
                </div>
                <Slider 
                    value={[sizeValue]} 
                    onValueChange={([v]) => onSizeChange(v)}
                    min={10}
                    max={48}
                    step={1}
                />
            </div>
        </div>
    );
}

export default function CmsFooterPage() {
  const [settings, setSettings] = useState<Partial<GeneralSettings>>({});
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, startSaving] = useTransition();
  const { toast } = useToast();
  const { theme } = useTheme();

  useEffect(() => {
    async function loadSettings() {
      setIsLoading(true);
      const loadedSettings = await getSettingsAction();
      if (loadedSettings) {
        setSettings({
            ...loadedSettings,
            footerBackgroundColor: loadedSettings.footerBackgroundColor || { h: 210, s: 60, l: 98 },
            footerCompanyNameColor: loadedSettings.footerCompanyNameColor || 'text-foreground',
            footerCompanyNameSize: loadedSettings.footerCompanyNameSize || 16,
            footerAddressColor: loadedSettings.footerAddressColor || 'text-muted-foreground',
            footerAddressSize: loadedSettings.footerAddressSize || 14,
            footerContactColor: loadedSettings.footerContactColor || 'text-muted-foreground',
            footerContactSize: loadedSettings.footerContactSize || 14,
            footerDescriptionColor: loadedSettings.footerDescriptionColor || 'text-muted-foreground',
            footerDescriptionSize: loadedSettings.footerDescriptionSize || 14,
        });
      }
      setIsLoading(false);
    }
    loadSettings();
  }, [theme]);
  
  const handleInputChange = (field: keyof GeneralSettings, value: any) => {
    setSettings(prev => ({ ...prev, [field]: value }));
  };

  const handleSaveChanges = () => {
    startSaving(async () => {
      const result = await saveSettingsAction(settings);
      toast({
        title: result.success ? "Gemt!" : "Fejl!",
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
                <h1 className="text-2xl font-bold">Footer Indstillinger</h1>
                <p className="text-muted-foreground">Tilpas udseendet og indholdet af din sides footer.</p>
            </div>
            <Button size="lg" onClick={handleSaveChanges} disabled={isSaving}>
                {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Gem Ændringer
            </Button>
       </div>
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle>Indhold</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
            <div className="space-y-2">
                <Label htmlFor="footer-tagline">Tagline</Label>
                <Input 
                    id="footer-tagline" 
                    value={settings.footerTagline || ''} 
                    onChange={e => handleInputChange('footerTagline', e.target.value)}
                    placeholder="Flow. Automatisér. Skalér."
                />
            </div>
             <div className="space-y-2">
                <Label htmlFor="footer-description">Beskrivelse</Label>
                <Textarea
                    id="footer-description" 
                    value={settings.footerDescription || ''} 
                    onChange={e => handleInputChange('footerDescription', e.target.value)}
                    placeholder="Kort beskrivelse under tagline..."
                />
            </div>
        </CardContent>
      </Card>
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle>Design</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
            <div className="space-y-2">
                 <div className="flex justify-between items-center">
                    <Label>Logo Bredde</Label>
                    <span className="text-sm text-muted-foreground">{settings.footerLogoWidth || 96}px</span>
                </div>
                <Slider 
                    value={[settings.footerLogoWidth || 96]} 
                    onValueChange={([v]) => handleInputChange('footerLogoWidth', v)}
                    min={50}
                    max={250}
                    step={1}
                />
            </div>
            <div className="space-y-2">
                <HslColorPicker 
                    label="Baggrundsfarve"
                    color={settings.footerBackgroundColor || { h: 210, s: 60, l: 98 }}
                    onChange={(hsl) => handleInputChange('footerBackgroundColor', hsl)}
                />
            </div>
            <TextStyleEditor 
                label="Beskrivelse"
                colorValue={settings.footerDescriptionColor as ThemeColor || 'text-muted-foreground'}
                onColorChange={(v) => handleInputChange('footerDescriptionColor', v)}
                sizeValue={settings.footerDescriptionSize || 14}
                onSizeChange={(v) => handleInputChange('footerDescriptionSize', v)}
            />
             <TextStyleEditor 
                label="Virksomhedsnavn"
                colorValue={settings.footerCompanyNameColor as ThemeColor || 'text-foreground'}
                onColorChange={(v) => handleInputChange('footerCompanyNameColor', v)}
                sizeValue={settings.footerCompanyNameSize || 16}
                onSizeChange={(v) => handleInputChange('footerCompanyNameSize', v)}
            />
            <TextStyleEditor 
                label="Adresse"
                colorValue={settings.footerAddressColor as ThemeColor || 'text-muted-foreground'}
                onColorChange={(v) => handleInputChange('footerAddressColor', v)}
                sizeValue={settings.footerAddressSize || 14}
                onSizeChange={(v) => handleInputChange('footerAddressSize', v)}
            />
            <TextStyleEditor 
                label="Kontakt (Tlf, Email, CVR)"
                colorValue={settings.footerContactColor as ThemeColor || 'text-muted-foreground'}
                onColorChange={(v) => handleInputChange('footerContactColor', v)}
                sizeValue={settings.footerContactSize || 14}
                onSizeChange={(v) => handleInputChange('footerContactSize', v)}
            />
        </CardContent>
      </Card>
    </div>
  );
}
