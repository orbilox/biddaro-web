import type { Metadata } from 'next';
import Link from 'next/link';
import { INSPECT_INDIA_CITIES, INSPECT_FAQS } from '@/lib/inspect-seo-data';

export const metadata: Metadata = {
  metadataBase: new URL('https://biddaro.com'),
  title: 'Construction Inspection Report Software in India | Biddaro Inspect AI',
  description:
    'Biddaro Inspect is the leading AI-powered inspection report software used by 500+ contractors across India. Capture on site, AI writes the report — Word & PDF export in minutes.',
  keywords: [
    'inspection report software India',
    'construction inspection app India',
    'site inspection software India',
    'building inspection report India',
    'field inspection software India',
    'construction report generator India',
    'inspection checklist app India',
    'AI inspection software India',
  ],
  alternates: { canonical: 'https://biddaro.com/biddaro-inspect/india' },
  openGraph: {
    title: 'Construction Inspection Software in India | Biddaro',
    description: 'AI-powered inspection reports for Indian contractors — capture on site, report in minutes.',
    url: 'https://biddaro.com/biddaro-inspect/india',
    siteName: 'Biddaro',
    type: 'website',
  },
};

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'SoftwareApplication',
  name: 'Biddaro Inspect AI',
  applicationCategory: 'BusinessApplication',
  operatingSystem: 'Web, iOS, Android',
  description: 'AI-powered inspection report software for Indian contractors and site engineers.',
  offers: { '@type': 'Offer', price: '0', priceCurrency: 'INR', availability: 'https://schema.org/InStock' },
  aggregateRating: { '@type': 'AggregateRating', ratingValue: '4.9', reviewCount: '312' },
  areaServed: { '@type': 'Country', name: 'India' },
};

const breadcrumb = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://biddaro.com' },
    { '@type': 'ListItem', position: 2, name: 'Inspect AI', item: 'https://biddaro.com/biddaro-inspect' },
    { '@type': 'ListItem', position: 3, name: 'India', item: 'https://biddaro.com/biddaro-inspect/india' },
  ],
};

const STATS = [
  { value: '500+', label: 'Indian contractors' },
  { value: '10,000+', label: 'Reports generated' },
  { value: '5 min', label: 'Average report time' },
  { value: '₹0', label: 'To start free' },
];

const WHY_INDIA = [
  {
    icon: '💰',
    title: 'INR Pricing',
    description: 'Plans priced in Indian Rupees — no dollar conversion surprises. Affordable for individual inspectors and large PMC firms alike.',
  },
  {
    icon: '📱',
    title: 'Works on Any Android',
    description: 'Optimised for low-bandwidth sites and mid-range Android phones. Offline capture mode means no internet required on site.',
  },
  {
    icon: '🤝',
    title: 'Local Customer Support',
    description: 'India-based support team available via WhatsApp, email, and call. Onboarding help in English and Hindi.',
  },
];

