// lib/ask-compare-data.ts
// 20 product comparisons for /ask/compare/[slug] pages

export type CompareCategory =
  | 'cement'
  | 'tiles'
  | 'paint'
  | 'pipes'
  | 'flooring'
  | 'roofing'
  | 'steel'
  | 'glass'
  | 'waterproofing'
  | 'electrical'
  | 'plumbing'
  | 'insulation';

export interface CompareSpec {
  label: string;
  a: string;
  b: string;
  winner?: 'a' | 'b' | 'tie';
}

export interface ComparePros {
  a: string[];
  b: string[];
}

export interface CompareCons {
  a: string[];
  b: string[];
}

export interface CompareProduct {
  slug: string;
  category: CompareCategory;
  titleA: string;
  titleB: string;
  question: string;
  metaTitle: string;
  metaDescription: string;
  keywords: string[];
  summary: string;
  verdict: string;
  verdictWinner: 'a' | 'b' | 'tie';
  priceA: string;
  priceB: string;
  priceUnit: string;
  specs: CompareSpec[];
  pros: ComparePros;
  cons: CompareCons;
  bestForA: string[];
  bestForB: string[];
  indianBrandsA: string[];
  indianBrandsB: string[];
  relatedSlugs: string[];
  publishedAt: string;
  updatedAt: string;
}

