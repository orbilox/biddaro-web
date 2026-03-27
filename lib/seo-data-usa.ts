// ─── Programmatic SEO Data for USA ──────────────────────────────────────────
// Provides all US states, major cities, and job-category metadata used by
// the /hire/[category]/[state] and /hire/[category]/[state]/[city] pages for USA.
// All prices in USD (United States Dollar)

export interface CityEntry {
  name: string;           // "Los Angeles"
  slug: string;           // "los-angeles"
}

export interface USALocation {
  name: string;           // "California"
  slug: string;           // "california"
  capital: string;        // "Sacramento"
  region: string;         // "West"
  cities: CityEntry[];
}

export interface JobCategoryMeta {
  name: string;           // "Plumbing"
  slug: string;           // "plumbing"
  emoji: string;          // "🔧"
  plural: string;         // "Plumbers"
  shortDesc: string;      // One-liner
  longDesc: string;       // 2–3 sentences for page body
  skills: string[];       // Top skills shown on page
  avgRate: string;        // "$45–130 / hr"
  faqs: FAQ[];            // 4 FAQs – {state} placeholder gets replaced at render
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

export function getUSALocationBySlug(slug: string): USALocation | undefined {
  return USA_LOCATIONS.find(l => l.slug === slug);
}

export function getUSACategory(slug: string): JobCategoryMeta | undefined {
  return USA_JOB_CATEGORY_META.find(c => c.slug === slug);
}

export function getUSACity(stateSlug: string, citySlug: string): CityEntry | undefined {
  return getUSALocationBySlug(stateSlug)?.cities.find(c => c.slug === citySlug);
}

// ─── US States & Cities ──────────────────────────────────────────────────────

export const USA_LOCATIONS: USALocation[] = [
  {
    name: 'California', slug: 'california', capital: 'Sacramento', region: 'West',
    cities: [
      { name: 'Los Angeles', slug: 'los-angeles' },
      { name: 'San Francisco', slug: 'san-francisco' },
      { name: 'San Diego', slug: 'san-diego' },
      { name: 'San Jose', slug: 'san-jose' },
      { name: 'Sacramento', slug: 'sacramento' },
      { name: 'Fresno', slug: 'fresno' },
      { name: 'Oakland', slug: 'oakland' },
      { name: 'Irvine', slug: 'irvine' },
      { name: 'Long Beach', slug: 'long-beach' },
      { name: 'Riverside', slug: 'riverside' },
    ],
  },
  {
    name: 'Texas', slug: 'texas', capital: 'Austin', region: 'South',
    cities: [
      { name: 'Houston', slug: 'houston' },
      { name: 'Dallas', slug: 'dallas' },
      { name: 'Austin', slug: 'austin' },
      { name: 'San Antonio', slug: 'san-antonio' },
      { name: 'Fort Worth', slug: 'fort-worth' },
      { name: 'El Paso', slug: 'el-paso' },
      { name: 'Arlington', slug: 'arlington' },
      { name: 'Plano', slug: 'plano' },
    ],
  },
  {
    name: 'Florida', slug: 'florida', capital: 'Tallahassee', region: 'Southeast',
    cities: [
      { name: 'Miami', slug: 'miami' },
      { name: 'Orlando', slug: 'orlando' },
      { name: 'Tampa', slug: 'tampa' },
      { name: 'Jacksonville', slug: 'jacksonville' },
      { name: 'Fort Lauderdale', slug: 'fort-lauderdale' },
      { name: 'St Petersburg', slug: 'st-petersburg' },
      { name: 'Hialeah', slug: 'hialeah' },
    ],
  },
  {
    name: 'New York', slug: 'new-york', capital: 'Albany', region: 'Northeast',
    cities: [
      { name: 'New York City', slug: 'new-york-city' },
      { name: 'Buffalo', slug: 'buffalo' },
      { name: 'Rochester', slug: 'rochester' },
      { name: 'Albany', slug: 'albany' },
      { name: 'Syracuse', slug: 'syracuse' },
      { name: 'Yonkers', slug: 'yonkers' },
    ],
  },
  {
    name: 'Illinois', slug: 'illinois', capital: 'Springfield', region: 'Midwest',
    cities: [
      { name: 'Chicago', slug: 'chicago' },
      { name: 'Aurora', slug: 'aurora' },
      { name: 'Naperville', slug: 'naperville' },
      { name: 'Joliet', slug: 'joliet' },
      { name: 'Rockford', slug: 'rockford' },
      { name: 'Springfield', slug: 'springfield' },
    ],
  },
  {
    name: 'Pennsylvania', slug: 'pennsylvania', capital: 'Harrisburg', region: 'Northeast',
    cities: [
      { name: 'Philadelphia', slug: 'philadelphia' },
      { name: 'Pittsburgh', slug: 'pittsburgh' },
      { name: 'Allentown', slug: 'allentown' },
      { name: 'Harrisburg', slug: 'harrisburg' },
      { name: 'Erie', slug: 'erie' },
    ],
  },
  {
    name: 'Ohio', slug: 'ohio', capital: 'Columbus', region: 'Midwest',
    cities: [
      { name: 'Columbus', slug: 'columbus' },
      { name: 'Cleveland', slug: 'cleveland' },
      { name: 'Cincinnati', slug: 'cincinnati' },
      { name: 'Toledo', slug: 'toledo' },
      { name: 'Akron', slug: 'akron' },
    ],
  },
  {
    name: 'Georgia', slug: 'georgia', capital: 'Atlanta', region: 'Southeast',
    cities: [
      { name: 'Atlanta', slug: 'atlanta' },
      { name: 'Augusta', slug: 'augusta' },
      { name: 'Savannah', slug: 'savannah' },
      { name: 'Columbus GA', slug: 'columbus-ga' },
      { name: 'Athens', slug: 'athens' },
    ],
  },
  {
    name: 'North Carolina', slug: 'north-carolina', capital: 'Raleigh', region: 'Southeast',
    cities: [
      { name: 'Charlotte', slug: 'charlotte' },
      { name: 'Raleigh', slug: 'raleigh' },
      { name: 'Durham', slug: 'durham' },
      { name: 'Greensboro', slug: 'greensboro' },
      { name: 'Winston Salem', slug: 'winston-salem' },
    ],
  },
  {
    name: 'Michigan', slug: 'michigan', capital: 'Lansing', region: 'Midwest',
    cities: [
      { name: 'Detroit', slug: 'detroit' },
      { name: 'Grand Rapids', slug: 'grand-rapids' },
      { name: 'Ann Arbor', slug: 'ann-arbor' },
      { name: 'Lansing', slug: 'lansing' },
      { name: 'Flint', slug: 'flint' },
    ],
  },
  {
    name: 'New Jersey', slug: 'new-jersey', capital: 'Trenton', region: 'Northeast',
    cities: [
      { name: 'Newark', slug: 'newark' },
      { name: 'Jersey City', slug: 'jersey-city' },
      { name: 'Trenton', slug: 'trenton' },
      { name: 'Paterson', slug: 'paterson' },
      { name: 'Elizabeth', slug: 'elizabeth' },
    ],
  },
  {
    name: 'Virginia', slug: 'virginia', capital: 'Richmond', region: 'Southeast',
    cities: [
      { name: 'Virginia Beach', slug: 'virginia-beach' },
      { name: 'Norfolk', slug: 'norfolk' },
      { name: 'Richmond', slug: 'richmond' },
      { name: 'Arlington VA', slug: 'arlington-va' },
      { name: 'Alexandria', slug: 'alexandria' },
    ],
  },
  {
    name: 'Washington', slug: 'washington', capital: 'Olympia', region: 'West',
    cities: [
      { name: 'Seattle', slug: 'seattle' },
      { name: 'Tacoma', slug: 'tacoma' },
      { name: 'Spokane', slug: 'spokane' },
      { name: 'Vancouver WA', slug: 'vancouver-wa' },
      { name: 'Bellevue', slug: 'bellevue' },
    ],
  },
  {
    name: 'Arizona', slug: 'arizona', capital: 'Phoenix', region: 'West',
    cities: [
      { name: 'Phoenix', slug: 'phoenix' },
      { name: 'Tucson', slug: 'tucson' },
      { name: 'Mesa', slug: 'mesa' },
      { name: 'Chandler', slug: 'chandler' },
      { name: 'Scottsdale', slug: 'scottsdale' },
    ],
  },
  {
    name: 'Massachusetts', slug: 'massachusetts', capital: 'Boston', region: 'Northeast',
    cities: [
      { name: 'Boston', slug: 'boston' },
      { name: 'Worcester', slug: 'worcester' },
      { name: 'Cambridge', slug: 'cambridge' },
      { name: 'Springfield MA', slug: 'springfield-ma' },
      { name: 'Lowell', slug: 'lowell' },
    ],
  },
  {
    name: 'Tennessee', slug: 'tennessee', capital: 'Nashville', region: 'South',
    cities: [
      { name: 'Nashville', slug: 'nashville' },
      { name: 'Memphis', slug: 'memphis' },
      { name: 'Knoxville', slug: 'knoxville' },
      { name: 'Chattanooga', slug: 'chattanooga' },
    ],
  },
  {
    name: 'Indiana', slug: 'indiana', capital: 'Indianapolis', region: 'Midwest',
    cities: [
      { name: 'Indianapolis', slug: 'indianapolis' },
      { name: 'Fort Wayne', slug: 'fort-wayne' },
      { name: 'Evansville', slug: 'evansville' },
      { name: 'South Bend', slug: 'south-bend' },
    ],
  },
  {
    name: 'Missouri', slug: 'missouri', capital: 'Jefferson City', region: 'Midwest',
    cities: [
      { name: 'Kansas City', slug: 'kansas-city' },
      { name: 'St Louis', slug: 'st-louis' },
      { name: 'Springfield MO', slug: 'springfield-mo' },
      { name: 'Columbia MO', slug: 'columbia-mo' },
    ],
  },
  {
    name: 'Maryland', slug: 'maryland', capital: 'Annapolis', region: 'Northeast',
    cities: [
      { name: 'Baltimore', slug: 'baltimore' },
      { name: 'Annapolis', slug: 'annapolis' },
      { name: 'Rockville', slug: 'rockville' },
      { name: 'Frederick', slug: 'frederick' },
    ],
  },
  {
    name: 'Wisconsin', slug: 'wisconsin', capital: 'Madison', region: 'Midwest',
    cities: [
      { name: 'Milwaukee', slug: 'milwaukee' },
      { name: 'Madison', slug: 'madison' },
      { name: 'Green Bay', slug: 'green-bay' },
    ],
  },
  {
    name: 'Colorado', slug: 'colorado', capital: 'Denver', region: 'West',
    cities: [
      { name: 'Denver', slug: 'denver' },
      { name: 'Colorado Springs', slug: 'colorado-springs' },
      { name: 'Aurora CO', slug: 'aurora-co' },
      { name: 'Fort Collins', slug: 'fort-collins' },
      { name: 'Boulder', slug: 'boulder' },
    ],
  },
  {
    name: 'Minnesota', slug: 'minnesota', capital: 'St Paul', region: 'Midwest',
    cities: [
      { name: 'Minneapolis', slug: 'minneapolis' },
      { name: 'St Paul', slug: 'st-paul' },
      { name: 'Rochester MN', slug: 'rochester-mn' },
      { name: 'Bloomington MN', slug: 'bloomington-mn' },
    ],
  },
  {
    name: 'South Carolina', slug: 'south-carolina', capital: 'Columbia', region: 'Southeast',
    cities: [
      { name: 'Charleston', slug: 'charleston' },
      { name: 'Columbia SC', slug: 'columbia-sc' },
      { name: 'Greenville SC', slug: 'greenville-sc' },
    ],
  },
  {
    name: 'Alabama', slug: 'alabama', capital: 'Montgomery', region: 'South',
    cities: [
      { name: 'Birmingham', slug: 'birmingham' },
      { name: 'Montgomery', slug: 'montgomery' },
      { name: 'Huntsville', slug: 'huntsville' },
      { name: 'Mobile', slug: 'mobile' },
    ],
  },
  {
    name: 'Louisiana', slug: 'louisiana', capital: 'Baton Rouge', region: 'South',
    cities: [
      { name: 'New Orleans', slug: 'new-orleans' },
      { name: 'Baton Rouge', slug: 'baton-rouge' },
      { name: 'Shreveport', slug: 'shreveport' },
    ],
  },
  {
    name: 'Kentucky', slug: 'kentucky', capital: 'Frankfort', region: 'South',
    cities: [
      { name: 'Louisville', slug: 'louisville' },
      { name: 'Lexington', slug: 'lexington' },
      { name: 'Frankfort', slug: 'frankfort' },
    ],
  },
  {
    name: 'Oregon', slug: 'oregon', capital: 'Salem', region: 'West',
    cities: [
      { name: 'Portland', slug: 'portland' },
      { name: 'Salem', slug: 'salem' },
      { name: 'Eugene', slug: 'eugene' },
      { name: 'Bend', slug: 'bend' },
    ],
  },
  {
    name: 'Oklahoma', slug: 'oklahoma', capital: 'Oklahoma City', region: 'South',
    cities: [
      { name: 'Oklahoma City', slug: 'oklahoma-city' },
      { name: 'Tulsa', slug: 'tulsa' },
      { name: 'Norman', slug: 'norman' },
    ],
  },
  {
    name: 'Connecticut', slug: 'connecticut', capital: 'Hartford', region: 'Northeast',
    cities: [
      { name: 'Hartford', slug: 'hartford' },
      { name: 'New Haven', slug: 'new-haven' },
      { name: 'Stamford', slug: 'stamford' },
      { name: 'Bridgeport', slug: 'bridgeport' },
    ],
  },
  {
    name: 'Nevada', slug: 'nevada', capital: 'Carson City', region: 'West',
    cities: [
      { name: 'Las Vegas', slug: 'las-vegas' },
      { name: 'Reno', slug: 'reno' },
      { name: 'Henderson', slug: 'henderson' },
    ],
  },
  {
    name: 'District of Columbia', slug: 'washington-dc', capital: 'Washington DC', region: 'Northeast',
    cities: [
      { name: 'Washington DC', slug: 'washington-dc' },
      { name: 'Georgetown', slug: 'georgetown' },
      { name: 'Capitol Hill', slug: 'capitol-hill' },
    ],
  },
];

// ─── US Job Category Meta ────────────────────────────────────────────────────

export const USA_JOB_CATEGORY_META: JobCategoryMeta[] = [
  {
    name: 'General Construction',
    slug: 'general-construction',
    emoji: '🏗️',
    plural: 'General Contractors',
    shortDesc: 'Licensed general contractors for residential and commercial builds across the US.',
    longDesc: 'General contractors oversee all phases of construction from foundation to final walkthrough. In the US, they must comply with ICC building codes, obtain local permits, and coordinate subcontractors, inspections, and material procurement to deliver projects on time and within budget.',
    skills: ['Project Management', 'Blueprint Reading', 'ICC Code Compliance', 'Permit Acquisition', 'Cost Estimation', 'Subcontractor Coordination'],
    avgRate: '$50–150 / hr',
    faqs: [
      { q: 'Do general contractors in {state} need a license?', a: 'Yes. Most states require general contractors to hold a state-issued license. In {state}, contractors must pass trade exams, carry liability insurance, and meet bonding requirements before they can legally pull permits and begin work.' },
      { q: 'What does a general contractor in {state} typically handle?', a: 'A general contractor in {state} manages the entire build — hiring subcontractors, scheduling inspections, procuring materials, ensuring ICC code compliance, and keeping the project on schedule and within budget.' },
      { q: 'How long does a typical home build take in {state}?', a: 'A standard single-family home in {state} takes 6–12 months depending on size, weather conditions, permit timelines, and material availability. Custom homes or complex builds may take 12–18 months.' },
      { q: 'How do I find a reliable general contractor in {state}?', a: 'Use Biddaro to compare verified general contractors in {state}. Check their license status, read reviews, compare at least 3 quotes, and verify they carry proper insurance and bonding for your project size.' },
    ],
  },
  {
    name: 'Plumbing',
    slug: 'plumbing',
    emoji: '🔧',
    plural: 'Plumbers',
    shortDesc: 'Licensed plumbers for repairs, installations, and remodeling projects.',
    longDesc: 'Professional plumbers handle everything from leak repairs and drain cleaning to full system installations. US plumbers must comply with the Uniform Plumbing Code (UPC) or International Plumbing Code (IPC) depending on jurisdiction, and carry state or local licenses for all permitted work.',
    skills: ['Pipe Fitting', 'Drain Cleaning', 'Water Heater Installation', 'Leak Detection', 'Backflow Prevention', 'Code Compliance'],
    avgRate: '$45–130 / hr',
    faqs: [
      { q: 'How much does a plumber cost per hour in {state}?', a: 'Plumbers in {state} typically charge $45–130/hr depending on the job complexity, time of day, and whether it is an emergency call. Simple repairs are on the lower end while repiping or sewer line work runs higher.' },
      { q: 'Do plumbers in {state} need to be licensed?', a: 'Yes. {state} requires plumbers to hold a valid journeyman or master plumber license. Always ask to see their license and verify it with your state licensing board before hiring.' },
      { q: 'What plumbing work requires a permit in {state}?', a: 'In {state}, permits are generally required for new installations, repiping, water heater replacements, sewer line work, and any modification to the existing plumbing system. Minor repairs like fixing a faucet typically do not require a permit.' },
      { q: 'How do I find a licensed plumber near me in {state}?', a: 'Biddaro connects you with verified, licensed plumbers in {state}. Compare quotes, read reviews, and check credentials — all in one place. We recommend getting at least 3 bids before making your decision.' },
    ],
  },
  {
    name: 'Electrical',
    slug: 'electrical',
    emoji: '⚡',
    plural: 'Electricians',
    shortDesc: 'Licensed electricians for wiring, panel upgrades, and electrical installations.',
    longDesc: 'Electricians install, maintain, and repair electrical systems in residential and commercial properties. All electrical work in the US must comply with the National Electrical Code (NEC) and local amendments. Licensed electricians ensure safe, code-compliant installations that pass inspection.',
    skills: ['Panel Upgrades', 'Circuit Installation', 'NEC Compliance', 'EV Charger Installation', 'Lighting Design', 'Troubleshooting'],
    avgRate: '$50–140 / hr',
    faqs: [
      { q: 'How much does an electrician charge in {state}?', a: 'Electricians in {state} charge $50–140/hr on average. Simple tasks like outlet installation cost less, while panel upgrades, whole-house rewiring, or EV charger installations command higher rates.' },
      { q: 'Do I need a permit for electrical work in {state}?', a: 'Yes. In {state}, most electrical work beyond simple fixture replacements requires a permit and inspection. Panel upgrades, new circuits, and any structural wiring changes all need permits to ensure NEC compliance.' },
      { q: 'What is the difference between a journeyman and master electrician in {state}?', a: 'A journeyman electrician in {state} can perform electrical work under supervision or independently. A master electrician has additional experience and exams, can pull permits, supervise journeymen, and run their own contracting business.' },
      { q: 'How do I find a licensed electrician in {state}?', a: 'Use Biddaro to find verified, licensed electricians in {state}. Compare quotes from multiple pros, check their NEC certification, read customer reviews, and hire with confidence.' },
    ],
  },
  {
    name: 'Painting',
    slug: 'painting',
    emoji: '🎨',
    plural: 'Painters',
    shortDesc: 'Professional painters for interior and exterior residential and commercial projects.',
    longDesc: 'Professional painters transform spaces with expert surface preparation, priming, and application of paints, stains, and coatings. US painting contractors must follow EPA lead-paint regulations for pre-1978 homes, use VOC-compliant products where required, and obtain local business licenses.',
    skills: ['Surface Preparation', 'Interior Painting', 'Exterior Painting', 'Color Consultation', 'Lead Paint Safety (EPA RRP)', 'Spray Application'],
    avgRate: '$35–85 / hr',
    faqs: [
      { q: 'How much does it cost to paint a house interior in {state}?', a: 'Interior painting in {state} typically costs $2–6 per square foot depending on room count, ceiling height, surface condition, and paint quality. A standard 2,000 sqft home costs $4,000–12,000 for a full interior repaint.' },
      { q: 'Do painters in {state} need a license?', a: 'Requirements vary by city and county in {state}. Most areas require a business license, and any painter working on pre-1978 homes must be EPA Lead-Safe certified. Check your local requirements before hiring.' },
      { q: 'How long does it take to paint a 3-bedroom house in {state}?', a: 'A professional crew can paint a standard 3-bedroom home interior in {state} in 2–4 days. Exterior painting may take 3–7 days depending on siding type, weather conditions, and prep work needed.' },
      { q: 'How do I choose a painter in {state}?', a: 'Compare verified painters on Biddaro. Look for EPA RRP certification if your home is pre-1978, check insurance coverage, read reviews, and get at least 3 written estimates that detail prep work, paint brands, and number of coats.' },
    ],
  },
  {
    name: 'Carpentry',
    slug: 'carpentry',
    emoji: '🪚',
    plural: 'Carpenters',
    shortDesc: 'Skilled carpenters for framing, trim work, cabinetry, and custom woodworking.',
    longDesc: 'Carpenters build, install, and repair structures and fixtures made from wood and other materials. From framing walls to crafting custom cabinetry, US carpenters must follow ICC building codes for structural work and obtain permits for any load-bearing modifications.',
    skills: ['Rough Framing', 'Finish Carpentry', 'Cabinet Installation', 'Trim & Molding', 'Deck Building', 'Blueprint Reading'],
    avgRate: '$40–110 / hr',
    faqs: [
      { q: 'How much does a carpenter cost in {state}?', a: 'Carpenters in {state} charge $40–110/hr depending on specialization. Finish carpenters and cabinet makers command higher rates than rough framers. Custom woodwork projects are typically quoted as a flat fee.' },
      { q: 'Do carpenters in {state} need a license?', a: 'Licensing requirements vary across {state}. Structural carpentry often falls under general contractor licensing. Always verify your carpenter carries proper insurance and meets local permit requirements for structural work.' },
      { q: 'What types of carpentry services are available in {state}?', a: 'Carpenters in {state} offer rough framing, finish carpentry, custom cabinetry, trim and molding installation, deck building, door and window installation, shelving, and restoration of historic woodwork.' },
      { q: 'How do I find a skilled carpenter in {state}?', a: 'Browse verified carpenters on Biddaro in {state}. Review their portfolio of past projects, check qualifications, compare bids, and read customer reviews to find the right fit for your project.' },
    ],
  },
  {
    name: 'Flooring',
    slug: 'flooring',
    emoji: '🪵',
    plural: 'Flooring Contractors',
    shortDesc: 'Flooring installers for hardwood, tile, laminate, vinyl, and carpet.',
    longDesc: 'Flooring contractors install, repair, and refinish all types of residential and commercial flooring. They ensure proper subfloor preparation, moisture barriers, and installation techniques that meet manufacturer warranties and local building codes for fire ratings and accessibility.',
    skills: ['Hardwood Installation', 'Tile Setting', 'Laminate & Vinyl', 'Subfloor Preparation', 'Floor Refinishing', 'Moisture Testing'],
    avgRate: '$40–100 / hr',
    faqs: [
      { q: 'How much does flooring installation cost in {state}?', a: 'Flooring installation in {state} costs $6–20/sqft installed depending on material. Vinyl and laminate start at $6/sqft, hardwood runs $10–18/sqft, and premium tile or stone can exceed $20/sqft including labor.' },
      { q: 'What is the best flooring for homes in {state}?', a: 'The best flooring depends on your climate and lifestyle. In {state}, engineered hardwood and luxury vinyl plank (LVP) are popular for their durability. Tile is ideal for moisture-prone areas, and carpet remains popular for bedrooms.' },
      { q: 'Do flooring installers in {state} need a license?', a: 'Requirements vary by jurisdiction in {state}. Some cities require a specialty flooring license, while others allow work under a general contractor license. Always verify insurance and ask about manufacturer certifications.' },
      { q: 'How do I find a flooring contractor in {state}?', a: 'Use Biddaro to compare verified flooring contractors in {state}. Check their material specialization, read reviews, view past project photos, and get competitive quotes from multiple installers.' },
    ],
  },
  {
    name: 'HVAC',
    slug: 'hvac',
    emoji: '❄️',
    plural: 'HVAC Technicians',
    shortDesc: 'Licensed HVAC technicians for heating, cooling, and ventilation systems.',
    longDesc: 'HVAC technicians install, repair, and maintain heating, ventilation, and air conditioning systems. In the US, HVAC work must comply with EPA refrigerant handling regulations (Section 608), ASHRAE standards, and local mechanical codes. Technicians need EPA 608 certification at minimum.',
    skills: ['System Installation', 'AC Repair', 'Furnace Maintenance', 'Ductwork', 'EPA 608 Certification', 'Energy Auditing'],
    avgRate: '$50–150 / hr',
    faqs: [
      { q: 'How much does HVAC installation cost in {state}?', a: 'A new HVAC system in {state} costs $5,000–15,000 depending on system type, home size, and ductwork requirements. Central AC units average $3,500–7,500, while a full HVAC system with furnace runs $7,000–15,000 installed.' },
      { q: 'Do HVAC technicians in {state} need a license?', a: 'Yes. HVAC technicians in {state} must hold EPA 608 certification for refrigerant handling and typically need a state or local HVAC contractor license. Verify credentials before hiring — unlicensed work voids warranties and violates code.' },
      { q: 'How often should I service my HVAC system in {state}?', a: 'HVAC systems in {state} should be serviced twice yearly — once before summer for AC and once before winter for heating. Regular maintenance extends system life by 5–10 years and keeps efficiency at peak performance.' },
      { q: 'How do I find a licensed HVAC tech in {state}?', a: 'Find EPA-certified HVAC technicians on Biddaro in {state}. Compare quotes, verify licenses, check reviews, and book service from verified professionals who comply with all local mechanical codes.' },
    ],
  },
  {
    name: 'Waterproofing',
    slug: 'waterproofing',
    emoji: '💧',
    plural: 'Waterproofing Contractors',
    shortDesc: 'Waterproofing specialists for basements, foundations, and exterior envelopes.',
    longDesc: 'Waterproofing contractors protect buildings from water intrusion through basement sealing, foundation coatings, drainage systems, and moisture barriers. US waterproofing work must comply with ICC building codes for below-grade moisture protection and local stormwater management requirements.',
    skills: ['Basement Waterproofing', 'Foundation Sealing', 'French Drains', 'Sump Pump Installation', 'Exterior Membrane Systems', 'Mold Prevention'],
    avgRate: '$45–120 / hr',
    faqs: [
      { q: 'How much does basement waterproofing cost in {state}?', a: 'Basement waterproofing in {state} costs $5–15/sqft depending on the method. Interior sealants are the most affordable at $1,500–4,000, while exterior excavation and membrane systems run $8,000–25,000 for a full perimeter.' },
      { q: 'What are signs I need waterproofing in {state}?', a: 'Watch for damp or musty smells in your basement, visible water stains on walls, efflorescence (white mineral deposits), cracks in foundation walls, pooling water after rain, and mold growth. In {state}, seasonal weather patterns can worsen these issues.' },
      { q: 'Do waterproofing contractors in {state} need a license?', a: 'Most jurisdictions in {state} require waterproofing contractors to hold a general contractor or specialty license. They should also carry liability insurance and offer warranties on their work — typically 10–25 years for foundation waterproofing.' },
      { q: 'How do I find a waterproofing contractor in {state}?', a: 'Compare verified waterproofing contractors on Biddaro in {state}. Check their warranty terms, read customer reviews, verify licensing, and get at least 3 quotes before committing to a project.' },
    ],
  },
  {
    name: 'Roofing',
    slug: 'roofing',
    emoji: '🏠',
    plural: 'Roofers',
    shortDesc: 'Licensed roofers for installations, repairs, and roof replacements.',
    longDesc: 'Roofing contractors install, repair, and replace residential and commercial roofing systems. US roofers must comply with ICC building codes, local wind uplift requirements, and manufacturer specifications to maintain warranty coverage. Many states require specific roofing contractor licenses.',
    skills: ['Shingle Installation', 'Flat Roofing', 'Metal Roofing', 'Leak Repair', 'Gutter Installation', 'Storm Damage Assessment'],
    avgRate: '$50–130 / hr',
    faqs: [
      { q: 'How much does a new roof cost in {state}?', a: 'A new roof in {state} costs $8,000–25,000 for a standard single-family home depending on roofing material, roof size, pitch, and removal of old layers. Asphalt shingles are most affordable while metal and tile roofing cost significantly more.' },
      { q: 'How long does a roof last in {state}?', a: 'Asphalt shingle roofs in {state} last 20–30 years, metal roofs 40–70 years, and tile roofs 50+ years. Lifespan varies based on local weather conditions, ventilation, and maintenance frequency.' },
      { q: 'Do roofers in {state} need a license?', a: 'Yes. Most jurisdictions in {state} require roofers to hold a roofing contractor license or general contractor license. They must also carry workers compensation and liability insurance. Always verify before hiring.' },
      { q: 'How do I find a reliable roofer in {state}?', a: 'Use Biddaro to compare verified roofers in {state}. Check manufacturer certifications (GAF, CertainTeed, Owens Corning), read reviews, verify insurance, and compare at least 3 detailed written estimates.' },
    ],
  },
  {
    name: 'Interior Design',
    slug: 'interior-design',
    emoji: '🛋️',
    plural: 'Interior Designers',
    shortDesc: 'Professional interior designers for residential and commercial spaces.',
    longDesc: 'Interior designers plan and execute functional, aesthetically pleasing spaces. In the US, many states require interior designers to be licensed or registered, particularly for commercial work that involves structural changes, ADA compliance, and fire code adherence under ICC and NFPA standards.',
    skills: ['Space Planning', 'Color & Material Selection', 'ADA Compliance', 'Project Coordination', '3D Rendering', 'Furniture Sourcing'],
    avgRate: '$60–200 / hr',
    faqs: [
      { q: 'How much does an interior designer cost in {state}?', a: 'Interior designers in {state} charge $60–200/hr or 10–25% of the total project budget. A full-home design for a 2,000 sqft house typically costs $10,000–50,000 depending on scope, finishes, and furniture selections.' },
      { q: 'Do interior designers in {state} need a license?', a: 'Requirements vary across {state}. Some states mandate licensure for commercial interior design work, especially projects involving code compliance and space planning. Residential designers may operate without a license but professional certifications (NCIDQ) are highly valued.' },
      { q: 'What is the difference between an interior designer and a decorator in {state}?', a: 'Interior designers in {state} handle space planning, structural changes, and code compliance — often requiring licensure. Decorators focus on aesthetics like furniture, paint, and accessories without modifying the structure.' },
      { q: 'How do I find an interior designer in {state}?', a: 'Browse verified interior designers on Biddaro in {state}. Review their portfolios, check NCIDQ certification, compare pricing structures (hourly vs. percentage-based), and read client testimonials.' },
    ],
  },
  {
    name: 'Landscaping',
    slug: 'landscaping',
    emoji: '🌿',
    plural: 'Landscapers',
    shortDesc: 'Landscaping professionals for design, installation, and maintenance.',
    longDesc: 'Landscaping contractors design, install, and maintain outdoor spaces including lawns, gardens, hardscaping, and irrigation systems. US landscapers must comply with local water use regulations, pesticide application licenses, and stormwater management codes that vary by state and municipality.',
    skills: ['Landscape Design', 'Hardscaping', 'Irrigation Systems', 'Lawn Maintenance', 'Tree & Shrub Care', 'Outdoor Lighting'],
    avgRate: '$35–90 / hr',
    faqs: [
      { q: 'How much does landscaping cost in {state}?', a: 'Landscaping in {state} costs $10–30/sqft for a complete installation including plants, hardscaping, and irrigation. Basic lawn care services run $100–300/month, while a full landscape redesign averages $5,000–20,000.' },
      { q: 'Do landscapers in {state} need a license?', a: 'Requirements vary across {state}. Pesticide application always requires a state license. Many areas require a landscape contractor license for irrigation, grading, or hardscape work. Basic lawn maintenance may only need a business license.' },
      { q: 'What landscaping works best in {state}?', a: 'The best landscaping for {state} depends on your climate zone. Native plants reduce water usage and maintenance. Your landscaper should consider local rainfall patterns, soil conditions, sun exposure, and any HOA or municipal water restrictions.' },
      { q: 'How do I find a landscaper in {state}?', a: 'Find verified landscapers on Biddaro in {state}. Compare design portfolios, check pesticide applicator licenses where needed, read reviews, and get quotes for your specific project scope.' },
    ],
  },
  {
    name: 'Tiling',
    slug: 'tiling',
    emoji: '🔲',
    plural: 'Tile Installers',
    shortDesc: 'Expert tile installers for floors, walls, backsplashes, and showers.',
    longDesc: 'Tile installers prepare surfaces and install ceramic, porcelain, natural stone, and mosaic tiles in residential and commercial settings. Quality tile work in the US must follow TCNA (Tile Council of North America) standards and comply with local building codes for wet areas and waterproofing.',
    skills: ['Ceramic & Porcelain Tile', 'Natural Stone Installation', 'Waterproofing (Schluter, Kerdi)', 'Mosaic Work', 'Grout & Sealing', 'Surface Preparation'],
    avgRate: '$40–100 / hr',
    faqs: [
      { q: 'How much does tile installation cost in {state}?', a: 'Tile installation in {state} costs $8–25/sqft for labor depending on tile type and pattern complexity. Ceramic tile runs $8–14/sqft installed, porcelain $10–18/sqft, and natural stone $15–25/sqft. Complex patterns like herringbone add 20–30%.' },
      { q: 'Do tile installers in {state} need certification?', a: 'While not always legally required in {state}, CTEF (Certified Tile Installer) certification demonstrates competency. For wet area installations like showers, hiring a certified installer ensures proper waterproofing and TCNA compliance.' },
      { q: 'How long does a tile installation take in {state}?', a: 'A standard bathroom floor (50-80 sqft) takes 1–2 days for installation plus a day for grouting. A full kitchen backsplash takes 1–2 days. Larger projects like whole-home tiling may take 1–3 weeks depending on complexity.' },
      { q: 'How do I find a tile installer in {state}?', a: 'Compare verified tile installers on Biddaro in {state}. Look for CTEF certification, review photos of past work, check references, and get detailed quotes that specify materials, labor, and prep work separately.' },
    ],
  },
  {
    name: 'Renovation',
    slug: 'renovation',
    emoji: '🔨',
    plural: 'Renovation Contractors',
    shortDesc: 'Full-service renovation contractors for home remodeling and upgrades.',
    longDesc: 'Renovation contractors manage partial or complete home remodels including kitchens, bathrooms, basements, and whole-house renovations. US renovation work requires permits for structural, electrical, and plumbing changes, compliance with ICC building codes, and proper disposal of construction debris.',
    skills: ['Kitchen Remodeling', 'Bathroom Renovation', 'Basement Finishing', 'Structural Modifications', 'Permit Management', 'Design-Build'],
    avgRate: '$50–150 / hr',
    faqs: [
      { q: 'How much does a home renovation cost in {state}?', a: 'Home renovation in {state} costs $100–300/sqft depending on scope. A kitchen remodel runs $15,000–75,000, bathroom renovations $10,000–40,000, and a full-home renovation of a 2,000 sqft house costs $200,000–600,000.' },
      { q: 'Do renovation contractors in {state} need a license?', a: 'Yes. Renovation contractors in {state} typically need a general contractor license, especially for work involving structural, electrical, or plumbing modifications. Projects in pre-1978 homes also require EPA Lead-Safe (RRP) certification.' },
      { q: 'How long does a home renovation take in {state}?', a: 'Timeline varies by scope: a bathroom remodel takes 3–6 weeks, kitchen renovation 6–12 weeks, and a whole-house renovation 4–8 months. Permit approvals and material lead times in {state} can extend these timelines.' },
      { q: 'How do I find a renovation contractor in {state}?', a: 'Use Biddaro to compare verified renovation contractors in {state}. Review portfolios, verify licenses and insurance, check for EPA RRP certification on older homes, and compare detailed written proposals from at least 3 contractors.' },
    ],
  },
  {
    name: 'Demolition',
    slug: 'demolition',
    emoji: '💥',
    plural: 'Demolition Contractors',
    shortDesc: 'Licensed demolition contractors for interior teardowns and full structure removal.',
    longDesc: 'Demolition contractors safely remove structures, interior elements, and site improvements. US demolition work is heavily regulated — requiring asbestos and lead testing for older buildings, proper debris disposal, erosion control, utility disconnects, and compliance with OSHA safety standards and local demolition permits.',
    skills: ['Interior Demolition', 'Structural Demolition', 'Asbestos Abatement Coordination', 'Debris Hauling', 'OSHA Compliance', 'Selective Deconstruction'],
    avgRate: '$40–120 / hr',
    faqs: [
      { q: 'How much does demolition cost in {state}?', a: 'Demolition in {state} costs $4–15/sqft for interior demolition and $10,000–40,000+ for full structure demolition depending on size, materials, and hazardous material abatement needs. Permit fees, debris disposal, and utility disconnect add to the total.' },
      { q: 'Do demolition contractors in {state} need a license?', a: 'Yes. Demolition contractors in {state} must hold specific demolition or general contractor licenses. Work involving asbestos or lead requires additional EPA/state certifications. OSHA compliance and proper insurance are mandatory.' },
      { q: 'Do I need a permit for demolition in {state}?', a: 'Yes. All structural demolition in {state} requires a permit. The permit process typically includes asbestos surveys for pre-1980 buildings, utility disconnection verification, erosion control plans, and neighbor notification in some jurisdictions.' },
      { q: 'How do I find a demolition contractor in {state}?', a: 'Find verified demolition contractors on Biddaro in {state}. Check their license, insurance (including pollution liability), OSHA safety record, and get itemized quotes that include permit fees, hauling, and disposal costs.' },
    ],
  },
  {
    name: 'Pest Control',
    slug: 'pest-control',
    emoji: '🐛',
    plural: 'Pest Control Technicians',
    shortDesc: 'Licensed pest control professionals for residential and commercial properties.',
    longDesc: 'Pest control technicians inspect, treat, and prevent infestations of insects, rodents, and wildlife. In the US, all pesticide applicators must be licensed by their state EPA agency, follow Integrated Pest Management (IPM) practices, and comply with federal FIFRA regulations for safe chemical handling.',
    skills: ['Termite Treatment', 'Rodent Control', 'Bed Bug Elimination', 'Wildlife Removal', 'IPM (Integrated Pest Management)', 'Fumigation'],
    avgRate: '$30–80 / hr',
    faqs: [
      { q: 'How much does pest control cost in {state}?', a: 'Pest control in {state} costs $200–600 per treatment for common pests. Termite treatments run $500–2,500, bed bug treatments $300–1,500 per room, and annual pest prevention plans cost $400–900/year.' },
      { q: 'Do pest control technicians in {state} need a license?', a: 'Yes. All pest control technicians in {state} must hold a state-issued pesticide applicator license. Companies must also carry business licenses, liability insurance, and comply with EPA and state environmental agency regulations.' },
      { q: 'How often should I schedule pest control in {state}?', a: 'Most homes in {state} benefit from quarterly pest control treatments. Areas with high termite risk may need annual inspections and preventive treatments. The frequency depends on local pest pressure, climate, and property conditions.' },
      { q: 'How do I find a pest control company in {state}?', a: 'Use Biddaro to compare verified pest control companies in {state}. Check their state pesticide applicator license, read reviews, ask about IPM practices, and compare quotes for both one-time treatments and annual plans.' },
    ],
  },
];
