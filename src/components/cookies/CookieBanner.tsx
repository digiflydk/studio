'use client';
import { Button } from '@/components/ui/button';
import type { CookieSettings } from '@/types/settings';
import { cn } from '@/lib/utils';

interface CookieBannerProps {
  settings: CookieSettings | null;
  onAcceptAll: () => void;
  onAcceptNecessary: () => void;
  onCustomize: () => void;
}

export default function CookieBanner({
  settings,
  onAcceptAll,
  onAcceptNecessary,
  onCustomize,
}: CookieBannerProps) {
  if (!settings) return null;

  return (
    <div className="fixed bottom-0 inset-x-0 z-[60]">
      <div className="bg-background border-t shadow-2xl p-4 md:p-6">
        <div className="container mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="text-center md:text-left">
            <h3 className="text-lg font-semibold">{settings.bannerTitle}</h3>
            <p className="text-sm text-muted-foreground mt-1 max-w-2xl">
              {settings.bannerBody}
            </p>
          </div>
          <div className="flex gap-2 flex-shrink-0 flex-wrap justify-center">
            <Button onClick={onCustomize} variant="outline" size="sm">
              {settings.settingsLabel}
            </Button>
            <Button onClick={onAcceptNecessary} variant="secondary" size="sm">
              {settings.acceptNecessaryLabel}
            </Button>
            <Button onClick={onAcceptAll} variant="default" size="sm">
              {settings.acceptAllLabel}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
