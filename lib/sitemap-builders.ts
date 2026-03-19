/**
 * ─────────────────────────────────────────────────────────────────────────────
 *  lib/sitemap-builders.ts  —  Sitemap builder functions
 * ─────────────────────────────────────────────────────────────────────────────
 *
 *  Used by two Route Handlers:
 *    app/sitemap.xml/route.ts   → serves XML sitemap INDEX  at /sitemap.xml
 *    app/sitemap/[id]/route.ts  → serves XML child sitemaps at /sitemap/[id]
 *
 *  Sitemap breakdown:
 *   ID  Path            Contents                              ~URLs
 *   ──  ──────────────  ────────────────────────────────────  ──────
 *   0   /sitemap/0      Static & core pages                      14
 *   1   /sitemap/1      /hire/[cat] + /hire/[cat]/[state]       640
 *   2   /sitemap/2      /hire cities — states  0–10           2,360
 *   3   /sitemap/3      /hire cities — states 11–20           2,160
 *   4   /sitemap/4      /hire cities — states 21–end          2,180
 *   5   /sitemap/5      /cost + /cost/[svc] + /ask/[slug]        83
 *   6   /sitemap/6      /cost/[svc]/[city] — services 0–3     1,340
 *   7   /sitemap/7      /cost/[svc]/[city] — services 4–end   1,005
 *   ──  ──────────────  ────────────────────────────────────  ──────
 *                                              TOTAL:         ~9,782
 *
 *  ✅ Submit to Google Search Console: https://biddaro.com/sitemap.xml
 * ─────────────────────────────────────────────────────────────────────────────
 */

import { COST_SERVICES } from '@/lib/cost-data';
import { JOB_CATEGORY_META, INDIA_LOCATIONS } from '@/lib/seo-data';
import { getAllSlugs as getAskSlugs } from '@/lib/ask-data';

export const SITEMAP_BASE = 'https://biddaro.com';
export const SITEMAP_IDS  = [0, 1, 2, 3, 4, 5, 6, 7] as const;

export interface SitemapEntry {
  url: string;
  lastModified: string;
  changeFrequency: string;
  priority: number;
}

// ─── Router ───────────────────────────────────────────────────────────────────

export function buildSitemap(id: number): SitemapEntry[] {
  switch (id) {
    case 0: return buildStaticSitemap();
    case 1: return buildHireHubSitemap();
    case 2: return buildHireCitiesSitemap(0,  11);
    case 3: return buildHireCitiesSitemap(11, 21);
    case 4: return buildHireCitiesSitemap(21, INDIA_LOCATIONS.length);
    case 5: return buildCostAndAskSitemap();
    case 6: return buildCostCitiesSitemap(0, 4);
    case 7: return buildCostCitiesSitemap(4, COST_SERVICES.length);
    default: return [];
  }
}

// ─── Helper ───────────────────────────────────────────────────────────────────

const NOW = new Date().toISOString();

function entry(path: string, priority: number, changeFrequency: string): SitemapEntry {
  return {
    url: `${SITEMAP_BASE}${path}`,
    lastModified: NOW,
    changeFrequency,
    priority,
  };
}

// ─── Sitemap 0 — Static / Core ───────────────────────────────────────────────

function buildStaticSitemap(): SitemapEntry[] {
  return [
    entry('/',               1.0,  'daily'),
    entry('/hire',           0.95, 'daily'),
    entry('/cost',           0.95, 'weekly'),
    entry('/ask',            0.9,  'weekly'),
    entry('/blog',           0.9,  'weekly'),
    entry('/open-jobs',      0.85, 'hourly'),
    entry('/register',       0.9,  'monthly'),
    entry('/login',          0.6,  'monthly'),
    entry('/about',          0.7,  'monthly'),
    entry('/pricing',        0.8,  'monthly'),
    entry('/contact',        0.6,  'monthly'),
    entry('/html-sitemap',   0.5,  'monthly'),
    entry('/privacy-policy', 0.3,  'yearly'),
    entry('/terms',          0.3,  'yearly'),
  ];
}

// ─── Sitemap 1 — Hire Hub ─────────────────────────────────────────────────────

function buildHireHubSitemap(): SitemapEntry[] {
  const entries: SitemapEntry[] = [];
  for (const cat of JOB_CATEGORY_META) {
    entries.push(entry(`/hire/${cat.slug}`, 0.85, 'weekly'));
    for (const state of INDIA_LOCATIONS) {
      entries.push(entry(`/hire/${cat.slug}/${state.slug}`, 0.75, 'weekly'));
    }
  }
  return entries;
}

// ─── Sitemaps 2–4 — Hire Cities ───────────────────────────────────────────────

function buildHireCitiesSitemap(stateFrom: number, stateTo: number): SitemapEntry[] {
  const entries: SitemapEntry[] = [];
  for (const state of INDIA_LOCATIONS.slice(stateFrom, stateTo)) {
    for (const city of state.cities) {
      for (const cat of JOB_CATEGORY_META) {
        entries.push(entry(`/hire/${cat.slug}/${state.slug}/${city.slug}`, 0.7, 'weekly'));
      }
    }
  }
  return entries;
}

// ─── Sitemap 5 — Cost Hub + Ask/Q&A ──────────────────────────────────────────

function buildCostAndAskSitemap(): SitemapEntry[] {
  const entries: SitemapEntry[] = [];
  entries.push(entry('/cost', 0.95, 'weekly'));
  for (const svc of COST_SERVICES) {
    entries.push(entry(`/cost/${svc.slug}`, 0.85, 'weekly'));
  }
  for (const slug of getAskSlugs()) {
    entries.push(entry(`/ask/${slug}`, 0.75, 'monthly'));
  }
  return entries;
}

// ─── Sitemaps 6–7 — Cost Cities ───────────────────────────────────────────────

function buildCostCitiesSitemap(svcFrom: number, svcTo: number): SitemapEntry[] {
  const entries: SitemapEntry[] = [];
  for (const svc of COST_SERVICES.slice(svcFrom, svcTo)) {
    for (const state of INDIA_LOCATIONS) {
      for (const city of state.cities) {
        entries.push(entry(`/cost/${svc.slug}/${city.slug}`, 0.7, 'monthly'));
      }
    }
  }
  return entries;
}
