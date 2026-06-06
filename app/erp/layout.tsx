import type { Metadata } from 'next';

export const metadata: Metadata = {
  metadataBase: new URL('https://biddaro.com'),
  title: {
    template: '%s | Biddaro ERP',
    default: 'Construction ERP Software for Contractors & Builders | Biddaro',
  },
  description:
    'Biddaro ERP helps construction contractors manage sites, track projects, plan builds and run their business from one platform. Used by 10,000+ contractors across India, UAE & Singapore.',
  openGraph: {
    siteName: 'Biddaro',
    locale: 'en_IN',
    type: 'website',
  },
};

export default function ErpLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