export const compareProducts: CompareProduct[] = [
  // ── CEMENT ──────────────────────────────────────────────────
  {
    slug: 'opc-vs-ppc-cement-india',
    category: 'cement',
    titleA: 'OPC Cement (43/53 Grade)',
    titleB: 'PPC Cement',
    question: 'OPC vs PPC Cement — Which is Better for Indian Construction?',
    metaTitle: 'OPC vs PPC Cement India 2024 — Which Cement is Best for Construction?',
    metaDescription: 'OPC vs PPC cement comparison for Indian homes. Strength, cost, setting time, and best use cases. Expert advice for slabs, foundations & plastering.',
    keywords: ['opc vs ppc cement', 'best cement for house construction india', 'opc cement uses', 'ppc cement benefits'],
    summary: 'OPC (Ordinary Portland Cement) and PPC (Portland Pozzolana Cement) are the two most used cement types in India. OPC offers faster strength gain while PPC is more durable, cost-effective and eco-friendly for most residential applications.',
    verdict: 'For most Indian homes — slabs, columns, beams — PPC is the better choice due to lower heat of hydration, better long-term durability, and lower price per bag. Use OPC 53 Grade only for precast and fast-track projects.',
    verdictWinner: 'b',
    priceA: '380-420',
    priceB: '360-400',
    priceUnit: '₹ per 50kg bag',
    specs: [
      { label: 'Compressive Strength (28 days)', a: '43/53 MPa', b: '33 MPa min', winner: 'a' },
      { label: 'Initial Setting Time', a: '30 minutes', b: '30 minutes', winner: 'tie' },
      { label: 'Heat of Hydration', a: 'High', b: 'Low', winner: 'b' },
      { label: 'Workability', a: 'Moderate', b: 'High', winner: 'b' },
      { label: 'Durability (sulfate resistance)', a: 'Moderate', b: 'High', winner: 'b' },
      { label: 'Cost per bag', a: '₹380–420', b: '₹360–400', winner: 'b' },
      { label: 'Eco-friendly', a: 'No', b: 'Yes (fly ash)', winner: 'b' },
    ],
    pros: {
      a: ['Faster strength gain (7-day strength higher)', 'Better for precast elements', 'Ideal for cold-weather concreting', 'Predictable performance'],
      b: ['Lower cost by ₹10–20/bag', 'Lower heat of hydration (prevents cracks)', 'Better workability and finishing', 'Higher long-term strength', 'Better sulfate and chloride resistance'],
    },
    cons: {
      a: ['Higher heat of hydration (cracking risk in mass concrete)', 'Costlier', 'Less workable in hot climates'],
      b: ['Slower early strength gain', 'Not ideal for precast or fast-track work', 'Quality varies by fly ash source'],
    },
    bestForA: ['Precast concrete elements', 'Fast-track construction', 'Cold weather concreting', 'High-rise columns and beams'],
    bestForB: ['Slabs and foundations', 'Plastering and masonry', 'Marine or waterfront construction', 'General residential construction'],
    indianBrandsA: ['UltraTech OPC 53', 'ACC Suraksha', 'Ambuja Plus', 'Shree Ultra OPC'],
    indianBrandsB: ['UltraTech PPC', 'Dalmia Infragreen', 'JK Super PPC', 'Birla A1 PPC'],
    relatedSlugs: ['white-cement-vs-grey-cement', 'vitrified-tiles-vs-ceramic-tiles', 'tile-adhesive-vs-cement-mortar-tiles'],
    publishedAt: '2024-01-10',
    updatedAt: '2024-11-01',
  },
  {
    slug: 'white-cement-vs-grey-cement',
    category: 'cement',
    titleA: 'White Cement',
    titleB: 'Grey Cement (OPC/PPC)',
    question: 'White Cement vs Grey Cement — When to Use Which?',
    metaTitle: 'White Cement vs Grey Cement India — Uses, Price & Difference Explained',
    metaDescription: 'White cement vs grey cement — complete comparison of uses, price, strength and applications for Indian homes. When to choose white over grey cement.',
    keywords: ['white cement uses india', 'white cement vs grey cement', 'white cement price india', 'when to use white cement'],
    summary: 'White cement is a premium decorative cement used for tile grouting, wall putty base, and aesthetic finishes. Grey cement is the structural workhorse for all construction. They serve different purposes and are not interchangeable for structural work.',
    verdict: 'Grey cement for all structural work — foundations, columns, slabs. White cement only for finishing, grouting, decorative plasterwork, and tile joints. Never substitute white cement for structural grey cement.',
    verdictWinner: 'b',
    priceA: '18-25',
    priceB: '7-10',
    priceUnit: '₹ per kg',
    specs: [
      { label: 'Compressive Strength', a: '33 MPa', b: '43–53 MPa', winner: 'b' },
      { label: 'Whiteness Index', a: '>87%', b: 'N/A', winner: 'a' },
      { label: 'Price', a: '₹18–25/kg', b: '₹7–10/kg', winner: 'b' },
      { label: 'Decorative Use', a: 'Excellent', b: 'Poor', winner: 'a' },
      { label: 'Structural Use', a: 'Not recommended', b: 'Excellent', winner: 'b' },
    ],
    pros: {
      a: ['Pure white finish for aesthetics', 'Ideal for tile grouting', 'Used as base for wall putty', 'Good for decorative plasterwork'],
      b: ['Higher compressive strength', '3–4x cheaper', 'Better for all structural applications', 'Widely available everywhere'],
    },
    cons: {
      a: ['Much more expensive', 'Lower strength — not for structural use', 'Stains easily without sealer'],
      b: ['Grey color limits aesthetic use', 'Cannot be used for white tile grout'],
    },
    bestForA: ['Tile grouting (white joints)', 'Wall putty base coats', 'Decorative concrete work', 'Mosaic and inlay work', 'Swimming pool finishing'],
    bestForB: ['All structural concrete work', 'Foundations and slabs', 'Columns and beams', 'Masonry and plastering'],
    indianBrandsA: ['JK White Cement', 'Birla White', 'UltraTech White', 'Zuari White'],
    indianBrandsB: ['UltraTech OPC/PPC', 'ACC Gold', 'Ambuja Plus', 'Shree Cement'],
    relatedSlugs: ['opc-vs-ppc-cement-india', 'cement-paint-vs-acrylic-paint', 'tile-adhesive-vs-cement-mortar-tiles'],
    publishedAt: '2024-01-15',
    updatedAt: '2024-11-01',
  },
  // ── TILES ────────────────────────────────────────────────────
  {
    slug: 'vitrified-tiles-vs-ceramic-tiles',
    category: 'tiles',
    titleA: 'Vitrified Tiles',
    titleB: 'Ceramic Tiles',
    question: 'Vitrified Tiles vs Ceramic Tiles — Which is Better for Indian Homes?',
    metaTitle: 'Vitrified vs Ceramic Tiles India 2024 — Cost, Durability & Which to Choose',
    metaDescription: 'Vitrified tiles vs ceramic tiles for Indian homes. Full comparison of water absorption, strength, cost, and best uses for floors, walls and bathrooms.',
    keywords: ['vitrified tiles vs ceramic tiles', 'best tiles for home india', 'vitrified tiles price india', 'ceramic vs porcelain tiles india'],
    summary: 'Vitrified tiles are denser, more durable and water-resistant than ceramic tiles, making them ideal for high-traffic floor areas. Ceramic tiles are more affordable and suitable for walls and low-traffic areas.',
    verdict: 'Choose vitrified tiles for all floor applications. Ceramic tiles work well for bathroom walls and kitchen backsplashes where budget matters.',
    verdictWinner: 'a',
    priceA: '45-200',
    priceB: '20-80',
    priceUnit: '₹ per sq ft',
    specs: [
      { label: 'Water Absorption', a: '<0.5%', b: '3–7%', winner: 'a' },
      { label: 'Hardness (Mohs)', a: '7–8', b: '5–6', winner: 'a' },
      { label: 'Price Range', a: '₹45–200/sqft', b: '₹20–80/sqft', winner: 'b' },
      { label: 'Stain Resistance', a: 'Excellent', b: 'Good', winner: 'a' },
      { label: 'Slip Resistance', a: 'Moderate (polished)', b: 'Good', winner: 'b' },
    ],
    pros: {
      a: ['Near-zero water absorption', 'Extremely durable for heavy traffic', 'Easy to clean and maintain', 'Wide design variety including wood/stone looks', 'Better resale value'],
      b: ['Much cheaper (2–3x cost difference)', 'Better for wall applications', 'Easier to cut and install', 'Good variety of designs'],
    },
    cons: {
      a: ['Higher cost', 'Slippery when polished (outdoors risk)', 'Heavier — needs stronger substrate'],
      b: ['Higher water absorption (not for wet floors)', 'Less durable under heavy traffic', 'Fades over time in sunlight'],
    },
    bestForA: ['Living room floors', 'Bedroom floors', 'Kitchen floors', 'Commercial spaces', 'Outdoor covered areas'],
    bestForB: ['Bathroom walls', 'Kitchen backsplash', 'Balcony walls (covered)', 'Budget-conscious projects'],
    indianBrandsA: ['Kajaria', 'Somany', 'Johnson Tiles', 'Asian Granito', 'Nitco'],
    indianBrandsB: ['Kajaria Ceramic', 'H&R Johnson', 'Bell Ceramics', 'Simpolo'],
    relatedSlugs: ['marble-vs-vitrified-tiles', 'tile-adhesive-vs-cement-mortar-tiles', 'granite-vs-marble-flooring'],
    publishedAt: '2024-01-20',
    updatedAt: '2024-11-01',
  },
  {
    slug: 'marble-vs-vitrified-tiles',
    category: 'tiles',
    titleA: 'Natural Marble',
    titleB: 'Marble-Look Vitrified Tiles',
    question: 'Natural Marble vs Marble-Look Vitrified Tiles — Worth the Price Difference?',
    metaTitle: 'Marble vs Vitrified Tiles India 2024 — Price, Maintenance & Honest Comparison',
    metaDescription: 'Natural marble vs marble-look vitrified tiles. Price difference, maintenance costs, durability and which is better for Indian homes in 2024.',
    keywords: ['marble vs vitrified tiles', 'marble flooring cost india', 'marble look tiles vs real marble', 'italian marble vs tiles india'],
    summary: 'Natural marble is a premium luxury material with unique veining patterns, but requires regular maintenance and is prone to staining. Marble-look vitrified tiles offer similar aesthetics at 60–70% lower cost with near-zero maintenance.',
    verdict: 'For most Indian homes, marble-look vitrified tiles offer the best value — 60% cheaper, zero maintenance, no staining. Reserve natural marble for premium pooja rooms or living room focal points.',
    verdictWinner: 'b',
    priceA: '150-800',
    priceB: '60-200',
    priceUnit: '₹ per sq ft',
    specs: [
      { label: 'Price Range', a: '₹150–800/sqft', b: '₹60–200/sqft', winner: 'b' },
      { label: 'Maintenance', a: 'High (polishing every 2–3 yrs)', b: 'Negligible', winner: 'b' },
      { label: 'Stain Resistance', a: 'Low (acid sensitive)', b: 'Excellent', winner: 'b' },
      { label: 'Authenticity', a: 'Unique natural veining', b: 'Printed pattern', winner: 'a' },
      { label: 'Resale Perception', a: 'Premium', b: 'Standard', winner: 'a' },
    ],
    pros: {
      a: ['Natural unique patterns — no two slabs identical', 'Cool to touch (natural stone)', 'Adds premium perception and resale value', 'Can be re-polished multiple times'],
      b: ['60–70% cheaper than natural marble', 'No maintenance polishing needed', 'Acid and stain resistant', 'Consistent pattern across the floor', 'Available in large formats (800×1600mm)'],
    },
    cons: {
      a: ['High maintenance — polishing every 2–3 years', 'Acid-sensitive (lemon juice, vinegar etches)', 'Stains from turmeric, coffee'],
      b: ['Pattern repeats visible in large areas', 'Does not feel like natural stone to experts', 'Cannot be re-polished if scratched'],
    },
    bestForA: ['Luxury living room feature areas', 'Premium pooja rooms', 'Heritage and bungalow homes', 'High-end hospitality projects'],
    bestForB: ['Entire home flooring', 'Budget-conscious luxury look', 'Kitchens and dining areas', 'Apartment living rooms'],
    indianBrandsA: ['Makrana White', 'Italian Calacatta', 'Ambaji Marble', 'Rajnagar Marble'],
    indianBrandsB: ['Kajaria Eternity', 'Somany Duragres', 'Nitco Marmo', 'Asian Granito Statuario'],
    relatedSlugs: ['vitrified-tiles-vs-ceramic-tiles', 'granite-vs-marble-flooring', 'tile-adhesive-vs-cement-mortar-tiles'],
    publishedAt: '2024-02-01',
    updatedAt: '2024-11-01',
  },
  {
    slug: 'tile-adhesive-vs-cement-mortar-tiles',
    category: 'tiles',
    titleA: 'Tile Adhesive',
    titleB: 'Traditional Cement Mortar',
    question: 'Tile Adhesive vs Cement Mortar — Which is Better for Tile Fixing in India?',
    metaTitle: 'Tile Adhesive vs Cement Mortar India 2024 — Which is Better for Tile Fixing?',
    metaDescription: 'Tile adhesive vs cement mortar for fixing tiles in India. Bond strength, cost, application ease and which to choose for floors, walls and large-format tiles.',
    keywords: ['tile adhesive vs cement mortar', 'tile fixing method india', 'best tile adhesive india', 'how to fix tiles in india'],
    summary: 'Tile adhesive offers superior bond strength, thinner bed application, and better performance with large-format tiles and walls. Cement mortar is traditional, cheaper, but thicker and less reliable for modern large tiles.',
    verdict: 'For all modern large-format tiles (600mm+), vitrified tiles and wall tiles, use tile adhesive. Cement mortar is acceptable only for small floor tiles (up to 300×300mm) in budget projects.',
    verdictWinner: 'a',
    priceA: '350-700',
    priceB: '80-120',
    priceUnit: '₹ per 20kg bag',
    specs: [
      { label: 'Bond Strength', a: 'High (>1.5 N/mm²)', b: 'Moderate (0.5–1 N/mm²)', winner: 'a' },
      { label: 'Bed Thickness', a: '3–6mm', b: '15–25mm', winner: 'a' },
      { label: 'Large Format Tiles', a: 'Excellent', b: 'Poor (hollow spots)', winner: 'a' },
      { label: 'Cost per sqft', a: '₹25–45', b: '₹10–20', winner: 'b' },
      { label: 'Application Ease', a: 'Easy (notch trowel)', b: 'Requires skill', winner: 'a' },
    ],
    pros: {
      a: ['Superior bond strength', 'Suitable for all tile sizes including large format', 'Thinner bed saves floor height', 'Better for wall tiles (no slipping)', 'Flexible variants for movement joints'],
      b: ['Very cheap material cost', 'Readily available everywhere', 'Traditional method known to all masons', 'Can level uneven surfaces well'],
    },
    cons: {
      a: ['Higher material cost (3–4x)', 'Less familiar to older masons', 'Requires proper surface preparation'],
      b: ['Creates hollow spots under large tiles', 'Tiles can crack from uneven support', 'Thicker bed uses more floor height'],
    },
    bestForA: ['Large format vitrified tiles (600mm+)', 'All wall tile applications', 'Bathroom floors and walls', 'Marble and stone tiles'],
    bestForB: ['Small budget floor tiles (300×300mm)', 'Rustic and mosaic tiles', 'Thick terracotta tiles'],
    indianBrandsA: ['Saint-Gobain Weber', 'Ardex Endura', 'Laticrete', 'Bal Tile Adhesive', 'Dr. Fixit TAF'],
    indianBrandsB: ['OPC 43 Grade (DIY mix)', 'ACC Suraksha', 'UltraTech OPC'],
    relatedSlugs: ['vitrified-tiles-vs-ceramic-tiles', 'marble-vs-vitrified-tiles', 'opc-vs-ppc-cement-india'],
    publishedAt: '2024-02-10',
    updatedAt: '2024-11-01',
  },
  // ── PAINT ────────────────────────────────────────────────────
  {
    slug: 'cement-paint-vs-acrylic-paint',
    category: 'paint',
    titleA: 'Cement Paint',
    titleB: 'Acrylic Emulsion Paint',
    question: 'Cement Paint vs Acrylic Paint — Which is Better for Indian Exterior Walls?',
    metaTitle: 'Cement Paint vs Acrylic Paint India 2024 — Exterior Wall Comparison',
    metaDescription: 'Cement paint vs acrylic emulsion for exterior walls in India. Durability, cost, application and which lasts longer in Indian climate.',
    keywords: ['cement paint vs acrylic paint india', 'best exterior paint india', 'cement paint for walls', 'acrylic paint exterior india'],
    summary: 'Cement paint is a budget-friendly traditional exterior solution but lacks the durability and water resistance of modern acrylic emulsions. Acrylic exterior paints last 5–8 years vs 2–3 years for cement paint.',
    verdict: 'Acrylic exterior emulsion is worth the extra investment — lasts 2–3x longer, provides better waterproofing, and maintains color better in Indian sun and rain.',
    verdictWinner: 'b',
    priceA: '25-40',
    priceB: '80-180',
    priceUnit: '₹ per sq ft (applied cost)',
    specs: [
      { label: 'Lifespan', a: '2–3 years', b: '5–8 years', winner: 'b' },
      { label: 'Waterproofing', a: 'Poor', b: 'Good–Excellent', winner: 'b' },
      { label: 'Colour Retention', a: 'Fades quickly', b: 'Good UV resistance', winner: 'b' },
      { label: 'Surface Prep Required', a: 'Minimal', b: 'Primer + putty', winner: 'a' },
      { label: 'Finish Options', a: 'Matt only', b: 'Matt, Satin, Gloss', winner: 'b' },
    ],
    pros: {
      a: ['Very cheap material cost', 'Easy to apply — just add water', 'Good adhesion on rough surfaces', 'Breathable (allows moisture to escape)'],
      b: ['2–3x longer lifespan', 'Better UV and rain resistance', 'Wide color range with better retention', 'Flexible — resists hairline cracks'],
    },
    cons: {
      a: ['Short lifespan (2–3 years max)', 'Poor waterproofing', 'Limited colors and finish', 'Chalks and fades in Indian sun'],
      b: ['Higher upfront cost', 'Requires primer and putty', 'Needs trained painter for good finish'],
    },
    bestForA: ['Village homes and agricultural buildings', 'Temporary structures', 'Tight budget exterior painting', 'Compound walls'],
    bestForB: ['All residential exterior walls', 'Commercial buildings', 'Coastal and high-rainfall areas', 'Anywhere appearance matters'],
    indianBrandsA: ['Asian Paints Exterior Cement Paint', 'Birla White Cement Paint', 'Nerolac Cement Primer'],
    indianBrandsB: ['Asian Paints Apex Ultima', 'Nerolac Excel', 'Berger WeatherCoat', 'Dulux Weathershield'],
    relatedSlugs: ['distemper-vs-emulsion-paint', 'opc-vs-ppc-cement-india', 'vitrified-tiles-vs-ceramic-tiles'],
    publishedAt: '2024-02-15',
    updatedAt: '2024-11-01',
  },
  {
    slug: 'distemper-vs-emulsion-paint',
    category: 'paint',
    titleA: 'Distemper Paint',
    titleB: 'Emulsion Paint',
    question: 'Distemper vs Emulsion Paint — Which is Best for Indian Interior Walls?',
    metaTitle: 'Distemper vs Emulsion Paint India 2024 — Interior Wall Paint Comparison',
    metaDescription: 'Distemper vs emulsion paint for Indian interior walls. Cost, finish quality, durability and which is the better value for bedrooms and living rooms.',
    keywords: ['distemper vs emulsion paint india', 'best interior wall paint india', 'distemper paint cost india', 'emulsion paint interior india'],
    summary: 'Distemper is a water-based cheap paint with chalky finish, while emulsion is a durable washable finish. Emulsion costs more but lasts 5–7 years vs 2–3 years for distemper.',
    verdict: 'Emulsion paint is worth the upgrade for living rooms, bedrooms, and anywhere appearance matters. Distemper is acceptable only in utility rooms, garages, and tight-budget rentals.',
    verdictWinner: 'b',
    priceA: '15-25',
    priceB: '35-60',
    priceUnit: '₹ per sq ft',
    specs: [
      { label: 'Lifespan', a: '2–3 years', b: '5–7 years', winner: 'b' },
      { label: 'Washability', a: 'Not washable', b: 'Washable', winner: 'b' },
      { label: 'Sheen/Finish', a: 'Flat chalky', b: 'Matt to Silk', winner: 'b' },
      { label: 'Coverage', a: '3–3.5 m²/kg', b: '10–12 m²/litre', winner: 'b' },
      { label: 'Moisture Resistance', a: 'Poor', b: 'Good', winner: 'b' },
    ],
    pros: {
      a: ['Very cheap — 40–50% lower cost', 'Easy application', 'Breathable — good for old buildings', 'No strong smell during application'],
      b: ['Washable and scrubbable', 'Better color retention', 'Smooth aesthetic finish', 'Multiple sheen levels', 'Longer lifespan'],
    },
    cons: {
      a: ['Chalks off — leaves marks on clothes', 'Cannot be washed', 'Limited to flat finish only', 'Short lifespan'],
      b: ['Higher cost', 'Requires primer for best adhesion', 'Not breathable (moisture can trap behind)'],
    },
    bestForA: ['Rental properties (budget paint)', 'Service areas and garages', 'Construction-phase finishes', 'Ceilings in budget homes'],
    bestForB: ['Living rooms and bedrooms', "Children's rooms (washable)", 'Kitchen and dining walls', 'All quality residential interiors'],
    indianBrandsA: ['Asian Paints Tractor Distemper', 'Nerolac Distemper', 'Berger Easy Clean'],
    indianBrandsB: ['Asian Paints Royale', 'Nerolac Impressions', 'Berger Silk', 'Dulux Velvet Touch'],
    relatedSlugs: ['cement-paint-vs-acrylic-paint', 'opc-vs-ppc-cement-india', 'vitrified-tiles-vs-ceramic-tiles'],
    publishedAt: '2024-02-20',
    updatedAt: '2024-11-01',
  },
  // ── PIPES ────────────────────────────────────────────────────
  {
    slug: 'cpvc-vs-upvc-pipes-india',
    category: 'pipes',
    titleA: 'CPVC Pipes',
    titleB: 'UPVC Pipes',
    question: 'CPVC vs UPVC Pipes — Which is Better for Indian Homes?',
    metaTitle: 'CPVC vs UPVC Pipes India 2024 — Which Pipe for Hot and Cold Water?',
    metaDescription: 'CPVC vs UPVC pipe comparison for Indian plumbing. Temperature ratings, cost, applications and which pipe to choose for hot water and cold water lines.',
    keywords: ['cpvc vs upvc pipes india', 'best pipes for home plumbing india', 'cpvc pipe hot water', 'upvc pipe uses india'],
    summary: 'CPVC can handle hot water up to 93°C while UPVC is limited to cold water applications (max 60°C). CPVC costs 30–40% more but is the only safe plastic pipe for hot water supply lines.',
    verdict: 'Use CPVC for all hot water lines (geysers, solar heaters, kitchen) and UPVC for cold water supply and drainage. Never use UPVC for hot water — it deforms and leaks.',
    verdictWinner: 'a',
    priceA: '80-150',
    priceB: '50-100',
    priceUnit: '₹ per metre (½ inch)',
    specs: [
      { label: 'Max Temperature', a: '93°C', b: '60°C', winner: 'a' },
      { label: 'Pressure Rating', a: 'High (PN25)', b: 'Moderate (PN16)', winner: 'a' },
      { label: 'Price', a: '₹80–150/m', b: '₹50–100/m', winner: 'b' },
      { label: 'Hot Water Suitability', a: 'Excellent', b: 'Poor (deforms)', winner: 'a' },
      { label: 'Chemical Resistance', a: 'High', b: 'Good', winner: 'a' },
    ],
    pros: {
      a: ['Handles hot and cold water safely', 'Higher pressure rating', 'Chemical resistant', 'Long lifespan 50+ years'],
      b: ['Cheaper — 30–40% less costly', 'Industry standard for cold supply and drainage', 'Wide availability', 'Strong and impact resistant'],
    },
    cons: {
      a: ['Higher cost', 'Requires CPVC-specific solvent cement'],
      b: ['Cannot handle hot water (deforms above 60°C)', 'Not for geyser/solar water heater lines'],
    },
    bestForA: ['Hot water supply from geysers', 'Solar water heater lines', 'Kitchen hot water', 'All-in-one hot+cold plumbing systems'],
    bestForB: ['Cold water supply lines', 'All drainage and sewage', 'Underground water supply', 'Rainwater harvesting systems'],
    indianBrandsA: ['Astral CPVC', 'Supreme CPVC', 'Prince CPVC', 'Finolex CPVC'],
    indianBrandsB: ['Astral UPVC', 'Supreme UPVC', 'Prince UPVC', 'Finolex UPVC', 'Apollo UPVC'],
    relatedSlugs: ['gi-pipe-vs-cpvc-pipe', 'overhead-tank-vs-underground-sump', 'opc-vs-ppc-cement-india'],
    publishedAt: '2024-03-01',
    updatedAt: '2024-11-01',
  },
  {
    slug: 'gi-pipe-vs-cpvc-pipe',
    category: 'pipes',
    titleA: 'GI (Galvanised Iron) Pipe',
    titleB: 'CPVC Pipe',
    question: 'GI Pipe vs CPVC Pipe — Should You Replace GI with CPVC for Home Plumbing?',
    metaTitle: 'GI vs CPVC Pipe India 2024 — Replace Old GI Plumbing with CPVC?',
    metaDescription: 'GI pipe vs CPVC pipe comparison for Indian homes. Rust issues, cost, installation, lifespan and whether to replace old GI plumbing with modern CPVC.',
    keywords: ['gi pipe vs cpvc pipe', 'replace gi pipe with cpvc india', 'gi pipe problems india', 'cpvc pipe for home india'],
    summary: 'GI (galvanised iron) pipes are the traditional metal plumbing standard that corrode over time, reducing water quality. CPVC offers corrosion-free, lightweight plumbing with 50+ year lifespan for both hot and cold water.',
    verdict: 'CPVC is the clear winner for new construction. For homes older than 15 years with GI plumbing showing rust, replacement with CPVC is strongly recommended.',
    verdictWinner: 'b',
    priceA: '120-250',
    priceB: '80-150',
    priceUnit: '₹ per metre (½ inch)',
    specs: [
      { label: 'Lifespan', a: '15–25 years', b: '50+ years', winner: 'b' },
      { label: 'Corrosion Resistance', a: 'Corrodes over time', b: 'Corrosion-free', winner: 'b' },
      { label: 'Water Quality Impact', a: 'Rust can contaminate water', b: 'Zero impact', winner: 'b' },
      { label: 'Installation', a: 'Threading required (skilled labour)', b: 'Solvent cement (easy)', winner: 'b' },
      { label: 'Price', a: '₹120–250/m', b: '₹80–150/m', winner: 'b' },
    ],
    pros: {
      a: ['Very high pressure rating', 'Fire resistant', 'Suitable for gas lines', 'Familiar to older plumbers'],
      b: ['Corrosion-free for life', 'Lighter and easier to install', 'Cheaper material', 'No rust in drinking water', 'Better for hot water'],
    },
    cons: {
      a: ['Corrodes and rusts — reduces water pressure over time', 'Rust contaminates drinking water', 'More expensive', 'Requires specialized threading tools'],
      b: ['Not suitable for gas lines', 'Cannot withstand fire (melts)', 'Requires solvent cement — no threading'],
    },
    bestForA: ['Gas supply lines', 'Fire fighting systems', 'High-pressure industrial applications'],
    bestForB: ['All residential plumbing (new construction)', 'Hot and cold water supply', 'Replacing old corroded GI pipes', 'Concealed plumbing in walls'],
    indianBrandsA: ['Tata GI Pipes', 'Jindal GI', 'APL Apollo GI'],
    indianBrandsB: ['Astral CPVC Pro', 'Supreme CPVC', 'Prince CPVC', 'Finolex CPVC'],
    relatedSlugs: ['cpvc-vs-upvc-pipes-india', 'overhead-tank-vs-underground-sump', 'vitrified-tiles-vs-ceramic-tiles'],
    publishedAt: '2024-03-10',
    updatedAt: '2024-11-01',
  },
  // ── FLOORING ─────────────────────────────────────────────────
  {
    slug: 'granite-vs-marble-flooring',
    category: 'flooring',
    titleA: 'Granite Flooring',
    titleB: 'Marble Flooring',
    question: 'Granite vs Marble Flooring — Which Natural Stone is Better for Indian Homes?',
    metaTitle: 'Granite vs Marble Flooring India 2024 — Cost, Maintenance & Which to Choose',
    metaDescription: 'Granite vs marble flooring for Indian homes. Complete comparison of durability, stain resistance, price and maintenance for living rooms and bathrooms.',
    keywords: ['granite vs marble flooring india', 'granite flooring cost india', 'marble or granite for home india', 'natural stone flooring india'],
    summary: 'Granite is harder, more stain resistant, and requires less maintenance than marble. Marble offers superior elegance and cool touch but requires regular polishing and is acid-sensitive.',
    verdict: 'Granite wins for practical durability — kitchens, bathrooms, and high-traffic areas. Marble is ideal for formal living rooms and bedrooms where aesthetics matter more than maintenance convenience.',
    verdictWinner: 'a',
    priceA: '80-300',
    priceB: '150-800',
    priceUnit: '₹ per sq ft',
    specs: [
      { label: 'Hardness (Mohs)', a: '6–7', b: '3–4', winner: 'a' },
      { label: 'Stain Resistance', a: 'Excellent', b: 'Poor (acid etching)', winner: 'a' },
      { label: 'Price Range', a: '₹80–300/sqft', b: '₹150–800/sqft', winner: 'a' },
      { label: 'Maintenance', a: 'Annual sealing only', b: 'Polishing every 2–3 yrs', winner: 'a' },
      { label: 'Aesthetic Appeal', a: 'Good (speckled)', b: 'Excellent (veined)', winner: 'b' },
    ],
    pros: {
      a: ['Harder and more durable', 'Resistant to acid and stains', 'Wide color variety', 'Lower maintenance', 'Available locally from Indian quarries'],
      b: ['Premium aesthetic appeal', 'Natural veining patterns unique to each slab', 'Cool underfoot in summer', 'Higher perceived luxury value'],
    },
    cons: {
      a: ['Less prestigious than marble', 'Cold in winter'],
      b: ['Acid and stain sensitive', 'High maintenance — regular polishing', 'More expensive', 'Slippery when wet'],
    },
    bestForA: ['Kitchen countertops and floors', 'Bathroom floors', 'Outdoor covered areas', 'High-traffic living areas'],
    bestForB: ['Formal living rooms', 'Master bedroom feature areas', 'Luxury bathrooms', 'Pooja rooms'],
    indianBrandsA: ['Black Galaxy (Andhra)', 'Tan Brown', 'Kashmir White', 'Absolute Black'],
    indianBrandsB: ['Makrana White (Rajasthan)', 'Sawar Pink', 'Italian Calacatta', 'Ambaji White'],
    relatedSlugs: ['marble-vs-vitrified-tiles', 'vitrified-tiles-vs-ceramic-tiles', 'wood-flooring-vs-laminate-india'],
    publishedAt: '2024-03-15',
    updatedAt: '2024-11-01',
  },
  {
    slug: 'wood-flooring-vs-laminate-india',
    category: 'flooring',
    titleA: 'Engineered/Solid Wood Flooring',
    titleB: 'Laminate Flooring',
    question: 'Wood Flooring vs Laminate Flooring — Which is Better for Indian Homes?',
    metaTitle: 'Wood vs Laminate Flooring India 2024 — Cost, Durability & Which Lasts Longer',
    metaDescription: 'Wood flooring vs laminate flooring for Indian homes. Humidity resistance, cost, maintenance and which is better for Indian climate conditions.',
    keywords: ['wood flooring vs laminate india', 'engineered wood flooring india', 'laminate flooring india cost', 'best wood floor india'],
    summary: "Engineered wood offers authentic wood feel and can be refinished, but India's humid climate can cause warping. Laminate is cheaper, moisture-resistant, but cannot be refinished.",
    verdict: "For most Indian homes — especially in coastal or high-humidity regions — laminate flooring is the safer choice. Engineered hardwood is suitable for dry climates and premium projects with proper humidity control.",
    verdictWinner: 'b',
    priceA: '200-600',
    priceB: '80-250',
    priceUnit: '₹ per sq ft (supply + install)',
    specs: [
      { label: 'Price (installed)', a: '₹200–600/sqft', b: '₹80–250/sqft', winner: 'b' },
      { label: 'Moisture Resistance', a: 'Low–Moderate', b: 'Moderate–Good', winner: 'b' },
      { label: 'Refinishable', a: 'Yes (2–3 times)', b: 'No', winner: 'a' },
      { label: 'Lifespan', a: '20–40 years', b: '10–20 years', winner: 'a' },
      { label: 'India Climate Suitability', a: 'Moderate (warping risk)', b: 'Good', winner: 'b' },
    ],
    pros: {
      a: ['Authentic wood feel and appearance', 'Can be refinished when scratched', 'Long lifespan with care', 'Adds premium value to property'],
      b: ['Much cheaper', 'Better moisture resistance', 'Easier and faster installation', 'More scratch and wear resistant', 'Suitable for Indian humidity'],
    },
    cons: {
      a: ['Expensive', 'Sensitive to humidity and moisture (warping in monsoon)', 'Requires climate control in tropical regions'],
      b: ['Cannot be refinished — replace when worn', 'Not authentic wood', 'Shorter lifespan'],
    },
    bestForA: ['Air-conditioned premium homes', 'Dry regions (Rajasthan, Delhi)', 'Luxury bedrooms in controlled environments'],
    bestForB: ['Bedrooms in all Indian climates', 'Coastal areas (Mumbai, Chennai, Kochi)', 'Apartments and rental properties'],
    indianBrandsA: ['Pergo India', 'Greenply Woodcraft', 'Century Plywood Floors'],
    indianBrandsB: ['Pergo Laminate', 'Krono Original', 'Quick-Step', 'Greenply Laminates', 'Action TESA'],
    relatedSlugs: ['vitrified-tiles-vs-ceramic-tiles', 'granite-vs-marble-flooring', 'marble-vs-vitrified-tiles'],
    publishedAt: '2024-03-20',
    updatedAt: '2024-11-01',
  },
  // ── ROOFING ──────────────────────────────────────────────────
  {
    slug: 'rcc-slab-vs-tin-roof-india',
    category: 'roofing',
    titleA: 'RCC Concrete Slab Roof',
    titleB: 'Metal/Tin Sheet Roof',
    question: 'RCC Slab vs Metal Roof — Which is Better for Indian Construction?',
    metaTitle: 'RCC Slab vs Metal Roof India 2024 — Cost, Durability & Which to Build',
    metaDescription: 'RCC slab roof vs metal tin roof for Indian buildings. Construction cost, lifespan, heat resistance and which is better for permanent vs temporary structures.',
    keywords: ['rcc slab vs metal roof india', 'concrete roof vs tin roof india', 'metal roofing india cost', 'rcc roof cost india'],
    summary: 'RCC slabs are the permanent standard for residential buildings — allows additional floors, better heat insulation, and 50+ year lifespan. Metal roofs are suitable for sheds, agricultural buildings, and temporary structures at 60% lower cost.',
    verdict: 'RCC slab is the clear choice for any permanent residential building. Metal roofing is suitable only for industrial sheds, farmhouses, and temporary structures.',
    verdictWinner: 'a',
    priceA: '1800-2800',
    priceB: '700-1400',
    priceUnit: '₹ per sq ft',
    specs: [
      { label: 'Construction Cost', a: '₹1,800–2,800/sqft', b: '₹700–1,400/sqft', winner: 'b' },
      { label: 'Lifespan', a: '50–80 years', b: '20–30 years', winner: 'a' },
      { label: 'Heat Insulation', a: 'Moderate (with insulation)', b: 'Poor (conducts heat)', winner: 'a' },
      { label: 'Future Construction', a: 'Yes (can add floors)', b: 'No', winner: 'a' },
      { label: 'Installation Time', a: '30–45 days (curing)', b: '2–5 days', winner: 'b' },
    ],
    pros: {
      a: ['Permanent structure — allows future floors', 'Excellent structural integrity', 'Silent during rain', 'Standard for residential construction'],
      b: ['60% cheaper construction cost', 'Very fast installation (days not months)', 'Lightweight — no heavy structure needed'],
    },
    cons: {
      a: ['High cost', 'Long construction time (curing 28 days)', 'Heavy — requires strong foundations'],
      b: ['Gets extremely hot in Indian summer', 'Cannot add additional floors', 'Noisy during rain', 'Rusts over time'],
    },
    bestForA: ['All permanent residential buildings', 'Commercial buildings', 'Any structure where additional floors may be added'],
    bestForB: ['Agricultural sheds and warehouses', 'Farmhouses and rural temporary shelters', 'Industrial storage areas'],
    indianBrandsA: ['Site-mix with UltraTech/ACC cement', 'Ready Mix Concrete (RMC) plants'],
    indianBrandsB: ['TATA Shaktee', 'Everest Steel Roofing', 'Bhushan Steel Sheets', 'JSW Colouron+'],
    relatedSlugs: ['opc-vs-ppc-cement-india', 'crystalline-vs-membrane-waterproofing', 'heat-proofing-vs-waterproofing-roof'],
    publishedAt: '2024-04-01',
    updatedAt: '2024-11-01',
  },
  // ── STEEL ────────────────────────────────────────────────────
  {
    slug: 'tmt-bar-fe500-vs-fe550-india',
    category: 'steel',
    titleA: 'TMT Bar Fe500D',
    titleB: 'TMT Bar Fe550D',
    question: 'Fe500 vs Fe550 TMT Bars — Which Grade to Use for House Construction?',
    metaTitle: 'Fe500 vs Fe550 TMT Bars India 2024 — Which Grade Steel for Home Construction?',
    metaDescription: 'Fe500 vs Fe550 TMT bar comparison for Indian home construction. Yield strength, ductility, cost difference and which grade to choose for columns, beams and slabs.',
    keywords: ['fe500 vs fe550 tmt bar', 'best tmt bar for house construction india', 'tmt steel grade india', 'fe500d vs fe550d'],
    summary: 'Fe500D is the current standard for earthquake-resistant residential construction in India. Fe550 offers higher yield strength at a slightly higher cost. The D suffix denotes superior ductility — critical for seismic zones.',
    verdict: 'Use Fe500D for most residential construction — it meets IS 1786:2008 requirements for earthquake-resistant design. Fe550D for high-rise and heavy structural applications.',
    verdictWinner: 'a',
    priceA: '0',
    priceB: '200-500',
    priceUnit: '₹ premium per tonne vs Fe500',
    specs: [
      { label: 'Yield Strength (min)', a: '500 MPa', b: '550 MPa', winner: 'b' },
      { label: 'Elongation (ductility)', a: '≥16% (D grade)', b: '≥14.5% (D grade)', winner: 'a' },
      { label: 'Price Premium', a: 'Standard price', b: '+₹200–500/tonne', winner: 'a' },
      { label: 'Common Use', a: 'Residential construction', b: 'High-rise, bridges', winner: 'tie' },
    ],
    pros: {
      a: ['Standard for most residential construction', 'Better ductility (D grade)', 'Widely available', 'Cost-effective', 'Adequate for G+3 residential buildings'],
      b: ['Higher yield strength', 'Slightly lighter steel for same load (saves weight)', 'Better for high-rise applications'],
    },
    cons: {
      a: ['Slightly lower strength than Fe550', 'May need more steel for high loads'],
      b: ['Costs more', 'Slightly lower ductility', 'Overkill for low-rise residential'],
    },
    bestForA: ['All residential buildings (G+1 to G+5)', 'Columns, beams and slabs', 'Standard residential development'],
    bestForB: ['High-rise buildings (G+7 and above)', 'Bridge construction', 'Industrial structures'],
    indianBrandsA: ['TATA Tiscon 500D', 'JSW Neo Steel 500D', 'SAIL TMT Fe500D', 'Vizag Steel 500D'],
    indianBrandsB: ['TATA Tiscon 550D', 'JSW TMT 550D', 'Kamdhenu 550', 'Shyam Steel 550'],
    relatedSlugs: ['rcc-slab-vs-tin-roof-india', 'opc-vs-ppc-cement-india', 'vitrified-tiles-vs-ceramic-tiles'],
    publishedAt: '2024-04-10',
    updatedAt: '2024-11-01',
  },
  // ── GLASS & WINDOWS ──────────────────────────────────────────
  {
    slug: 'aluminium-vs-upvc-windows',
    category: 'glass',
    titleA: 'Aluminium Windows',
    titleB: 'UPVC Windows',
    question: 'Aluminium vs UPVC Windows — Which Window Frame is Better for Indian Homes?',
    metaTitle: 'Aluminium vs UPVC Windows India 2024 — Cost, Durability & Which to Choose',
    metaDescription: 'Aluminium vs UPVC window frame comparison for Indian homes. Price, thermal insulation, durability, maintenance and which window system is best for your project.',
    keywords: ['aluminium vs upvc windows india', 'best window frames india', 'upvc windows price india', 'aluminium window vs upvc'],
    summary: 'UPVC windows offer superior thermal insulation and zero maintenance but are bulkier. Aluminium windows are slimmer, stronger and can span larger areas, but conduct heat and need periodic painting.',
    verdict: 'UPVC for standard residential windows (best thermal performance, zero maintenance). Aluminium for large floor-to-ceiling windows, commercial applications, and wherever slim profiles matter aesthetically.',
    verdictWinner: 'b',
    priceA: '500-900',
    priceB: '900-1800',
    priceUnit: '₹ per sq ft (supply + install)',
    specs: [
      { label: 'Thermal Insulation', a: 'Poor (conducts heat)', b: 'Excellent (low conductivity)', winner: 'b' },
      { label: 'Maintenance', a: 'Periodic painting/repainting', b: 'Zero maintenance', winner: 'b' },
      { label: 'Profile Slim-ness', a: 'Very slim', b: 'Thicker frames', winner: 'a' },
      { label: 'Price', a: '₹500–900/sqft', b: '₹900–1,800/sqft', winner: 'a' },
      { label: 'Corrosion Resistance', a: 'Good (anodised)', b: 'Excellent', winner: 'b' },
    ],
    pros: {
      a: ['Slim profile — more glass, less frame', 'Strong — suitable for large openings', 'Lower cost', 'Good for sliding and large format windows'],
      b: ['Excellent thermal insulation', 'Zero maintenance for lifetime', 'No condensation on frames', 'Better sound insulation'],
    },
    cons: {
      a: ['High thermal conductivity (heat transfers in/out)', 'Requires painting over time', 'Condensation on cold days'],
      b: ['Bulkier frames (less glass area)', 'Cannot span very large openings', 'Higher cost'],
    },
    bestForA: ['Large panoramic windows and doors', 'Commercial curtain walls', 'Sliding patio doors'],
    bestForB: ['Standard residential windows (all rooms)', 'Casement and tilt-turn windows', 'Energy-efficient homes'],
    indianBrandsA: ['Jindal Aluminium', 'Hindalco', 'National Aluminium', 'Alufit'],
    indianBrandsB: ['Fenesta (DCM Shriram)', 'LG Hausys', 'Encraft UPVC', 'Lingel UPVC'],
    relatedSlugs: ['single-glass-vs-double-glazed-windows', 'cpvc-vs-upvc-pipes-india', 'distemper-vs-emulsion-paint'],
    publishedAt: '2024-05-01',
    updatedAt: '2024-11-01',
  },
  {
    slug: 'single-glass-vs-double-glazed-windows',
    category: 'glass',
    titleA: 'Single Glazed Glass Windows',
    titleB: 'Double Glazed (UPVC) Windows',
    question: 'Single Glass vs Double Glazed Windows — Are Double Glazed Windows Worth it in India?',
    metaTitle: 'Single vs Double Glazed Windows India 2024 — Cost, Energy Savings & Worth It?',
    metaDescription: 'Single glass vs double glazed UPVC windows in India. Cost difference, energy savings, noise reduction and whether double glazing is worth it in Indian climate.',
    keywords: ['double glazed windows india', 'single vs double glass windows', 'upvc double glazed windows india', 'double glazed windows cost india'],
    summary: 'Double glazed windows provide significantly better thermal insulation, noise reduction, and energy savings but cost 3–4x more than single glass. In Indian context, benefits are highest in extreme climates and urban noise environments.',
    verdict: 'Double glazed windows are worth the investment in: metro cities (noise reduction), AC-heavy homes (energy savings), and extreme climate zones. Single glass is sufficient for naturally ventilated homes in moderate climates.',
    verdictWinner: 'b',
    priceA: '400-700',
    priceB: '1200-2500',
    priceUnit: '₹ per sq ft',
    specs: [
      { label: 'Noise Reduction', a: '20–25 dB', b: '35–45 dB', winner: 'b' },
      { label: 'Price', a: '₹400–700/sqft', b: '₹1,200–2,500/sqft', winner: 'a' },
      { label: 'AC Energy Savings', a: 'None', b: '20–30% reduction', winner: 'b' },
      { label: 'Condensation Prevention', a: 'Poor', b: 'Excellent', winner: 'b' },
    ],
    pros: {
      a: ['Low cost', 'Easy to replace glass', 'Good for naturally ventilated homes'],
      b: ['Excellent thermal insulation (lower AC bills)', 'Superior noise reduction', 'Reduces condensation', 'Better UV protection option'],
    },
    cons: {
      a: ['No thermal or noise insulation', 'High heat gain in summer', 'Condensation forms on glass'],
      b: ['3–4x higher cost', 'Sealed unit — cannot be repaired if seal fails'],
    },
    bestForA: ['Naturally ventilated homes', 'Moderate climates', 'Rural areas with low noise', 'Budget construction'],
    bestForB: ['Metro city apartments (noise reduction)', 'Air-conditioned homes', 'Office buildings', 'Extreme climate zones'],
    indianBrandsA: ['Saint-Gobain Clear Float', 'Asahi India Glass', 'Gujarat Guardian Glass'],
    indianBrandsB: ['LG Hausys UPVC', 'Rehau UPVC', 'Schuco', 'Fenesta (DCM Shriram)'],
    relatedSlugs: ['aluminium-vs-upvc-windows', 'cpvc-vs-upvc-pipes-india', 'heat-proofing-vs-waterproofing-roof'],
    publishedAt: '2024-04-20',
    updatedAt: '2024-11-01',
  },
  // ── WATERPROOFING ─────────────────────────────────────────────
  {
    slug: 'crystalline-vs-membrane-waterproofing',
    category: 'waterproofing',
    titleA: 'Crystalline Waterproofing',
    titleB: 'Membrane Waterproofing (Bitumen/TPO)',
    question: 'Crystalline vs Membrane Waterproofing — Which is Better for Indian Roofs and Basements?',
    metaTitle: 'Crystalline vs Membrane Waterproofing India 2024 — Which Lasts Longer?',
    metaDescription: 'Crystalline vs membrane waterproofing comparison for Indian roofs and basements. Lifespan, cost, application and which waterproofing method is most durable.',
    keywords: ['crystalline waterproofing india', 'membrane waterproofing india', 'best waterproofing for roof india', 'crystalline vs bitumen waterproofing'],
    summary: 'Crystalline waterproofing works by forming crystals within concrete — integral and permanent. Membrane waterproofing is an external barrier that can degrade, peel, or puncture over time.',
    verdict: 'Crystalline waterproofing is the superior long-term solution for structural waterproofing of basements and foundations. Membrane systems work well for roofs and non-structural applications.',
    verdictWinner: 'a',
    priceA: '80-150',
    priceB: '60-200',
    priceUnit: '₹ per sq ft',
    specs: [
      { label: 'Lifespan', a: "Permanent (structure's life)", b: '10–15 years', winner: 'a' },
      { label: 'Self-healing', a: 'Yes (cracks up to 0.4mm)', b: 'No', winner: 'a' },
      { label: 'Works Under Pressure', a: 'Yes (negative and positive)', b: 'Positive side only', winner: 'a' },
      { label: 'Maintenance', a: 'Zero', b: 'Inspection every 5 years', winner: 'a' },
    ],
    pros: {
      a: ['Permanent — lasts lifetime of structure', 'Self-healing up to 0.4mm cracks', 'Works from either side of structure', 'No membrane to peel or puncture'],
      b: ['Lower upfront cost for roofs', 'Easier to apply (no special training)', 'Good for flat roof terrace waterproofing', 'Variety of systems for different needs'],
    },
    cons: {
      a: ['Higher skill level for application', 'More expensive than basic membranes', 'Cannot be applied to non-concrete substrates'],
      b: ['Membranes can peel, blister, or crack over time', 'Needs periodic inspection and maintenance', 'UV degradation over time'],
    },
    bestForA: ['Basement and underground construction', 'Water tanks and swimming pools', 'Foundation waterproofing'],
    bestForB: ['Terrace and roof waterproofing', 'Bathroom waterproofing', 'Planter boxes'],
    indianBrandsA: ['Dr. Fixit Krystalline', 'Sika Crystalline', 'Xypex', 'Vandex (Fosroc)', 'MasterProtect'],
    indianBrandsB: ['Dr. Fixit LW+', 'Sika Bituminous', 'MYK Laticrete', 'BASF Masterkure'],
    relatedSlugs: ['heat-proofing-vs-waterproofing-roof', 'rcc-slab-vs-tin-roof-india', 'opc-vs-ppc-cement-india'],
    publishedAt: '2024-05-10',
    updatedAt: '2024-11-01',
  },
  {
    slug: 'heat-proofing-vs-waterproofing-roof',
    category: 'insulation',
    titleA: 'Heat Proofing / Thermal Insulation',
    titleB: 'Standard Waterproofing Only',
    question: 'Heat Proofing vs Waterproofing — Should You Add Heat Insulation to Your Indian Roof?',
    metaTitle: 'Heat Proofing vs Waterproofing Roof India 2024 — Do You Need Both?',
    metaDescription: 'Heat proofing vs waterproofing for Indian roofs. Temperature reduction, energy savings, cost and whether heat proofing is worth adding to your roof.',
    keywords: ['heat proofing roof india', 'roof heat insulation india', 'roof waterproofing vs heat proofing', 'cool roof coating india'],
    summary: 'Heat proofing (thermal insulation/cool roof coatings) reduces interior temperatures by 5–12°C and cuts AC energy costs by 20–30%. Standard waterproofing only protects from water — not heat.',
    verdict: 'Both are needed but serve different purposes. Always waterproof first, then add heat insulation. Cool roof coating or foam insulation over waterproofing provides the best ROI for Indian homes in hot climates.',
    verdictWinner: 'tie',
    priceA: '60-180',
    priceB: '40-120',
    priceUnit: '₹ per sq ft',
    specs: [
      { label: 'Temperature Reduction', a: '5–12°C interior reduction', b: 'None', winner: 'a' },
      { label: 'Water Protection', a: 'Limited (coating only)', b: 'Full protection', winner: 'b' },
      { label: 'AC Energy Savings', a: '20–30%', b: '0%', winner: 'a' },
      { label: 'Cost', a: '₹60–180/sqft', b: '₹40–120/sqft', winner: 'b' },
    ],
    pros: {
      a: ['Significant temperature reduction', 'Major AC bill savings (payback in 2–4 years)', 'Improved comfort in top floor rooms'],
      b: ['Lower cost', 'Essential protection from water damage', 'Standard for all roofs'],
    },
    cons: {
      a: ['Needs waterproofing underneath', 'Higher cost', 'Some systems require professional application'],
      b: ['No heat reduction', 'Top-floor rooms remain very hot in summer', 'No AC cost savings'],
    },
    bestForA: ['Top-floor rooms that get very hot', 'Homes using AC extensively', 'Any Indian climate with hot summers'],
    bestForB: ['Covered/shaded roofs', 'Roofs not receiving direct sun', 'Budget-constrained projects (waterproof first)'],
    indianBrandsA: ['Dr. Fixit Heatshield', 'Asian Paints SmartCare', 'Pidilite Cool Roof', 'Berger Weathercoat Cool'],
    indianBrandsB: ['Dr. Fixit Waterproofing', 'Sika products', 'BASF Masterbuilder'],
    relatedSlugs: ['crystalline-vs-membrane-waterproofing', 'rcc-slab-vs-tin-roof-india', 'cement-paint-vs-acrylic-paint'],
    publishedAt: '2024-06-10',
    updatedAt: '2024-11-01',
  },
  // ── ELECTRICAL ───────────────────────────────────────────────
  {
    slug: 'copper-wire-vs-aluminium-wire-india',
    category: 'electrical',
    titleA: 'Copper Electrical Wire',
    titleB: 'Aluminium Electrical Wire',
    question: 'Copper vs Aluminium Electrical Wire — Which is Safer for Indian Homes?',
    metaTitle: 'Copper vs Aluminium Wire India 2024 — Which is Safer for Home Wiring?',
    metaDescription: 'Copper vs aluminium electrical wire for Indian home wiring. Safety, conductivity, cost and which wire is recommended for residential and commercial use.',
    keywords: ['copper vs aluminium wire india', 'best electrical wire for home india', 'copper wire vs aluminium wire safety', 'home wiring india'],
    summary: 'Copper wire is the standard for all residential Indian wiring — superior conductivity, safety, and flexibility. Aluminium wire is cheaper but has higher fire risk at connections and is no longer recommended for Indian home interiors.',
    verdict: 'Copper wire is the mandatory choice for all interior home wiring in India. Aluminium is acceptable only for main service entry cables and large industrial main lines.',
    verdictWinner: 'a',
    priceA: '28-55',
    priceB: '12-22',
    priceUnit: '₹ per metre (2.5 sq mm)',
    specs: [
      { label: 'Conductivity', a: 'Excellent (5.96×10⁷ S/m)', b: 'Good (3.5×10⁷ S/m)', winner: 'a' },
      { label: 'Fire Safety', a: 'High (stable joints)', b: 'Lower (oxidises at joints)', winner: 'a' },
      { label: 'Flexibility', a: 'Highly flexible', b: 'Less flexible, brittle', winner: 'a' },
      { label: 'Price', a: '₹28–55/m', b: '₹12–22/m', winner: 'b' },
      { label: 'Corrosion', a: 'Minimal', b: 'Oxidises and corrodes', winner: 'a' },
    ],
    pros: {
      a: ['Better conductivity (needs smaller size)', 'Safe at connections — no oxidation risk', 'Flexible — easy to work with', 'IS standard for Indian residential wiring', 'Long lifespan (40+ years)'],
      b: ['Much cheaper (50% less cost)', 'Lighter (useful for overhead lines)'],
    },
    cons: {
      a: ['More expensive', 'Heavier than aluminium'],
      b: ['Oxidises at joints — fire hazard', 'Less flexible — can crack during installation', 'Not recommended for home wiring'],
    },
    bestForA: ['ALL interior home and office wiring', 'All branch circuit wiring', 'Switches, outlets, and fixtures'],
    bestForB: ['Main service entry cables (large gauge only)', 'High-voltage transmission lines', 'Industrial overhead wiring with proper connectors'],
    indianBrandsA: ['Finolex Cables', 'Havells', 'Polycab', 'KEI Industries', 'RR Kabel'],
    indianBrandsB: ['Sterlite Cables (industrial)', 'Apar Industries (HT lines)'],
    relatedSlugs: ['cpvc-vs-upvc-pipes-india', 'overhead-tank-vs-underground-sump', 'aluminium-vs-upvc-windows'],
    publishedAt: '2024-05-20',
    updatedAt: '2024-11-01',
  },
  // ── PLUMBING ─────────────────────────────────────────────────
  {
    slug: 'overhead-tank-vs-underground-sump',
    category: 'plumbing',
    titleA: 'Overhead Water Tank',
    titleB: 'Underground Sump + Pump',
    question: 'Overhead Tank vs Underground Sump — Which Water Storage System for Indian Homes?',
    metaTitle: 'Overhead Tank vs Underground Sump India 2024 — Which Water System to Choose?',
    metaDescription: 'Overhead tank vs underground sump for Indian homes. Water pressure, cost, hygiene, pump requirements and which water storage system is best for your home.',
    keywords: ['overhead tank vs underground sump india', 'water storage system india', 'overhead tank vs sump', 'best water storage for home india'],
    summary: 'Overhead tanks use gravity for pressure distribution without pumps. Underground sumps store larger volumes but require a pump for distribution. Most Indian homes use both systems in combination.',
    verdict: 'The ideal Indian system is underground sump (large storage) + overhead tank (gravity distribution). Purely overhead-only works for apartments with municipal supply. Purely sump-only requires constant power.',
    verdictWinner: 'tie',
    priceA: '8000-25000',
    priceB: '15000-60000',
    priceUnit: '₹ per installation',
    specs: [
      { label: 'Water Pressure', a: 'Gravity (constant, lower)', b: 'Pump-driven (adjustable)', winner: 'b' },
      { label: 'Power Dependency', a: 'None (gravity)', b: 'High (pump dependent)', winner: 'a' },
      { label: 'Storage Capacity', a: '500–2000 litres (limited)', b: '5,000–50,000 litres', winner: 'b' },
      { label: 'Installation Cost', a: '₹8,000–25,000', b: '₹15,000–60,000', winner: 'a' },
      { label: 'Water Hygiene', a: 'Risk of algae in heat', b: 'Underground — cooler, cleaner', winner: 'b' },
    ],
    pros: {
      a: ['No electricity needed for distribution', 'Simple system — no pump failure risk', 'Lower cost', 'Gravity pressure sufficient for most taps'],
      b: ['Much larger storage capacity', 'Cooler water (underground)', 'No structural load on roof', 'Better for supply-deficient areas'],
    },
    cons: {
      a: ['Low pressure (not ideal for geysers/showers)', 'Adds load to roof structure', 'Heat exposure — algae growth risk', 'Limited capacity'],
      b: ['Requires electricity for pumping', 'Higher installation cost', 'Pump failure = no water supply'],
    },
    bestForA: ['Apartments with regular municipal supply', 'Areas with frequent power cuts', 'Simple low-water-usage homes'],
    bestForB: ['Individual bungalows and villas', 'Areas with intermittent municipal supply', 'Homes requiring large water storage'],
    indianBrandsA: ['Sintex LOFT tanks', 'Penguin Tanks', 'Vectus Tanks', 'Ashirvad Tanks'],
    indianBrandsB: ['Sintex Underground Tanks', 'Roto Tanks', 'Custom RCC sump'],
    relatedSlugs: ['cpvc-vs-upvc-pipes-india', 'gi-pipe-vs-cpvc-pipe', 'copper-wire-vs-aluminium-wire-india'],
    publishedAt: '2024-06-01',
    updatedAt: '2024-11-01',
  },
];

