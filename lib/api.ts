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
  }) => api.post('/auth/register', data),
  login: (data: { email: string; password: string }) => api.post('/auth/login', data),
  logout: () => api.post('/auth/logout'),
  me: () => api.get('/auth/me'),
  refreshToken: (refreshToken: string) => api.post('/auth/refresh', { refreshToken }),
  changePassword: (data: { currentPassword: string; newPassword: string }) =>
    api.put('/auth/change-password', data),
  forgotPassword: (email: string) => api.post('/auth/forgot-password', { email }),
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
};

// ─── Bids ─────────────────────────────────────────────────────────────────────

export const bidsApi = {
  myBids: (params?: Record<string, string | number>) => api.get('/bids/my', { params }),
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
  fundEscrow: (id: string) => api.post(`/contracts/${id}/fund`),
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

// ─── Reviews ──────────────────────────────────────────────────────────────────

export const reviewsApi = {
  myReviews: () => api.get('/reviews/my'),
  forUser: (userId: string) => api.get(`/reviews/user/${userId}`),
  forJob: (jobId: string) => api.get(`/reviews/job/${jobId}`),
  create: (data: { contractId: string; revieweeId: string; rating: number; comment: string }) =>
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

async function uploadFetch<T>(path: string, formData: FormData): Promise<{ data: T }> {
  const token = typeof window !== 'undefined' ? localStorage.getItem('biddaro_token') : null;
  const res = await fetch(`${API_BASE_URL}/api/v1${path}`, {
    method: 'POST',
    body: formData,
    // Only set Authorization — do NOT set Content-Type so the browser can add the multipart boundary automatically
    headers: token ? { Authorization: `Bearer ${token}` } : {},
  });
  const json = await res.json();
  if (!res.ok) {
    const err = Object.assign(new Error(json?.message || 'Upload failed'), { response: { data: json } });
    throw err;
  }
  return { data: json };
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

// ─── Notifications ────────────────────────────────────────────────────────────

export const notificationsApi = {
  list: (params?: Record<string, string | number>) => api.get('/notifications', { params }),
  unreadCount: () => api.get('/notifications/unread-count'),
  markRead: (id: string) => api.post(`/notifications/${id}/read`),
  markAllRead: () => api.post('/notifications/read-all'),
};

export default api;
