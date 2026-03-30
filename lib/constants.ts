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

export const SUPPORTED_COUNTRIES = [
  { label: 'India', value: 'IN', currency: 'INR', symbol: '₹', locale: 'en_IN' },
  { label: 'United Arab Emirates', value: 'AE', currency: 'AED', symbol: 'د.إ', locale: 'en_AE' },
  { label: 'Singapore', value: 'SG', currency: 'SGD', symbol: 'S$', locale: 'en_SG' },
  { label: 'United States', value: 'US', currency: 'USD', symbol: '$', locale: 'en_US' },
] as const;

export const CURRENCIES = [
  { label: 'USD ($)', value: 'USD', symbol: '$' },
  { label: 'AED (د.إ)', value: 'AED', symbol: 'د.إ' },
  { label: 'SGD (S$)', value: 'SGD', symbol: 'S$' },
  { label: 'INR (₹)', value: 'INR', symbol: '₹' },
] as const;

export const BUDGET_RANGES = [
  { label: 'Under $1,000', min: 0, max: 1000 },
  { label: '$1,000 – $5,000', min: 1000, max: 5000 },
  { label: '$5,000 – $10,000', min: 5000, max: 10000 },
  { label: '$10,000 – $25,000', min: 10000, max: 25000 },
  { label: '$25,000 – $50,000', min: 25000, max: 50000 },
  { label: '$50,000+', min: 50000, max: null },
] as const;

export const UAE_LOCATIONS = [
  { emirate: 'Abu Dhabi', cities: ['Abu Dhabi City', 'Al Ain', 'Al Dhafra', 'Al Shamkha', 'Khalifa City', 'Ruwais', 'Madinat Zayed'] },
  { emirate: 'Dubai', cities: ['Dubai City', 'Jebel Ali', 'Dubai Marina', 'Business Bay', 'Downtown Dubai', 'Deira', 'Jumeirah', 'Al Quoz', 'Dubai Silicon Oasis'] },
  { emirate: 'Sharjah', cities: ['Sharjah City', 'Al Dhaid', 'Kalba', 'Khor Fakkan', 'Dibba Al Hisn'] },
  { emirate: 'Ajman', cities: ['Ajman City', 'Masfout', 'Manama'] },
  { emirate: 'Ras Al Khaimah', cities: ['RAK City', 'Al Jazirah Al Hamra', 'Al Hamraniyah', 'Digdaga'] },
  { emirate: 'Fujairah', cities: ['Fujairah City', 'Dibba Al Fujairah', 'Masafi'] },
  { emirate: 'Umm Al Quwain', cities: ['UAQ City', 'Falaj Al Mualla'] },
] as const;

export const SINGAPORE_LOCATIONS = [
  { region: 'Central', districts: ['Downtown Core', 'Marina Bay', 'Orchard', 'Newton', 'Novena', 'Toa Payoh', 'Bishan', 'Ang Mo Kio', 'Bukit Timah', 'Tanglin', 'Rochor', 'Kallang', 'Geylang'] },
  { region: 'East', districts: ['Bedok', 'Tampines', 'Pasir Ris', 'Changi', 'Paya Lebar', 'Marine Parade'] },
  { region: 'West', districts: ['Jurong East', 'Jurong West', 'Clementi', 'Bukit Batok', 'Bukit Panjang', 'Choa Chu Kang', 'Tuas'] },
  { region: 'North', districts: ['Woodlands', 'Yishun', 'Sembawang', 'Mandai', 'Sungei Kadut'] },
  { region: 'North-East', districts: ['Sengkang', 'Punggol', 'Hougang', 'Serangoon', 'Ang Mo Kio'] },
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

export const PROJECT_TYPES = [
  { label: 'Standard',   value: 'standard'   },
  { label: 'Government', value: 'government' },
  { label: 'Corporate',  value: 'corporate'  },
] as const;

export const ROUTES = {
  HOME: '/',
  AI_ASSISTANT: '/ai-assistant',
  AI_IMAGE: '/ai-image',
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
  FIND_WORK: '/find-work',
  OPEN_JOBS: '/open-jobs',
  PREMIUM: '/premium',
  ADDONS: '/addons',
  PROJECT_TRACKING: '/project-tracking',
  PROJECT_MANAGER: '/project-manager',
  // Programmatic SEO – hire pages
  HIRE: '/hire',
  HIRE_CATEGORY: (category: string) => `/hire/${category}`,
  HIRE_STATE: (category: string, state: string) => `/hire/${category}/${state}`,
  HIRE_CITY: (category: string, state: string, city: string) => `/hire/${category}/${state}/${city}`,
  // Programmatic SEO – AI answer pages
  ASK: '/ask',
  ASK_QUESTION: (slug: string) => `/ask/${slug}`,
} as const;
