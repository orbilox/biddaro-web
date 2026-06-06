import React from 'react';
import Link from 'next/link';
import type { Metadata } from 'next';
import { CheckCircle, ArrowRight, Zap } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Construction ERP Pricing — Affordable Plans for Contractors | Biddaro',
  description:
    'Biddaro ERP starts at $7.99/month. Pay only for the modules you need — Site Manager, Project Manager, Build Planner, and Project Tracking. INR pricing available. No annual commitment.',
  keywords: [
    'construction ERP pricing',
    'construction management software cost',
    'affordable construction ERP India',
    'Biddaro ERP plans',
    'construction software pricing India',
  ],
  alternates: { canonical: 'https://biddaro.com/erp/pricing' },
  openGraph: {
    title: 'Construction ERP Pricing | Biddaro',
    description: 'Transparent, module-based pricing for construction ERP. Start at $7.99/month. INR pricing available.',
    url: 'https://biddaro.com/erp/pricing',
  },
};

const MODULES = [
  {
    name: 'Project Tracking',
    slug: 'project-tracking',
    price: '$7.99',
    priceINR: '₹660',
    description: 'Live progress updates, photo logs, milestone tracking, and client-facing status reports.',
    features: [
      'Real-time project status dashboard',
      'Photo documentation and photo logs',
      'Milestone tracking and deadlines',
      'Client portal with progress visibility',
      'Progress percentage by task and phase',
    ],
    cta: 'Start with Tracking',
  },
  {
    name: 'Project Manager',
    slug: 'project-manager',
    price: '$9.99',
    priceINR: '₹830',
    description: 'Kanban boards, task management, sub-tasks, deadlines, and contractor coordination tools.',
    features: [
      'Kanban project boards',
      'Task assignment and sub-tasks',
      'Contractor and team coordination',
      'Deadline and priority management',
      'Linked to Project Tracking',
    ],
    cta: 'Start Managing Projects',
  },
  {
    name: 'Build Planner',
    slug: 'build-planner',
    price: '$11.99',
    priceINR: '₹995',
    description: 'Home construction planner with checklists, blueprint management, and material planning.',
    features: [
      'Construction phase checklists',
      'Blueprint and document storage',
      'Material planning and estimates',
      'Vendor and procurement tracking',
      'Phase-by-phase completion reporting',
    ],
    cta: 'Start Planning Builds',
  },
  {
    name: 'Site Manager',
    slug: 'site-manager',
    price: '$12.99',
    priceINR: '₹1,080',
    description: 'Full site management — labor, BOQ, DPR, attendance, equipment, and P&L tracking.',
    features: [
      'Labor attendance tracking (biometric/manual)',
      'BOQ management and variation orders',
      'Daily Progress Report (DPR) submission',
      'Equipment and material tracking',
      'Site P&L and cash flow reports',
      'Client portal and photo documentation',
    ],
    cta: 'Start Managing Sites',
    recommended: true,
  },
];

const SUITE_PRICE = '$39.99';
const SUITE_PRICE_INR = '₹3,320';
const COMPETITOR_PRICE = '$375';

const FAQS = [
  {
    q: 'Do I pay for each module separately?',
    a: 'Yes, Biddaro ERP uses a module-based pricing model. You only pay for the modules you use. The full suite bundle (all 4 modules) is available at a discounted rate compared to purchasing each module individually.',
  },
  {
    q: 'Is there a free trial?',
    a: 'Yes. You can start a free trial with no credit card required. The trial gives you full access to all modules so you can test Biddaro ERP with your own projects before committing to a plan.',
  },
  {
    q: 'Is there INR pricing for Indian contractors?',
    a: 'Yes. All plans are available in INR and can be paid via Razorpay using UPI, credit/debit cards, or net banking. INR prices are displayed at checkout based on current conversion rates.',
  },
  {
    q: 'Can I cancel anytime?',
    a: 'Yes. Biddaro ERP subscriptions are month-to-month with no annual commitment. You can cancel or downgrade at any time from your account settings.',
  },
  {
    q: 'How does Biddaro compare to Procore or Buildertrend in pricing?',
    a: 'Procore starts at $375/month and Buildertrend at $199/month. Biddaro ERP\'s full suite is $39.99/month — 90% less than Procore — with features specifically designed for Indian and emerging-market contractors rather than large US general contractors.',
  },
];

