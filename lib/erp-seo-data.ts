/**
 * ─────────────────────────────────────────────────────────────────────────────
 *  lib/erp-seo-data.ts  —  All static data powering the /erp/* SEO pages
 * ─────────────────────────────────────────────────────────────────────────────
 */

// ─── ERP Features (modules) ───────────────────────────────────────────────────

export interface ErpFeature {
  slug: string;
  name: string;
  tagline: string;
  description: string;
  icon: string;
  color: string;
  price: string;
  priceNote: string;
  capabilities: string[];
  faqs: { q: string; a: string }[];
  metaTitle: string;
  metaDescription: string;
  keywords: string[];
}

export const ERP_FEATURES: ErpFeature[] = [
  {
    slug: 'site-manager',
    name: 'Site Manager',
    tagline: 'Run your entire construction site from one dashboard',
    description:
      'Biddaro Site Manager is a comprehensive construction site ERP — manage labor, track attendance, monitor materials, file daily progress reports, handle BOQ, equipment, invoices, and P&L all from one place.',
    icon: '🏗️',
    color: 'orange',
    price: '$12.99',
    priceNote: 'per month',
    capabilities: [
      'Labor & worker management with role assignment',
      'Daily attendance tracking (individual & bulk)',
      'Material inventory & stock transactions',
      'Daily Progress Reports (DPR) by date',
      'Bill of Quantities (BOQ) line items & rates',
      'Equipment fleet management & allocation',
      'Subcontractor vendor management',
      'Expense & invoice tracking',
      'Milestone & phase management',
      'P&L profitability analysis',
      'Client portal with token-based access',
      'Quality checks & procurement orders',
    ],
    faqs: [
      {
        q: 'What is construction site management software?',
        a: 'Construction site management software helps contractors and builders digitally manage all site operations — labor, materials, equipment, daily reports, and financials — replacing paper registers and spreadsheets.',
      },
      {
        q: 'Does Biddaro Site Manager work offline?',
        a: 'Biddaro Site Manager is a web-based application that works on any device with a browser. Data syncs in real time so foremen and site engineers can update records from the site on their smartphones.',
      },
      {
        q: 'Can I give my client access to the site dashboard?',
        a: 'Yes. Biddaro Site Manager includes a client portal with secure token-based access. Clients can view progress updates, photos, and milestone completion without logging into your account.',
      },
      {
        q: 'Is there a BOQ (Bill of Quantities) feature?',
        a: 'Yes. You can create and manage detailed BOQ entries with item descriptions, quantities, unit rates, and totals. BOQ data integrates with your P&L and expense tracking.',
      },
      {
        q: 'How much does Biddaro Site Manager cost?',
        a: 'Biddaro Site Manager is available as an add-on for $12.99/month. You can install it from your Biddaro dashboard under Add-Ons. No long-term commitment — cancel any time.',
      },
    ],
    metaTitle: 'Construction Site Management Software — Labor, BOQ & DPR | Biddaro',
    metaDescription:
      'Manage your construction site digitally. Track labor attendance, materials, BOQ, daily progress reports, equipment, invoices and P&L from one dashboard. Try Biddaro Site Manager free.',
    keywords: [
      'construction site management software',
      'site manager software for contractors',
      'BOQ software for construction',
      'daily progress report software construction',
      'construction attendance tracking software',
      'construction material tracking software',
      'construction ERP software India',
    ],
  },
  {
    slug: 'project-manager',
    name: 'Project Manager',
    tagline: 'Kanban boards, tasks, milestones and team collaboration',
    description:
      'Biddaro Project Manager gives construction teams a full-featured project management OS — Kanban task boards, milestone sprints, threaded discussions, file management, and time tracking — all linked to your contracts.',
    icon: '🗂️',
    color: 'blue',
    price: '$12.99',
    priceNote: 'per month',
    capabilities: [
      'Kanban board — Todo / In Progress / In Review / Done',
      'Tasks with priorities (Low, Medium, High, Urgent)',
      'Milestones & sprint planning',
      'Due dates and deadline alerts',
      'Threaded team discussions (pinned threads)',
      'File collaboration and document storage',
      'Time tracking per project',
      'Link projects to existing Biddaro contracts',
      'Project dashboard with completion metrics',
      'Color-coded project cards with emoji',
    ],
    faqs: [
      {
        q: 'What is construction project management software?',
        a: 'Construction project management software helps teams plan, assign, and track tasks across a project lifecycle — from planning and procurement through to handover — replacing scattered emails and WhatsApp groups.',
      },
      {
        q: 'Can I link Biddaro contracts to my projects?',
        a: 'Yes. Projects created in Biddaro Project Manager can be linked directly to contracts on the platform, giving you one unified workspace for both the financial and operational side of every job.',
      },
      {
        q: 'How many team members can I add to a project?',
        a: 'You can invite unlimited team members to collaborate on projects. Each member can be assigned tasks, participate in discussions, and upload files based on their role.',
      },
      {
        q: 'Does Biddaro have a Kanban board for construction?',
        a: 'Yes. Biddaro Project Manager includes a full Kanban board with four columns — Todo, In Progress, In Review, and Done — so teams can visualise work status at a glance.',
      },
    ],
    metaTitle: 'Construction Project Management Software — Kanban & Milestones | Biddaro',
    metaDescription:
      'Manage construction projects with Kanban boards, task priorities, milestone sprints, team discussions and time tracking. Biddaro Project Manager links to your contracts. Start free.',
    keywords: [
      'construction project management software',
      'contractor project management app',
      'construction task management software',
      'construction Kanban board',
      'project management software for builders',
      'construction team collaboration software',
    ],
  },
  {
    slug: 'build-planner',
    name: 'Build Planner',
    tagline: 'Plan every phase of your construction project end-to-end',
    description:
      'Biddaro Build Planner lets you map out every phase of a construction project — site map, exterior, interior, plumbing, electrical, structural, HVAC, and finishes — with auto-populated checklists, material tracking, and a final blueprint report.',
    icon: '📐',
    color: 'amber',
    price: '$9.99',
    priceNote: 'per month',
    capabilities: [
      'Planning sections: Site Map, Exterior, Interior, Plumbing, Electrical, Structural, HVAC, Finishes',
      'Auto-populated checklists per section type',
      'Blueprint & image upload per section',
      'Material tracking with status (Pending → Ordered → Delivered → Installed)',
      'Cost tracking — estimated vs actual spend',
      'Achievement badges on section completion',
      'Notes and annotations per section',
      'Final Construction Blueprint report export',
      'Multiple build plan types (residential, commercial, renovation)',
      'Progress percentage tracking',
    ],
    faqs: [
      {
        q: 'What is a construction build planner?',
        a: 'A construction build planner is a digital tool that helps homeowners and contractors plan every phase of a building project — from foundation and structure to interiors and finishes — with checklists, material lists, and cost estimates.',
      },
      {
        q: 'Can I use the Build Planner for renovation projects?',
        a: 'Yes. Biddaro Build Planner supports multiple project types including new home construction, commercial builds, and renovation projects. Each type comes with relevant pre-built section checklists.',
      },
      {
        q: 'Does the Build Planner track construction costs?',
        a: 'Yes. Each section includes estimated and actual cost tracking. You can see budget vs spend at the section level and in aggregate across the entire project.',
      },
      {
        q: 'Can I upload blueprints and drawings?',
        a: 'Yes. Each planning section supports image and blueprint uploads, so you can store all your design files alongside the checklist items and material lists in one place.',
      },
    ],
    metaTitle: 'Home Construction Planner Software — Checklists, Materials & Blueprint | Biddaro',
    metaDescription:
      'Plan every phase of your construction project digitally. Manage checklists, materials, electrical, plumbing, structural plans and generate a final blueprint report. Try Biddaro Build Planner.',
    keywords: [
      'home construction planner software',
      'construction planning software India',
      'build planner app for contractors',
      'construction checklist software',
      'construction project planning tool',
      'renovation planning software',
    ],
  },
  {
    slug: 'project-tracking',
    name: 'Project Tracking',
    tagline: 'Live progress updates, photos and completion percentages',
    description:
      'Biddaro Project Tracking lets contractors post live progress updates with photos and completion percentages, while clients get a real-time dashboard feed — replacing site visit calls and scattered WhatsApp messages.',
    icon: '📡',
    color: 'green',
    price: '$7.99',
    priceNote: 'per month',
    capabilities: [
      'Live progress update feed per contract',
      'Photo and file attachments on updates',
      'Completion percentage tracking with visual bar',
      'Timestamped update history',
      'Client-facing live dashboard',
      'Multiple update types: progress, note, photo, milestone',
      'Instant push notifications on new updates',
      'Active contract summary dashboard',
      'Mobile-friendly for on-site updates',
    ],
    faqs: [
      {
        q: 'What is live construction project tracking?',
        a: 'Live construction project tracking lets contractors post real-time updates — progress percentages, photos, and notes — from the site, so clients can monitor project status without requiring site visits or daily phone calls.',
      },
      {
        q: 'Can clients see project progress without creating an account?',
        a: 'Clients linked to a contract on Biddaro can view the live project tracking feed directly through their Biddaro dashboard. No separate app or account is needed for the client.',
      },
      {
        q: 'How do contractors post updates?',
        a: "Contractors open the Project Tracking section from their Biddaro dashboard, select the active contract, and post an update with a progress percentage, description, and optional photos — all from their phone or computer.",
      },
      {
        q: 'Does Biddaro notify clients when updates are posted?',
        a: 'Yes. Clients receive real-time push notifications and in-app notifications whenever a contractor posts a new progress update on their project.',
      },
    ],
    metaTitle: 'Live Construction Project Tracking Software — Progress Updates & Photos | Biddaro',
    metaDescription:
      'Post live construction progress updates with photos and completion percentages. Clients get a real-time dashboard. Replace site visit calls with Biddaro Project Tracking. Try free.',
    keywords: [
      'construction project tracking software',
      'live construction progress tracking',
      'construction progress update app',
      'contractor client update software',
      'construction site progress photos',
      'real time construction tracking',
    ],
  },
];

