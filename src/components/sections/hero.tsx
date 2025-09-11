// components/sections/Hero.tsx
import React from 'react';

type Props = {
  title?: string;
  subtitle?: string;
  ctaText?: string;
};

export default function Hero({ title, subtitle, ctaText }: Props) {
  return (
    <section className="hero">
      <div className="container mx-auto px-4 py-8">
        {title && <h1 className="text-3xl md:text-5xl font-semibold mb-4">{title}</h1>}
        {subtitle && <p className="text-lg md:text-xl opacity-80 mb-6">{subtitle}</p>}
        {ctaText && <button className="btn-primary px-6 py-3">{ctaText}</button>}
      </div>
    </section>
  );
}
