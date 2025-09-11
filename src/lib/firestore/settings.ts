// lib/firestore/settings.ts
import { adminDb } from '../server/firebaseAdmin';

export type SettingsGeneral = {
  brandPrimary?: string;
  brandSecondary?: string;
  textColor?: string;
  linkColor?: string;
  fontFamily?: string;
  fontScale?: number;
  spacingBase?: number;
  header?: {
    enabled?: boolean;
    height?: number;
    bg?: string;
    sticky?: boolean;
    logo?: { maxHeight?: number; aspect?: 'contain'|'cover' };
    border?: { enabled?: boolean; width?: number; color?: string };
  };
  footer?: {
    enabled?: boolean;
    bg?: string;
    textColor?: string;
    border?: { enabled?: boolean; width?: number; color?: string };
  };
  hero?: {
    offsetMode?: 'auto'|'fixed';
    fixedOffset?: number;
    bg?: string;
    title?: string;
    subtitle?: string;
    cta?: { text?: string; variant?: 'primary'|'secondary'|'outline'|'destructive' };
  };
  button?: {
    design?: 'pill'|'default';
    radius?: number;
    textSize?: 'sm'|'md'|'lg';
    primary?: { bg?: string; text?: string };
  };
  _version?: string; // valgfrit
};

export async function getGeneralSettings(): Promise<SettingsGeneral> {
  const snap = await adminDb.doc('settings/general').get();
  return (snap.data() || {}) as SettingsGeneral;
}