export function getErpFeature(slug: string): ErpFeature | undefined {
  return ERP_FEATURES.find(f => f.slug === slug);
}

// ─── Comparison Pages ─────────────────────────────────────────────────────────

export interface ErpComparison {
  slug: string;
  competitor: string;
  competitorDesc: string;
  metaTitle: string;
  metaDescription: string;
  verdict: string;
  biddaroAdvantages: string[];
  competitorAdvantages: string[];
  features: { feature: string; biddaro: string; competitor: string; winner: 'biddaro' | 'competitor' | 'tie' }[];
  faqs: { q: string; a: string }[];
}

export const ERP_COMPARISONS: ErpComparison[] = [
  {
    slug: 'procore',
    competitor: 'Procore',
    competitorDesc: 'US-based enterprise construction management platform used by large general contractors.',
    metaTitle: 'Biddaro vs Procore — Construction Software Comparison 2025',
    metaDescription:
      'Comparing Biddaro ERP vs Procore for construction management. Biddaro is the affordable Procore alternative built for Indian, UAE and Southeast Asian contractors. See feature comparison.',
    verdict:
      'Procore is built for large US general contractors and carries enterprise pricing to match. Biddaro delivers the same core ERP capabilities — site management, task tracking, progress reporting — at a fraction of the cost, making it the clear choice for SME contractors in India, UAE, and Singapore.',
    biddaroAdvantages: [
      'Starts at $7.99/month — Procore costs $375–$899/month',
      'Built-in bidding & contract marketplace',
      'Razorpay + Stripe payment integration for Indian & global market',
      'Escrow-based milestone payments protect both parties',
      'No annual commitment required',
      'Localized for India, UAE, Singapore with INR/AED/SGD support',
    ],
    competitorAdvantages: [
      'Larger ecosystem with 300+ integrations',
      'Advanced financial management for large GCs',
      'Dedicated enterprise support',
    ],
    features: [
      { feature: 'Site Management', biddaro: '✅ Full', competitor: '✅ Full', winner: 'tie' },
      { feature: 'Task & Kanban Board', biddaro: '✅ Included', competitor: '✅ Included', winner: 'tie' },
      { feature: 'Daily Progress Reports', biddaro: '✅ Included', competitor: '✅ Included', winner: 'tie' },
      { feature: 'BOQ Management', biddaro: '✅ Included', competitor: '✅ Included', winner: 'tie' },
      { feature: 'Labor & Attendance', biddaro: '✅ Included', competitor: '✅ Included', winner: 'tie' },
      { feature: 'Starting Price', biddaro: '$7.99/mo', competitor: '$375/mo', winner: 'biddaro' },
      { feature: 'Built-in Job Marketplace', biddaro: '✅ Yes', competitor: '❌ No', winner: 'biddaro' },
      { feature: 'Escrow Payments', biddaro: '✅ Yes', competitor: '❌ No', winner: 'biddaro' },
      { feature: 'India / UAE Localization', biddaro: '✅ Full (INR/AED/SGD)', competitor: '⚠️ Partial', winner: 'biddaro' },
      { feature: 'Free Tier', biddaro: '✅ Free marketplace', competitor: '❌ No free tier', winner: 'biddaro' },
    ],
    faqs: [
      {
        q: 'Is Biddaro a good Procore alternative for Indian contractors?',
        a: 'Yes. Biddaro offers the same core construction management capabilities as Procore — site management, BOQ, DPR, task tracking — at a price point that works for SME contractors in India. Biddaro also includes an integrated bidding marketplace and escrow payment system that Procore does not offer.',
      },
      {
        q: 'How much cheaper is Biddaro than Procore?',
        a: "Procore's entry-level plan starts at approximately $375/month. Biddaro's full ERP suite starts at $7.99/month per module. For a typical SME contractor using all four ERP modules, the total is under $40/month — over 90% cheaper.",
      },
      {
        q: 'Does Biddaro have all the features of Procore?',
        a: 'Biddaro covers all the core construction management features that SME contractors use in Procore: site management, task boards, progress tracking, BOQ, attendance, materials, and P&L. Large enterprise GCs who need advanced ERP integrations may find Procore more suitable.',
      },
    ],
  },
  {
    slug: 'buildertrend',
    competitor: 'Buildertrend',
    competitorDesc: 'US-based construction management software popular with residential home builders.',
    metaTitle: 'Biddaro vs Buildertrend — Construction Software Comparison 2025',
    metaDescription:
      'Biddaro vs Buildertrend: which construction management software is better for your business? See feature comparison, pricing and verdict. Biddaro is the Buildertrend alternative for Asia.',
    verdict:
      'Buildertrend is a solid residential construction tool for the US market. Biddaro offers comparable project planning, tracking, and client communication features at significantly lower cost, with full localization for India, UAE, and Singapore.',
    biddaroAdvantages: [
      'Up to 80% cheaper than Buildertrend',
      'Full India / UAE / Singapore currency and location support',
      'Built-in contractor marketplace with bid management',
      'Escrow-based milestone payments included',
      'No per-user pricing — flat monthly add-on fee',
    ],
    competitorAdvantages: [
      'Stronger scheduling (Gantt charts)',
      'More integrations with US accounting software',
      'Longer track record in US residential market',
    ],
    features: [
      { feature: 'Project Tracking', biddaro: '✅ Live feed + photos', competitor: '✅ Full', winner: 'tie' },
      { feature: 'Build Planning', biddaro: '✅ Full checklist system', competitor: '✅ Full', winner: 'tie' },
      { feature: 'Client Portal', biddaro: '✅ Token-based', competitor: '✅ Full', winner: 'tie' },
      { feature: 'Starting Price', biddaro: '$7.99/mo', competitor: '$199/mo', winner: 'biddaro' },
      { feature: 'Asia Market Support', biddaro: '✅ India, UAE, SG', competitor: '❌ US only', winner: 'biddaro' },
      { feature: 'Gantt Charts', biddaro: '⚠️ Milestone-based', competitor: '✅ Full Gantt', winner: 'competitor' },
      { feature: 'Bid Marketplace', biddaro: '✅ Yes', competitor: '❌ No', winner: 'biddaro' },
      { feature: 'Escrow Payments', biddaro: '✅ Yes', competitor: '❌ No', winner: 'biddaro' },
    ],
    faqs: [
      {
        q: 'Is Biddaro better than Buildertrend for Indian contractors?',
        a: "Yes. Buildertrend is built primarily for the US residential market and does not support INR pricing, Indian tax structures, or local payment methods. Biddaro is built specifically for India, UAE, and Singapore with full currency and location support.",
      },
      {
        q: 'Does Biddaro have a client portal like Buildertrend?',
        a: 'Yes. Biddaro offers a client portal where homeowners can view live project updates, photos, and milestone progress — similar to the Buildertrend client portal, at no extra cost.',
      },
    ],
  },
  {
    slug: 'fieldwire',
    competitor: 'Fieldwire',
    competitorDesc: 'Field management software focused on plan management and task coordination for field crews.',
    metaTitle: 'Biddaro vs Fieldwire — Construction Software Comparison 2025',
    metaDescription:
      'Biddaro vs Fieldwire for construction field management. Compare features, pricing and support. Biddaro adds an integrated marketplace and payments that Fieldwire does not offer.',
    verdict:
      'Fieldwire excels at plan management and field task coordination. Biddaro offers a broader ERP scope — site management, financials, attendance, BOQ, and an integrated project marketplace — making it a more complete solution for contractors who need more than just task tracking.',
    biddaroAdvantages: [
      'Complete ERP: attendance, materials, BOQ, P&L — not just tasks',
      'Built-in bidding marketplace to find new jobs',
      'Escrow payment protection',
      'Significantly cheaper for full feature set',
    ],
    competitorAdvantages: [
      'Superior plan (drawing) markup tools',
      'Better punch list workflows',
      'Strong BIM integration',
    ],
    features: [
      { feature: 'Task Management', biddaro: '✅ Kanban + priorities', competitor: '✅ Strong', winner: 'tie' },
      { feature: 'Plan Markup', biddaro: '⚠️ Image upload', competitor: '✅ Full markup', winner: 'competitor' },
      { feature: 'Attendance Tracking', biddaro: '✅ Full', competitor: '❌ No', winner: 'biddaro' },
      { feature: 'BOQ / Financials', biddaro: '✅ Full', competitor: '❌ No', winner: 'biddaro' },
      { feature: 'Material Tracking', biddaro: '✅ Full', competitor: '❌ Limited', winner: 'biddaro' },
      { feature: 'Starting Price', biddaro: '$7.99/mo', competitor: '$0 (5 projects)', winner: 'tie' },
      { feature: 'Bid Marketplace', biddaro: '✅ Yes', competitor: '❌ No', winner: 'biddaro' },
    ],
    faqs: [
      {
        q: 'What does Fieldwire have that Biddaro does not?',
        a: 'Fieldwire has more advanced plan markup and punch list features. If your workflow heavily depends on digital plan annotations, Fieldwire may be a better fit for that specific capability.',
      },
      {
        q: 'What does Biddaro have that Fieldwire does not?',
        a: 'Biddaro includes labor attendance tracking, BOQ management, material inventory, P&L analysis, and an integrated job bidding marketplace with escrow payments — features that Fieldwire does not offer.',
      },
    ],
  },
  {
    slug: 'excel',
    competitor: 'Excel / Spreadsheets',
    competitorDesc: 'Microsoft Excel or Google Sheets used manually for construction project tracking.',
    metaTitle: 'Construction ERP Software vs Excel — Why Contractors Are Making the Switch | Biddaro',
    metaDescription:
      'Still using Excel to manage your construction site? See why 10,000+ contractors switched to Biddaro ERP — real-time updates, team collaboration, BOQ, attendance, and DPR in one place.',
    verdict:
      'Excel works until your team grows past 2–3 people. Version conflicts, accidental overwrites, and manual data entry kill productivity on active construction sites. Biddaro replaces the entire spreadsheet stack with a purpose-built ERP your whole team can use in real time, from any device.',
    biddaroAdvantages: [
      'Real-time data — no more "which version is correct?"',
      'Mobile-friendly — update from the site on any phone',
      'Automatic BOQ calculations and material cost rollups',
      'Attendance marked by foreman, synced instantly to office',
      'Client portal — share progress without emailing spreadsheets',
      'Audit trail — every change is logged with timestamp and user',
      'Photo attachments — attach site photos to daily reports',
      'Starts at $7.99/month — less than one cup of coffee per day',
    ],
    competitorAdvantages: [
      'No monthly cost if you already own Office/Google Workspace',
      'Familiar interface for most users',
      'Fully customizable structure',
    ],
    features: [
      { feature: 'Real-time collaboration', biddaro: '✅ Yes', competitor: '⚠️ Google Sheets only', winner: 'biddaro' },
      { feature: 'Mobile app (site use)', biddaro: '✅ Full mobile web', competitor: '⚠️ Limited', winner: 'biddaro' },
      { feature: 'Photo attachments on reports', biddaro: '✅ Yes', competitor: '❌ No', winner: 'biddaro' },
      { feature: 'Automatic BOQ calculations', biddaro: '✅ Yes', competitor: '⚠️ Manual formulas', winner: 'biddaro' },
      { feature: 'Attendance tracking', biddaro: '✅ Yes', competitor: '❌ Manual', winner: 'biddaro' },
      { feature: 'Audit trail', biddaro: '✅ Full history', competitor: '❌ No', winner: 'biddaro' },
      { feature: 'Client portal', biddaro: '✅ Yes', competitor: '❌ Email only', winner: 'biddaro' },
      { feature: 'Monthly cost', biddaro: '$7.99/mo', competitor: '$0–$12/mo (Office 365)', winner: 'tie' },
    ],
    faqs: [
      {
        q: 'Why should I switch from Excel to construction ERP software?',
        a: 'Excel becomes a liability on active construction sites because multiple people need to update data simultaneously from different locations. Version conflicts, manual calculation errors, and no mobile access lead to costly mistakes. A purpose-built ERP like Biddaro gives your team one shared, real-time system.',
      },
      {
        q: 'Is Biddaro ERP easy to learn if my team uses Excel?',
        a: 'Yes. Biddaro is designed for construction professionals, not software engineers. Most teams are up and running within a day. The interface is simple, mobile-friendly, and mirrors the workflows your team already follows on-site.',
      },
      {
        q: 'How much does it cost to switch to Biddaro from Excel?',
        a: 'Biddaro ERP modules start at $7.99/month. Most construction companies save this amount many times over in reduced rework, fewer material wastage incidents, and faster client approvals.',
      },
    ],
  },
];

