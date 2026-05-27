import type { Metadata } from 'next';
import Link from 'next/link';
import { ChevronRight, Shield, CheckCircle, ArrowRight, AlertCircle, Lock, BadgeCheck } from 'lucide-react';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';

export const metadata: Metadata = {
  title: 'RBI Compliance & Regulatory Framework | Biddaro',
  description: 'Biddaro operates with RBI-compliant lending partners in India. Learn about our regulatory framework, lender verification process, borrower protections, and RBI Fair Practice Code adherence.',
  keywords: ['RBI compliant lender india', 'biddaro RBI', 'RBI fair practice code', 'NBFC compliant loan india'],
  alternates: { canonical: 'https://biddaro.com/about/rbi-compliance' },
  openGraph: {
    title: 'RBI Compliance & Regulatory Framework | Biddaro',
    description: 'Biddaro works exclusively with RBI-registered and NBFC-compliant lenders. Our borrower protection framework explained.',
    url: 'https://biddaro.com/about/rbi-compliance',
    type: 'website',
  },
};

const breadcrumb = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Home',        item: 'https://biddaro.com' },
    { '@type': 'ListItem', position: 2, name: 'About',       item: 'https://biddaro.com/about' },
    { '@type': 'ListItem', position: 3, name: 'RBI Compliance', item: 'https://biddaro.com/about/rbi-compliance' },
  ],
};

const orgSchema = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: 'Biddaro',
  url: 'https://biddaro.com',
  description: 'Biddaro is India\'s construction loan marketplace connecting borrowers with RBI-registered and NBFC-compliant lenders.',
  knowsAbout: [
    'RBI Fair Practice Code',
    'NBFC Regulations India',
    'Home Construction Loans',
    'Borrower Protection',
    'KYC Compliance',
  ],
};

