// =============================================================================
// Singapore Programmatic SEO Data
// Regions, districts, and job categories with SGD pricing
// =============================================================================

export interface CityEntry {
  name: string;
  slug: string;
}

export interface SGLocation {
  name: string;
  slug: string;
  capital: string;
  region: string;
  districts: CityEntry[];
}

export interface FAQ {
  q: string;
  a: string;
}

export interface JobCategoryMeta {
  name: string;
  slug: string;
  emoji: string;
  plural: string;
  shortDesc: string;
  longDesc: string;
  skills: string[];
  avgRate: string;
  faqs: FAQ[];
}

// -----------------------------------------------------------------------------
// Helpers
// -----------------------------------------------------------------------------

export function toSlug(str: string): string {
  return str
    .toLowerCase()
    .replace(/['']/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export function fromSlug(slug: string): string {
  return slug
    .split("-")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
}

export function getSGLocationBySlug(slug: string): SGLocation | undefined {
  return SG_LOCATIONS.find((loc) => loc.slug === slug);
}

export function getSGCategory(slug: string): JobCategoryMeta | undefined {
  return SG_JOB_CATEGORY_META.find((cat) => cat.slug === slug);
}

export function getSGDistrict(
  districtSlug: string
): { district: CityEntry; location: SGLocation } | undefined {
  for (const loc of SG_LOCATIONS) {
    const district = loc.districts.find((d) => d.slug === districtSlug);
    if (district) return { district, location: loc };
  }
  return undefined;
}

// -----------------------------------------------------------------------------
// SG_LOCATIONS — 5 Regions with Real Districts
// -----------------------------------------------------------------------------

export const SG_LOCATIONS: SGLocation[] = [
  {
    name: "Central Region",
    slug: "central",
    capital: "Downtown Core",
    region: "Central",
    districts: [
      { name: "Downtown Core", slug: "downtown-core" },
      { name: "Orchard", slug: "orchard" },
      { name: "Marina Bay", slug: "marina-bay" },
      { name: "Tanjong Pagar", slug: "tanjong-pagar" },
      { name: "Bukit Merah", slug: "bukit-merah" },
      { name: "Queenstown", slug: "queenstown" },
      { name: "Novena", slug: "novena" },
      { name: "Bishan", slug: "bishan" },
      { name: "Toa Payoh", slug: "toa-payoh" },
      { name: "Geylang", slug: "geylang" },
    ],
  },
  {
    name: "East Region",
    slug: "east",
    capital: "Tampines",
    region: "East",
    districts: [
      { name: "Tampines", slug: "tampines" },
      { name: "Bedok", slug: "bedok" },
      { name: "Pasir Ris", slug: "pasir-ris" },
      { name: "Changi", slug: "changi" },
      { name: "Marine Parade", slug: "marine-parade" },
      { name: "Paya Lebar", slug: "paya-lebar" },
    ],
  },
  {
    name: "West Region",
    slug: "west",
    capital: "Jurong East",
    region: "West",
    districts: [
      { name: "Jurong East", slug: "jurong-east" },
      { name: "Jurong West", slug: "jurong-west" },
      { name: "Clementi", slug: "clementi" },
      { name: "Bukit Batok", slug: "bukit-batok" },
      { name: "Choa Chu Kang", slug: "choa-chu-kang" },
      { name: "Bukit Panjang", slug: "bukit-panjang" },
    ],
  },
  {
    name: "North Region",
    slug: "north",
    capital: "Woodlands",
    region: "North",
    districts: [
      { name: "Woodlands", slug: "woodlands" },
      { name: "Yishun", slug: "yishun" },
      { name: "Sembawang", slug: "sembawang" },
      { name: "Ang Mo Kio", slug: "ang-mo-kio" },
      { name: "Mandai", slug: "mandai" },
    ],
  },
  {
    name: "North-East Region",
    slug: "north-east",
    capital: "Sengkang",
    region: "North-East",
    districts: [
      { name: "Sengkang", slug: "sengkang" },
      { name: "Punggol", slug: "punggol" },
      { name: "Hougang", slug: "hougang" },
      { name: "Serangoon", slug: "serangoon" },
      { name: "Seletar", slug: "seletar" },
    ],
  },
];

// -----------------------------------------------------------------------------
// SG_JOB_CATEGORY_META — 15 Categories with SGD Rates
// -----------------------------------------------------------------------------

export const SG_JOB_CATEGORY_META: JobCategoryMeta[] = [
  {
    name: "General Construction",
    slug: "general-construction",
    emoji: "🏗️",
    plural: "General Contractors",
    shortDesc:
      "Licensed general contractors for residential and commercial building projects in Singapore.",
    longDesc:
      "Biddaro connects you with BCA-registered general contractors across {state} who handle full-scope construction projects. From HDB upgrading works to landed property builds, our contractors comply with Singapore building codes, BCA structural safety requirements, and URA planning guidelines. Whether you need a new build, an addition and alteration (A&A), or major structural work, find qualified professionals who understand local regulations and deliver quality results.",
    skills: [
      "Structural construction",
      "HDB renovation works",
      "A&A (Addition & Alteration)",
      "Project management",
      "BCA compliance",
      "Site safety management",
    ],
    avgRate: "SGD 80-250/hr",
    faqs: [
      {
        q: "Do I need a BCA-licensed contractor for construction in {state}?",
        a: "Yes. Under Singapore's Building Control Act, structural works must be carried out by BCA-registered contractors. Always verify your contractor's registration status before engaging them for any construction project in {state}.",
      },
      {
        q: "How much does general construction cost in {state}?",
        a: "General construction rates in {state} typically range from SGD 80 to SGD 250 per hour depending on the project scope, property type (HDB, condo, or landed), and complexity of the works required.",
      },
      {
        q: "What permits are needed for construction in {state}?",
        a: "Most construction projects in {state} require a building plan approval from BCA. For HDB flats, you also need HDB's renovation permit. Landed properties may require URA planning permission if the works involve changes to the building envelope.",
      },
      {
        q: "How long does a typical construction project take in {state}?",
        a: "Timelines vary by project scale. Minor A&A works in {state} may take 2-4 months, while full rebuilds of landed properties can take 12-18 months. HDB renovation projects typically run 6-10 weeks depending on scope.",
      },
    ],
  },
  {
    name: "Plumbing",
    slug: "plumbing",
    emoji: "🔧",
    plural: "Plumbers",
    shortDesc:
      "Licensed plumbers for residential and commercial plumbing services in Singapore.",
    longDesc:
      "Find PUB-licensed plumbers in {state} through Biddaro for all your water supply and sanitary plumbing needs. Our plumbers are experienced with Singapore's plumbing standards, PUB water regulations, and BCA requirements. From fixing leaks in HDB flats to full plumbing installations in new builds, our professionals deliver reliable, code-compliant work across {state}.",
    skills: [
      "Pipe installation and repair",
      "Water heater servicing",
      "Leak detection and repair",
      "Sanitary plumbing works",
      "PUB-compliant installations",
    ],
    avgRate: "SGD 60-150/hr",
    faqs: [
      {
        q: "Do plumbers in {state} need to be PUB-licensed?",
        a: "Yes. Under PUB regulations, all plumbing works in Singapore must be carried out by licensed plumbers. This ensures water supply systems in {state} meet safety and quality standards set by the Public Utilities Board.",
      },
      {
        q: "How much does a plumber charge in {state}?",
        a: "Plumbing services in {state} typically range from SGD 60 to SGD 150 per hour. Emergency or after-hours call-outs may incur additional surcharges. Complex jobs like full re-piping will be quoted based on project scope.",
      },
      {
        q: "Can a plumber fix my HDB toilet leak in {state}?",
        a: "Absolutely. HDB toilet leaks are one of the most common plumbing issues in {state}. A licensed plumber can diagnose and repair leaks in water supply lines, waste pipes, and floor traps efficiently.",
      },
      {
        q: "How quickly can I get a plumber in {state}?",
        a: "Through Biddaro, you can connect with available plumbers in {state} within hours. Many offer same-day service for urgent issues like burst pipes or major leaks.",
      },
    ],
  },
  {
    name: "Electrical",
    slug: "electrical",
    emoji: "⚡",
    plural: "Electricians",
    shortDesc:
      "EMA-licensed electricians for safe, compliant electrical work in Singapore.",
    longDesc:
      "Biddaro helps you find EMA-licensed electricians across {state} for all electrical installations, repairs, and maintenance. Our electricians adhere to the Singapore Standard SS 638 (Code of Practice for Electrical Installations) and EMA regulations. Whether you need rewiring for an older HDB unit, new power point installations, or DB board upgrades, our professionals ensure safe, code-compliant electrical work throughout {state}.",
    skills: [
      "Electrical wiring and rewiring",
      "DB board installation and upgrade",
      "Power point and lighting installation",
      "Electrical fault diagnosis",
      "EMA-compliant installations",
      "Ceiling fan and fixture mounting",
    ],
    avgRate: "SGD 70-180/hr",
    faqs: [
      {
        q: "Must electricians in {state} be licensed?",
        a: "Yes. The Energy Market Authority (EMA) requires all electrical workers in Singapore to hold a valid licence. This ensures all electrical work in {state} meets safety standards outlined in the Electricity Act.",
      },
      {
        q: "What is the cost of electrical work in {state}?",
        a: "Electrical services in {state} typically cost between SGD 70 and SGD 180 per hour. Simple tasks like power point installations are on the lower end, while DB board replacements and full rewiring cost more.",
      },
      {
        q: "Can I do my own electrical work in my HDB flat in {state}?",
        a: "DIY electrical work is strongly discouraged and potentially illegal for certain works in Singapore. For safety and compliance, always engage an EMA-licensed electrician for any electrical modifications in your {state} property.",
      },
      {
        q: "How often should I get an electrical inspection in {state}?",
        a: "It is recommended to have your electrical system inspected every 5-10 years, or when purchasing an older property in {state}. Regular inspections help identify faulty wiring, overloaded circuits, and other safety hazards.",
      },
    ],
  },
  {
    name: "Painting",
    slug: "painting",
    emoji: "🎨",
    plural: "Painters",
    shortDesc:
      "Professional painters for HDB flats, condos, and landed properties in Singapore.",
    longDesc:
      "Discover skilled painters on Biddaro for residential and commercial painting projects across {state}. Our painters understand Singapore's tropical climate and recommend paints that withstand high humidity and heat. From full HDB repainting to feature walls and exterior coating for landed properties, find professionals who deliver clean, lasting finishes compliant with BCA fire safety paint requirements throughout {state}.",
    skills: [
      "Interior wall painting",
      "Exterior painting and coating",
      "Textured and feature wall finishes",
      "Ceiling painting",
      "Anti-mould treatment",
    ],
    avgRate: "SGD 50-120/hr",
    faqs: [
      {
        q: "How much does it cost to paint an HDB flat in {state}?",
        a: "Painting a 4-room HDB flat in {state} typically costs between SGD 800 and SGD 2,500 depending on the number of coats, paint quality, and surface preparation needed. Larger 5-room flats cost proportionally more.",
      },
      {
        q: "What paint is best for Singapore's climate in {state}?",
        a: "For properties in {state}, water-based acrylic or latex paints with anti-mould properties are recommended due to Singapore's high humidity. For exteriors, weather-resistant elastomeric coatings provide the best protection.",
      },
      {
        q: "How long does a painting job take in {state}?",
        a: "A standard 4-room HDB flat in {state} typically takes 2-4 days to complete. Larger units, condos, and landed properties with extensive surface preparation may require 5-10 days.",
      },
      {
        q: "Do painters handle furniture protection in {state}?",
        a: "Yes. Professional painters in {state} will cover furniture, floors, and fixtures with protective sheets before starting work. Most include this as part of their standard service at no extra charge.",
      },
    ],
  },
  {
    name: "Carpentry",
    slug: "carpentry",
    emoji: "🪚",
    plural: "Carpenters",
    shortDesc:
      "Skilled carpenters for custom furniture, built-ins, and woodwork in Singapore.",
    longDesc:
      "Connect with experienced carpenters in {state} through Biddaro for custom cabinetry, built-in wardrobes, and bespoke woodwork. Our carpenters work with materials suited to Singapore's climate and comply with BCA fire safety standards for interior fittings. Whether you need a full set of kitchen cabinets for your HDB flat or custom shelving for a condo in {state}, find craftsmen who deliver precision work.",
    skills: [
      "Custom cabinetry and wardrobes",
      "Kitchen carpentry",
      "Built-in furniture",
      "Wood flooring installation",
      "Door and window frame carpentry",
      "Timber decking",
    ],
    avgRate: "SGD 60-160/hr",
    faqs: [
      {
        q: "How much do custom carpentry works cost in {state}?",
        a: "Custom carpentry in {state} ranges from SGD 60 to SGD 160 per hour for labour. A full set of built-in wardrobes for a bedroom typically costs SGD 3,000-8,000 including materials, while kitchen cabinetry ranges from SGD 5,000-15,000.",
      },
      {
        q: "What materials do carpenters use in {state}?",
        a: "Carpenters in {state} commonly use plywood, MDF, solid wood, and laminates. For Singapore's humid climate, moisture-resistant materials like marine plywood and melamine-faced boards are preferred for durability.",
      },
      {
        q: "Can carpenters work in my HDB flat in {state}?",
        a: "Yes. Carpenters can carry out interior woodwork in HDB flats in {state}, but must adhere to HDB renovation guidelines including permitted work hours (weekdays 9am-6pm) and approved materials.",
      },
      {
        q: "How long does custom carpentry take in {state}?",
        a: "A typical carpentry project in {state} takes 1-3 weeks depending on complexity. Simple built-in shelves may take a few days, while full kitchen and wardrobe sets can take 2-4 weeks including fabrication.",
      },
    ],
  },
  {
    name: "Flooring",
    slug: "flooring",
    emoji: "🏠",
    plural: "Flooring Specialists",
    shortDesc:
      "Expert flooring installation for vinyl, tiles, parquet, and more in Singapore.",
    longDesc:
      "Find professional flooring specialists in {state} on Biddaro for vinyl, laminate, parquet, marble, and tile flooring installation. Our contractors understand BCA requirements for floor load limits and slip resistance standards relevant to Singapore buildings. From overlay flooring for HDB resale flats to premium marble installation for condos in {state}, get quality workmanship that lasts.",
    skills: [
      "Vinyl plank installation",
      "Parquet and hardwood flooring",
      "Tile and marble flooring",
      "Laminate flooring",
      "Floor levelling and preparation",
    ],
    avgRate: "SGD 55-140/hr",
    faqs: [
      {
        q: "What is the most popular flooring in {state} HDB flats?",
        a: "Vinyl plank flooring is currently the most popular choice for HDB flats in {state} due to its water resistance, durability, and ease of installation. It is also one of the most cost-effective options at SGD 3-8 per square foot.",
      },
      {
        q: "How much does flooring installation cost in {state}?",
        a: "Flooring costs in {state} vary by material: vinyl (SGD 3-8/sqft), laminate (SGD 5-12/sqft), parquet (SGD 8-20/sqft), and marble or granite (SGD 15-40/sqft). Labour charges range from SGD 55-140 per hour.",
      },
      {
        q: "Do I need to hack existing tiles before new flooring in {state}?",
        a: "Not always. Overlay flooring options like vinyl planks can be installed directly over existing tiles in your {state} property. However, if tiles are uneven or damaged, hacking and re-levelling may be necessary.",
      },
      {
        q: "How long does flooring installation take in {state}?",
        a: "For a standard 4-room HDB flat in {state}, vinyl flooring takes 1-2 days, while tile or marble flooring may require 3-5 days including levelling and grouting.",
      },
    ],
  },
  {
    name: "Air Conditioning",
    slug: "air-conditioning",
    emoji: "❄️",
    plural: "Aircon Specialists",
    shortDesc:
      "Aircon installation, servicing, and repair for all brands in Singapore.",
    longDesc:
      "Biddaro connects you with certified aircon technicians in {state} for installation, chemical wash, gas top-up, and repair services. Our specialists work with all major brands and comply with BCA regulations for aircon condensate drainage and NEA energy efficiency standards. Whether you need a new system for your HDB flat or maintenance for your condo's centralised cooling in {state}, find reliable technicians fast.",
    skills: [
      "Aircon installation and replacement",
      "Chemical wash and overhaul",
      "Gas top-up (R410A/R32)",
      "Compressor and fan motor repair",
      "Condensate drain servicing",
      "System design and sizing",
    ],
    avgRate: "SGD 70-200/hr",
    faqs: [
      {
        q: "How much does aircon servicing cost in {state}?",
        a: "Standard aircon servicing in {state} costs SGD 30-60 per unit for general cleaning, SGD 80-150 per unit for chemical wash, and SGD 150-250 per unit for a full chemical overhaul. Prices vary by brand and BTU capacity.",
      },
      {
        q: "How often should I service my aircon in {state}?",
        a: "In Singapore's tropical climate, it is recommended to service your aircon every 3-4 months if used daily. Properties in {state} near green areas or construction sites may benefit from more frequent servicing due to dust.",
      },
      {
        q: "Do I need approval to install aircon in {state}?",
        a: "For HDB flats in {state}, you can install aircon in bedrooms and the living room without approval. However, the installation must comply with BCA guidelines for condensate pipe routing and NEA noise regulations for outdoor units.",
      },
      {
        q: "What aircon system is best for Singapore homes in {state}?",
        a: "Split-system inverter aircons are the most popular and energy-efficient choice for homes in {state}. For larger units, multi-split systems allow one outdoor unit to serve multiple rooms, saving space and energy.",
      },
    ],
  },
  {
    name: "Waterproofing",
    slug: "waterproofing",
    emoji: "💧",
    plural: "Waterproofing Specialists",
    shortDesc:
      "Professional waterproofing for bathrooms, roofs, and basements in Singapore.",
    longDesc:
      "Find certified waterproofing specialists across {state} on Biddaro. Singapore's tropical rainfall and high humidity make waterproofing essential for all property types. Our contractors use BCA-approved methods and materials to protect your property from water damage, meeting Singapore Standard SS 637 requirements for waterproofing works. From bathroom re-waterproofing in HDB flats to full roof membrane application for landed homes in {state}, get lasting protection.",
    skills: [
      "Bathroom waterproofing",
      "Roof and terrace waterproofing",
      "Balcony waterproofing",
      "Basement tanking",
      "Leak investigation and repair",
    ],
    avgRate: "SGD 60-150/hr",
    faqs: [
      {
        q: "When do I need waterproofing in my {state} property?",
        a: "Waterproofing is essential during bathroom renovations, when you notice water seepage or damp patches, for flat roofs and terraces, and for any below-grade spaces. In {state}, Singapore's heavy rainfall makes proactive waterproofing a wise investment.",
      },
      {
        q: "How much does waterproofing cost in {state}?",
        a: "Waterproofing in {state} typically costs SGD 15-40 per square foot depending on the method used. A standard HDB bathroom waterproofing costs SGD 800-2,000, while full roof waterproofing for landed properties ranges from SGD 5,000-15,000.",
      },
      {
        q: "Is waterproofing mandatory during HDB renovation in {state}?",
        a: "Yes. HDB requires waterproofing to be redone when you hack bathroom floor tiles during renovation in {state}. A licensed waterproofing contractor must carry out the work and provide a warranty, typically 5-10 years.",
      },
      {
        q: "How long does waterproofing last in {state}?",
        a: "Quality waterproofing in {state} properties typically lasts 10-15 years. The lifespan depends on the materials used, application quality, and building movement. Regular inspections help catch failures early.",
      },
    ],
  },
  {
    name: "Roofing",
    slug: "roofing",
    emoji: "🏠",
    plural: "Roofing Contractors",
    shortDesc:
      "Roof repair, replacement, and maintenance for landed properties in Singapore.",
    longDesc:
      "Connect with experienced roofing contractors in {state} through Biddaro for inspection, repair, and replacement of all roof types. Our roofers comply with BCA structural requirements and understand the demands Singapore's tropical weather places on roofing systems. From concrete tile re-roofing to metal roof installation for landed homes in {state}, find professionals who keep your property protected.",
    skills: [
      "Roof tile replacement",
      "Metal roofing installation",
      "Roof leak repair",
      "Gutter and flashing works",
      "Roof inspection and maintenance",
    ],
    avgRate: "SGD 65-170/hr",
    faqs: [
      {
        q: "How much does roof repair cost in {state}?",
        a: "Roof repair costs in {state} range from SGD 500 for minor tile replacement to SGD 5,000-20,000 for major repairs. Full re-roofing of a landed property typically costs SGD 15,000-50,000 depending on roof area and material.",
      },
      {
        q: "Do I need approval for roofing works in {state}?",
        a: "Replacing roof tiles on a like-for-like basis in {state} generally does not require approval. However, changing the roof structure, material type, or profile may require BCA building plan approval and URA clearance.",
      },
      {
        q: "What roofing material is best for Singapore homes in {state}?",
        a: "Concrete and clay tiles are the most common roofing materials for landed homes in {state}. Metal roofing is gaining popularity for its durability and lighter weight. Both options perform well in Singapore's tropical climate.",
      },
      {
        q: "How often should I inspect my roof in {state}?",
        a: "Roofs in {state} should be inspected at least once a year, ideally before the monsoon season. Regular inspections help catch cracked tiles, damaged flashing, and blocked gutters before they cause water ingress.",
      },
    ],
  },
  {
    name: "Interior Design",
    slug: "interior-design",
    emoji: "🛋️",
    plural: "Interior Designers",
    shortDesc:
      "Creative interior designers for HDB, condo, and landed property projects in Singapore.",
    longDesc:
      "Biddaro connects you with talented interior designers across {state} who transform spaces into functional, beautiful homes. Our designers are well-versed in HDB renovation guidelines, condo MCST bylaws, and BCA fire safety requirements for interior finishes. From space-optimising designs for compact HDB flats to luxurious landed home interiors in {state}, find design professionals who bring your vision to life.",
    skills: [
      "Space planning and layout design",
      "3D rendering and visualisation",
      "Material and finish selection",
      "Furniture and fixture specification",
      "Lighting design",
      "Project coordination",
    ],
    avgRate: "SGD 80-250/hr",
    faqs: [
      {
        q: "How much does an interior designer charge in {state}?",
        a: "Interior design fees in {state} typically range from SGD 80-250 per hour for consultation, or 10-15% of the total renovation budget as a design fee. Many firms in Singapore offer package deals that include design and renovation management.",
      },
      {
        q: "Do I need an interior designer for my HDB flat in {state}?",
        a: "While not mandatory, an interior designer can help you maximise space in your {state} HDB flat, navigate HDB renovation guidelines, coordinate contractors, and avoid costly mistakes. It is especially helpful for complex renovation projects.",
      },
      {
        q: "How long does the interior design process take in {state}?",
        a: "The design phase for a typical HDB flat in {state} takes 2-4 weeks including consultations, concept development, and 3D visualisation. The full renovation process from design to completion usually takes 8-12 weeks.",
      },
      {
        q: "What design styles are popular in {state}?",
        a: "Popular interior design styles in {state} include Scandinavian minimalism, modern contemporary, Japandi (Japanese-Scandinavian fusion), and industrial chic. The trend in Singapore leans towards clean lines and neutral palettes that make spaces feel larger.",
      },
    ],
  },
  {
    name: "Landscaping",
    slug: "landscaping",
    emoji: "🌿",
    plural: "Landscapers",
    shortDesc:
      "Professional landscaping for gardens, balconies, and outdoor spaces in Singapore.",
    longDesc:
      "Find skilled landscapers in {state} through Biddaro for garden design, planting, hardscaping, and maintenance. Our landscapers understand Singapore's tropical plant species and NParks guidelines for greenery. From balcony gardens in HDB flats to full landscape design for landed properties in {state}, our professionals create lush, sustainable outdoor spaces that thrive in Singapore's climate.",
    skills: [
      "Garden design and planting",
      "Hardscaping and paving",
      "Irrigation system installation",
      "Tree and shrub maintenance",
      "Vertical and balcony gardening",
    ],
    avgRate: "SGD 50-130/hr",
    faqs: [
      {
        q: "How much does landscaping cost in {state}?",
        a: "Landscaping in {state} ranges from SGD 50-130 per hour for labour. A full garden design and installation for a landed property typically costs SGD 10,000-50,000 depending on area and complexity. Balcony gardens start from SGD 1,000-5,000.",
      },
      {
        q: "Do I need approval for landscaping my property in {state}?",
        a: "For landed properties in {state}, you generally do not need approval for soft landscaping (planting). However, hardscaping that affects drainage or structural changes to the garden may require URA or BCA approval.",
      },
      {
        q: "What plants grow best in {state}?",
        a: "Singapore's tropical climate in {state} supports a wide range of plants. Popular choices include heliconia, frangipani, bougainvillea, and bird of paradise. For shade, consider ferns and philodendrons. NParks maintains a list of recommended species.",
      },
      {
        q: "How often should I maintain my garden in {state}?",
        a: "Gardens in {state} benefit from weekly or bi-weekly maintenance due to rapid plant growth in Singapore's tropical climate. This includes pruning, weeding, fertilising, and pest management.",
      },
    ],
  },
  {
    name: "Tiling",
    slug: "tiling",
    emoji: "🔲",
    plural: "Tiling Contractors",
    shortDesc:
      "Expert tile installation for floors, walls, bathrooms, and kitchens in Singapore.",
    longDesc:
      "Connect with experienced tiling contractors in {state} on Biddaro for precision tile installation across all property types. Our tilers work with porcelain, ceramic, marble, granite, and mosaic tiles, ensuring proper waterproofing integration and BCA-compliant slip resistance for wet areas. From re-tiling HDB bathrooms to large-format tile installation in condos across {state}, find skilled tilers who deliver flawless results.",
    skills: [
      "Floor and wall tiling",
      "Bathroom and kitchen tiling",
      "Large-format tile installation",
      "Mosaic and feature wall tiling",
      "Tile hacking and removal",
    ],
    avgRate: "SGD 55-140/hr",
    faqs: [
      {
        q: "How much does tiling cost in {state}?",
        a: "Tiling labour in {state} costs SGD 55-140 per hour, or SGD 5-15 per square foot. A full HDB bathroom re-tiling (including hacking) costs SGD 2,000-5,000. Tile material costs are additional and vary from SGD 2-30 per square foot.",
      },
      {
        q: "Do I need to hack old tiles before re-tiling in {state}?",
        a: "For HDB renovations in {state}, hacking is recommended for bathrooms to allow proper waterproofing. You can overlay tiles in dry areas, but this raises the floor level. HDB guidelines specify maximum floor load limits that must be observed.",
      },
      {
        q: "What tile is best for Singapore bathrooms in {state}?",
        a: "Porcelain tiles with a matt or textured finish are ideal for bathrooms in {state} as they provide slip resistance when wet. Look for tiles rated R10 or above for wet area safety, complying with BCA recommendations.",
      },
      {
        q: "How long does re-tiling take in {state}?",
        a: "Re-tiling a standard HDB bathroom in {state} takes 3-5 days including hacking, waterproofing, tiling, and grouting. A full flat re-tiling project may take 1-2 weeks depending on the area covered.",
      },
    ],
  },
  {
    name: "Renovation",
    slug: "renovation",
    emoji: "🔨",
    plural: "Renovation Contractors",
    shortDesc:
      "Full-service renovation contractors for HDB, condo, and landed homes in Singapore.",
    longDesc:
      "Biddaro helps you find trusted renovation contractors across {state} for complete home transformations. Our contractors hold valid HDB renovation permits and BCA registrations, ensuring full compliance with Singapore building codes. From BTO flat renovations to resale HDB makeovers and luxury condo refurbishments in {state}, find contractors who handle everything from design to handover.",
    skills: [
      "Full home renovation",
      "HDB BTO and resale renovation",
      "Condo renovation",
      "Landed property renovation",
      "Partial renovation and upgrades",
      "HDB permit management",
    ],
    avgRate: "SGD 70-200/hr",
    faqs: [
      {
        q: "How much does HDB renovation cost in {state}?",
        a: "HDB renovation in {state} typically costs SGD 30,000-80,000 for a 4-room flat and SGD 40,000-100,000 for a 5-room flat. BTO flats generally cost less to renovate than resale units which may need more hacking and repair work.",
      },
      {
        q: "What renovation works are allowed in HDB flats in {state}?",
        a: "HDB permits most interior works in {state} flats including hacking of floor tiles, non-structural wall removal (with approval), carpentry, painting, and electrical work. Structural walls, bomb shelters, and common areas cannot be modified.",
      },
      {
        q: "How long does a full renovation take in {state}?",
        a: "A typical HDB renovation in {state} takes 6-10 weeks. Condo renovations may take 8-12 weeks due to MCST regulations and limited contractor access hours. Landed property renovations can extend to 3-6 months for major works.",
      },
      {
        q: "Do I need a renovation permit for my {state} property?",
        a: "HDB flats in {state} require a renovation permit obtained through HDB's e-services portal before any work begins. Condo owners must get MCST approval. Landed property works may need BCA and URA approvals depending on scope.",
      },
    ],
  },
  {
    name: "Demolition",
    slug: "demolition",
    emoji: "🏚️",
    plural: "Demolition Contractors",
    shortDesc:
      "Licensed demolition contractors for safe, controlled removal works in Singapore.",
    longDesc:
      "Find BCA-registered demolition contractors in {state} through Biddaro for controlled demolition and hacking works. Our contractors comply with Singapore's Building Control (Demolition) Regulations and environmental guidelines including NEA noise and dust control requirements. From selective hacking of HDB walls and floors to full building demolition for redevelopment in {state}, work with professionals who prioritise safety.",
    skills: [
      "Selective hacking and demolition",
      "Full structural demolition",
      "Asbestos identification and management",
      "Debris removal and disposal",
      "Noise and dust control",
    ],
    avgRate: "SGD 60-150/hr",
    faqs: [
      {
        q: "How much does hacking cost in {state}?",
        a: "Hacking in {state} typically costs SGD 60-150 per hour. For HDB flats, bathroom floor and wall tile hacking costs SGD 800-2,000 per bathroom. Full flat hacking (all tiles) ranges from SGD 3,000-8,000 depending on size.",
      },
      {
        q: "Do I need a permit for demolition works in {state}?",
        a: "For HDB flats in {state}, demolition works are covered under your renovation permit. For larger demolition projects involving structural elements, a separate BCA demolition permit is required along with a qualified person's supervision.",
      },
      {
        q: "What walls can I hack in my HDB flat in {state}?",
        a: "Only non-structural walls can be removed in HDB flats in {state}. Structural walls (typically thicker, load-bearing walls) and the household shelter (bomb shelter) must not be modified. An HDB-approved contractor can identify which walls are safe to remove.",
      },
      {
        q: "How is demolition waste disposed of in {state}?",
        a: "Demolition waste in {state} must be disposed of at NEA-licensed facilities. Contractors are responsible for proper waste segregation and transport. Illegal dumping carries heavy fines in Singapore.",
      },
    ],
  },
  {
    name: "Pest Control",
    slug: "pest-control",
    emoji: "🐛",
    plural: "Pest Control Specialists",
    shortDesc:
      "NEA-licensed pest control services for homes and businesses in Singapore.",
    longDesc:
      "Biddaro connects you with NEA-licensed pest control operators across {state} for effective, safe pest management. Singapore's tropical climate makes pest control essential for all property types. Our specialists handle termites, cockroaches, ants, rodents, mosquitoes, and bed bugs using NEA-approved methods and chemicals. Protect your {state} property with professional pest management that meets Singapore's environmental and safety regulations.",
    skills: [
      "Termite treatment and prevention",
      "General pest control (cockroaches, ants)",
      "Rodent management",
      "Mosquito fogging and larviciding",
      "Bed bug treatment",
      "Pre- and post-construction termite barriers",
    ],
    avgRate: "SGD 40-100/hr",
    faqs: [
      {
        q: "How much does pest control cost in {state}?",
        a: "Pest control in {state} typically costs SGD 40-100 per hour, or SGD 80-200 per treatment for standard pest control. Termite treatment is more specialised, ranging from SGD 1,000-5,000 depending on property size and infestation severity.",
      },
      {
        q: "Do pest control companies in {state} need to be licensed?",
        a: "Yes. All pest control operators in Singapore must be licensed by NEA (National Environment Agency). This ensures proper training, safe chemical handling, and compliance with environmental regulations in {state}.",
      },
      {
        q: "How often should I do pest control in {state}?",
        a: "For homes in {state}, quarterly pest control treatments are recommended as a preventive measure. Properties with recurring issues or those near food establishments may benefit from monthly treatments.",
      },
      {
        q: "Are pest control chemicals safe for my family in {state}?",
        a: "NEA-licensed operators in {state} use approved, low-toxicity chemicals that are safe when applied correctly. Technicians will advise on re-entry times and precautions. Gel baits and traps offer non-spray alternatives for sensitive households.",
      },
    ],
  },
];
