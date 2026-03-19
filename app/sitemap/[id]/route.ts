/**
 * Route Handler: /sitemap/[id]
 *
 * Serves individual XML child sitemaps.
 *   /sitemap/0  →  Static & core pages (14 URLs)
 *   /sitemap/1  →  Hire hub — categories & states (~640 URLs)
 *   /sitemap/2  →  Hire cities — states 0–10 (~2,360 URLs)
 *   /sitemap/3  →  Hire cities — states 11–20 (~2,160 URLs)
 *   /sitemap/4  →  Hire cities — states 21–end (~2,180 URLs)
 *   /sitemap/5  →  Cost guides + Ask/Q&A (~83 URLs)
 *   /sitemap/6  →  Cost by city — services 0–3 (~1,340 URLs)
 *   /sitemap/7  →  Cost by city — services 4–end (~1,005 URLs)
 */

import { buildSitemap, type SitemapEntry } from '@/lib/sitemap-builders';

export const dynamic = 'force-dynamic';

export function GET(
  _req: Request,
  { params }: { params: { id: string } },
) {
  const id = parseInt(params.id, 10);

  if (isNaN(id)) {
    return new Response('Not Found', { status: 404 });
  }

  const entries: SitemapEntry[] = buildSitemap(id);

  if (entries.length === 0) {
    return new Response('Not Found', { status: 404 });
  }

  const urlTags = entries
    .map(
      (e) =>
        `  <url>\n    <loc>${e.url}</loc>\n    <lastmod>${e.lastModified}</lastmod>\n    <changefreq>${e.changeFrequency}</changefreq>\n    <priority>${e.priority}</priority>\n  </url>`,
    )
    .join('\n');

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urlTags}
</urlset>`;

  return new Response(xml, {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
      'Cache-Control': 'public, max-age=3600, s-maxage=86400',
    },
  });
}
