// ─── User Types ───────────────────────────────────────────────────────────────

export type UserRole = 'job_poster' | 'contractor' | 'admin';
export type AvailabilityStatus = 'available' | 'busy' | 'unavailable';

export interface PortfolioItem {
  id: string;
  title: string;
  description: string;
  imageUrl?: string;
  category: string;
  projectValue?: number;
  year: number;
  location?: string;
}

export interface Certification {
  id: string;
  name: string;
  issuer: string;
  year: number;
  expiryYear?: number;
  imageUrl?: string;
}

export interface WorkHistoryItem {
  id: string;
  company: string;
  role: string;
  startYear: number;
  endYear?: number;
  current: boolean;
  description: string;
  location?: string;
}

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  profileImage?: string;
  phone?: string;
  location?: string;
  bio?: string;
  skills?: string | string[];       // JSON string or parsed array
  licenseNumber?: string;
  yearsExperience?: number;
  isVerified: boolean;
  isPremium?: boolean;
  premiumPlan?: string;
  rating?: number;
  isActive?: boolean;
  // ── Extended contractor profile ──────────────────────────────────────────
  portfolio?:      PortfolioItem[];
  certifications?: Certification[];
  workHistory?:    WorkHistoryItem[];
  availability?:   AvailabilityStatus;
  hourlyRate?:     number;
  website?:        string;
  languages?:      string | string[];
  serviceRadius?:  number;
  createdAt: string;
  updatedAt: string;
}

// ─── Notification Types ───────────────────────────────────────────────────────

export type NotificationType =
  | 'escrow_funded'
  | 'milestone_started'
  | 'milestone_completed'
  | 'milestone_approved'
  | 'contract_completed'
  | 'contract_cancelled'
  | 'noc_issued'
  | 'clarification_asked'
  | 'clarification_answered'
  | 'dispute_opened'
  | string;

export interface Notification {
  id: string;
  userId: string;
  type: NotificationType;
  title: string;
  message: string;
  isRead: boolean;
  data?: Record<string, unknown>;
  createdAt: string;
  updatedAt: string;
}

// ─── Job Types ────────────────────────────────────────────────────────────────

export type JobStatus = 'open' | 'in_progress' | 'completed' | 'closed' | 'cancelled';
export type ProjectType = 'standard' | 'government' | 'corporate';

export type JobCategory =
  | 'General Construction'
  | 'Plumbing'
  | 'Electrical'
  | 'HVAC'
  | 'Roofing'
  | 'Flooring'
  | 'Painting'
  | 'Landscaping'
  | 'Carpentry'
  | 'Masonry'
  | 'Demolition'
  | 'Renovation'
  | 'New Construction'
  | 'Other';

export interface Job {
  id: string;
  posterId: string;
  poster: User;
  title: string;
  description: string;
  category: JobCategory | string;
  budget: number;
  currency: string;
  startDate?: string;
  endDate?: string;
  location: string;
  latitude?: number;
  longitude?: number;
  skills?: string | string[];
  status: JobStatus;
  projectType?: ProjectType;
  images?: string | string[];
  bidCount?: number;
  createdAt: string;
  updatedAt: string;
}

// ─── Bid Types ────────────────────────────────────────────────────────────────

export type BidStatus = 'pending' | 'accepted' | 'declined' | 'withdrawn' | 'expired';

export interface BidMilestone {
  title: string;
  description?: string;
  amount: number;
  dueDate?: string;
}

export interface Bid {
  id: string;
  jobId: string;
  job?: Job;
  contractorId: string;
  contractor: User;
  amount: number;
  currency: string;
  estimatedDays?: number;
  proposal?: string;
  documents?: string[];           // uploaded file URLs
  milestones?: BidMilestone[];    // proposed payment milestones
  status: BidStatus;
  isPriority?: boolean;           // true when premium contractor bids on gov/corp job
  createdAt: string;
  updatedAt: string;
}

// ─── Contract Types ───────────────────────────────────────────────────────────

export type ContractStatus =
  | 'active'
  | 'completed'
  | 'disputed'
  | 'cancelled';

export interface Milestone {
  title: string;
  description?: string;
  amount: number;
  status: 'pending' | 'in_progress' | 'completed' | 'approved';
  escrowFunded?: boolean;      // true when this milestone's escrow was individually funded (per-milestone mode)
  dueDate?: string;
  proofDocuments?: string[];   // URLs of proof files uploaded by contractor
  startedAt?: string;
  completedAt?: string;
  approvedAt?: string;
}

