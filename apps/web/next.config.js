/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ['@chalsaath/shared'],
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'api.dicebear.com',
      },
      {
        protocol: 'https',
        hostname: 'lh3.googleusercontent.com', // Google profile photos
      }],
      
    domains: ['lh3.googleusercontent.com'],
  },
  experimental: {
    serverComponentsExternalPackages: ['firebase-admin'],
  },
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          { key: 'Cross-Origin-Opener-Policy', value: 'same-origin-allow-popups' },
        ],
      },
    ];
  },
};

module.exports = nextConfig;
