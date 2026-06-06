import React from 'react';
import Link from 'next/link';
import type { Metadata } from 'next';
import {
  HardHat, ClipboardList, BarChart3, Radio, CheckCircle,
  ArrowRight, Star, Shield, Zap, Users, Building2, ChevronDown,
  Wrench, Package, IndianRupee, Globe, Clock, TrendingUp,
} from 'lucide-react';

// ─── Metadata ─────────────────────────────────────────────────────────────────

export const metadata: Metadata = {
  title: 'Construction ERP Software for Contractors & Builders | Biddaro',
  description:
    'Manage your construction site, track projects, plan builds and run your entire business from one platform. Biddaro ERP is used by 10,000+ contractors across India, UAE & Singapore. Start free.',
  keywords: [
    'construction ERP software',
    'construction management software India',
    'site management software for contractors',
    'construction project management app',
    'contractor management software',
    'construction ERP India',
    'build planner software',
    'construction site tracking software',
  ],
  alternates: { canonical: 'https://biddaro.com/erp' },
  openGraph: {
    title: 'Construction ERP Software for Contractors & Builders | Biddaro',
    description:
      'Run your entire construction business from one platform — site management, project tracking, build planning, and more. Start free today.',
    url: 'https://biddaro.com/erp',
    type: 'website',
  },
  twitter: { card: 'summary_large_image', site: '@biddaro' },
};

// ─── JSON-LD ──────────────────────────────────────────────────────────────────

const softwareJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'SoftwareApplication',
  name: 'Biddaro ERP',
  description:
    'Construction ERP software for contractors and builders — site management, project tracking, build planning, and team collaboration in one platform.',
  applicationCategory: 'BusinessApplication',
  operatingSystem: 'Web, iOS, Android',
  url: 'https://biddaro.com/erp',
  offers: {
    '@type': 'AggregateOffer',
    lowPrice: '7.99',
    highPrice: '12.99',
    priceCurrency: 'USD',
    offerCount: 4,
  },
  aggregateRating: {
    '@type': 'AggregateRating',
    ratingValue: '4.8',
    reviewCount: '342',
    bestRating: '5',
    worstRating: '1',
  },
  provider: {
    '@type': 'Organization',
    name: 'Biddaro',
    url: 'https://biddaro.com',
  },
};

const breadcrumbJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://biddaro.com' },
    { '@type': 'ListItem', position: 2, name: 'ERP', item: 'https://biddaro.com/erp' },
  ],
};

const faqJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: 'What is Biddaro ERP?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Biddaro ERP is a cloud-based construction management platform that includes Site Manager, Project Manager, Build Planner, and Project Tracking — four integrated modules that replace spreadsheets and paper registers for construction businesses of all sizes.',
      },
    },
    {
      '@type': 'Question',
      name: 'How much does Biddaro ERP cost?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Biddaro ERP modules are available as add-ons starting at $7.99/month per module. You can install only the modules your business needs. There is no annual commitment — cancel any time.',
      },
    },
    {
      '@type': 'Question',
      name: 'Is Biddaro ERP available in India?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Yes. Biddaro ERP is built specifically for contractors in India, UAE, and Singapore with full INR, AED, and SGD currency support, local payment methods (Razorpay for India), and Indian construction workflow standards.',
      },
    },
    {
      '@type': 'Question',
      name: 'Can I try Biddaro ERP for free?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Yes. Create a free Biddaro account and access the core marketplace features. ERP add-on modules are available from your dashboard. The base platform including project tracking and job marketplace is free to explore.',
      },
    },
  ],
};

// ─── Data ─────────────────────────────────────────────────────────────────────

