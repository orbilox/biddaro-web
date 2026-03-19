import type { MetadataRoute } from 'next';
import { JOB_CATEGORY_META, INDIA_LOCATIONS } from '@/lib/seo-data';
import { getAllSlugs as getAskSlugs } from '@/lib/ask-data';

const BASE = 'https://biddaro.com';
const NOW  = new Date().toISOString();

function url(
  path: string,
  priority: number = 0.5,
  changeFrequency: MetadataRoute.Sitemap[0]['changeFrequency'] = 'weekly',
  lastModified: string = NOW,
): MetadataRoute.Sitemap[0] {
  return { url: `${BASE}${path}`, lastModified, changeFrequency, priority };
}

export default function sitemap(): MetadataRoute.Sitemap {
  const entries: MetadataRoute.Sitemap = [];

  // ── Static pages ────────────────────────────────────────────────
  entries.push(
    url('/',              1.0,  'daily'),
    url('/hire',          0.95, 'daily'),
    url('/ask',           0.9,  'weekly'),
    url('/blog',          0.9,  'weekly'),
    url('/cost',          0.9,  'weekly'),
    url('/open-jobs',     0.85, 'hourly'),
    url('/ai-assistant',  0.7,  'monthly'),
    url('/ai-image',      0.7,  'monthly'),
  );

  // ── /hire/[category] — 20 pages ──────────────────────────────────
  for (const cat of JOB_CATEGORY_META) {
    entries.push(url(`/hire/${cat.slug}`, 0.9, 'weekly'));
  }

  // ── /hire/[category]/[state] — 620 pages ─────────────────────────
  for (const cat of JOB_CATEGORY_META) {
    for (const loc of INDIA_LOCATIONS) {
      entries.push(url(`/hire/${cat.slug}/${loc.slug}`, 0.8, 'weekly'));
    }
  }

  // ── /hire/[category]/[state]/[city] — 3,340+ pages ───────────────
  for (const cat of JOB_CATEGORY_META) {
    for (const loc of INDIA_LOCATIONS) {
      for (const city of loc.cities) {
        entries.push(url(`/hire/${cat.slug}/${loc.slug}/${city.slug}`, 0.75, 'weekly'));
      }
    }
  }

  // ── /ask/[slug] — 68 pages ────────────────────────────────────────
  try {
    for (const slug of getAskSlugs()) {
      entries.push(url(`/ask/${slug}`, 0.8, 'monthly'));
    }
  } catch (_) {}

  // ── /ask/city/[city]/[slug] pages ────────────────────────────────
  const topCities = INDIA_LOCATIONS.flatMap(l =>
    l.cities.slice(0, 2).map(c => c.slug)
  ).slice(0, 30);
  try {
    for (const citySlug of topCities) {
      entries.push(url(`/ask/city/${citySlug}`, 0.7, 'weekly'));
    }
  } catch (_) {}

  // ── /cost/[service] — 20 pages ───────────────────────────────────
  for (const cat of JOB_CATEGORY_META) {
    entries.push(url(`/cost/${cat.slug}`, 0.85, 'monthly'));
    // /cost/[service]/[city] — 20 × 167 = 3,340 pages
    for (const loc of INDIA_LOCATIONS) {
      for (const city of loc.cities) {
        entries.push(url(`/cost/${cat.slug}/${city.slug}`, 0.75, 'monthly'));
      }
    }
  }

  return entries;
}
