'use client';
import React, { useState } from 'react';
import Link from 'next/link';
import {
  ArrowRight, Camera, Mic, FileText, Zap, CheckCircle,
  BarChart3, ClipboardCheck, MapPin, Download, Star,
  ChevronDown, Shield, Globe, Clock, TrendingUp,
  Layers, Cpu, PenTool, Users, Building2, HardHat,
  Wrench, Home, Briefcase,
} from 'lucide-react';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';

// ─── JSON-LD Schemas ──────────────────────────────────────────────────────────

const SOFTWARE_APPLICATION_SCHEMA = {
  '@context': 'https://schema.org',
  '@type': 'SoftwareApplication',
  name: 'Biddaro Inspect',
  applicationCategory: 'BusinessApplication',
  operatingSystem: 'Android, iOS, Web',
  description:
    'AI-powered construction inspection report software. Capture photos, voice notes, and observations on site — get a professional client-ready report in minutes.',
  url: 'https://biddaro.com/biddaro-inspect',
  screenshot: 'https://biddaro.com/og-inspect.png',
  offers: {
    '@type': 'Offer',
    price: '0',
    priceCurrency: 'USD',
    description: 'Free during beta',
  },
  aggregateRating: {
    '@type': 'AggregateRating',
    ratingValue: '5',
    ratingCount: '3',
    bestRating: '5',
    worstRating: '1',
  },
  provider: {
    '@type': 'Organization',
    name: 'Biddaro',
    url: 'https://biddaro.com',
  },
};

const FAQ_SCHEMA = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: 'How does Biddaro Inspect learn my report format?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'You upload your existing report template (Word, PDF, or a sample report). Our AI analyses the structure, headings, section order, and writing style. Within minutes it can generate new reports that match your format — indistinguishable from reports you wrote manually.',
      },
    },
    {
      '@type': 'Question',
      name: 'Does it work without internet on site?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Yes. The mobile app works fully offline. Photos, voice notes, and typed observations are stored locally and sync automatically when you regain connectivity. Nothing is lost if you lose signal mid-inspection.',
      },
    },
    {
      '@type': 'Question',
      name: 'What file formats does it export?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Biddaro Inspect exports to Microsoft Word (.docx) and PDF. Word export means you can make final edits before sending. PDF export is ready to send directly to clients.',
      },
    },
    {
      '@type': 'Question',
      name: 'Is our inspection data secure?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Yes. All data is encrypted in transit and at rest. Biddaro Inspect will be SOC 2 Type II certified. Your reports and site photos are never used to train AI models.',
      },
    },
    {
      '@type': 'Question',
      name: 'Can I use this alongside the Biddaro Site Manager ERP?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Yes — Biddaro Inspect is built to work alongside Site Manager. Inspection findings automatically create tasks in your project, and DPRs can be generated from the same field capture session.',
      },
    },
    {
      '@type': 'Question',
      name: 'What types of inspections does it support?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Any inspection type — site progress, defect identification, structural assessment, MEP commissioning, pre-handover punch lists, property condition assessments, and more. The AI adapts to whatever format and inspection type you need.',
      },
    },
    {
      '@type': 'Question',
      name: 'How long does it take to generate a report?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Most reports are generated in under 5 minutes from the moment you finish your site capture. The AI processes your photos, voice notes, and observations and produces a structured draft ready for your review.',
      },
    },
    {
      '@type': 'Question',
      name: 'Is Biddaro Inspect available in India, UAE, and Singapore?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Yes. Biddaro Inspect is available in India, UAE, and Singapore. The platform supports INR, AED, and SGD pricing, and the team provides local support in each market.',
      },
    },
  ],
};

const BREADCRUMB_SCHEMA = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    {
      '@type': 'ListItem',
      position: 1,
      name: 'Home',
      item: 'https://biddaro.com',
    },
    {
      '@type': 'ListItem',
      position: 2,
      name: 'Biddaro Inspect',
      item: 'https://biddaro.com/biddaro-inspect',
    },
  ],
};

