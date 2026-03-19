import type { Metadata } from 'next';
import Link from 'next/link';
import { ChevronRight, Globe, Briefcase, IndianRupee, HelpCircle, FileText, Map } from 'lucide-react';
import { JOB_CATEGORY_META, INDIA_LOCATIONS } from '@/lib/seo-data';
import { COST_SERVICES } from '@/lib/cost-data';
import { getAllSlugs as getAskSlugs } from '@/lib/ask-data';

export const metadata: Metadata = {
  title: 'Site Map — Biddaro | Complete Website Structure',
  description: 'Complete site map of Biddaro — India\'s construction job marketplace. Browse all hire pages, cost guides, Q&A articles, and more.',
  alternates: { canonical: 'https://biddaro.com/html-sitemap' },
  robots: { index: true, follow: true },
};

// ─── Stats ────────────────────────────────────────────────────────────────────

const totalCities   = INDIA_LOCATIONS.reduce((sum, s) => sum + s.cities.length, 0);
const totalStates   = INDIA_LOCATIONS.length;
const totalCats     = JOB_CATEGORY_META.length;
const totalHire     = totalCats * totalStates + totalCats + totalCats * totalCities;
const totalCost     = 1 + COST_SERVICES.length + COST_SERVICES.length * totalCities;
const totalAsk      = getAskSlugs().length;
const totalPages    = 14 + totalHire + totalCost + totalAsk;

// ─── XML Sitemaps registry (mirrors app/sitemap.ts) ───────────────────────────