export default function ErpPricingPage() {
  const breadcrumbJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://biddaro.com' },
      { '@type': 'ListItem', position: 2, name: 'ERP', item: 'https://biddaro.com/erp' },
      { '@type': 'ListItem', position: 3, name: 'Pricing', item: 'https://biddaro.com/erp/pricing' },
    ],
  };

  const faqJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: FAQS.map((faq) => ({
      '@type': 'Question',
      name: faq.q,
      acceptedAnswer: { '@type': 'Answer', text: faq.a },
    })),
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />

      <main className="min-h-screen bg-white">
        {/* Breadcrumb */}
        <div className="border-b border-dark-100">
          <div className="max-w-5xl mx-auto px-4 py-3 flex items-center gap-2 text-sm text-dark-400">
            <Link href="/" className="hover:text-brand-600">Home</Link>
            <span>/</span>
            <Link href="/erp" className="hover:text-brand-600">ERP</Link>
            <span>/</span>
            <span className="text-dark-700 font-medium">Pricing</span>
          </div>
        </div>

        {/* Hero */}
        <section className="bg-gradient-to-br from-brand-50 to-white border-b border-dark-100">
          <div className="max-w-4xl mx-auto px-4 py-16 text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-dark-900 mb-5">
              Construction ERP That Fits Every Budget
            </h1>
            <p className="text-lg text-dark-500 max-w-2xl mx-auto mb-6 leading-relaxed">
              Pay only for what you use. Start with one module and add more as you grow.
              No annual commitment. Cancel anytime.
            </p>
            <div className="inline-flex items-center gap-2 bg-amber-50 border border-amber-200 rounded-xl px-5 py-3 text-sm font-medium text-amber-800">
              <Zap className="w-4 h-4" />
              Full suite at {SUITE_PRICE}/mo — vs {COMPETITOR_PRICE}/mo for Procore
            </div>
          </div>
        </section>

        {/* Module pricing cards */}
        <section className="py-16 bg-white">
          <div className="max-w-5xl mx-auto px-4">
            <div className="grid md:grid-cols-2 gap-6">
              {MODULES.map((mod) => (
                <div
                  key={mod.slug}
                  className={`relative rounded-2xl border p-8 ${mod.recommended ? 'border-brand-400 shadow-lg shadow-brand-100' : 'border-dark-100'}`}
                >
                  {mod.recommended && (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                      <span className="bg-brand-600 text-white text-xs font-bold px-4 py-1 rounded-full">Most Popular</span>
                    </div>
                  )}
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h2 className="text-xl font-bold text-dark-900">{mod.name}</h2>
                      <p className="text-dark-500 text-sm mt-1">{mod.description}</p>
                    </div>
                  </div>
                  <div className="mb-6">
                    <span className="text-4xl font-bold text-dark-900">{mod.price}</span>
                    <span className="text-dark-400 ml-1">/month</span>
                    <p className="text-sm text-dark-400 mt-1">{mod.priceINR}/month in INR</p>
                  </div>
                  <ul className="space-y-3 mb-8">
                    {mod.features.map((f) => (
                      <li key={f} className="flex items-start gap-2.5 text-dark-600 text-sm">
                        <CheckCircle className="w-4 h-4 text-brand-600 flex-shrink-0 mt-0.5" />
                        {f}
                      </li>
                    ))}
                  </ul>
                  <Link
                    href={`/register?ref=erp-pricing&module=${mod.slug}`}
                    className={`block text-center font-semibold px-6 py-3 rounded-xl transition-colors ${
                      mod.recommended
                        ? 'bg-brand-600 hover:bg-brand-700 text-white'
                        : 'border border-brand-300 text-brand-700 hover:bg-brand-50'
                    }`}
                  >
                    {mod.cta}
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Bundle CTA */}
        <section className="py-12 bg-dark-900 text-white">
          <div className="max-w-4xl mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-8">
            <div>
              <h2 className="text-2xl font-bold mb-2">Full Suite Bundle</h2>
              <p className="text-dark-300 max-w-xl">
                Get all 4 modules — Site Manager, Project Manager, Build Planner, and Project Tracking
                — at one bundled price. Best value for contractors managing multiple sites.
              </p>
            </div>
            <div className="flex-shrink-0 text-center">
              <p className="text-4xl font-bold">{SUITE_PRICE}</p>
              <p className="text-dark-400 text-sm mt-1">{SUITE_PRICE_INR}/month in INR</p>
              <Link
                href="/register?ref=erp-pricing-bundle"
                className="mt-4 inline-flex items-center gap-2 bg-brand-500 hover:bg-brand-400 text-white font-bold px-8 py-3.5 rounded-xl transition-colors"
              >
                Get Full Suite <ArrowRight className="w-5 h-5" />
              </Link>
            </div>
          </div>
        </section>

        {/* Comparison bar */}
        <section className="py-12 bg-white border-b border-dark-100">
          <div className="max-w-4xl mx-auto px-4">
            <h2 className="text-2xl font-bold text-dark-900 mb-8 text-center">How Biddaro Compares</h2>
            <div className="overflow-x-auto rounded-2xl border border-dark-100">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-dark-50 border-b border-dark-100">
                    <th className="text-left px-6 py-4 font-semibold text-dark-600">Platform</th>
                    <th className="text-center px-6 py-4 font-semibold text-dark-600">Starting Price</th>
                    <th className="text-center px-6 py-4 font-semibold text-dark-600">India/INR Support</th>
                    <th className="text-center px-6 py-4 font-semibold text-dark-600">Free Trial</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    { name: 'Biddaro ERP', price: '$7.99/mo', india: '✓ Full INR + Razorpay', trial: '✓ Yes', highlight: true },
                    { name: 'Procore', price: '$375/mo', india: '✗ No INR', trial: '✗ No' },
                    { name: 'Buildertrend', price: '$199/mo', india: '✗ No INR', trial: 'Limited demo' },
                    { name: 'Fieldwire', price: '$54/mo', india: '✗ No INR', trial: '✓ Yes' },
                    { name: 'Excel / Spreadsheets', price: 'Free', india: 'Manual only', trial: 'N/A' },
                  ].map((row, i) => (
                    <tr key={row.name} className={`border-b border-dark-50 ${row.highlight ? 'bg-brand-50' : i % 2 === 0 ? 'bg-white' : 'bg-dark-50/30'}`}>
                      <td className={`px-6 py-4 font-medium ${row.highlight ? 'text-brand-700' : 'text-dark-700'}`}>{row.name}</td>
                      <td className={`px-6 py-4 text-center ${row.highlight ? 'font-bold text-brand-700' : 'text-dark-500'}`}>{row.price}</td>
                      <td className={`px-6 py-4 text-center ${row.highlight ? 'text-green-600 font-semibold' : 'text-dark-500'}`}>{row.india}</td>
                      <td className={`px-6 py-4 text-center ${row.highlight ? 'text-green-600 font-semibold' : 'text-dark-500'}`}>{row.trial}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="text-center mt-4">
              <Link href="/erp/vs" className="text-sm text-brand-600 hover:underline font-medium">
                See full feature comparisons →
              </Link>
            </p>
          </div>
        </section>

        {/* FAQ */}
        <section className="py-16 bg-dark-50">
          <div className="max-w-3xl mx-auto px-4">
            <h2 className="text-2xl font-bold text-dark-900 mb-8 text-center">Pricing FAQ</h2>
            <div className="space-y-4">
              {FAQS.map((faq) => (
                <details key={faq.q} className="bg-white border border-dark-100 rounded-xl group">
                  <summary className="flex items-center justify-between px-6 py-5 cursor-pointer font-semibold text-dark-800 list-none">
                    {faq.q}
                    <span className="text-dark-400 group-open:rotate-180 transition-transform flex-shrink-0 text-lg">▾</span>
                  </summary>
                  <div className="px-6 pb-5 text-dark-500 leading-relaxed border-t border-dark-50 pt-4">{faq.a}</div>
                </details>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-16 bg-brand-600 text-white text-center">
          <div className="max-w-2xl mx-auto px-4">
            <h2 className="text-3xl font-bold mb-4">Start Free — No Credit Card</h2>
            <p className="text-brand-200 mb-8">Try all modules free. Upgrade when you are ready.</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/register?ref=erp-pricing" className="inline-flex items-center gap-2 bg-white text-brand-700 font-bold px-8 py-4 rounded-xl hover:bg-brand-50 transition-colors">
                Start Free Trial <ArrowRight className="w-5 h-5" />
              </Link>
              <Link href="/erp" className="inline-flex items-center gap-2 border border-brand-400 text-white font-semibold px-8 py-4 rounded-xl hover:border-white transition-colors">
                View All Features
              </Link>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
