'use client';
import React, { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import {
  Camera, MapPin, Phone, Globe, CheckCircle, Plus, X, Edit2, Trash2,
  Briefcase, Award, Image as ImageIcon, Clock, Star, DollarSign,
  ExternalLink, Languages, Building, Shield, Lock, Eye, Share2, Copy,
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Input, Textarea, Select } from '@/components/ui/Input';
import { Badge } from '@/components/ui/Badge';
import { Avatar } from '@/components/ui/Avatar';
import { Modal } from '@/components/ui/Modal';
import { Tabs, TabList, Tab, TabPanel } from '@/components/ui/Tabs';
import { StarRating } from '@/components/shared/StarRating';
import { formatCurrency, timeAgo } from '@/lib/utils';
import { useAuthStore } from '@/store/authStore';
import { toast } from '@/store/uiStore';
import { usersApi, reviewsApi, uploadApi } from '@/lib/api';
import { track } from '@/lib/analytics';
import { SKILLS, JOB_CATEGORIES, ROUTES } from '@/lib/constants';
import type { Review, PortfolioItem, Certification, WorkHistoryItem } from '@/types';

// ─── Local helpers ────────────────────────────────────────────────────────────

function tryParse<T>(raw: T[] | string | undefined): T[] {
  if (!raw) return [];
  if (Array.isArray(raw)) return raw;
  try { return JSON.parse(raw as string); } catch { return []; }
}

function uid() { return Math.random().toString(36).slice(2, 10); }

const AVAILABILITY_OPTIONS = [
  { value: 'available',   label: '✅ Available for work' },
  { value: 'busy',        label: '🟡 Busy – limited availability' },
  { value: 'unavailable', label: '🔴 Not available right now' },
];

const LANGUAGE_SUGGESTIONS = [
  'English','Spanish','French','German','Mandarin','Arabic','Portuguese',
  'Hindi','Russian','Japanese','Italian','Korean',
];

const CURRENT_YEAR = new Date().getFullYear();
const YEAR_OPTIONS = Array.from({ length: 60 }, (_, i) => {
  const y = CURRENT_YEAR - i;
  return { value: String(y), label: String(y) };
});

// ─── Sub-components ───────────────────────────────────────────────────────────

function SectionCard({ title, action, children }: { title: string; action?: React.ReactNode; children: React.ReactNode }) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-5">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-dark-900 text-sm">{title}</h3>
        {action}
      </div>
      {children}
    </div>
  );
}

function AvailabilityDot({ status }: { status?: string }) {
  const colors: Record<string, string> = {
    available:   'bg-green-500',
    busy:        'bg-yellow-400',
    unavailable: 'bg-red-400',
  };
  return (
    <span className={`inline-block w-2 h-2 rounded-full ${colors[status ?? 'unavailable'] ?? 'bg-gray-400'}`} />
  );
}

// ─── Portfolio Modal ──────────────────────────────────────────────────────────

interface PortfolioModalProps {
  open: boolean;
  item?: PortfolioItem;
  onClose: () => void;
  onSave: (item: PortfolioItem) => void;
}

function PortfolioModal({ open, item, onClose, onSave }: PortfolioModalProps) {
  const [form, setForm] = useState<PortfolioItem>(item ?? {
    id: uid(), title: '', description: '', imageUrl: '', category: '', year: CURRENT_YEAR,
  });
  const [uploading, setUploading] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setForm(item ?? { id: uid(), title: '', description: '', imageUrl: '', category: '', year: CURRENT_YEAR });
  }, [item, open]);

  const handleImage = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const res = await uploadApi.single(file);
      setForm(f => ({ ...f, imageUrl: res.data.data.url }));
      toast.success('Image uploaded', '');
    } catch { toast.error('Upload failed', 'Please try again.'); }
    finally { setUploading(false); }
  };

  const valid = form.title.trim() && form.category;
  return (
    <Modal
      open={open}
      onClose={onClose}
      title={item ? 'Edit Portfolio Item' : 'Add Portfolio Item'}
      size="lg"
      footer={
        <>
          <Button variant="outline" size="sm" onClick={onClose}>Cancel</Button>
          <Button size="sm" disabled={!valid} onClick={() => { if (valid) onSave(form); }}>
            {item ? 'Update' : 'Add Project'}
          </Button>
        </>
      }
    >
      <div className="space-y-4 py-2">
        <Input label="Project Title *" value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} placeholder="e.g. Kitchen Renovation - Downtown Condo" />
        <div className="grid grid-cols-2 gap-4">
          <Select
            label="Category *"
            value={form.category}
            onChange={e => setForm(f => ({ ...f, category: e.target.value }))}
            options={JOB_CATEGORIES.map(c => ({ value: c, label: c }))}
            placeholder="Select category"
          />
          <Select
            label="Year Completed"
            value={String(form.year)}
            onChange={e => setForm(f => ({ ...f, year: Number(e.target.value) }))}
            options={YEAR_OPTIONS}
          />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <Input label="Location" value={form.location ?? ''} onChange={e => setForm(f => ({ ...f, location: e.target.value }))} placeholder="e.g. New York, NY" leftIcon={<MapPin className="w-4 h-4" />} />
          <Input label="Project Value ($)" type="number" value={form.projectValue ?? ''} onChange={e => setForm(f => ({ ...f, projectValue: e.target.value ? Number(e.target.value) : undefined }))} placeholder="e.g. 15000" leftIcon={<DollarSign className="w-4 h-4" />} />
        </div>
        <Textarea label="Description" value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} rows={3} placeholder="Briefly describe the project, your role, and the outcome…" />

        {/* Image upload */}
        <div>
          <p className="text-sm font-medium text-dark-700 mb-1.5">Project Photo</p>
          {form.imageUrl ? (
            <div className="relative w-full h-40 rounded-xl overflow-hidden bg-gray-100 border border-gray-200">
              <img src={form.imageUrl} alt="Project" className="w-full h-full object-cover" />
              <button onClick={() => setForm(f => ({ ...f, imageUrl: '' }))} className="absolute top-2 right-2 p-1.5 bg-white rounded-full shadow text-red-500 hover:text-red-700">
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          ) : (
            <button
              onClick={() => fileRef.current?.click()}
              className="w-full h-32 border-2 border-dashed border-gray-300 rounded-xl flex flex-col items-center justify-center gap-2 text-dark-400 hover:border-brand-400 hover:text-brand-500 transition-colors"
            >
              {uploading ? <span className="text-sm animate-pulse">Uploading…</span> : (
                <>
                  <ImageIcon className="w-6 h-6" />
                  <span className="text-sm">Click to upload photo</span>
                </>
              )}
            </button>
          )}
          <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleImage} />
        </div>
      </div>
    </Modal>
  );
}

// ─── Certification Modal ──────────────────────────────────────────────────────

interface CertModalProps {
  open: boolean;
  item?: Certification;
  onClose: () => void;
  onSave: (item: Certification) => void;
}

