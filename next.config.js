/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      // ── Local API uploads (dev) ──────────────────────────────────────────
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '5000',
        pathname: '/uploads/**',
      },
      // ── Production API (same domain, no port) ───────────────────────────
      {
        protocol: 'https',
        hostname: '**.biddaro.com',
        pathname: '/uploads/**',
      },
      // ── External image sources ───────────────────────────────────────────
      { protocol: 'https', hostname: 'images.unsplash.com' },
      { protocol: 'https', hostname: 'randomuser.me' },
      { protocol: 'https', hostname: 'avatars.githubusercontent.com' },
    ],
  },
};

module.exports = nextConfig;
