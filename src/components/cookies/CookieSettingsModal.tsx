'use client';

import * as React from 'react';
import Link from 'next/link';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import {
  ConsentCategories,
  CookieSettings as TCookieSettings,
} from '@/types/settings';
import { cn } from '@/lib/utils';

interface CookieSettingsModalProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  settings: TCookieSettings | null;
  onSave: (consent: ConsentCategories) => void;
  initialConsent: ConsentCategories;
}

const CategorySwitch = ({
  id,
  title,
  description,
  checked,
  onCheckedChange,
  disabled = false,
}: {
  id: string;
  title: string;
  description: string;
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
  disabled?: boolean;
}) => (
  <div
    className={cn(
      'flex items-start justify-between rounded-lg border p-4 transition-colors',
      disabled && 'bg-muted/50'
    )}
  >
    <div className="space-y-0.5 pr-4">
      <Label htmlFor={id} className="text-base font-semibold">
        {title}
      </Label>
      <p className="text-sm text-muted-foreground">{description}</p>
    </div>
    <Switch
      id={id}
      checked={checked}
      onCheckedChange={onCheckedChange}
      disabled={disabled}
      aria-readonly={disabled}
    />
  </div>
);

export default function CookieSettingsModal({
  isOpen,
  onOpenChange,
  settings,
  onSave,
  initialConsent,
}: CookieSettingsModalProps) {
  const [consent, setConsent] =
    React.useState<ConsentCategories>(initialConsent);

  React.useEffect(() => {
    setConsent(initialConsent);
  }, [initialConsent, isOpen]);

  if (!settings) return null;

  const handleSave = () => {
    onSave(consent);
    onOpenChange(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>{settings.modalTitle}</DialogTitle>
          <DialogDescription>{settings.modalBody}</DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <CategorySwitch
            id="necessary"
            title="Strengt nødvendige"
            description="Disse cookies er essentielle for, at siden kan fungere korrekt. De kan ikke fravælges."
            checked={true}
            onCheckedChange={() => {}}
            disabled
          />
          <CategorySwitch
            id="preferences"
            title={settings.categoryPreferencesTitle}
            description={settings.categoryPreferencesBody}
            checked={consent.preferences}
            onCheckedChange={(c) =>
              setConsent((p) => ({ ...p, preferences: c }))
            }
          />
          <CategorySwitch
            id="analytics"
            title={settings.categoryAnalyticsTitle}
            description={settings.categoryAnalyticsBody}
            checked={consent.analytics}
            onCheckedChange={(c) => setConsent((p) => ({ ...p, analytics: c }))}
          />
          <CategorySwitch
            id="marketing"
            title={settings.categoryMarketingTitle}
            description={settings.categoryMarketingBody}
            checked={consent.marketing}
            onCheckedChange={(c) => setConsent((p) => ({ ...p, marketing: c }))}
          />
        </div>
        <DialogFooter className="flex-col-reverse items-center gap-2 sm:flex-row sm:justify-between sm:gap-0">
          <Button variant="link" size="sm" asChild className="p-0 h-auto">
            <Link href={settings.privacyPolicyUrl} target="_blank">
              {settings.privacyPolicyLabel}
            </Link>
          </Button>
          <Button onClick={handleSave}>{settings.saveLabel}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
