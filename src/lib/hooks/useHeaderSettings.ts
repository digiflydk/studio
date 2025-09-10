'use client';
import { useEffect, useState, useCallback } from 'react';
import type { HeaderCTASettings } from '@/types/settings';

let cache: HeaderCTASettings | undefined;

export function useHeaderSettings(initial?: HeaderCTASettings) {
  const [settings, setSettings] = useState<HeaderCTASettings | undefined>(initial ?? cache);
  const [isLoading, setLoading] = useState(!settings);
  const [error, setError] = useState<Error | null>(null);

  const fetchNow = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/pages/header', { cache: 'no-store' });
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
        const customEvent = e as CustomEvent<HeaderCTASettings>;
        if (customEvent.detail) {
          cache = customEvent.detail; // Update cache
          setSettings(customEvent.detail);
        }
    };
    
    window.addEventListener('pages:header:updated', onUpdate);
    return () => window.removeEventListener('pages:header:updated', onUpdate);
  }, [settings, fetchNow]);

  return { settings, isLoading, error, refresh: fetchNow };
}
