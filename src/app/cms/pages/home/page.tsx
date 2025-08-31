

'use client';

import { useState, useEffect, useTransition } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { GeneralSettings, Service, Case, TeamMember, SectionPadding } from '@/services/settings';
import { getSettingsAction, saveSettingsAction } from '@/app/actions';
import { Loader2, Trash2, Monitor, Smartphone, ExternalLink } from 'lucide-react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import Link from 'next/link';

const defaultServices: Service[] = [
  {
    title: 'Digital Strategi',
    description: 'Vi lægger en køreplan for jeres digitale transformation med fokus på ROI og forretningsmål.',
    imageUrl: 'https://picsum.photos/600/400?random=1',
    aiHint: 'strategy business',
  },
  {
    title: 'Softwareudvikling',
    description: 'Skræddersyede softwareløsninger, fra web-apps til komplekse systemintegrationer.',
    imageUrl: 'https://picsum.photos/600/400?random=2',
    aiHint: 'software development',
  },
  {
    title: 'AI & Automatisering',
    description: 'Implementering af kunstig intelligens og automatisering for at optimere jeres workflows.',
    imageUrl: 'https://picsum.photos/600/400?random=3',
    aiHint: 'artificial intelligence',
  },
  {
    title: 'Cloud Løsninger',
    description: 'Sikker og skalerbar cloud-infrastruktur, der understøtter jeres vækstambitioner.',
    imageUrl: 'https://picsum.photos/600/400?random=4',
    aiHint: 'cloud infrastructure',
  },
];

const defaultCases: Case[] = [
  {
    title: 'Automatiseret Fakturering',
    description: 'Udvikling af et system der sparede en mellemstor virksomhed for 20+ timer i manuelt tastearbejde om ugen.',
    imageUrl: 'https://picsum.photos/600/400?random=5',
    link: '#',
    aiHint: 'invoice automation',
  },
  {
    title: 'Dynamisk Prissætnings-AI',
    description: 'En AI-model for en webshop der optimerede priser i realtid og øgede overskuddet med 12%.',
    imageUrl: 'https://picsum.photos/600/400?random=6',
    link: '#',
    aiHint: 'pricing algorithm',
  },
  {
    title: 'Skalerbar Cloud Platform',
    description: 'Migration til en moderne cloud-arkitektur, der håndterede en 10x stigning i trafik uden problemer.',
    imageUrl: 'https://picsum.photos/600/400?random=7',
    link: '#',
    aiHint: 'cloud platform',
  },
];

const defaultTeam: TeamMember[] = [
  {
    name: 'Alex Andersen',
    title: 'Lead Developer & Arkitekt',
    description: 'Specialist i skalerbare systemer og komplekse integrationer. Elsker at bygge robuste løsninger.',
    imageUrl: 'https://picsum.photos/200/200?random=8',
    linkedinUrl: '#',
    aiHint: 'male portrait',
  },
  {
    name: 'Maria Jensen',
    title: 'AI & Data Specialist',
    description: 'Transformerer data til forretningsværdi gennem machine learning og intelligente automatiseringer.',
    imageUrl: 'https://picsum.photos/200/200?random=9',
    linkedinUrl: '#',
    aiHint: 'female portrait',
  },
  {
    name: 'Jesper Nielsen',
    title: 'Digital Strateg & Projektleder',
    description: 'Sikrer at teknologien understøtter forretningsmålene og at projekter leveres til tiden.',
    imageUrl: 'https://picsum.photos/200/200?random=10',
    linkedinUrl: '#',
    aiHint: 'man portrait',
  },
];

const defaultAboutText = "Digifly er et agilt konsulenthus grundlagt af erfarne teknologer med en passion for at skabe flow. Vi tror på, at de rigtige digitale løsninger kan frigøre potentiale og drive markant vækst. Vores mission er at være jeres betroede partner på den digitale rejse – fra idé til implementering og skalering.";

const defaultPadding: SectionPadding = { top: 96, bottom: 96, topMobile: 64, bottomMobile: 64 };

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