const MODULES = [
  {
    slug: 'site-manager',
    icon: HardHat,
    color: 'bg-orange-100 text-orange-600',
    ring: 'ring-orange-200',
    border: 'border-orange-200',
    name: 'Site Manager',
    price: '$12.99/mo',
    tagline: 'Full construction site ERP',
    features: [
      'Labor & attendance tracking',
      'Material inventory & transactions',
      'Daily Progress Reports (DPR)',
      'BOQ management',
      'Equipment fleet & allocation',
      'P&L and expense tracking',
      'Client portal',
    ],
  },
  {
    slug: 'project-manager',
    icon: ClipboardList,
    color: 'bg-blue-100 text-blue-600',
    ring: 'ring-blue-200',
    border: 'border-blue-200',
    name: 'Project Manager',
    price: '$12.99/mo',
    tagline: 'Kanban, tasks & milestones',
    features: [
      'Kanban task board',
      'Milestone & sprint planning',
      'Threaded team discussions',
      'File collaboration',
      'Time tracking',
      'Contract linking',
      'Priority management',
    ],
  },
  {
    slug: 'build-planner',
    icon: Package,
    color: 'bg-amber-100 text-amber-600',
    ring: 'ring-amber-200',
    border: 'border-amber-200',
    name: 'Build Planner',
    price: '$9.99/mo',
    tagline: 'Plan every construction phase',
    features: [
      '9 planning section types',
      'Auto-checklists per section',
      'Blueprint & image upload',
      'Material status tracking',
      'Cost vs budget tracking',
      'Achievement badges',
      'Blueprint report export',
    ],
  },
  {
    slug: 'project-tracking',
    icon: Radio,
    color: 'bg-green-100 text-green-600',
    ring: 'ring-green-200',
    border: 'border-green-200',
    name: 'Project Tracking',
    price: '$7.99/mo',
    tagline: 'Live progress updates & photos',
    features: [
      'Live progress update feed',
      'Photo & file attachments',
      'Completion % tracking',
      'Client-facing dashboard',
      'Push notifications',
      'Timestamped history',
      'Mobile-friendly for site',
    ],
  },
];

const STATS = [
  { value: '10,000+', label: 'Contractors using Biddaro', icon: Users },
  { value: '₹500 Cr+', label: 'Project value managed', icon: IndianRupee },
  { value: '4.8★', label: 'Average platform rating', icon: Star },
  { value: '3 countries', label: 'India, UAE & Singapore', icon: Globe },
];

const WHY_BIDDARO = [
  {
    icon: Zap,
    color: 'bg-brand-100 text-brand-600',
    title: 'Set up in minutes, not months',
    desc: 'No IT department, no installation, no training budget. Create your account, install the modules you need, and start managing your site the same day.',
  },
  {
    icon: Shield,
    color: 'bg-green-100 text-green-600',
    title: 'Integrated with your contracts & payments',
    desc: 'Biddaro ERP connects directly to your jobs and contracts on the marketplace. Escrow milestone payments are linked to your project milestones — no double data entry.',
  },
  {
    icon: Globe,
    color: 'bg-blue-100 text-blue-600',
    title: 'Built for India, UAE & Singapore',
    desc: 'Full INR, AED, SGD currency support. Razorpay for Indian payments. Construction workflows designed for local standards, not US-centric ERP systems.',
  },
  {
    icon: TrendingUp,
    color: 'bg-amber-100 text-amber-600',
    title: 'Affordable for contractors of any size',
    desc: 'Enterprise construction ERP costs $375–$900/month. Biddaro starts at $7.99/month per module. Get the features you need without the enterprise price tag.',
  },
];

