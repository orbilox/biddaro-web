import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ChevronRight, ArrowRight, FileText, CheckCircle } from 'lucide-react';
import { LOAN_TYPES_SEO, getLoanType } from '@/lib/loan-data';

interface Props { params: { type: string } }

export function generateStaticParams() {
  return LOAN_TYPES_SEO.map(l => ({ type: l.slug }));
}

// Document sets — a shared base plus loan-type-specific extras.
const BASE_DOCS = [
  { label: 'Identity proof', value: 'Aadhaar card, PAN card, passport, voter ID or driving licence' },
  { label: 'Address proof', value: 'Aadhaar, utility bill, rent agreement or passport' },
  { label: 'Passport-size photographs', value: '2–4 recent colour photographs' },
];
const SALARIED_DOCS = [
  { label: 'Income proof (salaried)', value: 'Last 3 months salary slips + Form 16 / latest ITR' },
  { label: 'Bank statements', value: 'Last 6 months salary-account bank statements' },
  { label: 'Employment proof', value: 'Employee ID card or appointment/confirmation letter' },
];
const SELF_EMPLOYED_DOCS = [
  { label: 'Income proof (self-employed)', value: 'Last 2 years ITR with computation of income' },
  { label: 'Business bank statements', value: 'Last 12 months current-account statements' },
  { label: 'Business proof', value: 'GST registration, Udyam/MSME certificate or shop licence' },
];
const SECURED_EXTRA = [
  { label: 'Property / asset documents', value: 'Title deed, sale agreement, approved plan or asset invoice for the financed property/equipment' },
];

function docsFor(id: string) {
  const secured = id !== 'personal';
  const isBusiness = ['business', 'working_capital', 'equipment'].includes(id);
  return [
    ...BASE_DOCS,
    ...(isBusiness ? SELF_EMPLOYED_DOCS : SALARIED_DOCS),
    ...(secured ? SECURED_EXTRA : []),
  ];
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const loan = getLoanType(params.type);
  if (!loan) return {};
  const yr = new Date().getFullYear();
  const title = `Documents Required for ${loan.name} ${yr} — Full Checklist | Biddaro`;
  const description = `Complete list of documents required for a ${loan.name.toLowerCase()} in India (${yr}) — identity, address, income, bank statements${loan.id !== 'personal' ? ' and property/asset papers' : ''}. Check the checklist and apply online with Biddaro.`;
  return {
    title, description,
    keywords: [
      `documents required for ${loan.name.toLowerCase()}`,
      `${loan.name.toLowerCase()} documents list`,
      `${loan.name.toLowerCase()} eligibility documents`,
      `papers needed for ${loan.name.toLowerCase()} india`,
    ],
    alternates: { canonical: `https://biddaro.com/loans/${loan.slug}/documents` },
    openGraph: { title, description, url: `https://biddaro.com/loans/${loan.slug}/documents`, type: 'article' },
  };
}

