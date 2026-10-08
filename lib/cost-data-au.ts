// ─── Construction Cost Guide Data for Australia ───────────────────────────────
// Powers /au/cost/[service] and /au/cost/[service]/[city] pages.
// All prices in AUD (Australian Dollar). Figures are best-effort market
// estimates for review — verify against current local rates before campaigns.

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
  headline: string;
  metaDesc: string;
  intro: string;
  items: CostItem[];
  factors: string[];
  tips: string[];
  faqs: CostFAQ[];
  avgLow: string;
  avgHigh: string;
  avgUnit: string;
  relatedSlugs: string[];
}

export function getAUCostService(slug: string): CostServiceMeta | undefined {
  return AU_COST_SERVICES.find(s => s.slug === slug);
}

export function getRelatedAUCostServices(slug: string): CostServiceMeta[] {
  const svc = getAUCostService(slug);
  if (!svc) return [];
  return svc.relatedSlugs.map(s => getAUCostService(s)).filter(Boolean) as CostServiceMeta[];
}

export const AU_COST_SERVICES: CostServiceMeta[] = [
  {
    slug: 'general-construction',
    name: 'House Construction',
    emoji: '🏗️',
    headline: 'House Construction Cost in Australia 2026',
    metaDesc: 'Get accurate house construction costs in {city}. Compare rates per m² for budget, standard, and custom builds from verified builders on Biddaro.',
    intro: 'Building a home in {city} is one of the largest investments you will make. Costs vary with design, materials, site conditions, and compliance with the National Construction Code (NCC/BCA).',
    avgLow: 'A$2,000', avgHigh: 'A$4,000', avgUnit: 'per m²',
    items: [
      { label: 'Budget Build (project home)', low: 'A$1,600', high: 'A$2,200', unit: 'per m²' },
      { label: 'Standard Build', low: 'A$2,200', high: 'A$3,200', unit: 'per m²' },
      { label: 'Premium Build', low: 'A$3,200', high: 'A$4,500', unit: 'per m²' },
      { label: 'Custom / Architectural Build', low: 'A$4,500', high: 'A$7,000', unit: 'per m²' },
      { label: 'Concrete Slab', low: 'A$80', high: 'A$160', unit: 'per m²' },
      { label: 'Timber Framing', low: 'A$70', high: 'A$120', unit: 'per m²' },
      { label: 'Colorbond Roofing', low: 'A$70', high: 'A$120', unit: 'per m²' },
      { label: 'Knock-Down Rebuild (demolition)', low: 'A$15,000', high: 'A$40,000', unit: 'per house' },
    ],
    factors: [
      'Site slope, access, and soil classification in {city}',
      'Single vs double storey and total floor area',
      'Slab type and site preparation needs',
      'Material and finish selections (standard vs premium)',
      'Local trade rates and availability in {city}',
      'Council/certifier approval and contribution fees',
      'Service connections — water, sewer, power, NBN',
      'Energy efficiency (NatHERS) and bushfire (BAL) requirements',
    ],
    tips: [
      'Get at least 3–5 detailed fixed-price quotes on Biddaro before choosing a builder in {city}.',
      'Lock in a fixed-price contract with a clear schedule of inclusions to avoid variations.',
      'Standard window and door sizes avoid costly custom fabrication.',
      'Confirm the builder holds home-warranty insurance for your contract value.',
      'Build during quieter months for better trade availability and pricing.',
    ],
    faqs: [
      { q: 'How much does it cost to build a house in {city}?', a: 'New home construction in {city} typically costs A$2,000–4,000 per m² depending on quality and site. A standard 200m² home costs roughly A$400,000–800,000 including site works.' },
      { q: 'What approvals do I need to build in {city}?', a: 'You will generally need development approval (DA) or a complying development certificate (CDC), plus a construction certificate. Your builder or certifier manages these in {city}.' },
      { q: 'How long does it take to build a house in {city}?', a: 'A single-storey home in {city} takes 6–10 months once approvals are in place; double-storey or custom homes take 10–16 months.' },
      { q: 'What is the cheapest way to build a house in {city}?', a: 'A project-home design on a flat, well-serviced block with standard inclusions is most cost-effective in {city}. Competitive bidding on Biddaro helps keep prices sharp.' },
    ],
    relatedSlugs: ['plumbing', 'electrical', 'carpentry', 'roofing'],
  },
  {
    slug: 'plumbing',
    name: 'Plumbing',
    emoji: '🔧',
    headline: 'Plumbing Cost in Australia 2026',
    metaDesc: 'Find accurate plumbing costs in {city}. Compare call-out fees and project costs for repairs, hot water, and renovations from licensed plumbers on Biddaro.',
    intro: 'Plumbing costs in {city} depend on the job type, access, and whether it is a repair or new installation. Licensed plumbers must comply with AS/NZS 3500 and provide a compliance certificate.',
    avgLow: 'A$90', avgHigh: 'A$150', avgUnit: 'per hour',
    items: [
      { label: 'Call-Out Fee', low: 'A$80', high: 'A$150', unit: 'per visit' },
      { label: 'Tap Repair / Replacement', low: 'A$120', high: 'A$300', unit: 'per job' },
      { label: 'Toilet Installation', low: 'A$250', high: 'A$600', unit: 'per unit' },
      { label: 'Hot Water System Replacement', low: 'A$900', high: 'A$3,500', unit: 'per unit' },
      { label: 'Blocked Drain Clearing', low: 'A$150', high: 'A$500', unit: 'per job' },
      { label: 'Burst Pipe Repair', low: 'A$250', high: 'A$800', unit: 'per job' },
      { label: 'Gas Appliance Install', low: 'A$200', high: 'A$600', unit: 'per appliance' },
      { label: 'Bathroom Rough-In', low: 'A$2,500', high: 'A$5,500', unit: 'per bathroom' },
    ],
    factors: [
      'Complexity and accessibility of the plumbing',
      'Repair vs new installation',
      'Emergency vs scheduled service',
      'Compliance certification requirements',
      'Age and condition of existing pipework',
      'Local labour rates in {city}',
    ],
    tips: [
      'Bundle multiple plumbing jobs in one visit to save on call-out fees.',
      'Consider a heat-pump or solar hot water system for long-term savings and rebates.',
      'Schedule non-urgent work on weekdays to avoid after-hours rates.',
      'Always confirm the plumber is licensed and provides a compliance certificate in {city}.',
    ],
    faqs: [
      { q: 'How much does a plumber cost per hour in {city}?', a: 'Plumbers in {city} charge A$90–150/hr plus a call-out fee. Emergency and after-hours jobs cost more.' },
      { q: 'Do I need a licensed plumber in {city}?', a: 'Yes. All plumbing and gas work in {city} must be done by a licensed plumber who issues a compliance certificate.' },
      { q: 'How much is a new hot water system in {city}?', a: 'Supplied and installed, a hot water system in {city} costs A$900–3,500 depending on type — electric, gas, heat-pump, or solar.' },
      { q: 'How do I find a licensed plumber in {city}?', a: 'Use Biddaro to compare verified, licensed plumbers in {city}. Read reviews, compare quotes, and check licences in one place.' },
    ],
    relatedSlugs: ['general-construction', 'electrical', 'renovation'],
  },
  {
    slug: 'electrical',
    name: 'Electrical',
    emoji: '⚡',
    headline: 'Electrical Work Cost in Australia 2026',
    metaDesc: 'Get accurate electrical costs in {city}. Compare rates for switchboard upgrades, rewiring, and EV chargers from licensed electricians on Biddaro.',
    intro: 'Electrical costs in {city} depend on scope and whether a switchboard upgrade is needed. All work must comply with AS/NZS 3000 and be done by a licensed electrician who issues a compliance certificate.',
    avgLow: 'A$80', avgHigh: 'A$140', avgUnit: 'per hour',
    items: [
      { label: 'Call-Out Fee', low: 'A$80', high: 'A$130', unit: 'per visit' },
      { label: 'Power Point / Switch Install', low: 'A$120', high: 'A$250', unit: 'per point' },
      { label: 'Switchboard Upgrade', low: 'A$1,000', high: 'A$3,500', unit: 'per board' },
      { label: 'House Rewiring', low: 'A$5,000', high: 'A$15,000', unit: 'per house' },
      { label: 'EV Charger Installation', low: 'A$900', high: 'A$2,500', unit: 'per unit' },
      { label: 'Downlight Installation', low: 'A$90', high: 'A$200', unit: 'per light' },
      { label: 'Ceiling Fan Installation', low: 'A$150', high: 'A$350', unit: 'per fan' },
      { label: 'Safety Switch (RCD) Install', low: 'A$120', high: 'A$300', unit: 'per circuit' },
    ],
    factors: [
      'Age and condition of existing wiring',
      'Switchboard capacity and upgrade needs',
      'Access — open vs finished walls',
      'Compliance certificate and inspection requirements',
      'Single vs three-phase power',
      'Local electrician rates in {city}',
    ],
    tips: [
      'Combine electrical work with other renovations to avoid reopening walls twice.',
      'Upgrade to a modern switchboard with safety switches during any rewire.',
      'Ask about rebates for EV chargers, solar, and battery installs in {city}.',
      'Confirm the electrician provides a Certificate of Compliance for Electrical Work.',
    ],
    faqs: [
      { q: 'How much does an electrician cost in {city}?', a: 'Electricians in {city} charge A$80–140/hr plus a call-out fee. Switchboard upgrades and rewiring cost more.' },
      { q: 'Can I do my own electrical work in {city}?', a: 'No. Fixed electrical work in {city} must be done by a licensed electrician — DIY wiring is illegal and unsafe.' },
      { q: 'How much is a switchboard upgrade in {city}?', a: 'A switchboard upgrade in {city} costs A$1,000–3,500 depending on complexity and whether rewiring is involved.' },
      { q: 'How do I find a licensed electrician in {city}?', a: 'Biddaro connects you with verified, licensed electricians in {city}. Compare quotes, check licences, and read reviews.' },
    ],
    relatedSlugs: ['general-construction', 'plumbing', 'hvac'],
  },
  {
    slug: 'painting',
    name: 'Painting',
    emoji: '🎨',
    headline: 'Painting Cost in Australia 2026',
    metaDesc: 'Find accurate house painting costs in {city}. Compare interior and exterior painting rates from verified painters on Biddaro.',
    intro: 'Painting costs in {city} depend on interior vs exterior, surface area, condition, and paint quality. Homes built before 1970 may need lead-paint precautions.',
    avgLow: 'A$20', avgHigh: 'A$45', avgUnit: 'per m²',
    items: [
      { label: 'Interior Painting (walls)', low: 'A$20', high: 'A$45', unit: 'per m²' },
      { label: 'Exterior Painting', low: 'A$25', high: 'A$55', unit: 'per m²' },
      { label: 'Ceiling Painting', low: 'A$15', high: 'A$35', unit: 'per m²' },
      { label: 'Roof Painting / Restoration', low: 'A$2,000', high: 'A$6,000', unit: 'per roof' },
      { label: 'Door Painting', low: 'A$80', high: 'A$180', unit: 'per door' },
      { label: 'Feature Wall', low: 'A$150', high: 'A$400', unit: 'per wall' },
      { label: '3-Bedroom Interior Repaint', low: 'A$4,000', high: 'A$9,000', unit: 'per home' },
      { label: 'Fence / Deck Staining', low: 'A$15', high: 'A$40', unit: 'per m²' },
    ],
    factors: [
      'Total surface area and room count',
      'Paint quality — standard vs premium (Dulux, Taubmans)',
      'Surface prep — patching, sanding, priming',
      'Ceiling height and access (scaffold needs)',
      'Lead-paint precautions for pre-1970 homes',
      'Interior vs exterior and weather',
    ],
    tips: [
      'Get at least 3 quotes specifying paint brand, number of coats, and prep.',
      'Premium paint lasts longer and covers in fewer coats — often cheaper over time.',
      'Paint exteriors in dry, mild weather for the best finish.',
      'Ask about workmanship warranty — reputable painters offer 2–7 years.',
    ],
    faqs: [
      { q: 'How much does it cost to paint a house interior in {city}?', a: 'Interior painting in {city} costs A$20–45/m², or roughly A$4,000–9,000 for a standard 3-bedroom home.' },
      { q: 'How much does exterior painting cost in {city}?', a: 'Exterior painting in {city} costs A$25–55/m² including prep. A standard home exterior runs A$6,000–15,000.' },
      { q: 'How long does it take to paint a house in {city}?', a: 'A 3-bedroom interior takes 3–5 days; an exterior repaint takes 4–8 days depending on access and weather.' },
      { q: 'Do painters need a licence in {city}?', a: 'In {city}, painting above the state value threshold requires a licence. Always confirm licence and insurance before hiring.' },
    ],
    relatedSlugs: ['general-construction', 'renovation', 'carpentry'],
  },
  {
    slug: 'flooring',
    name: 'Flooring',
    emoji: '🪵',
    headline: 'Flooring Installation Cost in Australia 2026',
    metaDesc: 'Find accurate flooring costs in {city}. Compare timber, laminate, hybrid, tile, and carpet rates from verified installers on Biddaro.',
    intro: 'Flooring costs in {city} vary by material, area, subfloor condition, and complexity. Popular choices include hybrid vinyl, engineered timber, tiles, and carpet.',
    avgLow: 'A$40', avgHigh: 'A$150', avgUnit: 'per m² installed',
    items: [
      { label: 'Laminate Flooring', low: 'A$40', high: 'A$70', unit: 'per m² installed' },
      { label: 'Hybrid / Vinyl Planks', low: 'A$50', high: 'A$90', unit: 'per m² installed' },
      { label: 'Engineered Timber', low: 'A$80', high: 'A$150', unit: 'per m² installed' },
      { label: 'Solid Timber + Polish', low: 'A$100', high: 'A$200', unit: 'per m² installed' },
      { label: 'Porcelain / Ceramic Tile', low: 'A$60', high: 'A$130', unit: 'per m² installed' },
      { label: 'Carpet Installation', low: 'A$35', high: 'A$90', unit: 'per m² installed' },
      { label: 'Floor Sanding & Polishing', low: 'A$35', high: 'A$60', unit: 'per m²' },
      { label: 'Old Floor Removal', low: 'A$15', high: 'A$40', unit: 'per m²' },
    ],
    factors: [
      'Material type and quality grade',
      'Area size and layout complexity',
      'Subfloor condition and levelling',
      'Removal and disposal of old flooring',
      'Acoustic underlay (strata requirements for units)',
      'Local installer rates in {city}',
    ],
    tips: [
      'Hybrid vinyl offers the best value — waterproof and durable at a mid price.',
      'Order 10% extra for cuts, waste, and future repairs.',
      'Compare supply-and-install quotes, not material-only prices.',
      'Confirm acoustic underlay meets strata rules if you are in an apartment in {city}.',
    ],
    faqs: [
      { q: 'What is the cheapest flooring in {city}?', a: 'Laminate and hybrid vinyl are most affordable in {city} at A$40–90/m² installed, with hybrid prized for water resistance.' },
      { q: 'How much does timber flooring cost in {city}?', a: 'Engineered timber in {city} costs A$80–150/m² installed; solid timber with sand-and-polish costs more.' },
      { q: 'How long does flooring installation take?', a: 'A typical 100m² job takes 2–5 days depending on material and subfloor prep.' },
      { q: 'Which flooring suits apartments in {city}?', a: 'Hybrid and engineered timber with compliant acoustic underlay are popular in {city} units to meet strata noise rules.' },
    ],
    relatedSlugs: ['general-construction', 'renovation', 'tiling'],
  },
  {
    slug: 'roofing',
    name: 'Roofing',
    emoji: '🏠',
    headline: 'Roofing Cost in Australia 2026',
    metaDesc: 'Get accurate roofing costs in {city}. Compare Colorbond, tile, re-roofing, and restoration rates from verified roofers on Biddaro.',
    intro: 'Roofing costs in {city} depend on material, roof size and pitch, and whether it is a repair, restoration, or full re-roof. Metal roofing must meet AS 1562 and local wind ratings.',
    avgLow: 'A$8,000', avgHigh: 'A$25,000', avgUnit: 'per roof (avg home)',
    items: [
      { label: 'Colorbond Re-Roof', low: 'A$70', high: 'A$120', unit: 'per m²' },
      { label: 'Tile Re-Roof', low: 'A$100', high: 'A$180', unit: 'per m²' },
      { label: 'Roof Restoration (clean/paint)', low: 'A$2,500', high: 'A$6,000', unit: 'per roof' },
      { label: 'Roof Repair (leak/patch)', low: 'A$300', high: 'A$1,500', unit: 'per repair' },
      { label: 'Gutter Replacement', low: 'A$30', high: 'A$70', unit: 'per linear m' },
      { label: 'Downpipes', low: 'A$150', high: 'A$400', unit: 'each' },
      { label: 'Ridge Capping Re-Bed/Point', low: 'A$1,000', high: 'A$3,000', unit: 'per roof' },
      { label: 'Skylight Installation', low: 'A$600', high: 'A$2,500', unit: 'per unit' },
    ],
    factors: [
      'Roof area, pitch, and access',
      'Material — Colorbond, concrete, or terracotta tile',
      'Removal and disposal of old roofing',
      'Wind/cyclone rating for the region',
      'Gutter and downpipe works included',
      'Permit requirements in {city}',
    ],
    tips: [
      'Combine a re-roof with gutter replacement to save on access and scaffold costs.',
      'Colorbond is lighter and faster to install than tile in most cases.',
      'Check if storm damage is covered by home insurance before paying out of pocket.',
      'Ask about product warranty (material) and workmanship warranty (labour).',
    ],
    faqs: [
      { q: 'How much does a new roof cost in {city}?', a: 'Re-roofing a standard home in {city} costs A$8,000–20,000 for Colorbond and A$15,000–35,000 for tile.' },
      { q: 'How long does a re-roof take in {city}?', a: 'A standard re-roof in {city} takes 3–7 days depending on size, material, and weather.' },
      { q: 'Colorbond or tile in {city}?', a: 'Colorbond suits most climates and is lighter and quicker; tile offers thermal mass and a traditional look. Local conditions in {city} guide the choice.' },
      { q: 'Do I need approval to re-roof in {city}?', a: 'Like-for-like re-roofing often does not need approval, but changes to structure or material may. Your roofer can advise for {city}.' },
    ],
    relatedSlugs: ['general-construction', 'painting', 'carpentry'],
  },
  {
    slug: 'hvac',
    name: 'Air Conditioning',
    emoji: '❄️',
    headline: 'Air Conditioning Cost in Australia 2026',
    metaDesc: 'Get accurate air conditioning costs in {city}. Compare split system, ducted, and evaporative cooling rates from licensed technicians on Biddaro.',
    intro: 'Air conditioning costs in {city} depend on system type, home size, and ductwork. Refrigerant work requires an ARC licence and electrical connection a licensed electrician.',
    avgLow: 'A$600', avgHigh: 'A$20,000', avgUnit: 'per system',
    items: [
      { label: 'Split System (per room)', low: 'A$600', high: 'A$1,800', unit: 'supplied & installed' },
      { label: 'Multi-Head Split System', low: 'A$3,000', high: 'A$7,000', unit: 'per system' },
      { label: 'Ducted Reverse-Cycle (whole home)', low: 'A$9,000', high: 'A$20,000', unit: 'per home' },
      { label: 'Evaporative Cooling', low: 'A$3,000', high: 'A$7,000', unit: 'per home' },
      { label: 'Gas Ducted Heating', low: 'A$3,500', high: 'A$8,000', unit: 'per home' },
      { label: 'AC Service / Clean', low: 'A$120', high: 'A$300', unit: 'per unit' },
      { label: 'AC Repair', low: 'A$150', high: 'A$600', unit: 'per visit' },
      { label: 'Add Zone to Ducted', low: 'A$400', high: 'A$900', unit: 'per zone' },
    ],
    factors: [
      'Home size, layout, and insulation',
      'System type — split, multi-head, ducted, evaporative',
      'Energy rating and capacity (kW)',
      'Ductwork and zoning requirements',
      'Climate in {city}',
      'Electrical and ARC-licensed install requirements',
    ],
    tips: [
      'Size the unit to the room — oversized systems cost more and run inefficiently.',
      'Ducted with zoning lets you cool only occupied rooms, cutting running costs.',
      'Install in autumn or spring for shorter lead times and better pricing.',
      'Check for state energy rebates on efficient systems in {city}.',
    ],
    faqs: [
      { q: 'How much does ducted air conditioning cost in {city}?', a: 'Ducted reverse-cycle for a whole home in {city} costs A$9,000–20,000 depending on size and zoning.' },
      { q: 'How much is a split system installed in {city}?', a: 'A split system in {city} costs A$600–1,800 supplied and installed per room, depending on capacity.' },
      { q: 'Do AC installers need a licence in {city}?', a: 'Yes. Refrigerant work in {city} requires an ARC licence and the electrical connection a licensed electrician.' },
      { q: 'How do I find an AC technician in {city}?', a: 'Compare ARC-licensed air conditioning technicians on Biddaro in {city}, with reviews and quotes.' },
    ],
    relatedSlugs: ['electrical', 'general-construction', 'renovation'],
  },
  {
    slug: 'carpentry',
    name: 'Carpentry & Decking',
    emoji: '🪚',
    headline: 'Carpentry & Decking Cost in Australia 2026',
    metaDesc: 'Find accurate carpentry and decking costs in {city}. Compare framing, decks, pergolas, and joinery rates from verified carpenters on Biddaro.',
    intro: 'Carpentry costs in {city} vary by job — framing, decking, pergolas, or custom joinery. Structural work must comply with the NCC and AS 1684 timber framing standard.',
    avgLow: 'A$60', avgHigh: 'A$110', avgUnit: 'per hour',
    items: [
      { label: 'Timber Decking', low: 'A$200', high: 'A$450', unit: 'per m²' },
      { label: 'Composite Decking', low: 'A$350', high: 'A$550', unit: 'per m²' },
      { label: 'Pergola / Carport', low: 'A$3,000', high: 'A$12,000', unit: 'per structure' },
      { label: 'Timber Framing', low: 'A$70', high: 'A$120', unit: 'per m²' },
      { label: 'Internal Door Install', low: 'A$150', high: 'A$400', unit: 'per door' },
      { label: 'Built-in Wardrobe', low: 'A$1,000', high: 'A$3,500', unit: 'per unit' },
      { label: 'Custom Joinery / Shelving', low: 'A$300', high: 'A$1,200', unit: 'per linear m' },
      { label: 'Window Install', low: 'A$400', high: 'A$1,000', unit: 'per window' },
    ],
    factors: [
      'Type of carpentry — framing, finish, or custom',
      'Material — treated pine, hardwood, or composite',
      'Design complexity and detailing',
      'Structural vs non-structural work',
      'Council approval for decks/structures over set heights',
      'Local carpenter rates in {city}',
    ],
    tips: [
      'Treated pine framing with a hardwood deck top balances cost and durability.',
      'Composite decking costs more upfront but needs little maintenance.',
      'Get quotes that separate material and labour.',
      'Confirm whether your deck or pergola needs approval in {city} before building.',
    ],
    faqs: [
      { q: 'How much does a deck cost in {city}?', a: 'A timber deck in {city} costs A$200–450/m²; composite runs A$350–550/m². A 20m² deck typically costs A$4,000–11,000.' },
      { q: 'How much does a carpenter charge per hour in {city}?', a: 'Carpenters in {city} charge A$60–110/hr; finish and custom joinery sit at the higher end.' },
      { q: 'Do I need approval for a deck or pergola in {city}?', a: 'Decks and structures over a set height or near boundaries in {city} often need approval. Your carpenter can advise.' },
      { q: 'How do I find a carpenter in {city}?', a: 'Compare verified carpenters on Biddaro in {city}. Review portfolios, check licences, and get at least 3 quotes.' },
    ],
    relatedSlugs: ['general-construction', 'renovation', 'flooring'],
  },
  {
    slug: 'tiling',
    name: 'Tiling',
    emoji: '🧱',
    headline: 'Tiling Cost in Australia 2026',
    metaDesc: 'Find accurate tiling costs in {city}. Compare bathroom, kitchen, and floor tiling plus waterproofing rates from verified tilers on Biddaro.',
    intro: 'Tiling costs in {city} depend on tile type, area, and surface prep. Wet-area waterproofing must comply with AS 3740 and is a critical step in any bathroom.',
    avgLow: 'A$45', avgHigh: 'A$120', avgUnit: 'per m²',
    items: [
      { label: 'Floor Tiling (supply & lay labour)', low: 'A$45', high: 'A$90', unit: 'per m²' },
      { label: 'Wall Tiling', low: 'A$50', high: 'A$100', unit: 'per m²' },
      { label: 'Large-Format Tiles', low: 'A$70', high: 'A$130', unit: 'per m²' },
      { label: 'Natural Stone Tiling', low: 'A$90', high: 'A$160', unit: 'per m²' },
      { label: 'Bathroom Waterproofing', low: 'A$500', high: 'A$1,200', unit: 'per bathroom' },
      { label: 'Screeding / Levelling', low: 'A$30', high: 'A$70', unit: 'per m²' },
      { label: 'Tile Removal', low: 'A$25', high: 'A$50', unit: 'per m²' },
      { label: 'Grout & Silicone Reseal', low: 'A$400', high: 'A$900', unit: 'per bathroom' },
    ],
    factors: [
      'Tile type, size, and finish',
      'Area and surface condition',
      'Waterproofing and screeding needs',
      'Pattern complexity (herringbone, etc.)',
      'Removal of existing tiles',
      'Local tiler rates in {city}',
    ],
    tips: [
      'Budget for waterproofing separately — it is essential and must be certified.',
      'Large-format tiles need a flat, level substrate; factor in screeding.',
      'Buy 10% extra tiles for cuts and future repairs.',
      'Confirm your tiler provides a waterproofing certificate in {city}.',
    ],
    faqs: [
      { q: 'How much does tiling cost in {city}?', a: 'Tiling labour in {city} costs A$45–90/m² plus tiles. Waterproofing a bathroom adds A$500–1,200.' },
      { q: 'Does bathroom waterproofing need certification in {city}?', a: 'Yes. Wet-area waterproofing in {city} must comply with AS 3740 and is usually certified — always confirm documentation.' },
      { q: 'How long does tiling a bathroom take?', a: 'Tiling a standard bathroom in {city} takes 3–5 days including waterproofing cure time.' },
      { q: 'How do I find a tiler in {city}?', a: 'Compare verified tilers on Biddaro in {city}. Check waterproofing credentials, review work, and get quotes.' },
    ],
    relatedSlugs: ['renovation', 'flooring', 'general-construction'],
  },
  {
    slug: 'renovation',
    name: 'Home Renovation',
    emoji: '🛠️',
    headline: 'Home Renovation Cost in Australia 2026',
    metaDesc: 'Get accurate renovation costs in {city}. Compare kitchen, bathroom, and extension rates from verified renovation builders on Biddaro.',
    intro: 'Renovation costs in {city} range from a cosmetic refresh to a full extension. Structural work requires a licensed builder, approval, and compliance with the current NCC.',
    avgLow: 'A$20,000', avgHigh: 'A$120,000', avgUnit: 'per project',
    items: [
      { label: 'Bathroom Renovation', low: 'A$18,000', high: 'A$35,000', unit: 'per bathroom' },
      { label: 'Kitchen Renovation', low: 'A$20,000', high: 'A$45,000', unit: 'per kitchen' },
      { label: 'Laundry Renovation', low: 'A$8,000', high: 'A$18,000', unit: 'per laundry' },
      { label: 'Single-Room Extension', low: 'A$2,500', high: 'A$4,500', unit: 'per m²' },
      { label: 'Second-Storey Addition', low: 'A$3,000', high: 'A$5,500', unit: 'per m²' },
      { label: 'Whole-Home Cosmetic Reno', low: 'A$40,000', high: 'A$120,000', unit: 'per home' },
      { label: 'Granny Flat (secondary dwelling)', low: 'A$120,000', high: 'A$250,000', unit: 'per unit' },
      { label: 'Structural Wall Removal', low: 'A$2,000', high: 'A$6,000', unit: 'per wall' },
    ],
    factors: [
      'Scope — cosmetic vs structural',
      'Fixture and finish grade',
      'Plumbing/electrical relocation',
      'Approval and certifier requirements',
      'Waterproofing for wet areas',
      'Local trade rates in {city}',
    ],
    tips: [
      'Keep plumbing and wet areas in place to avoid costly re-routing.',
      'Lock in a fixed-price contract with detailed inclusions to control variations.',
      'Prioritise kitchens and bathrooms for the best resale return.',
      'Confirm the builder carries home-warranty insurance for your contract value.',
    ],
    faqs: [
      { q: 'How much does a renovation cost in {city}?', a: 'In {city}, a bathroom runs A$18,000–35,000, a kitchen A$20,000–45,000, and extensions A$2,500–4,500/m².' },
      { q: 'Do I need approval to renovate in {city}?', a: 'Cosmetic updates usually don’t, but structural changes, extensions, and moving plumbing in {city} require approval.' },
      { q: 'How long does a renovation take in {city}?', a: 'A bathroom takes 3–5 weeks, a kitchen 4–8 weeks, and an extension several months including approvals.' },
      { q: 'How do I find a renovation builder in {city}?', a: 'Use Biddaro to compare verified renovation builders in {city}. Check licences, reviews, and get fixed-price quotes.' },
    ],
    relatedSlugs: ['general-construction', 'plumbing', 'tiling'],
  },
];
