"use client";
import { useTheme } from "@/context/ThemeContext";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";

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

function ColorPicker({ label, colorName }: { label: string; colorName: keyof ReturnType<typeof useTheme>['theme']['colors'] }) {
  const { theme, setThemeColor } = useTheme();
  const color = theme.colors[colorName];
  const hexColor = hslToHex(color.h, color.s, color.l);

  const handleColorChange = (part: 'h' | 's' | 'l', value: number) => {
    setThemeColor(colorName, { ...color, [part]: value });
  };

  return (
    <div className="space-y-4 p-4 border rounded-lg" style={{ backgroundColor: `hsl(${color.h}, ${color.s}%, ${color.l}%)` }}>
       <div className="flex justify-between items-center">
        <h3 className="font-semibold text-lg" style={{ color: color.l > 50 ? '#000' : '#FFF' }}>{label}</h3>
        <span className="font-mono text-sm" style={{ color: color.l > 50 ? '#000' : '#FFF' }}>{hexColor}</span>
      </div>
      <div className="space-y-2">
        <Label>Hue ({color.h})</Label>
        <Slider value={[color.h]} onValueChange={([v]) => handleColorChange('h', v)} max={360} step={1} />
      </div>
      <div className="space-y-2">
        <Label>Saturation ({color.s}%)</Label>
        <Slider value={[color.s]} onValueChange={([v]) => handleColorChange('s', v)} max={100} step={1} />
      </div>
      <div className="space-y-2">
        <Label>Lightness ({color.l}%)</Label>
        <Slider value={[color.l]} onValueChange={([v]) => handleColorChange('l', v)} max={100} step={1} />
      </div>
    </div>
  );
}

function FontSizeSlider({ label, sizeName }: { label: string; sizeName: keyof ReturnType<typeof useTheme>['theme']['fontSizes'] }) {
    const { theme, setFontSize } = useTheme();
    const sizeInRem = theme.fontSizes[sizeName];
    const sizeInPx = Math.round(sizeInRem * 16);

    const handleSliderChange = (pxValue: number) => {
        setFontSize(sizeName, pxValue / 16);
    }

    return (
        <div className="space-y-2">
            <div className="flex justify-between items-center">
                <Label>{label}</Label>
                <span className="text-sm text-muted-foreground">{sizeInPx}px</span>
            </div>
            <Slider
                value={[sizeInPx]}
                onValueChange={([v]) => handleSliderChange(v)}
                min={8}
                max={sizeName === 'h1' ? 128 : 64}
                step={1}
            />
        </div>
    )
}

export default function CmsPage() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
      {/* Color Settings */}
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle>Farver</CardTitle>
          <CardDescription>Juster sidens primære farver. Ændringer gemmes automatisk.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <ColorPicker label="Primær farve" colorName="primary" />
          <ColorPicker label="Baggrundsfarve" colorName="background" />
          <ColorPicker label="Accent farve" colorName="accent" />
        </CardContent>
      </Card>

      {/* Font Size Settings */}
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle>Tekststørrelser</CardTitle>
          <CardDescription>Juster størrelsen på overskrifter og brødtekst i pixels.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <FontSizeSlider label="Heading 1" sizeName="h1" />
          <FontSizeSlider label="Heading 2" sizeName="h2" />
          <FontSizeSlider label="Heading 3" sizeName="h3" />
          <FontSizeSlider label="Heading 4" sizeName="h4" />
          <FontSizeSlider label="Body" sizeName="body" />
        </CardContent>
      </Card>
    </div>
  );
}
