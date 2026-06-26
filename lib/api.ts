import axios from 'axios';
import { API_BASE_URL } from './constants';

const api = axios.create({
  baseURL: `${API_BASE_URL}/api/v1`,
  headers: { 'Content-Type': 'application/json' },
  withCredentials: true,
});

// Request interceptor: attach JWT
api.interceptors.request.use((config) => {
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('biddaro_token');
    if (token) config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor: handle 401
api.interceptors.response.use(
  (res) => res,
  async (err) => {
    if (err.response?.status === 401 && typeof window !== 'undefined') {
      localStorage.removeItem('biddaro_token');
      localStorage.removeItem('biddaro-auth');
      window.location.href = '/login';
    }
    return Promise.reject(err);
  }
);

// ─── Auth ─────────────────────────────────────────────────────────────────────

export const authApi = {
  register: (data: {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    role: string;
    country?: string;
    referralCode?: string;
  }) => api.post('/auth/register', data),
  login: (data: { email: string; password: string }) => api.post('/auth/login', data),
  logout: () => api.post('/auth/logout'),
  me: () => api.get('/auth/me'),
  refreshToken: (refreshToken: string) => api.post('/auth/refresh', { refreshToken }),
  changePassword: (data: { currentPassword: string; newPassword: string }) =>
    api.put('/auth/change-password', data),
  forgotPassword: (email: string) => api.post('/auth/forgot-password', { email }),
  resetPassword: (data: { token: string; newPassword: string }) =>
    api.post('/auth/reset-password', data),
  sendOtp: (email: string) => api.post('/auth/send-otp', { email }),
  verifyOtp: (email: string, code: string) => api.post('/auth/verify-otp', { email, code }),
  phoneVerify: (idToken: string) => api.post('/auth/phone-verify', { idToken }),
};

// ─── Jobs ─────────────────────────────────────────────────────────────────────

export const jobsApi = {
  list: (params?: Record<string, string | number>) => api.get('/jobs', { params }),
  get: (id: string) => api.get(`/jobs/${id}`),
  create: (data: Record<string, unknown>) => api.post('/jobs', data),
  update: (id: string, data: Record<string, unknown>) => api.put(`/jobs/${id}`, data),
  delete: (id: string) => api.delete(`/jobs/${id}`),
  myJobs: (params?: Record<string, string | number>) => api.get('/jobs/my', { params }),
  estimate: (data: Record<string, unknown>) => api.post('/jobs/estimate', data),
  getBids: (jobId: string) => api.get(`/jobs/${jobId}/bids`),
  recommended: () => api.get('/jobs/recommended'),
  bidInsights: (jobId: string) => api.get(`/jobs/${jobId}/bid-insights`),
};

// ─── Bids ─────────────────────────────────────────────────────────────────────

export const bidsApi = {
  myBids: (params?: Record<string, string | number>) => api.get('/bids/my', { params }),
  receivedBids: (params?: Record<string, string | number>) => api.get('/bids/received', { params }),
  create: (jobId: string, data: Record<string, unknown>) =>
    api.post(`/jobs/${jobId}/bids`, data),
  accept: (id: string) => api.post(`/bids/${id}/accept`),
  decline: (id: string) => api.post(`/bids/${id}/decline`),
  withdraw: (id: string) => api.post(`/bids/${id}/withdraw`),
};

// ─── Contracts ────────────────────────────────────────────────────────────────

export const contractsApi = {
  list: (params?: Record<string, string | number>) => api.get('/contracts', { params }),
  get: (id: string) => api.get(`/contracts/${id}`),
  updateMilestones: (id: string, milestones: unknown[]) =>
    api.put(`/contracts/${id}/milestones`, { milestones }),
  // ── Escrow ──────────────────────────────────────────────────────────────────
  // Full upfront: locks entire contract amount
  fundEscrow: (id: string) => api.post(`/contracts/${id}/fund`),
  // Per-milestone: locks only one milestone's amount at a time
  fundMilestoneEscrow: (id: string, milestoneIndex: number) =>
    api.post(`/contracts/${id}/fund-milestone`, { milestoneIndex }),
  // ── Milestone lifecycle ─────────────────────────────────────────────────────
  startMilestone: (id: string, milestoneIndex: number) =>
    api.post(`/contracts/${id}/milestones/start`, { milestoneIndex }),
  submitMilestone: (id: string, milestoneIndex: number, proofDocuments: string[]) =>
    api.post(`/contracts/${id}/milestones/submit`, { milestoneIndex, proofDocuments }),
  approveMilestone: (id: string, milestoneIndex: number) =>
    api.post(`/contracts/${id}/milestones/approve`, { milestoneIndex }),
  // ── Contract lifecycle ──────────────────────────────────────────────────────
  complete: (id: string) => api.post(`/contracts/${id}/complete`),
  cancel: (id: string) => api.post(`/contracts/${id}/cancel`),
  // ── NOC Certificate ─────────────────────────────────────────────────────────
  issueNoc: (id: string, note?: string) => api.post(`/contracts/${id}/noc`, { note }),
  getNoc: (id: string) => api.get(`/contracts/${id}/noc`),
};

// ─── Clarifications ───────────────────────────────────────────────────────────

export const clarificationsApi = {
  list:   (contractId: string) =>
    api.get(`/contracts/${contractId}/clarifications`),
  create: (contractId: string, question: string) =>
    api.post(`/contracts/${contractId}/clarifications`, { question }),
  answer: (contractId: string, clarificationId: string, answer: string) =>
    api.put(`/contracts/${contractId}/clarifications/${clarificationId}/answer`, { answer }),
};

// ─── Notifications ────────────────────────────────────────────────────────────

export const notificationsApi = {
  list:          (params?: Record<string, string | number>) => api.get('/notifications', { params }),
  unreadCount:   () => api.get('/notifications/unread-count'),
  markRead:      (id: string) => api.post(`/notifications/${id}/read`),
  markAllRead:   () => api.post('/notifications/read-all'),
  vapidPublicKey: () => api.get<{ success: boolean; data: { publicKey: string } }>('/notifications/vapid-public-key'),
  subscribePush:  (sub: { endpoint: string; keys: { p256dh: string; auth: string } }) =>
    api.post('/notifications/subscribe-push', sub),
  unsubscribePush: (endpoint: string) => api.post('/notifications/unsubscribe-push', { endpoint }),
  registerFcmToken: (data: { token: string; platform: string }) =>
    api.post('/notifications/fcm-token', data),
};

// ─── Messages ─────────────────────────────────────────────────────────────────

export const messagesApi = {
  // GET /messages → returns conversation list
  conversations: () => api.get('/messages'),
  // GET /messages/:otherUserId → messages in a thread
  getThread: (otherUserId: string, jobId?: string) =>
    api.get(`/messages/${otherUserId}`, { params: jobId ? { jobId } : undefined }),
  // POST /messages → send a message
  send: (data: { receiverId: string; content: string; jobId?: string }) =>
    api.post('/messages', data),
  // POST /messages/:otherUserId/read → mark conversation read
  markRead: (otherUserId: string) => api.post(`/messages/${otherUserId}/read`),
  // GET /messages/unread → unread count
  unreadCount: () => api.get('/messages/unread'),
  // DELETE /messages/:id
  delete: (id: string) => api.delete(`/messages/${id}`),
};

// ─── Wallet ───────────────────────────────────────────────────────────────────

export const walletApi = {
  get: () => api.get('/wallet'),
  stats: () => api.get('/wallet/stats'),
  transactions: (params?: Record<string, string | number>) =>
    api.get('/wallet/transactions', { params }),
  deposit: (amount: number) => api.post('/wallet/deposit', { amount }),
  withdraw: (amount: number) => api.post('/wallet/withdraw', { amount }),
};

// ─── Deposit Requests (Bank Transfer) ────────────────────────────────────────

export const depositRequestsApi = {
  /** User: submit a bank transfer proof */
  create: (data: {
    amount: number;
    transactionId: string;
    screenshotUrl: string;
    senderName?: string;
    senderBank?: string;
  }) => api.post('/deposit-requests', data),

  /** User: list my deposit requests */
  myRequests: (params?: { page?: number; limit?: number }) =>
    api.get('/deposit-requests/my', { params }),

  /** Admin: list all deposit requests */
  adminList: (params?: { page?: number; limit?: number; status?: string }) =>
    api.get('/deposit-requests/admin', { params }),

  /** Admin: approve or reject a deposit request */
  adminReview: (id: string, data: { action: 'approve' | 'reject'; adminNote?: string }) =>
    api.post(`/deposit-requests/admin/${id}/review`, data),
};

// ─── Disputes ─────────────────────────────────────────────────────────────────

export const disputesApi = {
  list: () => api.get('/disputes'),
  get: (id: string) => api.get(`/disputes/${id}`),
  create: (data: { contractId: string; reason: string; description: string }) =>
    api.post('/disputes', data),
  respond: (id: string, response: string) => api.post(`/disputes/${id}/respond`, { response }),
  resolve: (id: string, resolution: string, outcome: string) =>
    api.post(`/disputes/${id}/resolve`, { resolution, outcome }),
};

// ─── Referral ─────────────────────────────────────────────────────────────────

export const referralApi = {
  myInfo:  () => api.get('/referral/my'),
  stats:   () => api.get('/referral/stats'),
};

// ─── Reviews ──────────────────────────────────────────────────────────────────

export const reviewsApi = {
  myReviews: () => api.get('/reviews/my'),
  forUser: (userId: string) => api.get(`/reviews/user/${userId}`),
  forJob: (jobId: string) => api.get(`/reviews/job/${jobId}`),
  create: (data: { contractId: string; revieweeId: string; rating: number; comment?: string }) =>
    api.post('/reviews', data),
  delete: (id: string) => api.delete(`/reviews/${id}`),
};

// ─── Users / Profile ──────────────────────────────────────────────────────────

export const usersApi = {
  me: () => api.get('/auth/me'),
  myStats: () => api.get('/users/me/stats'),
  getPublic: (id: string) => api.get(`/users/${id}`),
  update: (data: Record<string, unknown>) => api.put('/users/me', data),
  delete: () => api.delete('/users/me'),
  listContractors: (params?: Record<string, string | number>) =>
    api.get('/users/contractors', { params }),
};

// ─── Upload ───────────────────────────────────────────────────────────────────

// ─── Upload helper (uses native fetch so multipart boundary is set correctly) ─

type UploadFileResult = { url: string; originalName: string; size: number; mimeType: string };

async function uploadFetch<T>(
  path: string,
  formData: FormData,
  timeoutMs = 30_000
): Promise<{ data: T }> {
  const token = typeof window !== 'undefined' ? localStorage.getItem('biddaro_token') : null;
  const controller = new AbortController();
  const timerId = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const res = await fetch(`${API_BASE_URL}/api/v1${path}`, {
      method: 'POST',
      body: formData,
      // Only set Authorization — do NOT set Content-Type so the browser adds the multipart boundary automatically
      headers: token ? { Authorization: `Bearer ${token}` } : {},
      signal: controller.signal,
    });
    clearTimeout(timerId);
    const json = await res.json();
    if (!res.ok) {
      const err = Object.assign(new Error(json?.message || 'Upload failed'), { response: { data: json } });
      throw err;
    }
    return { data: json };
  } catch (err) {
    clearTimeout(timerId);
    throw err;
  }
}

export const uploadApi = {
  /** Upload up to 10 images. Returns { files: UploadFileResult[] }. */
  images: (files: File[]) => {
    const formData = new FormData();
    files.forEach((f) => formData.append('files', f));
    return uploadFetch<{ success: boolean; data: { files: UploadFileResult[] } }>('/upload/images', formData);
  },
  /** Upload up to 5 documents (PDF/Word/txt). Returns { files: UploadFileResult[] }. */
  documents: (files: File[]) => {
    const formData = new FormData();
    files.forEach((f) => formData.append('files', f));
    return uploadFetch<{ success: boolean; data: { files: UploadFileResult[] } }>('/upload/documents', formData);
  },
  /** Upload a single file. Returns UploadFileResult. */
  single: (file: File) => {
    const formData = new FormData();
    formData.append('file', file);
    return uploadFetch<{ success: boolean; data: UploadFileResult }>('/upload/single', formData);
  },
};

// ─── Super Admin API ──────────────────────────────────────────────────────────

export const adminApi = {
  // Analytics
  stats: () => api.get('/admin/stats'),
  revenueChart: () => api.get('/admin/revenue-chart'),
  userGrowthChart: () => api.get('/admin/user-growth-chart'),
  recentActivity: (limit?: number) => api.get('/admin/activity', { params: limit ? { limit } : undefined }),

  // User Management
  listUsers: (params?: Record<string, string | number | boolean>) => api.get('/admin/users', { params }),
  getUser: (id: string) => api.get(`/admin/users/${id}`),
  updateUser: (id: string, data: Record<string, unknown>) => api.patch(`/admin/users/${id}`, data),
  deleteUser: (id: string) => api.delete(`/admin/users/${id}`),
  adjustWallet: (id: string, data: { amount: number; type: 'credit' | 'debit'; description?: string }) =>
    api.post(`/admin/users/${id}/wallet-adjust`, data),

  // Job Management
  listJobs: (params?: Record<string, string | number>) => api.get('/admin/jobs', { params }),
  getJob: (id: string) => api.get(`/admin/jobs/${id}`),
  updateJob: (id: string, data: Record<string, unknown>) => api.patch(`/admin/jobs/${id}`, data),
  deleteJob: (id: string) => api.delete(`/admin/jobs/${id}`),

  // Contract Management
  listContracts: (params?: Record<string, string | number>) => api.get('/admin/contracts', { params }),
  getContract: (id: string) => api.get(`/admin/contracts/${id}`),

  // Transaction Management
  listTransactions: (params?: Record<string, string | number>) => api.get('/admin/transactions', { params }),

  // Dispute Management
  listDisputes: (params?: Record<string, string | number>) => api.get('/admin/disputes', { params }),

  // Review Management
  listReviews: (params?: Record<string, string | number>) => api.get('/admin/reviews', { params }),
  deleteReview: (id: string) => api.delete(`/admin/reviews/${id}`),

  // Broadcast Notification
  broadcast: (data: { title: string; message: string; targetRole?: string; type?: string }) =>
    api.post('/admin/broadcast', data),

  // Loan Leads
  loanLeads: (params?: { page?: number; limit?: number; filter?: string }) =>
    api.get('/admin/loan-leads', { params }),

  // Push Notification Stats
  pushStats: () => api.get('/admin/push-stats'),

  // Social Posts
  socialPosts: (params?: { page?: number; limit?: number; status?: string; from?: string; to?: string }) =>
    api.get('/admin/social-posts', { params }),
  generateSocialPost: (topic?: string) =>
    api.post('/admin/social-posts/generate', topic ? { topic } : {}),
  planSocialMonth: (data: { year: number; month: number; cadence: string; customDays?: number[] }) =>
    api.post('/admin/social-posts/plan-month', data),
  createSocialPost: (data: { scheduledFor?: string; topic: string; caption?: string }) =>
    api.post('/admin/social-posts', data),
  generateSocialSlot: (id: string) =>
    api.post(`/admin/social-posts/${id}/generate`),
  updateSocialPost: (id: string, data: { status?: string; topic?: string; caption?: string; hashtags?: string }) =>
    api.patch(`/admin/social-posts/${id}`, data),
  deleteSocialPost: (id: string) =>
    api.delete(`/admin/social-posts/${id}`),
};

// ─── AI Assistant ─────────────────────────────────────────────────────────────

export type AiTextPart = { type: 'text'; text: string };
export type AiImagePart = {
  type: 'image_url';
  image_url: { url: string; detail?: 'auto' | 'low' | 'high' };
};
export type AiContentPart = AiTextPart | AiImagePart;

export const aiApi = {
  chat: (messages: Array<{ role: 'user' | 'assistant'; content: string | AiContentPart[] }>) =>
    api.post('/ai/chat', { messages }),
};

// ─── Loans ────────────────────────────────────────────────────────────────────

export const loansApi = {
  apply: (data: {
    loanType: string;
    amount: number;
    tenure: number;
    purpose: string;
    employmentType: string;
    monthlyIncome: number;
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    address: string;
    city: string;
    country: string;
    documents?: string[];
  }) => api.post('/loans', data),
  myApplications: () => api.get('/loans/my'),
  getApplication: (id: string) => api.get(`/loans/${id}`),
  // Admin
  adminList: (params?: { status?: string; page?: number }) => api.get('/loans/admin/all', { params }),
  adminReview: (id: string, data: { status: string; adminNote: string; approvedAmount?: number; interestRate?: number }) =>
    api.patch(`/loans/admin/${id}/review`, data),
  adminStats: () => api.get('/loans/admin/stats'),
  // ─── India Razorpay fee flow ─────────────────────────────────────────────
  createIndiaOrder: (data: { loanType: string; email?: string; phone?: string; firstName?: string; lastName?: string; fbp?: string; fbc?: string; fbclid?: string }) =>
    api.post<{ success: boolean; data: { orderId: string; amount: number; currency: string; key: string } }>(
      '/loans/india/order', data
    ),
  createIndiaSubscription: (data: { loanType: string; email?: string; phone?: string; firstName?: string; lastName?: string; fbp?: string; fbc?: string; fbclid?: string }) =>
    api.post<{ success: boolean; data: { subscriptionId: string; planId: string; key: string } }>(
      '/loans/india/subscription', data
    ),
  applyIndia: (data: Record<string, unknown>) =>
    api.post('/loans/india/apply', data),
  // Submit inquiry immediately after payment (no auth)
  submitInquiry: (data: Record<string, unknown>) =>
    api.post('/loans/india/inquiry', data),
  // Admin inquiries
  adminListInquiries: (params?: { status?: string; page?: number }) =>
    api.get('/loans/admin/inquiries', { params }),
  adminUpdateInquiry: (id: string, data: { status?: string; adminNote?: string }) =>
    api.patch(`/loans/admin/inquiries/${id}`, data),
};

export interface BankAccount {
  id: string;
  bankName: string;
  accountHolderName: string;
  accountNumber: string;
  routingNumber?: string;
  ifscCode?: string;
  swiftCode?: string;
  branch?: string;
  bankAddress?: string;
  paymentInstructions?: string;
  isActive?: boolean;
  sortOrder?: number;
  createdAt?: string;
  updatedAt?: string;
}

export const bankSettingsApi = {
  /** Authenticated users: get active bank accounts for deposit page */
  getAll: () => api.get<{ banks: BankAccount[] }>('/bank-settings'),

  /** Admin: get all bank accounts (including inactive) */
  adminGetAll: () => api.get<{ banks: BankAccount[] }>('/bank-settings/admin'),

  /** Admin: create a new bank account */
  adminCreate: (data: Omit<BankAccount, 'id'>) =>
    api.post<{ bank: BankAccount }>('/bank-settings/admin', data),

  /** Admin: update a bank account */
  adminUpdate: (id: string, data: Partial<Omit<BankAccount, 'id'>>) =>
    api.put<{ bank: BankAccount }>(`/bank-settings/admin/${id}`, data),

  /** Admin: delete a bank account */
  adminDelete: (id: string) => api.delete(`/bank-settings/admin/${id}`),
};

// ─── Premium Subscriptions ────────────────────────────────────────────────────

export type PremiumPlan = 'monthly' | 'quarterly' | 'annual';
export type PremiumStatus = 'active' | 'cancelled' | 'expired';

export interface PremiumSubscription {
  id: string;
  plan: PremiumPlan;
  amount: number;
  status: PremiumStatus;
  startDate: string;
  expiresAt: string;
  autoRenew: boolean;
  createdAt: string;
  user?: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    profileImage?: string;
    rating?: number;
  };
}

