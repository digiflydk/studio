
"use client";

import { useState, useEffect, useTransition } from "react";
import Image from "next/image";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Copy, Loader2, X } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import type { GeneralSettings } from "@/types/settings";
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

function TextField({
  label,
  value,
  onChange,
  placeholder,
}: {
  label: string;
  value?: string;
  onChange: (v: string) => void;
  placeholder?: string;
}) {
  return (
    <label className="block">
      <span className="block text-sm font-medium mb-1">{label}</span>
      <input
        type="url"
        value={value ?? ""}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full rounded-md border px-3 py-2"
      />
    </label>
  );
}


export default function GeneralSettingsPage() {
    const [form, setForm] = useState<Partial<GeneralSettings>>({});
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, startSaving] = useTransition();
    const { toast } = useToast();

    useEffect(() => {
        async function loadSettings() {
            setIsLoading(true);
            const loadedSettings = await getSettingsAction();
            if (loadedSettings) {
                setForm({
                  ...loadedSettings,
                  openingHours: loadedSettings.openingHours || initialOpeningHours
                });
            } else {
                setForm({ openingHours: initialOpeningHours });
            }
            setIsLoading(false);
        }
        loadSettings();
    }, []);

    const handleInputChange = (field: keyof GeneralSettings, value: string | number | boolean) => {
        setForm(prev => ({ ...prev, [field]: value }));
    };

    const removeImage = (type: 'logo' | 'favicon') => {
        const fieldName = type === 'logo' ? 'logoUrl' : 'faviconUrl';
        const updatedSettings: Partial<GeneralSettings> = { ...form, [fieldName]: undefined };
        if (type === 'logo') {
            updatedSettings.logoAlt = undefined;
        }
        setForm(updatedSettings);
    }

    const handleTimeChange = (day: string, part: 'from' | 'to', value: string) => {
        setForm(prev => ({
            ...prev,
            openingHours: {
                ...prev.openingHours,
                [day]: { ...prev.openingHours![day], [part]: value }
            }
        }));
    };
    
    const toggleDayOpen = (day: string) => {
        setForm(prev => ({
            ...prev,
            openingHours: {
                ...prev.openingHours,
                [day]: { ...prev.openingHours![day], isOpen: !prev.openingHours![day].isOpen }
            }
        }));
    }

    const copyMondayToWeekdays = () => {
        if (!form.openingHours) return;
        const mondayHours = form.openingHours["Mandag"];
        const newHours = { ...form.openingHours };
        ["Tirsdag", "Onsdag", "Torsdag", "Fredag"].forEach(day => {
            newHours[day] = { ...mondayHours };
        });
        setForm(prev => ({...prev, openingHours: newHours}));
    };
    
    const handleSaveChanges = () => {
        startSaving(async () => {
            const result = await saveSettingsAction(form);
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
       <div className="flex justify-end">
            <Button size="lg" onClick={handleSaveChanges} disabled={isSaving}>
              {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Gem Ændringer
            </Button>
       </div>

      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle>Generelle Indstillinger</CardTitle>
          <CardDescription>Administrer de grundlæggende oplysninger for din hjemmeside.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="website-title">Website Title</Label>
            <Input id="website-title" placeholder="F.eks. Min Fantastiske Hjemmeside" value={form.websiteTitle || ''} onChange={e => handleInputChange('websiteTitle', e.target.value)}/>
          </div>

          <div className="space-y-6">
             <div className="space-y-4">
                <Label>Logo</Label>
                <TextField
                  label="Logo (normal) – URL"
                  value={form.logoUrl}
                  onChange={(v) => setForm((s: any) => ({ ...s, logoUrl: v }))}
                  placeholder="https://..."
                />
                <TextField
                  label="Logo (scrolled) – URL"
                  value={form.logoScrolledUrl}
                  onChange={(v) => setForm((s: any) => ({ ...s, logoScrolledUrl: v }))}
                  placeholder="https://..."
                />
                <Input id="logo-alt" placeholder="Alt text for logo" value={form.logoAlt || ''} onChange={e => handleInputChange('logoAlt', e.target.value)} />
                <p className="text-sm text-muted-foreground">Anbefalet størrelse: 200x50 pixels. PNG med transparent baggrund foretrækkes.</p>
             </div>

             <div className="space-y-2">
                <Label>Favicon</Label>
                {form.faviconUrl && (
                     <div className="relative w-8 h-8 bg-muted rounded-md p-1 flex items-center justify-center">
                        <Image src={form.faviconUrl} alt="Favicon preview" fill style={{objectFit: 'contain'}} />
                         <Button variant="ghost" size="icon" className="absolute -top-2 -right-2 h-6 w-6 bg-black/50 hover:bg-black/70 text-white rounded-full" onClick={() => removeImage('favicon')}>
                            <X className="h-4 w-4" />
                        </Button>
                    </div>
                )}
                <Input id="favicon-url" placeholder="Indsæt URL til favicon" value={form.faviconUrl || ''} onChange={e => handleInputChange('faviconUrl', e.target.value)} />
                <p className="text-sm text-muted-foreground">Anbefalet størrelse: 32x32 pixels. ICO, PNG or SVG.</p>
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
                     <Input placeholder="Virksomhedsnavn" className="md:col-span-2" value={form.companyName || ''} onChange={e => handleInputChange('companyName', e.target.value)} />
                     <Input placeholder="Vejnavn og nummer" value={form.streetAddress || ''} onChange={e => handleInputChange('streetAddress', e.target.value)} />
                     <Input placeholder="Postnummer" value={form.postalCode || ''} onChange={e => handleInputChange('postalCode', e.target.value)} />
                     <Input placeholder="By" value={form.city || ''} onChange={e => handleInputChange('city', e.target.value)} />
                      <div className="space-y-2">
                        <Label htmlFor="business-email">Business Email</Label>
                        <Input id="business-email" type="email" placeholder="kontakt@virksomhed.dk" value={form.businessEmail || ''} onChange={e => handleInputChange('businessEmail', e.target.value)} />
                    </div>
                     <div className="space-y-2">
                        <Label>Telefon</Label>
                         <div className="flex gap-2">
                             <Select value={form.countryCode || '+45'} onValueChange={value => handleInputChange('countryCode', value)}>
                                <SelectTrigger className="w-[80px]">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="+45">+45</SelectItem>
                                    <SelectItem value="+46">+46</SelectItem>
                                    <SelectItem value="+47">+47</SelectItem>
                                </SelectContent>
                            </Select>
                            <Input id="phone-number" placeholder="12 34 56 78" value={form.phoneNumber || ''} onChange={e => handleInputChange('phoneNumber', e.target.value)}/>
                        </div>
                    </div>
                </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Label htmlFor="cvr">CVR-nummer</Label>
                    <Input id="cvr" placeholder="12345678" value={form.cvr || ''} onChange={e => handleInputChange('cvr', e.target.value)} />
                </div>
                 <div className="space-y-2">
                    <Label htmlFor="country">Land</Label>
                    <Input id="country" placeholder="Danmark" value={form.country || ''} onChange={e => handleInputChange('country', e.target.value)}/>
                </div>
            </div>
        </CardContent>
      </Card>
      
      <section className="mt-8">
        <h3 className="text-lg font-semibold mb-3">Header Colors</h3>
        <Card>
            <CardContent className="pt-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {/* Normal Background HEX */}
                    <div className="space-y-2">
                    <label className="font-medium">Normal Background (HEX)</label>
                    <input
                        type="text"
                        placeholder="#FFFFFF"
                        value={form.headerInitialBackgroundHex ?? ""}
                        onChange={(e) => setForm((f: any) => ({ ...f, headerInitialBackgroundHex: e.target.value }))}
                        className="w-full rounded-md border px-3 py-2"
                    />
                    <label className="text-sm">Opacity (%)</label>
                    <input
                        type="number" min={0} max={100}
                        value={form.headerInitialBackgroundOpacity ?? 100}
                        onChange={(e) => setForm((f: any) => ({ ...f, headerInitialBackgroundOpacity: Number(e.target.value) }))}
                        className="w-full rounded-md border px-3 py-2"
                    />
                    </div>

                    {/* Scrolled Background HEX */}
                    <div className="space-y-2">
                    <label className="font-medium">Scrolled Background (HEX)</label>
                    <input
                        type="text"
                        placeholder="#FFFFFF"
                        value={form.headerScrolledBackgroundHex ?? ""}
                        onChange={(e) => setForm((f: any) => ({ ...f, headerScrolledBackgroundHex: e.target.value }))}
                        className="w-full rounded-md border px-3 py-2"
                    />
                    <label className="text-sm">Opacity (%)</label>
                    <input
                        type="number" min={0} max={100}
                        value={form.headerScrolledBackgroundOpacity ?? 100}
                        onChange={(e) => setForm((f: any) => ({ ...f, headerScrolledBackgroundOpacity: Number(e.target.value) }))}
                        className="w-full rounded-md border px-3 py-2"
                    />
                    </div>

                    {/* Border line HEX */}
                    <div className="space-y-2">
                    <label className="font-medium">Header Border (HEX)</label>
                    <input
                        type="text"
                        placeholder="#000000"
                        value={form.headerBorderColorHex ?? ""}
                        onChange={(e) => setForm((f: any) => ({ ...f, headerBorderColorHex: e.target.value }))}
                        className="w-full rounded-md border px-3 py-2"
                    />
                    <label className="text-sm">Border height (px)</label>
                    <input
                        type="number" min={0}
                        value={form.headerTopBorderHeight ?? 1}
                        onChange={(e) => setForm((f: any) => ({ ...f, headerTopBorderHeight: Number(e.target.value) }))}
                        className="w-full rounded-md border px-3 py-2"
                    />
                    <div className="flex items-center gap-2">
                        <input
                        id="headerTopBorderEnabled"
                        type="checkbox"
                        checked={!!form.headerTopBorderEnabled}
                        onChange={(e) => setForm((f: any) => ({ ...f, headerTopBorderEnabled: e.target.checked }))}
                        />
                        <label htmlFor="headerTopBorderEnabled">Border enabled</label>
                    </div>
                    </div>
                </div>
            </CardContent>
        </Card>
      </section>

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
            {form.openingHours && weekDays.map(day => (
                <div key={day} className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                    <span className="font-semibold w-24">{day}</span>
                    <div className="flex items-center gap-4 flex-wrap">
                        {form.openingHours![day].isOpen ? (
                            <>
                                <Input type="time" value={form.openingHours![day].from} onChange={e => handleTimeChange(day, 'from', e.target.value)} className="w-32" />
                                <span>-</span>
                                <Input type="time" value={form.openingHours![day].to} onChange={e => handleTimeChange(day, 'to', e.target.value)} className="w-32" />
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
    </div>
  );
}
