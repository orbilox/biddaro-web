// ─── Construction Cost Guide Data for UAE ─────────────────────────────────────
// Powers /uae/cost/[service] and /uae/cost/[service]/[city] pages
// All prices in AED (United Arab Emirates Dirham)

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

export function getUAECostService(slug: string): CostServiceMeta | undefined {
  return UAE_COST_SERVICES.find(s => s.slug === slug);
}

export function getRelatedUAECostServices(slug: string): CostServiceMeta[] {
  const svc = getUAECostService(slug);
  if (!svc) return [];
  return svc.relatedSlugs.map(s => getUAECostService(s)).filter(Boolean) as CostServiceMeta[];
}

export const UAE_COST_SERVICES: CostServiceMeta[] = [
  {
    slug: 'general-construction',
    name: 'Villa & House Construction',
    emoji: '🏗️',
    headline: 'Villa Construction Cost in UAE 2026',
    metaDesc: 'Get accurate villa and house construction costs in {city}, UAE. Compare rates per sqft for standard, premium, and luxury builds from verified contractors on Biddaro.',
    intro: 'Building a villa in {city} is a significant investment. Construction costs vary based on design complexity, finishing quality, and compliance with UAE green building standards like Estidama and Al Safat.',
    avgLow: 'AED 800', avgHigh: 'AED 2,500', avgUnit: 'per sq ft',
    items: [
      { label: 'Budget Construction (Standard Finish)', low: 'AED 800', high: 'AED 1,200', unit: 'per sq ft' },
      { label: 'Standard Villa Construction', low: 'AED 1,200', high: 'AED 1,800', unit: 'per sq ft' },
      { label: 'Premium Villa Construction', low: 'AED 1,800', high: 'AED 2,500', unit: 'per sq ft' },
      { label: 'Luxury / Custom Villa', low: 'AED 2,500', high: 'AED 5,000', unit: 'per sq ft' },
      { label: 'Foundation (Raft/Pile)', low: 'AED 150', high: 'AED 350', unit: 'per sq ft' },
      { label: 'Block Work & Masonry', low: 'AED 40', high: 'AED 80', unit: 'per sq m' },
      { label: 'Plastering (Internal)', low: 'AED 20', high: 'AED 45', unit: 'per sq m' },
      { label: 'MEP (Mechanical/Electrical/Plumbing)', low: 'AED 200', high: 'AED 500', unit: 'per sq ft' },
    ],
    factors: [
      'Plot location and soil conditions in {city}',
      'Number of floors (G+1, G+2, basement)',
      'Quality of finishes — imported marble vs local tiles',
      'Green building compliance (Estidama/Al Safat rating)',
      'Municipality permit fees and consultant costs in {city}',
      'MEP complexity — central AC, smart home, solar panels',
      'Landscaping and swimming pool requirements',
    ],
    tips: [
      'Get at least 3 quotes from verified contractors on Biddaro before committing',
      'Build during cooler months (Oct–Mar) when productivity is 20–30% higher',
      'Use locally manufactured materials (RAK Ceramics, National Cement) to reduce costs',
      'Avoid design changes after construction begins — change orders spike costs 25–40%',
      'Invest in proper insulation upfront — saves 30–40% on annual DEWA cooling bills',
    ],
    faqs: [
      { q: 'How much does it cost to build a 3-bedroom villa in {city}?', a: 'A standard 3-bedroom villa (2,500 sqft) in {city} costs AED 2M–4.5M depending on finishing quality. Budget builds start at AED 800/sqft while luxury custom villas exceed AED 2,500/sqft.' },
      { q: 'How long does villa construction take in {city}?', a: 'A standard villa in {city} takes 12–18 months from foundation to handover. Add 3–6 months for design, permits, and approvals. Summer heat slows exterior work by 15–20%.' },
      { q: 'What permits are needed for construction in {city}?', a: 'In {city}, you need: municipality building permit, Civil Defense NOC, DEWA connection approval, structural/architectural consultant approval, and soil investigation report.' },
      { q: 'Is it cheaper to buy or build a villa in {city}?', a: 'Building in {city} is often 15–25% cheaper than buying an equivalent ready villa, but requires 12–24 months. Building gives you full control over design, materials, and layout customization.' },
    ],
    relatedSlugs: ['plumbing', 'electrical', 'hvac', 'painting'],
  },
  {
    slug: 'plumbing',
    name: 'Plumbing',
    emoji: '🔧',
    headline: 'Plumbing Cost & Rates in UAE 2026',
    metaDesc: 'Plumbing rates and cost guide for {city}, UAE. Find how much plumbers charge per hour and for bathroom, kitchen, and pipeline installation in AED.',
    intro: 'Plumbing costs in {city} depend on the scope — from tap repairs to full villa plumbing. All plumbing work must comply with DEWA and local municipality standards.',
    avgLow: 'AED 100', avgHigh: 'AED 300', avgUnit: 'per hour',
    items: [
      { label: 'Plumber Labour (per hour)', low: 'AED 100', high: 'AED 300', unit: 'per hour' },
      { label: 'Bathroom Plumbing (complete)', low: 'AED 5,000', high: 'AED 15,000', unit: 'per bathroom' },
      { label: 'Kitchen Plumbing (complete)', low: 'AED 3,000', high: 'AED 10,000', unit: 'per kitchen' },
      { label: 'PPR Pipe Installation', low: 'AED 30', high: 'AED 60', unit: 'per running ft' },
      { label: 'uPVC Drainage Pipe', low: 'AED 25', high: 'AED 50', unit: 'per running ft' },
      { label: 'Water Heater Installation', low: 'AED 1,000', high: 'AED 3,500', unit: 'per unit' },
      { label: 'Tap / Faucet Replacement', low: 'AED 200', high: 'AED 800', unit: 'per tap' },
      { label: 'Emergency Leak Repair', low: 'AED 300', high: 'AED 1,500', unit: 'per visit' },
    ],
    factors: [
      'Type of pipes (PPR, uPVC, CPVC, PEX)',
      'Number of bathrooms and floors',
      'New installation vs repair work',
      'Local plumber rates in {city}',
      'Concealed vs exposed pipe routing',
      'DEWA compliance and inspection requirements',
    ],
    tips: [
      'Use PPR pipes for hot/cold water — they last 50+ years and handle UAE heat better',
      'Get DEWA-approved contractors for new connections to avoid permit issues',
      'Install water-saving fixtures to reduce DEWA bills — saves 20–30% on consumption',
      'Schedule plumbing during fit-out stage to avoid costly wall breaking later',
    ],
    faqs: [
      { q: 'How much does a plumber charge per hour in {city}?', a: 'Plumbers in {city} charge AED 100–300 per hour. Emergency and after-hours calls cost AED 300–500. Rates are higher in Dubai and Abu Dhabi compared to northern emirates.' },
      { q: 'How much does full villa plumbing cost in {city}?', a: 'Complete plumbing for a 3-bedroom villa in {city} costs AED 25,000–60,000 including all pipes, fixtures, and connections. This covers 3–4 bathrooms, kitchen, and outdoor taps.' },
      { q: 'Do plumbers need a license in {city}?', a: 'Yes, plumbing contractors in {city} must have a valid trade license and DEWA/SEWA approval. Using unlicensed plumbers voids warranties and may cause issues with building inspections.' },
      { q: 'What is the best time to do plumbing work in {city}?', a: 'In {city}, schedule major plumbing during the cooler months (Oct–Mar). Summer heat makes outdoor work difficult, and some municipalities restrict noisy construction during Ramadan.' },
    ],
    relatedSlugs: ['general-construction', 'waterproofing', 'bathroom-renovation'],
  },
  {
    slug: 'electrical',
    name: 'Electrical',
    emoji: '⚡',
    headline: 'Electrical Work Cost & Rates in UAE 2026',
    metaDesc: 'Electrical work rates in {city}, UAE. Find costs for wiring, panel upgrades, lighting, and EV charger installation from DEWA-approved electricians.',
    intro: 'Electrical work in {city} must be carried out by DEWA-approved contractors. Costs depend on the scope — from minor repairs to full villa electrical fit-outs with smart home systems.',
    avgLow: 'AED 100', avgHigh: 'AED 350', avgUnit: 'per hour',
    items: [
      { label: 'Electrician Labour (per hour)', low: 'AED 100', high: 'AED 350', unit: 'per hour' },
      { label: 'Full Villa Electrical Fit-out', low: 'AED 25,000', high: 'AED 60,000', unit: 'per villa' },
      { label: 'Apartment Rewiring', low: 'AED 8,000', high: 'AED 20,000', unit: 'per apartment' },
      { label: 'DB Panel Upgrade', low: 'AED 2,000', high: 'AED 6,000', unit: 'per panel' },
      { label: 'Light Fixture Installation', low: 'AED 100', high: 'AED 500', unit: 'per fixture' },
      { label: 'EV Charger Installation', low: 'AED 3,000', high: 'AED 8,000', unit: 'per charger' },
      { label: 'Smart Home Wiring', low: 'AED 10,000', high: 'AED 35,000', unit: 'per villa' },
      { label: 'Emergency Electrical Repair', low: 'AED 300', high: 'AED 1,000', unit: 'per visit' },
    ],
    factors: [
      'Scope of work — repair vs new installation',
      'DEWA load requirements and meter upgrade',
      'Smart home and automation complexity',
      'Number of circuits and outlets required',
      'Cable routing — concealed vs surface mounted',
      'Civil Defense fire alarm integration in {city}',
    ],
    tips: [
      'Always use DEWA-approved contractors — unapproved work can result in disconnection',
      'Plan electrical layout carefully before construction to avoid costly changes later',
      'Invest in LED lighting throughout — reduces DEWA bills by 40–60% vs halogen',
      'Install surge protectors for all major appliances — UAE power fluctuations can damage electronics',
    ],
    faqs: [
      { q: 'How much does an electrician cost in {city}?', a: 'Electricians in {city} charge AED 100–350 per hour. Basic repairs start at AED 200, while full apartment rewiring costs AED 8,000–20,000. DEWA-approved contractors may charge premium rates.' },
      { q: 'Do I need DEWA approval for electrical work in {city}?', a: 'Yes, all electrical modifications in {city} require DEWA approval. A licensed contractor must submit drawings and obtain a NOC before work begins. Inspections are required upon completion.' },
      { q: 'How much does EV charger installation cost in {city}?', a: 'EV charger installation in {city} costs AED 3,000–8,000 including the unit, wiring, and DEWA connection. Most villa owners choose 7–22kW wall-mounted chargers.' },
      { q: 'What is the cost of smart home wiring in {city}?', a: 'Smart home wiring for a villa in {city} costs AED 10,000–35,000 covering lighting control, motorized curtains, AC integration, and security. KNX and Lutron are popular systems in UAE villas.' },
    ],
    relatedSlugs: ['general-construction', 'hvac', 'smart-home'],
  },
  {
    slug: 'hvac',
    name: 'HVAC & Air Conditioning',
    emoji: '❄️',
    headline: 'AC & HVAC Cost in UAE 2026',
    metaDesc: 'Air conditioning installation and repair costs in {city}, UAE. Compare AC unit prices, duct cleaning rates, and chiller maintenance costs in AED.',
    intro: 'Air conditioning is essential in {city} where summer temperatures exceed 50°C. HVAC costs vary based on system type, building size, and whether it is a new installation or repair.',
    avgLow: 'AED 150', avgHigh: 'AED 500', avgUnit: 'per hour',
    items: [
      { label: 'Split AC Installation (per unit)', low: 'AED 1,500', high: 'AED 3,500', unit: 'per unit' },
      { label: 'Central AC System (Villa)', low: 'AED 25,000', high: 'AED 80,000', unit: 'per villa' },
      { label: 'Duct Cleaning (Apartment)', low: 'AED 800', high: 'AED 2,500', unit: 'per apartment' },
      { label: 'Duct Cleaning (Villa)', low: 'AED 2,000', high: 'AED 6,000', unit: 'per villa' },
      { label: 'AC Servicing / Maintenance', low: 'AED 200', high: 'AED 500', unit: 'per unit' },
      { label: 'Chiller Maintenance', low: 'AED 1,000', high: 'AED 5,000', unit: 'per service' },
      { label: 'AC Gas Top-up (Refrigerant)', low: 'AED 200', high: 'AED 600', unit: 'per unit' },
      { label: 'VRF System Installation', low: 'AED 50,000', high: 'AED 150,000', unit: 'per system' },
    ],
    factors: [
      'Type of AC system — split, central, VRF, or chiller',
      'Building size and number of indoor units',
      'Brand choice — O General, Daikin, Carrier, Gree',
      'Duct condition and insulation quality',
      'DEWA tariff zone and cooling efficiency rating',
      'Maintenance frequency in {city} dusty environment',
    ],
    tips: [
      'Service AC units every 3 months in UAE — dust and heat reduce efficiency by 20–30%',
      'Choose inverter AC units — they save 30–50% on DEWA electricity bills vs non-inverter',
      'Pre-summer servicing (March) prevents breakdowns during peak cooling months (June–Sept)',
      'Clean or replace AC filters monthly during summer — blocked filters increase energy use by 15%',
      'Consider annual maintenance contracts (AMC) — they cost AED 150–300/unit/year and prevent expensive breakdowns',
    ],
    faqs: [
      { q: 'How much does split AC installation cost in {city}?', a: 'Split AC installation in {city} costs AED 1,500–3,500 per unit including outdoor unit mounting, piping, and electrical connection. 2-ton units for UAE heat are recommended for standard rooms.' },
      { q: 'How much does central AC cost for a villa in {city}?', a: 'Central AC system for a 3-bedroom villa in {city} costs AED 25,000–80,000 depending on brand and tonnage. Ductwork adds AED 10,000–25,000. Daikin and Carrier are top choices for UAE villas.' },
      { q: 'How often should AC be serviced in {city}?', a: 'In {city}, AC should be serviced every 3–4 months due to extreme dust and heat. Pre-summer deep cleaning in March is essential. Annual maintenance contracts save 20–30% vs on-demand servicing.' },
      { q: 'Which AC brand is best for UAE?', a: 'In {city}, O General is the most popular for its reliability in 50°C+ heat. Daikin, Carrier, and Mitsubishi are also excellent. For VRF commercial systems, Daikin and Mitsubishi lead the market.' },
    ],
    relatedSlugs: ['electrical', 'insulation', 'general-construction'],
  },
  {
    slug: 'painting',
    name: 'Painting',
    emoji: '🎨',
    headline: 'Painting Cost & Rates in UAE 2026',
    metaDesc: 'Interior and exterior painting costs in {city}, UAE. Compare painter rates per sqft and total painting costs for apartments and villas in AED.',
    intro: 'Professional painting in {city} requires UV-resistant and dust-proof paints suited for the harsh UAE climate. Costs depend on surface area, paint quality, and surface preparation needed.',
    avgLow: 'AED 8', avgHigh: 'AED 25', avgUnit: 'per sq ft',
    items: [
      { label: 'Interior Painting (Standard)', low: 'AED 8', high: 'AED 15', unit: 'per sq ft' },
      { label: 'Interior Painting (Premium)', low: 'AED 15', high: 'AED 25', unit: 'per sq ft' },
      { label: 'Exterior Painting', low: 'AED 12', high: 'AED 30', unit: 'per sq ft' },
      { label: '2-Bedroom Apartment (Full)', low: 'AED 3,000', high: 'AED 7,000', unit: 'total' },
      { label: '3-Bedroom Villa (Full)', low: 'AED 8,000', high: 'AED 20,000', unit: 'total' },
      { label: 'Texture / Feature Wall', low: 'AED 20', high: 'AED 60', unit: 'per sq ft' },
      { label: 'Epoxy Floor Coating', low: 'AED 20', high: 'AED 45', unit: 'per sq ft' },
    ],
    factors: [
      'Paint quality — budget emulsion vs premium brands (Jotun, Dulux)',
      'Surface area and ceiling height',
      'Surface preparation — crack filling, sanding, priming',
      'Interior vs exterior (exterior requires UV-resistant paint)',
      'Number of coats required (2 minimum for UAE)',
      'Special finishes — texture, metallic, wallpaper in {city}',
    ],
    tips: [
      'Use Jotun or Dulux Weathershield for exteriors — they withstand 50°C+ and UV damage',
      'Always apply 2+ coats with quality primer for lasting results in UAE climate',
      'Paint exteriors during cooler months (Oct–Feb) — heat causes paint to dry too quickly',
      'Choose light exterior colors — they reflect heat and reduce DEWA cooling costs by 5–10%',
    ],
    faqs: [
      { q: 'How much does painting a 2-bed apartment cost in {city}?', a: 'Painting a 2-bedroom apartment in {city} costs AED 3,000–7,000 for standard emulsion. Premium paints (Jotun Majestic, Dulux Velvet Touch) add 30–40% to the cost.' },
      { q: 'How much do painters charge per sqft in {city}?', a: 'Painters in {city} charge AED 8–25 per sqft for interior walls. Exterior painting costs AED 12–30/sqft. Textured and specialty finishes cost AED 20–60/sqft.' },
      { q: 'What paint brand is best for UAE?', a: 'In {city}, Jotun (Norwegian brand, huge UAE presence) is most popular. Dulux, National Paints (local UAE brand), and Caparol are also excellent. For exteriors, Jotun Jotashield is the top choice.' },
      { q: 'How long does exterior paint last in the UAE?', a: 'Quality exterior paint in {city} lasts 5–7 years. The intense UAE sun, sandstorms, and humidity reduce lifespan compared to moderate climates. Use elastomeric paint for best durability.' },
    ],
    relatedSlugs: ['renovation', 'drywall', 'waterproofing'],
  },
  {
    slug: 'flooring',
    name: 'Flooring',
    emoji: '🏠',
    headline: 'Flooring Cost & Installation in UAE 2026',
    metaDesc: 'Flooring installation costs in {city}, UAE. Compare marble, porcelain, vinyl, and hardwood flooring prices per sqft from verified installers.',
    intro: 'Flooring in {city} ranges from affordable vinyl to luxury marble. The UAE climate demands materials that handle temperature fluctuations and offer cool underfoot comfort.',
    avgLow: 'AED 30', avgHigh: 'AED 200', avgUnit: 'per sq ft',
    items: [
      { label: 'Porcelain Tiles (Material + Install)', low: 'AED 30', high: 'AED 120', unit: 'per sq ft' },
      { label: 'Marble Flooring', low: 'AED 80', high: 'AED 350', unit: 'per sq ft' },
      { label: 'Engineered Hardwood', low: 'AED 40', high: 'AED 120', unit: 'per sq ft' },
      { label: 'Luxury Vinyl Plank (LVP)', low: 'AED 15', high: 'AED 45', unit: 'per sq ft' },
      { label: 'Epoxy Flooring', low: 'AED 20', high: 'AED 50', unit: 'per sq ft' },
      { label: 'Natural Stone (Travertine)', low: 'AED 60', high: 'AED 200', unit: 'per sq ft' },
      { label: 'Outdoor Decking (Composite)', low: 'AED 40', high: 'AED 100', unit: 'per sq ft' },
    ],
    factors: [
      'Material choice — marble vs porcelain vs vinyl',
      'Area size and layout complexity',
      'Subfloor preparation and leveling needed',
      'Indoor vs outdoor installation',
      'Pattern complexity — herringbone, chevron, large format',
      'Brand and origin — local vs imported materials in {city}',
    ],
    tips: [
      'Porcelain tiles are the best value for UAE — cool, durable, and 50% cheaper than marble',
      'Avoid solid hardwood — UAE humidity causes warping. Use engineered wood instead',
      'RAK Ceramics (UAE brand) offers excellent quality at competitive prices',
      'For outdoor areas, choose anti-slip tiles rated R11+ and light colors to reduce heat absorption',
    ],
    faqs: [
      { q: 'How much does marble flooring cost in {city}?', a: 'Marble flooring in {city} costs AED 80–350 per sqft installed. Italian Carrara marble costs AED 200+/sqft. Local and Turkish marble options start at AED 80/sqft with good quality.' },
      { q: 'What flooring is best for UAE villas?', a: 'In {city}, porcelain tiles and marble are most popular for living areas due to cooling properties. Engineered wood suits bedrooms. Vinyl plank is great for apartments and commercial spaces.' },
      { q: 'How much does vinyl flooring cost in {city}?', a: 'Luxury vinyl plank (LVP) in {city} costs AED 15–45/sqft installed. It is waterproof, scratch-resistant, and much more affordable than marble. Popular for apartments and rentals.' },
      { q: 'Where to buy tiles in {city}?', a: 'In {city}, popular sources include RAK Ceramics, Porcelanosa, Hafary, The One, and Dragon Mart. RAK Ceramics is UAE-made and offers the best value. Dragon Mart has the widest variety at budget prices.' },
    ],
    relatedSlugs: ['tiling', 'renovation', 'general-construction'],
  },
  {
    slug: 'waterproofing',
    name: 'Waterproofing',
    emoji: '💧',
    headline: 'Waterproofing Cost in UAE 2026',
    metaDesc: 'Waterproofing costs for roofs, bathrooms, and basements in {city}, UAE. Compare membrane types and contractor rates in AED.',
    intro: 'Waterproofing in {city} is critical despite the arid climate. Flash floods, humidity, and AC condensation cause significant water damage. UAE building codes mandate waterproofing for all new construction.',
    avgLow: 'AED 15', avgHigh: 'AED 60', avgUnit: 'per sq ft',
    items: [
      { label: 'Roof Waterproofing (Bituminous)', low: 'AED 15', high: 'AED 25', unit: 'per sq ft' },
      { label: 'Roof Waterproofing (PU Liquid)', low: 'AED 30', high: 'AED 60', unit: 'per sq ft' },
      { label: 'Bathroom Waterproofing', low: 'AED 2,000', high: 'AED 5,000', unit: 'per bathroom' },
      { label: 'Basement Tanking', low: 'AED 25', high: 'AED 50', unit: 'per sq ft' },
      { label: 'Swimming Pool Waterproofing', low: 'AED 20', high: 'AED 45', unit: 'per sq ft' },
      { label: 'Injection Waterproofing (Crack Repair)', low: 'AED 500', high: 'AED 2,000', unit: 'per crack' },
      { label: 'Terrace / Balcony Waterproofing', low: 'AED 15', high: 'AED 40', unit: 'per sq ft' },
    ],
    factors: [
      'Type of membrane — bituminous, PU liquid, cementitious',
      'Area size and accessibility',
      'Existing damage and preparation needed',
      'Warranty requirements',
      'UV exposure level (roofs vs basements)',
      'Compliance with UAE building code requirements in {city}',
    ],
    tips: [
      'Inspect roofs annually after summer — extreme UV degrades membranes faster in UAE',
      'Use Sika or BASF MasterSeal products — they are proven in UAE extreme heat conditions',
      'Never skip bathroom waterproofing — it is the #1 cause of villa maintenance complaints in UAE',
      'Re-waterproof roofs every 5–7 years as preventive maintenance',
    ],
    faqs: [
      { q: 'How much does roof waterproofing cost in {city}?', a: 'Roof waterproofing in {city} costs AED 15–60/sqft. Torch-applied bitumen membranes cost AED 15–25/sqft. Polyurethane liquid coatings cost AED 30–60/sqft but offer superior flexibility.' },
      { q: 'Is waterproofing necessary in UAE?', a: 'Yes, waterproofing in {city} is mandatory under UAE building codes. Despite low rainfall, flash floods, high humidity, and AC condensation cause major water damage without proper protection.' },
      { q: 'How long does waterproofing last in {city}?', a: 'Quality waterproofing in {city} lasts 5–10 years depending on material and UV exposure. Roofs need re-waterproofing every 5–7 years. Basement waterproofing lasts 15–20 years.' },
      { q: 'What is the best waterproofing brand for UAE?', a: 'In {city}, Sika, BASF MasterSeal, and Fosroc are the leading brands. All are tested for UAE extreme heat conditions. Always verify that products meet Dubai/Abu Dhabi municipality standards.' },
    ],
    relatedSlugs: ['roofing', 'general-construction', 'swimming-pool'],
  },
  {
    slug: 'renovation',
    name: 'Renovation & Fit-out',
    emoji: '🔨',
    headline: 'Renovation & Fit-out Cost in UAE 2026',
    metaDesc: 'Villa and apartment renovation costs in {city}, UAE. Compare fit-out rates, kitchen remodel prices, and bathroom renovation costs in AED.',
    intro: 'Renovation in {city} is a popular alternative to buying new. Whether it is an apartment fit-out or a complete villa makeover, costs depend on scope, finishes, and municipality requirements.',
    avgLow: 'AED 400', avgHigh: 'AED 1,500', avgUnit: 'per sq ft',
    items: [
      { label: 'Apartment Renovation (Budget)', low: 'AED 400', high: 'AED 700', unit: 'per sq ft' },
      { label: 'Apartment Renovation (Premium)', low: 'AED 700', high: 'AED 1,500', unit: 'per sq ft' },
      { label: 'Villa Renovation (Standard)', low: 'AED 500', high: 'AED 1,000', unit: 'per sq ft' },
      { label: 'Kitchen Renovation', low: 'AED 20,000', high: 'AED 80,000', unit: 'per kitchen' },
      { label: 'Bathroom Renovation', low: 'AED 10,000', high: 'AED 35,000', unit: 'per bathroom' },
      { label: 'Office Fit-out (Basic)', low: 'AED 80', high: 'AED 200', unit: 'per sq ft' },
      { label: 'Office Fit-out (Premium)', low: 'AED 200', high: 'AED 500', unit: 'per sq ft' },
    ],
    factors: [
      'Scope — cosmetic refresh vs structural changes',
      'Quality of finishes — budget vs luxury materials',
      'Number of rooms/bathrooms being renovated',
      'Municipality and building management NOC requirements',
      'Structural modifications requiring engineer approval',
      'Timeframe urgency and material lead times in {city}',
    ],
    tips: [
      'Get building management NOC before starting — unlicensed renovation risks fines and restoration costs',
      'Source materials from Dragon Mart and local suppliers for 20–40% savings vs designer showrooms',
      'Plan the full scope before starting — mid-project scope changes add 30–50% to budget',
      'Schedule renovation during summer — contractors are less busy and may offer 10–15% discounts',
    ],
    faqs: [
      { q: 'How much does apartment renovation cost in {city}?', a: 'Apartment renovation in {city} costs AED 400–1,500/sqft. A standard 2-bed apartment (1,000 sqft) renovation ranges from AED 80,000–200,000 depending on finishes and scope.' },
      { q: 'Do I need a permit for renovation in {city}?', a: 'Yes, in {city} you need a building management NOC and municipality permit for structural changes. Cosmetic work (painting, flooring) usually needs only building management consent.' },
      { q: 'How long does apartment renovation take in {city}?', a: 'Standard apartment renovation in {city} takes 6–12 weeks. Kitchen-only renovation takes 3–6 weeks. Villa renovation can take 3–6 months for complete makeovers.' },
      { q: 'What is the cheapest way to renovate in {city}?', a: 'In {city}, focus on high-impact low-cost changes: fresh paint (AED 3,000–7,000), vinyl flooring (AED 15/sqft), and updated light fixtures. Avoid moving plumbing/walls — structural changes are the most expensive.' },
    ],
    relatedSlugs: ['painting', 'flooring', 'carpentry', 'electrical'],
  },
  {
    slug: 'swimming-pool',
    name: 'Swimming Pool',
    emoji: '🏊',
    headline: 'Swimming Pool Construction Cost in UAE 2026',
    metaDesc: 'Swimming pool construction and maintenance costs in {city}, UAE. Compare pool sizes, types, and contractor rates in AED.',
    intro: 'Swimming pools are a lifestyle essential in {city} where summer temperatures exceed 45°C. Pool costs depend on size, type (concrete, fiberglass), and features like infinity edges and chillers.',
    avgLow: 'AED 80,000', avgHigh: 'AED 300,000', avgUnit: 'per pool',
    items: [
      { label: 'Standard Pool (25–40 sqm)', low: 'AED 80,000', high: 'AED 200,000', unit: 'per pool' },
      { label: 'Large Pool (40–60 sqm)', low: 'AED 200,000', high: 'AED 400,000', unit: 'per pool' },
      { label: 'Infinity Pool', low: 'AED 250,000', high: 'AED 600,000', unit: 'per pool' },
      { label: 'Fiberglass Pool', low: 'AED 40,000', high: 'AED 120,000', unit: 'per pool' },
      { label: 'Pool Chiller System', low: 'AED 15,000', high: 'AED 40,000', unit: 'per system' },
      { label: 'Monthly Maintenance', low: 'AED 500', high: 'AED 1,500', unit: 'per month' },
      { label: 'Pool Renovation / Retiling', low: 'AED 30,000', high: 'AED 100,000', unit: 'per pool' },
    ],
    factors: [
      'Pool size, depth, and design complexity',
      'Concrete vs fiberglass construction',
      'Features — infinity edge, water features, LED lighting',
      'Pool chiller system (essential for UAE summers)',
      'Filtration and water treatment system quality',
      'Municipality and Civil Defense approval requirements in {city}',
    ],
    tips: [
      'Budget AED 15,000–40,000 for a pool chiller — without it, summer water reaches 38°C+',
      'Choose saltwater chlorination — lower maintenance and gentler on skin in UAE heat',
      'Install a pool cover to reduce evaporation — UAE pools lose 5–10mm of water daily in summer',
      'Get Civil Defense approval early — pool safety requirements (fencing, depth markers) affect design',
    ],
    faqs: [
      { q: 'How much does a swimming pool cost in {city}?', a: 'A standard 8x4m concrete pool in {city} costs AED 80,000–200,000. Infinity pools range from AED 250,000–600,000. Fiberglass pools are cheaper at AED 40,000–120,000 but less customizable.' },
      { q: 'Do I need a permit for a pool in {city}?', a: 'Yes, pool construction in {city} requires municipality approval, structural engineer sign-off, and Civil Defense NOC. Safety requirements include fencing, anti-slip coping, and depth markers.' },
      { q: 'How much does pool maintenance cost in {city}?', a: 'Monthly pool maintenance in {city} costs AED 500–1,500. This includes chemical balancing, filter cleaning, and equipment checks. Summer months need more frequent service due to heat and dust.' },
      { q: 'Do I need a pool chiller in {city}?', a: 'A pool chiller is highly recommended in {city}. Without one, pool water reaches 35–38°C in summer — too warm for comfortable swimming. Chillers cost AED 15,000–40,000 and use AED 300–600/month in DEWA bills.' },
    ],
    relatedSlugs: ['landscaping', 'waterproofing', 'general-construction'],
  },
  {
    slug: 'landscaping',
    name: 'Landscaping',
    emoji: '🌴',
    headline: 'Landscaping Cost in UAE 2026',
    metaDesc: 'Landscaping and garden design costs in {city}, UAE. Compare rates for hardscaping, irrigation, artificial grass, and outdoor living spaces in AED.',
    intro: 'Landscaping in {city} requires drought-resistant plants, efficient irrigation, and materials that withstand extreme heat. Costs depend on garden size, design complexity, and hardscaping elements.',
    avgLow: 'AED 30', avgHigh: 'AED 150', avgUnit: 'per sq ft',
    items: [
      { label: 'Basic Softscaping (Plants + Soil)', low: 'AED 30', high: 'AED 60', unit: 'per sq ft' },
      { label: 'Premium Landscape Design', low: 'AED 80', high: 'AED 200', unit: 'per sq ft' },
      { label: 'Artificial Grass', low: 'AED 35', high: 'AED 80', unit: 'per sq ft' },
      { label: 'Drip Irrigation System', low: 'AED 5,000', high: 'AED 15,000', unit: 'per garden' },
      { label: 'Pergola / Shade Structure', low: 'AED 10,000', high: 'AED 40,000', unit: 'per structure' },
      { label: 'Outdoor Kitchen / BBQ Area', low: 'AED 15,000', high: 'AED 60,000', unit: 'per setup' },
      { label: 'Garden Lighting', low: 'AED 5,000', high: 'AED 20,000', unit: 'per garden' },
    ],
    factors: [
      'Garden size and existing conditions',
      'Softscaping vs hardscaping ratio',
      'Plant selection — native vs imported species',
      'Irrigation system type and water efficiency',
      'Shade structures and outdoor living features',
      'Municipality regulations on water usage in {city}',
    ],
    tips: [
      'Use native UAE plants (Ghaf, Date Palm, Bougainvillea) — they survive summer with minimal water',
      'Install drip irrigation — saves 60–70% water vs sprinklers and is encouraged by UAE municipalities',
      'Artificial grass is hugely popular — zero water, always green, and costs AED 35–80/sqft installed',
      'Design outdoor living spaces for evening use — shade structures are essential for daytime comfort',
    ],
    faqs: [
      { q: 'How much does villa landscaping cost in {city}?', a: 'Villa landscaping in {city} costs AED 30,000–150,000+ depending on garden size and design. Basic softscaping runs AED 30/sqft, while premium designs with hardscaping, pools, and pergolas cost AED 80–200/sqft.' },
      { q: 'What plants survive UAE summers?', a: 'In {city}, use Bougainvillea, Date Palms, Ghaf trees, Frangipani, Arabian Jasmine, and Lantana. These thrive in 50°C heat with minimal water. Avoid water-hungry species like English lawns.' },
      { q: 'How much does artificial grass cost in {city}?', a: 'Artificial grass in {city} costs AED 35–80/sqft installed. It requires zero water, stays green year-round, and is the most popular lawn option in UAE villas.' },
      { q: 'Do I need a permit for landscaping in {city}?', a: 'Minor landscaping does not need a permit in {city}. However, structures like pergolas, boundary walls, and swimming pools require municipality approval and potentially Civil Defense NOC.' },
    ],
    relatedSlugs: ['swimming-pool', 'general-construction', 'irrigation'],
  },
  {
    slug: 'insulation',
    name: 'Thermal Insulation',
    emoji: '🧊',
    headline: 'Thermal Insulation Cost in UAE 2026',
    metaDesc: 'Thermal insulation costs for roofs, walls, and buildings in {city}, UAE. Save 30-40% on AC bills with proper insulation. Compare rates in AED.',
    intro: 'Thermal insulation in {city} is mandatory under UAE green building codes. Proper insulation reduces AC energy consumption by 30–40%, making it one of the best investments for any building in the extreme UAE heat.',
    avgLow: 'AED 15', avgHigh: 'AED 50', avgUnit: 'per sq ft',
    items: [
      { label: 'Roof Insulation (XPS Board)', low: 'AED 20', high: 'AED 35', unit: 'per sq ft' },
      { label: 'Roof Insulation (Spray Foam)', low: 'AED 30', high: 'AED 50', unit: 'per sq ft' },
      { label: 'Wall Insulation (Cavity)', low: 'AED 15', high: 'AED 30', unit: 'per sq ft' },
      { label: 'Reflective Roof Coating', low: 'AED 10', high: 'AED 20', unit: 'per sq ft' },
      { label: 'Double-Glazed Window Upgrade', low: 'AED 400', high: 'AED 900', unit: 'per sq m' },
      { label: 'Acoustic Insulation', low: 'AED 15', high: 'AED 40', unit: 'per sq ft' },
    ],
    factors: [
      'Type of insulation — XPS, spray foam, mineral wool',
      'Area being insulated — roof, walls, or windows',
      'Existing building condition and accessibility',
      'Green building rating target (Estidama/Al Safat)',
      'R-value requirements per UAE building code',
      'Building type — villa, apartment, or commercial in {city}',
    ],
    tips: [
      'Roof insulation gives the biggest ROI — 60% of heat enters through the roof in UAE',
      'Combine insulation with reflective roof coating for maximum heat reduction',
      'Upgrade to double-glazed windows — they reduce heat by 40% vs single-glazed',
      'Insulation payback period in UAE is just 2–3 years through DEWA bill savings',
    ],
    faqs: [
      { q: 'How much does roof insulation cost in {city}?', a: 'Roof insulation in {city} costs AED 20–50/sqft. XPS board insulation costs AED 20–35/sqft, while polyurethane spray foam costs AED 30–50/sqft but provides better coverage and R-value.' },
      { q: 'Is insulation mandatory in UAE?', a: 'Yes, thermal insulation is mandatory in {city} under UAE building codes. Abu Dhabi requires Estidama compliance, Dubai requires Al Safat green building standards. Both specify minimum insulation R-values.' },
      { q: 'How much does insulation save on DEWA bills?', a: 'Proper insulation in {city} reduces DEWA electricity bills by 25–40%. For a villa spending AED 2,000/month on cooling, insulation saves AED 500–800/month. Payback period is 2–3 years.' },
      { q: 'What is the best insulation for UAE?', a: 'In {city}, extruded polystyrene (XPS) is best for roofs, spray foam for walls, and Low-E double-glazed windows. Combined, they can achieve 35–45% reduction in cooling energy consumption.' },
    ],
    relatedSlugs: ['hvac', 'roofing', 'windows-doors'],
  },
  {
    slug: 'carpentry',
    name: 'Carpentry & Joinery',
    emoji: '🪚',
    headline: 'Carpentry & Joinery Cost in UAE 2026',
    metaDesc: 'Custom carpentry and joinery costs in {city}, UAE. Compare prices for wardrobes, kitchen cabinets, doors, and custom furniture in AED.',
    intro: 'Custom carpentry in {city} ranges from fitted wardrobes to bespoke kitchen cabinets. UAE joinery often features premium finishes and Arabic-inspired designs using high-quality materials.',
    avgLow: 'AED 120', avgHigh: 'AED 350', avgUnit: 'per hour',
    items: [
      { label: 'Fitted Wardrobes (per linear meter)', low: 'AED 800', high: 'AED 2,500', unit: 'per linear m' },
      { label: 'Kitchen Cabinets (Full Kitchen)', low: 'AED 15,000', high: 'AED 60,000', unit: 'per kitchen' },
      { label: 'Wooden Door (Supply + Install)', low: 'AED 1,500', high: 'AED 5,000', unit: 'per door' },
      { label: 'TV Unit / Entertainment Center', low: 'AED 3,000', high: 'AED 12,000', unit: 'per unit' },
      { label: 'Pergola (Wooden)', low: 'AED 10,000', high: 'AED 35,000', unit: 'per pergola' },
      { label: 'Custom Shelving', low: 'AED 500', high: 'AED 2,000', unit: 'per linear m' },
    ],
    factors: [
      'Material — MDF, plywood, solid wood, engineered wood',
      'Hardware quality — Blum, Hettich, or standard',
      'Design complexity and finish — laminate, veneer, paint',
      'Number of units and total linear meters',
      'Installation difficulty and site conditions',
      'Sourcing — Dragon Mart vs premium suppliers in {city}',
    ],
    tips: [
      'MDF with quality laminate offers 80% the look of solid wood at 40% the cost',
      'Choose Blum or Hettich hardware — they last 15+ years vs 3–5 for cheap alternatives',
      'Avoid solid wood for bathroom cabinets — UAE humidity causes warping. Use marine plywood instead',
      'Get detailed drawings and 3D renders before production to avoid costly revisions',
    ],
    faqs: [
      { q: 'How much do custom wardrobes cost in {city}?', a: 'Custom fitted wardrobes in {city} cost AED 800–2,500 per linear meter. MDF with laminate starts at AED 800/m, while solid wood with soft-close Blum hardware costs AED 1,800+/m.' },
      { q: 'How much does a custom kitchen cost in {city}?', a: 'Custom kitchen cabinets in {city} range from AED 15,000–60,000. Budget MDF kitchens start at AED 15,000, while premium kitchens with stone countertops and German hardware cost AED 40,000+.' },
      { q: 'Where to buy carpentry materials in {city}?', a: 'In {city}, Dragon Mart offers the best prices for MDF, plywood, and hardware. Premium materials are available at?"?"? Furniture Mall,?"?"? Home, and specialized joinery suppliers.' },
      { q: 'How long does custom carpentry take in {city}?', a: 'Custom wardrobes in {city} take 2–4 weeks, kitchen cabinets 3–6 weeks. This includes measurement, design approval, fabrication (off-site), and installation.' },
    ],
    relatedSlugs: ['renovation', 'kitchen-renovation', 'interior-design'],
  },
];