function CertModal({ open, item, onClose, onSave }: CertModalProps) {
  const [form, setForm] = useState<Certification>(item ?? { id: uid(), name: '', issuer: '', year: CURRENT_YEAR });
  const [uploading, setUploading] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setForm(item ?? { id: uid(), name: '', issuer: '', year: CURRENT_YEAR });
  }, [item, open]);

  const handleImage = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const res = await uploadApi.single(file);
      setForm(f => ({ ...f, imageUrl: res.data.data.url }));
      toast.success('Certificate uploaded', '');
    } catch { toast.error('Upload failed', 'Please try again.'); }
    finally { setUploading(false); }
  };

  const valid = form.name.trim() && form.issuer.trim();
  return (
    <Modal
      open={open}
      onClose={onClose}
      title={item ? 'Edit Certification' : 'Add Certification'}
      size="md"
      footer={
        <>
          <Button variant="outline" size="sm" onClick={onClose}>Cancel</Button>
          <Button size="sm" disabled={!valid} onClick={() => { if (valid) onSave(form); }}>
            {item ? 'Update' : 'Add Certificate'}
          </Button>
        </>
      }
    >
      <div className="space-y-4 py-2">
        <Input label="Certification Name *" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} placeholder="e.g. OSHA 30-Hour Construction" />
        <Input label="Issuing Organization *" value={form.issuer} onChange={e => setForm(f => ({ ...f, issuer: e.target.value }))} placeholder="e.g. OSHA, NCCER, Red Cross" leftIcon={<Building className="w-4 h-4" />} />
        <div className="grid grid-cols-2 gap-4">
          <Select label="Year Issued" value={String(form.year)} onChange={e => setForm(f => ({ ...f, year: Number(e.target.value) }))} options={YEAR_OPTIONS} />
          <Select label="Expires" value={form.expiryYear ? String(form.expiryYear) : ''} onChange={e => setForm(f => ({ ...f, expiryYear: e.target.value ? Number(e.target.value) : undefined }))} options={[{ value: '', label: 'No expiry' }, ...Array.from({ length: 20 }, (_, i) => { const y = CURRENT_YEAR + i; return { value: String(y), label: String(y) }; })]} placeholder="No expiry" />
        </div>
        {/* Certificate image */}
        <div>
          <p className="text-sm font-medium text-dark-700 mb-1.5">Certificate Image (optional)</p>
          {form.imageUrl ? (
            <div className="relative w-full h-28 rounded-xl overflow-hidden bg-gray-100 border border-gray-200">
              <img src={form.imageUrl} alt="Certificate" className="w-full h-full object-cover" />
              <button onClick={() => setForm(f => ({ ...f, imageUrl: '' }))} className="absolute top-2 right-2 p-1.5 bg-white rounded-full shadow text-red-500 hover:text-red-700"><X className="w-3.5 h-3.5" /></button>
            </div>
          ) : (
            <button onClick={() => fileRef.current?.click()} className="w-full h-24 border-2 border-dashed border-gray-300 rounded-xl flex items-center justify-center gap-2 text-sm text-dark-400 hover:border-brand-400 hover:text-brand-500 transition-colors">
              {uploading ? <span className="animate-pulse">Uploading…</span> : <><Award className="w-4 h-4" /><span>Upload certificate scan</span></>}
            </button>
          )}
          <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleImage} />
        </div>
      </div>
    </Modal>
  );
}

// ─── Work History Modal ───────────────────────────────────────────────────────

interface WorkModalProps {
  open: boolean;
  item?: WorkHistoryItem;
  onClose: () => void;
  onSave: (item: WorkHistoryItem) => void;
}

function WorkModal({ open, item, onClose, onSave }: WorkModalProps) {
  const [form, setForm] = useState<WorkHistoryItem>(item ?? {
    id: uid(), company: '', role: '', startYear: CURRENT_YEAR - 1, current: false, description: '',
  });

  useEffect(() => {
    setForm(item ?? { id: uid(), company: '', role: '', startYear: CURRENT_YEAR - 1, current: false, description: '' });
  }, [item, open]);

  const valid = form.company.trim() && form.role.trim();
  return (
    <Modal
      open={open}
      onClose={onClose}
      title={item ? 'Edit Work Experience' : 'Add Work Experience'}
      size="lg"
      footer={
        <>
          <Button variant="outline" size="sm" onClick={onClose}>Cancel</Button>
          <Button size="sm" disabled={!valid} onClick={() => { if (valid) onSave(form); }}>
            {item ? 'Update' : 'Add Experience'}
          </Button>
        </>
      }
    >
      <div className="space-y-4 py-2">
        <Input label="Company / Client *" value={form.company} onChange={e => setForm(f => ({ ...f, company: e.target.value }))} placeholder="e.g. BuildRight Construction LLC" leftIcon={<Building className="w-4 h-4" />} />
        <Input label="Role / Position *" value={form.role} onChange={e => setForm(f => ({ ...f, role: e.target.value }))} placeholder="e.g. Lead Plumber, Site Supervisor" leftIcon={<Briefcase className="w-4 h-4" />} />
        <div className="grid grid-cols-2 gap-4">
          <Select label="Start Year" value={String(form.startYear)} onChange={e => setForm(f => ({ ...f, startYear: Number(e.target.value) }))} options={YEAR_OPTIONS} />
          {!form.current ? (
            <Select label="End Year" value={form.endYear ? String(form.endYear) : ''} onChange={e => setForm(f => ({ ...f, endYear: e.target.value ? Number(e.target.value) : undefined }))} options={YEAR_OPTIONS} placeholder="Present" />
          ) : (
            <div className="flex items-end pb-2.5">
              <span className="text-sm text-dark-500 italic">Present</span>
            </div>
          )}
        </div>
        <Input label="Location" value={form.location ?? ''} onChange={e => setForm(f => ({ ...f, location: e.target.value }))} placeholder="e.g. Chicago, IL" leftIcon={<MapPin className="w-4 h-4" />} />
        <Textarea label="Description" value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} rows={3} placeholder="Describe your responsibilities and key achievements…" />
        <label className="flex items-center gap-2 cursor-pointer select-none">
          <input type="checkbox" checked={form.current} onChange={e => setForm(f => ({ ...f, current: e.target.checked, endYear: undefined }))} className="w-4 h-4 rounded border-gray-300 text-brand-500 focus:ring-brand-500" />
          <span className="text-sm text-dark-700">I currently work here</span>
        </label>
      </div>
    </Modal>
  );
}

// ─── Main page ────────────────────────────────────────────────────────────────

interface BasicForm {
  firstName: string; lastName: string; bio: string; phone: string;
  location: string; website: string; availability: string;
  hourlyRate: string; yearsExperience: string; licenseNumber: string;
  serviceRadius: string;
}

