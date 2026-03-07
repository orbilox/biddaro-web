export const APP_NAME = 'Biddaro';
export const APP_DESCRIPTION = 'The construction marketplace connecting job posters with skilled contractors.';

export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

export const JOB_CATEGORIES = [
  'General Construction',
  'Plumbing',
  'Electrical',
  'HVAC',
  'Roofing',
  'Flooring',
  'Painting',
  'Landscaping',
  'Carpentry',
  'Masonry',
  'Demolition',
  'Renovation',
  'New Construction',
  'Foundation',
  'Insulation',
  'Drywall',
  'Tile & Stone',
  'Windows & Doors',
  'Siding',
  'Concrete',
  'Other',
] as const;

export const BUDGET_RANGES = [
  { label: 'Under $1,000', min: 0, max: 1000 },
  { label: '$1,000 – $5,000', min: 1000, max: 5000 },
  { label: '$5,000 – $10,000', min: 5000, max: 10000 },
  { label: '$10,000 – $25,000', min: 10000, max: 25000 },
  { label: '$25,000 – $50,000', min: 25000, max: 50000 },
  { label: '$50,000+', min: 50000, max: null },
] as const;

export const TIMELINE_OPTIONS = [
  '1 week',
  '2 weeks',
  '1 month',
  '2 months',
  '3 months',
  '6 months',
  '1 year',
  'Flexible',
] as const;

export const SKILLS = [
  'Blueprint Reading',
  'Project Management',
  'Welding',
  'Concrete Work',
  'Framing',
  'Finish Carpentry',
  'Tile Installation',
  'Waterproofing',
  'Structural Work',
  'Electrical Wiring',
  'Plumbing',
  'HVAC Systems',
  'Painting',
  'Drywall',
  'Insulation',
  'Roofing',
  'Landscaping',
  'Demolition',
  'Masonry',
  'Equipment Operation',
] as const;

export const SORT_OPTIONS = [
  { label: 'Newest First', value: 'createdAt:desc' },
  { label: 'Oldest First', value: 'createdAt:asc' },
  { label: 'Budget: High to Low', value: 'budget:desc' },
  { label: 'Budget: Low to High', value: 'budget:asc' },
  { label: 'Most Bids', value: 'bidCount:desc' },
] as const;

export const ROUTES = {
  HOME: '/',
  AI_ASSISTANT: '/ai-assistant',
  LOGIN: '/login',
  REGISTER: '/register',
  FORGOT_PASSWORD: '/forgot-password',
  DASHBOARD: '/dashboard',
  JOBS: '/jobs',
  JOB_POST: '/jobs/post',
  JOB_DETAIL: (id: string) => `/jobs/${id}`,
  MY_JOBS: '/my-jobs',
  BIDS: '/bids',
  CONTRACTS: '/contracts',
  CONTRACT_DETAIL: (id: string) => `/contracts/${id}`,
  MESSAGES: '/messages',
  WALLET: '/wallet',
  DISPUTES: '/disputes',
  PROFILE: '/profile',
  PUBLIC_PROFILE: (id: string) => `/profile/${id}`,
} as const;
