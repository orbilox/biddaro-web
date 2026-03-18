'use client';
import React, { useCallback, useEffect, useState } from 'react';
import {
  Building2, Plus, Pencil, Trash2, Eye, EyeOff,
  CreditCard, Hash, User2, MapPin, Info, ArrowUpDown, Loader2, X, Copy, Clock,
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Modal } from '@/components/ui/Modal';
import { Badge } from '@/components/ui/Badge';
import { toast } from '@/store/uiStore';
import { bankSettingsApi, BankAccount } from '@/lib/api';

// ─── Time helper ─────────────────────────────────────────────────────────────
function timeAgo(dateStr?: string): string {
  if (!dateStr) return 'Never';
  const diff = Math.floor((Date.now() - new Date(dateStr).getTime()) / 1000);
  if (diff < 60) return 'Just now';
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  if (diff < 2592000) return `${Math.floor(diff / 86400)}d ago`;
  return new Date(dateStr).toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' });
}

function fullDate(dateStr?: string): string {
  if (!dateStr) return '';
  return new Date(dateStr).toLocaleString('en-US', {
    day: 'numeric', month: 'short', year: 'numeric',
    hour: '2-digit', minute: '2-digit',
  });
}

// ─── Empty form state ─────────────────────────────────────────────────────────
const emptyForm = (): Omit<BankAccount, 'id'> => ({
  bankName: '',
  accountHolderName: '',
  accountNumber: '',
  routingNumber: '',
  ifscCode: '',
  swiftCode: '',
  branch: '',
  bankAddress: '',
  paymentInstructions: '',
  isActive: true,
  sortOrder: 0,
});

