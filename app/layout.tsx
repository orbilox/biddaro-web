import type { Metadata } from 'next';
import Script from 'next/script';
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
  manifest: '/manifest.json',
  themeColor: '#f97316',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: 'Biddaro',
  },
  icons: {
    icon: [
      { url: '/favicon.ico', type: 'image/x-icon' },
      { url: '/icons/icon-192.png', type: 'image/png', sizes: '192x192' },
    ],
    apple: [
      { url: '/icons/apple-icon-180.png', type: 'image/png', sizes: '180x180' },
    ],
    shortcut: '/favicon.ico',
  },
  openGraph: {
    title: 'Biddaro – Construction Marketplace',
    description: 'Connect with skilled contractors and post construction jobs.',
    type: 'website',
    locale: 'en_US',
  },
  verification: {
    google: 'XApdMDXmwz__ZV_qS8Oi5vWfzhUo-FstK6hi8Hn05mA',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="scroll-smooth">
      <head>
        <Script async src="https://www.googletagmanager.com/gtag/js?id=G-DCZLVPPVF2" strategy="afterInteractive" />
        <Script id="google-analytics" strategy="afterInteractive">{`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', 'G-DCZLVPPVF2');
        `}</Script>
      </head>
      <body>
        {children}
        <ToastContainer />
      </body>
    </html>
  );
}
