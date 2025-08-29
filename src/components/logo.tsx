import * as React from 'react';
import Image from 'next/image';

interface LogoProps extends React.SVGProps<SVGSVGElement> {
  logoUrl?: string;
  logoAlt?: string;
}

const Logo = ({ logoUrl, logoAlt, ...props }: LogoProps) => {
  if (logoUrl) {
    return (
      <div className="relative h-7 w-24">
        <Image
          src={logoUrl}
          alt={logoAlt || 'Company Logo'}
          fill
          style={{ objectFit: 'contain' }}
          priority
        />
      </div>
    );
  }

  return (
    <svg width="100" height="28" viewBox="0 0 100 28" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <text
        fontFamily="'Inter', sans-serif"
        fontSize="24"
        fontWeight="600"
        fill="hsl(var(--foreground))"
        x="0"
        y="21"
      >
        Digifly
      </text>
    </svg>
  );
};

export default Logo;
