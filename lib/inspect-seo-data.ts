/**
 * ─────────────────────────────────────────────────────────────────────────────
 *  lib/inspect-seo-data.ts  —  All static data powering /biddaro-inspect/* SEO pages
 * ─────────────────────────────────────────────────────────────────────────────
 */

// ─── Competitor comparison types ─────────────────────────────────────────────

export interface ComparisonFeature {
  name: string;
  biddaro: string;
  competitor: string;
}

export interface InspectCompetitor {
  slug: string;
  name: string;
  tagline: string;
  description: string;
  price: string;
  biddaro_price: string;
  features: ComparisonFeature[];
  biddaro_wins: { title: string; description: string }[];
  faqs: { q: string; a: string }[];
}

export const INSPECT_COMPETITORS: InspectCompetitor[] = [
  {
    slug: 'buildinspect',
    name: 'BuildInspect',
    tagline: 'AI-powered reports vs legacy checklists',
    description:
      'BuildInspect is a checklist-based mobile inspection tool popular with property managers. It lacks AI report generation and forces users into rigid templates.',
    price: '$59/month',
    biddaro_price: 'From $19/month',
    features: [
      { name: 'AI Report Generation', biddaro: '✅ Writes full narrative reports', competitor: '❌ Checklist output only' },
      { name: 'Custom Templates', biddaro: '✅ Upload your own Word/PDF', competitor: '⚡ Limited preset templates' },
      { name: 'Offline Mode', biddaro: '✅ Full offline capture + sync', competitor: '⚡ Partial offline' },
      { name: 'Voice Notes + Transcription', biddaro: '✅ Included', competitor: '❌ Not available' },
      { name: 'Photo Annotation', biddaro: '✅ On-device annotation', competitor: '✅ Basic annotation' },
      { name: 'Word (.docx) Export', biddaro: '✅ Branded .docx output', competitor: '❌ PDF only' },
      { name: 'GPS Tagging', biddaro: '✅ Included', competitor: '✅ Included' },
      { name: 'Client Portal', biddaro: '✅ Shareable link', competitor: '⚡ Email only' },
      { name: 'Free Trial', biddaro: '✅ 14 days free', competitor: '⚡ 7 days' },
    ],
    biddaro_wins: [
      {
        title: 'AI writes the full report',
        description:
          'Biddaro Inspect uses AI to turn your field notes into a complete, client-ready narrative report — not just a filled-in checklist. You spend minutes reviewing, not hours writing.',
      },
      {
        title: 'Your templates, not ours',
        description:
          'Upload your existing Word doc or PDF template and Biddaro replicates it exactly. BuildInspect forces you into their fixed layouts.',
      },
      {
        title: 'Half the price',
        description:
          "Biddaro Inspect starts at $19/month — less than a third of BuildInspect's cost — with no per-user fees for small teams.",
      },
    ],
    faqs: [
      {
        q: 'What is the main difference between Biddaro Inspect and BuildInspect?',
        a: 'Biddaro Inspect uses AI to generate full written inspection reports in your own format. BuildInspect produces checklist-style PDFs and cannot write narrative text or match custom templates.',
      },
      {
        q: 'Can I switch from BuildInspect to Biddaro without losing my data?',
        a: 'Yes. You can export your historical reports from BuildInspect and upload your template to Biddaro in minutes. Our team also offers free onboarding assistance.',
      },
      {
        q: 'Does Biddaro Inspect support the same inspection types as BuildInspect?',
        a: 'Biddaro Inspect supports all major inspection types — property, construction, safety, MEP, and more — because it adapts to any template you provide.',
      },
      {
        q: 'Is Biddaro cheaper than BuildInspect?',
        a: "Yes. Biddaro Inspect starts at $19/month versus BuildInspect's $59/month, with no per-report fees.",
      },
      {
        q: 'Does Biddaro Inspect work on iOS and Android?',
        a: 'Yes. Biddaro Inspect has native apps for iOS and Android, plus a web app for desktop use.',
      },
    ],
  },
  {
    slug: 'propcheck',
    name: 'PropCheck',
    tagline: 'AI narrative reports vs basic PDF forms',
    description:
      'PropCheck focuses on property condition reports for real-estate agents. It generates PDF forms but lacks AI writing, Word export, or construction-grade features.',
    price: '$49/month',
    biddaro_price: 'From $19/month',
    features: [
      { name: 'AI Report Generation', biddaro: '✅ Full narrative AI writing', competitor: '❌ Form fill only' },
      { name: 'Custom Templates', biddaro: '✅ Any Word/PDF template', competitor: '❌ Fixed property templates' },
      { name: 'Offline Mode', biddaro: '✅ Full offline', competitor: '❌ Online required' },
      { name: 'Voice Notes + Transcription', biddaro: '✅ Included', competitor: '❌ Not available' },
      { name: 'Construction Inspections', biddaro: '✅ Full support', competitor: '❌ Property only' },
      { name: 'Word (.docx) Export', biddaro: '✅ Branded .docx', competitor: '❌ PDF only' },
      { name: 'GPS Photo Tagging', biddaro: '✅ Included', competitor: '⚡ Basic' },
      { name: 'Team Collaboration', biddaro: '✅ Multi-user', competitor: '⚡ Solo focus' },
      { name: 'Free Trial', biddaro: '✅ 14 days free', competitor: '✅ 14 days' },
    ],
    biddaro_wins: [
      {
        title: 'Works for every inspection type',
        description:
          'PropCheck is built only for real-estate property reports. Biddaro Inspect handles construction, safety, MEP, electrical, and any custom inspection your business needs.',
      },
      {
        title: 'Offline-first for field use',
        description:
          'PropCheck requires an internet connection. Biddaro Inspect works fully offline and syncs automatically — critical for basements, remote sites, and underground structures.',
      },
      {
        title: 'Branded Word exports',
        description:
          'PropCheck exports generic PDFs. Biddaro Inspect exports branded Word documents in your exact format — the format clients and engineers actually want.',
      },
    ],
    faqs: [
      {
        q: 'Can Biddaro Inspect replace PropCheck for property inspections?',
        a: 'Yes. Biddaro Inspect handles all property inspection types including condition reports, pre-settlement inspections, and handover reports, with full AI report writing.',
      },
      {
        q: 'Does Biddaro support real-estate inspection workflows?',
        a: 'Absolutely. Upload your existing property report template and Biddaro generates professional, narrative reports in minutes.',
      },
      {
        q: 'Why is PropCheck limited compared to Biddaro?',
        a: 'PropCheck was designed for a single use case — property condition reports for agents. Biddaro Inspect is a universal inspection platform that adapts to any industry.',
      },
      {
        q: 'Can I work offline with Biddaro Inspect?',
        a: 'Yes. Biddaro Inspect works fully offline. Photos, voice notes, and observations are captured locally and synced when connectivity resumes.',
      },
      {
        q: 'How does pricing compare?',
        a: 'Biddaro Inspect starts at $19/month. PropCheck starts at $49/month. Both offer 14-day free trials.',
      },
    ],
  },
  {
    slug: 'siteinspect-pro',
    name: 'SiteInspect Pro',
    tagline: 'Modern AI reports vs outdated desktop software',
    description:
      'SiteInspect Pro is a legacy desktop inspection tool with a dated interface. It requires Windows installation, offers no AI writing, and exports are slow and rigid.',
    price: '$89/month',
    biddaro_price: 'From $19/month',
    features: [
      { name: 'AI Report Generation', biddaro: '✅ Instant AI drafts', competitor: '❌ Manual typing only' },
      { name: 'Mobile App', biddaro: '✅ iOS & Android native', competitor: '❌ Windows desktop only' },
      { name: 'Cloud Storage', biddaro: '✅ All data in the cloud', competitor: '❌ Local files only' },
      { name: 'Offline Mode', biddaro: '✅ Full offline mobile', competitor: '⚡ Desktop offline' },
      { name: 'Custom Templates', biddaro: '✅ Any format', competitor: '⚡ Rigid presets' },
      { name: 'Word (.docx) Export', biddaro: '✅ Instant export', competitor: '⚡ Slow generation' },
      { name: 'Voice Notes', biddaro: '✅ With transcription', competitor: '❌ Not available' },
      { name: 'Real-time Collaboration', biddaro: '✅ Multi-user cloud', competitor: '❌ Single user' },
      { name: 'Pricing', biddaro: '⚡ $19/month', competitor: '❌ $89/month' },
    ],
    biddaro_wins: [
      {
        title: 'Mobile-first, not desktop-only',
        description:
          'SiteInspect Pro is Windows desktop software from a different era. Biddaro Inspect is a mobile-first platform — capture on site with iOS or Android, review anywhere.',
      },
      {
        title: 'AI does the writing for you',
        description:
          "SiteInspect Pro requires you to manually type every observation into its interface. Biddaro's AI turns your photos, voice, and brief notes into full professional reports.",
      },
      {
        title: '78% cheaper',
        description:
          'At $89/month, SiteInspect Pro costs nearly 5× more than Biddaro Inspect. You get more features for a fraction of the price.',
      },
    ],
    faqs: [
      {
        q: 'Is Biddaro Inspect better than SiteInspect Pro?',
        a: 'Biddaro Inspect offers AI report generation, mobile apps, cloud storage, and real-time collaboration — none of which are available in SiteInspect Pro — at a lower price.',
      },
      {
        q: 'Can I migrate my SiteInspect Pro reports to Biddaro?',
        a: 'Yes. You can upload your SiteInspect Pro report templates to Biddaro and continue generating the same format with AI assistance.',
      },
      {
        q: 'Does Biddaro work on Mac and iPad?',
        a: 'Yes. Biddaro Inspect has a web app for Mac and a native app for iPad and iPhone.',
      },
      {
        q: 'Can multiple inspectors use Biddaro at the same time?',
        a: 'Yes. Biddaro Inspect supports multi-user collaboration with real-time cloud sync.',
      },
      {
        q: 'Is SiteInspect Pro still being updated?',
        a: 'SiteInspect Pro is legacy software with infrequent updates. Biddaro Inspect ships new features monthly.',
      },
    ],
  },
  {
    slug: 'inspectify',
    name: 'Inspectify',
    tagline: 'Construction-grade AI vs home-inspection only tool',
    description:
      'Inspectify is built for residential home inspectors. It lacks construction, MEP, and safety inspection workflows and cannot match custom enterprise report formats.',
    price: '$45/month',
    biddaro_price: 'From $19/month',
    features: [
      { name: 'AI Report Generation', biddaro: '✅ Full AI narrative', competitor: '⚡ AI for home only' },
      { name: 'Construction Inspections', biddaro: '✅ All types', competitor: '❌ Home inspection only' },
      { name: 'Custom Templates', biddaro: '✅ Any format', competitor: '❌ Fixed home templates' },
      { name: 'MEP Inspections', biddaro: '✅ Included', competitor: '❌ Not supported' },
      { name: 'Safety Audits', biddaro: '✅ Included', competitor: '❌ Not supported' },
      { name: 'Word (.docx) Export', biddaro: '✅ Branded Word files', competitor: '❌ PDF only' },
      { name: 'Offline Mode', biddaro: '✅ Full offline', competitor: '⚡ Limited' },
      { name: 'Team / Enterprise Use', biddaro: '✅ Multi-user, roles', competitor: '⚡ Single inspector focus' },
      { name: 'Free Trial', biddaro: '✅ 14 days', competitor: '✅ 14 days' },
    ],
    biddaro_wins: [
      {
        title: 'Built for construction, not just homes',
        description:
          'Inspectify is designed exclusively for residential home inspectors. Biddaro Inspect handles construction, MEP, safety, property, and any other inspection type your business needs.',
      },
      {
        title: 'True custom templates',
        description:
          "Inspectify locks you into home-inspection formats. Biddaro Inspect replicates any existing report format — construction, commercial, government, or bespoke.",
      },
      {
        title: 'Cheaper with more features',
        description:
          'Biddaro Inspect costs less than Inspectify while offering more inspection types, better AI, and Word export.',
      },
    ],
    faqs: [
      {
        q: 'What types of inspections does Biddaro support vs Inspectify?',
        a: 'Inspectify supports residential home inspections. Biddaro Inspect supports any inspection type — construction, property, safety, MEP, electrical, and custom.',
      },
      {
        q: 'Can contractors use Biddaro Inspect for commercial projects?',
        a: 'Yes. Biddaro Inspect is built for commercial contractors, project managers, and QS professionals, not just home inspectors.',
      },
      {
        q: 'Does Biddaro Inspect generate home inspection reports?',
        a: 'Yes. Biddaro Inspect generates any type of inspection report, including residential condition and home buyer reports.',
      },
      {
        q: 'Which has better AI — Biddaro or Inspectify?',
        a: "Biddaro's AI writes full narrative text adapting to your company voice and report format. Inspectify's AI is limited to home-inspection templates.",
      },
      {
        q: 'Does Biddaro offer team accounts?',
        a: 'Yes. Biddaro Inspect supports multi-user team accounts with role-based access — inspector, reviewer, and admin roles.',
      },
    ],
  },
  {
    slug: 'fieldwire',
    name: 'Fieldwire',
    tagline: 'Lightweight inspection AI vs heavy project management',
    description:
      'Fieldwire is a construction project management platform with basic inspection features. Its inspection reports are secondary to its core task and plan management, lacking AI report writing.',
    price: '$54/month',
    biddaro_price: 'From $19/month',
    features: [
      { name: 'AI Report Generation', biddaro: '✅ Dedicated AI writing', competitor: '❌ Manual task notes' },
      { name: 'Custom Report Templates', biddaro: '✅ Your exact format', competitor: '❌ Generic exports' },
      { name: 'Dedicated Inspection Workflow', biddaro: '✅ Built for inspections', competitor: '⚡ Task-management focus' },
      { name: 'Voice Note Transcription', biddaro: '✅ Included', competitor: '❌ Not available' },
      { name: 'Word (.docx) Export', biddaro: '✅ Branded', competitor: '❌ PDF only' },
      { name: 'Offline Mode', biddaro: '✅ Full offline', competitor: '✅ Offline available' },
      { name: 'Plan / Blueprint Markup', biddaro: '⚡ Basic', competitor: '✅ Advanced' },
      { name: 'Pricing', biddaro: '⚡ $19/month', competitor: '❌ $54/month' },
      { name: 'Free Trial', biddaro: '✅ 14 days', competitor: '✅ 14 days' },
    ],
    biddaro_wins: [
      {
        title: 'Purpose-built for inspection reports',
        description:
          'Fieldwire is a project management tool where inspections are a minor feature. Biddaro Inspect is built specifically for inspection report generation — the AI, templates, and workflow are all optimised for it.',
      },
      {
        title: 'AI turns notes into full reports',
        description:
          'Fieldwire lets you write task notes. Biddaro Inspect uses AI to turn those observations into a complete, professional, client-ready inspection report in minutes.',
      },
      {
        title: 'Simpler, cheaper, faster',
        description:
          "Fieldwire's complexity and price point are designed for large project teams. Biddaro Inspect is simpler, faster to learn, and costs less — ideal for inspection-focused firms.",
      },
    ],
    faqs: [
      {
        q: 'Can Biddaro Inspect replace Fieldwire for inspections?',
        a: 'If your primary need is inspection report generation, Biddaro Inspect is a better fit. For full project management with plan markup, Fieldwire may serve additional needs.',
      },
      {
        q: 'Does Biddaro Inspect have plan markup features?',
        a: 'Biddaro Inspect includes basic photo annotation. For advanced blueprint markup, it integrates with project management tools.',
      },
      {
        q: 'Which is easier to learn — Biddaro or Fieldwire?',
        a: 'Biddaro Inspect is significantly simpler. Inspectors are productive within minutes; no training program required.',
      },
      {
        q: 'Can I use Biddaro alongside Fieldwire?',
        a: 'Yes. Many teams use Biddaro Inspect for report generation and Fieldwire for task management, since each tool excels at its core function.',
      },
      {
        q: 'Is Biddaro Inspect good for construction snag lists?',
        a: 'Yes. Biddaro Inspect is ideal for snag lists and defect reports — capture items on site and generate a formatted report instantly.',
      },
    ],
  },
];

