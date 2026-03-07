'use client';
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  ArrowRight, CheckCircle, Star, HardHat, Zap, Shield, Users,
  BarChart3, MessageSquare, Wallet, FileText, Bot, LayoutDashboard,
  Sparkles, DollarSign, Hammer, Clock,
} from 'lucide-react';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { Button } from '@/components/ui/Button';
import { ROUTES } from '@/lib/constants';
import { useAuthStore } from '@/store/authStore';

const stats = [
  { value: '12,000+', label: 'Active Contractors' },
  { value: '48,000+', label: 'Jobs Completed' },
  { value: '$250M+', label: 'Paid to Contractors' },
  { value: '4.8/5', label: 'Average Rating' },
];

const features = [
  {
    icon: Zap,
    title: 'Instant Bidding',
    desc: 'Get competitive bids from verified contractors within hours of posting.',
    color: 'bg-yellow-50 text-yellow-600',
  },
  {
    icon: Bot,
    title: 'AI-Powered Estimation',
    desc: 'Our AI analyzes your project and provides accurate cost & timeline estimates.',
    color: 'bg-violet-50 text-violet-600',
  },
  {
    icon: Shield,
    title: 'Secure Contracts',
    desc: 'Legally binding smart contracts protect both parties throughout the project.',
    color: 'bg-blue-50 text-blue-600',
  },
  {
    icon: Wallet,
    title: 'Escrow Payments',
    desc: 'Funds held securely and released upon milestone completion.',
    color: 'bg-green-50 text-green-600',
  },
  {
    icon: MessageSquare,
    title: 'Real-time Messaging',
    desc: 'Communicate directly with contractors and job posters in real time.',
    color: 'bg-brand-50 text-brand-600',
  },
  {
    icon: BarChart3,
    title: 'Analytics Dashboard',
    desc: 'Track your projects, earnings, and performance metrics at a glance.',
    color: 'bg-rose-50 text-rose-600',
  },
];

const steps = [
  {
    step: '01',
    title: 'Post Your Job',
    desc: 'Describe your project, set a budget, and add photos. Takes just 5 minutes.',
    icon: FileText,
  },
  {
    step: '02',
    title: 'Receive Bids',
    desc: 'Qualified contractors submit detailed proposals and pricing within hours.',
    icon: Users,
  },
  {
    step: '03',
    title: 'Hire & Pay',
    desc: 'Choose the best contractor, sign digitally, and pay through our secure escrow.',
    icon: Wallet,
  },
];

const categories = [
  { name: 'General Construction', emoji: '🏗️', count: '2,400+' },
  { name: 'Plumbing', emoji: '🔧', count: '1,800+' },
  { name: 'Electrical', emoji: '⚡', count: '2,100+' },
  { name: 'HVAC', emoji: '🌡️', count: '1,200+' },
  { name: 'Roofing', emoji: '🏠', count: '900+' },
  { name: 'Painting', emoji: '🎨', count: '3,200+' },
  { name: 'Carpentry', emoji: '🪚', count: '1,500+' },
  { name: 'Landscaping', emoji: '🌿', count: '1,100+' },
];

const testimonials = [
  {
    name: 'Sarah Mitchell',
    role: 'Homeowner',
    image: 'https://randomuser.me/api/portraits/women/44.jpg',
    rating: 5,
    text: 'I posted my kitchen renovation and got 12 bids within 24 hours. Found the perfect contractor at a great price!',
  },
  {
    name: 'Marcus Johnson',
    role: 'General Contractor',
    image: 'https://randomuser.me/api/portraits/men/32.jpg',
    rating: 5,
    text: "Biddaro has completely transformed my business. I'm now booked 3 months in advance and earning 40% more.",
  },
  {
    name: 'Emily Chen',
    role: 'Property Manager',
    image: 'https://randomuser.me/api/portraits/women/68.jpg',
    rating: 5,
    text: 'Managing 20+ properties, I use Biddaro for all maintenance. The escrow system gives me peace of mind.',
  },
];

