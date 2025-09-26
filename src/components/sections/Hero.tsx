
'use client';

import Image from 'next/image';
import type { AdminHomeDoc } from '@/lib/types/admin';

type Props = { hero: AdminHomeDoc['hero'] };

export default function Hero({ hero }: Props) {
  // simple guards to avoid “empty” right column if any values are missing
  const tl = hero?.images?.tl || '';
  const tr = hero?.images?.tr || '';
  const bl = hero?.images?.bl || '';
  const br = hero?.images?.br || '';

  return (
    <section className="mx-auto max-w-7xl px-6 py-16 grid gap-10 lg:grid-cols-2 items-center">
      {/* LEFT: text */}
      <div style={{ maxWidth: hero?.maxTextWidth ?? 700 }}>
        {hero?.headline ? (
          <h1 className="text-4xl md:text-5xl font-bold leading-tight">
            {hero.headline}
          </h1>
        ) : null}
        {hero?.description ? (
          <p className="mt-4 text-lg text-gray-700">{hero.description}</p>
        ) : null}

        {hero?.ctaText ? (
          <a
            href={hero?.ctaLink || '#'}
            className="mt-6 inline-block rounded-full px-6 py-3 bg-blue-600 text-white font-medium shadow"
          >
            {hero.ctaText}
          </a>
        ) : null}
      </div>

      {/* RIGHT: image grid – forces layout even if some images are missing */}
      <div className="grid grid-cols-2 gap-5">
        {/* TL (portrait) */}
        <div className="rounded-2xl overflow-hidden shadow-lg">
          {tl ? (
            <Image
              src={tl}
              alt=""
              width={600}
              height={800}
              style={{ height: 'auto' }}
              sizes="(max-width: 1024px) 50vw, 25vw"
              priority
            />
          ) : (
            <div className="aspect-[3/4] bg-gray-100" />
          )}
        </div>

        {/* TR (square) */}
        <div className="rounded-2xl overflow-hidden shadow-lg">
          {tr ? (
            <Image
              src={tr}
              alt=""
              width={600}
              height={600}
              style={{ height: 'auto' }}
              sizes="(max-width: 1024px) 50vw, 25vw"
            />
          ) : (
            <div className="aspect-square bg-gray-100" />
          )}
        </div>

        {/* BL (square) */}
        <div className="rounded-2xl overflow-hidden shadow-lg">
          {bl ? (
            <Image
              src={bl}
              alt=""
              width={600}
              height={600}
              style={{ height: 'auto' }}
              sizes="(max-width: 1024px) 50vw, 25vw"
            />
          ) : (
            <div className="aspect-square bg-gray-100" />
          )}
        </div>

        {/* BR (portrait) */}
        <div className="rounded-2xl overflow-hidden shadow-lg">
          {br ? (
            <Image
              src={br}
              alt=""
              width={600}
              height={800}
              style={{ height: 'auto' }}
              sizes="(max-width: 1024px) 50vw, 25vw"
            />
          ) : (
            <div className="aspect-[3/4] bg-gray-100" />
          )}
        </div>
      </div>
    </section>
  );
}
