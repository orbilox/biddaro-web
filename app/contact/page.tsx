'use client';
import React, { useState } from 'react';
import Link from 'next/link';
import {
  Mail, MessageSquare, Globe, HelpCircle,
  Send, CheckCircle, AlertCircle, TrendingUp,
} from 'lucide-react';
import { useForm } from 'react-hook-form';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { contactApi } from '@/lib/api';

// ─── Types ────────────────────────────────────────────────────────────────────

interface ContactForm {
  name: string;
  email: string;
  subject: string;
  message: string;
}

// ─── Contact options ──────────────────────────────────────────────────────────

const CONTACT_OPTIONS = [
  {
    icon: HelpCircle,
    color: 'bg-blue-100 text-blue-600',
    title: 'Help & Support',
    desc: 'Technical issues, account problems, or questions about features.',
    tag: 'support',
  },
  {
    icon: TrendingUp,
    color: 'bg-amber-100 text-amber-600',
    title: 'Investors',
    desc: 'Interested in our $1M seed round? Let\'s talk.',
    tag: 'investor',
    link: '/investors',
  },
  {
    icon: Globe,
    color: 'bg-purple-100 text-purple-600',
    title: 'Partnerships',
    desc: 'Lenders, enterprise clients, or API integrations.',
    tag: 'partnership',
  },
  {
    icon: MessageSquare,
    color: 'bg-green-100 text-green-600',
    title: 'General Enquiry',
    desc: 'Anything else — we read every message.',
    tag: 'general',
  },
];

