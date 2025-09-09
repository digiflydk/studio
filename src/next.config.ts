
import type {NextConfig} from 'next';

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'placehold.co',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'picsum.photos',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https' ,
        hostname: 'i.postimg.cc',
        port: '',
        pathname: '/**',
      },
    ],
  },
  devIndicators: {
    buildActivity: true,
  },
  ...(process.env.NODE_ENV === 'development' && {
    experimental: {
        allowedDevOrigins: [
            'https://6000-firebase-studio-1756450523972.cluster-3gc7bglotjgwuxlqpiut7yyqt4.cloudworkstations.dev',
        ]
    }
  })
};

export default nextConfig;
