// ─── User Types ───────────────────────────────────────────────────────────────

export type UserRole = 'job_poster' | 'contractor' | 'admin';

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
  skills?: string | string[];   // stored as JSON string, may be parsed
  licenseNumber?: string;
  yearsExperience?: number;
  isVerified: boolean;
  rating?: number;
  isActive?: boolean;
  createdAt: string;
  updatedAt: string;
}

// ─── Job Types ────────────────────────────────────────────────────────────────

export type JobStatus = 'open' | 'in_progress' | 'completed' | 'closed' | 'cancelled';

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
  images?: string | string[];
  bidCount?: number;
  createdAt: string;
  updatedAt: string;
}

// ─── Bid Types ────────────────────────────────────────────────────────────────

export type BidStatus = 'pending' | 'accepted' | 'declined' | 'withdrawn' | 'expired';

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
  status: BidStatus;
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
  dueDate?: string;
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
  startDate?: string;
  endDate?: string;
  milestones?: Milestone[];   // parsed from JSON
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
}

// ─── Notification Types ───────────────────────────────────────────────────────

export type NotificationType =
  | 'new_bid'
  | 'bid_accepted'
  | 'bid_declined'
  | 'contract_signed'
  | 'payment_received'
  | 'new_message'
  | 'dispute_opened'
  | 'review_received';

export interface Notification {
  id: string;
  userId: string;
  type: NotificationType;
  title: string;
  body: string;
  isRead: boolean;
  link?: string;
  createdAt: string;
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
  skills?: string[];
  sortBy?: 'createdAt' | 'budget' | 'bidCount';
  sortOrder?: 'asc' | 'desc';
  page?: number;
  limit?: number;
}
