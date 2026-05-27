// ─── Loan Comparison Pages Data ───────────────────────────────────────────────
// 5 high-intent "vs" pages targeting queries banks won't rank for

export interface CompareRow {
  label: string;
  a: string;           // Option A value
  b: string;           // Option B value
  winner: 'a' | 'b' | 'tie';
  note?: string;
}

export interface CompareFaq {
  q: string;
  a: string;
}

export interface CompareScenario {
  title: string;
  description: string;
  winner: 'a' | 'b';
}

export interface LoanComparison {
  slug: string;
  title: string;
  metaTitle: string;
  metaDescription: string;
  intro: string;
  labelA: string;         // e.g. "SBI Home Loan"
  labelB: string;         // e.g. "NBFC / Biddaro"
  summaryA: string;       // 1-sentence description of Option A
  summaryB: string;
  verdictTitle: string;
  verdict: string;
  ctaText: string;
  ctaLink: string;
  tags: string[];
  monthlySearches: number;
  rows: CompareRow[];
  scenarios: CompareScenario[];
  faqs: CompareFaq[];
  relatedComparisons: string[];  // slugs
}

export const LOAN_COMPARISONS: LoanComparison[] = [
  // ─── 1. SBI / Govt Bank vs NBFC ───────────────────────────────────────────
  {
    slug: 'sbi-bank-vs-nbfc-loan',
    title: 'SBI / Govt Bank vs NBFC Loan — Which Is Better for You in India?',
    metaTitle: 'SBI Bank vs NBFC Home Loan India 2025 — Interest Rate, Approval, Eligibility | Biddaro',
    metaDescription: 'SBI vs NBFC home loan comparison India 2025. Interest rates, approval speed, eligibility, self-employed access, documents. Which lender should you choose?',
    intro: 'Government banks like SBI offer the lowest interest rates in India — but they reject 40–50% of applications and take 3–6 weeks to process. NBFCs approve faster with more flexible criteria but at slightly higher rates. This comparison helps you decide which route fits your profile and urgency.',
    labelA: 'SBI / Govt Bank',
    labelB: 'NBFC (via Biddaro)',
    summaryA: 'India\'s largest lender — lowest rates, strictest eligibility, slowest processing.',
    summaryB: 'Private non-banking lenders — slightly higher rates, flexible criteria, fast approval.',
    verdictTitle: 'The Honest Verdict',
    verdict: 'Choose SBI if your CIBIL is 750+, you are salaried in a government or large corporate job, you have complete property documents, and you can wait 3–6 weeks. Choose an NBFC via Biddaro if you are self-employed, your CIBIL is 650–749, you need the loan in 5–10 days, or your income is non-standard (cash salary, freelance, contract). Most construction loans in India go through NBFCs because SBI often does not finance under-construction properties in smaller cities.',
    ctaText: 'Apply via Biddaro — NBFC Network',
    ctaLink: '/loan-apply',
    tags: ['sbi vs nbfc loan india', 'bank vs nbfc home loan', 'sbi home loan 2025', 'nbfc loan india'],
    monthlySearches: 4500,
    rows: [
      { label: 'Interest Rate',        a: '8.5%–9.15% p.a.',          b: '9%–13% p.a.',              winner: 'a', note: 'SBI rate is repo-linked (RLLR). NBFCs are 0.5–3% higher.' },
      { label: 'Min CIBIL Score',      a: '750+',                      b: '650+',                     winner: 'b', note: 'NBFCs accept lower CIBIL — key advantage for most borrowers.' },
      { label: 'Approval Time',        a: '3–6 weeks',                 b: '5–10 working days',        winner: 'b', note: 'NBFCs are 3–5x faster due to digital-first processing.' },
      { label: 'Self-Employed',        a: 'Strict — 3 yr ITR needed',  b: 'Flexible — 2 yr ITR',      winner: 'b', note: 'SBI often rejects self-employed with irregular income.' },
      { label: 'Under-Construction',   a: 'Limited — approved builders only', b: 'Wider acceptance',  winner: 'b', note: 'SBI restricts to RERA-approved builder projects.' },
      { label: 'Max Loan Amount',      a: 'No upper limit',            b: 'Up to ₹4 Crore',           winner: 'a', note: 'For very large loans (>₹4Cr), SBI is the better route.' },
      { label: 'Processing Fee',       a: '0.35% of loan + GST',       b: '0.5–1.5% + GST',           winner: 'a', note: 'SBI processing fees are government-capped.' },
      { label: 'Foreclosure Charges',  a: 'Nil (floating rate)',        b: 'Nil (floating rate)',      winner: 'tie', note: 'Both follow RBI\'s no-prepayment-penalty rule.' },
      { label: 'Document Flexibility', a: 'Rigid — full set required', b: 'Flexible — case-by-case',  winner: 'b', note: 'NBFCs work with alternate income proofs.' },
      { label: 'Branch Availability',  a: 'Pan-India, 22,000+ branches', b: 'Mostly digital/metro',   winner: 'a', note: 'SBI reachable in every district.' },
    ],
    scenarios: [
      { title: 'You are a government employee with CIBIL 780', description: 'SBI wins clearly. You qualify for the lowest rate (8.5%), no document issues, and the 3-week wait is acceptable.', winner: 'a' },
      { title: 'You are self-employed with CIBIL 690', description: 'NBFC via Biddaro wins. SBI will likely reject you. An NBFC approves in 7–10 days at 10–12%, which is still significantly cheaper than a personal loan.', winner: 'b' },
      { title: 'You need the loan in under 2 weeks', description: 'NBFC via Biddaro wins. SBI\'s processing pipeline cannot deliver in this timeframe for a new customer.', winner: 'b' },
      { title: 'Loan amount above ₹2 Crore, full documents ready', description: 'SBI wins on rate — the 1–2% rate difference on a ₹2Cr+ loan is ₹20,000–₹40,000/month in EMI savings.', winner: 'a' },
    ],
    faqs: [
      { q: 'Can I apply to both SBI and an NBFC simultaneously?', a: 'Technically yes, but each application creates a hard enquiry on your CIBIL — reducing your score by 5–10 points per enquiry. A better approach: use Biddaro to check eligibility with multiple lenders via a single soft enquiry. Then apply formally only to the lender that pre-qualifies you. This protects your CIBIL score while maximising your chances.' },
      { q: 'Is an NBFC loan as safe as an SBI loan?', a: 'Yes — all NBFCs in Biddaro\'s network are registered with the Reserve Bank of India and follow RBI\'s Fair Practices Code. Your loan agreement, disbursement process, and borrower rights are identical to those with a bank. The RBI regulates both banks and NBFCs under the same borrower protection framework. The key difference is ownership (private vs government) and risk appetite, not safety.' },
      { q: 'Can I transfer my NBFC loan to SBI later for a lower rate?', a: 'Yes — this is called a balance transfer and it is very common. Many borrowers take an NBFC loan for speed, then transfer to SBI or HDFC after 12–24 months once their CIBIL improves. Under RBI rules, you can transfer a floating rate loan at any time without foreclosure charges. Balance transfer costs (processing fee, legal, valuation) are typically ₹30,000–₹60,000 — usually recouped within 12–18 months of EMI savings.' },
      { q: 'What is the actual rate difference between SBI and top NBFCs in 2025?', a: 'SBI home loan rate 2025: 8.5%–9.15% p.a. (repo-linked). Top NBFCs (HDFC Ltd, LIC HFL, Bajaj Housing): 8.75%–10.5%. Smaller NBFCs and those in Biddaro\'s network: 9%–13%. The gap narrows significantly for strong profiles — a CIBIL 750+ self-employed professional can often get an NBFC rate within 0.5% of SBI. On a ₹25 Lakh loan, 0.5% difference = ₹700/month in EMI — less than most people expect.' },
    ],
    relatedComparisons: ['personal-loan-vs-gold-loan', 'home-loan-vs-lap', 'nbfc-vs-private-bank-loan'],
  },

  // ─── 2. Personal Loan vs Gold Loan ────────────────────────────────────────
  {
    slug: 'personal-loan-vs-gold-loan',
    title: 'Personal Loan vs Gold Loan India 2025 — Which Is Cheaper?',
    metaTitle: 'Personal Loan vs Gold Loan India 2025 — Rate, Eligibility, Which to Choose | Biddaro',
    metaDescription: 'Personal loan vs gold loan comparison India 2025. Interest rates, processing time, CIBIL requirement, loan amount, risks. Which is better for urgent cash needs?',
    intro: 'When you need cash urgently in India, two options stand out: personal loan (unsecured, based on income) and gold loan (secured against your gold jewellery). Both can disburse in 24–48 hours — but they work very differently. This comparison covers every dimension to help you choose the right option for your situation.',
    labelA: 'Personal Loan',
    labelB: 'Gold Loan',
    summaryA: 'Unsecured loan based on income and credit score — no asset required, but higher interest.',
    summaryB: 'Loan secured against gold jewellery — fast, lower interest, but your gold is at risk.',
    verdictTitle: 'Which Should You Choose?',
    verdict: 'Gold loan wins on cost — rates are 7–10% p.a. vs 14–24% p.a. for personal loans. If you own gold jewellery and need short-term cash (under 12 months), a gold loan is almost always cheaper. Choose a personal loan if: you need more than ₹10 Lakh, you don\'t have gold, you need tenure beyond 2 years, or you are uncomfortable pledging family jewellery. For construction or renovation purposes, a dedicated Biddaro construction/renovation loan beats both — lower rate than personal, no gold pledge required.',
    ctaText: 'Apply for a Biddaro Loan — No Gold Required',
    ctaLink: '/loan-apply',
    tags: ['personal loan vs gold loan india', 'gold loan vs personal loan 2025', 'which is better gold loan personal loan'],
    monthlySearches: 12000,
    rows: [
      { label: 'Interest Rate',         a: '14%–24% p.a.',             b: '7%–12% p.a.',              winner: 'b', note: 'Gold loans are secured — hence significantly lower rates.' },
      { label: 'Processing Time',       a: '1–3 working days',         b: '30 minutes–2 hours',       winner: 'b', note: 'Gold loans are the fastest loan in India.' },
      { label: 'CIBIL Score Required',  a: '650+',                     b: 'Not required',             winner: 'b', note: 'Gold loan does not need a credit check — collateral is enough.' },
      { label: 'Maximum Amount',        a: 'Up to ₹40–50 Lakh',       b: 'Up to 75% of gold value',  winner: 'a', note: 'Gold value caps the gold loan amount. Personal loans can go higher.' },
      { label: 'Tenure',                a: '12–60 months',             b: '3–24 months',              winner: 'a', note: 'Gold loans are short-term by design.' },
      { label: 'Documents Required',    a: 'Aadhaar + PAN + income proof', b: 'Aadhaar + PAN + gold only', winner: 'b', note: 'No income proof needed for gold loans.' },
      { label: 'Risk',                  a: 'Credit score impact if default', b: 'Gold seized if default', winner: 'tie', note: 'Different types of risk — financial vs asset loss.' },
      { label: 'EMI Flexibility',       a: 'Fixed EMI every month',    b: 'Bullet repayment or EMI',  winner: 'b', note: 'Gold loans allow interest-only payments with principal at end.' },
      { label: 'Purpose Restriction',   a: 'None — use for anything',  b: 'None — use for anything',  winner: 'tie', note: 'Both are multi-purpose loans.' },
      { label: 'Available at',          a: 'Banks, NBFCs, digital apps', b: 'Banks, Muthoot, Manappuram', winner: 'a', note: 'Personal loan has wider lender access including digital-first.' },
    ],
    scenarios: [
      { title: 'Need ₹2 Lakh for 6 months', description: 'Gold loan wins heavily. At 9% p.a. for 6 months on ₹2 Lakh = ₹9,000 total interest. Personal loan at 18% = ₹18,000 interest for same period. Gold loan saves ₹9,000.', winner: 'b' },
      { title: 'Need ₹5 Lakh for 3 years', description: 'Personal loan wins on tenure flexibility. Gold loans for ₹5 Lakh over 3 years are available but require significant gold value (approx. 200g+ of 22K gold). Personal loan has no collateral requirement.', winner: 'a' },
      { title: 'No CIBIL score / poor credit', description: 'Gold loan wins — no credit check required. You can walk into Muthoot Finance with gold and walk out with cash in 30 minutes regardless of credit history.', winner: 'b' },
      { title: 'Need ₹15 Lakh for home renovation', description: 'Neither wins — a dedicated renovation loan (via Biddaro) at 9.5% p.a. up to ₹75 Lakh beats both options on cost and tenure. Apply at biddaro.com/loan-apply.', winner: 'b' },
    ],
    faqs: [
      { q: 'What happens to my gold if I can\'t repay a gold loan?', a: 'If you default on a gold loan, the lender (bank or NBFC like Muthoot/Manappuram) sends a formal notice, waits 30 days, then auctions your pledged gold jewellery to recover the outstanding amount. Any surplus after recovery is returned to you. This is why gold loans carry significant emotional risk for family jewellery — if in doubt about repayment capacity, choose a personal loan instead, even at a higher rate.' },
      { q: 'Can I get a gold loan if my gold is already pledged with a pawnshop?', a: 'No — gold must be free of any existing lien or pledge. Pawnshop gold is already hypothecated. You must first redeem the gold from the pawnshop (by repaying that loan), then pledge it with a regulated lender. Regulated gold loans (Muthoot, Manappuram, banks) offer significantly better rates than pawnshops — typically 7–12% p.a. vs 24–48% at pawnshops.' },
      { q: 'Is 22K or 24K gold required for a gold loan?', a: 'Gold loans in India are available against 18K, 22K, and 24K gold. The loan amount is calculated as: (current gold price × purity factor × weight) × LTV (up to 75% per RBI guidelines). 22K hallmarked jewellery is the most commonly accepted. Coins and bars from government mints (MMTC, SBI) are also accepted. Diamond-studded jewellery — the diamond value is not counted, only the gold weight.' },
      { q: 'Should I take a gold loan or personal loan for a medical emergency?', a: 'For a genuine medical emergency, gold loan wins on speed — 30–45 minutes to disburse vs 24–48 hours for personal loan. Both are equally valid for medical purposes. If you have gold available, use it for faster access. For larger medical bills (above ₹5 Lakh) where gold value may be insufficient, a personal loan or medical loan through a digital lender is the right choice. Some NBFCs offer specific medical emergency loans with same-day disbursement.' },
    ],
    relatedComparisons: ['sbi-bank-vs-nbfc-loan', 'home-loan-vs-lap', 'nbfc-vs-private-bank-loan'],
  },

  // ─── 3. Home Loan vs Loan Against Property ────────────────────────────────
  {
    slug: 'home-loan-vs-lap',
    title: 'Home Loan vs Loan Against Property (LAP) India 2025 — Key Differences',
    metaTitle: 'Home Loan vs Loan Against Property India 2025 — Which is Right for You? | Biddaro',
    metaDescription: 'Home loan vs LAP comparison India 2025. Interest rate, purpose, LTV, eligibility differences. When should you choose a home loan vs loan against property?',
    intro: 'Home loan and Loan Against Property (LAP) are both secured loans against real estate — but they serve very different purposes and have different eligibility criteria. Choosing the wrong one costs you significantly in interest and processing time. This guide clarifies when to use each.',
    labelA: 'Home Loan',
    labelB: 'Loan Against Property (LAP)',
    summaryA: 'Specifically for buying, building, or renovating a home — lower rate, government-eligible.',
    summaryB: 'Any purpose loan secured against your existing property — higher rate, higher flexibility.',
    verdictTitle: 'The Right Choice Depends on Purpose',
    verdict: 'If your purpose is buying, building, or renovating a home — always use a home loan. It is cheaper (8.5–10% vs 10–14%), has higher LTV (up to 90%), qualifies for PMAY subsidies, and offers tax benefits under Section 24(b) and 80C. If your purpose is anything else (business expansion, medical, education, debt consolidation) and you own property — LAP is your cheapest option. LAP at 11% beats personal loan at 18% on a ₹20 Lakh requirement by ₹1.4 Lakh per year in interest. For construction specifically, use Biddaro\'s dedicated construction loan — faster than both.',
    ctaText: 'Apply for Home Construction Loan',
    ctaLink: '/loan-apply',
    tags: ['home loan vs lap india', 'loan against property vs home loan', 'lap vs home loan 2025 india'],
    monthlySearches: 9000,
    rows: [
      { label: 'Interest Rate',           a: '8.5%–10.5% p.a.',         b: '10%–14% p.a.',             winner: 'a', note: 'Home loans are cheaper because the purpose is residential.' },
      { label: 'Purpose',                 a: 'Buy/build/renovate home only', b: 'Any purpose',           winner: 'b', note: 'LAP is the most flexible secured loan in India.' },
      { label: 'LTV Ratio',               a: 'Up to 90% (sub ₹30L)',    b: 'Up to 60–70%',             winner: 'a', note: 'Home loans offer higher financing of property value.' },
      { label: 'Tax Benefits',            a: 'Sec 24(b) + 80C',         b: 'Only if used for business', winner: 'a', note: 'Home loan offers ₹3.5L annual tax deduction (₹2L interest + ₹1.5L principal).' },
      { label: 'PMAY Subsidy',            a: 'Eligible (up to ₹2.35L)', b: 'Not eligible',             winner: 'a', note: 'Only home loans qualify for government interest subsidy.' },
      { label: 'Property Requirement',    a: 'Property being financed',  b: 'Any owned property',       winner: 'b', note: 'LAP lets you unlock equity from properties you already own.' },
      { label: 'Max Loan Amount',         a: 'Based on cost + LTV',      b: '60–70% of property market value', winner: 'tie', note: 'Both are property-value-limited.' },
      { label: 'Tenure',                  a: 'Up to 30 years',           b: 'Up to 15 years',           winner: 'a', note: 'Longer tenure = lower EMI on home loans.' },
      { label: 'Processing Time',         a: '2–4 weeks',                b: '2–4 weeks',                winner: 'tie', note: 'Both require legal verification — similar timelines.' },
      { label: 'Income Flexibility',      a: 'Moderate',                 b: 'High — property is primary security', winner: 'b', note: 'LAP lenders focus more on property value than income.' },
    ],
    scenarios: [
      { title: 'Building a new house on your plot', description: 'Home construction loan wins — 8.5% rate vs 11% LAP. Also eligible for PMAY subsidy. Use Biddaro\'s home construction loan for fastest approval.', winner: 'a' },
      { title: 'Need ₹30 Lakh to expand your business and own a house', description: 'LAP wins — you cannot use a home loan for business purposes. LAP at 11% against your existing property is the cheapest way to fund business growth without disturbing ownership.', winner: 'b' },
      { title: 'First-time homebuyer with PMAY eligibility', description: 'Home loan wins heavily — you get PMAY subsidy of ₹1.5–2.35 Lakh credited to your loan account, plus Section 80C + 24(b) tax benefits. The combined saving over 20 years can be ₹8–12 Lakh vs LAP.', winner: 'a' },
      { title: 'Need ₹15 Lakh for medical expenses, own a commercial property', description: 'LAP wins — personal loan at 18% costs ₹2.7L/year in interest on ₹15L. LAP at 12% costs ₹1.8L/year — saving ₹90,000 annually. Commercial property is accepted as LAP collateral.', winner: 'b' },
    ],
    faqs: [
      { q: 'Can I take a LAP on a property that already has a home loan?', a: 'Yes — this is possible but complex. You can take a second mortgage (LAP) on a property that already has a first mortgage (home loan), provided the lender agrees and the combined LTV does not exceed 60–70% of property value. The LAP lender will be in "second charge" position — they get paid after the first lender in case of default. This second-charge LAP is available at slightly higher rates (12–16% vs 10–13% for first-charge LAP). Some banks offer an "equity release" top-up on existing home loans instead, which is cheaper.' },
      { q: 'Is rental income from a commercial property considered for LAP eligibility?', a: 'Yes — rental income from commercial or residential properties is accepted as income proof for LAP eligibility. Provide: rent agreement, 12 months of bank statements showing rent credits, and TDS certificate (Form 16A) if TDS is deducted by the tenant. Rental income typically gets an 80–90% weightage (some lenders discount 10–20% for vacancy risk). This makes LAP particularly attractive for landlords with multiple properties — you can unlock the equity in one property using rental income from another as repayment proof.' },
      { q: 'What is the difference between LAP and mortgage loan?', a: '"Mortgage loan" and "Loan Against Property" are often used interchangeably in India, but there is a technical difference: LAP specifically refers to loans where the property is mortgaged as security for a new loan purpose. A mortgage loan can also refer to the original home loan. In practice, all home loans and LAPs in India use an Equitable Mortgage (deposit of title deeds) or Registered Mortgage as security. When a bank says "mortgage loan", they usually mean LAP. The key question is always: what is the purpose of the loan? Purpose determines rate and eligibility.' },
    ],
    relatedComparisons: ['sbi-bank-vs-nbfc-loan', 'personal-loan-vs-gold-loan', 'nbfc-vs-private-bank-loan'],
  },

  // ─── 4. NBFC vs Private Bank Loan ─────────────────────────────────────────
  {
    slug: 'nbfc-vs-private-bank-loan',
    title: 'NBFC vs Private Bank Loan India 2025 — HDFC, ICICI or Biddaro?',
    metaTitle: 'NBFC vs Private Bank Loan India 2025 — HDFC vs ICICI vs NBFC Comparison | Biddaro',
    metaDescription: 'NBFC vs private bank loan comparison India 2025. HDFC, ICICI vs NBFCs — interest rates, approval speed, eligibility, who should choose what.',
    intro: 'Private banks like HDFC and ICICI occupy the middle ground between government banks (cheapest, strictest) and NBFCs (most flexible, slightly costlier). This comparison helps you decide between the three tiers based on your exact profile — salary, CIBIL, employment type, and urgency.',
    labelA: 'Private Bank (HDFC/ICICI/Axis)',
    labelB: 'NBFC (via Biddaro)',
    summaryA: 'Technology-driven private banks — good rates, faster than SBI, stricter than NBFCs.',
    summaryB: 'Specialised non-banking lenders — highest approval rate, fastest processing, flexible criteria.',
    verdictTitle: 'Which Tier Fits Your Profile?',
    verdict: 'Private banks are ideal for: salaried professionals in MNCs or large companies, CIBIL 720+, ready-possession properties, loan amounts ₹15–75 Lakh. NBFCs via Biddaro are ideal for: self-employed, CIBIL 650–720, under-construction or smaller-city properties, loan amounts under ₹15 Lakh or above ₹1 Crore (where banks get conservative), or when you need approval in 5 days not 2 weeks.',
    ctaText: 'Check Eligibility — NBFC Network',
    ctaLink: '/loan-apply',
    tags: ['nbfc vs private bank loan india', 'hdfc vs nbfc home loan', 'icici vs nbfc loan 2025'],
    monthlySearches: 6500,
    rows: [
      { label: 'Interest Rate',          a: '8.75%–11% p.a.',           b: '9%–14% p.a.',              winner: 'a', note: 'Private banks are 0.5–2% lower than most NBFCs.' },
      { label: 'CIBIL Minimum',          a: '720+',                      b: '650+',                     winner: 'b', note: 'NBFCs accept 70 points lower CIBIL score on average.' },
      { label: 'Approval Speed',         a: '1–2 weeks',                 b: '5–7 working days',         winner: 'b', note: 'NBFCs have dedicated fast-track pipelines.' },
      { label: 'Self-Employed Friendly', a: 'Moderate — 3-yr ITR needed', b: 'High — 2-yr ITR accepted', winner: 'b', note: 'NBFCs have specialised self-employed underwriting.' },
      { label: 'Employer Category',      a: 'Listed companies preferred', b: 'Any stable income',        winner: 'b', note: 'Small business owner or partner in firm — NBFC is more accepting.' },
      { label: 'Under-Construction',     a: 'RERA-approved builders only', b: 'Wider acceptance',        winner: 'b', note: 'Private banks restrict to known builder projects.' },
      { label: 'Digital Process',        a: 'Strong — most banks fully digital', b: 'Strong',           winner: 'tie', note: 'Both offer end-to-end digital processing.' },
      { label: 'Relationship Benefits',  a: 'Rate discount for existing customers', b: 'Limited',       winner: 'a', note: 'HDFC/ICICI salary account holders get rate discounts.' },
      { label: 'Smaller Cities/Towns',   a: 'Limited reach — mostly Tier 1', b: 'Pan-India via partners', winner: 'b', note: 'NBFCs serve Tier 2/3 cities where private banks have few branches.' },
      { label: 'Complaints Resolution',  a: 'RBI Banking Ombudsman',     b: 'RBI Banking Ombudsman',    winner: 'tie', note: 'Both regulated by RBI — same borrower protection.' },
    ],
    scenarios: [
      { title: 'MNC employee with CIBIL 750, buying HDFC-approved builder flat', description: 'Private bank (HDFC) wins — you qualify for the best rates, the builder is pre-approved, and HDFC\'s own loan book means faster valuation.', winner: 'a' },
      { title: 'Chartered Accountant, own practice, CIBIL 710', description: 'NBFC via Biddaro wins — private banks will scrutinise your self-employment income aggressively. An NBFC experienced in CA/professional profiles will process faster and approve at competitive rates.', winner: 'b' },
      { title: 'Construction loan for custom home in Tier 2 city', description: 'NBFC wins — private banks have limited presence in Tier 2 cities and rarely finance self-construction projects. NBFCs in Biddaro\'s network specifically target this segment.', winner: 'b' },
      { title: 'Balance transfer from 12% NBFC to lower rate', description: 'Private bank wins — after 12 months of good repayment, transfer to HDFC or ICICI at 9–10%. Save ₹2,000–₹5,000/month on a ₹20–40L outstanding loan.', winner: 'a' },
    ],
    faqs: [
      { q: 'Can I negotiate interest rate with a private bank?', a: 'Yes — private bank rates are more negotiable than government bank rates (which are standardised). Negotiation leverage: CIBIL score above 775, existing salary account relationship (5+ years), loan amount above ₹50 Lakh, competitor rate offer in writing. Bring a printed competitor rate sheet from another bank — HDFC relationship managers have a 0.15–0.25% discount authority. Aggregators like Biddaro negotiate rates in bulk, often extracting better deals than individual applicants can get.' },
      { q: 'Do NBFCs charge higher prepayment penalties than banks?', a: 'For floating rate loans, RBI prohibits prepayment charges for both banks and NBFCs — so the answer is no, there is no penalty for either. For fixed rate loans, NBFCs may charge 2–4% foreclosure penalty, similar to private banks. Always confirm whether your loan is floating or fixed at the time of application. Most home loans and construction loans in India are floating rate.' },
      { q: 'Is NBFC loan approval guaranteed with Biddaro?', a: 'No lender guarantees approval — that would violate RBI guidelines. What Biddaro does: we assess your profile upfront (income, CIBIL, property type, location) and match you to lenders with the highest approval probability for your specific profile. This pre-matching means most Biddaro applicants get an in-principle approval, unlike cold applications to random banks that may reject without explanation. If your profile has issues, we tell you upfront what to fix before applying.' },
    ],
    relatedComparisons: ['sbi-bank-vs-nbfc-loan', 'home-loan-vs-lap', 'personal-loan-vs-gold-loan'],
  },

  // ─── 5. Renovation Loan vs Personal Loan ──────────────────────────────────
  {
    slug: 'renovation-loan-vs-personal-loan',
    title: 'Renovation Loan vs Personal Loan for Home Improvement India 2025',
    metaTitle: 'Renovation Loan vs Personal Loan India 2025 — Which is Cheaper for Home Improvement? | Biddaro',
    metaDescription: 'Renovation loan vs personal loan for home improvement India 2025. Interest rate comparison, maximum amount, eligibility, which to choose for ₹5L–₹30L renovation.',
    intro: 'Planning a home renovation in India? You have two main financing options — a dedicated renovation loan (secured against your property) or an unsecured personal loan. The difference in total interest cost on a ₹15 Lakh renovation over 5 years can be ₹3–5 Lakh. Here is the complete comparison.',
    labelA: 'Renovation Loan',
    labelB: 'Personal Loan',
    summaryA: 'Secured loan specifically for home improvement — lower rate, higher amount, needs property.',
    summaryB: 'Unsecured loan for any purpose — higher rate, faster approval, no property required.',
    verdictTitle: 'The Numbers Don\'t Lie',
    verdict: 'If you own the property being renovated and need more than ₹3 Lakh, a renovation loan is almost always the better choice. The rate difference (9.5% vs 14–18%) on ₹10 Lakh over 5 years means ₹1.7–2.5 Lakh less in total interest. The only reasons to choose a personal loan for renovation: you don\'t own the property (you are a tenant), you need the money in 24 hours, the renovation cost is under ₹2 Lakh (processing overhead may not justify a renovation loan), or your property has a heavy existing mortgage.',
    ctaText: 'Apply for Renovation Loan — ₹100/month',
    ctaLink: '/loan-apply',
    tags: ['renovation loan vs personal loan india', 'home improvement loan india', 'personal loan for renovation india 2025'],
    monthlySearches: 7500,
    rows: [
      { label: 'Interest Rate',          a: '9.5%–12% p.a.',             b: '14%–24% p.a.',             winner: 'a', note: 'Renovation loan is 4–12% cheaper. Massive difference over 5 years.' },
      { label: 'Maximum Amount',         a: 'Up to ₹75 Lakh',           b: 'Up to ₹15–40 Lakh',        winner: 'a', note: 'For large renovations, only a renovation loan covers it.' },
      { label: 'Tenure',                 a: 'Up to 10 years',            b: '1–5 years',                winner: 'a', note: 'Longer renovation loan tenure = lower monthly EMI.' },
      { label: 'Processing Time',        a: '7–15 working days',         b: '1–3 working days',         winner: 'b', note: 'Personal loan is faster — no property verification needed.' },
      { label: 'CIBIL Requirement',      a: '650+',                      b: '700+',                     winner: 'a', note: 'Renovation loan\'s property security relaxes CIBIL need.' },
      { label: 'Property Ownership',     a: 'Required',                  b: 'Not required',             winner: 'b', note: 'Tenants must use personal loan — cannot pledge rented property.' },
      { label: 'Tax Benefits',           a: 'Section 24(b) up to ₹30,000/yr', b: 'None',               winner: 'a', note: 'Renovation loan interest deductible if for let-out property.' },
      { label: 'Income Proof',           a: 'Required',                  b: 'Required',                 winner: 'tie', note: 'Both require income documentation.' },
      { label: 'Documents',              a: 'KYC + income + property papers', b: 'KYC + income only',  winner: 'b', note: 'Personal loan has lighter document burden.' },
      { label: 'EMI on ₹10L / 5 yr',    a: '₹21,248/month @ 9.5%',     b: '₹23,268/month @ 14%',     winner: 'a', note: 'Renovation loan saves ₹2,020/month — ₹1.21L over 5 years.' },
    ],
    scenarios: [
      { title: 'Renovating your own apartment — ₹8 Lakh budget', description: 'Renovation loan wins — at 9.5% vs 16% personal loan over 5 years, you save ₹1.5 Lakh in interest. Apply via Biddaro\'s renovation loan at biddaro.com/loans/renovation.', winner: 'a' },
      { title: 'Renting and renovating your rented flat (tenant)', description: 'Personal loan is the only option — you don\'t own the property, so there is nothing to pledge. A personal loan at 14–18% is your route. Keep the renovation budget under ₹3 Lakh to keep EMI manageable.', winner: 'b' },
      { title: 'Urgent kitchen renovation before wedding — ₹3 Lakh in 2 days', description: 'Personal loan wins on speed — same-day approval and disbursement available from digital lenders. A renovation loan takes 7–15 days for property verification.', winner: 'b' },
      { title: 'Full home renovation — ₹25 Lakh over 3 floors', description: 'Renovation loan wins decisively — personal loan for ₹25 Lakh is barely available, and at 18% over 5 years the total interest = ₹13.2 Lakh. Renovation loan at 9.5% = ₹6.8 Lakh total interest. Saving: ₹6.4 Lakh.', winner: 'a' },
    ],
    faqs: [
      { q: 'Can I use a renovation loan without submitting renovation bills?', a: 'Yes — most renovation loan lenders in India disburse the full sanctioned amount upfront without requiring invoices or bills for the renovation work. The property itself is the security. However, some lenders (particularly banks) may ask for quotes from contractors before sanctioning. NBFCs are generally more relaxed — Biddaro\'s renovation loan network typically disburses without requiring upfront bills. Post-disbursement, keep invoices safely — they are useful for income tax purposes if you claim Section 24(b) deduction.' },
      { q: 'What renovations qualify for a renovation loan?', a: 'Renovation loans in India cover a wide range of home improvement work: structural work (additional floors, wall modifications), interior work (flooring, false ceiling, modular kitchen, wardrobes), exterior work (facade, compound wall, gate), plumbing and electrical upgrades, bathroom and kitchen remodelling, solar panel installation, and waterproofing. Luxury items like swimming pools may need to be justified. Commercial renovations (shop, office) fall under business loan, not renovation loan. The loan purpose should be declared on the application form.' },
      { q: 'What is the difference between a renovation loan and a top-up home loan?', a: 'A top-up home loan is an additional loan given by your existing home loan lender on the same property — it can be used for renovation. It is typically at the same rate as your existing home loan (8.5–10%) and processes faster (1–2 weeks vs 2–3 weeks for fresh renovation loan). If you already have a home loan, always check top-up eligibility first — it is often the cheapest renovation financing option. If you don\'t have an existing home loan, apply for a fresh renovation loan through Biddaro.' },
      { q: 'How much renovation loan can I get on a ₹40 Lakh property?', a: 'For a ₹40 Lakh residential property, renovation loan eligibility: at 75% LTV = ₹30 Lakh maximum combined (including any existing home loan). If you already have a ₹20 Lakh home loan outstanding, you can get up to ₹10 Lakh in renovation loan (₹30L LTV cap minus ₹20L existing). If no existing loan, maximum renovation loan ≈ ₹25–30 Lakh (75–80% LTV). The actual amount also depends on your income and repayment capacity.' },
    ],
    relatedComparisons: ['sbi-bank-vs-nbfc-loan', 'personal-loan-vs-gold-loan', 'home-loan-vs-lap'],
  },
];

export function getLoanComparison(slug: string): LoanComparison | undefined {
  return LOAN_COMPARISONS.find(c => c.slug === slug);
}