// ─── Template types ───────────────────────────────────────────────────────────

export type TemplateCategory = 'Construction' | 'Property' | 'Safety' | 'MEP' | 'Electrical';

export interface InspectTemplate {
  slug: string;
  title: string;
  category: TemplateCategory;
  description: string;
  sections: string[];
  useCase: string;
  whoUses: string;
  faqs: { q: string; a: string }[];
  related: string[];
}

export const INSPECT_TEMPLATES: InspectTemplate[] = [
  {
    slug: 'construction-site-inspection',
    title: 'Construction Site Inspection Report',
    category: 'Construction',
    description: 'A comprehensive template for documenting construction site conditions, progress, safety compliance, and defects.',
    sections: ['Project Details', 'Site Safety Conditions', 'Structural Progress', 'Material Compliance', 'Defects & Non-Conformances', 'Photographic Evidence', 'Recommendations', 'Sign-off'],
    useCase: 'Ideal for site engineers, QS professionals, and project managers conducting weekly or milestone inspections.',
    whoUses: 'Construction project managers, site engineers, quantity surveyors',
    faqs: [
      { q: 'What should a construction site inspection report include?', a: 'It should include project details, site safety observations, structural progress, material compliance checks, documented defects, photographic evidence, and inspector sign-off.' },
      { q: 'How often should construction site inspections be conducted?', a: 'Most projects require weekly site inspections at minimum, with additional inspections at key milestones such as foundation completion, structural frame, and pre-handover.' },
      { q: 'Who is responsible for site inspection reports?', a: 'Site inspection reports are typically the responsibility of the site engineer, project manager, or appointed clerk of works.' },
      { q: 'Can I use this template digitally?', a: 'Yes. Upload this template to Biddaro Inspect and generate completed reports automatically using field photos and voice notes.' },
      { q: 'Is this template compliant with construction standards?', a: 'This template is designed to align with common construction inspection practices. Always verify compliance with your local regulatory requirements.' },
    ],
    related: ['concrete-inspection', 'structural-inspection', 'site-safety-audit'],
  },
  {
    slug: 'property-condition-report',
    title: 'Property Condition Report Template',
    category: 'Property',
    description: 'Document the condition of a residential or commercial property for sale, lease, or handover with this structured template.',
    sections: ['Property Details', 'Exterior Condition', 'Interior Condition', 'Roof & Drainage', 'Plumbing & Sanitation', 'Electrical Systems', 'HVAC', 'Defects Summary', 'Photographs', 'Inspector Notes'],
    useCase: 'Used by property managers, building inspectors, and real-estate professionals for condition documentation.',
    whoUses: 'Property managers, building inspectors, real-estate agents, facility managers',
    faqs: [
      { q: 'What is a property condition report?', a: 'A property condition report (PCR) documents the observable physical condition of a property at a specific point in time, noting any defects, maintenance needs, or concerns.' },
      { q: 'Who needs a property condition report?', a: 'PCRs are required for property sales, lease agreements, handovers, and insurance purposes. They protect both landlords and tenants.' },
      { q: 'How long does a property condition inspection take?', a: 'Residential PCRs typically take 1–3 hours depending on property size. Commercial properties may require a full day.' },
      { q: 'Can this template be used for commercial properties?', a: 'Yes. The template includes sections for mechanical systems, electrical, and HVAC that apply to commercial properties.' },
      { q: 'Is a property condition report a legal document?', a: 'When signed by a qualified inspector, a PCR can serve as a legal record. Requirements vary by jurisdiction.' },
    ],
    related: ['pre-settlement-inspection', 'rental-condition-report', 'handover-inspection'],
  },
  {
    slug: 'pre-settlement-inspection',
    title: 'Pre-Settlement Inspection Checklist',
    category: 'Property',
    description: 'Systematic checklist for buyers to inspect a property before settlement to verify agreed conditions and identify last-minute defects.',
    sections: ['Buyer & Property Details', 'Agreed Repairs Verification', 'Inclusions Checklist', 'Room-by-Room Inspection', 'Exterior & Grounds', 'Services & Utilities', 'Defects Found', 'Sign-off'],
    useCase: 'Used by home buyers and their agents to conduct final inspections before property settlement.',
    whoUses: 'Home buyers, real-estate agents, buyer advocates',
    faqs: [
      { q: 'What is a pre-settlement inspection?', a: 'A pre-settlement inspection is a final walkthrough conducted by the buyer before property settlement to ensure the property is in the agreed condition and all included items are present.' },
      { q: 'When should a pre-settlement inspection be done?', a: 'Pre-settlement inspections should be conducted 1–3 days before the scheduled settlement date.' },
      { q: 'What happens if defects are found?', a: 'If new defects are found, the buyer can request remediation before settlement or negotiate a price reduction.' },
      { q: 'How is this different from a building inspection?', a: "A pre-settlement inspection verifies the property's condition has not changed since exchange. A building inspection is a detailed structural assessment." },
      { q: 'Can I use this template in Biddaro Inspect?', a: 'Yes. Upload this checklist to Biddaro Inspect and complete it on your mobile device with photo documentation.' },
    ],
    related: ['property-condition-report', 'handover-inspection', 'rental-condition-report'],
  },
  {
    slug: 'site-safety-audit',
    title: 'Construction Site Safety Audit Template',
    category: 'Safety',
    description: 'Comprehensive safety audit template covering PPE compliance, hazard identification, emergency procedures, and regulatory requirements.',
    sections: ['Site Details', 'PPE Compliance', 'Hazard Identification', 'Fall Protection', 'Electrical Safety', 'Fire Safety', 'Emergency Procedures', 'Incident Records', 'Corrective Actions', 'Inspector Sign-off'],
    useCase: 'Used by HSE officers, site supervisors, and safety consultants for routine and unannounced safety audits.',
    whoUses: 'HSE officers, site supervisors, safety consultants, project managers',
    faqs: [
      { q: 'What is a construction site safety audit?', a: "A construction site safety audit systematically evaluates a site's compliance with safety regulations, identifying hazards and corrective actions required." },
      { q: 'How often should safety audits be conducted?', a: 'Most regulations require monthly safety audits at minimum. High-risk sites may require weekly or daily checks.' },
      { q: 'What regulations does this template align with?', a: 'This template is designed to align with common construction safety regulations. Always verify against your local workplace safety legislation.' },
      { q: 'Who can conduct a site safety audit?', a: 'Safety audits should be conducted by a qualified HSE officer or appointed safety representative.' },
      { q: 'Can this template generate a compliant safety report?', a: 'Yes. Use Biddaro Inspect to complete this audit on-site and generate a compliant PDF or Word report instantly.' },
    ],
    related: ['construction-site-inspection', 'fire-safety-inspection', 'electrical-safety-inspection'],
  },
  {
    slug: 'mep-inspection',
    title: 'MEP Inspection Report Template',
    category: 'MEP',
    description: 'Mechanical, Electrical, and Plumbing (MEP) inspection template for new builds, fit-outs, and commissioning verification.',
    sections: ['Project Details', 'Mechanical Systems', 'HVAC Inspection', 'Electrical Distribution', 'Plumbing Systems', 'Fire Protection Systems', 'BMS Verification', 'Punch List', 'Sign-off'],
    useCase: 'Used by MEP engineers, commissioning agents, and building services consultants during construction and fit-out.',
    whoUses: 'MEP engineers, commissioning agents, building services consultants',
    faqs: [
      { q: 'What does MEP inspection cover?', a: 'MEP inspection covers the installation, testing, and commissioning of mechanical (HVAC), electrical, and plumbing systems within a building.' },
      { q: 'When are MEP inspections required?', a: 'MEP inspections are typically required at rough-in stage, pre-plaster, pre-commissioning, and at practical completion.' },
      { q: 'Who conducts MEP inspections?', a: 'MEP inspections are conducted by qualified MEP engineers, commissioning agents, or the project building services consultant.' },
      { q: 'What is the difference between MEP inspection and commissioning?', a: 'MEP inspection verifies installation compliance. Commissioning tests actual system performance against design specifications.' },
      { q: 'Can I use this template for a fit-out inspection?', a: 'Yes. This template is suitable for commercial fit-out MEP inspections, including offices, retail, and hospitality projects.' },
    ],
    related: ['electrical-safety-inspection', 'plumbing-inspection', 'hvac-inspection'],
  },
  {
    slug: 'electrical-safety-inspection',
    title: 'Electrical Safety Inspection Report',
    category: 'Electrical',
    description: 'Structured template for documenting electrical safety inspections including switchboard checks, earthing, circuit testing, and compliance.',
    sections: ['Installation Details', 'Visual Inspection', 'Switchboard Assessment', 'Earthing & Bonding', 'Circuit Testing', 'RCD Testing', 'Labelling & Documentation', 'Defects', 'Test Results', 'Inspector Certification'],
    useCase: 'Used by licensed electricians and electrical inspectors for residential, commercial, and industrial electrical safety certificates.',
    whoUses: 'Licensed electricians, electrical inspectors, facilities managers',
    faqs: [
      { q: 'What is an electrical safety inspection?', a: 'An electrical safety inspection assesses the condition and compliance of electrical installations to ensure they are safe and meet current standards.' },
      { q: 'How often should electrical inspections be done?', a: 'Residential installations: every 10 years. Commercial: every 5 years. Rental properties: at tenancy changes. Requirements vary by jurisdiction.' },
      { q: 'What qualifications are needed to conduct electrical inspections?', a: 'Electrical inspections must be conducted by a licensed electrician or approved electrical inspector.' },
      { q: 'What is an electrical safety certificate?', a: 'An electrical safety certificate is issued after a compliant inspection, certifying that the installation meets applicable safety standards.' },
      { q: 'Does this template produce a compliant electrical inspection report?', a: 'This template follows standard inspection formats. Use Biddaro Inspect to generate a completed report with your licence details and test results.' },
    ],
    related: ['mep-inspection', 'site-safety-audit', 'fire-safety-inspection'],
  },
  {
    slug: 'concrete-inspection',
    title: 'Concrete Works Inspection Report',
    category: 'Construction',
    description: 'Template for inspecting concrete pours, curing, finish quality, and structural compliance during construction.',
    sections: ['Project & Pour Details', 'Pre-pour Checklist', 'Pour Observation', 'Slump Test Results', 'Curing Method', 'Post-pour Inspection', 'Defects & Remediation', 'Sign-off'],
    useCase: 'Used by structural engineers and site supervisors to document concrete works compliance.',
    whoUses: 'Structural engineers, site supervisors, quality assurance officers',
    faqs: [
      { q: 'What does a concrete inspection report include?', a: 'A concrete inspection report includes pre-pour checks, pour observation, slump test data, curing details, surface finish assessment, and defect documentation.' },
      { q: 'When should concrete inspections be conducted?', a: 'Inspections should occur before the pour, during the pour, and at specified intervals during curing (24h, 7-day, 28-day).' },
      { q: 'What is a slump test?', a: 'A slump test measures the consistency of fresh concrete to verify it meets the specified workability for the pour.' },
      { q: 'Who is responsible for concrete inspection?', a: 'Concrete inspections are typically the responsibility of the structural engineer or their nominated inspector.' },
      { q: 'Can I use this template with Biddaro Inspect?', a: 'Yes. Capture your concrete inspection on-site with photos and voice notes, and Biddaro generates a complete structural report.' },
    ],
    related: ['construction-site-inspection', 'structural-inspection', 'site-safety-audit'],
  },
  {
    slug: 'structural-inspection',
    title: 'Structural Inspection Report Template',
    category: 'Construction',
    description: 'Detailed structural inspection template for assessing framing, load-bearing elements, foundations, and structural defects.',
    sections: ['Structure Details', 'Foundation Inspection', 'Framing Assessment', 'Load-Bearing Elements', 'Connections & Fixings', 'Cracks & Defects', 'Moisture & Corrosion', 'Recommendations', 'Sign-off'],
    useCase: 'Used by structural engineers for residential and commercial structural assessments.',
    whoUses: 'Structural engineers, building inspectors, insurance assessors',
    faqs: [
      { q: 'What is a structural inspection?', a: "A structural inspection assesses the integrity of a building's load-bearing elements including foundations, framing, walls, and roof structure." },
      { q: 'When is a structural inspection required?', a: 'Structural inspections are required before property purchase, after damage events, as part of renovation permits, and for ageing buildings.' },
      { q: 'What qualifications do structural inspectors need?', a: 'Structural inspections should be conducted by a registered structural or civil engineer.' },
      { q: 'How long does a structural inspection take?', a: 'Residential structural inspections typically take 2–4 hours. Complex or large structures may require a full day.' },
      { q: 'Can this template be used for heritage buildings?', a: 'Yes, though heritage buildings may require additional sections for heritage-specific assessment criteria.' },
    ],
    related: ['concrete-inspection', 'property-condition-report', 'construction-site-inspection'],
  },
  {
    slug: 'fire-safety-inspection',
    title: 'Fire Safety Inspection Checklist',
    category: 'Safety',
    description: 'Comprehensive fire safety audit template covering detection systems, suppression, evacuation routes, and compliance documentation.',
    sections: ['Building Details', 'Fire Detection Systems', 'Suppression Systems', 'Fire Doors & Compartmentation', 'Emergency Lighting', 'Evacuation Routes', 'Extinguisher Check', 'Record Keeping', 'Non-Compliances', 'Sign-off'],
    useCase: 'Used by fire safety officers and building managers for annual compliance audits.',
    whoUses: 'Fire safety officers, building managers, compliance consultants',
    faqs: [
      { q: 'What is a fire safety inspection?', a: "A fire safety inspection evaluates a building's fire detection, suppression, and evacuation systems to ensure regulatory compliance and occupant safety." },
      { q: 'How often are fire safety inspections required?', a: 'Most jurisdictions require annual fire safety inspections for commercial and multi-residential buildings.' },
      { q: 'What is an essential fire safety measure?', a: 'Essential fire safety measures include fire detection systems, suppression systems, emergency lighting, exit signs, and evacuation procedures.' },
      { q: 'Who can conduct fire safety inspections?', a: 'Fire safety inspections should be conducted by a qualified fire safety officer or accredited practitioner.' },
      { q: 'Can this template be used for high-rise buildings?', a: 'Yes. The template covers the essential systems common to all building types, with sections applicable to high-rise fire safety.' },
    ],
    related: ['site-safety-audit', 'electrical-safety-inspection', 'mep-inspection'],
  },
  {
    slug: 'rental-condition-report',
    title: 'Rental Property Condition Report',
    category: 'Property',
    description: 'Entry and exit condition report template for rental properties to document property state at tenancy start and end.',
    sections: ['Property Details', 'Entry Condition', 'Rooms Checklist', 'Appliances & Fixtures', 'Outdoor Areas', 'Keys Issued', 'Meter Readings', 'Photo Record', 'Tenant Acknowledgement', 'Agent Sign-off'],
    useCase: 'Used by property managers and landlords at tenancy entry and exit to document property condition.',
    whoUses: 'Property managers, landlords, real-estate agents',
    faqs: [
      { q: 'What is a rental condition report?', a: "A rental condition report documents the condition of a rental property at the start and end of a tenancy to resolve disputes about damage." },
      { q: 'Is a rental condition report legally required?', a: 'In most jurisdictions, property managers must complete a condition report at tenancy entry. Requirements vary — check your local tenancy legislation.' },
      { q: 'How detailed should a rental condition report be?', a: 'Reports should note the condition of every room, fixture, and appliance, supported by dated photographs.' },
      { q: 'Can tenants dispute a condition report?', a: 'Yes. Tenants typically have a period (e.g. 3 days) to note disagreements with the entry condition report.' },
      { q: 'Can I create this report on my phone?', a: 'Yes. Use Biddaro Inspect to complete the condition report with photos on your smartphone and generate a professional PDF or Word document.' },
    ],
    related: ['property-condition-report', 'pre-settlement-inspection', 'handover-inspection'],
  },
  {
    slug: 'handover-inspection',
    title: 'Building Handover Inspection Report',
    category: 'Construction',
    description: 'Practical completion and handover inspection template for documenting defects before client handover.',
    sections: ['Project Details', 'External Works', 'Internal Finishes', 'Services Commissioning', 'Defect Schedule', 'Outstanding Works', 'Client Acknowledgement', 'Handover Documentation', 'Sign-off'],
    useCase: 'Used by builders and project managers at practical completion to document outstanding works and handover status.',
    whoUses: 'Builders, project managers, contract administrators',
    faqs: [
      { q: 'What is a handover inspection?', a: 'A handover inspection occurs at practical completion to document any defects or incomplete works before the project is handed to the client.' },
      { q: 'What is practical completion?', a: "Practical completion is the stage at which a project is substantially complete and suitable for its intended use, even if minor items remain." },
      { q: 'What is a defect liability period?', a: 'The defect liability period is a post-handover period during which the contractor must fix defects that emerge, typically 6–12 months.' },
      { q: 'Who attends the handover inspection?', a: 'Handover inspections typically involve the contractor, client, and contract administrator or project manager.' },
      { q: 'How does Biddaro help with handover reports?', a: 'Biddaro Inspect allows inspectors to capture defects with photos on-site and generates a formatted defect schedule automatically.' },
    ],
    related: ['construction-site-inspection', 'property-condition-report', 'pre-settlement-inspection'],
  },
  {
    slug: 'plumbing-inspection',
    title: 'Plumbing Inspection Report Template',
    category: 'MEP',
    description: 'Template for documenting plumbing installation compliance, pipe testing, drainage inspection, and fixture installation.',
    sections: ['Installation Details', 'Pipe Work Visual Check', 'Pressure Test Results', 'Drainage Testing', 'Fixture Installation', 'Hot Water Systems', 'Backflow Prevention', 'Defects', 'Sign-off'],
    useCase: 'Used by licensed plumbers for compliance certificates and inspection reports.',
    whoUses: 'Licensed plumbers, building inspectors, facilities managers',
    faqs: [
      { q: 'What does a plumbing inspection cover?', a: 'A plumbing inspection covers pipe installation, pressure testing, drainage, hot water systems, fixture installation, and backflow prevention.' },
      { q: 'How often should plumbing be inspected?', a: 'Plumbing inspections occur at key construction stages and for compliance certificates. Commercial systems require periodic testing.' },
      { q: 'What is a pressure test for plumbing?', a: 'A pressure test pressurises the pipe system to verify there are no leaks before walls are closed.' },
      { q: 'Who can inspect plumbing?', a: 'Plumbing inspections must be conducted by a licensed plumber or licensed building inspector.' },
      { q: 'Can this template be used for commercial projects?', a: 'Yes. The template applies to both residential and commercial plumbing inspections.' },
    ],
    related: ['mep-inspection', 'electrical-safety-inspection', 'hvac-inspection'],
  },
  {
    slug: 'hvac-inspection',
    title: 'HVAC Inspection & Commissioning Report',
    category: 'MEP',
    description: 'Template for HVAC system inspection, air balance testing, commissioning, and filter maintenance documentation.',
    sections: ['System Details', 'Visual Inspection', 'Air Distribution', 'Air Balance Results', 'Temperature & Humidity', 'Controls & BMS', 'Filter Condition', 'Defects', 'Commissioning Sign-off'],
    useCase: 'Used by HVAC engineers and commissioning agents for system sign-off and maintenance records.',
    whoUses: 'HVAC engineers, commissioning agents, facility managers',
    faqs: [
      { q: 'What is HVAC commissioning?', a: 'HVAC commissioning verifies that heating, ventilation, and air conditioning systems are installed correctly and perform to design specifications.' },
      { q: 'What is an air balance test?', a: 'An air balance test measures air flow at each grille and diffuser to confirm the designed volumes are being delivered throughout the building.' },
      { q: 'How often should HVAC systems be inspected?', a: 'HVAC systems should be inspected and serviced every 6–12 months. Commissioning occurs once at project completion.' },
      { q: 'What qualifications are needed for HVAC inspection?', a: 'HVAC inspections should be conducted by a qualified mechanical engineer or licensed HVAC technician.' },
      { q: 'Can I use this template for a maintenance inspection?', a: 'Yes. The template includes filter condition and controls sections suitable for scheduled maintenance visits.' },
    ],
    related: ['mep-inspection', 'plumbing-inspection', 'electrical-safety-inspection'],
  },
  {
    slug: 'roofing-inspection',
    title: 'Roofing Inspection Report Template',
    category: 'Construction',
    description: 'Template for assessing roof condition, waterproofing, flashing, gutters, and storm damage.',
    sections: ['Property Details', 'Roof Access & Safety', 'Roof Covering Condition', 'Flashing & Penetrations', 'Gutters & Downpipes', 'Ridge & Valley', 'Internal Roof Space', 'Storm Damage', 'Recommended Actions', 'Sign-off'],
    useCase: 'Used by roofing contractors, building inspectors, and insurance assessors.',
    whoUses: 'Roofing contractors, building inspectors, insurance assessors',
    faqs: [
      { q: 'What does a roof inspection involve?', a: "A roof inspection assesses the condition of roof covering, flashing, gutters, penetrations, and internal roof space for leaks and structural issues." },
      { q: 'How often should roofs be inspected?', a: 'Roofs should be inspected every 2–3 years or after major storm events.' },
      { q: 'What are the most common roof defects?', a: 'Common roof defects include cracked tiles, failed flashing, blocked gutters, ridge mortar failure, and penetration leaks.' },
      { q: 'Who should conduct a roof inspection?', a: 'Roof inspections should be conducted by a qualified roofing contractor or licensed building inspector.' },
      { q: 'Can Biddaro Inspect be used on a roof?', a: 'Yes. Use the Biddaro Inspect mobile app on-site to capture photos and voice notes, then generate the report back at the office.' },
    ],
    related: ['property-condition-report', 'structural-inspection', 'construction-site-inspection'],
  },
  {
    slug: 'workplace-safety-audit',
    title: 'Workplace Safety Audit Template',
    category: 'Safety',
    description: 'General workplace safety audit template for factories, warehouses, offices, and industrial facilities.',
    sections: ['Workplace Details', 'Housekeeping', 'Manual Handling', 'Equipment & Machinery', 'Hazardous Substances', 'Emergency Procedures', 'First Aid', 'Incident History', 'Non-Compliances', 'Corrective Actions'],
    useCase: 'Used by WHS officers and safety consultants for general workplace safety audits.',
    whoUses: 'WHS officers, safety consultants, operations managers',
    faqs: [
      { q: 'What is a workplace safety audit?', a: "A workplace safety audit is a systematic evaluation of workplace conditions against safety standards to identify hazards and areas for improvement." },
      { q: 'How is a safety audit different from a risk assessment?', a: 'A risk assessment identifies hazards and evaluates risks. A safety audit verifies whether safety controls and procedures are actually in place and followed.' },
      { q: 'How often should workplace safety audits be done?', a: 'Most safety management systems require annual audits at minimum, with internal inspections more frequently.' },
      { q: 'Who can conduct a workplace safety audit?', a: 'Audits should be conducted by a qualified WHS officer, external safety consultant, or trained internal auditor.' },
      { q: 'Does this template cover all industries?', a: 'This is a general workplace template. Industry-specific hazards (chemical, mining, food production) may require additional sections.' },
    ],
    related: ['site-safety-audit', 'fire-safety-inspection', 'construction-site-inspection'],
  },
  {
    slug: 'defect-inspection',
    title: 'Defect Inspection Report Template',
    category: 'Construction',
    description: 'Systematic defect inspection template for recording, categorising, and tracking construction or maintenance defects.',
    sections: ['Project Details', 'Defect Schedule', 'Priority Classification', 'Photographic Record', 'Responsible Party', 'Remediation Required', 'Target Completion', 'Re-inspection Notes', 'Sign-off'],
    useCase: 'Used during defect liability periods and maintenance inspections to track and manage defects.',
    whoUses: 'Project managers, contract administrators, facilities managers',
    faqs: [
      { q: 'What is a defect inspection report?', a: 'A defect inspection report documents identified defects, assigns responsibility for remediation, and tracks completion — typically during the defect liability period.' },
      { q: 'What is a defect liability period?', a: 'A defect liability period is a post-completion period (typically 6–12 months) during which the contractor must rectify any defects that appear.' },
      { q: 'How should defects be prioritised?', a: 'Defects are typically prioritised as critical (safety), major (functional impact), or minor (cosmetic). Priority determines the rectification timeframe.' },
      { q: 'Who can raise a defect?', a: 'Defects can be raised by the client, contract administrator, building inspector, or end user during the defect liability period.' },
      { q: 'Can I use Biddaro to track multiple defects at once?', a: 'Yes. Biddaro Inspect allows you to document multiple defects in a single inspection session and organise them into a formatted defect schedule.' },
    ],
    related: ['handover-inspection', 'construction-site-inspection', 'property-condition-report'],
  },
  {
    slug: 'swimming-pool-inspection',
    title: 'Swimming Pool Safety Inspection Report',
    category: 'Safety',
    description: 'Pool safety barrier compliance inspection template covering fencing, gates, CPR signage, and pool condition.',
    sections: ['Property Details', 'Pool Barrier Inspection', 'Gate & Latch Check', 'CPR Signage', 'Water Safety Equipment', 'Pool Condition', 'Surrounds & Trip Hazards', 'Compliance Outcome', 'Sign-off'],
    useCase: 'Used by licensed pool inspectors for pool safety compliance certificates.',
    whoUses: 'Licensed pool inspectors, local council officers, building certifiers',
    faqs: [
      { q: 'What is a pool safety inspection?', a: 'A pool safety inspection verifies that pool barriers and safety equipment meet mandatory standards to prevent child drowning.' },
      { q: 'How often is a pool safety inspection required?', a: 'Requirements vary by jurisdiction. In most Australian states, pool safety inspections are required every 3–5 years for rental properties and at point of sale.' },
      { q: 'Who can conduct a pool safety inspection?', a: 'Pool safety inspections must be conducted by a licensed pool safety inspector in most jurisdictions.' },
      { q: 'What happens if a pool fails inspection?', a: 'A failure notice is issued and the non-compliances must be rectified. A re-inspection is then required.' },
      { q: 'Can I use Biddaro Inspect for pool safety certificates?', a: 'Yes. Complete the inspection on-site and generate a compliance report for submission with photos attached.' },
    ],
    related: ['property-condition-report', 'site-safety-audit', 'fire-safety-inspection'],
  },
  {
    slug: 'commercial-kitchen-inspection',
    title: 'Commercial Kitchen Inspection Report',
    category: 'Safety',
    description: 'Food safety and kitchen compliance inspection template covering hygiene, equipment, storage, and pest control.',
    sections: ['Premises Details', 'Food Handling Practices', 'Temperature Control', 'Equipment Condition', 'Cleaning & Sanitation', 'Pest Control', 'Storage Compliance', 'Staff Hygiene', 'Non-Compliances', 'Inspector Notes'],
    useCase: 'Used by environmental health officers and food safety auditors for commercial kitchen inspections.',
    whoUses: 'Environmental health officers, food safety auditors, restaurant managers',
    faqs: [
      { q: 'What does a commercial kitchen inspection check?', a: 'A commercial kitchen inspection checks food handling practices, temperature control, equipment condition, cleaning procedures, pest control, and staff hygiene.' },
      { q: 'How often are commercial kitchen inspections required?', a: 'Most health departments conduct unannounced inspections 1–4 times per year depending on the risk classification of the premises.' },
      { q: 'What are the most common kitchen inspection failures?', a: 'Common failures include improper temperature storage, cross-contamination risks, pest evidence, and inadequate cleaning records.' },
      { q: 'Can restaurant operators use this template for self-audits?', a: 'Yes. Regular self-audits using this template can help identify issues before a council inspection.' },
      { q: 'Does Biddaro Inspect work for food safety audits?', a: 'Yes. Biddaro Inspect can be configured with any inspection template including food safety audits.' },
    ],
    related: ['workplace-safety-audit', 'site-safety-audit', 'fire-safety-inspection'],
  },
  {
    slug: 'strata-inspection',
    title: 'Strata Building Inspection Report',
    category: 'Property',
    description: 'Comprehensive inspection template for strata-titled buildings covering common areas, services, and maintenance planning.',
    sections: ['Building Details', 'Common Area Condition', 'Building Envelope', 'Lift & Stairs', 'Car Park', 'Services & Plant Room', 'Fire Safety Systems', 'Maintenance Schedule', 'Capital Works', 'Recommendations'],
    useCase: 'Used by strata inspectors and building managers for owners corporation annual reports.',
    whoUses: 'Strata inspectors, building managers, owners corporation committees',
    faqs: [
      { q: 'What is a strata inspection report?', a: 'A strata inspection report assesses the condition of common property in a strata scheme and provides recommendations for maintenance and capital works planning.' },
      { q: 'Who is responsible for strata building inspections?', a: "The owners corporation (body corporate) is responsible for maintaining common property. Inspections may be commissioned by the strata manager." },
      { q: 'How often should strata buildings be inspected?', a: 'Annual inspections of common property are recommended, with detailed capital works assessments every 5–10 years.' },
      { q: 'What is a capital works fund forecast?', a: 'A capital works fund forecast estimates future major expenditure to ensure the sinking fund has adequate reserves.' },
      { q: 'Can this report be used for strata due diligence?', a: "Yes. This report helps prospective buyers and owners understand the building's condition before purchasing." },
    ],
    related: ['property-condition-report', 'structural-inspection', 'fire-safety-inspection'],
  },
  {
    slug: 'solar-panel-inspection',
    title: 'Solar Panel System Inspection Report',
    category: 'Electrical',
    description: 'Template for inspecting solar PV system installation, panel condition, inverter performance, and safety compliance.',
    sections: ['System Details', 'Panel Visual Inspection', 'Mounting & Racking', 'Wiring & Connections', 'Inverter Inspection', 'Isolators & Protection', 'Monitoring System', 'Performance Check', 'Defects', 'Sign-off'],
    useCase: 'Used by solar installers, electricians, and building inspectors for solar system compliance and maintenance.',
    whoUses: 'Solar installers, licensed electricians, building inspectors',
    faqs: [
      { q: 'What does a solar panel inspection involve?', a: 'A solar panel inspection covers panel condition, mounting integrity, wiring safety, inverter performance, isolator function, and system compliance.' },
      { q: 'How often should solar systems be inspected?', a: 'Solar systems should be inspected 5 years after installation and every 5 years thereafter, or after extreme weather events.' },
      { q: 'What are common solar system defects?', a: 'Common defects include micro-cracks in panels, corroded connections, failing inverters, and non-compliant wiring.' },
      { q: 'Who can inspect a solar PV system?', a: 'Solar system inspections should be conducted by a licensed electrician with solar accreditation.' },
      { q: 'Can Biddaro Inspect be used for solar inspections?', a: 'Yes. Use Biddaro Inspect to capture photos of panels, inverters, and connections on-site and generate a compliance report.' },
    ],
    related: ['electrical-safety-inspection', 'mep-inspection', 'roofing-inspection'],
  },
];