export default function RBICompliancePage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(orgSchema) }} />
      <Navbar />

      <main className="min-h-screen bg-white">
        {/* Breadcrumb */}
        <div className="bg-gray-50 border-b border-gray-200">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 py-3">
            <nav className="flex items-center gap-1.5 text-sm text-gray-500">
              <Link href="/" className="hover:text-orange-600">Home</Link>
              <ChevronRight className="w-3.5 h-3.5" />
              <Link href="/about" className="hover:text-orange-600">About</Link>
              <ChevronRight className="w-3.5 h-3.5" />
              <span className="text-gray-900 font-medium">RBI Compliance</span>
            </nav>
          </div>
        </div>

        {/* Hero */}
        <section className="bg-gradient-to-br from-green-50 to-emerald-50 border-b border-green-100 py-14">
          <div className="max-w-4xl mx-auto px-4 sm:px-6">
            <div className="inline-flex items-center gap-2 bg-green-100 text-green-700 text-xs font-semibold px-3 py-1 rounded-full mb-4">
              <Shield className="w-3.5 h-3.5" />
              Regulatory Compliance
            </div>
            <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              RBI Compliance & Regulatory Framework
            </h1>
            <p className="text-gray-600 text-base sm:text-lg max-w-3xl mb-6">
              Biddaro is India&rsquo;s construction loan marketplace. We connect borrowers with verified,
              RBI-registered, and NBFC-compliant lenders. This page explains our regulatory framework,
              lender verification process, and the protections available to every borrower on our platform.
            </p>
            <div className="flex flex-wrap gap-4">
              <div className="flex items-center gap-2 bg-white border border-green-200 rounded-xl px-4 py-2 text-sm">
                <BadgeCheck className="w-4 h-4 text-green-600" />
                <span className="text-gray-700 font-medium">RBI-Compliant Lenders</span>
              </div>
              <div className="flex items-center gap-2 bg-white border border-green-200 rounded-xl px-4 py-2 text-sm">
                <Lock className="w-4 h-4 text-green-600" />
                <span className="text-gray-700 font-medium">Secured by Razorpay</span>
              </div>
              <div className="flex items-center gap-2 bg-white border border-green-200 rounded-xl px-4 py-2 text-sm">
                <Shield className="w-4 h-4 text-green-600" />
                <span className="text-gray-700 font-medium">KYC-Verified Process</span>
              </div>
            </div>
          </div>
        </section>

        {/* Main Content */}
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12 space-y-12">

          {/* Biddaro's Role */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Biddaro&rsquo;s Role — Loan Service Provider (LSP)</h2>
            <div className="bg-blue-50 border border-blue-200 rounded-2xl p-6 mb-6">
              <p className="text-gray-700 text-sm sm:text-base leading-relaxed">
                Biddaro operates as a <strong>Loan Service Provider (LSP)</strong> and Digital Lending Platform
                as defined under the Reserve Bank of India&rsquo;s Digital Lending Guidelines (RBI/2022-23/111,
                September 2022). We do <strong>not</strong> directly lend money. Instead, we act as a
                technology intermediary that connects borrowers with verified, regulated financial entities —
                including Scheduled Commercial Banks, Non-Banking Financial Companies (NBFCs) registered with
                the RBI, and Housing Finance Companies (HFCs) registered with the National Housing Bank (NHB).
              </p>
            </div>
            <div className="grid sm:grid-cols-2 gap-4">
              {[
                { title: 'What Biddaro Does', items: ['Collects loan applications from borrowers', 'Verifies basic KYC and income documentation', 'Matches applications to suitable regulated lenders', 'Facilitates the loan sanction and documentation process', 'Provides post-disbursement support and communication'] },
                { title: 'What Biddaro Does NOT Do', items: ['Directly disburse or lend funds', 'Hold deposits or accept investments', 'Guarantee loan approval or interest rates', 'Make credit decisions independently', 'Charge any hidden fees beyond the disclosed ₹100/month subscription'] },
              ].map(({ title, items }) => (
                <div key={title} className="border border-gray-200 rounded-xl p-5">
                  <h3 className="font-semibold text-gray-900 mb-3">{title}</h3>
                  <ul className="space-y-2">
                    {items.map((item, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm text-gray-600">
                        <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 shrink-0" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </section>

          {/* Lender Verification */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Our Lender Verification Process</h2>
            <p className="text-gray-700 mb-6">
              Every lender in Biddaro&rsquo;s network must pass a multi-step verification process before being
              allowed to receive borrower applications:
            </p>
            <div className="space-y-4">
              {[
                { step: '01', title: 'Regulatory Registration Check', desc: 'We verify the lender\'s registration with the Reserve Bank of India (for NBFCs) or the National Housing Bank (for HFCs) through the official RBI/NHB CERSAI databases. Only regulated entities are onboarded.' },
                { step: '02', title: 'RBI Fair Practices Code Adherence', desc: 'Lenders must confirm compliance with the RBI\'s Fair Practices Code for lenders — including transparent interest rate disclosure, no prepayment charges on floating rate loans, and proper grievance redressal mechanisms.' },
                { step: '03', title: 'KYC & AML Compliance', desc: 'Lenders must have a documented KYC (Know Your Customer) and AML (Anti-Money Laundering) compliance framework certified by their compliance officer, as required by PMLA 2002 and RBI KYC Master Directions 2016.' },
                { step: '04', title: 'Digital Lending Guidelines Compliance', desc: 'All lenders confirm compliance with RBI\'s Digital Lending Guidelines 2022 — including disbursement directly to borrower accounts (no pooling in LSP accounts), Key Fact Statement (KFS) provision, and Annual Percentage Rate (APR) disclosure.' },
                { step: '05', title: 'Grievance Redressal', desc: 'Lenders must have a dedicated Nodal Officer and a public-facing grievance redressal mechanism accessible to borrowers at all times, as required by RBI guidelines.' },
              ].map(({ step, title, desc }) => (
                <div key={step} className="flex gap-4 border border-gray-200 rounded-xl p-5">
                  <div className="w-10 h-10 bg-green-100 text-green-700 rounded-full flex items-center justify-center text-sm font-bold shrink-0">{step}</div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1">{title}</h3>
                    <p className="text-sm text-gray-600">{desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Borrower Protections */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Your Rights as a Borrower</h2>
            <p className="text-gray-700 mb-6">
              Under RBI&rsquo;s Digital Lending Guidelines 2022 and the Fair Practices Code, every borrower in India
              has the following rights:
            </p>
            <div className="grid sm:grid-cols-2 gap-4">
              {[
                { title: 'Key Fact Statement (KFS)', desc: 'Before signing any loan agreement, you are entitled to receive a Key Fact Statement showing all fees, charges, APR, and terms in a standardised format.' },
                { title: 'No Prepayment Penalty', desc: 'For floating rate loans (the most common type in India), you have the right to prepay or foreclose the loan at any time without any penalty charges, as mandated by RBI.' },
                { title: 'Direct Disbursement', desc: 'All loan amounts must be disbursed directly to your bank account — never to the LSP or intermediary. You have the right to refuse if this is not followed.' },
                { title: 'Transparent APR', desc: 'You have the right to know the Annual Percentage Rate (APR) — the true cost of your loan including all fees and charges, not just the quoted interest rate.' },
                { title: 'Grievance Redressal', desc: 'Every regulated lender must have a Nodal Officer. If your grievance is not resolved in 30 days, you can escalate to the RBI Banking Ombudsman at cms.rbi.org.in.' },
                { title: 'Data Privacy', desc: 'Lenders can only access data on your device with your explicit consent. Data collection must be purpose-limited and disclosed upfront per RBI\'s Digital Lending Guidelines.' },
              ].map(({ title, desc }) => (
                <div key={title} className="flex items-start gap-3 border border-gray-200 rounded-xl p-4">
                  <Shield className="w-5 h-5 text-green-500 mt-0.5 shrink-0" />
                  <div>
                    <p className="font-semibold text-gray-900 text-sm mb-1">{title}</p>
                    <p className="text-xs text-gray-600 leading-relaxed">{desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Data Security */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Data Security & Payment Security</h2>
            <div className="bg-gray-50 rounded-2xl p-6 space-y-4">
              <div className="flex items-start gap-3">
                <Lock className="w-5 h-5 text-orange-500 mt-0.5 shrink-0" />
                <div>
                  <p className="font-semibold text-gray-900 text-sm mb-1">Razorpay-Secured Payments</p>
                  <p className="text-sm text-gray-600">All subscription payments on Biddaro are processed through Razorpay — a PCI-DSS Level 1 certified payment gateway licensed by the Reserve Bank of India under the Payment and Settlement Systems Act 2007. Card details and banking credentials are never stored on Biddaro&rsquo;s servers.</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Lock className="w-5 h-5 text-orange-500 mt-0.5 shrink-0" />
                <div>
                  <p className="font-semibold text-gray-900 text-sm mb-1">SSL/TLS Encryption</p>
                  <p className="text-sm text-gray-600">All data transmitted through biddaro.com is encrypted using TLS 1.3 (the industry&rsquo;s highest standard). Your personal and financial information is encrypted in transit and at rest.</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Lock className="w-5 h-5 text-orange-500 mt-0.5 shrink-0" />
                <div>
                  <p className="font-semibold text-gray-900 text-sm mb-1">KYC Data Handling</p>
                  <p className="text-sm text-gray-600">KYC documents (Aadhaar, PAN) collected during loan applications are shared only with the matched lender for the purpose of loan processing. They are never sold or shared with third parties for marketing purposes. This complies with the RBI&rsquo;s KYC Master Directions 2016 (updated).</p>
                </div>
              </div>
            </div>
          </section>

          {/* Grievance */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Grievance Redressal</h2>
            <div className="bg-orange-50 border border-orange-200 rounded-2xl p-6 mb-4">
              <div className="flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-orange-500 mt-0.5 shrink-0" />
                <div>
                  <p className="font-semibold text-orange-900 mb-2">If you have a complaint about a loan or our service:</p>
                  <ol className="text-sm text-gray-700 space-y-2 list-decimal list-inside">
                    <li>Contact Biddaro customer support at biddaro.com/contact — we resolve most issues within 24 hours.</li>
                    <li>If unresolved within 7 days, contact the lender&rsquo;s Nodal Officer directly (details provided in your loan sanction letter).</li>
                    <li>If unresolved within 30 days, escalate to the RBI Banking Ombudsman at cms.rbi.org.in or call 14448.</li>
                  </ol>
                </div>
              </div>
            </div>
            <p className="text-sm text-gray-500">
              Biddaro&rsquo;s internal grievance officer can be reached at <strong>legal@biddaro.com</strong>. We aim to acknowledge all complaints within 24 hours and resolve them within 7 working days.
            </p>
          </section>

          {/* Disclaimer */}
          <section className="bg-gray-50 border border-gray-200 rounded-2xl p-6">
            <h2 className="text-lg font-bold text-gray-900 mb-3">Important Disclaimer</h2>
            <p className="text-sm text-gray-600 leading-relaxed">
              Biddaro is a technology platform and loan marketplace. We are not a bank, NBFC, or financial institution. We do not provide any investment advice, and nothing on this platform constitutes investment advice. Loan approval decisions are made solely by the lending institution and are subject to their internal credit policies, KYC verification, and applicable RBI/NHB regulations. Interest rates and loan amounts displayed are indicative and may vary based on your credit profile and lender&rsquo;s assessment. Biddaro charges a ₹100/month subscription fee for its loan matching and application management service, which is separate from and in addition to any fees charged by the lending institution. This service fee is disclosed upfront and is non-refundable once the loan application is submitted to a lender.
            </p>
          </section>
        </div>

        {/* CTA */}
        <section className="bg-green-600 py-12">
          <div className="max-w-3xl mx-auto px-4 text-center">
            <h2 className="text-2xl font-bold text-white mb-3">Apply with Confidence</h2>
            <p className="text-green-100 mb-6 text-sm">
              Biddaro connects you only with verified, RBI-compliant lenders. Secured by Razorpay.
            </p>
            <Link
              href="/loan-apply"
              className="inline-flex items-center gap-2 bg-white text-green-700 font-bold px-6 py-3 rounded-xl hover:bg-green-50 transition-colors"
            >
              Apply for a Loan — ₹100/month
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
