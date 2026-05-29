import Link from 'next/link';
import {
  Building2, Users, Package, BarChart2, FileText, CheckCircle,
  TrendingUp, IndianRupee, Wrench, Zap, Calendar, Receipt,
} from 'lucide-react';

// ─── Feature Groups ────────────────────────────────────────────────────────────

const FEATURE_GROUPS = [
  {
    title: 'Pre-Construction',
    color: 'text-blue-600',
    bg: 'bg-blue-50',
    features: [
      { icon: Calendar, name: 'Planning', desc: 'Milestones, timelines, Gantt chart' },
      { icon: TrendingUp, name: 'Sales Management', desc: 'Lead pipeline, proposals, closures' },
      { icon: FileText, name: 'Design Management', desc: 'Drawing register, version control, approvals' },
      { icon: IndianRupee, name: 'Budgeting', desc: 'BOQ, cost estimation, budget tracking' },
    ],
  },
  {
    title: 'Project Execution',
    color: 'text-purple-600',
    bg: 'bg-purple-50',
    features: [
      { icon: BarChart2, name: 'Progress Tracking', desc: 'Daily progress reports, photo updates' },
      { icon: CheckCircle, name: 'Quality Management', desc: 'Inspection checklists, pass/fail tracking' },
      { icon: Package, name: 'Procurement', desc: 'Purchase orders, vendor management' },
      { icon: Zap, name: 'Production Management', desc: 'Work orders, task tracking by trade' },
    ],
  },
  {
    title: 'Resource Management',
    color: 'text-green-600',
    bg: 'bg-green-50',
    features: [
      { icon: Users, name: 'Labour Management', desc: 'GPS attendance, payroll, wage calculation' },
      { icon: Users, name: 'Subcon Management', desc: 'Contracts, payment tracking, work orders' },
      { icon: Wrench, name: 'Asset & Equipment', desc: 'Equipment register, utilization, maintenance' },
      { icon: Package, name: 'Material Management', desc: 'Inventory, stock levels, consumption tracking' },
    ],
  },
  {
    title: 'Finance & Controls',
    color: 'text-orange-600',
    bg: 'bg-orange-50',
    features: [
      { icon: TrendingUp, name: 'Project P&L', desc: 'Auto-computed revenue, costs, margin' },
      { icon: Receipt, name: 'Vendor Billing', desc: 'Vendor invoices, approval workflows, payments' },
      { icon: IndianRupee, name: 'Client Invoicing', desc: 'Raise invoices, track payments, send reminders' },
      { icon: BarChart2, name: 'Reports & Analytics', desc: 'Progress, financial, quality dashboards' },
    ],
  },
];

const STATS = [
  { value: '2,400+', label: 'Projects Managed' },
  { value: '₹850Cr+', label: 'Construction Value Tracked' },
  { value: '50,000+', label: 'Workers Managed' },
  { value: '16', label: 'Integrated Modules' },
];

const HOW_IT_WORKS = [
  {
    step: '01',
    title: 'Create your site project',
    desc: 'Add location, client details, budget, team members, and project timeline in minutes.',
  },
  {
    step: '02',
    title: 'Manage daily operations',
    desc: 'Track attendance, materials, daily progress reports, BOQ, subcontractors, and equipment from one dashboard.',
  },
  {
    step: '03',
    title: 'Track, invoice & grow',
    desc: 'Get real-time P&L insights, raise client invoices, share progress via client portal, and analyze performance.',
  },
];

const PRICING = [
  {
    name: 'Starter',
    price: 'Free',
    sub: 'Forever free',
    color: 'border-gray-200',
    badge: '',
    features: ['1 project', '5 team members', 'All 16 modules', 'DPR & BOQ tracking', 'Basic reports'],
    cta: 'Get Started Free',
    ctaClass: 'border-2 border-orange-500 text-orange-600 hover:bg-orange-50',
    href: '/register',
  },
  {
    name: 'Pro',
    price: '₹999',
    sub: 'per month',
    color: 'border-orange-500 ring-2 ring-orange-500',
    badge: 'Most Popular',
    features: ['10 projects', 'Unlimited team members', 'Client portal', 'Priority support', 'Advanced analytics', 'Custom invoicing'],
    cta: 'Start Pro Trial',
    ctaClass: 'bg-orange-500 hover:bg-orange-600 text-white',
    href: '/register?plan=pro',
  },
  {
    name: 'Enterprise',
    price: '₹2,999',
    sub: 'per month',
    color: 'border-gray-200',
    badge: '',
    features: ['Unlimited projects', 'Custom branding', 'Dedicated account manager', 'API access', 'SLA support', 'Custom integrations'],
    cta: 'Talk to Sales',
    ctaClass: 'border-2 border-gray-300 text-gray-700 hover:bg-gray-50',
    href: '/contact',
  },
];

