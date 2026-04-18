import React from 'react';
import type { Metadata } from 'next';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';

export const metadata: Metadata = {
  other: {
    'content-language': 'ar',
  },
};

export default function UAEArabicLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      {/* Set html[lang] to "ar" — overrides root layout's lang="en" for Google */}
      {/* eslint-disable-next-line @next/next/no-before-interactive-script-component */}
      <script
        dangerouslySetInnerHTML={{
          __html: `document.documentElement.lang='ar';document.documentElement.dir='rtl';`,
        }}
      />
    <div className="min-h-screen flex flex-col bg-white uae-ar-layout" dir="rtl" lang="ar">
      {/* Google Fonts — Noto Naskh Arabic for RTL rendering */}
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      <link
        rel="stylesheet"
        href="https://fonts.googleapis.com/css2?family=Noto+Naskh+Arabic:wght@400;500;600;700&display=swap"
      />
      <Navbar />
      <main className="flex-1 pt-16">{children}</main>
      <Footer />
    </div>
    </>
  );
}