export function getErpComparison(slug: string): ErpComparison | undefined {
  return ERP_COMPARISONS.find(c => c.slug === slug);
}

// ─── Use-Case / Segment Pages ─────────────────────────────────────────────────

export interface ErpSegment {
  slug: string;
  name: string;
  headline: string;
  description: string;
  painPoints: string[];
  solutions: { module: string; moduleSlug: string; benefit: string }[];
  metaTitle: string;
  metaDescription: string;
  faqs: { q: string; a: string }[];
}

export const ERP_SEGMENTS: ErpSegment[] = [
  {
    slug: 'home-builders',
    name: 'Home Builders',
    headline: 'Construction ERP Built for Home Builders & Residential Contractors',
    description:
      'Manage every home construction project from plot to possession. Biddaro gives residential builders digital tools to plan phases, track materials, keep clients updated, and never miss a milestone.',
    painPoints: [
      'Clients calling every day asking for progress updates',
      'Material quantities going wrong due to manual tracking',
      'Subcontractor attendance not recorded properly',
      'No clear view of actual vs estimated costs per phase',
      'Blueprints and drawings scattered across WhatsApp and email',
    ],
    solutions: [
      { module: 'Build Planner', moduleSlug: 'build-planner', benefit: 'Map every phase from foundation to finishes with auto-checklists' },
      { module: 'Project Tracking', moduleSlug: 'project-tracking', benefit: 'Post daily progress updates and photos — clients stop calling' },
      { module: 'Site Manager', moduleSlug: 'site-manager', benefit: 'Track material inventory, attendance, and per-phase costs in real time' },
    ],
    metaTitle: 'Construction ERP Software for Home Builders | Biddaro',
    metaDescription:
      'Purpose-built construction management software for residential home builders. Plan phases, track materials, update clients in real time, and manage costs from one dashboard. Try Biddaro free.',
    faqs: [
      {
        q: 'What software do home builders use to manage projects?',
        a: 'Most home builders use a combination of Excel spreadsheets, WhatsApp groups, and paper registers. Biddaro ERP consolidates all of these into one platform designed specifically for residential construction.',
      },
      {
        q: 'Can I manage multiple home construction projects at the same time?',
        a: 'Yes. Biddaro lets you create unlimited build plans and site manager projects, so you can manage several residential construction sites simultaneously from one dashboard.',
      },
    ],
  },
  {
    slug: 'civil-contractors',
    name: 'Civil Contractors',
    headline: 'Construction ERP for Civil Contractors — Roads, Bridges & Infrastructure',
    description:
      'Manage civil infrastructure projects with digital BOQ, labor tracking, DPR submission, equipment allocation, and subcontractor management. Biddaro ERP is built for the demands of civil construction.',
    painPoints: [
      'BOQ deviations going untracked until the final bill',
      'Equipment idle time and double-bookings costing money',
      'DPR submission delays causing client disputes',
      'Labor attendance disputes with no paper trail',
      'Subcontractor billing going over agreed rates',
    ],
    solutions: [
      { module: 'Site Manager', moduleSlug: 'site-manager', benefit: 'BOQ management, DPR by date, equipment fleet allocation, and subcontractor billing' },
      { module: 'Project Manager', moduleSlug: 'project-manager', benefit: 'Task boards for civil work packages with deadlines and responsibility assignment' },
      { module: 'Project Tracking', moduleSlug: 'project-tracking', benefit: 'Daily progress updates with geo-tagged photos for client and authority reporting' },
    ],
    metaTitle: 'Construction ERP Software for Civil Contractors | Biddaro',
    metaDescription:
      'ERP software built for civil contractors. Digital BOQ, daily progress reports, labor attendance, equipment management, and subcontractor billing. Manage roads, bridges and infrastructure projects on Biddaro.',
    faqs: [
      {
        q: 'Can Biddaro handle large civil infrastructure projects?',
        a: 'Yes. Biddaro Site Manager supports unlimited sections, workers, materials, and equipment entries. Large civil projects can be broken into phases or work packages managed as separate projects.',
      },
      {
        q: 'Does Biddaro support government DPR formats?',
        a: "Biddaro's Daily Progress Report feature lets you record date-wise progress with quantities and notes. The data can be exported for formatting in your client's required template.",
      },
    ],
  },
  {
    slug: 'mep-contractors',
    name: 'MEP Contractors',
    headline: 'Construction ERP for MEP Contractors — Mechanical, Electrical & Plumbing',
    description:
      'MEP contractors need precise material tracking, skilled labor scheduling, and coordination with civil teams. Biddaro ERP gives MEP contractors the tools to run tight, profitable projects.',
    painPoints: [
      'Material shortages halting work due to poor inventory visibility',
      'Skilled workers being paid for idle time between tasks',
      'No coordination system between MEP and civil teams',
      'Installation milestones being disputed for billing purposes',
      'Change orders not being tracked and billed properly',
    ],
    solutions: [
      { module: 'Site Manager', moduleSlug: 'site-manager', benefit: 'Material inventory with status tracking — ordered, delivered, installed — by work type' },
      { module: 'Project Manager', moduleSlug: 'project-manager', benefit: 'Coordinate MEP work packages with civil team on a shared task board' },
      { module: 'Project Tracking', moduleSlug: 'project-tracking', benefit: 'Photo-documented installation milestones for dispute-free billing' },
    ],
    metaTitle: 'Construction ERP Software for MEP Contractors | Biddaro',
    metaDescription:
      'ERP software for Mechanical, Electrical and Plumbing (MEP) contractors. Track materials, schedule skilled labor, coordinate with civil teams, and document milestones. Try Biddaro ERP free.',
    faqs: [
      {
        q: 'Can Biddaro track MEP materials separately from civil materials?',
        a: 'Yes. Biddaro Site Manager lets you create separate material categories for electrical, plumbing, mechanical, and other material types, each with their own inventory and transaction tracking.',
      },
      {
        q: 'Does Biddaro help MEP contractors bid on jobs?',
        a: "Yes. Biddaro's core marketplace lets MEP contractors find and bid on construction jobs posted by builders and project owners, integrated directly with the project management tools.",
      },
    ],
  },
  {
    slug: 'real-estate-developers',
    name: 'Real Estate Developers',
    headline: 'Construction ERP for Real Estate Developers & Project Owners',
    description:
      'Real estate developers need visibility across multiple contractors, transparent cost tracking, and client-ready progress reporting. Biddaro ERP connects the job marketplace with full project oversight.',
    painPoints: [
      'No single dashboard to see progress across multiple sites',
      'Contractors submitting bills without supporting progress evidence',
      'Escrow and milestone payments managed through offline channels',
      'Client and investor updates requiring manual preparation',
      'Hiring contractors without verified credentials or reviews',
    ],
    solutions: [
      { module: 'Project Tracking', moduleSlug: 'project-tracking', benefit: 'Real-time progress feed from contractors with photos — ready for client and investor updates' },
      { module: 'Site Manager', moduleSlug: 'site-manager', benefit: "P&L and expense tracking across your site with contractor cost breakdown" },
      { module: 'Project Manager', moduleSlug: 'project-manager', benefit: 'Cross-contractor task coordination with milestone tracking and deadline visibility' },
    ],
    metaTitle: 'Construction ERP Software for Real Estate Developers | Biddaro',
    metaDescription:
      'ERP and project management tools for real estate developers. Manage multiple contractors, track progress with photos, handle escrow milestone payments, and report to investors. Try Biddaro.',
    faqs: [
      {
        q: 'Can I manage multiple construction sites from one Biddaro account?',
        a: 'Yes. Biddaro lets you create unlimited projects and build plans. You can monitor progress across all active sites from one dashboard without switching accounts.',
      },
      {
        q: 'How does Biddaro protect against contractor payment disputes?',
        a: 'Biddaro uses escrow-based milestone payments. Funds are held securely and released only when you approve a completed milestone. Every approval and release is logged with timestamp.',
      },
    ],
  },
  {
    slug: 'renovation-contractors',
    name: 'Renovation Contractors',
    headline: 'Construction ERP for Renovation & Fit-Out Contractors',
    description:
      'Renovation jobs move fast and clients have high expectations. Biddaro ERP gives renovation contractors the tools to plan scope, track materials, keep clients in the loop daily, and close jobs without disputes.',
    painPoints: [
      'Scope creep from undocumented change requests',
      'Material cost overruns due to poor tracking',
      'Client dissatisfaction from lack of daily visibility',
      'Subcontractor coordination across parallel work streams',
      'No proof of work for final billing disputes',
    ],
    solutions: [
      { module: 'Build Planner', moduleSlug: 'build-planner', benefit: 'Document scope for each room or area with checklists, photos, and material lists' },
      { module: 'Project Tracking', moduleSlug: 'project-tracking', benefit: 'Post daily before-and-after photos so clients can see progress in real time' },
      { module: 'Site Manager', moduleSlug: 'site-manager', benefit: 'Track renovation materials with ordered/delivered/installed status to prevent overbuying' },
    ],
    metaTitle: 'Construction ERP Software for Renovation Contractors | Biddaro',
    metaDescription:
      'ERP tools for renovation and fit-out contractors. Plan scope, track materials, post daily photo updates to clients, and avoid billing disputes with documented milestone evidence. Try Biddaro.',
    faqs: [
      {
        q: 'Is Biddaro suitable for small renovation jobs?',
        a: "Yes. Biddaro works for jobs of any size. For small renovations, you can use just the Build Planner or Project Tracking module without the full site management suite. You only pay for what you install.",
      },
      {
        q: 'Can I share daily progress photos with my renovation client?',
        a: "Yes. Biddaro's Project Tracking module lets you post daily progress updates with photos. Your client receives instant notifications and can view the full update history from their dashboard.",
      },
    ],
  },
];