export default function LandingPage() {
  const { isAuthenticated } = useAuthStore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const isLoggedIn = mounted && isAuthenticated;

  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      {/* Hero */}
      <section className="relative min-h-screen flex items-center overflow-hidden bg-dark-900">
        {/* Background pattern */}
        <div className="absolute inset-0 bg-grid-pattern opacity-5" />
        <div className="absolute inset-0 bg-gradient-to-br from-dark-900 via-dark-800 to-dark-900" />
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-brand-500/50 to-transparent" />
        {/* Orange glow */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[600px] rounded-full bg-brand-500/10 blur-[100px]" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-32 pt-40">
          <div className="max-w-3xl mx-auto text-center">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 bg-brand-500/10 border border-brand-500/20 rounded-full px-4 py-1.5 mb-8">
              <span className="text-brand-400 text-xs font-semibold uppercase tracking-wider">
                New: AI-Powered Cost Estimator
              </span>
              <ArrowRight className="w-3.5 h-3.5 text-brand-400" />
            </div>

            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-extrabold text-white mb-6 leading-tight">
              Find Top Construction
              <br />
              <span className="text-gradient">Pros Near You</span>
            </h1>

            <p className="text-xl text-dark-300 mb-10 max-w-2xl mx-auto leading-relaxed">
              Post your project, receive competitive bids, and hire verified contractors—all through
              one secure platform. Join 50,000+ satisfied clients.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              {isLoggedIn ? (
                <Link href={ROUTES.DASHBOARD}>
                  <Button size="lg" rightIcon={<LayoutDashboard className="w-5 h-5" />}>
                    Go to Dashboard
                  </Button>
                </Link>
              ) : (
                <>
                  <Link href={ROUTES.REGISTER}>
                    <Button size="lg" rightIcon={<ArrowRight className="w-5 h-5" />}>
                      Post Your Job Free
                    </Button>
                  </Link>
                  <Link href={ROUTES.REGISTER + '?type=contractor'}>
                    <Button
                      size="lg"
                      variant="outline"
                      className="bg-transparent border-white/20 text-white hover:bg-white/10"
                    >
                      I&apos;m a Contractor
                    </Button>
                  </Link>
                </>
              )}
            </div>

            {/* Trust signals */}
            <div className="flex flex-wrap items-center justify-center gap-6 mt-12 text-dark-400 text-sm">
              {['No credit card required', 'Free to post jobs', 'Verified contractors'].map((item) => (
                <span key={item} className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-400" />
                  {item}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat) => (
              <div key={stat.label} className="text-center">
                <p className="text-4xl font-extrabold text-dark-900">{stat.value}</p>
                <p className="text-sm text-dark-400 mt-1">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-dark-900">Browse by Category</h2>
            <p className="text-dark-500 mt-3">Find specialized contractors for any type of project</p>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {categories.map((cat) => (
              <Link
                key={cat.name}
                href={`${ROUTES.JOBS}?category=${encodeURIComponent(cat.name)}`}
                className="bg-white rounded-xl border border-gray-200 p-5 text-center hover:border-brand-300 hover:shadow-card-hover transition-all duration-200 group"
              >
                <div className="text-3xl mb-3 group-hover:scale-110 transition-transform duration-200">
                  {cat.emoji}
                </div>
                <p className="font-semibold text-dark-900 text-sm">{cat.name}</p>
                <p className="text-xs text-dark-400 mt-1">{cat.count} contractors</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-dark-900">How Biddaro Works</h2>
            <p className="text-dark-500 mt-3 max-w-xl mx-auto">
              Three simple steps to get your project done right
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 relative">
            {/* Connector line */}
            <div className="hidden md:block absolute top-10 left-1/3 right-1/3 h-px bg-gradient-to-r from-brand-200 to-brand-200 via-brand-500" />

            {steps.map((step, i) => {
              const Icon = step.icon;
              return (
                <div key={step.step} className="relative text-center">
                  <div className="w-20 h-20 rounded-2xl bg-brand-50 border-2 border-brand-200 flex items-center justify-center mx-auto mb-6 relative">
                    <Icon className="w-9 h-9 text-brand-500" />
                    <span className="absolute -top-3 -right-3 w-7 h-7 rounded-full bg-brand-500 text-white text-xs font-bold flex items-center justify-center">
                      {i + 1}
                    </span>
                  </div>
                  <h3 className="text-lg font-bold text-dark-900 mb-2">{step.title}</h3>
                  <p className="text-dark-500 text-sm leading-relaxed">{step.desc}</p>
                </div>
              );
            })}
          </div>

          <div className="text-center mt-12">
            {isLoggedIn ? (
              <Link href={ROUTES.DASHBOARD}>
                <Button size="lg" rightIcon={<LayoutDashboard className="w-5 h-5" />}>
                  Go to Dashboard
                </Button>
              </Link>
            ) : (
              <Link href={ROUTES.REGISTER}>
                <Button size="lg" rightIcon={<ArrowRight className="w-5 h-5" />}>
                  Get Started — It&apos;s Free
                </Button>
              </Link>
            )}
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-20 bg-dark-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-white">
              Everything You Need to{' '}
              <span className="text-gradient">Succeed</span>
            </h2>
            <p className="text-dark-300 mt-3">Built for modern construction professionals</p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature) => {
              const Icon = feature.icon;
              return (
                <div
                  key={feature.title}
                  className="bg-dark-800 border border-dark-700 rounded-xl p-6 hover:border-brand-500/40 transition-colors duration-200"
                >
                  <div className={`w-12 h-12 rounded-xl ${feature.color} flex items-center justify-center mb-4`}>
                    <Icon className="w-6 h-6" />
                  </div>
                  <h3 className="text-white font-semibold text-base mb-2">{feature.title}</h3>
                  <p className="text-dark-400 text-sm leading-relaxed">{feature.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ─── AI Assistant Promo ─────────────────────────────────────── */}
      <section className="py-20 bg-white overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="relative bg-gradient-to-br from-dark-900 via-dark-800 to-dark-900 rounded-3xl overflow-hidden">
            {/* Glow */}
            <div className="absolute top-1/2 left-1/4 -translate-y-1/2 w-80 h-80 rounded-full bg-brand-500/15 blur-[80px] pointer-events-none" />
            <div className="absolute bottom-0 right-1/4 w-60 h-60 rounded-full bg-violet-500/10 blur-[60px] pointer-events-none" />

            <div className="relative grid lg:grid-cols-2 gap-10 items-center p-10 md:p-14">
              {/* Left: copy */}
              <div>
                <div className="inline-flex items-center gap-2 bg-brand-500/10 border border-brand-500/20 rounded-full px-4 py-1.5 mb-6">
                  <Sparkles className="w-3.5 h-3.5 text-brand-400" />
                  <span className="text-brand-400 text-xs font-semibold uppercase tracking-wider">
                    Free · No Login Required
                  </span>
                </div>

                <h2 className="text-3xl sm:text-4xl font-extrabold text-white mb-4 leading-tight">
                  Get Instant Construction
                  <br />
                  <span className="text-gradient">Answers with AI</span>
                </h2>
                <p className="text-dark-300 text-lg mb-8 leading-relaxed">
                  Ask our AI assistant anything — cost estimates, material quantities,
                  permit requirements, how to hire safely, and more. No account needed.
                </p>

                {/* Mini feature list */}
                <ul className="space-y-3 mb-10">
                  {[
                    { icon: DollarSign, text: 'Instant cost & budget estimates' },
                    { icon: Hammer,     text: 'Material lists & quantity guides' },
                    { icon: Clock,      text: 'Project timelines & planning tips' },
                    { icon: Shield,     text: 'Safe contractor hiring advice' },
                  ].map(({ icon: Icon, text }) => (
                    <li key={text} className="flex items-center gap-3 text-dark-300 text-sm">
                      <div className="w-7 h-7 rounded-lg bg-brand-500/15 flex items-center justify-center flex-shrink-0">
                        <Icon className="w-3.5 h-3.5 text-brand-400" />
                      </div>
                      {text}
                    </li>
                  ))}
                </ul>

                <Link href={ROUTES.AI_ASSISTANT}>
                  <Button size="lg" rightIcon={<ArrowRight className="w-5 h-5" />}>
                    Try AI Assistant — It&apos;s Free
                  </Button>
                </Link>
              </div>

              {/* Right: fake chat preview */}
              <div className="lg:flex justify-center hidden">
                <div className="w-full max-w-sm bg-gray-50 rounded-2xl border border-gray-200 shadow-2xl overflow-hidden">
                  {/* Chat header */}
                  <div className="bg-dark-900 px-4 py-3 flex items-center gap-2 border-b border-dark-700">
                    <div className="w-7 h-7 rounded-full bg-brand-500 flex items-center justify-center">
                      <Bot className="w-3.5 h-3.5 text-white" />
                    </div>
                    <span className="text-white text-sm font-semibold">Biddaro AI</span>
                    <span className="ml-auto flex items-center gap-1 text-green-400 text-xs">
                      <span className="w-1.5 h-1.5 rounded-full bg-green-400" />
                      Online
                    </span>
                  </div>

                  {/* Chat messages */}
                  <div className="p-4 space-y-4">
                    {/* User message */}
                    <div className="flex justify-end">
                      <div className="bg-brand-500 text-white text-xs rounded-2xl rounded-tr-sm px-3 py-2 max-w-[80%]">
                        How much does a bathroom renovation cost?
                      </div>
                    </div>

                    {/* AI message */}
                    <div className="flex gap-2">
                      <div className="w-6 h-6 rounded-full bg-dark-800 border border-dark-600 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <Bot className="w-3 h-3 text-brand-400" />
                      </div>
                      <div className="bg-white border border-gray-200 text-dark-700 text-xs rounded-2xl rounded-tl-sm px-3 py-2 max-w-[80%] shadow-sm">
                        A bathroom renovation typically costs{' '}
                        <strong>$3,000–$25,000</strong> depending on size and
                        finishes. A basic refresh runs $3K–$7K, mid-range
                        $7K–$15K, and a full gut renovation $15K–$25K+.
                      </div>
                    </div>

                    {/* User follow-up */}
                    <div className="flex justify-end">
                      <div className="bg-brand-500 text-white text-xs rounded-2xl rounded-tr-sm px-3 py-2 max-w-[80%]">
                        What permits do I need?
                      </div>
                    </div>

                    {/* Typing indicator */}
                    <div className="flex gap-2">
                      <div className="w-6 h-6 rounded-full bg-dark-800 border border-dark-600 flex items-center justify-center flex-shrink-0">
                        <Bot className="w-3 h-3 text-brand-400" />
                      </div>
                      <div className="bg-white border border-gray-200 rounded-2xl rounded-tl-sm px-3 py-2.5 shadow-sm">
                        <div className="flex items-center gap-1">
                          <span className="w-1.5 h-1.5 rounded-full bg-dark-400 animate-bounce" style={{ animationDelay: '0ms' }} />
                          <span className="w-1.5 h-1.5 rounded-full bg-dark-400 animate-bounce" style={{ animationDelay: '150ms' }} />
                          <span className="w-1.5 h-1.5 rounded-full bg-dark-400 animate-bounce" style={{ animationDelay: '300ms' }} />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Input */}
                  <div className="px-4 pb-4">
                    <div className="flex gap-2 bg-white border border-gray-300 rounded-xl px-3 py-2">
                      <span className="text-xs text-dark-400 flex-1">Ask a question…</span>
                      <div className="w-6 h-6 rounded-lg bg-brand-500 flex items-center justify-center">
                        <ArrowRight className="w-3 h-3 text-white" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-dark-900">Loved by Thousands</h2>
            <p className="text-dark-500 mt-3">Real stories from our community</p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {testimonials.map((t) => (
              <div key={t.name} className="bg-white rounded-xl border border-gray-200 p-6 shadow-card">
                <div className="flex items-center gap-1 mb-4">
                  {Array.from({ length: t.rating }).map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <p className="text-dark-700 text-sm leading-relaxed mb-5">&ldquo;{t.text}&rdquo;</p>
                <div className="flex items-center gap-3">
                  <img
                    src={t.image}
                    alt={t.name}
                    className="w-10 h-10 rounded-full object-cover"
                  />
                  <div>
                    <p className="text-sm font-semibold text-dark-900">{t.name}</p>
                    <p className="text-xs text-dark-400">{t.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 bg-brand-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-extrabold text-white mb-4">
            Ready to Build Something Great?
          </h2>
          <p className="text-white/80 text-xl mb-10 max-w-2xl mx-auto">
            Join 50,000+ clients and contractors using Biddaro to get construction work done right.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            {isLoggedIn ? (
              <Link href={ROUTES.DASHBOARD}>
                <Button
                  size="lg"
                  variant="secondary"
                  className="bg-white text-brand-600 hover:bg-gray-100"
                  rightIcon={<LayoutDashboard className="w-5 h-5" />}
                >
                  Go to Dashboard
                </Button>
              </Link>
            ) : (
              <>
                <Link href={ROUTES.REGISTER}>
                  <Button
                    size="lg"
                    variant="secondary"
                    className="bg-white text-brand-600 hover:bg-gray-100"
                    rightIcon={<ArrowRight className="w-5 h-5" />}
                  >
                    Post Your First Job
                  </Button>
                </Link>
                <Link href={ROUTES.REGISTER + '?type=contractor'}>
                  <Button
                    size="lg"
                    variant="outline"
                    className="border-white/30 text-white hover:bg-white/10 bg-transparent"
                  >
                    Start Bidding as a Pro
                  </Button>
                </Link>
              </>
            )}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
