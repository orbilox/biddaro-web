// ─── Programmatic SEO Data for UAE ──────────────────────────────────────────
// Provides all UAE emirates, major cities/areas, and job-category metadata used by
// the /hire/[category]/[state] and /hire/[category]/[state]/[city] pages for UAE.

export interface CityEntry {
  name: string;           // "Dubai City"
  slug: string;           // "dubai-city"
}

export interface UAELocation {
  name: string;           // "Dubai"
  slug: string;           // "dubai"
  capital: string;        // "Dubai City"
  region: string;         // "Emirate"
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
  avgRate: string;        // "AED 80–200 / hr"
  faqs: FAQ[];            // 4 FAQs – {state} placeholder gets replaced at render
}

export interface FAQ {
  q: string;
  a: string;
}

// ─── Helper ───────────────────────────────────────────────────────────────────

export function toSlug(str: string): string {
  return str.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
}

export function fromSlug(slug: string): string {
  return slug.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
}

export function getUAELocationBySlug(slug: string): UAELocation | undefined {
  return UAE_LOCATIONS.find(l => l.slug === slug);
}

export function getUAECategory(slug: string): JobCategoryMeta | undefined {
  return UAE_JOB_CATEGORY_META.find(c => c.slug === slug);
}

export function getUAECity(emirateSlug: string, citySlug: string): CityEntry | undefined {
  return getUAELocationBySlug(emirateSlug)?.cities.find(c => c.slug === citySlug);
}

// ─── UAE Emirates & Cities ────────────────────────────────────────────────────

export const UAE_LOCATIONS: UAELocation[] = [
  {
    name: 'Abu Dhabi', slug: 'abu-dhabi', capital: 'Abu Dhabi City', region: 'Emirate',
    cities: [
      { name: 'Abu Dhabi City', slug: 'abu-dhabi-city' },
      { name: 'Al Ain', slug: 'al-ain' },
      { name: 'Al Dhafra', slug: 'al-dhafra' },
      { name: 'Khalifa City', slug: 'khalifa-city' },
      { name: 'Mussafah', slug: 'mussafah' },
      { name: 'Yas Island', slug: 'yas-island' },
      { name: 'Saadiyat Island', slug: 'saadiyat-island' },
      { name: 'Ruwais', slug: 'ruwais' },
      { name: 'Madinat Zayed', slug: 'madinat-zayed' },
      { name: 'Al Shamkha', slug: 'al-shamkha' },
    ],
  },
  {
    name: 'Dubai', slug: 'dubai', capital: 'Dubai City', region: 'Emirate',
    cities: [
      { name: 'Dubai City', slug: 'dubai-city' },
      { name: 'Jebel Ali', slug: 'jebel-ali' },
      { name: 'Dubai Marina', slug: 'dubai-marina' },
      { name: 'Business Bay', slug: 'business-bay' },
      { name: 'Downtown Dubai', slug: 'downtown-dubai' },
      { name: 'Deira', slug: 'deira' },
      { name: 'Jumeirah', slug: 'jumeirah' },
      { name: 'Al Quoz', slug: 'al-quoz' },
      { name: 'Dubai Silicon Oasis', slug: 'dubai-silicon-oasis' },
      { name: 'Al Barsha', slug: 'al-barsha' },
      { name: 'Dubai Hills', slug: 'dubai-hills' },
      { name: 'Palm Jumeirah', slug: 'palm-jumeirah' },
      { name: 'Dubai South', slug: 'dubai-south' },
      { name: 'International City', slug: 'international-city' },
    ],
  },
  {
    name: 'Sharjah', slug: 'sharjah', capital: 'Sharjah City', region: 'Emirate',
    cities: [
      { name: 'Sharjah City', slug: 'sharjah-city' },
      { name: 'Al Dhaid', slug: 'al-dhaid' },
      { name: 'Kalba', slug: 'kalba' },
      { name: 'Khor Fakkan', slug: 'khor-fakkan' },
      { name: 'Dibba Al Hisn', slug: 'dibba-al-hisn' },
      { name: 'Al Nahda', slug: 'al-nahda' },
    ],
  },
  {
    name: 'Ajman', slug: 'ajman', capital: 'Ajman City', region: 'Emirate',
    cities: [
      { name: 'Ajman City', slug: 'ajman-city' },
      { name: 'Masfout', slug: 'masfout' },
      { name: 'Manama', slug: 'manama-ajman' },
    ],
  },
  {
    name: 'Ras Al Khaimah', slug: 'ras-al-khaimah', capital: 'RAK City', region: 'Emirate',
    cities: [
      { name: 'RAK City', slug: 'rak-city' },
      { name: 'Al Jazirah Al Hamra', slug: 'al-jazirah-al-hamra' },
      { name: 'Al Hamraniyah', slug: 'al-hamraniyah' },
      { name: 'Digdaga', slug: 'digdaga' },
      { name: 'Khatt', slug: 'khatt' },
    ],
  },
  {
    name: 'Fujairah', slug: 'fujairah', capital: 'Fujairah City', region: 'Emirate',
    cities: [
      { name: 'Fujairah City', slug: 'fujairah-city' },
      { name: 'Dibba Al Fujairah', slug: 'dibba-al-fujairah' },
      { name: 'Masafi', slug: 'masafi' },
      { name: 'Al Bidyah', slug: 'al-bidyah' },
    ],
  },
  {
    name: 'Umm Al Quwain', slug: 'umm-al-quwain', capital: 'UAQ City', region: 'Emirate',
    cities: [
      { name: 'UAQ City', slug: 'uaq-city' },
      { name: 'Falaj Al Mualla', slug: 'falaj-al-mualla' },
    ],
  },
];

