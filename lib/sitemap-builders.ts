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
 *   ID   Path            Contents                              ~URLs
 *   ──   ──────────────  ────────────────────────────────────  ──────
 *    0   /sitemap/0      Static & core pages                      15
 *    1   /sitemap/1      /hire/[cat] + /hire/[cat]/[state]       640
 *    2   /sitemap/2      /hire cities — states  0–10           2,360
 *    3   /sitemap/3      /hire cities — states 11–20           2,160
 *    4   /sitemap/4      /hire cities — states 21–end          2,180
 *    5   /sitemap/5      /cost + /cost/[svc] + /ask/[slug]        83
 *    6   /sitemap/6      /cost/[svc]/[city] — services 0–3     1,340
 *    7   /sitemap/7      /cost/[svc]/[city] — services 4–end   1,005
 *    8   /sitemap/8      /uae/hire hub + categories + states     150
 *    9   /sitemap/9      /uae/hire cities (all)                  600
 *   10   /sitemap/10     /uae/cost hub + services + cities       530
 *   11   /sitemap/11     /sg/hire hub + categories + regions     530
 *   12   /sitemap/12     /sg/hire cities (all)                   480
 *   13   /sitemap/13     /sg/cost hub + services + cities        420
 *   14   /sitemap/14     /us/hire hub + categories + states      500
 *   15   /sitemap/15     /us/hire cities (all)                 3,000
 *   16   /sitemap/16     /us/cost hub + services + cities      1,600
 *   27   /sitemap/27     /erp core feature pages                  10
 *   28   /sitemap/28     /erp/vs comparison pages                   5
 *   29   /sitemap/29     /erp/for segment pages                     6
 *   30   /sitemap/30     /erp/india/[city] pages                   20
 *   31   /sitemap/31     /erp/faq topic pages                      15
 *   32   /sitemap/32     /biddaro-inspect hub + regional hubs        8
 *   33   /sitemap/33     /biddaro-inspect/features/[slug]            6
 *   34   /sitemap/34     /biddaro-inspect/for/[segment]              7
 *   35   /sitemap/35     /biddaro-inspect/vs/[competitor]            5
 *   36   /sitemap/36     /biddaro-inspect/templates/[slug]          20
 *   37   /sitemap/37     /biddaro-inspect/india/[city]              20
 *   ──   ──────────────  ────────────────────────────────────  ──────
 *                                              TOTAL:        ~13,715
 *
 *  ✅ Submit to Google Search Console: https://biddaro.com/sitemap.xml
 * ─────────────────────────────────────────────────────────────────────────────
 */

import { COST_SERVICES } from '@/lib/cost-data';
import { JOB_CATEGORY_META, INDIA_LOCATIONS } from '@/lib/seo-data';
import { LOAN_TYPES_SEO } from '@/lib/loan-data';
import { LOAN_FAQ_TOPICS } from '@/lib/loan-faq-data';
import { GLOSSARY_TERMS } from '@/lib/loan-glossary-data';
import { LOAN_COMPARISONS } from '@/lib/loan-compare-data';
import { getAllSlugs as getAskSlugs } from '@/lib/ask-data';
import { UAE_LOCATIONS, UAE_JOB_CATEGORY_META } from '@/lib/seo-data-uae';
import { UAE_COST_SERVICES } from '@/lib/cost-data-uae';
import { UAE_LOCATIONS_AR, UAE_JOB_CATEGORY_META_AR } from '@/lib/seo-data-uae-ar';
import { UAE_COST_SERVICES_AR } from '@/lib/cost-data-uae-ar';
import { SG_LOCATIONS, SG_JOB_CATEGORY_META } from '@/lib/seo-data-sg';
import { SG_COST_SERVICES } from '@/lib/cost-data-sg';
import { USA_LOCATIONS, USA_JOB_CATEGORY_META } from '@/lib/seo-data-usa';
import { USA_COST_SERVICES } from '@/lib/cost-data-usa';
import { ERP_FEATURES, ERP_COMPARISONS, ERP_SEGMENTS, ERP_FAQ_TOPICS, ERP_INDIA_CITIES } from '@/lib/erp-seo-data';
import {
  INSPECT_FEATURES,
  INSPECT_INDUSTRIES,
  INSPECT_COMPETITORS,
  INSPECT_TEMPLATES,
  INSPECT_INDIA_CITIES,
  getAllInspectFeatureSlugs,
  getAllInspectIndustrySlugs,
} from '@/lib/inspect-seo-data';

