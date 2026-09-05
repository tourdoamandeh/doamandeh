import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    dangerouslyAllowLocalIP: true,
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: '**.supabase.co',
      },
      {
        protocol: 'https',
        hostname: 'qncdgbjanmfcjuemiwwl.supabase.co',
      },
    ],
  },
  async redirects() {
    return [
      {
        source: '/category/:slug',
        destination: '/services?category=:slug',
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
