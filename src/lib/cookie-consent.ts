
'use client';
import type { ConsentCategories } from '@/types/settings';

const COOKIE_NAME = 'cookie_consent';
const COOKIE_VERSION = 'v1';

declare global {
  interface Window {
    dataLayer: any[];
    gtag: (...args: any[]) => void;
  }
}

type GtagConsent = {
    ad_storage?: 'granted' | 'denied';
    analytics_storage?: 'granted' | 'denied';
    functionality_storage?: 'granted' | 'denied';
    personalization_storage?: 'granted' | 'denied';
    security_storage?: 'granted' | 'denied';
}

function mapToGtag(consent: ConsentCategories): GtagConsent {
    return {
        analytics_storage: consent.analytics ? 'granted' : 'denied',
        ad_storage: consent.marketing ? 'granted' : 'denied',
        functionality_storage: consent.preferences ? 'granted' : 'denied',
    };
}

export function getConsent(): ConsentCategories | null {
    if (typeof window === 'undefined') return null;

    try {
        const value = `; ${document.cookie}`;
        const parts = value.split(`; ${COOKIE_NAME}=`);
        if (parts.length === 2) {
            const cookieValue = parts.pop()?.split(';').shift();
            if (cookieValue) {
                const [version, base64Json] = cookieValue.split('.');
                if (version === COOKIE_VERSION && base64Json) {
                    return JSON.parse(atob(base64Json));
                }
            }
        }
    } catch (e) {
        console.error("Could not parse cookie consent", e);
        return null;
    }
    return null;
}

export function saveConsent(consent: ConsentCategories, lifetimeDays: number) {
    if (typeof window === 'undefined') return;

    try {
        const base64Json = btoa(JSON.stringify(consent));
        const cookieValue = `${COOKIE_VERSION}.${base64Json}`;
        const expires = new Date(Date.now() + lifetimeDays * 24 * 60 * 60 * 1000).toUTCString();
        document.cookie = `${COOKIE_NAME}=${cookieValue}; expires=${expires}; path=/; SameSite=Lax`;
        
        // Fire events
        if (window.gtag) {
            window.gtag('consent', 'update', mapToGtag(consent));
        }
        if (window.dataLayer) {
            window.dataLayer.push({ event: 'cookie_consent_update', consent });
        }
    } catch (e) {
        console.error("Could not save cookie consent", e);
    }
}