const SUBJECT_SUGGESTIONS = [
  'Technical support',
  'Account issue',
  'Investor enquiry',
  'Partnership proposal',
  'Feature request',
  'Press / media',
  'Other',
];

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function ContactPage() {
  const [submitted, setSubmitted]     = useState(false);
  const [serverError, setServerError] = useState('');

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<ContactForm>();

  const onSubmit = async (data: ContactForm) => {
    setServerError('');
    try {
      await contactApi.submit(data);
      setSubmitted(true);
    } catch (err: unknown) {
      const msg =
        (err as { response?: { data?: { message?: string } } })?.response?.data?.message ??
        'Something went wrong. Please try again or email us directly.';
      setServerError(msg);
    }
  };

  // ── Success state ──────────────────────────────────────────────────────────
  if (submitted) {
    return (
      <main className="bg-white min-h-screen">
        <div className="pt-28 pb-20 px-4 flex items-center justify-center">
          <div className="w-full max-w-md bg-white border border-gray-200 rounded-2xl shadow-card p-10 text-center">
            <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-5">
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
            <h2 className="text-xl font-bold text-dark-900 mb-2">Message sent!</h2>
            <p className="text-dark-500 text-sm mb-6 leading-relaxed">
              Thanks for reaching out. Our team will get back to you within <strong>24 hours</strong>.
              Check your inbox for a confirmation email.
            </p>
            <div className="flex flex-col gap-2">
              <Link
                href="/guide"
                className="text-sm text-brand-600 hover:text-brand-700 font-medium"
              >
                Browse the Help Guide while you wait →
              </Link>
              <button
                onClick={() => setSubmitted(false)}
                className="text-xs text-dark-400 hover:text-dark-600 underline"
              >
                Send another message
              </button>
            </div>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="bg-white">

      {/* ── Hero ── */}
      <section className="bg-gradient-to-br from-dark-900 via-dark-800 to-dark-900 text-white pt-28 pb-16 px-4 text-center">
        <div className="max-w-2xl mx-auto">
          <div className="w-12 h-12 rounded-xl bg-brand-500 flex items-center justify-center mx-auto mb-5">
            <Mail className="w-6 h-6 text-white" />
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-4">
            Get in touch
          </h1>
          <p className="text-dark-200 text-lg leading-relaxed">
            We read every message. Tell us how we can help and we&apos;ll respond within 24 hours.
          </p>
        </div>
      </section>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid lg:grid-cols-5 gap-12">

          {/* ── Left: Contact options ── */}
          <div className="lg:col-span-2 space-y-4">
            <h2 className="text-lg font-bold text-dark-900 mb-2">What can we help with?</h2>
            {CONTACT_OPTIONS.map(({ icon: Icon, color, title, desc, tag, link }) => {
              const inner = (
                <div className="flex items-start gap-4">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${color}`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-dark-900">{title}</p>
                    <p className="text-xs text-dark-500 mt-0.5 leading-relaxed">{desc}</p>
                  </div>
                </div>
              );

              if (link) {
                return (
                  <Link
                    key={tag}
                    href={link}
                    className="block border border-gray-200 hover:border-brand-300 hover:shadow-sm rounded-2xl p-4 transition-all"
                  >
                    {inner}
                  </Link>
                );
              }

              return (
                <button
                  key={tag}
                  onClick={() => setValue('subject', title)}
                  className="w-full text-left border border-gray-200 hover:border-brand-300 hover:shadow-sm rounded-2xl p-4 transition-all"
                >
                  {inner}
                </button>
              );
            })}

            {/* Direct email */}
            <div className="bg-gray-50 border border-gray-200 rounded-2xl p-4 mt-2">
              <p className="text-xs font-semibold text-dark-700 mb-1">Email us directly</p>
              <a
                href="mailto:support@biddaro.com"
                className="text-sm text-brand-600 hover:text-brand-700 font-medium"
              >
                support@biddaro.com
              </a>
            </div>
          </div>

          {/* ── Right: Form ── */}
          <div className="lg:col-span-3">
            <div className="bg-white border border-gray-200 rounded-2xl p-8 shadow-sm">
              <h2 className="text-lg font-bold text-dark-900 mb-6">Send us a message</h2>

              {serverError && (
                <div className="mb-4 flex items-start gap-2.5 rounded-xl bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">
                  <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
                  <span>{serverError}</span>
                </div>
              )}

              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <div className="grid sm:grid-cols-2 gap-4">
                  <Input
                    label="Your name"
                    placeholder="John Smith"
                    error={errors.name?.message}
                    {...register('name', { required: 'Name is required' })}
                  />
                  <Input
                    label="Email address"
                    type="email"
                    placeholder="john@example.com"
                    error={errors.email?.message}
                    {...register('email', {
                      required: 'Email is required',
                      pattern: { value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: 'Invalid email' },
                    })}
                  />
                </div>

                {/* Subject with quick suggestions */}
                <div>
                  <Input
                    label="Subject"
                    placeholder="How can we help?"
                    error={errors.subject?.message}
                    {...register('subject', { required: 'Subject is required' })}
                  />
                  <div className="flex flex-wrap gap-1.5 mt-2">
                    {SUBJECT_SUGGESTIONS.map((s) => (
                      <button
                        key={s}
                        type="button"
                        onClick={() => setValue('subject', s)}
                        className="text-[11px] px-2.5 py-0.5 rounded-full border border-gray-200 text-dark-500 hover:border-brand-300 hover:text-brand-600 transition-colors"
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Message */}
                <div>
                  <label className="block text-sm font-medium text-dark-700 mb-1.5">
                    Message
                  </label>
                  <textarea
                    rows={5}
                    placeholder="Tell us more about your question or issue…"
                    className={`w-full px-4 py-3 text-sm border rounded-xl resize-none transition-colors
                      focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent
                      ${errors.message ? 'border-red-400 bg-red-50' : 'border-gray-300 hover:border-gray-400'}`}
                    {...register('message', {
                      required: 'Message is required',
                      minLength: { value: 10, message: 'Please write at least 10 characters' },
                    })}
                  />
                  {errors.message && (
                    <p className="mt-1 text-xs text-red-600">{errors.message.message}</p>
                  )}
                </div>

                <Button
                  type="submit"
                  fullWidth
                  loading={isSubmitting}
                  rightIcon={<Send className="w-4 h-4" />}
                >
                  Send Message
                </Button>

                <p className="text-xs text-dark-400 text-center">
                  We typically respond within 24 hours, often much sooner.
                </p>
              </form>
            </div>
          </div>

        </div>
      </div>

    </main>
  );
}
