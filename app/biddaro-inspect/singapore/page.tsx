import type { Metadata } from 'next';
import Link from 'next/link';
import { INSPECT_FAQS } from '@/lib/inspect-seo-data';

export const metadata: Metadata = {
  metadataBase: new URL('https://biddaro.com'),
  title: 'Building Inspection Report Software Singapore | Biddaro Inspect AI',
  description:
    'AI-powered building inspection and defect report software for Singapore contractors, QS firms and building consultants. Generate professional inspection reports for HDB, condo and commercial projects.',
  keywords: [
    'building inspection software Singapore',
    'inspection report software Singapore',
    'construction inspection app Singapore',
    'HDB inspection report software',
    'condo inspection software Singapore',
    'defect report software Singapore',
    'building defect list Singapore',
    'site inspection app Singapore',
    'BCA inspection report software',
  ],
  alternates: { canonical: 'https://biddaro.com/biddaro-inspect/singapore' },
  openGraph: {
    title: 'Building Inspection Software Singapore | Biddaro',
    description: 'AI inspection reports for Singapore contractors and QS firms — from site capture to client report in minutes.',
    url: 'https://biddaro.com/biddaro-inspect/singapore',
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
  description: 'AI-powered building inspection report software for Singapore contractors and building consultants.',
  offers: { '@type': 'Offer', price: '0', priceCurrency: 'SGD', availability: 'https://schema.org/InStock' },
  aggregateRating: { '@type': 'AggregateRating', ratingValue: '4.9', reviewCount: '186' },
  areaServed: { '@type': 'Country', name: 'Singapore' },
};

const breadcrumb = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://biddaro.com' },
    { '@type': 'ListItem', position: 2, name: 'Inspect AI', item: 'https://biddaro.com/biddaro-inspect' },
    { '@type': 'ListItem', position: 3, name: 'Singapore', item: 'https://biddaro.com/biddaro-inspect/singapore' },
  ],
};

const SG_FEATURES = [
  {
    icon: '🏗️',
    title: 'BCA-Ready Documentation',
    description: 'Structure your inspection reports to meet BCA documentation standards. Timestamped records, photo evidence, and signatory sections.',
  },
  {
    icon: '🏠',
    title: 'HDB & Condo Defect Lists',
    description: 'Pre-built templates for HDB BTO defect inspections and private condo handover reports. Customise for any project type.',
  },
  {
    icon: '📸',
    title: 'Photo-to-Report',
    description: 'Take photos on site — AI generates professional defect descriptions for each photo. No manual typing required.',
  },
  {
    icon: '✍️',
    title: 'Digital Sign-Off',
    description: 'Built-in e-signature for inspector, contractor, and owner sign-off. Paperless, legally sound documentation.',
  },
  {
    icon: '🔗',
    title: 'Client Sharing Portal',
    description: 'Share reports via a secure link with developers, main contractors, and owners — no login required for clients.',
  },
  {
    icon: '📄',
    title: 'Word & PDF Export',
    description: 'Export in your firm\'s branded format — upload a Word template and Biddaro replicates it exactly.',
  },
];

const SG_FAQS = [
  {
    q: 'What types of building inspections does Biddaro support in Singapore?',
    a: 'Biddaro Inspect supports all types of building inspections in Singapore — HDB BTO defect inspections, private condo handover checks, commercial fit-out inspections, structural assessments, M&E (mechanical & electrical) inspections, and general quality audits.',
  },
  {
    q: 'Is Biddaro Inspect suitable for QS and building consultancy firms in Singapore?',
    a: 'Yes. QS firms, building consultants, and PMC companies in Singapore use Biddaro Inspect to standardise their site inspection workflow — capturing field data with the app and generating branded client reports in minutes, without manual drafting.',
  },
  {
    q: 'Can Biddaro generate inspection reports that meet BCA standards?',
    a: 'Biddaro Inspect generates detailed, photo-evidenced, timestamped inspection reports that align with BCA documentation expectations. Firms use their own branded Word templates which Biddaro replicates exactly in the output.',
  },
  {
    q: 'Is pricing available in Singapore Dollars (SGD)?',
    a: 'Yes. Biddaro offers SGD pricing for Singapore customers. Plans start with a free tier and scale to professional and enterprise options.',
  },
  {
    q: 'Does Biddaro work on iOS devices for Singapore inspectors?',
    a: 'Yes — Biddaro Inspect is a web application that works on any device with a browser, including iPhone and iPad. The mobile-optimised interface is designed for use in the field.',
  },
];

export default function InspectSingaporePage() {
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
          <span className="text-gray-800 font-medium">Singapore</span>
        </nav>
      </div>

      {/* Hero */}
      <section className="max-w-6xl mx-auto px-4 pt-10 pb-14">
        <div className="inline-flex items-center gap-2 bg-red-50 border border-red-200 text-red-700 text-xs font-semibold px-3 py-1.5 rounded-full mb-4">
          🇸🇬 Singapore
        </div>
        <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-5 leading-tight max-w-3xl">
          Building Inspection Report<br className="hidden md:block" /> Software for Singapore
        </h1>
        <p className="text-xl text-gray-600 max-w-2xl mb-8 leading-relaxed">
          AI-powered inspection reports for Singapore contractors, QS firms and building consultants. HDB defect lists, condo handover reports, and commercial inspections — done in minutes.
        </p>
        <div className="flex flex-col sm:flex-row gap-3">
          <Link
            href="/register?ref=inspect-sg"
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
          {[
            { value: '80%', label: 'Less time on reports' },
            { value: '5 min', label: 'Report ready' },
            { value: 'SGD', label: 'Local pricing' },
            { value: 'Word & PDF', label: 'Export formats' },
          ].map((s) => (
            <div key={s.label}>
              <p className="text-3xl font-extrabold text-white">{s.value}</p>
              <p className="text-orange-100 text-sm mt-1">{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section className="max-w-6xl mx-auto px-4 py-16">
        <h2 className="text-3xl font-bold text-gray-900 text-center mb-3">
          Built for Singapore Building Professionals
        </h2>
        <p className="text-gray-500 text-center mb-10 max-w-xl mx-auto">
          From HDB BTO defect inspections to large-scale commercial projects — Biddaro Inspect adapts to any inspection workflow.
        </p>
        <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6">
          {SG_FEATURES.map((f) => (
            <div key={f.title} className="border border-gray-100 rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow">
              <span className="text-3xl">{f.icon}</span>
              <h3 className="text-lg font-bold text-gray-900 mt-3 mb-2">{f.title}</h3>
              <p className="text-gray-600 text-sm leading-relaxed">{f.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* FAQ */}
      <section className="max-w-3xl mx-auto px-4 py-16 border-t border-gray-100">
        <h2 className="text-3xl font-bold text-gray-900 text-center mb-10">
          FAQs — Building Inspection Software Singapore
        </h2>
        <div className="space-y-3">
          {SG_FAQS.map((faq) => (
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

      {/* CTA */}
      <section className="bg-orange-600 py-16 text-center">
        <div className="max-w-2xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-white mb-3">
            Start Free for Singapore Teams
          </h2>
          <p className="text-orange-100 mb-8 text-lg">
            No setup. No credit card. Your first inspection report in under 5 minutes.
          </p>
          <Link
            href="/register?ref=inspect-sg-cta"
            className="bg-white text-orange-600 font-bold px-10 py-4 rounded-xl text-lg hover:bg-orange-50 transition-colors inline-block"
          >
            Create Free Account
          </Link>
        </div>
      </section>
    </main>
  );
}
