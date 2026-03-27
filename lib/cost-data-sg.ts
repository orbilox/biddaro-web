// =============================================================================
// Singapore Cost Data for Programmatic SEO
// Service cost guides with SGD pricing
// =============================================================================

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

// -----------------------------------------------------------------------------
// Helpers
// -----------------------------------------------------------------------------

export function getSGCostService(slug: string): CostServiceMeta | undefined {
  return SG_COST_SERVICES.find((s) => s.slug === slug);
}

export function getRelatedSGCostServices(slug: string): CostServiceMeta[] {
  const service = getSGCostService(slug);
  if (!service) return [];
  return service.relatedSlugs
    .map((rs) => getSGCostService(rs))
    .filter((s): s is CostServiceMeta => s !== undefined);
}

// -----------------------------------------------------------------------------
// SG_COST_SERVICES — 12 Services with SGD Pricing
// -----------------------------------------------------------------------------

export const SG_COST_SERVICES: CostServiceMeta[] = [
  {
    slug: "general-construction",
    name: "General Construction",
    emoji: "🏗️",
    headline: "General Construction Cost in Singapore 2026",
    metaDesc:
      "How much does general construction cost in {city}, Singapore? Compare 2026 prices for HDB, condo, and landed property construction from SGD 300-800/sqft.",
    intro:
      "Planning a construction project in {city}? Understanding current costs is essential for budgeting your build. Whether you are constructing an HDB upgrading project, a new condo unit fit-out, or a landed property rebuild in {city}, this guide covers the latest 2026 pricing for general construction services in Singapore.",
    items: [
      { label: "HDB A&A works", low: "300", high: "500", unit: "per sqft" },
      {
        label: "Condo interior construction",
        low: "350",
        high: "600",
        unit: "per sqft",
      },
      {
        label: "Landed property new build",
        low: "400",
        high: "800",
        unit: "per sqft",
      },
      {
        label: "Commercial fit-out",
        low: "250",
        high: "700",
        unit: "per sqft",
      },
      {
        label: "Structural reinforcement",
        low: "5,000",
        high: "30,000",
        unit: "per project",
      },
      {
        label: "Foundation works",
        low: "10,000",
        high: "50,000",
        unit: "per project",
      },
      {
        label: "Site preparation and clearing",
        low: "3,000",
        high: "15,000",
        unit: "per project",
      },
      {
        label: "Project management fees",
        low: "5,000",
        high: "20,000",
        unit: "per project",
      },
    ],
    factors: [
      "Property type (HDB, condo, landed) significantly affects construction costs",
      "Location within Singapore — central areas in the CBD command higher contractor rates",
      "Complexity of structural works and engineering requirements",
      "Material choices (standard vs premium finishes)",
      "Project timeline and urgency — rushed projects incur surcharges",
    ],
    tips: [
      "Always engage BCA-registered contractors for any structural works to ensure compliance with Singapore building codes and safety standards",
      "Obtain at least three detailed quotations and compare scope of works, not just total price — the cheapest quote may exclude critical items",
      "Check if your project requires BCA building plan approval or URA planning permission before commencing works to avoid costly stop-work orders",
      "Factor in a 10-15% contingency budget for unforeseen structural issues, especially in older properties",
    ],
    faqs: [
      {
        q: "How much does it cost to build a house in Singapore?",
        a: "Building a landed property in Singapore costs SGD 400-800 per square foot for construction alone. A typical semi-detached house of 3,000 sqft would cost SGD 1.2-2.4 million for construction, excluding land cost.",
      },
      {
        q: "Do I need a BCA-registered builder?",
        a: "Yes. Under Singapore's Building Control Act, any construction project involving structural works must be carried out by a BCA-registered contractor with the appropriate grading for the project value.",
      },
      {
        q: "How long does construction take in Singapore?",
        a: "Construction timelines vary widely. HDB A&A works take 2-4 months, condo fit-outs 3-6 months, and full landed property builds 12-18 months. Weather delays during monsoon season can add time.",
      },
      {
        q: "What approvals are needed for construction in Singapore?",
        a: "Most construction projects require BCA building plan approval. Landed properties may also need URA planning permission. HDB flats require an HDB renovation permit. Your contractor should help navigate these requirements.",
      },
    ],
    avgLow: "300",
    avgHigh: "800",
    avgUnit: "per sqft",
    relatedSlugs: ["renovation", "waterproofing", "flooring"],
  },
  {
    slug: "plumbing",
    name: "Plumbing",
    emoji: "🔧",
    headline: "Plumbing Cost in Singapore 2026",
    metaDesc:
      "How much does plumbing cost in {city}, Singapore? Compare 2026 prices for plumbing repairs and installations from SGD 150-500 per job.",
    intro:
      "Need plumbing work done in {city}? From fixing a leaky tap to re-piping your entire home, understanding current plumbing costs helps you budget accurately. This guide covers 2026 plumbing prices for all types of residential and commercial work in {city}, Singapore.",
    items: [
      {
        label: "Tap replacement",
        low: "80",
        high: "200",
        unit: "per unit",
      },
      {
        label: "Toilet bowl replacement",
        low: "300",
        high: "800",
        unit: "per unit",
      },
      {
        label: "Pipe leak repair",
        low: "150",
        high: "500",
        unit: "per job",
      },
      {
        label: "Water heater installation",
        low: "200",
        high: "600",
        unit: "per unit",
      },
      {
        label: "Choked drain clearing",
        low: "80",
        high: "300",
        unit: "per job",
      },
      {
        label: "Full bathroom re-piping",
        low: "800",
        high: "2,500",
        unit: "per bathroom",
      },
      {
        label: "Kitchen sink installation",
        low: "150",
        high: "400",
        unit: "per unit",
      },
      {
        label: "Emergency call-out surcharge",
        low: "50",
        high: "150",
        unit: "per visit",
      },
    ],
    factors: [
      "Type of plumbing issue — simple repairs cost less than full re-piping",
      "Accessibility of pipes — concealed pipes behind walls cost more to repair",
      "Time of service — after-hours and weekend emergency calls incur surcharges",
      "Parts and materials — premium fittings from brands like Grohe or Hansgrohe cost more",
      "Age of property — older buildings may have corroded pipes requiring extensive work",
    ],
    tips: [
      "Always engage a PUB-licensed plumber to ensure your water supply works comply with Public Utilities Board regulations",
      "For HDB flats, check if the issue falls under Town Council responsibility (common pipes) before engaging a private plumber",
      "Request a written quotation before work begins, especially for larger jobs — verbal agreements can lead to disputes",
    ],
    faqs: [
      {
        q: "How much does it cost to fix a leaking pipe in Singapore?",
        a: "Pipe leak repairs in Singapore cost SGD 150-500 depending on the pipe location and severity. Concealed pipe leaks that require wall hacking cost significantly more than exposed pipe repairs.",
      },
      {
        q: "Do I need a PUB-licensed plumber?",
        a: "Yes. Under PUB regulations, all plumbing works connected to the public water supply must be carried out by a licensed plumber. This ensures your plumbing meets safety and quality standards.",
      },
      {
        q: "How much is a toilet bowl replacement in Singapore?",
        a: "Replacing a toilet bowl in Singapore costs SGD 300-800 including the unit and installation. Premium wall-hung toilets cost more due to concealed cistern installation requirements.",
      },
      {
        q: "Can I claim plumbing repairs from my HDB Town Council?",
        a: "Town Councils are responsible for common area plumbing and pipes within walls that serve multiple units. Plumbing within your flat, including taps, toilet bowls, and internal pipes, is the homeowner's responsibility.",
      },
    ],
    avgLow: "150",
    avgHigh: "500",
    avgUnit: "per job",
    relatedSlugs: ["waterproofing", "bathroom-remodel", "general-construction"],
  },
  {
    slug: "electrical",
    name: "Electrical",
    emoji: "⚡",
    headline: "Electrical Work Cost in Singapore 2026",
    metaDesc:
      "How much does electrical work cost in {city}, Singapore? Compare 2026 prices for wiring, power points, and DB board upgrades from SGD 100-400 per point.",
    intro:
      "Planning electrical work in {city}? Whether you need new power points installed, a DB board upgrade, or full rewiring for an older property, understanding current costs in {city} helps you make informed decisions. This guide covers 2026 electrical work pricing across Singapore.",
    items: [
      {
        label: "Power point installation",
        low: "100",
        high: "200",
        unit: "per point",
      },
      {
        label: "Light point installation",
        low: "80",
        high: "180",
        unit: "per point",
      },
      {
        label: "DB board replacement",
        low: "500",
        high: "1,500",
        unit: "per unit",
      },
      {
        label: "Full flat rewiring (HDB 4-room)",
        low: "2,000",
        high: "5,000",
        unit: "per flat",
      },
      {
        label: "Ceiling fan installation",
        low: "80",
        high: "200",
        unit: "per unit",
      },
      {
        label: "EV charger installation",
        low: "1,500",
        high: "4,000",
        unit: "per unit",
      },
      {
        label: "Electrical fault diagnosis",
        low: "100",
        high: "400",
        unit: "per visit",
      },
    ],
    factors: [
      "Number of power and light points required",
      "Wiring route complexity — concealed wiring in walls costs more than surface-mounted trunking",
      "DB board capacity and whether an upgrade is needed for additional load",
      "Property age — older properties may need full rewiring for safety",
      "Specialised requirements such as EV charger or smart home systems",
    ],
    tips: [
      "Always engage an EMA-licensed electrician — unlicensed electrical work is illegal and dangerous in Singapore",
      "When renovating, plan all electrical points upfront to avoid costly additions after walls are sealed",
      "Consider future needs when sizing your DB board — upgrading later is more expensive than getting the right capacity from the start",
      "Request a load calculation if adding high-power appliances to ensure your existing supply can handle the demand",
    ],
    faqs: [
      {
        q: "How much does it cost to add a power point in Singapore?",
        a: "Adding a new power point in Singapore costs SGD 100-200 per point for standard installations. Costs increase if wiring needs to run through concrete walls or over long distances from the DB board.",
      },
      {
        q: "When should I upgrade my DB board?",
        a: "Upgrade your DB board if it is more than 20 years old, uses outdated fuse wire instead of MCBs, trips frequently, or you are adding high-power appliances. A new DB board costs SGD 500-1,500.",
      },
      {
        q: "How much does rewiring an HDB flat cost?",
        a: "Full rewiring of a 4-room HDB flat costs SGD 2,000-5,000 depending on the number of points and wiring complexity. This is often recommended for resale flats over 20 years old.",
      },
      {
        q: "Can I install an EV charger in my condo in Singapore?",
        a: "Yes, but you need MCST approval and a licensed electrician to assess your unit's electrical capacity. EV charger installation costs SGD 1,500-4,000 including the charging unit, wiring, and any DB board upgrades.",
      },
    ],
    avgLow: "100",
    avgHigh: "400",
    avgUnit: "per point",
    relatedSlugs: ["renovation", "general-construction", "hvac"],
  },
  {
    slug: "hvac",
    name: "HVAC / Air Conditioning",
    emoji: "❄️",
    headline: "Aircon & HVAC Cost in Singapore 2026",
    metaDesc:
      "How much does aircon installation and servicing cost in {city}, Singapore? Compare 2026 prices from SGD 3,000-15,000 per system.",
    intro:
      "Air conditioning is essential in {city}'s tropical climate. Whether you are installing a new system in a BTO flat, replacing aging units in a resale home, or upgrading to an energy-efficient inverter system in {city}, this guide covers all the costs you need to know for 2026.",
    items: [
      {
        label: "Single split unit (9,000 BTU) supply and install",
        low: "1,200",
        high: "2,500",
        unit: "per unit",
      },
      {
        label: "Multi-split system (1 outdoor + 3 indoor)",
        low: "4,500",
        high: "9,000",
        unit: "per system",
      },
      {
        label: "Multi-split system (1 outdoor + 5 indoor)",
        low: "7,000",
        high: "15,000",
        unit: "per system",
      },
      {
        label: "Aircon replacement (like-for-like)",
        low: "800",
        high: "2,000",
        unit: "per unit",
      },
      {
        label: "General servicing",
        low: "30",
        high: "60",
        unit: "per unit",
      },
      {
        label: "Chemical wash",
        low: "80",
        high: "150",
        unit: "per unit",
      },
      {
        label: "Chemical overhaul",
        low: "150",
        high: "250",
        unit: "per unit",
      },
      {
        label: "Gas top-up (R410A/R32)",
        low: "80",
        high: "200",
        unit: "per unit",
      },
    ],
    factors: [
      "Number of indoor units and total cooling capacity (BTU) required",
      "Brand choice — premium brands like Daikin and Mitsubishi cost more than budget options",
      "Installation complexity — piping length, trunking requirements, and condensate drain routing",
      "Energy efficiency rating — higher-tick systems cost more upfront but save on electricity",
      "Property type — HDB installations are typically simpler than condo or landed property setups",
    ],
    tips: [
      "Choose inverter aircon systems with 5-tick NEA energy ratings to save up to 30% on electricity bills over the system's lifetime",
      "Ensure your installer complies with BCA condensate pipe drainage requirements to prevent water leaks to neighbours below",
      "Schedule regular servicing every 3-4 months to maintain efficiency and extend the lifespan of your system",
      "For HDB flats, ensure the outdoor unit bracket meets HDB specifications and does not obstruct the corridor or common area",
    ],
    faqs: [
      {
        q: "How much does it cost to install aircon in a 4-room HDB flat?",
        a: "A complete aircon installation for a 4-room HDB flat (typically 3 bedrooms + living room) costs SGD 4,500-9,000 for a multi-split system including supply, installation, trunking, and piping.",
      },
      {
        q: "How often should I service my aircon in Singapore?",
        a: "Service your aircon every 3-4 months for standard cleaning. A chemical wash is recommended every 12-18 months, and a chemical overhaul every 2-3 years to maintain optimal performance.",
      },
      {
        q: "Which aircon brand is best for Singapore?",
        a: "Daikin, Mitsubishi Electric, and Panasonic are the most popular brands in Singapore, known for reliability and energy efficiency. Budget-friendly options include Midea and EuropAce.",
      },
      {
        q: "How long does aircon installation take?",
        a: "A standard multi-split installation for an HDB flat takes 1-2 days. Larger landed property systems with ducted or VRV systems may take 3-5 days.",
      },
    ],
    avgLow: "3,000",
    avgHigh: "15,000",
    avgUnit: "per system",
    relatedSlugs: ["electrical", "renovation", "general-construction"],
  },
  {
    slug: "painting",
    name: "Painting",
    emoji: "🎨",
    headline: "Painting Cost in Singapore 2026",
    metaDesc:
      "How much does painting cost in {city}, Singapore? Compare 2026 prices from SGD 3-8/sqft for interior and exterior painting services.",
    intro:
      "Thinking of repainting your home in {city}? A fresh coat of paint is one of the most cost-effective ways to transform your space. This guide covers 2026 painting costs in {city} for HDB flats, condos, and landed properties across Singapore.",
    items: [
      {
        label: "Interior wall painting (2 coats)",
        low: "3",
        high: "6",
        unit: "per sqft",
      },
      {
        label: "Ceiling painting",
        low: "3",
        high: "7",
        unit: "per sqft",
      },
      {
        label: "Exterior painting (landed)",
        low: "5",
        high: "8",
        unit: "per sqft",
      },
      {
        label: "3-room HDB full repaint",
        low: "600",
        high: "1,500",
        unit: "per flat",
      },
      {
        label: "4-room HDB full repaint",
        low: "800",
        high: "2,500",
        unit: "per flat",
      },
      {
        label: "5-room HDB full repaint",
        low: "1,000",
        high: "3,000",
        unit: "per flat",
      },
      {
        label: "Feature/accent wall",
        low: "150",
        high: "500",
        unit: "per wall",
      },
      {
        label: "Anti-mould treatment",
        low: "200",
        high: "600",
        unit: "per room",
      },
    ],
    factors: [
      "Total wall area to be painted (sqft)",
      "Number of coats required — peeling or dark walls may need 3+ coats",
      "Paint quality and brand — premium paints like Nippon Odour-less or Dulux Ambiance cost more",
      "Surface preparation needed — patching cracks, sanding, and priming add cost",
      "Height and accessibility — high ceilings and exterior work require scaffolding",
    ],
    tips: [
      "Use paints with anti-mould and anti-bacterial properties suited for Singapore's humid climate to prevent mould growth",
      "For HDB flats, inform your Town Council if exterior painting is planned as the colour scheme may be regulated",
      "Request a paint colour test patch before committing — colours look different on walls than on sample cards, especially under Singapore's lighting conditions",
    ],
    faqs: [
      {
        q: "How much does it cost to paint a 4-room HDB flat?",
        a: "Painting a 4-room HDB flat in Singapore costs SGD 800-2,500 for a full repaint including walls and ceilings. The price depends on paint quality, number of coats, and surface condition.",
      },
      {
        q: "How long does it take to paint an HDB flat?",
        a: "A standard 4-room HDB flat takes 2-4 days to paint. This includes surface preparation, 2 coats of paint, and drying time between coats.",
      },
      {
        q: "What paint is best for Singapore homes?",
        a: "Water-based emulsion paints with anti-mould properties are best for Singapore homes. Popular choices include Nippon Paint Odour-less series and Dulux Ambiance, both designed for tropical climates.",
      },
      {
        q: "Should I paint or use wallpaper in Singapore?",
        a: "Paint is generally more practical in Singapore due to the high humidity which can cause wallpaper to peel. However, modern vinyl wallpapers perform well. Paint is cheaper and easier to maintain long-term.",
      },
    ],
    avgLow: "3",
    avgHigh: "8",
    avgUnit: "per sqft",
    relatedSlugs: ["renovation", "general-construction", "flooring"],
  },
  {
    slug: "flooring",
    name: "Flooring",
    emoji: "🏠",
    headline: "Flooring Cost in Singapore 2026",
    metaDesc:
      "How much does flooring cost in {city}, Singapore? Compare 2026 prices from SGD 8-25/sqft for vinyl, laminate, parquet, and tile flooring.",
    intro:
      "Upgrading the flooring in your {city} home? From budget-friendly vinyl to premium marble, the right flooring transforms your space. This guide covers 2026 flooring installation costs in {city} to help you compare materials and make the best choice for your property.",
    items: [
      {
        label: "Vinyl plank flooring (supply + install)",
        low: "3",
        high: "8",
        unit: "per sqft",
      },
      {
        label: "Laminate flooring (supply + install)",
        low: "5",
        high: "12",
        unit: "per sqft",
      },
      {
        label: "Engineered wood / parquet",
        low: "8",
        high: "20",
        unit: "per sqft",
      },
      {
        label: "Porcelain / ceramic tiles",
        low: "8",
        high: "18",
        unit: "per sqft",
      },
      {
        label: "Marble / granite flooring",
        low: "15",
        high: "40",
        unit: "per sqft",
      },
      {
        label: "Tile hacking and removal",
        low: "3",
        high: "8",
        unit: "per sqft",
      },
      {
        label: "Floor levelling / screeding",
        low: "2",
        high: "6",
        unit: "per sqft",
      },
      {
        label: "Skirting installation",
        low: "3",
        high: "10",
        unit: "per ft",
      },
    ],
    factors: [
      "Material choice — vinyl is most affordable while marble is premium",
      "Whether existing flooring needs hacking and removal (adds SGD 3-8/sqft)",
      "Floor condition — uneven floors require levelling before new flooring",
      "Total area in square feet",
      "Pattern complexity — herringbone and diagonal layouts require more cutting and labour",
    ],
    tips: [
      "For HDB flats, check HDB's guidelines on floor load limits before choosing heavy materials like marble — exceeding limits may require BCA structural assessment",
      "Vinyl plank flooring is the most popular choice for Singapore HDB flats due to its water resistance, durability, and easy installation over existing tiles",
      "Consider STC (Sound Transmission Class) ratings for condo flooring — many MCSTs require minimum sound insulation levels to reduce noise complaints from neighbours",
    ],
    faqs: [
      {
        q: "What is the cheapest flooring option in Singapore?",
        a: "Vinyl plank flooring is the most affordable option at SGD 3-8 per sqft installed. It is waterproof, easy to maintain, and can be overlaid on existing tiles without hacking.",
      },
      {
        q: "Do I need to hack tiles before installing new flooring?",
        a: "Not always. Overlay options like vinyl and laminate can be installed over existing tiles. However, for tile or marble flooring, hacking the old floor is usually necessary for a proper finish.",
      },
      {
        q: "How long does flooring installation take?",
        a: "Vinyl overlay takes 1-2 days for a standard HDB flat. Tile installation takes 3-5 days. If hacking is required, add 1-2 days for removal and levelling.",
      },
      {
        q: "Is parquet flooring suitable for Singapore?",
        a: "Engineered wood parquet performs well in Singapore's climate as it is more stable than solid wood in humid conditions. Proper acclimatisation before installation and regular maintenance are key to longevity.",
      },
    ],
    avgLow: "8",
    avgHigh: "25",
    avgUnit: "per sqft",
    relatedSlugs: ["renovation", "general-construction", "waterproofing"],
  },
  {
    slug: "waterproofing",
    name: "Waterproofing",
    emoji: "💧",
    headline: "Waterproofing Cost in Singapore 2026",
    metaDesc:
      "How much does waterproofing cost in {city}, Singapore? Compare 2026 prices from SGD 15-40/sqft for bathroom, roof, and basement waterproofing.",
    intro:
      "Waterproofing is critical in {city} given Singapore's heavy rainfall and high humidity. Whether you are renovating a bathroom, sealing a flat roof, or protecting a basement in {city}, proper waterproofing prevents costly water damage. This guide covers 2026 waterproofing costs across Singapore.",
    items: [
      {
        label: "Bathroom waterproofing (membrane system)",
        low: "15",
        high: "30",
        unit: "per sqft",
      },
      {
        label: "Bathroom waterproofing (cementitious)",
        low: "12",
        high: "25",
        unit: "per sqft",
      },
      {
        label: "Roof / terrace waterproofing",
        low: "18",
        high: "40",
        unit: "per sqft",
      },
      {
        label: "Balcony waterproofing",
        low: "15",
        high: "35",
        unit: "per sqft",
      },
      {
        label: "Basement tanking",
        low: "20",
        high: "45",
        unit: "per sqft",
      },
      {
        label: "HDB bathroom (full waterproof, standard size)",
        low: "800",
        high: "2,000",
        unit: "per bathroom",
      },
      {
        label: "Water leak investigation / testing",
        low: "200",
        high: "600",
        unit: "per visit",
      },
    ],
    factors: [
      "Area to be waterproofed (total square footage)",
      "Waterproofing method — membrane systems cost more but last longer than cementitious coatings",
      "Surface condition — cracked or deteriorated substrates need repair before waterproofing",
      "Location — roof and external areas require UV-resistant systems that cost more",
      "Warranty period — longer warranties typically indicate higher-quality materials and application",
    ],
    tips: [
      "HDB requires waterproofing to be redone whenever bathroom floor tiles are hacked during renovation — ensure your contractor includes this in the renovation quotation",
      "Request a water ponding test after waterproofing is applied and before tiling — this 24-48 hour test confirms the membrane is watertight",
      "Choose waterproofing systems that meet SS 637 (Singapore Standard for waterproofing) for best results and warranty coverage",
      "For flat roofs on landed properties, schedule waterproofing inspections every 3-5 years to catch deterioration early",
    ],
    faqs: [
      {
        q: "How much does bathroom waterproofing cost in Singapore?",
        a: "Bathroom waterproofing in Singapore costs SGD 800-2,000 per standard HDB bathroom, or SGD 15-30 per sqft. The price depends on the waterproofing system used and the condition of the substrate.",
      },
      {
        q: "Is waterproofing mandatory during HDB renovation?",
        a: "Yes. HDB mandates that waterproofing must be redone when you hack bathroom floor tiles. The waterproofing must be carried out by a qualified contractor and pass a water ponding test before tiling.",
      },
      {
        q: "How long does waterproofing last?",
        a: "Quality waterproofing typically lasts 10-15 years for bathrooms and 8-12 years for roofs. The lifespan depends on the system used, application quality, and building movement over time.",
      },
      {
        q: "What are signs that waterproofing has failed?",
        a: "Common signs include water stains on the ceiling below a bathroom, damp or peeling paint on walls, musty odours, and visible mould growth. Address these promptly to prevent structural damage.",
      },
    ],
    avgLow: "15",
    avgHigh: "40",
    avgUnit: "per sqft",
    relatedSlugs: ["bathroom-remodel", "plumbing", "general-construction"],
  },
  {
    slug: "renovation",
    name: "Renovation",
    emoji: "🔨",
    headline: "Renovation Cost in Singapore 2026",
    metaDesc:
      "How much does renovation cost in {city}, Singapore? Compare 2026 prices from SGD 30,000-150,000 for HDB and SGD 50,000-300,000 for condo renovation.",
    intro:
      "Planning a renovation in {city}? Whether it is a BTO flat, resale HDB, condo, or landed property, understanding renovation costs is the first step. This comprehensive guide covers 2026 renovation pricing in {city} to help you plan your budget realistically.",
    items: [
      {
        label: "3-room HDB BTO renovation",
        low: "20,000",
        high: "50,000",
        unit: "per flat",
      },
      {
        label: "4-room HDB BTO renovation",
        low: "25,000",
        high: "65,000",
        unit: "per flat",
      },
      {
        label: "4-room HDB resale renovation",
        low: "35,000",
        high: "90,000",
        unit: "per flat",
      },
      {
        label: "5-room HDB resale renovation",
        low: "45,000",
        high: "120,000",
        unit: "per flat",
      },
      {
        label: "Condo renovation (standard)",
        low: "50,000",
        high: "150,000",
        unit: "per unit",
      },
      {
        label: "Condo renovation (premium)",
        low: "100,000",
        high: "300,000",
        unit: "per unit",
      },
      {
        label: "Landed property renovation",
        low: "80,000",
        high: "500,000",
        unit: "per house",
      },
      {
        label: "Kitchen renovation only",
        low: "8,000",
        high: "30,000",
        unit: "per kitchen",
      },
    ],
    factors: [
      "Property type and size — HDB flats are generally cheaper to renovate than condos or landed properties",
      "BTO vs resale — resale flats need more hacking and repair, adding SGD 5,000-15,000",
      "Scope of works — full renovation vs partial upgrades significantly affects cost",
      "Material and finish quality — laminate vs solid wood, quartz vs marble countertops",
      "Design complexity — custom built-ins, feature walls, and premium fixtures add to the budget",
    ],
    tips: [
      "Obtain your HDB renovation permit through the HDB e-services portal before any work begins — contractors cannot start without it",
      "For condo renovations, check your MCST bylaws for permitted work hours, deposit requirements, and restricted works before engaging a contractor",
      "Always set aside a 15-20% contingency budget for unexpected issues like hidden water damage, electrical problems, or structural defects in resale properties",
      "Engage only HDB-listed renovation contractors for HDB flats to ensure compliance with HDB renovation guidelines and to access the dispute resolution framework",
    ],
    faqs: [
      {
        q: "How much does it cost to renovate a 4-room HDB flat?",
        a: "A 4-room HDB BTO renovation costs SGD 25,000-65,000, while a resale flat renovation costs SGD 35,000-90,000. The higher resale cost accounts for hacking, re-piping, and repair of existing structures.",
      },
      {
        q: "How long does HDB renovation take?",
        a: "A typical HDB renovation takes 6-10 weeks from permit approval to handover. Complex renovations with custom carpentry may extend to 12 weeks. HDB permits renovation work only on weekdays 9am-6pm.",
      },
      {
        q: "Can I use my CPF for renovation?",
        a: "No. CPF funds cannot be used for renovation. However, you can apply for a renovation loan from HDB (up to SGD 30,000) or from banks. HDB loans are interest-free but must be repaid within 5 years.",
      },
      {
        q: "What should I renovate first in a resale HDB?",
        a: "Prioritise structural and functional works first: hacking, waterproofing, plumbing, and electrical rewiring. Then proceed to carpentry, flooring, and finally painting. This sequence prevents rework and damage to finished surfaces.",
      },
    ],
    avgLow: "30,000",
    avgHigh: "150,000",
    avgUnit: "per HDB flat",
    relatedSlugs: [
      "kitchen-remodel",
      "bathroom-remodel",
      "flooring",
      "painting",
    ],
  },
  {
    slug: "kitchen-remodel",
    name: "Kitchen Remodel",
    emoji: "🍳",
    headline: "Kitchen Remodel Cost in Singapore 2026",
    metaDesc:
      "How much does a kitchen remodel cost in {city}, Singapore? Compare 2026 prices from SGD 15,000-80,000 for HDB, condo, and landed kitchens.",
    intro:
      "Renovating your kitchen in {city}? The kitchen is often the most important room in a Singapore home and one of the most expensive to remodel. This guide covers 2026 kitchen renovation costs in {city} for all property types to help you plan effectively.",
    items: [
      {
        label: "HDB kitchen renovation (basic)",
        low: "8,000",
        high: "20,000",
        unit: "per kitchen",
      },
      {
        label: "HDB kitchen renovation (premium)",
        low: "20,000",
        high: "45,000",
        unit: "per kitchen",
      },
      {
        label: "Condo kitchen renovation",
        low: "25,000",
        high: "60,000",
        unit: "per kitchen",
      },
      {
        label: "Landed kitchen renovation",
        low: "30,000",
        high: "80,000",
        unit: "per kitchen",
      },
      {
        label: "Kitchen cabinetry (full set)",
        low: "5,000",
        high: "25,000",
        unit: "per set",
      },
      {
        label: "Countertop (quartz)",
        low: "80",
        high: "200",
        unit: "per ft",
      },
      {
        label: "Countertop (granite/marble)",
        low: "120",
        high: "350",
        unit: "per ft",
      },
      {
        label: "Kitchen backsplash tiling",
        low: "500",
        high: "2,000",
        unit: "per kitchen",
      },
    ],
    factors: [
      "Kitchen size and layout — L-shaped and U-shaped kitchens require more cabinetry",
      "Cabinet material — laminate is most affordable, solid wood and lacquer are premium",
      "Countertop material — quartz is the most popular mid-range option, marble is premium",
      "Appliance integration — built-in appliances require custom cabinetry fitting",
      "Wet vs dry kitchen — open-concept kitchens with both zones cost more to design and build",
    ],
    tips: [
      "For HDB kitchens, you cannot relocate the gas point without PUB approval — plan your layout around the existing gas supply location",
      "Choose materials rated for wet kitchen use — Singapore cooking styles generate significant heat and moisture that can damage unsuitable materials",
      "Ensure your kitchen renovation includes proper ventilation and exhaust ducting that meets BCA fire safety requirements, especially for gas hob installations",
    ],
    faqs: [
      {
        q: "How much does a basic kitchen renovation cost in Singapore?",
        a: "A basic HDB kitchen renovation costs SGD 8,000-20,000 including new cabinetry, countertop, backsplash, and sink. This covers standard laminate cabinets with a quartz countertop.",
      },
      {
        q: "How long does a kitchen renovation take?",
        a: "A kitchen renovation in Singapore takes 2-4 weeks. This includes hacking (if needed), plumbing and electrical works, waterproofing, tiling, cabinet installation, and countertop fitting.",
      },
      {
        q: "What countertop is most popular in Singapore?",
        a: "Quartz is the most popular countertop material in Singapore due to its durability, stain resistance, and consistent appearance. It costs SGD 80-200 per linear foot, offering good value for money.",
      },
      {
        q: "Can I convert to an open kitchen in my HDB flat?",
        a: "You can remove the kitchen wall in most HDB flats if it is non-structural. However, 3-room and smaller flats with the kitchen wall as a structural element cannot be opened up. Check with HDB before proceeding.",
      },
    ],
    avgLow: "15,000",
    avgHigh: "80,000",
    avgUnit: "per kitchen",
    relatedSlugs: ["renovation", "plumbing", "electrical"],
  },
  {
    slug: "bathroom-remodel",
    name: "Bathroom Remodel",
    emoji: "🚿",
    headline: "Bathroom Remodel Cost in Singapore 2026",
    metaDesc:
      "How much does a bathroom remodel cost in {city}, Singapore? Compare 2026 prices from SGD 8,000-35,000 for HDB, condo, and landed bathrooms.",
    intro:
      "Upgrading your bathroom in {city}? Bathroom renovation is one of the most common home improvement projects in Singapore. From basic re-tiling to luxury overhauls, this guide covers 2026 bathroom remodel costs in {city} to help you budget your project.",
    items: [
      {
        label: "HDB bathroom renovation (basic)",
        low: "5,000",
        high: "12,000",
        unit: "per bathroom",
      },
      {
        label: "HDB bathroom renovation (premium)",
        low: "12,000",
        high: "25,000",
        unit: "per bathroom",
      },
      {
        label: "Condo bathroom renovation",
        low: "15,000",
        high: "30,000",
        unit: "per bathroom",
      },
      {
        label: "Landed bathroom renovation",
        low: "18,000",
        high: "35,000",
        unit: "per bathroom",
      },
      {
        label: "Tile hacking and removal",
        low: "800",
        high: "2,000",
        unit: "per bathroom",
      },
      {
        label: "Waterproofing",
        low: "800",
        high: "2,000",
        unit: "per bathroom",
      },
      {
        label: "Sanitary ware (toilet + basin + shower)",
        low: "800",
        high: "5,000",
        unit: "per set",
      },
      {
        label: "Vanity cabinet and mirror",
        low: "500",
        high: "3,000",
        unit: "per set",
      },
    ],
    factors: [
      "Bathroom size — HDB bathrooms are typically 35-50 sqft, condos and landed can be much larger",
      "Scope of works — re-tiling only vs full overhaul including layout changes",
      "Sanitary ware quality — standard brands vs premium brands like Duravit or TOTO Washlet",
      "Whether plumbing relocation is needed (adds SGD 500-2,000)",
      "Special features — rain shower, heated towel rail, smart toilet, underfloor heating",
    ],
    tips: [
      "Waterproofing is mandatory when hacking HDB bathroom floors — ensure your contractor includes this and conducts a ponding test before tiling",
      "Consider the total bathroom cost holistically: hacking + waterproofing + plumbing + tiling + sanitary ware + vanity — getting these from one contractor often saves money",
      "Choose slip-resistant tiles rated R10 or above for bathroom floors to comply with BCA safety recommendations and reduce fall risk",
      "If your HDB flat is older than 20 years, budget for re-piping as existing pipes may be corroded — this is cheaper to do during a bathroom renovation than as a standalone job",
    ],
    faqs: [
      {
        q: "How much does it cost to renovate an HDB bathroom?",
        a: "A basic HDB bathroom renovation costs SGD 5,000-12,000 including hacking, waterproofing, re-tiling, new toilet, basin, and shower set. Premium renovations with high-end fittings range from SGD 12,000-25,000.",
      },
      {
        q: "How long does a bathroom renovation take?",
        a: "A standard HDB bathroom renovation takes 7-14 days. This includes 1-2 days for hacking, 2 days for waterproofing and curing, 2-3 days for tiling, and 1-2 days for plumbing fixture installation.",
      },
      {
        q: "Can I relocate my bathroom in an HDB flat?",
        a: "No. HDB does not allow bathroom relocation as it involves moving sanitary pipes and waste stacks that serve the entire block. You can only renovate within the existing bathroom footprint.",
      },
      {
        q: "Is it worth upgrading to a smart toilet?",
        a: "Smart toilets (bidet seats) from brands like TOTO Washlet cost SGD 800-3,000 and offer hygiene benefits, heated seats, and water savings. They are increasingly popular in Singapore and add value to your home.",
      },
    ],
    avgLow: "8,000",
    avgHigh: "35,000",
    avgUnit: "per bathroom",
    relatedSlugs: ["waterproofing", "plumbing", "renovation"],
  },
  {
    slug: "landscaping",
    name: "Landscaping",
    emoji: "🌿",
    headline: "Landscaping Cost in Singapore 2026",
    metaDesc:
      "How much does landscaping cost in {city}, Singapore? Compare 2026 prices from SGD 20-60/sqft for garden design, planting, and hardscaping.",
    intro:
      "Transforming your outdoor space in {city}? Singapore's tropical climate offers wonderful opportunities for lush gardens and functional outdoor living areas. This guide covers 2026 landscaping costs in {city} for landed properties, condo balconies, and rooftop gardens.",
    items: [
      {
        label: "Garden design and consultation",
        low: "500",
        high: "3,000",
        unit: "per project",
      },
      {
        label: "Soft landscaping (planting)",
        low: "10",
        high: "30",
        unit: "per sqft",
      },
      {
        label: "Hardscaping (paving/decking)",
        low: "20",
        high: "60",
        unit: "per sqft",
      },
      {
        label: "Irrigation system installation",
        low: "1,000",
        high: "5,000",
        unit: "per garden",
      },
      {
        label: "Timber decking",
        low: "15",
        high: "45",
        unit: "per sqft",
      },
      {
        label: "Balcony garden setup",
        low: "1,000",
        high: "5,000",
        unit: "per balcony",
      },
      {
        label: "Tree planting (per tree)",
        low: "200",
        high: "2,000",
        unit: "per tree",
      },
      {
        label: "Monthly garden maintenance",
        low: "200",
        high: "800",
        unit: "per month",
      },
    ],
    factors: [
      "Garden area size in square feet",
      "Proportion of soft landscaping (plants) vs hardscaping (paving, structures)",
      "Plant species selection — mature specimen trees cost significantly more",
      "Drainage and irrigation requirements",
      "Access difficulty — rooftop gardens require material transport via crane or lift",
    ],
    tips: [
      "Check NParks guidelines before planting large trees near your property boundary — some species may affect neighbouring properties and require approval",
      "For landed properties, ensure your landscaping does not obstruct natural drainage or redirect water towards neighbouring lots, as this may violate URA drainage regulations",
      "Choose native or climate-adapted tropical plants that thrive in Singapore's conditions to reduce maintenance and water requirements",
    ],
    faqs: [
      {
        q: "How much does garden landscaping cost in Singapore?",
        a: "Full garden landscaping for a landed property in Singapore costs SGD 10,000-50,000 depending on size and complexity. Soft landscaping alone costs SGD 10-30/sqft while hardscaping ranges from SGD 20-60/sqft.",
      },
      {
        q: "Do I need approval for landscaping in Singapore?",
        a: "Soft landscaping generally does not require approval. However, hardscaping that affects drainage, structures over 1.5m high, or works near conservation trees may need URA or NParks approval.",
      },
      {
        q: "What is the best low-maintenance garden for Singapore?",
        a: "A combination of hardy tropical shrubs (ixora, heliconia), ground cover (pearl grass, cow grass), and a simple automated irrigation system provides a lush look with minimal upkeep.",
      },
      {
        q: "How often should I maintain my garden in Singapore?",
        a: "Weekly or bi-weekly maintenance is ideal in Singapore's tropical climate where plants grow rapidly. Monthly maintenance is the minimum to keep a garden looking presentable.",
      },
    ],
    avgLow: "20",
    avgHigh: "60",
    avgUnit: "per sqft",
    relatedSlugs: ["general-construction", "waterproofing", "painting"],
  },
  {
    slug: "pest-control",
    name: "Pest Control",
    emoji: "🐛",
    headline: "Pest Control Cost in Singapore 2026",
    metaDesc:
      "How much does pest control cost in {city}, Singapore? Compare 2026 prices from SGD 150-500 per treatment for homes and commercial spaces.",
    intro:
      "Dealing with pests in {city}? Singapore's warm, humid climate makes pest control essential for every property. From termites and cockroaches to bed bugs and rodents, this guide covers 2026 pest control costs in {city} to help you protect your home or business.",
    items: [
      {
        label: "General pest treatment (cockroaches, ants)",
        low: "80",
        high: "200",
        unit: "per treatment",
      },
      {
        label: "Termite inspection",
        low: "150",
        high: "400",
        unit: "per inspection",
      },
      {
        label: "Termite treatment (baiting system)",
        low: "1,500",
        high: "5,000",
        unit: "per property",
      },
      {
        label: "Termite treatment (soil treatment)",
        low: "2,000",
        high: "8,000",
        unit: "per property",
      },
      {
        label: "Bed bug treatment",
        low: "300",
        high: "800",
        unit: "per room",
      },
      {
        label: "Rodent management programme",
        low: "200",
        high: "500",
        unit: "per visit",
      },
      {
        label: "Mosquito fogging",
        low: "150",
        high: "400",
        unit: "per session",
      },
      {
        label: "Quarterly pest maintenance plan",
        low: "200",
        high: "500",
        unit: "per quarter",
      },
    ],
    factors: [
      "Type of pest — termite treatments are significantly more expensive than general pest control",
      "Property size — larger homes and commercial spaces require more product and time",
      "Severity of infestation — severe cases may need multiple treatment sessions",
      "Treatment method — gel baits and traps are cheaper than fumigation or soil treatment",
      "Frequency — one-off treatments cost more per visit than contract-based maintenance plans",
    ],
    tips: [
      "Always engage NEA-licensed pest control operators — they are trained in safe chemical handling and comply with Singapore's environmental regulations",
      "For new properties or post-renovation, consider pre-emptive termite treatment — installing barriers during construction is far cheaper than treating an active infestation later",
      "Sign up for quarterly pest maintenance plans rather than one-off treatments — they are more cost-effective and prevent infestations before they start",
      "Keep documentation of pest treatments for your property — some termite warranties require regular maintenance to remain valid",
    ],
    faqs: [
      {
        q: "How much does pest control cost in Singapore?",
        a: "Basic pest control for cockroaches and ants costs SGD 80-200 per treatment. Termite treatment ranges from SGD 1,500-8,000 depending on the method. Quarterly maintenance plans cost SGD 200-500 per quarter.",
      },
      {
        q: "How often should I do pest control in Singapore?",
        a: "Quarterly treatments are recommended for preventive maintenance. Properties with recurring issues or those in pest-prone areas of Singapore may benefit from monthly visits.",
      },
      {
        q: "Are pest control chemicals safe?",
        a: "NEA-licensed operators use approved, low-toxicity products. Modern treatments like gel baits and targeted sprays minimise chemical exposure. Technicians advise on safety precautions and re-entry times.",
      },
      {
        q: "How do I know if I have termites?",
        a: "Signs include mud trails on walls or furniture, hollow-sounding wood, discarded wings near windows, and small holes in wood surfaces. A professional inspection using thermal imaging can confirm termite presence.",
      },
    ],
    avgLow: "150",
    avgHigh: "500",
    avgUnit: "per treatment",
    relatedSlugs: ["general-construction", "renovation", "waterproofing"],
  },
];