export function getErpSegment(slug: string): ErpSegment | undefined {
  return ERP_SEGMENTS.find(s => s.slug === slug);
}

// ─── ERP FAQ Topics ───────────────────────────────────────────────────────────

export interface ErpFaqTopic {
  slug: string;
  question: string;
  answer: string;
  relatedTopics: string[];
  metaTitle: string;
  metaDescription: string;
}

export const ERP_FAQ_TOPICS: ErpFaqTopic[] = [
  {
    slug: 'what-is-construction-erp',
    question: 'What is Construction ERP Software?',
    answer: `Construction ERP (Enterprise Resource Planning) software is a digital platform that integrates all aspects of running a construction business into one system. Instead of using separate tools for project management, accounting, inventory, attendance, and reporting, a construction ERP connects them so data flows automatically between functions.

A modern construction ERP typically includes:
- **Project Management**: Task assignment, milestones, and deadlines
- **Site Management**: Labor attendance, material inventory, equipment tracking
- **Financial Management**: BOQ, P&L, invoicing, expense tracking
- **Document Management**: Blueprints, DPRs, contracts, and certifications
- **Client Communication**: Progress updates, portals, and notifications

Biddaro ERP adds a unique layer that traditional construction ERP software does not — an integrated job marketplace where contractors find work, bid on projects, and manage payments through escrow, all within the same platform.`,
    relatedTopics: ['construction-erp-vs-project-management', 'erp-for-small-contractors', 'cloud-based-construction-erp'],
    metaTitle: 'What is Construction ERP Software? | Biddaro ERP Guide',
    metaDescription: 'Construction ERP software explained: what it is, what features it includes, and how it helps contractors and builders manage sites, materials, labor, finances, and clients from one platform.',
  },
  {
    slug: 'construction-erp-vs-project-management',
    question: 'What is the Difference Between Construction ERP and Project Management Software?',
    answer: `Construction **project management software** focuses on planning and executing a specific project — tasks, timelines, resources, and collaboration. It answers: "Is this project on track?"

Construction **ERP software** goes further. It integrates project execution with business operations — payroll, procurement, inventory, financials, and multi-site management. It answers: "Is my entire business healthy?"

In practice for a construction contractor:
- **Project management tool**: Helps your team complete today's tasks on Site A
- **Construction ERP**: Shows you that Site A is profitable, Site B is overspending on materials, your best foreman is overallocated, and you have a payment due to Supplier X this Friday

Biddaro ERP bridges both — it includes project management features (Kanban boards, milestones, task assignments) built inside a broader construction ERP (attendance, BOQ, P&L, procurement). You get both in one platform starting at $7.99/month.`,
    relatedTopics: ['what-is-construction-erp', 'erp-for-small-contractors'],
    metaTitle: 'Construction ERP vs Project Management Software — What\'s the Difference? | Biddaro',
    metaDescription: 'Learn the difference between construction ERP software and project management software. Find out which one your construction business needs and how Biddaro combines both.',
  },
  {
    slug: 'erp-for-small-contractors',
    question: 'Do Small Construction Contractors Need ERP Software?',
    answer: `Yes — and arguably small contractors benefit *more* from ERP software than large ones. Here is why:

**Large companies** can afford dedicated staff for procurement, HR, accounting, and project management. The operational gaps get filled by people.

**Small contractors** — with teams of 5 to 50 — often have one person juggling all of these roles. Every hour spent on manual data entry, hunting down attendance registers, or reconciling material bills is an hour not spent on the actual job.

Signs a small contractor needs ERP software:
- You have lost money on a job without knowing exactly where it went
- Clients have complained about not knowing the project status
- You have discovered material shortages only after work halted
- Your attendance records have been disputed by workers
- You are managing three or more active sites simultaneously

Biddaro ERP is specifically designed for small and medium construction businesses. The Site Manager, Project Manager, Build Planner, and Project Tracking modules are each independently affordable ($7.99–$12.99/month) and work without an IT department.`,
    relatedTopics: ['what-is-construction-erp', 'cloud-based-construction-erp'],
    metaTitle: 'Do Small Construction Contractors Need ERP Software? | Biddaro',
    metaDescription: 'Find out if your small construction business needs ERP software, the signs that you do, and how Biddaro makes enterprise-grade construction management affordable for contractors of any size.',
  },
  {
    slug: 'cloud-based-construction-erp',
    question: 'What are the Benefits of Cloud-Based Construction ERP?',
    answer: `Cloud-based construction ERP software runs in the browser — no installation, no servers, no IT team required. This makes it fundamentally different from legacy on-premise ERP systems.

**Key benefits of cloud construction ERP:**

**1. Access from anywhere**
Site engineers update attendance from the site on their phone. The project manager reviews reports from home. The client checks progress from another city. All in real time.

**2. No software maintenance**
Updates happen automatically. You never pay for upgrades or deal with compatibility issues.

**3. Lower upfront cost**
Legacy ERP required large one-time purchases ($20,000–$100,000+). Cloud ERP like Biddaro starts at $7.99/month with no setup fees.

**4. Scales with your business**
Add new projects, team members, and modules as your business grows — without changing infrastructure.

**5. Data security**
Your data is backed up automatically and stored securely in the cloud — far safer than a server in your site office.

Biddaro ERP is fully cloud-based, works on any device, and requires no installation. Your team can be up and running the same day.`,
    relatedTopics: ['what-is-construction-erp', 'construction-erp-vs-project-management'],
    metaTitle: 'Benefits of Cloud-Based Construction ERP Software | Biddaro',
    metaDescription: 'Discover why cloud-based construction ERP beats legacy on-premise software for contractors. Real-time access, lower cost, automatic updates, and better data security. Learn more.',
  },
  {
    slug: 'construction-attendance-tracking',
    question: 'How to Track Construction Worker Attendance Digitally?',
    answer: `Manual attendance registers on construction sites have several problems: they can be manipulated, get damaged by weather, require manual consolidation, and create disputes at payroll time.

**Digital attendance tracking with Biddaro Site Manager:**

1. **Add your workers** — Enter worker names, roles, and daily wage rates in your Site Manager project
2. **Mark daily attendance** — Foremen mark attendance from their phone each morning. Bulk marking lets you update the entire crew in under a minute
3. **Real-time sync** — Attendance data syncs instantly to the site dashboard, visible to the project manager and owner
4. **Automatic cost calculation** — Daily wages are calculated automatically based on attendance and configured rates
5. **Audit trail** — Every attendance entry is logged with the time and user who submitted it — disputes are resolved with evidence, not memory

Biddaro Site Manager's attendance module supports:
- Individual daily marking
- Bulk marking for the entire crew
- Multiple attendance types (present, absent, half-day, overtime)
- Monthly attendance summaries`,
    relatedTopics: ['what-is-construction-erp', 'erp-for-small-contractors'],
    metaTitle: 'How to Track Construction Worker Attendance Digitally | Biddaro ERP',
    metaDescription: 'Step-by-step guide to tracking construction worker attendance digitally. Replace paper registers with Biddaro Site Manager — mark attendance from the site, auto-calculate wages, resolve disputes.',
  },
  {
    slug: 'what-is-boq-construction',
    question: 'What is BOQ in Construction and How to Manage It with Software?',
    answer: `**BOQ (Bill of Quantities)** is a document that lists all the materials, labour, and other items required to complete a construction project, along with their quantities and unit rates. It forms the basis for contractor pricing, project cost control, and final billing.

**Components of a construction BOQ:**
- Item description (e.g., "Brick masonry — 9 inch wall")
- Unit of measurement (sqft, cubic meter, running metre, number)
- Quantity
- Unit rate (cost per unit)
- Total amount (quantity × rate)

**Why manual BOQ management fails:**
- Quantity errors in large spreadsheets are common and costly
- Updating rates across hundreds of items is time-consuming
- No real-time comparison between BOQ and actual spend
- Version control problems when multiple people edit the same file

**Managing BOQ with Biddaro Site Manager:**
1. Create BOQ line items with description, unit, quantity, and rate
2. Biddaro calculates totals automatically
3. Track actual material consumption against BOQ quantities in real time
4. Compare BOQ budget vs actual spend in the P&L dashboard
5. Generate BOQ reports for client billing and dispute resolution`,
    relatedTopics: ['what-is-construction-erp', 'construction-attendance-tracking'],
    metaTitle: 'What is BOQ in Construction? How to Manage BOQ with Software | Biddaro',
    metaDescription: 'Understand what Bill of Quantities (BOQ) means in construction and how to manage BOQ digitally with software. Track quantities, rates, and actual spend vs budget in real time with Biddaro.',
  },
  {
    slug: 'daily-progress-report-construction',
    question: 'How to Create and Submit Daily Progress Reports (DPR) for Construction Sites?',
    answer: `A **Daily Progress Report (DPR)** is a document submitted by the site engineer or contractor to the project owner or consultant every working day. It records what work was completed, how many workers were present, materials used, equipment deployed, weather conditions, and issues encountered.

**Why DPRs matter:**
- They create a documented timeline of project progress
- They form the basis for billing milestone claims
- They protect contractors in case of dispute
- They are often required by clients, consultants, and funding institutions

**Creating DPR with Biddaro Site Manager:**

1. Open your Site Manager project
2. Go to the **DPR (Daily Progress Reports)** section
3. Select the date for the report
4. Enter work completed, worker count, materials used, and any issues
5. Attach photos from the site
6. Submit — the DPR is saved with timestamp and accessible to the project team

**Best practices for DPR:**
- Submit the same day — never backfill multiple days at once
- Attach at least 3–5 site photos per report
- Record the name of the engineer who submitted the report
- Note any deviations from the approved plan or schedule`,
    relatedTopics: ['what-is-boq-construction', 'construction-attendance-tracking'],
    metaTitle: 'How to Create Daily Progress Reports (DPR) for Construction Sites | Biddaro',
    metaDescription: 'Complete guide to construction Daily Progress Reports (DPR): what to include, best practices, and how to create and submit DPRs digitally using Biddaro Site Manager.',
  },
  {
    slug: 'construction-material-tracking',
    question: 'How to Track Construction Materials and Prevent Site Wastage?',
    answer: `Material wastage is one of the biggest hidden costs in construction. Industry estimates suggest that 5–15% of all materials purchased on a construction site are wasted due to over-ordering, theft, damage from improper storage, or incorrect installation.

**Common causes of material waste:**
- No visibility into what was ordered vs what arrived vs what was used
- Ordering in bulk to "be safe" rather than tracking actual consumption
- Materials going missing without any audit trail
- Subcontractors using more than their allocated quantity

**Tracking materials with Biddaro Site Manager:**

1. **Add materials** — Create entries for each material type: cement, steel, bricks, sand, electrical fittings, plumbing materials, etc.
2. **Log transactions** — Record every purchase (ordered), delivery (received), and usage (consumed) with quantity and date
3. **Status tracking** — Each material batch moves through Pending → Ordered → Delivered → Installed
4. **Cost tracking** — Enter unit rates and Biddaro calculates material cost totals automatically
5. **Inventory visibility** — The dashboard shows current stock levels so you can reorder at the right time — not too early, not too late
6. **Transaction history** — Full audit trail of who recorded what and when

With Biddaro, site managers can check material status from their phone at any time, and project owners get a dashboard view of total material costs vs budget.`,
    relatedTopics: ['what-is-boq-construction', 'daily-progress-report-construction'],
    metaTitle: 'How to Track Construction Materials and Prevent Wastage | Biddaro ERP',
    metaDescription: 'Learn how to track construction materials digitally to reduce wastage and overspending. Use Biddaro Site Manager to log orders, deliveries, and usage with full audit trail.',
  },
];

