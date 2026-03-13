// AI Use-Case Landing Pages Data
// Each use case maps to /ai/[slug] — hybrid SEO + embedded chat page

export interface AiUseCase {
  slug: string;
  title: string;              // H1 heading
  metaTitle: string;          // <title> tag
  metaDescription: string;    // meta description (155 chars max)
  heroSubtitle: string;       // hero section subtitle
  keywords: string[];         // for JSON-LD + meta keywords
  searchVolume: number;       // approx monthly searches (reference only)
  features: Array<{
    icon: string;             // emoji icon
    title: string;
    description: string;
  }>;
  sampleQAs: Array<{
    question: string;
    answer: string;
  }>;
  suggestedPrompts: string[];  // MiniChat clickable starters
  systemPrompt: string;        // MiniChat context injected as hidden first message
  greeting: string;            // MiniChat opening message shown in UI
  relatedSlugs: string[];      // links to other use cases
}

export const AI_USE_CASES: AiUseCase[] = [
  // ─── 1. Construction Cost Estimator ──────────────────────────────────────────
  {
    slug: 'construction-cost-estimator',
    title: 'Construction Cost Estimator India',
    metaTitle: 'Free Construction Cost Estimator India | AI-Powered Estimates',
    metaDescription:
      'Get instant AI-powered construction cost estimates for your project in India. Accurate cost per sqft, material costs, and labour rates — city-wise breakdown.',
    heroSubtitle:
      'Get instant, city-specific construction cost estimates powered by AI — covering materials, labour, and finishing for any project size.',
    keywords: [
      'construction cost estimator india',
      'house construction cost calculator',
      'building cost per sqft india',
      'construction estimate online',
      'home building cost india 2025',
    ],
    searchVolume: 33100,
    features: [
      {
        icon: '📊',
        title: 'City-Wise Cost Breakdown',
        description:
          'Get accurate cost estimates tailored to your city — Mumbai, Delhi, Bangalore, Chennai, and 26 more tier-1 and tier-2 cities.',
      },
      {
        icon: '🏗️',
        title: 'Material & Labour Rates',
        description:
          'Detailed breakdown of cement, steel, bricks, sand, and skilled labour rates at current 2025 market prices.',
      },
      {
        icon: '⚡',
        title: 'Instant Estimates',
        description:
          'No forms, no waiting. Type your project details and get a comprehensive cost estimate in seconds.',
      },
    ],
    sampleQAs: [
      {
        question: 'What is the construction cost per sqft in Bangalore in 2025?',
        answer:
          'In Bangalore, construction cost ranges from ₹1,800–₂,200/sqft for basic construction, ₹2,200–₂,800/sqft for standard quality, and ₹2,800–₄,000/sqft for premium finishes. A 1,000 sqft house typically costs ₹22–40 lakh depending on specifications.',
      },
      {
        question: 'How much does it cost to build a 30x40 house in India?',
        answer:
          'A 30×40 plot (1,200 sqft) typically costs ₹25–50 lakh to build in most Indian cities. In metros like Mumbai or Delhi, expect ₹40–70 lakh. This includes structure, basic plumbing, electrical, and standard finishes.',
      },
      {
        question: 'What factors affect construction cost the most?',
        answer:
          'The main factors are: (1) Location/city — labour and material transport costs vary widely, (2) Floor count — each additional floor adds 15–20% to foundation and structural costs, (3) Finish quality — basic vs premium finishes can double the cost, (4) Soil condition — poor soil needs expensive foundation work.',
      },
      {
        question: 'Is it cheaper to build or buy a house in India?',
        answer:
          'Building is typically 20–30% cheaper than buying a ready property in the same area, especially in tier-2 cities. However, building involves more time (12–18 months), contractor management, and risk of cost overruns. The savings are real but require active involvement.',
      },
    ],
    suggestedPrompts: [
      'Estimate cost for 1000 sqft house in Pune',
      'Cost breakdown for 2BHK apartment construction',
      'Labour rates for construction in Chennai',
      'Compare construction costs: Bangalore vs Hyderabad',
    ],
    systemPrompt:
      'You are a construction cost expert for India. Provide accurate, city-specific cost estimates for construction projects. Always mention cost per sqft ranges, total project estimates, and key cost drivers. Use current 2025 market rates. Format numbers in Indian system (lakhs/crores). Be specific and practical.',
    greeting:
      'Hi! I can estimate construction costs for any project in India — just tell me the city, size, and type of construction.',
    relatedSlugs: [
      'material-calculator',
      'budget-planner',
      'renovation-planner',
    ],
  },

  // ─── 2. Renovation Planner ────────────────────────────────────────────────────
  {
    slug: 'renovation-planner',
    title: 'Home Renovation Planner India',
    metaTitle: 'Free Home Renovation Planner | AI Cost & Timeline Estimates India',
    metaDescription:
      'Plan your home renovation with AI. Get room-by-room cost estimates, timelines, and contractor tips specific to India. Kitchen, bathroom, full home reno.',
    heroSubtitle:
      'Plan every room, every rupee. AI-powered renovation planning with cost estimates, timelines, and contractor tips for Indian homes.',
    keywords: [
      'home renovation planner india',
      'house renovation cost india',
      'interior renovation estimate',
      'kitchen renovation cost india',
      'bathroom renovation india',
    ],
    searchVolume: 22000,
    features: [
      {
        icon: '🏠',
        title: 'Room-by-Room Planning',
        description:
          'Get detailed renovation plans for kitchen, bathroom, living room, bedroom, and more — with itemized cost breakdowns.',
      },
      {
        icon: '📅',
        title: 'Realistic Timelines',
        description:
          'Understand how long your renovation will take, what work runs in parallel, and how to avoid common scheduling delays.',
      },
      {
        icon: '💰',
        title: 'Budget Optimization',
        description:
          'Identify where to splurge and where to save — prioritize high-impact upgrades that fit your budget.',
      },
    ],
    sampleQAs: [
      {
        question: 'How much does a full home renovation cost in India?',
        answer:
          'Full home renovation costs ₹500–₹1,500 per sqft depending on scope. A 1,000 sqft flat typically costs ₹5–15 lakh for standard renovation (painting, flooring, kitchen, bathroom), and ₹15–30 lakh for premium renovation with modular kitchen and designer bathrooms.',
      },
      {
        question: 'How long does home renovation take in India?',
        answer:
          'A typical 1,000–1,500 sqft home renovation takes 45–90 days. Kitchen alone: 3–4 weeks. Full bathroom: 2–3 weeks. Painting: 1 week per floor. Delays for material delivery and contractor availability are common — budget an extra 2–3 weeks.',
      },
      {
        question: 'Should I renovate before or after moving in?',
        answer:
          'Renovating before moving in is strongly recommended. You avoid living in dust and noise, contractors work faster without occupants, and you can do structural changes (plumbing, electrical) without disruption. If budget is tight, prioritize kitchen and bathrooms first as they add the most value.',
      },
    ],
    suggestedPrompts: [
      'Plan kitchen renovation for 150 sqft kitchen',
      'Bathroom renovation cost for 2 bathrooms',
      'Timeline for renovating a 3BHK flat',
      'Budget-friendly renovation ideas for old house',
    ],
    systemPrompt:
      'You are a home renovation expert for India. Help users plan renovations with accurate cost estimates, timelines, and practical advice. Cover kitchen, bathroom, flooring, painting, electrical, and plumbing. Use 2025 Indian market rates. Be specific about labor and material costs.',
    greeting:
      'Ready to plan your renovation! Tell me which rooms you want to renovate and I\'ll create a cost and timeline estimate.',
    relatedSlugs: [
      'construction-cost-estimator',
      'material-calculator',
      'contractor-finder',
    ],
  },

  // ─── 3. Contractor Finder ─────────────────────────────────────────────────────
  {
    slug: 'contractor-finder',
    title: 'Find Trusted Contractors in India',
    metaTitle: 'How to Find & Hire Trusted Contractors in India | AI Guide',
    metaDescription:
      'Learn how to find, verify, and hire trusted contractors in India. AI guidance on red flags, fair rates, contract terms, and avoiding contractor fraud.',
    heroSubtitle:
      'Know exactly what to ask, what to pay, and what to watch out for when hiring contractors for your home project in India.',
    keywords: [
      'find trusted contractor india',
      'how to hire contractor india',
      'construction contractor verification',
      'contractor rates india',
      'avoid contractor fraud india',
    ],
    searchVolume: 18500,
    features: [
      {
        icon: '🔍',
        title: 'Verification Checklist',
        description:
          'Know exactly what documents to check — GST registration, past work references, workforce capacity, and license verification.',
      },
      {
        icon: '⚠️',
        title: 'Red Flag Detection',
        description:
          'Identify warning signs before signing: abnormally low quotes, no written contract, upfront payment demands, and more.',
      },
      {
        icon: '📋',
        title: 'Contract Essentials',
        description:
          'Understand what must be in your contract — payment milestones, material specifications, penalty clauses, and completion timelines.',
      },
    ],
    sampleQAs: [
      {
        question: 'How do I verify a contractor before hiring in India?',
        answer:
          'Check: (1) GST registration certificate, (2) At least 3 completed project references with site visits, (3) Workforce size and subcontractor arrangements, (4) Bank account in business name (not personal), (5) Written agreement with detailed specs. Avoid contractors who rush you or demand >30% upfront.',
      },
      {
        question: 'What is a fair contractor rate per sqft in India?',
        answer:
          'Labour-only rates: ₹400–600/sqft for structure, ₹150–250/sqft for tiling, ₹80–120/sqft for painting. Full project (labour + materials) varies by city: tier-2 cities ₹1,800–2,500/sqft, metros ₹2,500–4,000/sqft. Get at least 3 quotes.',
      },
      {
        question: 'What payment schedule should I use for contractors?',
        answer:
          'Standard milestone-based schedule: 20% advance on signing, 30% at foundation/plinth completion, 25% at roof/slab, 20% at finishing stage, 5% retention after 3 months post-completion. Never pay more than 30% before work begins.',
      },
    ],
    suggestedPrompts: [
      'What documents to check before hiring contractor?',
      'Fair payment schedule for construction project',
      'Red flags when getting contractor quotes',
      'Contract clauses I must include for home construction',
    ],
    systemPrompt:
      'You are a construction industry expert in India helping homeowners hire trusted contractors. Provide practical advice on contractor verification, fair rates, contract terms, and avoiding common scams. Be specific about documentation and legal protections available to homeowners.',
    greeting:
      'I can help you find and vet contractors safely. What type of project are you hiring for?',
    relatedSlugs: [
      'construction-cost-estimator',
      'budget-planner',
      'permits-guide-india',
    ],
  },

  // ─── 4. Material Calculator ───────────────────────────────────────────────────
  {
    slug: 'material-calculator',
    title: 'Building Material Calculator India',
    metaTitle: 'Building Material Calculator India | Cement, Steel, Bricks Estimator',
    metaDescription:
      'Calculate exact quantities of cement, steel, bricks, sand, and tiles for your construction project. AI-powered material estimator with 2025 prices.',
    heroSubtitle:
      'Calculate exact quantities of cement, steel, bricks, tiles, and sand — with current 2025 prices and where to buy them.',
    keywords: [
      'building material calculator india',
      'cement quantity calculator',
      'steel requirement for construction',
      'bricks calculator india',
      'construction material estimate',
    ],
    searchVolume: 14400,
    features: [
      {
        icon: '🧱',
        title: 'Quantity Estimation',
        description:
          'Get exact quantities for any structure — how many bags of cement, kg of steel, number of bricks for your specific dimensions.',
      },
      {
        icon: '💲',
        title: 'Current Market Prices',
        description:
          'Material cost estimates at 2025 market rates — with guidance on seasonal price variations and bulk purchase discounts.',
      },
      {
        icon: '🔄',
        title: 'Material Comparison',
        description:
          'Compare AAC blocks vs red bricks, TMT steel grades, cement brands — with cost, quality, and durability trade-offs.',
      },
    ],
    sampleQAs: [
      {
        question: 'How much cement is needed for a 1000 sqft slab?',
        answer:
          'For a 1,000 sqft RCC slab (4.5 inch thick), you need approximately 180–200 bags of cement (50 kg each), 4–5 MT of steel, and 400–450 cft of sand. Total slab cost: ₹1.5–2.5 lakh for materials plus ₹60–80K labour.',
      },
      {
        question: 'How many bricks are needed for 1000 sqft construction?',
        answer:
          'For a 1,000 sqft ground floor with 9-inch brick walls (standard), you need approximately 15,000–18,000 bricks. For 4.5-inch partition walls, estimate 8,000–10,000 bricks. Current price: ₹7–12 per brick depending on quality and city.',
      },
      {
        question: 'What is the current price of TMT steel in India?',
        answer:
          'TMT steel (Fe500 grade) prices in 2025: ₹55,000–65,000 per MT in most cities. For a 1,000 sqft house you need 4–6 MT of steel (total: ₹2.5–4 lakh). Prefer TATA, JSW, or SAIL for structural steel — avoid unknown brands.',
      },
    ],
    suggestedPrompts: [
      'Cement and steel needed for 1200 sqft house',
      'Tile quantity for 500 sqft flooring',
      'AAC blocks vs red bricks: which is better?',
      'Current cement prices in Hyderabad',
    ],
    systemPrompt:
      'You are a construction materials expert for India. Help users calculate exact material quantities (cement, steel, bricks, tiles, sand, aggregate) with current 2025 market prices. Provide specific formulas, wastage percentages (10–15% standard), and brand recommendations. Use metric units and Indian pricing.',
    greeting:
      'Tell me what you\'re building — dimensions and structure type — and I\'ll calculate exact material quantities and costs.',
    relatedSlugs: [
      'construction-cost-estimator',
      'renovation-planner',
      'budget-planner',
    ],
  },

  // ─── 5. Vastu Consultant ──────────────────────────────────────────────────────
  {
    slug: 'vastu-consultant',
    title: 'Free Vastu Consultant Online India',
    metaTitle: 'Free Vastu Consultant Online | AI Vastu Shastra for Home & Office',
    metaDescription:
      'Get free Vastu Shastra guidance for your home or office layout. AI-powered Vastu advice for main door, kitchen, bedroom, bathroom placement — based on direction.',
    heroSubtitle:
      'Get authentic Vastu Shastra guidance for your home layout — main door direction, kitchen placement, bedroom orientation, and more.',
    keywords: [
      'free vastu consultant online',
      'vastu shastra for home',
      'vastu for new house',
      'vastu tips bedroom',
      'vastu for kitchen direction',
    ],
    searchVolume: 27000,
    features: [
      {
        icon: '🧭',
        title: 'Direction-Based Guidance',
        description:
          'Get room-by-room Vastu recommendations based on compass directions — North, South, East, West placements explained clearly.',
      },
      {
        icon: '🏡',
        title: 'All Rooms Covered',
        description:
          'Kitchen, master bedroom, pooja room, bathroom, main door, study room, staircase — complete Vastu analysis for every room.',
      },
      {
        icon: '✅',
        title: 'Practical Remedies',
        description:
          'If your existing home has Vastu defects, get practical remedies — mirrors, colors, plants, and rearrangements — without breaking walls.',
      },
    ],
    sampleQAs: [
      {
        question: 'Which direction should the main door face for Vastu?',
        answer:
          'Best directions for main door: North (wealth and career), East (health and prosperity), and Northeast (wisdom and positive energy). Avoid South and Southwest facing main doors as they are considered inauspicious. If your plot has a South-facing door, use Vastu remedies like placing a nameplate with the owner\'s name and keeping the entrance well-lit.',
      },
      {
        question: 'What is the best direction for the kitchen in Vastu?',
        answer:
          'The ideal kitchen direction is Southeast (Agneya corner) — ruled by fire element. Northwest (Vayavya) is second best. Cook facing East. Avoid kitchen in Northeast, Southwest, or Center of the house. Keep the sink (water) away from the stove (fire) — ideally on opposite walls.',
      },
      {
        question: 'Which direction should the master bedroom be in Vastu?',
        answer:
          'Master bedroom should ideally be in Southwest — this direction provides stability and restful sleep. Sleep with head towards South or East. Avoid sleeping with head towards North. Keep mirrors away from direct line of sight of the bed. Avoid beams directly above the bed.',
      },
      {
        question: 'Is it okay to have a bathroom in the Northeast direction?',
        answer:
          'Northeast (Ishaan corner) is considered sacred and should ideally be reserved for a prayer room or kept open. A bathroom in Northeast is considered inauspicious in Vastu. If unavoidable, remedies include: keeping it extremely clean, using light colors, placing sea salt bowls, and avoiding any overhead water tank in this zone.',
      },
    ],
    suggestedPrompts: [
      'Vastu tips for South-facing house',
      'Best direction for pooja room',
      'Vastu remedies for irregular plot shape',
      'Kitchen Vastu — stove and sink placement',
    ],
    systemPrompt:
      'You are an expert Vastu Shastra consultant. Provide authentic, practical Vastu guidance based on traditional principles. Cover all rooms, directions, colors, and materials. Also provide remedies for existing Vastu defects. Be respectful of the tradition while being practical — suggest cost-effective remedies when walls cannot be moved.',
    greeting:
      'Namaste! Share your home\'s direction (main door facing which way?) and I\'ll give you Vastu guidance for each room.',
    relatedSlugs: [
      'house-plan-advisor',
      'renovation-planner',
      'construction-cost-estimator',
    ],
  },

  // ─── 6. House Plan Advisor ────────────────────────────────────────────────────
  {
    slug: 'house-plan-advisor',
    title: 'AI House Plan Advisor India',
    metaTitle: 'House Plan Advisor India | AI Guidance for Floor Plans & Layouts',
    metaDescription:
      'Get expert AI guidance on house plans and floor layouts for Indian homes. 2BHK, 3BHK, duplex, villas — plot size to room dimensions, Vastu-compliant.',
    heroSubtitle:
      'Get expert guidance on floor plan layouts, room dimensions, and design best practices for any plot size in India.',
    keywords: [
      'house plan advisor india',
      'floor plan design india',
      '2bhk house plan 30x40',
      'house plan for 1000 sqft',
      'duplex house plan india',
    ],
    searchVolume: 12000,
    features: [
      {
        icon: '📐',
        title: 'Plot-to-Plan Guidance',
        description:
          'Get recommended layouts for any plot size — 20×30, 30×40, 40×60, or irregular plots. Maximize usable area within setback rules.',
      },
      {
        icon: '🏢',
        title: 'All Home Types',
        description:
          'Independent house, apartment, duplex, villa, row house — get layout guidance and room dimension recommendations for any type.',
      },
      {
        icon: '📏',
        title: 'Standard Dimensions',
        description:
          'Room minimum sizes, door widths, staircase requirements, parking dimensions — based on NBC India and local bye-laws.',
      },
    ],
    sampleQAs: [
      {
        question: 'What is the best floor plan for a 30x40 plot in India?',
        answer:
          'For a 30×40 (1,200 sqft) plot, a typical layout uses 60–70% coverage (720–840 sqft built-up) after setbacks. Recommended: 2BHK with living room (12×14), 2 bedrooms (10×12 each), kitchen (8×10), 2 bathrooms, and utility area. Can add a small puja room (5×6) or study alcove. Ground + first floor gives 3BHK+.',
      },
      {
        question: 'What is the minimum room size for a bedroom in India?',
        answer:
          'Per NBC India guidelines: Master bedroom minimum 9.5 sqm (10×10 ft approx), other bedrooms 7.5 sqm (8×9 ft). Living room minimum 9.5 sqm. Kitchen minimum 4.5 sqm. In practice, 10×12 for bedrooms and 14×16 for living rooms are comfortable. Avoid bedrooms under 9×10 ft.',
      },
      {
        question: 'How many floors can I build on my residential plot?',
        answer:
          'Floor count depends on FAR/FSI (Floor Area Ratio) allowed by your local authority. Typical FSI: 1.5–2.0 in most cities (Mumbai FSI can reach 3.0+). Also check: height restrictions (typically G+3 for residential without NOC), setback requirements (varies 1–3 meters by plot size), and local bye-laws. Always check with your municipal corporation.',
      },
    ],
    suggestedPrompts: [
      'Best layout for 30x50 plot ground + first floor',
      'Minimum room sizes for 2BHK in India',
      'How to plan duplex house on 40x60 plot',
      'Vastu-compliant 3BHK floor plan north facing',
    ],
    systemPrompt:
      'You are an architect and house plan advisor specializing in Indian residential construction. Help users plan floor layouts, understand NBC guidelines, setback rules, FSI/FAR limits, and room dimensions. Provide practical layout suggestions for common Indian plot sizes (20×30 to 60×80). Consider Vastu when relevant.',
    greeting:
      'Tell me your plot dimensions and what you\'re planning to build — I\'ll suggest the best layout options.',
    relatedSlugs: [
      'vastu-consultant',
      'construction-cost-estimator',
      'permits-guide-india',
    ],
  },

  // ─── 7. Budget Planner ────────────────────────────────────────────────────────
  {
    slug: 'budget-planner',
    title: 'Home Construction Budget Planner India',
    metaTitle: 'Home Construction Budget Planner | AI Financial Planning for Building',
    metaDescription:
      'Plan your home construction budget with AI. Allocate funds across structure, finishes, interiors, and contingency. Avoid cost overruns in India.',
    heroSubtitle:
      'Build a realistic construction budget — phase by phase, rupee by rupee — so you never run out of funds halfway through.',
    keywords: [
      'home construction budget planner india',
      'construction budget allocation',
      'avoid cost overruns construction',
      'home building budget india',
      'construction finance planning',
    ],
    searchVolume: 9900,
    features: [
      {
        icon: '📊',
        title: 'Phase-wise Budget Allocation',
        description:
          'Break your budget into foundation, structure, roofing, finishing, electrical, plumbing, and interiors — with recommended percentages.',
      },
      {
        icon: '🎯',
        title: 'Contingency Planning',
        description:
          'Understand how much contingency to keep (typically 15–20%) and which phases have the highest cost overrun risk.',
      },
      {
        icon: '📈',
        title: 'Cost Overrun Prevention',
        description:
          'Learn the most common causes of budget overruns in Indian construction and strategies to avoid them.',
      },
    ],
    sampleQAs: [
      {
        question: 'How should I allocate my ₹50 lakh construction budget?',
        answer:
          'Recommended allocation for ₹50L house: Structure & Civil (40%) = ₹20L, Electrical & Plumbing (15%) = ₹7.5L, Flooring & Tiling (10%) = ₹5L, Doors & Windows (8%) = ₹4L, Kitchen (10%) = ₹5L, Painting (5%) = ₹2.5L, Interiors/Furnishing (7%) = ₹3.5L, Contingency (5%) = ₹2.5L. Keep the contingency strictly for emergencies.',
      },
      {
        question: 'What are the most common causes of construction cost overruns in India?',
        answer:
          'Top 5 causes: (1) Design changes mid-construction (adds 15–30%), (2) Underestimated soil/foundation issues, (3) Rising material prices during 12–18 month build period, (4) Contractor quality issues requiring rework, (5) Underquoted electrical and plumbing work. Prevention: Lock design before starting, get soil test, use milestone-based payments.',
      },
      {
        question: 'How much should I keep as contingency for home construction?',
        answer:
          'Keep 15–20% contingency for new construction, 20–25% for renovation (higher risk of hidden issues). Never treat contingency as available budget for upgrades. Common contingency uses: soil issues, rework, design change requests, material price hike. If unused after structure phase, you can allocate part of it to finish upgrades.',
      },
    ],
    suggestedPrompts: [
      'Budget plan for ₹40 lakh house construction',
      'How to avoid cost overruns in construction',
      'Contingency percentage for home renovation',
      'Phase-wise payment schedule for construction',
    ],
    systemPrompt:
      'You are a construction financial planning expert for India. Help users create realistic budgets for home construction and renovation. Cover phase-wise allocation, contingency planning, cost overrun prevention, and financing options. Use Indian currency (₹, lakhs). Be practical and help users make informed decisions.',
    greeting:
      'Let\'s build your construction budget! Tell me your total budget and project type — I\'ll break it down phase by phase.',
    relatedSlugs: [
      'construction-cost-estimator',
      'material-calculator',
      'contractor-finder',
    ],
  },

  // ─── 8. Permits Guide India ───────────────────────────────────────────────────
  {
    slug: 'permits-guide-india',
    title: 'Building Permits Guide India',
    metaTitle: 'Building Permits Guide India | Construction Approvals & NOC Process',
    metaDescription:
      'Complete guide to building permits and construction approvals in India. BDA, BBMP, HMDA, PCMC and other municipal approvals — documents, process, fees.',
    heroSubtitle:
      'Navigate India\'s building permit process without confusion — approvals, NOCs, documents, and timelines explained for every city.',
    keywords: [
      'building permits india',
      'construction approval process india',
      'building plan approval',
      'municipal corporation NOC',
      'BBMP building permit bangalore',
    ],
    searchVolume: 8100,
    features: [
      {
        icon: '📄',
        title: 'Document Checklist',
        description:
          'Complete list of documents needed — title deed, EC, property tax receipts, structural drawings, and municipality-specific requirements.',
      },
      {
        icon: '🏛️',
        title: 'City-Wise Process',
        description:
          'Step-by-step approval process for BBMP, BDA, GHMC, PCMC, HMDA, CMDA, and other municipal bodies across India.',
      },
      {
        icon: '⏱️',
        title: 'Timeline & Fees',
        description:
          'Realistic timelines for permit approval (30–120 days) and fee structures based on plot size, FSI, and building type.',
      },
    ],
    sampleQAs: [
      {
        question: 'What documents are needed for a building permit in India?',
        answer:
          'Core documents: (1) Title deed / sale deed, (2) Encumbrance Certificate (last 15 years), (3) Property tax paid receipt, (4) Survey sketch / layout plan, (5) Approved building plan (by licensed architect), (6) Structural drawing (licensed engineer), (7) Application form with fees, (8) ID proof and photograph. Additional requirements vary by municipality — check specific city requirements.',
      },
      {
        question: 'How long does building plan approval take in India?',
        answer:
          'Official timelines: BBMP Bangalore (30 days for residential), GHMC Hyderabad (21 days online), PCMC Pune (30 days), NMMC Navi Mumbai (30 days). Actual timelines are typically 60–120 days due to queries and revisions. Online approval through DIGI-INDIA and OBPS systems has improved speed in major cities.',
      },
      {
        question: 'Can I build without a building permit in India?',
        answer:
          'Building without permission is illegal and risky: (1) Property cannot be sold without Occupancy Certificate, (2) Banks won\'t finance unauthorized constructions, (3) Demolition notices can be issued, (4) Regularization fees/penalties can be 2–5× the normal fee. Small additions under 50 sqft in some states may be exempt — check local bye-laws. Always get proper approval.',
      },
      {
        question: 'What is an Occupancy Certificate and why do I need it?',
        answer:
          'Occupancy Certificate (OC) is issued by municipal authority after construction completion to certify the building is safe for occupation. You need OC to: get utility connections (water, electricity), register sale/transfer, get home loans, avoid demolition risk. Apply within 30 days of construction completion with Completion Certificate from architect.',
      },
    ],
    suggestedPrompts: [
      'Building permit process in Bangalore (BBMP)',
      'Documents needed for house construction approval',
      'How to regularize unauthorized construction',
      'What is Occupancy Certificate and how to get it',
    ],
    systemPrompt:
      'You are a construction permits and approvals expert in India. Help users understand building permit processes, documents required, municipal corporation requirements, and compliance. Be specific to cities (BBMP, GHMC, PCMC, NMMC, BDA, etc.). Explain consequences of non-compliance and practical steps to get approvals.',
    greeting:
      'I can guide you through the building permit process in India. Which city is your project in?',
    relatedSlugs: [
      'contractor-finder',
      'house-plan-advisor',
      'construction-cost-estimator',
    ],
  },
];

// Helper to get a use case by slug
export function getUseCase(slug: string): AiUseCase | undefined {
  return AI_USE_CASES.find((uc) => uc.slug === slug);
}

// All slugs for generateStaticParams
export const AI_USE_CASE_SLUGS = AI_USE_CASES.map((uc) => uc.slug);
