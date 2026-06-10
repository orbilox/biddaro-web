import type { Metadata } from 'next';
import Link from 'next/link';
import { INSPECT_FAQS } from '@/lib/inspect-seo-data';

export const metadata: Metadata = {
  metadataBase: new URL('https://biddaro.com'),
  title: 'Property Snagging Software UAE — Inspection Reports for Dubai Contractors | Biddaro',
  description:
    'AI-powered snagging and inspection report software for UAE contractors, property consultants and handover teams. Generate professional snag lists and defect reports for Dubai, Abu Dhabi and across the UAE.',
  keywords: [
    'property snagging software UAE',
    'snagging app Dubai',
    'snag list software UAE',
    'building inspection software Dubai',
    'property handover report UAE',
    'defect report software Dubai',
    'construction inspection app UAE',
    'snagging report generator Dubai',
    'building defect report UAE',
    'inspection software Abu Dhabi',
  ],
  alternates: { canonical: 'https://biddaro.com/biddaro-inspect/uae' },
  openGraph: {
    title: 'Property Snagging Software UAE — Biddaro Inspect',
    description: 'Generate professional snag lists and handover reports for UAE properties in minutes.',
    url: 'https://biddaro.com/biddaro-inspect/uae',
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
  description: 'AI-powered property snagging and inspection report software for UAE contractors and handover teams.',
  offers: { '@type': 'Offer', price: '0', priceCurrency: 'AED', availability: 'https://schema.org/InStock' },
  aggregateRating: { '@type': 'AggregateRating', ratingValue: '4.9', reviewCount: '218' },
  areaServed: [
    { '@type': 'City', name: 'Dubai' },
    { '@type': 'City', name: 'Abu Dhabi' },
    { '@type': 'Country', name: 'United Arab Emirates' },
  ],
};

const breadcrumb = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://biddaro.com' },
    { '@type': 'ListItem', position: 2, name: 'Inspect AI', item: 'https://biddaro.com/biddaro-inspect' },
    { '@type': 'ListItem', position: 3, name: 'UAE', item: 'https://biddaro.com/biddaro-inspect/uae' },
  ],
};

const UAE_FEATURES = [
  {
    icon: '📋',
    title: 'Snag List Generation',
    description: 'Automatically compile all defects from your field photos and notes into a structured, numbered snag list. Export as a branded PDF or Word document for the developer.',
  },
  {
    icon: '📸',
    title: 'Photo Documentation',
    description: 'Attach photos directly to each snag item. AI generates professional descriptions of defects, finishes, and materials visible in each photo.',
  },
  {
    icon: '🔑',
    title: 'Handover Reports',
    description: 'Generate complete property handover reports with condition documentation, snag counts, and signatory sections — ready for the developer, owner, and consultant.',
  },
  {
    icon: '✍️',
    title: 'Digital Sign-Off',
    description: 'Built-in e-signature module for inspector, contractor, and client sign-off. Fully paperless handover process.',
  },
  {
    icon: '🔗',
    title: 'Client Portal',
    description: 'Share a secure link with the developer or property owner to view the inspection report — no app download required.',
  },
  {
    icon: '📤',
    title: 'Word & PDF Export',
    description: 'One-click export to .docx or PDF. Upload your firm\'s branded template and Biddaro matches it exactly.',
  },
];

const UAE_FAQS = [
  {
    q: 'What is property snagging in UAE?',
    a: 'Property snagging in UAE refers to the process of inspecting a newly completed property — typically an apartment, villa, or commercial unit — before handover from the developer. The inspector identifies defects, incomplete work, and quality issues (\'snags\') and documents them in a snag list report for the developer to rectify.',
  },
  {
    q: 'How does Biddaro help with property snagging in Dubai?',
    a: 'Biddaro Inspect lets you capture photos and observations on site using your phone, then automatically generates a professional, numbered snag list report in minutes — matching your firm\'s template format. Reports can be exported as PDF or Word and shared with the developer via a client portal link.',
  },
  {
    q: 'Does Biddaro support Arabic for UAE inspectors?',
    a: 'Biddaro\'s interface is currently in English, with Arabic language support in development. Reports can be customised with Arabic headers and bilingual content when using custom Word templates.',
  },
  {
    q: 'What types of UAE properties can I inspect with Biddaro?',
    a: 'Biddaro Inspect supports all property types — residential apartments, villas, townhouses, commercial offices, retail units, and hospitality projects. Custom templates let you adapt the inspection structure to any project type.',
  },
  {
    q: 'Is Biddaro Inspect compliant with UAE property regulations?',
    a: 'Biddaro Inspect is a documentation tool and does not replace regulatory inspections. However, it generates detailed, timestamped reports with photo evidence that meet the documentation standards expected by RERA-registered developers and consultants in Dubai.',
  },
];

export default function InspectUAEPage() {
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
          <span className="text-gray-800 font-medium">UAE</span>
        </nav>
      </div>

      {/* Hero */}
      <section className="max-w-6xl mx-auto px-4 pt-10 pb-14">
        <div className="inline-flex items-center gap-2 bg-green-50 border border-green-200 text-green-700 text-xs font-semibold px-3 py-1.5 rounded-full mb-4">
          🇦🇪 Dubai · Abu Dhabi · UAE
        </div>
        <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-5 leading-tight max-w-3xl">
          Property Snagging & Inspection<br className="hidden md:block" /> Software for UAE
        </h1>
        <p className="text-xl text-gray-600 max-w-2xl mb-8 leading-relaxed">
          Generate professional snag lists and handover inspection reports for Dubai and UAE properties in minutes. Upload your template — AI writes the report in your exact format.
        </p>
        <div className="flex flex-col sm:flex-row gap-3">
          <Link
            href="/register?ref=inspect-uae"
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
            { value: '5 min', label: 'Snag report ready' },
            { value: 'AED', label: 'Local pricing' },
            { value: '100%', label: 'Paperless process' },
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
          Everything UAE Inspectors Need
        </h2>
        <p className="text-gray-500 text-center mb-10 max-w-xl mx-auto">
          Purpose-built for property snagging, handover inspections, and quality audits across the UAE property market.
        </p>
        <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6">
          {UAE_FEATURES.map((f) => (
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
          FAQs — Snagging Software UAE
        </h2>
        <div className="space-y-3">
          {UAE_FAQS.map((faq) => (
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
          <h2 className="text-3xl font-bold text-white mb-3">Start Snagging Smarter</h2>
          <p className="text-orange-100 mb-8 text-lg">
            Join inspection firms and property consultants across Dubai and the UAE using Biddaro Inspect.
          </p>
          <Link
            href="/register?ref=inspect-uae-cta"
            className="bg-white text-orange-600 font-bold px-10 py-4 rounded-xl text-lg hover:bg-orange-50 transition-colors inline-block"
          >
            Create Free Account
          </Link>
        </div>
      </section>
    </main>
  );
}
