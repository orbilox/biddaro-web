import type { Metadata } from 'next';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';

export const metadata: Metadata = {
  title: {
    template: '%s | Biddaro AI Answers',
    default: 'AI Answers for Construction & Home Renovation | Biddaro',
  },
  description:
    'Get expert AI-powered answers to all your construction and home renovation questions. Costs, materials, Vastu, hiring tips, and more — specific to India.',
  keywords: [
    'construction questions india',
    'home renovation tips india',
    'house building cost india',
    'vastu shastra tips',
    'construction contractor india',
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

export default function AskLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-white">{children}</main>
      <Footer />
    </>
  );
}
