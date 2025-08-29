
"use client";

import { useState, useEffect, useTransition } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Upload, Copy, Loader2 } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { GeneralSettings } from "@/services/settings";
import { getSettingsAction, saveSettingsAction } from "@/app/actions";

const weekDays = ["Mandag", "Tirsdag", "Onsdag", "Torsdag", "Fredag", "Lørdag", "Søndag"];

type OpeningTime = {
  from: string;
  to: string;
  isOpen: boolean;
};

const initialOpeningHours = weekDays.reduce((acc, day) => {
  acc[day] = { from: "09:00", to: "17:00", isOpen: !['Lørdag', 'Søndag'].includes(day) };
  return acc;
}, {} as Record<string, OpeningTime>);


export default function GeneralSettingsPage() {
    const [settings, setSettings] = useState<GeneralSettings>({ openingHours: initialOpeningHours });
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
                  openingHours: loadedSettings.openingHours || initialOpeningHours
                });
            }
            setIsLoading(false);
        }
        loadSettings();
    }, []);

    const handleInputChange = (field: keyof GeneralSettings, value: string) => {
        setSettings(prev => ({ ...prev, [field]: value }));
    };

    const handleTimeChange = (day: string, part: 'from' | 'to', value: string) => {
        setSettings(prev => ({
            ...prev,
            openingHours: {
                ...prev.openingHours,
                [day]: { ...prev.openingHours![day], [part]: value }
            }
        }));
    };
    
    const toggleDayOpen = (day: string) => {
        setSettings(prev => ({
            ...prev,
            openingHours: {
                ...prev.openingHours,
                [day]: { ...prev.openingHours![day], isOpen: !prev.openingHours![day].isOpen }
            }
        }));
    }

    const copyMondayToWeekdays = () => {
        if (!settings.openingHours) return;
        const mondayHours = settings.openingHours["Mandag"];
        const newHours = { ...settings.openingHours };
        ["Tirsdag", "Onsdag", "Torsdag", "Fredag"].forEach(day => {
            newHours[day] = { ...mondayHours };
        });
        setSettings(prev => ({...prev, openingHours: newHours}));
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
    }

    if (isLoading) {
      return (
        <div className="flex justify-center items-center h-full">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      );
    }

  return (
    <div className="space-y-8">
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle>Generelle Indstillinger</CardTitle>
          <CardDescription>Administrer de grundlæggende oplysninger for din hjemmeside.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="website-title">Website Title</Label>
            <Input id="website-title" placeholder="F.eks. Min Fantastiske Hjemmeside" value={settings.websiteTitle || ''} onChange={e => handleInputChange('websiteTitle', e.target.value)}/>
          </div>

          <div className="space-y-6">
             <div className="space-y-2">
                <Label>Logo</Label>
                 <div className="flex items-center gap-4">
                    <Button variant="outline" asChild>
                        <label htmlFor="logo-upload" className="cursor-pointer">
                            <Upload className="mr-2 h-4 w-4" />
                            Upload billede
                            <input id="logo-upload" type="file" className="sr-only" />
                        </label>
                    </Button>
                    <Input id="logo-alt" placeholder="Alt text for logo" value={settings.logoAlt || ''} onChange={e => handleInputChange('logoAlt', e.target.value)} />
                </div>
                <p className="text-sm text-muted-foreground">Anbefalet størrelse: 200x50 pixels.</p>
            </div>
             <div className="space-y-2">
                <Label>Favicon</Label>
                 <Button variant="outline" asChild>
                    <label htmlFor="favicon-upload" className="cursor-pointer">
                        <Upload className="mr-2 h-4 w-4" />
                        Upload favicon
                        <input id="favicon-upload" type="file" className="sr-only" />
                    </label>
                </Button>
                <p className="text-sm text-muted-foreground">Anbefalet størrelse: 32x32 pixels.</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle>Forretningsoplysninger</CardTitle>
          <CardDescription>Kontaktoplysninger og adresse for din virksomhed.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
            <div className="space-y-2">
                <Label>Adresse</Label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                     <Input placeholder="Virksomhedsnavn" className="md:col-span-2" value={settings.companyName || ''} onChange={e => handleInputChange('companyName', e.target.value)} />
                     <Input placeholder="Vejnavn og nummer" value={settings.streetAddress || ''} onChange={e => handleInputChange('streetAddress', e.target.value)} />
                     <Input placeholder="Postnummer" value={settings.postalCode || ''} onChange={e => handleInputChange('postalCode', e.target.value)} />
                     <Input placeholder="By" value={settings.city || ''} onChange={e => handleInputChange('city', e.target.value)} />
                     <Input id="country" placeholder="Danmark" value={settings.country || ''} onChange={e => handleInputChange('country', e.target.value)}/>
                </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                    <Label htmlFor="business-email">Business Email</Label>
                    <Input id="business-email" type="email" placeholder="kontakt@virksomhed.dk" value={settings.businessEmail || ''} onChange={e => handleInputChange('businessEmail', e.target.value)} />
                </div>
                 <div className="space-y-2">
                    <Label>Telefon</Label>
                     <div className="flex gap-2">
                         <Select value={settings.countryCode || '+45'} onValueChange={value => handleInputChange('countryCode', value)}>
                            <SelectTrigger className="w-[80px]">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="+45">+45</SelectItem>
                                <SelectItem value="+46">+46</SelectItem>
                                <SelectItem value="+47">+47</SelectItem>
                            </SelectContent>
                        </Select>
                        <Input id="phone-number" placeholder="12 34 56 78" value={settings.phoneNumber || ''} onChange={e => handleInputChange('phoneNumber', e.target.value)}/>
                    </div>
                </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Label htmlFor="cvr">CVR-nummer</Label>
                    <Input id="cvr" placeholder="12345678" value={settings.cvr || ''} onChange={e => handleInputChange('cvr', e.target.value)} />
                </div>
            </div>
        </CardContent>
      </Card>
      
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle>Åbningstider</CardTitle>
          <CardDescription>Angiv hvornår din virksomhed har åbent.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
            <div className="flex justify-end">
                <Button variant="outline" size="sm" onClick={copyMondayToWeekdays}>
                    <Copy className="mr-2 h-4 w-4"/>
                    Kopier Mandag til hverdage
                </Button>
            </div>
            {settings.openingHours && weekDays.map(day => (
                <div key={day} className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                    <span className="font-semibold w-24">{day}</span>
                    <div className="flex items-center gap-4 flex-wrap">
                        {settings.openingHours![day].isOpen ? (
                            <>
                                <Input type="time" value={settings.openingHours![day].from} onChange={e => handleTimeChange(day, 'from', e.target.value)} className="w-32" />
                                <span>-</span>
                                <Input type="time" value={settings.openingHours![day].to} onChange={e => handleTimeChange(day, 'to', e.target.value)} className="w-32" />
                                <Button variant="ghost" size="sm" onClick={() => toggleDayOpen(day)}>Lukket</Button>
                            </>
                        ) : (
                            <>
                                <span className="text-muted-foreground flex-1">Lukket</span>
                                <Button variant="outline" size="sm" onClick={() => toggleDayOpen(day)}>Åben</Button>
                            </>
                        )}
                    </div>
                </div>
            ))}
        </CardContent>
      </Card>

       <div className="flex justify-end pt-4">
            <Button size="lg" onClick={handleSaveChanges} disabled={isSaving}>
              {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Gem Ændringer
            </Button>
       </div>
    </div>
  );
}
