
'use client';
import { useEffect } from 'react';
import { applyDesignVars } from '@/lib/ui/applyDesignVars';
import { GeneralSettings } from '@/types/settings';

export default function DesignProvider({ initialDesign, children }: { initialDesign: GeneralSettings | null, children: React.ReactNode }) {
  useEffect(() => {
    if (initialDesign) {
        applyDesignVars(initialDesign);
    }
    
    const onUpdate = (e: Event) => {
        const customEvent = e as CustomEvent<GeneralSettings>;
        applyDesignVars(customEvent.detail);
    };

    window.addEventListener('design:updated', onUpdate);
    return () => window.removeEventListener('design:updated', onUpdate);
  }, [initialDesign]);

  return <>{children}</>;
}