// ─── UAE Job Category Metadata ───────────────────────────────────────────────
// {state} in FAQ strings is replaced at render time with the actual emirate name.

export const UAE_JOB_CATEGORY_META: JobCategoryMeta[] = [
  {
    name: 'General Construction', slug: 'general-construction', emoji: '🏗️',
    plural: 'General Contractors',
    shortDesc: 'Full-service construction professionals for any build in the UAE.',
    longDesc: 'General contractors in {state} manage the entire construction process — from foundation to finish. They coordinate subcontractors, source materials, and ensure your project meets Dubai Municipality codes, Estidama standards, and all local regulations.',
    skills: ['Project Management', 'Blueprint Reading', 'Site Supervision', 'Subcontractor Coordination', 'UAE Building Code Compliance', 'Material Procurement'],
    avgRate: 'AED 150–500 / hr',
    faqs: [
      { q: 'How do I find a reliable general contractor in {state}?', a: 'Post your job on Biddaro and receive bids from verified general contractors in {state} within hours. Compare ratings, portfolios, and quotes before choosing. All contractors are vetted for UAE trade licences and insurance.' },
      { q: 'What should a general construction contract include in {state}?', a: 'A solid contract should include scope of work, timeline, payment milestones, material specifications, penalty clauses, and warranty terms. Ensure it references UAE building codes and relevant municipality approvals. Biddaro\'s built-in contract system covers all of these.' },
      { q: 'How much does general construction cost in {state}?', a: 'Residential construction in {state} typically ranges from AED 800 to AED 2,500 per sq ft depending on finish quality and location. Villa construction in prime areas of {state} can exceed AED 3,000 per sq ft for luxury specifications.' },
      { q: 'What permits are needed for construction in {state}?', a: 'Construction in {state} requires building permits from the relevant municipality, NOCs from DEWA/SEWA, civil defence approval, and environmental clearances for larger projects. Your contractor on Biddaro can guide you through the process.' },
    ],
  },
  {
    name: 'Plumbing', slug: 'plumbing', emoji: '🔧',
    plural: 'Plumbers',
    shortDesc: 'Licensed plumbers for installation, repair and maintenance across the UAE.',
    longDesc: 'From pipe installation and leak detection to bathroom fittings and water tank systems, Biddaro connects you with licensed plumbers across {state} who tackle every job — big or small — with precision and compliance with DEWA/SEWA regulations.',
    skills: ['Pipe Installation', 'Leak Detection & Repair', 'Water Heater Service', 'Drain Cleaning', 'Bathroom Fitting', 'Water Tank Systems'],
    avgRate: 'AED 80–200 / hr',
    faqs: [
      { q: 'How much do plumbers charge in {state}?', a: 'Plumbing rates in {state} typically range from AED 80 to AED 200 per hour depending on the job complexity and location. Emergency callouts and specialised work such as chiller line repairs may cost AED 250–400 per hour.' },
      { q: 'Do I need a licensed plumber for my project in {state}?', a: 'Yes. All plumbing work in {state} must be carried out by professionals with a valid UAE trade licence. DEWA and municipality regulations require licensed tradespeople for any plumbing modifications. All plumbers on Biddaro verify their credentials during onboarding.' },
      { q: 'How quickly can a plumber reach me in {state}?', a: 'For urgent jobs, many plumbers on Biddaro offer same-day service in {state}. Post your job marked "Urgent" and you\'ll receive bids within the hour. Most areas in {state} are serviceable within 60–90 minutes.' },
      { q: 'Can I hire a plumber for a small repair job in {state}?', a: 'Absolutely. Biddaro supports jobs of all sizes — from an AED 100 tap repair to an AED 50,000 complete villa plumbing overhaul. There is no minimum job value.' },
    ],
  },
  {
    name: 'Electrical', slug: 'electrical', emoji: '⚡',
    plural: 'Electricians',
    shortDesc: 'Certified electricians for wiring, panels and installations in the UAE.',
    longDesc: 'Faulty wiring is a safety hazard. Hire certified electricians in {state} through Biddaro for safe, code-compliant electrical work — from simple socket installation to full building wiring projects that meet DEWA and civil defence standards.',
    skills: ['Wiring & Rewiring', 'Panel Upgrades', 'EV Charger Installation', 'Lighting Design', 'DEWA Compliance Inspections', 'Industrial Wiring'],
    avgRate: 'AED 100–300 / hr',
    faqs: [
      { q: 'What electrical work requires a licensed electrician in {state}?', a: 'Any work involving the main panel, new circuits, or permanent installations requires a DEWA/SEWA-approved electrician in {state}. This includes wiring, panel upgrades, and electrical inspections required for municipality approvals.' },
      { q: 'How much does electrical work cost in {state}?', a: 'Basic electrical jobs in {state} start from AED 500 for simple installations. Full villa rewiring can range from AED 15,000 to AED 80,000 depending on property size and specification.' },
      { q: 'Can electricians on Biddaro install EV charging points in {state}?', a: 'Yes. Many certified electricians on Biddaro specialise in EV charger installation for both residential and commercial properties across {state}. They handle DEWA approvals and Green Charger programme requirements.' },
      { q: 'How do I verify an electrician\'s credentials on Biddaro?', a: 'Every electrician on Biddaro goes through a verification process including UAE trade licence, DEWA/SEWA approval, and insurance checks. You can view their credentials, reviews, job history, and ratings directly on their profile.' },
    ],
  },
  {
    name: 'HVAC / AC', slug: 'hvac', emoji: '🌡️',
    plural: 'HVAC / AC Technicians',
    shortDesc: 'AC installation, servicing and ventilation specialists — essential for UAE climate.',
    longDesc: 'Air conditioning is not a luxury but a necessity in {state}. Biddaro\'s HVAC professionals handle AC installation, servicing, duct cleaning, chiller maintenance, and full HVAC system design for homes, villas, and commercial buildings across {state}.',
    skills: ['AC Installation & Repair', 'Duct Design & Cleaning', 'Chiller Maintenance', 'Split & Central AC Service', 'VRF Systems', 'Commercial HVAC'],
    avgRate: 'AED 120–400 / hr',
    faqs: [
      { q: 'How often should I service my AC unit in {state}?', a: 'In {state}\'s extreme heat, AC units should be serviced at least twice a year — before summer and mid-season. Regular servicing extends the unit life, improves efficiency, and can reduce your DEWA bill by 15–25%.' },
      { q: 'What does AC installation cost in {state}?', a: 'AC installation costs in {state} range from AED 1,500 for a basic 1.5-ton split AC to AED 25,000+ for ducted central AC systems or multi-split VRF configurations in villas.' },
      { q: 'Can HVAC technicians on Biddaro handle commercial projects in {state}?', a: 'Yes. Biddaro hosts experienced commercial HVAC contractors in {state} who handle centralised chiller systems, VRF installations, and large-scale ventilation projects for offices, malls, and warehouses.' },
      { q: 'How do I know if my AC system needs replacing vs. repairing in {state}?', a: 'If your system is over 8 years old, needs frequent repairs, or your DEWA bills are unusually high, replacement may be more economical. Post your job on Biddaro for a free assessment from a local expert in {state}.' },
    ],
  },
  {
    name: 'Roofing', slug: 'roofing', emoji: '🏠',
    plural: 'Roofers',
    shortDesc: 'Expert roofers for new roofs, repairs, waterproofing and heat insulation.',
    longDesc: 'A secure, well-insulated roof is critical in {state}\'s extreme heat. Biddaro connects property owners in {state} with expert roofers specialising in flat roof waterproofing, heat-reflective coatings, metal roofing, and insulated roofing systems.',
    skills: ['Flat Roof Waterproofing', 'Heat-Reflective Coatings', 'Roof Insulation', 'Metal Roofing', 'Leak Repair', 'Cool Roof Systems'],
    avgRate: 'AED 40–150 / sq ft',
    faqs: [
      { q: 'How long does a roof replacement take in {state}?', a: 'A typical residential roof replacement in {state} takes 3–7 days depending on the roof size and material. Work should be scheduled in cooler months (October–March) for best results.' },
      { q: 'What is the best roofing material for {state}\'s climate?', a: 'For {state}\'s extreme heat, cool roof coatings and insulated metal panels offer the best performance. Heat-reflective waterproofing membranes reduce interior temperatures by 8–12°C and significantly cut AC costs.' },
      { q: 'How much does waterproofing a roof cost in {state}?', a: 'Roof waterproofing in {state} typically costs AED 15–60 per sq ft depending on the membrane type. PU-based and torch-applied bituminous membranes are the most common choices for flat roofs in {state}.' },
      { q: 'Does Biddaro verify roofers\' insurance in {state}?', a: 'Yes. Biddaro encourages all contractors to upload proof of insurance and UAE trade licence during profile setup. You can view their insurance status and credentials on their profile before hiring.' },
    ],
  },
  {
    name: 'Flooring', slug: 'flooring', emoji: '🪟',
    plural: 'Flooring Contractors',
    shortDesc: 'Professional flooring for tiles, marble, wood, vinyl and more.',
    longDesc: 'From Italian marble and porcelain tiles to engineered wood and luxury vinyl planks, flooring specialists on Biddaro in {state} deliver flawless installations with expert craftsmanship suited to the UAE climate.',
    skills: ['Tile Installation', 'Marble & Granite', 'Engineered Wood', 'Luxury Vinyl Plank', 'Epoxy Flooring', 'Subfloor Preparation'],
    avgRate: 'AED 25–100 / sq ft',
    faqs: [
      { q: 'What is the most popular flooring choice in {state}?', a: 'Porcelain tiles and marble are the most popular choices in {state} for their cool surface temperature and durability in hot climates. Luxury vinyl planks are gaining popularity for their wood-look finish and moisture resistance.' },
      { q: 'How much does tile flooring cost in {state}?', a: 'Tile flooring installation in {state} typically costs AED 25–60 per sq ft for labour, plus AED 15–200 per sq ft for materials depending on the tile brand and format. RAK Ceramics and Porcelanosa are popular choices.' },
      { q: 'How do I compare flooring contractors on Biddaro?', a: 'Each contractor\'s profile shows their specialisations, portfolio photos, verified reviews, and pricing history. You can shortlist and message multiple contractors before deciding.' },
      { q: 'Can I hire a flooring contractor for a single room in {state}?', a: 'Yes, absolutely. Biddaro accepts flooring jobs of any size — one room or an entire villa. Simply describe your area in sq ft when posting your job.' },
    ],
  },
  {
    name: 'Painting', slug: 'painting', emoji: '🎨',
    plural: 'Painters',
    shortDesc: 'Interior and exterior painters for villas, apartments and commercial spaces.',
    longDesc: 'Transform your space with professional painting services. Biddaro painters in {state} cover everything from interior emulsion to exterior heat-reflective coatings, textured finishes, and commercial repainting that withstands UAE\'s intense sun.',
    skills: ['Interior Painting', 'Exterior Painting', 'Texture Finish', 'Heat-Reflective Paint', 'Primer & Putty', 'Commercial Painting'],
    avgRate: 'AED 8–25 / sq ft',
    faqs: [
      { q: 'How much does house painting cost in {state}?', a: 'Interior painting in {state} typically costs AED 8–18 per sq ft including primer and 2 coats. Exterior painting with UV-resistant and heat-reflective coatings costs AED 15–25 per sq ft.' },
      { q: 'How long does painting a 2-bedroom apartment take in {state}?', a: 'A 2-bedroom apartment (approx. 1,000 sq ft) takes 3–5 days for a complete paint job including wall prep, putty, primer, and two finish coats.' },
      { q: 'Do painters on Biddaro supply materials in {state}?', a: 'Most painters on Biddaro offer both labour-only and supply-and-install options. You can specify your preference when posting the job. Jotun, Dulux, and National Paints are popular brands in {state}.' },
      { q: 'How often should I repaint my villa exterior in {state}?', a: 'In {state}\'s harsh sun and sandstorm conditions, exterior walls should be repainted every 3–5 years using UV-resistant paint. Interior walls typically last 5–7 years before needing a refresh.' },
    ],
  },
  {
    name: 'Landscaping', slug: 'landscaping', emoji: '🌿',
    plural: 'Landscapers',
    shortDesc: 'Garden design, irrigation systems and outdoor living spaces.',
    longDesc: 'Create beautiful outdoor living spaces suited to {state}\'s arid climate. From drought-tolerant garden design and automated irrigation to hardscaping and pool surrounds, Biddaro connects you with expert landscapers across {state}.',
    skills: ['Garden Design', 'Irrigation Systems', 'Hardscaping', 'Artificial Turf', 'Palm & Native Planting', 'Outdoor Living Areas'],
    avgRate: 'AED 30–100 / sq ft',
    faqs: [
      { q: 'What landscaping services are most popular in {state}?', a: 'In {state}, popular landscaping services include drought-tolerant garden design, automated drip irrigation systems, artificial turf installation, palm tree planting, and outdoor living areas with pergolas and BBQ zones.' },
      { q: 'How much does garden design cost in {state}?', a: 'Basic garden design and installation in {state} starts from AED 10,000 for a small villa garden. Larger projects with irrigation systems, hardscaping, and lighting can range from AED 50,000 to AED 500,000.' },
      { q: 'Can landscapers on Biddaro design water-efficient gardens?', a: 'Yes. Many landscapers on Biddaro specialise in xeriscaping and drought-tolerant plant species suited to {state}\'s arid climate, reducing your water consumption by up to 60% compared to traditional gardens.' },
      { q: 'Do landscapers handle villa compound landscaping in {state}?', a: 'Absolutely. Villa compound landscaping is one of the most requested services in {state}. Landscapers on Biddaro are experienced with large plots, community gardens, and compound-wide irrigation systems.' },
    ],
  },
  {
    name: 'Carpentry / Joinery', slug: 'carpentry', emoji: '🪚',
    plural: 'Carpenters & Joiners',
    shortDesc: 'Custom woodwork, joinery, furniture and interior fit-out.',
    longDesc: 'Skilled carpenters and joiners on Biddaro in {state} craft custom furniture, modular kitchens, wardrobes, and decorative woodwork. Get precise, polished results from experienced professionals who work with premium materials suited to UAE interiors.',
    skills: ['Modular Kitchen', 'Custom Wardrobes', 'Furniture Making', 'False Ceiling', 'Wood Panelling', 'Interior Joinery'],
    avgRate: 'AED 150–400 / hr',
    faqs: [
      { q: 'How much does a modular kitchen cost in {state}?', a: 'Modular kitchens in {state} range from AED 15,000 to AED 150,000 depending on size, material (marine ply vs. MDF vs. solid wood), and hardware quality (Hafele, Hettich, Blum). Italian-finish kitchens cost more.' },
      { q: 'Can carpenters on Biddaro work with designer plans?', a: 'Yes. Simply attach your interior design plans or sketches to your job post. Experienced carpenters on Biddaro are comfortable working from architect and designer drawings, including 3D renders.' },
      { q: 'What wood type is best for furniture in {state}\'s climate?', a: 'Teak and oak are excellent choices for {state}\'s air-conditioned interiors. MDF with high-quality laminate or veneer finish is widely used for wardrobes and kitchens. Avoid solid wood for areas with high humidity fluctuation.' },
      { q: 'How long does a full interior joinery project take in {state}?', a: 'A complete interior joinery project (kitchen + wardrobes + vanities) typically takes 4–8 weeks in {state}, depending on customisation complexity, material availability, and finish quality.' },
    ],
  },
  {
    name: 'Masonry', slug: 'masonry', emoji: '🧱',
    plural: 'Masons',
    shortDesc: 'Block, brick and stonework for walls and structures.',
    longDesc: 'From load-bearing walls to decorative stone cladding, skilled masons on Biddaro in {state} deliver strong, precise blockwork and masonry for residential villas and commercial projects that meet UAE structural standards.',
    skills: ['Block Laying', 'Stone Cladding', 'Thermal Block Work', 'Plaster & Render', 'Retaining Walls', 'Boundary Walls'],
    avgRate: 'AED 100–300 / hr',
    faqs: [
      { q: 'What is the going rate for masons in {state}?', a: 'Skilled masons in {state} typically charge AED 100–250 per hour for standard block laying and plastering work. Specialised stone cladding or decorative masonry commands AED 200–400 per hour.' },
      { q: 'Can masons on Biddaro handle large commercial projects in {state}?', a: 'Yes. Biddaro hosts masonry contractors who work on everything from villa boundary walls to multi-storey commercial buildings in {state}. Simply describe your project scope and requirements.' },
      { q: 'What type of block is commonly used in {state}?', a: 'Thermal (insulated) concrete blocks are standard in {state} for their heat resistance properties. Lightweight concrete blocks and autoclaved aerated concrete (AAC) blocks are increasingly popular for interior walls due to Estidama requirements.' },
      { q: 'How do I ensure quality masonry work in {state}?', a: 'Use Biddaro\'s milestone-based payment system to release funds only after each stage is inspected and approved. Ensure your mason follows UAE building code specifications for mortar mix, block bonding, and reinforcement.' },
    ],
  },
  {
    name: 'Demolition', slug: 'demolition', emoji: '⛏️',
    plural: 'Demolition Contractors',
    shortDesc: 'Safe and efficient structural demolition services in the UAE.',
    longDesc: 'Safe demolition requires the right equipment, permits, and expertise. Demolition contractors on Biddaro in {state} handle everything from selective interior strip-outs to full building demolition with proper waste disposal per municipality regulations.',
    skills: ['Structural Demolition', 'Selective Strip-Out', 'Concrete Breaking', 'Debris Removal', 'Hazardous Material Removal', 'Site Clearance'],
    avgRate: 'AED 150–500 / hr',
    faqs: [
      { q: 'Do I need a permit for demolition work in {state}?', a: 'Yes. All demolition work in {state} requires a permit from the relevant municipality (Dubai Municipality, Abu Dhabi Municipality, etc.) and NOCs from DEWA/SEWA and civil defence. Professional contractors on Biddaro handle all permit applications.' },
      { q: 'How is demolition waste handled in {state}?', a: 'Demolition waste in {state} must be transported to approved waste management facilities. Contractors on Biddaro arrange for debris removal and disposal in compliance with {state}\'s municipal waste regulations and Tadweer guidelines.' },
      { q: 'What is the cost of demolishing a structure in {state}?', a: 'Demolition costs in {state} depend on the structure size, material type, and access. Small interior demolitions start from AED 5,000, while full building demolitions can reach AED 100,000–500,000 depending on the scale.' },
      { q: 'Can demolition be done in phases in {state}?', a: 'Yes. Phased demolition is common for occupied properties or ongoing renovation projects. Specify your phasing requirements when posting the job on Biddaro and contractors will propose a staged plan.' },
    ],
  },
  {
    name: 'Renovation', slug: 'renovation', emoji: '🔨',
    plural: 'Renovation Contractors',
    shortDesc: 'Villa, apartment and office renovation from concept to completion.',
    longDesc: 'Whether it\'s a kitchen refresh or a complete villa overhaul, renovation specialists on Biddaro in {state} manage the entire project — design, demolition, rebuild, and finish — with full municipality compliance and DEWA coordination.',
    skills: ['Villa Renovation', 'Kitchen Remodelling', 'Bathroom Renovation', 'Office Fit-Out', 'Apartment Refurbishment', 'Extensions & Additions'],
    avgRate: 'AED 200–600 / sq ft',
    faqs: [
      { q: 'How much does villa renovation cost per sq ft in {state}?', a: 'Villa renovation costs in {state} typically range from AED 400 to AED 1,500 per sq ft depending on the quality of finishes, scope of structural changes, and location. Premium areas in {state} command higher contractor rates.' },
      { q: 'How long does a typical villa renovation take in {state}?', a: 'A full villa renovation in {state} typically takes 8–20 weeks depending on property size, scope of work, and material procurement. Kitchen or bathroom-only renovations usually take 3–6 weeks.' },
      { q: 'Do I need municipality approval for renovation in {state}?', a: 'Yes. Any structural modifications, layout changes, or facade alterations in {state} require municipality approval. Interior cosmetic work (painting, flooring, fixtures) typically does not require a permit.' },
      { q: 'Does Biddaro hold payment until renovation milestones are completed?', a: 'Yes. Biddaro\'s built-in escrow system holds your payment securely and releases funds only when you approve each milestone, protecting you throughout the renovation process in {state}.' },
    ],
  },
  {
    name: 'New Construction', slug: 'new-construction', emoji: '🏢',
    plural: 'New Construction Builders',
    shortDesc: 'Ground-up construction for villas, buildings and commercial properties.',
    longDesc: 'Building from scratch in {state}? Connect with experienced new construction builders who manage the complete project lifecycle — municipality approvals, foundation, structure, MEP, and finishing — compliant with UAE building codes and Estidama standards.',
    skills: ['Structural Engineering', 'Foundation Work', 'RCC Framing', 'Blockwork', 'MEP Coordination', 'Project Management'],
    avgRate: 'AED 800–2,500 / sq ft',
    faqs: [
      { q: 'What is the construction cost per sq ft in {state}?', a: 'New residential construction in {state} typically costs AED 800–1,800 per sq ft for standard quality. Premium villa specifications can reach AED 2,500+ per sq ft. Commercial construction varies significantly by use type and municipality requirements.' },
      { q: 'How long does it take to build a villa in {state}?', a: 'A typical 4-bedroom villa (4,000–6,000 sq ft) in {state} takes 14–24 months from foundation to handover, subject to permits, weather conditions, and material availability.' },
      { q: 'What approvals are needed before starting construction in {state}?', a: 'Construction in {state} requires approved building plans from the municipality, a building permit, DEWA/SEWA NOCs, civil defence approval, environmental clearances, and Estidama compliance (in Abu Dhabi). Your contractor on Biddaro can guide you through this.' },
      { q: 'Can I track construction progress on Biddaro?', a: 'Yes. Use Biddaro\'s milestone tracking system to monitor each stage — foundation, slab, blockwork, plaster, MEP, and finishing — with photo proof and payment releases tied to each milestone.' },
    ],
  },
  {
    name: 'Foundation', slug: 'foundation', emoji: '🏛️',
    plural: 'Foundation Specialists',
    shortDesc: 'Deep foundations, piling and ground stabilisation for UAE soil conditions.',
    longDesc: 'UAE\'s sandy and saline soil conditions demand expert foundation work. Foundation specialists on Biddaro in {state} provide geotechnical assessments, pile driving, raft foundations, and ground improvement for new builds and existing structures.',
    skills: ['Pile Foundation', 'Raft Foundation', 'Strip Foundation', 'Soil Testing', 'Ground Improvement', 'Dewatering'],
    avgRate: 'AED 200–600 / hr',
    faqs: [
      { q: 'How do I know what type of foundation my project needs in {state}?', a: 'A soil investigation report (SI report) determines the required foundation type for your site in {state}. Given the sandy and saline soil conditions, most villas require raft foundations or piled foundations. Specialists on Biddaro can arrange and interpret soil test reports.' },
      { q: 'What is the cost of pile foundation in {state}?', a: 'Pile foundation costs in {state} range from AED 800 to AED 3,000 per running metre depending on pile diameter, depth, and ground conditions. Get itemised quotes from multiple specialists on Biddaro.' },
      { q: 'How long does foundation work take in {state}?', a: 'Foundation work typically takes 3–8 weeks depending on soil conditions, foundation type, and area. Summer conditions in {state} may require special concrete curing measures to prevent rapid drying.' },
      { q: 'Why is dewatering important for foundation work in {state}?', a: 'Many coastal areas in {state} have high water tables. Dewatering pumps are essential to keep excavations dry during foundation work. Your foundation specialist on Biddaro will assess this requirement during the initial site visit.' },
    ],
  },
  {
    name: 'Insulation', slug: 'insulation', emoji: '🌡️',
    plural: 'Insulation Contractors',
    shortDesc: 'Thermal insulation — critical for energy efficiency in UAE buildings.',
    longDesc: 'In {state}\'s extreme heat, proper insulation is not optional — it is essential. Biddaro\'s insulation contractors in {state} install polyurethane foam, extruded polystyrene (XPS), rockwool, and reflective insulation for roofs, walls, and floors to meet Estidama and Green Building standards.',
    skills: ['Roof Insulation', 'Wall Insulation', 'Spray Foam', 'XPS Boards', 'Reflective Foil', 'Acoustic Insulation'],
    avgRate: 'AED 15–60 / sq ft',
    faqs: [
      { q: 'What insulation is best for {state}\'s climate?', a: 'Extruded polystyrene (XPS) boards and spray polyurethane foam are highly effective in {state}\'s extreme heat. For roofs, reflective foil combined with rigid insulation boards provides the best thermal barrier. Estidama requires minimum R-values for all building elements.' },
      { q: 'How much does roof insulation cost in {state}?', a: 'Roof insulation in {state} typically costs AED 15–40 per sq ft for basic rigid board insulation, and AED 30–60 per sq ft for spray foam or multi-layer systems meeting Estidama Pearl ratings.' },
      { q: 'Does insulation help reduce AC costs in {state}?', a: 'Significantly. Proper roof and wall insulation can reduce AC load by 30–50% in {state}\'s climate, translating to substantial savings on DEWA/SEWA bills throughout the year.' },
      { q: 'Is insulation mandatory for new buildings in {state}?', a: 'Yes. UAE building codes and Estidama standards mandate minimum thermal insulation values for all new construction. Retrofitting insulation in older buildings is highly recommended and offers rapid payback through energy savings.' },
    ],
  },
  {
    name: 'Drywall', slug: 'drywall', emoji: '🪣',
    plural: 'Drywall Contractors',
    shortDesc: 'Gypsum board installation for partitions and ceilings.',
    longDesc: 'Fast, clean, and versatile — gypsum drywall is ideal for office partitions, false ceilings, and feature walls. Expert drywall contractors on Biddaro in {state} deliver smooth, ready-to-paint finishes quickly with fire-rated and moisture-resistant options.',
    skills: ['Partition Walls', 'False Ceiling', 'Gypsum Boarding', 'Acoustic Panels', 'Fire-Rated Partitions', 'Finishing & Taping'],
    avgRate: 'AED 20–60 / sq ft',
    faqs: [
      { q: 'How much does drywall partitioning cost in {state}?', a: 'Drywall partition installation in {state} typically costs AED 20–45 per sq ft for standard gypsum board. Fire-rated or acoustic-grade boards cost AED 35–60 per sq ft. Civil defence requirements may mandate fire-rated boards in commercial spaces.' },
      { q: 'Is drywall suitable for bathrooms and kitchens in {state}?', a: 'Moisture-resistant (green board) gypsum board is recommended for bathrooms and kitchens. Given {state}\'s air-conditioned interiors, condensation is less of an issue, but green board is still best practice for wet areas.' },
      { q: 'How fast can drywall work be completed in {state}?', a: 'A typical office partition project of 500 sq ft in {state} can be completed in 2–4 days. False ceiling installation for a 3-bedroom apartment takes approximately 3–5 days.' },
      { q: 'Does drywall meet UAE fire safety requirements?', a: 'Yes, when specified correctly. Fire-rated gypsum boards (Type X) meet UAE civil defence requirements for commercial interiors. Your contractor on Biddaro will recommend the correct specification based on your building\'s fire safety classification.' },
    ],
  },
  {
    name: 'Tile & Stone', slug: 'tile-stone', emoji: '🪨',
    plural: 'Tile & Stone Contractors',
    shortDesc: 'Precision tile and stonework for any surface.',
    longDesc: 'From intricate mosaic patterns to large-format porcelain slabs, tile and stone specialists on Biddaro in {state} bring craftsmanship and precision to bathrooms, kitchens, floors, facades, and swimming pool surrounds.',
    skills: ['Porcelain Tile', 'Natural Stone', 'Marble Installation', 'Mosaic Work', 'Grouting & Sealing', 'Feature Walls'],
    avgRate: 'AED 20–80 / sq ft',
    faqs: [
      { q: 'What tile size is trending in {state} currently?', a: 'Large-format tiles (1200x600mm and 1200x1200mm) are trending in {state} for a seamless, premium look with fewer grout lines. RAK Ceramics and Porcelanosa are popular brands. Marble-look porcelain is especially popular for villa interiors.' },
      { q: 'How much does tile work cost per sq ft in {state}?', a: 'Tile installation labour in {state} costs AED 20–50 per sq ft for standard porcelain tiles, and AED 40–80 per sq ft for large-format, natural stone, or intricate pattern work.' },
      { q: 'How do I prevent tile cracking in {state}\'s climate?', a: 'Thermal expansion joints and proper substrate preparation prevent cracking caused by {state}\'s extreme temperature variations between air-conditioned interiors and hot exteriors. Experienced tile contractors on Biddaro follow UAE code specifications.' },
      { q: 'Can tile contractors on Biddaro do outdoor and pool tiling in {state}?', a: 'Yes. Outdoor and pool tile installation requires anti-skid, frost-resistant, and UV-stable tiles. Many contractors on Biddaro specialise in pool surrounds, terrace flooring, and external facade tiling in {state}.' },
    ],
  },
  {
    name: 'Windows & Doors', slug: 'windows-doors', emoji: '🚪',
    plural: 'Windows & Doors Contractors',
    shortDesc: 'Aluminium, UPVC and glass windows and doors for UAE climate.',
    longDesc: 'Energy-efficient, noise-reducing windows and doors are essential in {state}\'s climate. Contractors on Biddaro supply and install thermally-broken aluminium, UPVC, and frameless glass systems with precision fitting that meets Green Building standards.',
    skills: ['Aluminium Frames', 'UPVC Windows', 'Frameless Glass', 'Sliding & Folding Doors', 'Security Doors', 'Double Glazing'],
    avgRate: 'AED 80–350 / sq ft',
    faqs: [
      { q: 'Which window material is best for {state}\'s climate?', a: 'Thermally-broken aluminium frames with double-glazed low-E glass are the gold standard in {state}. They provide excellent thermal insulation, UV protection, and noise reduction. UPVC is a cost-effective alternative for villa projects.' },
      { q: 'How much do aluminium windows cost in {state}?', a: 'Aluminium window supply and installation in {state} typically costs AED 120–250 per sq ft for standard systems. Thermally-broken double-glazed units cost AED 200–350 per sq ft.' },
      { q: 'Can I get noise-reducing windows for my home in {state}?', a: 'Yes. Double-glazed or acoustic laminated glass windows significantly reduce external noise. This is especially popular in {state}\'s high-rise apartments and villas near major roads.' },
      { q: 'Do windows need to meet energy efficiency standards in {state}?', a: 'Yes. UAE Green Building regulations and Estidama standards specify maximum U-values and solar heat gain coefficients for glazing. Your contractor on Biddaro will recommend compliant specifications for your project in {state}.' },
    ],
  },
  {
    name: 'Waterproofing', slug: 'waterproofing', emoji: '💧',
    plural: 'Waterproofing Contractors',
    shortDesc: 'Basement, roof and wet area waterproofing for UAE conditions.',
    longDesc: 'Waterproofing is critical in {state} — from below-grade basement protection against high water tables to roof membranes that withstand extreme heat. Biddaro\'s waterproofing specialists deliver long-lasting solutions for every building element.',
    skills: ['Basement Waterproofing', 'Roof Membrane', 'Bathroom Waterproofing', 'Pool Waterproofing', 'Injection Grouting', 'Crystalline Waterproofing'],
    avgRate: 'AED 15–60 / sq ft',
    faqs: [
      { q: 'How much does waterproofing cost in {state}?', a: 'Waterproofing in {state} typically costs AED 15–40 per sq ft for standard membrane application. Basement waterproofing with tanking systems costs AED 30–60 per sq ft. Pool waterproofing ranges from AED 25–50 per sq ft.' },
      { q: 'What waterproofing system is best for {state}\'s climate?', a: 'For roofs in {state}, APP-modified bituminous membranes or liquid-applied polyurethane systems are most effective. For basements, crystalline waterproofing combined with drainage boards handles the high water table conditions common in coastal areas.' },
      { q: 'Is waterproofing mandatory for new construction in {state}?', a: 'Yes. UAE building codes require waterproofing for all below-grade structures, wet areas (bathrooms, kitchens), and roofs. Municipality inspectors verify waterproofing compliance before issuing completion certificates.' },
      { q: 'How long does waterproofing last in {state}?', a: 'Quality waterproofing membranes in {state} last 15–25 years for roofs and 30+ years for below-grade applications. Regular inspection every 3–5 years is recommended given {state}\'s extreme UV exposure and temperature cycles.' },
    ],
  },
  {
    name: 'Swimming Pool', slug: 'swimming-pool', emoji: '🏊',
    plural: 'Swimming Pool Contractors',
    shortDesc: 'Pool construction, renovation and maintenance for UAE villas.',
    longDesc: 'A swimming pool is a lifestyle essential in {state}. Biddaro\'s pool contractors design and build concrete, fibreglass, and infinity pools with integrated filtration, heating, and lighting systems suited to the UAE climate.',
    skills: ['Pool Construction', 'Pool Renovation', 'Filtration Systems', 'Pool Tiling', 'Heating & Chilling Systems', 'Water Features'],
    avgRate: 'AED 250–800 / sq ft',
    faqs: [
      { q: 'How much does it cost to build a swimming pool in {state}?', a: 'A standard concrete swimming pool in {state} costs AED 80,000–250,000 for a mid-size pool (25–40 sqm). Infinity pools, overflow designs, and pools with water features can cost AED 300,000–800,000 or more.' },
      { q: 'How long does pool construction take in {state}?', a: 'A standard residential pool in {state} takes 6–12 weeks from excavation to completion. Complex designs with water features, infinity edges, or integrated spas take 12–16 weeks.' },
      { q: 'Do I need a permit to build a pool in {state}?', a: 'Yes. Pool construction in {state} requires a building permit from the municipality, structural drawings approval, and compliance with civil defence safety requirements including fencing and depth markers.' },
      { q: 'What pool maintenance is needed in {state}?', a: 'In {state}\'s hot climate, pools require weekly chemical balancing, filter cleaning, and skimming. Sand and dust storms necessitate more frequent cleaning. A pool chiller is recommended May–September when water temperatures can exceed 38°C.' },
    ],
  },
];