const HOWTO_SCHEMA = {
  '@context': 'https://schema.org',
  '@type': 'HowTo',
  name: 'How to generate a construction inspection report with Biddaro Inspect',
  description:
    'Turn field observations into a professional client-ready inspection report in four steps using Biddaro Inspect AI.',
  totalTime: 'PT5M',
  step: [
    {
      '@type': 'HowToStep',
      position: 1,
      name: 'Upload your template',
      text: 'Send us your existing inspection report format — Word doc, PDF, or describe it. Biddaro Inspect learns your structure, headings, and tone in minutes.',
    },
    {
      '@type': 'HowToStep',
      position: 2,
      name: 'Capture on site',
      text: 'Use the mobile app to take photos, record voice notes, and type observations. Works offline — syncs when you\'re back in range.',
    },
    {
      '@type': 'HowToStep',
      position: 3,
      name: 'AI writes the report',
      text: 'Our AI reads your field data, matches your writing style, and generates a structured, professional inspection report — in your exact format.',
    },
    {
      '@type': 'HowToStep',
      position: 4,
      name: 'Review and export',
      text: 'Open the draft, make any edits, and export as Word (.docx) or PDF. Clients get a branded, professional document in minutes — not days.',
    },
  ],
};

// ─── Data ─────────────────────────────────────────────────────────────────────

const STATS = [
  { value: '80%', label: 'Less time on reports', icon: Clock },
  { value: '< 5 min', label: 'Site to client-ready draft', icon: Zap },
  { value: '1 app', label: 'Capture → report → tasks', icon: Layers },
  { value: '100%', label: 'Your brand, your format', icon: PenTool },
];

const STEPS = [
  {
    num: '01',
    title: 'Upload your template',
    desc: 'Send us your existing inspection report format — Word doc, PDF, or describe it. Biddaro Inspect learns your structure, headings, and tone in minutes.',
    icon: FileText,
    color: 'brand',
  },
  {
    num: '02',
    title: 'Capture on site',
    desc: 'Use the mobile app to take photos, record voice notes, and type observations. Works offline — syncs when you\'re back in range.',
    icon: Camera,
    color: 'blue',
  },
  {
    num: '03',
    title: 'AI writes the report',
    desc: 'Our AI reads your field data, matches your writing style, and generates a structured, professional inspection report — in your exact format.',
    icon: Cpu,
    color: 'purple',
  },
  {
    num: '04',
    title: 'Review and export',
    desc: 'Open the draft, make any edits, and export as Word (.docx) or PDF. Clients get a branded, professional document in minutes — not days.',
    icon: Download,
    color: 'green',
  },
];

const FEATURES = [
  {
    tag: '01 — Mobile Capture',
    headline: 'Real-time capture, built for the field',
    sub: 'Your team captures everything on site — photos, voice, text. Biddaro Inspect handles the rest.',
    bullets: [
      { icon: Camera, text: 'Photo documentation with GPS tagging and annotations' },
      { icon: Mic, text: 'Voice notes with automatic speech-to-text transcription' },
      { icon: FileText, text: 'Typed observations with smart field templates' },
      { icon: Globe, text: 'Full offline mode — syncs automatically when online' },
    ],
    visual: 'capture',
  },
  {
    tag: '02 — AI Reports',
    headline: 'Your reports. Your brand. Generated by AI.',
    sub: 'Stop spending hours formatting Word docs. Biddaro Inspect produces client-ready reports that match your existing style — automatically.',
    bullets: [
      { icon: PenTool, text: 'Replicates your existing report templates exactly' },
      { icon: Cpu, text: 'AI adapts to your company writing voice and tone' },
      { icon: Download, text: 'Direct Word (.docx) and PDF export' },
      { icon: FileText, text: 'Legacy report modernisation — upload old formats to digitise' },
    ],
    visual: 'report',
  },
  {
    tag: '03 — Project Dashboard',
    headline: 'Track every inspection. Review as a team.',
    sub: 'All reports in one place with team review workflows, comment threads, and one-click client delivery.',
    bullets: [
      { icon: BarChart3, text: 'Live project dashboards with review status' },
      { icon: ClipboardCheck, text: 'Team review and approval workflow before delivery' },
      { icon: Cpu, text: 'Ask AI questions about your portfolio in plain English' },
      { icon: MapPin, text: 'Site plan markup with PDF and DWG support' },
    ],
    visual: 'dashboard',
  },
];

