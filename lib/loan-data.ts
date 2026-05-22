// ─── Loan Type SEO Data for India ─────────────────────────────────────────────
// Powers /loans/[type] (hub pages) and /loans/[type]/[city] (programmatic pages)
// Each entry targets high-intent "personal loan apply in [city]" style keywords
// Use {city} placeholder — replaced at render time with actual city name

export interface LoanFAQ {
  q: string;
  a: string;
}

export interface LoanEligibility {
  label: string;
  value: string;
}

export interface LoanTypeSEO {
  slug: string;           // 'home-construction'   (URL segment)
  id: string;             // 'home_construction'   (matches Razorpay loanType + DB enum)
  name: string;           // 'Home Construction Loan'
  emoji: string;
  color: string;          // Tailwind color key
  metaTitle: string;      // '{city} Home Construction Loan {year} – Apply Online | Biddaro'
  metaDesc: string;       // Meta description with {city} placeholder
  intro: string;          // Hero sub-paragraph with {city}
  minAmount: string;      // '₹5 Lakh'
  maxAmount: string;      // '₹4 Crore'
  minAmountRaw: number;   // 500000
  maxAmountRaw: number;   // 40000000
  interestRate: string;   // '8.5% p.a.'
  interestRateRaw: number;// 8.5
  maxTenure: string;      // '20 years'
  maxTenureMonths: number;// 240
  processingFee: string;  // '1% of loan amount'
  eligibility: LoanEligibility[];
  factors: string[];      // 5 factors affecting loan approval (with {city})
  faqs: LoanFAQ[];        // 6 FAQs (with {city})
  relatedSlugs: string[]; // cross-link to other loan types
}

