'use client';
import type { ConsentCategories } from '@/types/settings';

const COOKIE_NAME = 'cookie_consent';
const COOKIE_VERSION = 'v2'; // Updated version

declare global {
  interface Window {
    dataLayer: any[];
    gtag: (...args: any[]) => void;
  }
}

type GtagConsent = {
    ad_storage?: 'granted' | 'denied';
    analytics_storage?: 'granted' | 'denied';
    functionality_storage?: 'granted' | 'denied'; // Corresponds to 'preferences'
    ad_user_data?: 'granted' | 'denied';
    ad_personalization?: 'granted' | 'denied';
}

function mapToGtag(consent: ConsentCategories): GtagConsent {
    const isMarketingGranted = consent.marketing ? 'granted' : 'denied';
    return {
        analytics_storage: consent.analytics ? 'granted' : 'denied',
        ad_storage: isMarketingGranted,
        functionality_storage: consent.preferences ? 'granted' : 'denied',
        ad_user_data: isMarketingGranted,
        ad_personalization: isMarketingGranted,
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
    // Add legacy check if you have old cookies
    return null;
}

export function saveConsent(consent: ConsentCategories, lifetimeDays: number) {
    if (typeof window === 'undefined') return;

    try {
        const base64Json = btoa(JSON.stringify(consent));
        const cookieValue = `${COOKIE_VERSION}.${base64Json}`;
        const expires = new Date(Date.now() + lifetimeDays * 24 * 60 * 60 * 1000).toUTCString();
        document.cookie = `${COOKIE_NAME}=${cookieValue}; expires=${expires}; path=/; SameSite=Lax; Secure`;
        
        // Also save to localStorage as a fallback/helper
        localStorage.setItem(COOKIE_NAME, cookieValue);

        // Fire events
        if (window.gtag) {
            window.gtag('consent', 'update', mapToGtag(consent));
        } else if (window.dataLayer) {
             // Fallback for GTM if gtag isn't loaded
            window.dataLayer.push({
                'event': 'consent_update',
                ...mapToGtag(consent)
            });
        }
        
        // General event for other scripts to listen to
        window.dispatchEvent(new CustomEvent('consent_update', { detail: consent }));

    } catch (e) {
        console.error("Could not save cookie consent", e);
    }
}
