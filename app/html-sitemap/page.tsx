import type { Metadata } from 'next';
import Link from 'next/link';
import { ChevronRight, Globe, Briefcase, IndianRupee, HelpCircle, FileText, Map, DollarSign } from 'lucide-react';

// ── India
import { JOB_CATEGORY_META, INDIA_LOCATIONS } from '@/lib/seo-data';
import { COST_SERVICES } from '@/lib/cost-data';
import { getAllSlugs as getAskSlugs } from '@/lib/ask-data';

// ── UAE English
import { UAE_JOB_CATEGORY_META, UAE_LOCATIONS } from '@/lib/seo-data-uae';
import { UAE_COST_SERVICES } from '@/lib/cost-data-uae';

// ── UAE Arabic
import { UAE_JOB_CATEGORY_META_AR, UAE_LOCATIONS_AR } from '@/lib/seo-data-uae-ar';
import { UAE_COST_SERVICES_AR } from '@/lib/cost-data-uae-ar';

// ── Singapore
import { SG_JOB_CATEGORY_META, SG_LOCATIONS } from '@/lib/seo-data-sg';
import { SG_COST_SERVICES } from '@/lib/cost-data-sg';

// ── USA
import { USA_JOB_CATEGORY_META, USA_LOCATIONS } from '@/lib/seo-data-usa';
import { USA_COST_SERVICES } from '@/lib/cost-data-usa';

export const metadata: Metadata = {
  title: 'Site Map — Biddaro | Complete Website Structure (India · UAE · Singapore · USA)',
  description:
    'Complete site map of Biddaro — the global construction job marketplace. Browse all hire pages, cost guides, Q&A articles, and more across India, UAE (English & Arabic), Singapore, and USA.',
  alternates: { canonical: 'https://biddaro.com/html-sitemap' },
  robots: { index: true, follow: true },
};

// ─── Page Counts ──────────────────────────────────────────────────────────────

// India
const indiaCities  = INDIA_LOCATIONS.reduce((s, l) => s + l.cities.length, 0);
const indiaStates  = INDIA_LOCATIONS.length;
const indiaCats    = JOB_CATEGORY_META.length;
const indiaHire    = indiaCats * indiaStates + indiaCats + indiaCats * indiaCities;
const indiaCost    = 1 + COST_SERVICES.length + COST_SERVICES.length * indiaCities;
const askTotal     = getAskSlugs().length;
const indiaTotal   = indiaHire + indiaCost + askTotal;

// UAE English
const uaeCities    = UAE_LOCATIONS.reduce((s, e) => s + e.cities.length, 0);
const uaeCats      = UAE_JOB_CATEGORY_META.length;
const uaeHire      = uaeCats * UAE_LOCATIONS.length + uaeCats + uaeCats * uaeCities;
const uaeCost      = 1 + UAE_COST_SERVICES.length + UAE_COST_SERVICES.length * uaeCities;
const uaeTotal     = uaeHire + uaeCost;

// UAE Arabic
const uaeArCities  = UAE_LOCATIONS_AR.reduce((s, e) => s + e.cities.length, 0);
const uaeArCats    = UAE_JOB_CATEGORY_META_AR.length;
const uaeArHire    = uaeArCats * UAE_LOCATIONS_AR.length + uaeArCats + uaeArCats * uaeArCities;
const uaeArCost    = 1 + UAE_COST_SERVICES_AR.length + UAE_COST_SERVICES_AR.length * uaeArCities;
const uaeArTotal   = uaeArHire + uaeArCost;

// Singapore
const sgDistricts  = SG_LOCATIONS.reduce((s, r) => s + r.districts.length, 0);
const sgCats       = SG_JOB_CATEGORY_META.length;
const sgHire       = sgCats * SG_LOCATIONS.length + sgCats + sgCats * sgDistricts;
const sgCost       = 1 + SG_COST_SERVICES.length + SG_COST_SERVICES.length * sgDistricts;
const sgTotal      = sgHire + sgCost;

// USA
const usaCities    = USA_LOCATIONS.reduce((s, st) => s + st.cities.length, 0);
const usaCats      = USA_JOB_CATEGORY_META.length;
const usaHire      = usaCats * USA_LOCATIONS.length + usaCats + usaCats * usaCities;
const usaCost      = 1 + USA_COST_SERVICES.length + USA_COST_SERVICES.length * usaCities;
const usaTotal     = usaHire + usaCost;

