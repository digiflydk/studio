'use client';
import { useEffect, useState, useCallback } from 'react';
import type { HeaderCTASettings } from '@/types/settings';
import { getSettingsAction } from '@/app/actions';

let cache: HeaderCTASettings | undefined;

export function useHeaderSettings(initial?: HeaderCTASettings) {
  const [settings, setSettings] = useState<HeaderCTASettings | undefined>(initial ?? cache);
  const [loading, setLoading] = useState(!settings);
  const [error, setError] = useState<Error | null>(null);

  const fetchNow = useCallback(async () => {
    setLoading(true);
    try {
      const fullSettings = await getSettingsAction();
      const headerSettings = fullSettings?.headerCtaSettings;
      if (headerSettings) {
        cache = headerSettings; // Update cache
        setSettings(headerSettings);
      }
    } catch (e: any) {
      setError(e);
    } finally {
        setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!settings) {
        fetchNow();
    }
    const onUpdate = (e: Event) => {
        const customEvent = e as CustomEvent<{ headerCtaSettings?: HeaderCTASettings }>;
        if (customEvent.detail.headerCtaSettings) {
          cache = customEvent.detail.headerCtaSettings; // Update cache
          setSettings(customEvent.detail.headerCtaSettings);
        }
    };
    
    window.addEventListener('design:updated', onUpdate);
    return () => window.removeEventListener('design:updated', onUpdate);
  }, [settings, fetchNow]);

  return { settings, isLoading: loading, error, refresh: fetchNow };
}
