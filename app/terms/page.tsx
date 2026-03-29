import type { Metadata } from 'next';
import Link from 'next/link';
import { FileText, ChevronRight } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Terms of Service | Biddaro',
  description: 'Read Biddaro\'s Terms of Service governing your use of our construction marketplace platform. Covers accounts, job posting, bidding, payments, and more.',
  alternates: { canonical: 'https://biddaro.com/terms' },
  robots: { index: true, follow: true },
};

const LAST_UPDATED = 'March 28, 2026';

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-gray-50">

      {/* Header */}
      <div className="bg-gradient-to-br from-dark-900 via-dark-800 to-brand-900 py-14 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center gap-2 text-brand-300 text-sm mb-4">
            <Link href="/" className="hover:text-white transition-colors">Home</Link>
            <ChevronRight className="w-3.5 h-3.5" />
            <span>Terms of Service</span>
          </div>
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-brand-500/20 border border-brand-500/30 flex items-center justify-center">
              <FileText className="w-5 h-5 text-brand-400" />
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-white">Terms of Service</h1>
          </div>
          <p className="text-dark-300">Last updated: {LAST_UPDATED}</p>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-8 md:p-12 prose prose-gray max-w-none">

          <p className="text-dark-600 leading-relaxed">
            These Terms of Service (&quot;Terms&quot;) govern your access to and use of <strong>Biddaro</strong> (&quot;we&quot;, &quot;our&quot;, or &quot;us&quot;), including our website at <strong>biddaro.com</strong> and all related services, features, and content (collectively, the &quot;Platform&quot;). By accessing or using the Platform, you agree to be bound by these Terms. If you do not agree, please do not use the Platform.
          </p>

          <Section title="1. Eligibility">
            <p>You must be at least 18 years of age to use Biddaro. By using the Platform, you represent and warrant that you meet this requirement and that all information you provide is accurate and complete. Biddaro is available to users in India, the United Arab Emirates, Singapore, the United States, and other supported regions.</p>
          </Section>

          <Section title="2. Accounts">
            <ul>
              <li>You must register for an account to post jobs, submit bids, or use premium features.</li>
              <li>You are responsible for maintaining the confidentiality of your login credentials and for all activity under your account.</li>
              <li>You must notify us immediately of any unauthorised use of your account at <a href="mailto:support@biddaro.com" className="text-brand-600 hover:underline">support@biddaro.com</a>.</li>
              <li>We reserve the right to suspend or terminate accounts that violate these Terms.</li>
            </ul>
          </Section>

          <Section title="3. The Marketplace">
            <p>Biddaro is a marketplace platform that connects <strong>job posters</strong> (individuals or businesses seeking construction services) with <strong>contractors</strong> (professionals offering those services). Biddaro does not itself perform any construction work and is not a party to any agreement between job posters and contractors.</p>
            <p>We do not guarantee the quality, safety, legality, or accuracy of any job listing or contractor profile. Users are solely responsible for evaluating contractors and jobs before entering into any agreement.</p>
          </Section>

          <Section title="4. Job Posting">
            <ul>
              <li>Job posters may list construction jobs for free. Premium listings and enhanced visibility are available via paid plans.</li>
              <li>You must provide accurate, complete, and honest descriptions of the work required.</li>
              <li>You may not post jobs that are illegal, dangerous, or violate any applicable laws or regulations.</li>
              <li>Biddaro reserves the right to remove any job listing that violates these Terms or our community guidelines.</li>
            </ul>
          </Section>

          <Section title="5. Bidding & Contractor Conduct">
            <ul>
              <li>Contractors may submit bids on open jobs. Only one active bid per job per contractor is permitted.</li>
              <li>Bids must be honest and based on a genuine assessment of the work required.</li>
              <li>Contractors must hold any licences, permits, or certifications required by local law for the services they offer.</li>
              <li>Contractors may not solicit job posters to transact outside the Biddaro platform.</li>
            </ul>
          </Section>

          <Section title="6. Payments & Escrow">
            <ul>
              <li>Biddaro may offer escrow services to facilitate secure payments between job posters and contractors.</li>
              <li>All payments are processed through our authorised payment providers. We do not store full payment card details.</li>
              <li>Platform service fees may apply to transactions. Applicable fees are displayed at the time of transaction.</li>
              <li>Refunds and dispute resolution are governed by our Escrow & Payment Policy, available in your account settings.</li>
              <li>Currencies supported: INR (India), AED (UAE), SGD (Singapore), USD (USA). Currency conversion rates are set by our payment processor.</li>
            </ul>
          </Section>

          <Section title="7. Premium Subscriptions">
            <p>Biddaro offers premium subscription plans for contractors that provide enhanced visibility and additional features. By subscribing:</p>
            <ul>
              <li>You authorise us to charge your payment method on a recurring basis (monthly or annually, as selected).</li>
              <li>You may cancel your subscription at any time from your account dashboard. Cancellations take effect at the end of the current billing period.</li>
              <li>We reserve the right to modify subscription pricing with reasonable advance notice.</li>
            </ul>
          </Section>

          <Section title="8. Prohibited Conduct">
            <p>You agree not to:</p>
            <ul>
              <li>Post false, misleading, or fraudulent information.</li>
              <li>Impersonate any person or entity.</li>
              <li>Engage in any form of harassment, abuse, or discrimination.</li>
              <li>Use the Platform to transmit spam, malware, or any harmful content.</li>
              <li>Scrape, crawl, or extract data from the Platform without our prior written consent.</li>
              <li>Attempt to gain unauthorised access to our systems or user accounts.</li>
              <li>Use the Platform for any unlawful purpose or in violation of any applicable laws.</li>
            </ul>
          </Section>

          <Section title="9. Intellectual Property">
            <p>All content on Biddaro — including logos, text, graphics, software, and AI-generated content — is the property of Biddaro or its licensors and is protected by applicable intellectual property laws. You may not reproduce, distribute, or create derivative works from our content without express written permission.</p>
            <p>By posting content on Biddaro (job descriptions, reviews, profile information), you grant us a non-exclusive, royalty-free, worldwide licence to display and use that content in connection with operating the Platform.</p>
          </Section>

          <Section title="10. Reviews & Ratings">
            <ul>
              <li>After a job is completed, both job posters and contractors may leave reviews and ratings.</li>
              <li>Reviews must be honest, accurate, and based on direct experience.</li>
              <li>We reserve the right to remove reviews that are fraudulent, abusive, or violate our guidelines.</li>
            </ul>
          </Section>

          <Section title="11. Disclaimer of Warranties">
            <p>The Platform is provided on an &quot;as is&quot; and &quot;as available&quot; basis. To the fullest extent permitted by law, Biddaro disclaims all warranties, express or implied, including warranties of merchantability, fitness for a particular purpose, and non-infringement. We do not warrant that the Platform will be uninterrupted, error-free, or free of harmful components.</p>
          </Section>

          <Section title="12. Limitation of Liability">
            <p>To the fullest extent permitted by law, Biddaro shall not be liable for any indirect, incidental, special, consequential, or punitive damages arising from your use of the Platform, including but not limited to loss of profits, data, or goodwill. Our total liability to you for any claim shall not exceed the greater of (a) the amount you paid to Biddaro in the twelve months preceding the claim, or (b) USD 100.</p>
          </Section>

          <Section title="13. Indemnification">
            <p>You agree to indemnify and hold harmless Biddaro and its officers, directors, employees, and agents from any claims, liabilities, damages, losses, and expenses (including legal fees) arising out of your use of the Platform, your violation of these Terms, or your infringement of any third-party rights.</p>
          </Section>

          <Section title="14. Governing Law & Dispute Resolution">
            <p>These Terms are governed by and construed in accordance with applicable laws. Users in India are subject to Indian law; users in UAE are subject to UAE law; users in Singapore are subject to Singapore law; users in the USA are subject to the laws of the state of Delaware.</p>
            <p>Any disputes that cannot be resolved informally shall be submitted to binding arbitration in accordance with the rules of the relevant jurisdiction. You waive any right to participate in a class action lawsuit or class-wide arbitration.</p>
          </Section>

          <Section title="15. Changes to Terms">
            <p>We may update these Terms from time to time. We will notify you of material changes by posting the updated Terms on this page and, where required, by email. Your continued use of the Platform after changes take effect constitutes your acceptance of the updated Terms.</p>
          </Section>

          <Section title="16. Termination">
            <p>We reserve the right to suspend or terminate your access to the Platform at any time, with or without notice, for conduct that we believe violates these Terms or is harmful to other users, us, or third parties.</p>
          </Section>

          <Section title="17. Contact Us">
            <p>For questions about these Terms, please contact us:</p>
            <ul>
              <li><strong>Email:</strong> <a href="mailto:legal@biddaro.com" className="text-brand-600 hover:underline">legal@biddaro.com</a></li>
              <li><strong>Website:</strong> <Link href="/contact" className="text-brand-600 hover:underline">biddaro.com/contact</Link></li>
            </ul>
          </Section>

          {/* Related links */}
          <div className="mt-10 pt-8 border-t border-gray-200 flex flex-wrap gap-4">
            <Link href="/privacy-policy" className="text-sm text-brand-600 hover:text-brand-700 font-medium hover:underline">
              Privacy Policy →
            </Link>
            <Link href="/cookie-policy" className="text-sm text-brand-600 hover:text-brand-700 font-medium hover:underline">
              Cookie Policy →
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="mt-8">
      <h2 className="text-xl font-bold text-dark-900 mb-3">{title}</h2>
      <div className="text-dark-600 leading-relaxed space-y-3">{children}</div>
    </div>
  );
}
