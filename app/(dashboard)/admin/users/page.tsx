'use client';

import { useEffect, useState, useCallback } from 'react';
import { adminApi } from '@/lib/api';
import { toast } from '@/store/uiStore';
import { Avatar } from '@/components/ui/Avatar';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Modal } from '@/components/ui/Modal';
import {
  Users, Search, Filter, ChevronLeft, ChevronRight,
  CheckCircle, XCircle, Shield, Briefcase, HardHat,
  MoreVertical, Edit, Trash2, Wallet, Eye, SlidersHorizontal, ClipboardCheck,
} from 'lucide-react';

// ─── Types ────────────────────────────────────────────────────────────────────

interface AdminUser {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: string;
  isActive: boolean;
  isVerified: boolean;
  profileImage?: string;
  phone?: string;
  location?: string;
  rating?: number;
  createdAt: string;
  signupSource?: string | null;
  wallet?: { balance: number; totalEarned: number };
  _count?: {
    postedJobs: number; placedBids: number; contractsAsContractor: number; contractsAsPoster: number;
    inspectProjects?: number; inspectReports?: number;
  };
}

function isInspector(u: AdminUser) {
  return u.signupSource === 'inspect_app' || (u._count?.inspectProjects ?? 0) > 0 || (u._count?.inspectReports ?? 0) > 0;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function formatCurrency(n: number) {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 0 }).format(n);
}

function roleIcon(role: string) {
  if (role === 'admin') return <Shield className="w-3.5 h-3.5" />;
  if (role === 'contractor') return <HardHat className="w-3.5 h-3.5" />;
  return <Briefcase className="w-3.5 h-3.5" />;
}

function roleBadge(role: string) {
  const map: Record<string, string> = {
    admin: 'bg-purple-100 text-purple-700',
    contractor: 'bg-blue-100 text-blue-700',
    job_poster: 'bg-green-100 text-green-700',
  };
  return map[role] || 'bg-gray-100 text-gray-700';
}

// ─── Edit User Modal ──────────────────────────────────────────────────────────

