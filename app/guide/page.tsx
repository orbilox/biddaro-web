'use client';
import React, { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import {
  BookOpen, HardHat, Users, LayoutDashboard, PlusCircle, ClipboardList,
  FileText, Milestone, AlertCircle, Search, Gavel, ListChecks, CheckSquare,
  Wallet, ArrowDownLeft, ArrowUpRight, BarChart2, Package, Download, Trash2,
  Crown, Star, TrendingUp, Radio, Hammer, FolderKanban, Banknote, Bot,
  MessageSquare, ShieldAlert, ArrowRight, ChevronDown, Lightbulb, Info,
  Zap, BadgeCheck, DollarSign, Clock, Building2, User, Menu, X,
  Mic, Paperclip, History, RefreshCw, Copy, Sparkles,
} from 'lucide-react';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';

// ─── Section definitions ──────────────────────────────────────────────────────

const NAV_GROUPS = [
  {
    label: 'Getting Started',
    id: 'getting-started',
    items: [
      { id: 'what-is-biddaro',   label: 'What is Biddaro?',         icon: BookOpen },
      { id: 'creating-account',  label: 'Creating Your Account',    icon: User },
      { id: 'navigating',        label: 'Navigating the Dashboard', icon: LayoutDashboard },
    ],
  },
  {
    label: 'For Job Posters',
    id: 'posters',
    items: [
      { id: 'posting-job',       label: 'Posting a Job',            icon: PlusCircle },
      { id: 'reviewing-bids',    label: 'Reviewing Bids',           icon: ClipboardList },
      { id: 'managing-contracts',label: 'Managing Contracts',       icon: FileText },
      { id: 'milestones',        label: 'Milestones Explained',     icon: Milestone },
      { id: 'raising-dispute',   label: 'Raising a Dispute',        icon: AlertCircle },
    ],
  },
  {
    label: 'For Contractors',
    id: 'contractors',
    items: [
      { id: 'finding-work',      label: 'Finding Work',             icon: Search },
      { id: 'placing-bid',       label: 'Placing a Bid',            icon: Gavel },
      { id: 'managing-bids',     label: 'Managing Your Bids',       icon: ListChecks },
      { id: 'working-contracts', label: 'Working on Contracts',     icon: CheckSquare },
    ],
  },
  {
    label: 'Wallet & Payments',
    id: 'wallet',
    items: [
      { id: 'adding-money',      label: 'Adding Money to Wallet',   icon: ArrowDownLeft },
      { id: 'withdrawal',        label: 'Making a Withdrawal',      icon: ArrowUpRight },
      { id: 'transactions',      label: 'Transaction History',      icon: BarChart2 },
    ],
  },
  {
    label: 'Add-Ons & Plugins',
    id: 'addons',
    items: [
      { id: 'what-are-addons',   label: 'What are Add-Ons?',        icon: Package },
      { id: 'browsing-addons',   label: 'Browsing Add-Ons',         icon: Search },
      { id: 'installing-addon',  label: 'Installing an Add-On',     icon: Download },
      { id: 'managing-addons',   label: 'Managing Add-Ons',         icon: Trash2 },
    ],
  },
  {
    label: 'Premium',
    id: 'premium',
    items: [
      { id: 'biddaro-premium',   label: 'Biddaro Premium',          icon: Crown },
      { id: 'upgrading',         label: 'Upgrading to Premium',     icon: Star },
      { id: 'premium-benefits',  label: 'Premium Benefits',         icon: TrendingUp },
    ],
  },
  {
    label: 'Tools & Features',
    id: 'tools',
    items: [
      { id: 'project-tracking',  label: 'Project Tracking',         icon: Radio },
      { id: 'build-planner',     label: 'Build Planner',            icon: Hammer },
      { id: 'project-manager',   label: 'Project Manager',          icon: FolderKanban },
      { id: 'loans',             label: 'Loans',                    icon: Banknote },
      { id: 'ai-assistant',      label: 'AI Assistant',             icon: Bot },
      { id: 'messages',          label: 'Messages',                 icon: MessageSquare },
      { id: 'disputes',          label: 'Disputes',                 icon: ShieldAlert },
    ],
  },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────

function Tip({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex gap-3 bg-amber-50 border border-amber-200 rounded-xl p-4 text-sm text-amber-800 my-4">
      <Lightbulb className="w-4 h-4 flex-shrink-0 mt-0.5 text-amber-500" />
      <div><strong className="font-semibold">Pro Tip: </strong>{children}</div>
    </div>
  );
}

function Info2({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex gap-3 bg-blue-50 border border-blue-200 rounded-xl p-4 text-sm text-blue-800 my-4">
      <Info className="w-4 h-4 flex-shrink-0 mt-0.5 text-blue-500" />
      <div>{children}</div>
    </div>
  );
}

function Steps({ steps }: { steps: string[] }) {
  return (
    <ol className="space-y-3 my-4">
      {steps.map((step, i) => (
        <li key={i} className="flex gap-3">
          <span className="w-6 h-6 rounded-full bg-brand-500 text-white text-xs font-bold flex items-center justify-center flex-shrink-0 mt-0.5">{i + 1}</span>
          <span className="text-sm text-gray-700 leading-relaxed" dangerouslySetInnerHTML={{ __html: step }} />
        </li>
      ))}
    </ol>
  );
}

function Bullets({ items }: { items: string[] }) {
  return (
    <ul className="space-y-2 my-4">
      {items.map((item, i) => (
        <li key={i} className="flex gap-2 text-sm text-gray-700">
          <CheckSquare className="w-4 h-4 flex-shrink-0 mt-0.5 text-brand-500" />
          <span dangerouslySetInnerHTML={{ __html: item }} />
        </li>
      ))}
    </ul>
  );
}

function SectionHeader({ id, icon: Icon, number, title, subtitle }: {
  id: string; icon: React.ElementType; number: number; title: string; subtitle: string;
}) {
  return (
    <div id={id} className="scroll-mt-24 pt-2 pb-4 border-b border-gray-200 mb-6">
      <div className="flex items-center gap-3 mb-2">
        <div className="w-10 h-10 rounded-xl bg-brand-500/10 flex items-center justify-center flex-shrink-0">
          <Icon className="w-5 h-5 text-brand-500" />
        </div>
        <div>
          <p className="text-xs font-semibold text-brand-500 uppercase tracking-wider">Section {number}</p>
          <h2 className="text-xl font-bold text-gray-900">{title}</h2>
        </div>
      </div>
      <p className="text-gray-500 text-sm leading-relaxed pl-13">{subtitle}</p>
    </div>
  );
}

// ─── Dashboard mockup ─────────────────────────────────────────────────────────

function DashboardMockup({ items }: { items: { icon: string; label: string }[] }) {
  return (
    <div className="bg-gray-900 rounded-xl border border-gray-700 overflow-hidden my-5 shadow-lg">
      <div className="flex items-center gap-2 px-4 py-2.5 border-b border-gray-700">
        <div className="w-3 h-3 rounded-full bg-red-500" />
        <div className="w-3 h-3 rounded-full bg-yellow-500" />
        <div className="w-3 h-3 rounded-full bg-green-500" />
        <span className="text-xs text-gray-400 ml-2">biddaro.com/dashboard</span>
      </div>
      <div className="flex">
        <div className="w-48 border-r border-gray-700 p-3 space-y-1">
          {items.map(({ icon, label }) => (
            <div key={label} className="flex items-center gap-2 px-2 py-1.5 rounded-lg text-gray-400 text-xs hover:bg-gray-800 cursor-pointer">
              <span>{icon}</span><span>{label}</span>
            </div>
          ))}
        </div>
        <div className="flex-1 p-4">
          <div className="grid grid-cols-2 gap-3">
            {[['Active Jobs', '3'], ['Total Bids', '12'], ['Earnings', '$2,400'], ['Contracts', '5']].map(([k, v]) => (
              <div key={k} className="bg-gray-800 rounded-lg p-3">
                <p className="text-xs text-gray-500">{k}</p>
                <p className="text-lg font-bold text-white">{v}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── AI Tools Accordion ───────────────────────────────────────────────────────

const AI_TOOLS = [
  {
    emoji: '💰', name: 'Construction Cost Estimator', slug: 'construction-cost-estimator',
    desc: 'Get accurate cost estimates for any construction project in India by location and type.',
    samples: ['How much to build a 1000 sq ft house in Pune?', 'What\'s the cost of laying an RCC slab?', 'Estimate flooring cost for 500 sq ft'],
  },
  {
    emoji: '🏠', name: 'Renovation Planner', slug: 'renovation-planner',
    desc: 'Plan your renovation room by room with material suggestions and realistic timelines.',
    samples: ['Plan a bathroom renovation under ₹2 lakhs', 'Kitchen renovation checklist', 'How long does a full home renovation take?'],
  },
  {
    emoji: '👷', name: 'Contractor Finder', slug: 'contractor-finder',
    desc: 'Describe your job and get matched with the right contractor category and what to look for when hiring.',
    samples: ['What type of contractor do I need for waterproofing?', 'How to choose between 3 electricians?', 'Questions to ask before hiring a plumber'],
  },
  {
    emoji: '🧱', name: 'Material Calculator', slug: 'material-calculator',
    desc: 'Calculate exact quantities of cement, bricks, tiles, sand, steel, and more for your project.',
    samples: ['How many bricks for a 10×12 room?', 'Cement bags needed for 500 sq ft RCC slab', 'Tiles needed for 200 sq ft floor'],
  },
  {
    emoji: '🧭', name: 'Vastu Consultant', slug: 'vastu-consultant',
    desc: 'Get Vastu-compliant layout recommendations for homes and offices based on direction and room type.',
    samples: ['Which direction should the main entrance face?', 'Vastu tips for kitchen placement', 'Best direction for master bedroom'],
  },
  {
    emoji: '📐', name: 'House Plan Advisor', slug: 'house-plan-advisor',
    desc: 'Get layout and design suggestions tailored to your plot size and family needs.',
    samples: ['2BHK plan for 30×40 plot', 'How to maximize space in a 600 sq ft apartment?', 'Open floor plan vs traditional layout'],
  },
  {
    emoji: '📊', name: 'Budget Planner', slug: 'budget-planner',
    desc: 'Build a detailed construction or renovation budget with itemised cost breakdowns.',
    samples: ['Budget breakdown for ₹30 lakh home construction', 'How to allocate renovation budget by room?', 'Hidden costs to budget for in construction'],
  },
  {
    emoji: '📋', name: 'Permits Guide', slug: 'permits-guide-india',
    desc: 'Understand what building permits are needed for your project and location across India.',
    samples: ['What permits do I need to build a house in Bangalore?', 'How to get a building plan approved?', 'Timeline for construction permit approval'],
  },
];

function AiToolsAccordion() {
  const [openSlug, setOpenSlug] = useState<string | null>(null);
  return (
    <div className="space-y-2">
      {AI_TOOLS.map((tool) => {
        const isOpen = openSlug === tool.slug;
        return (
          <div key={tool.slug} className="border border-gray-200 rounded-xl overflow-hidden">
            <button
              onClick={() => setOpenSlug(isOpen ? null : tool.slug)}
              className="w-full flex items-center justify-between gap-3 px-4 py-3 bg-gray-50 hover:bg-gray-100 transition-colors text-left"
            >
              <div className="flex items-center gap-3 min-w-0">
                <span className="text-xl flex-shrink-0">{tool.emoji}</span>
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-gray-800">{tool.name}</p>
                  <p className="text-xs text-gray-500 truncate">{tool.desc}</p>
                </div>
              </div>
              <div className="flex items-center gap-2 flex-shrink-0">
                <Link
                  href={`/ai/${tool.slug}`}
                  onClick={(e) => e.stopPropagation()}
                  className="text-xs text-brand-600 font-medium hover:text-brand-700 border border-brand-200 rounded-lg px-2.5 py-1 bg-white hover:bg-brand-50 transition-colors"
                >
                  Try Free →
                </Link>
                <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
              </div>
            </button>
            {isOpen && (
              <div className="px-4 py-3 bg-white border-t border-gray-100">
                <p className="text-xs text-gray-600 mb-3">{tool.desc}</p>
                <p className="text-xs font-semibold text-gray-700 mb-2">Sample questions you can ask:</p>
                <ul className="space-y-1">
                  {tool.samples.map((q) => (
                    <li key={q} className="flex items-start gap-2 text-xs text-gray-600">
                      <span className="text-brand-500 mt-0.5 flex-shrink-0">›</span>{q}
                    </li>
                  ))}
                </ul>
                <p className="text-xs text-gray-400 mt-3">URL: <code className="bg-gray-100 rounded px-1">/ai/{tool.slug}</code></p>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function GuidePage() {
  const [activeId, setActiveId] = useState('what-is-biddaro');
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const allItems = NAV_GROUPS.flatMap(g => g.items);

  // IntersectionObserver for active sidebar item
  useEffect(() => {
    const ids = allItems.map(i => i.id);
    const observers: IntersectionObserver[] = [];

    ids.forEach(id => {
      const el = document.getElementById(id);
      if (!el) return;
      const obs = new IntersectionObserver(
        ([entry]) => { if (entry.isIntersecting) setActiveId(id); },
        { rootMargin: '-20% 0px -70% 0px' }
      );
      obs.observe(el);
      observers.push(obs);
    });

    return () => observers.forEach(o => o.disconnect());
  }, []);

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    setMobileNavOpen(false);
  };

  const activeLabel = allItems.find(i => i.id === activeId)?.label || 'Guide';

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      {/* ── Hero ─────────────────────────────────────────────────── */}
      <section className="bg-gradient-to-br from-gray-900 via-gray-800 to-brand-900 text-white pt-28 pb-16 px-4">
        <div className="max-w-5xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-brand-500/20 border border-brand-500/30 text-brand-300 text-sm font-medium px-3 py-1.5 rounded-full mb-5">
            <BookOpen className="w-3.5 h-3.5" /> Platform Encyclopedia
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Biddaro Help Center</h1>
          <p className="text-gray-300 text-lg max-w-2xl mx-auto mb-8">
            Everything you need to know about using Biddaro — from posting your first job to managing contracts, payments, add-ons, and beyond.
          </p>
          {/* Role cards */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => scrollTo('posting-job')}
              className="flex items-center gap-3 bg-white/10 border border-white/20 hover:bg-white/20 transition-colors rounded-2xl px-6 py-4 text-left"
            >
              <div className="w-10 h-10 rounded-xl bg-brand-500 flex items-center justify-center flex-shrink-0">
                <PlusCircle className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="font-semibold">I&apos;m a Job Poster</p>
                <p className="text-xs text-gray-300">Post jobs, review bids, manage contracts</p>
              </div>
              <ArrowRight className="w-4 h-4 text-gray-400 ml-2" />
            </button>
            <button
              onClick={() => scrollTo('finding-work')}
              className="flex items-center gap-3 bg-white/10 border border-white/20 hover:bg-white/20 transition-colors rounded-2xl px-6 py-4 text-left"
            >
              <div className="w-10 h-10 rounded-xl bg-amber-500 flex items-center justify-center flex-shrink-0">
                <HardHat className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="font-semibold">I&apos;m a Contractor</p>
                <p className="text-xs text-gray-300">Find work, place bids, complete projects</p>
              </div>
              <ArrowRight className="w-4 h-4 text-gray-400 ml-2" />
            </button>
          </div>
        </div>
      </section>

      {/* ── Quick-links grid ─────────────────────────────────────── */}
      <section className="bg-white border-b border-gray-200 py-10 px-4">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-lg font-bold text-gray-900 mb-5 text-center">Browse All Topics</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
            {allItems.map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                onClick={() => scrollTo(id)}
                className="flex flex-col items-center gap-2 p-3 rounded-xl border border-gray-200 hover:border-brand-400 hover:bg-brand-50 transition-all text-center group"
              >
                <div className="w-9 h-9 rounded-lg bg-gray-100 group-hover:bg-brand-100 flex items-center justify-center transition-colors">
                  <Icon className="w-4 h-4 text-gray-500 group-hover:text-brand-600" />
                </div>
                <span className="text-xs text-gray-600 group-hover:text-brand-700 font-medium leading-tight">{label}</span>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* ── Two-panel layout ─────────────────────────────────────── */}
      <div className="max-w-6xl mx-auto px-4 py-10">

        {/* Mobile nav toggle */}
        <div className="lg:hidden sticky top-16 z-20 bg-white border border-gray-200 rounded-xl mb-6 shadow-sm">
          <button
            onClick={() => setMobileNavOpen(o => !o)}
            className="w-full flex items-center justify-between px-4 py-3 text-sm font-medium text-gray-700"
          >
            <span className="flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-brand-500" />
              {activeLabel}
            </span>
            {mobileNavOpen ? <X className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>
          {mobileNavOpen && (
            <div className="border-t border-gray-100 pb-2 max-h-72 overflow-y-auto">
              {NAV_GROUPS.map(group => (
                <div key={group.id} className="px-3 pt-3">
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1 px-2">{group.label}</p>
                  {group.items.map(({ id, label, icon: Icon }) => (
                    <button
                      key={id}
                      onClick={() => scrollTo(id)}
                      className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-colors ${
                        activeId === id ? 'bg-brand-50 text-brand-700 font-medium' : 'text-gray-600 hover:bg-gray-50'
                      }`}
                    >
                      <Icon className="w-3.5 h-3.5 flex-shrink-0" />
                      {label}
                    </button>
                  ))}
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="flex gap-8">
          {/* ── Sticky sidebar ─────────────────────────────────── */}
          <aside className="hidden lg:block w-56 flex-shrink-0">
            <div className="sticky top-24 space-y-5 max-h-[calc(100vh-6rem)] overflow-y-auto pr-2" style={{ scrollbarWidth: 'none' }}>
              {NAV_GROUPS.map(group => (
                <div key={group.id}>
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1.5 px-2">{group.label}</p>
                  <div className="space-y-0.5">
                    {group.items.map(({ id, label, icon: Icon }) => (
                      <button
                        key={id}
                        onClick={() => scrollTo(id)}
                        className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm transition-all ${
                          activeId === id
                            ? 'bg-brand-50 text-brand-700 font-semibold border border-brand-200'
                            : 'text-gray-500 hover:text-gray-900 hover:bg-gray-100'
                        }`}
                      >
                        <Icon className={`w-3.5 h-3.5 flex-shrink-0 ${activeId === id ? 'text-brand-500' : ''}`} />
                        <span className="text-left leading-snug">{label}</span>
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </aside>

          {/* ── Content ────────────────────────────────────────── */}
          <main className="flex-1 min-w-0 space-y-14">

            {/* ═══════════════════════════════════════════════════
                GETTING STARTED
            ═══════════════════════════════════════════════════ */}
            <div id="getting-started" className="scroll-mt-24">
              <div className="inline-flex items-center gap-2 bg-gray-100 text-gray-600 text-xs font-bold px-3 py-1 rounded-full mb-6 uppercase tracking-wider">
                Getting Started
              </div>
            </div>

            {/* 1 — What is Biddaro */}
            <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
              <SectionHeader id="what-is-biddaro" icon={BookOpen} number={1} title="What is Biddaro?" subtitle="Biddaro is a construction marketplace that connects job posters with skilled contractors. Whether you need a contractor for a renovation or you're a professional looking for projects, Biddaro brings both sides together on one platform." />
              <p className="text-sm text-gray-700 leading-relaxed mb-4">Biddaro operates on a <strong>bidding model</strong> — job posters publish their requirements and contractors compete by submitting their best bid. This drives competitive pricing and gives posters access to the right talent for every job.</p>
              <div className="grid sm:grid-cols-2 gap-4 my-5">
                <div className="bg-brand-50 border border-brand-200 rounded-xl p-4">
                  <div className="flex items-center gap-2 mb-2"><PlusCircle className="w-4 h-4 text-brand-600" /><strong className="text-sm text-brand-800">Job Posters</strong></div>
                  <ul className="text-xs text-brand-700 space-y-1">
                    <li>• Post construction jobs for free</li>
                    <li>• Receive competitive bids from verified contractors</li>
                    <li>• Manage contracts and milestone payments</li>
                    <li>• Track project progress in real time</li>
                  </ul>
                </div>
                <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
                  <div className="flex items-center gap-2 mb-2"><HardHat className="w-4 h-4 text-amber-600" /><strong className="text-sm text-amber-800">Contractors</strong></div>
                  <ul className="text-xs text-amber-700 space-y-1">
                    <li>• Browse thousands of live job listings</li>
                    <li>• Submit professional bids with timelines</li>
                    <li>• Earn securely through milestone payments</li>
                    <li>• Build a verified portfolio and reputation</li>
                  </ul>
                </div>
              </div>
              <Info2>Biddaro is available in India, UAE, Singapore, and USA. The platform supports multiple currencies and localized job categories.</Info2>
            </div>

            {/* 2 — Creating Your Account */}
            <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
              <SectionHeader id="creating-account" icon={User} number={2} title="Creating Your Account" subtitle="Getting started takes less than 2 minutes. Choose your role carefully — it determines which features you see." />
              <Steps steps={[
                'Visit <strong>biddaro.com</strong> and click <strong>Sign Up</strong> in the top-right corner.',
                'Enter your <strong>first name, last name, email address</strong>, and create a secure password.',
                'Choose your role: <strong>Job Poster</strong> (you hire contractors) or <strong>Contractor</strong> (you find work).',
                'Verify your email address by clicking the link sent to your inbox.',
                'Complete your profile — add a profile photo, bio, location, and skills (contractors) or company name (posters).',
                'You\'re ready to use the platform!'
              ]} />
              <Tip>Contractors with complete profiles (photo, bio, skills) receive up to 3× more bid invitations. Take 5 minutes to fill everything in before placing your first bid.</Tip>
              <Info2>You can only register with one role per email. If you need both roles (post jobs AND work as a contractor), use two separate email addresses.</Info2>
            </div>

            {/* 3 — Navigating Dashboard */}
            <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
              <SectionHeader id="navigating" icon={LayoutDashboard} number={3} title="Navigating the Dashboard" subtitle="After logging in, your dashboard gives you a complete overview of your activity. The left sidebar is your main navigation." />
              <DashboardMockup items={[
                { icon: '🏠', label: 'Dashboard' },
                { icon: '🔍', label: 'Find Work' },
                { icon: '⚒️', label: 'My Bids' },
                { icon: '📄', label: 'Contracts' },
                { icon: '💬', label: 'Messages' },
                { icon: '💰', label: 'Wallet' },
                { icon: '📦', label: 'Add-Ons' },
              ]} />
              <Bullets items={[
                '<strong>Dashboard</strong> — Your home screen with stats: active jobs, contracts, earnings, and recent activity.',
                '<strong>Sidebar</strong> — Collapses to icon-only mode. Click the arrow button on the left edge to toggle.',
                '<strong>Notifications</strong> — Bell icon in the top bar alerts you to new bids, messages, and contract updates.',
                '<strong>Profile</strong> — Access your public profile, edit your details, and manage account settings.',
                '<strong>Mobile</strong> — On mobile, tap the hamburger icon (☰) in the top-left to open the sidebar.',
              ]} />
            </div>

            {/* ═══════════════════════════════════════════════════
                FOR JOB POSTERS
            ═══════════════════════════════════════════════════ */}
            <div id="posters" className="scroll-mt-24">
              <div className="inline-flex items-center gap-2 bg-brand-100 text-brand-700 text-xs font-bold px-3 py-1 rounded-full mb-6 uppercase tracking-wider">
                <PlusCircle className="w-3.5 h-3.5" /> For Job Posters
              </div>
            </div>

            {/* 4 — Posting a Job */}
            <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
              <SectionHeader id="posting-job" icon={PlusCircle} number={4} title="Posting a Job" subtitle="Posting a job is free and takes under 3 minutes. The more detail you provide, the better bids you'll receive." />
              <Steps steps={[
                'From the sidebar, click <strong>Post a Job</strong> (or go to <strong>/jobs/post</strong>).',
                '<strong>Step 1 – Job Details:</strong> Enter a clear job title (e.g. "Bathroom Renovation in Mumbai"), select the category (Plumbing, Electrical, General Construction, etc.), and write a detailed description.',
                '<strong>Step 2 – Budget & Timeline:</strong> Set your budget range (minimum and maximum), select your preferred start date, and set a deadline.',
                '<strong>Step 3 – Location:</strong> Enter the job location. This helps local contractors find your listing.',
                '<strong>Step 4 – Attachments:</strong> Upload photos, blueprints, or documents to help contractors understand the scope of work.',
                'Click <strong>Post Job</strong> — your listing goes live immediately and contractors can start bidding.',
              ]} />
              <Tip>Jobs with photos or documents receive 2× more bids. Always upload at least one image showing the work area.</Tip>
              <Info2>You can edit or close a job at any time from <strong>My Jobs</strong> in the sidebar. Once a contract is active, the job is locked from editing.</Info2>
            </div>

            {/* 5 — Reviewing Bids */}
            <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
              <SectionHeader id="reviewing-bids" icon={ClipboardList} number={5} title="Reviewing Bids" subtitle="Once your job is live, contractors will submit bids. You can compare them side-by-side and choose the best fit." />
              <Steps steps={[
                'Go to <strong>My Jobs</strong> in the sidebar and click on your job.',
                'The <strong>Bids</strong> tab shows all received bids with contractor name, bid amount, estimated timeline, and a cover message.',
                'Click on a bid to see the contractor\'s full <strong>profile</strong> — rating, completed jobs, portfolio, and verification status.',
                'Use the <strong>Message</strong> button to ask the contractor questions before deciding.',
                'When ready, click <strong>Accept Bid</strong> to create a contract. All other bids are automatically declined.',
              ]} />
              <Bullets items={[
                '<strong>Verified badge</strong> — Contractors with a ✓ badge have been identity-verified by Biddaro.',
                '<strong>Rating</strong> — Star ratings (1–5) are from previous clients on completed contracts.',
                '<strong>Response time</strong> — How quickly the contractor typically replies to messages.',
              ]} />
              <Tip>Don't just pick the lowest bid. Review the contractor's past work and ratings to find the best value, not just the cheapest price.</Tip>
            </div>

            {/* 6 — Managing Contracts */}
            <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
              <SectionHeader id="managing-contracts" icon={FileText} number={6} title="Managing Contracts" subtitle="Once a bid is accepted, a contract is created. Contracts hold everything: milestones, payments, documents, and progress updates." />
              <Steps steps={[
                'Go to <strong>Contracts</strong> in the sidebar to see all active and past contracts.',
                'Click a contract to open its detail view — you\'ll see the agreed price, milestones, timeline, and contractor info.',
                'As work progresses, the contractor will <strong>mark milestones as complete</strong> and upload proof of work.',
                'You review the milestone evidence and either <strong>approve</strong> it (which releases payment) or <strong>request changes</strong>.',
                'Once all milestones are approved, the contract is <strong>marked as complete</strong> and you can leave a review.',
              ]} />
              <Info2>Funds for each milestone are held in escrow until you approve. This protects both parties — contractors know they'll be paid, and you only pay for work done.</Info2>
            </div>

            {/* 7 — Milestones */}
            <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
              <SectionHeader id="milestones" icon={Milestone} number={7} title="Milestones Explained" subtitle="Milestones break a contract into stages with defined payments. They protect both parties and keep projects on track." />
              <p className="text-sm text-gray-700 leading-relaxed mb-4">Instead of paying the full amount upfront, milestones let you split the project into deliverable stages. Each stage has its own payment amount. You only release payment after reviewing and approving the completed work for that stage.</p>
              <div className="bg-gray-50 rounded-xl p-4 my-4 space-y-3">
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Example: Bathroom Renovation ($5,000)</p>
                {[
                  { stage: 'Milestone 1', label: 'Demolition & Prep', amount: '$500', status: '✅ Approved' },
                  { stage: 'Milestone 2', label: 'Plumbing Rough-In', amount: '$1,500', status: '✅ Approved' },
                  { stage: 'Milestone 3', label: 'Tiling & Fixtures', amount: '$2,000', status: '⏳ In Review' },
                  { stage: 'Milestone 4', label: 'Final Handover', amount: '$1,000', status: '🔒 Locked' },
                ].map(({ stage, label, amount, status }) => (
                  <div key={stage} className="flex items-center justify-between text-xs bg-white border border-gray-200 rounded-lg px-3 py-2">
                    <span className="font-medium text-gray-700">{stage}: {label}</span>
                    <div className="flex items-center gap-3">
                      <span className="font-bold text-gray-900">{amount}</span>
                      <span>{status}</span>
                    </div>
                  </div>
                ))}
              </div>
              <Bullets items={[
                '<strong>Why use milestones?</strong> They prevent disputes by tying payment to verified, completed work.',
                '<strong>Who sets milestones?</strong> Either party can propose milestones when setting up the contract.',
                '<strong>Can I add milestones mid-contract?</strong> Yes, both parties can agree to modify the milestone structure.',
                '<strong>What if I dispute a milestone?</strong> Use the Dispute feature to escalate to Biddaro\'s review team.',
              ]} />
            </div>

            {/* 8 — Raising a Dispute */}
            <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
              <SectionHeader id="raising-dispute" icon={AlertCircle} number={8} title="Raising a Dispute" subtitle="If something goes wrong with a contract, Biddaro's dispute system protects you. Funds remain in escrow while the dispute is reviewed." />
              <Steps steps={[
                'Go to <strong>Disputes</strong> in the sidebar and click <strong>Raise a Dispute</strong>.',
                'Select the <strong>contract</strong> the dispute is about.',
                'Choose a <strong>reason</strong> (e.g. Work not completed, Quality issues, Contractor unresponsive, Payment not released).',
                'Write a detailed <strong>description</strong> of the issue and upload any supporting evidence (photos, messages).',
                'Submit the dispute — Biddaro\'s team will review within <strong>2–5 business days</strong>.',
                'Both parties will be contacted. A <strong>resolution</strong> will be issued (refund, partial payment, or contract continuation).',
              ]} />
              <Info2><strong>Important:</strong> Always try to resolve issues through Messages first. Disputes are for unresolved conflicts only. Misuse of the dispute system can affect your account standing.</Info2>
            </div>

            {/* ═══════════════════════════════════════════════════
                FOR CONTRACTORS
            ═══════════════════════════════════════════════════ */}
            <div id="contractors" className="scroll-mt-24">
              <div className="inline-flex items-center gap-2 bg-amber-100 text-amber-700 text-xs font-bold px-3 py-1 rounded-full mb-6 uppercase tracking-wider">
                <HardHat className="w-3.5 h-3.5" /> For Contractors
              </div>
            </div>

            {/* 9 — Finding Work */}
            <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
              <SectionHeader id="finding-work" icon={Search} number={9} title="Finding Work" subtitle="The Find Work page shows all active jobs posted by clients. Use filters to narrow down jobs that match your skills and location." />
              <Steps steps={[
                'Click <strong>Find Work</strong> in the sidebar to open the job feed.',
                'Use the <strong>Category filter</strong> to show only jobs in your trade (Electrical, Plumbing, etc.).',
                'Use the <strong>Budget filter</strong> to find jobs within your preferred price range.',
                'Use the <strong>Location filter</strong> to show jobs near you.',
                'Click on a job card to see the full description, budget, timeline, and client profile.',
                'If the job is a good fit, click <strong>Place a Bid</strong>.',
              ]} />
              <Tip>Sort jobs by <strong>Newest</strong> to see freshly posted listings before other contractors bid. Early bids often get more attention from posters.</Tip>
            </div>

            {/* 10 — Placing a Bid */}
            <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
              <SectionHeader id="placing-bid" icon={Gavel} number={10} title="Placing a Bid" subtitle="A strong bid explains why you're the right contractor, sets clear expectations, and presents a fair price. Quality beats quantity." />
              <Steps steps={[
                'Open a job listing and click <strong>Place a Bid</strong>.',
                'Enter your <strong>bid amount</strong> — this is the total price you\'ll charge for the complete job.',
                'Set your <strong>estimated completion time</strong> (in days).',
                'Write a <strong>cover message</strong> — explain your experience with similar work, how you\'d approach this job, and why you\'re the right choice. Be specific.',
                'Click <strong>Submit Bid</strong>. The client will be notified.',
              ]} />
              <div className="bg-green-50 border border-green-200 rounded-xl p-4 my-4">
                <p className="text-xs font-semibold text-green-700 mb-2">✍️ Example of a Strong Cover Message</p>
                <p className="text-xs text-green-800 italic leading-relaxed">"I've completed 15+ bathroom renovations in Mumbai over the past 5 years. For this job, I'd start with waterproofing before tiling to prevent future leaks — a step many contractors skip. I can begin next Monday and complete within 12 days. Happy to share photos of recent work."</p>
              </div>
              <Tip>Contractors with a <strong>verified profile photo and complete bio</strong> get 40% more bid acceptances. Complete your profile before bidding.</Tip>
            </div>

            {/* 11 — Managing Bids */}
            <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
              <SectionHeader id="managing-bids" icon={ListChecks} number={11} title="Managing Your Bids" subtitle="Track all your submitted bids from one place. Monitor status, withdraw bids, or follow up with clients." />
              <Bullets items={[
                '<strong>My Bids page</strong> — Go to Bids in the sidebar to see all your submitted bids.',
                '<strong>Pending</strong> — The client is reviewing your bid alongside others.',
                '<strong>Accepted</strong> — The client chose your bid! A contract has been created.',
                '<strong>Declined</strong> — The client chose another contractor. Review their feedback if any.',
                '<strong>Withdrawn</strong> — You cancelled the bid before the client made a decision.',
              ]} />
              <Info2>You can <strong>withdraw a bid</strong> at any time before it is accepted. Once accepted, withdrawing may affect your account reputation score.</Info2>
              <Tip>If your bid is pending for more than 48 hours, try sending a polite message through the job's message thread to show your continued interest.</Tip>
            </div>

            {/* 12 — Working on Contracts */}
            <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
              <SectionHeader id="working-contracts" icon={CheckSquare} number={12} title="Working on Contracts" subtitle="Once a bid is accepted, your contract begins. Complete milestones, upload proof, and request payment stage by stage." />
              <Steps steps={[
                'Go to <strong>Contracts</strong> in the sidebar and open the active contract.',
                'Review the agreed <strong>milestones</strong> and their payment amounts.',
                'Complete the work for the current milestone.',
                'Click <strong>Mark as Complete</strong> on that milestone and upload photos or documents as proof.',
                'The client will review your submission. If approved, the milestone payment is released to your <strong>wallet</strong>.',
                'Continue with the next milestone until all are complete.',
                'Once the final milestone is approved, the contract closes and you can request a <strong>review</strong> from the client.',
              ]} />
              <Tip>Always upload clear, timestamped photos as proof of completion. Good documentation prevents disputes and speeds up payment approval.</Tip>
            </div>

            {/* ═══════════════════════════════════════════════════
                WALLET & PAYMENTS
            ═══════════════════════════════════════════════════ */}
            <div id="wallet" className="scroll-mt-24">
              <div className="inline-flex items-center gap-2 bg-green-100 text-green-700 text-xs font-bold px-3 py-1 rounded-full mb-6 uppercase tracking-wider">
                <Wallet className="w-3.5 h-3.5" /> Wallet & Payments
              </div>
            </div>

            {/* 13 — Adding Money */}
            <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
              <SectionHeader id="adding-money" icon={ArrowDownLeft} number={13} title="Adding Money to Wallet" subtitle="Top up your Biddaro wallet via bank transfer. Funds are verified and credited within 1–3 business hours after admin review." />
              <Steps steps={[
                'Go to <strong>Wallet</strong> in the sidebar and click <strong>Add Funds</strong>.',
                'Select the <strong>amount</strong> you wish to deposit.',
                'You\'ll see Biddaro\'s bank account details — transfer the exact amount to this account.',
                'After transferring, come back to the Wallet page and click <strong>Submit Deposit Request</strong>.',
                'Enter the <strong>Transaction ID / Reference number</strong> from your bank transfer.',
                'Upload a <strong>screenshot</strong> of the payment confirmation from your bank app.',
                'Optionally add your <strong>sender name</strong> and <strong>bank name</strong> to speed up verification.',
                'Click <strong>Submit</strong> — Biddaro admin will verify and credit your wallet, usually within <strong>1–3 hours</strong>.',
              ]} />
              <Info2>Deposit requests are manually reviewed by the Biddaro team. You'll receive a notification once your balance is credited. If not credited within 24 hours, contact support.</Info2>
            </div>

            {/* 14 — Withdrawal */}
            <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
              <SectionHeader id="withdrawal" icon={ArrowUpRight} number={14} title="Making a Withdrawal" subtitle="Withdraw your earnings to your linked bank account. Processing takes 1–5 business days depending on your bank." />
              <Steps steps={[
                'First, add your <strong>bank account details</strong> — go to Wallet → Bank Settings and enter your account number, IFSC/IBAN, and account holder name.',
                'Go to <strong>Wallet</strong> and click <strong>Withdraw Funds</strong>.',
                'Enter the <strong>amount</strong> you want to withdraw (must be less than or equal to available balance).',
                'Confirm the destination bank account and click <strong>Submit Withdrawal</strong>.',
                'The withdrawal is reviewed and processed within <strong>1–5 business days</strong>.',
              ]} />
              <Bullets items={[
                '<strong>Minimum withdrawal:</strong> $10 (or local equivalent)',
                '<strong>Processing fee:</strong> Small platform fee may apply — shown before you confirm',
                '<strong>Bank account:</strong> Must be in your registered name for security verification',
              ]} />
              <Tip>Set up your bank account details before you need them. Withdrawals are faster when bank details are pre-verified.</Tip>
            </div>

            {/* 15 — Transactions */}
            <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
              <SectionHeader id="transactions" icon={BarChart2} number={15} title="Transaction History" subtitle="Every movement of funds is logged in your transaction history. Use it to track earnings, deposits, fees, and refunds." />
              <div className="space-y-2 my-4">
                {[
                  { type: 'Credit', desc: 'Milestone payment released', amount: '+$800', color: 'text-green-600 bg-green-50' },
                  { type: 'Fee', desc: 'Platform commission (5%)', amount: '-$40', color: 'text-red-500 bg-red-50' },
                  { type: 'Withdrawal', desc: 'Bank transfer to HDFC xxxx1234', amount: '-$500', color: 'text-orange-600 bg-orange-50' },
                  { type: 'Refund', desc: 'Dispute resolution refund', amount: '+$200', color: 'text-blue-600 bg-blue-50' },
                ].map(({ type, desc, amount, color }) => (
                  <div key={type+desc} className="flex items-center gap-3 bg-gray-50 rounded-xl px-4 py-3">
                    <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${color}`}>{type}</span>
                    <span className="flex-1 text-sm text-gray-700">{desc}</span>
                    <span className={`text-sm font-bold ${amount.startsWith('+') ? 'text-green-600' : 'text-gray-700'}`}>{amount}</span>
                  </div>
                ))}
              </div>
              <Bullets items={[
                '<strong>Credit</strong> — Money added to your wallet (milestone payment, deposit, refund)',
                '<strong>Debit / Fee</strong> — Platform commission charged on completed milestone payments',
                '<strong>Withdrawal</strong> — Money sent to your bank account',
                '<strong>Refund</strong> — Money returned after a dispute resolution',
              ]} />
            </div>

            {/* ═══════════════════════════════════════════════════
                ADD-ONS & PLUGINS
            ═══════════════════════════════════════════════════ */}
            <div id="addons" className="scroll-mt-24">
              <div className="inline-flex items-center gap-2 bg-purple-100 text-purple-700 text-xs font-bold px-3 py-1 rounded-full mb-6 uppercase tracking-wider">
                <Package className="w-3.5 h-3.5" /> Add-Ons & Plugins
              </div>
            </div>

            {/* 16 — What are Add-Ons */}
            <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
              <SectionHeader id="what-are-addons" icon={Package} number={16} title="What are Add-Ons?" subtitle="Add-ons are optional extensions that enhance your Biddaro experience. Think of them as plugins that add new capabilities to your account." />
              <p className="text-sm text-gray-700 leading-relaxed mb-4">Add-ons can be tools for contractors (like a quote calculator), features for job posters (like advanced analytics), or productivity tools for both. Some are free, others are paid on a monthly or one-time basis.</p>
              <div className="grid sm:grid-cols-3 gap-3 my-4">
                {[
                  { icon: '🆓', type: 'Free', desc: 'Install instantly, no payment required' },
                  { icon: '🔄', type: 'Monthly', desc: 'Billed monthly, cancel anytime' },
                  { icon: '💳', type: 'One-Time', desc: 'Pay once, own forever' },
                ].map(({ icon, type, desc }) => (
                  <div key={type} className="bg-gray-50 border border-gray-200 rounded-xl p-3 text-center">
                    <div className="text-2xl mb-1">{icon}</div>
                    <p className="text-sm font-semibold text-gray-800">{type}</p>
                    <p className="text-xs text-gray-500 mt-0.5">{desc}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* 17 — Browsing Add-Ons */}
            <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
              <SectionHeader id="browsing-addons" icon={Search} number={17} title="Browsing Add-Ons" subtitle="Find the right add-on for your needs using the search and category filters in the Add-Ons marketplace." />
              <Steps steps={[
                'Click <strong>Add-Ons</strong> in the sidebar to open the marketplace.',
                'Use the <strong>search bar</strong> to find add-ons by name or keyword.',
                'Filter by <strong>category</strong> (Productivity, Finance, Marketing, etc.) using the tabs at the top.',
                'Each add-on card shows the name, description, pricing type, and whether it\'s for contractors, job posters, or both.',
                'Look for <strong>NEW</strong> and <strong>Popular</strong> badges to spot trending add-ons.',
              ]} />
              <Info2>Some add-ons are marked <strong>"Coming Soon"</strong> — these are in development. You can't install them yet but they'll appear automatically when released.</Info2>
            </div>

            {/* 18 — Installing */}
            <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
              <SectionHeader id="installing-addon" icon={Download} number={18} title="Installing an Add-On" subtitle="Installing an add-on takes one click. Paid add-ons are charged to your wallet balance." />
              <Steps steps={[
                'Find the add-on you want in the <strong>Add-Ons</strong> marketplace.',
                'Click the <strong>Install</strong> button on the add-on card.',
                'For <strong>free add-ons</strong> — installation is immediate.',
                'For <strong>paid add-ons</strong> — a confirmation popup shows the cost. Your wallet must have sufficient balance. Click <strong>Confirm & Install</strong>.',
                'The add-on is now active. You\'ll see a <strong>green checkmark</strong> on the card.',
                'Access the installed add-on from its dedicated section or from the Add-Ons page.',
              ]} />
              <Tip>Check your wallet balance before installing paid add-ons. If insufficient funds, go to Wallet → Add Funds first.</Tip>
            </div>

            {/* 19 — Managing Add-Ons */}
            <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
              <SectionHeader id="managing-addons" icon={Trash2} number={19} title="Managing Installed Add-Ons" subtitle="View all your installed add-ons, check their status, and uninstall any you no longer need." />
              <Bullets items={[
                'Go to <strong>Add-Ons</strong> → your installed add-ons are highlighted with a green border and checkmark.',
                'Click <strong>Uninstall</strong> to remove an add-on. For monthly subscriptions, you won\'t be charged next month.',
                'Uninstalling a one-time purchase removes the feature immediately — there are no refunds.',
                'Re-installing a previously purchased one-time add-on is free.',
              ]} />
            </div>

            {/* ═══════════════════════════════════════════════════
                PREMIUM
            ═══════════════════════════════════════════════════ */}
            <div id="premium" className="scroll-mt-24">
              <div className="inline-flex items-center gap-2 bg-amber-100 text-amber-700 text-xs font-bold px-3 py-1 rounded-full mb-6 uppercase tracking-wider">
                <Crown className="w-3.5 h-3.5" /> Premium & Subscription
              </div>
            </div>

            {/* 20 — Biddaro Premium */}
            <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
              <SectionHeader id="biddaro-premium" icon={Crown} number={20} title="Biddaro Premium" subtitle="Biddaro Premium is the paid tier for contractors who want to grow faster, win more bids, and pay lower fees." />
              <div className="grid sm:grid-cols-3 gap-4 my-4">
                {[
                  { plan: 'Monthly', price: '$9.99/mo', saving: '' },
                  { plan: 'Quarterly', price: '$24.99/qtr', saving: 'Save 17%' },
                  { plan: 'Annual', price: '$79.99/yr', saving: 'Save 33%' },
                ].map(({ plan, price, saving }) => (
                  <div key={plan} className="bg-gradient-to-br from-amber-50 to-orange-50 border border-amber-200 rounded-xl p-4 text-center">
                    <Crown className="w-5 h-5 text-amber-500 mx-auto mb-2" />
                    <p className="font-bold text-gray-900">{plan}</p>
                    <p className="text-lg font-bold text-amber-600 mt-1">{price}</p>
                    {saving && <p className="text-xs text-green-600 font-semibold mt-0.5">{saving}</p>}
                  </div>
                ))}
              </div>
            </div>

            {/* 21 — Upgrading */}
            <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
              <SectionHeader id="upgrading" icon={Star} number={21} title="Upgrading to Premium" subtitle="Subscribe to Premium through your dashboard. Payment is deducted from your Biddaro wallet." />
              <Steps steps={[
                'Click <strong>Premium</strong> in the sidebar (or go to <strong>/subscription</strong>).',
                'Choose your plan: <strong>Monthly, Quarterly, or Annual</strong>.',
                'Click <strong>Subscribe Now</strong>.',
                'Confirm the payment — funds are deducted from your wallet balance.',
                'Your account is upgraded instantly. A <strong>Crown (👑)</strong> badge appears on your profile.',
              ]} />
              <Info2>Make sure your wallet has enough balance before subscribing. If insufficient, add funds first via Wallet → Add Funds.</Info2>
            </div>

            {/* 22 — Premium Benefits */}
            <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
              <SectionHeader id="premium-benefits" icon={TrendingUp} number={22} title="Premium Benefits" subtitle="Premium contractors gain significant advantages that help them win more work and earn more." />
              <div className="space-y-3 my-4">
                {[
                  { icon: Zap, title: 'Priority in Search Results', desc: 'Your profile and bids appear higher in search results and job recommendations.' },
                  { icon: DollarSign, title: 'Lower Platform Commission', desc: 'Pay reduced platform fees on every completed milestone — keep more of what you earn.' },
                  { icon: BadgeCheck, title: 'Verified Premium Badge', desc: 'A gold crown badge on your profile signals trust and professionalism to job posters.' },
                  { icon: Bot, title: 'AI Recommendation Boost', desc: 'Biddaro\'s AI recommends your profile first when matching contractors to jobs.' },
                  { icon: Crown, title: 'Priority Access to Projects', desc: 'Access government and corporate projects before non-premium contractors.' },
                  { icon: Users, title: '5× More Profile Views', desc: 'Premium profiles are featured in more searches and discovery surfaces.' },
                ].map(({ icon: Icon, title, desc }) => (
                  <div key={title} className="flex gap-3">
                    <div className="w-9 h-9 rounded-xl bg-amber-100 flex items-center justify-center flex-shrink-0">
                      <Icon className="w-4 h-4 text-amber-600" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-gray-900">{title}</p>
                      <p className="text-xs text-gray-500">{desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* ═══════════════════════════════════════════════════
                TOOLS & FEATURES
            ═══════════════════════════════════════════════════ */}
            <div id="tools" className="scroll-mt-24">
              <div className="inline-flex items-center gap-2 bg-blue-100 text-blue-700 text-xs font-bold px-3 py-1 rounded-full mb-6 uppercase tracking-wider">
                <Zap className="w-3.5 h-3.5" /> Tools & Features
              </div>
            </div>

            {/* 23 — Project Tracking */}
            <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
              <SectionHeader id="project-tracking" icon={Radio} number={23} title="Project Tracking" subtitle="Keep clients and contractors aligned with real-time progress updates. Post photos, notes, and milestone check-ins directly to the contract timeline." />
              <Bullets items={[
                'Go to <strong>Project Tracking</strong> in the sidebar and select a contract.',
                'Post updates with types: <strong>Update</strong> (text), <strong>Photo</strong> (images), <strong>Note</strong> (internal), or <strong>Milestone</strong> (progress markers).',
                'Each update is timestamped and visible to both parties.',
                'The <strong>progress bar</strong> shows overall contract completion percentage.',
                'Both job poster and contractor can post updates — keeping communication transparent.',
              ]} />
              <Tip>Contractors: post a photo update at the end of each day. Clients love seeing progress — it builds trust and reduces back-and-forth messages.</Tip>
            </div>

            {/* 24 — Build Planner */}
            <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
              <SectionHeader id="build-planner" icon={Hammer} number={24} title="Build Planner" subtitle="Plan your entire construction project in phases. Track completion, manage checklists, and monitor your budget — all in one place." />
              <Bullets items={[
                'Go to <strong>Build Planner</strong> in the sidebar.',
                'Create a <strong>project</strong> and add <strong>build phases</strong> (Foundation, Framing, Electrical, Plumbing, Finishing, etc.).',
                'Each phase has a <strong>checklist</strong> of tasks. Tick items off as they\'re completed.',
                'Upload <strong>photos and documents</strong> to each phase for reference.',
                'The <strong>overall completion percentage</strong> updates automatically as you check off tasks.',
                'Track your <strong>budget</strong> against actual spending within each phase.',
              ]} />
              <Info2>The Build Planner is a personal planning tool — it doesn't connect directly to contracts. Use it alongside Project Tracking for full visibility.</Info2>
            </div>

            {/* 25 — Project Manager */}
            <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
              <SectionHeader id="project-manager" icon={FolderKanban} number={25} title="Project Manager" subtitle="A kanban-style board to organize tasks across multiple projects. Ideal for contractors managing several jobs simultaneously." />
              <Bullets items={[
                'Go to <strong>Project Manager</strong> in the sidebar.',
                'Create <strong>boards</strong> for each project, with columns like To Do, In Progress, and Done.',
                'Add <strong>task cards</strong> with descriptions, due dates, and assignees.',
                'Drag and drop cards between columns as work progresses.',
                'Use it to coordinate your team on larger construction projects.',
              ]} />
            </div>

            {/* 26 — Loans */}
            <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
              <SectionHeader id="loans" icon={Banknote} number={26} title="Loans" subtitle="Biddaro offers construction financing tailored for contractors and job posters. From home construction to equipment finance — competitive rates, fast approval." />
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3 my-4">
                {[
                  { name: 'Home Construction', max: '$500K', rate: '8.5%', tenure: '20 yrs' },
                  { name: 'Renovation Loan', max: '$200K', rate: '9.5%', tenure: '10 yrs' },
                  { name: 'Equipment Finance', max: '$300K', rate: '10%', tenure: '7 yrs' },
                  { name: 'Working Capital', max: '$150K', rate: '11%', tenure: '3 yrs' },
                  { name: 'Personal Loan', max: '$50K', rate: '12%', tenure: '5 yrs' },
                ].map(({ name, max, rate, tenure }) => (
                  <div key={name} className="bg-gray-50 border border-gray-200 rounded-xl p-3">
                    <p className="text-xs font-bold text-gray-800 mb-2">{name}</p>
                    <div className="space-y-1 text-xs text-gray-500">
                      <div className="flex justify-between"><span>Max amount</span><strong className="text-gray-800">{max}</strong></div>
                      <div className="flex justify-between"><span>From</span><strong className="text-green-600">{rate} p.a.</strong></div>
                      <div className="flex justify-between"><span>Up to</span><strong className="text-gray-800">{tenure}</strong></div>
                    </div>
                  </div>
                ))}
              </div>
              <Steps steps={[
                'Visit <strong>/loans</strong> (or click Loans in the navbar) to see the public overview and use the EMI calculator.',
                'Log in and go to <strong>My Loans</strong> from the sidebar.',
                'Click <strong>Apply Now</strong>, choose a loan type, and fill out the application form.',
                'Submit — you\'ll receive a decision within <strong>2–5 business days</strong>.',
                'Track your application status in the <strong>My Applications</strong> tab.',
              ]} />
            </div>

            {/* 27 — AI Assistant */}
            <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
              <SectionHeader id="ai-assistant" icon={Bot} number={27} title="AI Assistant" subtitle="Biddaro offers two complementary AI experiences: a full-featured general-purpose chat assistant and 8 purpose-built tools — all free, no login required." />

              {/* Sub-section A — Overview banner */}
              <div className="bg-gradient-to-r from-brand-50 to-blue-50 border border-brand-200 rounded-xl p-5 my-5">
                <div className="flex flex-wrap items-center justify-between gap-4">
                  <div>
                    <p className="text-sm font-semibold text-gray-800 mb-1">Two ways to use Biddaro AI</p>
                    <p className="text-xs text-gray-500">Full chat assistant with memory · 8 specialised expert tools</p>
                  </div>
                  <div className="flex gap-3 flex-wrap">
                    <Link href="/ai-assistant" className="inline-flex items-center gap-2 bg-brand-600 text-white text-sm font-medium px-4 py-2 rounded-lg hover:bg-brand-700 transition-colors">
                      <Sparkles className="w-4 h-4" />Open AI Assistant
                    </Link>
                    <Link href="/ai" className="inline-flex items-center gap-2 bg-white border border-gray-300 text-gray-700 text-sm font-medium px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors">
                      Browse All Tools <ArrowRight className="w-4 h-4" />
                    </Link>
                  </div>
                </div>
                <p className="text-xs text-green-700 font-medium mt-3 flex items-center gap-1">
                  <BadgeCheck className="w-3.5 h-3.5" /> No login required — 100% free
                </p>
              </div>

              {/* Sub-section B — Full AI Assistant */}
              <div className="mt-6">
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-8 h-8 rounded-lg bg-purple-100 flex items-center justify-center">
                    <Sparkles className="w-4 h-4 text-purple-600" />
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-gray-900">Full AI Assistant — General-Purpose Chat</h4>
                    <p className="text-xs text-gray-500">Remembers your conversation · Best for complex, multi-topic questions</p>
                  </div>
                </div>
                <Steps steps={[
                  'Go to <strong>/ai-assistant</strong> from the top navbar (or click "Open AI Assistant" above).',
                  'Start a new conversation — click <strong>+ New Chat</strong> in the left sidebar.',
                  'Type your question in the chat box and press <strong>Enter</strong> or click <strong>Send</strong>.',
                  'To attach a photo or document, click the <strong>paperclip icon</strong> — supports images, PDFs, up to 20 MB.',
                  'To use voice input, click the <strong>microphone icon</strong> and speak your question.',
                  'Your conversation history is saved automatically — find past chats in the <strong>left sidebar</strong>.',
                  'Hover over any AI reply to <strong>Copy</strong> or <strong>Regenerate</strong> the response.',
                ]} />
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-4">
                  {[
                    { icon: History, label: 'Conversation History', desc: 'All chats saved automatically' },
                    { icon: Paperclip, label: 'File & Image Upload', desc: 'Photos, PDFs up to 20 MB' },
                    { icon: Mic, label: 'Voice Input', desc: 'Speak instead of type' },
                    { icon: RefreshCw, label: 'Regenerate & Copy', desc: 'Retry or copy any reply' },
                  ].map(({ icon: Icon, label, desc }) => (
                    <div key={label} className="bg-purple-50 border border-purple-100 rounded-xl p-3 text-center">
                      <Icon className="w-5 h-5 text-purple-600 mx-auto mb-1.5" />
                      <p className="text-xs font-semibold text-gray-800">{label}</p>
                      <p className="text-xs text-gray-500 mt-0.5">{desc}</p>
                    </div>
                  ))}
                </div>
                <Tip>Use the full AI assistant for complex questions that span multiple topics — it remembers everything you said in the conversation.</Tip>
              </div>

              {/* Sub-section C — 8 Specialised Tools */}
              <div className="mt-8">
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center">
                    <Zap className="w-4 h-4 text-blue-600" />
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-gray-900">8 Specialised Expert Tools</h4>
                    <p className="text-xs text-gray-500">Each pre-configured with deep knowledge for a specific construction topic</p>
                  </div>
                </div>
                <AiToolsAccordion />
              </div>

              {/* Sub-section D — Pro Tips */}
              <div className="mt-6 bg-amber-50 border border-amber-200 rounded-xl p-4">
                <p className="text-sm font-semibold text-amber-800 mb-2 flex items-center gap-1.5">
                  <Lightbulb className="w-4 h-4" /> Pro Tips
                </p>
                <ul className="space-y-1.5 text-xs text-amber-900">
                  <li className="flex items-start gap-2"><span className="text-amber-500 mt-0.5">•</span> Use specialised tools first — they give more focused, expert-level answers than the general assistant.</li>
                  <li className="flex items-start gap-2"><span className="text-amber-500 mt-0.5">•</span> Upload photos to the full AI assistant for personalised renovation advice based on your actual space.</li>
                  <li className="flex items-start gap-2"><span className="text-amber-500 mt-0.5">•</span> After using AI tools, post your job on Biddaro to get real contractor bids based on your AI estimates.</li>
                </ul>
              </div>
            </div>

            {/* 28 — Messages */}
            <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
              <SectionHeader id="messages" icon={MessageSquare} number={28} title="Messages" subtitle="Communicate directly with contractors or job posters within Biddaro. All messages are logged for dispute resolution." />
              <Bullets items={[
                'Go to <strong>Messages</strong> in the sidebar to see all your conversations.',
                'Click on any conversation to open it and send a message.',
                'You can share <strong>text, images, and documents</strong> within messages.',
                'New messages trigger a <strong>notification</strong> (bell icon) in the top bar.',
                'Messages are attached to specific jobs or contracts — making them easy to find later.',
              ]} />
              <Info2>Biddaro keeps all messages for 12 months. If a dispute arises, your message history is available to the resolution team as evidence.</Info2>
              <Tip>Always discuss major changes (scope, timeline, price) through Messages — not over phone or external chat. Written records protect both parties.</Tip>
            </div>

            {/* 29 — Disputes */}
            <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
              <SectionHeader id="disputes" icon={ShieldAlert} number={29} title="Disputes" subtitle="The dispute system is Biddaro's mechanism for resolving disagreements between job posters and contractors fairly and transparently." />
              <Steps steps={[
                'Go to <strong>Disputes</strong> in the sidebar.',
                'Click <strong>Raise a Dispute</strong> and select the relevant contract.',
                'Choose a reason: <strong>Work not completed, Quality issues, Payment not released, Contractor/Poster unresponsive</strong>, or Other.',
                'Write a clear description and upload <strong>evidence</strong> (photos, screenshots, documents).',
                'The other party is notified and has <strong>48 hours</strong> to respond.',
                'Biddaro\'s resolution team reviews both sides and issues a decision within <strong>5 business days</strong>.',
              ]} />
              <div className="grid sm:grid-cols-3 gap-3 my-4">
                {[
                  { status: '🟡 Open', desc: 'Dispute submitted, awaiting review' },
                  { status: '🔵 Under Review', desc: 'Biddaro team is reviewing the case' },
                  { status: '✅ Resolved', desc: 'Decision issued, funds released' },
                ].map(({ status, desc }) => (
                  <div key={status} className="bg-gray-50 border border-gray-200 rounded-xl p-3 text-center">
                    <p className="text-sm font-semibold text-gray-800 mb-1">{status}</p>
                    <p className="text-xs text-gray-500">{desc}</p>
                  </div>
                ))}
              </div>
              <Info2><strong>Funds are frozen</strong> during an active dispute. Neither party can withdraw the disputed amount until resolution. This ensures fair outcomes for everyone.</Info2>

              {/* Final CTA */}
              <div className="mt-10 bg-gradient-to-br from-brand-500 to-brand-600 rounded-2xl p-6 text-white text-center">
                <BookOpen className="w-8 h-8 mx-auto mb-3 opacity-80" />
                <h3 className="text-lg font-bold mb-2">Ready to get started?</h3>
                <p className="text-brand-100 text-sm mb-4">Join thousands of contractors and job posters already using Biddaro.</p>
                <div className="flex flex-wrap gap-3 justify-center">
                  <Link href="/register">
                    <button className="bg-white text-brand-700 font-semibold text-sm px-5 py-2.5 rounded-xl hover:bg-gray-100 transition-colors flex items-center gap-2">
                      Create Free Account <ArrowRight className="w-4 h-4" />
                    </button>
                  </Link>
                  <Link href="/open-jobs">
                    <button className="bg-white/20 text-white font-semibold text-sm px-5 py-2.5 rounded-xl hover:bg-white/30 transition-colors border border-white/30">
                      Browse Jobs
                    </button>
                  </Link>
                </div>
              </div>
            </div>

          </main>
        </div>
      </div>

      <Footer />
    </div>
  );
}