export interface ContractorPremiumStatus {
  isPremium: boolean;
  plan?: PremiumPlan;
  expiresAt?: string;
  subscribedAt?: string;
  autoRenew?: boolean;
  daysRemaining?: number;
}

export const premiumApi = {
  // ── Contractor-facing ──────────────────────────────────────────────────────
  /** Get current premium status for logged-in contractor */
  getStatus: () => api.get<{ data: ContractorPremiumStatus }>('/premium/status'),

  /** Subscribe or upgrade to a plan (debits wallet) */
  subscribe: (plan: PremiumPlan) =>
    api.post<{ data: PremiumSubscription }>('/premium/subscribe', { plan }),

  /** Cancel auto-renewal (stays active until expiry) */
  cancel: () => api.post('/premium/cancel'),

  /** Subscription history for the contractor */
  getHistory: () => api.get<{ data: PremiumSubscription[] }>('/premium/history'),

  // ── Admin ──────────────────────────────────────────────────────────────────
  /** Overall premium revenue stats */
  adminStats: () => api.get('/admin/premium/stats'),

  /** Paginated list of all premium subscriptions */
  adminList: (params?: Record<string, string | number>) =>
    api.get('/admin/premium/subscriptions', { params }),

  /** Monthly revenue breakdown for charts */
  adminRevenue: () => api.get('/admin/premium/revenue'),
};

