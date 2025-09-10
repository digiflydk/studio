

"use client";
import { useTheme, defaultTheme, ThemeProvider } from "@/context/ThemeContext";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useState, useEffect, useMemo } from "react";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { TypographySettings, TypographyElementSettings, BodyTypographySettings, ButtonSettings, ButtonDesignType, ButtonFontOption, GeneralSettings } from "@/types/settings";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useGeneralSettings } from "@/hooks/use-general-settings";
import { DiffDialog } from "@/components/admin/DiffDialog";
import { ConflictDialog } from "@/components/admin/ConflictDialog";
import { simpleDiff } from "@/lib/utils/diff";

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


function ColorPicker({ label, colorName }: { label: string; colorName: keyof ReturnType<typeof useTheme>['theme']['colors'] }) {
  const { theme, setThemeColor } = useTheme();
  const color = theme.colors[colorName];
  const [hexInputValue, setHexInputValue] = useState('');

  useEffect(() => {
    setHexInputValue(hslToHex(color.h, color.s, color.l));
  }, [color]);

  const handleColorChange = (part: 'h' | 's' | 'l', value: number) => {
    setThemeColor(colorName, { ...color, [part]: value });
  };
  
  const handleHexChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setHexInputValue(e.target.value);
  }

  const handleHexBlur = () => {
    const newHsl = hexToHsl(hexInputValue);
    if(newHsl) {
        setThemeColor(colorName, newHsl);
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
  );
}

function TypographyControl({
  label,
  settings,
  onUpdate,
  isBody = false,
}: {
  label: string;
  settings: TypographyElementSettings | BodyTypographySettings;
  onUpdate: (data: Partial<TypographyElementSettings | BodyTypographySettings>) => void;
  isBody?: boolean;
}) {
  return (
    <div className="p-4 border rounded-lg space-y-4">
      <h4 className="font-semibold">{label}</h4>
      <div className="grid grid-cols-2 gap-4">
        {!isBody && (
          <>
            <div className="space-y-2">
              <Label>Size Mobile (px)</Label>
              <Input type="number" value={(settings as TypographyElementSettings).sizeMobile} onChange={(e) => onUpdate({ sizeMobile: Number(e.target.value) })} />
            </div>
            <div className="space-y-2">
              <Label>Size Desktop (px)</Label>
              <Input type="number" value={(settings as TypographyElementSettings).sizeDesktop} onChange={(e) => onUpdate({ sizeDesktop: Number(e.target.value) })} />
            </div>
          </>
        )}
        {isBody && (
          <div className="space-y-2">
            <Label>Size (px)</Label>
            <Input type="number" value={(settings as BodyTypographySettings).size} onChange={(e) => onUpdate({ size: Number(e.target.value) })} />
          </div>
        )}
        <div className="space-y-2">
          <Label>Weight</Label>
          <Slider value={[settings.weight]} onValueChange={([v]) => onUpdate({ weight: v })} min={300} max={900} step={100} />
          <span className="text-xs text-muted-foreground">{settings.weight}</span>
        </div>
      </div>
       <div className="space-y-2">
          <Label>Line Height ({settings.lineHeight.toFixed(2)})</Label>
          <Slider value={[settings.lineHeight]} onValueChange={([v]) => onUpdate({ lineHeight: v })} min={1.0} max={2.0} step={0.05} />
        </div>
    </div>
  );
}

const defaultButtonSettings: ButtonSettings = {
    designType: 'default',
    fontFamily: 'Inter',
    fontWeight: 600,
    colors: {
      primary: '#2563EB',
      secondary: '#1F2937',
      hover: '#1D4ED8',
    },
    defaultVariant: 'primary',
    defaultSize: 'md',
};

