// ─── Construction Cost Guide Data for Canada ──────────────────────────────────
// Powers /ca/cost/[service] and /ca/cost/[service]/[city] pages.
// All prices in CAD (Canadian Dollar). Figures are best-effort market estimates
// for review — verify against current local rates before campaigns.

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

export function getCACostService(slug: string): CostServiceMeta | undefined {
  return CA_COST_SERVICES.find(s => s.slug === slug);
}

export function getRelatedCACostServices(slug: string): CostServiceMeta[] {
  const svc = getCACostService(slug);
  if (!svc) return [];
  return svc.relatedSlugs.map(s => getCACostService(s)).filter(Boolean) as CostServiceMeta[];
}

export const CA_COST_SERVICES: CostServiceMeta[] = [
  {
    slug: 'general-construction',
    name: 'House Construction',
    emoji: '🏗️',
    headline: 'House Construction Cost in Canada 2026',
    metaDesc: 'Get accurate house construction costs in {city}. Compare rates per sq ft for budget, standard, and custom builds from verified contractors on Biddaro.',
    intro: 'Building a home in {city} is a major investment. Costs vary with design, materials, site conditions, and compliance with the National Building Code of Canada and the provincial code.',
    avgLow: 'C$200', avgHigh: 'C$450', avgUnit: 'per sq ft',
    items: [
      { label: 'Budget Build (basic finish)', low: 'C$175', high: 'C$250', unit: 'per sq ft' },
      { label: 'Standard Build', low: 'C$250', high: 'C$350', unit: 'per sq ft' },
      { label: 'Premium Build', low: 'C$350', high: 'C$500', unit: 'per sq ft' },
      { label: 'Custom / Luxury Build', low: 'C$500', high: 'C$800', unit: 'per sq ft' },
      { label: 'Foundation (poured concrete)', low: 'C$20', high: 'C$40', unit: 'per sq ft' },
      { label: 'Framing', low: 'C$15', high: 'C$30', unit: 'per sq ft' },
      { label: 'Asphalt Shingle Roofing', low: 'C$5', high: 'C$12', unit: 'per sq ft' },
      { label: 'Teardown / Demolition', low: 'C$12,000', high: 'C$35,000', unit: 'per house' },
    ],
    factors: [
      'Lot conditions, grading, and frost-depth foundation needs in {city}',
      'Number of storeys and total square footage',
      'Foundation type — slab, crawl space, or full basement',
      'Material and finish selections',
      'Local trade rates and winter scheduling in {city}',
      'Permit, development, and utility connection fees',
      'Insulation and energy-code (NBC Section 9.36) requirements',
      'Site servicing — water, sewer, hydro, gas',
    ],
    tips: [
      'Get at least 3–5 detailed quotes on Biddaro before choosing a contractor in {city}.',
      'Schedule foundation and exterior work for the warmer months to avoid winter premiums.',
      'Choose standard window and door sizes to avoid custom fabrication costs.',
      'Invest in insulation and air sealing upfront for lower heating bills in {city}.',
      'Confirm the contractor carries liability insurance and WSIB/WCB coverage.',
    ],
    faqs: [
      { q: 'How much does it cost to build a house in {city}?', a: 'New home construction in {city} typically costs C$200–450 per sq ft depending on quality and site. A 2,000 sq ft home costs roughly C$400,000–900,000 including site work.' },
      { q: 'What permits do I need to build in {city}?', a: 'You will need a building permit plus plumbing, electrical, and HVAC permits in {city}. Your general contractor usually coordinates all applications and inspections.' },
      { q: 'How long does it take to build a house in {city}?', a: 'A standard home in {city} takes 8–14 months once permits are issued; winter conditions can extend foundation and exterior timelines.' },
      { q: 'What is the cheapest way to build a house in {city}?', a: 'A simple rectangular design on a slab or standard basement with standard finishes is most cost-effective in {city}. Competitive bidding on Biddaro keeps prices sharp.' },
    ],
    relatedSlugs: ['plumbing', 'electrical', 'carpentry', 'roofing'],
  },
  {
    slug: 'plumbing',
    name: 'Plumbing',
    emoji: '🔧',
    headline: 'Plumbing Cost in Canada 2026',
    metaDesc: 'Find accurate plumbing costs in {city}. Compare service-call fees and project costs for repairs, water heaters, and repiping from licensed plumbers on Biddaro.',
    intro: 'Plumbing costs in {city} depend on the job, access, and whether it is a repair or new installation. Licensed plumbers must comply with the provincial plumbing code.',
    avgLow: 'C$80', avgHigh: 'C$150', avgUnit: 'per hour',
    items: [
      { label: 'Service-Call Fee', low: 'C$80', high: 'C$150', unit: 'per visit' },
      { label: 'Faucet Repair / Replacement', low: 'C$150', high: 'C$400', unit: 'per job' },
      { label: 'Toilet Installation', low: 'C$250', high: 'C$600', unit: 'per unit' },
      { label: 'Water Heater Replacement', low: 'C$1,200', high: 'C$3,500', unit: 'per unit' },
      { label: 'Drain Cleaning / Snaking', low: 'C$150', high: 'C$500', unit: 'per job' },
      { label: 'Repiping (PEX)', low: 'C$4,000', high: 'C$12,000', unit: 'per house' },
      { label: 'Sewer Line Repair', low: 'C$2,000', high: 'C$8,000', unit: 'per job' },
      { label: 'Sump Pump Installation', low: 'C$500', high: 'C$1,500', unit: 'per unit' },
    ],
    factors: [
      'Complexity and accessibility of the plumbing',
      'Repair vs new installation',
      'Emergency vs scheduled service',
      'Permit and inspection fees in {city}',
      'Age of existing pipework (galvanised/lead replacement)',
      'Local labour rates in {city}',
    ],
    tips: [
      'Bundle plumbing jobs in one visit to save on service-call fees.',
      'Choose PEX over copper for repiping — cheaper and freeze-resistant.',
      'Install a sump pump with battery backup to protect against spring flooding.',
      'Confirm the plumber is licensed and pulls permits for new work in {city}.',
    ],
    faqs: [
      { q: 'How much does a plumber cost per hour in {city}?', a: 'Plumbers in {city} charge C$80–150/hr plus a service-call fee. Emergency and after-hours work costs more.' },
      { q: 'Do I need a permit for plumbing work in {city}?', a: 'Yes. Permits are required in {city} for new installations, repiping, water heaters, and sewer work. Minor repairs usually do not.' },
      { q: 'How much is a new water heater in {city}?', a: 'A water heater in {city} costs C$1,200–3,500 installed depending on tank vs tankless and fuel type.' },
      { q: 'How do I find a licensed plumber in {city}?', a: 'Use Biddaro to compare verified, licensed plumbers in {city}. Read reviews, compare quotes, and check credentials.' },
    ],
    relatedSlugs: ['general-construction', 'electrical', 'renovation'],
  },
  {
    slug: 'electrical',
    name: 'Electrical',
    emoji: '⚡',
    headline: 'Electrical Work Cost in Canada 2026',
    metaDesc: 'Get accurate electrical costs in {city}. Compare panel upgrades, rewiring, and EV charger rates from licensed electricians on Biddaro.',
    intro: 'Electrical costs in {city} depend on scope and whether a panel upgrade is needed. All work must comply with the Canadian Electrical Code and the provincial safety authority, with permits and inspection.',
    avgLow: 'C$75', avgHigh: 'C$140', avgUnit: 'per hour',
    items: [
      { label: 'Service-Call Fee', low: 'C$75', high: 'C$130', unit: 'per visit' },
      { label: 'Outlet / Switch Install', low: 'C$120', high: 'C$300', unit: 'per point' },
      { label: 'Panel Upgrade (100A to 200A)', low: 'C$2,000', high: 'C$4,500', unit: 'per panel' },
      { label: 'Whole-House Rewiring', low: 'C$8,000', high: 'C$25,000', unit: 'per house' },
      { label: 'EV Charger Installation', low: 'C$1,000', high: 'C$2,800', unit: 'per unit' },
      { label: 'Pot Lights (per light)', low: 'C$150', high: 'C$350', unit: 'per light' },
      { label: 'Ceiling Fan Installation', low: 'C$150', high: 'C$350', unit: 'per fan' },
      { label: 'Standby Generator Install', low: 'C$6,000', high: 'C$15,000', unit: 'per unit' },
    ],
    factors: [
      'Age and condition of existing wiring (knob-and-tube/aluminium)',
      'Panel capacity and upgrade needs',
      'Access — open vs finished walls',
      'Permit and inspection costs in {city}',
      'CSA code compliance requirements',
      'Local electrician rates in {city}',
    ],
    tips: [
      'Combine electrical work with renovations to avoid reopening walls.',
      'Upgrade to a 200A panel during any rewire for future capacity.',
      'Ask about federal/provincial rebates for EV chargers and heat pumps in {city}.',
      'Replace knob-and-tube or aluminium wiring to satisfy insurers.',
    ],
    faqs: [
      { q: 'How much does an electrician cost in {city}?', a: 'Electricians in {city} charge C$75–140/hr plus a service-call fee. Panel upgrades and rewiring cost more.' },
      { q: 'Do I need a permit for electrical work in {city}?', a: 'Yes. Most electrical work in {city} beyond simple fixture swaps requires a permit and inspection through the provincial safety authority.' },
      { q: 'How much is a panel upgrade in {city}?', a: 'A 100A to 200A panel upgrade in {city} costs C$2,000–4,500 depending on the service and any rewiring.' },
      { q: 'How do I find a licensed electrician in {city}?', a: 'Biddaro connects you with verified, licensed electricians in {city}. Compare quotes, check licensing, and read reviews.' },
    ],
    relatedSlugs: ['general-construction', 'plumbing', 'hvac'],
  },
  {
    slug: 'painting',
    name: 'Painting',
    emoji: '🎨',
    headline: 'Painting Cost in Canada 2026',
    metaDesc: 'Find accurate house painting costs in {city}. Compare interior and exterior painting rates from verified painters on Biddaro.',
    intro: 'Painting costs in {city} depend on interior vs exterior, surface area, condition, and paint quality. Exterior painting is seasonal due to Canadian temperatures.',
    avgLow: 'C$3', avgHigh: 'C$7', avgUnit: 'per sq ft',
    items: [
      { label: 'Interior Painting (walls)', low: 'C$3', high: 'C$7', unit: 'per sq ft' },
      { label: 'Exterior Painting', low: 'C$2.50', high: 'C$6', unit: 'per sq ft' },
      { label: 'Ceiling Painting', low: 'C$1.50', high: 'C$4', unit: 'per sq ft' },
      { label: 'Trim & Moulding', low: 'C$1.50', high: 'C$4', unit: 'per linear ft' },
      { label: 'Door Painting', low: 'C$80', high: 'C$200', unit: 'per door' },
      { label: 'Cabinet Painting', low: 'C$40', high: 'C$100', unit: 'per linear ft' },
      { label: '3-Bedroom Interior Repaint', low: 'C$3,500', high: 'C$8,000', unit: 'per home' },
      { label: 'Deck / Fence Staining', low: 'C$2', high: 'C$5', unit: 'per sq ft' },
    ],
    factors: [
      'Total surface area and room count',
      'Paint quality — standard vs premium (Benjamin Moore, Dulux)',
      'Surface prep — patching, sanding, priming',
      'Ceiling height and access',
      'Lead-paint precautions for pre-1960 homes',
      'Interior vs exterior and season',
    ],
    tips: [
      'Get at least 3 quotes specifying product, coats, and prep.',
      'Premium paint covers in fewer coats and lasts longer.',
      'Book exterior painting for late spring through early fall.',
      'Ask about workmanship warranty — reputable painters offer 2–5 years.',
    ],
    faqs: [
      { q: 'How much does it cost to paint a house interior in {city}?', a: 'Interior painting in {city} costs C$3–7/sq ft, or roughly C$3,500–8,000 for a standard home.' },
      { q: 'How much does exterior painting cost in {city}?', a: 'Exterior painting in {city} costs C$2.50–6/sq ft including prep. A standard home exterior runs C$5,000–12,000.' },
      { q: 'When can exterior painting be done in {city}?', a: 'Exterior painting in {city} is best from late spring to early fall when temperatures stay above the paint’s minimum.' },
      { q: 'Do painters need a licence in {city}?', a: 'Painting is generally not licensed in {city}, but confirm liability insurance and WSIB/WCB coverage before hiring.' },
    ],
    relatedSlugs: ['general-construction', 'renovation', 'carpentry'],
  },
  {
    slug: 'flooring',
    name: 'Flooring',
    emoji: '🪵',
    headline: 'Flooring Installation Cost in Canada 2026',
    metaDesc: 'Find accurate flooring costs in {city}. Compare hardwood, laminate, vinyl, tile, and carpet rates from verified contractors on Biddaro.',
    intro: 'Flooring costs in {city} vary by material, area, subfloor condition, and complexity. Popular choices include luxury vinyl plank, engineered hardwood, tile, and carpet.',
    avgLow: 'C$5', avgHigh: 'C$18', avgUnit: 'per sq ft installed',
    items: [
      { label: 'Laminate Flooring', low: 'C$4', high: 'C$8', unit: 'per sq ft installed' },
      { label: 'Luxury Vinyl Plank (LVP)', low: 'C$5', high: 'C$10', unit: 'per sq ft installed' },
      { label: 'Engineered Hardwood', low: 'C$9', high: 'C$16', unit: 'per sq ft installed' },
      { label: 'Solid Hardwood', low: 'C$10', high: 'C$20', unit: 'per sq ft installed' },
      { label: 'Porcelain / Ceramic Tile', low: 'C$8', high: 'C$18', unit: 'per sq ft installed' },
      { label: 'Carpet Installation', low: 'C$3', high: 'C$9', unit: 'per sq ft installed' },
      { label: 'Subfloor Repair / Levelling', low: 'C$2', high: 'C$7', unit: 'per sq ft' },
      { label: 'Old Flooring Removal', low: 'C$1', high: 'C$4', unit: 'per sq ft' },
    ],
    factors: [
      'Material type and quality grade',
      'Area size and layout complexity',
      'Subfloor condition and levelling',
      'Basement moisture considerations',
      'Removal and disposal of old flooring',
      'Local installer rates in {city}',
    ],
    tips: [
      'LVP offers the best value — waterproof and durable for basements.',
      'Order 10% extra material for cuts, waste, and repairs.',
      'Compare installed prices, not material-only quotes.',
      'Use moisture-tolerant flooring in basements common across {city}.',
    ],
    faqs: [
      { q: 'What is the cheapest flooring in {city}?', a: 'Laminate and LVP are most affordable in {city} at C$4–10/sq ft installed, with LVP prized for water resistance.' },
      { q: 'How much does hardwood flooring cost in {city}?', a: 'Engineered hardwood in {city} costs C$9–16/sq ft installed; solid hardwood runs C$10–20/sq ft.' },
      { q: 'How long does flooring installation take?', a: 'A 1,000 sq ft job takes 2–5 days depending on material and subfloor prep.' },
      { q: 'What flooring is best for basements in {city}?', a: 'LVP and tile are best for basements in {city} due to moisture resistance; avoid solid hardwood below grade.' },
    ],
    relatedSlugs: ['general-construction', 'renovation', 'tiling'],
  },
  {
    slug: 'roofing',
    name: 'Roofing',
    emoji: '🏠',
    headline: 'Roofing Cost in Canada 2026',
    metaDesc: 'Get accurate roofing costs in {city}. Compare asphalt shingle, metal, and flat roof rates from verified roofers on Biddaro.',
    intro: 'Roofing costs in {city} depend on material, roof size and pitch, and whether it is a repair or full replacement. Roofs must handle snow loads and ice damming.',
    avgLow: 'C$7,000', avgHigh: 'C$25,000', avgUnit: 'per roof (avg home)',
    items: [
      { label: 'Asphalt Shingle (architectural)', low: 'C$5', high: 'C$9', unit: 'per sq ft' },
      { label: 'Metal Roofing (standing seam)', low: 'C$10', high: 'C$18', unit: 'per sq ft' },
      { label: 'Flat Roof (EPDM / TPO)', low: 'C$7', high: 'C$14', unit: 'per sq ft' },
      { label: 'Roof Repair (leak/patch)', low: 'C$400', high: 'C$1,800', unit: 'per repair' },
      { label: 'Tear-Off & Disposal', low: 'C$1.50', high: 'C$3.50', unit: 'per sq ft' },
      { label: 'Ice & Water Shield', low: 'C$1.50', high: 'C$3', unit: 'per sq ft' },
      { label: 'Eavestrough Replacement', low: 'C$8', high: 'C$18', unit: 'per linear ft' },
      { label: 'Skylight Installation', low: 'C$1,000', high: 'C$3,500', unit: 'per unit' },
    ],
    factors: [
      'Roof size, pitch, and access',
      'Material — asphalt, metal, or flat membrane',
      'Number of layers to tear off',
      'Ice & water shield and ventilation needs',
      'Snow-load and code requirements in {city}',
      'Permit and inspection fees',
    ],
    tips: [
      'Combine a re-roof with eavestrough replacement to save on access.',
      'Architectural shingles cost a little more but last 10–15 years longer.',
      'Ensure proper attic ventilation to prevent ice dams in {city}.',
      'Ask about product and workmanship warranties before signing.',
    ],
    faqs: [
      { q: 'How much does a new roof cost in {city}?', a: 'An asphalt shingle roof in {city} costs C$7,000–18,000 for an average home; metal runs C$15,000–35,000 and lasts far longer.' },
      { q: 'How long does a roof replacement take in {city}?', a: 'Most asphalt roof replacements in {city} take 1–3 days; metal or complex roofs take longer.' },
      { q: 'When is the best time to roof in {city}?', a: 'Late spring through fall is ideal in {city} so shingles seal properly in mild temperatures.' },
      { q: 'Do I need a permit to re-roof in {city}?', a: 'Many municipalities in {city} require a permit for roof replacement. Your roofer typically handles it.' },
    ],
    relatedSlugs: ['general-construction', 'painting', 'carpentry'],
  },
  {
    slug: 'hvac',
    name: 'HVAC',
    emoji: '❄️',
    headline: 'HVAC Cost in Canada 2026',
    metaDesc: 'Get accurate HVAC costs in {city}. Compare furnace, heat pump, and AC installation rates from licensed technicians on Biddaro.',
    intro: 'HVAC costs in {city} depend on system type, home size, and ductwork. Reliable heating is essential through Canadian winters, and work must meet provincial gas and refrigerant rules.',
    avgLow: 'C$4,000', avgHigh: 'C$18,000', avgUnit: 'per system',
    items: [
      { label: 'High-Efficiency Furnace', low: 'C$4,000', high: 'C$8,000', unit: 'per unit' },
      { label: 'Cold-Climate Heat Pump', low: 'C$6,000', high: 'C$15,000', unit: 'per unit' },
      { label: 'Central AC Installation', low: 'C$4,000', high: 'C$9,000', unit: 'per unit' },
      { label: 'Ductwork Installation / Repair', low: 'C$2,500', high: 'C$7,000', unit: 'per system' },
      { label: 'Ductless Mini-Split (per zone)', low: 'C$3,000', high: 'C$6,000', unit: 'per zone' },
      { label: 'Furnace / AC Repair', low: 'C$150', high: 'C$700', unit: 'per visit' },
      { label: 'Smart Thermostat Install', low: 'C$150', high: 'C$400', unit: 'per unit' },
      { label: 'Annual Maintenance', low: 'C$120', high: 'C$300', unit: 'per visit' },
    ],
    factors: [
      'Home size, layout, and insulation',
      'System type — furnace, heat pump, or AC',
      'Efficiency rating (AFUE / SEER / HSPF)',
      'Existing ductwork condition',
      'Climate zone in {city}',
      'Permit and gas-fitting requirements',
    ],
    tips: [
      'Consider a cold-climate heat pump — eligible for federal and provincial rebates.',
      'Size equipment to the home; oversized units cycle inefficiently.',
      'Install in spring or fall for shorter wait times and better pricing.',
      'Book annual maintenance to avoid mid-winter breakdowns in {city}.',
    ],
    faqs: [
      { q: 'How much does a furnace cost in {city}?', a: 'A high-efficiency furnace in {city} costs C$4,000–8,000 installed. Cold-climate heat pumps run C$6,000–15,000 before rebates.' },
      { q: 'Do HVAC technicians need a licence in {city}?', a: 'Yes. Gas work in {city} requires certification (e.g. a provincial gas technician licence) and refrigerant handling an ODP card.' },
      { q: 'Furnace or heat pump in {city}?', a: 'Many homes in {city} pair a cold-climate heat pump with a backup furnace for efficiency and winter reliability — rebates can offset the cost.' },
      { q: 'How do I find a licensed HVAC tech in {city}?', a: 'Find certified HVAC technicians on Biddaro in {city}. Compare quotes, verify credentials, and read reviews.' },
    ],
    relatedSlugs: ['electrical', 'general-construction', 'renovation'],
  },
  {
    slug: 'carpentry',
    name: 'Carpentry & Decks',
    emoji: '🪚',
    headline: 'Carpentry & Deck Cost in Canada 2026',
    metaDesc: 'Find accurate carpentry and deck costs in {city}. Compare framing, decks, and finish carpentry rates from verified carpenters on Biddaro.',
    intro: 'Carpentry costs in {city} vary by job — framing, decks, trim, or custom cabinetry. Structural work must meet the provincial building code, and decks over a set height need a permit.',
    avgLow: 'C$45', avgHigh: 'C$100', avgUnit: 'per hour',
    items: [
      { label: 'Pressure-Treated Deck', low: 'C$25', high: 'C$45', unit: 'per sq ft' },
      { label: 'Composite Deck', low: 'C$40', high: 'C$65', unit: 'per sq ft' },
      { label: 'Framing', low: 'C$15', high: 'C$30', unit: 'per sq ft' },
      { label: 'Finish Carpentry (trim)', low: 'C$5', high: 'C$14', unit: 'per linear ft' },
      { label: 'Interior Door Install', low: 'C$150', high: 'C$400', unit: 'per door' },
      { label: 'Custom Built-ins', low: 'C$75', high: 'C$250', unit: 'per linear ft' },
      { label: 'Cabinet Installation', low: 'C$100', high: 'C$300', unit: 'per cabinet' },
      { label: 'Window Install', low: 'C$400', high: 'C$1,000', unit: 'per window' },
    ],
    factors: [
      'Type of carpentry — framing, finish, or custom',
      'Material — SPF lumber, cedar, or composite',
      'Design complexity and detailing',
      'Structural vs non-structural work',
      'Permit requirements for decks/additions in {city}',
      'Local carpenter rates in {city}',
    ],
    tips: [
      'Pressure-treated framing with a composite surface balances cost and upkeep.',
      'Get quotes that separate material and labour.',
      'Build decks before frost; footings must reach below the frost line in {city}.',
      'Confirm whether your deck or addition needs a permit before building.',
    ],
    faqs: [
      { q: 'How much does a deck cost in {city}?', a: 'A pressure-treated deck in {city} costs C$25–45/sq ft; composite runs C$40–65/sq ft. A 200 sq ft deck typically costs C$5,000–13,000.' },
      { q: 'How much does a carpenter charge per hour in {city}?', a: 'Carpenters in {city} charge C$45–100/hr; finish and custom work sit at the higher end.' },
      { q: 'Do I need a permit for a deck in {city}?', a: 'Decks above a set height and additions in {city} need a building permit, with footings below the frost line.' },
      { q: 'How do I find a carpenter in {city}?', a: 'Compare verified carpenters on Biddaro in {city}. Review portfolios, check insurance, and get at least 3 quotes.' },
    ],
    relatedSlugs: ['general-construction', 'renovation', 'flooring'],
  },
  {
    slug: 'tiling',
    name: 'Tiling',
    emoji: '🧱',
    headline: 'Tiling Cost in Canada 2026',
    metaDesc: 'Find accurate tiling costs in {city}. Compare bathroom, kitchen, and floor tiling rates plus heated floors from verified installers on Biddaro.',
    intro: 'Tiling costs in {city} depend on tile type, area, and surface prep. Shower waterproofing and heated floors are common additions in Canadian bathrooms.',
    avgLow: 'C$8', avgHigh: 'C$20', avgUnit: 'per sq ft',
    items: [
      { label: 'Floor Tiling (labour)', low: 'C$8', high: 'C$16', unit: 'per sq ft' },
      { label: 'Wall Tiling', low: 'C$10', high: 'C$20', unit: 'per sq ft' },
      { label: 'Backsplash', low: 'C$12', high: 'C$30', unit: 'per sq ft' },
      { label: 'Natural Stone Tiling', low: 'C$15', high: 'C$30', unit: 'per sq ft' },
      { label: 'Shower Waterproofing', low: 'C$600', high: 'C$1,500', unit: 'per shower' },
      { label: 'Heated Floor System', low: 'C$12', high: 'C$25', unit: 'per sq ft' },
      { label: 'Tile Removal', low: 'C$2', high: 'C$5', unit: 'per sq ft' },
      { label: 'Levelling / Underlayment', low: 'C$2', high: 'C$6', unit: 'per sq ft' },
    ],
    factors: [
      'Tile type, size, and finish',
      'Area and surface condition',
      'Waterproofing and heated-floor options',
      'Pattern complexity',
      'Removal of existing tile',
      'Local installer rates in {city}',
    ],
    tips: [
      'Add an electric heated floor in bathrooms for comfort in cold {city} winters.',
      'Budget for proper shower waterproofing — it prevents costly damage.',
      'Large-format tiles need a level substrate; factor in underlayment.',
      'Buy 10% extra tile for cuts and future repairs.',
    ],
    faqs: [
      { q: 'How much does tiling cost in {city}?', a: 'Tiling labour in {city} costs C$8–20/sq ft plus tile. Shower waterproofing adds C$600–1,500 and heated floors more.' },
      { q: 'Should I add a heated floor in {city}?', a: 'Heated floors are popular in {city} bathrooms for winter comfort, adding roughly C$12–25/sq ft to the tile job.' },
      { q: 'How long does it take to tile a bathroom?', a: 'Tiling a standard bathroom in {city} takes 3–5 days including waterproofing and cure time.' },
      { q: 'How do I find a tile installer in {city}?', a: 'Compare verified tile installers on Biddaro in {city}. Review work, check references, and get quotes.' },
    ],
    relatedSlugs: ['renovation', 'flooring', 'general-construction'],
  },
  {
    slug: 'renovation',
    name: 'Home Renovation',
    emoji: '🛠️',
    headline: 'Home Renovation Cost in Canada 2026',
    metaDesc: 'Get accurate renovation costs in {city}. Compare kitchen, bathroom, and basement rates from verified renovation contractors on Biddaro.',
    intro: 'Renovation costs in {city} range from a cosmetic refresh to a basement suite or addition. Structural work requires permits, provincial-code compliance, and inspections.',
    avgLow: 'C$15,000', avgHigh: 'C$100,000', avgUnit: 'per project',
    items: [
      { label: 'Bathroom Renovation', low: 'C$12,000', high: 'C$28,000', unit: 'per bathroom' },
      { label: 'Kitchen Renovation', low: 'C$20,000', high: 'C$50,000', unit: 'per kitchen' },
      { label: 'Basement Finishing', low: 'C$35', high: 'C$75', unit: 'per sq ft' },
      { label: 'Basement Legal Suite', low: 'C$50,000', high: 'C$120,000', unit: 'per suite' },
      { label: 'Room Addition', low: 'C$250', high: 'C$500', unit: 'per sq ft' },
      { label: 'Whole-Home Cosmetic Reno', low: 'C$40,000', high: 'C$120,000', unit: 'per home' },
      { label: 'Window Replacement (whole home)', low: 'C$8,000', high: 'C$25,000', unit: 'per home' },
      { label: 'Structural Wall Removal', low: 'C$2,500', high: 'C$7,000', unit: 'per wall' },
    ],
    factors: [
      'Scope — cosmetic vs structural',
      'Fixture and finish grade',
      'Plumbing/electrical relocation',
      'Permit and inspection requirements',
      'Basement egress and ceiling-height rules for suites',
      'Local trade rates in {city}',
    ],
    tips: [
      'Keep plumbing in place to avoid costly re-routing.',
      'Add a legal basement suite to generate rental income in {city}.',
      'Prioritise kitchens and bathrooms for the best resale return.',
      'Confirm permits and inspections are included in the quote.',
    ],
    faqs: [
      { q: 'How much does a renovation cost in {city}?', a: 'In {city}, a bathroom runs C$12,000–28,000, a kitchen C$20,000–50,000, and basement finishing C$35–75/sq ft.' },
      { q: 'Do I need a permit to renovate in {city}?', a: 'Cosmetic updates usually don’t, but structural changes, basement suites, and moving plumbing or electrical in {city} require permits.' },
      { q: 'How long does a basement finish take in {city}?', a: 'Finishing a basement in {city} takes 4–8 weeks depending on size, plumbing, and inspections.' },
      { q: 'How do I find a renovation contractor in {city}?', a: 'Use Biddaro to compare verified renovation contractors in {city}. Check licensing and insurance, read reviews, and get detailed quotes.' },
    ],
    relatedSlugs: ['general-construction', 'plumbing', 'tiling'],
  },
];