export const pmApi = {
  // Projects
  listProjects:    () => api.get('/pm/projects'),
  createProject:   (data: Record<string, unknown>) => api.post('/pm/projects', data),
  updateProject:   (id: string, data: Record<string, unknown>) => api.put(`/pm/projects/${id}`, data),
  deleteProject:   (id: string) => api.delete(`/pm/projects/${id}`),
  projectOverview: (id: string) => api.get(`/pm/projects/${id}/overview`),
  // Tasks
  listTasks:   (projectId: string) => api.get(`/pm/projects/${projectId}/tasks`),
  createTask:  (projectId: string, data: Record<string, unknown>) => api.post(`/pm/projects/${projectId}/tasks`, data),
  updateTask:  (taskId: string, data: Record<string, unknown>) => api.put(`/pm/tasks/${taskId}`, data),
  deleteTask:  (taskId: string) => api.delete(`/pm/tasks/${taskId}`),
  // Milestones
  listMilestones:   (projectId: string) => api.get(`/pm/projects/${projectId}/milestones`),
  createMilestone:  (projectId: string, data: Record<string, unknown>) => api.post(`/pm/projects/${projectId}/milestones`, data),
  updateMilestone:  (id: string, data: Record<string, unknown>) => api.put(`/pm/milestones/${id}`, data),
  deleteMilestone:  (id: string) => api.delete(`/pm/milestones/${id}`),
  // Discussions
  listDiscussions:    (projectId: string) => api.get(`/pm/projects/${projectId}/discussions`),
  createDiscussion:   (projectId: string, data: Record<string, unknown>) => api.post(`/pm/projects/${projectId}/discussions`, data),
  getDiscussion:      (id: string) => api.get(`/pm/discussions/${id}`),
  replyDiscussion:    (id: string, content: string) => api.post(`/pm/discussions/${id}/replies`, { content }),
  deleteDiscussion:   (id: string) => api.delete(`/pm/discussions/${id}`),
  deleteReply:        (id: string) => api.delete(`/pm/discussion-replies/${id}`),
  // Files
  listFiles:   (projectId: string) => api.get(`/pm/projects/${projectId}/files`),
  addFile:     (projectId: string, data: Record<string, unknown>) => api.post(`/pm/projects/${projectId}/files`, data),
  deleteFile:  (id: string) => api.delete(`/pm/files/${id}`),
  // Time
  listTime:    (projectId: string) => api.get(`/pm/projects/${projectId}/time`),
  logTime:     (projectId: string, data: Record<string, unknown>) => api.post(`/pm/projects/${projectId}/time`, data),
  deleteTime:  (id: string) => api.delete(`/pm/time/${id}`),
  // Contract sync
  contractSuggestions: () => api.get('/pm/contract-suggestions'),
  importContract:      (contractId: string) => api.post(`/pm/import-contract/${contractId}`),
};