export function getErpFaqTopic(slug: string): ErpFaqTopic | undefined {
  return ERP_FAQ_TOPICS.find(t => t.slug === slug);
}

// ─── Top Indian Cities for ERP City Pages ────────────────────────────────────

export interface ErpCity {
  name: string;
  slug: string;
  state: string;
  stateSlug: string;
  region: string;
  constructionNote: string;    // city-specific context for content
}

export const ERP_INDIA_CITIES: ErpCity[] = [
  { name: 'Mumbai', slug: 'mumbai', state: 'Maharashtra', stateSlug: 'maharashtra', region: 'West India', constructionNote: 'high-rise residential and commercial construction boom' },
  { name: 'Delhi', slug: 'delhi', state: 'Delhi', stateSlug: 'delhi', region: 'North India', constructionNote: 'infrastructure, government, and mixed-use development projects' },
  { name: 'Bengaluru', slug: 'bengaluru', state: 'Karnataka', stateSlug: 'karnataka', region: 'South India', constructionNote: 'IT campus, commercial, and residential apartment construction' },
  { name: 'Hyderabad', slug: 'hyderabad', state: 'Telangana', stateSlug: 'telangana', region: 'South India', constructionNote: 'rapid commercial and residential expansion in Hitech City' },
  { name: 'Chennai', slug: 'chennai', state: 'Tamil Nadu', stateSlug: 'tamil-nadu', region: 'South India', constructionNote: 'industrial, port infrastructure, and residential construction' },
  { name: 'Pune', slug: 'pune', state: 'Maharashtra', stateSlug: 'maharashtra', region: 'West India', constructionNote: 'fast-growing residential and IT corridor development' },
  { name: 'Ahmedabad', slug: 'ahmedabad', state: 'Gujarat', stateSlug: 'gujarat', region: 'West India', constructionNote: 'industrial and smart city infrastructure projects' },
  { name: 'Jaipur', slug: 'jaipur', state: 'Rajasthan', stateSlug: 'rajasthan', region: 'North India', constructionNote: 'residential townships and heritage-sensitive renovation work' },
  { name: 'Surat', slug: 'surat', state: 'Gujarat', stateSlug: 'gujarat', region: 'West India', constructionNote: 'textile industry and diamond trade commercial construction' },
  { name: 'Lucknow', slug: 'lucknow', state: 'Uttar Pradesh', stateSlug: 'uttar-pradesh', region: 'North India', constructionNote: 'government infrastructure and residential housing schemes' },
  { name: 'Kolkata', slug: 'kolkata', state: 'West Bengal', stateSlug: 'west-bengal', region: 'East India', constructionNote: 'mixed-use urban redevelopment and infrastructure works' },
  { name: 'Coimbatore', slug: 'coimbatore', state: 'Tamil Nadu', stateSlug: 'tamil-nadu', region: 'South India', constructionNote: 'manufacturing hub with industrial construction and expansion' },
  { name: 'Bhopal', slug: 'bhopal', state: 'Madhya Pradesh', stateSlug: 'madhya-pradesh', region: 'Central India', constructionNote: 'state government projects and residential urbanization' },
  { name: 'Nagpur', slug: 'nagpur', state: 'Maharashtra', stateSlug: 'maharashtra', region: 'Central India', constructionNote: 'smart city mission projects and logistics hub construction' },
  { name: 'Visakhapatnam', slug: 'visakhapatnam', state: 'Andhra Pradesh', stateSlug: 'andhra-pradesh', region: 'South India', constructionNote: 'port expansion, industrial and residential development' },
  { name: 'Kochi', slug: 'kochi', state: 'Kerala', stateSlug: 'kerala', region: 'South India', constructionNote: 'waterfront commercial and luxury residential projects' },
  { name: 'Indore', slug: 'indore', state: 'Madhya Pradesh', stateSlug: 'madhya-pradesh', region: 'Central India', constructionNote: "India's cleanest city with active smart infrastructure upgrades" },
  { name: 'Chandigarh', slug: 'chandigarh', state: 'Punjab', stateSlug: 'punjab', region: 'North India', constructionNote: 'planned city with premium residential and commercial construction' },
  { name: 'Noida', slug: 'noida', state: 'Uttar Pradesh', stateSlug: 'uttar-pradesh', region: 'North India', constructionNote: 'Delhi-NCR high-rise and commercial real estate expansion' },
  { name: 'Gurgaon', slug: 'gurgaon', state: 'Haryana', stateSlug: 'haryana', region: 'North India', constructionNote: 'corporate campus and premium residential tower construction' },
];

export function getErpCity(slug: string): ErpCity | undefined {
  return ERP_INDIA_CITIES.find(c => c.slug === slug);
}

// Alias for city pages
export const getErpIndiaCity = getErpCity;
