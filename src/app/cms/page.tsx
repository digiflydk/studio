"use client";
import { useTheme } from "@/context/ThemeContext";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";

function ColorPicker({ label, colorName }: { label: string; colorName: keyof ReturnType<typeof useTheme>['theme']['colors'] }) {
  const { theme, setThemeColor } = useTheme();
  const color = theme.colors[colorName];

  const handleColorChange = (part: 'h' | 's' | 'l', value: number) => {
    setThemeColor(colorName, { ...color, [part]: value });
  };

  return (
    <div className="space-y-4 p-4 border rounded-lg" style={{ backgroundColor: `hsl(${color.h}, ${color.s}%, ${color.l}%)` }}>
      <h3 className="font-semibold text-lg" style={{ color: color.l > 50 ? '#000' : '#FFF' }}>{label}</h3>
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
    const size = theme.fontSizes[sizeName];

    return (
        <div className="space-y-2">
            <div className="flex justify-between items-center">
                <Label>{label}</Label>
                <span className="text-sm text-muted-foreground">{size.toFixed(2)}rem</span>
            </div>
            <Slider
                value={[size]}
                onValueChange={([v]) => setFontSize(sizeName, v)}
                min={0.5}
                max={sizeName === 'h1' ? 8 : 4}
                step={0.05}
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
          <CardDescription>Juster størrelsen på overskrifter og brødtekst.</CardDescription>
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