export const projectTrackingApi = {
  /** Dashboard: all active contracts with latest update */
  dashboard: () => api.get('/project-tracking'),
  /** Full update feed for a single contract */
  feed: (contractId: string) => api.get(`/project-tracking/${contractId}`),
  /** Post a progress update */
  postUpdate: (contractId: string, data: {
    message: string;
    progressPercent?: number;
    imageUrl?: string;
    type?: 'update' | 'note' | 'photo' | 'milestone';
  }) => api.post(`/project-tracking/${contractId}/updates`, data),
  /** Delete an update */
  deleteUpdate: (contractId: string, updateId: string) =>
    api.delete(`/project-tracking/${contractId}/updates/${updateId}`),
};

export const buildPlannerApi = {
  // Plans
  listPlans:   () => api.get('/build-planner/plans'),
  createPlan:  (data: Record<string, unknown>) => api.post('/build-planner/plans', data),
  getPlan:     (id: string) => api.get(`/build-planner/plans/${id}`),
  updatePlan:  (id: string, data: Record<string, unknown>) => api.put(`/build-planner/plans/${id}`, data),
  deletePlan:  (id: string) => api.delete(`/build-planner/plans/${id}`),
  // Sections
  addSection:    (planId: string, data: Record<string, unknown>) => api.post(`/build-planner/plans/${planId}/sections`, data),
  updateSection: (id: string, data: Record<string, unknown>) => api.put(`/build-planner/sections/${id}`, data),
  deleteSection: (id: string) => api.delete(`/build-planner/sections/${id}`),
  // Check items
  addItem:    (sectionId: string, label: string) => api.post(`/build-planner/sections/${sectionId}/items`, { label }),
  toggleItem: (itemId: string) => api.put(`/build-planner/items/${itemId}/toggle`),
  deleteItem: (itemId: string) => api.delete(`/build-planner/items/${itemId}`),
  // Media
  listMedia:  (planId: string) => api.get(`/build-planner/plans/${planId}/media`),
  addMedia:   (planId: string, data: Record<string, unknown>) => api.post(`/build-planner/plans/${planId}/media`, data),
  deleteMedia:(id: string) => api.delete(`/build-planner/media/${id}`),
  // Materials
  listMaterials:   (planId: string) => api.get(`/build-planner/plans/${planId}/materials`),
  addMaterial:     (planId: string, data: Record<string, unknown>) => api.post(`/build-planner/plans/${planId}/materials`, data),
  updateMaterial:  (id: string, data: Record<string, unknown>) => api.put(`/build-planner/materials/${id}`, data),
  deleteMaterial:  (id: string) => api.delete(`/build-planner/materials/${id}`),
  // Achievements
  achievements: (planId: string) => api.get(`/build-planner/plans/${planId}/achievements`),
};