const USE_CASES = [
  { icon: HardHat, title: 'Construction Contractors', desc: 'Daily site inspection reports, defect logs, and progress documentation sent to clients and consultants.' },
  { icon: Building2, title: 'Building Engineers', desc: 'Structural and envelope inspection reports with annotated photos, findings, and remediation recommendations.' },
  { icon: Home, title: 'Property Inspectors', desc: 'Home inspection reports in minutes. No more late nights reformatting Word templates for every client.' },
  { icon: Wrench, title: 'MEP Contractors', desc: 'Mechanical, electrical, and plumbing inspection documentation that matches consultant-required formats.' },
  { icon: Briefcase, title: 'Project Managers', desc: 'Quality assurance inspection records, punch lists, and site audit trails — all in one searchable platform.' },
  { icon: Users, title: 'Facilities Teams', desc: 'Ongoing maintenance inspection reports with task creation and team assignment built in.' },
];

const FAQS = [
  {
    q: 'How does Biddaro Inspect learn my report format?',
    a: 'You upload your existing report template (Word, PDF, or a sample report). Our AI analyses the structure, headings, section order, and writing style. Within minutes it can generate new reports that match your format — indistinguishable from reports you wrote manually.',
  },
  {
    q: 'Does it work without internet on site?',
    a: 'Yes. The mobile app works fully offline. Photos, voice notes, and typed observations are stored locally and sync automatically when you regain connectivity. Nothing is lost if you lose signal mid-inspection.',
  },
  {
    q: 'What file formats does it export?',
    a: 'Biddaro Inspect exports to Microsoft Word (.docx) and PDF. Word export means you can make final edits before sending. PDF export is ready to send directly to clients.',
  },
  {
    q: 'Is our inspection data secure?',
    a: 'Yes. All data is encrypted in transit and at rest. Biddaro Inspect will be SOC 2 Type II certified. Your reports and site photos are never used to train AI models.',
  },
  {
    q: 'Can I use this alongside the Biddaro Site Manager ERP?',
    a: 'Yes — Biddaro Inspect is built to work alongside Site Manager. Inspection findings automatically create tasks in your project, and DPRs can be generated from the same field capture session.',
  },
  {
    q: 'What types of inspections does it support?',
    a: 'Any inspection type — site progress, defect identification, structural assessment, MEP commissioning, pre-handover punch lists, property condition assessments, and more. The AI adapts to whatever format and inspection type you need.',
  },
];

const TESTIMONIALS = [
  {
    text: 'We were spending 3 hours per report. Now it takes 20 minutes from site to PDF. Our clients actually comment on how professional the reports look.',
    name: 'Rajesh Mehta',
    role: 'Site Engineer, Mumbai',
    rating: 5,
  },
  {
    text: 'The offline mode is what sold us. Our sites don\'t always have signal. Being able to capture everything and have it sync automatically is a game changer.',
    name: 'Priya Nair',
    role: 'Building Inspector, Pune',
    rating: 5,
  },
  {
    text: 'The AI actually writes in our style. I was sceptical but after the first report I couldn\'t tell the difference. We now send twice as many inspection reports per month.',
    name: 'Arjun Singh',
    role: 'Project Manager, Delhi NCR',
    rating: 5,
  },
];

// ─── Visual Mockups ───────────────────────────────────────────────────────────

