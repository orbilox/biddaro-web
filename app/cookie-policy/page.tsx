import type { Metadata } from 'next';
import Link from 'next/link';
import { Cookie, ChevronRight, CheckCircle } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Cookie Policy | Biddaro',
  description: 'Learn how Biddaro uses cookies and similar tracking technologies. Understand what cookies we use, why we use them, and how to manage your preferences.',
  alternates: { canonical: 'https://biddaro.com/cookie-policy' },
  robots: { index: true, follow: true },
};

const LAST_UPDATED = 'March 28, 2026';

const COOKIE_TYPES = [
  {
    type: 'Strictly Necessary',
    color: 'emerald',
    canDisable: false,
    description: 'Essential for the Platform to function. They enable core features such as login sessions, security tokens, and payment checkout.',
    examples: [
      { name: 'session_token', purpose: 'Keeps you logged in during your session', duration: 'Session' },
      { name: 'csrf_token',    purpose: 'Protects against cross-site request forgery attacks', duration: 'Session' },
      { name: 'user_pref',     purpose: 'Stores your currency and country preference', duration: '1 year' },
    ],
  },
  {
    type: 'Analytics & Performance',
    color: 'blue',
    canDisable: true,
    description: 'Help us understand how visitors interact with the Platform. All data is anonymised and aggregated.',
    examples: [
      { name: '_ga / _gid',   purpose: 'Google Analytics — page views, traffic source, session duration', duration: '2 years / 24 hrs' },
      { name: 'plausible_id', purpose: 'Privacy-first analytics — anonymous page view counts', duration: '1 year' },
    ],
  },
  {
    type: 'Functional',
    color: 'purple',
    canDisable: true,
    description: 'Enable enhanced functionality and personalisation such as language preference, recently viewed jobs, and AI chat history.',
    examples: [
      { name: 'lang_pref',      purpose: 'Remembers your preferred language (e.g., English / Arabic)', duration: '1 year' },
      { name: 'recent_jobs',    purpose: 'Stores recently viewed job listings for quick access', duration: '30 days' },
      { name: 'ai_session',     purpose: 'Maintains context within an AI assistant session', duration: 'Session' },
    ],
  },
  {
    type: 'Marketing & Advertising',
    color: 'orange',
    canDisable: true,
    description: 'Used to deliver relevant advertisements and track the effectiveness of our marketing campaigns. We do not sell your data to advertisers.',
    examples: [
      { name: '_fbp',      purpose: 'Facebook Pixel — conversion tracking for ad campaigns', duration: '3 months' },
      { name: 'gads_id',   purpose: 'Google Ads — conversion measurement', duration: '90 days' },
    ],
  },
];

const colorMap: Record<string, string> = {
  emerald: 'bg-emerald-50 border-emerald-200 text-emerald-800',
  blue:    'bg-blue-50 border-blue-200 text-blue-800',
  purple:  'bg-purple-50 border-purple-200 text-purple-800',
  orange:  'bg-orange-50 border-orange-200 text-orange-800',
};

const badgeMap: Record<string, string> = {
  emerald: 'bg-emerald-100 text-emerald-700',
  blue:    'bg-blue-100 text-blue-700',
  purple:  'bg-purple-100 text-purple-700',
  orange:  'bg-orange-100 text-orange-700',
};