// Core
const corePages    = 15;

const grandTotal   = corePages + indiaTotal + uaeTotal + uaeArTotal + sgTotal + usaTotal;

// ─── XML Sitemaps registry ─────────────────────────────────────────────────────

const XML_SITEMAPS = [
  { id: 0,  label: '🌐 Static & Core Pages (all countries)',       url: '/sitemap/0',  count: corePages + 10 },
  { id: 1,  label: '🇮🇳 India — Hire Hub: Categories & States',    url: '/sitemap/1',  count: indiaCats + indiaCats * indiaStates },
  { id: 2,  label: '🇮🇳 India — Hire Cities (States 01–11)',       url: '/sitemap/2',  count: '~2,360' },
  { id: 3,  label: '🇮🇳 India — Hire Cities (States 12–21)',       url: '/sitemap/3',  count: '~2,160' },
  { id: 4,  label: '🇮🇳 India — Hire Cities (States 22–31)',       url: '/sitemap/4',  count: '~2,180' },
  { id: 5,  label: '🇮🇳 India — Cost Guides + Ask Q&A',           url: '/sitemap/5',  count: 1 + COST_SERVICES.length + askTotal },
  { id: 6,  label: '🇮🇳 India — Cost by City (Services 1–4)',     url: '/sitemap/6',  count: 4 * indiaCities },
  { id: 7,  label: '🇮🇳 India — Cost by City (Services 5+)',      url: '/sitemap/7',  count: (COST_SERVICES.length - 4) * indiaCities },
  { id: 8,  label: '🇦🇪 UAE EN — Hire Hub & Emirates',            url: '/sitemap/8',  count: uaeCats + uaeCats * UAE_LOCATIONS.length },
  { id: 9,  label: '🇦🇪 UAE EN — Hire Cities',                    url: '/sitemap/9',  count: uaeCats * uaeCities },
  { id: 10, label: '🇦🇪 UAE EN — Cost Guides & Cities',           url: '/sitemap/10', count: 1 + UAE_COST_SERVICES.length + UAE_COST_SERVICES.length * uaeCities },
  { id: 11, label: '🇸🇬 Singapore — Hire Hub & Regions',          url: '/sitemap/11', count: sgCats + sgCats * SG_LOCATIONS.length },
  { id: 12, label: '🇸🇬 Singapore — Hire Districts',              url: '/sitemap/12', count: sgCats * sgDistricts },
  { id: 13, label: '🇸🇬 Singapore — Cost Guides & Districts',     url: '/sitemap/13', count: 1 + SG_COST_SERVICES.length + SG_COST_SERVICES.length * sgDistricts },
  { id: 14, label: '🇺🇸 USA — Hire Hub & States',                 url: '/sitemap/14', count: usaCats + usaCats * USA_LOCATIONS.length },
  { id: 15, label: '🇺🇸 USA — Hire Cities',                       url: '/sitemap/15', count: usaCats * usaCities },
  { id: 16, label: '🇺🇸 USA — Cost Guides & Cities',              url: '/sitemap/16', count: 1 + USA_COST_SERVICES.length + USA_COST_SERVICES.length * usaCities },
  { id: 17, label: '🇦🇪 UAE AR — Arabic Hire Hub & Emirates',     url: '/sitemap/17', count: uaeArCats + uaeArCats * UAE_LOCATIONS_AR.length },
  { id: 18, label: '🇦🇪 UAE AR — Arabic Hire Cities & Cost',      url: '/sitemap/18', count: uaeArCats * uaeArCities + 1 + UAE_COST_SERVICES_AR.length + UAE_COST_SERVICES_AR.length * uaeArCities },
];

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function HtmlSitemapPage() {
  const askSlugs = getAskSlugs();

  return (
    <div className="min-h-screen bg-gray-50">

      {/* ── Header ── */}
      <div className="bg-gradient-to-br from-dark-900 via-dark-800 to-brand-900 py-14 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center gap-2 text-brand-300 text-sm mb-3">
            <Link href="/" className="hover:text-white transition-colors">Home</Link>
            <ChevronRight className="w-3.5 h-3.5" />
            <span>Site Map</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-3">Biddaro Site Map</h1>
          <p className="text-dark-300 text-lg max-w-2xl">
            Complete structure of every page on Biddaro — India, UAE (English &amp; Arabic), Singapore, and USA.
          </p>

          {/* Stats bar */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-8">
            {[
              { label: 'Total Pages',    value: grandTotal.toLocaleString() },
              { label: 'Countries',      value: '4' },
              { label: 'Languages',      value: '2 (EN + AR)' },
              { label: 'XML Sitemaps',   value: XML_SITEMAPS.length.toString() },
            ].map(s => (
              <div key={s.label} className="bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-center">
                <p className="text-2xl font-bold text-white">{s.value}</p>
                <p className="text-xs text-dark-300 mt-0.5">{s.label}</p>
              </div>
            ))}
          </div>

          {/* Country page breakdown */}
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 mt-4">
            {[
              { flag: '🇮🇳', label: 'India', count: indiaTotal },
              { flag: '🇦🇪', label: 'UAE (EN)', count: uaeTotal },
              { flag: '🇦🇪', label: 'UAE (AR)', count: uaeArTotal },
              { flag: '🇸🇬', label: 'Singapore', count: sgTotal },
              { flag: '🇺🇸', label: 'USA', count: usaTotal },
            ].map(c => (
              <div key={c.label} className="bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-center">
                <p className="text-lg">{c.flag}</p>
                <p className="text-sm font-bold text-white">{c.count.toLocaleString()}</p>
                <p className="text-xs text-dark-400">{c.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-12 space-y-14">

        {/* ── XML Sitemaps ── */}
        <section>
          <SectionTitle icon={<Globe className="w-5 h-5 text-blue-500" />}
            title="XML Sitemaps"
            subtitle={`${XML_SITEMAPS.length} child sitemaps — submit /sitemap.xml to Google Search Console`} />
          <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm">
            {/* Index row */}
            <div className="flex items-center justify-between gap-4 px-6 py-4 bg-brand-50 border-b border-brand-100">
              <div className="flex items-center gap-3">
                <span className="text-xs font-bold bg-brand-500 text-white px-2 py-0.5 rounded-full">INDEX</span>
                <span className="font-semibold text-dark-800">Sitemap Index</span>
                <span className="text-xs text-dark-500 font-mono">/sitemap.xml</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-xs text-green-600 font-semibold bg-green-50 border border-green-200 px-2 py-0.5 rounded-full">Submit to GSC</span>
                <a href="/sitemap.xml" target="_blank" rel="noopener noreferrer"
                  className="text-xs text-brand-600 hover:text-brand-700 font-medium underline underline-offset-2">View →</a>
              </div>
            </div>
            <div className="divide-y divide-gray-100">
              {XML_SITEMAPS.map(sm => (
                <div key={sm.id} className="flex items-center justify-between gap-4 px-6 py-3 hover:bg-gray-50 transition-colors">
                  <div className="flex items-center gap-3 min-w-0">
                    <span className="text-xs font-mono text-dark-400 w-5 flex-shrink-0">{sm.id}</span>
                    <span className="text-sm text-dark-700 font-medium truncate">{sm.label}</span>
                  </div>
                  <div className="flex items-center gap-4 flex-shrink-0">
                    <span className="text-xs text-dark-400 font-mono hidden sm:block">{sm.url}</span>
                    <span className="text-xs text-dark-500 bg-gray-100 px-2 py-0.5 rounded-full font-medium">
                      {typeof sm.count === 'number' ? sm.count.toLocaleString() : sm.count} URLs
                    </span>
                    <a href={sm.url} target="_blank" rel="noopener noreferrer"
                      className="text-xs text-brand-600 hover:text-brand-700 font-medium">View →</a>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── 🇮🇳 India Hire ── */}
        <section>
          <SectionTitle icon={<Briefcase className="w-5 h-5 text-brand-500" />}
            title="🇮🇳 India — Construction Job Marketplace"
            subtitle={`${indiaHire.toLocaleString()} hire pages · ${indiaStates} states · ${indiaCities} cities`} />
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <CountryCard title={`Categories (${indiaCats})`}>
              {JOB_CATEGORY_META.map(cat => (
                <CardRow key={cat.slug} href={`/hire/${cat.slug}`} emoji={cat.emoji} label={cat.name}
                  meta={`${indiaStates} states · ${indiaCities} cities`} />
              ))}
            </CountryCard>
            <CountryCard title={`States (${indiaStates})`} scrollable>
              {INDIA_LOCATIONS.map(state => (
                <CardRow key={state.slug} href={`/hire/general-construction/${state.slug}`}
                  label={state.name} meta={`${state.cities.length} cities`} />
              ))}
            </CountryCard>
          </div>
          {/* Top India cities */}
          <div className="mt-4 bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm">
            <div className="px-5 py-4 border-b border-gray-100 bg-gray-50">
              <h3 className="font-semibold text-dark-800 text-sm">Top Indian Cities <span className="text-dark-400 font-normal">({indiaCities} total · showing 40)</span></h3>
            </div>
            <div className="p-5 grid grid-cols-2 sm:grid-cols-4 md:grid-cols-5 gap-2">
              {INDIA_LOCATIONS.flatMap(s => s.cities.slice(0, 2)).slice(0, 40).map(city => {
                const stateSlug = INDIA_LOCATIONS.find(s => s.cities.some(c => c.slug === city.slug))?.slug;
                return (
                  <Link key={city.slug} href={`/hire/general-construction/${stateSlug}/${city.slug}`}
                    className="text-xs text-brand-600 hover:text-brand-800 hover:underline font-medium py-1">
                    {city.name}
                  </Link>
                );
              })}
            </div>
          </div>
        </section>

        {/* ── 🇮🇳 India Cost ── */}
        <section>
          <SectionTitle icon={<IndianRupee className="w-5 h-5 text-green-500" />}
            title="🇮🇳 India — Construction Cost Guides"
            subtitle={`${indiaCost.toLocaleString()} pages — /cost/[service]/[city]`} />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <CountryCard title={`Cost Services (${COST_SERVICES.length})`}>
              {COST_SERVICES.map(svc => (
                <CardRow key={svc.slug} href={`/cost/${svc.slug}`} emoji={svc.emoji} label={svc.name}
                  meta={`${svc.avgLow}–${svc.avgHigh} ${svc.avgUnit}`} />
              ))}
            </CountryCard>
            <CountryCard title={`Sample: Construction Cost by City (${indiaCities} total)`}>
              {INDIA_LOCATIONS.flatMap(s => s.cities.slice(0, 2)).slice(0, 20).map(city => (
                <CardRow key={city.slug} href={`/cost/general-construction/${city.slug}`}
                  label={`Construction Cost in ${city.name}`} />
              ))}
            </CountryCard>
          </div>
        </section>

        {/* ── 🇦🇪 UAE English ── */}
        <section>
          <SectionTitle icon={<Briefcase className="w-5 h-5 text-amber-500" />}
            title="🇦🇪 UAE — English Hire & Cost Pages"
            subtitle={`${uaeTotal.toLocaleString()} pages · ${UAE_LOCATIONS.length} emirates · ${uaeCities} areas`} />
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <CountryCard title={`UAE Hire Categories (${uaeCats})`}>
              {UAE_JOB_CATEGORY_META.map(cat => (
                <CardRow key={cat.slug} href={`/uae/hire/${cat.slug}`} emoji={cat.emoji} label={cat.name}
                  meta={`${UAE_LOCATIONS.length} emirates`} />
              ))}
            </CountryCard>
            <CountryCard title={`Emirates (${UAE_LOCATIONS.length})`}>
              {UAE_LOCATIONS.map(em => (
                <CardRow key={em.slug} href={`/uae/hire/general-contractor/${em.slug}`}
                  label={em.name} meta={`${em.cities.length} areas`} />
              ))}
            </CountryCard>
          </div>
          <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-6">
            <CountryCard title={`UAE Cost Services (${UAE_COST_SERVICES.length})`}>
              {UAE_COST_SERVICES.map(svc => (
                <CardRow key={svc.slug} href={`/uae/cost/${svc.slug}`} emoji={svc.emoji} label={svc.name}
                  meta={`${svc.avgLow}–${svc.avgHigh} ${svc.avgUnit}`} />
              ))}
            </CountryCard>
            <CountryCard title={`UAE Top Cities (showing 14 of ${uaeCities})`}>
              {UAE_LOCATIONS.flatMap(e => e.cities.slice(0, 2)).map(city => (
                <CardRow key={city.slug} href={`/uae/cost/general-construction/${city.slug}`}
                  label={`Construction Cost in ${city.name}`} />
              ))}
            </CountryCard>
          </div>
        </section>

        {/* ── 🇦🇪 UAE Arabic ── */}
        <section>
          <SectionTitle icon={<Briefcase className="w-5 h-5 text-green-600" />}
            title="🇦🇪 UAE — Arabic Hire & Cost Pages (العربية)"
            subtitle={`${uaeArTotal.toLocaleString()} Arabic pages · RTL · hreflang ar-AE · /uae/ar/hire & /uae/ar/cost`} />
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <CountryCard title={`Arabic Job Categories (${uaeArCats}) — عربي`}>
              {UAE_JOB_CATEGORY_META_AR.map(cat => (
                <CardRow key={cat.slug} href={`/uae/ar/hire/${cat.slug}`} emoji={cat.emoji} label={cat.name}
                  meta={`${UAE_LOCATIONS_AR.length} إمارات`} />
              ))}
            </CountryCard>
            <CountryCard title={`Emirates in Arabic (${UAE_LOCATIONS_AR.length})`}>
              {UAE_LOCATIONS_AR.map(em => (
                <CardRow key={em.slug} href={`/uae/ar/hire/general-contractor/${em.slug}`}
                  label={em.name} meta={`${em.cities.length} منطقة`} />
              ))}
            </CountryCard>
          </div>
          <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-6">
            <CountryCard title={`Arabic Cost Services (${UAE_COST_SERVICES_AR.length})`}>
              {UAE_COST_SERVICES_AR.map(svc => (
                <CardRow key={svc.slug} href={`/uae/ar/cost/${svc.slug}`} emoji={svc.emoji} label={svc.name}
                  meta={`${svc.avgLow}–${svc.avgHigh} ${svc.avgUnit}`} />
              ))}
            </CountryCard>
            <CountryCard title="Arabic Hub Pages">
              {[
                { href: '/uae/ar/hire', label: 'UAE Arabic Hire Hub — ابحث عن مقاولين' },
                { href: '/uae/ar/cost', label: 'UAE Arabic Cost Hub — دليل الأسعار' },
              ].map(p => (
                <CardRow key={p.href} href={p.href} label={p.label} />
              ))}
              <div className="px-5 py-3 bg-green-50 rounded-lg mt-2">
                <p className="text-xs text-green-700 font-medium">✓ All Arabic pages include hreflang ar-AE ↔ en-AE</p>
                <p className="text-xs text-green-600 mt-0.5">✓ RTL layout with Noto Naskh Arabic font</p>
                <p className="text-xs text-green-600 mt-0.5">✓ JSON-LD BreadcrumbList + Service + FAQPage</p>
              </div>
            </CountryCard>
          </div>
        </section>

        {/* ── 🇸🇬 Singapore ── */}
        <section>
          <SectionTitle icon={<Briefcase className="w-5 h-5 text-red-500" />}
            title="🇸🇬 Singapore — Hire & Cost Pages"
            subtitle={`${sgTotal.toLocaleString()} pages · ${SG_LOCATIONS.length} regions · ${sgDistricts} districts`} />
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <CountryCard title={`SG Hire Categories (${sgCats})`}>
              {SG_JOB_CATEGORY_META.map(cat => (
                <CardRow key={cat.slug} href={`/sg/hire/${cat.slug}`} emoji={cat.emoji} label={cat.name}
                  meta={`${SG_LOCATIONS.length} regions`} />
              ))}
            </CountryCard>
            <CountryCard title={`Regions (${SG_LOCATIONS.length})`}>
              {SG_LOCATIONS.map(region => (
                <CardRow key={region.slug} href={`/sg/hire/general-contractor/${region.slug}`}
                  label={region.name} meta={`${region.districts.length} districts`} />
              ))}
            </CountryCard>
          </div>
          <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-6">
            <CountryCard title={`SG Cost Services (${SG_COST_SERVICES.length})`}>
              {SG_COST_SERVICES.map(svc => (
                <CardRow key={svc.slug} href={`/sg/cost/${svc.slug}`} emoji={svc.emoji} label={svc.name}
                  meta={`${svc.avgLow}–${svc.avgHigh} ${svc.avgUnit}`} />
              ))}
            </CountryCard>
            <CountryCard title={`SG Districts (${sgDistricts} total · showing 14)`}>
              {SG_LOCATIONS.flatMap(r => r.districts.slice(0, 3)).slice(0, 14).map(d => (
                <CardRow key={d.slug} href={`/sg/cost/general-construction/${d.slug}`}
                  label={`Construction Cost in ${d.name}`} />
              ))}
            </CountryCard>
          </div>
        </section>

        {/* ── 🇺🇸 USA ── */}
        <section>
          <SectionTitle icon={<DollarSign className="w-5 h-5 text-blue-600" />}
            title="🇺🇸 USA — Hire & Cost Pages"
            subtitle={`${usaTotal.toLocaleString()} pages · ${USA_LOCATIONS.length} states · ${usaCities} cities`} />
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <CountryCard title={`USA Hire Categories (${usaCats})`}>
              {USA_JOB_CATEGORY_META.map(cat => (
                <CardRow key={cat.slug} href={`/us/hire/${cat.slug}`} emoji={cat.emoji} label={cat.name}
                  meta={`${USA_LOCATIONS.length} states`} />
              ))}
            </CountryCard>
            <CountryCard title={`States (${USA_LOCATIONS.length}) · showing all`} scrollable>
              {USA_LOCATIONS.map(state => (
                <CardRow key={state.slug} href={`/us/hire/general-contractor/${state.slug}`}
                  label={state.name} meta={`${state.cities.length} cities`} />
              ))}
            </CountryCard>
          </div>
          <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-6">
            <CountryCard title={`USA Cost Services (${USA_COST_SERVICES.length})`}>
              {USA_COST_SERVICES.map(svc => (
                <CardRow key={svc.slug} href={`/us/cost/${svc.slug}`} emoji={svc.emoji} label={svc.name}
                  meta={`${svc.avgLow}–${svc.avgHigh} ${svc.avgUnit}`} />
              ))}
            </CountryCard>
            <CountryCard title={`USA Cities (${usaCities} total · showing 20)`}>
              {USA_LOCATIONS.flatMap(st => st.cities.slice(0, 1)).slice(0, 20).map(city => (
                <CardRow key={city.slug} href={`/us/cost/general-construction/${city.slug}`}
                  label={`Construction Cost in ${city.name}`} />
              ))}
            </CountryCard>
          </div>
        </section>

        {/* ── Ask / Q&A ── */}
        <section>
          <SectionTitle icon={<HelpCircle className="w-5 h-5 text-purple-500" />}
            title="Ask & Learn — Q&A Guides"
            subtitle={`${askSlugs.length} articles — /ask/[slug]`} />
          <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm">
            <div className="px-5 py-4 border-b border-gray-100 bg-gray-50 flex items-center justify-between">
              <h3 className="font-semibold text-dark-800 text-sm">All Q&amp;A Articles</h3>
              <Link href="/ask" className="text-xs text-brand-600 hover:text-brand-700 font-semibold">Browse All →</Link>
            </div>
            <div className="p-5 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
              {askSlugs.map(slug => (
                <Link key={slug} href={`/ask/${slug}`}
                  className="text-xs text-dark-600 hover:text-brand-600 hover:underline py-0.5 capitalize transition-colors">
                  {slug.replace(/-/g, ' ')}
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* ── Core Pages ── */}
        <section>
          <SectionTitle icon={<FileText className="w-5 h-5 text-orange-500" />}
            title="Core Pages"
            subtitle="Static pages — homepage, auth, legal, country hubs" />
          <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm">
            <div className="p-5 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
              {[
                { href: '/',               label: 'Home',                   badge: 'priority 1.0' },
                { href: '/hire',           label: 'Hire Contractors (India)', badge: 'priority 0.95' },
                { href: '/cost',           label: 'Cost Guides (India)',      badge: 'priority 0.95' },
                { href: '/ask',            label: 'Ask & Learn Hub',          badge: 'priority 0.9' },
                { href: '/open-jobs',      label: 'Open Jobs',               badge: 'live feed' },
                { href: '/uae/hire',       label: '🇦🇪 UAE Hire (English)',    badge: 'priority 0.9' },
                { href: '/uae/cost',       label: '🇦🇪 UAE Cost (English)',    badge: 'priority 0.9' },
                { href: '/uae/ar/hire',    label: '🇦🇪 UAE Hire (العربية)',    badge: 'priority 0.9' },
                { href: '/uae/ar/cost',    label: '🇦🇪 UAE Cost (العربية)',    badge: 'priority 0.9' },
                { href: '/sg/hire',        label: '🇸🇬 Singapore Hire',        badge: 'priority 0.9' },
                { href: '/sg/cost',        label: '🇸🇬 Singapore Cost',        badge: 'priority 0.9' },
                { href: '/us/hire',        label: '🇺🇸 USA Hire',              badge: 'priority 0.9' },
                { href: '/us/cost',        label: '🇺🇸 USA Cost',              badge: 'priority 0.9' },
                { href: '/register',       label: 'Register',                badge: '' },
                { href: '/login',          label: 'Login',                   badge: '' },
                { href: '/about',          label: 'About Biddaro',           badge: '' },
                { href: '/pricing',        label: 'Pricing',                 badge: '' },
                { href: '/contact',        label: 'Contact',                 badge: '' },
                { href: '/html-sitemap',   label: 'HTML Sitemap',            badge: 'this page' },
                { href: '/privacy-policy', label: 'Privacy Policy',          badge: 'legal' },
                { href: '/terms',          label: 'Terms of Service',        badge: 'legal' },
              ].map(p => (
                <div key={p.href} className="flex items-center justify-between py-1.5">
                  <Link href={p.href} className="text-sm text-dark-700 hover:text-brand-600 font-medium transition-colors">
                    {p.label}
                  </Link>
                  {p.badge && (
                    <span className="text-xs text-dark-400 bg-gray-100 px-1.5 py-0.5 rounded-full">{p.badge}</span>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Footer ── */}
        <div className="flex items-center gap-2 text-sm text-dark-400 border-t border-gray-200 pt-8 pb-4">
          <Map className="w-4 h-4 flex-shrink-0" />
          <p>
            Sitemap last updated:{' '}
            {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}.
            &nbsp;Total indexed pages: <strong className="text-dark-600">{grandTotal.toLocaleString()}</strong>.
            &nbsp;Countries: India · UAE (EN + AR) · Singapore · USA.
            &nbsp;
            <a href="/sitemap.xml" className="text-brand-600 hover:underline font-medium">View XML Sitemap →</a>
          </p>
        </div>

      </div>
    </div>
  );
}

// ─── Shared UI Components ─────────────────────────────────────────────────────

function SectionTitle({ icon, title, subtitle }: { icon: React.ReactNode; title: string; subtitle: string }) {
  return (
    <div className="flex items-start gap-3 mb-4">
      <div className="mt-0.5 w-9 h-9 rounded-xl bg-white border border-gray-200 shadow-sm flex items-center justify-center flex-shrink-0">
        {icon}
      </div>
      <div>
        <h2 className="text-lg font-bold text-dark-900">{title}</h2>
        <p className="text-sm text-dark-500 mt-0.5">{subtitle}</p>
      </div>
    </div>
  );
}

function CountryCard({ title, children, scrollable }: { title: string; children: React.ReactNode; scrollable?: boolean }) {
  return (
    <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm">
      <div className="px-5 py-4 border-b border-gray-100 bg-gray-50">
        <h3 className="font-semibold text-dark-800 text-sm">{title}</h3>
      </div>
      <ul className={`divide-y divide-gray-50 ${scrollable ? 'max-h-96 overflow-y-auto' : ''}`}>
        {children}
      </ul>
    </div>
  );
}

function CardRow({ href, emoji, label, meta }: { href: string; emoji?: string; label: string; meta?: string }) {
  return (
    <li className="flex items-center justify-between px-5 py-2.5 hover:bg-gray-50 transition-colors">
      <div className="flex items-center gap-2 min-w-0">
        {emoji && <span className="text-base flex-shrink-0">{emoji}</span>}
        <Link href={href} className="text-sm text-dark-700 hover:text-brand-600 font-medium transition-colors truncate">
          {label}
        </Link>
      </div>
      {meta && <span className="text-xs text-dark-400 flex-shrink-0 ml-2">{meta}</span>}
    </li>
  );
}
