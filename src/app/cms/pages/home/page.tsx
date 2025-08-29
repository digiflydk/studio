
'use client';

import { useState, useEffect, useTransition } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { GeneralSettings, Service, Case, TeamMember } from '@/services/settings';
import { getSettingsAction, saveSettingsAction } from '@/app/actions';
import { Loader2, Trash2 } from 'lucide-react';
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

function SectionCard({ title, description, children }: { title: string, description: string, children: React.ReactNode }) {
    return (
        <Card className="shadow-lg">
            <CardHeader>
                <CardTitle>{title}</CardTitle>
                <CardDescription>{description}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
                {children}
            </CardContent>
        </Card>
    )
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
                <AccordionTrigger className="flex-1 pr-4">
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
    padding: { top: number; bottom: number };
    onPaddingChange: (padding: { top: number; bottom: number }) => void;
}) {
    return (
        <div className="p-4 border rounded-lg space-y-4 bg-muted/20">
            <h3 className="font-semibold">{label}</h3>
            <div className="space-y-2">
                <div className="flex justify-between items-center">
                    <Label>Afstand i toppen</Label>
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
                    <Label>Afstand i bunden</Label>
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
      if (loadedSettings) {
        setSettings({
            ...loadedSettings,
            heroHeadline: loadedSettings.heroHeadline || 'Flow. Automatisér. Skalér.',
            heroHeadlineColor: loadedSettings.heroHeadlineColor || 'text-white',
            heroHeadlineSize: loadedSettings.heroHeadlineSize || 64,
            heroDescription: loadedSettings.heroDescription || 'Vi hjælper virksomheder med at bygge skalerbare digitale løsninger, der optimerer processer og driver vækst.',
            heroDescriptionColor: loadedSettings.heroDescriptionColor || 'text-primary-foreground/80',
            heroDescriptionSize: loadedSettings.heroDescriptionSize || 18,
            heroImageUrl: loadedSettings.heroImageUrl || 'https://picsum.photos/1920/1280',
            
            servicesSectionTitle: loadedSettings.servicesSectionTitle || "Vores Services",
            servicesSectionTitleColor: loadedSettings.servicesSectionTitleColor || "text-black",
            servicesSectionTitleSize: loadedSettings.servicesSectionTitleSize || 36,
            servicesSectionDescription: loadedSettings.servicesSectionDescription || "Vi tilbyder en bred vifte af ydelser for at accelerere jeres digitale rejse.",
            servicesSectionDescriptionColor: loadedSettings.servicesSectionDescriptionColor || "text-muted-foreground",
            servicesSectionDescriptionSize: loadedSettings.servicesSectionDescriptionSize || 18,
            services: loadedSettings.services && loadedSettings.services.length > 0 ? loadedSettings.services : defaultServices,
            
            casesSectionTitle: loadedSettings.casesSectionTitle || "Vores Arbejde",
            casesSectionTitleColor: loadedSettings.casesSectionTitleColor || "text-black",
            casesSectionTitleSize: loadedSettings.casesSectionTitleSize || 36,
            casesSectionDescription: loadedSettings.casesSectionDescription || "Se eksempler på, hvordan vi har hjulpet andre virksomheder med at opnå deres mål.",
            casesSectionDescriptionColor: loadedSettings.casesSectionDescriptionColor || "text-muted-foreground",
            casesSectionDescriptionSize: loadedSettings.casesSectionDescriptionSize || 18,
            cases: loadedSettings.cases && loadedSettings.cases.length > 0 ? loadedSettings.cases : defaultCases,
            
            aboutSectionTitle: loadedSettings.aboutSectionTitle || "Hvem er Digifly?",
            aboutSectionTitleColor: loadedSettings.aboutSectionTitleColor || "text-black",
            aboutSectionTitleSize: loadedSettings.aboutSectionTitleSize || 36,
            aboutText: loadedSettings.aboutText || defaultAboutText,
            aboutTextColor: loadedSettings.aboutTextColor || "text-muted-foreground",
            aboutTextSize: loadedSettings.aboutTextSize || 18,
            teamMembers: loadedSettings.teamMembers && loadedSettings.teamMembers.length > 0 ? loadedSettings.teamMembers : defaultTeam,
            
            sectionPadding: loadedSettings.sectionPadding || {
                services: { top: 96, bottom: 96 },
                aiProject: { top: 96, bottom: 96 },
                cases: { top: 96, bottom: 96 },
                about: { top: 96, bottom: 96 },
                contact: { top: 96, bottom: 96 },
            },
        });
      } else {
        // If no settings are loaded at all, populate with all defaults
        setSettings({
            heroHeadline: 'Flow. Automatisér. Skalér.',
            heroHeadlineColor: 'text-white',
            heroHeadlineSize: 64,
            heroDescription: 'Vi hjælper virksomheder med at bygge skalerbare digitale løsninger, der optimerer processer og driver vækst.',
            heroDescriptionColor: 'text-primary-foreground/80',
            heroDescriptionSize: 18,
            heroImageUrl: 'https://picsum.photos/1920/1280',

            servicesSectionTitle: "Vores Services",
            servicesSectionTitleColor: "text-black",
            servicesSectionTitleSize: 36,
            servicesSectionDescription: "Vi tilbyder en bred vifte af ydelser for at accelerere jeres digitale rejse.",
            servicesSectionDescriptionColor: "text-muted-foreground",
            servicesSectionDescriptionSize: 18,
            services: defaultServices,

            casesSectionTitle: "Vores Arbejde",
            casesSectionTitleColor: "text-black",
            casesSectionTitleSize: 36,
            casesSectionDescription: "Se eksempler på, hvordan vi har hjulpet andre virksomheder med at opnå deres mål.",
            casesSectionDescriptionColor: "text-muted-foreground",
            casesSectionDescriptionSize: 18,
            cases: defaultCases,
            
            aboutSectionTitle: "Hvem er Digifly?",
            aboutSectionTitleColor: "text-black",
            aboutSectionTitleSize: 36,
            aboutText: defaultAboutText,
            aboutTextColor: "text-muted-foreground",
            aboutTextSize: 18,
            teamMembers: defaultTeam,

            sectionPadding: {
                services: { top: 96, bottom: 96 },
                aiProject: { top: 96, bottom: 96 },
                cases: { top: 96, bottom: 96 },
                about: { top: 96, bottom: 96 },
                contact: { top: 96, bottom: 96 },
            },
        })
      }
      setIsLoading(false);
    }
    loadSettings();
  }, []);
  
  const handleInputChange = (field: keyof GeneralSettings, value: any) => {
    setSettings(prev => ({ ...prev, [field]: value }));
  };

  const handlePaddingChange = (section: keyof NonNullable<GeneralSettings['sectionPadding']>, value: { top: number; bottom: number }) => {
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

      <SectionCard title="Hero Sektion" description="Indholdet i toppen af siden.">
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
      </SectionCard>

      <SectionCard title="Services Sektion" description="Administrer de viste services.">
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
        <Accordion type="multiple" className="w-full">
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
      </SectionCard>
      
      <SectionCard title="Cases Sektion" description="Administrer de viste cases.">
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
        <Accordion type="multiple" className="w-full">
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
      </SectionCard>

      <SectionCard title="Om Os Sektion" description="Administrer tekst og teammedlemmer.">
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
         <Accordion type="multiple" className="w-full">
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
      </SectionCard>
       <SectionCard title="Sektionsafstand" description="Juster den vertikale afstand (padding) for hver sektion.">
        <div className="space-y-4">
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
        </div>
      </SectionCard>
    </div>
  );
}
