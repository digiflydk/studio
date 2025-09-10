'use client';
import { useEffect } from 'react';
import { applyDesignVars } from '@/lib/ui/applyDesignVars';

type GeneralSettings = any;

export default function DesignProvider({
  initialDesign,
  children,
}: {
  initialDesign: GeneralSettings | null;
  children: React.ReactNode;
}) {
  useEffect(() => {
    if (initialDesign) applyDesignVars(initialDesign);
    const onUpdate = (e: Event) => {
      const detail = (e as CustomEvent<GeneralSettings>).detail;
      if (detail) applyDesignVars(detail);
    };
    window.addEventListener('design:updated', onUpdate as EventListener);
    return () => window.removeEventListener('design:updated', onUpdate as EventListener);
  }, [initialDesign]);

  return <>{children}</>;
}