export default function CookiePolicyPage() {
  return (
    <div className="min-h-screen bg-gray-50">

      {/* Header */}
      <div className="bg-gradient-to-br from-dark-900 via-dark-800 to-brand-900 py-14 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center gap-2 text-brand-300 text-sm mb-4">
            <Link href="/" className="hover:text-white transition-colors">Home</Link>
            <ChevronRight className="w-3.5 h-3.5" />
            <span>Cookie Policy</span>
          </div>
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-brand-500/20 border border-brand-500/30 flex items-center justify-center">
              <Cookie className="w-5 h-5 text-brand-400" />
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-white">Cookie Policy</h1>
          </div>
          <p className="text-dark-300">Last updated: {LAST_UPDATED}</p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-12 space-y-8">

        {/* Intro */}
        <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-8">
          <h2 className="text-xl font-bold text-dark-900 mb-3">What Are Cookies?</h2>
          <p className="text-dark-600 leading-relaxed">
            Cookies are small text files that are placed on your device when you visit a website. They are widely used to make websites work more efficiently and to provide information to website owners. Biddaro uses cookies and similar technologies (such as local storage and session storage) to operate our construction marketplace and improve your experience.
          </p>
          <p className="text-dark-600 leading-relaxed mt-3">
            This Cookie Policy explains what cookies we use, why we use them, and how you can manage your preferences. By using Biddaro, you consent to our use of cookies in accordance with this policy.
          </p>
        </div>

        {/* Cookie Types */}
        <div className="space-y-4">
          <h2 className="text-xl font-bold text-dark-900">Types of Cookies We Use</h2>

          {COOKIE_TYPES.map((ct) => (
            <div key={ct.type} className={`border rounded-2xl overflow-hidden ${colorMap[ct.color]}`}>
              {/* Header */}
              <div className="px-6 py-4 flex items-center justify-between gap-4">
                <div>
                  <h3 className="font-bold text-base">{ct.type}</h3>
                  <p className="text-sm mt-1 opacity-80">{ct.description}</p>
                </div>
                <span className={`text-xs font-semibold px-3 py-1 rounded-full flex-shrink-0 ${badgeMap[ct.color]}`}>
                  {ct.canDisable ? 'Optional' : 'Required'}
                </span>
              </div>

              {/* Examples table */}
              <div className="bg-white border-t border-current border-opacity-20 overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-gray-50 border-b border-gray-200">
                      <th className="text-left px-4 py-2.5 font-semibold text-dark-700">Cookie Name</th>
                      <th className="text-left px-4 py-2.5 font-semibold text-dark-700">Purpose</th>
                      <th className="text-left px-4 py-2.5 font-semibold text-dark-700">Duration</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {ct.examples.map((ex) => (
                      <tr key={ex.name} className="hover:bg-gray-50">
                        <td className="px-4 py-2.5 font-mono text-xs text-dark-700">{ex.name}</td>
                        <td className="px-4 py-2.5 text-dark-600">{ex.purpose}</td>
                        <td className="px-4 py-2.5 text-dark-500 whitespace-nowrap">{ex.duration}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ))}
        </div>

        {/* Third-party cookies */}
        <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-8">
          <h2 className="text-xl font-bold text-dark-900 mb-4">Third-Party Cookies</h2>
          <p className="text-dark-600 leading-relaxed mb-4">
            Some cookies are set by third-party services that appear on our pages. We do not control these cookies. Please refer to the respective privacy policies for more information:
          </p>
          <ul className="space-y-2">
            {[
              { name: 'Google Analytics',  url: 'https://policies.google.com/privacy' },
              { name: 'Google Ads',        url: 'https://policies.google.com/privacy' },
              { name: 'Facebook / Meta',   url: 'https://www.facebook.com/privacy/policy' },
              { name: 'Stripe (Payments)', url: 'https://stripe.com/privacy' },
              { name: 'Razorpay (India)',  url: 'https://razorpay.com/privacy/' },
            ].map(({ name, url }) => (
              <li key={name} className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-brand-500 flex-shrink-0" />
                <a href={url} target="_blank" rel="noopener noreferrer"
                  className="text-sm text-brand-600 hover:text-brand-700 hover:underline">
                  {name} Privacy Policy
                </a>
              </li>
            ))}
          </ul>
        </div>

        {/* Managing cookies */}
        <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-8">
          <h2 className="text-xl font-bold text-dark-900 mb-4">How to Manage Your Cookie Preferences</h2>

          <h3 className="font-semibold text-dark-800 mb-2">Browser Settings</h3>
          <p className="text-dark-600 leading-relaxed mb-4">
            Most browsers allow you to view, manage, block, and delete cookies through their settings. Note that disabling certain cookies may affect the functionality of the Platform. Links to cookie management guides for popular browsers:
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mb-6">
            {[
              { name: 'Google Chrome',  url: 'https://support.google.com/chrome/answer/95647' },
              { name: 'Safari',         url: 'https://support.apple.com/en-gb/guide/safari/sfri11471/mac' },
              { name: 'Firefox',        url: 'https://support.mozilla.org/en-US/kb/cookies-information-websites-store-on-your-computer' },
              { name: 'Microsoft Edge', url: 'https://support.microsoft.com/en-us/microsoft-edge/delete-cookies-in-microsoft-edge' },
              { name: 'Opera',          url: 'https://help.opera.com/en/latest/web-preferences/#cookies' },
            ].map(({ name, url }) => (
              <a key={name} href={url} target="_blank" rel="noopener noreferrer"
                className="text-xs text-brand-600 hover:text-brand-700 hover:underline bg-brand-50 border border-brand-100 px-3 py-2 rounded-lg text-center font-medium transition-colors">
                {name}
              </a>
            ))}
          </div>

          <h3 className="font-semibold text-dark-800 mb-2">Opt-Out of Analytics</h3>
          <p className="text-dark-600 leading-relaxed">
            You can opt out of Google Analytics tracking by installing the{' '}
            <a href="https://tools.google.com/dlpage/gaoptout" target="_blank" rel="noopener noreferrer"
              className="text-brand-600 hover:underline">Google Analytics Opt-out Browser Add-on</a>.
          </p>
        </div>

        {/* Do Not Track */}
        <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-8">
          <h2 className="text-xl font-bold text-dark-900 mb-3">Do Not Track</h2>
          <p className="text-dark-600 leading-relaxed">
            Some browsers have a &quot;Do Not Track&quot; (DNT) feature that signals to websites that you do not want to be tracked. As there is currently no agreed standard for how websites should respond to DNT signals, we do not currently alter our data collection practices in response to DNT browser settings. We will revisit this when an industry standard is established.
          </p>
        </div>

        {/* Updates */}
        <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-8">
          <h2 className="text-xl font-bold text-dark-900 mb-3">Updates to This Policy</h2>
          <p className="text-dark-600 leading-relaxed">
            We may update this Cookie Policy periodically to reflect changes in technology, regulation, or our practices. We will notify you of significant changes by posting the updated policy on this page with a revised &quot;Last updated&quot; date.
          </p>
        </div>

        {/* Contact */}
        <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-8">
          <h2 className="text-xl font-bold text-dark-900 mb-3">Contact Us</h2>
          <p className="text-dark-600 leading-relaxed">
            If you have questions about our use of cookies, please contact us at{' '}
            <a href="mailto:privacy@biddaro.com" className="text-brand-600 hover:underline">privacy@biddaro.com</a>{' '}
            or visit <Link href="/contact" className="text-brand-600 hover:underline">biddaro.com/contact</Link>.
          </p>

          {/* Related links */}
          <div className="mt-8 pt-6 border-t border-gray-200 flex flex-wrap gap-4">
            <Link href="/privacy-policy" className="text-sm text-brand-600 hover:text-brand-700 font-medium hover:underline">
              Privacy Policy →
            </Link>
            <Link href="/terms" className="text-sm text-brand-600 hover:text-brand-700 font-medium hover:underline">
              Terms of Service →
            </Link>
          </div>
        </div>

      </div>
    </div>
  );
}