export interface Contract {
  id: string;
  jobId: string;
  job: Job;
  bidId: string;
  bid: Bid;
  posterId: string;
  poster: User;
  contractorId: string;
  contractor: User;
  totalAmount: number;
  currency: string;
  status: ContractStatus;
  escrowFunded: boolean;
  escrowAmount: number;
  releasedAmount: number;
  startDate?: string;
  endDate?: string;
  milestones?: Milestone[];   // parsed from JSON
  completedAt?: string;
  nocIssuedAt?: string;
  nocIssuerNote?: string;
  createdAt: string;
  updatedAt: string;
}

// ─── NOC Certificate ──────────────────────────────────────────────────────────

export interface NocCertificate {
  certificateNumber: string;
  contractId: string;
  nocIssuedAt: string;
  nocIssuerNote?: string;
  job: { id: string; title: string; category: string; location: string };
  contractor: { id: string; firstName: string; lastName: string; profileImage?: string };
  poster: { id: string; firstName: string; lastName: string; profileImage?: string };
  totalAmount: number;
  currency: string;
  completedAt?: string;
  review?: { rating: number; comment?: string } | null;
}

// ─── Clarification Types ──────────────────────────────────────────────────────

export type ClarificationStatus = 'pending' | 'answered' | 'closed';

export interface ClarificationParty {
  id: string;
  firstName: string;
  lastName: string;
  profileImage?: string;
}

export interface ClarificationRequest {
  id: string;
  contractId: string;
  askedById: string;
  askedBy: ClarificationParty;
  question: string;
  answer?: string;
  answeredById?: string;
  answeredBy?: ClarificationParty;
  status: ClarificationStatus;
  answeredAt?: string;
  createdAt: string;
  updatedAt: string;
}

// ─── Wallet Types ─────────────────────────────────────────────────────────────

export interface Wallet {
  id: string;
  userId: string;
  balance: number;
  pendingBalance: number;
  totalEarned: number;
  createdAt: string;
  updatedAt: string;
}

export interface WalletStats {
  balance: number;
  pendingBalance: number;
  totalEarned: number;
  thisMonthEarnings: number;
  thisMonthFees: number;
  pendingTransactions?: number;
}

export type TransactionType = 'credit' | 'debit' | 'withdrawal' | 'fee' | 'refund';
export type TransactionStatus = 'pending' | 'completed' | 'failed';

export interface Transaction {
  id: string;
  userId: string;
  walletId: string;
  type: TransactionType;
  amount: number;
  description?: string;
  status: TransactionStatus;
  reference?: string;
  contractId?: string;
  createdAt: string;
  updatedAt: string;
}

// ─── Message Types ────────────────────────────────────────────────────────────

export interface Message {
  id: string;
  senderId: string;
  sender: User;
  receiverId: string;
  receiver: User;
  jobId?: string;
  contractId?: string;
  content: string;
  isRead: boolean;
  createdAt: string;
}

export interface Conversation {
  otherUserId: string;
  otherUser: User;
  lastMessage: Message;
  unreadCount: number;
  jobId?: string;
  job?: Job;
}

// ─── Dispute Types ────────────────────────────────────────────────────────────

export type DisputeStatus = 'open' | 'under_review' | 'resolved' | 'closed';

export interface Dispute {
  id: string;
  contractId: string;
  raisedById: string;
  raisedBy: User;
  reason: string;
  description: string;
  status: DisputeStatus;
  response?: string;
  respondedAt?: string;
  resolution?: string;
  outcome?: string;
  resolvedById?: string;
  createdAt: string;
  updatedAt: string;
}

// ─── Review Types ─────────────────────────────────────────────────────────────

export interface Review {
  id: string;
  reviewerId: string;
  reviewer: User;
  revieweeId: string;
  reviewee: User;
  contractId: string;
  rating: number;
  comment: string;
  createdAt: string;
  job?: { id: string; title: string };
}


// ─── API Types ────────────────────────────────────────────────────────────────

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  error?: string;
}

export interface PaginatedResponse<T> {
  success: boolean;
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

// ─── Filter/Query Types ───────────────────────────────────────────────────────

export interface JobFilters {
  search?: string;
  category?: string;
  status?: JobStatus;
  minBudget?: number;
  maxBudget?: number;
  location?: string;
  projectType?: ProjectType;
  skills?: string[];
  sortBy?: 'createdAt' | 'budget' | 'bidCount';
  sortOrder?: 'asc' | 'desc';
  page?: number;
  limit?: number;
}
