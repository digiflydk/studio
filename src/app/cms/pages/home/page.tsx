
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
import { Loader2, Trash2, Monitor, Smartphone } from 'lucide-react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';

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

const defaultPadding = { top: 96, bottom: 96, topMobile: 64, bottomMobile: 64 };

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
        <div className="p-4 border rounded-lg grid grid-cols-1 md:grid-cols-2 gap-4 bg-muted/20">
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
                    max={120}
                    step={1}
                />
            </div>
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
    onPaddingChange
}: {
    label: string;
    padding: SectionPadding;
    onPaddingChange: (padding: SectionPadding) => void;
}) {
    return (
        <div className="p-4 border rounded-lg space-y-4 bg-muted/20">
            <h3 className="font-semibold">{label}</h3>
             <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
                <div className="space-y-2">
                    <div className="flex justify-between items-center">
                        <Label className="flex items-center gap-2"><Monitor className="h-4 w-4" /> Afstand i toppen (Desktop)</Label>
                        <span className="text-sm text-muted-foreground">{padding.top}px</span>
                    </div>
                    <Slider 
                        value={[padding.top]} 
                        onValueChange={([v]) => onPaddingChange({ ...padding, top: v })}
                        min={0}
                        max={200}
                        step={4}
                    />
                </div>
                <div className="space-y-2">
                    <div className="flex justify-between items-center">
                        <Label className="flex items-center gap-2"><Smartphone className="h-4 w-4" /> Afstand i toppen (Mobil)</Label>
                        <span className="text-sm text-muted-foreground">{padding.topMobile}px</span>
                    </div>
                    <Slider 
                        value={[padding.topMobile]} 
                        onValueChange={([v]) => onPaddingChange({ ...padding, topMobile: v })}
                        min={0}
                        max={150}
                        step={4}
                    />
                </div>
                <div className="space-y-2">
                    <div className="flex justify-between items-center">
                        <Label className="flex items-center gap-2"><Monitor className="h-4 w-4" /> Afstand i bunden (Desktop)</Label>
                        <span className="text-sm text-muted-foreground">{padding.bottom}px</span>
                    </div>
                    <Slider 
                        value={[padding.bottom]} 
                        onValueChange={([v]) => onPaddingChange({ ...padding, bottom: v })}
                        min={0}
                        max={200}
                        step={4}
                    />
                </div>
                 <div className="space-y-2">
                    <div className="flex justify-between items-center">
                        <Label className="flex items-center gap-2"><Smartphone className="h-4 w-4" /> Afstand i bunden (Mobil)</Label>
                        <span className="text-sm text-muted-foreground">{padding.bottomMobile}px</span>
                    </div>
                    <Slider 
                        value={[padding.bottomMobile]} 
                        onValueChange={([v]) => onPaddingChange({ ...padding, bottomMobile: v })}
                        min={0}
                        max={150}
                        step={4}
                    />
                </div>
             </div>
        </div>
    );
}

