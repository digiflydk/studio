import { NextResponse } from "next/server";
import { getFirestore } from "firebase-admin/firestore";
import { initAdmin } from "@/lib/server/firebaseAdmin";

export const dynamic = "force-dynamic";

export async function POST() {
  if (process.env.ADMIN_ALLOW_SEED !== "1") {
    return NextResponse.json({ ok: false, error: "disabled" }, { status: 403 });
  }

  const app = initAdmin();
  const db = getFirestore(app);

  await db.doc("admin/pages/header/header").set({
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
    cta: { enabled: true, label: "Book et møde", href: "https://calendly.com/okh-digifly/30min", variant: "pill", size: "lg" },
    bg: { initial: { h:0,s:0,l:100,opacity:1 }, scrolled: { h:0,s:0,l:100,opacity:1 } },
    border: { enabled: true, widthPx: 1, colorHex: "#000000" },
    updatedAt: new Date().toISOString(),
    updatedBy: "seed"
  }, { merge: true });

  await db.doc("admin/pages/home/home").set({
    hero: {
      enabled: true,
      headline: "Flow. Automatisér. Skalér.",
      description: "Vi hjælper virksomheder med at bygge skalerbare digitale løsninger, der optimerer processer og driver vækst.",
      ctaText: "Book et møde",
      ctaLink: "https://calendly.com/okh-digifly/30min",
      images: {
        tl: "https://i.postimg.cc/NFhDJZSC/Female-ordering-take-away-food.png",  // portrait
        tr: "https://i.postimg.cc/pTckfpJv/Group-meeting-whiteboard-flow-diagram-post-it.png", // square
        bl: "https://i.postimg.cc/pTckfpJv/Group-meeting-whiteboard-flow-diagram-post-it.png", // square
        br: "https://i.postimg.cc/d0x4dhBY/Male-working-VR-office.png" // portrait
      },
      spacing: { top: 80, bottom: 80 },
      align: "left",
      maxTextWidth: 700
    },
    sectionOrder: ["feature","services","cases","about","contact"],
    updatedAt: new Date().toISOString(),
    updatedBy: "seed"
  }, { merge: true });

  return NextResponse.json({ ok: true });
}