// ─── India city data ──────────────────────────────────────────────────────────

export interface InspectIndiaCity {
  slug: string;
  name: string;
  state: string;
  constructionNote: string;
}

export const INSPECT_INDIA_CITIES: InspectIndiaCity[] = [
  { slug: 'mumbai', name: 'Mumbai', state: 'Maharashtra', constructionNote: 'Mumbai is India\'s financial capital and home to one of the most active construction markets in the country, with major residential, commercial, and infrastructure projects across the MMR.' },
  { slug: 'delhi', name: 'Delhi', state: 'Delhi NCR', constructionNote: 'Delhi NCR encompasses a vast construction ecosystem — from high-rise residential towers in Gurugram and Noida to large-scale government and infrastructure works across the national capital region.' },
  { slug: 'bangalore', name: 'Bangalore', state: 'Karnataka', constructionNote: 'Bangalore is India\'s technology hub with rapidly expanding commercial and residential construction, driven by the IT sector\'s demand for modern office parks and premium housing.' },
  { slug: 'hyderabad', name: 'Hyderabad', state: 'Telangana', constructionNote: 'Hyderabad has emerged as one of India\'s fastest-growing cities, with significant construction activity in Hitec City, Gachibowli, and surrounding corridors driven by IT and pharmaceutical sector growth.' },
  { slug: 'chennai', name: 'Chennai', state: 'Tamil Nadu', constructionNote: 'Chennai is a major construction market in South India, with active residential development, port and industrial infrastructure, and a growing commercial real-estate sector.' },
  { slug: 'kolkata', name: 'Kolkata', state: 'West Bengal', constructionNote: 'Kolkata\'s construction sector spans heritage restoration, mid-rise residential development, and major infrastructure upgrades including metro expansion and riverside regeneration projects.' },
  { slug: 'pune', name: 'Pune', state: 'Maharashtra', constructionNote: 'Pune is one of Maharashtra\'s fastest-growing cities, with a booming residential market, IT park developments, and significant industrial construction activity in areas like Hinjewadi and Kharadi.' },
  { slug: 'ahmedabad', name: 'Ahmedabad', state: 'Gujarat', constructionNote: 'Ahmedabad is a major industrial and residential construction hub in Gujarat, with significant activity in areas like GIFT City, SG Road, and the expanding suburban belt.' },
  { slug: 'jaipur', name: 'Jaipur', state: 'Rajasthan', constructionNote: 'Jaipur\'s construction market blends heritage-sensitive redevelopment with modern residential and commercial projects along its expanding urban periphery.' },
  { slug: 'surat', name: 'Surat', state: 'Gujarat', constructionNote: 'Surat is one of India\'s fastest urbanising cities, with a booming textile and diamond industry driving substantial residential, commercial, and infrastructure construction.' },
  { slug: 'lucknow', name: 'Lucknow', state: 'Uttar Pradesh', constructionNote: 'Lucknow is witnessing significant construction growth fuelled by infrastructure development, Gomti Nagar expansion, and increasing investment in commercial and residential real estate.' },
  { slug: 'kanpur', name: 'Kanpur', state: 'Uttar Pradesh', constructionNote: 'Kanpur is an industrial city in UP with active construction in manufacturing facilities, warehousing, and residential developments catering to its growing urban population.' },
  { slug: 'nagpur', name: 'Nagpur', state: 'Maharashtra', constructionNote: 'Nagpur\'s construction market is expanding rapidly, driven by the MIHAN SEZ, logistics hub investments, and the city\'s strategic position as a national transport nexus.' },
  { slug: 'indore', name: 'Indore', state: 'Madhya Pradesh', constructionNote: 'Indore is Madhya Pradesh\'s commercial capital with strong residential and commercial construction activity, consistently ranked among India\'s cleanest and best-managed cities.' },
  { slug: 'thane', name: 'Thane', state: 'Maharashtra', constructionNote: 'Thane is one of Mumbai Metropolitan Region\'s most active construction markets, with high-rise residential towers, township projects, and commercial developments driving significant inspection demand.' },
  { slug: 'bhopal', name: 'Bhopal', state: 'Madhya Pradesh', constructionNote: 'Bhopal is a growing construction market in central India, with state government infrastructure projects, residential development, and expanding IT and commercial sectors.' },
  { slug: 'visakhapatnam', name: 'Visakhapatnam', state: 'Andhra Pradesh', constructionNote: 'Visakhapatnam is Andhra Pradesh\'s industrial powerhouse, with active port infrastructure, naval facilities, steel plant-adjacent residential construction, and a growing IT sector driving development.' },
  { slug: 'pimpri-chinchwad', name: 'Pimpri-Chinchwad', state: 'Maharashtra', constructionNote: 'Pimpri-Chinchwad is Pune\'s twin industrial city, home to major automotive and manufacturing facilities, with significant residential and industrial construction activity.' },
  { slug: 'patna', name: 'Patna', state: 'Bihar', constructionNote: 'Patna is Bihar\'s capital and a rapidly developing city with infrastructure investment in roads, bridges, residential construction, and government buildings.' },
  { slug: 'vadodara', name: 'Vadodara', state: 'Gujarat', constructionNote: 'Vadodara is a major industrial city in Gujarat with active petrochemical, engineering, and residential construction, and growing proximity to key infrastructure corridors.' },
  { slug: 'ghaziabad', name: 'Ghaziabad', state: 'Uttar Pradesh', constructionNote: 'Ghaziabad is a key part of Delhi NCR\'s construction belt, with extensive residential, commercial, and industrial development along the NH-9 and NH-58 corridors.' },
  { slug: 'ludhiana', name: 'Ludhiana', state: 'Punjab', constructionNote: 'Ludhiana is Punjab\'s industrial hub with significant construction in the textile and hosiery manufacturing sector, combined with strong residential and commercial development.' },
  { slug: 'agra', name: 'Agra', state: 'Uttar Pradesh', constructionNote: 'Agra\'s construction market is shaped by heritage conservation requirements, tourism infrastructure, and growing residential development as the city expands beyond its historic core.' },
  { slug: 'nashik', name: 'Nashik', state: 'Maharashtra', constructionNote: 'Nashik is a growing industrial and wine-country city in Maharashtra, with active construction in food processing facilities, residential townships, and infrastructure projects.' },
  { slug: 'faridabad', name: 'Faridabad', state: 'Haryana', constructionNote: 'Faridabad is Haryana\'s largest city and an important industrial satellite of Delhi, with active construction in manufacturing, warehousing, and residential sectors.' },
  { slug: 'meerut', name: 'Meerut', state: 'Uttar Pradesh', constructionNote: 'Meerut is a key commercial city in western UP with growing construction activity in sports goods manufacturing, logistics, and residential development bolstered by Delhi-Meerut Expressway connectivity.' },
  { slug: 'rajkot', name: 'Rajkot', state: 'Gujarat', constructionNote: 'Rajkot is a major engineering and manufacturing city in Gujarat with active construction in industrial facilities, residential development, and expanding commercial zones.' },
  { slug: 'kalyan-dombivli', name: 'Kalyan-Dombivli', state: 'Maharashtra', constructionNote: 'Kalyan-Dombivli is an important node in the Mumbai Metropolitan Region with significant mid-range residential construction and expanding industrial and commercial activity.' },
  { slug: 'vasai-virar', name: 'Vasai-Virar', state: 'Maharashtra', constructionNote: 'Vasai-Virar is the MMR\'s fastest-growing peripheral city, with large-scale affordable residential construction and rapid infrastructure development driven by improved rail connectivity.' },
  { slug: 'varanasi', name: 'Varanasi', state: 'Uttar Pradesh', constructionNote: 'Varanasi combines heritage conservation with substantial infrastructure investment — ghats restoration, smart city initiatives, and residential construction meeting growing pilgrim and tourist demand.' },
  { slug: 'srinagar', name: 'Srinagar', state: 'Jammu & Kashmir', constructionNote: 'Srinagar\'s construction sector is growing with J&K statehood infrastructure investment, tourism-oriented hospitality construction, and residential development in its expanding suburban areas.' },
  { slug: 'aurangabad', name: 'Aurangabad', state: 'Maharashtra', constructionNote: 'Aurangabad (now officially Chhatrapati Sambhajinagar) is a major industrial and tourism city in Maharashtra with active construction in automotive manufacturing, MIDC zones, and residential projects.' },
  { slug: 'dhanbad', name: 'Dhanbad', state: 'Jharkhand', constructionNote: 'Dhanbad is Jharkhand\'s coal capital with significant construction in mining infrastructure, residential development, and the expanding commercial sector serving the mining workforce.' },
  { slug: 'amritsar', name: 'Amritsar', state: 'Punjab', constructionNote: 'Amritsar\'s construction market is shaped by tourism infrastructure near the Golden Temple, heritage-sensitive development guidelines, and growing residential and commercial activity.' },
  { slug: 'navi-mumbai', name: 'Navi Mumbai', state: 'Maharashtra', constructionNote: 'Navi Mumbai is a planned city within the MMR with substantial construction in residential townships, the upcoming international airport precinct, and CIDCO\'s ongoing infrastructure development.' },
  { slug: 'allahabad', name: 'Allahabad', state: 'Uttar Pradesh', constructionNote: 'Prayagraj (Allahabad) is undergoing significant infrastructure investment driven by Kumbh Mela preparations, smart city projects, and growing residential construction.' },
  { slug: 'ranchi', name: 'Ranchi', state: 'Jharkhand', constructionNote: 'Ranchi is Jharkhand\'s capital with active construction in government and public infrastructure, residential development, and institutional buildings as the city grows as an administrative centre.' },
  { slug: 'howrah', name: 'Howrah', state: 'West Bengal', constructionNote: 'Howrah is a key industrial city adjacent to Kolkata with active construction in manufacturing facilities, residential development, and infrastructure upgrades linked to the metro expansion.' },
  { slug: 'coimbatore', name: 'Coimbatore', state: 'Tamil Nadu', constructionNote: 'Coimbatore is Tamil Nadu\'s industrial capital with significant construction in textile manufacturing facilities, residential development, and commercial projects serving its thriving engineering sector.' },
  { slug: 'jabalpur', name: 'Jabalpur', state: 'Madhya Pradesh', constructionNote: 'Jabalpur is a key defence and industrial city in central India with active construction in cantonment infrastructure, marble industry facilities, and growing residential development.' },
];

