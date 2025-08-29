
"use client";

import { useState, useEffect, useTransition } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Lightbulb } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { GeneralSettings } from "@/services/settings";
import { getSettingsAction, saveSettingsAction } from "@/app/actions";
import { Loader2 } from "lucide-react";
import Link from "next/link";

export default function SeoSettingsPage() {
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
                  allowSearchEngineIndexing: loadedSettings.allowSearchEngineIndexing ?? true
                });
            } else {
                 setSettings({ allowSearchEngineIndexing: true });
            }
            setIsLoading(false);
        }
        loadSettings();
    }, []);

    const handleToggle = (value: boolean) => {
        setSettings(prev => ({ ...prev, allowSearchEngineIndexing: value }));
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
          <CardTitle>SEO (Search Engine Optimization)</CardTitle>
          <CardDescription>SEO is about optimizing your site, so it easily can be found and ranked by search engines.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
            <div className="flex items-center justify-between rounded-lg border p-4">
                <div className="space-y-0.5">
                    <Label htmlFor="seo-switch" className="text-base">Allow search engines to show your site in their search results</Label>
                </div>
                <Switch
                    id="seo-switch"
                    checked={settings.allowSearchEngineIndexing}
                    onCheckedChange={handleToggle}
                />
            </div>

            <Alert>
              <Lightbulb className="h-4 w-4" />
              <AlertTitle>Tip</AlertTitle>
              <AlertDescription>
                Add text to your site that use the keywords you want your website to be found on. You can also add meta descriptions to your individual pages via the page options icon in the page list. This will make your website more visible to users searching for you.
                <Button variant="link" asChild className="p-0 h-auto ml-1">
                    <Link href="#">Learn more</Link>
                </Button>
              </AlertDescription>
            </Alert>
        </CardContent>
      </Card>
    </div>
  );
}