function CmsDesignPageContent() {
  const { isLoaded: isThemeLoaded, ...themeCtx } = useTheme();
  const serverSettings = useGeneralSettings();
  
  const [isSaving, setIsSaving] = useState(false);
  const [showDiff, setShowDiff] = useState(false);
  const [version, setVersion] = useState(0);
  const [conflict, setConflict] = useState<any>(null);
  
  const { toast } = useToast();
  
  useEffect(() => {
    if(serverSettings) {
        setVersion((serverSettings as any).version || 0);
    }
  }, [serverSettings]);

  const handleSaveChanges = async (force = false, useVersion?: number) => {
    setIsSaving(true);
    setShowDiff(false);
    setConflict(null);

    const settingsToSave: Partial<GeneralSettings> & { version?: number } = {
        themeColors: themeCtx.theme.colors,
        typography: themeCtx.typography,
        buttonSettings: themeCtx.buttonSettings,
        version: useVersion ?? version,
    };
    
    // Safety check for destructive changes
    const diff = simpleDiff(serverSettings || {}, settingsToSave);
    if (Object.keys(diff.removed).length > 0 && !force) {
        setShowDiff(true);
        setIsSaving(false);
        return;
    }

    try {
        const res = await fetch('/api/design-settings/save', {
            method: 'POST',
            headers: { 'content-type': 'application/json', 'x-user': 'cms-user' },
            body: JSON.stringify(settingsToSave),
            cache: 'no-store',
        });
        
        const json = await res.json();
        
        if (res.status === 409) {
            setConflict({ server: json.data, serverVersion: json.version });
            toast({ title: 'Conflict', description: 'Settings have been updated by someone else.', variant: 'destructive' });
            setIsSaving(false);
            return;
        }

        if (!res.ok || !json?.ok) {
            throw new Error(json.error || 'Save failed');
        }

        window.dispatchEvent(new CustomEvent('design:updated', { detail: json.data }));
        
        // This is important to sync the form state with the server state after save
        if(json.data.themeColors) themeCtx.setTheme({ colors: json.data.themeColors });
        if(json.data.typography) themeCtx.setTypography(json.data.typography);
        if(json.data.buttonSettings) themeCtx.setButtonSettings(json.data.buttonSettings);
        if(json.data.version) setVersion(json.data.version);

        toast({
            title: "Saved!",
            description: "Design settings have been saved.",
            variant: "default",
        });

    } catch (error: any) {
        console.error("Error saving settings:", error);
        toast({
            title: "Error!",
            description: error.message || "An error occurred during saving.",
            variant: "destructive",
        });
    } finally {
        setIsSaving(false);
    }
  }

  const handleReset = () => {
      themeCtx.setTheme(defaultTheme);
  }

  const handleButtonSettingChange = <K extends keyof ButtonSettings>(field: K, value: ButtonSettings[K]) => {
    themeCtx.setButtonSettings({ ...themeCtx.buttonSettings, [field]: value });
  };

  const handleButtonColorChange = <K extends keyof ButtonSettings['colors']>(field: K, value: string) => {
    themeCtx.setButtonSettings({ ...themeCtx.buttonSettings, colors: { ...themeCtx.buttonSettings.colors, [field]: value } });
  }

  const diff = useMemo(() => {
    const settingsToSave: Partial<GeneralSettings> = {
        themeColors: themeCtx.theme.colors,
        typography: themeCtx.typography,
        buttonSettings: themeCtx.buttonSettings,
    };
    return simpleDiff(serverSettings || {}, settingsToSave);
  }, [serverSettings, themeCtx.theme, themeCtx.typography, themeCtx.buttonSettings]);


  if (!isThemeLoaded || !serverSettings) {
      return (
        <div className="flex justify-center items-center h-full">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      );
  }

  return (
    <div className="space-y-8">
        <DiffDialog 
            isOpen={showDiff} 
            onOpenChange={setShowDiff}
            diff={diff}
            onConfirm={() => handleSaveChanges(true)}
        />
        <ConflictDialog
            isOpen={!!conflict}
            onOpenChange={() => setConflict(null)}
            onReload={(serverData, serverVersion) => {
                if(serverData.themeColors) themeCtx.setTheme({ colors: serverData.themeColors });
                if(serverData.typography) themeCtx.setTypography(serverData.typography);
                if(serverData.buttonSettings) themeCtx.setButtonSettings(serverData.buttonSettings);
                setVersion(serverVersion);
                setConflict(null);
            }}
            onOverwrite={(serverVersion) => handleSaveChanges(true, serverVersion)}
            serverData={conflict?.server}
            serverVersion={conflict?.serverVersion}
        />
        <div className="flex justify-between items-start">
            <div>
                <h1 className="text-2xl font-bold">Design Settings</h1>
                <p className="text-muted-foreground">Manage the visual appearance of your site.</p>
            </div>
            <div className="flex gap-4">
                <Button variant="outline" onClick={handleReset} disabled={isSaving}>Reset</Button>
                <Button size="lg" onClick={() => handleSaveChanges()} disabled={isSaving}>
                  {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Save Changes
                </Button>
            </div>
       </div>

        <Accordion type="multiple" className="w-full space-y-4" defaultValue={['colors']}>
            <AccordionItem value="colors" className="border rounded-lg shadow-sm">
                <AccordionTrigger className="px-6 py-4">
                     <div className="text-left">
                        <h3 className="font-semibold text-lg">Colors</h3>
                        <p className="text-sm text-muted-foreground">Adjust the primary colors of your site.</p>
                    </div>
                </AccordionTrigger>
                <AccordionContent className="p-6 border-t">
                    <div className="space-y-6">
                        <ColorPicker label="Primary Color" colorName="primary" />
                        <ColorPicker label="Background Color" colorName="background" />
                        <ColorPicker label="Accent Color" colorName="accent" />
                    </div>
                </AccordionContent>
            </AccordionItem>
            
            <AccordionItem value="typography" className="border rounded-lg shadow-sm">
                 <AccordionTrigger className="px-6 py-4">
                     <div className="text-left">
                        <h3 className="font-semibold text-lg">Typography</h3>
                        <p className="text-sm text-muted-foreground">Adjust the fonts, sizes, and weights for your site.</p>
                    </div>
                </AccordionTrigger>
                <AccordionContent className="p-6 border-t">
                    <div className="space-y-4">
                        <div className="space-y-2">
                            <Label>Primary Font</Label>
                            <Input value={themeCtx.typography.fontPrimary} onChange={(e) => themeCtx.setTypography({ ...themeCtx.typography, fontPrimary: e.target.value })} />
                            <p className="text-xs text-muted-foreground">E.g. "Inter", "Roboto". Make sure the font is loaded.</p>
                        </div>
                        <Accordion type="multiple" className="w-full">
                            <AccordionItem value="h1">
                                <AccordionTrigger>H1</AccordionTrigger>
                                <AccordionContent>
                                   <TypographyControl label="H1" settings={themeCtx.typography.h1} onUpdate={(data) => themeCtx.setTypography({ ...themeCtx.typography, h1: { ...themeCtx.typography.h1, ...data } })} />
                                </AccordionContent>
                            </AccordionItem>
                            <AccordionItem value="h2">
                                <AccordionTrigger>H2</AccordionTrigger>
                                <AccordionContent>
                                   <TypographyControl label="H2" settings={themeCtx.typography.h2} onUpdate={(data) => themeCtx.setTypography({ ...themeCtx.typography, h2: { ...themeCtx.typography.h2, ...data } })} />
                                </AccordionContent>
                            </AccordionItem>
                             <AccordionItem value="h3">
                                <AccordionTrigger>H3</AccordionTrigger>
                                <AccordionContent>
                                   <TypographyControl label="H3" settings={themeCtx.typography.h3} onUpdate={(data) => themeCtx.setTypography({ ...themeCtx.typography, h3: { ...themeCtx.typography.h3, ...data } })} />
                                </AccordionContent>
                            </AccordionItem>
                             <AccordionItem value="h4">
                                <AccordionTrigger>H4</AccordionTrigger>
                                <AccordionContent>
                                   <TypographyControl label="H4" settings={themeCtx.typography.h4} onUpdate={(data) => themeCtx.setTypography({ ...themeCtx.typography, h4: { ...themeCtx.typography.h4, ...data } })} />
                                </AccordionContent>
                            </AccordionItem>
                             <AccordionItem value="body">
                                <AccordionTrigger>Body</AccordionTrigger>
                                <AccordionContent>
                                   <TypographyControl label="Body" settings={themeCtx.typography.body} onUpdate={(data) => themeCtx.setTypography({ ...themeCtx.typography, body: { ...themeCtx.typography.body, ...data } })} isBody />
                                </AccordionContent>
                            </AccordionItem>
                        </Accordion>
                    </div>
                </AccordionContent>
            </AccordionItem>

            <AccordionItem value="buttons" className="border rounded-lg shadow-sm">
                <AccordionTrigger className="px-6 py-4">
                    <div className="text-left">
                        <h3 className="font-semibold text-lg">Buttons</h3>
                        <p className="text-sm text-muted-foreground">Customize the global button styles.</p>
                    </div>
                </AccordionTrigger>
                <AccordionContent className="p-6 border-t">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <Label>Button Shape</Label>
                            <Select
                                value={themeCtx.buttonSettings.designType}
                                onValueChange={(v: ButtonDesignType) => handleButtonSettingChange('designType', v)}
                            >
                                <SelectTrigger><SelectValue /></SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="default">Default (Slightly Rounded)</SelectItem>
                                    <SelectItem value="pill">Pill (Very Rounded)</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-2">
                            <Label>Font Family</Label>
                            <Select
                                value={themeCtx.buttonSettings.fontFamily}
                                onValueChange={(v: ButtonFontOption) => handleButtonSettingChange('fontFamily', v)}
                            >
                                <SelectTrigger><SelectValue /></SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="Inter">Inter (Default)</SelectItem>
                                    <SelectItem value="Manrope">Manrope</SelectItem>
                                    <SelectItem value="System">System UI</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-2 md:col-span-2">
                            <Label>Font Weight: {themeCtx.buttonSettings.fontWeight}</Label>
                            <Slider
                                value={[themeCtx.buttonSettings.fontWeight]}
                                onValueChange={([v]) => handleButtonSettingChange('fontWeight', v)}
                                min={300} max={800} step={100}
                            />
                        </div>

                         <div className="space-y-2">
                            <Label>Primary Color</Label>
                            <Input type="text" value={themeCtx.buttonSettings.colors.primary} onChange={(e) => handleButtonColorChange('primary', e.target.value)} />
                        </div>
                         <div className="space-y-2">
                            <Label>Hover Color</Label>
                            <Input type="text" value={themeCtx.buttonSettings.colors.hover} onChange={(e) => handleButtonColorChange('hover', e.target.value)} />
                        </div>
                    </div>
                </AccordionContent>
            </AccordionItem>

        </Accordion>
    </div>
  );
}

export default function CmsDesignPage() {
    const settings = useGeneralSettings();
    
    return (
        <ThemeProvider settings={settings}>
            <CmsDesignPageContent />
        </ThemeProvider>
    )
}
