import type {NextConfig} from 'next';

const nextConfig: NextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
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
        hostname: 'images.unsplash.com',
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
        protocol: 'https',
        hostname: 'img.gamemonetize.com',
        port: '',
        pathname: '/**',
      },
    ],
  },
  async headers() {
    return [
      {
        source: '/games/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, s-maxage=3600, stale-while-revalidate=86400',
          },
        ],
      },
    ];
  },
  // Production optimizations
  poweredByHeader: false,
  reactStrictMode: true,
  compress: true,
  experimental: {
    // Explicitly allow origin requests from the Firebase Studio proxy environment
    allowedDevOrigins: [
      '6000-firebase-studio-1780821471623.cluster-zkm2jrwbnbd4awuedc2alqxrpk.cloudworkstations.dev',
      '*.cloudworkstations.dev',
      'localhost:9002'
    ]
  }
};

export default nextConfig;
