
"use client";

import { useState, useEffect, useTransition } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { GeneralSettings } from "@/services/settings";
import { getSettingsAction, saveSettingsAction } from "@/app/actions";
import { Loader2, AlertTriangle, Lightbulb } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

export default function TrackingSettingsPage() {
    const [settings, setSettings] = useState<Partial<GeneralSettings>>({});
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, startSaving] = useTransition();
    const { toast } = useToast();

    useEffect(() => {
        async function loadSettings() {
            setIsLoading(true);
            const loadedSettings = await getSettingsAction();
            if (loadedSettings) {
                setSettings(loadedSettings);
            }
            setIsLoading(false);
        }
        loadSettings();
    }, []);

    const handleInputChange = (field: keyof GeneralSettings, value: string) => {
        setSettings(prev => ({ ...prev, [field]: value }));
    };

    const handleSaveChanges = () => {
        startSaving(async () => {
            const result = await saveSettingsAction(settings as GeneralSettings);
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
    <div className="space-y-8 max-w-4xl">
       <div className="flex justify-end">
            <Button size="lg" onClick={handleSaveChanges} disabled={isSaving}>
              {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Gem Ændringer
            </Button>
       </div>

      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle>Tracking & Analytics</CardTitle>
          <CardDescription>Indtast dine sporings-ID'er for at aktivere analytics på din hjemmeside.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
            <div className="space-y-2">
                <Label htmlFor="gtm-id">Google Tag Manager ID</Label>
                <Input 
                    id="gtm-id" 
                    placeholder="GTM-XXXXXXX"
                    value={settings.gtmId || ''}
                    onChange={(e) => handleInputChange('gtmId', e.target.value)}
                />
            </div>
            <Alert>
              <Lightbulb className="h-4 w-4" />
              <AlertTitle>Anbefaling</AlertTitle>
              <AlertDescription>
                Vi anbefaler at bruge Google Tag Manager til at administrere alle dine tracking-scripts (inkl. GA4, Facebook Pixel osv.) for at opnå den bedste ydeevne og fleksibilitet.
              </AlertDescription>
            </Alert>
            <div className="space-y-2">
                <Label htmlFor="pixel-id">Facebook Pixel ID</Label>
                <Input 
                    id="pixel-id" 
                    placeholder="Indtast dit Facebook Pixel ID"
                    value={settings.facebookPixelId || ''}
                    onChange={(e) => handleInputChange('facebookPixelId', e.target.value)}
                />
            </div>
             <div className="space-y-2">
                <Label htmlFor="google-ads-id">Google Ads Tag ID</Label>
                <Input 
                    id="google-ads-id" 
                    placeholder="AW-XXXXXXXXX"
                    value={settings.googleAdsId || ''}
                    onChange={(e) => handleInputChange('googleAdsId', e.target.value)}
                />
            </div>

            <Alert variant="destructive">
              <AlertTriangle className="h-4 w-4" />
              <AlertTitle>Vigtigt om GDPR</AlertTitle>
              <AlertDescription>
                Husk at du skal have et cookie-banner og en privatlivspolitik, der informerer brugerne om, hvilke data du indsamler. Denne funktion implementerer ikke et cookie-banner.
              </AlertDescription>
            </Alert>
        </CardContent>
      </Card>
    </div>
  );
}
