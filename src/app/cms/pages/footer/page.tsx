
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

function HslColorPicker({
  label,
  color,
  onChange,
}: {
  label: string;
  color: { h: number; s: number; l: number };
  onChange: (hsl: { h: number; s: number; l: number }) => void;
}) {
    const handleColorChange = (part: 'h' | 's' | 'l', value: number) => {
        onChange({ ...color, [part]: value });
    };

    return (
        <div className="space-y-4 p-4 border rounded-lg" style={{ backgroundColor: `hsl(${color.h}, ${color.s}%, ${color.l}%)` }}>
            <h3 className="font-semibold text-lg" style={{ color: color.l > 50 ? '#000' : '#FFF' }}>{label}</h3>
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
            footerBackgroundColor: loadedSettings.footerBackgroundColor || { h: 210, s: 60, l: 98 }
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
        </CardContent>
      </Card>
    </div>
  );
}
