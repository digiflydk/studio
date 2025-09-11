// lib/firestore/settings.ts
import { adminDb } from '@/lib/server/firebaseAdmin';
import type { GeneralSettings } from '@/types/settings';


export async function getGeneralSettings(): Promise<GeneralSettings> {
  const snap = await adminDb.doc('settings/general').get();
  return (snap.data() || {}) as GeneralSettings;
