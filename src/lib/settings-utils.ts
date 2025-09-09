
import type { GeneralSettings, SectionPadding } from '@/types/settings';

export type SectionKey = keyof NonNullable<GeneralSettings['sectionPadding']>;

// Sørger for at ALLE keys har en SectionPadding (ingen undefined)
export function ensureAllSectionPadding(
  input: Partial<Record<SectionKey, SectionPadding>> | undefined,
  def: SectionPadding
): Record<SectionKey, SectionPadding> {
  const m = input ?? {};
  return {
    hero: m.hero ?? def,
    feature: m.feature ?? def,
    services: m.services ?? def,
    aiProject: m.aiProject ?? def,
    cases: m.cases ?? def,
    about: m.about ?? def,
    customers: m.customers ?? def,
    contact: m.contact ?? def,
    tabs: m.tabs ?? def,
  };
}