// ── Helper Functions ─────────────────────────────────────────────────────────

export function getCompareProduct(slug: string): CompareProduct | undefined {
  return compareProducts.find((p) => p.slug === slug);
}

export function getAllCompareSlugs(): string[] {
  return compareProducts.map((p) => p.slug);
}

export function getCompareByCategory(category: CompareCategory): CompareProduct[] {
  return compareProducts.filter((p) => p.category === category);
}

export function getFeaturedCompares(limit = 6): CompareProduct[] {
  return compareProducts.slice(0, limit);
}

export function getRelatedCompares(slug: string, limit = 3): CompareProduct[] {
  const product = getCompareProduct(slug);
  if (!product) return compareProducts.slice(0, limit);
  const related = compareProducts.filter((p) => product.relatedSlugs.includes(p.slug));
  const fill = compareProducts.filter(
    (p) => p.slug !== slug && !product.relatedSlugs.includes(p.slug) && p.category === product.category,
  );
  return [...related, ...fill].slice(0, limit);
}

export const compareCategories: {
  key: CompareCategory;
  label: string;
  icon: string;
  count: number;
}[] = [
  { key: 'cement', label: 'Cement & Concrete', icon: '🏗️', count: compareProducts.filter((p) => p.category === 'cement').length },
  { key: 'tiles', label: 'Tiles & Flooring', icon: '🟫', count: compareProducts.filter((p) => p.category === 'tiles').length },
  { key: 'paint', label: 'Paints & Coatings', icon: '🎨', count: compareProducts.filter((p) => p.category === 'paint').length },
  { key: 'pipes', label: 'Pipes & Plumbing', icon: '🔧', count: compareProducts.filter((p) => p.category === 'pipes').length },
  { key: 'flooring', label: 'Flooring Options', icon: '✨', count: compareProducts.filter((p) => p.category === 'flooring').length },
  { key: 'roofing', label: 'Roofing Systems', icon: '🏠', count: compareProducts.filter((p) => p.category === 'roofing').length },
  { key: 'steel', label: 'Steel & Structure', icon: '⚙️', count: compareProducts.filter((p) => p.category === 'steel').length },
  { key: 'glass', label: 'Glass & Windows', icon: '🪟', count: compareProducts.filter((p) => p.category === 'glass').length },
  { key: 'waterproofing', label: 'Waterproofing', icon: '💧', count: compareProducts.filter((p) => p.category === 'waterproofing').length },
  { key: 'electrical', label: 'Electrical', icon: '⚡', count: compareProducts.filter((p) => p.category === 'electrical').length },
  { key: 'plumbing', label: 'Water Systems', icon: '🚿', count: compareProducts.filter((p) => p.category === 'plumbing').length },
  { key: 'insulation', label: 'Insulation & Heat', icon: '🌡️', count: compareProducts.filter((p) => p.category === 'insulation').length },
];
