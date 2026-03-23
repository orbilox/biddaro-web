// Server Component layout — no 'use client' so generateMetadata works in children
import React from 'react';
import type { Metadata } from 'next';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';

export const metadata: Metadata = {
  title: {
    default: 'Premium Contractor Profile | Biddaro',
    template: '%s | Biddaro Premium',
  },
  description:
    'Upgrade to Biddaro Premium and get priority access to government projects, corporate contracts, 5× more profile views, AI-powered lead generation, and reduced commission fees.',
  keywords: [
    'premium contractor profile india',
    'government construction contracts',
    'verified contractor badge',
    'construction contractor subscription',
    'biddaro premium',
  ],
  openGraph: {
    siteName: 'Biddaro',
    type: 'website',
    locale: 'en_IN',
  },
  twitter: {
    card: 'summary_large_image',
    site: '@biddaro',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-snippet': -1,
      'max-image-preview': 'large',
    },
  },
};

export default function PremiumLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Navbar />
      {/* pt-16 accounts for the fixed Navbar height (h-16 = 64px) */}
      <main className="flex-1 pt-16">
        {children}
      </main>
      <Footer />
    </div>
  );
}
