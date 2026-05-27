import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Apply for a Loan Online — ₹100/month | Biddaro',
  description:
    'Apply for a construction, renovation, equipment, business or personal loan online in India. Fill a 6-step form in 3 minutes, subscribe for ₹100/month, get approved in 5 days. RBI-compliant lenders. Secured by Razorpay.',
  keywords: [
    'apply loan online india',
    'construction loan apply',
    'personal loan apply online',
    'home loan apply india',
    'business loan apply online india',
    'loan apply in 3 minutes',
    'biddaro loan apply',
  ],
  alternates: { canonical: 'https://biddaro.com/loan-apply' },
  openGraph: {
    title: 'Apply for a Loan Online — ₹100/month | Biddaro',
    description:
      'Construction, renovation, equipment, business and personal loans. Apply in 3 minutes. Approval in 5 days.',
    url: 'https://biddaro.com/loan-apply',
    type: 'website',
  },
};

// ─── HowTo + BreadcrumbList JSON-LD ─────────────────────────────────────────

const howToSchema = {
  '@context': 'https://schema.org',
  '@type': 'HowTo',
  name: 'How to Apply for a Loan on Biddaro',
  description:
    'Apply for a construction, renovation, business or personal loan online in India at 0.45% monthly interest. Takes 3 minutes — approval in 5 working days.',
  totalTime: 'PT3M',
  estimatedCost: { '@type': 'MonetaryAmount', currency: 'INR', value: '100', unitText: 'per month' },
  supply: [
    { '@type': 'HowToSupply', name: 'Aadhaar card' },
    { '@type': 'HowToSupply', name: 'PAN card' },
    { '@type': 'HowToSupply', name: 'Salary slips or ITR (for income proof)' },
    { '@type': 'HowToSupply', name: 'Active Indian bank account' },
  ],
  step: [
    {
      '@type': 'HowToStep',
      position: 1,
      name: 'Select your loan type',
      text: 'Choose from Home Construction, Renovation, Equipment Finance, Working Capital, Business Loan, or Personal Loan. Each loan type has specific interest rates and eligibility criteria tailored to your needs.',
      url: 'https://biddaro.com/loan-apply#step-1',
    },
    {
      '@type': 'HowToStep',
      position: 2,
      name: 'Enter your loan amount and tenure',
      text: 'Specify how much you need (from ₹10,000 up to ₹4 Crore depending on loan type) and your preferred repayment tenure. Our EMI calculator instantly shows your estimated monthly payment.',
      url: 'https://biddaro.com/loan-apply#step-2',
    },
    {
      '@type': 'HowToStep',
      position: 3,
      name: 'Fill in your personal and income details',
      text: 'Enter your name, mobile number, email, city, employment type, and monthly income. This helps us match you with the most suitable lenders from our network of RBI-compliant lending partners.',
      url: 'https://biddaro.com/loan-apply#step-3',
    },
    {
      '@type': 'HowToStep',
      position: 4,
      name: 'Review your application summary',
      text: 'See a complete summary of your loan application — type, amount, tenure, estimated EMI, and the subscription plan. Review your details before proceeding to payment.',
      url: 'https://biddaro.com/loan-apply#step-7',
    },
    {
      '@type': 'HowToStep',
      position: 5,
      name: 'Subscribe for ₹100/month via Razorpay',
      text: 'Unlock your loan application by authorizing a ₹100/month recurring subscription through Razorpay. This covers our lender matching and application management service. You can cancel anytime — no lock-in period.',
      url: 'https://biddaro.com/loan-apply#payment',
    },
    {
      '@type': 'HowToStep',
      position: 6,
      name: 'Get approval within 5 working days',
      text: 'Our team reviews your application and matches it to the best lender in our network. You receive a call within 5 working days with a loan decision, interest rate offer, and next steps for documentation.',
      url: 'https://biddaro.com/loan-apply#approval',
    },
  ],
};

const breadcrumbSchema = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Home',         item: 'https://biddaro.com' },
    { '@type': 'ListItem', position: 2, name: 'Loans',        item: 'https://biddaro.com/loans' },
    { '@type': 'ListItem', position: 3, name: 'Apply Online', item: 'https://biddaro.com/loan-apply' },
  ],
};

const financialServiceSchema = {
  '@context': 'https://schema.org',
  '@type': 'FinancialService',
  name: 'Biddaro Loan Application',
  description: 'Online loan application service for construction, renovation, business and personal loans in India',
  url: 'https://biddaro.com/loan-apply',
  serviceType: 'Loan Brokerage',
  areaServed: { '@type': 'Country', name: 'India' },
  provider: {
    '@type': 'Organization',
    name: 'Biddaro',
    url: 'https://biddaro.com',
    logo: 'https://biddaro.com/icons/icon-192.png',
  },
  offers: {
    '@type': 'Offer',
    price: '100',
    priceCurrency: 'INR',
    priceSpecification: {
      '@type': 'RecurringChargeSpecification',
      frequency: 'Monthly',
      name: 'Biddaro Loan Eligibility Subscription',
    },
    availability: 'https://schema.org/InStock',
  },
};

export default function LoanApplyLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(howToSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(financialServiceSchema) }}
      />
      {children}
    </>
  );
}
