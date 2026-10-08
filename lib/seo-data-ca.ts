// ─── Programmatic SEO Data for Canada ─────────────────────────────────────────
// Provides all CA provinces, major cities, and job-category metadata used by
// the /ca/hire/[category]/[state] and /ca/hire/[category]/[state]/[city] pages.
// All prices in CAD (Canadian Dollar). Figures are best-effort market estimates
// for review — verify against current local rates before campaigns.

export interface CityEntry {
  name: string;           // "Toronto"
  slug: string;           // "toronto"
}

export interface CALocation {
  name: string;           // "Ontario"
  slug: string;           // "ontario"
  capital: string;        // "Toronto"
  region: string;         // "Central Canada"
  cities: CityEntry[];
}

export interface JobCategoryMeta {
  name: string;
  slug: string;
  emoji: string;
  plural: string;
  shortDesc: string;
  longDesc: string;       // {state} placeholder replaced at render
  skills: string[];
  avgRate: string;        // "C$70–130 / hr"
  faqs: FAQ[];            // {state} placeholder replaced at render
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

export function getCALocationBySlug(slug: string): CALocation | undefined {
  return CA_LOCATIONS.find(l => l.slug === slug);
}

export function getCACategory(slug: string): JobCategoryMeta | undefined {
  return CA_JOB_CATEGORY_META.find(c => c.slug === slug);
}

export function getCACity(stateSlug: string, citySlug: string): CityEntry | undefined {
  return getCALocationBySlug(stateSlug)?.cities.find(c => c.slug === citySlug);
}

// ─── CA Provinces & Cities ────────────────────────────────────────────────────

export const CA_LOCATIONS: CALocation[] = [
  {
    name: 'Ontario', slug: 'ontario', capital: 'Toronto', region: 'Central Canada',
    cities: [
      { name: 'Toronto', slug: 'toronto' },
      { name: 'Ottawa', slug: 'ottawa' },
      { name: 'Mississauga', slug: 'mississauga' },
      { name: 'Hamilton', slug: 'hamilton' },
      { name: 'London', slug: 'london' },
      { name: 'Brampton', slug: 'brampton' },
      { name: 'Kitchener', slug: 'kitchener' },
    ],
  },
  {
    name: 'Quebec', slug: 'quebec', capital: 'Quebec City', region: 'Central Canada',
    cities: [
      { name: 'Montreal', slug: 'montreal' },
      { name: 'Quebec City', slug: 'quebec-city' },
      { name: 'Laval', slug: 'laval' },
      { name: 'Gatineau', slug: 'gatineau' },
    ],
  },
  {
    name: 'British Columbia', slug: 'british-columbia', capital: 'Victoria', region: 'West Coast',
    cities: [
      { name: 'Vancouver', slug: 'vancouver' },
      { name: 'Surrey', slug: 'surrey' },
      { name: 'Victoria', slug: 'victoria' },
      { name: 'Burnaby', slug: 'burnaby' },
      { name: 'Kelowna', slug: 'kelowna' },
    ],
  },
  {
    name: 'Alberta', slug: 'alberta', capital: 'Edmonton', region: 'Prairies',
    cities: [
      { name: 'Calgary', slug: 'calgary' },
      { name: 'Edmonton', slug: 'edmonton' },
      { name: 'Red Deer', slug: 'red-deer' },
      { name: 'Lethbridge', slug: 'lethbridge' },
    ],
  },
  {
    name: 'Manitoba', slug: 'manitoba', capital: 'Winnipeg', region: 'Prairies',
    cities: [
      { name: 'Winnipeg', slug: 'winnipeg' },
      { name: 'Brandon', slug: 'brandon' },
    ],
  },
  {
    name: 'Saskatchewan', slug: 'saskatchewan', capital: 'Regina', region: 'Prairies',
    cities: [
      { name: 'Saskatoon', slug: 'saskatoon' },
      { name: 'Regina', slug: 'regina' },
    ],
  },
  {
    name: 'Nova Scotia', slug: 'nova-scotia', capital: 'Halifax', region: 'Atlantic Canada',
    cities: [
      { name: 'Halifax', slug: 'halifax' },
      { name: 'Dartmouth', slug: 'dartmouth' },
    ],
  },
  {
    name: 'New Brunswick', slug: 'new-brunswick', capital: 'Fredericton', region: 'Atlantic Canada',
    cities: [
      { name: 'Moncton', slug: 'moncton' },
      { name: 'Fredericton', slug: 'fredericton' },
      { name: 'Saint John', slug: 'saint-john' },
    ],
  },
  {
    name: 'Newfoundland and Labrador', slug: 'newfoundland-and-labrador', capital: "St. John's", region: 'Atlantic Canada',
    cities: [
      { name: "St. John's", slug: 'st-johns' },
      { name: 'Mount Pearl', slug: 'mount-pearl' },
    ],
  },
  {
    name: 'Prince Edward Island', slug: 'prince-edward-island', capital: 'Charlottetown', region: 'Atlantic Canada',
    cities: [
      { name: 'Charlottetown', slug: 'charlottetown' },
      { name: 'Summerside', slug: 'summerside' },
    ],
  },
];

// ─── CA Job Category Meta ─────────────────────────────────────────────────────

export const CA_JOB_CATEGORY_META: JobCategoryMeta[] = [
  {
    name: 'General Construction',
    slug: 'general-construction',
    emoji: '🏗️',
    plural: 'General Contractors',
    shortDesc: 'Licensed general contractors for residential and commercial builds across Canada.',
    longDesc: 'General contractors manage every phase of a build from foundation to final walkthrough. In {state}, contractors must comply with the National Building Code of Canada and the applicable provincial code, pull municipal permits, carry liability insurance and WSIB/WCB coverage, and coordinate trades and inspections.',
    skills: ['Project Management', 'Building Code Compliance', 'Permit Acquisition', 'Cost Estimating', 'Trade Coordination', 'Site Supervision'],
    avgRate: 'C$60–150 / hr',
    faqs: [
      { q: 'Do general contractors in {state} need a licence?', a: 'Requirements vary by province. In {state}, contractors typically need municipal business licensing, liability insurance, and WSIB/WCB coverage; Quebec requires an RBQ licence, and B.C. requires Licensed Residential Builder registration for new homes.' },
      { q: 'What does a general contractor in {state} handle?', a: 'A general contractor in {state} manages the full project — hiring subtrades, scheduling inspections, procuring materials, ensuring building-code compliance, and keeping the job on schedule and budget.' },
      { q: 'How long does a typical home build take in {state}?', a: 'A standard home in {state} takes 8–14 months once permits are issued. Winter conditions can extend foundation and exterior timelines in colder regions.' },
      { q: 'How do I find a reliable general contractor in {state}?', a: 'Use Biddaro to compare verified general contractors in {state}. Check licensing and insurance, read reviews, and compare at least 3 detailed quotes.' },
    ],
  },
  {
    name: 'Plumbing',
    slug: 'plumbing',
    emoji: '🔧',
    plural: 'Plumbers',
    shortDesc: 'Licensed plumbers for repairs, installations, and renovations.',
    longDesc: 'Licensed plumbers handle leaks, drains, water heaters, and full installations. In {state}, plumbing work must comply with the provincial plumbing code (based on the National Plumbing Code of Canada) and be performed by a licensed plumber, with permits required for most new work.',
    skills: ['Drain Cleaning', 'Water Heaters', 'Repiping', 'Leak Detection', 'Backflow Prevention', 'Permit Compliance'],
    avgRate: 'C$80–150 / hr',
    faqs: [
      { q: 'How much does a plumber cost per hour in {state}?', a: 'Plumbers in {state} typically charge C$80–150/hr plus a service-call fee. Emergency and after-hours jobs cost more; scheduled repairs sit at the lower end.' },
      { q: 'Do plumbers in {state} need to be licensed?', a: 'Yes. {state} requires plumbers to hold a provincial licence or Red Seal certification. Always confirm licensing and that permits are pulled for new work.' },
      { q: 'What plumbing work requires a permit in {state}?', a: 'In {state}, permits are generally required for new installations, repiping, water heater changes, and drain work. Minor repairs like replacing a faucet usually do not.' },
      { q: 'How do I find a licensed plumber near me in {state}?', a: 'Biddaro connects you with verified, licensed plumbers in {state}. Compare quotes, read reviews, and check credentials in one place.' },
    ],
  },
  {
    name: 'Electrical',
    slug: 'electrical',
    emoji: '⚡',
    plural: 'Electricians',
    shortDesc: 'Licensed electricians for wiring, panel upgrades, and installations.',
    longDesc: 'Electricians install and repair wiring, panels, and fixtures. All electrical work in {state} must comply with the Canadian Electrical Code (CSA C22.1) and the provincial safety authority — for example, an ESA permit and a licensed electrical contractor (ECRA/ESA) in Ontario, or Technical Safety BC.',
    skills: ['Panel Upgrades', 'Rewiring', 'CSA Code Compliance', 'EV Charger Installation', 'Pot Lights', 'Troubleshooting'],
    avgRate: 'C$75–140 / hr',
    faqs: [
      { q: 'How much does an electrician charge in {state}?', a: 'Electricians in {state} charge C$75–140/hr on average plus a service-call fee. Panel upgrades, rewiring, and EV charger installs command higher rates.' },
      { q: 'Do I need a permit for electrical work in {state}?', a: 'Yes. In {state}, most electrical work beyond simple fixture swaps requires a permit and inspection through the provincial electrical safety authority to ensure CSA code compliance.' },
      { q: 'Can I do my own electrical work in {state}?', a: 'Rules vary by province. In {state}, most fixed wiring must be done by a licensed electrician; homeowner permits are limited and still require inspection. Hire a licensed pro for safety and code compliance.' },
      { q: 'How do I find a licensed electrician in {state}?', a: 'Use Biddaro to find verified, licensed electricians in {state}. Compare quotes, check licensing, read reviews, and hire with confidence.' },
    ],
  },
  {
    name: 'HVAC',
    slug: 'hvac',
    emoji: '❄️',
    plural: 'HVAC Technicians',
    shortDesc: 'Licensed technicians for furnaces, heat pumps, and AC.',
    longDesc: 'HVAC technicians install and service furnaces, heat pumps, air conditioning, and ductwork — essential through Canadian winters. In {state}, gas work requires certification (e.g. TSSA in Ontario) and refrigerant handling an ODP card, with installations meeting the provincial code.',
    skills: ['Furnace Installation', 'Heat Pumps', 'Central AC', 'Ductwork', 'Gas Fitting (TSSA)', 'Maintenance'],
    avgRate: 'C$90–150 / hr',
    faqs: [
      { q: 'How much does a furnace cost in {state}?', a: 'A high-efficiency furnace in {state} costs C$4,000–8,000 installed. Cold-climate heat pumps run C$6,000–15,000 but may qualify for federal and provincial rebates.' },
      { q: 'Do HVAC technicians in {state} need a licence?', a: 'Yes. In {state}, gas work requires certification (such as a TSSA gas technician licence in Ontario) and refrigerant handling an ODP card. Always confirm credentials before hiring.' },
      { q: 'How often should I service my furnace in {state}?', a: 'Service your furnace annually in {state} before winter, and your AC each spring. Regular maintenance keeps efficiency high and prevents mid-winter breakdowns.' },
      { q: 'How do I find a licensed HVAC tech in {state}?', a: 'Find certified HVAC technicians on Biddaro in {state}. Compare quotes, verify credentials, and book verified professionals.' },
    ],
  },
  {
    name: 'Roofing',
    slug: 'roofing',
    emoji: '🏠',
    plural: 'Roofers',
    shortDesc: 'Roofers for asphalt shingles, metal, flat roofs, and repairs.',
    longDesc: 'Roofers install and repair asphalt shingle, metal, and flat membrane roofs built to withstand snow loads and ice damming common across {state}. Work must meet the provincial building code, and most replacements require a permit.',
    skills: ['Asphalt Shingles', 'Metal Roofing', 'Flat Roofing (EPDM/TPO)', 'Ice & Water Shield', 'Eavestroughs', 'Leak Repairs'],
    avgRate: 'C$60–110 / hr',
    faqs: [
      { q: 'How much does a new roof cost in {state}?', a: 'A new asphalt shingle roof in {state} costs C$7,000–18,000 for an average home. Metal roofing runs C$15,000–35,000 and lasts 40–50 years.' },
      { q: 'Do roofers in {state} need a licence?', a: 'Most of {state} requires a business licence, liability insurance, and WSIB/WCB coverage rather than a specific roofing licence. Always confirm insurance before work begins.' },
      { q: 'When is the best time to roof in {state}?', a: 'Late spring through fall is ideal in {state}; shingles seal best in mild temperatures. Winter roofing is possible but costs more and requires extra care.' },
      { q: 'How do I find a reliable roofer in {state}?', a: 'Compare verified roofers in {state} on Biddaro. Check insurance and WSIB/WCB, read reviews, and get at least 3 quotes with warranty details.' },
    ],
  },
  {
    name: 'Flooring',
    slug: 'flooring',
    emoji: '🪵',
    plural: 'Flooring Contractors',
    shortDesc: 'Installers for hardwood, laminate, vinyl, tile, and carpet.',
    longDesc: 'Flooring contractors supply and install hardwood, engineered boards, laminate, luxury vinyl, tile, and carpet. Proper subfloor prep and moisture control are vital in {state}, especially for basements and homes with seasonal humidity swings.',
    skills: ['Hardwood Installation', 'Laminate & Vinyl', 'Tile Setting', 'Subfloor Prep', 'Floor Refinishing', 'Carpet'],
    avgRate: 'C$45–90 / hr',
    faqs: [
      { q: 'How much does flooring cost in {state}?', a: 'Installed flooring in {state} runs C$5–18/sq ft. Laminate and vinyl start around C$5–9/sq ft, engineered hardwood C$9–16/sq ft, and tile varies with material.' },
      { q: 'What is the best flooring for homes in {state}?', a: 'Luxury vinyl plank and engineered hardwood are popular in {state} for durability and moisture resistance. Tile suits entryways and wet areas; carpet stays common in bedrooms and basements.' },
      { q: 'Do flooring installers in {state} need a licence?', a: 'Flooring is generally not a separately licensed trade in {state}, but installers should carry insurance and WSIB/WCB coverage. Confirm before hiring.' },
      { q: 'How do I find a flooring contractor in {state}?', a: 'Use Biddaro to compare verified flooring contractors in {state}. Check specialisations, read reviews, and get competitive quotes.' },
    ],
  },
  {
    name: 'Painting',
    slug: 'painting',
    emoji: '🎨',
    plural: 'Painters',
    shortDesc: 'Professional painters for interior and exterior projects.',
    longDesc: 'Professional painters prepare surfaces, prime, and apply quality coatings for interiors and exteriors. In {state}, exterior painting is seasonal due to temperature limits on paint application, and lead-paint precautions apply to homes built before 1960.',
    skills: ['Surface Preparation', 'Interior Painting', 'Exterior Painting', 'Spray Application', 'Colour Consultation', 'Staining'],
    avgRate: 'C$40–80 / hr',
    faqs: [
      { q: 'How much does it cost to paint a house interior in {state}?', a: 'Interior painting in {state} typically costs C$3–7/sq ft of floor area, or roughly C$3,500–8,000 for a standard home depending on condition and ceiling height.' },
      { q: 'Do painters in {state} need a licence?', a: 'Painting is generally not a licensed trade in {state}, but reputable painters carry liability insurance and WSIB/WCB coverage. Always confirm before hiring.' },
      { q: 'When can exterior painting be done in {state}?', a: 'Exterior painting in {state} is best from late spring to early fall when temperatures stay above the paint’s minimum application range. Interior work can be done year-round.' },
      { q: 'How do I choose a painter in {state}?', a: 'Compare verified painters on Biddaro in {state}. Check insurance, read reviews, and get at least 3 written quotes detailing prep, product, and coats.' },
    ],
  },
  {
    name: 'Carpentry',
    slug: 'carpentry',
    emoji: '🪚',
    plural: 'Carpenters',
    shortDesc: 'Carpenters for framing, decks, trim, and custom woodwork.',
    longDesc: 'Carpenters frame structures and build decks, trim, and custom cabinetry. Structural carpentry in {state} must meet the provincial building code, and decks above a set height or additions require a municipal permit.',
    skills: ['Framing', 'Deck Building', 'Finish Carpentry', 'Cabinet Installation', 'Trim & Moulding', 'Doors & Windows'],
    avgRate: 'C$45–100 / hr',
    faqs: [
      { q: 'How much does a carpenter cost in {state}?', a: 'Carpenters in {state} charge C$45–100/hr. Finish carpenters and custom woodworkers charge at the higher end; framing is often quoted per project.' },
      { q: 'How much does a deck cost in {state}?', a: 'A pressure-treated deck in {state} costs C$25–45/sq ft; composite runs C$40–65/sq ft. A standard 200 sq ft deck typically costs C$5,000–13,000.' },
      { q: 'Do I need a permit for a deck in {state}?', a: 'Decks above a set height and any structural additions in {state} require a municipal building permit. Your carpenter can confirm what applies.' },
      { q: 'How do I find a skilled carpenter in {state}?', a: 'Browse verified carpenters on Biddaro in {state}. Review portfolios, compare quotes, and read reviews.' },
    ],
  },
  {
    name: 'Landscaping',
    slug: 'landscaping',
    emoji: '🌿',
    plural: 'Landscapers',
    shortDesc: 'Landscapers for interlock, decks, sod, retaining walls, and gardens.',
    longDesc: 'Landscapers design and build outdoor spaces — interlock paving, retaining walls, sod, decks, and planting. In {state}, work near property lines, retaining walls over a set height, and grading changes may require municipal approval.',
    skills: ['Interlock Paving', 'Retaining Walls', 'Sod & Lawns', 'Garden Design', 'Grading & Drainage', 'Fencing'],
    avgRate: 'C$50–100 / hr',
    faqs: [
      { q: 'How much does landscaping cost in {state}?', a: 'Landscaping in {state} varies — basic sod and garden work starts around C$3,000, while a full backyard with interlock, deck, and retaining can run C$20,000–70,000+.' },
      { q: 'Do I need a permit for landscaping in {state}?', a: 'In {state}, retaining walls over a set height, grading changes, and work near boundaries often require municipal approval. Your landscaper can advise.' },
      { q: 'When is the best time to landscape in {state}?', a: 'Spring and early fall are ideal in {state} for sod and planting. Hardscaping like interlock can run through the warmer months before frost.' },
      { q: 'How do I find a good landscaper in {state}?', a: 'Compare verified landscapers in {state} on Biddaro. Review past projects, confirm insurance, and get at least 3 quotes.' },
    ],
  },
  {
    name: 'Renovations',
    slug: 'renovation',
    emoji: '🛠️',
    plural: 'Renovation Contractors',
    shortDesc: 'Renovation specialists for kitchens, bathrooms, and basements.',
    longDesc: 'Renovation contractors handle kitchens, bathrooms, basement finishing, and additions. In {state}, structural renovations and basement suites require permits, provincial-code compliance, and often inspections for electrical, plumbing, and framing.',
    skills: ['Kitchen Renovations', 'Bathroom Renovations', 'Basement Finishing', 'Additions', 'Project Management', 'Permits & Inspections'],
    avgRate: 'C$60–140 / hr',
    faqs: [
      { q: 'How much does a renovation cost in {state}?', a: 'In {state}, a bathroom renovation typically costs C$12,000–28,000, a kitchen C$20,000–50,000, and basement finishing C$35–75/sq ft.' },
      { q: 'Do I need a permit to renovate in {state}?', a: 'Cosmetic updates usually don’t, but structural changes, basement suites, and moving plumbing or electrical in {state} require permits and inspections.' },
      { q: 'How long does a basement finish take in {state}?', a: 'Finishing a basement in {state} takes 4–8 weeks depending on size, plumbing, and inspection scheduling.' },
      { q: 'How do I find a renovation contractor in {state}?', a: 'Use Biddaro to compare verified renovation contractors in {state}. Check licensing and insurance, read reviews, and get detailed quotes.' },
    ],
  },
  {
    name: 'Tiling',
    slug: 'tiling',
    emoji: '🧱',
    plural: 'Tile Installers',
    shortDesc: 'Tile installers for bathrooms, kitchens, and floors.',
    longDesc: 'Tile installers prepare surfaces, waterproof wet areas, and set ceramic, porcelain, and stone tile. In {state}, proper waterproofing and in-floor membrane details are essential for showers and bathrooms to prevent costly water damage.',
    skills: ['Wall & Floor Tile', 'Shower Waterproofing', 'Porcelain & Stone', 'Heated Floors', 'Backsplashes', 'Grout & Sealing'],
    avgRate: 'C$50–90 / hr',
    faqs: [
      { q: 'How much does tiling cost in {state}?', a: 'Tile installation labour in {state} costs C$8–20/sq ft, plus tile. Shower waterproofing and heated floors add to the total.' },
      { q: 'Is shower waterproofing required in {state}?', a: 'Yes. Proper waterproofing membranes are essential for showers in {state} to meet code and prevent water damage. Always confirm your installer includes it.' },
      { q: 'How long does it take to tile a bathroom in {state}?', a: 'Tiling a standard bathroom in {state} takes 3–5 days including waterproofing and cure time.' },
      { q: 'How do I find a good tile installer in {state}?', a: 'Compare verified tile installers in {state} on Biddaro. Review past work and get at least 3 quotes.' },
    ],
  },
  {
    name: 'Waterproofing',
    slug: 'waterproofing',
    emoji: '💧',
    plural: 'Waterproofing Contractors',
    shortDesc: 'Waterproofers for basements, foundations, and wet areas.',
    longDesc: 'Waterproofing contractors seal basements and foundations and install drainage, sump pumps, and weeping tile — critical in {state} where spring melt and heavy rain cause basement leaks. Interior and exterior systems address both existing leaks and prevention.',
    skills: ['Basement Waterproofing', 'Foundation Crack Repair', 'Weeping Tile', 'Sump Pumps', 'Exterior Membranes', 'Drainage'],
    avgRate: 'C$60–120 / hr',
    faqs: [
      { q: 'How much does basement waterproofing cost in {state}?', a: 'In {state}, interior waterproofing costs C$3,000–8,000, and exterior excavation waterproofing C$10,000–25,000 depending on foundation size and access.' },
      { q: 'Why do basements leak in {state}?', a: 'Spring snow melt, heavy rain, poor grading, and failed weeping tile are common causes in {state}. A waterproofer can diagnose whether interior or exterior repair is needed.' },
      { q: 'Interior or exterior waterproofing in {state}?', a: 'Interior systems manage water that enters and are cheaper; exterior systems stop water at the foundation and are more thorough but costlier. The right choice depends on your home in {state}.' },
      { q: 'How do I find a waterproofing contractor in {state}?', a: 'Use Biddaro to find verified waterproofing contractors in {state}. Check warranties, read reviews, and compare quotes.' },
    ],
  },
  {
    name: 'Masonry',
    slug: 'bricklaying',
    emoji: '🧱',
    plural: 'Masons',
    shortDesc: 'Masons for brick, block, stone, chimneys, and repointing.',
    longDesc: 'Masons build and repair brick, block, and stone — walls, veneers, chimneys, and steps. In {state}, freeze-thaw cycles make quality mortar and repointing essential, and structural masonry must meet the provincial building code.',
    skills: ['Brick & Block', 'Stone Veneer', 'Chimney Repair', 'Repointing / Tuckpointing', 'Parging', 'Steps & Walkways'],
    avgRate: 'C$55–110 / hr',
    faqs: [
      { q: 'How much does masonry cost in {state}?', a: 'Masonry in {state} is priced per sq ft of wall or per project. Repointing costs C$10–25/sq ft, and chimney repairs range C$1,000–5,000 depending on condition.' },
      { q: 'Why does brick need repointing in {state}?', a: 'Freeze-thaw cycles in {state} erode mortar over time. Repointing (tuckpointing) restores the joints and prevents water damage and structural issues.' },
      { q: 'Do masons in {state} need a licence?', a: 'Structural masonry in {state} falls under building-permit and code requirements. Confirm the mason carries insurance and WSIB/WCB coverage before starting.' },
      { q: 'How do I find a mason in {state}?', a: 'Compare verified masons in {state} on Biddaro. Review past work, check insurance, and get at least 3 quotes.' },
    ],
  },
  {
    name: 'Demolition',
    slug: 'demolition',
    emoji: '🚜',
    plural: 'Demolition Contractors',
    shortDesc: 'Demolition contractors for homes, interiors, and site clearing.',
    longDesc: 'Demolition contractors dismantle structures, handle asbestos abatement, and clear sites. In {state}, demolition requires a permit, utility disconnections, and designated-substance (asbestos) surveys and abatement for homes built before the 1990s.',
    skills: ['House Demolition', 'Interior Strip-Out', 'Asbestos Abatement', 'Site Clearing', 'Concrete Removal', 'Waste Disposal'],
    avgRate: 'C$70–140 / hr',
    faqs: [
      { q: 'How much does demolition cost in {state}?', a: 'Demolishing a house in {state} costs C$12,000–35,000 depending on size, access, and abatement. Asbestos removal and disposal fees add to the total.' },
      { q: 'Do I need a permit to demolish in {state}?', a: 'Yes. Demolition in {state} requires a permit, utility disconnections, and a designated-substance (asbestos) survey with licensed abatement where needed.' },
      { q: 'How is asbestos handled during demolition in {state}?', a: 'In {state}, asbestos must be identified and removed by a licensed abatement contractor before demolition, with disposal at an approved facility.' },
      { q: 'How do I find a demolition contractor in {state}?', a: 'Use Biddaro to compare verified demolition contractors in {state}. Confirm permits, abatement credentials, and insurance.' },
    ],
  },
  {
    name: 'Pest Control',
    slug: 'pest-control',
    emoji: '🐜',
    plural: 'Pest Control Technicians',
    shortDesc: 'Pest technicians for rodents, insects, and wildlife.',
    longDesc: 'Pest control technicians treat rodents, carpenter ants, cockroaches, bedbugs, and wildlife (raccoons, squirrels) and provide inspections. In {state}, technicians applying pesticides must be licensed under provincial regulations, and seasonal rodent intrusion is common as temperatures drop.',
    skills: ['Rodent Control', 'Carpenter Ants', 'Bedbug Treatment', 'Wildlife Removal', 'Cockroach Control', 'Inspections'],
    avgRate: 'C$80–150 / hr',
    faqs: [
      { q: 'How much does pest control cost in {state}?', a: 'A general pest treatment in {state} costs C$150–400, bedbug treatment C$500–2,000, and wildlife removal C$300–900 depending on the animal and access.' },
      { q: 'How often should I get pest control in {state}?', a: 'Many homes in {state} benefit from seasonal treatments — especially before winter when rodents seek warmth indoors. Ongoing plans suit recurring issues.' },
      { q: 'Do pest technicians in {state} need a licence?', a: 'Yes. Technicians applying pesticides in {state} must be licensed under provincial regulations. Always confirm licensing and ask for a treatment report.' },
      { q: 'How do I find a pest controller in {state}?', a: 'Compare verified pest control technicians in {state} on Biddaro. Check licensing, read reviews, and get quotes for treatment and ongoing plans.' },
    ],
  },
];
