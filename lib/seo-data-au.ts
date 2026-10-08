// ─── Programmatic SEO Data for Australia ─────────────────────────────────────
// Provides all AU states/territories, major cities, and job-category metadata
// used by the /au/hire/[category]/[state] and /au/hire/[category]/[state]/[city]
// pages. All prices in AUD (Australian Dollar). Figures are best-effort market
// estimates for review — verify against current local rates before campaigns.

export interface CityEntry {
  name: string;           // "Sydney"
  slug: string;           // "sydney"
}

export interface AULocation {
  name: string;           // "New South Wales"
  slug: string;           // "new-south-wales"
  capital: string;        // "Sydney"
  region: string;         // "East Coast"
  cities: CityEntry[];
}

export interface JobCategoryMeta {
  name: string;           // "Plumbing"
  slug: string;           // "plumbing"
  emoji: string;
  plural: string;         // "Plumbers"
  shortDesc: string;
  longDesc: string;       // {state} placeholder replaced at render
  skills: string[];
  avgRate: string;        // "A$70–140 / hr"
  faqs: FAQ[];            // 4 FAQs – {state} placeholder replaced at render
}

export interface FAQ {
  q: string;
  a: string;
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

export function toSlug(str: string): string {
  return str.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
}

export function fromSlug(slug: string): string {
  return slug.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
}

export function getAULocationBySlug(slug: string): AULocation | undefined {
  return AU_LOCATIONS.find(l => l.slug === slug);
}

export function getAUCategory(slug: string): JobCategoryMeta | undefined {
  return AU_JOB_CATEGORY_META.find(c => c.slug === slug);
}

export function getAUCity(stateSlug: string, citySlug: string): CityEntry | undefined {
  return getAULocationBySlug(stateSlug)?.cities.find(c => c.slug === citySlug);
}

// ─── AU States / Territories & Cities ─────────────────────────────────────────

export const AU_LOCATIONS: AULocation[] = [
  {
    name: 'New South Wales', slug: 'new-south-wales', capital: 'Sydney', region: 'East Coast',
    cities: [
      { name: 'Sydney', slug: 'sydney' },
      { name: 'Newcastle', slug: 'newcastle' },
      { name: 'Wollongong', slug: 'wollongong' },
      { name: 'Central Coast', slug: 'central-coast' },
      { name: 'Wagga Wagga', slug: 'wagga-wagga' },
      { name: 'Coffs Harbour', slug: 'coffs-harbour' },
    ],
  },
  {
    name: 'Victoria', slug: 'victoria', capital: 'Melbourne', region: 'South East',
    cities: [
      { name: 'Melbourne', slug: 'melbourne' },
      { name: 'Geelong', slug: 'geelong' },
      { name: 'Ballarat', slug: 'ballarat' },
      { name: 'Bendigo', slug: 'bendigo' },
      { name: 'Shepparton', slug: 'shepparton' },
    ],
  },
  {
    name: 'Queensland', slug: 'queensland', capital: 'Brisbane', region: 'North East',
    cities: [
      { name: 'Brisbane', slug: 'brisbane' },
      { name: 'Gold Coast', slug: 'gold-coast' },
      { name: 'Sunshine Coast', slug: 'sunshine-coast' },
      { name: 'Cairns', slug: 'cairns' },
      { name: 'Townsville', slug: 'townsville' },
      { name: 'Toowoomba', slug: 'toowoomba' },
    ],
  },
  {
    name: 'Western Australia', slug: 'western-australia', capital: 'Perth', region: 'West Coast',
    cities: [
      { name: 'Perth', slug: 'perth' },
      { name: 'Fremantle', slug: 'fremantle' },
      { name: 'Mandurah', slug: 'mandurah' },
      { name: 'Bunbury', slug: 'bunbury' },
      { name: 'Geraldton', slug: 'geraldton' },
    ],
  },
  {
    name: 'South Australia', slug: 'south-australia', capital: 'Adelaide', region: 'Central South',
    cities: [
      { name: 'Adelaide', slug: 'adelaide' },
      { name: 'Mount Gambier', slug: 'mount-gambier' },
      { name: 'Whyalla', slug: 'whyalla' },
      { name: 'Gawler', slug: 'gawler' },
    ],
  },
  {
    name: 'Tasmania', slug: 'tasmania', capital: 'Hobart', region: 'Island State',
    cities: [
      { name: 'Hobart', slug: 'hobart' },
      { name: 'Launceston', slug: 'launceston' },
      { name: 'Devonport', slug: 'devonport' },
    ],
  },
  {
    name: 'Australian Capital Territory', slug: 'australian-capital-territory', capital: 'Canberra', region: 'Capital',
    cities: [
      { name: 'Canberra', slug: 'canberra' },
      { name: 'Belconnen', slug: 'belconnen' },
    ],
  },
  {
    name: 'Northern Territory', slug: 'northern-territory', capital: 'Darwin', region: 'Top End',
    cities: [
      { name: 'Darwin', slug: 'darwin' },
      { name: 'Alice Springs', slug: 'alice-springs' },
      { name: 'Palmerston', slug: 'palmerston' },
    ],
  },
];

// ─── AU Job Category Meta ─────────────────────────────────────────────────────

export const AU_JOB_CATEGORY_META: JobCategoryMeta[] = [
  {
    name: 'General Construction',
    slug: 'general-construction',
    emoji: '🏗️',
    plural: 'Builders',
    shortDesc: 'Licensed builders for residential and commercial projects across Australia.',
    longDesc: 'Registered builders manage every phase of a project from slab to handover. In {state}, builders must hold the relevant state building licence, comply with the National Construction Code (NCC/BCA), arrange home-building compensation (warranty) insurance, and coordinate trades, certifiers, and council approvals to deliver on time and on budget.',
    skills: ['Project Management', 'NCC/BCA Compliance', 'Council Approvals (DA/CDC)', 'Cost Estimating', 'Trade Coordination', 'Site Supervision'],
    avgRate: 'A$70–160 / hr',
    faqs: [
      { q: 'Do builders in {state} need a licence?', a: 'Yes. Builders in {state} must hold a current building licence or registration (for example a NSW Fair Trading builder licence, VBA registration in Victoria, or QBCC licence in Queensland) and carry home-building compensation insurance for residential work above the state threshold.' },
      { q: 'What does a builder in {state} typically handle?', a: 'A builder in {state} manages the full project — engaging subcontractors, arranging the building certifier and inspections, procuring materials, ensuring NCC/BCA compliance, and keeping the job on program and within the contract price.' },
      { q: 'How long does a typical home build take in {state}?', a: 'A standard single-storey home in {state} usually takes 6–10 months once approvals are in place. Double-storey or custom homes can take 10–16 months depending on design, weather, and trade availability.' },
      { q: 'How do I find a reliable builder in {state}?', a: 'Use Biddaro to compare verified builders in {state}. Check their licence on the state regulator register, read reviews, compare at least 3 fixed-price quotes, and confirm they carry the required warranty insurance.' },
    ],
  },
  {
    name: 'Plumbing',
    slug: 'plumbing',
    emoji: '🔧',
    plural: 'Plumbers',
    shortDesc: 'Licensed plumbers for repairs, installations, and renovations.',
    longDesc: 'Licensed plumbers handle everything from burst pipes and blocked drains to hot-water systems and full fit-outs. All plumbing work in {state} must comply with AS/NZS 3500 and the Plumbing Code of Australia, and be carried out by a licensed plumber who issues a compliance certificate.',
    skills: ['Blocked Drains', 'Hot Water Systems', 'Gas Fitting', 'Leak Detection', 'Backflow Prevention', 'Compliance Certificates'],
    avgRate: 'A$90–150 / hr',
    faqs: [
      { q: 'How much does a plumber cost per hour in {state}?', a: 'Plumbers in {state} typically charge A$90–150/hr, plus a call-out fee. Emergency and after-hours jobs attract higher rates, while scheduled repairs sit at the lower end.' },
      { q: 'Do plumbers in {state} need to be licensed?', a: 'Yes. All plumbing and gas work in {state} must be done by a licensed plumber or gasfitter. Always ask for their licence number and a compliance certificate for completed work.' },
      { q: 'What plumbing work requires a compliance certificate in {state}?', a: 'In {state}, most plumbing, drainage, and gas work requires a certificate of compliance from the licensed plumber. Minor tasks like changing a tap washer generally do not.' },
      { q: 'How do I find a licensed plumber near me in {state}?', a: 'Biddaro connects you with verified, licensed plumbers in {state}. Compare quotes, read reviews, and check licences in one place — we recommend getting at least 3 quotes.' },
    ],
  },
  {
    name: 'Electrical',
    slug: 'electrical',
    emoji: '⚡',
    plural: 'Electricians',
    shortDesc: 'Licensed electricians for wiring, switchboards, and installations.',
    longDesc: 'Electricians install, maintain, and repair electrical systems in homes and businesses. All electrical work in {state} must comply with AS/NZS 3000 (the Wiring Rules) and be performed by a licensed electrician who provides a Certificate of Compliance for Electrical Work.',
    skills: ['Switchboard Upgrades', 'Rewiring', 'AS/NZS 3000 Compliance', 'EV Charger Installation', 'LED Lighting', 'Safety Switches (RCDs)'],
    avgRate: 'A$80–140 / hr',
    faqs: [
      { q: 'How much does an electrician charge in {state}?', a: 'Electricians in {state} charge A$80–140/hr on average, plus a call-out fee. Simple jobs like adding a power point cost less, while switchboard upgrades, rewiring, and EV charger installs cost more.' },
      { q: 'Do I need a compliance certificate for electrical work in {state}?', a: 'Yes. In {state}, licensed electricians must issue a Certificate of Compliance for Electrical Work for new installations and alterations. Safety switch (RCD) installation is mandatory for many circuits.' },
      { q: 'Can I do my own electrical work in {state}?', a: 'No. It is illegal and unsafe to carry out your own fixed electrical work in {state} — it must be done by a licensed electrician. Only a licensed professional can legally connect, alter, or repair wiring.' },
      { q: 'How do I find a licensed electrician in {state}?', a: 'Use Biddaro to find verified, licensed electricians in {state}. Compare quotes, check licences, read reviews, and hire with confidence.' },
    ],
  },
  {
    name: 'HVAC & Air Conditioning',
    slug: 'hvac',
    emoji: '❄️',
    plural: 'Air Conditioning Technicians',
    shortDesc: 'Licensed technicians for split systems, ducted, and evaporative cooling.',
    longDesc: 'Air conditioning and heating technicians install, service, and repair split systems, ducted reverse-cycle, and evaporative cooling. In {state}, refrigerant handling requires an ARC (Australian Refrigeration Council) licence, and electrical connection must be done by a licensed electrician.',
    skills: ['Split System Install', 'Ducted Reverse-Cycle', 'Evaporative Cooling', 'ARC Refrigerant Handling', 'Ductwork', 'Servicing & Repairs'],
    avgRate: 'A$90–150 / hr',
    faqs: [
      { q: 'How much does air conditioning installation cost in {state}?', a: 'A split system in {state} costs A$600–1,500 supplied and installed per room. Ducted reverse-cycle for a whole home runs A$9,000–20,000 depending on home size and zoning.' },
      { q: 'Do air conditioning installers in {state} need a licence?', a: 'Yes. Handling refrigerant requires an ARC licence, and the electrical connection must be completed by a licensed electrician. Always confirm both before hiring in {state}.' },
      { q: 'How often should I service my air conditioner in {state}?', a: 'Service your system once a year in {state} — ideally before summer. Regular cleaning of filters and coils keeps efficiency high and extends the unit’s life.' },
      { q: 'How do I find a licensed AC technician in {state}?', a: 'Find ARC-licensed air conditioning technicians on Biddaro in {state}. Compare quotes, verify licences, and book verified professionals.' },
    ],
  },
  {
    name: 'Roofing',
    slug: 'roofing',
    emoji: '🏠',
    plural: 'Roofers',
    shortDesc: 'Roofers for Colorbond, tile, re-roofing, and roof repairs.',
    longDesc: 'Roofers install and repair Colorbond metal, concrete and terracotta tile, and flat membrane roofs. In {state}, roofing on habitable buildings is licensed work and must meet the NCC and AS 1562 for metal roofing, including wind-rating requirements for cyclone and storm zones.',
    skills: ['Colorbond Metal Roofing', 'Tile Roofing', 'Re-Roofing', 'Roof Restoration', 'Gutter & Downpipe', 'Leak Repairs'],
    avgRate: 'A$70–120 / hr',
    faqs: [
      { q: 'How much does a new roof cost in {state}?', a: 'Re-roofing a standard home in {state} costs A$8,000–20,000 for Colorbond and A$15,000–35,000 for tile, depending on roof size, pitch, and access.' },
      { q: 'Do roofers in {state} need a licence?', a: 'Roofing is licensed building work in {state} above the state threshold. Confirm the roofer holds the relevant trade licence and carries public liability insurance before work begins.' },
      { q: 'Colorbond or tile — which is better in {state}?', a: 'Colorbond is lighter, faster to install, and performs well in cyclone and bushfire zones; tile offers thermal mass and a traditional look. Local climate in {state} often guides the choice.' },
      { q: 'How do I find a reliable roofer in {state}?', a: 'Compare verified roofers in {state} on Biddaro. Check licences and insurance, read reviews, and get at least 3 quotes detailing material, warranty, and gutter works.' },
    ],
  },
  {
    name: 'Flooring',
    slug: 'flooring',
    emoji: '🪵',
    plural: 'Flooring Installers',
    shortDesc: 'Installers for timber, laminate, vinyl, tile, and carpet.',
    longDesc: 'Flooring installers supply and lay timber, engineered boards, laminate, hybrid/vinyl planks, tiles, and carpet. Proper subfloor preparation, moisture testing, and acoustic underlay (important in apartments under strata rules) ensure a durable finish that meets manufacturer warranties.',
    skills: ['Timber Flooring', 'Laminate & Hybrid', 'Vinyl Planks', 'Tiling', 'Carpet Laying', 'Floor Sanding & Polishing'],
    avgRate: 'A$45–90 / hr',
    faqs: [
      { q: 'How much does flooring cost in {state}?', a: 'Installed flooring in {state} runs A$40–120/m². Laminate and hybrid start around A$40–70/m², engineered timber A$80–150/m², and solid timber plus sand-and-polish costs more.' },
      { q: 'What is the best flooring for homes in {state}?', a: 'Hybrid vinyl and engineered timber are popular in {state} for their durability and moisture resistance. Tiles suit wet areas and warmer climates, while carpet remains common in bedrooms.' },
      { q: 'Do flooring installers in {state} need a licence?', a: 'Flooring is generally not a licensed trade on its own in {state}, but structural subfloor work may be. Always confirm insurance and ask about manufacturer certifications.' },
      { q: 'How do I find a flooring installer in {state}?', a: 'Use Biddaro to compare verified flooring installers in {state}. Check specialisations, read reviews, see past work, and get competitive quotes.' },
    ],
  },
  {
    name: 'Painting',
    slug: 'painting',
    emoji: '🎨',
    plural: 'Painters',
    shortDesc: 'Professional painters for interior and exterior projects.',
    longDesc: 'Professional painters prepare surfaces, prime, and apply paints and coatings for interiors and exteriors. In {state}, painting of a value above the state threshold is licensed work, and lead-paint precautions apply to homes built before 1970.',
    skills: ['Surface Preparation', 'Interior Painting', 'Exterior Painting', 'Roof Painting', 'Colour Consultation', 'Spray Application'],
    avgRate: 'A$45–85 / hr',
    faqs: [
      { q: 'How much does it cost to paint a house interior in {state}?', a: 'Interior painting in {state} typically costs A$20–45/m² of floor area, or roughly A$4,000–9,000 for a standard 3-bedroom home depending on condition and ceiling height.' },
      { q: 'Do painters in {state} need a licence?', a: 'In {state}, painting work above the state value threshold requires a painter’s licence. Below it, a painter still needs insurance — always confirm before hiring.' },
      { q: 'How long does it take to paint a 3-bedroom house in {state}?', a: 'A professional crew can repaint a 3-bedroom interior in {state} in 3–5 days. Exterior repaints take 4–8 days depending on surface, access, and weather.' },
      { q: 'How do I choose a painter in {state}?', a: 'Compare verified painters on Biddaro in {state}. Check licence and insurance, read reviews, and get at least 3 written quotes detailing prep, paint brand, and number of coats.' },
    ],
  },
  {
    name: 'Carpentry',
    slug: 'carpentry',
    emoji: '🪚',
    plural: 'Carpenters',
    shortDesc: 'Carpenters for framing, decking, pergolas, and fit-outs.',
    longDesc: 'Carpenters build and install framing, decks, pergolas, doors, and custom joinery. Structural carpentry in {state} must comply with the NCC and AS 1684 (timber framing), and decks or structures over a set height may require council approval.',
    skills: ['Timber Framing', 'Decking', 'Pergolas & Carports', 'Doors & Windows', 'Built-in Joinery', 'Formwork'],
    avgRate: 'A$60–110 / hr',
    faqs: [
      { q: 'How much does a carpenter cost in {state}?', a: 'Carpenters in {state} charge A$60–110/hr. Finish carpentry and custom joinery sit at the higher end; rough framing is usually quoted per project.' },
      { q: 'How much does a deck cost in {state}?', a: 'A timber deck in {state} costs A$200–450/m² installed; composite decking runs A$350–550/m². A standard 20m² deck typically costs A$4,000–11,000.' },
      { q: 'Do carpenters in {state} need a licence?', a: 'Structural carpentry above the state threshold is licensed building work in {state}. Confirm the carpenter’s licence and insurance before structural jobs or decks that need approval.' },
      { q: 'How do I find a skilled carpenter in {state}?', a: 'Browse verified carpenters on Biddaro in {state}. Review portfolios, compare quotes, and read reviews to find the right tradie for your project.' },
    ],
  },
  {
    name: 'Landscaping',
    slug: 'landscaping',
    emoji: '🌿',
    plural: 'Landscapers',
    shortDesc: 'Landscapers for paving, decks, turf, retaining walls, and gardens.',
    longDesc: 'Landscapers design and build outdoor spaces — paving, retaining walls, turf, decks, irrigation, and planting. In {state}, structural landscaping such as retaining walls over 1m or work near boundaries may require council approval and an engineer’s certification.',
    skills: ['Paving', 'Retaining Walls', 'Turf & Lawns', 'Irrigation', 'Garden Design', 'Fencing'],
    avgRate: 'A$55–100 / hr',
    faqs: [
      { q: 'How much does landscaping cost in {state}?', a: 'Landscaping in {state} varies widely — basic turf and garden work starts around A$3,000, while a full backyard transformation with paving, decking, and retaining can run A$20,000–60,000+.' },
      { q: 'Do I need council approval for landscaping in {state}?', a: 'In {state}, retaining walls over about 1m, work near boundaries or easements, and some structures need council approval. Your landscaper can advise what applies to your site.' },
      { q: 'When is the best time to landscape in {state}?', a: 'Autumn and spring are ideal in {state} for planting and turf establishment, with milder temperatures. Hardscaping like paving can be done year-round.' },
      { q: 'How do I find a good landscaper in {state}?', a: 'Compare verified landscapers in {state} on Biddaro. Review past projects, check insurance, and get at least 3 quotes before choosing.' },
    ],
  },
  {
    name: 'Renovations',
    slug: 'renovation',
    emoji: '🛠️',
    plural: 'Renovation Builders',
    shortDesc: 'Renovation specialists for kitchens, bathrooms, and extensions.',
    longDesc: 'Renovation builders handle kitchens, bathrooms, extensions, and whole-home makeovers. In {state}, structural renovations and extensions require a licensed builder, council or private-certifier approval, and compliance with the current NCC and waterproofing standard AS 3740 for wet areas.',
    skills: ['Kitchen Renovations', 'Bathroom Renovations', 'Home Extensions', 'Structural Alterations', 'Project Management', 'Waterproofing'],
    avgRate: 'A$70–150 / hr',
    faqs: [
      { q: 'How much does a renovation cost in {state}?', a: 'In {state}, a bathroom renovation typically costs A$18,000–35,000, a kitchen A$20,000–45,000, and a single-room extension A$2,500–4,500/m². Scope and finishes drive the final price.' },
      { q: 'Do I need approval to renovate in {state}?', a: 'Cosmetic updates usually don’t, but structural changes, extensions, and moving plumbing in {state} require council or private-certifier approval. A licensed builder will manage this.' },
      { q: 'How long does a bathroom renovation take in {state}?', a: 'A full bathroom renovation in {state} takes 3–5 weeks including waterproofing cure time and inspections. Kitchens take 4–8 weeks depending on cabinetry lead times.' },
      { q: 'How do I find a renovation builder in {state}?', a: 'Use Biddaro to compare verified renovation builders in {state}. Check licences, read reviews, and get at least 3 fixed-price quotes with detailed inclusions.' },
    ],
  },
  {
    name: 'Tiling',
    slug: 'tiling',
    emoji: '🧱',
    plural: 'Tilers',
    shortDesc: 'Tilers for bathrooms, kitchens, floors, and outdoor areas.',
    longDesc: 'Tilers prepare surfaces, waterproof wet areas, and lay ceramic, porcelain, and stone tiles. In {state}, waterproofing of internal wet areas must comply with AS 3740 and is commonly required to be certified, as poor waterproofing is a leading cause of renovation defects.',
    skills: ['Wall & Floor Tiling', 'Waterproofing (AS 3740)', 'Stone & Porcelain', 'Mosaic & Feature Walls', 'Screeding', 'Grout & Sealing'],
    avgRate: 'A$55–95 / hr',
    faqs: [
      { q: 'How much does tiling cost in {state}?', a: 'Tiling in {state} costs A$45–90/m² for supply-and-lay labour, plus tiles. Waterproofing a bathroom adds A$500–1,200. Large-format and stone tiles cost more to lay.' },
      { q: 'Does bathroom waterproofing need to be certified in {state}?', a: 'Yes. Internal wet-area waterproofing in {state} must comply with AS 3740 and is typically certified. Always confirm your tiler or waterproofer provides documentation.' },
      { q: 'How long does it take to tile a bathroom in {state}?', a: 'Tiling a standard bathroom in {state} takes 3–5 days including waterproofing cure time before tiles are laid.' },
      { q: 'How do I find a good tiler in {state}?', a: 'Compare verified tilers in {state} on Biddaro. Check waterproofing credentials, review past work, and get at least 3 quotes.' },
    ],
  },
  {
    name: 'Waterproofing',
    slug: 'waterproofing',
    emoji: '💧',
    plural: 'Waterproofers',
    shortDesc: 'Waterproofers for bathrooms, balconies, basements, and roofs.',
    longDesc: 'Waterproofing specialists seal wet areas, balconies, planter boxes, and below-ground structures. In {state}, internal wet-area waterproofing must meet AS 3740 and external work AS 4654, and defective waterproofing is one of the most common and costly building defects.',
    skills: ['Wet-Area Membranes', 'Balcony & Deck', 'Basement Tanking', 'Roof & Planter Boxes', 'Leak Remediation', 'Certification'],
    avgRate: 'A$60–110 / hr',
    faqs: [
      { q: 'How much does waterproofing cost in {state}?', a: 'Waterproofing a bathroom in {state} costs A$500–1,200; balconies and larger areas are priced per m². Remedial waterproofing to fix leaks costs more due to removal works.' },
      { q: 'Is waterproofing a licensed trade in {state}?', a: 'In {state}, waterproofing of wet areas is specialised work that must comply with AS 3740 and is often certified. Confirm your tradesperson is accredited and provides documentation.' },
      { q: 'How long does waterproofing take to cure?', a: 'Most membranes in {state} need 24–48 hours to cure before tiling. Rushing this step is a common cause of failures and leaks.' },
      { q: 'How do I find a waterproofer in {state}?', a: 'Use Biddaro to find verified waterproofing specialists in {state}. Check accreditation, read reviews, and compare quotes.' },
    ],
  },
  {
    name: 'Bricklaying',
    slug: 'bricklaying',
    emoji: '🧱',
    plural: 'Bricklayers',
    shortDesc: 'Bricklayers for walls, fences, extensions, and blockwork.',
    longDesc: 'Bricklayers build structural and feature walls, fences, piers, and blockwork. In {state}, structural masonry must comply with the NCC and AS 3700, and work above the state value threshold is licensed building work requiring appropriate insurance.',
    skills: ['Brick & Block Laying', 'Feature & Retaining Walls', 'Rendering', 'Repointing', 'Fences & Piers', 'Blockwork'],
    avgRate: 'A$60–100 / hr',
    faqs: [
      { q: 'How much does bricklaying cost in {state}?', a: 'Bricklaying in {state} is often priced per 1,000 bricks laid (A$1,200–2,000) or per m² of wall. A standard brick fence costs A$350–700 per linear metre installed.' },
      { q: 'Do bricklayers in {state} need a licence?', a: 'Structural bricklaying above the state threshold is licensed building work in {state}. Confirm the bricklayer’s licence and public liability insurance before starting.' },
      { q: 'How long does bricklaying take?', a: 'A skilled bricklayer lays 500–700 bricks per day. A single-storey home’s external walls in {state} typically take 2–4 weeks depending on design.' },
      { q: 'How do I find a bricklayer in {state}?', a: 'Compare verified bricklayers in {state} on Biddaro. Review past work, check licences, and get at least 3 quotes.' },
    ],
  },
  {
    name: 'Demolition',
    slug: 'demolition',
    emoji: '🚜',
    plural: 'Demolition Contractors',
    shortDesc: 'Demolition contractors for homes, structures, and site clearing.',
    longDesc: 'Demolition contractors safely dismantle structures, remove asbestos, and clear sites. In {state}, demolition is licensed work that requires council approval, a WorkSafe/SafeWork notification, and licensed asbestos removal for any bonded or friable material — common in homes built before the late 1980s.',
    skills: ['House Demolition', 'Partial / Strip-Out', 'Asbestos Removal', 'Site Clearing', 'Concrete Cutting', 'Waste Disposal'],
    avgRate: 'A$80–140 / hr',
    faqs: [
      { q: 'How much does demolition cost in {state}?', a: 'Demolishing a standard house in {state} costs A$15,000–40,000 depending on size, access, and asbestos. Asbestos removal and tip fees add significantly to the total.' },
      { q: 'Do I need approval to demolish in {state}?', a: 'Yes. Demolition in {state} requires council or certifier approval, a licensed demolisher, and a WorkSafe/SafeWork notification. Asbestos must be removed by a licensed removalist.' },
      { q: 'How is asbestos handled during demolition in {state}?', a: 'In {state}, any asbestos must be identified and removed by a licensed asbestos removalist before demolition, with disposal at a licensed facility and appropriate clearance.' },
      { q: 'How do I find a demolition contractor in {state}?', a: 'Use Biddaro to compare verified demolition contractors in {state}. Confirm licences, asbestos accreditation, and insurance, and get at least 3 quotes.' },
    ],
  },
  {
    name: 'Pest Control',
    slug: 'pest-control',
    emoji: '🐜',
    plural: 'Pest Control Technicians',
    shortDesc: 'Pest technicians for termites, general pests, and inspections.',
    longDesc: 'Pest control technicians treat termites, cockroaches, rodents, and other pests, and carry out pre-purchase timber-pest inspections. In {state}, pest technicians must hold a pest management licence, and termite (white ant) activity is a major risk for Australian homes.',
    skills: ['Termite Treatment', 'Termite Inspections', 'General Pest Control', 'Rodent Control', 'Pre-Purchase Inspections', 'Termite Barriers'],
    avgRate: 'A$80–150 / hr',
    faqs: [
      { q: 'How much does pest control cost in {state}?', a: 'A general pest treatment in {state} costs A$150–350, a termite inspection A$250–450, and a full termite barrier/treatment A$2,000–5,000+ depending on home size and method.' },
      { q: 'How often should I get a termite inspection in {state}?', a: 'In {state}, an annual termite inspection is recommended (more often in high-risk areas). Termites cause major damage that standard home insurance usually does not cover.' },
      { q: 'Do pest controllers in {state} need a licence?', a: 'Yes. Pest management technicians in {state} must hold a current pest control licence. Always confirm licensing and ask for a treatment report and warranty.' },
      { q: 'How do I find a pest controller in {state}?', a: 'Compare verified pest control technicians in {state} on Biddaro. Check licences, read reviews, and get quotes for treatment and ongoing inspections.' },
    ],
  },
];