export const addonsApi = {
  /** Full catalog with isInstalled flag for the current user */
  list: () => api.get('/addons'),
  /** Only the currently installed add-ons */
  installed: () => api.get('/addons/installed'),
  /** Install an add-on (debits wallet for paid ones) */
  install: (slug: string) => api.post(`/addons/${slug}/install`),
  /** Uninstall an add-on */
  uninstall: (slug: string) => api.delete(`/addons/${slug}/uninstall`),
  /** Check if a single add-on is installed */
  check: (slug: string) => api.get(`/addons/${slug}`),
};

// ─── Contact ──────────────────────────────────────────────────────────────────

export const contactApi = {
  submit: (data: { name: string; email: string; subject: string; message: string }) =>
    api.post('/contact', data),
};

// ─── Payments (Stripe) ────────────────────────────────────────────────────────

export const paymentsApi = {
  /** Create a Stripe Checkout session for wallet top-up. Returns { url, sessionId }. */
  createCheckoutSession: (amount: number) =>
    api.post<{ success: boolean; data: { url: string; sessionId: string } }>(
      '/payments/create-checkout-session',
      { amount },
    ),
};

// ─── Site Manager ─────────────────────────────────────────────────────────────

export const siteManagerApi = {
  // Sites
  listSites:   () => api.get('/site-manager/sites'),
  createSite:  (data: Record<string, unknown>) => api.post('/site-manager/sites', data),
  getSite:     (id: string) => api.get(`/site-manager/sites/${id}`),
  updateSite:  (id: string, data: Record<string, unknown>) => api.put(`/site-manager/sites/${id}`, data),
  deleteSite:  (id: string) => api.delete(`/site-manager/sites/${id}`),
  getSiteStats:(id: string) => api.get(`/site-manager/sites/${id}/stats`),
  // Labor
  listLabor:   (siteId: string) => api.get(`/site-manager/sites/${siteId}/labor`),
  addLabor:    (siteId: string, data: Record<string, unknown>) => api.post(`/site-manager/sites/${siteId}/labor`, data),
  updateLabor: (siteId: string, laborId: string, data: Record<string, unknown>) => api.put(`/site-manager/sites/${siteId}/labor/${laborId}`, data),
  deleteLabor: (siteId: string, laborId: string) => api.delete(`/site-manager/sites/${siteId}/labor/${laborId}`),
  // Attendance
  listAttendance:  (siteId: string, date?: string) => api.get(`/site-manager/sites/${siteId}/attendance`, { params: date ? { date } : {} }),
  markAttendance:  (siteId: string, data: Record<string, unknown>) => api.post(`/site-manager/sites/${siteId}/attendance`, data),
  bulkAttendance:  (siteId: string, data: Record<string, unknown>) => api.post(`/site-manager/sites/${siteId}/attendance/bulk`, data),
  // Materials
  listMaterials:   (siteId: string) => api.get(`/site-manager/sites/${siteId}/materials`),
  addMaterial:     (siteId: string, data: Record<string, unknown>) => api.post(`/site-manager/sites/${siteId}/materials`, data),
  updateMaterial:  (siteId: string, matId: string, data: Record<string, unknown>) => api.put(`/site-manager/sites/${siteId}/materials/${matId}`, data),
  deleteMaterial:  (siteId: string, matId: string) => api.delete(`/site-manager/sites/${siteId}/materials/${matId}`),
  listMatTxns:     (siteId: string, matId: string) => api.get(`/site-manager/sites/${siteId}/materials/${matId}/transactions`),
  addMatTxn:       (siteId: string, matId: string, data: Record<string, unknown>) => api.post(`/site-manager/sites/${siteId}/materials/${matId}/transactions`, data),
  // Reports (DPR)
  listReports:   (siteId: string) => api.get(`/site-manager/sites/${siteId}/reports`),
  upsertReport:  (siteId: string, data: Record<string, unknown>) => api.post(`/site-manager/sites/${siteId}/reports`, data),
  deleteReport:  (siteId: string, reportId: string) => api.delete(`/site-manager/sites/${siteId}/reports/${reportId}`),
  // BOQ
  listBOQ:     (siteId: string) => api.get(`/site-manager/sites/${siteId}/boq`),
  addBOQ:      (siteId: string, data: Record<string, unknown>) => api.post(`/site-manager/sites/${siteId}/boq`, data),
  updateBOQ:   (siteId: string, itemId: string, data: Record<string, unknown>) => api.put(`/site-manager/sites/${siteId}/boq/${itemId}`, data),
  deleteBOQ:   (siteId: string, itemId: string) => api.delete(`/site-manager/sites/${siteId}/boq/${itemId}`),
  // Equipment
  listEquipment:   (siteId: string) => api.get(`/site-manager/sites/${siteId}/equipment`),
  addEquipment:    (siteId: string, data: Record<string, unknown>) => api.post(`/site-manager/sites/${siteId}/equipment`, data),
  updateEquipment: (siteId: string, equipId: string, data: Record<string, unknown>) => api.put(`/site-manager/sites/${siteId}/equipment/${equipId}`, data),
  deleteEquipment: (siteId: string, equipId: string) => api.delete(`/site-manager/sites/${siteId}/equipment/${equipId}`),
  // Expenses
  listExpenses:  (siteId: string) => api.get(`/site-manager/sites/${siteId}/expenses`),
  addExpense:    (siteId: string, data: Record<string, unknown>) => api.post(`/site-manager/sites/${siteId}/expenses`, data),
  deleteExpense: (siteId: string, expId: string) => api.delete(`/site-manager/sites/${siteId}/expenses/${expId}`),
  // Invoices
  listInvoices:   (siteId: string) => api.get(`/site-manager/sites/${siteId}/invoices`),
  createInvoice:  (siteId: string, data: Record<string, unknown>) => api.post(`/site-manager/sites/${siteId}/invoices`, data),
  updateInvoice:  (siteId: string, invId: string, data: Record<string, unknown>) => api.put(`/site-manager/sites/${siteId}/invoices/${invId}`, data),
  deleteInvoice:  (siteId: string, invId: string) => api.delete(`/site-manager/sites/${siteId}/invoices/${invId}`),
  // Subcontractors
  listSubs:   (siteId: string) => api.get(`/site-manager/sites/${siteId}/subcontractors`),
  addSub:     (siteId: string, data: Record<string, unknown>) => api.post(`/site-manager/sites/${siteId}/subcontractors`, data),
  updateSub:  (siteId: string, subId: string, data: Record<string, unknown>) => api.put(`/site-manager/sites/${siteId}/subcontractors/${subId}`, data),
  deleteSub:  (siteId: string, subId: string) => api.delete(`/site-manager/sites/${siteId}/subcontractors/${subId}`),
  // Milestones
  listMilestones:   (siteId: string) => api.get(`/site-manager/sites/${siteId}/milestones`),
  addMilestone:     (siteId: string, data: Record<string, unknown>) => api.post(`/site-manager/sites/${siteId}/milestones`, data),
  updateMilestone:  (siteId: string, id: string, data: Record<string, unknown>) => api.put(`/site-manager/sites/${siteId}/milestones/${id}`, data),
  deleteMilestone:  (siteId: string, id: string) => api.delete(`/site-manager/sites/${siteId}/milestones/${id}`),
  // Leads
  listLeads:   (siteId: string) => api.get(`/site-manager/sites/${siteId}/leads`),
  addLead:     (siteId: string, data: Record<string, unknown>) => api.post(`/site-manager/sites/${siteId}/leads`, data),
  updateLead:  (siteId: string, id: string, data: Record<string, unknown>) => api.put(`/site-manager/sites/${siteId}/leads/${id}`, data),
  deleteLead:  (siteId: string, id: string) => api.delete(`/site-manager/sites/${siteId}/leads/${id}`),
  // Designs
  listDesigns:   (siteId: string) => api.get(`/site-manager/sites/${siteId}/designs`),
  addDesign:     (siteId: string, data: Record<string, unknown>) => api.post(`/site-manager/sites/${siteId}/designs`, data),
  updateDesign:  (siteId: string, id: string, data: Record<string, unknown>) => api.put(`/site-manager/sites/${siteId}/designs/${id}`, data),
  deleteDesign:  (siteId: string, id: string) => api.delete(`/site-manager/sites/${siteId}/designs/${id}`),
  // Quality
  listQualityChecks:   (siteId: string) => api.get(`/site-manager/sites/${siteId}/quality`),
  addQualityCheck:     (siteId: string, data: Record<string, unknown>) => api.post(`/site-manager/sites/${siteId}/quality`, data),
  updateQualityCheck:  (siteId: string, id: string, data: Record<string, unknown>) => api.put(`/site-manager/sites/${siteId}/quality/${id}`, data),
  deleteQualityCheck:  (siteId: string, id: string) => api.delete(`/site-manager/sites/${siteId}/quality/${id}`),
  // Procurement
  listProcurements:   (siteId: string) => api.get(`/site-manager/sites/${siteId}/procurement`),
  createProcurement:  (siteId: string, data: Record<string, unknown>) => api.post(`/site-manager/sites/${siteId}/procurement`, data),
  updateProcurement:  (siteId: string, id: string, data: Record<string, unknown>) => api.put(`/site-manager/sites/${siteId}/procurement/${id}`, data),
  deleteProcurement:  (siteId: string, id: string) => api.delete(`/site-manager/sites/${siteId}/procurement/${id}`),
  // Vendor Bills
  listVendorBills:   (siteId: string) => api.get(`/site-manager/sites/${siteId}/vendor-bills`),
  addVendorBill:     (siteId: string, data: Record<string, unknown>) => api.post(`/site-manager/sites/${siteId}/vendor-bills`, data),
  updateVendorBill:  (siteId: string, id: string, data: Record<string, unknown>) => api.put(`/site-manager/sites/${siteId}/vendor-bills/${id}`, data),
  deleteVendorBill:  (siteId: string, id: string) => api.delete(`/site-manager/sites/${siteId}/vendor-bills/${id}`),
  // Production
  listProductions:   (siteId: string) => api.get(`/site-manager/sites/${siteId}/production`),
  addProduction:     (siteId: string, data: Record<string, unknown>) => api.post(`/site-manager/sites/${siteId}/production`, data),
  updateProduction:  (siteId: string, id: string, data: Record<string, unknown>) => api.put(`/site-manager/sites/${siteId}/production/${id}`, data),
  deleteProduction:  (siteId: string, id: string) => api.delete(`/site-manager/sites/${siteId}/production/${id}`),
  // P&L
  getPnL: (siteId: string) => api.get(`/site-manager/sites/${siteId}/pnl`),
  // Team
  listTeam: (siteId: string) => api.get(`/site-manager/sites/${siteId}/team`),
  inviteMember: (siteId: string, data: Record<string, unknown>) => api.post(`/site-manager/sites/${siteId}/team/invite`, data),
  updateMemberRole: (siteId: string, memberId: string, role: string) => api.put(`/site-manager/sites/${siteId}/team/${memberId}`, { role }),
  removeMember: (siteId: string, memberId: string) => api.delete(`/site-manager/sites/${siteId}/team/${memberId}`),
  // Issues
  listIssues: (siteId: string) => api.get(`/site-manager/sites/${siteId}/issues`),
  addIssue: (siteId: string, data: Record<string, unknown>) => api.post(`/site-manager/sites/${siteId}/issues`, data),
  updateIssue: (siteId: string, id: string, data: Record<string, unknown>) => api.put(`/site-manager/sites/${siteId}/issues/${id}`, data),
  deleteIssue: (siteId: string, id: string) => api.delete(`/site-manager/sites/${siteId}/issues/${id}`),
  // Client portal
  getClientPortal: (token: string) => api.get(`/site-manager/portal/${token}`),
};