export default function CmsHomePage() {
  const [settings, setSettings] = useState<Partial<GeneralSettings>>({});
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, startSaving] = useTransition();
  const { toast } = useToast();

  useEffect(() => {
    async function loadSettings() {
      setIsLoading(true);
      const loadedSettings = await getSettingsAction();
      const initialSettings = loadedSettings || {};

      setSettings({
          ...initialSettings,
          heroHeadline: initialSettings.heroHeadline || 'Flow. Automatisér. Skalér.',
          heroHeadlineColor: initialSettings.heroHeadlineColor || 'text-white',
          heroHeadlineSize: initialSettings.heroHeadlineSize || 64,
          heroDescription: initialSettings.heroDescription || 'Vi hjælper virksomheder med at bygge skalerbare digitale løsninger, der optimerer processer og driver vækst.',
          heroDescriptionColor: initialSettings.heroDescriptionColor || 'text-primary-foreground/80',
          heroDescriptionSize: initialSettings.heroDescriptionSize || 18,
          heroImageUrl: initialSettings.heroImageUrl || 'https://picsum.photos/1920/1280',
          
          servicesSectionTitle: initialSettings.servicesSectionTitle || "Vores Services",
          servicesSectionTitleColor: initialSettings.servicesSectionTitleColor || "text-black",
          servicesSectionTitleSize: initialSettings.servicesSectionTitleSize || 36,
          servicesSectionDescription: initialSettings.servicesSectionDescription || "Vi tilbyder en bred vifte af ydelser for at accelerere jeres digitale rejse.",
          servicesSectionDescriptionColor: initialSettings.servicesSectionDescriptionColor || "text-muted-foreground",
          servicesSectionDescriptionSize: initialSettings.servicesSectionDescriptionSize || 18,
          services: initialSettings.services && initialSettings.services.length > 0 ? initialSettings.services : defaultServices,
          
          casesSectionTitle: initialSettings.casesSectionTitle || "Vores Arbejde",
          casesSectionTitleColor: initialSettings.casesSectionTitleColor || "text-black",
          casesSectionTitleSize: initialSettings.casesSectionTitleSize || 36,
          casesSectionDescription: initialSettings.casesSectionDescription || "Se eksempler på, hvordan vi har hjulpet andre virksomheder med at opnå deres mål.",
          casesSectionDescriptionColor: initialSettings.casesSectionDescriptionColor || "text-muted-foreground",
          casesSectionDescriptionSize: initialSettings.casesSectionDescriptionSize || 18,
          cases: initialSettings.cases && initialSettings.cases.length > 0 ? initialSettings.cases : defaultCases,
          
          aboutSectionTitle: initialSettings.aboutSectionTitle || "Hvem er Digifly?",
          aboutSectionTitleColor: initialSettings.aboutSectionTitleColor || "text-black",
          aboutSectionTitleSize: initialSettings.aboutSectionTitleSize || 36,
          aboutText: initialSettings.aboutText || defaultAboutText,
          aboutTextColor: initialSettings.aboutTextColor || "text-muted-foreground",
          aboutTextSize: initialSettings.aboutTextSize || 18,
          teamMembers: initialSettings.teamMembers && initialSettings.teamMembers.length > 0 ? initialSettings.teamMembers : defaultTeam,
          
          sectionPadding: {
              services: initialSettings.sectionPadding?.services || defaultPadding,
              aiProject: initialSettings.sectionPadding?.aiProject || defaultPadding,
              cases: initialSettings.sectionPadding?.cases || defaultPadding,
              about: initialSettings.sectionPadding?.about || defaultPadding,
              contact: initialSettings.sectionPadding?.contact || defaultPadding,
          },
      });

      setIsLoading(false);
    }
    loadSettings();
  }, []);
  
  const handleInputChange = (field: keyof GeneralSettings, value: any) => {
    setSettings(prev => ({ ...prev, [field]: value }));
  };

  const handlePaddingChange = (section: keyof NonNullable<GeneralSettings['sectionPadding']>, value: SectionPadding) => {
    setSettings(prev => ({
        ...prev,
        sectionPadding: {
            ...prev.sectionPadding,
            [section]: value,
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
        <Button size="lg" onClick={handleSaveChanges} disabled={isSaving}>
          {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Gem Ændringer
        </Button>
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
                            sizeValue={settings.heroHeadlineSize || 64}
                            onSizeChange={(v) => handleInputChange('heroHeadlineSize', v)}
                        />
                        <div className="space-y-2">
                            <Label htmlFor="hero-description">Beskrivelse</Label>
                            <Textarea id="hero-description" value={settings.heroDescription || ''} onChange={e => handleInputChange('heroDescription', e.target.value)} />
                        </div>
                        <TextStyleEditor 
                            label="Design for Beskrivelse"
                            colorValue={settings.heroDescriptionColor as ThemeColor || 'text-primary-foreground/80'}
                            onColorChange={(v) => handleInputChange('heroDescriptionColor', v)}
                            sizeValue={settings.heroDescriptionSize || 18}
                            onSizeChange={(v) => handleInputChange('heroDescriptionSize', v)}
                        />
                        <div className="space-y-2">
                            <Label htmlFor="hero-image">Baggrundsbillede URL</Label>
                            <Input id="hero-image" value={settings.heroImageUrl || ''} onChange={e => handleInputChange('heroImageUrl', e.target.value)} />
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
                        <TextStyleEditor 
                            label="Design for Sektionstitel"
                            colorValue={settings.servicesSectionTitleColor as ThemeColor || 'text-black'}
                            onColorChange={(v) => handleInputChange('servicesSectionTitleColor', v)}
                            sizeValue={settings.servicesSectionTitleSize || 36}
                            onSizeChange={(v) => handleInputChange('servicesSectionTitleSize', v)}
                        />
                        <div className="space-y-2">
                            <Label htmlFor="services-description">Sektionsbeskrivelse</Label>
                            <Textarea id="services-description" value={settings.servicesSectionDescription || ''} onChange={e => handleInputChange('servicesSectionDescription', e.target.value)} />
                        </div>
                        <TextStyleEditor 
                            label="Design for Sektionsbeskrivelse"
                            colorValue={settings.servicesSectionDescriptionColor as ThemeColor || 'text-muted-foreground'}
                            onColorChange={(v) => handleInputChange('servicesSectionDescriptionColor', v)}
                            sizeValue={settings.servicesSectionDescriptionSize || 18}
                            onSizeChange={(v) => handleInputChange('servicesSectionDescriptionSize', v)}
                        />
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
                        <TextStyleEditor 
                            label="Design for Sektionstitel"
                            colorValue={settings.casesSectionTitleColor as ThemeColor || 'text-black'}
                            onColorChange={(v) => handleInputChange('casesSectionTitleColor', v)}
                            sizeValue={settings.casesSectionTitleSize || 36}
                            onSizeChange={(v) => handleInputChange('casesSectionTitleSize', v)}
                        />
                        <div className="space-y-2">
                            <Label htmlFor="cases-description">Sektionsbeskrivelse</Label>
                            <Textarea id="cases-description" value={settings.casesSectionDescription || ''} onChange={e => handleInputChange('casesSectionDescription', e.target.value)} />
                        </div>
                        <TextStyleEditor 
                            label="Design for Sektionsbeskrivelse"
                            colorValue={settings.casesSectionDescriptionColor as ThemeColor || 'text-muted-foreground'}
                            onColorChange={(v) => handleInputChange('casesSectionDescriptionColor', v)}
                            sizeValue={settings.casesSectionDescriptionSize || 18}
                            onSizeChange={(v) => handleInputChange('casesSectionDescriptionSize', v)}
                        />
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
                        <TextStyleEditor 
                            label="Design for Sektionstitel"
                            colorValue={settings.aboutSectionTitleColor as ThemeColor || 'text-black'}
                            onColorChange={(v) => handleInputChange('aboutSectionTitleColor', v)}
                            sizeValue={settings.aboutSectionTitleSize || 36}
                            onSizeChange={(v) => handleInputChange('aboutSectionTitleSize', v)}
                        />
                        <div className="space-y-2">
                            <Label htmlFor="about-text">Intro tekst</Label>
                            <Textarea id="about-text" value={settings.aboutText || ''} onChange={e => handleInputChange('aboutText', e.target.value)} rows={5} />
                        </div>
                        <TextStyleEditor 
                            label="Design for Intro Tekst"
                            colorValue={settings.aboutTextColor as ThemeColor || 'text-muted-foreground'}
                            onColorChange={(v) => handleInputChange('aboutTextColor', v)}
                            sizeValue={settings.aboutTextSize || 18}
                            onSizeChange={(v) => handleInputChange('aboutTextSize', v)}
                        />
                        <Label>Team</Label>
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
                                onPaddingChange={(p) => handlePaddingChange('services', p)}
                            />
                        )}
                        {settings.sectionPadding?.aiProject && (
                            <SpacingEditor
                                label="Fortæl os om dit projekt"
                                padding={settings.sectionPadding.aiProject}
                                onPaddingChange={(p) => handlePaddingChange('aiProject', p)}
                            />
                        )}
                        {settings.sectionPadding?.cases && (
                            <SpacingEditor
                                label="Cases"
                                padding={settings.sectionPadding.cases}
                                onPaddingChange={(p) => handlePaddingChange('cases', p)}
                            />
                        )}
                        {settings.sectionPadding?.about && (
                            <SpacingEditor
                                label="Om Os"
                                padding={settings.sectionPadding.about}
                                onPaddingChange={(p) => handlePaddingChange('about', p)}
                            />
                        )}
                        {settings.sectionPadding?.contact && (
                            <SpacingEditor
                                label="Kontakt"
                                padding={settings.sectionPadding.contact}
                                onPaddingChange={(p) => handlePaddingChange('contact', p)}
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

    