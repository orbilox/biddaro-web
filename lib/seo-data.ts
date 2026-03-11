// ─── Programmatic SEO Data ────────────────────────────────────────────────────
// Provides all Indian states, major cities, and job-category metadata used by
// the /hire/[category]/[state] and /hire/[category]/[state]/[city] pages.

export interface IndiaLocation {
  name: string;           // "Maharashtra"
  slug: string;           // "maharashtra"
  capital: string;        // "Mumbai"
  region: string;         // "West India"
  cities: CityEntry[];
}

export interface CityEntry {
  name: string;           // "Mumbai"
  slug: string;           // "mumbai"
}

export interface JobCategoryMeta {
  name: string;           // "Plumbing"
  slug: string;           // "plumbing"
  emoji: string;          // "🔧"
  plural: string;         // "Plumbers"
  shortDesc: string;      // One-liner
  longDesc: string;       // 2–3 sentences for page body
  skills: string[];       // Top skills shown on page
  avgRate: string;        // "₹400–₹1,500 / hr"
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

export function getLocation(slug: string): IndiaLocation | undefined {
  return INDIA_LOCATIONS.find(l => l.slug === slug);
}

export function getCategory(slug: string): JobCategoryMeta | undefined {
  return JOB_CATEGORY_META.find(c => c.slug === slug);
}

export function getCity(stateSlug: string, citySlug: string): CityEntry | undefined {
  return getLocation(stateSlug)?.cities.find(c => c.slug === citySlug);
}

// ─── Indian States & Union Territories ───────────────────────────────────────

export const INDIA_LOCATIONS: IndiaLocation[] = [
  {
    name: 'Andhra Pradesh', slug: 'andhra-pradesh', capital: 'Amaravati', region: 'South India',
    cities: [
      { name: 'Visakhapatnam', slug: 'visakhapatnam' }, { name: 'Vijayawada', slug: 'vijayawada' },
      { name: 'Guntur', slug: 'guntur' }, { name: 'Nellore', slug: 'nellore' },
      { name: 'Tirupati', slug: 'tirupati' }, { name: 'Kakinada', slug: 'kakinada' },
    ],
  },
  {
    name: 'Arunachal Pradesh', slug: 'arunachal-pradesh', capital: 'Itanagar', region: 'Northeast India',
    cities: [
      { name: 'Itanagar', slug: 'itanagar' }, { name: 'Naharlagun', slug: 'naharlagun' },
      { name: 'Pasighat', slug: 'pasighat' }, { name: 'Tezpur', slug: 'tezpur' },
    ],
  },
  {
    name: 'Assam', slug: 'assam', capital: 'Dispur', region: 'Northeast India',
    cities: [
      { name: 'Guwahati', slug: 'guwahati' }, { name: 'Silchar', slug: 'silchar' },
      { name: 'Dibrugarh', slug: 'dibrugarh' }, { name: 'Jorhat', slug: 'jorhat' },
      { name: 'Nagaon', slug: 'nagaon' }, { name: 'Tezpur', slug: 'tezpur' },
    ],
  },
  {
    name: 'Bihar', slug: 'bihar', capital: 'Patna', region: 'East India',
    cities: [
      { name: 'Patna', slug: 'patna' }, { name: 'Gaya', slug: 'gaya' },
      { name: 'Muzaffarpur', slug: 'muzaffarpur' }, { name: 'Bhagalpur', slug: 'bhagalpur' },
      { name: 'Darbhanga', slug: 'darbhanga' }, { name: 'Purnia', slug: 'purnia' },
    ],
  },
  {
    name: 'Chhattisgarh', slug: 'chhattisgarh', capital: 'Raipur', region: 'Central India',
    cities: [
      { name: 'Raipur', slug: 'raipur' }, { name: 'Bhilai', slug: 'bhilai' },
      { name: 'Bilaspur', slug: 'bilaspur' }, { name: 'Korba', slug: 'korba' },
      { name: 'Durg', slug: 'durg' }, { name: 'Rajnandgaon', slug: 'rajnandgaon' },
    ],
  },
  {
    name: 'Delhi', slug: 'delhi', capital: 'New Delhi', region: 'North India',
    cities: [
      { name: 'New Delhi', slug: 'new-delhi' }, { name: 'Dwarka', slug: 'dwarka' },
      { name: 'Rohini', slug: 'rohini' }, { name: 'Noida', slug: 'noida' },
      { name: 'Gurgaon', slug: 'gurgaon' }, { name: 'Faridabad', slug: 'faridabad' },
    ],
  },
  {
    name: 'Goa', slug: 'goa', capital: 'Panaji', region: 'West India',
    cities: [
      { name: 'Panaji', slug: 'panaji' }, { name: 'Margao', slug: 'margao' },
      { name: 'Vasco da Gama', slug: 'vasco-da-gama' }, { name: 'Mapusa', slug: 'mapusa' },
    ],
  },
  {
    name: 'Gujarat', slug: 'gujarat', capital: 'Gandhinagar', region: 'West India',
    cities: [
      { name: 'Ahmedabad', slug: 'ahmedabad' }, { name: 'Surat', slug: 'surat' },
      { name: 'Vadodara', slug: 'vadodara' }, { name: 'Rajkot', slug: 'rajkot' },
      { name: 'Bhavnagar', slug: 'bhavnagar' }, { name: 'Gandhinagar', slug: 'gandhinagar' },
    ],
  },
  {
    name: 'Haryana', slug: 'haryana', capital: 'Chandigarh', region: 'North India',
    cities: [
      { name: 'Gurugram', slug: 'gurugram' }, { name: 'Faridabad', slug: 'faridabad' },
      { name: 'Panipat', slug: 'panipat' }, { name: 'Ambala', slug: 'ambala' },
      { name: 'Hisar', slug: 'hisar' }, { name: 'Rohtak', slug: 'rohtak' },
    ],
  },
  {
    name: 'Himachal Pradesh', slug: 'himachal-pradesh', capital: 'Shimla', region: 'North India',
    cities: [
      { name: 'Shimla', slug: 'shimla' }, { name: 'Manali', slug: 'manali' },
      { name: 'Dharamshala', slug: 'dharamshala' }, { name: 'Solan', slug: 'solan' },
      { name: 'Mandi', slug: 'mandi' },
    ],
  },
  {
    name: 'Jharkhand', slug: 'jharkhand', capital: 'Ranchi', region: 'East India',
    cities: [
      { name: 'Ranchi', slug: 'ranchi' }, { name: 'Jamshedpur', slug: 'jamshedpur' },
      { name: 'Dhanbad', slug: 'dhanbad' }, { name: 'Bokaro', slug: 'bokaro' },
      { name: 'Deoghar', slug: 'deoghar' },
    ],
  },
  {
    name: 'Karnataka', slug: 'karnataka', capital: 'Bengaluru', region: 'South India',
    cities: [
      { name: 'Bengaluru', slug: 'bengaluru' }, { name: 'Mysuru', slug: 'mysuru' },
      { name: 'Hubballi', slug: 'hubballi' }, { name: 'Mangaluru', slug: 'mangaluru' },
      { name: 'Belagavi', slug: 'belagavi' }, { name: 'Kalaburagi', slug: 'kalaburagi' },
    ],
  },
  {
    name: 'Kerala', slug: 'kerala', capital: 'Thiruvananthapuram', region: 'South India',
    cities: [
      { name: 'Thiruvananthapuram', slug: 'thiruvananthapuram' }, { name: 'Kochi', slug: 'kochi' },
      { name: 'Kozhikode', slug: 'kozhikode' }, { name: 'Thrissur', slug: 'thrissur' },
      { name: 'Kannur', slug: 'kannur' }, { name: 'Kollam', slug: 'kollam' },
    ],
  },
  {
    name: 'Madhya Pradesh', slug: 'madhya-pradesh', capital: 'Bhopal', region: 'Central India',
    cities: [
      { name: 'Bhopal', slug: 'bhopal' }, { name: 'Indore', slug: 'indore' },
      { name: 'Gwalior', slug: 'gwalior' }, { name: 'Jabalpur', slug: 'jabalpur' },
      { name: 'Ujjain', slug: 'ujjain' }, { name: 'Sagar', slug: 'sagar' },
    ],
  },
  {
    name: 'Maharashtra', slug: 'maharashtra', capital: 'Mumbai', region: 'West India',
    cities: [
      { name: 'Mumbai', slug: 'mumbai' }, { name: 'Pune', slug: 'pune' },
      { name: 'Nagpur', slug: 'nagpur' }, { name: 'Nashik', slug: 'nashik' },
      { name: 'Aurangabad', slug: 'aurangabad' }, { name: 'Thane', slug: 'thane' },
      { name: 'Solapur', slug: 'solapur' }, { name: 'Kolhapur', slug: 'kolhapur' },
    ],
  },
  {
    name: 'Manipur', slug: 'manipur', capital: 'Imphal', region: 'Northeast India',
    cities: [
      { name: 'Imphal', slug: 'imphal' }, { name: 'Thoubal', slug: 'thoubal' },
      { name: 'Bishnupur', slug: 'bishnupur' }, { name: 'Churachandpur', slug: 'churachandpur' },
    ],
  },
  {
    name: 'Meghalaya', slug: 'meghalaya', capital: 'Shillong', region: 'Northeast India',
    cities: [
      { name: 'Shillong', slug: 'shillong' }, { name: 'Tura', slug: 'tura' },
      { name: 'Jowai', slug: 'jowai' }, { name: 'Nongstoin', slug: 'nongstoin' },
    ],
  },
  {
    name: 'Mizoram', slug: 'mizoram', capital: 'Aizawl', region: 'Northeast India',
    cities: [
      { name: 'Aizawl', slug: 'aizawl' }, { name: 'Lunglei', slug: 'lunglei' },
      { name: 'Champhai', slug: 'champhai' }, { name: 'Kolasib', slug: 'kolasib' },
    ],
  },
  {
    name: 'Nagaland', slug: 'nagaland', capital: 'Kohima', region: 'Northeast India',
    cities: [
      { name: 'Kohima', slug: 'kohima' }, { name: 'Dimapur', slug: 'dimapur' },
      { name: 'Mokokchung', slug: 'mokokchung' }, { name: 'Tuensang', slug: 'tuensang' },
    ],
  },
  {
    name: 'Odisha', slug: 'odisha', capital: 'Bhubaneswar', region: 'East India',
    cities: [
      { name: 'Bhubaneswar', slug: 'bhubaneswar' }, { name: 'Cuttack', slug: 'cuttack' },
      { name: 'Rourkela', slug: 'rourkela' }, { name: 'Berhampur', slug: 'berhampur' },
      { name: 'Sambalpur', slug: 'sambalpur' }, { name: 'Puri', slug: 'puri' },
    ],
  },
  {
    name: 'Punjab', slug: 'punjab', capital: 'Chandigarh', region: 'North India',
    cities: [
      { name: 'Ludhiana', slug: 'ludhiana' }, { name: 'Amritsar', slug: 'amritsar' },
      { name: 'Jalandhar', slug: 'jalandhar' }, { name: 'Patiala', slug: 'patiala' },
      { name: 'Bathinda', slug: 'bathinda' }, { name: 'Mohali', slug: 'mohali' },
    ],
  },
  {
    name: 'Rajasthan', slug: 'rajasthan', capital: 'Jaipur', region: 'North India',
    cities: [
      { name: 'Jaipur', slug: 'jaipur' }, { name: 'Jodhpur', slug: 'jodhpur' },
      { name: 'Udaipur', slug: 'udaipur' }, { name: 'Kota', slug: 'kota' },
      { name: 'Bikaner', slug: 'bikaner' }, { name: 'Ajmer', slug: 'ajmer' },
    ],
  },
  {
    name: 'Sikkim', slug: 'sikkim', capital: 'Gangtok', region: 'Northeast India',
    cities: [
      { name: 'Gangtok', slug: 'gangtok' }, { name: 'Namchi', slug: 'namchi' },
      { name: 'Gyalshing', slug: 'gyalshing' }, { name: 'Mangan', slug: 'mangan' },
    ],
  },
  {
    name: 'Tamil Nadu', slug: 'tamil-nadu', capital: 'Chennai', region: 'South India',
    cities: [
      { name: 'Chennai', slug: 'chennai' }, { name: 'Coimbatore', slug: 'coimbatore' },
      { name: 'Madurai', slug: 'madurai' }, { name: 'Tiruchirappalli', slug: 'tiruchirappalli' },
      { name: 'Salem', slug: 'salem' }, { name: 'Tirunelveli', slug: 'tirunelveli' },
    ],
  },
  {
    name: 'Telangana', slug: 'telangana', capital: 'Hyderabad', region: 'South India',
    cities: [
      { name: 'Hyderabad', slug: 'hyderabad' }, { name: 'Warangal', slug: 'warangal' },
      { name: 'Nizamabad', slug: 'nizamabad' }, { name: 'Karimnagar', slug: 'karimnagar' },
      { name: 'Khammam', slug: 'khammam' }, { name: 'Secunderabad', slug: 'secunderabad' },
    ],
  },
  {
    name: 'Tripura', slug: 'tripura', capital: 'Agartala', region: 'Northeast India',
    cities: [
      { name: 'Agartala', slug: 'agartala' }, { name: 'Udaipur', slug: 'udaipur-tripura' },
      { name: 'Dharmanagar', slug: 'dharmanagar' }, { name: 'Kailasahar', slug: 'kailasahar' },
    ],
  },
  {
    name: 'Uttar Pradesh', slug: 'uttar-pradesh', capital: 'Lucknow', region: 'North India',
    cities: [
      { name: 'Lucknow', slug: 'lucknow' }, { name: 'Kanpur', slug: 'kanpur' },
      { name: 'Agra', slug: 'agra' }, { name: 'Varanasi', slug: 'varanasi' },
      { name: 'Prayagraj', slug: 'prayagraj' }, { name: 'Meerut', slug: 'meerut' },
      { name: 'Ghaziabad', slug: 'ghaziabad' }, { name: 'Noida', slug: 'noida-up' },
    ],
  },
  {
    name: 'Uttarakhand', slug: 'uttarakhand', capital: 'Dehradun', region: 'North India',
    cities: [
      { name: 'Dehradun', slug: 'dehradun' }, { name: 'Haridwar', slug: 'haridwar' },
      { name: 'Rishikesh', slug: 'rishikesh' }, { name: 'Haldwani', slug: 'haldwani' },
      { name: 'Nainital', slug: 'nainital' }, { name: 'Roorkee', slug: 'roorkee' },
    ],
  },
  {
    name: 'West Bengal', slug: 'west-bengal', capital: 'Kolkata', region: 'East India',
    cities: [
      { name: 'Kolkata', slug: 'kolkata' }, { name: 'Howrah', slug: 'howrah' },
      { name: 'Durgapur', slug: 'durgapur' }, { name: 'Asansol', slug: 'asansol' },
      { name: 'Siliguri', slug: 'siliguri' }, { name: 'Bardhaman', slug: 'bardhaman' },
    ],
  },
  {
    name: 'Chandigarh', slug: 'chandigarh', capital: 'Chandigarh', region: 'North India',
    cities: [
      { name: 'Chandigarh', slug: 'chandigarh-city' }, { name: 'Mohali', slug: 'mohali' },
      { name: 'Panchkula', slug: 'panchkula' },
    ],
  },
  {
    name: 'Puducherry', slug: 'puducherry', capital: 'Puducherry', region: 'South India',
    cities: [
      { name: 'Puducherry', slug: 'puducherry-city' }, { name: 'Karaikal', slug: 'karaikal' },
      { name: 'Mahe', slug: 'mahe' }, { name: 'Yanam', slug: 'yanam' },
    ],
  },
];

// ─── Job Category Metadata ────────────────────────────────────────────────────
// {state} in FAQ strings is replaced at render time with the actual state name.

export const JOB_CATEGORY_META: JobCategoryMeta[] = [
  {
    name: 'General Construction', slug: 'general-construction', emoji: '🏗️',
    plural: 'General Contractors',
    shortDesc: 'Full-service construction professionals for any build.',
    longDesc: 'General contractors manage the entire construction process — from foundation to finish. They coordinate subcontractors, source materials, and ensure your project meets all local codes and timelines.',
    skills: ['Project Management', 'Blueprint Reading', 'Site Supervision', 'Subcontractor Coordination', 'Safety Compliance', 'Material Procurement'],
    avgRate: '₹800–₹3,000 / day',
    faqs: [
      { q: 'How do I find a reliable general contractor in {state}?', a: 'Post your job on Biddaro and receive bids from verified general contractors in {state} within hours. Compare ratings, portfolios, and quotes before choosing.' },
      { q: 'What should a general construction contract include?', a: 'A solid contract should include scope of work, timeline, payment milestones, material specifications, penalty clauses, and warranty terms. Biddaro\'s built-in contract system covers all of these.' },
      { q: 'How much does general construction cost in {state}?', a: 'Costs vary widely by project type and location. Residential construction in {state} typically ranges from ₹1,200 to ₹2,500 per sq. ft., while commercial projects can go higher depending on specifications.' },
      { q: 'How long does it take to hire a contractor through Biddaro?', a: 'Most job posts on Biddaro receive their first bids within 2–4 hours. You can typically shortlist and hire a contractor within 24 hours of posting.' },
    ],
  },
  {
    name: 'Plumbing', slug: 'plumbing', emoji: '🔧',
    plural: 'Plumbers',
    shortDesc: 'Licensed plumbers for installation, repair and maintenance.',
    longDesc: 'From pipe installation and leak detection to bathroom fittings and sewage systems, Biddaro connects you with licensed plumbers across {state} who tackle every job — big or small — with precision.',
    skills: ['Pipe Installation', 'Leak Detection & Repair', 'Water Heater Service', 'Drain Cleaning', 'Bathroom Fitting', 'Sewage Systems'],
    avgRate: '₹400–₹1,500 / hr',
    faqs: [
      { q: 'How much do plumbers charge in {state}?', a: 'Plumbing rates in {state} typically range from ₹400 to ₹1,500 per hour depending on the job complexity and location. Emergency callouts and specialised jobs may cost more.' },
      { q: 'Do I need a licensed plumber for my project in {state}?', a: 'Yes. For most plumbing work beyond basic maintenance, a licensed plumber is required by local building codes in {state}. All plumbers on Biddaro verify their credentials during onboarding.' },
      { q: 'How quickly can a plumber reach me in {state}?', a: 'For urgent jobs, many plumbers on Biddaro offer same-day service in {state}. Post your job marked "Urgent" and you\'ll receive bids within the hour.' },
      { q: 'Can I hire a plumber for a small repair job?', a: 'Absolutely. Biddaro supports jobs of all sizes — from a ₹500 tap repair to a ₹5 lakh complete bathroom overhaul. There is no minimum job value.' },
    ],
  },
  {
    name: 'Electrical', slug: 'electrical', emoji: '⚡',
    plural: 'Electricians',
    shortDesc: 'Certified electricians for wiring, panels and installations.',
    longDesc: 'Faulty wiring is a safety hazard. Hire certified electricians in {state} through Biddaro for safe, code-compliant electrical work — from simple socket installation to full building wiring projects.',
    skills: ['Wiring & Rewiring', 'Panel Upgrades', 'EV Charger Installation', 'Lighting Design', 'Safety Inspections', 'Industrial Wiring'],
    avgRate: '₹500–₹2,000 / hr',
    faqs: [
      { q: 'What electrical work requires a licensed electrician in {state}?', a: 'Any work involving the main panel, new circuits, or permanent installations requires a licensed electrician in {state}. This includes wiring, panel upgrades, and electrical inspections.' },
      { q: 'How much does electrical work cost in {state}?', a: 'Basic electrical jobs in {state} start from ₹1,500 for simple installations. Full home rewiring can range from ₹40,000 to ₹2,00,000 depending on property size.' },
      { q: 'Can electricians on Biddaro install EV charging points?', a: 'Yes. Many certified electricians on Biddaro specialize in EV charger installation for both residential and commercial properties across {state}.' },
      { q: 'How do I verify an electrician\'s credentials on Biddaro?', a: 'Every electrician on Biddaro goes through a verification process. You can view their license details, reviews, job history, and ratings directly on their profile.' },
    ],
  },
  {
    name: 'HVAC', slug: 'hvac', emoji: '🌡️',
    plural: 'HVAC Technicians',
    shortDesc: 'Heating, ventilation and AC specialists for comfort all year.',
    longDesc: 'Stay comfortable in every season. Biddaro\'s HVAC professionals in {state} handle AC installation, servicing, duct cleaning, and full HVAC system design for homes and commercial buildings.',
    skills: ['AC Installation & Repair', 'Duct Design & Cleaning', 'Refrigerant Handling', 'Split System Service', 'Ventilation Systems', 'Commercial HVAC'],
    avgRate: '₹600–₹2,500 / hr',
    faqs: [
      { q: 'How often should I service my AC unit in {state}?', a: 'In {state}\'s climate, it is recommended to service your AC at least once a year — ideally before summer. Regular servicing extends the unit life and improves efficiency.' },
      { q: 'What does AC installation cost in {state}?', a: 'AC installation costs in {state} range from ₹2,500 for a basic 1-ton split AC to ₹15,000+ for multi-split systems or inverter ACs with complex ducting.' },
      { q: 'Can HVAC technicians on Biddaro handle commercial projects?', a: 'Yes. Biddaro hosts experienced commercial HVAC contractors in {state} who handle centralised air conditioning, VRF systems, and large-scale ventilation projects.' },
      { q: 'How do I know if my HVAC system needs replacing vs. repairing?', a: 'If your system is over 10 years old, needs frequent repairs, or is costing more to run, replacement may be more economical. Post your job on Biddaro for a free assessment from a local expert in {state}.' },
    ],
  },
  {
    name: 'Roofing', slug: 'roofing', emoji: '🏠',
    plural: 'Roofers',
    shortDesc: 'Expert roofers for new roofs, repairs and waterproofing.',
    longDesc: 'A secure roof protects your entire property. Biddaro connects homeowners and builders in {state} with expert roofers specialising in terracotta tiles, metal roofing, flat roofs, and waterproofing.',
    skills: ['Roof Installation', 'Leak Repair', 'Waterproofing', 'Tile Roofing', 'Metal Roofing', 'Insulated Roofing'],
    avgRate: '₹50–₹200 / sq. ft.',
    faqs: [
      { q: 'How long does a roof replacement take in {state}?', a: 'A typical residential roof replacement in {state} takes 2–5 days depending on the roof size and material. Weather conditions can affect the timeline.' },
      { q: 'What is the best roofing material for {state}\'s climate?', a: 'For most parts of {state}, concrete tiles or metal sheets offer the best durability against heat and monsoons. Roofers on Biddaro can advise on the ideal material for your specific location.' },
      { q: 'How much does waterproofing a terrace cost in {state}?', a: 'Terrace waterproofing in {state} typically costs ₹80–₹150 per sq. ft. depending on the treatment used (polymer-based, bituminous, or crystalline).' },
      { q: 'Does Biddaro verify roofers\' insurance?', a: 'Yes. Biddaro encourages all contractors to upload proof of insurance during profile setup. You can view their insurance status on their profile before hiring.' },
    ],
  },
  {
    name: 'Flooring', slug: 'flooring', emoji: '🪟',
    plural: 'Flooring Contractors',
    shortDesc: 'Professional flooring for tiles, wood, vinyl and more.',
    longDesc: 'From marble and vitrified tiles to hardwood and vinyl planks, flooring specialists on Biddaro in {state} deliver flawless installations with expert craftsmanship and quick turnarounds.',
    skills: ['Tile Installation', 'Hardwood Flooring', 'Vinyl Plank', 'Marble Polishing', 'Epoxy Flooring', 'Subfloor Preparation'],
    avgRate: '₹40–₹200 / sq. ft.',
    faqs: [
      { q: 'What is the most popular flooring choice in {state}?', a: 'Vitrified tiles and marble are the most popular choices in {state} for their durability and ease of maintenance in the local climate. Hardwood is gaining popularity in premium homes.' },
      { q: 'How much does tile flooring cost in {state}?', a: 'Tile flooring installation in {state} typically costs ₹40–₹120 per sq. ft. (labour only), depending on the tile size, pattern, and subfloor condition.' },
      { q: 'How do I compare flooring contractors on Biddaro?', a: 'Each contractor\'s profile shows their specialisations, portfolio photos, verified reviews, and pricing history. You can shortlist and message multiple contractors before deciding.' },
      { q: 'Can I hire a flooring contractor for a single room?', a: 'Yes, absolutely. Biddaro accepts flooring jobs of any size — one room or an entire villa. Simply describe your area in sq. ft. when posting your job.' },
    ],
  },
  {
    name: 'Painting', slug: 'painting', emoji: '🎨',
    plural: 'Painters',
    shortDesc: 'Interior and exterior painters for homes and commercial spaces.',
    longDesc: 'Transform your space with professional painting services. Biddaro painters in {state} cover everything from interior emulsion to exterior weather-shield coatings, textured finishes, and commercial repainting.',
    skills: ['Interior Painting', 'Exterior Painting', 'Texture Finish', 'Waterproofing Paint', 'Primer & Putty', 'Commercial Painting'],
    avgRate: '₹8–₹25 / sq. ft.',
    faqs: [
      { q: 'How much does house painting cost in {state}?', a: 'Interior painting in {state} typically costs ₹8–₹18 per sq. ft. (including primer and 2 coats). Exterior painting with weather-shield costs ₹12–₹25 per sq. ft.' },
      { q: 'How long does painting a 3BHK apartment take in {state}?', a: 'A 3BHK apartment (approx. 1,200 sq. ft.) takes 4–7 days for a complete paint job including wall prep, putty, primer, and two finish coats.' },
      { q: 'Do painters on Biddaro supply materials?', a: 'Most painters on Biddaro offer both labour-only and supply-and-install options. You can specify your preference when posting the job.' },
      { q: 'What paint brands do Biddaro painters work with in {state}?', a: 'Painters on Biddaro are experienced with all major brands including Asian Paints, Berger, Nerolac, Dulux, and Indigo. You can specify your preferred brand in the job description.' },
    ],
  },
  {
    name: 'Landscaping', slug: 'landscaping', emoji: '🌿',
    plural: 'Landscapers',
    shortDesc: 'Garden design, lawn care and outdoor spaces.',
    longDesc: 'Create beautiful outdoor living spaces with expert landscapers in {state}. From garden design and lawn installation to irrigation systems and hardscaping, Biddaro connects you with the right professional.',
    skills: ['Garden Design', 'Lawn Installation', 'Irrigation Systems', 'Tree Trimming', 'Hardscaping', 'Terrace Garden'],
    avgRate: '₹500–₹2,000 / day',
    faqs: [
      { q: 'What landscaping services are most popular in {state}?', a: 'In {state}, popular landscaping services include terrace gardens, kitchen gardens, drip irrigation systems, and low-maintenance native plant designs suited to the local climate.' },
      { q: 'How much does garden design cost in {state}?', a: 'Basic garden design and installation in {state} starts from ₹15,000 for a small plot. Larger projects with irrigation and hardscaping can range from ₹1–₹10 lakh.' },
      { q: 'Can landscapers on Biddaro design drought-tolerant gardens?', a: 'Yes. Many landscapers on Biddaro specialise in native and drought-tolerant plant species suited to {state}\'s climate, reducing your water consumption significantly.' },
      { q: 'Do landscapers handle apartment terrace gardens?', a: 'Absolutely. Terrace gardens are very popular in {state}\'s urban areas. Landscapers on Biddaro are experienced with container gardening, grow bags, and terrace waterproofing.' },
    ],
  },
  {
    name: 'Carpentry', slug: 'carpentry', emoji: '🪚',
    plural: 'Carpenters',
    shortDesc: 'Custom woodwork, furniture and interior joinery.',
    longDesc: 'Skilled carpenters on Biddaro in {state} craft custom furniture, modular kitchens, wardrobes, and decorative woodwork. Get precise, polished results from experienced professionals.',
    skills: ['Modular Kitchen', 'Custom Wardrobes', 'Furniture Making', 'False Ceiling', 'Wooden Flooring', 'Interior Joinery'],
    avgRate: '₹600–₹2,500 / day',
    faqs: [
      { q: 'How much does a modular kitchen cost in {state}?', a: 'Modular kitchens in {state} range from ₹80,000 to ₹5,00,000 depending on size, material (marine ply vs. MDF), and hardware quality (Hafele, Hettich, etc.).' },
      { q: 'Can carpenters on Biddaro work with designer plans?', a: 'Yes. Simply attach your interior design plans or sketches to your job post. Experienced carpenters on Biddaro are comfortable working from architect and designer drawings.' },
      { q: 'What wood type is best for furniture in {state}\'s climate?', a: 'Teak and sheesham are popular choices for {state}\'s humidity levels. For budget-friendly options, marine plywood with laminate or veneer finish is widely used.' },
      { q: 'How long does a full interior carpentry project take?', a: 'A complete interior carpentry project (kitchen + wardrobes + misc.) typically takes 4–8 weeks in {state}, depending on customisation complexity and material availability.' },
    ],
  },
  {
    name: 'Masonry', slug: 'masonry', emoji: '🧱',
    plural: 'Masons',
    shortDesc: 'Brick, block and stonework for walls and structures.',
    longDesc: 'From load-bearing walls to decorative stone cladding, skilled masons on Biddaro in {state} deliver strong, precise brickwork and masonry for residential and commercial projects.',
    skills: ['Brick Laying', 'Stone Cladding', 'Block Work', 'Plaster & Render', 'Retaining Walls', 'Repointing'],
    avgRate: '₹500–₹1,800 / day',
    faqs: [
      { q: 'What is the going rate for masons in {state}?', a: 'Skilled masons in {state} typically charge ₹600–₹1,500 per day for standard brick laying and plastering work. Specialised stone work or decorative masonry commands higher rates.' },
      { q: 'Can masons on Biddaro handle large commercial projects?', a: 'Yes. Biddaro hosts masonry contractors who work on everything from single-room extensions to multi-storey commercial buildings in {state}. Simply describe your project scope.' },
      { q: 'What type of brick is commonly used in {state}?', a: 'Red clay bricks are traditional in most parts of {state}. Fly ash bricks and autoclaved aerated concrete (AAC) blocks are increasingly popular for their lighter weight and insulation properties.' },
      { q: 'How do I ensure quality masonry work?', a: 'Use Biddaro\'s milestone-based payment system to release funds only after each stage is inspected and approved. You can also request progress photos through the platform.' },
    ],
  },
  {
    name: 'Demolition', slug: 'demolition', emoji: '⛏️',
    plural: 'Demolition Contractors',
    shortDesc: 'Safe and efficient structural demolition services.',
    longDesc: 'Safe demolition requires the right equipment and expertise. Demolition contractors on Biddaro in {state} handle everything from selective interior strip-outs to full building demolition with proper waste disposal.',
    skills: ['Structural Demolition', 'Selective Strip-Out', 'Concrete Breaking', 'Debris Removal', 'Asbestos Removal', 'Site Clearance'],
    avgRate: '₹800–₹3,000 / day',
    faqs: [
      { q: 'Do I need a permit for demolition work in {state}?', a: 'For full building demolitions in {state}, a municipal permit is generally required. For interior strip-outs and selective demolition, requirements vary by local authority. Contractors on Biddaro can advise on permit requirements.' },
      { q: 'How is demolition waste handled in {state}?', a: 'Professional demolition contractors on Biddaro arrange for debris removal and disposal in compliance with {state}\'s municipal waste regulations. This is included in most job quotes.' },
      { q: 'What is the cost of demolishing a structure in {state}?', a: 'Demolition costs in {state} depend on the structure size, material type, and access. Small interior demolitions start from ₹15,000, while full building demolitions can reach ₹5–₹50 lakh.' },
      { q: 'Can demolition be done in phases to minimise disruption?', a: 'Yes. Phased demolition is common for occupied properties or ongoing construction sites. Specify your phasing requirements when posting the job on Biddaro.' },
    ],
  },
  {
    name: 'Renovation', slug: 'renovation', emoji: '🔨',
    plural: 'Renovation Contractors',
    shortDesc: 'Home and office renovation from concept to completion.',
    longDesc: 'Whether it\'s a kitchen refresh or a complete home overhaul, renovation specialists on Biddaro in {state} manage the entire project — design, demolition, rebuild, and finish — under one roof.',
    skills: ['Home Renovation', 'Kitchen Remodelling', 'Bathroom Renovation', 'Office Fit-Out', 'Heritage Restoration', 'Extensions & Additions'],
    avgRate: '₹1,000–₹2,500 / sq. ft.',
    faqs: [
      { q: 'How much does home renovation cost per sq. ft. in {state}?', a: 'Home renovation costs in {state} typically range from ₹800 to ₹2,500 per sq. ft. depending on the quality of finishes, scope of structural changes, and location within {state}.' },
      { q: 'How long does a typical home renovation take in {state}?', a: 'A full home renovation in {state} typically takes 6–16 weeks depending on property size, scope of work, and material availability. Kitchen or bathroom-only renovations usually take 2–4 weeks.' },
      { q: 'Can I hire a renovation contractor for just one room?', a: 'Yes. Biddaro accepts single-room renovation jobs. Simply describe the room, its size, and what changes you want when posting your job.' },
      { q: 'Does Biddaro hold payment until renovation milestones are completed?', a: 'Yes. Biddaro\'s built-in escrow system holds your payment securely and releases funds only when you approve each milestone, protecting you throughout the renovation process.' },
    ],
  },
  {
    name: 'New Construction', slug: 'new-construction', emoji: '🏢',
    plural: 'New Construction Builders',
    shortDesc: 'Ground-up construction for homes and commercial buildings.',
    longDesc: 'Building from scratch? Connect with experienced new construction builders in {state} who manage the complete project lifecycle — approvals, foundation, structure, MEP, and finishing — from day one.',
    skills: ['Structural Engineering', 'Foundation Work', 'RCC Framing', 'Brickwork', 'MEP Coordination', 'Project Management'],
    avgRate: '₹1,400–₹3,500 / sq. ft.',
    faqs: [
      { q: 'What is the construction cost per sq. ft. in {state}?', a: 'New residential construction in {state} typically costs ₹1,400–₹2,800 per sq. ft. for standard quality. Premium specifications can reach ₹3,500+ per sq. ft. Commercial construction varies significantly by use type.' },
      { q: 'How long does it take to build a house in {state}?', a: 'A typical G+1 residential home (2,000–3,000 sq. ft.) in {state} takes 12–18 months from foundation to handover, subject to permits and weather conditions.' },
      { q: 'What approvals are needed before starting construction in {state}?', a: 'Construction in {state} typically requires approved building plans, a commencement certificate, environmental clearances (for larger projects), and local municipal approvals. Your contractor on Biddaro can guide you through this.' },
      { q: 'Can I track construction progress on Biddaro?', a: 'Yes. Use Biddaro\'s milestone tracking system to monitor each stage — foundation, slab, brickwork, plaster, and finishing — with photo proof and payment releases tied to each milestone.' },
    ],
  },
  {
    name: 'Foundation', slug: 'foundation', emoji: '🏛️',
    plural: 'Foundation Specialists',
    shortDesc: 'Deep foundations, piling and ground stabilisation.',
    longDesc: 'A solid foundation is non-negotiable. Foundation specialists on Biddaro in {state} provide geotechnical assessments, pile driving, raft foundations, and underpinning for new builds and existing structures.',
    skills: ['Pile Foundation', 'Raft Foundation', 'Strip Foundation', 'Soil Testing', 'Underpinning', 'Ground Stabilisation'],
    avgRate: '₹1,200–₹4,000 / day',
    faqs: [
      { q: 'How do I know what type of foundation my project needs in {state}?', a: 'A soil test (geotechnical investigation) determines the required foundation type for your site in {state}. Foundation specialists on Biddaro can arrange and interpret soil test reports.' },
      { q: 'What is the cost of pile foundation in {state}?', a: 'Pile foundation costs in {state} range from ₹500 to ₹2,000 per running foot depending on pile diameter, depth, and ground conditions. Get itemised quotes from multiple specialists on Biddaro.' },
      { q: 'How long does foundation work take in {state}?', a: 'Foundation work typically takes 2–6 weeks depending on soil conditions, foundation type, and area. Monsoon conditions in parts of {state} can affect scheduling.' },
      { q: 'Can foundation work be done on an existing structure?', a: 'Yes. Underpinning and ground stabilisation can strengthen or extend an existing structure\'s foundation. Foundation specialists on Biddaro assess the existing structure before recommending solutions.' },
    ],
  },
  {
    name: 'Insulation', slug: 'insulation', emoji: '🌡️',
    plural: 'Insulation Contractors',
    shortDesc: 'Thermal and acoustic insulation for buildings.',
    longDesc: 'Reduce energy bills and noise with professional insulation. Biddaro\'s insulation contractors in {state} install rockwool, glass wool, spray foam, and reflective insulation for roofs, walls, and floors.',
    skills: ['Roof Insulation', 'Wall Insulation', 'Spray Foam', 'Glass Wool', 'Reflective Foil', 'Acoustic Insulation'],
    avgRate: '₹30–₹120 / sq. ft.',
    faqs: [
      { q: 'What insulation is best for {state}\'s climate?', a: 'Reflective foil insulation is highly effective in {state}\'s warm climate for roofs and walls. For noise, rockwool panels provide excellent acoustic insulation for partition walls.' },
      { q: 'How much does roof insulation cost in {state}?', a: 'Roof insulation in {state} typically costs ₹30–₹80 per sq. ft. for basic reflective foil, and ₹60–₹120 per sq. ft. for rigid foam or rockwool installations.' },
      { q: 'Does insulation help reduce AC costs in {state}?', a: 'Significantly. Proper roof and wall insulation can reduce AC load by 20–40% in {state}\'s climate, translating to lower electricity bills throughout the summer.' },
      { q: 'How long does insulation installation take?', a: 'Insulating a typical 2,000 sq. ft. home in {state} takes 2–5 days. Spray foam applications require 24–48 hours additional curing time.' },
    ],
  },
  {
    name: 'Drywall', slug: 'drywall', emoji: '🪣',
    plural: 'Drywall Contractors',
    shortDesc: 'Gypsum board installation for walls and ceilings.',
    longDesc: 'Fast, clean, and versatile — gypsum drywall is ideal for partitions, false ceilings, and feature walls. Expert drywall contractors on Biddaro in {state} deliver smooth, ready-to-paint finishes quickly.',
    skills: ['Partition Walls', 'False Ceiling', 'Gypsum Boarding', 'Acoustic Panels', 'Fire-Rated Partitions', 'Finishing & Taping'],
    avgRate: '₹45–₹130 / sq. ft.',
    faqs: [
      { q: 'How much does drywall partitioning cost in {state}?', a: 'Drywall partition installation in {state} typically costs ₹45–₹90 per sq. ft. for standard gypsum board. Fire-rated or acoustic-grade boards cost ₹80–₹130 per sq. ft.' },
      { q: 'Is drywall suitable for bathrooms and kitchens?', a: 'Moisture-resistant (green board) gypsum board is recommended for bathrooms and kitchens in {state}\'s humid conditions. Tiles can be applied directly onto moisture-resistant boards.' },
      { q: 'How fast can drywall work be completed?', a: 'A typical office partition project of 500 sq. ft. in {state} can be completed in 2–4 days. False ceiling installation for a 3BHK apartment takes approximately 3–5 days.' },
      { q: 'Can drywall improve my home\'s thermal insulation?', a: 'Yes. Double-layer drywall with insulation fill significantly improves thermal and acoustic performance. This is especially beneficial in {state}\'s extreme summer or monsoon conditions.' },
    ],
  },
  {
    name: 'Tile & Stone', slug: 'tile-stone', emoji: '🪨',
    plural: 'Tile & Stone Contractors',
    shortDesc: 'Precision tile and stonework for any surface.',
    longDesc: 'From intricate mosaic patterns to large-format stone slabs, tile and stone specialists on Biddaro in {state} bring craftsmanship and precision to bathrooms, kitchens, floors, and facades.',
    skills: ['Ceramic Tile', 'Vitrified Tile', 'Natural Stone', 'Mosaic Work', 'Grouting & Sealing', 'Feature Walls'],
    avgRate: '₹35–₹150 / sq. ft.',
    faqs: [
      { q: 'What tile size is trending in {state} currently?', a: 'Large-format tiles (800×800 mm and 1200×600 mm) are trending in {state} for a seamless, premium look with fewer grout lines. Subway tiles remain popular for kitchen backsplashes.' },
      { q: 'How much does tile work cost per sq. ft. in {state}?', a: 'Tile installation labour in {state} costs ₹35–₹80 per sq. ft. for standard ceramic tiles, and ₹80–₹150 per sq. ft. for large-format or natural stone tiles.' },
      { q: 'How do I prevent tile cracking in {state}\'s climate?', a: 'Thermal expansion joints and proper substrate preparation prevent cracking in {state}\'s temperature variations. Experienced tile contractors on Biddaro follow IS code specifications.' },
      { q: 'Can tile contractors on Biddaro do outdoor tiling?', a: 'Yes. Outdoor tile installation requires anti-skid, frost-resistant, and UV-stable tiles. Many contractors on Biddaro specialise in outdoor pool surrounds, pathways, and terrace flooring.' },
    ],
  },
  {
    name: 'Windows & Doors', slug: 'windows-doors', emoji: '🚪',
    plural: 'Windows & Doors Contractors',
    shortDesc: 'UPVC, aluminium and wooden windows and doors.',
    longDesc: 'Energy-efficient, noise-reducing windows and doors enhance your home\'s comfort and security. Contractors on Biddaro in {state} supply and install UPVC, aluminium, and wooden frames with precision fitting.',
    skills: ['UPVC Windows', 'Aluminium Frames', 'Sliding Doors', 'Security Doors', 'Glass Glazing', 'Fly Mesh Installation'],
    avgRate: '₹350–₹1,200 / sq. ft.',
    faqs: [
      { q: 'Which window material is best for {state}\'s climate?', a: 'UPVC windows are excellent for {state}\'s climate — they are UV-resistant, low-maintenance, and provide good thermal insulation. Aluminium frames are preferred for larger openings and modern aesthetics.' },
      { q: 'How much do UPVC windows cost in {state}?', a: 'UPVC window supply and installation in {state} typically costs ₹350–₹700 per sq. ft. for standard sliding windows. Double-glazed units cost ₹600–₹1,200 per sq. ft.' },
      { q: 'Can I get noise-reducing windows for my home in {state}?', a: 'Yes. Double-glazed or acoustic laminated glass windows significantly reduce external noise. This is especially popular in {state}\'s urban areas near highways or airports.' },
      { q: 'How long does window installation take?', a: 'Replacing windows in a standard 3BHK apartment in {state} takes 1–3 days. New-build window installations are typically completed floor by floor during the construction phase.' },
    ],
  },
  {
    name: 'Siding', slug: 'siding', emoji: '🏡',
    plural: 'Siding Contractors',
    shortDesc: 'Exterior cladding and facade work for buildings.',
    longDesc: 'Give your building a fresh face with professional siding and facade work. Biddaro\'s siding contractors in {state} install stone cladding, ACP sheets, textured coatings, and weather-resistant external finishes.',
    skills: ['ACP Cladding', 'Stone Veneer', 'Texture Coating', 'Weather Board', 'External Insulation', 'Facade Design'],
    avgRate: '₹80–₹350 / sq. ft.',
    faqs: [
      { q: 'What is the most weather-resistant siding for {state}?', a: 'ACP (Aluminium Composite Panels) and fibre cement boards offer excellent weather resistance for {state}\'s climate. Stone veneer cladding is also popular for premium residential and commercial projects.' },
      { q: 'How much does ACP cladding cost in {state}?', a: 'ACP cladding supply and installation in {state} costs ₹150–₹350 per sq. ft. depending on the panel thickness and brand. Stone or brick veneer cladding costs ₹100–₹250 per sq. ft.' },
      { q: 'Does siding add value to my property in {state}?', a: 'Yes. Quality facade work significantly improves kerb appeal and can increase property value by 5–10%. It also provides an additional weather barrier, reducing maintenance costs.' },
      { q: 'How long does a facade renovation take in {state}?', a: 'Facade work on a standard 3-storey building in {state} typically takes 2–4 weeks depending on the material and scaffolding requirements.' },
    ],
  },
  {
    name: 'Concrete', slug: 'concrete', emoji: '🪣',
    plural: 'Concrete Contractors',
    shortDesc: 'Structural and decorative concrete work.',
    longDesc: 'From reinforced concrete slabs and columns to decorative polished concrete floors, Biddaro\'s concrete specialists in {state} deliver durable, precise work for every stage of construction.',
    skills: ['RCC Slab Work', 'Concrete Columns', 'Foundations', 'Polished Concrete', 'Precast Concrete', 'Waterproof Concrete'],
    avgRate: '₹60–₹200 / sq. ft.',
    faqs: [
      { q: 'What concrete grade is used for residential construction in {state}?', a: 'M20 grade concrete (20 N/mm²) is the standard for most residential slabs and columns in {state}. Higher grades (M25, M30) are used for load-bearing elements in multi-storey buildings.' },
      { q: 'How much does concrete slab work cost in {state}?', a: 'RCC slab construction in {state} typically costs ₹60–₹150 per sq. ft. (including formwork, steel, and concrete). Ready-mix concrete delivery adds ₹4,500–₹6,500 per cubic metre.' },
      { q: 'How long does concrete need to cure in {state}?', a: 'Concrete should be cured for a minimum of 7 days for standard work and 14–28 days for structural elements. In {state}\'s hot climate, additional curing measures like jute cover and water spray may be needed.' },
      { q: 'Can I get decorative polished concrete for my interiors?', a: 'Yes. Polished concrete floors are an increasingly popular interior choice in {state}. Contractors on Biddaro specialising in decorative concrete offer grinding, polishing, and sealing services.' },
    ],
  },
];