export function getInspectCity(slug: string): InspectIndiaCity | undefined {
  return INSPECT_INDIA_CITIES.find((c) => c.slug === slug);
}

export function getAllInspectCitySlugs(): string[] {
  return INSPECT_INDIA_CITIES.map((c) => c.slug);
}

// ─── General Inspect FAQs ─────────────────────────────────────────────────────

export const INSPECT_FAQS: { q: string; a: string }[] = [
  {
    q: 'What is Biddaro Inspect?',
    a: 'Biddaro Inspect is an AI-powered inspection report platform. You capture photos, voice notes, and observations on site using the mobile app, and the AI generates a complete, professional inspection report in your own template format — in minutes.',
  },
  {
    q: 'What types of inspection reports can Biddaro generate?',
    a: 'Biddaro Inspect supports any inspection type — construction site, property condition, MEP, safety audits, electrical, snag lists, handover reports, and more. You provide the template; Biddaro does the writing.',
  },
  {
    q: 'Does Biddaro Inspect work offline?',
    a: 'Yes. The mobile capture mode works fully offline. Photos, voice notes, and text observations are saved locally and sync automatically when connectivity is restored.',
  },
  {
    q: 'Can I use my own report template?',
    a: 'Yes. Upload your existing Word (.docx) or PDF template and Biddaro replicates your format exactly — headings, sections, layout, and your company branding.',
  },
  {
    q: 'What export formats does Biddaro support?',
    a: 'Biddaro Inspect exports to Word (.docx) and PDF. Both formats are fully branded and ready to send directly to clients, engineers, or project managers.',
  },
  {
    q: 'How fast can I generate a report?',
    a: 'Most reports are ready in under 5 minutes after completing site capture. The AI processes your field data immediately and generates a structured draft for your review.',
  },
  {
    q: 'Is Biddaro Inspect suitable for teams?',
    a: 'Yes. Biddaro Inspect supports multi-user accounts with role-based access — inspector, reviewer, and admin roles — making it ideal for teams of any size.',
  },
  {
    q: 'How much does Biddaro Inspect cost?',
    a: 'Biddaro Inspect has a free plan and paid plans starting from $19/month. There are no per-report fees. Start free — no credit card required.',
  },
  {
    q: 'Does Biddaro Inspect work on iOS and Android?',
    a: 'Yes. Biddaro Inspect has native mobile apps for iOS and Android, plus a full web app for desktop use.',
  },
  {
    q: 'Can Biddaro Inspect replace my current inspection software?',
    a: 'In most cases, yes. Biddaro Inspect is a full replacement for checklist-based inspection tools, offering AI report writing, custom templates, offline capture, and professional exports that older tools cannot match.',
  },
];

