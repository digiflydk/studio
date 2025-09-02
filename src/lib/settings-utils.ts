import type { GeneralSettings, SectionPadding } from '@/types/settings';

export type SectionKey = keyof NonNullable<GeneralSettings['sectionPadding']>;

export function updateSectionPadding(
  prev: Partial<GeneralSettings>,
  section: SectionKey,
  part: keyof SectionPadding,
  value: number,
  defaultPadding: SectionPadding
): Partial<GeneralSettings> {
  const prevMap = (prev.sectionPadding ?? {}) as Partial<Record<SectionKey, SectionPadding>>;
  const current: SectionPadding = prevMap[section] ?? defaultPadding;
  const updatedSection: SectionPadding = { ...current, [part]: value };

  return {
    ...prev,
    sectionPadding: {
      ...prevMap,
      [section]: updatedSection,
    } as Record<SectionKey, SectionPadding>,
  };
}
