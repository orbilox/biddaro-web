// Server Component layout — no 'use client' so generateMetadata works in children
import React from 'react';
import type { Metadata } from 'next';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';

export const metadata: Metadata = {
  title: {
    template: '%s | Biddaro Blog',
    default: 'Construction & Home Renovation Blog India | Biddaro',
  },
  description:
    'Expert articles on home construction, renovation planning, AI tools, contractor hiring, and building costs in India. Practical guides for Indian homeowners.',
  keywords: [
    'home construction blog india',
    'renovation tips india',
    'construction cost guide',
    'ai tools construction',
    'contractor hiring tips india',
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

export default function BlogLayout({ children }: { children: React.ReactNode }) {
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