// ─── Features ────────────────────────────────────────────────────────────────

export interface InspectFeature {
  slug: string;
  name: string;
  tagline: string;
  description: string;
  icon: string;
  capabilities: string[];
  howItWorks: { step: string; detail: string }[];
  faqs: { q: string; a: string }[];
  metaTitle: string;
  metaDescription: string;
  keywords: string[];
}

export const INSPECT_FEATURES: InspectFeature[] = [
  {
    slug: 'ai-report-generation',
    name: 'AI Report Generation',
    tagline: 'Field notes in. Client-ready report out — in minutes.',
    description: 'Upload your inspection template once. Biddaro\'s AI reads your structure, writing style, and terminology, then uses your site captures to write a complete, professional report — matching your exact format.',
    icon: '🤖',
    capabilities: [
      'Learns from your uploaded Word or PDF template',
      'Matches your firm\'s writing style and terminology',
      'Structures all captures into the correct report sections',
      'Generates narrative paragraphs, not just checklists',
      'Exports as .docx or PDF with your branding',
      'Processes 100+ photos and voice notes in one pass',
    ],
    howItWorks: [
      { step: 'Upload your template', detail: 'Provide your Word or PDF report template — or describe the format you need.' },
      { step: 'Capture on site', detail: 'Take photos, record voice notes, and type observations using the mobile app.' },
      { step: 'AI generates the report', detail: 'The AI organises your captures into the report structure and writes the narrative — ready in minutes.' },
    ],
    faqs: [
      { q: 'How does the AI know my report format?', a: 'You upload your existing Word or PDF template during project setup. Biddaro reads the structure — section headings, formatting, writing style — and replicates it in all generated reports.' },
      { q: 'Can the AI write in my firm\'s tone?', a: 'Yes. The AI adapts to the language and formality of your uploaded template. Technical, formal, or plain English — Biddaro matches it.' },
      { q: 'What happens if I don\'t have a template?', a: 'Biddaro provides a library of 50+ industry-standard templates across construction, property, MEP, safety, and more — ready to use or customise.' },
      { q: 'Does AI generation work for all inspection types?', a: 'Yes. Biddaro\'s AI supports construction site reports, snagging, MEP, property condition, safety audits, commissioning reports, and more.' },
      { q: 'How accurate is the AI-generated report?', a: 'Very high for content from your captures. You always review and edit the draft before sending. Most inspectors make minor edits — the AI handles 90%+ of the writing.' },
    ],
    metaTitle: 'AI Inspection Report Generator — Auto-Write Reports from Field Data | Biddaro',
    metaDescription: 'Let AI write your inspection reports from photos, voice notes and observations. Upload your template once — Biddaro generates professional Word & PDF reports in minutes.',
    keywords: ['AI inspection report generator', 'automated inspection report software', 'AI site report writer', 'inspection report automation'],
  },
  {
    slug: 'mobile-capture',
    name: 'Mobile Field Capture',
    tagline: 'Capture everything on site — photo, voice, text — with or without internet.',
    description: 'The Biddaro Inspect mobile app turns your phone into a professional field data collection tool. Document defects, observations, and conditions in real time — then let AI write the report.',
    icon: '📱',
    capabilities: [
      'Photo capture with GPS tagging and timestamp',
      'Voice-to-text for hands-free observations',
      'Typed notes with section and severity tagging',
      'Full offline mode — syncs when back online',
      'Bulk photo upload from camera roll',
      'Works on any Android or iOS device',
    ],
    howItWorks: [
      { step: 'Open the app on site', detail: 'No internet required. Start a new project and begin capturing immediately.' },
      { step: 'Capture photos, voice notes and observations', detail: 'Tag each capture with section, severity, and location. GPS coordinates recorded automatically.' },
      { step: 'Sync and generate', detail: 'When back online, your captures sync to the cloud and the AI generates your report.' },
    ],
    faqs: [
      { q: 'Does the mobile capture work offline?', a: 'Yes. All capture modes — photo, voice, and text — work fully offline. Data syncs automatically when you restore connectivity.' },
      { q: 'What devices does Biddaro mobile work on?', a: 'Any Android or iOS smartphone or tablet with a browser. No app download required — the progressive web app (PWA) works directly in your mobile browser.' },
      { q: 'Can I capture hundreds of photos on one inspection?', a: 'Yes. Biddaro supports bulk photo upload and processes all photos in a single report generation pass. No manual photo labelling required.' },
      { q: 'Is voice-to-text accurate for construction terminology?', a: 'Biddaro uses browser-native speech recognition, which performs well in English and is trained on general vocabulary. Technical terms can be corrected in the text editor before generating the report.' },
      { q: 'Can I tag captures by report section?', a: 'Yes. Each capture can be tagged to a specific report section (e.g. "Structural", "MEP", "Snag List"). The AI uses these tags to organise captures correctly in the report.' },
    ],
    metaTitle: 'Mobile Field Inspection App — Photo, Voice & Offline Capture | Biddaro',
    metaDescription: 'Capture photos, voice notes and observations on any construction site — with or without internet. GPS tagging, offline mode, bulk upload. AI writes your report.',
    keywords: ['mobile inspection app', 'field capture app construction', 'offline inspection app', 'site photo documentation app'],
  },
  {
    slug: 'photo-documentation',
    name: 'Photo Documentation',
    tagline: 'GPS-tagged photos with AI captions — automatic defect descriptions.',
    description: 'Every photo captured in Biddaro is automatically GPS-tagged, timestamped, and described by AI. No more manually writing captions for 80 site photos — Biddaro does it for you.',
    icon: '📸',
    capabilities: [
      'Automatic GPS coordinates on every photo',
      'AI-generated captions describing defect, material, and condition',
      'Severity tagging (Normal / Warning / Critical)',
      'Section grouping for easy report organisation',
      'Annotation tools — draw arrows, circles, and highlight areas',
      'Full-resolution export with photos embedded in report',
    ],
    howItWorks: [
      { step: 'Take photos on site', detail: 'Use the Biddaro mobile app or upload from your camera roll. GPS and timestamp recorded automatically.' },
      { step: 'AI describes each photo', detail: 'AI generates a technical description of what\'s visible — defects, materials, conditions, safety issues.' },
      { step: 'Photos appear in your report', detail: 'Photos are placed in the correct report sections with captions. Exported in full resolution in your Word or PDF report.' },
    ],
    faqs: [
      { q: 'Does Biddaro automatically caption my site photos?', a: 'Yes. Biddaro\'s AI Vision analyses each photo and generates a professional, inspector-grade caption describing visible defects, materials, and conditions.' },
      { q: 'Are GPS coordinates recorded with each photo?', a: 'Yes. When location permissions are granted, every photo is tagged with GPS coordinates. These are included in the report and can be displayed on a map view.' },
      { q: 'Can I annotate photos before they go in the report?', a: 'Yes. Biddaro includes a built-in photo annotation tool — draw arrows, circles, rectangles, and add text highlights directly on photos.' },
      { q: 'How many photos can I include in one inspection report?', a: 'There is no hard limit. Inspectors regularly include 50–200+ photos in a single report. Biddaro processes all of them and places them in the correct sections.' },
      { q: 'Are photos exported at full resolution?', a: 'Yes. Photos are embedded in your Word and PDF exports at full resolution. JPEG and PNG formats are supported.' },
    ],
    metaTitle: 'GPS Photo Documentation for Construction Inspections — AI Captions | Biddaro',
    metaDescription: 'GPS-tagged site photos with automatic AI captions. Document defects, materials and conditions on site — photos embedded in your inspection report automatically.',
    keywords: ['site photo documentation software', 'GPS photo inspection app', 'construction photo report', 'AI photo caption inspection'],
  },
  {
    slug: 'client-portal',
    name: 'Client Portal',
    tagline: 'Share inspection reports with clients via a secure link — no login needed.',
    description: 'Every inspection report can be shared with your client through a branded, secure portal link. Clients can view, comment, and download the report — no account required.',
    icon: '🔗',
    capabilities: [
      'One-click shareable link per report',
      'No client login or account required',
      'Clients can view, comment and download',
      'Branded with your firm\'s name and logo',
      'Access controls — enable or disable anytime',
      'Tracks when client viewed the report',
    ],
    howItWorks: [
      { step: 'Generate the report', detail: 'Complete your site capture and let AI generate the draft. Review and approve.' },
      { step: 'Enable the client portal', detail: 'Toggle client portal on from the report dashboard. A unique link is generated instantly.' },
      { step: 'Share with your client', detail: 'Send the link via email or WhatsApp. Client can view, comment, and download without logging in.' },
    ],
    faqs: [
      { q: 'Does my client need a Biddaro account to view the report?', a: 'No. The client portal link gives access to the report without any login or account creation. Just send the link.' },
      { q: 'Can I disable client portal access after sharing?', a: 'Yes. You can enable or disable the client portal for any report at any time from the report dashboard.' },
      { q: 'Can clients leave comments on the report?', a: 'Yes. Clients can add comments against specific sections or items in the portal. You are notified of new comments.' },
      { q: 'Is the client portal branded with my firm\'s identity?', a: 'Yes. The portal displays your firm\'s name and the report is formatted in your template. Biddaro\'s branding is minimal.' },
      { q: 'Can I track if the client has viewed the report?', a: 'Yes. Biddaro records the timestamp of first view and each subsequent access, so you can confirm the client has received and opened the report.' },
    ],
    metaTitle: 'Inspection Report Client Portal — Share Reports Securely | Biddaro',
    metaDescription: 'Share inspection reports with clients via a secure link — no login required. Branded client portal with view tracking, comments, and download.',
    keywords: ['inspection report client portal', 'share inspection report online', 'client report sharing software'],
  },
  {
    slug: 'e-signatures',
    name: 'E-Signatures',
    tagline: 'Digital sign-off on inspection reports — inspector, contractor and client.',
    description: 'Biddaro Inspect includes a built-in e-signature module. Inspector, contractor, and client can all sign the report digitally — creating a legally sound, fully paperless sign-off process.',
    icon: '✍️',
    capabilities: [
      'Inspector signature on report completion',
      'Client sign-off via the client portal link',
      'Contractor acknowledgement signature',
      'Timestamped signatures with IP record',
      'Signed reports exported with signature blocks',
      'Notification emails on each signature event',
    ],
    howItWorks: [
      { step: 'Inspector signs first', detail: 'On completing the report, the inspector adds their signature digitally from any device.' },
      { step: 'Client receives the portal link', detail: 'The client views the report in the portal and signs off — no download or app required.' },
      { step: 'Signed report is archived', detail: 'All signatures are timestamped and the final signed report is available for download as PDF.' },
    ],
    faqs: [
      { q: 'Are e-signatures on Biddaro legally valid?', a: 'Biddaro e-signatures are timestamped and record the signer\'s identity and IP. They meet the requirements of most B2B and B2C inspection agreements. For formal legal proceedings, consult your legal advisor.' },
      { q: 'Can the client sign from their phone?', a: 'Yes. The client portal is fully mobile-optimised. Clients can review and sign the report from any smartphone without downloading an app.' },
      { q: 'How many people can sign a report?', a: 'Multiple signatories are supported — inspector, site engineer, contractor, client, and consultant. Each sign independently via their respective links or the client portal.' },
      { q: 'Are signatures included in the exported PDF?', a: 'Yes. The final signed PDF includes all signature blocks with names, timestamps, and signature images embedded in the document.' },
      { q: 'Can I send a signature request via WhatsApp?', a: 'Yes. The client portal link (which includes the sign-off form) can be shared via any channel — email, WhatsApp, SMS — making it easy to collect signatures from field teams.' },
    ],
    metaTitle: 'E-Signatures for Inspection Reports — Digital Sign-Off | Biddaro',
    metaDescription: 'Digital sign-off on inspection reports for inspector, contractor and client. Timestamped e-signatures, mobile-friendly, legally sound — fully paperless.',
    keywords: ['e-signature inspection report', 'digital sign-off inspection', 'inspection report e-sign'],
  },
  {
    slug: 'offline-mode',
    name: 'Offline Mode',
    tagline: 'Full inspection capture with no internet — sync when you\'re back.',
    description: 'Biddaro Inspect\'s offline mode lets you document an entire site inspection — photos, voice notes, and observations — with zero connectivity. All data syncs automatically when you return online.',
    icon: '📡',
    capabilities: [
      'Photo capture stored locally when offline',
      'Voice notes and text observations saved offline',
      'GPS coordinates recorded without mobile data',
      'Automatic sync on connectivity restore',
      'No data loss — captures survive app close',
      'Works on remote sites, basements, and rural areas',
    ],
    howItWorks: [
      { step: 'Open the app before leaving for site', detail: 'Your project templates and settings are cached. No internet needed on site.' },
      { step: 'Capture everything offline', detail: 'Photos, voice, and text are saved to your device. GPS works independently of mobile data.' },
      { step: 'Sync automatically', detail: 'Return to connectivity (WiFi or mobile data) and all captures upload and sync instantly.' },
    ],
    faqs: [
      { q: 'Does offline mode work for photo capture?', a: 'Yes. Photos are saved to device storage when offline. They upload automatically when you reconnect.' },
      { q: 'What happens if my phone runs out of battery mid-inspection?', a: 'All captures are saved continuously to device storage. Recharge and reopen the app — your data is intact and will sync when online.' },
      { q: 'Does GPS work offline?', a: 'Yes. GPS coordinates are recorded by your device independently of mobile data or WiFi. Photos are GPS-tagged even in offline mode.' },
      { q: 'How long can I stay offline?', a: 'There is no time limit. You can capture an entire day\'s inspection offline and sync at the end of the day.' },
      { q: 'Is offline mode available on all plans?', a: 'Yes. Offline capture is available on all Biddaro Inspect plans, including the free tier.' },
    ],
    metaTitle: 'Offline Inspection App — Capture On Site Without Internet | Biddaro',
    metaDescription: 'Full inspection capture with no internet connection. Photos, voice notes, and GPS tagging work offline — auto-sync when back online. Perfect for remote sites.',
    keywords: ['offline inspection app', 'inspection app no internet', 'offline site inspection software', 'offline construction inspection'],
  },
];