function CaptureVisual() {
  return (
    <div className="relative bg-dark-900 rounded-2xl p-6 shadow-2xl border border-dark-700 max-w-sm mx-auto">
      <div className="flex items-center gap-2 mb-4">
        <div className="w-3 h-3 rounded-full bg-red-500" />
        <div className="w-3 h-3 rounded-full bg-yellow-500" />
        <div className="w-3 h-3 rounded-full bg-green-500" />
        <span className="ml-auto text-xs text-dark-400">Biddaro Inspect — Field Capture</span>
      </div>
      {/* Photo capture area */}
      <div className="bg-dark-800 rounded-xl mb-3 h-40 flex items-center justify-center border border-dark-600 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-brand-900/20 to-dark-800" />
        <div className="text-center relative z-10">
          <Camera className="w-8 h-8 text-brand-400 mx-auto mb-2" />
          <p className="text-xs text-dark-300">12 photos captured</p>
          <p className="text-xs text-dark-500 mt-1">GPS: 19.0760° N, 72.8777° E</p>
        </div>
        {/* Photo grid overlay */}
        <div className="absolute bottom-2 right-2 flex gap-1">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="w-8 h-8 bg-dark-600 rounded border border-dark-500" />
          ))}
        </div>
      </div>
      {/* Voice note */}
      <div className="bg-dark-800 rounded-lg p-3 mb-3 border border-dark-600 flex items-center gap-3">
        <div className="w-8 h-8 rounded-full bg-brand-600/20 flex items-center justify-center flex-shrink-0">
          <Mic className="w-4 h-4 text-brand-400" />
        </div>
        <div className="flex-1">
          <p className="text-xs text-dark-200 font-medium">Voice note — 0:42</p>
          <p className="text-xs text-dark-400 truncate">"Crack in column C4, approx 3mm width, running vertically..."</p>
        </div>
        <div className="flex gap-0.5">
          {[...Array(8)].map((_, i) => (
            <div key={i} className={`w-0.5 rounded-full bg-brand-500 ${i % 3 === 0 ? 'h-4' : i % 2 === 0 ? 'h-3' : 'h-2'}`} />
          ))}
        </div>
      </div>
      {/* Sync status */}
      <div className="flex items-center gap-2 bg-green-500/10 border border-green-500/20 rounded-lg px-3 py-2">
        <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
        <span className="text-xs text-green-400 font-medium">Synced to cloud — offline mode ready</span>
      </div>
    </div>
  );
}

function ReportVisual() {
  return (
    <div className="relative bg-white rounded-2xl p-6 shadow-2xl border border-dark-100 max-w-sm mx-auto">
      <div className="flex items-center justify-between mb-4">
        <div>
          <div className="w-24 h-2 bg-brand-600 rounded mb-1" />
          <div className="w-16 h-1.5 bg-dark-200 rounded" />
        </div>
        <div className="bg-brand-50 border border-brand-200 rounded-lg px-2 py-1">
          <span className="text-xs font-bold text-brand-700">AI Generated</span>
        </div>
      </div>
      <div className="space-y-3 mb-4">
        <div className="bg-dark-50 rounded-lg p-3">
          <div className="text-xs font-bold text-dark-700 mb-1">1. Executive Summary</div>
          <div className="space-y-1">
            <div className="h-1.5 bg-dark-200 rounded w-full" />
            <div className="h-1.5 bg-dark-200 rounded w-5/6" />
            <div className="h-1.5 bg-dark-200 rounded w-4/6" />
          </div>
        </div>
        <div className="bg-dark-50 rounded-lg p-3">
          <div className="text-xs font-bold text-dark-700 mb-1">2. Site Observations</div>
          <div className="grid grid-cols-2 gap-2 mt-2">
            <div className="bg-dark-200 rounded h-12" />
            <div className="bg-dark-200 rounded h-12" />
          </div>
          <div className="space-y-1 mt-2">
            <div className="h-1.5 bg-dark-200 rounded w-full" />
            <div className="h-1.5 bg-dark-200 rounded w-3/4" />
          </div>
        </div>
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-3">
          <div className="text-xs font-bold text-amber-700 mb-1">⚠ 3 Defects Found</div>
          <div className="space-y-1">
            <div className="h-1.5 bg-amber-200 rounded w-full" />
            <div className="h-1.5 bg-amber-200 rounded w-2/3" />
          </div>
        </div>
      </div>
      <div className="flex gap-2">
        <button className="flex-1 bg-brand-600 text-white text-xs font-semibold py-2 rounded-lg flex items-center justify-center gap-1">
          <Download className="w-3 h-3" /> Word
        </button>
        <button className="flex-1 border border-dark-200 text-dark-700 text-xs font-semibold py-2 rounded-lg flex items-center justify-center gap-1">
          <Download className="w-3 h-3" /> PDF
        </button>
      </div>
    </div>
  );
}

