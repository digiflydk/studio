'use client';
import { useState, useEffect, useTransition } from 'react';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import type { GeneralSettings, CookieSettings } from '@/types/settings';
import { getSettingsAction, saveSettingsAction } from '@/app/actions';
import { Loader2 } from 'lucide-react';
import { Switch } from '@/components/ui/switch';
import { Slider } from '@/components/ui/slider';

const defaultCookieSettings: CookieSettings = {
  consentLifetimeDays: 180,
  defaults: {
    preferences: false,
    analytics: false,
    marketing: false,
  },
  bannerTitle: 'Denne hjemmeside bruger cookies',
  bannerBody:
    'Vi bruger cookies til at forbedre din brugeroplevelse, analysere trafik og tilpasse indhold. Ved at klikke "Acceptér alle" giver du samtykke til brugen af alle cookies. Du kan til enhver tid ændre dine indstillinger.',
  acceptAllLabel: 'Acceptér alle',
  acceptNecessaryLabel: 'Kun nødvendige',
  settingsLabel: 'Tilpas',
  modalTitle: 'Cookie-indstillinger',
  modalBody:
    'Administrer dine cookie-præferencer. Vælg hvilke typer cookies du vil tillade. Du kan læse mere om de enkelte kategorier nedenfor.',
  saveLabel: 'Gem indstillinger',
  privacyPolicyLabel: 'Læs vores privatlivspolitik',
  privacyPolicyUrl: '/privatlivspolitik',
  categoryPreferencesTitle: 'Præferencer',
  categoryPreferencesBody:
    'Disse cookies gør det muligt for hjemmesiden at huske valg, du tager, for at give en mere personlig oplevelse.',
  categoryAnalyticsTitle: 'Analyse',
  categoryAnalyticsBody:
    'Disse cookies hjælper os med at forstå, hvordan besøgende interagerer med hjemmesiden ved at indsamle og rapportere oplysninger anonymt.',
  categoryMarketingTitle: 'Markedsføring',
  categoryMarketingBody:
    'Disse cookies bruges til at spore besøgende på tværs af websites. Hensigten er at vise annoncer, der er relevante og engagerende for den enkelte bruger.',
};

