import type { Metadata } from 'next';

export const metadata: Metadata = {
  metadataBase: new URL('https://biddaro.com'),
  title: 'Biddaro Inspect — AI-Powered Inspection Reports for Construction Teams',
  description:
    'Turn field photos, voice notes, and site observations into professional inspection reports in minutes. Biddaro Inspect uses AI to write reports in your exact format — Word and PDF export.',
  keywords: [
    'AI inspection report software',
    'construction inspection report generator',
    'field inspection software India',
    'automated site inspection reports',
    'AI report generation construction',
    'property inspection software',
    'building inspection report app',
    'construction site report automation',
  ],
  alternates: { canonical: 'https://biddaro.com/inspect' },
  openGraph: {
    title: 'Biddaro Inspect — Site data in. Client report out.',
    description: 'AI-powered inspection report software for construction, engineering, and property teams. 80% less time on reports.',
    url: 'https://biddaro.com/inspect',
    siteName: 'Biddaro',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Biddaro Inspect — AI Inspection Reports',
    description: 'Field photos + voice notes → professional client reports in minutes.',
    site: '@biddaro',
  },
};

export default function InspectLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
