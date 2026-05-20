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
  createIndiaOrder: (loanType: string) =>
    api.post<{ success: boolean; data: { orderId: string; amount: number; currency: string; key: string } }>(
      '/loans/india/order', { loanType }
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

export default api;
