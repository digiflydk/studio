'use client';
import { useEffect, useState, useCallback } from 'react';
import type { HeaderSettings } from '@/types/settings';

let cache: HeaderSettings | undefined;

export function useHeaderSettings(initial?: HeaderSettings) {
  const [settings, setSettings] = useState<HeaderSettings | undefined>(initial ?? cache);
  const [isLoading, setLoading] = useState(!settings);
  const [error, setError] = useState<Error | null>(null);

  const fetchNow = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/pages/header/appearance', { cache: 'no-store' });
      const json = await res.json();
      if(json.ok) {
        cache = json.data; // Update cache
        setSettings(json.data);
      } else {
        throw new Error(json.error || 'Failed to fetch header settings');
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
        const customEvent = e as CustomEvent<HeaderSettings>;
        if (customEvent.detail) {
          cache = customEvent.detail; // Update cache
          setSettings(customEvent.detail);
        }
    };
    
    window.addEventListener('design:updated', onUpdate as EventListener);
    return () => window.removeEventListener('design:updated', onUpdate as EventListener);
  }, [settings, fetchNow]);

  const updateSettings = useCallback((newSettings: HeaderSettings | undefined) => {
      setSettings(newSettings);
      if(newSettings) {
        cache = newSettings;
      }
  }, []);

  return { settings, setSettings: updateSettings, isLoading, error, refresh: fetchNow };
}
