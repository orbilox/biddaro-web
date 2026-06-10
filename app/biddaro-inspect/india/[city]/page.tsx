import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { INSPECT_INDIA_CITIES, INSPECT_FAQS, getInspectCity, getAllInspectCitySlugs } from '@/lib/inspect-seo-data';

export function generateStaticParams() {
  return getAllInspectCitySlugs().map((slug) => ({ city: slug }));
}

export async function generateMetadata({ params }: { params: { city: string } }): Promise<Metadata> {
  const city = getInspectCity(params.city);
  if (!city) return {};
  return {
    metadataBase: new URL('https://biddaro.com'),
    title: `Inspection Report Software in ${city.name} | Biddaro Inspect AI`,
    description: `AI-powered construction inspection report software in ${city.name}, ${city.state}. Capture photos and notes on site — report ready in 5 minutes. Used by contractors across ${city.state}.`,
    keywords: [
      `inspection report software ${city.name}`,
      `construction inspection app ${city.name}`,
      `site inspection software ${city.name}`,
      `building inspection report ${city.name}`,
      `field inspection software ${city.state}`,
      `inspection checklist app ${city.name}`,
    ],
    alternates: { canonical: `https://biddaro.com/biddaro-inspect/india/${city.slug}` },
    openGraph: {
      title: `Inspection Report Software in ${city.name} | Biddaro`,
      description: `AI inspection reports for contractors in ${city.name}. Capture on site, report in minutes.`,
      url: `https://biddaro.com/biddaro-inspect/india/${city.slug}`,
      siteName: 'Biddaro',
      type: 'website',
    },
  };
}

const FEATURES = [
  { icon: '📸', title: 'Photo Documentation', desc: 'GPS-tagged photos with AI-generated captions. Upload in bulk from site.' },
  { icon: '🎙️', title: 'Voice Notes', desc: 'Dictate observations on site — speech-to-text converts them to typed notes instantly.' },
  { icon: '🤖', title: 'AI Report Writing', desc: 'AI structures your captures into a professional report matching your exact template.' },
  { icon: '📄', title: 'Word & PDF Export', desc: 'One-click export to .docx or PDF, ready to send to clients and consultants.' },
];

