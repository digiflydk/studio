

"use client";
import { useTheme, defaultTheme } from "@/context/ThemeContext";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useState, useEffect, useTransition } from "react";
import { saveSettingsAction } from "@/app/actions";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { TypographySettings, TypographyElementSettings, BodyTypographySettings } from "@/types/settings";


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

export default function CmsDashboardPage() {
  const { theme, isLoaded, setTheme, setTypography, typography } = useTheme();
  const [isSaving, startSaving] = useTransition();
  const { toast } = useToast();

  const handleSaveChanges = () => {
    startSaving(async () => {
        const result = await saveSettingsAction({
            themeColors: theme.colors,
            typography: typography,
        });
        toast({
            title: result.success ? "Gemt!" : "Fejl!",
            description: result.message,
            variant: result.success ? "default" : "destructive",
        });
    });
  }

  const handleReset = () => {
      setTheme(defaultTheme);
  }

  if (!isLoaded) {
      return (
        <div className="flex justify-center items-center h-full">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      );
  }

  return (
    <div className="space-y-8">
        <div className="flex justify-end gap-4">
            <Button variant="outline" onClick={handleReset} disabled={isSaving}>Nulstil</Button>
            <Button size="lg" onClick={handleSaveChanges} disabled={isSaving}>
              {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Gem Ændringer
            </Button>
       </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle>Farver</CardTitle>
              <CardDescription>Juster sidens primære farver.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <ColorPicker label="Primær farve" colorName="primary" />
              <ColorPicker label="Baggrundsfarve" colorName="background" />
              <ColorPicker label="Accent farve" colorName="accent" />
            </CardContent>
          </Card>
          
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle>Typografi</CardTitle>
              <CardDescription>Juster sidens skrifttyper, størrelser og vægt.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="space-y-2">
                    <Label>Primær Skrifttype</Label>
                    <Input value={typography.fontPrimary} onChange={(e) => setTypography({ ...typography, fontPrimary: e.target.value })} />
                    <p className="text-xs text-muted-foreground">F.eks. &quot;Inter&quot;, &quot;Roboto&quot;. Sørg for at skrifttypen er indlæst.</p>
                </div>
                <Accordion type="multiple" className="w-full">
                    <AccordionItem value="h1">
                        <AccordionTrigger>H1</AccordionTrigger>
                        <AccordionContent>
                           <TypographyControl label="H1" settings={typography.h1} onUpdate={(data) => setTypography({ ...typography, h1: { ...typography.h1, ...data } })} />
                        </AccordionContent>
                    </AccordionItem>
                    <AccordionItem value="h2">
                        <AccordionTrigger>H2</AccordionTrigger>
                        <AccordionContent>
                           <TypographyControl label="H2" settings={typography.h2} onUpdate={(data) => setTypography({ ...typography, h2: { ...typography.h2, ...data } })} />
                        </AccordionContent>
                    </AccordionItem>
                     <AccordionItem value="h3">
                        <AccordionTrigger>H3</AccordionTrigger>
                        <AccordionContent>
                           <TypographyControl label="H3" settings={typography.h3} onUpdate={(data) => setTypography({ ...typography, h3: { ...typography.h3, ...data } })} />
                        </AccordionContent>
                    </AccordionItem>
                     <AccordionItem value="h4">
                        <AccordionTrigger>H4</AccordionTrigger>
                        <AccordionContent>
                           <TypographyControl label="H4" settings={typography.h4} onUpdate={(data) => setTypography({ ...typography, h4: { ...typography.h4, ...data } })} />
                        </AccordionContent>
                    </AccordionItem>
                     <AccordionItem value="body">
                        <AccordionTrigger>Body</AccordionTrigger>
                        <AccordionContent>
                           <TypographyControl label="Body" settings={typography.body} onUpdate={(data) => setTypography({ ...typography, body: { ...typography.body, ...data } })} isBody />
                        </AccordionContent>
                    </AccordionItem>
                </Accordion>
            </CardContent>
          </Card>
        </div>
    </div>
  );
}