// ─── Page ──────────────────────────────────────────────────────────────────────

export default function ConstructionPage() {
  return (
    <div className="min-h-screen bg-white text-gray-900">
      {/* ── Navbar ── */}
      <nav className="sticky top-0 z-50 bg-white/95 backdrop-blur border-b border-gray-100 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-between h-16">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-orange-500 rounded-lg flex items-center justify-center">
              <Building2 className="w-5 h-5 text-white" />
            </div>
            <span className="font-bold text-gray-900 text-lg">
              Biddaro <span className="text-orange-500">Site</span>
            </span>
          </div>
          <div className="hidden md:flex items-center gap-8 text-sm font-medium text-gray-600">
            <a href="#features" className="hover:text-gray-900 transition-colors">Features</a>
            <a href="#how-it-works" className="hover:text-gray-900 transition-colors">How it Works</a>
            <a href="#pricing" className="hover:text-gray-900 transition-colors">Pricing</a>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/login" className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors">
              Login
            </Link>
            <Link
              href="/register"
              className="bg-orange-500 hover:bg-orange-600 text-white text-sm font-bold px-4 py-2 rounded-xl transition-colors"
            >
              Get Started Free
            </Link>
          </div>
        </div>
      </nav>

      {/* ── Hero ── */}
      <section className="bg-gradient-to-b from-orange-50 to-white py-20 px-4 text-center">
        <div className="max-w-4xl mx-auto">
          <div className="inline-flex items-center gap-2 bg-orange-100 text-orange-700 text-xs font-bold px-3 py-1.5 rounded-full mb-6">
            #1 Construction ERP in India
          </div>
          <h1 className="text-5xl font-black text-gray-900 mb-6 leading-tight">
            Manage Every Construction{' '}
            <span className="text-orange-500">Site. Team. Rupee.</span>
          </h1>
          <p className="text-xl text-gray-500 mb-8 max-w-2xl mx-auto">
            GPS attendance, BOQ tracking, procurement, DPR, client invoicing — all in one app.
            Built for India&apos;s construction industry.
          </p>
          <div className="flex items-center justify-center gap-4 flex-wrap">
            <Link
              href="/register"
              className="bg-orange-500 hover:bg-orange-600 text-white font-bold px-8 py-4 rounded-2xl text-lg transition-colors shadow-lg shadow-orange-200"
            >
              Start Free Trial →
            </Link>
            <Link
              href="/login"
              className="border-2 border-gray-200 hover:border-orange-300 text-gray-700 font-bold px-8 py-4 rounded-2xl text-lg transition-colors"
            >
              View Demo
            </Link>
          </div>
          <p className="text-sm text-gray-400 mt-4">
            No credit card required · Free for 1 project · Cancel anytime
          </p>
        </div>
      </section>

      {/* ── Stats Bar ── */}
      <section className="bg-gray-900 py-8">
        <div className="max-w-4xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-6 text-center px-4">
          {STATS.map(s => (
            <div key={s.label}>
              <div className="text-3xl font-black text-orange-400">{s.value}</div>
              <div className="text-sm text-gray-400 mt-1">{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Features ── */}
      <section id="features" className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-black text-gray-900 mb-3">
              Everything your construction business needs
            </h2>
            <p className="text-lg text-gray-500 max-w-2xl mx-auto">
              16 integrated modules covering every aspect of construction project management.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {FEATURE_GROUPS.map(group => (
              <div key={group.title}>
                <div className={`inline-flex items-center gap-2 ${group.bg} ${group.color} text-xs font-bold px-3 py-1.5 rounded-full mb-4`}>
                  {group.title}
                </div>
                <div className="space-y-3">
                  {group.features.map(f => (
                    <div key={f.name} className="flex items-start gap-3 p-3 rounded-xl border border-gray-100 hover:border-orange-200 hover:shadow-sm transition-all">
                      <div className={`w-8 h-8 ${group.bg} ${group.color} rounded-lg flex items-center justify-center flex-shrink-0`}>
                        <f.icon className="w-4 h-4" />
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-gray-800">{f.name}</p>
                        <p className="text-xs text-gray-500 mt-0.5">{f.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── How It Works ── */}
      <section id="how-it-works" className="bg-gray-50 py-20 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-black text-gray-900 mb-3">How it works</h2>
            <p className="text-lg text-gray-500">Get your first site live in under 10 minutes.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {HOW_IT_WORKS.map(step => (
              <div key={step.step} className="text-center">
                <div className="w-14 h-14 bg-orange-500 text-white font-black text-xl rounded-2xl flex items-center justify-center mx-auto mb-4">
                  {step.step}
                </div>
                <h3 className="text-base font-bold text-gray-900 mb-2">{step.title}</h3>
                <p className="text-sm text-gray-500">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Pricing ── */}
      <section id="pricing" className="py-20 px-4">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-black text-gray-900 mb-3">Simple, transparent pricing</h2>
            <p className="text-lg text-gray-500">Start free. Upgrade as your business grows.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {PRICING.map(plan => (
              <div
                key={plan.name}
                className={`relative bg-white rounded-2xl border-2 ${plan.color} p-6 flex flex-col`}
              >
                {plan.badge && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <span className="bg-orange-500 text-white text-xs font-bold px-3 py-1 rounded-full">
                      {plan.badge}
                    </span>
                  </div>
                )}
                <div className="mb-6">
                  <p className="text-sm font-semibold text-gray-500 mb-1">{plan.name}</p>
                  <div className="flex items-baseline gap-1">
                    <span className="text-3xl font-black text-gray-900">{plan.price}</span>
                    <span className="text-sm text-gray-400">{plan.sub}</span>
                  </div>
                </div>
                <ul className="space-y-2 mb-8 flex-1">
                  {plan.features.map(f => (
                    <li key={f} className="flex items-center gap-2 text-sm text-gray-600">
                      <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                      {f}
                    </li>
                  ))}
                </ul>
                <Link
                  href={plan.href}
                  className={`w-full text-center font-bold py-3 rounded-xl transition-colors text-sm ${plan.ctaClass}`}
                >
                  {plan.cta}
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA Banner ── */}
      <section className="bg-orange-500 py-16 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl font-black text-white mb-4">
            Ready to digitize your construction sites?
          </h2>
          <p className="text-orange-100 text-lg mb-8">
            Join thousands of builders and contractors who manage their sites on Biddaro.
          </p>
          <div className="flex items-center justify-center gap-4 flex-wrap">
            <Link
              href="/register"
              className="bg-white text-orange-500 hover:bg-orange-50 font-bold px-8 py-4 rounded-2xl text-lg transition-colors"
            >
              Start Free Trial →
            </Link>
            <a
              href="https://wa.me/919999999999?text=Hi, I want to learn more about Biddaro Site"
              target="_blank"
              rel="noopener noreferrer"
              className="border-2 border-white text-white hover:bg-white/10 font-bold px-8 py-4 rounded-2xl text-lg transition-colors"
            >
              Talk to Sales — WhatsApp
            </a>
          </div>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="bg-gray-900 py-10 px-4">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 bg-orange-500 rounded-lg flex items-center justify-center">
              <Building2 className="w-4 h-4 text-white" />
            </div>
            <span className="font-bold text-white">Biddaro <span className="text-orange-500">Site</span></span>
          </div>
          <p className="text-sm text-gray-500">
            &copy; {new Date().getFullYear()} Biddaro Technologies Pvt. Ltd. All rights reserved.
          </p>
          <div className="flex gap-6 text-sm text-gray-500">
            <Link href="/privacy-policy" className="hover:text-white transition-colors">Privacy</Link>
            <Link href="/terms" className="hover:text-white transition-colors">Terms</Link>
            <Link href="/contact" className="hover:text-white transition-colors">Contact</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
