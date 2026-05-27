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
      { q: 'How much home construction loan can I get in {city}?', a: 'In {city}, you can get a home construction loan up to ₹4 Crore through Biddaro depending on your income, credit score, plot value, and the approved construction estimate. Most lenders offer 75–80% of the total construction cost as a loan. For example, on a ₹50 Lakh construction project in {city}, you can typically borrow ₹37.5–40 Lakh. Higher income and a CIBIL score above 750 unlock better loan-to-value ratios. Apply online at biddaro.com/loan-apply to check your exact eligibility in {city}.' },
      { q: 'What is the interest rate for a home construction loan in {city}?', a: 'Home construction loan interest rates in {city} start from 8.5% p.a. (0.71% per month) for salaried applicants with a CIBIL score above 750. Rates typically range from 8.5% to 11% p.a. depending on your lender, credit profile, loan amount, and tenure. On a ₹20 Lakh loan at 8.5% p.a. over 15 years in {city}, your EMI would be approximately ₹19,703 per month. Biddaro connects you with verified lenders offering the most competitive rates available in {city}.' },
      { q: 'What documents are required for a home construction loan in {city}?', a: 'Documents required for a home construction loan in {city}: (1) Identity proof — Aadhaar card and PAN card; (2) Income proof — salary slips for 3 months and Form 16, or ITR for last 2 years if self-employed; (3) Bank statements for the last 6 months; (4) Plot ownership documents — sale deed or registered agreement; (5) Approved building plan from the {city} municipal corporation or development authority; (6) Construction cost estimate from a licensed civil engineer or architect. Having all documents ready speeds up approval to 5–7 working days in {city}.' },
      { q: 'How long does it take to get a construction loan approved in {city}?', a: 'Once your documents are complete, home construction loan approval in {city} through Biddaro typically takes 5–10 working days. The process involves document verification, legal check of the plot, and technical valuation of the construction estimate. Disbursement does not happen in a lump sum — it is released in 3–5 tranches linked to construction milestones (foundation, plinth, slab, walls, finishing). This stage-wise release protects both borrower and lender and ensures funds are used specifically for construction in {city}.' },
      { q: 'Can I get a home construction loan on an agricultural plot in {city}?', a: 'Most banks and NBFCs in {city} do not fund construction on agricultural land because it cannot be mortgaged under the Transfer of Property Act unless converted. To be eligible for a construction loan in {city}, the plot must be converted to residential or non-agricultural use with a proper conversion order from the revenue authority or local body. Once converted, you need the updated 7/12 extract (or equivalent record in {city}) showing residential classification before applying. Contact your local development authority in {city} for the NA (non-agricultural) conversion process — it typically takes 30–90 days.' },
      { q: 'What is the maximum tenure for a home construction loan?', a: 'Lenders in {city} offer a maximum repayment tenure of 20 years for home construction loans. The total tenure includes the construction period (typically 18–36 months), during which only interest is charged (moratorium period), followed by the full EMI repayment phase. For example, on a ₹30 Lakh loan in {city} over 20 years at 8.5% p.a., your EMI during repayment phase would be approximately ₹26,035 per month. A longer tenure reduces monthly EMI but increases total interest paid — use Biddaro\'s EMI calculator at biddaro.com to find your optimal tenure in {city}.' },
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
      { q: 'How much renovation loan can I get in {city}?', a: 'You can get a home renovation loan up to ₹75 Lakh in {city} through Biddaro. The amount sanctioned depends on your property\'s current market value (lenders typically offer 70–80% LTV), your monthly income, existing EMI obligations, and CIBIL score. For a property worth ₹60 Lakh in {city}, you may qualify for a renovation loan up to ₹45–48 Lakh. For smaller renovations like painting or flooring in {city}, unsecured renovation loans of ₹1–10 Lakh are also available without any property documents.' },
      { q: 'What is the interest rate for a renovation loan in {city}?', a: 'Home renovation loan rates in {city} start from 9.5% p.a. for secured loans (mortgaged against property) and range up to 13% p.a. depending on your lender, credit score, and loan amount. On an unsecured renovation loan in {city} (personal loan variant), rates are typically 12–18% p.a. For example, a ₹10 Lakh secured renovation loan in {city} at 9.5% p.a. over 5 years would cost approximately ₹21,005 EMI per month. A higher CIBIL score (750+) can reduce your rate by 0.5–1.5% in {city}.' },
      { q: 'Can I get a renovation loan without property collateral in {city}?', a: 'Yes — unsecured renovation loans are available in {city} without any property collateral. These function similarly to personal loans and are available up to ₹10 Lakh for renovation purposes. Interest rates on unsecured renovation loans in {city} typically range from 12% to 18% p.a. The advantage is faster approval (24–48 hours) and no mortgage registration cost. For renovations above ₹10 Lakh in {city}, a secured loan against your property offers lower rates and longer repayment tenure of up to 10 years.' },
      { q: 'What renovation work is covered under a renovation loan?', a: 'Home renovation loans in {city} cover a wide range of residential improvement work including: flooring and tiling, painting (interior and exterior), plumbing upgrades, electrical rewiring, kitchen modular remodelling, bathroom renovation and waterproofing, false ceiling and interior design work, window and door replacement, room addition or extension (with proper {city} municipal approval), solar panel installation, and security system installation. Structural changes — like removing load-bearing walls — may require a separate technical sanction from the {city} municipal authority before the lender disburses funds.' },
      { q: 'How long does renovation loan approval take in {city}?', a: 'Renovation loan approval time in {city} depends on the type of loan. Secured renovation loans (mortgaged against property) typically take 5–7 working days as lenders verify the property documents and get a valuation done. Unsecured renovation loans in {city} (personal loan for renovation) can be approved within 24–48 hours if your documents are complete — Aadhaar, PAN, 3-month salary slips, and 6-month bank statements. Biddaro pre-matches your profile to the fastest-approving lenders in {city} to minimise waiting time.' },
      { q: 'Do I need to submit renovation bills to get a renovation loan?', a: 'For secured home renovation loans in {city}, most lenders require a renovation cost estimate from a contractor or architect before approval. Disbursement is often made directly to the contractor in tranches as work progresses — protecting you from fund misuse. For unsecured renovation personal loans in {city}, funds are directly credited to your bank account without any bill submission or verification of work done. If you prefer full flexibility in using the loan amount, the unsecured personal loan variant in {city} is the better choice despite slightly higher interest rates.' },
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
      { q: 'What types of equipment can be financed in {city}?', a: 'Equipment finance in {city} through Biddaro covers a wide range of construction and business machinery: excavators and JCBs, cranes and boom lifts, concrete batching plants, transit mixers and boom placers, compactors and rollers, generators and DG sets, commercial vehicles (tippers, trucks), scaffolding systems, drilling rigs, and agricultural or manufacturing machinery. Both new equipment from authorized dealers and second-hand machinery up to 10 years old can be financed in {city}. The equipment being purchased serves as the primary collateral through hypothecation.' },
      { q: 'What is the down payment for equipment finance in {city}?', a: 'For equipment finance in {city}, most lenders require a down payment of 10–25% of the equipment\'s invoice value. For example, on a ₹30 Lakh excavator in {city}, you may need to bring ₹3–7.5 Lakh as a margin. Zero-down-payment schemes are available in {city} for new equipment purchases from authorized dealers, but only for borrowers with a CIBIL score above 750 and a clean repayment history. The remaining 75–90% is financed over 1–7 years via fixed monthly EMIs.' },
      { q: 'Can I finance second-hand construction equipment in {city}?', a: 'Yes — used or second-hand construction equipment financing is available in {city} but with some conditions. The equipment must generally not be older than 7–10 years from the date of manufacture. Lenders in {city} may require an independent valuation from an approved technical valuer to determine the forced sale value (FSV), which determines the loan amount. Interest rates on used equipment in {city} are typically 1–3% higher than new equipment — ranging from 12% to 15% p.a. The loan tenure is also shorter, typically 3–5 years maximum for used machinery in {city}.' },
      { q: 'Is GST registration mandatory for equipment finance in {city}?', a: 'GST registration is not mandatory for equipment loans below ₹25 Lakh in {city}, but it significantly improves your chances of approval and helps you secure better interest rates. For loans above ₹25 Lakh in {city}, most banks and NBFCs require GST registration as it provides verified proof of business activity and turnover. GST returns for the last 4–8 quarters give lenders confidence in your cash flows. If you are not yet GST-registered in {city} and need a larger equipment loan, completing GST registration first (takes 3–7 days) will open access to better loan terms.' },
      { q: 'How is equipment finance loan repaid?', a: 'Equipment finance loans in {city} are repaid through fixed monthly EMIs (Equated Monthly Instalments) over the loan tenure of 1–7 years. The purchased equipment is hypothecated to the lender — meaning the lender holds an interest in the asset while you retain possession and use it for your business in {city}. Once all EMIs are paid and the loan account is closed, the lender releases the hypothecation charge and provides a No Objection Certificate (NOC). You can then freely sell or transfer the equipment. Some lenders in {city} offer step-up EMI structures where initial EMIs are lower and increase over time as your business generates more revenue.' },
      { q: 'What happens if I default on equipment finance?', a: 'If you default on equipment finance EMIs for 90+ consecutive days in {city}, the loan is classified as an NPA (Non-Performing Asset) and the lender has the legal right to repossess the hypothecated equipment under the SARFAESI Act. The repossessed equipment in {city} is then auctioned to recover the outstanding loan amount. This also severely damages your CIBIL score, making future borrowing difficult. If you anticipate payment difficulty in {city}, proactively contact your lender immediately — most NBFCs offer EMI holiday, restructuring, or refinancing before initiating repossession proceedings. Prevention is always easier than resolution.' },
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
      { q: 'What is a working capital loan and who needs it in {city}?', a: 'A working capital loan in {city} is a short-term business loan designed to fund day-to-day operational expenses — not for purchasing long-term assets. For construction businesses in {city}, this means covering labour payments between project milestones, purchasing cement, steel, and tiles before the client payment arrives, paying subcontractors, and managing cash flow gaps in a project-based business. It is ideal for {city}-based contractors who receive payments in large milestones (30-60-10% structure) but incur daily expenses continuously. Working capital loans via Biddaro are available from ₹50,000 to ₹50 Lakh in {city}.' },
      { q: 'What is the difference between a term loan and a working capital loan?', a: 'A term loan in {city} is a long-term credit facility (3–15 years) used specifically to purchase fixed assets like machinery, equipment, land, or buildings. It has a fixed repayment schedule and is secured against the asset purchased. A working capital loan in {city} is short-term (6 months to 3 years), used purely for operational cash flow — salaries, raw materials, vendor payments — and is typically unsecured or secured against receivables. For a construction contractor in {city}: buy a JCB with a term loan, pay your daily labour with a working capital loan. Both serve distinct purposes and are often used together.' },
      { q: 'What interest rate can I expect for a working capital loan in {city}?', a: 'Working capital loan interest rates in {city} typically range from 13% to 18% p.a. for construction and SME businesses. The rate depends on: (1) business vintage — older businesses get lower rates in {city}; (2) bank statement analysis — higher average balance = lower rate; (3) GST filing consistency — 8+ quarters of regular filing helps; (4) CIBIL score of the promoter; (5) nature of clients and contract types. On a ₹10 Lakh working capital loan in {city} at 15% p.a. over 12 months, the EMI would be approximately ₹90,258 per month. Apply via Biddaro for the best available rate in {city}.' },
      { q: 'How quickly can I get a working capital loan in {city}?', a: 'Working capital loan disbursal speed in {city} depends on the lender type. Traditional banks typically take 7–15 working days due to extensive document verification. NBFCs in {city} process faster — usually 3–5 working days. Digital lenders and fintech NBFCs partnered with Biddaro can disburse working capital loans in {city} within 24–72 hours for businesses with 12+ months of banking history and GST turnover above ₹15 Lakh per year. Key to fast approval: clean bank statements without cheque bounces, consistent GST filing in {city}, and a CIBIL score above 700 for the promoter.' },
      { q: 'Do I need collateral for a working capital loan in {city}?', a: 'Many NBFCs and fintech lenders in {city} offer unsecured working capital loans up to ₹25 Lakh based purely on your business cash flows — no property, no machinery hypothecation required. Above ₹25 Lakh in {city}, lenders may ask for collateral in the form of: property mortgage (residential or commercial), machinery hypothecation, or FD lien. The business\'s accounts receivable (client invoices) can also serve as collateral for invoice discounting — a specialised working capital facility available in {city} where you get 80–90% of your outstanding invoice value as instant cash.' },
      { q: 'Can a new construction business get a working capital loan in {city}?', a: 'Most lenders in {city} require a minimum of 12 months of business operation and 12 months of banking history before approving a working capital loan. If your business is under 12 months old in {city}, your options are: (1) apply for a personal loan of up to ₹5 Lakh backed by your personal income and credit score; (2) use a business loan guaranteed by a co-applicant with an established business; (3) approach MUDRA (Pradhan Mantri MUDRA Yojana) for Shishu or Kishore category loans for businesses in their early stages in {city}. After 12 months of operation, you qualify for regular working capital facilities through Biddaro.' },
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
      { q: 'What is the maximum business loan I can get in {city}?', a: 'Business loans in {city} through Biddaro are available up to ₹2 Crore for construction businesses, SMEs, and entrepreneurs. The actual loan amount is calculated based on your annual turnover, net profit after tax (PAT), existing loan obligations, and CIBIL score of the promoter. Most lenders in {city} offer 20–25% of your annual turnover as an unsecured business loan. For example, a construction business in {city} with ₹1 Crore annual turnover may qualify for ₹20–25 Lakh unsecured, and higher amounts if property collateral is offered. Apply via Biddaro at biddaro.com/loan-apply to check your exact eligibility in {city}.' },
      { q: 'What are the interest rates for business loans in {city}?', a: 'Business loan interest rates in {city} start from 10.5% p.a. for well-established businesses with a CIBIL score above 750 and consistent 2+ year ITR filings. Typical rates for construction businesses in {city} range from 10.5% to 18% p.a. depending on business vintage, loan amount, collateral offered, and the lender. For example, a ₹50 Lakh business loan in {city} at 12% p.a. over 5 years would cost approximately ₹1,11,221 EMI per month. Offering property collateral in {city} typically reduces your rate by 1.5–2.5% compared to an unsecured business loan.' },
      { q: 'Is collateral required for a business loan in {city}?', a: 'Unsecured business loans in {city} are available up to ₹50 Lakh based purely on your business financials — no property or machinery collateral needed. For amounts above ₹50 Lakh in {city}, lenders typically require: residential or commercial property mortgage (50–60% LTV), machinery hypothecation, FD lien, or a combination. The CGTMSE (Credit Guarantee Trust for Micro and Small Enterprises) scheme allows {city}-based micro and small enterprises to get unsecured business loans up to ₹2 Crore with government credit guarantee — at significantly lower rates than market.' },
      { q: 'Can a proprietorship or partnership firm get a business loan in {city}?', a: 'Yes — all business entity types can get business loans in {city}: sole proprietorships, Hindu Undivided Families (HUFs), partnerships, LLPs, and private limited companies. Documentation varies by structure in {city}: proprietorships need the owner\'s ITR and bank statements; partnerships need the partnership deed plus partner ITRs; Pvt Ltd companies need MOA/AOA, board resolution, and audited financials. Private limited companies typically access better rates and higher loan amounts in {city} due to audit transparency and corporate governance. GST registration is required for amounts above ₹25 Lakh regardless of business structure.' },
      { q: 'How does a business loan help a construction contractor in {city}?', a: 'A business loan in {city} transforms a construction contractor\'s capacity in multiple ways: (1) Bid on larger projects — many {city} government and private tenders require a security deposit of 2–5% upfront; a ₹2 Lakh business loan covers the deposit on a ₹40–100 Lakh project; (2) Bulk material purchase — cement and steel bought in bulk saves 8–12% vs retail in {city}; (3) Hire skilled subcontractors on advance basis — retaining quality workers in {city}\'s competitive labour market often requires advance payment; (4) Bridge payment gaps — most {city} construction projects have 30–60 day payment cycles; a business loan covers running expenses during the wait.' },
      { q: 'What documents do I need for a business loan in {city}?', a: 'Documents required for a business loan in {city}: Identity — PAN and Aadhaar of all promoters/directors; Business proof — GST registration certificate, Udyam/MSME registration, or business registration document; Financial documents — ITR for last 2 years, CA-certified Profit & Loss statement and Balance Sheet, latest 12 months of business bank statements; Loan-specific — existing loan sanction letters and repayment schedules. For secured business loans in {city}, add: property documents (title deed, encumbrance certificate, latest property tax receipt). Having all documents ready before applying reduces approval time in {city} to 5–7 working days.' },
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
      { q: 'How much personal loan can I get in {city}?', a: 'Personal loan amounts in {city} through Biddaro range from ₹10,000 to ₹5 Lakh. The exact amount approved depends on your net monthly income, existing EMI obligations, and CIBIL score. Most lenders in {city} use a FOIR (Fixed Obligation to Income Ratio) of 40–50% — meaning your total existing EMIs plus the new loan EMI should not exceed 40–50% of your net monthly income. A person earning ₹30,000/month in {city} with no existing EMIs can typically get a personal loan of ₹2–3.5 Lakh. Check your exact eligibility instantly at biddaro.com/loan-apply — it takes under 3 minutes.' },
      { q: 'What is the interest rate for a personal loan in {city}?', a: 'Personal loan interest rates in {city} start from 14% p.a. (1.17% per month) for salaried applicants with a CIBIL score above 750. For scores between 700–750 in {city}, expect rates of 15–18% p.a. For scores below 700, rates can be 18–24% p.a. On a ₹3 Lakh personal loan in {city} at 14% p.a. over 3 years, your EMI would be approximately ₹10,245 per month and total interest paid would be ₹68,820. Improving your CIBIL score from 700 to 750 before applying in {city} can save you ₹10,000–20,000 in total interest on a 3-year personal loan.' },
      { q: 'How quickly can I get a personal loan in {city}?', a: 'Personal loan disbursal speed in {city} varies by lender type. Fintech lenders and digital NBFCs partnered with Biddaro can disburse personal loans in {city} within 2–24 hours for pre-approved profiles. Traditional banks in {city} typically take 2–4 working days. The speed depends on your document readiness: Aadhaar-linked mobile number (for eKYC), salary slips or ITR, and an active bank account in {city}. Having a salary account with the lending bank often qualifies you for pre-approved personal loan offers with instant disbursal in {city} — no additional documents needed.' },
      { q: 'Can I get a personal loan with a low CIBIL score in {city}?', a: 'Yes — some NBFCs and fintech lenders in {city} offer personal loans for credit scores between 600–680, but at higher interest rates (18–24% p.a.) and for smaller amounts (up to ₹1–2 Lakh). Your approval chances in {city} improve significantly if: (1) your salary account is with the lending bank; (2) you add a co-applicant with a CIBIL score above 700; (3) you can offer collateral like an FD or gold. Biddaro matches your profile to the lender most likely to approve your personal loan in {city} based on your actual score — avoiding wasted applications that further damage your CIBIL score.' },
      { q: 'Is income proof mandatory for a personal loan in {city}?', a: 'Income proof is mandatory for personal loans in {city} as lenders assess your repayment capacity. For salaried applicants in {city}: salary slips for the last 3 months and Form 16 or bank statements showing salary credits. For self-employed applicants in {city}: ITR for the last 2 years with acknowledgement, CA-certified P&L statement, and business bank statements for 6–12 months. If you are in informal employment in {city} without formal income proof, some NBFCs accept: 6-month bank statement showing regular credits, rent receipts, or a guarantor with documented income. Apply via Biddaro to get matched with {city} lenders who accept your specific income documentation.' },
      { q: 'Can I prepay a personal loan early in {city}?', a: 'Yes — you can prepay a personal loan early in {city}, but most lenders charge a foreclosure fee. For fixed-rate personal loans in {city}, foreclosure charges typically range from 2% to 5% of the outstanding principal amount, applicable after paying 6–12 EMIs. Some NBFCs and fintech lenders in {city} offer zero prepayment penalty on personal loans — particularly if the loan has a floating interest rate. Under RBI guidelines, banks cannot charge prepayment penalty on floating-rate personal loans. Before taking a personal loan in {city}, ask specifically about the foreclosure terms — this can save you thousands if you plan to repay early.' },
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
