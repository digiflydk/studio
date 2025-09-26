
import Image from "next/image";
import Link from "next/link";
import type { AdminHomeDoc } from "@/lib/types/admin";

type Props = { home: AdminHomeDoc };

export default function Hero({ home }: Props) {
  const hero = home?.hero;
  if (!hero?.enabled) return null;

  return (
    <section
      className="w-full"
      style={{
        paddingTop: hero.spacing?.top ?? 80,
        paddingBottom: hero.spacing?.bottom ?? 80,
      }}
    >
      <div className="mx-auto max-w-7xl px-4 md:px-6 grid md:grid-cols-2 gap-12 items-center">
        <div className={hero.align === "center" ? "text-center" : "text-left"}>
          <h1 className="text-5xl md:text-6xl font-extrabold leading-tight max-w-[900px]">
            {hero.headline}
          </h1>
          {hero.description ? (
            <p className="mt-6 text-lg text-slate-600 max-w-[700px]">
              {hero.description}
            </p>
          ) : null}
          {hero.ctaText && hero.ctaLink ? (
            <Link
              href={hero.ctaLink}
              className="mt-8 inline-flex rounded-full bg-black text-white px-6 py-3 font-medium"
            >
              {hero.ctaText}
            </Link>
          ) : null}
        </div>

        <div className="grid grid-cols-2 gap-6">
          <div className="rounded-2xl shadow-xl overflow-hidden">
            {hero.images?.tl ? (
              <Image
                src={hero.images.tl}
                alt=""
                width={600}
                height={800}
                priority
                style={{ height: "auto", width: "100%" }}
                sizes="(max-width: 768px) 100vw, 25vw"
              />
            ) : null}
          </div>

          <div className="rounded-2xl shadow-xl overflow-hidden">
            {hero.images?.tr ? (
              <Image
                src={hero.images.tr}
                alt=""
                width={600}
                height={600}
                style={{ height: "auto", width: "100%" }}
                sizes="(max-width: 768px) 100vw, 25vw"
              />
            ) : null}
          </div>

          <div className="rounded-2xl shadow-xl overflow-hidden">
            {hero.images?.bl ? (
              <Image
                src={hero.images.bl}
                alt=""
                width={600}
                height={600}
                style={{ height: "auto", width: "100%" }}
                sizes="(max-width: 768px) 100vw, 25vw"
              />
            ) : null}
          </div>

          <div className="rounded-2xl shadow-xl overflow-hidden">
            {hero.images?.br ? (
              <Image
                src={hero.images.br}
                alt=""
                width={600}
                height={800}
                style={{ height: "auto", width: "100%" }}
                sizes="(max-width: 768px) 100vw, 25vw"
              />
            ) : null}
          </div>
        </div>
      </div>
    </section>
  );
}
