import type { Metadata } from 'next';
import Link from 'next/link';
import { Shield, ChevronRight } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Privacy Policy | Biddaro',
  description: 'Learn how Biddaro collects, uses, and protects your personal information. Our privacy policy covers data collection, usage, and your rights.',
  alternates: { canonical: 'https://biddaro.com/privacy-policy' },
  robots: { index: true, follow: true },
};

const LAST_UPDATED = 'March 28, 2026';

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-gray-50">

      {/* Header */}
      <div className="bg-gradient-to-br from-dark-900 via-dark-800 to-brand-900 py-14 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center gap-2 text-brand-300 text-sm mb-4">
            <Link href="/" className="hover:text-white transition-colors">Home</Link>
            <ChevronRight className="w-3.5 h-3.5" />
            <span>Privacy Policy</span>
          </div>
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-brand-500/20 border border-brand-500/30 flex items-center justify-center">
              <Shield className="w-5 h-5 text-brand-400" />
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-white">Privacy Policy</h1>
          </div>
          <p className="text-dark-300">Last updated: {LAST_UPDATED}</p>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-8 md:p-12 prose prose-gray max-w-none">

          <p className="text-dark-600 leading-relaxed">
            Welcome to Biddaro (&quot;we&quot;, &quot;our&quot;, or &quot;us&quot;). We are committed to protecting your personal information and your right to privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website <strong>biddaro.com</strong> and use our construction marketplace services.
          </p>
          <p className="text-dark-600 leading-relaxed">
            Please read this policy carefully. If you disagree with its terms, please discontinue use of our site.
          </p>

          <Section title="1. Information We Collect">
            <p>We collect information you voluntarily provide when you:</p>
            <ul>
              <li><strong>Register an account</strong> — name, email address, phone number, country, and role (job poster or contractor).</li>
              <li><strong>Post or bid on jobs</strong> — job descriptions, budget, location, attachments, and bid details.</li>
              <li><strong>Make payments</strong> — billing details processed securely through our payment providers (we do not store card numbers).</li>
              <li><strong>Contact us</strong> — messages, feedback, and support requests.</li>
              <li><strong>Use AI features</strong> — prompts and queries submitted to AI tools (not linked to identifiable data unless you are logged in).</li>
            </ul>
            <p>We also automatically collect certain information:</p>
            <ul>
              <li><strong>Log data</strong> — IP address, browser type, pages visited, time and date of visit, referring URL.</li>
              <li><strong>Device data</strong> — device type, operating system, and unique device identifiers.</li>
              <li><strong>Cookies and tracking</strong> — see our <Link href="/cookie-policy" className="text-brand-600 hover:underline">Cookie Policy</Link> for details.</li>
            </ul>
          </Section>

          <Section title="2. How We Use Your Information">
            <p>We use the information we collect to:</p>
            <ul>
              <li>Create and manage your account and provide our marketplace services.</li>
              <li>Connect job posters with contractors and facilitate transactions.</li>
              <li>Process payments and maintain escrow services.</li>
              <li>Send transactional emails — job alerts, bid notifications, payment receipts.</li>
              <li>Respond to your inquiries and provide customer support.</li>
              <li>Improve our platform, personalise content, and develop new features.</li>
              <li>Detect, prevent, and address fraud, abuse, or security incidents.</li>
              <li>Comply with legal obligations.</li>
              <li>Send marketing communications, where you have opted in.</li>
            </ul>
          </Section>

          <Section title="3. How We Share Your Information">
            <p>We do <strong>not sell</strong> your personal data. We may share it in the following circumstances:</p>
            <ul>
              <li><strong>Between users</strong> — when a contractor bids on your job, limited profile information (name, rating, work history) is shared with the job poster, and vice versa.</li>
              <li><strong>Service providers</strong> — trusted third-party vendors who assist in operating our platform (payment processors, cloud hosting, email services, analytics). They are bound by confidentiality agreements.</li>
              <li><strong>Legal requirements</strong> — if required by law, court order, or government authority.</li>
              <li><strong>Business transfers</strong> — in the event of a merger, acquisition, or sale of all or part of our assets, your data may be transferred as part of that transaction.</li>
              <li><strong>With your consent</strong> — for any other purpose with your explicit consent.</li>
            </ul>
          </Section>

          <Section title="4. Data Retention">
            <p>
              We retain your personal data for as long as your account is active or as needed to provide services. You may request deletion of your account at any time by contacting us at <a href="mailto:privacy@biddaro.com" className="text-brand-600 hover:underline">privacy@biddaro.com</a>. We may retain certain data for legitimate business or legal purposes (e.g., fraud prevention, legal compliance) even after account deletion.
            </p>
          </Section>

          <Section title="5. Your Rights">
            <p>Depending on your location, you may have the following rights regarding your personal data:</p>
            <ul>
              <li><strong>Access</strong> — request a copy of the data we hold about you.</li>
              <li><strong>Correction</strong> — request correction of inaccurate or incomplete data.</li>
              <li><strong>Deletion</strong> — request deletion of your personal data (&quot;right to be forgotten&quot;).</li>
              <li><strong>Portability</strong> — receive your data in a structured, machine-readable format.</li>
              <li><strong>Objection</strong> — object to processing of your data for direct marketing.</li>
              <li><strong>Withdrawal of consent</strong> — withdraw consent at any time where processing is based on consent.</li>
            </ul>
            <p>To exercise any of these rights, contact us at <a href="mailto:privacy@biddaro.com" className="text-brand-600 hover:underline">privacy@biddaro.com</a>.</p>
          </Section>

          <Section title="6. Cookies">
            <p>
              We use cookies and similar tracking technologies to enhance your experience. You can control cookie preferences through your browser settings or our cookie consent banner. For full details, see our <Link href="/cookie-policy" className="text-brand-600 hover:underline">Cookie Policy</Link>.
            </p>
          </Section>

          <Section title="7. Security">
            <p>
              We implement industry-standard security measures including SSL/TLS encryption, hashed passwords, and access controls to protect your data. However, no method of transmission over the Internet is 100% secure. We encourage you to use a strong, unique password and to log out of your account on shared devices.
            </p>
          </Section>

          <Section title="8. Third-Party Links">
            <p>
              Our platform may contain links to third-party websites. We are not responsible for the privacy practices of those sites and encourage you to review their privacy policies.
            </p>
          </Section>

          <Section title="9. Children's Privacy">
            <p>
              Biddaro is not directed to individuals under the age of 18. We do not knowingly collect personal information from children. If you believe a child has provided us with personal information, please contact us immediately.
            </p>
          </Section>

          <Section title="10. International Data Transfers">
            <p>
              Biddaro operates globally across India, UAE, Singapore, and USA. Your information may be transferred to and processed in countries other than your own. We ensure appropriate safeguards are in place to protect your data in accordance with applicable laws.
            </p>
          </Section>

          <Section title="11. Biddaro Inspect Mobile App">
            <p>
              Biddaro Inspect is our Android mobile app for construction and property inspections. In addition to the data described above, the app may access and collect the following, and only when you use the relevant feature:
            </p>
            <ul>
              <li><strong>Camera, Photos &amp; Videos</strong> — to capture inspection photos and attach them to your reports.</li>
              <li><strong>Microphone &amp; Audio</strong> — to record optional voice observations on site.</li>
              <li><strong>Precise Location (GPS)</strong> — to tag inspection captures with coordinates for verification.</li>
              <li><strong>Account information (name, email)</strong> — to sign you in and sync your reports.</li>
              <li><strong>App activity</strong> — to power analytics and improve the app.</li>
            </ul>
            <p>
              This data is used solely to provide app functionality (creating, storing, and sharing your inspection reports) and to manage your account. Camera, microphone, and location are accessed only while you actively use the corresponding feature, and those permissions can be revoked at any time in your device settings. Data is encrypted in transit (HTTPS). You can request deletion of your account and associated inspection data at any time by contacting <a href="mailto:privacy@biddaro.com" className="text-brand-600 hover:underline">privacy@biddaro.com</a>.
            </p>
          </Section>

          <Section title="12. Biddaro Safety Mobile App">
            <p>
              Biddaro Safety is our Android mobile app for construction site safety management (toolbox talks, safety audits, and hazard tracking). In addition to the data described above, the app may access and collect the following, and only when you use the relevant feature:
            </p>
            <ul>
              <li><strong>Camera &amp; Photos</strong> — to capture safety-audit photos, hazard evidence, toolbox-talk attendance selfies, and &quot;fixed&quot; proof images attached to your records.</li>
              <li><strong>Precise Location (GPS)</strong> — to tag toolbox talks, audits, and hazard reports with coordinates for verification.</li>
              <li><strong>Account information (name, email)</strong> — to sign you in and sync your sites, talks, audits, and hazards.</li>
              <li><strong>App activity</strong> — to power your safety dashboard analytics and improve the app.</li>
            </ul>
            <p>
              This data is used solely to provide app functionality (creating, storing, and sharing your site-safety records) and to manage your account. Camera and location are accessed only while you actively use the corresponding feature, and those permissions can be revoked at any time in your device settings. Data is encrypted in transit (HTTPS). You can request deletion of your account and associated safety data at any time by contacting <a href="mailto:privacy@biddaro.com" className="text-brand-600 hover:underline">privacy@biddaro.com</a>.
            </p>
          </Section>

          <Section title="13. Changes to This Policy">
            <p>
              We may update this Privacy Policy from time to time. We will notify you of significant changes by posting the new policy on this page with an updated &quot;Last updated&quot; date and, where appropriate, via email. Your continued use of Biddaro after changes are posted constitutes acceptance of the updated policy.
            </p>
          </Section>

          <Section title="14. Contact Us">
            <p>If you have questions or concerns about this Privacy Policy, please contact us:</p>
            <ul>
              <li><strong>Email:</strong> <a href="mailto:privacy@biddaro.com" className="text-brand-600 hover:underline">privacy@biddaro.com</a></li>
              <li><strong>Website:</strong> <Link href="/contact" className="text-brand-600 hover:underline">biddaro.com/contact</Link></li>
            </ul>
          </Section>

          {/* Related links */}
          <div className="mt-10 pt-8 border-t border-gray-200 flex flex-wrap gap-4">
            <Link href="/terms" className="text-sm text-brand-600 hover:text-brand-700 font-medium hover:underline">
              Terms of Service →
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