function EditUserModal({ user, onClose, onSaved }: { user: AdminUser; onClose: () => void; onSaved: () => void }) {
  const [role, setRole] = useState(user.role);
  const [isActive, setIsActive] = useState(user.isActive);
  const [isVerified, setIsVerified] = useState(user.isVerified);
  const [saving, setSaving] = useState(false);

  async function save() {
    setSaving(true);
    try {
      await adminApi.updateUser(user.id, { role, isActive, isVerified });
      toast.success('User updated successfully');
      onSaved();
      onClose();
    } catch (e: any) {
      toast.error(e.response?.data?.message || 'Failed to update user');
    } finally {
      setSaving(false);
    }
  }

  return (
    <Modal open onClose={onClose} title="Edit User" size="sm">
      <div className="space-y-4 py-2">
        <div className="flex items-center gap-3 pb-3 border-b border-gray-100">
          <Avatar firstName={user.firstName} lastName={user.lastName} src={user.profileImage} size="md" />
          <div>
            <p className="font-semibold text-gray-800">{user.firstName} {user.lastName}</p>
            <p className="text-sm text-gray-500">{user.email}</p>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">Role</label>
          <div className="grid grid-cols-3 gap-2">
            {['job_poster', 'contractor', 'admin'].map(r => (
              <button key={r} onClick={() => setRole(r)}
                className={`py-2 px-3 rounded-xl border text-sm font-medium transition-all ${role === r ? 'border-brand-500 bg-brand-50 text-brand-700' : 'border-gray-200 text-gray-600 hover:border-gray-300'}`}>
                {r === 'job_poster' ? 'Job Poster' : r === 'contractor' ? 'Contractor' : 'Admin'}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <button onClick={() => setIsActive(!isActive)}
            className={`flex items-center gap-2 py-2.5 px-4 rounded-xl border text-sm font-medium transition-all ${isActive ? 'border-green-400 bg-green-50 text-green-700' : 'border-red-300 bg-red-50 text-red-600'}`}>
            {isActive ? <CheckCircle className="w-4 h-4" /> : <XCircle className="w-4 h-4" />}
            {isActive ? 'Active' : 'Inactive'}
          </button>
          <button onClick={() => setIsVerified(!isVerified)}
            className={`flex items-center gap-2 py-2.5 px-4 rounded-xl border text-sm font-medium transition-all ${isVerified ? 'border-blue-400 bg-blue-50 text-blue-700' : 'border-gray-200 bg-gray-50 text-gray-600'}`}>
            <Shield className="w-4 h-4" />
            {isVerified ? 'Verified' : 'Unverified'}
          </button>
        </div>
      </div>
      <div className="flex gap-3 pt-4 border-t border-gray-100">
        <Button variant="outline" onClick={onClose} className="flex-1">Cancel</Button>
        <Button onClick={save} loading={saving} className="flex-1">Save Changes</Button>
      </div>
    </Modal>
  );
}

// ─── Wallet Adjust Modal ──────────────────────────────────────────────────────

function WalletModal({ user, onClose, onSaved }: { user: AdminUser; onClose: () => void; onSaved: () => void }) {
  const [amount, setAmount] = useState('');
  const [type, setType] = useState<'credit' | 'debit'>('credit');
  const [description, setDescription] = useState('');
  const [saving, setSaving] = useState(false);

  async function save() {
    const amt = parseFloat(amount);
    if (!amt || amt <= 0) { toast.error('Enter a valid amount'); return; }
    setSaving(true);
    try {
      await adminApi.adjustWallet(user.id, { amount: amt, type, description });
      toast.success(`Wallet ${type}ed successfully`);
      onSaved();
      onClose();
    } catch (e: any) {
      toast.error(e.response?.data?.message || 'Failed to adjust wallet');
    } finally {
      setSaving(false);
    }
  }

  return (
    <Modal open onClose={onClose} title="Adjust Wallet Balance" size="sm">
      <div className="space-y-4 py-2">
        <div className="bg-gray-50 rounded-xl p-4 text-center">
          <p className="text-sm text-gray-500">Current Balance</p>
          <p className="text-2xl font-bold text-gray-900">{formatCurrency(user.wallet?.balance ?? 0)}</p>
        </div>
        <div className="grid grid-cols-2 gap-2">
          {(['credit', 'debit'] as const).map(t => (
            <button key={t} onClick={() => setType(t)}
              className={`py-2.5 px-4 rounded-xl border text-sm font-medium transition-all ${type === t
                ? t === 'credit' ? 'border-green-400 bg-green-50 text-green-700' : 'border-red-300 bg-red-50 text-red-600'
                : 'border-gray-200 text-gray-600 hover:border-gray-300'}`}>
              {t === 'credit' ? '+ Credit' : '− Debit'}
            </button>
          ))}
        </div>
        <Input label="Amount ($)" type="number" min="0.01" step="0.01"
          value={amount} onChange={e => setAmount(e.target.value)} placeholder="0.00" />
        <Input label="Description (optional)" value={description}
          onChange={e => setDescription(e.target.value)} placeholder="Admin adjustment reason" />
      </div>
      <div className="flex gap-3 pt-4 border-t border-gray-100">
        <Button variant="outline" onClick={onClose} className="flex-1">Cancel</Button>
        <Button onClick={save} loading={saving} className="flex-1">Apply</Button>
      </div>
    </Modal>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function AdminUsersPage() {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [role, setRole] = useState('');
  const [source, setSource] = useState('');
  const [isActive, setIsActive] = useState('');
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState({ total: 0, totalPages: 1 });
  const [editUser, setEditUser] = useState<AdminUser | null>(null);
  const [walletUser, setWalletUser] = useState<AdminUser | null>(null);
  const [menuOpen, setMenuOpen] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const params: any = { page, limit: 20 };
      if (search) params.search = search;
      if (role) params.role = role;
      if (source) params.source = source;
      if (isActive !== '') params.isActive = isActive;
      const res = await adminApi.listUsers(params);
      setUsers(res.data.data.users);
      setPagination(res.data.data.pagination);
    } catch {
      toast.error('Failed to load users');
    } finally {
      setLoading(false);
    }
  }, [page, search, role, source, isActive]);

  useEffect(() => { load(); }, [load]);

  async function toggleActive(user: AdminUser) {
    try {
      await adminApi.updateUser(user.id, { isActive: !user.isActive });
      toast.success(`User ${!user.isActive ? 'activated' : 'deactivated'}`);
      load();
    } catch (e: any) {
      toast.error(e.response?.data?.message || 'Failed to update');
    }
    setMenuOpen(null);
  }

  const roleFilters = [
    { label: 'All', value: '' },
    { label: 'Job Posters', value: 'job_poster' },
    { label: 'Contractors', value: 'contractor' },
    { label: 'Admins', value: 'admin' },
  ];

  return (
    <div className="p-6 space-y-6 max-w-screen-2xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <Users className="w-6 h-6 text-brand-500" /> User Management
          </h1>
          <p className="text-gray-500 text-sm mt-0.5">{pagination.total} total users</p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white border border-gray-100 rounded-2xl p-4 flex flex-col sm:flex-row gap-3">
        <div className="flex-1">
          <Input placeholder="Search by name or email…" value={search}
            onChange={e => { setSearch(e.target.value); setPage(1); }}
            leftIcon={<Search className="w-4 h-4 text-gray-400" />} />
        </div>
        <div className="flex gap-2 flex-wrap">
          {roleFilters.map(f => (
            <button key={f.value} onClick={() => { setRole(f.value); setPage(1); }}
              className={`px-3 py-2 rounded-xl text-sm font-medium transition-all ${role === f.value ? 'bg-brand-500 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>
              {f.label}
            </button>
          ))}
          <button onClick={() => { setSource(source === 'inspect' ? '' : 'inspect'); setPage(1); }}
            className={`px-3 py-2 rounded-xl text-sm font-medium transition-all ${source === 'inspect' ? 'bg-teal-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>
            Inspectors
          </button>
        </div>
        <div className="flex gap-2">
          <button onClick={() => { setIsActive(''); setPage(1); }}
            className={`px-3 py-2 rounded-xl text-sm transition-all ${isActive === '' ? 'bg-gray-800 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>
            All Status
          </button>
          <button onClick={() => { setIsActive('true'); setPage(1); }}
            className={`px-3 py-2 rounded-xl text-sm transition-all ${isActive === 'true' ? 'bg-green-500 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>
            Active
          </button>
          <button onClick={() => { setIsActive('false'); setPage(1); }}
            className={`px-3 py-2 rounded-xl text-sm transition-all ${isActive === 'false' ? 'bg-red-500 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>
            Inactive
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white border border-gray-100 rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50">
                <th className="text-left text-xs font-semibold text-gray-500 px-5 py-3">User</th>
                <th className="text-left text-xs font-semibold text-gray-500 px-4 py-3">Role</th>
                <th className="text-left text-xs font-semibold text-gray-500 px-4 py-3">Status</th>
                <th className="text-left text-xs font-semibold text-gray-500 px-4 py-3">Wallet</th>
                <th className="text-left text-xs font-semibold text-gray-500 px-4 py-3">Activity</th>
                <th className="text-left text-xs font-semibold text-gray-500 px-4 py-3">Joined</th>
                <th className="text-right text-xs font-semibold text-gray-500 px-5 py-3">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {loading ? (
                [...Array(8)].map((_, i) => (
                  <tr key={i}>
                    <td colSpan={7} className="px-5 py-3">
                      <div className="h-10 bg-gray-100 rounded-xl animate-pulse" />
                    </td>
                  </tr>
                ))
              ) : users.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center py-16 text-gray-400">No users found</td>
                </tr>
              ) : users.map(user => (
                <tr key={user.id} className="hover:bg-gray-50/50 transition-colors">
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-3">
                      <Avatar firstName={user.firstName} lastName={user.lastName} src={user.profileImage} size="sm" />
                      <div>
                        <p className="text-sm font-semibold text-gray-800">{user.firstName} {user.lastName}</p>
                        <p className="text-xs text-gray-500">{user.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3.5">
                    <div className="flex flex-col gap-1">
                      <span className={`inline-flex items-center gap-1 text-xs font-medium px-2.5 py-1 rounded-full w-fit ${roleBadge(user.role)}`}>
                        {roleIcon(user.role)}
                        {user.role === 'job_poster' ? 'Poster' : user.role === 'contractor' ? 'Contractor' : 'Admin'}
                      </span>
                      {isInspector(user) && (
                        <span className="inline-flex items-center gap-1 text-xs font-medium px-2.5 py-1 rounded-full w-fit bg-teal-100 text-teal-700">
                          <ClipboardCheck className="w-3 h-3" /> Inspector
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="px-4 py-3.5">
                    <div className="flex flex-col gap-1">
                      <span className={`inline-flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-full w-fit ${user.isActive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-600'}`}>
                        {user.isActive ? <CheckCircle className="w-3 h-3" /> : <XCircle className="w-3 h-3" />}
                        {user.isActive ? 'Active' : 'Inactive'}
                      </span>
                      {user.isVerified && (
                        <span className="inline-flex items-center gap-1 text-xs text-blue-600 w-fit">
                          <Shield className="w-3 h-3" /> Verified
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="px-4 py-3.5">
                    <p className="text-sm font-semibold text-gray-800">{formatCurrency(user.wallet?.balance ?? 0)}</p>
                    <p className="text-xs text-gray-400">Earned: {formatCurrency(user.wallet?.totalEarned ?? 0)}</p>
                  </td>
                  <td className="px-4 py-3.5 text-xs text-gray-500">
                    <span className="block">{user._count?.postedJobs ?? 0} jobs posted</span>
                    <span className="block">{(user._count?.contractsAsContractor ?? 0) + (user._count?.contractsAsPoster ?? 0)} contracts</span>
                  </td>
                  <td className="px-4 py-3.5 text-xs text-gray-500">
                    {new Date(user.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-5 py-3.5">
                    <div className="flex items-center justify-end gap-1">
                      <button onClick={() => setEditUser(user)}
                        className="p-1.5 rounded-lg text-gray-400 hover:text-blue-600 hover:bg-blue-50 transition-colors">
                        <Edit className="w-4 h-4" />
                      </button>
                      <button onClick={() => setWalletUser(user)}
                        className="p-1.5 rounded-lg text-gray-400 hover:text-brand-600 hover:bg-brand-50 transition-colors">
                        <Wallet className="w-4 h-4" />
                      </button>
                      <button onClick={() => toggleActive(user)}
                        className={`p-1.5 rounded-lg transition-colors ${user.isActive ? 'text-gray-400 hover:text-red-500 hover:bg-red-50' : 'text-gray-400 hover:text-green-600 hover:bg-green-50'}`}>
                        {user.isActive ? <XCircle className="w-4 h-4" /> : <CheckCircle className="w-4 h-4" />}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {pagination.totalPages > 1 && (
          <div className="flex items-center justify-between px-5 py-3 border-t border-gray-100">
            <p className="text-sm text-gray-500">
              Page {page} of {pagination.totalPages} · {pagination.total} users
            </p>
            <div className="flex gap-2">
              <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}
                className="p-2 rounded-xl border border-gray-200 text-gray-500 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed">
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button onClick={() => setPage(p => Math.min(pagination.totalPages, p + 1))} disabled={page === pagination.totalPages}
                className="p-2 rounded-xl border border-gray-200 text-gray-500 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed">
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Modals */}
      {editUser && <EditUserModal user={editUser} onClose={() => setEditUser(null)} onSaved={load} />}
      {walletUser && <WalletModal user={walletUser} onClose={() => setWalletUser(null)} onSaved={load} />}
    </div>
  );
}