// ─── Bank Form Modal ──────────────────────────────────────────────────────────
function BankFormModal({
  open, onClose, onSave, initial,
}: {
  open: boolean;
  onClose: () => void;
  onSave: (data: Omit<BankAccount, 'id'>) => Promise<void>;
  initial?: BankAccount | null;
}) {
  const [form, setForm] = useState(emptyForm());
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    setForm(initial ? {
      bankName: initial.bankName,
      accountHolderName: initial.accountHolderName,
      accountNumber: initial.accountNumber,
      routingNumber: initial.routingNumber || '',
      ifscCode: initial.ifscCode || '',
      swiftCode: initial.swiftCode || '',
      branch: initial.branch || '',
      bankAddress: initial.bankAddress || '',
      paymentInstructions: initial.paymentInstructions || '',
      isActive: initial.isActive !== false,
      sortOrder: initial.sortOrder || 0,
    } : emptyForm());
  }, [initial, open]);

  const set = (field: keyof typeof form, value: string | boolean | number) =>
    setForm(f => ({ ...f, [field]: value }));

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.bankName.trim() || !form.accountHolderName.trim() || !form.accountNumber.trim()) {
      toast.error('Bank name, account holder, and account number are required');
      return;
    }
    setSaving(true);
    try {
      await onSave(form);
      onClose();
    } finally {
      setSaving(false);
    }
  }

  return (
    <Modal open={open} onClose={onClose} title={initial ? 'Edit Bank Account' : 'Add Bank Account'} size="lg">
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Row 1 */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input
            label="Bank Name *"
            placeholder="e.g. State Bank of India"
            value={form.bankName}
            onChange={e => set('bankName', e.target.value)}
            leftIcon={<Building2 className="w-4 h-4 text-gray-400" />}
          />
          <Input
            label="Account Holder Name *"
            placeholder="e.g. Biddaro Pvt Ltd"
            value={form.accountHolderName}
            onChange={e => set('accountHolderName', e.target.value)}
            leftIcon={<User2 className="w-4 h-4 text-gray-400" />}
          />
        </div>

        {/* Row 2 */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input
            label="Account Number *"
            placeholder="e.g. 1234567890"
            value={form.accountNumber}
            onChange={e => set('accountNumber', e.target.value)}
            leftIcon={<CreditCard className="w-4 h-4 text-gray-400" />}
          />
          <Input
            label="IFSC Code"
            placeholder="e.g. SBIN0001234"
            value={form.ifscCode}
            onChange={e => set('ifscCode', e.target.value)}
            leftIcon={<Hash className="w-4 h-4 text-gray-400" />}
          />
        </div>

        {/* Row 3 */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input
            label="Routing Number"
            placeholder="For US banks"
            value={form.routingNumber}
            onChange={e => set('routingNumber', e.target.value)}
            leftIcon={<Hash className="w-4 h-4 text-gray-400" />}
          />
          <Input
            label="SWIFT / BIC Code"
            placeholder="e.g. SBININBB"
            value={form.swiftCode}
            onChange={e => set('swiftCode', e.target.value)}
            leftIcon={<Hash className="w-4 h-4 text-gray-400" />}
          />
        </div>

        {/* Row 4 */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input
            label="Branch"
            placeholder="e.g. MG Road, Bangalore"
            value={form.branch}
            onChange={e => set('branch', e.target.value)}
            leftIcon={<MapPin className="w-4 h-4 text-gray-400" />}
          />
          <Input
            label="Display Order"
            type="number"
            placeholder="0"
            value={String(form.sortOrder)}
            onChange={e => set('sortOrder', parseInt(e.target.value) || 0)}
            leftIcon={<ArrowUpDown className="w-4 h-4 text-gray-400" />}
          />
        </div>

        {/* Bank Address */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Bank Address</label>
          <textarea
            rows={2}
            placeholder="Full bank branch address"
            value={form.bankAddress}
            onChange={e => set('bankAddress', e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
          />
        </div>

        {/* Payment Instructions */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Payment Instructions
            <span className="text-gray-400 font-normal ml-1">(shown to users on the deposit page)</span>
          </label>
          <textarea
            rows={3}
            placeholder="e.g. Use your User ID as payment reference. Transfer to the account above and upload screenshot..."
            value={form.paymentInstructions}
            onChange={e => set('paymentInstructions', e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
          />
        </div>

        {/* ── Live User Preview ─────────────────────────────────────────── */}
        <div className="border border-dashed border-blue-200 rounded-xl overflow-hidden">
          <div className="flex items-center gap-2 px-3 py-2 bg-blue-50 border-b border-blue-100">
            <Eye className="w-3.5 h-3.5 text-blue-500" />
            <span className="text-xs font-semibold text-blue-700">User Preview</span>
            <span className="text-xs text-blue-500 ml-1">— this is how users will see the bank details</span>
          </div>
          <div className="p-3 bg-white">
            {!form.bankName && !form.accountNumber ? (
              <p className="text-xs text-gray-400 text-center py-3">
                Fill in the form above to see a live preview
              </p>
            ) : (
              <div className="space-y-2">
                {/* Bank header */}
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Building2 className="w-4 h-4 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-900 leading-tight">
                      {form.bankName || <span className="text-gray-300 italic">Bank Name</span>}
                    </p>
                    <p className="text-xs text-gray-500">
                      {form.accountHolderName || <span className="text-gray-300 italic">Account Holder</span>}
                    </p>
                  </div>
                </div>
                {/* Details chips */}
                <div className="grid grid-cols-2 gap-1.5">
                  {[
                    { label: 'Account No.', value: form.accountNumber },
                    form.ifscCode     ? { label: 'IFSC Code',      value: form.ifscCode }     : null,
                    form.routingNumber? { label: 'Routing No.',    value: form.routingNumber } : null,
                    form.swiftCode    ? { label: 'SWIFT / BIC',    value: form.swiftCode }     : null,
                    form.branch       ? { label: 'Branch',         value: form.branch }        : null,
                  ].filter(Boolean).map((item) => item && (
                    <div key={item.label} className="bg-gray-50 rounded-lg px-2.5 py-1.5 flex items-center justify-between gap-1">
                      <div className="min-w-0">
                        <p className="text-[10px] text-gray-400 leading-none mb-0.5">{item.label}</p>
                        <p className="text-xs font-semibold text-gray-900 font-mono truncate">{item.value}</p>
                      </div>
                      <Copy className="w-3 h-3 text-blue-400 flex-shrink-0" />
                    </div>
                  ))}
                </div>
                {/* Payment instructions */}
                {form.paymentInstructions && (
                  <div className="flex gap-2 bg-blue-50 border border-blue-100 rounded-lg px-2.5 py-2">
                    <Info className="w-3.5 h-3.5 text-blue-500 flex-shrink-0 mt-0.5" />
                    <p className="text-xs text-blue-700 leading-relaxed">{form.paymentInstructions}</p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Active toggle */}
        <label className="flex items-center gap-3 cursor-pointer select-none">
          <div
            onClick={() => set('isActive', !form.isActive)}
            className={`relative w-10 h-6 rounded-full transition-colors ${form.isActive ? 'bg-blue-600' : 'bg-gray-300'}`}
          >
            <span className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow transition-transform ${form.isActive ? 'translate-x-5' : 'translate-x-1'}`} />
          </div>
          <span className="text-sm font-medium text-gray-700">
            {form.isActive ? 'Active — visible to users' : 'Inactive — hidden from users'}
          </span>
        </label>

        {/* Actions */}
        <div className="flex justify-end gap-3 pt-2 border-t">
          <Button type="button" variant="outline" onClick={onClose} disabled={saving}>Cancel</Button>
          <Button type="submit" loading={saving}>
            {initial ? 'Save Changes' : 'Add Bank Account'}
          </Button>
        </div>
      </form>
    </Modal>
  );
}

// ─── Delete Confirm Modal ─────────────────────────────────────────────────────
function DeleteConfirmModal({
  open, bank, onClose, onConfirm, deleting,
}: {
  open: boolean;
  bank: BankAccount | null;
  onClose: () => void;
  onConfirm: () => void;
  deleting: boolean;
}) {
  return (
    <Modal open={open} onClose={onClose} title="Delete Bank Account" size="sm">
      <p className="text-sm text-gray-600 mb-4">
        Are you sure you want to delete <strong>{bank?.bankName}</strong>?
        This will immediately hide it from all users.
      </p>
      <div className="flex justify-end gap-3">
        <Button variant="outline" onClick={onClose} disabled={deleting}>Cancel</Button>
        <Button variant="danger" onClick={onConfirm} loading={deleting}>Delete</Button>
      </div>
    </Modal>
  );
}

// ─── Bank Card ────────────────────────────────────────────────────────────────
function BankCard({
  bank, onEdit, onDelete, onToggle, toggling,
}: {
  bank: BankAccount;
  onEdit: () => void;
  onDelete: () => void;
  onToggle: () => void;
  toggling: boolean;
}) {
  return (
    <div className={`bg-white border rounded-xl p-5 shadow-sm transition-opacity ${!bank.isActive ? 'opacity-60' : ''}`}>
      {/* Header */}
      <div className="flex items-start justify-between gap-3 mb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
            <Building2 className="w-5 h-5 text-blue-600" />
          </div>
          <div>
            <h3 className="font-semibold text-gray-900">{bank.bankName}</h3>
            <p className="text-sm text-gray-500">{bank.accountHolderName}</p>
          </div>
        </div>
        <Badge variant={bank.isActive ? 'success' : 'default'}>
          {bank.isActive ? 'Active' : 'Inactive'}
        </Badge>
      </div>

      {/* Details grid */}
      <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm mb-4">
        <div>
          <span className="text-gray-500 text-xs uppercase tracking-wide">Account No.</span>
          <p className="font-mono font-medium text-gray-900">{bank.accountNumber}</p>
        </div>
        {bank.ifscCode && (
          <div>
            <span className="text-gray-500 text-xs uppercase tracking-wide">IFSC</span>
            <p className="font-mono font-medium text-gray-900">{bank.ifscCode}</p>
          </div>
        )}
        {bank.routingNumber && (
          <div>
            <span className="text-gray-500 text-xs uppercase tracking-wide">Routing No.</span>
            <p className="font-mono font-medium text-gray-900">{bank.routingNumber}</p>
          </div>
        )}
        {bank.swiftCode && (
          <div>
            <span className="text-gray-500 text-xs uppercase tracking-wide">SWIFT</span>
            <p className="font-mono font-medium text-gray-900">{bank.swiftCode}</p>
          </div>
        )}
        {bank.branch && (
          <div className="col-span-2">
            <span className="text-gray-500 text-xs uppercase tracking-wide">Branch</span>
            <p className="text-gray-900">{bank.branch}</p>
          </div>
        )}
      </div>

      {bank.paymentInstructions && (
        <div className="bg-blue-50 border border-blue-100 rounded-lg p-3 mb-4">
          <div className="flex gap-2">
            <Info className="w-4 h-4 text-blue-500 flex-shrink-0 mt-0.5" />
            <p className="text-xs text-blue-700 leading-relaxed">{bank.paymentInstructions}</p>
          </div>
        </div>
      )}

      {/* Actions */}
      <div className="flex items-center gap-2 pt-3 border-t">
        <Button size="sm" variant="outline" onClick={onEdit} className="flex-1">
          <Pencil className="w-3.5 h-3.5 mr-1" /> Edit
        </Button>
        <Button
          size="sm"
          variant="outline"
          onClick={onToggle}
          disabled={toggling}
          className="flex-1"
        >
          {toggling ? (
            <Loader2 className="w-3.5 h-3.5 animate-spin" />
          ) : bank.isActive ? (
            <><EyeOff className="w-3.5 h-3.5 mr-1" /> Disable</>
          ) : (
            <><Eye className="w-3.5 h-3.5 mr-1" /> Enable</>
          )}
        </Button>
        <Button size="sm" variant="danger" onClick={onDelete}>
          <Trash2 className="w-3.5 h-3.5" />
        </Button>
      </div>

      {/* Timestamps */}
      <div className="flex items-center justify-between mt-3 pt-2.5 border-t border-dashed border-gray-100">
        <div className="flex items-center gap-1.5 text-xs text-gray-400" title={fullDate(bank.updatedAt)}>
          <Clock className="w-3 h-3" />
          <span>Last updated: <span className="font-medium text-gray-500">{timeAgo(bank.updatedAt)}</span></span>
        </div>
        {bank.createdAt && (
          <div className="text-xs text-gray-400" title={`Created: ${fullDate(bank.createdAt)}`}>
            Added {timeAgo(bank.createdAt)}
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function AdminBankSettingsPage() {
  const [banks, setBanks] = useState<BankAccount[]>([]);
  const [loading, setLoading] = useState(true);
  const [formOpen, setFormOpen] = useState(false);
  const [editTarget, setEditTarget] = useState<BankAccount | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<BankAccount | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [toggling, setToggling] = useState<string | null>(null);

  const load = useCallback(async () => {
    try {
      const res = await bankSettingsApi.adminGetAll();
      setBanks((res as any).data?.banks ?? []);
    } catch {
      toast.error('Failed to load bank settings');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  async function handleSave(data: Omit<BankAccount, 'id'>) {
    if (editTarget) {
      await bankSettingsApi.adminUpdate(editTarget.id, data);
      toast.success('Bank account updated');
    } else {
      await bankSettingsApi.adminCreate(data);
      toast.success('Bank account added');
    }
    await load();
  }

  async function handleDelete() {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await bankSettingsApi.adminDelete(deleteTarget.id);
      toast.success('Bank account deleted');
      setDeleteTarget(null);
      await load();
    } catch {
      toast.error('Failed to delete bank account');
    } finally {
      setDeleting(false);
    }
  }

  async function handleToggle(bank: BankAccount) {
    setToggling(bank.id);
    try {
      await bankSettingsApi.adminUpdate(bank.id, { isActive: !bank.isActive });
      toast.success(bank.isActive ? 'Bank account disabled' : 'Bank account enabled');
      await load();
    } catch {
      toast.error('Failed to update bank account');
    } finally {
      setToggling(null);
    }
  }

  return (
    <div className="p-6 max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Bank Transfer Settings</h1>
          <p className="text-sm text-gray-500 mt-1">
            Manage bank accounts shown to users on the deposit / add money page.
          </p>
        </div>
        <Button onClick={() => { setEditTarget(null); setFormOpen(true); }}>
          <Plus className="w-4 h-4 mr-2" /> Add Bank Account
        </Button>
      </div>

      {/* Stats strip — shown only when banks exist */}
      {!loading && banks.length > 0 && (() => {
        const active = banks.filter(b => b.isActive).length;
        const lastChanged = banks
          .map(b => b.updatedAt)
          .filter(Boolean)
          .sort()
          .at(-1);
        return (
          <div className="flex flex-wrap items-center gap-4 bg-white border border-gray-200 rounded-xl px-5 py-3 mb-5 shadow-sm">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-blue-50 flex items-center justify-center">
                <Building2 className="w-3.5 h-3.5 text-blue-500" />
              </div>
              <div>
                <p className="text-[11px] text-gray-400 leading-none">Total Accounts</p>
                <p className="text-sm font-bold text-gray-800 mt-0.5">{banks.length}</p>
              </div>
            </div>
            <div className="w-px h-7 bg-gray-100" />
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-green-50 flex items-center justify-center">
                <Eye className="w-3.5 h-3.5 text-green-500" />
              </div>
              <div>
                <p className="text-[11px] text-gray-400 leading-none">Active</p>
                <p className="text-sm font-bold text-gray-800 mt-0.5">{active}</p>
              </div>
            </div>
            <div className="w-px h-7 bg-gray-100" />
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-orange-50 flex items-center justify-center">
                <EyeOff className="w-3.5 h-3.5 text-orange-400" />
              </div>
              <div>
                <p className="text-[11px] text-gray-400 leading-none">Inactive</p>
                <p className="text-sm font-bold text-gray-800 mt-0.5">{banks.length - active}</p>
              </div>
            </div>
            <div className="w-px h-7 bg-gray-100" />
            <div className="flex items-center gap-2 ml-auto">
              <Clock className="w-3.5 h-3.5 text-gray-400" />
              <div>
                <p className="text-[11px] text-gray-400 leading-none">Last Settings Change</p>
                <p className="text-sm font-semibold text-gray-700 mt-0.5" title={fullDate(lastChanged)}>
                  {timeAgo(lastChanged)}
                </p>
              </div>
            </div>
          </div>
        );
      })()}

      {/* Info banner */}
      <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-6 flex gap-3">
        <Info className="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5" />
        <p className="text-sm text-amber-800">
          Active bank accounts are displayed to all users when they choose <strong>Bank Transfer</strong> to add money to their wallet.
          Users transfer funds to the shown account and upload a screenshot as proof.
          You then approve or reject the request from the <strong>Deposits</strong> page.
        </p>
      </div>

      {/* Content */}
      {loading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
        </div>
      ) : banks.length === 0 ? (
        <div className="border-2 border-dashed border-gray-200 rounded-xl overflow-hidden">
          <div className="text-center py-14">
            <Building2 className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <h3 className="font-semibold text-gray-600 mb-1">No bank accounts yet</h3>
            <p className="text-sm text-gray-400 mb-4">
              Add a bank account so users can make bank transfer deposits.
            </p>
            <Button onClick={() => { setEditTarget(null); setFormOpen(true); }}>
              <Plus className="w-4 h-4 mr-2" /> Add First Bank Account
            </Button>
          </div>
          <div className="border-t border-dashed border-gray-200 bg-gray-50 px-5 py-3 flex items-center gap-2">
            <Clock className="w-3.5 h-3.5 text-gray-300" />
            <span className="text-xs text-gray-400">Last settings change: <span className="font-medium text-gray-400">Never — no accounts added yet</span></span>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {banks.map(bank => (
            <BankCard
              key={bank.id}
              bank={bank}
              onEdit={() => { setEditTarget(bank); setFormOpen(true); }}
              onDelete={() => setDeleteTarget(bank)}
              onToggle={() => handleToggle(bank)}
              toggling={toggling === bank.id}
            />
          ))}
        </div>
      )}

      {/* Modals */}
      <BankFormModal
        open={formOpen}
        onClose={() => setFormOpen(false)}
        onSave={handleSave}
        initial={editTarget}
      />
      <DeleteConfirmModal
        open={!!deleteTarget}
        bank={deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        deleting={deleting}
      />
    </div>
  );
}
