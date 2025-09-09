
"use client";
import { useState, useEffect } from "react";
import { Button } from "./ui/button";

export default function CookieConsent() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    try {
        if (!localStorage.getItem("cookie-consent")) {
            setVisible(true);
        }
    } catch (e) {
        // localStorage is not available
    }
  }, []);

  const acceptCookies = () => {
      try {
        localStorage.setItem("cookie-consent","accepted");
        setVisible(false);
        // Reload to apply analytics scripts
        window.location.reload(); 
      } catch (e) {
          setVisible(false);
      }
  }

  const declineCookies = () => {
      try {
        localStorage.setItem("cookie-consent","declined");
        setVisible(false);
      } catch(e) {
          setVisible(false);
      }
  }

  if (!visible) return null;

  return (
    <div className="fixed bottom-0 inset-x-0 z-50">
        <div className="bg-background border-t shadow-2xl p-4 flex flex-col md:flex-row items-center justify-between gap-4 container mx-auto rounded-t-lg">
            <p className="text-sm text-muted-foreground text-center md:text-left">
                Vi bruger cookies til at forbedre din oplevelse og til tracking. Læs mere i vores cookiepolitik.
            </p>
            <div className="flex gap-2 flex-shrink-0">
                <Button
                onClick={acceptCookies}
                variant="default"
                size="sm"
                >
                Accepter
                </Button>
                <Button
                onClick={declineCookies}
                variant="outline"
                size="sm"
                >
                Afvis
                </Button>
            </div>
        </div>
    </div>
  );
}
