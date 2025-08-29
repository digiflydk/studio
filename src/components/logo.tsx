
import * as React from 'react';
import Image from 'next/image';

interface LogoProps extends React.SVGProps<SVGSVGElement> {
  logoUrl?: string;
  logoAlt?: string;
  width?: number;
  height?: number;
  isDark?: boolean;
}

const Logo = ({ logoUrl, logoAlt, width = 96, height = 28, isDark = false, ...props }: LogoProps) => {
  const aspectRatio = width / height;
  const calculatedHeight = Math.round(width / (96 / 28));

  if (logoUrl) {
    return (
      <div style={{ width: `${width}px`, height: `${calculatedHeight}px` }} className="relative">
        <Image
          src={logoUrl}
          alt={logoAlt || 'Company Logo'}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          style={{ objectFit: 'contain' }}
          priority
        />
      </div>
    );
  }

  return (
    <svg width={width} height={calculatedHeight} viewBox="0 0 100 28" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <text
        fontFamily="'Inter', sans-serif"
        fontSize="24"
        fontWeight="600"
        fill={isDark ? "hsl(var(--primary-foreground))" : "hsl(var(--foreground))"}
        x="0"
        y="21"
      >
        Digifly
      </text>
    </svg>
  );
};

export default Logo;
