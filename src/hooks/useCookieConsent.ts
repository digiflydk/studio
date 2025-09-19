
'use client';

import { useState, useEffect, useCallback } from 'react';
import { getConsent, saveConsent } from '@/lib/cookie-consent';
import type { ConsentCategories, GeneralSettings } from '@/types/settings';

const NECESSARY_ONLY_CONSENT: ConsentCategories = {
  necessary: true as const,
  preferences: false,
  analytics: false,
  marketing: false,
};

const ALL_CONSENT: ConsentCategories = {
  necessary: true,
  preferences: true,
  analytics: true,
  marketing: true,
};


export function useCookieConsent(settings: GeneralSettings | null) {
  const [consent, setConsent] = useState<ConsentCategories | null>(null);
  const [showBanner, setShowBanner] = useState(false);
  const [showSettings, setShowSettings] = useState(false);

  useEffect(() => {
    const initialConsent = getConsent();
    if (initialConsent) {
      setConsent(initialConsent);
      setShowBanner(false);
    } else {
      setShowBanner(true);
      // Set initial state based on defaults from CMS
      const defaults = settings?.cookies?.defaults ?? {
        preferences: false,
        analytics: false,
        marketing: false,
      };
      setConsent({
        necessary: true,
        ...defaults
      });
    }
  }, [settings]);

  const handleSaveConsent = useCallback((newConsent: ConsentCategories) => {
    const lifetime = settings?.cookies?.consentLifetimeDays ?? 180;
    saveConsent(newConsent, lifetime);
    setConsent(newConsent);
    setShowBanner(false);
    setShowSettings(false);
  }, [settings]);

  const handleAcceptAll = useCallback(() => {
    handleSaveConsent(ALL_CONSENT);
  }, [handleSaveConsent]);

  const handleAcceptNecessary = useCallback(() => {
    handleSaveConsent(NECESSARY_ONLY_CONSENT);
  }, [handleSaveConsent]);

  // Fallback for initial state before hydration
  const initialConsentState: ConsentCategories = {
    necessary: true,
    ...settings?.cookies?.defaults ?? {
        preferences: false,
        analytics: false,
        marketing: false,
    }
  };

  return {
    cookieConsent: consent ?? initialConsentState,
    showBanner,
    showSettings,
    setShowSettings,
    handleAcceptAll,
    handleAcceptNecessary,
    handleSaveConsent,
  };
}