// ─── Connects ─────────────────────────────────────────────────────────────────

export const connectsApi = {
  /** Get available packages (public — no auth needed) */
  getPackages: () =>
    api.get<{ success: boolean; data: import('@/types').ConnectPackage[] }>('/connects/packages'),

  /** Get current balance + transaction history (contractors only) */
  getMyConnects: (params?: { page?: number; limit?: number }) =>
    api.get<{ success: boolean; data: import('@/types').ConnectsData }>('/connects', { params }),

  /** Step 1: Create a Razorpay order for a connect package */
  createOrder: (packageKey: string) =>
    api.post<{ success: boolean; data: { orderId: string; amount: number; currency: string; key: string } }>(
      '/connects/order',
      { packageKey },
    ),

  /** Step 2: Verify Razorpay payment and credit connects */
  purchaseConnects: (data: {
    razorpay_order_id: string;
    razorpay_payment_id: string;
    razorpay_signature: string;
    packageKey: string;
  }) =>
    api.post<{ success: boolean; data: { balance: number } }>('/connects/purchase', data),

  /** Get connect cost for a specific job (includes balance + sufficiency check) */
  getConnectCostForJob: (jobId: string, isPriority = false) =>
    api.get<{ success: boolean; data: { cost: number; balance: number; sufficient: boolean; sponsored: boolean } }>(
      `/connects/cost/${jobId}`,
      { params: isPriority ? { isPriority: 'true' } : undefined },
    ),
};