const XML_SITEMAPS = [
  { id: 0, label: 'Static & Core Pages',               url: '/sitemap/0', count: 14 },
  { id: 1, label: 'Hire Hub — Categories & States',    url: '/sitemap/1', count: totalCats + totalCats * totalStates },
  { id: 2, label: 'Hire Cities — States 01–11',        url: '/sitemap/2', count: '~2,360' },
  { id: 3, label: 'Hire Cities — States 12–21',        url: '/sitemap/3', count: '~2,160' },
  { id: 4, label: 'Hire Cities — States 22–31',        url: '/sitemap/4', count: '~2,180' },
  { id: 5, label: 'Cost Guides + Ask / Q&A',           url: '/sitemap/5', count: 1 + COST_SERVICES.length + totalAsk },
  { id: 6, label: 'Cost by City — Services 1–4',       url: '/sitemap/6', count: 4 * totalCities },
  { id: 7, label: 'Cost by City — Services 5–7',       url: '/sitemap/7', count: 3 * totalCities },
];

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
            Complete structure of every page on Biddaro — India&apos;s construction job marketplace.
          </p>

          {/* Stats bar */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-8">
            {[
              { label: 'Total Pages',   value: totalPages.toLocaleString() },
              { label: 'Cities Covered', value: totalCities.toLocaleString() },
              { label: 'States',         value: totalStates.toString() },
              { label: 'Job Categories', value: totalCats.toString() },
            ].map(s => (
              <div key={s.label} className="bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-center">
                <p className="text-2xl font-bold text-white">{s.value}</p>
                <p className="text-xs text-dark-300 mt-0.5">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-12 space-y-14">

        {/* ── XML Sitemaps (for Google) ── */}
        <section>
          <SectionTitle icon={<Globe className="w-5 h-5 text-blue-500" />} title="XML Sitemaps" subtitle="Submit the index to Google Search Console — it auto-discovers all child sitemaps." />
          <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm">
            {/* Index row */}
            <div className="flex items-center justify-between gap-4 px-6 py-4 bg-brand-50 border-b border-brand-100">
              <div className="flex items-center gap-3">
                <span className="text-xs font-bold bg-brand-500 text-white px-2 py-0.5 rounded-full">INDEX</span>
                <span className="font-semibold text-dark-800">Sitemap Index</span>
                <span className="text-xs text-dark-500 font-mono">/sitemap.xml</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-xs text-green-600 font-semibold bg-green-50 border border-green-200 px-2 py-0.5 rounded-full">Submit this to GSC</span>
                <a href="/sitemap.xml" target="_blank" rel="noopener noreferrer"
                  className="text-xs text-brand-600 hover:text-brand-700 font-medium underline underline-offset-2">
                  View →
                </a>
              </div>
            </div>
            {/* Child sitemaps */}
            <div className="divide-y divide-gray-100">
              {XML_SITEMAPS.map(sm => (
                <div key={sm.id} className="flex items-center justify-between gap-4 px-6 py-3.5 hover:bg-gray-50 transition-colors">
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

        {/* ── Hire Pages ── */}
        <section>
          <SectionTitle icon={<Briefcase className="w-5 h-5 text-brand-500" />}
            title="Construction Job Marketplace"
            subtitle={`${totalHire.toLocaleString()} pages — /hire/[category]/[state]/[city]`} />

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

            {/* Browse by Category */}
            <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm">
              <div className="px-5 py-4 border-b border-gray-100 bg-gray-50">
                <h3 className="font-semibold text-dark-800 text-sm">Browse by Category <span className="text-dark-400 font-normal">({totalCats} categories)</span></h3>
              </div>
              <ul className="divide-y divide-gray-50">
                {JOB_CATEGORY_META.map(cat => (
                  <li key={cat.slug} className="flex items-center justify-between px-5 py-2.5 hover:bg-gray-50 transition-colors">
                    <div className="flex items-center gap-2">
                      <span className="text-base">{cat.emoji}</span>
                      <Link href={`/hire/${cat.slug}`} className="text-sm text-dark-700 hover:text-brand-600 font-medium transition-colors">
                        {cat.name}
                      </Link>
                    </div>
                    <span className="text-xs text-dark-400">{totalStates} states · {totalCities} cities</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Browse by State */}
            <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm">
              <div className="px-5 py-4 border-b border-gray-100 bg-gray-50">
                <h3 className="font-semibold text-dark-800 text-sm">Browse by State <span className="text-dark-400 font-normal">({totalStates} states)</span></h3>
              </div>
              <ul className="divide-y divide-gray-50 max-h-96 overflow-y-auto">
                {INDIA_LOCATIONS.map(state => (
                  <li key={state.slug} className="flex items-center justify-between px-5 py-2.5 hover:bg-gray-50 transition-colors">
                    <Link href={`/hire/general-construction/${state.slug}`}
                      className="text-sm text-dark-700 hover:text-brand-600 font-medium transition-colors">
                      {state.name}
                    </Link>
                    <span className="text-xs text-dark-400">{state.cities.length} cities</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Top Cities Grid */}
          <div className="mt-4 bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm">
            <div className="px-5 py-4 border-b border-gray-100 bg-gray-50">
              <h3 className="font-semibold text-dark-800 text-sm">Top Cities
                <span className="text-dark-400 font-normal ml-1">({totalCities} total · showing top 40)</span>
              </h3>
            </div>
            <div className="p-5 grid grid-cols-2 sm:grid-cols-4 md:grid-cols-5 gap-2">
              {INDIA_LOCATIONS.flatMap(s => s.cities.slice(0, 2))
                .slice(0, 40)
                .map(city => (
                  <Link key={city.slug} href={`/hire/general-construction/${INDIA_LOCATIONS.find(s => s.cities.some(c => c.slug === city.slug))?.slug}/${city.slug}`}
                    className="text-xs text-brand-600 hover:text-brand-800 hover:underline font-medium py-1">
                    {city.name}
                  </Link>
                ))}
            </div>
          </div>
        </section>

        {/* ── Cost Guide Pages ── */}
        <section>
          <SectionTitle icon={<IndianRupee className="w-5 h-5 text-green-500" />}
            title="Construction Cost Guides"
            subtitle={`${totalCost.toLocaleString()} pages — /cost/[service]/[city]`} />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

            {/* Services list */}
            <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm">
              <div className="px-5 py-4 border-b border-gray-100 bg-gray-50">
                <h3 className="font-semibold text-dark-800 text-sm">Cost Guide Services <span className="text-dark-400 font-normal">({COST_SERVICES.length} guides)</span></h3>
              </div>
              <ul className="divide-y divide-gray-50">
                {COST_SERVICES.map(svc => (
                  <li key={svc.slug} className="flex items-center justify-between px-5 py-3 hover:bg-gray-50 transition-colors">
                    <div className="flex items-center gap-2.5">
                      <span className="text-lg">{svc.emoji}</span>
                      <div>
                        <Link href={`/cost/${svc.slug}`} className="text-sm text-dark-700 hover:text-brand-600 font-medium transition-colors block">
                          {svc.name}
                        </Link>
                        <span className="text-xs text-dark-400">{svc.avgLow}–{svc.avgHigh} {svc.avgUnit}</span>
                      </div>
                    </div>
                    <span className="text-xs text-dark-400">{totalCities} city pages</span>
                  </li>
                ))}
                <li className="px-5 py-3 bg-gray-50">
                  <Link href="/cost" className="text-sm text-brand-600 hover:text-brand-700 font-semibold">
                    → Cost Guide Hub
                  </Link>
                </li>
              </ul>
            </div>

            {/* Cost by city sample */}
            <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm">
              <div className="px-5 py-4 border-b border-gray-100 bg-gray-50">
                <h3 className="font-semibold text-dark-800 text-sm">
                  Sample: House Construction Cost by City
                  <span className="text-dark-400 font-normal ml-1">(showing 30 of {totalCities})</span>
                </h3>
              </div>
              <div className="p-5 grid grid-cols-2 gap-2">
                {INDIA_LOCATIONS.flatMap(s => s.cities.slice(0, 2))
                  .slice(0, 30)
                  .map(city => (
                    <Link key={city.slug} href={`/cost/general-construction/${city.slug}`}
                      className="text-xs text-brand-600 hover:text-brand-800 hover:underline font-medium py-0.5">
                      Construction Cost in {city.name}
                    </Link>
                  ))}
              </div>
            </div>
          </div>
        </section>

        {/* ── Ask / Q&A Pages ── */}
        <section>
          <SectionTitle icon={<HelpCircle className="w-5 h-5 text-purple-500" />}
            title="Ask & Learn — Q&A Guides"
            subtitle={`${askSlugs.length} articles — /ask/[slug]`} />

          <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm">
            <div className="px-5 py-4 border-b border-gray-100 bg-gray-50 flex items-center justify-between">
              <h3 className="font-semibold text-dark-800 text-sm">All Q&A Articles</h3>
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
        {/* ── Static Core Pages ── */}
        <section>
          <SectionTitle icon={<FileText className="w-5 h-5 text-orange-500" />}
            title="Core Pages"
            subtitle="14 static pages — homepage, auth, legal, and more" />

          <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm">
            <div className="p-5 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
              {[
                { href: '/',               label: 'Home',              badge: 'priority 1.0' },
                { href: '/hire',           label: 'Hire Contractors',  badge: 'priority 0.95' },
                { href: '/cost',           label: 'Cost Guides Hub',   badge: 'priority 0.95' },
                { href: '/ask',            label: 'Ask & Learn Hub',   badge: 'priority 0.9' },
                { href: '/open-jobs',      label: 'Open Jobs',         badge: 'live feed' },
                { href: '/register',       label: 'Register',          badge: '' },
                { href: '/login',          label: 'Login',             badge: '' },
                { href: '/about',          label: 'About Biddaro',     badge: '' },
                { href: '/pricing',        label: 'Pricing',           badge: '' },
                { href: '/contact',        label: 'Contact',           badge: '' },
                { href: '/html-sitemap',   label: 'HTML Sitemap',      badge: 'this page' },
                { href: '/privacy-policy', label: 'Privacy Policy',    badge: 'legal' },
                { href: '/terms',          label: 'Terms of Service',  badge: 'legal' },
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

        {/* ── Footer note ── */}
        <div className="flex items-center gap-2 text-sm text-dark-400 border-t border-gray-200 pt-8 pb-4">
          <Map className="w-4 h-4 flex-shrink-0" />
          <p>
            Sitemap last updated:{' '}
            {new Date().toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' })}.
            &nbsp;Total indexed pages: <strong className="text-dark-600">{totalPages.toLocaleString()}</strong>.
            &nbsp;
            <a href="/sitemap.xml" className="text-brand-600 hover:underline font-medium">View XML Sitemap →</a>
          </p>
        </div>

      </div>{/* /max-w-6xl */}
    </div>
  );
}

// ─── Helper component ─────────────────────────────────────────────────────────

function SectionTitle({
  icon,
  title,
  subtitle,
}: {
  icon: React.ReactNode;
  title: string;
  subtitle: string;
}) {
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
