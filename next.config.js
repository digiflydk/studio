/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'placehold.co', pathname: '/**' },
      { protocol: 'https', hostname: 'picsum.photos', pathname: '/**' },
      { protocol: 'https', hostname: 'images.unsplash.com', pathname: '/**' },
      { protocol: 'https', hostname: 'firebasestorage.googleapis.com', pathname: '/**' },
      { protocol: 'https', hostname: 'i.postimg.cc', pathname: '/**' },
    ],
  },
  devIndicators: { buildActivity: true },
  experimental: {
    serverComponentsExternalPackages: [
      'firebase-admin',
      '@google-cloud/firestore',
      'google-auth-library'
    ],
  },
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        child_process: false,
        fs: false,
        os: false,
        net: false,
        tls: false,
      };
    }
    return config;
  },
};

module.exports = nextConfig;