export default function InspectCityPage({ params }: { params: { city: string } }) {
  const city = getInspectCity(params.city);
  if (!city) notFound();

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: 'Biddaro Inspect AI',
    applicationCategory: 'BusinessApplication',
    operatingSystem: 'Web, iOS, Android',
    description: `AI-powered inspection report software for contractors in ${city.name}, ${city.state}.`,
    offers: { '@type': 'Offer', price: '0', priceCurrency: 'INR' },
    aggregateRating: { '@type': 'AggregateRating', ratingValue: '4.9', reviewCount: '312' },
    areaServed: { '@type': 'City', name: city.name, containedInPlace: { '@type': 'State', name: city.state } },
  };

  const breadcrumb = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://biddaro.com' },
      { '@type': 'ListItem', position: 2, name: 'Inspect AI', item: 'https://biddaro.com/biddaro-inspect' },
      { '@type': 'ListItem', position: 3, name: 'India', item: 'https://biddaro.com/biddaro-inspect/india' },
      { '@type': 'ListItem', position: 4, name: city.name, item: `https://biddaro.com/biddaro-inspect/india/${city.slug}` },
    ],
  };

  const cityFaqs = [
    { q: `Is Biddaro Inspect available in ${city.name}?`, a: `Yes — Biddaro Inspect is fully available in ${city.name} and across ${city.state}. The platform works on any smartphone or laptop with a browser, with no special hardware required.` },
    { q: `What types of inspections can I document in ${city.name}?`, a: `Biddaro Inspect supports all types — structural, MEP, safety, snag lists, handover reports, civil works, and more. You can create custom templates matching your firm's exact format.` },
    { q: `How fast can I generate a report from a ${city.name} site visit?`, a: `Most reports are ready in under 5 minutes after your site capture is complete. The AI processes your photos, voice notes, and observations into a structured draft immediately.` },
    { q: `Does Biddaro work offline in ${city.name}?`, a: `Yes. The mobile capture mode works fully offline — photos, voice notes, and text observations are saved locally and sync automatically when you regain connectivity.` },
    { q: `Is Biddaro Inspect affordable for small contractors in ${city.name}?`, a: `Biddaro Inspect has a free plan and paid plans starting at very affordable INR pricing. Individual inspectors and small firms in ${city.name} can get started for free with no credit card required.` },
  ];

  return (
    <main className="bg-white">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb) }} />

      {/* Breadcrumb */}
      <div className="max-w-6xl mx-auto px-4 pt-6">
        <nav className="text-sm text-gray-500 flex items-center gap-1.5 flex-wrap">
          <Link href="/" className="hover:text-orange-600">Home</Link>
          <span>/</span>
          <Link href="/biddaro-inspect" className="hover:text-orange-600">Inspect AI</Link>
          <span>/</span>
          <Link href="/biddaro-inspect/india" className="hover:text-orange-600">India</Link>
          <span>/</span>
          <span className="text-gray-800 font-medium">{city.name}</span>
        </nav>
      </div>

      {/* Hero */}
      <section className="max-w-6xl mx-auto px-4 pt-10 pb-14">
        <div className="inline-flex items-center gap-2 bg-orange-50 border border-orange-200 text-orange-700 text-xs font-semibold px-3 py-1.5 rounded-full mb-4">
          🇮🇳 {city.name}, {city.state}
        </div>
        <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-5 leading-tight max-w-3xl">
          Construction Inspection Report Software in {city.name}
        </h1>
        <p className="text-xl text-gray-600 max-w-2xl mb-8 leading-relaxed">
          Biddaro Inspect is used by contractors and site engineers across {city.name} to generate professional inspection reports from the field — in minutes, not hours.
        </p>
        <div className="flex flex-col sm:flex-row gap-3">
          <Link
            href={`/register?ref=inspect-india-${city.slug}`}
            className="bg-orange-600 hover:bg-orange-700 text-white font-bold px-8 py-4 rounded-xl text-lg transition-colors"
          >
            Start Free — Works on Any Smartphone
          </Link>
          <Link
            href="/biddaro-inspect"
            className="border border-gray-300 text-gray-700 font-semibold px-8 py-4 rounded-xl text-lg hover:bg-gray-50 transition-colors"
          >
            See How It Works
          </Link>
        </div>
      </section>

      {/* Stats bar */}
      <section className="bg-gray-50 border-y border-gray-200 py-8">
        <div className="max-w-5xl mx-auto px-4 grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          {[
            { value: '80%', label: 'Less time on reports' },
            { value: '5 min', label: 'To generate report' },
            { value: 'Word & PDF', label: 'Export formats' },
            { value: '₹0', label: 'To start free' },
          ].map((s) => (
            <div key={s.label}>
              <p className="text-2xl font-extrabold text-orange-600">{s.value}</p>
              <p className="text-gray-500 text-sm mt-1">{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* City context */}
      <section className="max-w-4xl mx-auto px-4 py-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">
          Inspection Reporting for {city.name} Contractors
        </h2>
        <p className="text-gray-600 leading-relaxed text-lg">{city.constructionNote}</p>
        <p className="text-gray-600 leading-relaxed text-lg mt-4">
          Biddaro Inspect gives {city.name}-based engineers and inspectors a structured, mobile-first workflow: capture photos and voice observations on site, then let AI draft the full inspection report in your preferred format — ready to share with clients as a branded Word or PDF document.
        </p>
      </section>

      {/* Features */}
      <section className="bg-gray-50 py-14">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-10">
            Everything You Need in the Field
          </h2>
          <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-6">
            {FEATURES.map((f) => (
              <div key={f.title} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                <span className="text-3xl">{f.icon}</span>
                <h3 className="font-bold text-gray-900 mt-3 mb-2">{f.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="max-w-3xl mx-auto px-4 py-16">
        <h2 className="text-3xl font-bold text-gray-900 text-center mb-10">
          FAQs — Biddaro Inspect in {city.name}
        </h2>
        <div className="space-y-3">
          {cityFaqs.map((faq) => (
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

      {/* Other cities */}
      <section className="bg-gray-50 py-12">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-xl font-bold text-gray-900 mb-6 text-center">Available in Other Indian Cities</h2>
          <div className="flex flex-wrap gap-2 justify-center">
            {INSPECT_INDIA_CITIES.filter((c) => c.slug !== city.slug).slice(0, 12).map((c) => (
              <Link
                key={c.slug}
                href={`/biddaro-inspect/india/${c.slug}`}
                className="bg-white border border-gray-200 text-gray-700 text-sm font-medium px-4 py-2 rounded-full hover:border-orange-400 hover:text-orange-600 transition-colors"
              >
                {c.name}
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="bg-orange-600 py-16 text-center">
        <div className="max-w-2xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-white mb-3">
            Start Free in {city.name} Today
          </h2>
          <p className="text-orange-100 mb-8 text-lg">
            No credit card. No setup fee. Your first report in under 5 minutes.
          </p>
          <Link
            href={`/register?ref=inspect-india-${city.slug}-cta`}
            className="bg-white text-orange-600 font-bold px-10 py-4 rounded-xl text-lg hover:bg-orange-50 transition-colors inline-block"
          >
            Create Free Account
          </Link>
        </div>
      </section>
    </main>
  );
}
