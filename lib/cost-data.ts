// ─── Construction Cost Guide Data for India ───────────────────────────────────
// Powers /cost/[service] and /cost/[service]/[city] pages
// Each entry targets high-intent "how much does X cost in India" keywords

export interface CostItem {
  label: string;
  low: string;
  high: string;
  unit: string;
}

export interface CostFAQ {
  q: string;
  a: string;
}

export interface CostServiceMeta {
  slug: string;
  name: string;
  emoji: string;
  headline: string;           // H1 on /cost/[service]
  metaDesc: string;           // Meta description template ({city} placeholder)
  intro: string;              // Intro paragraph ({city} placeholder)
  items: CostItem[];          // Cost breakdown table
  factors: string[];          // Factors affecting cost
  tips: string[];             // Money-saving tips
  faqs: CostFAQ[];
  avgLow: string;             // Average range low
  avgHigh: string;            // Average range high
  avgUnit: string;
  relatedSlugs: string[];
}

export const COST_SERVICES: CostServiceMeta[] = [
  {
    slug: 'general-construction',
    name: 'House Construction',
    emoji: '🏗️',
    headline: 'House Construction Cost in India 2026',
    metaDesc: 'Get accurate house construction costs in {city}. Compare rates per sq ft for RCC, steel, and budget construction from verified contractors on Biddaro.',
    intro: 'Building a house in {city} is one of the biggest investments you will ever make. Construction costs vary significantly based on materials, design complexity, and contractor rates in {city}.',
    avgLow: '₹1,500', avgHigh: '₹3,500', avgUnit: 'per sq ft',
    items: [
      { label: 'Budget Construction (Ground Floor)',   low: '₹1,500', high: '₹1,800', unit: 'per sq ft' },
      { label: 'Standard RCC Construction',           low: '₹1,800', high: '₹2,500', unit: 'per sq ft' },
      { label: 'Premium Construction',                low: '₹2,500', high: '₹3,500', unit: 'per sq ft' },
      { label: 'Luxury / Designer Construction',      low: '₹3,500', high: '₹6,000', unit: 'per sq ft' },
      { label: 'Foundation (RCC)',                    low: '₹180',   high: '₹350',   unit: 'per sq ft' },
      { label: 'Brickwork / Masonry',                 low: '₹60',    high: '₹120',   unit: 'per sq ft' },
      { label: 'Plastering',                          low: '₹25',    high: '₹50',    unit: 'per sq ft' },
      { label: 'Flooring (Vitrified Tiles)',          low: '₹80',    high: '₹200',   unit: 'per sq ft' },
    ],
    factors: [
      'Plot location and soil type in {city}',
      'Number of floors (G+1, G+2, etc.)',
      'Type of structure — load-bearing vs RCC frame',
      'Quality of materials (cement grade, steel brand)',
      'Contractor experience and local labour rates',
      'Government approval and permit costs in {city}',
      'Utilities connections — water, electricity, sewage',
    ],
    tips: [
      'Get at least 3 quotes from verified contractors on Biddaro',
      'Opt for locally sourced materials to cut transport costs',
      'Build during off-season (Dec–Feb) for 10–15% lower labour rates',
      'Avoid design changes after construction begins — they spike costs 20–30%',
      'Use AAC blocks instead of red bricks — lighter and faster to lay',
    ],
    faqs: [
      { q: 'What is the average cost to build a 1000 sq ft house in {city}?', a: 'A standard 1000 sq ft RCC house in {city} typically costs ₹18 lakh to ₹28 lakh depending on material quality and finishes. Budget construction starts at ₹15 lakh while premium builds go up to ₹40 lakh.' },
      { q: 'How much does it cost to build a G+1 house in {city}?', a: 'A G+1 house (2-floor) of 1500 sq ft in {city} typically costs ₹25–₹45 lakh for standard construction. The structural cost alone (foundation + columns + beams + slab) accounts for 40–50% of total cost.' },
      { q: 'Is it cheaper to hire a contractor or build on your own in {city}?', a: 'Hiring a contractor in {city} through a platform like Biddaro is typically 10–20% more efficient than self-managing labour. Contractors get bulk material discounts and their experience prevents costly mistakes.' },
      { q: 'How long does house construction take in {city}?', a: 'A standard 1000 sq ft house in {city} takes 6–12 months from foundation to handover. G+1 structures take 12–18 months. Premium builds with custom finishes can take 18–24 months.' },
    ],
    relatedSlugs: ['plumbing', 'electrical', 'painting', 'flooring'],
  },
  {
    slug: 'plumbing',
    name: 'Plumbing',
    emoji: '🔧',
    headline: 'Plumbing Cost & Rates in India 2026',
    metaDesc: 'Plumbing rates and cost guide for {city}. Find out how much plumbers charge per hour and for complete bathroom, kitchen and pipeline installation.',
    intro: 'Plumbing costs in {city} depend on the scope of work — from simple tap repairs to full building pipeline installation. Here\'s a detailed breakdown of plumber rates in {city}.',
    avgLow: '₹300', avgHigh: '₹1,500', avgUnit: 'per hour',
    items: [
      { label: 'Plumber Labour (per hour)',           low: '₹300',   high: '₹800',   unit: 'per hour' },
      { label: 'Bathroom Plumbing (complete)',        low: '₹8,000', high: '₹20,000', unit: 'per bathroom' },
      { label: 'Kitchen Plumbing (complete)',         low: '₹5,000', high: '₹15,000', unit: 'per kitchen' },
      { label: 'CPVC Pipe Installation',              low: '₹80',    high: '₹150',   unit: 'per running ft' },
      { label: 'uPVC Drainage Pipe',                 low: '₹60',    high: '₹120',   unit: 'per running ft' },
      { label: 'Water Tank Installation (1000 L)',    low: '₹3,500', high: '₹8,000', unit: 'per tank' },
      { label: 'Tap / Faucet Replacement',           low: '₹500',   high: '₹1,500', unit: 'per tap' },
      { label: 'Pipe Leakage Repair',                low: '₹500',   high: '₹3,000', unit: 'per job' },
    ],
    factors: [
      'Type of pipes (CPVC, uPVC, GI, PPR)',
      'Number of bathrooms and floors',
      'New installation vs repair / replacement',
      'Local plumber rates in {city}',
      'Accessibility of pipes (concealed vs exposed)',
      'Brand of fittings (Astral, Supreme, Finolex)',
    ],
    tips: [
      'Always use ISI-marked pipes for long-term durability',
      'Get itemised quotes to avoid hidden charges',
      'CPVC pipes outperform GI pipes — choose wisely',
      'Post your job on Biddaro and get competing bids from {city} plumbers',
    ],
    faqs: [
      { q: 'How much does a plumber charge per hour in {city}?', a: 'Plumbers in {city} typically charge ₹300–₹800 per hour. Emergency and night call-outs can cost ₹1,000–₹2,000 per hour. Getting quotes through Biddaro helps you compare rates.' },
      { q: 'What is the cost of bathroom plumbing for a new house in {city}?', a: 'Complete bathroom plumbing in {city} for a new house costs ₹8,000–₹20,000 per bathroom including pipes, fittings, and sanitary ware installation (not the fixtures themselves).' },
      { q: 'How much does it cost to fix a pipe leak in {city}?', a: 'Pipe leak repairs in {city} cost ₹500–₹3,000 depending on location and severity. Concealed leaks that require wall cutting cost more — ₹2,000–₹8,000 including patching.' },
      { q: 'How do I find a reliable plumber in {city}?', a: 'Post your plumbing job on Biddaro for free and receive bids from verified, reviewed plumbers in {city} within hours. All contractors are background-checked and rated by previous customers.' },
    ],
    relatedSlugs: ['general-construction', 'renovation', 'tile-stone'],
  },
  {
    slug: 'painting',
    name: 'Painting',
    emoji: '🎨',
    headline: 'House Painting Cost in India 2026',
    metaDesc: 'House painting rates and cost guide for {city}. Compare interior and exterior painting charges per sq ft from top painters in {city}.',
    intro: 'Painting costs in {city} vary based on wall area, paint quality, and number of coats. Whether it\'s interior emulsion or exterior weatherproof paint, here\'s what to expect.',
    avgLow: '₹12', avgHigh: '₹35', avgUnit: 'per sq ft',
    items: [
      { label: 'Interior Emulsion (2 coats)',         low: '₹12',    high: '₹22',    unit: 'per sq ft' },
      { label: 'Interior Luxury Emulsion',            low: '₹22',    high: '₹40',    unit: 'per sq ft' },
      { label: 'Exterior Apex / Weatherproof Paint',  low: '₹18',    high: '₹35',    unit: 'per sq ft' },
      { label: 'Texture / Design Painting',           low: '₹40',    high: '₹120',   unit: 'per sq ft' },
      { label: 'Wood Polish / Varnish',               low: '₹15',    high: '₹50',    unit: 'per sq ft' },
      { label: 'Primer (per coat)',                   low: '₹5',     high: '₹12',    unit: 'per sq ft' },
      { label: 'Putty Application',                   low: '₹10',    high: '₹20',    unit: 'per sq ft' },
      { label: 'Painter Labour (per day)',            low: '₹500',   high: '₹1,200', unit: 'per day' },
    ],
    factors: [
      'Paint brand (Asian Paints, Berger, Nerolac, Dulux)',
      'Number of coats applied',
      'Wall condition — new vs repainting',
      'Surface type — smooth vs textured',
      'Height of walls and scaffolding required',
      'Interior vs exterior exposure',
    ],
    tips: [
      'Always apply 1 coat primer + 2 coats paint for lasting finish',
      'Asian Paints Royale and Berger Silk are best value for money',
      'Repaint externally every 5 years in {city} climate',
      'Get per-sq-ft quotes — avoid per-day labour quotes (hard to control)',
    ],
    faqs: [
      { q: 'How much does it cost to paint a 2BHK flat in {city}?', a: 'Painting a 2BHK flat (approx 800–1000 sq ft of paintable area) in {city} with standard emulsion costs ₹15,000–₹30,000. Premium paints and texture work can cost ₹40,000–₹80,000.' },
      { q: 'What is the cost of exterior painting per sq ft in {city}?', a: 'Exterior painting in {city} costs ₹18–₹35 per sq ft including primer, putty, and 2 coats of weatherproof paint. A 1,500 sq ft exterior costs approximately ₹30,000–₹55,000.' },
      { q: 'How often should I repaint my house in {city}?', a: 'Interior walls should be repainted every 5–7 years. Exterior walls in {city} — especially with monsoon exposure — should be repainted every 3–5 years using weatherproof paint.' },
      { q: 'How do I get a painting quote in {city}?', a: 'Post your painting job for free on Biddaro and receive quotes from verified painters in {city} within 4 hours. Compare prices, ratings, and previous work before hiring.' },
    ],
    relatedSlugs: ['renovation', 'drywall', 'flooring'],
  },
  {
    slug: 'flooring',
    name: 'Flooring',
    emoji: '🪟',
    headline: 'Flooring Cost & Rates in India 2026',
    metaDesc: 'Flooring installation costs in {city}. Compare vitrified tiles, marble, wooden, and epoxy flooring rates per sq ft from local contractors.',
    intro: 'Flooring is one of the biggest visual investments in your home. Costs in {city} vary widely based on material choice — from budget ceramic tiles to premium Italian marble.',
    avgLow: '₹60', avgHigh: '₹500', avgUnit: 'per sq ft',
    items: [
      { label: 'Ceramic Tiles (material + labour)',    low: '₹60',    high: '₹120',   unit: 'per sq ft' },
      { label: 'Vitrified Tiles (material + labour)',  low: '₹90',    high: '₹200',   unit: 'per sq ft' },
      { label: 'Marble Flooring (Indian)',             low: '₹120',   high: '₹300',   unit: 'per sq ft' },
      { label: 'Marble Flooring (Italian)',            low: '₹350',   high: '₹800',   unit: 'per sq ft' },
      { label: 'Wooden Flooring (engineered)',         low: '₹150',   high: '₹400',   unit: 'per sq ft' },
      { label: 'Epoxy Flooring',                      low: '₹80',    high: '₹250',   unit: 'per sq ft' },
      { label: 'Granite Flooring',                    low: '₹100',   high: '₹250',   unit: 'per sq ft' },
      { label: 'Tiling Labour Only',                  low: '₹25',    high: '₹60',    unit: 'per sq ft' },
    ],
    factors: [
      'Type and brand of flooring material',
      'Room size and pattern complexity',
      'Subfloor condition and levelling required',
      'Labour rates in {city}',
      'Wastage factor (typically 10–15%)',
      'Adhesive and grouting material costs',
    ],
    tips: [
      'Add 10% extra tiles when ordering to account for breakage and cuts',
      'Vitrified tiles offer the best value — durable and easy to maintain',
      'For living rooms, opt for larger tiles (800×800) for a premium look',
      'Compare quotes on Biddaro — flooring rates in {city} vary by 30–40%',
    ],
    faqs: [
      { q: 'What is the cheapest flooring option in {city}?', a: 'Ceramic tiles are the most affordable flooring in {city} at ₹60–₹120 per sq ft including labour. Vitrified tiles at ₹90–₹200 offer better durability for the price.' },
      { q: 'How much does marble flooring cost in {city}?', a: 'Indian marble flooring in {city} costs ₹120–₹300 per sq ft. Rajasthan Makrana marble is premium at ₹200–₹400. Italian marble runs ₹350–₹800 per sq ft including polishing.' },
      { q: 'How long does flooring installation take for a 3BHK in {city}?', a: 'A standard 3BHK (1200–1500 sq ft) flooring project in {city} takes 7–12 days depending on material and crew size. Marble takes longer due to polishing time.' },
      { q: 'How do I hire a flooring contractor in {city}?', a: 'Post your flooring project on Biddaro for free. Verified flooring contractors in {city} will bid on your job. You can compare portfolios, ratings, and prices before choosing.' },
    ],
    relatedSlugs: ['tile-stone', 'renovation', 'general-construction'],
  },
  {
    slug: 'electrical',
    name: 'Electrical Work',
    emoji: '⚡',
    headline: 'Electrical Work Cost in India 2026',
    metaDesc: 'Electrician rates and electrical wiring cost guide for {city}. Compare charges for house wiring, panel installation, and repairs from verified electricians.',
    intro: 'Electrical work is safety-critical and must be done by licensed electricians. Costs in {city} depend on the scale of work — from single outlet repairs to full house wiring.',
    avgLow: '₹350', avgHigh: '₹1,200', avgUnit: 'per hour',
    items: [
      { label: 'Electrician Labour (per hour)',        low: '₹350',   high: '₹1,000', unit: 'per hour' },
      { label: 'Full House Wiring (per sq ft)',        low: '₹60',    high: '₹150',   unit: 'per sq ft' },
      { label: 'MCB Distribution Board (16-way)',      low: '₹4,000', high: '₹12,000',unit: 'per unit' },
      { label: 'Power Point Installation',             low: '₹400',   high: '₹1,200', unit: 'per point' },
      { label: 'Fan Wiring & Installation',            low: '₹500',   high: '₹1,500', unit: 'per fan' },
      { label: 'Light Point Wiring',                  low: '₹300',   high: '₹800',   unit: 'per point' },
      { label: 'AC Power Point (5-pin)',               low: '₹800',   high: '₹2,000', unit: 'per point' },
      { label: 'Earthing Installation',               low: '₹3,000', high: '₹8,000', unit: 'per job' },
    ],
    factors: [
      'Wire quality (Finolex, Havells, Polycab)',
      'Number of points and circuits',
      'Type of wiring (concealed vs surface)',
      'MCB board capacity and brand',
      'Earthing and surge protection requirements',
      'Licensed electrician rates in {city}',
    ],
    tips: [
      'Always use ISI-certified copper wires — aluminium wires are fire hazards',
      'Install MCBs for each circuit — costs more upfront but prevents damage',
      'Hire only licensed electricians — illegal wiring voids home insurance',
      'Get 3 quotes on Biddaro from verified electricians in {city}',
    ],
    faqs: [
      { q: 'How much does full house electrical wiring cost in {city}?', a: 'Full electrical wiring for a 1000 sq ft house in {city} costs ₹60,000–₹1,50,000 including wires, MCB board, switchgear, and labour. Premium brands and concealed wiring cost more.' },
      { q: 'What is the electrician per hour rate in {city}?', a: 'Licensed electricians in {city} charge ₹350–₹1,000 per hour. Emergency call-outs and night service cost ₹800–₹2,000 per hour. Book through Biddaro for competitive rates.' },
      { q: 'How often should house wiring be replaced in {city}?', a: 'Standard copper house wiring lasts 30–40 years. However, if you notice frequent tripping, flickering lights, or burning smells, get an electrical audit done immediately — these are fire hazards.' },
      { q: 'Do I need a permit for electrical work in {city}?', a: 'Major electrical work in {city} (new connections, panel upgrades, solar installation) requires approval from the local electricity board. Licensed electricians handle permits as part of their service.' },
    ],
    relatedSlugs: ['hvac', 'general-construction', 'renovation'],
  },
  {
    slug: 'renovation',
    name: 'Home Renovation',
    emoji: '🔨',
    headline: 'Home Renovation Cost in India 2026',
    metaDesc: 'Home renovation cost guide for {city}. Get accurate estimates for kitchen, bathroom, full-home and flat renovation from verified contractors.',
    intro: 'Home renovation costs in {city} depend heavily on the scope of work. From a quick kitchen refresh to a complete home makeover, here\'s what you can expect to pay.',
    avgLow: '₹800', avgHigh: '₹2,500', avgUnit: 'per sq ft',
    items: [
      { label: 'Basic Renovation (cosmetic only)',     low: '₹300',   high: '₹800',   unit: 'per sq ft' },
      { label: 'Standard Renovation',                 low: '₹800',   high: '₹1,500', unit: 'per sq ft' },
      { label: 'Premium Renovation',                  low: '₹1,500', high: '₹3,000', unit: 'per sq ft' },
      { label: 'Modular Kitchen Installation',         low: '₹60,000',high: '₹2,50,000','unit': 'per kitchen' },
      { label: 'Bathroom Renovation (complete)',       low: '₹40,000',high: '₹1,50,000','unit': 'per bathroom' },
      { label: 'False Ceiling (gypsum)',               low: '₹60',    high: '₹150',   unit: 'per sq ft' },
      { label: 'Wardrobe (per sq ft)',                 low: '₹800',   high: '₹2,500', unit: 'per sq ft' },
      { label: 'Interior Designer Fees',              low: '5%',     high: '15%',    unit: 'of project cost' },
    ],
    factors: [
      'Scope of work — cosmetic vs structural changes',
      'Material and finish quality',
      'Local contractor rates in {city}',
      'Permit requirements for structural changes',
      'Current condition of home',
      'Timeline and urgency of project',
    ],
    tips: [
      'Create a detailed scope of work before getting quotes',
      'Set aside 15–20% contingency budget for surprises',
      'Phase renovation to stay within budget — start with essentials',
      'Post on Biddaro to get competing bids from {city} renovation contractors',
    ],
    faqs: [
      { q: 'How much does it cost to renovate a 2BHK flat in {city}?', a: 'Renovating a 2BHK (800–1000 sq ft) in {city} costs ₹3–₹15 lakh depending on scope. Cosmetic updates cost ₹3–₹5 lakh, standard renovation ₹6–₹10 lakh, and premium full renovation ₹10–₹20 lakh.' },
      { q: 'How much does bathroom renovation cost in {city}?', a: 'A complete bathroom renovation in {city} costs ₹40,000–₹1,50,000 depending on fixtures, tiles, and fittings. Budget bathrooms with basic fittings cost ₹35,000–₹60,000 while luxury bathrooms can exceed ₹2 lakh.' },
      { q: 'How long does home renovation take in {city}?', a: 'A kitchen renovation takes 2–4 weeks, bathroom 1–2 weeks, and full home renovation 2–4 months in {city}. Structural work, material procurement, and permit approvals affect timelines.' },
      { q: 'Should I hire an interior designer for renovation in {city}?', a: 'For renovations above ₹10 lakh, hiring an interior designer in {city} adds 5–15% to costs but saves money through better planning and vendor negotiation. For smaller jobs, an experienced contractor from Biddaro is sufficient.' },
    ],
    relatedSlugs: ['painting', 'flooring', 'plumbing', 'electrical'],
  },
  {
    slug: 'roofing',
    name: 'Roofing',
    emoji: '🏠',
    headline: 'Roofing Cost & Rates in India 2026',
    metaDesc: 'Roofing cost guide for {city}. Compare RCC slab, metal sheet, Mangalore tile, and waterproofing rates from verified roofing contractors.',
    intro: 'A strong roof is critical in India\'s varied climate. Roofing costs in {city} vary significantly based on type — RCC slabs for permanent structures, metal sheets for sheds, and tile roofing for traditional homes.',
    avgLow: '₹150', avgHigh: '₹450', avgUnit: 'per sq ft',
    items: [
      { label: 'RCC Slab Casting',                   low: '₹200',   high: '₹400',   unit: 'per sq ft' },
      { label: 'Mangalore Tile Roofing',             low: '₹80',    high: '₹180',   unit: 'per sq ft' },
      { label: 'Metal Sheet Roofing (GI)',            low: '₹60',    high: '₹150',   unit: 'per sq ft' },
      { label: 'Polycarbonate / FRP Sheet',          low: '₹80',    high: '₹200',   unit: 'per sq ft' },
      { label: 'Waterproofing (terrace)',             low: '₹40',    high: '₹100',   unit: 'per sq ft' },
      { label: 'Roof Insulation',                    low: '₹50',    high: '₹120',   unit: 'per sq ft' },
      { label: 'Roof Tile Replacement',              low: '₹20',    high: '₹60',    unit: 'per tile' },
      { label: 'Skylight Installation',              low: '₹15,000',high: '₹50,000','unit': 'per unit' },
    ],
    factors: [
      'Roof type and structural design',
      'Material choice and quality',
      'Roof span and slope complexity',
      'Waterproofing requirements',
      'Access and scaffolding costs',
      'Local contractor rates in {city}',
    ],
    tips: [
      'Apply 2-coat waterproofing before monsoon every 5–7 years',
      'PU-based waterproofing lasts longer than cement-based in {city} climate',
      'RCC roof insulation saves 15–20% on AC costs long-term',
      'Get competing quotes on Biddaro from {city} roofing contractors',
    ],
    faqs: [
      { q: 'How much does RCC roof slab cost per sq ft in {city}?', a: 'RCC roof slab in {city} costs ₹200–₹400 per sq ft including shuttering, reinforcement, concrete casting, and curing. For a 1000 sq ft slab, expect ₹2–₹4 lakh for the slab alone.' },
      { q: 'What is the cost of waterproofing a terrace in {city}?', a: 'Terrace waterproofing in {city} costs ₹40–₹100 per sq ft. A 1000 sq ft terrace costs ₹40,000–₹1,00,000 using crystalline or PU waterproofing systems.' },
      { q: 'How long does a RCC roof last in {city}?', a: 'A properly constructed and maintained RCC roof lasts 50+ years. Regular waterproofing every 5–7 years and annual inspections after monsoon extend life significantly in {city}\'s climate.' },
      { q: 'How do I find a roofing contractor in {city}?', a: 'Post your roofing job on Biddaro for free and receive bids from verified roofing contractors in {city} within hours. Compare prices, check reviews, and hire with confidence.' },
    ],
    relatedSlugs: ['general-construction', 'insulation', 'new-construction'],
  },
];

// ── Helpers ───────────────────────────────────────────────────────────────────

export function getCostService(slug: string): CostServiceMeta | undefined {
  return COST_SERVICES.find(s => s.slug === slug);
}

export function getRelatedCostServices(slug: string): CostServiceMeta[] {
  const service = getCostService(slug);
  if (!service) return [];
  return service.relatedSlugs
    .map(s => getCostService(s))
    .filter((s): s is CostServiceMeta => Boolean(s))
    .slice(0, 4);
}
