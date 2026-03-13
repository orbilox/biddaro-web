import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight, Bot, Zap, Users, Star } from 'lucide-react';
import { AI_USE_CASES } from '@/lib/ai-use-cases-data';

export const metadata: Metadata = {
  title: 'AI-Powered Construction Tools India | Free Online',
  description:
    'Free AI tools for construction: cost estimator, renovation planner, Vastu consultant, material calculator, budget planner, and more — built for India.',
  openGraph: {
    title: 'AI Construction Tools India | Biddaro',
    description:
      'Free AI-powered tools for every stage of your home construction or renovation project in India.',
    url: 'https://biddaro.com/ai',
  },
};

// Icon map for each use case
const USE_CASE_ICONS: Record<string, string> = {
  'construction-cost-estimator': '🏗️',
  'renovation-planner': '🏠',
  'contractor-finder': '🔍',
  'material-calculator': '🧱',
  'vastu-consultant': '🧭',
  'house-plan-advisor': '📐',
  'budget-planner': '📊',
  'permits-guide-india': '📄',
};

const STAT_ITEMS = [
  { icon: Bot, value: '8', label: 'AI Tools' },
  { icon: Zap, value: '50,000+', label: 'Questions Answered' },
  { icon: Users, value: '10,000+', label: 'Homeowners Helped' },
  { icon: Star, value: '100%', label: 'Free to Use' },
];

export default function AiHubPage() {
  return (
    <>
      {/* ── Hero ─────────────────────────────────────────────────────────────── */}
      <section className="bg-gradient-to-br from-slate-900 via-slate-800 to-orange-900 text-white py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-orange-500/20 border border-orange-500/40 text-orange-300 text-sm font-medium px-4 py-1.5 rounded-full mb-6">
            <Bot className="w-4 h-4" />
            Powered by AI
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold mb-4 leading-tight">
            AI-Powered Construction Tools
            <span className="block text-orange-400 mt-1">Built for India</span>
          </h1>
          <p className="text-lg text-slate-300 max-w-2xl mx-auto mb-8">
            Free AI tools for every stage of your home project — from cost estimation and material
            calculation to Vastu advice and building permits. No sign-up required.
          </p>
          <div className="flex flex-wrap gap-3 justify-center">
            <Link
              href="#tools"
              className="inline-flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white font-semibold px-6 py-3 rounded-xl transition-colors"
            >
              Explore All Tools
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              href="/ask"
              className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white font-medium px-6 py-3 rounded-xl border border-white/20 transition-colors"
            >
              Browse Q&amp;A Library
            </Link>
          </div>
        </div>
      </section>

      {/* ── Stats ────────────────────────────────────────────────────────────── */}
      <section className="bg-white border-b border-gray-100 py-8 px-4">
        <div className="max-w-4xl mx-auto grid grid-cols-2 sm:grid-cols-4 gap-6">
          {STAT_ITEMS.map(({ icon: Icon, value, label }) => (
            <div key={label} className="flex flex-col items-center text-center">
              <div className="w-10 h-10 rounded-full bg-orange-50 flex items-center justify-center mb-2">
                <Icon className="w-5 h-5 text-orange-500" />
              </div>
              <p className="text-2xl font-bold text-gray-900">{value}</p>
              <p className="text-sm text-gray-500">{label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Tools Grid ───────────────────────────────────────────────────────── */}
      <section id="tools" className="bg-gray-50 py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-3">
              Choose Your AI Tool
            </h2>
            <p className="text-gray-600 max-w-xl mx-auto">
              Each tool is optimized for a specific task — get accurate, India-specific guidance in seconds.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {AI_USE_CASES.map((useCase) => (
              <Link
                key={useCase.slug}
                href={`/ai/${useCase.slug}`}
                className="group bg-white rounded-2xl border border-gray-200 hover:border-orange-300 hover:shadow-lg transition-all p-5 flex flex-col"
              >
                <div className="flex items-start justify-between mb-3">
                  <span className="text-3xl">{USE_CASE_ICONS[useCase.slug] || '🤖'}</span>
                  <span className="text-xs bg-green-50 text-green-700 border border-green-200 rounded-full px-2 py-0.5 font-medium">
                    {useCase.searchVolume >= 1000
                      ? `${Math.round(useCase.searchVolume / 1000)}K/mo`
                      : `${useCase.searchVolume}/mo`}
                  </span>
                </div>
                <h3 className="font-semibold text-gray-900 text-sm leading-snug mb-2 group-hover:text-orange-600 transition-colors">
                  {useCase.title}
                </h3>
                <p className="text-xs text-gray-500 leading-relaxed flex-1 mb-4">
                  {useCase.heroSubtitle}
                </p>
                <div className="flex items-center gap-1 text-orange-500 text-xs font-medium">
                  Try Free
                  <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── How It Works ─────────────────────────────────────────────────────── */}
      <section className="bg-white py-16 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-3">How It Works</h2>
            <p className="text-gray-600">Get expert AI guidance in 3 simple steps</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                step: '1',
                title: 'Choose Your Tool',
                description: 'Pick the AI tool that matches your need — cost estimation, Vastu, materials, or planning.',
              },
              {
                step: '2',
                title: 'Ask Your Question',
                description: 'Type your question in plain language — no technical jargon needed. Click a suggestion to start instantly.',
              },
              {
                step: '3',
                title: 'Get Expert Guidance',
                description: 'Receive detailed, India-specific answers with numbers, recommendations, and actionable next steps.',
              },
            ].map(({ step, title, description }) => (
              <div key={step} className="text-center">
                <div className="w-12 h-12 rounded-2xl bg-orange-500 text-white text-lg font-bold flex items-center justify-center mx-auto mb-4">
                  {step}
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">{title}</h3>
                <p className="text-sm text-gray-600 leading-relaxed">{description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ──────────────────────────────────────────────────────────────── */}
      <section className="bg-orange-500 py-14 px-4">
        <div className="max-w-3xl mx-auto text-center text-white">
          <h2 className="text-3xl font-bold mb-3">Need a Human Expert?</h2>
          <p className="text-orange-100 mb-8 max-w-xl mx-auto">
            Our AI tools are great for research and planning. For actual project execution, connect with
            verified contractors on Biddaro.
          </p>
          <div className="flex flex-wrap gap-3 justify-center">
            <Link
              href="/hire"
              className="inline-flex items-center gap-2 bg-white text-orange-600 hover:bg-orange-50 font-semibold px-6 py-3 rounded-xl transition-colors"
            >
              Find a Contractor
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              href="/ai-assistant"
              className="inline-flex items-center gap-2 bg-orange-600 hover:bg-orange-700 text-white font-medium px-6 py-3 rounded-xl border border-orange-400 transition-colors"
            >
              Open Full AI Assistant
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
