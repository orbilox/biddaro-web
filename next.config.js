// Backend API origin. In production the browser never hits this directly — it
// calls biddaro.com same-origin and Vercel proxies to here server-to-server
// (see rewrites below). This avoids users whose network/ISP can't resolve the
// railway.app domain, and removes cross-origin/CORS entirely.
const API_ORIGIN =
  process.env.API_PROXY_ORIGIN || 'https://biddaro-api-production.up.railway.app';

/** @type {import('next').NextConfig} */
const nextConfig = {
  // ── Proxy API + uploads through our own domain ───────────────────────────
  // /api/v1/* and /uploads/* are forwarded to the backend by Vercel's edge.
  // /api/cron/* stays a real Next.js route (filesystem routes win over rewrites).
  async rewrites() {
    return [
      { source: '/api/v1/:path*', destination: `${API_ORIGIN}/api/v1/:path*` },
      { source: '/uploads/:path*', destination: `${API_ORIGIN}/uploads/:path*` },
    ];
  },

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