const FAQS = [
  {
    q: 'What is Biddaro ERP?',
    a: 'Biddaro ERP is a cloud-based construction management platform that includes Site Manager, Project Manager, Build Planner, and Project Tracking — four integrated modules that replace spreadsheets and paper registers for construction businesses of any size.',
  },
  {
    q: 'How much does Biddaro ERP cost?',
    a: 'ERP modules are available as add-ons starting at $7.99/month. Install only the modules your business needs. No annual commitment — cancel any time.',
  },
  {
    q: 'Is Biddaro ERP available in India?',
    a: 'Yes. Biddaro ERP is built for contractors in India, UAE, and Singapore with INR, AED, and SGD support, Razorpay integration for Indian payments, and workflows designed to match local construction standards.',
  },
  {
    q: 'Do I need to be on the Biddaro marketplace to use the ERP?',
    a: "No. You can use Biddaro ERP modules independently to manage your construction projects, even if you don't actively use the job marketplace to find or post work.",
  },
  {
    q: 'How is Biddaro ERP different from Procore or Buildertrend?',
    a: 'Biddaro delivers the same core ERP capabilities as Procore and Buildertrend at a fraction of the cost. It also includes a unique integrated job marketplace and escrow payment system. Procore starts at $375/month — Biddaro starts at $7.99/month.',
  },
  {
    q: 'Can I use Biddaro ERP on my phone?',
    a: 'Yes. Biddaro is a fully responsive web application that works on any smartphone or tablet browser. Site foremen can mark attendance, post DPRs, and update materials directly from the site on their phones.',
  },
];

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function ErpLandingPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(softwareJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />

      <main className="min-h-screen bg-white">

        {/* ── Hero ─────────────────────────────────────────────────────────── */}
        <section className="bg-gradient-to-br from-brand-50 via-white to-orange-50 border-b border-dark-100">
          <div className="max-w-6xl mx-auto px-4 py-16 md:py-24 text-center">
            <div className="inline-flex items-center gap-2 bg-brand-100 text-brand-700 text-sm font-semibold px-4 py-1.5 rounded-full mb-6">
              <HardHat className="w-4 h-4" />
              Construction ERP Software
            </div>
            <h1 className="text-4xl md:text-6xl font-bold text-dark-900 leading-tight mb-6">
              Run Your Entire Construction
              <br />
              <span className="text-brand-600">Business From One Platform</span>
            </h1>
            <p className="text-xl text-dark-500 max-w-3xl mx-auto mb-10 leading-relaxed">
              Manage sites, track projects, plan builds, and coordinate teams — all in one place.
              Biddaro ERP replaces your spreadsheets, paper registers, and scattered WhatsApp groups
              with a purpose-built construction management platform.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
              <Link
                href="/register?ref=erp"
                className="inline-flex items-center gap-2 bg-brand-600 hover:bg-brand-700 text-white font-semibold px-8 py-4 rounded-xl text-lg transition-colors"
              >
                Start Free — No Credit Card
                <ArrowRight className="w-5 h-5" />
              </Link>
              <Link
                href="/erp/pricing"
                className="inline-flex items-center gap-2 border-2 border-brand-200 text-brand-700 hover:bg-brand-50 font-semibold px-8 py-4 rounded-xl text-lg transition-colors"
              >
                View Pricing
              </Link>
            </div>
            {/* Social proof */}
            <div className="flex flex-wrap justify-center gap-6 text-sm text-dark-400">
              <span className="flex items-center gap-1.5"><CheckCircle className="w-4 h-4 text-green-500" /> No setup fee</span>
              <span className="flex items-center gap-1.5"><CheckCircle className="w-4 h-4 text-green-500" /> Works on any device</span>
              <span className="flex items-center gap-1.5"><CheckCircle className="w-4 h-4 text-green-500" /> Cancel any time</span>
              <span className="flex items-center gap-1.5"><CheckCircle className="w-4 h-4 text-green-500" /> India, UAE & Singapore</span>
            </div>
          </div>
        </section>

        {/* ── Stats ────────────────────────────────────────────────────────── */}
        <section className="border-b border-dark-100 bg-white">
          <div className="max-w-5xl mx-auto px-4 py-12 grid grid-cols-2 md:grid-cols-4 gap-8">
            {STATS.map((stat) => (
              <div key={stat.label} className="text-center">
                <p className="text-3xl font-bold text-dark-900 mb-1">{stat.value}</p>
                <p className="text-sm text-dark-400">{stat.label}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ── Modules ──────────────────────────────────────────────────────── */}
        <section className="py-20 bg-white">
          <div className="max-w-6xl mx-auto px-4">
            <div className="text-center mb-14">
              <h2 className="text-3xl md:text-4xl font-bold text-dark-900 mb-4">
                Four ERP Modules. One Construction Platform.
              </h2>
              <p className="text-lg text-dark-500 max-w-2xl mx-auto">
                Install the modules your business needs. Use them independently or together —
                they share your project data automatically.
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {MODULES.map((mod) => (
                <div
                  key={mod.slug}
                  className={`border-2 ${mod.border} rounded-2xl p-8 hover:shadow-lg transition-shadow`}
                >
                  <div className="flex items-start justify-between mb-6">
                    <div className={`p-3 rounded-xl ${mod.color}`}>
                      <mod.icon className="w-7 h-7" />
                    </div>
                    <span className="text-sm font-semibold text-dark-400 bg-dark-50 px-3 py-1 rounded-full">
                      {mod.price}
                    </span>
                  </div>
                  <h3 className="text-xl font-bold text-dark-900 mb-1">{mod.name}</h3>
                  <p className="text-dark-500 mb-5">{mod.tagline}</p>
                  <ul className="space-y-2 mb-6">
                    {mod.features.map((f) => (
                      <li key={f} className="flex items-center gap-2 text-sm text-dark-600">
                        <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                        {f}
                      </li>
                    ))}
                  </ul>
                  <Link
                    href={`/erp/${mod.slug}`}
                    className="inline-flex items-center gap-1.5 text-sm font-semibold text-brand-600 hover:text-brand-700"
                  >
                    Learn more <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Why Biddaro ──────────────────────────────────────────────────── */}
        <section className="py-20 bg-dark-50">
          <div className="max-w-6xl mx-auto px-4">
            <div className="text-center mb-14">
              <h2 className="text-3xl md:text-4xl font-bold text-dark-900 mb-4">
                Why Contractors Choose Biddaro ERP
              </h2>
              <p className="text-lg text-dark-500 max-w-2xl mx-auto">
                Over 90% cheaper than Procore. Built for India. Ready in minutes.
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {WHY_BIDDARO.map((item) => (
                <div key={item.title} className="bg-white rounded-2xl p-8 shadow-sm">
                  <div className={`inline-flex p-3 rounded-xl ${item.color} mb-5`}>
                    <item.icon className="w-6 h-6" />
                  </div>
                  <h3 className="text-lg font-bold text-dark-900 mb-2">{item.title}</h3>
                  <p className="text-dark-500 leading-relaxed">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Pricing Summary ───────────────────────────────────────────────── */}
        <section className="py-20 bg-white">
          <div className="max-w-4xl mx-auto px-4 text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-dark-900 mb-4">
              Simple, Affordable Pricing
            </h2>
            <p className="text-lg text-dark-500 mb-12">
              Pay only for what you use. No annual contracts. No per-seat fees.
            </p>
            <div className="bg-gradient-to-br from-brand-600 to-brand-700 rounded-3xl p-10 text-white text-center mb-10 shadow-xl">
              <p className="text-brand-200 font-medium mb-2">Full ERP Suite (all 4 modules)</p>
              <p className="text-6xl font-bold mb-2">$40<span className="text-2xl font-normal text-brand-200">/mo</span></p>
              <p className="text-brand-200 mb-8">vs Procore at $375/month — you save 90%</p>
              <Link
                href="/register?ref=erp"
                className="inline-flex items-center gap-2 bg-white text-brand-700 font-bold px-8 py-4 rounded-xl text-lg hover:bg-brand-50 transition-colors"
              >
                Get Started Free <ArrowRight className="w-5 h-5" />
              </Link>
            </div>
            <p className="text-sm text-dark-400">
              Individual modules available from $7.99/month.{' '}
              <Link href="/erp/pricing" className="text-brand-600 hover:underline font-medium">
                See full pricing →
              </Link>
            </p>
          </div>
        </section>

        {/* ── Use Cases ────────────────────────────────────────────────────── */}
        <section className="py-16 bg-dark-50 border-t border-dark-100">
          <div className="max-w-5xl mx-auto px-4">
            <h2 className="text-2xl font-bold text-dark-900 text-center mb-10">
              Built for Every Construction Business
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
              {[
                { slug: 'home-builders', label: 'Home Builders', icon: '🏠' },
                { slug: 'civil-contractors', label: 'Civil Contractors', icon: '🌉' },
                { slug: 'mep-contractors', label: 'MEP Contractors', icon: '⚡' },
                { slug: 'real-estate-developers', label: 'Real Estate Developers', icon: '🏢' },
                { slug: 'renovation-contractors', label: 'Renovation', icon: '🔨' },
              ].map((seg) => (
                <Link
                  key={seg.slug}
                  href={`/erp/for/${seg.slug}`}
                  className="bg-white rounded-xl p-5 text-center hover:shadow-md transition-shadow border border-dark-100"
                >
                  <p className="text-3xl mb-2">{seg.icon}</p>
                  <p className="text-sm font-semibold text-dark-700">{seg.label}</p>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* ── Comparison links ──────────────────────────────────────────────── */}
        <section className="py-16 bg-white border-t border-dark-100">
          <div className="max-w-4xl mx-auto px-4 text-center">
            <h2 className="text-2xl font-bold text-dark-900 mb-4">
              How Does Biddaro Compare?
            </h2>
            <p className="text-dark-500 mb-8">
              See how Biddaro ERP stacks up against leading construction software.
            </p>
            <div className="flex flex-wrap justify-center gap-3">
              {[
                { slug: 'procore', label: 'Biddaro vs Procore' },
                { slug: 'buildertrend', label: 'Biddaro vs Buildertrend' },
                { slug: 'fieldwire', label: 'Biddaro vs Fieldwire' },
                { slug: 'excel', label: 'Biddaro vs Excel' },
              ].map((cmp) => (
                <Link
                  key={cmp.slug}
                  href={`/erp/vs/${cmp.slug}`}
                  className="px-5 py-2.5 border border-dark-200 rounded-full text-sm font-medium text-dark-600 hover:border-brand-300 hover:text-brand-600 transition-colors"
                >
                  {cmp.label}
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* ── FAQ ──────────────────────────────────────────────────────────── */}
        <section className="py-20 bg-dark-50 border-t border-dark-100">
          <div className="max-w-3xl mx-auto px-4">
            <h2 className="text-3xl font-bold text-dark-900 text-center mb-12">
              Frequently Asked Questions
            </h2>
            <div className="space-y-4">
              {FAQS.map((faq) => (
                <details
                  key={faq.q}
                  className="bg-white border border-dark-100 rounded-xl overflow-hidden group"
                >
                  <summary className="flex items-center justify-between px-6 py-5 cursor-pointer font-semibold text-dark-800 list-none">
                    {faq.q}
                    <ChevronDown className="w-5 h-5 text-dark-400 group-open:rotate-180 transition-transform flex-shrink-0" />
                  </summary>
                  <div className="px-6 pb-5 text-dark-500 leading-relaxed border-t border-dark-50 pt-4">
                    {faq.a}
                  </div>
                </details>
              ))}
            </div>
            <p className="text-center mt-8 text-dark-500">
              More questions?{' '}
              <Link href="/erp/faq" className="text-brand-600 hover:underline font-medium">
                Browse the full ERP FAQ →
              </Link>
            </p>
          </div>
        </section>

        {/* ── Final CTA ────────────────────────────────────────────────────── */}
        <section className="py-20 bg-brand-600 text-white text-center">
          <div className="max-w-3xl mx-auto px-4">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Ready to Digitize Your Construction Business?
            </h2>
            <p className="text-brand-200 text-lg mb-10">
              Join 10,000+ contractors across India, UAE, and Singapore who manage their
              projects on Biddaro. Start free — upgrade when you are ready.
            </p>
            <Link
              href="/register?ref=erp"
              className="inline-flex items-center gap-2 bg-white text-brand-700 font-bold px-10 py-5 rounded-xl text-xl hover:bg-brand-50 transition-colors"
            >
              Create Free Account <ArrowRight className="w-6 h-6" />
            </Link>
          </div>
        </section>

      </main>
    </>
  );
}
