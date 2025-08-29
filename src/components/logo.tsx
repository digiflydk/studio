import * as React from 'react';

const Logo = (props: React.SVGProps<SVGSVGElement>) => (
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

export default Logo;
