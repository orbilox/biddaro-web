import type { Metadata } from 'next';
import './globals.css';
import { ToastContainer } from '@/components/ui/Toast';

export const metadata: Metadata = {
  title: {
    default: 'Biddaro – Construction Marketplace',
    template: '%s | Biddaro',
  },
  description: 'Connect with skilled contractors and post construction jobs on Biddaro – the leading construction marketplace.',
  keywords: ['construction', 'contractors', 'bidding', 'marketplace', 'home improvement'],
  authors: [{ name: 'Biddaro' }],
  openGraph: {
    title: 'Biddaro – Construction Marketplace',
    description: 'Connect with skilled contractors and post construction jobs.',
    type: 'website',
    locale: 'en_US',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="scroll-smooth">
      <body>
        {children}
        <ToastContainer />
      </body>
    </html>
  );
}