export default function ProfilePage() {
  const { user, setUser, token } = useAuthStore();
  const isContractor = user?.role === 'contractor';

  // ── Data state ─────────────────────────────────────────────────────────────
  const [reviews, setReviews] = useState<Review[]>([]);
  const [stats, setStats] = useState<any>(null);

  // ── Section-level state ────────────────────────────────────────────────────
  const [skills, setSkills]               = useState<string[]>([]);
  const [portfolio, setPortfolio]         = useState<PortfolioItem[]>([]);
  const [certifications, setCerts]        = useState<Certification[]>([]);
  const [workHistory, setWorkHistory]     = useState<WorkHistoryItem[]>([]);
  const [languages, setLanguages]         = useState<string[]>([]);

  // ── Basic info form ────────────────────────────────────────────────────────
  const makeBasicForm = (): BasicForm => ({
    firstName: user?.firstName ?? '',
    lastName: user?.lastName ?? '',
    bio: user?.bio ?? '',
    phone: user?.phone ?? '',
    location: user?.location ?? '',
    website: user?.website ?? '',
    availability: user?.availability ?? 'available',
    hourlyRate: user?.hourlyRate ? String(user.hourlyRate) : '',
    yearsExperience: user?.yearsExperience ? String(user.yearsExperience) : '',
    licenseNumber: user?.licenseNumber ?? '',
    serviceRadius: user?.serviceRadius ? String(user.serviceRadius) : '',
  });
  const [basicForm, setBasicForm] = useState<BasicForm>(makeBasicForm);
  const [newSkill, setNewSkill]           = useState('');
  const [newLang, setNewLang]             = useState('');

  // ── Saving flags ───────────────────────────────────────────────────────────
  const [savingBasic, setSavingBasic]         = useState(false);
  const [savingSkills, setSavingSkills]       = useState(false);
  const [savingPortfolio, setSavingPortfolio] = useState(false);
  const [savingCerts, setSavingCerts]         = useState(false);
  const [savingWork, setSavingWork]           = useState(false);

  // ── Modal state ────────────────────────────────────────────────────────────
  const [portfolioModal, setPortfolioModal]   = useState<{ open: boolean; item?: PortfolioItem }>({ open: false });
  const [certModal, setCertModal]             = useState<{ open: boolean; item?: Certification }>({ open: false });
  const [workModal, setWorkModal]             = useState<{ open: boolean; item?: WorkHistoryItem }>({ open: false });

  // ── Profile image upload ───────────────────────────────────────────────────
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  const avatarRef = useRef<HTMLInputElement>(null);

  // ── Verification document uploads ─────────────────────────────────────────
  const [uploadingIdDoc, setUploadingIdDoc] = useState(false);
  const [uploadingTradeLicense, setUploadingTradeLicense] = useState(false);
  const [uploadingInsurance, setUploadingInsurance] = useState(false);
  const idDocRef = useRef<HTMLInputElement>(null);
  const tradeLicenseRef = useRef<HTMLInputElement>(null);
  const insuranceRef = useRef<HTMLInputElement>(null);

  // ── Load data on mount ─────────────────────────────────────────────────────
  useEffect(() => {
    if (!user?.id) return;
    setBasicForm(makeBasicForm());
    setSkills(tryParse<string>(user.skills as string | string[]));
    setPortfolio(tryParse<PortfolioItem>(user.portfolio));
    setCerts(tryParse<Certification>(user.certifications));
    setWorkHistory(tryParse<WorkHistoryItem>(user.workHistory));
    setLanguages(tryParse<string>(user.languages as string | string[]));

    Promise.allSettled([
      reviewsApi.forUser(user.id),
      usersApi.myStats(),
    ]).then(([revRes, statsRes]) => {
      if (revRes.status === 'fulfilled') {
        const d = revRes.value.data.data;
        setReviews(d.reviews ?? (Array.isArray(d) ? d : []));
      }
      if (statsRes.status === 'fulfilled') setStats(statsRes.value.data.data);
    });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.id]);

  // ── API save helper ────────────────────────────────────────────────────────
  async function doSave(payload: Record<string, unknown>, setLoading: (v: boolean) => void, label: string) {
    setLoading(true);
    try {
      const res = await usersApi.update(payload);
      setUser(res.data.data, token ?? '');
      track.profileUpdated({ section: label });
      toast.success(`${label} saved`, 'Your changes are live.');
    } catch (err: any) {
      toast.error('Save failed', err?.response?.data?.message ?? 'Please try again.');
    } finally {
      setLoading(false);
    }
  }

  // ── Section save handlers ──────────────────────────────────────────────────
  const saveBasic = () => doSave({
    firstName: basicForm.firstName,
    lastName: basicForm.lastName,
    bio: basicForm.bio,
    phone: basicForm.phone,
    location: basicForm.location,
    website: basicForm.website,
    availability: basicForm.availability,
    hourlyRate: basicForm.hourlyRate ? parseFloat(basicForm.hourlyRate) : null,
    yearsExperience: basicForm.yearsExperience ? parseInt(basicForm.yearsExperience) : null,
    licenseNumber: basicForm.licenseNumber,
    serviceRadius: basicForm.serviceRadius ? parseInt(basicForm.serviceRadius) : null,
  }, setSavingBasic, 'Profile');

  const saveSkills = () => doSave({ skills, languages }, setSavingSkills, 'Skills');
  const savePortfolio = () => doSave({ portfolio }, setSavingPortfolio, 'Portfolio');
  const saveCerts = () => doSave({ certifications }, setSavingCerts, 'Certifications');
  const saveWork = () => doSave({ workHistory }, setSavingWork, 'Work history');

  // ── Avatar upload ──────────────────────────────────────────────────────────
  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadingAvatar(true);
    try {
      const res = await uploadApi.single(file);
      track.profilePhotoUploaded();
      await doSave({ profileImage: res.data.data.url }, () => {}, 'Photo');
    } catch { toast.error('Upload failed', 'Please try again.'); }
    finally { setUploadingAvatar(false); }
  };

  // ── Render ─────────────────────────────────────────────────────────────────
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="page-title">Profile & Settings</h1>
          <p className="page-subtitle">
            {isContractor ? 'Manage your portfolio, credentials, and how clients find you.' : 'Manage your account information.'}
          </p>
        </div>
        <Link href={`/profile/${user?.id}`} target="_blank">
          <Button variant="outline" size="sm" rightIcon={<Eye className="w-4 h-4" />}>
            View Public Profile
          </Button>
        </Link>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* ── Left: Profile card ────────────────────────────────────────────── */}
        <div className="space-y-4">
          {/* Avatar + identity */}
          <div className="bg-white rounded-xl border border-gray-200 p-6 text-center">
            <div className="relative inline-block mb-4">
              {uploadingAvatar ? (
                <div className="w-20 h-20 rounded-full bg-gray-100 flex items-center justify-center animate-pulse">
                  <Camera className="w-6 h-6 text-gray-400" />
                </div>
              ) : (
                <Avatar src={user?.profileImage} firstName={user?.firstName} lastName={user?.lastName} size="xl" />
              )}
              <button
                onClick={() => avatarRef.current?.click()}
                className="absolute bottom-0 right-0 w-7 h-7 bg-brand-500 hover:bg-brand-600 rounded-full flex items-center justify-center text-white shadow-md transition-colors"
              >
                <Camera className="w-3.5 h-3.5" />
              </button>
              <input ref={avatarRef} type="file" accept="image/*" className="hidden" onChange={handleAvatarUpload} />
            </div>

            <h2 className="text-xl font-bold text-dark-900">{user?.firstName} {user?.lastName}</h2>
            <p className="text-sm text-dark-400 mb-1 capitalize">{user?.role?.replace('_', ' ')}</p>

            {/* Availability */}
            {isContractor && (
              <div className="flex items-center justify-center gap-1.5 mb-3">
                <AvailabilityDot status={user?.availability} />
                <span className="text-xs text-dark-500 capitalize">
                  {user?.availability === 'available' ? 'Available for work' : user?.availability === 'busy' ? 'Limited availability' : 'Not available'}
                </span>
              </div>
            )}

            <div className="flex items-center justify-center gap-2 flex-wrap mb-4">
              {user?.rating ? <StarRating rating={user.rating} showValue size="sm" count={stats?.reviewCount} /> : null}
              {user?.isVerified && (
                <Badge variant="success" size="sm">
                  <CheckCircle className="w-3 h-3 mr-1" />Verified
                </Badge>
              )}
            </div>

            {/* Stats grid */}
            <div className="grid grid-cols-3 gap-3 pt-4 border-t border-gray-100">
              <div>
                <p className="text-lg font-bold text-dark-900">{stats?.jobsCompleted ?? stats?.jobsWon ?? '—'}</p>
                <p className="text-xs text-dark-400">Jobs Done</p>
              </div>
              <div>
                <p className="text-lg font-bold text-dark-900">{reviews.length}</p>
                <p className="text-xs text-dark-400">Reviews</p>
              </div>
              <div>
                <p className="text-lg font-bold text-dark-900">{user?.rating?.toFixed(1) ?? '—'}</p>
                <p className="text-xs text-dark-400">Rating</p>
              </div>
            </div>
          </div>

          {/* Contact & details */}
          <div className="bg-white rounded-xl border border-gray-200 p-5 space-y-2.5 text-sm text-dark-600">
            <h3 className="font-semibold text-dark-900 text-sm mb-3">Details</h3>
            {user?.location && <div className="flex items-center gap-2.5"><MapPin className="w-4 h-4 text-dark-400 flex-shrink-0" /><span>{user.location}</span></div>}
            {user?.phone && <div className="flex items-center gap-2.5"><Phone className="w-4 h-4 text-dark-400 flex-shrink-0" /><span>{user.phone}</span></div>}
            {user?.website && <div className="flex items-center gap-2.5"><Globe className="w-4 h-4 text-dark-400 flex-shrink-0" /><a href={user.website.startsWith('http') ? user.website : `https://${user.website}`} target="_blank" rel="noopener noreferrer" className="text-brand-600 hover:underline truncate">{user.website.replace(/^https?:\/\//, '')}</a></div>}
            <div className="flex items-center gap-2.5"><Globe className="w-4 h-4 text-dark-400 flex-shrink-0" /><span className="text-dark-400 text-xs truncate">{user?.email}</span></div>
            {isContractor && user?.hourlyRate && <div className="flex items-center gap-2.5"><DollarSign className="w-4 h-4 text-dark-400 flex-shrink-0" /><span>{formatCurrency(user.hourlyRate)}/hr</span></div>}
            {isContractor && user?.yearsExperience && <div className="flex items-center gap-2.5"><Clock className="w-4 h-4 text-dark-400 flex-shrink-0" /><span>{user.yearsExperience} yrs experience</span></div>}
          </div>

          {/* Share profile button — contractors only */}
          {isContractor && user?.id && (
            <div className="bg-white rounded-xl border border-gray-200 p-4">
              <h3 className="font-semibold text-dark-900 text-sm mb-2 flex items-center gap-2">
                <Share2 className="w-4 h-4 text-brand-500" />
                Share Your Profile
              </h3>
              <p className="text-xs text-dark-400 mb-3">
                Share this link with clients so they can view your public profile.
              </p>
              <div className="flex items-center gap-2 bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 mb-2">
                <span className="text-xs text-dark-500 truncate flex-1">
                  {typeof window !== 'undefined' ? `${window.location.origin}/profile/${user.id}` : `/profile/${user.id}`}
                </span>
              </div>
              <div className="flex gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  className="flex-1"
                  leftIcon={<Copy className="w-3.5 h-3.5" />}
                  onClick={() => {
                    const url = `${window.location.origin}/profile/${user.id}`;
                    navigator.clipboard.writeText(url).then(() => toast.success('Link copied!', 'Your public profile link is in the clipboard.'));
                  }}
                >
                  Copy Link
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  leftIcon={<Eye className="w-3.5 h-3.5" />}
                  onClick={() => window.open(`/profile/${user.id}`, '_blank')}
                >
                  Preview
                </Button>
              </div>
            </div>
          )}

          {/* Quick summary chips */}
          {isContractor && (
            <div className="bg-white rounded-xl border border-gray-200 p-5">
              <h3 className="font-semibold text-dark-900 text-sm mb-3">Profile Completeness</h3>
              <div className="space-y-2">
                {[
                  { label: 'Photo', done: !!user?.profileImage },
                  { label: 'Bio', done: !!user?.bio },
                  { label: 'Skills', done: skills.length > 0 },
                  { label: 'Portfolio', done: portfolio.length > 0 },
                  { label: 'Certifications', done: certifications.length > 0 },
                  { label: 'Work History', done: workHistory.length > 0 },
                ].map(({ label, done }) => (
                  <div key={label} className="flex items-center justify-between text-xs">
                    <span className={done ? 'text-dark-700' : 'text-dark-400'}>{label}</span>
                    <span className={`font-semibold ${done ? 'text-green-600' : 'text-gray-400'}`}>{done ? '✓' : '—'}</span>
                  </div>
                ))}
              </div>
              <div className="mt-3 bg-gray-100 rounded-full h-1.5 overflow-hidden">
                <div
                  className="bg-brand-500 h-full rounded-full transition-all"
                  style={{ width: `${(([!!user?.profileImage, !!user?.bio, skills.length > 0, portfolio.length > 0, certifications.length > 0, workHistory.length > 0].filter(Boolean).length / 6) * 100).toFixed(0)}%` }}
                />
              </div>
            </div>
          )}
        </div>

        {/* ── Right: Tabs ───────────────────────────────────────────────────── */}
        <div className="lg:col-span-2">
          <Tabs defaultValue="overview">
            <TabList className="flex-wrap">
              <Tab value="overview" icon={<Eye className="w-3.5 h-3.5" />}>Overview</Tab>
              <Tab value="edit" icon={<Edit2 className="w-3.5 h-3.5" />}>Edit Profile</Tab>
              {isContractor && <Tab value="skills" icon={<Star className="w-3.5 h-3.5" />}>Skills & Certs</Tab>}
              {isContractor && <Tab value="portfolio" icon={<ImageIcon className="w-3.5 h-3.5" />} count={portfolio.length}>Portfolio</Tab>}
              {isContractor && <Tab value="history" icon={<Briefcase className="w-3.5 h-3.5" />} count={workHistory.length}>Work History</Tab>}
              <Tab value="reviews" icon={<Star className="w-3.5 h-3.5" />} count={reviews.length}>Reviews</Tab>
              {isContractor && <Tab value="verification" icon={<Shield className="w-3.5 h-3.5" />}>Verification</Tab>}
            </TabList>

            <div className="mt-5 space-y-4">

              {/* ── Overview ────────────────────────────────────────────────── */}
              <TabPanel value="overview">
                <div className="space-y-4">
                  {user?.bio ? (
                    <SectionCard title="About Me">
                      <p className="text-sm text-dark-600 leading-relaxed">{user.bio}</p>
                    </SectionCard>
                  ) : (
                    <div className="bg-gray-50 border border-dashed border-gray-300 rounded-xl p-5 text-center text-sm text-dark-400">
                      No bio yet — add one in <span className="text-brand-600 font-medium">Edit Profile</span>.
                    </div>
                  )}

                  {skills.length > 0 && (
                    <SectionCard title="Skills & Expertise">
                      <div className="flex flex-wrap gap-2">
                        {skills.map(s => <Badge key={s} variant="outline">{s}</Badge>)}
                      </div>
                    </SectionCard>
                  )}

                  {certifications.length > 0 && (
                    <SectionCard title="Certifications">
                      <div className="grid sm:grid-cols-2 gap-3">
                        {certifications.map(c => (
                          <div key={c.id} className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                            {c.imageUrl ? (
                              <img src={c.imageUrl} alt={c.name} className="w-10 h-10 rounded object-cover flex-shrink-0" />
                            ) : (
                              <div className="w-10 h-10 rounded bg-brand-50 flex items-center justify-center flex-shrink-0">
                                <Award className="w-5 h-5 text-brand-500" />
                              </div>
                            )}
                            <div>
                              <p className="text-sm font-semibold text-dark-900">{c.name}</p>
                              <p className="text-xs text-dark-400">{c.issuer} · {c.year}{c.expiryYear ? ` – ${c.expiryYear}` : ''}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </SectionCard>
                  )}

                  {portfolio.length > 0 && (
                    <SectionCard title="Portfolio Highlights">
                      <div className="grid sm:grid-cols-2 gap-4">
                        {portfolio.slice(0, 4).map(p => (
                          <div key={p.id} className="rounded-xl overflow-hidden border border-gray-200">
                            {p.imageUrl ? (
                              <img src={p.imageUrl} alt={p.title} className="w-full h-32 object-cover" />
                            ) : (
                              <div className="w-full h-32 bg-gray-100 flex items-center justify-center">
                                <ImageIcon className="w-8 h-8 text-gray-300" />
                              </div>
                            )}
                            <div className="p-3">
                              <p className="text-sm font-semibold text-dark-900 truncate">{p.title}</p>
                              <p className="text-xs text-dark-400">{p.category} · {p.year}{p.projectValue ? ` · ${formatCurrency(p.projectValue)}` : ''}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </SectionCard>
                  )}

                  {workHistory.length > 0 && (
                    <SectionCard title="Work Experience">
                      <div className="space-y-4">
                        {workHistory.map((w, i) => (
                          <div key={w.id} className={`flex gap-4 ${i < workHistory.length - 1 ? 'pb-4 border-b border-gray-100' : ''}`}>
                            <div className="w-9 h-9 rounded-lg bg-dark-50 flex items-center justify-center flex-shrink-0 mt-0.5">
                              <Building className="w-4 h-4 text-dark-400" />
                            </div>
                            <div>
                              <p className="text-sm font-semibold text-dark-900">{w.role}</p>
                              <p className="text-xs text-dark-500 font-medium">{w.company}{w.location ? ` · ${w.location}` : ''}</p>
                              <p className="text-xs text-dark-400 mb-1">{w.startYear} – {w.current ? 'Present' : (w.endYear ?? '')}</p>
                              {w.description && <p className="text-xs text-dark-600 leading-relaxed">{w.description}</p>}
                            </div>
                          </div>
                        ))}
                      </div>
                    </SectionCard>
                  )}

                  {languages.length > 0 && (
                    <SectionCard title="Languages">
                      <div className="flex flex-wrap gap-2">
                        {languages.map(l => <Badge key={l} variant="outline"><Languages className="w-3 h-3 mr-1" />{l}</Badge>)}
                      </div>
                    </SectionCard>
                  )}
                </div>
              </TabPanel>

              {/* ── Edit Profile ────────────────────────────────────────────── */}
              <TabPanel value="edit">
                <div className="space-y-4">
                  <SectionCard title="Personal Information">
                    <div className="grid grid-cols-2 gap-4">
                      <Input label="First Name" value={basicForm.firstName} onChange={e => setBasicForm(f => ({ ...f, firstName: e.target.value }))} />
                      <Input label="Last Name" value={basicForm.lastName} onChange={e => setBasicForm(f => ({ ...f, lastName: e.target.value }))} />
                    </div>
                    <div className="grid grid-cols-2 gap-4 mt-4">
                      <Input label="Phone" value={basicForm.phone} onChange={e => setBasicForm(f => ({ ...f, phone: e.target.value }))} leftIcon={<Phone className="w-4 h-4" />} placeholder="+1 555 000 0000" />
                      <Input label="Location" value={basicForm.location} onChange={e => setBasicForm(f => ({ ...f, location: e.target.value }))} leftIcon={<MapPin className="w-4 h-4" />} placeholder="City, State" />
                    </div>
                    <div className="mt-4">
                      <Input label="Website" value={basicForm.website} onChange={e => setBasicForm(f => ({ ...f, website: e.target.value }))} leftIcon={<Globe className="w-4 h-4" />} placeholder="yourwebsite.com" />
                    </div>
                    <div className="mt-4">
                      <Textarea label="Professional Bio" value={basicForm.bio} onChange={e => setBasicForm(f => ({ ...f, bio: e.target.value }))} rows={4} placeholder="Describe your expertise, specializations, and what makes you stand out…" hint="A strong bio helps job posters find and trust you." />
                    </div>
                  </SectionCard>

                  {isContractor && (
                    <SectionCard title="Professional Details">
                      <div className="grid grid-cols-2 gap-4">
                        <Input label="Years of Experience" type="number" value={basicForm.yearsExperience} onChange={e => setBasicForm(f => ({ ...f, yearsExperience: e.target.value }))} leftIcon={<Clock className="w-4 h-4" />} placeholder="e.g. 8" />
                        <Input label="License / Registration No." value={basicForm.licenseNumber} onChange={e => setBasicForm(f => ({ ...f, licenseNumber: e.target.value }))} leftIcon={<Shield className="w-4 h-4" />} placeholder="e.g. LIC-12345" />
                      </div>
                      <div className="grid grid-cols-2 gap-4 mt-4">
                        <Input label="Hourly Rate (USD)" type="number" value={basicForm.hourlyRate} onChange={e => setBasicForm(f => ({ ...f, hourlyRate: e.target.value }))} leftIcon={<DollarSign className="w-4 h-4" />} placeholder="e.g. 75" />
                        <Input label="Service Radius (miles)" type="number" value={basicForm.serviceRadius} onChange={e => setBasicForm(f => ({ ...f, serviceRadius: e.target.value }))} placeholder="e.g. 50" />
                      </div>
                      <div className="mt-4">
                        <Select
                          label="Availability"
                          value={basicForm.availability}
                          onChange={e => setBasicForm(f => ({ ...f, availability: e.target.value }))}
                          options={AVAILABILITY_OPTIONS}
                        />
                      </div>
                    </SectionCard>
                  )}

                  <div className="flex justify-end">
                    <Button onClick={saveBasic} loading={savingBasic} leftIcon={<CheckCircle className="w-4 h-4" />}>
                      Save Profile
                    </Button>
                  </div>
                </div>
              </TabPanel>

              {/* ── Skills & Certifications ──────────────────────────────────── */}
              {isContractor && (
                <TabPanel value="skills">
                  <div className="space-y-4">
                    {/* Skills */}
                    <SectionCard title="Skills & Specializations">
                      <div className="flex flex-wrap gap-2 mb-4">
                        {skills.map(s => (
                          <span key={s} className="flex items-center gap-1 bg-brand-50 text-brand-700 text-xs font-medium px-3 py-1.5 rounded-full border border-brand-200">
                            {s}
                            <button onClick={() => setSkills(sk => sk.filter(x => x !== s))} className="ml-0.5 text-brand-400 hover:text-red-500 transition-colors">
                              <X className="w-3 h-3" />
                            </button>
                          </span>
                        ))}
                        {skills.length === 0 && <p className="text-sm text-dark-400 italic">No skills added yet.</p>}
                      </div>
                      <div className="flex gap-2">
                        <Select
                          options={SKILLS.filter(s => !skills.includes(s)).map(s => ({ value: s, label: s }))}
                          placeholder="Add a skill…"
                          value={newSkill}
                          onChange={e => setNewSkill(e.target.value)}
                        />
                        <Button variant="outline" size="sm" onClick={() => { if (newSkill) { setSkills(s => [...s, newSkill]); setNewSkill(''); } }} disabled={!newSkill}>
                          <Plus className="w-4 h-4" />
                        </Button>
                      </div>
                    </SectionCard>

                    {/* Languages */}
                    <SectionCard title="Languages Spoken">
                      <div className="flex flex-wrap gap-2 mb-4">
                        {languages.map(l => (
                          <span key={l} className="flex items-center gap-1 bg-gray-100 text-dark-700 text-xs font-medium px-3 py-1.5 rounded-full">
                            <Languages className="w-3 h-3 mr-0.5" />{l}
                            <button onClick={() => setLanguages(ls => ls.filter(x => x !== l))} className="ml-0.5 text-dark-400 hover:text-red-500 transition-colors">
                              <X className="w-3 h-3" />
                            </button>
                          </span>
                        ))}
                        {languages.length === 0 && <p className="text-sm text-dark-400 italic">No languages added.</p>}
                      </div>
                      <div className="flex gap-2">
                        <Select
                          options={LANGUAGE_SUGGESTIONS.filter(l => !languages.includes(l)).map(l => ({ value: l, label: l }))}
                          placeholder="Add a language…"
                          value={newLang}
                          onChange={e => setNewLang(e.target.value)}
                        />
                        <Button variant="outline" size="sm" onClick={() => { if (newLang) { setLanguages(ls => [...ls, newLang]); setNewLang(''); } }} disabled={!newLang}>
                          <Plus className="w-4 h-4" />
                        </Button>
                      </div>
                    </SectionCard>

                    <div className="flex justify-end">
                      <Button onClick={saveSkills} loading={savingSkills} leftIcon={<CheckCircle className="w-4 h-4" />}>
                        Save Skills & Languages
                      </Button>
                    </div>

                    {/* Certifications */}
                    <SectionCard
                      title={`Certifications (${certifications.length})`}
                      action={
                        <Button size="xs" variant="outline" onClick={() => setCertModal({ open: true })} leftIcon={<Plus className="w-3.5 h-3.5" />}>
                          Add
                        </Button>
                      }
                    >
                      {certifications.length === 0 ? (
                        <div className="text-center py-6">
                          <Award className="w-8 h-8 text-gray-300 mx-auto mb-2" />
                          <p className="text-sm text-dark-400">No certifications yet. Add your licenses and credentials.</p>
                        </div>
                      ) : (
                        <div className="space-y-3">
                          {certifications.map(c => (
                            <div key={c.id} className="flex items-start gap-3 p-3 bg-gray-50 rounded-xl group">
                              {c.imageUrl ? (
                                <img src={c.imageUrl} alt={c.name} className="w-11 h-11 rounded-lg object-cover flex-shrink-0" />
                              ) : (
                                <div className="w-11 h-11 rounded-lg bg-brand-50 flex items-center justify-center flex-shrink-0">
                                  <Award className="w-5 h-5 text-brand-500" />
                                </div>
                              )}
                              <div className="flex-1 min-w-0">
                                <p className="text-sm font-semibold text-dark-900">{c.name}</p>
                                <p className="text-xs text-dark-500">{c.issuer}</p>
                                <p className="text-xs text-dark-400">Issued {c.year}{c.expiryYear ? ` · Expires ${c.expiryYear}` : ' · No expiry'}</p>
                              </div>
                              <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                <button onClick={() => setCertModal({ open: true, item: c })} className="p-1.5 rounded-lg text-dark-400 hover:text-brand-600 hover:bg-brand-50 transition-colors"><Edit2 className="w-3.5 h-3.5" /></button>
                                <button onClick={() => { const updated = certifications.filter(x => x.id !== c.id); setCerts(updated); doSave({ certifications: updated }, setSavingCerts, 'Certifications'); }} className="p-1.5 rounded-lg text-dark-400 hover:text-red-600 hover:bg-red-50 transition-colors"><Trash2 className="w-3.5 h-3.5" /></button>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                      {certifications.length > 0 && (
                        <div className="flex justify-end mt-4">
                          <Button size="sm" onClick={saveCerts} loading={savingCerts} leftIcon={<CheckCircle className="w-4 h-4" />}>
                            Save Certifications
                          </Button>
                        </div>
                      )}
                    </SectionCard>
                  </div>
                </TabPanel>
              )}

              {/* ── Portfolio ────────────────────────────────────────────────── */}
              {isContractor && (
                <TabPanel value="portfolio">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <p className="text-sm text-dark-500">Showcase your best projects to attract job posters.</p>
                      <Button size="sm" onClick={() => setPortfolioModal({ open: true })} leftIcon={<Plus className="w-4 h-4" />}>
                        Add Project
                      </Button>
                    </div>

                    {portfolio.length === 0 ? (
                      <div className="bg-white border border-dashed border-gray-300 rounded-xl p-12 text-center">
                        <ImageIcon className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                        <p className="text-sm font-semibold text-dark-700 mb-1">No portfolio projects yet</p>
                        <p className="text-xs text-dark-400 mb-4">Projects with photos get 3× more profile views.</p>
                        <Button size="sm" onClick={() => setPortfolioModal({ open: true })} leftIcon={<Plus className="w-4 h-4" />}>
                          Add First Project
                        </Button>
                      </div>
                    ) : (
                      <>
                        <div className="grid sm:grid-cols-2 gap-4">
                          {portfolio.map(p => (
                            <div key={p.id} className="bg-white rounded-xl border border-gray-200 overflow-hidden group">
                              <div className="relative">
                                {p.imageUrl ? (
                                  <img src={p.imageUrl} alt={p.title} className="w-full h-44 object-cover" />
                                ) : (
                                  <div className="w-full h-44 bg-gray-100 flex items-center justify-center">
                                    <ImageIcon className="w-10 h-10 text-gray-300" />
                                  </div>
                                )}
                                {/* Action overlay */}
                                <div className="absolute inset-0 bg-dark-900/0 group-hover:bg-dark-900/40 transition-all flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100">
                                  <button onClick={() => setPortfolioModal({ open: true, item: p })} className="p-2 bg-white rounded-full text-dark-700 hover:text-brand-600 shadow-lg transition-colors">
                                    <Edit2 className="w-4 h-4" />
                                  </button>
                                  <button onClick={() => { const updated = portfolio.filter(x => x.id !== p.id); setPortfolio(updated); doSave({ portfolio: updated }, setSavingPortfolio, 'Portfolio'); }} className="p-2 bg-white rounded-full text-dark-700 hover:text-red-600 shadow-lg transition-colors">
                                    <Trash2 className="w-4 h-4" />
                                  </button>
                                </div>
                              </div>
                              <div className="p-4">
                                <p className="text-sm font-semibold text-dark-900 truncate">{p.title}</p>
                                <div className="flex items-center gap-2 mt-1 flex-wrap">
                                  <Badge variant="outline" size="sm">{p.category}</Badge>
                                  <span className="text-xs text-dark-400">{p.year}</span>
                                  {p.location && <span className="text-xs text-dark-400">· {p.location}</span>}
                                  {p.projectValue && <span className="text-xs font-semibold text-brand-600">{formatCurrency(p.projectValue)}</span>}
                                </div>
                                {p.description && <p className="text-xs text-dark-500 mt-2 line-clamp-2">{p.description}</p>}
                              </div>
                            </div>
                          ))}
                        </div>
                        <div className="flex justify-end">
                          <Button onClick={savePortfolio} loading={savingPortfolio} leftIcon={<CheckCircle className="w-4 h-4" />}>
                            Save Portfolio
                          </Button>
                        </div>
                      </>
                    )}
                  </div>
                </TabPanel>
              )}

              {/* ── Work History ─────────────────────────────────────────────── */}
              {isContractor && (
                <TabPanel value="history">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <p className="text-sm text-dark-500">List previous employers, contractors, and key projects.</p>
                      <Button size="sm" onClick={() => setWorkModal({ open: true })} leftIcon={<Plus className="w-4 h-4" />}>
                        Add Experience
                      </Button>
                    </div>

                    {workHistory.length === 0 ? (
                      <div className="bg-white border border-dashed border-gray-300 rounded-xl p-12 text-center">
                        <Briefcase className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                        <p className="text-sm font-semibold text-dark-700 mb-1">No work history yet</p>
                        <p className="text-xs text-dark-400 mb-4">Show posters where you've worked and what you've built.</p>
                        <Button size="sm" onClick={() => setWorkModal({ open: true })} leftIcon={<Plus className="w-4 h-4" />}>
                          Add First Experience
                        </Button>
                      </div>
                    ) : (
                      <>
                        <div className="bg-white rounded-xl border border-gray-200 divide-y divide-gray-100">
                          {workHistory.map((w) => (
                            <div key={w.id} className="flex gap-4 p-4 group">
                              <div className="w-10 h-10 rounded-xl bg-dark-50 flex items-center justify-center flex-shrink-0 mt-0.5">
                                <Building className="w-5 h-5 text-dark-400" />
                              </div>
                              <div className="flex-1 min-w-0">
                                <div className="flex items-start justify-between gap-2">
                                  <div>
                                    <p className="text-sm font-semibold text-dark-900">{w.role}</p>
                                    <p className="text-sm text-dark-600">{w.company}</p>
                                    <p className="text-xs text-dark-400 mt-0.5">
                                      {w.startYear} – {w.current ? <span className="text-green-600 font-medium">Present</span> : (w.endYear ?? '?')}
                                      {w.location ? ` · ${w.location}` : ''}
                                      {!w.current && w.endYear ? ` · ${w.endYear - w.startYear} yr${w.endYear - w.startYear !== 1 ? 's' : ''}` : ''}
                                    </p>
                                  </div>
                                  <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0">
                                    <button onClick={() => setWorkModal({ open: true, item: w })} className="p-1.5 rounded-lg text-dark-400 hover:text-brand-600 hover:bg-brand-50 transition-colors"><Edit2 className="w-3.5 h-3.5" /></button>
                                    <button onClick={() => { const updated = workHistory.filter(x => x.id !== w.id); setWorkHistory(updated); doSave({ workHistory: updated }, setSavingWork, 'Work history'); }} className="p-1.5 rounded-lg text-dark-400 hover:text-red-600 hover:bg-red-50 transition-colors"><Trash2 className="w-3.5 h-3.5" /></button>
                                  </div>
                                </div>
                                {w.description && <p className="text-xs text-dark-500 mt-1.5 leading-relaxed">{w.description}</p>}
                              </div>
                            </div>
                          ))}
                        </div>
                        <div className="flex justify-end">
                          <Button onClick={saveWork} loading={savingWork} leftIcon={<CheckCircle className="w-4 h-4" />}>
                            Save Work History
                          </Button>
                        </div>
                      </>
                    )}
                  </div>
                </TabPanel>
              )}

              {/* ── Reviews ──────────────────────────────────────────────────── */}
              <TabPanel value="reviews">
                {reviews.length === 0 ? (
                  <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
                    <Star className="w-10 h-10 text-gray-300 mx-auto mb-2" />
                    <p className="text-sm text-dark-500">No reviews yet. Complete jobs to earn your first review.</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {reviews.map(r => (
                      <div key={r.id} className="bg-white rounded-xl border border-gray-200 p-5">
                        <div className="flex items-start justify-between gap-3 mb-3">
                          <div className="flex items-center gap-3">
                            <Avatar firstName={r.reviewer?.firstName} lastName={r.reviewer?.lastName} src={r.reviewer?.profileImage} size="sm" />
                            <div>
                              <p className="text-sm font-semibold text-dark-900">{r.reviewer?.firstName} {r.reviewer?.lastName}</p>
                              <p className="text-xs text-dark-400">{timeAgo(r.createdAt)}</p>
                            </div>
                          </div>
                          <StarRating rating={r.rating} size="sm" />
                        </div>
                        {r.comment && <p className="text-sm text-dark-600 leading-relaxed">{r.comment}</p>}
                      </div>
                    ))}
                  </div>
                )}
              </TabPanel>

              {/* ── Verification ─────────────────────────────────────────────── */}
              {isContractor && (
                <TabPanel value="verification">
                  <div className="space-y-4">
                    {/* Header */}
                    <SectionCard title="Contractor Verification">
                      <p className="text-sm text-dark-500 mb-4">
                        Upload your documents to get a Verified badge visible on your public profile.
                        Documents are reviewed within 1–3 business days.
                      </p>

                      {/* Current status badge */}
                      <div className="flex items-center gap-2 mb-5">
                        <span className="text-sm font-medium text-dark-700">Verification Status:</span>
                        {user?.verificationStatus === 'verified' && (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-700 border border-green-200">
                            <CheckCircle className="w-3.5 h-3.5" /> Verified
                          </span>
                        )}
                        {user?.verificationStatus === 'pending' && (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-yellow-100 text-yellow-700 border border-yellow-200">
                            <Clock className="w-3.5 h-3.5" /> Pending Review
                          </span>
                        )}
                        {user?.verificationStatus === 'rejected' && (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-red-100 text-red-700 border border-red-200">
                            <X className="w-3.5 h-3.5" /> Rejected
                          </span>
                        )}
                        {(!user?.verificationStatus || user?.verificationStatus === 'none') && (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-gray-100 text-gray-600 border border-gray-200">
                            Not Submitted
                          </span>
                        )}
                      </div>

                      {/* Verified banner */}
                      {user?.verificationStatus === 'verified' && (
                        <div className="mb-5 p-4 bg-green-50 border border-green-200 rounded-xl flex items-center gap-3">
                          <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" />
                          <p className="text-sm font-semibold text-green-800">
                            Your profile is Verified ✓ — clients can see your badge on your public profile.
                          </p>
                        </div>
                      )}

                      {/* Document upload sections */}
                      <div className="space-y-4">

                        {/* Government ID */}
                        <div className="border border-gray-200 rounded-xl p-4">
                          <div className="flex items-start justify-between gap-3">
                            <div>
                              <p className="text-sm font-semibold text-dark-900">Government ID / Passport</p>
                              <p className="text-xs text-dark-400 mt-0.5">Upload a clear photo of your national ID or passport.</p>
                            </div>
                            {user?.idDocUrl ? (
                              <a href={user.idDocUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-xs text-brand-600 hover:underline flex-shrink-0">
                                <CheckCircle className="w-3.5 h-3.5 text-green-500" /> View
                              </a>
                            ) : (
                              <span className="text-xs text-dark-400">—</span>
                            )}
                          </div>
                          <div className="mt-3">
                            {uploadingIdDoc ? (
                              <p className="text-xs text-dark-400 animate-pulse">Uploading…</p>
                            ) : (
                              <Button
                                size="xs"
                                variant="outline"
                                leftIcon={<Plus className="w-3.5 h-3.5" />}
                                onClick={() => idDocRef.current?.click()}
                              >
                                {user?.idDocUrl ? 'Replace' : 'Upload'} ID
                              </Button>
                            )}
                            <input
                              ref={idDocRef}
                              type="file"
                              accept="image/*,.pdf"
                              className="hidden"
                              onChange={async (e) => {
                                const file = e.target.files?.[0];
                                if (!file) return;
                                setUploadingIdDoc(true);
                                try {
                                  const res = await uploadApi.single(file);
                                  await doSave({ idDocUrl: res.data.data.url }, () => {}, 'ID Document');
                                } catch { toast.error('Upload failed', 'Please try again.'); }
                                finally { setUploadingIdDoc(false); e.target.value = ''; }
                              }}
                            />
                          </div>
                        </div>

                        {/* Trade License */}
                        <div className="border border-gray-200 rounded-xl p-4">
                          <div className="flex items-start justify-between gap-3">
                            <div>
                              <p className="text-sm font-semibold text-dark-900">Trade License / Contractor License</p>
                              <p className="text-xs text-dark-400 mt-0.5">Upload your trade or contractor license document.</p>
                            </div>
                            {user?.tradeLicenseUrl ? (
                              <a href={user.tradeLicenseUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-xs text-brand-600 hover:underline flex-shrink-0">
                                <CheckCircle className="w-3.5 h-3.5 text-green-500" /> View
                              </a>
                            ) : (
                              <span className="text-xs text-dark-400">—</span>
                            )}
                          </div>
                          <div className="mt-3">
                            {uploadingTradeLicense ? (
                              <p className="text-xs text-dark-400 animate-pulse">Uploading…</p>
                            ) : (
                              <Button
                                size="xs"
                                variant="outline"
                                leftIcon={<Plus className="w-3.5 h-3.5" />}
                                onClick={() => tradeLicenseRef.current?.click()}
                              >
                                {user?.tradeLicenseUrl ? 'Replace' : 'Upload'} License
                              </Button>
                            )}
                            <input
                              ref={tradeLicenseRef}
                              type="file"
                              accept="image/*,.pdf"
                              className="hidden"
                              onChange={async (e) => {
                                const file = e.target.files?.[0];
                                if (!file) return;
                                setUploadingTradeLicense(true);
                                try {
                                  const res = await uploadApi.single(file);
                                  await doSave({ tradeLicenseUrl: res.data.data.url }, () => {}, 'Trade License');
                                } catch { toast.error('Upload failed', 'Please try again.'); }
                                finally { setUploadingTradeLicense(false); e.target.value = ''; }
                              }}
                            />
                          </div>
                        </div>

                        {/* Insurance Certificate */}
                        <div className="border border-gray-200 rounded-xl p-4">
                          <div className="flex items-start justify-between gap-3">
                            <div>
                              <p className="text-sm font-semibold text-dark-900">Insurance Certificate</p>
                              <p className="text-xs text-dark-400 mt-0.5">Upload proof of your liability or contractor insurance.</p>
                            </div>
                            {user?.insuranceCertUrl ? (
                              <a href={user.insuranceCertUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-xs text-brand-600 hover:underline flex-shrink-0">
                                <CheckCircle className="w-3.5 h-3.5 text-green-500" /> View
                              </a>
                            ) : (
                              <span className="text-xs text-dark-400">—</span>
                            )}
                          </div>
                          <div className="mt-3">
                            {uploadingInsurance ? (
                              <p className="text-xs text-dark-400 animate-pulse">Uploading…</p>
                            ) : (
                              <Button
                                size="xs"
                                variant="outline"
                                leftIcon={<Plus className="w-3.5 h-3.5" />}
                                onClick={() => insuranceRef.current?.click()}
                              >
                                {user?.insuranceCertUrl ? 'Replace' : 'Upload'} Insurance
                              </Button>
                            )}
                            <input
                              ref={insuranceRef}
                              type="file"
                              accept="image/*,.pdf"
                              className="hidden"
                              onChange={async (e) => {
                                const file = e.target.files?.[0];
                                if (!file) return;
                                setUploadingInsurance(true);
                                try {
                                  const res = await uploadApi.single(file);
                                  await doSave({ insuranceCertUrl: res.data.data.url }, () => {}, 'Insurance Certificate');
                                } catch { toast.error('Upload failed', 'Please try again.'); }
                                finally { setUploadingInsurance(false); e.target.value = ''; }
                              }}
                            />
                          </div>
                        </div>
                      </div>

                      {/* Submit for verification button */}
                      {user?.idDocUrl && user?.tradeLicenseUrl && user?.insuranceCertUrl && user?.verificationStatus !== 'verified' && user?.verificationStatus !== 'pending' && (
                        <div className="mt-5 pt-4 border-t border-gray-100">
                          <p className="text-xs text-dark-500 mb-3">All 3 documents uploaded. Submit for admin review.</p>
                          <Button
                            leftIcon={<Shield className="w-4 h-4" />}
                            onClick={() => doSave({ verificationStatus: 'pending' }, () => {}, 'Verification')}
                          >
                            Submit for Verification
                          </Button>
                        </div>
                      )}
                    </SectionCard>
                  </div>
                </TabPanel>
              )}

            </div>
          </Tabs>
        </div>
      </div>

      {/* ── Modals ────────────────────────────────────────────────────────────── */}
      <PortfolioModal
        open={portfolioModal.open}
        item={portfolioModal.item}
        onClose={() => setPortfolioModal({ open: false })}
        onSave={item => {
          const updated = portfolioModal.item
            ? portfolio.map(x => x.id === item.id ? item : x)
            : [...portfolio, item];
          setPortfolio(updated);
          setPortfolioModal({ open: false });
          doSave({ portfolio: updated }, setSavingPortfolio, 'Portfolio');
        }}
      />
      <CertModal
        open={certModal.open}
        item={certModal.item}
        onClose={() => setCertModal({ open: false })}
        onSave={item => {
          const updated = certModal.item
            ? certifications.map(x => x.id === item.id ? item : x)
            : [...certifications, item];
          setCerts(updated);
          setCertModal({ open: false });
          doSave({ certifications: updated }, setSavingCerts, 'Certifications');
        }}
      />
      <WorkModal
        open={workModal.open}
        item={workModal.item}
        onClose={() => setWorkModal({ open: false })}
        onSave={item => {
          const updated = workModal.item
            ? workHistory.map(x => x.id === item.id ? item : x)
            : [...workHistory, item];
          setWorkHistory(updated);
          setWorkModal({ open: false });
          doSave({ workHistory: updated }, setSavingWork, 'Work history');
        }}
      />
    </div>
  );
}
