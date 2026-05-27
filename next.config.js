/** @type {import('next').NextConfig} */
const nextConfig = {
  // ── SEO Headers ─────────────────────────────────────────────────────────
  async headers() {
    return [
      {
        // Tell Google to index & follow all loan pages
        source: '/loans/:path*',
        headers: [{ key: 'X-Robots-Tag', value: 'index, follow' }],
      },
      {
        // Trust / about pages
        source: '/about/:path*',
        headers: [{ key: 'X-Robots-Tag', value: 'index, follow' }],
      },
      {
        // Canonical protection: pages with UTM params still point to clean URL
        source: '/:path*',
        headers: [
          { key: 'Vary', value: 'Accept-Language' },
        ],
      },
    ];
  },

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
      // ── AWS S3 uploads ───────────────────────────────────────────────────
      { protocol: 'https', hostname: '**.amazonaws.com' },
      // ── External image sources ───────────────────────────────────────────
      { protocol: 'https', hostname: 'images.unsplash.com' },
      { protocol: 'https', hostname: 'randomuser.me' },
      { protocol: 'https', hostname: 'avatars.githubusercontent.com' },
    ],
  },
};

module.exports = nextConfig;
