'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { ArrowRight, X, Zap } from 'lucide-react';
import { MiniChat, type Message } from './MiniChat';

// ─── Props ────────────────────────────────────────────────────────────────────

interface AiChatSectionProps {
  systemPrompt: string;
  suggestedPrompts: string[];
  placeholder?: string;
  greeting?: string;
  toolSlug: string;
  toolName: string;
}

// ─── Context Extraction ───────────────────────────────────────────────────────

const MAJOR_CITIES = [
  'bengaluru', 'bangalore', 'mumbai', 'delhi', 'hyderabad', 'chennai',
  'pune', 'ahmedabad', 'kolkata', 'surat', 'jaipur', 'lucknow', 'kanpur',
  'nagpur', 'indore', 'thane', 'bhopal', 'visakhapatnam', 'vadodara',
  'ludhiana', 'agra', 'nashik', 'faridabad', 'meerut', 'rajkot',
  'ghaziabad', 'patna', 'coimbatore', 'madurai', 'kochi', 'noida',
  'gurgaon', 'gurugram', 'chandigarh', 'mysore', 'mysuru', 'bhubaneswar',
  'aurangabad', 'amritsar', 'prayagraj', 'allahabad', 'jabalpur', 'srinagar',
  'raipur', 'ranchi', 'vijayawada', 'jodhpur', 'udaipur', 'dehradun',
];

const CITY_LABEL: Record<string, string> = {
  bengaluru: 'Bangalore',
  gurugram: 'Gurgaon',
  mysuru: 'Mysore',
  prayagraj: 'Allahabad',
};

interface ConversationContext {
  city: string | null;
  area: string | null;      // sq ft as string
  budget: string | null;    // in lakhs as string
}

function extractContext(messages: Message[]): ConversationContext {
  const text = messages.map((m) => m.content).join(' ');
  const lower = text.toLowerCase();

  // City — first match wins
  let city: string | null = null;
  for (const c of MAJOR_CITIES) {
    if (lower.includes(c)) {
      city = CITY_LABEL[c] ?? c.charAt(0).toUpperCase() + c.slice(1);
      break;
    }
  }

  // Area in sq ft — e.g. "1200 sq ft", "1,500 sqft", "2000 square feet"
  const areaMatch = text.match(/(\d[\d,]*)\s*(?:sq\.?\s*ft|sqft|square\s*feet)/i);
  const area = areaMatch ? areaMatch[1].replace(/,/g, '') : null;

  // Budget in lakhs — e.g. "28 lakhs", "₹32 lakh", "25-30 lakhs"
  const budgetMatch = text.match(/(\d+(?:\.\d+)?)\s*(?:lakhs?|lacs?)/i);
  const budget = budgetMatch
    ? Math.round(parseFloat(budgetMatch[1])).toString()
    : null;

  return { city, area, budget };
}

// ─── CTA Text Helpers ─────────────────────────────────────────────────────────

function buildCtaHeadline(ctx: ConversationContext): string {
  const { city, area, budget } = ctx;

  if (city && budget) {
    return `Your ${city} project · ~₹${budget}L estimated`;
  }
  if (budget) {
    return `Your project · ~₹${budget}L estimated`;
  }
  if (city && area) {
    return `Your ${city} project · ${Number(area).toLocaleString('en-IN')} sq ft`;
  }
  if (city) {
    return `Your ${city} project`;
  }
  if (area) {
    return `Your ${Number(area).toLocaleString('en-IN')} sq ft project`;
  }
  return 'Your construction project';
}

function buildHireUrl(
  toolSlug: string,
  ctx: ConversationContext,
): string {
  const params = new URLSearchParams({ source: 'ai-tool', tool: toolSlug });
  if (ctx.city) params.set('city', ctx.city);
  if (ctx.area) params.set('area', ctx.area);
  if (ctx.budget) params.set('budget', `${ctx.budget}L`);
  return `/register?${params.toString()}`;
}

// ─── Component ────────────────────────────────────────────────────────────────

export function AiChatSection({
  systemPrompt,
  suggestedPrompts,
  placeholder,
  greeting,
  toolSlug,
  toolName,
}: AiChatSectionProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [ctaDismissed, setCtaDismissed] = useState(false);

  const hasAssistantReply = messages.some((m) => m.role === 'assistant');
  const showCta = hasAssistantReply && !ctaDismissed;

  const ctx = extractContext(messages);
  const ctaHeadline = buildCtaHeadline(ctx);
  const hireUrl = buildHireUrl(toolSlug, ctx);

  return (
    <div>
      <MiniChat
        systemPrompt={systemPrompt}
        suggestedPrompts={suggestedPrompts}
        placeholder={placeholder ?? `Ask about ${toolName.toLowerCase()}...`}
        greeting={greeting}
        onMessagesChange={setMessages}
      />

      {/* ── Aggressive Contractor CTA ─────────────────────────────────────────
          Appears after the first AI reply. Stays visible until dismissed.
          Personalised with city / area / budget extracted from the chat.
      ────────────────────────────────────────────────────────────────────── */}
      {showCta && (
        <div className="mt-4 relative rounded-2xl bg-gradient-to-r from-orange-500 to-rose-500 p-5 shadow-xl border border-orange-400">
          {/* Dismiss */}
          <button
            onClick={() => setCtaDismissed(true)}
            aria-label="Dismiss"
            className="absolute top-3 right-3 text-white/60 hover:text-white transition-colors"
          >
            <X className="w-4 h-4" />
          </button>

          {/* Main row */}
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center pr-6">
            {/* Text */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1.5">
                <Zap className="w-4 h-4 text-yellow-300 fill-yellow-300 flex-shrink-0" />
                <p className="text-white font-bold text-sm leading-snug">
                  {ctaHeadline} · Get 3 Quotes in 24 Hours
                </p>
              </div>
              <p className="text-orange-100 text-sm leading-relaxed">
                Post your project free and receive{' '}
                <strong className="text-white">3 competing bids</strong> from
                verified local contractors. Compare and choose — zero commission.
              </p>
            </div>

            {/* CTA Button */}
            <Link
              href={hireUrl}
              className="flex-shrink-0 inline-flex items-center gap-2 bg-white text-orange-600 hover:bg-orange-50 active:bg-orange-100 font-bold px-5 py-2.5 rounded-xl transition-colors text-sm shadow-md"
            >
              Post Project Free
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {/* Trust strip */}
          <div className="mt-3 pt-3 border-t border-white/20 flex flex-wrap gap-x-5 gap-y-1 text-xs text-orange-100">
            <span>✓ 500+ verified contractors</span>
            <span>✓ Competing quotes in 24 hrs</span>
            <span>✓ No commission, ever</span>
          </div>
        </div>
      )}

      {/* Disclaimer — always shown below */}
      <p className="text-center text-xs text-gray-400 mt-3">
        AI responses are for guidance only. Verify critical decisions with a local professional.
      </p>
    </div>
  );
}
