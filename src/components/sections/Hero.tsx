import Image from "next/image";

type Color = { h: number; s: number; l: number };
type Padding = { top?: number; bottom?: number; topMobile?: number; bottomMobile?: number };

export default function Hero({ settings }: { settings: any }) {
  const s = settings ?? {};
  const pad: Padding = s.sectionPadding?.hero ?? {};
  const pt = pad.top ?? 80;
  const pb = pad.bottom ?? 80;
  const ptM = pad.topMobile ?? 64;
  const pbM = pad.bottomMobile ?? 64;

  const bg: Color = s.heroSectionBackgroundColor ?? { h: 0, s: 0, l: 100 };

  const headline = s.heroHeadline ?? "Flow. Automatisér. Skalér.";
  const desc = s.heroDescription ?? "";
  const ctaEnabled = s.heroCtaEnabled ?? true;
  const ctaText = s.heroCtaText ?? "Book et møde";
  const ctaHref = s.heroCtaLink ?? "#contact";

  const hDesktop = s.heroHeadlineSize ?? 55;
  const hMobile = s.heroHeadlineSizeMobile ?? 40;
  const textMax = s.heroTextMaxWidth ?? 700;

  const g1 = s.heroGridImage1Url;
  const g2 = s.heroGridImage2Url;
  const g3 = s.heroGridImage3Url;
  const g4 = s.heroGridImage4Url;
  
  return (
    <section
      style={{
        backgroundColor: `hsl(${bg.h} ${bg.s}% ${bg.l}%)`,
        paddingTop: ptM,
        paddingBottom: pbM,
      }}
      className="sm:pt-0 sm:pb-0"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8" style={{ paddingTop: pt, paddingBottom: pb }}>
        <div className="grid items-center gap-10 lg:grid-cols-2">
          {/* Text */}
          <div>
            <h1 className="font-extrabold tracking-tight text-slate-900" style={{ fontSize: `${hMobile}px` }}>
              <span className="hidden sm:inline" style={{ fontSize: `${hDesktop}px` }}>
                {headline}
              </span>
              <span className="sm:hidden">{headline}</span>
            </h1>

            <p className="mt-6 text-slate-700" style={{ maxWidth: textMax, fontSize: s.heroDescriptionSize ?? 22 }}>
              {desc}
            </p>

            {ctaEnabled && ctaHref && (
              <a
                href={ctaHref}
                className="mt-8 inline-flex items-center rounded-full bg-slate-900 px-6 py-3 text-white hover:bg-slate-800"
                style={{ fontSize: s.heroCtaTextSize ?? 16 }}
              >
                {ctaText}
              </a>
            )}
          </div>

          {/* Images */}
          <div className="grid grid-cols-2 grid-rows-2 gap-6">
            {/* TL = Portrait */}
            {g1 && (
              <div className="relative w-full overflow-hidden rounded-xl shadow-xl aspect-[3/4]">
                <Image src={g1} alt="" width={600} height={800} priority style={{height:"auto"}} sizes="(max-width:768px) 50vw, 25vw" className="object-cover" />
              </div>
            )}

            {/* TR = Landscape */}
            {g2 && (
              <div className="relative w-full overflow-hidden rounded-xl shadow-xl aspect-[16/10]">
                <Image src={g2} alt="" width={600} height={600} style={{height:"auto"}} sizes="(max-width:768px) 50vw, 25vw" className="object-cover" />
              </div>
            )}

            {/* BL = Landscape */}
            {g3 && (
              <div className="relative w-full overflow-hidden rounded-xl shadow-xl aspect-[16/10]">
                 <Image src={g3} alt="" width={600} height={600} style={{height:"auto"}} sizes="(max-width:768px) 50vw, 25vw" className="object-cover" />
              </div>
            )}

            {/* BR = Portrait */}
            {g4 && (
              <div className="relative w-full overflow-hidden rounded-xl shadow-xl aspect-[3/4]">
                <Image src={g4} alt="" width={600} height={800} style={{height:"auto"}} sizes="(max-width:768px) 50vw, 25vw" className="object-cover" />
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
