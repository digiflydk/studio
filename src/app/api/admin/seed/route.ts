import { NextResponse } from "next/server";
import { initAdmin } from "@/lib/server/firebaseAdmin";
import { getFirestore } from "firebase-admin/firestore";

export const dynamic = "force-dynamic";

export async function POST() {
  const app = initAdmin();
  const db = getFirestore(app);

  const headerRef = db.doc("admin/pages/header/header");
  const homeRef = db.doc("admin/pages/home/home");

  await headerRef.set({
    version: 1,
    logo: {
      src: "https://i.postimg.cc/pL55xDxd/DIGIFLY-black-wo-bg.png",
      alt: "Digifly logo",
      maxWidth: 150
    },
    height: 110,
    sticky: true,
    overlay: true,
    linkColor: "black",
    nav: [
      { label: "Services", href: "#services" },
      { label: "Cases", href: "#cases" },
      { label: "Om os", href: "#om-os" },
      { label: "Kontakt", href: "#kontakt" }
    ],
    cta: {
      enabled: true,
      label: "Book et møde",
      href: "https://calendly.com/okh-digifly/30min",
      variant: "pill",
      size: "lg"
    },
    bg: {
      initial: { h: 0, s: 0, l: 100, opacity: 1 },
      scrolled: { h: 0, s: 0, l: 100, opacity: 1 }
    },
    border: { enabled: true, widthPx: 1, colorHex: "#000000" },
    updatedAt: new Date().toISOString(),
    updatedBy: "seed"
  }, { merge: true });

  await homeRef.set({
    hero: {
      enabled: true,
      headline: "Flow. Automatisér. Skalér.",
      description: "Vi hjælper virksomheder med at bygge skalerbare digitale løsninger, der optimerer processer og driver vækst.",
      ctaText: "Book et møde",
      ctaLink: "https://calendly.com/okh-digifly/30min",
      images: {
        tl: "https://i.postimg.cc/NFhDJZSC/Female-ordering-take-away-food.png",
        tr: "https://i.postimg.cc/pTckfpJv/Group-meeting-whiteboard-flow-diagram-post-it.png",
        bl: "https://i.postimg.cc/pTckfpJv/Group-meeting-whiteboard-flow-diagram-post-it.png",
        br: "https://i.postimg.cc/d0x4dhBY/Male-working-VR-office.png"
      },
      spacing: { top: 80, bottom: 80 },
      align: "left",
      maxTextWidth: 700
    },
    sectionOrder: ["feature","services","aiProject","cases","about","customers"],
    updatedAt: new Date().toISOString(),
    updatedBy: "seed"
  }, { merge: true });

  return NextResponse.json({ ok: true });
}