export function getInspectFeature(slug: string): InspectFeature | undefined {
  return INSPECT_FEATURES.find((f) => f.slug === slug);
}

export function getAllInspectFeatureSlugs(): string[] {
  return INSPECT_FEATURES.map((f) => f.slug);
}

// ─── Industries ───────────────────────────────────────────────────────────────

export interface InspectIndustry {
  slug: string;
  name: string;
  tagline: string;
  description: string;
  icon: string;
  painPoints: { title: string; description: string }[];
  solutions: { title: string; description: string }[];
  faqs: { q: string; a: string }[];
  metaTitle: string;
  metaDescription: string;
  keywords?: string[];
  professionalLabel?: string;
}

export const INSPECT_INDUSTRIES: InspectIndustry[] = [
  {
    slug: 'construction-companies',
    name: 'Construction Companies',
    tagline: 'Site-to-report in minutes — for project managers and site engineers.',
    description: 'Construction companies use Biddaro Inspect to standardise site inspection documentation across multiple projects — reducing report time from hours to minutes.',
    icon: '🏗️',
    painPoints: [
      { title: 'Reports take hours to write', description: 'After a long site visit, engineers spend 2–4 hours typing up observations, resizing photos, and formatting Word documents.' },
      { title: 'No standardised format', description: 'Every inspector has a different style. Reports look inconsistent across projects and don\'t match client expectations.' },
      { title: 'Photos are disorganised', description: 'Hundreds of photos end up in WhatsApp or a shared drive — unlabelled, unordered, and impossible to match to report sections.' },
    ],
    solutions: [
      { title: 'AI writes the report', description: 'Upload your template once. AI generates the full report from your site captures — narrative, photos in sections, defect list.' },
      { title: 'Standardised across all projects', description: 'Every report follows your firm\'s template automatically. Consistent quality across all inspectors and projects.' },
      { title: 'Photos auto-organised', description: 'Every photo is tagged to a section, GPS-stamped, and AI-captioned. They appear in the right place in your report automatically.' },
      { title: 'One mobile app for everything', description: 'Photos, voice notes, and typed observations in one app. No WhatsApp, no shared drives, no post-inspection sorting.' },
    ],
    faqs: [
      { q: 'How does Biddaro help construction companies with site inspections?', a: 'Biddaro Inspect gives construction companies a standardised, AI-powered workflow: capture on site with the mobile app, and receive a complete report in your firm\'s format in minutes.' },
      { q: 'Can multiple engineers use Biddaro on the same project?', a: 'Yes. Biddaro Inspect supports team projects with multiple inspectors. All captures from the team feed into a single report.' },
      { q: 'Does Biddaro integrate with our existing project management tools?', a: 'Biddaro includes a Webhooks API for integration with project management platforms. Native integrations with Procore and Autodesk are on the roadmap.' },
      { q: 'Can we customise the report template for each client?', a: 'Yes. You can create multiple templates in Biddaro — one per client or project type. Inspectors select the template when starting a project.' },
      { q: 'Is Biddaro suitable for large construction firms with many projects?', a: 'Yes. Biddaro Inspect scales from individual inspectors to enterprise construction companies with hundreds of active projects.' },
    ],
    metaTitle: 'Inspection Report Software for Construction Companies | Biddaro',
    metaDescription: 'AI-powered site inspection reports for construction companies. Standardise documentation, reduce report time by 80%, and deliver professional client reports.',
    keywords: ['inspection software construction companies', 'construction site report software', 'site inspection app contractors'],
  },
  {
    slug: 'property-inspectors',
    name: 'Property Inspectors',
    tagline: 'Professional property reports — in your format, in minutes.',
    description: 'Independent property inspectors and inspection firms use Biddaro Inspect to generate branded, detailed property condition reports from site photos and notes — in a fraction of the time.',
    icon: '🏠',
    painPoints: [
      { title: 'Typing reports takes your evening', description: 'After inspecting 3 properties in a day, hours are spent writing up reports at night. Biddaro cuts that to minutes.' },
      { title: 'Clients expect fast turnaround', description: 'Buyers and sellers want reports the same day. Manual drafting makes same-day delivery almost impossible.' },
      { title: 'Inconsistent quality across clients', description: 'Different clients, different template requests. Keeping up with formatting requirements is time-consuming.' },
    ],
    solutions: [
      { title: 'Report ready before you leave the property', description: 'Capture on site, start the AI generation on the drive home — report is ready by the time you\'re back at the office.' },
      { title: 'Any format, any client', description: 'Upload a different template per client. Biddaro matches each one exactly — your branding, their format.' },
      { title: 'Professional photo documentation', description: 'AI captions every photo. Defects, materials, and conditions described professionally — no manual captioning.' },
    ],
    faqs: [
      { q: 'Is Biddaro Inspect good for independent property inspectors?', a: 'Yes. Biddaro Inspect is designed for sole traders and small firms as much as large organisations. The free plan is ideal for independent inspectors starting out.' },
      { q: 'Can I use my own branded report template?', a: 'Yes. Upload your Word or PDF template and Biddaro generates every report in your brand format.' },
      { q: 'How do I deliver the report to my client?', a: 'Export as PDF or Word and email it, or use the Biddaro client portal — share a secure link your client can view and download from.' },
      { q: 'Can Biddaro handle different inspection types (pre-purchase, rental, condition)?', a: 'Yes. Create a separate template in Biddaro for each inspection type. Switch templates when starting a new project.' },
      { q: 'Does Biddaro support e-signatures for property reports?', a: 'Yes. Both inspector and client can sign the report digitally — fully paperless sign-off included.' },
    ],
    metaTitle: 'Inspection Report Software for Property Inspectors | Biddaro',
    metaDescription: 'Property inspection report software for independent inspectors and firms. Upload your template, capture on site, AI generates the report. Same-day delivery made easy.',
    keywords: ['property inspection report software', 'inspection software property inspectors', 'property condition report app'],
  },
  {
    slug: 'home-inspectors',
    name: 'Home Inspectors',
    tagline: 'Complete home inspection reports — faster than any other tool.',
    description: 'Home inspectors use Biddaro Inspect to document residential property conditions, snags, and defects — and generate comprehensive reports in minutes.',
    icon: '🏡',
    painPoints: [
      { title: 'Handwriting notes then typing them up', description: 'The classic double-handling problem: notes on paper, then typed into a report. Biddaro eliminates the second step entirely.' },
      { title: 'Formatting takes longer than inspecting', description: 'Getting photos in the right place, the right size, with the right captions — takes as long as the inspection itself.' },
      { title: 'No visibility for clients until days later', description: 'Clients pay for a same-day report but get it two days later. Biddaro makes same-day delivery routine.' },
    ],
    solutions: [
      { title: 'Voice dictation on site', description: 'Speak your observations room by room. Biddaro transcribes and structures them into report sections automatically.' },
      { title: 'AI formats photos and captions automatically', description: 'No photo resizing, no manual captioning. AI handles all photo placement and description.' },
      { title: 'Send report same day, every time', description: 'Report generation takes minutes. Same-day delivery becomes your standard — a genuine competitive advantage.' },
    ],
    faqs: [
      { q: 'How long does a home inspection report take with Biddaro?', a: 'Most home inspection reports are generated in 3–5 minutes from the moment capture is complete. Review and edit adds another 10–15 minutes. Total report time under 20 minutes.' },
      { q: 'Can I customise the home inspection checklist?', a: 'Yes. Build a custom template covering all the rooms, systems, and items you inspect. Biddaro uses it for every report.' },
      { q: 'Does Biddaro work for pre-purchase home inspections?', a: 'Yes. Biddaro Inspect is well-suited for pre-purchase inspections, defect reports, and building condition assessments.' },
      { q: 'Can I include a defect summary at the front of the report?', a: 'Yes. Biddaro generates an executive summary section with a count of defects by severity — critical, warning, and normal.' },
      { q: 'What export formats does Biddaro support?', a: 'Word (.docx) and PDF. Both formats are produced from the same report and are available simultaneously.' },
    ],
    metaTitle: 'Home Inspection Report Software — Faster Reports, Same-Day Delivery | Biddaro',
    metaDescription: 'Home inspection report software that writes the report for you. Voice capture, AI formatting, same-day PDF delivery. Used by home inspectors across India and UAE.',
    keywords: ['home inspection report software', 'home inspector app', 'residential inspection report generator'],
  },
  {
    slug: 'civil-engineers',
    name: 'Civil Engineers',
    tagline: 'Structured civil inspection reports from field data — AI-generated.',
    description: 'Civil engineers and structural consultants use Biddaro Inspect to document site conditions, structural observations, and quality inspections — then generate formal technical reports that meet client and authority standards.',
    icon: '🌉',
    painPoints: [
      { title: 'Technical reports require precise language', description: 'Civil inspection reports need engineering-grade language. AI trained on construction vocabulary delivers it consistently.' },
      { title: 'Multiple site visits, one report', description: 'Civil projects involve repeat inspections. Managing observations across visits and producing a consolidated report is complex.' },
      { title: 'Evidence documentation for disputes', description: 'Timestamped, GPS-tagged, photo-evidenced documentation is critical when construction disputes arise. Paper records don\'t hold up.' },
    ],
    solutions: [
      { title: 'Technical language from AI', description: 'Biddaro\'s AI uses engineering vocabulary appropriate to civil and structural inspection — concrete, reinforcement, drainage, sub-base, and more.' },
      { title: 'Project-level organisation', description: 'All inspections for a civil project live in one place. Generate interim and final reports from selected observations.' },
      { title: 'Timestamped, GPS-evidenced records', description: 'Every capture is timestamped and GPS-tagged automatically. Legally defensible documentation from day one.' },
    ],
    faqs: [
      { q: 'Is Biddaro Inspect suitable for civil engineering inspection reports?', a: 'Yes. Civil engineers use Biddaro for structural observations, drainage inspections, road and pavement surveys, earthworks monitoring, and quality compliance documentation.' },
      { q: 'Can I generate interim progress reports during a long project?', a: 'Yes. Generate reports at any stage — weekly, monthly, or milestone-based — from the captures logged against a project.' },
      { q: 'Does Biddaro produce ITP (Inspection Test Plan) compatible reports?', a: 'Biddaro can be configured with custom templates that match your ITP structure. The AI populates observations into the correct ITP sections.' },
      { q: 'Can I attach survey data or drawings to a Biddaro report?', a: 'Photos and voice notes are the primary capture modes. Drawings and documents can be attached as supporting files to the project.' },
      { q: 'Does Biddaro comply with IS or BS standards for civil inspection?', a: 'Biddaro generates documentation consistent with IS and BS standards when the appropriate template structure is provided.' },
    ],
    metaTitle: 'Civil Engineering Inspection Report Software | Biddaro Inspect',
    metaDescription: 'AI-powered inspection reports for civil engineers. Structural observations, drainage inspections, quality audits — generated from field data in minutes.',
    keywords: ['civil engineering inspection software', 'structural inspection report software', 'civil site inspection app'],
  },
  {
    slug: 'mep-contractors',
    name: 'MEP Contractors',
    tagline: 'MEP inspection reports — mechanical, electrical and plumbing documentation.',
    description: 'MEP contractors and commissioning engineers use Biddaro Inspect to document mechanical, electrical, and plumbing installations — and generate comprehensive inspection reports for clients, consultants, and authorities.',
    icon: '⚡',
    painPoints: [
      { title: 'Complex multi-discipline reports', description: 'MEP reports cover multiple systems. Organising observations by discipline (M, E, P) while keeping one coherent document is time-consuming.' },
      { title: 'Commissioning sign-off delays', description: 'Delayed documentation holds up commissioning sign-off and project handover. Fast report generation unblocks the process.' },
      { title: 'Non-conformance tracking', description: 'Tracking NCRs across multiple site visits without a system leads to items being missed or revisited without resolution.' },
    ],
    solutions: [
      { title: 'Multi-discipline section templates', description: 'Create a template with M, E, and P sections. Biddaro routes each capture to the correct section automatically.' },
      { title: 'Same-day commissioning reports', description: 'Commissioning engineers generate reports on site — ready for consultant review the same day, not a week later.' },
      { title: 'NCR tracking per project', description: 'Tag captures as non-conformances with severity levels. Biddaro tracks and reports on NCR status across the project lifecycle.' },
    ],
    faqs: [
      { q: 'Can Biddaro Inspect handle MEP commissioning reports?', a: 'Yes. MEP commissioning engineers use Biddaro to document equipment testing, installation checks, and commissioning results — exporting as formal commissioning reports.' },
      { q: 'Does Biddaro support NCR (Non-Conformance Report) tracking?', a: 'Yes. Captures tagged as non-conformances are tracked at the project level. You can generate NCR-specific reports or include NCR summaries in main inspection reports.' },
      { q: 'Can I create separate sections for Mechanical, Electrical, and Plumbing?', a: 'Yes. Custom templates can include any section structure. MEP inspectors typically create M / E / P / General sections in their template.' },
      { q: 'Is Biddaro suitable for fire and life safety system inspections?', a: 'Yes. Fire suppression, detection, and life safety systems are commonly inspected using Biddaro. Custom templates for NFPA or local code compliance can be configured.' },
      { q: 'Can consultants access the MEP inspection report directly?', a: 'Yes. Use the client portal to share a secure link with your MEP consultant. They can view, comment, and download without a Biddaro account.' },
    ],
    metaTitle: 'MEP Inspection Report Software — Mechanical, Electrical & Plumbing | Biddaro',
    metaDescription: 'MEP inspection report software for mechanical, electrical and plumbing contractors. Commissioning reports, NCR tracking, multi-discipline templates. AI-generated.',
    keywords: ['MEP inspection report software', 'MEP commissioning report app', 'mechanical electrical plumbing inspection software'],
  },
  {
    slug: 'real-estate-developers',
    name: 'Real Estate Developers',
    tagline: 'Handover-ready inspection reports — deliver with confidence.',
    description: 'Real estate developers use Biddaro Inspect to manage pre-handover inspections, snag lists, and defect rectification documentation across entire project inventories.',
    icon: '🏢',
    painPoints: [
      { title: 'Managing hundreds of unit inspections', description: 'Inspecting 200 apartments before handover creates hundreds of individual reports. Managing, tracking, and sharing them manually is overwhelming.' },
      { title: 'Buyer disputes over defects', description: 'Without timestamped, photo-evidenced documentation of pre-handover condition, defect disputes are hard to resolve.' },
      { title: 'Slow rectification cycles', description: 'Snag lists on paper get lost. Contractors fix the wrong items. Without a digital record, rectification loops take weeks.' },
    ],
    solutions: [
      { title: 'Unit-level inspection projects', description: 'Create one Biddaro project per unit. Inspectors document snags unit by unit. Reports are generated and filed instantly.' },
      { title: 'Photo-evidenced, timestamped records', description: 'Every defect is photo-documented with GPS, timestamp, and AI description. Legally defensible from day one.' },
      { title: 'Share snag lists directly with contractors', description: 'Use the client portal to share snag lists directly with the contractor responsible for each trade. No printing, no WhatsApp.' },
    ],
    faqs: [
      { q: 'Can Biddaro handle pre-handover snagging for large residential developments?', a: 'Yes. Biddaro Inspect is used by developers managing 50–500+ unit inspections. Create one project per unit and generate reports at scale.' },
      { q: 'Can we share snag lists with contractors and sub-contractors?', a: 'Yes. Each report has a client portal link that can be shared with contractors. They can view the snag list, acknowledge items, and sign off digitally.' },
      { q: 'Does Biddaro track whether snags have been rectified?', a: 'Biddaro captures defect status at each inspection visit. Developers run a follow-up inspection and update snag status — creating a clear rectification record.' },
      { q: 'How does Biddaro help with RERA compliance in India?', a: 'Biddaro generates timestamped, photo-evidenced inspection reports that support RERA handover documentation requirements. Reports can be exported and filed as part of the RERA submission package.' },
      { q: 'Can buyers receive their own inspection report via the portal?', a: 'Yes. The client portal link can be shared directly with the buyer, giving them a professional, branded view of their unit\'s inspection report.' },
    ],
    metaTitle: 'Inspection Report Software for Real Estate Developers | Biddaro',
    metaDescription: 'Pre-handover inspection and snagging software for real estate developers. Unit-level snag lists, photo-evidenced defect records, contractor sharing. RERA ready.',
    keywords: ['inspection software real estate developers', 'pre-handover inspection software', 'snag list software developers'],
  },
  {
    slug: 'safety-managers',
    name: 'Safety Managers',
    tagline: 'Safety inspection reports — timestamped, evidenced, audit-ready.',
    description: 'Health & safety managers and EHS professionals use Biddaro Inspect to document site safety observations, conduct safety audits, and generate compliant inspection reports — fast.',
    icon: '⛑️',
    painPoints: [
      { title: 'Safety reports need to be immediate', description: 'A hazard identified on site needs to be documented and reported within hours, not days. Manual reporting is too slow.' },
      { title: 'Audit trails must be watertight', description: 'Safety documentation must be timestamped, evidenced, and traceable. Paper and WhatsApp don\'t meet this standard.' },
      { title: 'Corrective actions aren\'t tracked', description: 'Without a system, corrective action requests get lost. Non-compliances recur and create liability.' },
    ],
    solutions: [
      { title: 'Instant on-site safety reporting', description: 'Document hazards, unsafe acts, and non-compliances immediately on your phone. Report generated and sent within minutes of the site visit.' },
      { title: 'Timestamped, GPS-evidenced records', description: 'Every observation automatically timestamped and GPS-tagged. Meets the evidence standard for regulatory inspections and legal proceedings.' },
      { title: 'Severity flagging and corrective action tracking', description: 'Tag observations as Normal, Warning, or Critical. Track corrective actions per project. AI generates a corrective action summary in each report.' },
    ],
    faqs: [
      { q: 'Can Biddaro Inspect be used for HSSE safety audits?', a: 'Yes. Health, Safety, Security and Environment (HSSE) auditors use Biddaro to capture site observations and generate audit reports with photo evidence and corrective action summaries.' },
      { q: 'How quickly can a safety inspection report be generated?', a: 'Within minutes of completing your site walk. The report is AI-generated from your photos and voice observations — ready to send to the site manager or client immediately.' },
      { q: 'Does Biddaro support ISO 45001 safety inspection documentation?', a: 'Biddaro generates documentation consistent with ISO 45001 requirements when an appropriate template is configured. Custom templates for your safety management system can be uploaded.' },
      { q: 'Can Biddaro flag critical safety observations automatically?', a: 'Yes. Captures tagged as "Critical" are highlighted in the report with visual flags and appear in the executive summary section. Automatic email notifications can also be configured.' },
      { q: 'Is Biddaro Inspect used for fire safety inspections?', a: 'Yes. Fire safety officers use Biddaro to document fire detection, suppression, evacuation route, and PPE compliance — generating formal inspection reports from field captures.' },
    ],
    metaTitle: 'Safety Inspection Report Software for HSE Managers | Biddaro',
    metaDescription: 'Safety inspection report software for health & safety managers. Capture hazards on site, AI generates HSSE audit reports with photo evidence and corrective actions.',
    keywords: ['safety inspection report software', 'HSE inspection app', 'HSSE audit report software', 'safety audit software construction'],
  },
];

export function getInspectIndustry(slug: string): InspectIndustry | undefined {
  return INSPECT_INDUSTRIES.find((i) => i.slug === slug);
}

export function getAllInspectIndustrySlugs(): string[] {
  return INSPECT_INDUSTRIES.map((i) => i.slug);
}
