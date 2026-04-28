import React from 'react';
import Link from 'next/link';
import { HardHat } from 'lucide-react';

export function Footer() {
  const currentYear = new Date().getFullYear();
  return (
    <footer className="bg-dark-900 text-dark-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-7 gap-8">

          {/* Brand */}
          <div className="col-span-2 md:col-span-3 lg:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-lg bg-brand-500 flex items-center justify-center">
                <HardHat className="w-5 h-5 text-white" />
              </div>
              <span className="text-white font-bold text-lg">Biddaro</span>
            </div>
            <p className="text-sm leading-relaxed">
              The construction marketplace connecting job posters with skilled contractors.
            </p>
          </div>

          {/* Platform */}
          <div>
            <h4 className="text-white font-semibold text-sm mb-4">Platform</h4>
            <ul className="space-y-2">
              {[
                { label: 'How It Works', href: '/how-it-works' },
                { label: 'Browse Jobs',  href: '/open-jobs' },
                { label: 'Post a Job',   href: '/jobs/post' },
                { label: 'Premium',      href: '/premium' },
                { label: 'Pricing',      href: '/pricing' },
              ].map(({ label, href }) => (
                <li key={label}>
                  <Link href={href} className="text-sm hover:text-white transition-colors">{label}</Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h4 className="text-white font-semibold text-sm mb-4">Resources</h4>
            <ul className="space-y-2">
              {[
                { label: 'Help Center',     href: '/guide' },
                { label: 'How It Works',    href: '/guide#getting-started' },
                { label: 'For Job Posters', href: '/guide#posters' },
                { label: 'For Contractors', href: '/guide#contractors' },
                { label: 'Loans Guide',     href: '/guide#loans' },
              ].map(({ label, href }) => (
                <li key={label}>
                  <Link href={href} className="text-sm hover:text-white transition-colors">{label}</Link>
                </li>
              ))}
            </ul>
          </div>

          {/* AI Answers */}
          <div>
            <h4 className="text-white font-semibold text-sm mb-4">AI Answers</h4>
            <ul className="space-y-2">
              {[
                { label: 'All Q&A',            href: '/ask' },
                { label: 'Construction Costs', href: '/ask#cost' },
                { label: 'Materials Guide',    href: '/ask#materials' },
                { label: 'Vastu Tips',         href: '/ask#vastu' },
                { label: 'Hiring Contractors', href: '/ask#hiring' },
              ].map(({ label, href }) => (
                <li key={label}>
                  <Link href={href} className="text-sm hover:text-white transition-colors">{label}</Link>
                </li>
              ))}
            </ul>
          </div>

          {/* AI Tools */}
          <div>
            <h4 className="text-white font-semibold text-sm mb-4">AI Tools</h4>
            <ul className="space-y-2">
              {[
                { label: 'All AI Tools',       href: '/ai' },
                { label: 'Cost Estimator',     href: '/ai/construction-cost-estimator' },
                { label: 'Vastu Consultant',   href: '/ai/vastu-consultant' },
                { label: 'Renovation Planner', href: '/ai/renovation-planner' },
                { label: 'Contractor Finder',  href: '/ai/contractor-finder' },
                { label: 'Material Calculator',href: '/ai/material-calculator' },
                { label: 'House Plan Advisor', href: '/ai/house-plan-advisor' },
                { label: 'Budget Planner',     href: '/ai/budget-planner' },
                { label: 'Permits Guide',      href: '/ai/permits-guide-india' },
              ].map(({ label, href }) => (
                <li key={label}>
                  <Link href={href} className="text-sm hover:text-white transition-colors">{label}</Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="text-white font-semibold text-sm mb-4">Company</h4>
            <ul className="space-y-2">
              {[
                { label: 'About Us',  href: '/about' },
                { label: 'Blog',      href: '/blog' },
                { label: 'Investors', href: '/investors' },
                { label: 'Careers',   href: '/contact?subject=Careers' },
                { label: 'Contact',   href: '/contact' },
              ].map(({ label, href }) => (
                <li key={label}>
                  <Link href={href} className="text-sm hover:text-white transition-colors">{label}</Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="text-white font-semibold text-sm mb-4">Legal</h4>
            <ul className="space-y-2">
              {[
                { label: 'Privacy Policy',   href: '/privacy-policy' },
                { label: 'Terms of Service', href: '/terms' },
                { label: 'Cookie Policy',    href: '/cookie-policy' },
                { label: 'Site Map',         href: '/html-sitemap' },
              ].map(({ label, href }) => (
                <li key={label}>
                  <Link href={href} className="text-sm hover:text-white transition-colors">{label}</Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-dark-700 mt-10 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-sm">
          <p>© {currentYear} Biddaro. All rights reserved.</p>
          <div className="flex items-center gap-4 text-xs text-dark-400">
            <Link href="/ask" className="hover:text-white transition-colors">🤖 AI Answers</Link>
            <Link href="/ai" className="hover:text-white transition-colors">⚡ AI Tools</Link>
            <Link href="/blog" className="hover:text-white transition-colors">📝 Blog</Link>
            <Link href="/hire" className="hover:text-white transition-colors">👷 Find Contractors</Link>
            <Link href="/guide" className="hover:text-white transition-colors">📖 Help Guide</Link>
            <Link href="/html-sitemap" className="hover:text-white transition-colors">🗺️ Site Map</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