function HslColorPicker({
  label,
  color,
  onChange,
}: {
  label: string;
  color: { h: number; s: number; l: number };
  onChange: (hsl: { h: number; s: number; l: number }) => void;
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

function TextStyleEditor({
    label,
    colorValue,
    onColorChange,
    desktopSize,
    onDesktopSizeChange,
    mobileSize,
    onMobileSizeChange,
    previewMode
}: {
    label: string;
    colorValue: ThemeColor;
    onColorChange: (value: ThemeColor) => void;
    desktopSize: number;
    onDesktopSizeChange: (value: number) => void;
    mobileSize: number;
    onMobileSizeChange: (value: number) => void;
    previewMode: 'desktop' | 'mobile';
}) {
    return (
        <div className="p-4 border rounded-lg space-y-4 bg-muted/20">
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

            {previewMode === 'desktop' ? (
                <div className="space-y-2">
                    <div className="flex justify-between items-center">
                        <Label><Monitor className="inline-block h-4 w-4 mr-2" />Desktop Størrelse</Label>
                        <span className="text-sm text-muted-foreground">{desktopSize}px</span>
                    </div>
                    <Slider 
                        value={[desktopSize]} 
                        onValueChange={([v]) => onDesktopSizeChange(v)}
                        min={10}
                        max={120}
                        step={1}
                    />
                </div>
            ) : (
                <div className="space-y-2">
                     <div className="flex justify-between items-center">
                        <Label><Smartphone className="inline-block h-4 w-4 mr-2" />Mobil Størrelse</Label>
                        <span className="text-sm text-muted-foreground">{mobileSize}px</span>
                    </div>
                    <Slider 
                        value={[mobileSize]} 
                        onValueChange={([v]) => onMobileSizeChange(v)}
                        min={10}
                        max={80}
                        step={1}
                    />
                </div>
            )}
        </div>
    );
}

function EditableListItem({ index, item, updateItem, removeItem, fields, titleField }: { 
    index: number, 
    item: any, 
    updateItem: (index: number, data: any) => void, 
    removeItem: (index: number) => void,
    fields: {key: string, label: string, type?: 'textarea'}[],
    titleField: string
}) {
    const handleFieldChange = (field: string, value: string) => {
        updateItem(index, { ...item, [field]: value });
    };
    
    return (
        <AccordionItem value={`item-${index}`}>
            <div className="flex justify-between w-full items-center">
                <AccordionTrigger className="flex-1 pr-4 text-left">
                    <span>{item[titleField] || `Element ${index + 1}`}</span>
                </AccordionTrigger>
                <Button variant="ghost" size="icon" onClick={() => removeItem(index)}>
                    <Trash2 className="h-4 w-4 text-destructive" />
                </Button>
            </div>
            <AccordionContent className="p-4 border-t">
                <div className="space-y-4">
                    {fields.map(field => (
                        <div key={field.key} className="space-y-2">
                            <Label htmlFor={`item-${index}-${field.key}`}>{field.label}</Label>
                            {field.type === 'textarea' ? (
                                 <Textarea
                                    id={`item-${index}-${field.key}`}
                                    value={item[field.key] || ''}
                                    onChange={e => handleFieldChange(field.key, e.target.value)}
                                    rows={3}
                                />
                            ) : (
                                <Input
                                    id={`item-${index}-${field.key}`}
                                    value={item[field.key] || ''}
                                    onChange={e => handleFieldChange(field.key, e.target.value)}
                                />
                            )}
                        </div>
                    ))}
                </div>
            </AccordionContent>
        </AccordionItem>
    );
}

function SpacingEditor({
  label,
  padding,
  onPaddingChange,
  previewMode,
}: {
  label: string;
  padding: SectionPadding;
  onPaddingChange: (value: number, part: keyof SectionPadding) => void;
  previewMode: 'desktop' | 'mobile';
}) {
  return (
    <div className="p-4 border rounded-lg space-y-4 bg-muted/20">
      <h3 className="font-semibold">{label}</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
        {previewMode === 'desktop' ? (
          <>
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <Label className="flex items-center gap-2">
                  <Monitor className="h-4 w-4" /> Afstand i toppen
                </Label>
                <span className="text-sm text-muted-foreground">{padding.top}px</span>
              </div>
              <Slider
                value={[padding.top]}
                onValueChange={([v]) => onPaddingChange(v, 'top')}
                min={0}
                max={200}
                step={4}
              />
            </div>
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <Label className="flex items-center gap-2">
                  <Monitor className="h-4 w-4" /> Afstand i bunden
                </Label>
                <span className="text-sm text-muted-foreground">{padding.bottom}px</span>
              </div>
              <Slider
                value={[padding.bottom]}
                onValueChange={([v]) => onPaddingChange(v, 'bottom')}
                min={0}
                max={200}
                step={4}
              />
            </div>
          </>
        ) : (
          <>
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <Label className="flex items-center gap-2">
                  <Smartphone className="h-4 w-4" /> Afstand i toppen
                </Label>
                <span className="text-sm text-muted-foreground">{padding.topMobile}px</span>
              </div>
              <Slider
                value={[padding.topMobile]}
                onValueChange={([v]) => onPaddingChange(v, 'topMobile')}
                min={0}
                max={150}
                step={4}
              />
            </div>
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <Label className="flex items-center gap-2">
                  <Smartphone className="h-4 w-4" /> Afstand i bunden
                </Label>
                <span className="text-sm text-muted-foreground">{padding.bottomMobile}px</span>
              </div>
              <Slider
                value={[padding.bottomMobile]}
                onValueChange={([v]) => onPaddingChange(v, 'bottomMobile')}
                min={0}
                max={150}
                step={4}
              />
            </div>
          </>
        )}
      </div>
    </div>
  );
}


export default function CmsHomePage() {
  const [settings, setSettings] = useState<Partial<GeneralSettings>>({});
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, startSaving] = useTransition();
  const { toast } = useToast();
  const [previewMode, setPreviewMode] = useState<'desktop' | 'mobile'>('desktop');

  useEffect(() => {
    async function loadSettings() {
      setIsLoading(true);
      const loadedSettings = await getSettingsAction();
      const initialSettings = loadedSettings || {};

      const ensurePadding = (padding: Partial<SectionPadding> | undefined): SectionPadding => ({
        top: padding?.top ?? defaultPadding.top,
        bottom: padding?.bottom ?? defaultPadding.bottom,
        topMobile: padding?.topMobile ?? defaultPadding.topMobile,
        bottomMobile: padding?.bottomMobile ?? defaultPadding.bottomMobile,
      });
      
      const sections = ['services', 'aiProject', 'cases', 'about', 'contact'];
      const newSectionPadding: GeneralSettings['sectionPadding'] = {
        services: ensurePadding(initialSettings.sectionPadding?.services),
        aiProject: ensurePadding(initialSettings.sectionPadding?.aiProject),
        cases: ensurePadding(initialSettings.sectionPadding?.cases),
        about: ensurePadding(initialSettings.sectionPadding?.about),
        contact: ensurePadding(initialSettings.sectionPadding?.contact),
      };

      setSettings({
          ...initialSettings,
          heroHeadline: initialSettings.heroHeadline ?? 'Flow. Automatisér. Skalér.',
          heroHeadlineColor: initialSettings.heroHeadlineColor ?? 'text-white',
          heroHeadlineSize: initialSettings.heroHeadlineSize ?? 64,
          heroHeadlineSizeMobile: initialSettings.heroHeadlineSizeMobile ?? 40,
          heroDescription: initialSettings.heroDescription ?? 'Vi hjælper virksomheder med at bygge skalerbare digitale løsninger, der optimerer processer og driver vækst.',
          heroDescriptionColor: initialSettings.heroDescriptionColor ?? 'text-primary-foreground/80',
          heroDescriptionSize: initialSettings.heroDescriptionSize ?? 18,
          heroDescriptionSizeMobile: initialSettings.heroDescriptionSizeMobile ?? 16,
          heroImageUrl: initialSettings.heroImageUrl ?? 'https://picsum.photos/1920/1280',
          
          servicesSectionTitle: initialSettings.servicesSectionTitle ?? "Vores Services",
          servicesSectionTitleColor: initialSettings.servicesSectionTitleColor ?? "text-black",
          servicesSectionTitleSize: initialSettings.servicesSectionTitleSize ?? 36,
          servicesSectionDescription: initialSettings.servicesSectionDescription ?? "Vi tilbyder en bred vifte af ydelser for at accelerere jeres digitale rejse.",
          servicesSectionDescriptionColor: initialSettings.servicesSectionDescriptionColor ?? "text-muted-foreground",
          servicesSectionDescriptionSize: initialSettings.servicesSectionDescriptionSize ?? 18,
          services: initialSettings.services && initialSettings.services.length > 0 ? initialSettings.services : defaultServices,
          
          aiProjectSectionIconText: initialSettings.aiProjectSectionIconText ?? 'AI-drevet Projektkvalificering',
          aiProjectSectionTitle: initialSettings.aiProjectSectionTitle ?? 'Har du en idé? Lad os validere den sammen.',
          aiProjectSectionTitleColor: initialSettings.aiProjectSectionTitleColor ?? 'text-white',
          aiProjectSectionTitleSize: initialSettings.aiProjectSectionTitleSize ?? 36,
          aiProjectSectionDescription: initialSettings.aiProjectSectionDescription ?? 'Vores AI-assistent er designet til at forstå din vision. Start en samtale, og lad os sammen afdække potentialet i dit projekt. Det er det første, uforpligtende skridt mod at realisere din idé.',
          aiProjectSectionDescriptionColor: initialSettings.aiProjectSectionDescriptionColor ?? 'text-gray-300',
          aiProjectSectionDescriptionSize: initialSettings.aiProjectSectionDescriptionSize ?? 18,
          aiProjectSectionBackgroundColor: initialSettings.aiProjectSectionBackgroundColor ?? { h: 240, s: 10, l: 10 },

          casesSectionTitle: initialSettings.casesSectionTitle ?? "Vores Arbejde",
          casesSectionTitleColor: initialSettings.casesSectionTitleColor ?? "text-black",
          casesSectionTitleSize: initialSettings.casesSectionTitleSize ?? 36,
          casesSectionDescription: initialSettings.casesSectionDescription ?? "Se eksempler på, hvordan vi har hjulpet andre virksomheder med at opnå deres mål.",
          casesSectionDescriptionColor: initialSettings.casesSectionDescriptionColor ?? "text-muted-foreground",
          casesSectionDescriptionSize: initialSettings.casesSectionDescriptionSize ?? 18,
          cases: initialSettings.cases && initialSettings.cases.length > 0 ? initialSettings.cases : defaultCases,
          
          aboutSectionTitle: initialSettings.aboutSectionTitle ?? "Hvem er Digifly?",
          aboutSectionTitleColor: initialSettings.aboutSectionTitleColor ?? "text-black",
          aboutSectionTitleSize: initialSettings.aboutSectionTitleSize ?? 36,
          aboutText: initialSettings.aboutText ?? defaultAboutText,
          aboutTextColor: initialSettings.aboutTextColor ?? "text-muted-foreground",
          aboutTextSize: initialSettings.aboutTextSize ?? 18,
          teamMembers: initialSettings.teamMembers && initialSettings.teamMembers.length > 0 ? initialSettings.teamMembers : defaultTeam,
          teamMemberNameColor: initialSettings.teamMemberNameColor ?? 'text-foreground',
          teamMemberNameSize: initialSettings.teamMemberNameSize ?? 18,
          teamMemberTitleColor: initialSettings.teamMemberTitleColor ?? 'text-primary',
          teamMemberTitleSize: initialSettings.teamMemberTitleSize ?? 14,
          teamMemberDescriptionColor: initialSettings.teamMemberDescriptionColor ?? 'text-muted-foreground',
          teamMemberDescriptionSize: initialSettings.teamMemberDescriptionSize ?? 14,
          
          sectionPadding: newSectionPadding,
      });

      setIsLoading(false);
    }
    loadSettings();
  }, []);
  
  const handleInputChange = (field: keyof GeneralSettings, value: any) => {
    setSettings(prev => ({ ...prev, [field]: value }));
  };

  const handlePaddingChange = (section: keyof NonNullable<GeneralSettings['sectionPadding']>, value: number, part: keyof SectionPadding) => {
    setSettings(prev => {
        const currentPadding = prev.sectionPadding?.[section] || defaultPadding;
        const newSectionPadding = { ...prev.sectionPadding };
        newSectionPadding[section] = {
            ...currentPadding,
            [part]: value,
        };
        return {
            ...prev,
            sectionPadding: newSectionPadding
        };
    });
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
          <h1 className="text-2xl font-bold">Forside Indhold</h1>
          <p className="text-muted-foreground">Administrer indholdet på din forside.</p>
        </div>
        <div className="flex items-center gap-4">
            <ToggleGroup 
                type="single" 
                value={previewMode}
                onValueChange={(value: 'desktop' | 'mobile') => value && setPreviewMode(value)}
                aria-label="Vælg visning"
                variant="outline"
            >
                <ToggleGroupItem value="desktop" aria-label="Desktop visning">
                    <Monitor className="h-4 w-4" />
                </ToggleGroupItem>
                <ToggleGroupItem value="mobile" aria-label="Mobil visning">
                    <Smartphone className="h-4 w-4" />
                </ToggleGroupItem>
            </ToggleGroup>

            <Button size="lg" onClick={handleSaveChanges} disabled={isSaving}>
            {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Gem Ændringer
            </Button>
        </div>
      </div>

      <Accordion type="multiple" className="w-full space-y-4" defaultValue={['hero']}>
        <Card className="shadow-lg">
            <AccordionItem value="hero">
                <AccordionTrigger className="px-6 py-4">
                    <div className="text-left">
                        <CardTitle>Hero Sektion</CardTitle>
                        <CardDescription className="mt-1">Indholdet i toppen af siden.</CardDescription>
                    </div>
                </AccordionTrigger>
                <AccordionContent className="border-t">
                    <CardContent className="space-y-6 pt-6">
                         <div className="space-y-2">
                            <Label htmlFor="hero-headline">Overskrift</Label>
                            <Input id="hero-headline" value={settings.heroHeadline || ''} onChange={e => handleInputChange('heroHeadline', e.target.value)} />
                        </div>
                        <TextStyleEditor 
                            label="Design for Overskrift"
                            colorValue={settings.heroHeadlineColor as ThemeColor || 'text-white'}
                            onColorChange={(v) => handleInputChange('heroHeadlineColor', v)}
                            desktopSize={settings.heroHeadlineSize || 64}
                            onDesktopSizeChange={(v) => handleInputChange('heroHeadlineSize', v)}
                            mobileSize={settings.heroHeadlineSizeMobile || 40}
                            onMobileSizeChange={(v) => handleInputChange('heroHeadlineSizeMobile', v)}
                            previewMode={previewMode}
                        />
                        <div className="space-y-2">
                            <Label htmlFor="hero-description">Beskrivelse</Label>
                            <Textarea id="hero-description" value={settings.heroDescription || ''} onChange={e => handleInputChange('heroDescription', e.target.value)} />
                        </div>
                        <TextStyleEditor 
                            label="Design for Beskrivelse"
                            colorValue={settings.heroDescriptionColor as ThemeColor || 'text-primary-foreground/80'}
                            onColorChange={(v) => handleInputChange('heroDescriptionColor', v)}
                            desktopSize={settings.heroDescriptionSize || 18}
                            onDesktopSizeChange={(v) => handleInputChange('heroDescriptionSize', v)}
                            mobileSize={settings.heroDescriptionSizeMobile || 16}
                            onMobileSizeChange={(v) => handleInputChange('heroDescriptionSizeMobile', v)}
                            previewMode={previewMode}
                        />
                        <div className="space-y-2">
                            <Label htmlFor="hero-image">Baggrundsbillede URL</Label>
                            <Input id="hero-image" value={settings.heroImageUrl || ''} onChange={e => handleInputChange('heroImageUrl', e.target.value)} />
                             <p className="text-sm text-muted-foreground">
                                Find gratis billeder i høj kvalitet på f.eks. 
                                <Link href="https://unsplash.com" target="_blank" className="text-primary underline hover:text-primary/80 mx-1">Unsplash</Link> 
                                eller
                                <Link href="https://pexels.com" target="_blank" className="text-primary underline hover:text-primary/80 mx-1">Pexels</Link>.
                                Sørg for at du har rettighederne til det billede, du bruger.
                            </p>
                        </div>
                    </CardContent>
                </AccordionContent>
            </AccordionItem>
        </Card>

        <Card className="shadow-lg">
            <AccordionItem value="services">
                <AccordionTrigger className="px-6 py-4">
                    <div className="text-left">
                        <CardTitle>Services Sektion</CardTitle>
                        <CardDescription className="mt-1">Administrer de viste services.</CardDescription>
                    </div>
                </AccordionTrigger>
                <AccordionContent className="border-t">
                    <CardContent className="space-y-6 pt-6">
                        <div className="space-y-2">
                            <Label htmlFor="services-title">Sektionstitel</Label>
                            <Input id="services-title" value={settings.servicesSectionTitle || ''} onChange={e => handleInputChange('servicesSectionTitle', e.target.value)} />
                        </div>
                        <div className="p-4 border rounded-lg bg-muted/20">
                            <h3 className="font-semibold">Design for Sektionstitel</h3>
                            <div className="space-y-2 mt-2">
                                <Label>Farve</Label>
                                <Select value={settings.servicesSectionTitleColor as ThemeColor || 'text-black'} onValueChange={(v) => handleInputChange('servicesSectionTitleColor', v)}>
                                    <SelectTrigger><SelectValue/></SelectTrigger>
                                    <SelectContent>{themeColorOptions.map(opt => <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>)}</SelectContent>
                                </Select>
                            </div>
                             <div className="space-y-2 mt-2">
                                <div className="flex justify-between items-center">
                                    <Label>Tekststørrelse</Label>
                                    <span className="text-sm text-muted-foreground">{settings.servicesSectionTitleSize || 36}px</span>
                                </div>
                                <Slider value={[settings.servicesSectionTitleSize || 36]} onValueChange={([v]) => handleInputChange('servicesSectionTitleSize', v)} min={10} max={120} step={1} />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="services-description">Sektionsbeskrivelse</Label>
                            <Textarea id="services-description" value={settings.servicesSectionDescription || ''} onChange={e => handleInputChange('servicesSectionDescription', e.target.value)} />
                        </div>
                        <div className="p-4 border rounded-lg bg-muted/20">
                             <h3 className="font-semibold">Design for Sektionsbeskrivelse</h3>
                             <div className="space-y-2 mt-2">
                                <Label>Farve</Label>
                                <Select value={settings.servicesSectionDescriptionColor as ThemeColor || 'text-muted-foreground'} onValueChange={(v) => handleInputChange('servicesSectionDescriptionColor', v)}>
                                    <SelectTrigger><SelectValue/></SelectTrigger>
                                    <SelectContent>{themeColorOptions.map(opt => <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>)}</SelectContent>
                                </Select>
                            </div>
                             <div className="space-y-2 mt-2">
                                <div className="flex justify-between items-center">
                                    <Label>Tekststørrelse</Label>
                                    <span className="text-sm text-muted-foreground">{settings.servicesSectionDescriptionSize || 18}px</span>
                                </div>
                                <Slider value={[settings.servicesSectionDescriptionSize || 18]} onValueChange={([v]) => handleInputChange('servicesSectionDescriptionSize', v)} min={10} max={120} step={1} />
                            </div>
                        </div>

                        <Label>Service-kort</Label>
                        <Accordion type="multiple" className="w-full border rounded-md">
                            {(settings.services || []).map((service, index) => (
                                <EditableListItem 
                                    key={index}
                                    index={index}
                                    item={service}
                                    updateItem={(i, data) => handleListUpdate('services', i, data)}
                                    removeItem={(i) => handleListRemove('services', i)}
                                    fields={[
                                        {key: 'title', label: 'Titel'},
                                        {key: 'description', label: 'Beskrivelse', type: 'textarea'},
                                        {key: 'imageUrl', label: 'Billede URL'},
                                        {key: 'aiHint', label: 'AI Billede Hint'},
                                    ]}
                                    titleField="title"
                                />
                            ))}
                        </Accordion>
                        <Button variant="outline" onClick={() => handleListAdd('services', { title: 'Ny Service', description: '', imageUrl: '', aiHint: '' })}>Tilføj Service</Button>
                    </CardContent>
                </AccordionContent>
            </AccordionItem>
        </Card>

        <Card className="shadow-lg">
            <AccordionItem value="ai-project">
                <AccordionTrigger className="px-6 py-4">
                    <div className="text-left">
                        <CardTitle>AI Projekt Sektion</CardTitle>
                        <CardDescription className="mt-1">Administrer indhold og design for AI-chat sektionen.</CardDescription>
                    </div>
                </AccordionTrigger>
                <AccordionContent className="border-t">
                    <CardContent className="space-y-6 pt-6">
                        <div className="space-y-2">
                            <Label htmlFor="ai-project-icon-text">Ikon-tekst</Label>
                            <Input id="ai-project-icon-text" value={settings.aiProjectSectionIconText || ''} onChange={e => handleInputChange('aiProjectSectionIconText', e.target.value)} />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="ai-project-title">Titel</Label>
                            <Input id="ai-project-title" value={settings.aiProjectSectionTitle || ''} onChange={e => handleInputChange('aiProjectSectionTitle', e.target.value)} />
                        </div>
                         <div className="p-4 border rounded-lg bg-muted/20">
                            <h3 className="font-semibold">Design for Titel</h3>
                            <div className="space-y-2 mt-2">
                                <Label>Farve</Label>
                                <Select value={settings.aiProjectSectionTitleColor as ThemeColor || 'text-white'} onValueChange={(v) => handleInputChange('aiProjectSectionTitleColor', v)}>
                                    <SelectTrigger><SelectValue/></SelectTrigger>
                                    <SelectContent>{themeColorOptions.map(opt => <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>)}</SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-2 mt-2">
                                <div className="flex justify-between items-center">
                                    <Label>Tekststørrelse</Label>
                                    <span className="text-sm text-muted-foreground">{settings.aiProjectSectionTitleSize || 36}px</span>
                                </div>
                                <Slider value={[settings.aiProjectSectionTitleSize || 36]} onValueChange={([v]) => handleInputChange('aiProjectSectionTitleSize', v)} min={10} max={120} step={1} />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="ai-project-description">Beskrivelse</Label>
                            <Textarea id="ai-project-description" value={settings.aiProjectSectionDescription || ''} onChange={e => handleInputChange('aiProjectSectionDescription', e.target.value)} rows={4} />
                        </div>
                        <div className="p-4 border rounded-lg bg-muted/20">
                            <h3 className="font-semibold">Design for Beskrivelse</h3>
                            <div className="space-y-2 mt-2">
                                <Label>Farve</Label>
                                <Select value={settings.aiProjectSectionDescriptionColor as ThemeColor || 'text-gray-300'} onValueChange={(v) => handleInputChange('aiProjectSectionDescriptionColor', v)}>
                                    <SelectTrigger><SelectValue/></SelectTrigger>
                                    <SelectContent>{themeColorOptions.map(opt => <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>)}</SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-2 mt-2">
                                <div className="flex justify-between items-center">
                                    <Label>Tekststørrelse</Label>
                                    <span className="text-sm text-muted-foreground">{settings.aiProjectSectionDescriptionSize || 18}px</span>
                                </div>
                                <Slider value={[settings.aiProjectSectionDescriptionSize || 18]} onValueChange={([v]) => handleInputChange('aiProjectSectionDescriptionSize', v)} min={10} max={48} step={1} />
                            </div>
                        </div>
                        {settings.aiProjectSectionBackgroundColor &&
                          <HslColorPicker 
                              label="Baggrundsfarve (Mørk)"
                              color={settings.aiProjectSectionBackgroundColor}
                              onChange={(hsl) => handleInputChange('aiProjectSectionBackgroundColor', hsl)}
                          />
                        }
                    </CardContent>
                </AccordionContent>
            </AccordionItem>
        </Card>
      
        <Card className="shadow-lg">
            <AccordionItem value="cases">
                <AccordionTrigger className="px-6 py-4">
                    <div className="text-left">
                        <CardTitle>Cases Sektion</CardTitle>
                        <CardDescription className="mt-1">Administrer de viste cases.</CardDescription>
                    </div>
                </AccordionTrigger>
                <AccordionContent className="border-t">
                    <CardContent className="space-y-6 pt-6">
                        <div className="space-y-2">
                            <Label htmlFor="cases-title">Sektionstitel</Label>
                            <Input id="cases-title" value={settings.casesSectionTitle || ''} onChange={e => handleInputChange('casesSectionTitle', e.target.value)} />
                        </div>
                        <div className="p-4 border rounded-lg bg-muted/20">
                            <h3 className="font-semibold">Design for Sektionstitel</h3>
                            <div className="space-y-2 mt-2">
                                <Label>Farve</Label>
                                <Select value={settings.casesSectionTitleColor as ThemeColor || 'text-black'} onValueChange={(v) => handleInputChange('casesSectionTitleColor', v)}>
                                    <SelectTrigger><SelectValue/></SelectTrigger>
                                    <SelectContent>{themeColorOptions.map(opt => <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>)}</SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-2 mt-2">
                                <div className="flex justify-between items-center">
                                    <Label>Tekststørrelse</Label>
                                    <span className="text-sm text-muted-foreground">{settings.casesSectionTitleSize || 36}px</span>
                                </div>
                                <Slider value={[settings.casesSectionTitleSize || 36]} onValueChange={([v]) => handleInputChange('casesSectionTitleSize', v)} min={10} max={120} step={1} />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="cases-description">Sektionsbeskrivelse</Label>
                            <Textarea id="cases-description" value={settings.casesSectionDescription || ''} onChange={e => handleInputChange('casesSectionDescription', e.target.value)} />
                        </div>
                        <div className="p-4 border rounded-lg bg-muted/20">
                            <h3 className="font-semibold">Design for Sektionsbeskrivelse</h3>
                            <div className="space-y-2 mt-2">
                                <Label>Farve</Label>
                                <Select value={settings.casesSectionDescriptionColor as ThemeColor || 'text-muted-foreground'} onValueChange={(v) => handleInputChange('casesSectionDescriptionColor', v)}>
                                    <SelectTrigger><SelectValue/></SelectTrigger>
                                    <SelectContent>{themeColorOptions.map(opt => <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>)}</SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-2 mt-2">
                                <div className="flex justify-between items-center">
                                    <Label>Tekststørrelse</Label>
                                    <span className="text-sm text-muted-foreground">{settings.casesSectionDescriptionSize || 18}px</span>
                                </div>
                                <Slider value={[settings.casesSectionDescriptionSize || 18]} onValueChange={([v]) => handleInputChange('casesSectionDescriptionSize', v)} min={10} max={120} step={1} />
                            </div>
                        </div>
                        <Label>Case-kort</Label>
                        <Accordion type="multiple" className="w-full border rounded-md">
                            {(settings.cases || []).map((caseItem, index) => (
                                <EditableListItem 
                                    key={index}
                                    index={index}
                                    item={caseItem}
                                    updateItem={(i, data) => handleListUpdate('cases', i, data)}
                                    removeItem={(i) => handleListRemove('cases', i)}
                                    fields={[
                                        {key: 'title', label: 'Titel'},
                                        {key: 'description', label: 'Beskrivelse', type: 'textarea'},
                                        {key: 'imageUrl', label: 'Billede URL'},
                                        {key: 'link', label: 'Link URL'},
                                        {key: 'aiHint', label: 'AI Billede Hint'},
                                    ]}
                                    titleField="title"
                                />
                            ))}
                        </Accordion>
                        <Button variant="outline" onClick={() => handleListAdd('cases', { title: 'Ny Case', description: '', imageUrl: '', link: '#', aiHint: '' })}>Tilføj Case</Button>
                    </CardContent>
                </AccordionContent>
            </AccordionItem>
        </Card>

        <Card className="shadow-lg">
            <AccordionItem value="about">
                <AccordionTrigger className="px-6 py-4">
                    <div className="text-left">
                        <CardTitle>Om Os Sektion</CardTitle>
                        <CardDescription className="mt-1">Administrer tekst og teammedlemmer.</CardDescription>
                    </div>
                </AccordionTrigger>
                <AccordionContent className="border-t">
                    <CardContent className="space-y-6 pt-6">
                        <div className="space-y-2">
                            <Label htmlFor="about-title">Sektionstitel</Label>
                            <Input id="about-title" value={settings.aboutSectionTitle || ''} onChange={e => handleInputChange('aboutSectionTitle', e.target.value)} />
                        </div>
                         <div className="p-4 border rounded-lg bg-muted/20">
                            <h3 className="font-semibold">Design for Sektionstitel</h3>
                            <div className="space-y-2 mt-2">
                                <Label>Farve</Label>
                                <Select value={settings.aboutSectionTitleColor as ThemeColor || 'text-black'} onValueChange={(v) => handleInputChange('aboutSectionTitleColor', v)}>
                                    <SelectTrigger><SelectValue/></SelectTrigger>
                                    <SelectContent>{themeColorOptions.map(opt => <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>)}</SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-2 mt-2">
                                <div className="flex justify-between items-center">
                                    <Label>Tekststørrelse</Label>
                                    <span className="text-sm text-muted-foreground">{settings.aboutSectionTitleSize || 36}px</span>
                                </div>
                                <Slider value={[settings.aboutSectionTitleSize || 36]} onValueChange={([v]) => handleInputChange('aboutSectionTitleSize', v)} min={10} max={120} step={1} />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="about-text">Intro tekst</Label>
                            <Textarea id="about-text" value={settings.aboutText || ''} onChange={e => handleInputChange('aboutText', e.target.value)} rows={5} />
                        </div>
                         <div className="p-4 border rounded-lg bg-muted/20">
                            <h3 className="font-semibold">Design for Intro Tekst</h3>
                            <div className="space-y-2 mt-2">
                                <Label>Farve</Label>
                                <Select value={settings.aboutTextColor as ThemeColor || 'text-muted-foreground'} onValueChange={(v) => handleInputChange('aboutTextColor', v)}>
                                    <SelectTrigger><SelectValue/></SelectTrigger>
                                    <SelectContent>{themeColorOptions.map(opt => <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>)}</SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-2 mt-2">
                                <div className="flex justify-between items-center">
                                    <Label>Tekststørrelse</Label>
                                    <span className="text-sm text-muted-foreground">{settings.aboutTextSize || 18}px</span>
                                </div>
                                <Slider value={[settings.aboutTextSize || 18]} onValueChange={([v]) => handleInputChange('aboutTextSize', v)} min={10} max={120} step={1} />
                            </div>
                        </div>
                        <div className="space-y-2">
                             <Label>Team</Label>
                             <div className="p-4 border rounded-lg bg-muted/20 space-y-4">
                                <h3 className="font-semibold">Design for teammedlemmer</h3>
                                <div className="space-y-2">
                                    <Label>Navn farve</Label>
                                    <Select value={settings.teamMemberNameColor as ThemeColor || 'text-foreground'} onValueChange={(v) => handleInputChange('teamMemberNameColor', v)}>
                                        <SelectTrigger><SelectValue/></SelectTrigger>
                                        <SelectContent>{themeColorOptions.map(opt => <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>)}</SelectContent>
                                    </Select>
                                </div>
                                <div className="space-y-2">
                                     <div className="flex justify-between items-center">
                                        <Label>Navn Tekststørrelse</Label>
                                        <span className="text-sm text-muted-foreground">{settings.teamMemberNameSize || 18}px</span>
                                    </div>
                                    <Slider value={[settings.teamMemberNameSize || 18]} onValueChange={([v]) => handleInputChange('teamMemberNameSize', v)} min={12} max={32} step={1} />
                                </div>
                                 <div className="space-y-2">
                                    <Label>Titel farve</Label>
                                    <Select value={settings.teamMemberTitleColor as ThemeColor || 'text-primary'} onValueChange={(v) => handleInputChange('teamMemberTitleColor', v)}>
                                        <SelectTrigger><SelectValue/></SelectTrigger>
                                        <SelectContent>{themeColorOptions.map(opt => <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>)}</SelectContent>
                                    </Select>
                                </div>
                                <div className="space-y-2">
                                     <div className="flex justify-between items-center">
                                        <Label>Titel Tekststørrelse</Label>
                                        <span className="text-sm text-muted-foreground">{settings.teamMemberTitleSize || 14}px</span>
                                    </div>
                                    <Slider value={[settings.teamMemberTitleSize || 14]} onValueChange={([v]) => handleInputChange('teamMemberTitleSize', v)} min={10} max={24} step={1} />
                                </div>
                                 <div className="space-y-2">
                                    <Label>Beskrivelse farve</Label>
                                    <Select value={settings.teamMemberDescriptionColor as ThemeColor || 'text-muted-foreground'} onValueChange={(v) => handleInputChange('teamMemberDescriptionColor', v)}>
                                        <SelectTrigger><SelectValue/></SelectTrigger>
                                        <SelectContent>{themeColorOptions.map(opt => <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>)}</SelectContent>
                                    </Select>
                                </div>
                                <div className="space-y-2">
                                     <div className="flex justify-between items-center">
                                        <Label>Beskrivelse Tekststørrelse</Label>
                                        <span className="text-sm text-muted-foreground">{settings.teamMemberDescriptionSize || 14}px</span>
                                    </div>
                                    <Slider value={[settings.teamMemberDescriptionSize || 14]} onValueChange={([v]) => handleInputChange('teamMemberDescriptionSize', v)} min={10} max={24} step={1} />
                                </div>
                             </div>
                        </div>

                        <Accordion type="multiple" className="w-full border rounded-md">
                            {(settings.teamMembers || []).map((member, index) => (
                                <EditableListItem 
                                    key={index}
                                    index={index}
                                    item={member}
                                    updateItem={(i, data) => handleListUpdate('teamMembers', i, data)}
                                    removeItem={(i) => handleListRemove('teamMembers', i)}
                                    fields={[
                                        {key: 'name', label: 'Navn'},
                                        {key: 'title', label: 'Titel'},
                                        {key: 'description', label: 'Beskrivelse', type: 'textarea'},
                                        {key: 'imageUrl', label: 'Billede URL'},
                                        {key: 'linkedinUrl', label: 'LinkedIn URL'},
                                        {key: 'aiHint', label: 'AI Billede Hint'},
                                    ]}
                                    titleField="name"
                                />
                            ))}
                        </Accordion>
                        <Button variant="outline" onClick={() => handleListAdd('teamMembers', { name: 'Nyt Medlem', title: '', description: '', imageUrl: '', linkedinUrl: '#', aiHint: '' })}>Tilføj Medlem</Button>
                    </CardContent>
                </AccordionContent>
            </AccordionItem>
        </Card>
        
        <Card className="shadow-lg">
            <AccordionItem value="spacing">
                <AccordionTrigger className="px-6 py-4">
                    <div className="text-left">
                        <CardTitle>Sektionsafstand</CardTitle>
                        <CardDescription className="mt-1">Juster den vertikale afstand (padding) for hver sektion.</CardDescription>
                    </div>
                </AccordionTrigger>
                <AccordionContent className="border-t">
                    <CardContent className="space-y-4 pt-6">
                        {settings.sectionPadding?.services && (
                            <SpacingEditor
                                label="Services"
                                padding={settings.sectionPadding.services}
                                onPaddingChange={(v, p) => handlePaddingChange('services', v, p)}
                                previewMode={previewMode}
                            />
                        )}
                        {settings.sectionPadding?.aiProject && (
                            <SpacingEditor
                                label="Fortæl os om dit projekt"
                                padding={settings.sectionPadding.aiProject}
                                onPaddingChange={(v, p) => handlePaddingChange('aiProject', v, p)}
                                previewMode={previewMode}
                            />
                        )}
                        {settings.sectionPadding?.cases && (
                            <SpacingEditor
                                label="Cases"
                                padding={settings.sectionPadding.cases}
                                onPaddingChange={(v, p) => handlePaddingChange('cases', v, p)}
                                previewMode={previewMode}
                            />
                        )}
                        {settings.sectionPadding?.about && (
                            <SpacingEditor
                                label="Om Os"
                                padding={settings.sectionPadding.about}
                                onPaddingChange={(v, p) => handlePaddingChange('about', v, p)}
                                previewMode={previewMode}
                            />
                        )}
                        {settings.sectionPadding?.contact && (
                            <SpacingEditor
                                label="Kontakt"
                                padding={settings.sectionPadding.contact}
                                onPaddingChange={(v, p) => handlePaddingChange('contact', v, p)}
                                previewMode={previewMode}
                            />
                        )}
                    </CardContent>
                </AccordionContent>
            </AccordionItem>
        </Card>
      </Accordion>
    </div>
  );
}