export default function LoanDocumentsPage({ params }: Props) {
  const loan = getLoanType(params.type);
  if (!loan) notFound();
  const yr = new Date().getFullYear();
  const docs = docsFor(loan.id);

  const faqs = [
    { q: `What documents are required for a ${loan.name.toLowerCase()}?`, a: `You need identity proof (Aadhaar/PAN), address proof, income proof (${['business', 'working_capital', 'equipment'].includes(loan.id) ? 'ITR + business bank statements' : 'salary slips + bank statements'})${loan.id !== 'personal' ? ', and property/asset documents' : ''}. See the full checklist above.` },
    { q: `Is PAN card mandatory for a ${loan.name.toLowerCase()}?`, a: `Yes. PAN is mandatory for loan applications in India as lenders use it to check your CIBIL score and for KYC compliance.` },
    { q: `Can I apply for a ${loan.name.toLowerCase()} without income proof?`, a: `Income proof is required by lenders to assess repayment capacity. Self-employed applicants can submit ITR and bank statements instead of salary slips.` },
  ];

  const breadcrumbSchema = {
    '@context': 'https://schema.org', '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://biddaro.com' },
      { '@type': 'ListItem', position: 2, name: 'Loans', item: 'https://biddaro.com/loans' },
      { '@type': 'ListItem', position: 3, name: loan.name, item: `https://biddaro.com/loans/${loan.slug}` },
      { '@type': 'ListItem', position: 4, name: 'Documents Required', item: `https://biddaro.com/loans/${loan.slug}/documents` },
    ],
  };
  const faqSchema = {
    '@context': 'https://schema.org', '@type': 'FAQPage',
    mainEntity: faqs.map(f => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a } })),
  };
  const articleSchema = {
    '@context': 'https://schema.org', '@type': 'Article',
    headline: `Documents Required for ${loan.name} (${yr})`,
    author: { '@type': 'Organization', name: 'Biddaro' },
    publisher: { '@type': 'Organization', name: 'Biddaro', url: 'https://biddaro.com' },
    mainEntityOfPage: `https://biddaro.com/loans/${loan.slug}/documents`,
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }} />

      <header className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-gray-100 h-16 flex items-center px-4">
        <div className="max-w-6xl mx-auto w-full flex items-center justify-between">
          <Link href="/" className="font-bold text-xl text-gray-900">Biddaro</Link>
          <Link href="/loan-apply">
            <button className="bg-orange-500 hover:bg-orange-600 text-white text-sm font-semibold px-4 py-2 rounded-xl transition-colors">Apply Now</button>
          </Link>
        </div>
      </header>

      <div className="bg-white border-b border-gray-100 py-3 px-4 pt-20">
        <div className="max-w-4xl mx-auto">
          <nav className="flex items-center gap-1 text-sm text-gray-500 flex-wrap">
            <Link href="/" className="hover:text-gray-700">Home</Link>
            <ChevronRight className="w-3.5 h-3.5" />
            <Link href="/loans" className="hover:text-gray-700">Loans</Link>
            <ChevronRight className="w-3.5 h-3.5" />
            <Link href={`/loans/${loan.slug}`} className="hover:text-gray-700">{loan.name}</Link>
            <ChevronRight className="w-3.5 h-3.5" />
            <span className="text-gray-900 font-medium">Documents</span>
          </nav>
        </div>
      </div>

      <section className="bg-gradient-to-br from-gray-900 to-gray-800 text-white py-12 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="inline-flex items-center gap-2 bg-orange-500/20 border border-orange-500/30 text-orange-300 text-sm font-medium px-3 py-1.5 rounded-full mb-4">
            <FileText className="w-3.5 h-3.5" /> {loan.emoji} Document Checklist · {yr}
          </div>
          <h1 className="text-3xl md:text-4xl font-bold mb-3">Documents Required for {loan.name}</h1>
          <p className="text-gray-300 max-w-2xl">Keep these documents ready to speed up your {loan.name.toLowerCase()} approval. Exact requirements may vary slightly by lender.</p>
        </div>
      </section>

      <section className="py-12 px-4 bg-white">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">{loan.name} — Document Checklist</h2>
          <div className="space-y-3">
            {docs.map(d => (
              <div key={d.label} className="flex items-start gap-3 p-4 bg-gray-50 rounded-xl">
                <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-gray-900">{d.label}</p>
                  <p className="text-sm text-gray-600">{d.value}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-8 text-center">
            <Link href="/loan-apply">
              <button className="bg-orange-500 hover:bg-orange-600 text-white font-semibold px-8 py-3.5 rounded-xl transition-colors inline-flex items-center gap-2">
                Apply for {loan.name} <ArrowRight className="w-4 h-4" />
              </button>
            </Link>
          </div>
        </div>
      </section>

      <section className="py-12 px-4 bg-gray-50">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">{loan.name} Documents — FAQs</h2>
          <div className="space-y-4">
            {faqs.map((f, i) => (
              <details key={i} className="border border-gray-200 rounded-xl overflow-hidden bg-white">
                <summary className="flex items-center justify-between p-4 cursor-pointer text-sm font-medium text-gray-900 hover:bg-gray-50">{f.q}</summary>
                <div className="px-4 pb-4 pt-2 text-sm text-gray-600 border-t border-gray-100">{f.a}</div>
              </details>
            ))}
          </div>
          <div className="mt-8 flex flex-wrap justify-center gap-3 text-sm">
            <Link href={`/loans/${loan.slug}`} className="text-orange-600 hover:underline">{loan.name} overview</Link>
            <Link href={`/loans/${loan.slug}/interest-rates`} className="text-orange-600 hover:underline">{loan.name} interest rates</Link>
            <Link href="/loans" className="text-orange-600 hover:underline">All loans</Link>
          </div>
        </div>
      </section>

      <footer className="bg-gray-900 text-gray-400 py-8 px-4 text-center text-sm">
        <div className="max-w-6xl mx-auto">
          <p className="mb-2"><Link href="/" className="text-white font-semibold">Biddaro</Link>{' '}— Construction Marketplace &amp; Finance Platform · India</p>
          <p className="text-xs mt-2 max-w-2xl mx-auto text-gray-600">Document requirements are indicative and may vary by lender under RBI guidelines.</p>
        </div>
      </footer>
    </div>
  );
}
