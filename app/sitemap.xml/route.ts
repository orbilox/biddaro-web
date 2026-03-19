/**
 * Route Handler: /sitemap.xml
 *
 * Serves the XML sitemap INDEX listing all 8 child sitemaps.
 * Submit this URL to Google Search Console:
 *   https://biddaro.com/sitemap.xml
 *
 * Works in BOTH development and production (unlike app/sitemap.ts with
 * generateSitemaps() which only works after next build in production).
 */

import { SITEMAP_BASE, SITEMAP_IDS } from '@/lib/sitemap-builders';

export const dynamic = 'force-dynamic';

export function GET() {
  const lastmod = new Date().toISOString();

  const sitemapTags = SITEMAP_IDS.map(
    (id) =>
      `  <sitemap>\n    <loc>${SITEMAP_BASE}/sitemap/${id}</loc>\n    <lastmod>${lastmod}</lastmod>\n  </sitemap>`,
  ).join('\n');

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${sitemapTags}
</sitemapindex>`;

  return new Response(xml, {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
      'Cache-Control': 'public, max-age=3600, s-maxage=86400',
    },
  });
}