export const LOAN_TYPES_SEO: LoanTypeSEO[] = [
  // ─── 1. Home Construction ─────────────────────────────────────────────────
  {
    slug:          'home-construction',
    id:            'home_construction',
    name:          'Home Construction Loan',
    emoji:         '🏗️',
    color:         'amber',
    metaTitle:     '{city} Home Construction Loan {year} – Apply Online | Biddaro',
    metaDesc:      'Get a home construction loan in {city} up to ₹4 Crore at 8.5% p.a. Fast approval, flexible repayment up to 20 years. Apply online via Biddaro — subscribe for ₹100/month.',
    intro:         'Building a home in {city}? Biddaro connects you with verified lenders offering home construction loans up to ₹4 Crore with competitive rates starting at 8.5% p.a. and repayment tenures up to 20 years.',
    minAmount:     '₹5 Lakh',
    maxAmount:     '₹4 Crore',
    minAmountRaw:  500000,
    maxAmountRaw:  40000000,
    interestRate:  '8.5% p.a.',
    interestRateRaw: 8.5,
    maxTenure:     '20 years',
    maxTenureMonths: 240,
    processingFee: '0.5–1% of loan amount',
    eligibility: [
      { label: 'Age',         value: '21–65 years' },
      { label: 'Income',      value: 'Min ₹20,000/month (salaried) or ₹3 Lakh p.a. (self-employed)' },
      { label: 'CIBIL Score', value: '650+ preferred' },
      { label: 'Employment',  value: 'Salaried or self-employed / business owner' },
      { label: 'Property',    value: 'Plot ownership or purchase along with construction' },
    ],
    factors: [
      'Plot location and approved building plan in {city}',
      'Credit score and existing loan obligations',
      'Construction stage disbursement — funds released in tranches',
      'Income stability and years of employment',
      'Builder/contractor credentials and estimated project cost',
    ],
    faqs: [
      { q: 'How much home construction loan can I get in {city}?', a: 'In {city}, you can get a home construction loan up to ₹4 Crore depending on your income, credit score, plot value, and the construction estimate. Typically lenders offer up to 75–80% of the construction cost as a loan.' },
      { q: 'What is the interest rate for a home construction loan in {city}?', a: 'Home construction loan interest rates in {city} start from 8.5% p.a. for salaried applicants with a good credit score. Rates vary between 8.5% and 11% depending on the lender, your profile, and the loan tenure.' },
      { q: 'What documents are required for a home construction loan in {city}?', a: 'You will need: Aadhaar card, PAN card, salary slips or ITR (last 2 years), bank statements (6 months), plot ownership documents, approved building plan from {city} municipal authority, and construction estimate from a licensed engineer.' },
      { q: 'How long does it take to get a construction loan approved in {city}?', a: 'Once your documents are complete, construction loan approval in {city} typically takes 5–10 working days. Disbursement happens in stages linked to construction milestones.' },
      { q: 'Can I get a home construction loan on an agricultural plot in {city}?', a: 'Most lenders do not fund construction on agricultural land. The plot must be converted to residential use with proper approvals from the {city} municipal authority or development authority before applying.' },
      { q: 'What is the maximum tenure for a home construction loan?', a: 'Most lenders offer a maximum repayment tenure of 20 years for home construction loans. The construction period itself (usually 18–36 months) is treated as a moratorium — you pay only interest during this phase.' },
    ],
    relatedSlugs: ['renovation', 'personal', 'business'],
  },

  // ─── 2. Renovation ────────────────────────────────────────────────────────
  {
    slug:          'renovation',
    id:            'renovation',
    name:          'Home Renovation Loan',
    emoji:         '🔨',
    color:         'blue',
    metaTitle:     '{city} Home Renovation Loan {year} – Instant Approval | Biddaro',
    metaDesc:      'Home renovation loan in {city} up to ₹75 Lakh at 9.5% p.a. Fund your kitchen, bathroom, or full home makeover. Quick approval in 5 days. Apply on Biddaro.',
    intro:         'Renovating your home in {city}? Get a home renovation loan up to ₹75 Lakh at competitive rates starting from 9.5% p.a. Whether it\'s kitchen remodelling, bathroom upgrade, or a complete makeover — Biddaro finds the right lender for you.',
    minAmount:     '₹1 Lakh',
    maxAmount:     '₹75 Lakh',
    minAmountRaw:  100000,
    maxAmountRaw:  7500000,
    interestRate:  '9.5% p.a.',
    interestRateRaw: 9.5,
    maxTenure:     '10 years',
    maxTenureMonths: 120,
    processingFee: '1–1.5% of loan amount',
    eligibility: [
      { label: 'Age',         value: '21–65 years' },
      { label: 'Income',      value: 'Min ₹15,000/month (salaried) or ₹2 Lakh p.a. (self-employed)' },
      { label: 'CIBIL Score', value: '650+ preferred' },
      { label: 'Property',    value: 'Residential property owned by self or family' },
      { label: 'Ownership',   value: 'At least 1 year of property ownership' },
    ],
    factors: [
      'Property ownership and current market value in {city}',
      'Scope of renovation — interior vs structural changes',
      'Credit history and existing EMI obligations',
      'Income-to-EMI ratio (lenders prefer below 50%)',
      'Age of property and legal clearance in {city}',
    ],
    faqs: [
      { q: 'How much renovation loan can I get in {city}?', a: 'You can get a home renovation loan up to ₹75 Lakh in {city}. The amount depends on your property value (typically 70–80% of property value as LTV), income, and credit score.' },
      { q: 'What is the interest rate for a renovation loan in {city}?', a: 'Home renovation loan rates in {city} start from 9.5% p.a. and can go up to 13% depending on the lender, your credit profile, and whether the loan is secured against property.' },
      { q: 'Can I get a renovation loan without property collateral in {city}?', a: 'Yes — unsecured renovation loans (personal loans for renovation) are available in {city} without collateral, but they come at higher interest rates (12–18%) and lower amounts (up to ₹10 Lakh).' },
      { q: 'What renovation work is covered under a renovation loan?', a: 'Most lenders cover: flooring, painting, plumbing, electrical upgrades, kitchen remodelling, bathroom renovation, false ceiling, waterproofing, and even additions like a new room. Structural changes may require separate approval.' },
      { q: 'How long does renovation loan approval take in {city}?', a: 'Renovation loan approval in {city} typically takes 3–7 working days for secured loans. Unsecured renovation loans (personal loan variant) can be approved within 24–48 hours if documents are in order.' },
      { q: 'Do I need to submit renovation bills to get a renovation loan?', a: 'For secured renovation loans in {city}, lenders often disburse funds directly to contractors after verifying renovation quotes. For unsecured personal loan variants, funds are transferred to your account without bill submission.' },
    ],
    relatedSlugs: ['home-construction', 'personal', 'working-capital'],
  },

  // ─── 3. Equipment Finance ─────────────────────────────────────────────────
  {
    slug:          'equipment',
    id:            'equipment',
    name:          'Equipment Finance Loan',
    emoji:         '⚙️',
    color:         'green',
    metaTitle:     '{city} Equipment Finance Loan {year} – Machinery Loan | Biddaro',
    metaDesc:      'Equipment finance loan in {city} up to ₹1.5 Crore at 11% p.a. for construction machinery, vehicles & tools. Asset-backed, fast approval. Apply via Biddaro.',
    intro:         'Need to purchase or upgrade construction equipment in {city}? Biddaro helps you secure equipment finance loans up to ₹1.5 Crore with asset-backed financing starting at 11% p.a. Cover excavators, cranes, mixers, and any construction machinery.',
    minAmount:     '₹1 Lakh',
    maxAmount:     '₹1.5 Crore',
    minAmountRaw:  100000,
    maxAmountRaw:  15000000,
    interestRate:  '11% p.a.',
    interestRateRaw: 11,
    maxTenure:     '7 years',
    maxTenureMonths: 84,
    processingFee: '1–2% of loan amount',
    eligibility: [
      { label: 'Age',          value: '21–65 years' },
      { label: 'Business Age', value: 'Min 2 years of business operation' },
      { label: 'Income',       value: 'Min ₹3 Lakh p.a. annual business turnover' },
      { label: 'CIBIL Score',  value: '650+ preferred' },
      { label: 'GST',          value: 'GST registration preferred for amounts above ₹25 Lakh' },
    ],
    factors: [
      'Age and make of the equipment being financed',
      'Business vintage and annual turnover in {city}',
      'LTV ratio — lenders typically fund 70–90% of equipment value',
      'Hypothecation of equipment as primary collateral',
      'Industry sector and cash flow pattern of the business',
    ],
    faqs: [
      { q: 'What types of equipment can be financed in {city}?', a: 'Equipment finance in {city} covers: excavators, JCBs, cranes, concrete mixers, boom placers, transit mixers, compactors, generators, commercial vehicles for construction, scaffolding equipment, and other construction machinery.' },
      { q: 'What is the down payment for equipment finance in {city}?', a: 'Most lenders require 10–25% down payment for equipment finance in {city}. For new equipment from authorized dealers, some lenders offer zero down payment schemes for strong credit profiles.' },
      { q: 'Can I finance second-hand construction equipment in {city}?', a: 'Yes, used/second-hand equipment financing is available in {city} but at slightly higher rates (12–15%). The equipment must be not older than 7–10 years and may require independent valuation.' },
      { q: 'Is GST registration mandatory for equipment finance in {city}?', a: 'For equipment loans above ₹25 Lakh in {city}, most NBFCs and banks prefer GST-registered businesses as it verifies business activity. For smaller amounts, GST may not be mandatory.' },
      { q: 'How is equipment finance loan repaid?', a: 'Equipment finance loans are repaid via fixed monthly EMIs over the tenure (1–7 years). The equipment is hypothecated to the lender — ownership transfers fully once all EMIs are paid.' },
      { q: 'What happens if I default on equipment finance?', a: 'In case of default, the lender has the right to repossess the hypothecated equipment in {city}. To avoid this, contact your lender immediately if you foresee payment difficulties — most offer EMI restructuring.' },
    ],
    relatedSlugs: ['working-capital', 'business', 'home-construction'],
  },

  // ─── 4. Working Capital ───────────────────────────────────────────────────
  {
    slug:          'working-capital',
    id:            'working_capital',
    name:          'Working Capital Loan',
    emoji:         '💼',
    color:         'purple',
    metaTitle:     '{city} Working Capital Loan {year} – Business Cash Flow | Biddaro',
    metaDesc:      'Working capital loan in {city} up to ₹50 Lakh at 13% p.a. Keep your construction projects funded between payments. Fast disbursal in 3 days. Apply on Biddaro.',
    intro:         'Running out of cash between project milestones in {city}? A working capital loan from Biddaro keeps your construction business running smoothly. Borrow up to ₹50 Lakh at 13% p.a. with fast 3-day disbursal — no project stalls, no payment delays.',
    minAmount:     '₹50,000',
    maxAmount:     '₹50 Lakh',
    minAmountRaw:  50000,
    maxAmountRaw:  5000000,
    interestRate:  '13% p.a.',
    interestRateRaw: 13,
    maxTenure:     '3 years',
    maxTenureMonths: 36,
    processingFee: '1.5–2% of loan amount',
    eligibility: [
      { label: 'Age',          value: '21–65 years' },
      { label: 'Business Age', value: 'Min 1 year of active business operation' },
      { label: 'Turnover',     value: 'Min ₹10 Lakh annual turnover' },
      { label: 'CIBIL Score',  value: '650+ preferred' },
      { label: 'Documents',    value: 'Bank statements (12 months), GST returns, balance sheet' },
    ],
    factors: [
      'Monthly cash flow pattern and receivables in {city}',
      'Bank statement analysis — average monthly balance',
      'Existing working capital facilities and credit utilization',
      'Sector-specific risk — construction has seasonal demand in {city}',
      'Customer concentration — number of active clients and contract sizes',
    ],
    faqs: [
      { q: 'What is a working capital loan and who needs it in {city}?', a: 'A working capital loan in {city} is a short-term loan for construction businesses to cover day-to-day expenses — labour payments, material procurement, and cash gaps between project milestones. It\'s not for asset purchase, but for operational liquidity.' },
      { q: 'What is the difference between a term loan and a working capital loan?', a: 'A term loan in {city} is used for long-term asset purchase with a fixed repayment schedule. A working capital loan is a revolving or short-term facility used for operational expenses, typically repaid within 1–3 years as receivables come in.' },
      { q: 'What interest rate can I expect for a working capital loan in {city}?', a: 'Working capital loan interest rates in {city} range from 13% to 18% p.a. for construction businesses. Rate depends on business vintage, bank statement cash flows, GST compliance, and credit score.' },
      { q: 'How quickly can I get a working capital loan in {city}?', a: 'Most NBFCs disburse working capital loans within 3–5 business days in {city} once documents are submitted. Some digital lenders offer same-day or next-day disbursal for verified business profiles with good bank statement history.' },
      { q: 'Do I need collateral for a working capital loan in {city}?', a: 'Many NBFCs offer unsecured working capital loans in {city} up to ₹25 Lakh based on business cash flows. For higher amounts, lenders may ask for property collateral or machinery hypothecation.' },
      { q: 'Can a new construction business get a working capital loan in {city}?', a: 'Most lenders require at least 12 months of business operation for working capital loans in {city}. For newer businesses, you may qualify for a business loan backed by personal guarantee, or start with a smaller amount (₹5–10 Lakh).' },
    ],
    relatedSlugs: ['business', 'equipment', 'personal'],
  },

  // ─── 5. Business Loan ─────────────────────────────────────────────────────
  {
    slug:          'business',
    id:            'business',
    name:          'Business Loan',
    emoji:         '🏢',
    color:         'indigo',
    metaTitle:     '{city} Business Loan {year} – Apply Online for SME Loans | Biddaro',
    metaDesc:      'Business loan in {city} up to ₹2 Crore at 10.5% p.a. for SMEs, contractors & entrepreneurs. Minimal documents, quick approval in 5 days. Apply via Biddaro.',
    intro:         'Grow your construction business in {city} with a business loan up to ₹2 Crore at competitive rates from 10.5% p.a. Whether you\'re expanding operations, hiring staff, or taking on larger contracts — Biddaro matches you with the right lender in {city}.',
    minAmount:     '₹2 Lakh',
    maxAmount:     '₹2 Crore',
    minAmountRaw:  200000,
    maxAmountRaw:  20000000,
    interestRate:  '10.5% p.a.',
    interestRateRaw: 10.5,
    maxTenure:     '5 years',
    maxTenureMonths: 60,
    processingFee: '1–2% of loan amount',
    eligibility: [
      { label: 'Age',          value: '21–65 years' },
      { label: 'Business Age', value: 'Min 2 years of business operation' },
      { label: 'Turnover',     value: 'Min ₹25 Lakh annual turnover' },
      { label: 'CIBIL Score',  value: '700+ preferred' },
      { label: 'GST',          value: 'GST registration required for amounts above ₹25 Lakh' },
    ],
    factors: [
      'Business vintage and annual turnover in {city}',
      'GST filing history and ITR for last 2 years',
      'Profit and loss statement showing positive PAT',
      'Existing credit facilities and repayment track record',
      'Nature of contracts and revenue visibility for the next 12 months',
    ],
    faqs: [
      { q: 'What is the maximum business loan I can get in {city}?', a: 'In {city}, business loans are available up to ₹2 Crore through Biddaro for construction businesses. The actual amount depends on your annual turnover, net profit, existing debt, and credit score. High-turnover businesses can access up to 20–25% of annual turnover as a business loan.' },
      { q: 'What are the interest rates for business loans in {city}?', a: 'Business loan rates in {city} start from 10.5% p.a. for well-established businesses with strong credit profiles. Typical rates range from 10.5% to 18% depending on the lender, loan amount, and your business financials.' },
      { q: 'Is collateral required for a business loan in {city}?', a: 'Many lenders offer unsecured business loans in {city} up to ₹50 Lakh based on business financials. For larger amounts, collateral in the form of property, machinery, or FD may be required to reduce the interest rate.' },
      { q: 'Can a proprietorship or partnership firm get a business loan in {city}?', a: 'Yes — sole proprietorships, partnerships, LLPs, and private limited companies can all apply for business loans in {city}. Each structure has different documentation requirements. Pvt Ltd companies typically get better rates due to corporate transparency.' },
      { q: 'How does a business loan help a construction contractor in {city}?', a: 'A business loan in {city} helps construction contractors: bid on larger projects that require advance investment, purchase materials in bulk at discounted prices, hire and retain skilled labour, and bridge gaps between work completion and client payment.' },
      { q: 'What documents do I need for a business loan in {city}?', a: 'Typical documents for a business loan in {city}: PAN + Aadhaar of proprietor/directors, business registration proof (GST/MSME/Udyam), ITR for last 2 years, CA-certified P&L and balance sheet, bank statements (12 months), and existing loan sanction letters if any.' },
    ],
    relatedSlugs: ['working-capital', 'equipment', 'home-construction'],
  },

  // ─── 6. Personal Loan ─────────────────────────────────────────────────────
  {
    slug:          'personal',
    id:            'personal',
    name:          'Personal Loan',
    emoji:         '👤',
    color:         'rose',
    metaTitle:     '{city} Personal Loan {year} – Instant Online Apply | Biddaro',
    metaDesc:      'Personal loan in {city} up to ₹5 Lakh at 14% p.a. No collateral required. For salaried professionals and self-employed individuals. Instant approval. Apply on Biddaro.',
    intro:         'Need quick personal funds in {city}? Get a personal loan up to ₹5 Lakh without any collateral at competitive rates starting from 14% p.a. Ideal for salaried professionals and self-employed individuals looking for flexible, hassle-free financing.',
    minAmount:     '₹10,000',
    maxAmount:     '₹5 Lakh',
    minAmountRaw:  10000,
    maxAmountRaw:  500000,
    interestRate:  '14% p.a.',
    interestRateRaw: 14,
    maxTenure:     '5 years',
    maxTenureMonths: 60,
    processingFee: '1–3% of loan amount',
    eligibility: [
      { label: 'Age',        value: '21–60 years (salaried), 21–65 years (self-employed)' },
      { label: 'Income',     value: 'Min ₹15,000/month (salaried) or ₹2 Lakh p.a. (self-employed)' },
      { label: 'CIBIL Score',value: '700+ preferred for best rates; 650+ considered' },
      { label: 'Employment', value: 'Min 1 year with current employer (salaried)' },
      { label: 'Collateral', value: 'No collateral required' },
    ],
    factors: [
      'Credit score — the single biggest factor for personal loan rates in {city}',
      'Monthly income and existing EMI obligations (FOIR ratio)',
      'Employment type — salaried vs self-employed vs contract worker',
      'Employer category — PSU/MNC employees get better rates in {city}',
      'Loan amount relative to income — lenders prefer EMI under 40% of take-home',
    ],
    faqs: [
      { q: 'How much personal loan can I get in {city}?', a: 'In {city}, personal loan amounts typically range from ₹10,000 to ₹5 Lakh through Biddaro. The exact amount depends on your monthly income, existing EMIs, and credit score. Generally, lenders offer up to 10–20× your monthly salary as a personal loan.' },
      { q: 'What is the interest rate for a personal loan in {city}?', a: 'Personal loan interest rates in {city} start from 14% p.a. for applicants with a credit score above 750. Typical rates range from 14% to 24% depending on your profile, lender choice, and loan amount. A higher CIBIL score directly reduces your rate.' },
      { q: 'How quickly can I get a personal loan in {city}?', a: 'With complete documentation, personal loan approval in {city} takes 1–3 business days. Many digital lenders offer same-day or next-day disbursal for pre-approved customers. Biddaro connects you with lenders who have the fastest processing times.' },
      { q: 'Can I get a personal loan with a low CIBIL score in {city}?', a: 'Yes, some NBFCs and fintech lenders in {city} offer personal loans for credit scores between 600–650, but at higher interest rates (18–24%). Having a co-applicant with a good score or a salary account with the lending bank can help you qualify.' },
      { q: 'Is income proof mandatory for a personal loan in {city}?', a: 'Yes, income proof is mandatory for personal loans in {city}. Salaried applicants need salary slips (3 months) + Form 16. Self-employed applicants need ITR (2 years) + bank statements. Without income proof, you may only qualify for smaller loans at higher rates.' },
      { q: 'Can I prepay a personal loan early in {city}?', a: 'Most lenders allow personal loan prepayment after 6–12 EMIs with a foreclosure charge of 2–5% on the outstanding principal. Some NBFCs and fintech lenders in {city} offer zero prepayment penalty, especially on floating-rate personal loans.' },
    ],
    relatedSlugs: ['home-construction', 'renovation', 'business'],
  },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────

export function getLoanType(slug: string): LoanTypeSEO | undefined {
  return LOAN_TYPES_SEO.find(l => l.slug === slug);
}

export function getRelatedLoanTypes(slugs: string[]): LoanTypeSEO[] {
  return slugs.map(s => getLoanType(s)).filter(Boolean) as LoanTypeSEO[];
}