// ─── Biddaro Inspect ──────────────────────────────────────────────────────────

export const inspectApi = {
  // Dashboard
  getDashboard: () => api.get('/inspect/dashboard'),

  // Templates
  listTemplates: () => api.get('/inspect/templates'),
  createTemplate: (data: Record<string, unknown>) => api.post('/inspect/templates', data),
  getTemplate: (id: string) => api.get(`/inspect/templates/${id}`),
  updateTemplate: (id: string, data: Record<string, unknown>) => api.put(`/inspect/templates/${id}`, data),
  deleteTemplate: (id: string) => api.delete(`/inspect/templates/${id}`),

  // Projects
  listProjects: (params?: Record<string, unknown>) => api.get('/inspect/projects', { params }),
  createProject: (data: Record<string, unknown>) => api.post('/inspect/projects', data),
  getProject: (id: string) => api.get(`/inspect/projects/${id}`),
  updateProject: (id: string, data: Record<string, unknown>) => api.put(`/inspect/projects/${id}`, data),
  deleteProject: (id: string) => api.delete(`/inspect/projects/${id}`),
  cloneProject:  (id: string) => api.post(`/inspect/projects/${id}/clone`, {}),

  // Captures
  listCaptures: (projectId: string) => api.get(`/inspect/projects/${projectId}/captures`),
  addCapture: (projectId: string, data: Record<string, unknown>) => api.post(`/inspect/projects/${projectId}/captures`, data),
  getCapture: (projectId: string, cid: string) => api.get(`/inspect/projects/${projectId}/captures/${cid}`),
  updateCapture: (projectId: string, cid: string, data: Record<string, unknown>) => api.put(`/inspect/projects/${projectId}/captures/${cid}`, data),
  deleteCapture: (projectId: string, cid: string) => api.delete(`/inspect/projects/${projectId}/captures/${cid}`),

  // Reports
  generateReport: (projectId: string, language = 'en', templateId?: string) => api.post(`/inspect/projects/${projectId}/reports/generate`, { language, ...(templateId ? { templateId } : {}) }),
  listReports: (projectId: string) => api.get(`/inspect/projects/${projectId}/reports`),
  listAllReports: (params?: Record<string, unknown>) => api.get('/inspect/reports', { params }),
  getReport: (id: string) => api.get(`/inspect/reports/${id}`),
  updateReport: (id: string, data: Record<string, unknown>) => api.put(`/inspect/reports/${id}`, data),
  deleteReport: (id: string) => api.delete(`/inspect/reports/${id}`),
  sendReport: (id: string, sentTo: string, clientName?: string) => api.post(`/inspect/reports/${id}/send`, { sentTo, clientName }),
  shareReport: (id: string, expiry?: string) => api.post(`/inspect/reports/${id}/share`, expiry ? { expiry } : {}),
  unshareReport: (id: string) => api.delete(`/inspect/reports/${id}/share`),
  signReport: (id: string, signature: string) => api.post(`/inspect/reports/${id}/sign`, { signature }),
  clearInspectorSignature: (id: string) => api.delete(`/inspect/reports/${id}/sign`),
  getPublicReport:    (token: string) => api.get(`/inspect/public/${token}`),
  signPublicReport:   (token: string, signerName: string, signatureData: string) =>
    api.post(`/inspect/public/${token}/sign`, { signerName, signatureData }),
  submitSectionFeedback: (token: string, data: Record<string, unknown>) =>
    api.post(`/inspect/public/${token}/feedback`, data),
  listSectionFeedback: (reportId: string) =>
    api.get(`/inspect/reports/${reportId}/feedback`),
  getAnalytics:     () => api.get('/inspect/analytics'),
  generateTrendSummary: () => api.post('/inspect/analytics/trend', {}),
  listLanguages: () => api.get('/inspect/languages'),
  // Legacy import
  importReport: (projectId: string, formData: FormData) =>
    api.post(`/inspect/projects/${projectId}/reports/import`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }),
  // Floor plans
  listFloorPlans:   (projectId: string) => api.get(`/inspect/projects/${projectId}/floor-plans`),
  createFloorPlan:  (projectId: string, data: Record<string, unknown>) => api.post(`/inspect/projects/${projectId}/floor-plans`, data),
  updateFloorPlan:  (fid: string, data: Record<string, unknown>) => api.put(`/inspect/floor-plans/${fid}`, data),
  deleteFloorPlan:  (fid: string) => api.delete(`/inspect/floor-plans/${fid}`),
  // Review notes
  listReviewNotes:  (reportId: string) => api.get(`/inspect/reports/${reportId}/review/notes`),
  addReviewNote:    (reportId: string, data: Record<string, unknown>) => api.post(`/inspect/reports/${reportId}/review/notes`, data),
  deleteReviewNote: (nid: string) => api.delete(`/inspect/review/notes/${nid}`),
  exportDocx:        (id: string) => api.get(`/inspect/reports/${id}/export/docx`, { responseType: 'blob' }),
  exportPdf:         (id: string, includePhotos = true) => api.get(`/inspect/reports/${id}/export/pdf${includePhotos ? '' : '?photos=0'}`, { responseType: 'blob' }),
  exportCertificate: (id: string) => api.get(`/inspect/reports/${id}/export/certificate`, { responseType: 'blob' }),
  bulkExportReports: (reportIds: string[], includePhotos = false) =>
    api.post('/inspect/reports/bulk-export', { reportIds, includePhotos }, { responseType: 'blob' }),
  captionCapture: (projectId: string, cid: string) => api.post(`/inspect/projects/${projectId}/captures/${cid}/caption`, {}),
  searchPortfolio:  (query: string) => api.post('/inspect/search', { query }),
  compareReports:   (reportIdA: string, reportIdB: string) => api.post('/inspect/compare', { reportIdA, reportIdB }),
  // Tasks
  listAllTasks: (params?: Record<string, string>) => api.get('/inspect/tasks', { params }),
  listTasks:   (reportId: string) => api.get(`/inspect/reports/${reportId}/tasks`),
  createTask:  (reportId: string, data: Record<string, unknown>) => api.post(`/inspect/reports/${reportId}/tasks`, data),
  updateTask:  (tid: string, data: Record<string, unknown>) => api.put(`/inspect/tasks/${tid}`, data),
  deleteTask:  (tid: string) => api.delete(`/inspect/tasks/${tid}`),
  // Inspector settings
  getSettings:    () => api.get('/inspect/settings'),
  upsertSettings: (data: Record<string, unknown>) => api.put('/inspect/settings', data),
  // Scheduling
  listSchedules:        (projectId: string) => api.get(`/inspect/projects/${projectId}/schedules`),
  createSchedule:       (projectId: string, data: Record<string, unknown>) => api.post(`/inspect/projects/${projectId}/schedules`, data),
  updateSchedule:       (sid: string, data: Record<string, unknown>) => api.put(`/inspect/schedules/${sid}`, data),
  deleteSchedule:       (sid: string) => api.delete(`/inspect/schedules/${sid}`),
  listUpcomingSchedules: () => api.get('/inspect/schedules/upcoming'),
  // Report versioning
  listVersions:    (reportId: string) => api.get(`/inspect/reports/${reportId}/versions`),
  restoreVersion:  (reportId: string, vid: string) => api.post(`/inspect/reports/${reportId}/versions/${vid}/restore`, {}),
  // Webhooks
  listWebhooks:    () => api.get('/inspect/webhooks'),
  createWebhook:   (data: { url: string; events: string[]; active?: boolean }) => api.post('/inspect/webhooks', data),
  updateWebhook:   (id: string, data: { url?: string; events?: string[]; active?: boolean }) => api.put(`/inspect/webhooks/${id}`, data),
  deleteWebhook:   (id: string) => api.delete(`/inspect/webhooks/${id}`),
  testWebhook:     (id: string) => api.post(`/inspect/webhooks/${id}/test`, {}),
  // Project team members
  listProjectMembers:   (projectId: string) => api.get(`/inspect/projects/${projectId}/members`),
  addProjectMember:     (projectId: string, data: { email: string; role?: string }) => api.post(`/inspect/projects/${projectId}/members`, data),
  updateProjectMember:  (projectId: string, mid: string, data: { role: string }) => api.put(`/inspect/projects/${projectId}/members/${mid}`, data),
  removeProjectMember:  (projectId: string, mid: string) => api.delete(`/inspect/projects/${projectId}/members/${mid}`),
  // Client portal
  enableClientPortal:  (projectId: string) => api.post(`/inspect/projects/${projectId}/client-portal`, {}),
  disableClientPortal: (projectId: string) => api.delete(`/inspect/projects/${projectId}/client-portal`),
  getClientPortal:     (token: string) => api.get(`/inspect/client-portal/${token}`),
};

export default api;