export const SITEMAP_BASE = 'https://biddaro.com';
export const SITEMAP_IDS  = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39] as const;

export interface SitemapEntry {
  url: string;
  lastModified: string;
  changeFrequency: string;
  priority: number;
}

// ─── Router ───────────────────────────────────────────────────────────────────

export function buildSitemap(id: number): SitemapEntry[] {
  switch (id) {
    case 0:  return buildStaticSitemap();
    case 1:  return buildHireHubSitemap();
    case 2:  return buildHireCitiesSitemap(0,  11);
    case 3:  return buildHireCitiesSitemap(11, 21);
    case 4:  return buildHireCitiesSitemap(21, INDIA_LOCATIONS.length);
    case 5:  return buildCostAndAskSitemap();
    case 6:  return buildCostCitiesSitemap(0, 4);
    case 7:  return buildCostCitiesSitemap(4, COST_SERVICES.length);
    case 8:  return buildUAEHireHubSitemap();
    case 9:  return buildUAEHireCitiesSitemap();
    case 10: return buildUAECostSitemap();
    case 11: return buildSGHireHubSitemap();
    case 12: return buildSGHireCitiesSitemap();
    case 13: return buildSGCostSitemap();
    case 14: return buildUSHireHubSitemap();
    case 15: return buildUSHireCitiesSitemap();
    case 16: return buildUSCostSitemap();
    case 17: return buildUAEArHireSitemap();
    case 18: return buildUAEArCostSitemap();
    case 19: return buildLoanHubSitemap();
    case 20: return buildLoanCitiesSitemap(0, 3);
    case 21: return buildLoanCitiesSitemap(3, LOAN_TYPES_SEO.length);
    case 22: return buildLoanFaqSitemap();
    case 23: return buildLoanGlossarySitemap();
    case 24: return buildLoanStateHubSitemap(0, 3);
    case 25: return buildLoanStateHubSitemap(3, LOAN_TYPES_SEO.length);
    case 26: return buildLoanCompareSitemap();
    // ERP sitemaps
    case 27: return buildErpCoreSitemap();
    case 28: return buildErpComparisonsSitemap();
    case 29: return buildErpSegmentsSitemap();
    case 30: return buildErpIndiaCitiesSitemap();
    case 31: return buildErpFaqSitemap();
    // Inspect AI sitemaps
    case 32: return buildInspectCoreSitemap();
    case 33: return buildInspectFeaturesSitemap();
    case 34: return buildInspectIndustriesSitemap();
    case 35: return buildInspectVsSitemap();
    case 36: return buildInspectTemplatesSitemap();
    case 37: return buildInspectCitiesSitemap();

    // ── Loan programmatic expansion ──
    case 38: return buildLoanCityHubSitemap();
    case 39: return buildLoanExtrasSitemap();
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
    entry('/premium',        0.85, 'monthly'),
    // ERP hub pages
    entry('/erp',            1.0,  'weekly'),
    entry('/erp/pricing',    0.9,  'monthly'),
    entry('/erp/vs',         0.85, 'monthly'),
    entry('/erp/for',        0.85, 'monthly'),
    entry('/erp/faq',        0.85, 'monthly'),
    entry('/erp/india',      0.9,  'weekly'),
    // Biddaro Inspect — AI inspection reports
    entry('/biddaro-inspect', 1.0,  'weekly'),
    entry('/contact',        0.6,  'monthly'),
    entry('/html-sitemap',   0.5,  'monthly'),
    entry('/privacy-policy', 0.3,  'yearly'),
    entry('/terms',          0.3,  'yearly'),
    // Country hubs — English
    entry('/uae/hire',       0.9,  'daily'),
    entry('/uae/cost',       0.9,  'weekly'),
    entry('/sg/hire',        0.9,  'daily'),
    entry('/sg/cost',        0.9,  'weekly'),
    entry('/us/hire',        0.9,  'daily'),
    entry('/us/cost',        0.9,  'weekly'),
    // UAE Arabic hubs
    entry('/uae/ar/hire',    0.9,  'daily'),
    entry('/uae/ar/cost',    0.9,  'weekly'),
    // Sitemap page
    entry('/html-sitemap',   0.5,  'monthly'),
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

// ─── Sitemap 8 — UAE Hire Hub ─────────────────────────────────────────────────

function buildUAEHireHubSitemap(): SitemapEntry[] {
  const entries: SitemapEntry[] = [];
  for (const cat of UAE_JOB_CATEGORY_META) {
    entries.push(entry(`/uae/hire/${cat.slug}`, 0.85, 'weekly'));
    for (const emirate of UAE_LOCATIONS) {
      entries.push(entry(`/uae/hire/${cat.slug}/${emirate.slug}`, 0.75, 'weekly'));
    }
  }
  return entries;
}

// ─── Sitemap 9 — UAE Hire Cities ──────────────────────────────────────────────

function buildUAEHireCitiesSitemap(): SitemapEntry[] {
  const entries: SitemapEntry[] = [];
  for (const emirate of UAE_LOCATIONS) {
    for (const city of emirate.cities) {
      for (const cat of UAE_JOB_CATEGORY_META) {
        entries.push(entry(`/uae/hire/${cat.slug}/${emirate.slug}/${city.slug}`, 0.7, 'weekly'));
      }
    }
  }
  return entries;
}

// ─── Sitemap 10 — UAE Cost ────────────────────────────────────────────────────

function buildUAECostSitemap(): SitemapEntry[] {
  const entries: SitemapEntry[] = [];
  for (const svc of UAE_COST_SERVICES) {
    entries.push(entry(`/uae/cost/${svc.slug}`, 0.85, 'weekly'));
    for (const emirate of UAE_LOCATIONS) {
      for (const city of emirate.cities) {
        entries.push(entry(`/uae/cost/${svc.slug}/${city.slug}`, 0.7, 'monthly'));
      }
    }
  }
  return entries;
}

// ─── Sitemap 11 — SG Hire Hub ─────────────────────────────────────────────────

function buildSGHireHubSitemap(): SitemapEntry[] {
  const entries: SitemapEntry[] = [];
  for (const cat of SG_JOB_CATEGORY_META) {
    entries.push(entry(`/sg/hire/${cat.slug}`, 0.85, 'weekly'));
    for (const region of SG_LOCATIONS) {
      entries.push(entry(`/sg/hire/${cat.slug}/${region.slug}`, 0.75, 'weekly'));
    }
  }
  return entries;
}

// ─── Sitemap 12 — SG Hire Cities ──────────────────────────────────────────────

function buildSGHireCitiesSitemap(): SitemapEntry[] {
  const entries: SitemapEntry[] = [];
  for (const region of SG_LOCATIONS) {
    for (const district of region.districts) {
      for (const cat of SG_JOB_CATEGORY_META) {
        entries.push(entry(`/sg/hire/${cat.slug}/${region.slug}/${district.slug}`, 0.7, 'weekly'));
      }
    }
  }
  return entries;
}

// ─── Sitemap 13 — SG Cost ────────────────────────────────────────────────────

function buildSGCostSitemap(): SitemapEntry[] {
  const entries: SitemapEntry[] = [];
  for (const svc of SG_COST_SERVICES) {
    entries.push(entry(`/sg/cost/${svc.slug}`, 0.85, 'weekly'));
    for (const region of SG_LOCATIONS) {
      for (const district of region.districts) {
        entries.push(entry(`/sg/cost/${svc.slug}/${district.slug}`, 0.7, 'monthly'));
      }
    }
  }
  return entries;
}

// ─── Sitemap 14 — US Hire Hub ─────────────────────────────────────────────────

function buildUSHireHubSitemap(): SitemapEntry[] {
  const entries: SitemapEntry[] = [];
  for (const cat of USA_JOB_CATEGORY_META) {
    entries.push(entry(`/us/hire/${cat.slug}`, 0.85, 'weekly'));
    for (const state of USA_LOCATIONS) {
      entries.push(entry(`/us/hire/${cat.slug}/${state.slug}`, 0.75, 'weekly'));
    }
  }
  return entries;
}

// ─── Sitemap 15 — US Hire Cities ──────────────────────────────────────────────

function buildUSHireCitiesSitemap(): SitemapEntry[] {
  const entries: SitemapEntry[] = [];
  for (const state of USA_LOCATIONS) {
    for (const city of state.cities) {
      for (const cat of USA_JOB_CATEGORY_META) {
        entries.push(entry(`/us/hire/${cat.slug}/${state.slug}/${city.slug}`, 0.7, 'weekly'));
      }
    }
  }
  return entries;
}

// ─── Sitemap 16 — US Cost ────────────────────────────────────────────────────

function buildUSCostSitemap(): SitemapEntry[] {
  const entries: SitemapEntry[] = [];
  for (const svc of USA_COST_SERVICES) {
    entries.push(entry(`/us/cost/${svc.slug}`, 0.85, 'weekly'));
    for (const state of USA_LOCATIONS) {
      for (const city of state.cities) {
        entries.push(entry(`/us/cost/${svc.slug}/${city.slug}`, 0.7, 'monthly'));
      }
    }
  }
  return entries;
}

// ─── Sitemap 17 — UAE Arabic Hire Hub + Emirates ──────────────────────────────

function buildUAEArHireSitemap(): SitemapEntry[] {
  const entries: SitemapEntry[] = [];
  entries.push(entry('/uae/ar/hire', 0.9, 'daily'));
  for (const cat of UAE_JOB_CATEGORY_META_AR) {
    entries.push(entry(`/uae/ar/hire/${cat.slug}`, 0.85, 'weekly'));
    for (const emirate of UAE_LOCATIONS_AR) {
      entries.push(entry(`/uae/ar/hire/${cat.slug}/${emirate.slug}`, 0.75, 'weekly'));
      for (const city of emirate.cities) {
        entries.push(entry(`/uae/ar/hire/${cat.slug}/${emirate.slug}/${city.slug}`, 0.7, 'weekly'));
      }
    }
  }
  return entries;
}

// ─── Sitemaps 19–21 — India Loan Pages ───────────────────────────────────────

function buildLoanHubSitemap(): SitemapEntry[] {
  const entries: SitemapEntry[] = [entry('/loans', 0.9, 'weekly')];
  for (const loan of LOAN_TYPES_SEO) {
    entries.push(entry(`/loans/${loan.slug}`, 0.85, 'weekly'));
  }
  return entries;
}

function buildLoanCitiesSitemap(start: number, end: number): SitemapEntry[] {
  const entries: SitemapEntry[] = [];
  for (const loan of LOAN_TYPES_SEO.slice(start, end)) {
    for (const state of INDIA_LOCATIONS) {
      for (const city of state.cities) {
        entries.push(entry(`/loans/${loan.slug}/${city.slug}`, 0.8, 'monthly'));
      }
    }
  }
  return entries;
}

// ─── Sitemaps 22–25 — Loan FAQ, Glossary, State Hubs ─────────────────────────

function buildLoanFaqSitemap(): SitemapEntry[] {
  const entries: SitemapEntry[] = [entry('/loans/faq', 0.85, 'weekly')];
  for (const topic of LOAN_FAQ_TOPICS) {
    entries.push(entry(`/loans/faq/${topic.slug}`, 0.8, 'monthly'));
  }
  return entries;
}

function buildLoanGlossarySitemap(): SitemapEntry[] {
  const entries: SitemapEntry[] = [
    entry('/loans/glossary', 0.8, 'monthly'),
    entry('/about/rbi-compliance', 0.75, 'monthly'),
  ];
  for (const term of GLOSSARY_TERMS) {
    entries.push(entry(`/loans/glossary/${term.slug}`, 0.7, 'monthly'));
  }
  return entries;
}

function buildLoanStateHubSitemap(start: number, end: number): SitemapEntry[] {
  const entries: SitemapEntry[] = [];
  for (const loan of LOAN_TYPES_SEO.slice(start, end)) {
    for (const state of INDIA_LOCATIONS) {
      entries.push(entry(`/loans/${loan.slug}/state/${state.slug}`, 0.75, 'monthly'));
    }
  }
  return entries;
}

// ─── Sitemap 26 — Loan Comparison Pages ──────────────────────────────────────

function buildLoanCompareSitemap(): SitemapEntry[] {
  const entries: SitemapEntry[] = [entry('/loans/compare', 0.85, 'weekly')];
  for (const cmp of LOAN_COMPARISONS) {
    entries.push(entry(`/loans/compare/${cmp.slug}`, 0.8, 'monthly'));
  }
  return entries;
}

// ─── Sitemap 38 — Cross-type City Loan Hubs (/loans/city/[city]) ─────────────

function buildLoanCityHubSitemap(): SitemapEntry[] {
  const entries: SitemapEntry[] = [];
  for (const state of INDIA_LOCATIONS) {
    for (const city of state.cities) {
      entries.push(entry(`/loans/city/${city.slug}`, 0.8, 'monthly'));
    }
  }
  return entries;
}

// ─── Sitemap 39 — Loan extras: state hubs, calculators, per-type templates ───

function buildLoanExtrasSitemap(): SitemapEntry[] {
  const entries: SitemapEntry[] = [
    entry('/loans/emi-calculator', 0.85, 'monthly'),
    entry('/loans/eligibility-calculator', 0.85, 'monthly'),
  ];
  for (const state of INDIA_LOCATIONS) {
    entries.push(entry(`/loans/state/${state.slug}`, 0.8, 'monthly'));
  }
  for (const loan of LOAN_TYPES_SEO) {
    entries.push(entry(`/loans/${loan.slug}/documents`, 0.75, 'monthly'));
    entries.push(entry(`/loans/${loan.slug}/interest-rates`, 0.78, 'monthly'));
  }
  return entries;
}

// ─── Sitemap 18 — UAE Arabic Cost ────────────────────────────────────────────

function buildUAEArCostSitemap(): SitemapEntry[] {
  const entries: SitemapEntry[] = [];
  entries.push(entry('/uae/ar/cost', 0.9, 'weekly'));
  for (const svc of UAE_COST_SERVICES_AR) {
    entries.push(entry(`/uae/ar/cost/${svc.slug}`, 0.85, 'weekly'));
    for (const emirate of UAE_LOCATIONS_AR) {
      for (const city of emirate.cities) {
        entries.push(entry(`/uae/ar/cost/${svc.slug}/${city.slug}`, 0.7, 'monthly'));
      }
    }
  }
  return entries;
}

// ─── Sitemap 27 — ERP Core Pages ─────────────────────────────────────────────

function buildErpCoreSitemap(): SitemapEntry[] {
  const entries: SitemapEntry[] = [];
  // Feature module pages
  for (const feature of ERP_FEATURES) {
    entries.push(entry(`/erp/${feature.slug}`, 0.9, 'monthly'));
  }
  return entries;
}

// ─── Sitemap 28 — ERP Comparison Pages ───────────────────────────────────────

function buildErpComparisonsSitemap(): SitemapEntry[] {
  const entries: SitemapEntry[] = [];
  for (const cmp of ERP_COMPARISONS) {
    entries.push(entry(`/erp/vs/${cmp.slug}`, 0.85, 'monthly'));
  }
  return entries;
}

// ─── Sitemap 29 — ERP Segment / Use-case Pages ───────────────────────────────

function buildErpSegmentsSitemap(): SitemapEntry[] {
  const entries: SitemapEntry[] = [];
  for (const seg of ERP_SEGMENTS) {
    entries.push(entry(`/erp/for/${seg.slug}`, 0.85, 'monthly'));
  }
  return entries;
}

// ─── Sitemap 30 — ERP India City Pages ───────────────────────────────────────

function buildErpIndiaCitiesSitemap(): SitemapEntry[] {
  return ERP_INDIA_CITIES.map((city) =>
    entry(`/erp/india/${city.slug}`, 0.8, 'monthly')
  );
}

// ─── Sitemap 31 — ERP FAQ Topic Pages ────────────────────────────────────────

function buildErpFaqSitemap(): SitemapEntry[] {
  return ERP_FAQ_TOPICS.map((topic) =>
    entry(`/erp/faq/${topic.slug}`, 0.75, 'monthly')
  );
}

// ─── Sitemap 32 — Inspect AI Core / Hub Pages ────────────────────────────────

function buildInspectCoreSitemap(): SitemapEntry[] {
  return [
    entry('/biddaro-inspect',                   1.0,  'weekly'),
    entry('/biddaro-inspect/features',          0.9,  'monthly'),
    entry('/biddaro-inspect/for',               0.9,  'monthly'),
    entry('/biddaro-inspect/vs',                0.9,  'monthly'),
    entry('/biddaro-inspect/templates',         0.9,  'monthly'),
    entry('/biddaro-inspect/india',             0.9,  'weekly'),
    entry('/biddaro-inspect/uae',               0.9,  'weekly'),
    entry('/biddaro-inspect/singapore',         0.9,  'weekly'),
  ];
}

// ─── Sitemap 33 — Inspect Feature Pages ──────────────────────────────────────

function buildInspectFeaturesSitemap(): SitemapEntry[] {
  return getAllInspectFeatureSlugs().map((slug) =>
    entry(`/biddaro-inspect/features/${slug}`, 0.85, 'monthly')
  );
}

// ─── Sitemap 34 — Inspect Industry / Use-case Pages ──────────────────────────

function buildInspectIndustriesSitemap(): SitemapEntry[] {
  return getAllInspectIndustrySlugs().map((slug) =>
    entry(`/biddaro-inspect/for/${slug}`, 0.85, 'monthly')
  );
}

// ─── Sitemap 35 — Inspect vs Competitor Pages ────────────────────────────────

function buildInspectVsSitemap(): SitemapEntry[] {
  return INSPECT_COMPETITORS.map((c) =>
    entry(`/biddaro-inspect/vs/${c.slug}`, 0.85, 'monthly')
  );
}

// ─── Sitemap 36 — Inspect Template Pages ─────────────────────────────────────

function buildInspectTemplatesSitemap(): SitemapEntry[] {
  return INSPECT_TEMPLATES.map((t) =>
    entry(`/biddaro-inspect/templates/${t.slug}`, 0.8, 'monthly')
  );
}

// ─── Sitemap 37 — Inspect India City Pages ───────────────────────────────────

function buildInspectCitiesSitemap(): SitemapEntry[] {
  return INSPECT_INDIA_CITIES.map((city) =>
    entry(`/biddaro-inspect/india/${city.slug}`, 0.8, 'monthly')
  );
}
