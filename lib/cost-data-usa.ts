// ─── Construction Cost Guide Data for USA ─────────────────────────────────────
// Powers /us/cost/[service] and /us/cost/[service]/[city] pages
// All prices in USD (United States Dollar)

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

export function getUSACostService(slug: string): CostServiceMeta | undefined {
  return USA_COST_SERVICES.find(s => s.slug === slug);
}

export function getRelatedUSACostServices(slug: string): CostServiceMeta[] {
  const svc = getUSACostService(slug);
  if (!svc) return [];
  return svc.relatedSlugs.map(s => getUSACostService(s)).filter(Boolean) as CostServiceMeta[];
}

export const USA_COST_SERVICES: CostServiceMeta[] = [
  {
    slug: 'general-construction',
    name: 'House Construction',
    emoji: '🏗️',
    headline: 'House Construction Cost in USA 2026',
    metaDesc: 'Get accurate house construction costs in {city}. Compare rates per sqft for budget, standard, and custom builds from verified contractors on Biddaro.',
    intro: 'Building a house in {city} is one of the largest investments you will make. Construction costs vary significantly based on materials, design complexity, local labor rates, and compliance with ICC building codes.',
    avgLow: '$150', avgHigh: '$400', avgUnit: 'per sq ft',
    items: [
      { label: 'Budget Construction (Basic Finish)', low: '$100', high: '$150', unit: 'per sq ft' },
      { label: 'Standard Construction', low: '$150', high: '$250', unit: 'per sq ft' },
      { label: 'Premium Construction', low: '$250', high: '$400', unit: 'per sq ft' },
      { label: 'Custom / Luxury Construction', low: '$400', high: '$700', unit: 'per sq ft' },
      { label: 'Foundation (Poured Concrete)', low: '$8', high: '$25', unit: 'per sq ft' },
      { label: 'Framing', low: '$7', high: '$16', unit: 'per sq ft' },
      { label: 'Roofing (Asphalt Shingle)', low: '$4', high: '$10', unit: 'per sq ft' },
      { label: 'Flooring (Hardwood)', low: '$6', high: '$18', unit: 'per sq ft' },
    ],
    factors: [
      'Lot location and soil conditions in {city}',
      'Number of stories and total square footage',
      'Foundation type — slab, crawl space, or full basement',
      'Quality of materials (lumber grade, insulation type)',
      'Local labor rates and contractor availability',
      'Building permit and impact fees in {city}',
      'Utility hookups — water, sewer, electric, gas',
      'Energy code compliance (IECC standards)',
    ],
    tips: [
      'Get at least 3–5 detailed bids on Biddaro before choosing a contractor in {city}.',
      'Build during off-peak months (late fall/winter) for 10–15% savings on labor in many regions.',
      'Choose standard-sized windows and doors to avoid custom fabrication premiums.',
      'Consider energy-efficient construction — higher upfront cost but lower utility bills long-term.',
      'Negotiate material allowances separately from labor to keep costs transparent.',
    ],
    faqs: [
      { q: 'How much does it cost to build a house in {city}?', a: 'New home construction in {city} typically costs $150–400 per square foot depending on quality, size, and lot conditions. A standard 2,000 sqft home costs $300,000–800,000 for full construction including site work.' },
      { q: 'What permits do I need to build a home in {city}?', a: 'In {city}, you will need a building permit, grading permit (if applicable), plumbing permit, electrical permit, and mechanical (HVAC) permit. Your general contractor typically handles all permit applications.' },
      { q: 'How long does it take to build a house in {city}?', a: 'A standard single-family home in {city} takes 8–14 months from ground-breaking to move-in. Custom homes or complex builds may take 14–24 months depending on design and weather conditions.' },
      { q: 'What is the cheapest way to build a house in {city}?', a: 'The most cost-effective approach in {city} is a simple rectangular floor plan on a slab foundation, standard materials, and competitive bidding through Biddaro. Prefab and modular options can also reduce costs by 15–25%.' },
    ],
    relatedSlugs: ['plumbing', 'electrical', 'painting', 'flooring'],
  },
  {
    slug: 'plumbing',
    name: 'Plumbing',
    emoji: '🔧',
    headline: 'Plumbing Cost in USA 2026',
    metaDesc: 'Find accurate plumbing costs in {city}. Compare hourly rates and project costs for repairs, installations, and repiping from licensed plumbers on Biddaro.',
    intro: 'Plumbing costs in {city} vary based on the scope of work, pipe material, and whether the job is a repair or new installation. Licensed plumbers must follow the International Plumbing Code (IPC) or Uniform Plumbing Code (UPC).',
    avgLow: '$45', avgHigh: '$200', avgUnit: 'per hour',
    items: [
      { label: 'Faucet Repair / Replacement', low: '$120', high: '$350', unit: 'per job' },
      { label: 'Toilet Installation', low: '$200', high: '$500', unit: 'per unit' },
      { label: 'Water Heater Replacement', low: '$800', high: '$3,000', unit: 'per unit' },
      { label: 'Drain Cleaning', low: '$100', high: '$400', unit: 'per job' },
      { label: 'Whole-House Repiping (Copper)', low: '$4,000', high: '$15,000', unit: 'per house' },
      { label: 'Whole-House Repiping (PEX)', low: '$2,500', high: '$8,000', unit: 'per house' },
      { label: 'Sewer Line Repair', low: '$1,500', high: '$6,000', unit: 'per job' },
      { label: 'Bathroom Rough-In', low: '$1,500', high: '$4,000', unit: 'per bathroom' },
    ],
    factors: [
      'Complexity and accessibility of the plumbing system',
      'Pipe material — PEX, copper, or CPVC',
      'Emergency vs. scheduled service rates',
      'Permit and inspection fees in {city}',
      'Age of the existing plumbing system',
      'Local labor rates in {city}',
    ],
    tips: [
      'Bundle multiple plumbing jobs together for a volume discount.',
      'Choose PEX over copper for repiping — 30–50% cheaper with comparable lifespan.',
      'Schedule non-emergency work during weekdays to avoid weekend/overtime rates.',
      'Always verify the plumber is licensed and insured in {city} before work begins.',
    ],
    faqs: [
      { q: 'How much does a plumber cost per hour in {city}?', a: 'Plumbers in {city} charge $45–200/hr depending on the job type, time of day, and urgency. Emergency calls and after-hours service cost 1.5–2x the standard rate.' },
      { q: 'Do I need a permit for plumbing work in {city}?', a: 'Yes. In {city}, permits are required for new installations, repiping, water heater replacements, and sewer line work. Minor repairs like faucet replacement typically do not require permits.' },
      { q: 'How long does a whole-house repiping take?', a: 'A whole-house repiping in {city} takes 2–5 days depending on home size, pipe material, and accessibility. PEX repiping is faster than copper.' },
      { q: 'How do I find a licensed plumber in {city}?', a: 'Use Biddaro to compare verified, licensed plumbers in {city}. Read reviews, compare quotes, and check credentials in one place.' },
    ],
    relatedSlugs: ['general-construction', 'electrical', 'bathroom-remodeling'],
  },
  {
    slug: 'electrical',
    name: 'Electrical',
    emoji: '⚡',
    headline: 'Electrical Work Cost in USA 2026',
    metaDesc: 'Get accurate electrical work costs in {city}. Compare rates for panel upgrades, rewiring, and EV charger installations from licensed electricians on Biddaro.',
    intro: 'Electrical work costs in {city} depend on the scope, complexity, and whether the work requires a panel upgrade. All electrical work must comply with the National Electrical Code (NEC) and local amendments.',
    avgLow: '$50', avgHigh: '$200', avgUnit: 'per hour',
    items: [
      { label: 'Outlet / Switch Installation', low: '$100', high: '$250', unit: 'per point' },
      { label: 'Panel Upgrade (100A to 200A)', low: '$1,500', high: '$4,000', unit: 'per panel' },
      { label: 'Whole-House Rewiring', low: '$8,000', high: '$30,000', unit: 'per house' },
      { label: 'EV Charger Installation (Level 2)', low: '$800', high: '$2,500', unit: 'per unit' },
      { label: 'Recessed Lighting (per light)', low: '$150', high: '$400', unit: 'per light' },
      { label: 'Ceiling Fan Installation', low: '$150', high: '$350', unit: 'per fan' },
      { label: 'Smoke / CO Detector Install', low: '$50', high: '$150', unit: 'per unit' },
      { label: 'Generator Installation (Whole-Home)', low: '$6,000', high: '$15,000', unit: 'per unit' },
    ],
    factors: [
      'Age and condition of existing wiring',
      'Panel capacity and upgrade requirements',
      'Accessibility — open wall vs. finished wall',
      'Permit and inspection costs in {city}',
      'NEC code compliance requirements',
      'Local electrician hourly rates in {city}',
    ],
    tips: [
      'Combine electrical work with other renovations to avoid duplicate wall-opening costs.',
      'Upgrade your panel to 200A during renovation — cheaper than a standalone upgrade later.',
      'Ask about available rebates for EV charger and solar installations in {city}.',
      'Schedule inspections promptly to avoid project delays.',
    ],
    faqs: [
      { q: 'How much does an electrician cost in {city}?', a: 'Electricians in {city} charge $50–200/hr depending on the job. Simple tasks like outlet installs cost less, while panel upgrades and whole-house rewiring command premium rates.' },
      { q: 'Do I need a permit for electrical work in {city}?', a: 'Yes. Most electrical work in {city} beyond simple fixture swaps requires a permit and inspection per NEC and local codes.' },
      { q: 'How long does a panel upgrade take?', a: 'A 100A to 200A panel upgrade in {city} typically takes 6–10 hours. Your electrician will coordinate the power shutoff with the utility company.' },
      { q: 'How do I find a licensed electrician in {city}?', a: 'Biddaro connects you with verified, NEC-certified electricians in {city}. Compare quotes, check reviews, and hire with confidence.' },
    ],
    relatedSlugs: ['general-construction', 'plumbing', 'hvac'],
  },
  {
    slug: 'painting',
    name: 'Painting',
    emoji: '🎨',
    headline: 'Painting Cost in USA 2026',
    metaDesc: 'Find accurate house painting costs in {city}. Compare interior and exterior painting rates per sqft from verified painters on Biddaro.',
    intro: 'Painting costs in {city} depend on interior vs. exterior, square footage, surface condition, and paint quality. Painters working on pre-1978 homes must be EPA Lead-Safe (RRP) certified.',
    avgLow: '$2', avgHigh: '$6', avgUnit: 'per sq ft',
    items: [
      { label: 'Interior Painting (walls only)', low: '$2', high: '$6', unit: 'per sq ft' },
      { label: 'Exterior Painting', low: '$1.50', high: '$5', unit: 'per sq ft' },
      { label: 'Cabinet Painting (per linear ft)', low: '$30', high: '$80', unit: 'per linear ft' },
      { label: 'Ceiling Painting', low: '$1', high: '$3', unit: 'per sq ft' },
      { label: 'Trim & Molding Painting', low: '$1', high: '$4', unit: 'per linear ft' },
      { label: 'Deck / Fence Staining', low: '$2', high: '$5', unit: 'per sq ft' },
      { label: 'Wallpaper Removal', low: '$1', high: '$4', unit: 'per sq ft' },
      { label: 'Popcorn Ceiling Removal', low: '$1.50', high: '$3', unit: 'per sq ft' },
    ],
    factors: [
      'Total surface area and room count',
      'Paint quality — builder grade vs. premium (Sherwin-Williams, Benjamin Moore)',
      'Surface preparation needs (patching, sanding, priming)',
      'Ceiling height — standard 8ft vs. vaulted',
      'Lead paint abatement requirements for pre-1978 homes',
      'Interior vs. exterior and accessibility',
    ],
    tips: [
      'Get at least 3 detailed quotes that specify paint brand, number of coats, and prep work.',
      'Buying paint yourself can sometimes save 10–20% vs. contractor markup.',
      'Schedule exterior painting during dry weather for the best adhesion and finish.',
      'Ask painters about their warranty — reputable painters offer 2–5 year workmanship guarantees.',
    ],
    faqs: [
      { q: 'How much does it cost to paint a house interior in {city}?', a: 'Interior painting in {city} costs $2–6/sqft. A typical 2,000 sqft home costs $4,000–12,000 depending on room count, ceiling height, and paint quality.' },
      { q: 'How much does exterior painting cost in {city}?', a: 'Exterior painting in {city} costs $1.50–5/sqft. A standard 2-story home (2,500 sqft exterior) costs $3,750–12,500 including prep and two coats.' },
      { q: 'How long does it take to paint a house in {city}?', a: 'A professional crew can paint a 3-bedroom interior in 2–4 days. Exterior painting takes 3–7 days depending on prep work and weather.' },
      { q: 'Do painters need a license in {city}?', a: 'Most areas in {city} require a business license. Painters working on pre-1978 homes must be EPA RRP certified. Check local requirements before hiring.' },
    ],
    relatedSlugs: ['general-construction', 'carpentry', 'flooring'],
  },
  {
    slug: 'flooring',
    name: 'Flooring',
    emoji: '🪵',
    headline: 'Flooring Installation Cost in USA 2026',
    metaDesc: 'Find accurate flooring costs in {city}. Compare hardwood, tile, vinyl, and laminate installation rates from verified contractors on Biddaro.',
    intro: 'Flooring costs in {city} vary by material type, room size, subfloor condition, and installation complexity. Popular choices include hardwood, luxury vinyl plank (LVP), tile, and laminate.',
    avgLow: '$3', avgHigh: '$15', avgUnit: 'per sq ft installed',
    items: [
      { label: 'Hardwood Flooring (solid)', low: '$8', high: '$18', unit: 'per sq ft installed' },
      { label: 'Engineered Hardwood', low: '$6', high: '$14', unit: 'per sq ft installed' },
      { label: 'Luxury Vinyl Plank (LVP)', low: '$3', high: '$8', unit: 'per sq ft installed' },
      { label: 'Laminate Flooring', low: '$2', high: '$6', unit: 'per sq ft installed' },
      { label: 'Porcelain / Ceramic Tile', low: '$5', high: '$15', unit: 'per sq ft installed' },
      { label: 'Carpet Installation', low: '$2', high: '$8', unit: 'per sq ft installed' },
      { label: 'Old Flooring Removal', low: '$1', high: '$4', unit: 'per sq ft' },
      { label: 'Subfloor Repair / Leveling', low: '$2', high: '$7', unit: 'per sq ft' },
    ],
    factors: [
      'Material type and quality grade',
      'Room size and layout complexity',
      'Subfloor condition and leveling needs',
      'Removal and disposal of existing flooring',
      'Moisture testing and underlayment requirements',
      'Pattern complexity (herringbone, diagonal, etc.)',
    ],
    tips: [
      'LVP offers the best value — waterproof, durable, and 50% cheaper than hardwood.',
      'Order 10% extra material to account for cuts, waste, and future repairs.',
      'Remove old flooring yourself to save $1–4/sqft on demolition labor.',
      'Compare installed prices (material + labor) rather than material-only quotes.',
    ],
    faqs: [
      { q: 'What is the cheapest flooring option in {city}?', a: 'Laminate and vinyl plank are the most affordable at $2–8/sqft installed in {city}. LVP is especially popular for its water resistance and realistic wood appearance.' },
      { q: 'How much does hardwood flooring cost in {city}?', a: 'Solid hardwood flooring in {city} costs $8–18/sqft installed. Engineered hardwood runs $6–14/sqft and is better for basements and areas with humidity.' },
      { q: 'How long does flooring installation take?', a: 'A 1,000 sqft flooring job takes 2–5 days depending on material type, subfloor prep, and layout pattern.' },
      { q: 'Should I choose hardwood or LVP for my home in {city}?', a: 'LVP is better for high-traffic areas, kitchens, and basements due to water resistance. Hardwood adds more resale value and is preferred for living rooms and bedrooms.' },
    ],
    relatedSlugs: ['general-construction', 'painting', 'carpentry'],
  },
  {
    slug: 'roofing',
    name: 'Roofing',
    emoji: '🏠',
    headline: 'Roofing Cost in USA 2026',
    metaDesc: 'Get accurate roofing costs in {city}. Compare shingle, metal, and flat roof installation and repair rates from licensed roofers on Biddaro.',
    intro: 'Roofing costs in {city} depend on material type, roof size and pitch, underlayment requirements, and whether it is a repair, overlay, or full tear-off replacement.',
    avgLow: '$5,000', avgHigh: '$30,000', avgUnit: 'per roof (avg. home)',
    items: [
      { label: 'Asphalt Shingle (3-tab)', low: '$3.50', high: '$6', unit: 'per sq ft' },
      { label: 'Architectural Shingle', low: '$4', high: '$8', unit: 'per sq ft' },
      { label: 'Metal Roofing (Standing Seam)', low: '$8', high: '$16', unit: 'per sq ft' },
      { label: 'Flat Roof (TPO / EPDM)', low: '$5', high: '$12', unit: 'per sq ft' },
      { label: 'Roof Repair (patch / leak)', low: '$300', high: '$1,500', unit: 'per repair' },
      { label: 'Tear-Off & Disposal', low: '$1', high: '$3', unit: 'per sq ft' },
      { label: 'Gutter Installation', low: '$4', high: '$12', unit: 'per linear ft' },
      { label: 'Skylight Installation', low: '$1,000', high: '$3,500', unit: 'per unit' },
    ],
    factors: [
      'Roof size (measured in "squares" — 100 sqft each)',
      'Material type — asphalt, metal, tile, or flat membrane',
      'Roof pitch and accessibility',
      'Number of layers to tear off',
      'Local building codes and wind rating requirements',
      'Permit and inspection fees in {city}',
    ],
    tips: [
      'Get quotes during late fall or winter when roofers are less busy for 10–20% savings.',
      'Architectural shingles cost only $1–2/sqft more than 3-tab but last 10–15 years longer.',
      'Check if your homeowner insurance covers storm damage before paying out of pocket.',
      'Always ask about manufacturer warranty (shingles) and workmanship warranty (labor).',
    ],
    faqs: [
      { q: 'How much does a new roof cost in {city}?', a: 'A new asphalt shingle roof in {city} costs $5,000–15,000 for an average-sized home. Metal roofing runs $15,000–30,000+ but lasts 40–70 years.' },
      { q: 'How long does a roof replacement take in {city}?', a: 'Most residential roof replacements in {city} take 1–3 days for asphalt shingles. Metal or tile roofs may take 5–7 days.' },
      { q: 'How often should I replace my roof?', a: 'Asphalt 3-tab shingles last 15–20 years, architectural shingles 25–30 years, and metal roofs 40–70 years. Get an inspection every 3–5 years.' },
      { q: 'Do I need a permit for roof replacement in {city}?', a: 'Yes. Most jurisdictions in {city} require a building permit for roof replacement. Your roofing contractor typically handles the permit application.' },
    ],
    relatedSlugs: ['general-construction', 'painting', 'gutters'],
  },
  {
    slug: 'hvac',
    name: 'HVAC',
    emoji: '❄️',
    headline: 'HVAC Cost in USA 2026',
    metaDesc: 'Get accurate HVAC installation and repair costs in {city}. Compare central AC, furnace, and heat pump rates from licensed contractors on Biddaro.',
    intro: 'HVAC costs in {city} depend on system type, home size, ductwork condition, and energy efficiency rating. All installations must comply with local mechanical codes and EPA refrigerant regulations.',
    avgLow: '$3,000', avgHigh: '$15,000', avgUnit: 'per system',
    items: [
      { label: 'Central AC Installation', low: '$3,000', high: '$8,000', unit: 'per unit' },
      { label: 'Furnace Replacement (Gas)', low: '$2,500', high: '$7,000', unit: 'per unit' },
      { label: 'Heat Pump Installation', low: '$4,000', high: '$12,000', unit: 'per unit' },
      { label: 'Ductwork Installation / Repair', low: '$2,000', high: '$6,000', unit: 'per system' },
      { label: 'Mini-Split System (Single Zone)', low: '$2,000', high: '$5,000', unit: 'per zone' },
      { label: 'AC Repair (common)', low: '$150', high: '$600', unit: 'per visit' },
      { label: 'Thermostat Installation (Smart)', low: '$150', high: '$400', unit: 'per unit' },
      { label: 'Annual HVAC Maintenance', low: '$100', high: '$300', unit: 'per visit' },
    ],
    factors: [
      'Home square footage and insulation quality',
      'System type — central, mini-split, or heat pump',
      'SEER / HSPF efficiency rating',
      'Existing ductwork condition',
      'Climate zone in {city}',
      'Permit and inspection requirements in {city}',
    ],
    tips: [
      'Upgrade to a heat pump for heating and cooling in one system — eligible for federal tax credits.',
      'Schedule installation in spring or fall for shorter wait times and potential off-season discounts.',
      'Choose ENERGY STAR rated equipment for 15–20% energy savings.',
      'Get annual maintenance to extend system life by 5–10 years.',
    ],
    faqs: [
      { q: 'How much does a new HVAC system cost in {city}?', a: 'A complete HVAC system in {city} costs $5,000–15,000 including installation. High-efficiency heat pumps may cost more upfront but qualify for federal tax credits up to $2,000.' },
      { q: 'How long does an HVAC system last?', a: 'Central AC units last 15–20 years, furnaces 15–25 years, and heat pumps 12–20 years with proper maintenance.' },
      { q: 'Should I repair or replace my HVAC in {city}?', a: 'Replace if your system is 15+ years old, requires frequent repairs, uses R-22 refrigerant (phased out), or your energy bills are rising. Repair if under 10 years old with a minor issue.' },
      { q: 'Do I need a permit for HVAC work in {city}?', a: 'Yes. HVAC installations and replacements in {city} require a mechanical permit. Your HVAC contractor handles the permit and scheduling of inspections.' },
    ],
    relatedSlugs: ['electrical', 'general-construction', 'plumbing'],
  },
  {
    slug: 'bathroom-remodeling',
    name: 'Bathroom Remodeling',
    emoji: '🚿',
    headline: 'Bathroom Remodeling Cost in USA 2026',
    metaDesc: 'Find accurate bathroom remodeling costs in {city}. Compare rates for tub, shower, tile, and full renovation projects from verified contractors on Biddaro.',
    intro: 'Bathroom remodeling costs in {city} depend on scope — from a simple refresh to a full gut renovation. Costs include fixtures, tile, plumbing, electrical, and labor.',
    avgLow: '$6,000', avgHigh: '$35,000', avgUnit: 'per bathroom',
    items: [
      { label: 'Budget Refresh (cosmetic)', low: '$3,000', high: '$6,000', unit: 'per bathroom' },
      { label: 'Mid-Range Remodel', low: '$10,000', high: '$20,000', unit: 'per bathroom' },
      { label: 'High-End / Custom Remodel', low: '$25,000', high: '$50,000', unit: 'per bathroom' },
      { label: 'Shower / Tub Replacement', low: '$1,500', high: '$8,000', unit: 'per unit' },
      { label: 'Tile Installation', low: '$5', high: '$25', unit: 'per sq ft' },
      { label: 'Vanity + Countertop Install', low: '$800', high: '$4,000', unit: 'per vanity' },
      { label: 'Toilet Replacement', low: '$200', high: '$600', unit: 'per unit' },
      { label: 'Exhaust Fan Installation', low: '$150', high: '$500', unit: 'per unit' },
    ],
    factors: [
      'Scope — cosmetic update vs. full gut renovation',
      'Fixture quality — builder vs. designer grade',
      'Tile material and layout pattern',
      'Plumbing relocation needs',
      'Waterproofing and mold remediation',
      'Permit requirements in {city}',
    ],
    tips: [
      'Keep plumbing fixtures in existing locations to avoid costly pipe rerouting ($1,000–3,000 savings).',
      'Refinish your tub instead of replacing it — saves $500–2,000.',
      'Choose porcelain tile over natural stone for 50% savings with a similar look.',
      'Complete demo yourself to save $500–1,500 in labor costs.',
    ],
    faqs: [
      { q: 'How much does a bathroom remodel cost in {city}?', a: 'Bathroom remodeling in {city} costs $6,000–35,000 depending on scope and finishes. A mid-range remodel averages $10,000–20,000.' },
      { q: 'How long does a bathroom remodel take in {city}?', a: 'A standard bathroom remodel takes 2–4 weeks. Full gut renovations may take 4–8 weeks including permit and inspection time.' },
      { q: 'Do I need a permit for bathroom remodeling in {city}?', a: 'Yes, if you are moving plumbing, adding electrical, or changing the layout. Cosmetic-only updates (paint, fixtures, tile) typically do not require permits.' },
      { q: 'What adds the most value in a bathroom remodel?', a: 'Walk-in showers, double vanities, heated floors, and modern tile work add the most resale value. Focus on clean design and quality fixtures over trendy features.' },
    ],
    relatedSlugs: ['plumbing', 'flooring', 'painting'],
  },
  {
    slug: 'kitchen-remodeling',
    name: 'Kitchen Remodeling',
    emoji: '🍳',
    headline: 'Kitchen Remodeling Cost in USA 2026',
    metaDesc: 'Get accurate kitchen remodeling costs in {city}. Compare rates for cabinets, countertops, and full kitchen renovations from verified contractors on Biddaro.',
    intro: 'Kitchen remodeling is the highest-ROI home improvement project. Costs in {city} vary based on kitchen size, cabinet quality, countertop material, and appliance upgrades.',
    avgLow: '$15,000', avgHigh: '$75,000', avgUnit: 'per kitchen',
    items: [
      { label: 'Minor Kitchen Remodel', low: '$10,000', high: '$25,000', unit: 'per kitchen' },
      { label: 'Mid-Range Kitchen Remodel', low: '$25,000', high: '$50,000', unit: 'per kitchen' },
      { label: 'Major / Custom Kitchen Remodel', low: '$50,000', high: '$100,000+', unit: 'per kitchen' },
      { label: 'Cabinet Installation (stock)', low: '$5,000', high: '$15,000', unit: 'per kitchen' },
      { label: 'Countertops (Quartz)', low: '$50', high: '$120', unit: 'per sq ft installed' },
      { label: 'Countertops (Granite)', low: '$40', high: '$100', unit: 'per sq ft installed' },
      { label: 'Backsplash Tile', low: '$10', high: '$40', unit: 'per sq ft installed' },
      { label: 'Appliance Package (mid-range)', low: '$3,000', high: '$10,000', unit: 'per set' },
    ],
    factors: [
      'Kitchen size and layout changes',
      'Cabinet quality — stock, semi-custom, or custom',
      'Countertop material — laminate, quartz, granite, marble',
      'Appliance grade and brand',
      'Plumbing and electrical relocation needs',
      'Permit and inspection fees in {city}',
    ],
    tips: [
      'Reface cabinets instead of replacing them — saves 40–50% on cabinetry costs.',
      'Keep the existing kitchen layout to avoid costly plumbing and electrical rerouting.',
      'Choose quartz over marble for countertops — more durable and 20–40% cheaper.',
      'Shop appliance packages during holiday sales (Memorial Day, Black Friday) for 20–30% off.',
    ],
    faqs: [
      { q: 'How much does a kitchen remodel cost in {city}?', a: 'Kitchen remodeling in {city} costs $15,000–75,000 depending on scope. Minor refreshes start around $10,000 while full custom renovations can exceed $100,000.' },
      { q: 'How long does a kitchen remodel take in {city}?', a: 'A minor kitchen remodel takes 4–6 weeks. A major renovation with layout changes takes 8–16 weeks including design, permits, and construction.' },
      { q: 'What kitchen upgrades add the most resale value?', a: 'Cabinet refacing/replacement, quartz countertops, modern backsplash, and stainless steel appliances offer the best ROI — typically recovering 60–80% of costs at resale.' },
      { q: 'Do I need a permit for kitchen remodeling in {city}?', a: 'Yes, if you are moving plumbing, electrical, gas lines, or removing walls. Cosmetic updates (paint, counters, backsplash) typically do not require permits.' },
    ],
    relatedSlugs: ['plumbing', 'electrical', 'flooring', 'painting'],
  },
  {
    slug: 'carpentry',
    name: 'Carpentry',
    emoji: '🪚',
    headline: 'Carpentry Cost in USA 2026',
    metaDesc: 'Find accurate carpentry costs in {city}. Compare rates for framing, trim work, decks, and custom woodworking from verified carpenters on Biddaro.',
    intro: 'Carpentry costs in {city} vary based on the type of work — rough framing, finish carpentry, cabinetry, or deck building. Structural carpentry must comply with ICC building codes.',
    avgLow: '$40', avgHigh: '$110', avgUnit: 'per hour',
    items: [
      { label: 'Rough Framing', low: '$5', high: '$12', unit: 'per sq ft' },
      { label: 'Finish Carpentry (trim, molding)', low: '$4', high: '$12', unit: 'per linear ft' },
      { label: 'Deck Building (pressure-treated)', low: '$15', high: '$35', unit: 'per sq ft' },
      { label: 'Deck Building (composite)', low: '$25', high: '$50', unit: 'per sq ft' },
      { label: 'Cabinet Installation', low: '$100', high: '$300', unit: 'per cabinet' },
      { label: 'Custom Shelving / Built-ins', low: '$50', high: '$200', unit: 'per linear ft' },
      { label: 'Door Installation (interior)', low: '$150', high: '$400', unit: 'per door' },
      { label: 'Window Installation', low: '$300', high: '$800', unit: 'per window' },
    ],
    factors: [
      'Type of carpentry — rough, finish, or custom',
      'Material — pine, oak, cedar, or composite',
      'Project complexity and design details',
      'Structural vs. non-structural work',
      'Permit requirements for structural modifications',
      'Local carpenter rates in {city}',
    ],
    tips: [
      'Hire a general carpenter for basic work and a finish carpenter for trim — specialists charge more but deliver better results.',
      'Choose pressure-treated lumber over composite for deck framing to save on material costs.',
      'Get detailed quotes that separate material and labor costs.',
      'Schedule carpentry work during winter months for better availability and potential discounts.',
    ],
    faqs: [
      { q: 'How much does a carpenter charge per hour in {city}?', a: 'Carpenters in {city} charge $40–110/hr depending on skill level and type of work. Finish carpenters and custom woodworkers charge at the higher end.' },
      { q: 'How much does it cost to build a deck in {city}?', a: 'A pressure-treated deck in {city} costs $15–35/sqft. Composite decking runs $25–50/sqft. A standard 300 sqft deck costs $4,500–15,000.' },
      { q: 'Do carpenters need a license in {city}?', a: 'Requirements vary by location. Structural carpentry typically requires a contractor license. Check your local building department in {city} for specific requirements.' },
      { q: 'How do I find a good carpenter in {city}?', a: 'Use Biddaro to compare verified carpenters in {city}. Review portfolios, read customer reviews, and get at least 3 quotes before hiring.' },
    ],
    relatedSlugs: ['general-construction', 'painting', 'flooring'],
  },
];