export default function CmsCookieSettingsPage() {
  const [settings, setSettings] = useState<Partial<CookieSettings>>({});
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, startSaving] = useTransition();
  const { toast } = useToast();

  useEffect(() => {
    async function loadSettings() {
      setIsLoading(true);
      const loadedSettings = await getSettingsAction();
      setSettings(loadedSettings?.cookies ?? defaultCookieSettings);
      setIsLoading(false);
    }
    loadSettings();
  }, []);

  const handleInputChange = (field: keyof CookieSettings, value: any) => {
    setSettings((prev) => ({ ...prev, [field]: value }));
  };
  
  const handleDefaultChange = (field: keyof CookieSettings['defaults'], value: boolean) => {
      setSettings(prev => ({
          ...prev,
          defaults: {
              ...(prev.defaults ?? defaultCookieSettings.defaults),
              [field]: value,
          }
      }));
  }

  const handleSaveChanges = () => {
    startSaving(async () => {
      const result = await saveSettingsAction({ cookies: settings });
      toast({
        title: result.success ? 'Gemt!' : 'Fejl!',
        description: result.message,
        variant: result.success ? 'default' : 'destructive',
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
          <h1 className="text-2xl font-bold">Cookie Indstillinger</h1>
          <p className="text-muted-foreground">
            Administrer tekster og standardvalg for cookie-banner og -modal.
          </p>
        </div>
        <Button size="lg" onClick={handleSaveChanges} disabled={isSaving}>
          {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Gem Ændringer
        </Button>
      </div>

      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle>Generelle Indstillinger</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <div className="flex justify-between items-center">
                <Label>Samtykke Levetid (dage)</Label>
                <span className="text-sm text-muted-foreground">{settings.consentLifetimeDays || 180} dage</span>
            </div>
            <Slider
              value={[settings.consentLifetimeDays || 180]}
              onValueChange={([v]) => handleInputChange('consentLifetimeDays', v)}
              min={30}
              max={365}
              step={1}
            />
          </div>
          <div className="p-4 border rounded-lg space-y-4">
            <h4 className='font-semibold'>Standard Samtykke</h4>
            <p className='text-sm text-muted-foreground'>Vælg hvilke kategorier der skal være slået til som standard for nye besøgende.</p>
            <div className="flex items-center justify-between">
                <Label>Præferencer</Label>
                <Switch checked={settings.defaults?.preferences} onCheckedChange={(v) => handleDefaultChange('preferences', v)} />
            </div>
            <div className="flex items-center justify-between">
                <Label>Analyse</Label>
                <Switch checked={settings.defaults?.analytics} onCheckedChange={(v) => handleDefaultChange('analytics', v)} />
            </div>
            <div className="flex items-center justify-between">
                <Label>Markedsføring</Label>
                <Switch checked={settings.defaults?.marketing} onCheckedChange={(v) => handleDefaultChange('marketing', v)} />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle>Cookie Banner</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label>Titel</Label>
            <Input value={settings.bannerTitle || ''} onChange={(e) => handleInputChange('bannerTitle', e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label>Brødtekst</Label>
            <Textarea value={settings.bannerBody || ''} onChange={(e) => handleInputChange('bannerBody', e.target.value)} />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
             <div className="space-y-2">
                <Label>Knap: Acceptér Alle</Label>
                <Input value={settings.acceptAllLabel || ''} onChange={(e) => handleInputChange('acceptAllLabel', e.target.value)} />
             </div>
              <div className="space-y-2">
                <Label>Knap: Kun Nødvendige</Label>
                <Input value={settings.acceptNecessaryLabel || ''} onChange={(e) => handleInputChange('acceptNecessaryLabel', e.target.value)} />
             </div>
              <div className="space-y-2">
                <Label>Knap: Tilpas</Label>
                <Input value={settings.settingsLabel || ''} onChange={(e) => handleInputChange('settingsLabel', e.target.value)} />
             </div>
          </div>
        </CardContent>
      </Card>

      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle>Cookie Indstillingsmodal</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
           <div className="space-y-2">
            <Label>Titel</Label>
            <Input value={settings.modalTitle || ''} onChange={(e) => handleInputChange('modalTitle', e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label>Brødtekst</Label>
            <Textarea value={settings.modalBody || ''} onChange={(e) => handleInputChange('modalBody', e.target.value)} />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
             <div className="space-y-2">
                <Label>Knap: Gem Indstillinger</Label>
                <Input value={settings.saveLabel || ''} onChange={(e) => handleInputChange('saveLabel', e.target.value)} />
             </div>
              <div className="space-y-2">
                <Label>Link: Privatlivspolitik Tekst</Label>
                <Input value={settings.privacyPolicyLabel || ''} onChange={(e) => handleInputChange('privacyPolicyLabel', e.target.value)} />
             </div>
          </div>
          <div className="space-y-2">
            <Label>Link: Privatlivspolitik URL</Label>
            <Input value={settings.privacyPolicyUrl || ''} onChange={(e) => handleInputChange('privacyPolicyUrl', e.target.value)} />
          </div>
        </CardContent>
      </Card>
      
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle>Kategori Beskrivelser</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
           <div className="space-y-2">
            <Label>Titel: Præferencer</Label>
            <Input value={settings.categoryPreferencesTitle || ''} onChange={(e) => handleInputChange('categoryPreferencesTitle', e.target.value)} />
             <Label>Beskrivelse: Præferencer</Label>
            <Textarea value={settings.categoryPreferencesBody || ''} onChange={(e) => handleInputChange('categoryPreferencesBody', e.target.value)} />
          </div>
           <hr/>
           <div className="space-y-2">
            <Label>Titel: Analyse</Label>
            <Input value={settings.categoryAnalyticsTitle || ''} onChange={(e) => handleInputChange('categoryAnalyticsTitle', e.target.value)} />
             <Label>Beskrivelse: Analyse</Label>
            <Textarea value={settings.categoryAnalyticsBody || ''} onChange={(e) => handleInputChange('categoryAnalyticsBody', e.target.value)} />
          </div>
           <hr/>
           <div className="space-y-2">
            <Label>Titel: Markedsføring</Label>
            <Input value={settings.categoryMarketingTitle || ''} onChange={(e) => handleInputChange('categoryMarketingTitle', e.target.value)} />
             <Label>Beskrivelse: Markedsføring</Label>
            <Textarea value={settings.categoryMarketingBody || ''} onChange={(e) => handleInputChange('categoryMarketingBody', e.target.value)} />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
