"use client";

import { useEffect, useState } from "react";
import SiteHeader, { WebsiteHeaderConfig } from "./SiteHeader";

export default function HeaderClient({ config }: { config: WebsiteHeaderConfig }) {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <SiteHeader
      config={config}
      scrolled={scrolled}
    />
  );
}