export default function InspectIndiaPage() {
  return (
    <main className="bg-white">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb) }} />

      {/* Breadcrumb */}
      <div className="max-w-6xl mx-auto px-4 pt-6">
        <nav className="text-sm text-gray-500 flex items-center gap-1.5">
          <Link href="/" className="hover:text-orange-600">Home</Link>
          <span>/</span>
          <Link href="/biddaro-inspect" className="hover:text-orange-600">Inspect AI</Link>
          <span>/</span>
          <span className="text-gray-800 font-medium">India</span>
        </nav>
      </div>

      {/* Hero */}
      <section className="max-w-6xl mx-auto px-4 pt-10 pb-14 text-center">
        <div className="inline-flex items-center gap-2 bg-orange-50 border border-orange-200 text-orange-700 text-xs font-semibold px-3 py-1.5 rounded-full mb-4">
          🇮🇳 Made for Indian Contractors
        </div>
        <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-4 leading-tight">
          Inspection Report Software<br className="hidden md:block" /> for Indian Contractors
        </h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-8">
          Capture photos and observations on site. AI writes your professional inspection report in minutes — Word & PDF export, client delivery included.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            href="/register?ref=inspect-india"
            className="bg-orange-600 hover:bg-orange-700 text-white font-bold px-8 py-4 rounded-xl text-lg transition-colors"
          >
            Start Free — No Credit Card
          </Link>
          <Link
            href="/biddaro-inspect"
            className="border border-gray-300 text-gray-700 font-semibold px-8 py-4 rounded-xl text-lg hover:bg-gray-50 transition-colors"
          >
            See How It Works
          </Link>
        </div>
      </section>

      {/* Stats */}
      <section className="bg-orange-600 py-8">
        <div className="max-w-5xl mx-auto px-4 grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          {STATS.map((s) => (
            <div key={s.label}>
              <p className="text-3xl font-extrabold text-white">{s.value}</p>
              <p className="text-orange-100 text-sm mt-1">{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Why India section */}
      <section className="max-w-6xl mx-auto px-4 py-16">
        <h2 className="text-3xl font-bold text-gray-900 text-center mb-3">Built for India</h2>
        <p className="text-gray-500 text-center mb-10 max-w-xl mx-auto">
          Biddaro Inspect is designed around the realities of Indian construction sites — patchy connectivity, diverse devices, and demanding client timelines.
        </p>
        <div className="grid md:grid-cols-3 gap-6">
          {WHY_INDIA.map((item) => (
            <div key={item.title} className="border border-gray-100 rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow">
              <span className="text-3xl">{item.icon}</span>
              <h3 className="text-lg font-bold text-gray-900 mt-3 mb-2">{item.title}</h3>
              <p className="text-gray-600 text-sm leading-relaxed">{item.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* City grid */}
      <section className="bg-gray-50 py-16">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-3">
            Available Across India
          </h2>
          <p className="text-gray-500 text-center mb-10 max-w-xl mx-auto">
            Inspection report software for contractors in every major Indian city.
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
            {INSPECT_INDIA_CITIES.map((city) => (
              <Link
                key={city.slug}
                href={`/biddaro-inspect/india/${city.slug}`}
                className="bg-white border border-gray-200 rounded-xl p-4 text-center hover:border-orange-400 hover:shadow-sm transition-all group"
              >
                <p className="font-semibold text-gray-800 group-hover:text-orange-600 transition-colors text-sm">{city.name}</p>
                <p className="text-xs text-gray-400 mt-0.5">{city.state}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="max-w-3xl mx-auto px-4 py-16">
        <h2 className="text-3xl font-bold text-gray-900 text-center mb-10">Frequently Asked Questions</h2>
        <div className="space-y-3">
          {INSPECT_FAQS.slice(0, 8).map((faq) => (
            <details key={faq.q} className="border border-gray-200 rounded-xl group">
              <summary className="cursor-pointer p-5 font-semibold text-gray-800 hover:text-orange-600 list-none flex justify-between items-center">
                {faq.q}
                <span className="text-gray-400 group-open:rotate-180 transition-transform text-lg">▾</span>
              </summary>
              <div className="px-5 pb-5 text-gray-600 text-sm leading-relaxed border-t border-gray-100 pt-4">{faq.a}</div>
            </details>
          ))}
        </div>
      </section>

      {/* Final CTA */}
      <section className="bg-orange-600 py-16 text-center">
        <div className="max-w-2xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-white mb-3">Start Free Today</h2>
          <p className="text-orange-100 mb-8 text-lg">Join 500+ Indian contractors already saving hours on inspection reports every week.</p>
          <Link
            href="/register?ref=inspect-india-cta"
            className="bg-white text-orange-600 font-bold px-10 py-4 rounded-xl text-lg hover:bg-orange-50 transition-colors inline-block"
          >
            Create Free Account
          </Link>
        </div>
      </section>
    </main>
  );
}