function DashboardVisual() {
  return (
    <div className="relative bg-dark-900 rounded-2xl p-6 shadow-2xl border border-dark-700 max-w-sm mx-auto">
      <div className="flex items-center gap-2 mb-4">
        <div className="w-3 h-3 rounded-full bg-red-500" />
        <div className="w-3 h-3 rounded-full bg-yellow-500" />
        <div className="w-3 h-3 rounded-full bg-green-500" />
        <span className="ml-auto text-xs text-dark-400">Project Dashboard</span>
      </div>
      <div className="grid grid-cols-3 gap-2 mb-4">
        {[
          { label: 'Reports', val: '24', color: 'text-brand-400' },
          { label: 'Pending', val: '3', color: 'text-yellow-400' },
          { label: 'Sent', val: '21', color: 'text-green-400' },
        ].map((s) => (
          <div key={s.label} className="bg-dark-800 rounded-lg p-2 text-center border border-dark-700">
            <p className={`text-lg font-bold ${s.color}`}>{s.val}</p>
            <p className="text-xs text-dark-400">{s.label}</p>
          </div>
        ))}
      </div>
      <div className="space-y-2 mb-4">
        {[
          { name: 'Tower A — Level 12 Inspection', status: 'Sent', color: 'green' },
          { name: 'Basement Waterproofing Report', status: 'Review', color: 'yellow' },
          { name: 'MEP Inspection — Zone 3', status: 'Draft', color: 'brand' },
        ].map((r) => (
          <div key={r.name} className="flex items-center justify-between bg-dark-800 rounded-lg px-3 py-2 border border-dark-700">
            <p className="text-xs text-dark-200 truncate flex-1 mr-2">{r.name}</p>
            <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
              r.color === 'green' ? 'bg-green-500/20 text-green-400' :
              r.color === 'yellow' ? 'bg-yellow-500/20 text-yellow-400' :
              'bg-brand-500/20 text-brand-400'
            }`}>{r.status}</span>
          </div>
        ))}
      </div>
      {/* AI query bar */}
      <div className="bg-dark-800 border border-brand-500/30 rounded-lg px-3 py-2 flex items-center gap-2">
        <Cpu className="w-3 h-3 text-brand-400 flex-shrink-0" />
        <p className="text-xs text-dark-400 italic">"Which sites have open defects this week?"</p>
      </div>
    </div>
  );
}

// ─── FAQ Item ─────────────────────────────────────────────────────────────────

function FaqItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div
      className="border border-dark-100 rounded-xl overflow-hidden cursor-pointer"
      onClick={() => setOpen(!open)}
    >
      <div className="flex items-center justify-between px-6 py-5 gap-4">
        <p className="font-semibold text-dark-800 text-sm">{q}</p>
        <ChevronDown className={`w-5 h-5 text-dark-400 flex-shrink-0 transition-transform duration-200 ${open ? 'rotate-180' : ''}`} />
      </div>
      {open && (
        <div className="px-6 pb-5 text-dark-500 text-sm leading-relaxed border-t border-dark-50 pt-4">
          {a}
        </div>
      )}
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function InspectPage() {
  return (
    <div className="min-h-screen bg-white font-sans">
      {/* ── JSON-LD Structured Data ── */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(SOFTWARE_APPLICATION_SCHEMA) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(FAQ_SCHEMA) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(BREADCRUMB_SCHEMA) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(HOWTO_SCHEMA) }}
      />

      <Navbar />

      {/* ── Hero ── */}
      <section className="relative bg-dark-900 overflow-hidden pt-28 pb-20 px-4">
        {/* Background glow */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-brand-600/20 rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-brand-800/20 rounded-full blur-3xl" />
        </div>
        <div className="relative max-w-6xl mx-auto">
          <div className="text-center max-w-4xl mx-auto mb-16">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 bg-brand-500/10 border border-brand-500/30 text-brand-300 text-xs font-semibold px-4 py-2 rounded-full mb-6">
              <Zap className="w-3.5 h-3.5" />
              Introducing Biddaro Inspect — AI-Powered Inspection Reports
            </div>

            <h1 className="text-5xl md:text-6xl lg:text-7xl font-extrabold text-white leading-tight mb-6">
              Site data in.
              <br />
              <span className="text-brand-400">Client report out.</span>
            </h1>

            <p className="text-xl text-dark-300 leading-relaxed max-w-2xl mx-auto mb-10">
              Biddaro Inspect turns field photos, voice notes, and site observations into
              professional inspection reports — in your exact format — in minutes, not days.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href="/register?ref=inspect"
                className="inline-flex items-center gap-2 bg-brand-600 hover:bg-brand-500 text-white font-bold px-8 py-4 rounded-xl transition-colors shadow-lg shadow-brand-900/50"
              >
                Get Early Access <ArrowRight className="w-5 h-5" />
              </Link>
              <Link
                href="/contact?ref=inspect-demo"
                className="inline-flex items-center gap-2 border border-dark-600 hover:border-dark-400 text-dark-200 font-semibold px-8 py-4 rounded-xl transition-colors"
              >
                Book a Demo
              </Link>
            </div>

            <p className="text-dark-500 text-sm mt-4">No credit card required. Free during beta.</p>
          </div>

          {/* Hero visual — 3-panel mockup */}
          <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            <CaptureVisual />
            <div className="hidden md:flex flex-col items-center justify-center gap-4">
              <div className="w-12 h-12 rounded-full bg-brand-600/20 border border-brand-500/30 flex items-center justify-center">
                <Cpu className="w-6 h-6 text-brand-400" />
              </div>
              <div className="flex flex-col items-center gap-1">
                <div className="w-0.5 h-8 bg-brand-600/40" />
                <div className="w-0.5 h-8 bg-brand-600/20" />
              </div>
              <p className="text-xs text-dark-400 text-center">AI processes<br/>your field data</p>
            </div>
            <ReportVisual />
          </div>
        </div>
      </section>

      {/* ── Stats bar ── */}
      <section className="bg-brand-600 py-8 px-4">
        <div className="max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          {STATS.map(({ value, label, icon: Icon }) => (
            <div key={label} className="flex flex-col items-center gap-2">
              <Icon className="w-5 h-5 text-brand-200" />
              <p className="text-3xl font-extrabold text-white">{value}</p>
              <p className="text-brand-200 text-sm">{label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── How it works ── */}
      <section className="py-24 px-4 bg-white">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <p className="text-sm font-bold text-brand-600 uppercase tracking-widest mb-3">How it works</p>
            <h2 className="text-4xl font-extrabold text-dark-900 mb-4">Four steps from site to client</h2>
            <p className="text-dark-500 text-lg max-w-xl mx-auto">
              The same inspection workflow you already follow — just automated from capture through to delivery.
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {STEPS.map((step) => {
              const Icon = step.icon;
              const colorMap: Record<string, string> = {
                brand: 'bg-brand-50 text-brand-600 border-brand-100',
                blue: 'bg-blue-50 text-blue-600 border-blue-100',
                purple: 'bg-purple-50 text-purple-600 border-purple-100',
                green: 'bg-green-50 text-green-600 border-green-100',
              };
              return (
                <div key={step.num} className="relative">
                  <div className="bg-white border border-dark-100 rounded-2xl p-6 h-full hover:shadow-lg transition-shadow">
                    <div className="flex items-start gap-3 mb-4">
                      <div className={`w-10 h-10 rounded-xl border flex items-center justify-center flex-shrink-0 ${colorMap[step.color]}`}>
                        <Icon className="w-5 h-5" />
                      </div>
                      <span className="text-3xl font-black text-dark-100">{step.num}</span>
                    </div>
                    <h3 className="font-bold text-dark-900 mb-2">{step.title}</h3>
                    <p className="text-dark-500 text-sm leading-relaxed">{step.desc}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── Feature sections ── */}
      {FEATURES.map((feature, index) => {
        const isEven = index % 2 === 0;
        const Visual = feature.visual === 'capture' ? CaptureVisual : feature.visual === 'report' ? ReportVisual : DashboardVisual;
        return (
          <section
            key={feature.tag}
            className={`py-24 px-4 ${isEven ? 'bg-dark-50' : 'bg-white'} border-t border-dark-100`}
          >
            <div className="max-w-5xl mx-auto">
              <div className={`grid md:grid-cols-2 gap-16 items-center ${!isEven ? 'md:[&>*:first-child]:order-2' : ''}`}>
                {/* Text */}
                <div>
                  <p className="text-xs font-bold text-brand-600 uppercase tracking-widest mb-4">{feature.tag}</p>
                  <h2 className="text-3xl md:text-4xl font-extrabold text-dark-900 mb-4 leading-tight">
                    {feature.headline}
                  </h2>
                  <p className="text-dark-500 text-lg leading-relaxed mb-8">{feature.sub}</p>
                  <ul className="space-y-4">
                    {feature.bullets.map(({ icon: Icon, text }) => (
                      <li key={text} className="flex items-start gap-3">
                        <div className="w-8 h-8 rounded-lg bg-brand-50 border border-brand-100 flex items-center justify-center flex-shrink-0">
                          <Icon className="w-4 h-4 text-brand-600" />
                        </div>
                        <p className="text-dark-700 text-sm leading-relaxed mt-1">{text}</p>
                      </li>
                    ))}
                  </ul>
                </div>
                {/* Visual */}
                <div className="flex justify-center">
                  <Visual />
                </div>
              </div>
            </div>
          </section>
        );
      })}

      {/* ── Who it's for ── */}
      <section className="py-24 px-4 bg-dark-900">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <p className="text-sm font-bold text-brand-400 uppercase tracking-widest mb-3">Who it's for</p>
            <h2 className="text-4xl font-extrabold text-white mb-4">Built for every inspection team</h2>
            <p className="text-dark-400 text-lg max-w-xl mx-auto">
              Any field team that produces written inspection reports for clients can use Biddaro Inspect.
            </p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {USE_CASES.map(({ icon: Icon, title, desc }) => (
              <div key={title} className="bg-dark-800 border border-dark-700 rounded-2xl p-6 hover:border-brand-600/50 transition-colors">
                <div className="w-10 h-10 rounded-xl bg-brand-600/20 border border-brand-600/30 flex items-center justify-center mb-4">
                  <Icon className="w-5 h-5 text-brand-400" />
                </div>
                <h3 className="font-bold text-white mb-2">{title}</h3>
                <p className="text-dark-400 text-sm leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Testimonials ── */}
      <section className="py-24 px-4 bg-white border-t border-dark-100">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <p className="text-sm font-bold text-brand-600 uppercase tracking-widest mb-3">Early users</p>
            <h2 className="text-4xl font-extrabold text-dark-900 mb-4">Reports that speak for themselves</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {TESTIMONIALS.map((t) => (
              <div key={t.name} className="bg-white border border-dark-100 rounded-2xl p-6 shadow-card">
                <div className="flex gap-0.5 mb-4">
                  {[...Array(t.rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                  ))}
                </div>
                <p className="text-dark-700 text-sm leading-relaxed mb-6">&ldquo;{t.text}&rdquo;</p>
                <div>
                  <p className="font-bold text-dark-900 text-sm">{t.name}</p>
                  <p className="text-dark-400 text-xs mt-0.5">{t.role}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Pricing ── */}
      <section className="py-24 px-4 bg-dark-50 border-t border-dark-100">
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-sm font-bold text-brand-600 uppercase tracking-widest mb-3">Pricing</p>
          <h2 className="text-4xl font-extrabold text-dark-900 mb-4">Simple, transparent pricing</h2>
          <p className="text-dark-500 text-lg max-w-xl mx-auto mb-12">
            Free during beta. Paid plans launching soon — priced to be 10× cheaper than the alternatives.
          </p>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                name: 'Starter',
                price: 'Free',
                period: 'during beta',
                desc: 'For small teams getting started with AI inspection reports',
                features: ['5 reports/month', 'Mobile capture app', 'AI report generation', 'PDF & Word export', '1 report template'],
                cta: 'Start Free',
                href: '/register?ref=inspect-starter',
                highlight: false,
              },
              {
                name: 'Pro',
                price: '$19.99',
                period: '/month',
                desc: 'For active inspection teams producing reports daily',
                features: ['Unlimited reports', 'Mobile capture app', 'AI report generation', 'PDF & Word export', 'Unlimited templates', 'Team review workflow', 'Dashboard & analytics', 'Priority support'],
                cta: 'Get Early Access',
                href: '/register?ref=inspect-pro',
                highlight: true,
              },
              {
                name: 'Business',
                price: 'Custom',
                period: 'per team',
                desc: 'For large inspection firms and multi-site operations',
                features: ['Everything in Pro', 'Unlimited team members', 'Custom AI training', 'API access', 'SSO / SAML', 'Dedicated onboarding', 'SLA guarantee'],
                cta: 'Contact Sales',
                href: '/contact?ref=inspect-business',
                highlight: false,
              },
            ].map((plan) => (
              <div
                key={plan.name}
                className={`relative rounded-2xl p-8 border ${plan.highlight ? 'border-brand-400 shadow-xl shadow-brand-100 bg-white' : 'border-dark-100 bg-white'}`}
              >
                {plan.highlight && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <span className="bg-brand-600 text-white text-xs font-bold px-4 py-1 rounded-full">Most Popular</span>
                  </div>
                )}
                <h3 className="font-bold text-dark-900 mb-1">{plan.name}</h3>
                <p className="text-dark-400 text-xs mb-4">{plan.desc}</p>
                <div className="mb-6">
                  <span className="text-4xl font-extrabold text-dark-900">{plan.price}</span>
                  <span className="text-dark-400 text-sm ml-1">{plan.period}</span>
                </div>
                <ul className="space-y-2.5 mb-8">
                  {plan.features.map((f) => (
                    <li key={f} className="flex items-start gap-2.5 text-dark-600 text-sm">
                      <CheckCircle className="w-4 h-4 text-brand-600 flex-shrink-0 mt-0.5" />
                      {f}
                    </li>
                  ))}
                </ul>
                <Link
                  href={plan.href}
                  className={`block text-center font-bold px-6 py-3 rounded-xl transition-colors ${
                    plan.highlight
                      ? 'bg-brand-600 hover:bg-brand-700 text-white'
                      : 'border border-brand-300 text-brand-700 hover:bg-brand-50'
                  }`}
                >
                  {plan.cta}
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Trust bar ── */}
      <section className="py-10 px-4 bg-white border-t border-dark-100">
        <div className="max-w-4xl mx-auto flex flex-wrap items-center justify-center gap-8 text-center">
          {[
            { icon: Shield, label: 'SOC 2 Type II (in progress)', sub: 'Enterprise-grade security' },
            { icon: Globe, label: 'Works in India, UAE & Singapore', sub: 'Deployed globally' },
            { icon: TrendingUp, label: '100% data privacy', sub: 'Your data never trains AI' },
            { icon: Clock, label: '99.9% uptime SLA', sub: 'Always available' },
          ].map(({ icon: Icon, label, sub }) => (
            <div key={label} className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-brand-50 border border-brand-100 flex items-center justify-center flex-shrink-0">
                <Icon className="w-4 h-4 text-brand-600" />
              </div>
              <div className="text-left">
                <p className="text-sm font-semibold text-dark-800">{label}</p>
                <p className="text-xs text-dark-400">{sub}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── FAQ ── */}
      <section className="py-24 px-4 bg-dark-50 border-t border-dark-100">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-12">
            <p className="text-sm font-bold text-brand-600 uppercase tracking-widest mb-3">FAQ</p>
            <h2 className="text-3xl font-extrabold text-dark-900">Common questions</h2>
          </div>
          <div className="space-y-3">
            {FAQS.map((faq) => (
              <FaqItem key={faq.q} q={faq.q} a={faq.a} />
            ))}
          </div>
        </div>
      </section>

      {/* ── Final CTA ── */}
      <section className="py-24 px-4 bg-brand-600 relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 right-0 w-96 h-96 bg-brand-500/50 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-brand-700/50 rounded-full blur-3xl" />
        </div>
        <div className="relative max-w-3xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-extrabold text-white mb-5 leading-tight">
            Transform your inspection process.
          </h2>
          <p className="text-brand-100 text-xl mb-10 max-w-xl mx-auto">
            Join the waitlist. Be first to access Biddaro Inspect when it launches. Free during beta.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/register?ref=inspect-cta"
              className="inline-flex items-center gap-2 bg-white text-brand-700 font-bold px-10 py-4 rounded-xl hover:bg-brand-50 transition-colors shadow-lg"
            >
              Get Early Access <ArrowRight className="w-5 h-5" />
            </Link>
            <Link
              href="/contact?ref=inspect-demo"
              className="inline-flex items-center gap-2 border border-brand-400 hover:border-white text-white font-semibold px-10 py-4 rounded-xl transition-colors"
            >
              Book a Demo
            </Link>
          </div>
          <p className="text-brand-200 text-sm mt-6">No credit card. No commitment. Cancel anytime.</p>
        </div>
      </section>

      <Footer />
    </div>
  );
}
