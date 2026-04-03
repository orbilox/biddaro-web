'use client';
import React, { useEffect, useState, useCallback } from 'react';
import Link from 'next/link';
import {
  Hammer, Plus, Loader2, Package, Trash2, ChevronDown, ChevronRight,
  CheckSquare, Square, Image as ImageIcon, X, Trophy, Target, Upload,
  Building2, Zap, Shield, Layers, Droplets,
  Wind, Paintbrush, Map, BarChart3, FileText, RefreshCw, CheckCircle2,
  PanelLeftClose, PanelLeftOpen, ShoppingCart, Truck, PackageCheck,
  DollarSign, Pencil, AlertCircle, Boxes,
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Card } from '@/components/ui/Card';
import { Modal, ConfirmModal } from '@/components/ui/Modal';
import { Tabs, TabList, Tab, TabPanel } from '@/components/ui/Tabs';
import { buildPlannerApi, addonsApi, uploadApi } from '@/lib/api';
import { useAuthStore } from '@/store/authStore';
import { toast } from '@/store/uiStore';
import { cn } from '@/lib/utils';
import { ROUTES } from '@/lib/constants';

// ─── Types ────────────────────────────────────────────────────────────────────

interface BuildPlan {
  id: string;
  title: string;
  description?: string;
  buildType: string;
  address?: string;
  totalBudget?: number;
  currency: string;
  emoji: string;
  color: string;
  status: string;
  createdAt: string;
  sections?: BuildSection[];
  media?: BuildMedia[];
  stats?: PlanStats;
  achievements?: Achievement[];
}

interface BuildSection {
  id: string;
  type: string;
  title: string;
  notes?: string;
  order: number;
  checkItems: CheckItem[];
  media?: BuildMedia[];
}

interface CheckItem {
  id: string;
  label: string;
  isChecked: boolean;
  order: number;
}

interface BuildMedia {
  id: string;
  name: string;
  url: string;
  mediaType: string;
  caption?: string;
  sectionId?: string;
  addedAt: string;
}

interface PlanStats {
  totalSections: number;
  totalItems: number;
  checkedItems: number;
  overallPercent: number;
  fullyCompletedSectionCount: number;
  completedSectionTypes: string[];
  totalMedia: number;
}

interface Achievement {
  slug: string;
  emoji: string;
  title: string;
  description: string;
  unlocked: boolean;
}

type MaterialStatus = 'pending' | 'ordered' | 'delivered' | 'installed';
type MaterialCategory = 'concrete' | 'steel' | 'wood' | 'electrical' | 'plumbing' | 'roofing' | 'finishing' | 'other';

interface BuildMaterial {
  id: string;
  planId: string;
  name: string;
  category: MaterialCategory;
  quantity: number;
  unit: string;
  estimatedCost?: number;
  actualCost?: number;
  status: MaterialStatus;
  supplier?: string;
  notes?: string;
  order: number;
  createdAt: string;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

const SECTION_TYPE_META: Record<string, { icon: React.ElementType; label: string; color: string }> = {
  site_map:   { icon: Map,        label: 'Site Map',        color: 'text-blue-400' },
  exterior:   { icon: Building2,  label: 'Exterior',        color: 'text-amber-400' },
  interior:   { icon: Layers,     label: 'Interior',        color: 'text-purple-400' },
  plumbing:   { icon: Droplets,   label: 'Plumbing',        color: 'text-cyan-400' },
  electrical: { icon: Zap,        label: 'Electrical',      color: 'text-yellow-400' },
  structural: { icon: Shield,     label: 'Structural',      color: 'text-red-400' },
  hvac:       { icon: Wind,       label: 'HVAC',            color: 'text-teal-400' },
  finishes:   { icon: Paintbrush, label: 'Finishes',        color: 'text-pink-400' },
  other:      { icon: Layers,     label: 'Other',           color: 'text-gray-400' },
};

const SECTION_TYPES = Object.entries(SECTION_TYPE_META).map(([value, meta]) => ({
  value,
  ...meta,
}));

const BUILD_TYPES = [
  { value: 'residential', label: 'Residential' },
  { value: 'commercial',  label: 'Commercial'  },
  { value: 'renovation',  label: 'Renovation'  },
  { value: 'industrial',  label: 'Industrial'  },
];

const MATERIAL_CATEGORIES: { value: MaterialCategory; label: string; color: string; bg: string }[] = [
  { value: 'concrete',   label: 'Concrete & Masonry', color: 'text-stone-600',  bg: 'bg-stone-100'  },
  { value: 'steel',      label: 'Steel & Metal',       color: 'text-slate-600',  bg: 'bg-slate-100'  },
  { value: 'wood',       label: 'Wood & Timber',       color: 'text-amber-700',  bg: 'bg-amber-50'   },
  { value: 'electrical', label: 'Electrical',          color: 'text-yellow-600', bg: 'bg-yellow-50'  },
  { value: 'plumbing',   label: 'Plumbing',            color: 'text-cyan-600',   bg: 'bg-cyan-50'    },
  { value: 'roofing',    label: 'Roofing',             color: 'text-blue-600',   bg: 'bg-blue-50'    },
  { value: 'finishing',  label: 'Finishing',           color: 'text-pink-600',   bg: 'bg-pink-50'    },
  { value: 'other',      label: 'Other',               color: 'text-gray-600',   bg: 'bg-gray-100'   },
];

const MATERIAL_UNITS = ['pcs', 'bags', 'm²', 'm³', 'kg', 'tons', 'L', 'm', 'rolls', 'sheets'];

const MATERIAL_STATUS_META: Record<MaterialStatus, { label: string; icon: React.ElementType; color: string; bg: string }> = {
  pending:   { label: 'Pending',   icon: AlertCircle,   color: 'text-gray-500',  bg: 'bg-gray-100'   },
  ordered:   { label: 'Ordered',   icon: ShoppingCart,  color: 'text-blue-600',  bg: 'bg-blue-50'    },
  delivered: { label: 'Delivered', icon: Truck,         color: 'text-amber-600', bg: 'bg-amber-50'   },
  installed: { label: 'Installed', icon: PackageCheck,  color: 'text-green-600', bg: 'bg-green-50'   },
};

function ProgressRing({ percent, size = 96 }: { percent: number; size?: number }) {
  const r = size / 2 - 8;
  const circ = 2 * Math.PI * r;
  const offset = circ - (percent / 100) * circ;
  return (
    <svg width={size} height={size} className="-rotate-90">
      <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="#374151" strokeWidth="8" />
      <circle
        cx={size / 2} cy={size / 2} r={r} fill="none"
        stroke="#f59e0b" strokeWidth="8"
        strokeDasharray={circ} strokeDashoffset={offset}
        strokeLinecap="round"
        style={{ transition: 'stroke-dashoffset 0.5s ease' }}
      />
      <text
        x={size / 2} y={size / 2}
        textAnchor="middle" dominantBaseline="middle"
        fill="white" fontSize={size * 0.18} fontWeight="bold"
        style={{ transform: `rotate(90deg)`, transformOrigin: `${size / 2}px ${size / 2}px` }}
      >
        {percent}%
      </text>
    </svg>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function BuildPlannerPage() {
  const { user } = useAuthStore();
  const [hasAddon, setHasAddon] = useState<boolean | null>(null);
  const [plans, setPlans]       = useState<BuildPlan[]>([]);
  const [selectedPlan, setSelectedPlan] = useState<BuildPlan | null>(null);
  const [loading, setLoading]   = useState(true);
  const [activeTab, setActiveTab] = useState('blueprint');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  // Modals
  const [createPlanOpen, setCreatePlanOpen] = useState(false);
  const [deletePlanId, setDeletePlanId]     = useState<string | null>(null);
  const [addSectionOpen, setAddSectionOpen] = useState(false);
  const [addMediaOpen, setAddMediaOpen]     = useState(false);
  const [mediaSectionId, setMediaSectionId] = useState<string | null>(null);
  const [editPlanOpen, setEditPlanOpen]     = useState(false);

  // Forms
  const [planForm, setPlanForm] = useState({ title: '', description: '', buildType: 'residential', address: '', totalBudget: '', emoji: '🏗️' });
  const [sectionForm, setSectionForm] = useState({ type: 'site_map', notes: '' });
  const [mediaForm, setMediaForm] = useState({ caption: '' });
  const [mediaFile, setMediaFile] = useState<File | null>(null);
  const [mediaUploading, setMediaUploading] = useState(false);
  const [saving, setSaving] = useState(false);

  // Materials
  const [materials, setMaterials] = useState<BuildMaterial[]>([]);
  const [materialsLoading, setMaterialsLoading] = useState(false);
  const [addMaterialOpen, setAddMaterialOpen] = useState(false);
  const [editMaterial, setEditMaterial] = useState<BuildMaterial | null>(null);
  const [deleteMaterialId, setDeleteMaterialId] = useState<string | null>(null);
  const emptyMaterialForm = { name: '', category: 'concrete' as MaterialCategory, quantity: '', unit: 'pcs', estimatedCost: '', actualCost: '', status: 'pending' as MaterialStatus, supplier: '', notes: '' };
  const [materialForm, setMaterialForm] = useState(emptyMaterialForm);

  // ── Addon check ────────────────────────────────────────────────────────────
  useEffect(() => {
    addonsApi.check('construction-planner')
      .then(r => setHasAddon(r.data?.data?.isInstalled === true))
      .catch(() => setHasAddon(false));
  }, []);

  // ── Load plans ─────────────────────────────────────────────────────────────
  const loadPlans = useCallback(async () => {
    setLoading(true);
    try {
      const r = await buildPlannerApi.listPlans();
      const list: BuildPlan[] = Array.isArray(r.data?.data) ? r.data.data : [];
      setPlans(list);
      if (list.length > 0 && !selectedPlan) {
        await loadPlan(list[0].id);
      } else if (selectedPlan) {
        await loadPlan(selectedPlan.id);
      }
    } catch {
      toast.error('Failed to load plans');
    } finally {
      setLoading(false);
    }
  }, [selectedPlan]);

  const loadPlan = async (id: string) => {
    try {
      const r = await buildPlannerApi.getPlan(id);
      setSelectedPlan(r.data?.data ?? r.data ?? null);
      loadMaterials(id);
    } catch {
      toast.error('Failed to load plan');
    }
  };

  useEffect(() => { if (hasAddon) loadPlans(); }, [hasAddon]);

  // ── Create plan ────────────────────────────────────────────────────────────
  const handleCreatePlan = async () => {
    if (!planForm.title.trim()) return;
    setSaving(true);
    try {
      await buildPlannerApi.createPlan({
        title: planForm.title.trim(),
        description: planForm.description.trim() || undefined,
        buildType: planForm.buildType,
        address: planForm.address.trim() || undefined,
        totalBudget: planForm.totalBudget ? parseFloat(planForm.totalBudget) : undefined,
        emoji: planForm.emoji,
      });
      toast.success('Build plan created!');
      setCreatePlanOpen(false);
      setPlanForm({ title: '', description: '', buildType: 'residential', address: '', totalBudget: '', emoji: '🏗️' });
      await loadPlans();
    } catch { toast.error('Failed to create plan'); }
    finally { setSaving(false); }
  };

  // ── Delete plan ────────────────────────────────────────────────────────────
  const handleDeletePlan = async () => {
    if (!deletePlanId) return;
    setSaving(true);
    try {
      await buildPlannerApi.deletePlan(deletePlanId);
      toast.success('Plan deleted');
      setDeletePlanId(null);
      if (selectedPlan?.id === deletePlanId) setSelectedPlan(null);
      await loadPlans();
    } catch { toast.error('Failed to delete plan'); }
    finally { setSaving(false); }
  };

  // ── Add section ────────────────────────────────────────────────────────────
  const handleAddSection = async () => {
    if (!selectedPlan) return;
    setSaving(true);
    try {
      const sectionMeta = SECTION_TYPE_META[sectionForm.type] ?? SECTION_TYPE_META.other;
      await buildPlannerApi.addSection(selectedPlan.id, {
        type: sectionForm.type,
        title: sectionMeta.label,
        notes: sectionForm.notes.trim() || undefined,
      });
      toast.success('Section added with checklist!');
      setAddSectionOpen(false);
      setSectionForm({ type: 'site_map', notes: '' });
      await loadPlan(selectedPlan.id);
    } catch { toast.error('Failed to add section'); }
    finally { setSaving(false); }
  };

  // ── Toggle check item ──────────────────────────────────────────────────────
  const handleToggleItem = async (itemId: string) => {
    if (!selectedPlan) return;
    try {
      await buildPlannerApi.toggleItem(itemId);
      await loadPlan(selectedPlan.id);
    } catch { toast.error('Failed to update item'); }
  };

  // ── Add media ──────────────────────────────────────────────────────────────
  const handleAddMedia = async () => {
    if (!selectedPlan || !mediaFile) return;
    setMediaUploading(true);
    try {
      // 1. Upload file
      const uploadRes = await uploadApi.single(mediaFile);
      const uploaded = uploadRes.data?.data;
      const fileUrl: string = (uploaded as any)?.url ?? '';
      const isImage = mediaFile.type.startsWith('image/');
      const mediaType = isImage ? 'image'
        : mediaFile.type === 'application/pdf' ? 'blueprint'
        : 'document';

      // 2. Save media record
      await buildPlannerApi.addMedia(selectedPlan.id, {
        name: mediaFile.name,
        url: fileUrl,
        caption: mediaForm.caption.trim() || undefined,
        mediaType,
        ...(mediaSectionId && { sectionId: mediaSectionId }),
      });
      toast.success('File uploaded!');
      setAddMediaOpen(false);
      setMediaSectionId(null);
      setMediaFile(null);
      setMediaForm({ caption: '' });
      await loadPlan(selectedPlan.id);
    } catch { toast.error('Failed to upload file'); }
    finally { setMediaUploading(false); }
  };

  const openMediaForSection = (sectionId: string) => {
    setMediaSectionId(sectionId);
    setMediaFile(null);
    setMediaForm({ caption: '' });
    setAddMediaOpen(true);
  };

  // ── Delete section ─────────────────────────────────────────────────────────
  const handleDeleteSection = async (sectionId: string) => {
    if (!selectedPlan) return;
    try {
      await buildPlannerApi.deleteSection(sectionId);
      await loadPlan(selectedPlan.id);
      toast.success('Section removed');
    } catch { toast.error('Failed to remove section'); }
  };

  // ── Delete media ───────────────────────────────────────────────────────────
  const handleDeleteMedia = async (mediaId: string) => {
    if (!selectedPlan) return;
    try {
      await buildPlannerApi.deleteMedia(mediaId);
      await loadPlan(selectedPlan.id);
      toast.success('Media removed');
    } catch { toast.error('Failed to remove media'); }
  };

  // ── Materials ──────────────────────────────────────────────────────────────
  const loadMaterials = useCallback(async (planId: string) => {
    setMaterialsLoading(true);
    try {
      const r = await buildPlannerApi.listMaterials(planId);
      setMaterials(Array.isArray(r.data?.data) ? r.data.data : []);
    } catch { /* silent */ }
    finally { setMaterialsLoading(false); }
  }, []);

  const handleSaveMaterial = async () => {
    if (!selectedPlan || !materialForm.name.trim() || !materialForm.quantity) return;
    setSaving(true);
    try {
      const payload = {
        name: materialForm.name.trim(),
        category: materialForm.category,
        quantity: parseFloat(materialForm.quantity),
        unit: materialForm.unit,
        estimatedCost: materialForm.estimatedCost ? parseFloat(materialForm.estimatedCost) : undefined,
        actualCost: materialForm.actualCost ? parseFloat(materialForm.actualCost) : undefined,
        status: materialForm.status,
        supplier: materialForm.supplier.trim() || undefined,
        notes: materialForm.notes.trim() || undefined,
      };
      if (editMaterial) {
        await buildPlannerApi.updateMaterial(editMaterial.id, payload);
        toast.success('Material updated');
      } else {
        await buildPlannerApi.addMaterial(selectedPlan.id, payload);
        toast.success('Material added');
      }
      setAddMaterialOpen(false);
      setEditMaterial(null);
      setMaterialForm(emptyMaterialForm);
      await loadMaterials(selectedPlan.id);
    } catch { toast.error('Failed to save material'); }
    finally { setSaving(false); }
  };

  const handleDeleteMaterial = async () => {
    if (!deleteMaterialId || !selectedPlan) return;
    try {
      await buildPlannerApi.deleteMaterial(deleteMaterialId);
      setDeleteMaterialId(null);
      toast.success('Material removed');
      await loadMaterials(selectedPlan.id);
    } catch { toast.error('Failed to remove material'); }
  };

  const openEditMaterial = (m: BuildMaterial) => {
    setEditMaterial(m);
    setMaterialForm({
      name: m.name, category: m.category, quantity: String(m.quantity), unit: m.unit,
      estimatedCost: m.estimatedCost != null ? String(m.estimatedCost) : '',
      actualCost: m.actualCost != null ? String(m.actualCost) : '',
      status: m.status, supplier: m.supplier ?? '', notes: m.notes ?? '',
    });
    setAddMaterialOpen(true);
  };

  const handleStatusCycle = async (m: BuildMaterial) => {
    const order: MaterialStatus[] = ['pending', 'ordered', 'delivered', 'installed'];
    const next = order[(order.indexOf(m.status) + 1) % order.length];
    try {
      await buildPlannerApi.updateMaterial(m.id, { status: next });
      if (selectedPlan) await loadMaterials(selectedPlan.id);
    } catch { toast.error('Failed to update status'); }
  };

  // ─────────────────────────────────────────────────────────────────────────────
  // Not installed guard
  // ─────────────────────────────────────────────────────────────────────────────
  if (hasAddon === null) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-6 h-6 animate-spin text-brand-500" />
      </div>
    );
  }

  if (hasAddon === false) {
    return (
      <div className="flex flex-col items-center justify-center h-full min-h-[60vh] gap-6 text-center px-4">
        <div className="text-6xl">🏗️</div>
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Construction Planner</h2>
          <p className="text-gray-500 max-w-md">
            Plan every detail of your construction project — site mapping, interior, exterior, plumbing, electrical, structural, and more. Earn achievement badges as you complete each phase.
          </p>
        </div>
        <div className="flex flex-col items-center gap-2">
          <div className="text-2xl font-bold text-gray-900">$9.99<span className="text-base font-normal text-gray-500">/mo</span></div>
          <Link href={ROUTES.ADDONS}>
            <Button variant="primary" size="lg">
              <Package className="w-4 h-4 mr-2" />
              Get Construction Planner
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  const stats = selectedPlan?.stats;
  const achievements = selectedPlan?.achievements ?? [];
  const sections = selectedPlan?.sections ?? [];
  const media = selectedPlan?.media ?? [];

  return (
    <div className="flex flex-col lg:flex-row lg:h-screen lg:overflow-hidden">

      {/* ── Left Sidebar: Plan List — desktop only ──────────────────────── */}
      <div className={cn(
        'max-lg:hidden lg:flex flex-col border-r-2 border-r-amber-500/20 border-l-2 border-l-amber-500/30 bg-[#0e1621] flex-shrink-0 transition-all duration-300 relative shadow-[inset_-1px_0_0_rgba(245,158,11,0.1)]',
        sidebarCollapsed ? 'w-12' : 'w-60'
      )}>
        {/* Collapse toggle button */}
        <button
          onClick={() => setSidebarCollapsed(v => !v)}
          className="absolute -right-3.5 top-5 z-10 w-7 h-7 rounded-full bg-[#0e1621] border border-amber-500/30 flex items-center justify-center text-amber-500/60 hover:text-amber-400 hover:border-amber-400 transition-colors shadow-md"
          title={sidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {sidebarCollapsed
            ? <PanelLeftOpen className="w-3.5 h-3.5" />
            : <PanelLeftClose className="w-3.5 h-3.5" />
          }
        </button>

        {sidebarCollapsed ? (
          /* ── Collapsed: icon strip ──────────────────────────────── */
          <div className="flex flex-col items-center pt-4 gap-3">
            <div className="w-8 h-8 rounded-lg bg-amber-500/10 flex items-center justify-center">
              <Hammer className="w-4 h-4 text-amber-400" />
            </div>
            <div className="w-6 h-px bg-amber-500/20 my-1" />
            {plans.map(plan => (
              <button
                key={plan.id}
                onClick={() => loadPlan(plan.id)}
                title={plan.title}
                className={cn(
                  'w-8 h-8 rounded-lg flex items-center justify-center text-base transition-colors',
                  selectedPlan?.id === plan.id
                    ? 'bg-amber-500/20 ring-1 ring-amber-500/40'
                    : 'hover:bg-white/5'
                )}
              >
                {plan.emoji}
              </button>
            ))}
            <button
              onClick={() => setCreatePlanOpen(true)}
              title="New Build Plan"
              className="w-8 h-8 rounded-lg flex items-center justify-center text-amber-500/40 hover:text-amber-400 hover:bg-amber-500/10 transition-colors"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>
        ) : (
          /* ── Expanded: full plan list ───────────────────────────── */
          <>
            {/* Amber header strip */}
            <div className="px-4 py-3.5 border-b border-amber-500/15 flex items-center justify-between bg-amber-500/5">
              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-lg bg-amber-500/15 flex items-center justify-center">
                  <Hammer className="w-3.5 h-3.5 text-amber-400" />
                </div>
                <span className="font-semibold text-amber-100 text-sm tracking-wide">Build Plans</span>
              </div>
              <button
                onClick={() => setCreatePlanOpen(true)}
                className="w-6 h-6 rounded-md bg-amber-500/10 hover:bg-amber-500/25 flex items-center justify-center text-amber-400 transition-colors"
              >
                <Plus className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-2 space-y-1">
              {loading && plans.length === 0 && (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="w-5 h-5 animate-spin text-dark-400" />
                </div>
              )}
              {!loading && plans.length === 0 && (
                <div className="text-center py-8 px-3">
                  <div className="text-3xl mb-2">🏗️</div>
                  <p className="text-dark-400 text-xs">No plans yet</p>
                  <Button variant="ghost" size="sm" onClick={() => setCreatePlanOpen(true)} className="mt-2 text-amber-400 text-xs">
                    + New Plan
                  </Button>
                </div>
              )}
              {plans.map(plan => (
                <button
                  key={plan.id}
                  onClick={() => loadPlan(plan.id)}
                  className={cn(
                    'w-full text-left px-3 py-2.5 rounded-lg transition-all group',
                    selectedPlan?.id === plan.id
                      ? 'bg-amber-500/15 border border-amber-500/30 shadow-sm'
                      : 'hover:bg-white/5 border border-transparent'
                  )}
                >
                  <div className="flex items-center gap-2.5">
                    <span className="text-base leading-none">{plan.emoji}</span>
                    <div className="flex-1 min-w-0">
                      <div className={cn('text-sm font-medium truncate', selectedPlan?.id === plan.id ? 'text-amber-100' : 'text-gray-300')}>{plan.title}</div>
                      <div className="text-xs text-gray-500 capitalize mt-0.5">{plan.buildType}</div>
                    </div>
                    <button
                      onClick={e => { e.stopPropagation(); setDeletePlanId(plan.id); }}
                      className="opacity-0 group-hover:opacity-100 text-gray-600 hover:text-red-400 transition-opacity"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>
                </button>
              ))}
            </div>

            <div className="p-3 border-t border-amber-500/10">
              <button
                onClick={() => setCreatePlanOpen(true)}
                className="w-full flex items-center justify-center gap-1.5 py-2 rounded-lg text-xs font-medium text-amber-400/70 hover:text-amber-300 hover:bg-amber-500/10 border border-dashed border-amber-500/20 hover:border-amber-500/40 transition-all"
              >
                <Plus className="w-3.5 h-3.5" /> New Build Plan
              </button>
            </div>
          </>
        )}
      </div>

      {/* ── Mobile Plan Selector — shown only on small screens ─────────── */}
      <div className="lg:hidden bg-dark-900 border-b border-dark-700 px-4 pt-3 pb-2 flex-shrink-0">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <Hammer className="w-4 h-4 text-amber-400" />
            <span className="font-semibold text-white text-sm">Build Plans</span>
            {loading && <Loader2 className="w-3.5 h-3.5 animate-spin text-dark-400" />}
          </div>
          <Button variant="ghost" size="sm" onClick={() => setCreatePlanOpen(true)} className="p-1 text-amber-400">
            <Plus className="w-4 h-4" />
          </Button>
        </div>
        {plans.length === 0 && !loading ? (
          <button
            onClick={() => setCreatePlanOpen(true)}
            className="w-full py-2 text-xs text-dark-400 border border-dashed border-dark-600 rounded-lg hover:border-amber-500/50 hover:text-amber-400 transition-colors"
          >
            + Create your first build plan
          </button>
        ) : (
          <div className="flex gap-2 overflow-x-auto pb-1" style={{ scrollbarWidth: 'none' }}>
            {plans.map(plan => (
              <button
                key={plan.id}
                onClick={() => loadPlan(plan.id)}
                className={cn(
                  'flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs whitespace-nowrap flex-shrink-0 transition-all border font-medium',
                  selectedPlan?.id === plan.id
                    ? 'bg-amber-500/20 border-amber-500/50 text-amber-300'
                    : 'border-dark-600 text-dark-300 hover:bg-dark-700 hover:text-white'
                )}
              >
                <span>{plan.emoji}</span>
                <span>{plan.title}</span>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* ── Main Content ────────────────────────────────────────────────── */}
      {!selectedPlan ? (
        <div className="flex-1 flex items-center justify-center text-center py-16 px-6">
          <div>
            <div className="text-5xl mb-3">🏗️</div>
            <p className="text-gray-500 mb-4">Select or create a build plan to get started</p>
            <Button variant="primary" size="sm" onClick={() => setCreatePlanOpen(true)}>
              <Plus className="w-4 h-4 mr-1" /> New Build Plan
            </Button>
          </div>
        </div>
      ) : (
        <div className="flex-1 flex flex-col lg:overflow-hidden min-h-0">
          {/* Header */}
          <div className="px-4 lg:px-6 py-3 lg:py-4 border-b border-gray-200 bg-white flex-shrink-0">
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-2 lg:gap-3 min-w-0">
                <span className="text-xl lg:text-2xl flex-shrink-0">{selectedPlan.emoji}</span>
                <div className="min-w-0">
                  <h1 className="text-base lg:text-lg font-bold text-gray-900 truncate">{selectedPlan.title}</h1>
                  <p className="text-xs text-gray-500 capitalize hidden sm:block">
                    {selectedPlan.buildType}{selectedPlan.address ? ` · ${selectedPlan.address}` : ''}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-1.5 flex-shrink-0">
                <Button variant="ghost" size="sm" onClick={() => loadPlan(selectedPlan.id)} className="p-1.5 lg:p-2">
                  <RefreshCw className="w-4 h-4" />
                </Button>
                <Button variant="secondary" size="sm" onClick={() => setAddSectionOpen(true)} className="hidden sm:flex">
                  <Plus className="w-4 h-4 mr-1" /> Add Section
                </Button>
                <Button variant="secondary" size="sm" onClick={() => setAddSectionOpen(true)} className="flex sm:hidden p-1.5">
                  <Plus className="w-4 h-4" />
                </Button>
                <Button variant="secondary" size="sm" onClick={() => { setMediaSectionId(null); setAddMediaOpen(true); }} className="hidden sm:flex">
                  <Upload className="w-4 h-4 mr-1" /> Upload
                </Button>
                <Button variant="secondary" size="sm" onClick={() => { setMediaSectionId(null); setAddMediaOpen(true); }} className="flex sm:hidden p-1.5">
                  <Upload className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex-1 flex flex-col lg:overflow-hidden min-h-0">
            <Tabs defaultValue="blueprint" onChange={setActiveTab} className="h-full flex flex-col">
              <div className="border-b border-gray-200 overflow-x-auto flex-shrink-0" style={{ scrollbarWidth: 'none' }}>
                <div className="px-3 lg:px-6 min-w-max">
                  <TabList>
                    <Tab value="blueprint"><Trophy className="w-3.5 h-3.5 mr-1 lg:mr-1.5 inline" /><span className="hidden sm:inline">Blueprint</span><span className="sm:hidden">Plan</span></Tab>
                    <Tab value="sections"><CheckSquare className="w-3.5 h-3.5 mr-1 lg:mr-1.5 inline" />Sections</Tab>
                    <Tab value="materials"><Boxes className="w-3.5 h-3.5 mr-1 lg:mr-1.5 inline" />Materials</Tab>
                    <Tab value="media"><ImageIcon className="w-3.5 h-3.5 mr-1 lg:mr-1.5 inline" /><span className="hidden sm:inline">Media Board</span><span className="sm:hidden">Media</span></Tab>
                    <Tab value="report"><FileText className="w-3.5 h-3.5 mr-1 lg:mr-1.5 inline" />Report</Tab>
                  </TabList>
                </div>
              </div>

              <div className="flex-1 lg:overflow-y-auto overflow-visible p-3 sm:p-4 lg:p-6">
                {/* ── Blueprint Tab ───────────────────────────────────────── */}
                <TabPanel value="blueprint">
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-3 lg:gap-6">
                    {/* Progress ring + stats — side by side on mobile */}
                    <div className="col-span-1 flex flex-col sm:flex-row lg:flex-col gap-3 lg:gap-0">
                      <Card className="flex-1 sm:flex-none lg:flex-1 flex flex-row sm:flex-col items-center justify-center gap-3 sm:gap-4 py-4 sm:py-6 px-4 sm:px-6">
                        <ProgressRing percent={stats?.overallPercent ?? 0} size={80} />
                        <div className="text-center">
                          <div className="text-gray-900 font-semibold text-sm lg:text-base">Overall Progress</div>
                          <div className="text-gray-500 text-xs lg:text-sm">
                            {stats?.checkedItems ?? 0} / {stats?.totalItems ?? 0} items complete
                          </div>
                          <div className="text-gray-400 text-xs mt-0.5">
                            {stats?.fullyCompletedSectionCount ?? 0} / {stats?.totalSections ?? 0} sections done
                          </div>
                        </div>
                      </Card>
                    </div>

                    {/* Stats */}
                    <Card className="col-span-1 lg:col-span-2">
                      <div className="grid grid-cols-3 sm:grid-cols-3 gap-2 lg:gap-4">
                        {[
                          { label: 'Sections', value: stats?.totalSections ?? 0, icon: Layers },
                          { label: 'Tasks',    value: stats?.totalItems ?? 0,    icon: CheckSquare },
                          { label: 'Done',     value: stats?.checkedItems ?? 0,  icon: CheckCircle2 },
                          { label: 'Media',    value: stats?.totalMedia ?? 0,    icon: ImageIcon },
                          { label: 'Badges',   value: achievements.filter(a => a.unlocked).length, icon: Trophy },
                          { label: 'Budget',   value: selectedPlan.totalBudget ? `$${selectedPlan.totalBudget.toLocaleString()}` : '—', icon: Target },
                        ].map(s => (
                          <div key={s.label} className="flex flex-col sm:flex-row items-center sm:items-center gap-1 sm:gap-3 p-2 lg:p-3 bg-gray-50 border border-gray-200 rounded-lg text-center sm:text-left">
                            <s.icon className="w-4 h-4 text-amber-500 flex-shrink-0" />
                            <div>
                              <div className="text-gray-900 font-semibold text-sm">{s.value}</div>
                              <div className="text-gray-500 text-xs">{s.label}</div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </Card>

                    {/* Achievements */}
                    <Card className="col-span-1 lg:col-span-3 lg:col-start-1">
                      <div className="flex items-center gap-2 mb-4">
                        <Trophy className="w-5 h-5 text-amber-500" />
                        <h3 className="font-semibold text-gray-900">Achievement Badges</h3>
                        <Badge variant="warning" className="ml-auto text-xs">
                          {achievements.filter(a => a.unlocked).length} / {achievements.length} earned
                        </Badge>
                      </div>
                      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2 lg:gap-3">
                        {achievements.map(ach => (
                          <div
                            key={ach.slug}
                            className={cn(
                              'flex flex-col items-center text-center p-2.5 lg:p-3 rounded-xl border transition-all',
                              ach.unlocked
                                ? 'border-amber-400 bg-amber-50 shadow-sm'
                                : 'border-gray-200 bg-gray-50 opacity-50 grayscale'
                            )}
                          >
                            <span className="text-2xl lg:text-3xl mb-1">{ach.emoji}</span>
                            <div className="text-gray-900 text-xs font-semibold leading-tight">{ach.title}</div>
                            <div className="text-gray-500 text-xs mt-1 leading-tight hidden sm:block">{ach.description}</div>
                            {ach.unlocked && (
                              <Badge variant="warning" className="mt-1.5 text-xs">Earned!</Badge>
                            )}
                          </div>
                        ))}
                        {achievements.length === 0 && (
                          <div className="col-span-2 sm:col-span-3 lg:col-span-4 text-center text-gray-500 py-4">
                            Add sections and complete tasks to earn achievement badges
                          </div>
                        )}
                      </div>
                    </Card>

                    {/* Section progress bars */}
                    {sections.length > 0 && (
                      <Card className="col-span-1 lg:col-span-3 lg:col-start-1">
                        <div className="flex items-center gap-2 mb-4">
                          <BarChart3 className="w-5 h-5 text-amber-500" />
                          <h3 className="font-semibold text-gray-900">Section Progress</h3>
                        </div>
                        <div className="space-y-3">
                          {sections.map(sec => {
                            const total = sec.checkItems.length;
                            const done = sec.checkItems.filter(i => i.isChecked).length;
                            const pct = total > 0 ? Math.round((done / total) * 100) : 0;
                            const meta = SECTION_TYPE_META[sec.type] ?? SECTION_TYPE_META.other;
                            return (
                              <div key={sec.id}>
                                <div className="flex items-center justify-between mb-1">
                                  <div className="flex items-center gap-2">
                                    <meta.icon className={cn('w-3.5 h-3.5', meta.color)} />
                                    <span className="text-sm text-gray-800 font-medium">{sec.title}</span>
                                  </div>
                                  <span className="text-xs text-gray-500">{done}/{total}</span>
                                </div>
                                <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                                  <div
                                    className="h-full bg-amber-500 rounded-full transition-all duration-500"
                                    style={{ width: `${pct}%` }}
                                  />
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </Card>
                    )}
                  </div>
                </TabPanel>

                {/* ── Sections Tab ────────────────────────────────────────── */}
                <TabPanel value="sections">
                  {sections.length === 0 ? (
                    <div className="text-center py-12">
                      <div className="text-4xl mb-3">📋</div>
                      <p className="text-gray-500 mb-4">No planning sections yet</p>
                      <Button variant="primary" onClick={() => setAddSectionOpen(true)}>
                        <Plus className="w-4 h-4 mr-1" /> Add First Section
                      </Button>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {sections.map(section => (
                        <SectionCard
                          key={section.id}
                          section={section}
                          onToggle={handleToggleItem}
                          onDelete={handleDeleteSection}
                          onAddMedia={openMediaForSection}
                        />
                      ))}
                      <Button variant="secondary" onClick={() => setAddSectionOpen(true)} className="w-full">
                        <Plus className="w-4 h-4 mr-1" /> Add Section
                      </Button>
                    </div>
                  )}
                </TabPanel>

                {/* ── Materials Tab ───────────────────────────────────────── */}
                <TabPanel value="materials">
                  <MaterialsPanel
                    planId={selectedPlan.id}
                    materials={materials}
                    loading={materialsLoading}
                    currency={selectedPlan.currency}
                    onAdd={() => { setEditMaterial(null); setMaterialForm(emptyMaterialForm); setAddMaterialOpen(true); }}
                    onEdit={openEditMaterial}
                    onDelete={(id) => setDeleteMaterialId(id)}
                    onStatusCycle={handleStatusCycle}
                  />
                </TabPanel>

                {/* ── Media Board Tab ─────────────────────────────────────── */}
                <TabPanel value="media">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-semibold text-gray-900">{media.length} item{media.length !== 1 ? 's' : ''}</h3>
                    <Button variant="secondary" size="sm" onClick={() => { setMediaSectionId(null); setAddMediaOpen(true); }}>
                      <Upload className="w-4 h-4 mr-1" /> Add Media
                    </Button>
                  </div>
                  {media.length === 0 ? (
                    <div className="text-center py-12 border-2 border-dashed border-gray-300 rounded-xl">
                      <ImageIcon className="w-10 h-10 text-gray-400 mx-auto mb-3" />
                      <p className="text-gray-500 mb-2">No media uploaded yet</p>
                      <p className="text-gray-400 text-sm">Upload blueprints, site photos, inspiration images & more</p>
                      <Button variant="secondary" size="sm" onClick={() => { setMediaSectionId(null); setAddMediaOpen(true); }} className="mt-4">
                        <Upload className="w-4 h-4 mr-1" /> Upload First File
                      </Button>
                    </div>
                  ) : (
                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2 sm:gap-4">
                      {media.map(m => (
                        <div key={m.id} className="group relative rounded-xl overflow-hidden border border-gray-200 bg-gray-50">
                          {m.mediaType === 'image' ? (
                            <img
                              src={m.url}
                              alt={m.name}
                              className="w-full h-24 sm:h-36 object-cover"
                              onError={e => { (e.target as HTMLImageElement).src = 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100"><rect width="100" height="100" fill="%23f3f4f6"/><text x="50" y="50" text-anchor="middle" fill="%236b7280" font-size="12">No preview</text></svg>'; }}
                            />
                          ) : (
                            <div className="w-full h-24 sm:h-36 flex items-center justify-center bg-gray-100">
                              <FileText className="w-8 h-8 sm:w-10 sm:h-10 text-gray-400" />
                            </div>
                          )}
                          <div className="p-2">
                            <div className="text-xs text-gray-900 font-medium truncate">{m.name}</div>
                            {m.caption && <div className="text-xs text-gray-500 truncate">{m.caption}</div>}
                          </div>
                          <button
                            onClick={() => handleDeleteMedia(m.id)}
                            className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 bg-red-500 text-white rounded-full p-1 transition-opacity"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </TabPanel>

                {/* ── Report Tab ──────────────────────────────────────────── */}
                <TabPanel value="report">
                  <BlueprintReport plan={selectedPlan} sections={sections} stats={stats} achievements={achievements} />
                </TabPanel>
              </div>
            </Tabs>
          </div>
        </div>
      )}

      {/* ── Modals ────────────────────────────────────────────────────────── */}

      {/* Create Plan Modal */}
      <Modal
        open={createPlanOpen}
        onClose={() => setCreatePlanOpen(false)}
        title="New Build Plan"
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm text-gray-700 mb-1">Plan Name *</label>
            <input
              className="w-full bg-white border border-gray-300 rounded-lg px-3 py-2 text-gray-900 text-sm focus:outline-none focus:border-brand-500"
              placeholder="e.g. My Dream Home Build"
              value={planForm.title}
              onChange={e => setPlanForm(p => ({ ...p, title: e.target.value }))}
            />
          </div>
          <div>
            <label className="block text-sm text-gray-700 mb-1">Build Type</label>
            <select
              className="w-full bg-dark-800 border border-dark-600 rounded-lg px-3 py-2 text-white text-sm focus:outline-none"
              value={planForm.buildType}
              onChange={e => setPlanForm(p => ({ ...p, buildType: e.target.value }))}
            >
              {BUILD_TYPES.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm text-gray-700 mb-1">Site Address</label>
            <input
              className="w-full bg-white border border-gray-300 rounded-lg px-3 py-2 text-gray-900 text-sm focus:outline-none focus:border-brand-500"
              placeholder="e.g. 123 Main St, Sydney"
              value={planForm.address}
              onChange={e => setPlanForm(p => ({ ...p, address: e.target.value }))}
            />
          </div>
          <div>
            <label className="block text-sm text-gray-700 mb-1">Total Budget (optional)</label>
            <input
              type="number"
              className="w-full bg-white border border-gray-300 rounded-lg px-3 py-2 text-gray-900 text-sm focus:outline-none focus:border-brand-500"
              placeholder="e.g. 500000"
              value={planForm.totalBudget}
              onChange={e => setPlanForm(p => ({ ...p, totalBudget: e.target.value }))}
            />
          </div>
          <div>
            <label className="block text-sm text-gray-700 mb-1">Description</label>
            <textarea
              rows={2}
              className="w-full bg-white border border-gray-300 rounded-lg px-3 py-2 text-gray-900 text-sm focus:outline-none focus:border-brand-500 resize-none"
              placeholder="Brief description of this build..."
              value={planForm.description}
              onChange={e => setPlanForm(p => ({ ...p, description: e.target.value }))}
            />
          </div>
          <div className="flex justify-end gap-3 pt-2">
            <Button variant="ghost" onClick={() => setCreatePlanOpen(false)}>Cancel</Button>
            <Button variant="primary" onClick={handleCreatePlan} disabled={saving || !planForm.title.trim()}>
              {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Create Plan'}
            </Button>
          </div>
        </div>
      </Modal>

      {/* Add Section Modal */}
      <Modal
        open={addSectionOpen}
        onClose={() => setAddSectionOpen(false)}
        title="Add Planning Section"
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm text-gray-700 mb-2">Section Type</label>
            <div className="grid grid-cols-3 gap-2">
              {SECTION_TYPES.map(t => (
                <button
                  key={t.value}
                  onClick={() => setSectionForm(f => ({ ...f, type: t.value }))}
                  className={cn(
                    'flex flex-col items-center gap-1 p-3 rounded-lg border text-xs transition-all',
                    sectionForm.type === t.value
                      ? 'border-amber-500 bg-amber-50 text-gray-900'
                      : 'border-gray-200 text-gray-500 hover:border-gray-400'
                  )}
                >
                  <t.icon className={cn('w-5 h-5', t.color)} />
                  {t.label}
                </button>
              ))}
            </div>
          </div>
          <div>
            <label className="block text-sm text-gray-700 mb-1">Notes (optional)</label>
            <textarea
              rows={2}
              className="w-full bg-white border border-gray-300 rounded-lg px-3 py-2 text-gray-900 text-sm focus:outline-none focus:border-brand-500 resize-none"
              placeholder="Any specific notes for this section..."
              value={sectionForm.notes}
              onChange={e => setSectionForm(f => ({ ...f, notes: e.target.value }))}
            />
          </div>
          <p className="text-xs text-gray-500">A pre-built checklist will be auto-populated for this section.</p>
          <div className="flex justify-end gap-3 pt-2">
            <Button variant="ghost" onClick={() => setAddSectionOpen(false)}>Cancel</Button>
            <Button variant="primary" onClick={handleAddSection} disabled={saving}>
              {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Add Section'}
            </Button>
          </div>
        </div>
      </Modal>

      {/* Add Media Modal */}
      <Modal
        open={addMediaOpen}
        onClose={() => { setAddMediaOpen(false); setMediaSectionId(null); setMediaFile(null); }}
        title={mediaSectionId
          ? `Upload File to ${sections.find(s => s.id === mediaSectionId)?.title ?? 'Section'}`
          : 'Upload File'}
      >
        <div className="space-y-4">
          {/* Drop zone / file picker */}
          <label className="block cursor-pointer">
            <div className={cn(
              'border-2 border-dashed rounded-xl p-6 text-center transition-colors',
              mediaFile
                ? 'border-brand-400 bg-brand-50'
                : 'border-gray-300 hover:border-brand-400 hover:bg-gray-50'
            )}>
              {mediaFile ? (
                <div className="flex flex-col items-center gap-2">
                  {mediaFile.type.startsWith('image/') ? (
                    <img
                      src={URL.createObjectURL(mediaFile)}
                      alt="preview"
                      className="max-h-32 rounded-lg object-contain"
                    />
                  ) : (
                    <FileText className="w-10 h-10 text-brand-500" />
                  )}
                  <span className="text-sm font-medium text-gray-800">{mediaFile.name}</span>
                  <span className="text-xs text-gray-500">{(mediaFile.size / 1024).toFixed(0)} KB</span>
                  <button
                    type="button"
                    onClick={e => { e.preventDefault(); setMediaFile(null); }}
                    className="text-xs text-red-500 hover:underline"
                  >
                    Remove
                  </button>
                </div>
              ) : (
                <div className="flex flex-col items-center gap-2">
                  <Upload className="w-8 h-8 text-gray-400" />
                  <span className="text-sm font-medium text-gray-700">Click to select a file</span>
                  <span className="text-xs text-gray-400">Images, PDFs, Word documents · max 10 MB</span>
                </div>
              )}
            </div>
            <input
              type="file"
              className="hidden"
              accept="image/*,.pdf,.doc,.docx,.txt"
              onChange={e => setMediaFile(e.target.files?.[0] ?? null)}
            />
          </label>

          <div>
            <label className="block text-sm text-gray-700 mb-1">Caption (optional)</label>
            <input
              className="w-full bg-white border border-gray-300 rounded-lg px-3 py-2 text-gray-900 text-sm focus:outline-none focus:border-brand-500"
              placeholder="Brief description of this file..."
              value={mediaForm.caption}
              onChange={e => setMediaForm(m => ({ ...m, caption: e.target.value }))}
            />
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <Button variant="ghost" onClick={() => { setAddMediaOpen(false); setMediaFile(null); }}>Cancel</Button>
            <Button variant="primary" onClick={handleAddMedia} disabled={mediaUploading || !mediaFile}>
              {mediaUploading ? <><Loader2 className="w-4 h-4 animate-spin mr-1" />Uploading…</> : 'Upload File'}
            </Button>
          </div>
        </div>
      </Modal>

      {/* Delete plan confirm */}
      <ConfirmModal
        open={!!deletePlanId}
        onClose={() => setDeletePlanId(null)}
        onConfirm={handleDeletePlan}
        title="Delete Build Plan"
        description="Are you sure you want to delete this build plan? All sections, checklists, and media will be permanently removed."
        confirmLabel="Delete Plan"
        danger
      />

      {/* Add / Edit Material Modal */}
      <Modal
        open={addMaterialOpen}
        onClose={() => { setAddMaterialOpen(false); setEditMaterial(null); setMaterialForm(emptyMaterialForm); }}
        title={editMaterial ? 'Edit Material' : 'Add Material'}
      >
        <div className="space-y-4">
          {/* Name */}
          <div>
            <label className="block text-sm text-gray-700 mb-1 font-medium">Material Name *</label>
            <input
              className="w-full bg-white border border-gray-300 rounded-lg px-3 py-2 text-gray-900 text-sm focus:outline-none focus:border-brand-500"
              placeholder="e.g. Portland Cement"
              value={materialForm.name}
              onChange={e => setMaterialForm(f => ({ ...f, name: e.target.value }))}
            />
          </div>

          {/* Category */}
          <div>
            <label className="block text-sm text-gray-700 mb-2 font-medium">Category</label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5">
              {MATERIAL_CATEGORIES.map(c => (
                <button
                  key={c.value}
                  onClick={() => setMaterialForm(f => ({ ...f, category: c.value }))}
                  className={cn(
                    'px-2 py-1.5 rounded-lg text-xs font-medium border transition-all text-left',
                    materialForm.category === c.value
                      ? `${c.bg} ${c.color} border-current`
                      : 'border-gray-200 text-gray-500 hover:border-gray-300'
                  )}
                >
                  {c.label}
                </button>
              ))}
            </div>
          </div>

          {/* Quantity + Unit */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm text-gray-700 mb-1 font-medium">Quantity *</label>
              <input
                type="number" min="0" step="any"
                className="w-full bg-white border border-gray-300 rounded-lg px-3 py-2 text-gray-900 text-sm focus:outline-none focus:border-brand-500"
                placeholder="0"
                value={materialForm.quantity}
                onChange={e => setMaterialForm(f => ({ ...f, quantity: e.target.value }))}
              />
            </div>
            <div>
              <label className="block text-sm text-gray-700 mb-1 font-medium">Unit</label>
              <select
                className="w-full bg-white border border-gray-300 rounded-lg px-3 py-2 text-gray-900 text-sm focus:outline-none focus:border-brand-500"
                value={materialForm.unit}
                onChange={e => setMaterialForm(f => ({ ...f, unit: e.target.value }))}
              >
                {MATERIAL_UNITS.map(u => <option key={u} value={u}>{u}</option>)}
              </select>
            </div>
          </div>

          {/* Cost */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm text-gray-700 mb-1 font-medium">Est. Cost ($)</label>
              <input
                type="number" min="0" step="any"
                className="w-full bg-white border border-gray-300 rounded-lg px-3 py-2 text-gray-900 text-sm focus:outline-none focus:border-brand-500"
                placeholder="0.00"
                value={materialForm.estimatedCost}
                onChange={e => setMaterialForm(f => ({ ...f, estimatedCost: e.target.value }))}
              />
            </div>
            <div>
              <label className="block text-sm text-gray-700 mb-1 font-medium">Actual Cost ($)</label>
              <input
                type="number" min="0" step="any"
                className="w-full bg-white border border-gray-300 rounded-lg px-3 py-2 text-gray-900 text-sm focus:outline-none focus:border-brand-500"
                placeholder="0.00"
                value={materialForm.actualCost}
                onChange={e => setMaterialForm(f => ({ ...f, actualCost: e.target.value }))}
              />
            </div>
          </div>

          {/* Status */}
          <div>
            <label className="block text-sm text-gray-700 mb-2 font-medium">Status</label>
            <div className="flex gap-2 flex-wrap">
              {(Object.entries(MATERIAL_STATUS_META) as [MaterialStatus, typeof MATERIAL_STATUS_META[MaterialStatus]][]).map(([key, meta]) => (
                <button
                  key={key}
                  onClick={() => setMaterialForm(f => ({ ...f, status: key }))}
                  className={cn(
                    'flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium border transition-all',
                    materialForm.status === key
                      ? `${meta.bg} ${meta.color} border-current`
                      : 'border-gray-200 text-gray-400 hover:border-gray-300'
                  )}
                >
                  <meta.icon className="w-3 h-3" />
                  {meta.label}
                </button>
              ))}
            </div>
          </div>

          {/* Supplier */}
          <div>
            <label className="block text-sm text-gray-700 mb-1 font-medium">Supplier (optional)</label>
            <input
              className="w-full bg-white border border-gray-300 rounded-lg px-3 py-2 text-gray-900 text-sm focus:outline-none focus:border-brand-500"
              placeholder="e.g. ABC Building Supplies"
              value={materialForm.supplier}
              onChange={e => setMaterialForm(f => ({ ...f, supplier: e.target.value }))}
            />
          </div>

          {/* Notes */}
          <div>
            <label className="block text-sm text-gray-700 mb-1 font-medium">Notes (optional)</label>
            <textarea
              rows={2}
              className="w-full bg-white border border-gray-300 rounded-lg px-3 py-2 text-gray-900 text-sm focus:outline-none focus:border-brand-500 resize-none"
              placeholder="Grade, spec, delivery date..."
              value={materialForm.notes}
              onChange={e => setMaterialForm(f => ({ ...f, notes: e.target.value }))}
            />
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <Button variant="ghost" onClick={() => { setAddMaterialOpen(false); setEditMaterial(null); }}>Cancel</Button>
            <Button variant="primary" onClick={handleSaveMaterial} disabled={saving || !materialForm.name.trim() || !materialForm.quantity}>
              {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : (editMaterial ? 'Save Changes' : 'Add Material')}
            </Button>
          </div>
        </div>
      </Modal>

      {/* Delete material confirm */}
      <ConfirmModal
        open={!!deleteMaterialId}
        onClose={() => setDeleteMaterialId(null)}
        onConfirm={handleDeleteMaterial}
        title="Remove Material"
        description="Remove this material from your plan?"
        confirmLabel="Remove"
        danger
      />
    </div>
  );
}

// ─── Materials Panel ──────────────────────────────────────────────────────────

function MaterialsPanel({
  planId, materials, loading, currency,
  onAdd, onEdit, onDelete, onStatusCycle,
}: {
  planId: string;
  materials: BuildMaterial[];
  loading: boolean;
  currency: string;
  onAdd: () => void;
  onEdit: (m: BuildMaterial) => void;
  onDelete: (id: string) => void;
  onStatusCycle: (m: BuildMaterial) => void;
}) {
  // ── Summary stats ──────────────────────────────────────────────────────────
  const totalItems    = materials.length;
  const totalEst      = materials.reduce((s, m) => s + (m.estimatedCost ?? 0), 0);
  const totalActual   = materials.reduce((s, m) => s + (m.actualCost ?? 0), 0);
  const orderedCount  = materials.filter(m => m.status === 'ordered').length;
  const deliveredCount= materials.filter(m => m.status === 'delivered').length;
  const installedCount= materials.filter(m => m.status === 'installed').length;

  // ── Group by category ──────────────────────────────────────────────────────
  const grouped = MATERIAL_CATEGORIES.map(cat => ({
    ...cat,
    items: materials.filter(m => m.category === cat.value),
  })).filter(g => g.items.length > 0);

  const fmt = (n: number) => n.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 2 });

  if (loading) {
    return (
      <div className="flex items-center justify-center py-16">
        <Loader2 className="w-6 h-6 animate-spin text-amber-500" />
      </div>
    );
  }

  return (
    <div className="space-y-4 lg:space-y-6">
      {/* ── Header row ── */}
      <div className="flex items-center justify-between gap-3">
        <div>
          <h2 className="font-bold text-gray-900 text-base lg:text-lg flex items-center gap-2">
            <Boxes className="w-5 h-5 text-amber-500" />
            Material Planning
          </h2>
          <p className="text-gray-500 text-xs mt-0.5">{totalItems} material{totalItems !== 1 ? 's' : ''} tracked</p>
        </div>
        <Button variant="primary" size="sm" onClick={onAdd}>
          <Plus className="w-4 h-4 mr-1" /> Add Material
        </Button>
      </div>

      {/* ── Summary cards ── */}
      {totalItems > 0 && (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          {[
            { label: 'Est. Budget',  value: `${currency} ${fmt(totalEst)}`,     icon: DollarSign,    color: 'text-blue-600',  bg: 'bg-blue-50'   },
            { label: 'Actual Spend', value: `${currency} ${fmt(totalActual)}`,   icon: DollarSign,    color: 'text-purple-600',bg: 'bg-purple-50' },
            { label: 'Ordered',      value: `${orderedCount} item${orderedCount !== 1 ? 's' : ''}`,   icon: ShoppingCart,  color: 'text-blue-600',  bg: 'bg-blue-50'   },
            { label: 'Installed',    value: `${installedCount} of ${totalItems}`, icon: PackageCheck,  color: 'text-green-600', bg: 'bg-green-50'  },
          ].map(s => (
            <div key={s.label} className={cn('rounded-xl border p-3 lg:p-4 flex items-center gap-3', s.bg, 'border-current/10')}>
              <div className={cn('w-9 h-9 rounded-lg flex items-center justify-center bg-white/60', s.color)}>
                <s.icon className="w-4 h-4" />
              </div>
              <div>
                <div className={cn('font-bold text-sm lg:text-base', s.color)}>{s.value}</div>
                <div className="text-gray-500 text-xs">{s.label}</div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ── Empty state ── */}
      {totalItems === 0 && (
        <div className="text-center py-14 border-2 border-dashed border-gray-200 rounded-2xl">
          <div className="text-5xl mb-3">🧱</div>
          <h3 className="font-semibold text-gray-700 mb-1">No materials yet</h3>
          <p className="text-gray-400 text-sm mb-5 max-w-xs mx-auto">
            Track every material — cement, steel, timber, fixtures and more — with quantities, costs and delivery status.
          </p>
          <Button variant="primary" onClick={onAdd}>
            <Plus className="w-4 h-4 mr-1" /> Add First Material
          </Button>
        </div>
      )}

      {/* ── Grouped material list ── */}
      {grouped.map(group => (
        <div key={group.value}>
          {/* Category header */}
          <div className={cn('flex items-center gap-2 px-3 py-1.5 rounded-lg mb-2', group.bg)}>
            <span className={cn('text-xs font-semibold uppercase tracking-wider', group.color)}>{group.label}</span>
            <span className={cn('text-xs font-medium ml-auto', group.color)}>{group.items.length} item{group.items.length !== 1 ? 's' : ''}</span>
          </div>

          {/* Material rows */}
          <Card className="overflow-hidden p-0">
            <div className="divide-y divide-gray-100">
              {group.items.map(m => {
                const statusMeta = MATERIAL_STATUS_META[m.status];
                const StatusIcon = statusMeta.icon;
                return (
                  <div key={m.id} className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 transition-colors group">
                    {/* Status cycle button */}
                    <button
                      onClick={() => onStatusCycle(m)}
                      title={`Status: ${statusMeta.label} — click to advance`}
                      className={cn('flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center transition-all hover:scale-110', statusMeta.bg)}
                    >
                      <StatusIcon className={cn('w-3.5 h-3.5', statusMeta.color)} />
                    </button>

                    {/* Name + notes */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-medium text-gray-900 text-sm">{m.name}</span>
                        <span className={cn('text-xs px-2 py-0.5 rounded-full font-medium', statusMeta.bg, statusMeta.color)}>
                          {statusMeta.label}
                        </span>
                      </div>
                      <div className="flex items-center gap-3 mt-0.5 flex-wrap">
                        <span className="text-xs text-gray-500 font-medium">{m.quantity} {m.unit}</span>
                        {m.supplier && <span className="text-xs text-gray-400">· {m.supplier}</span>}
                        {m.notes && <span className="text-xs text-gray-400 truncate max-w-[160px]">· {m.notes}</span>}
                      </div>
                    </div>

                    {/* Cost */}
                    <div className="flex-shrink-0 text-right hidden sm:block">
                      {m.estimatedCost != null && (
                        <div className="text-xs text-gray-500">Est. {currency} {fmt(m.estimatedCost)}</div>
                      )}
                      {m.actualCost != null && (
                        <div className="text-xs font-semibold text-gray-700">Act. {currency} {fmt(m.actualCost)}</div>
                      )}
                    </div>

                    {/* Actions */}
                    <div className="flex-shrink-0 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={() => onEdit(m)}
                        className="w-7 h-7 rounded-lg flex items-center justify-center text-gray-400 hover:text-blue-500 hover:bg-blue-50 transition-colors"
                      >
                        <Pencil className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => onDelete(m.id)}
                        className="w-7 h-7 rounded-lg flex items-center justify-center text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </Card>
        </div>
      ))}

      {/* ── Cost variance footer ── */}
      {totalItems > 0 && (totalEst > 0 || totalActual > 0) && (
        <Card className="bg-gray-50">
          <div className="flex items-center justify-between flex-wrap gap-3">
            <div className="flex items-center gap-2">
              <BarChart3 className="w-4 h-4 text-amber-500" />
              <span className="font-semibold text-gray-700 text-sm">Cost Summary</span>
            </div>
            <div className="flex items-center gap-6 text-sm flex-wrap">
              <div><span className="text-gray-500">Estimated: </span><span className="font-bold text-gray-900">{currency} {fmt(totalEst)}</span></div>
              <div><span className="text-gray-500">Actual: </span><span className={cn('font-bold', totalActual > totalEst ? 'text-red-600' : 'text-green-600')}>{currency} {fmt(totalActual)}</span></div>
              {totalEst > 0 && totalActual > 0 && (
                <div>
                  <span className="text-gray-500">Variance: </span>
                  <span className={cn('font-bold', totalActual > totalEst ? 'text-red-600' : 'text-green-600')}>
                    {totalActual > totalEst ? '+' : ''}{currency} {fmt(totalActual - totalEst)}
                  </span>
                </div>
              )}
            </div>
          </div>
        </Card>
      )}
    </div>
  );
}

// ─── Section Card ─────────────────────────────────────────────────────────────

function SectionCard({
  section,
  onToggle,
  onDelete,
  onAddMedia,
}: {
  section: BuildSection;
  onToggle: (itemId: string) => void;
  onDelete: (sectionId: string) => void;
  onAddMedia: (sectionId: string) => void;
}) {
  const [expanded, setExpanded] = useState(true);
  const meta = SECTION_TYPE_META[section.type] ?? SECTION_TYPE_META.other;
  const total = section.checkItems.length;
  const done = section.checkItems.filter(i => i.isChecked).length;
  const pct = total > 0 ? Math.round((done / total) * 100) : 0;
  const sectionMedia = section.media ?? [];

  return (
    <Card className="overflow-hidden">
      <div
        className="flex items-center gap-3 cursor-pointer select-none"
        onClick={() => setExpanded(!expanded)}
      >
        <meta.icon className={cn('w-5 h-5 flex-shrink-0', meta.color)} />
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-gray-900">
              {section.title === section.type
                ? (SECTION_TYPE_META[section.type]?.label ?? section.title)
                : section.title}
            </span>
            {pct === 100 && total > 0 && (
              <Badge variant="success" className="text-xs">Complete ✓</Badge>
            )}
          </div>
          {section.notes && <p className="text-xs text-gray-500 truncate">{section.notes}</p>}
        </div>
        <div className="flex items-center gap-2 flex-shrink-0">
          <span className="text-xs text-gray-500 hidden sm:block">{done}/{total}</span>
          <div className="w-12 sm:w-20 h-1.5 bg-gray-200 rounded-full overflow-hidden">
            <div className="h-full bg-amber-500 rounded-full transition-all" style={{ width: `${pct}%` }} />
          </div>
          <button
            onClick={e => { e.stopPropagation(); onAddMedia(section.id); }}
            className="p-1 text-gray-400 hover:text-blue-500 transition-colors"
            title="Add file to this section"
          >
            <Upload className="w-4 h-4" />
          </button>
          <button
            onClick={e => { e.stopPropagation(); onDelete(section.id); }}
            className="p-1 text-gray-400 hover:text-red-500 transition-colors"
            title="Delete section"
          >
            <Trash2 className="w-4 h-4" />
          </button>
          {expanded ? <ChevronDown className="w-4 h-4 text-gray-400" /> : <ChevronRight className="w-4 h-4 text-gray-400" />}
        </div>
      </div>

      {expanded && (
        <>
          {total > 0 && (
            <div className="mt-4 space-y-2 border-t border-gray-200 pt-4">
              {section.checkItems.map(item => (
                <button
                  key={item.id}
                  onClick={() => onToggle(item.id)}
                  className="flex items-center gap-3 w-full text-left group hover:bg-gray-50 rounded-lg px-2 py-1.5 transition-colors"
                >
                  {item.isChecked
                    ? <CheckSquare className="w-4 h-4 text-amber-500 flex-shrink-0" />
                    : <Square className="w-4 h-4 text-gray-400 flex-shrink-0 group-hover:text-gray-600" />
                  }
                  <span className={cn('text-sm', item.isChecked ? 'line-through text-gray-400' : 'text-gray-800')}>
                    {item.label}
                  </span>
                </button>
              ))}
            </div>
          )}

          {sectionMedia.length > 0 && (
            <div className="mt-4 border-t border-gray-100 pt-4">
              <p className="text-xs text-gray-500 font-medium mb-2">
                Files ({sectionMedia.length})
              </p>
              <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-5 gap-2">
                {sectionMedia.map(m => (
                  <a key={m.id} href={m.url} target="_blank" rel="noopener noreferrer"
                    className="group flex flex-col items-center gap-1 p-2 bg-gray-50 border border-gray-200 rounded-lg hover:border-blue-400 transition-colors"
                  >
                    {m.mediaType === 'image'
                      ? <img src={m.url} alt={m.name} className="w-full h-14 object-cover rounded" />
                      : <FileText className="w-8 h-8 text-gray-400 group-hover:text-blue-500" />
                    }
                    <span className="text-xs text-gray-600 truncate w-full text-center">{m.name}</span>
                  </a>
                ))}
                <button
                  onClick={() => onAddMedia(section.id)}
                  className="flex flex-col items-center justify-center gap-1 p-2 border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-400 hover:bg-blue-50 transition-colors min-h-[4rem]"
                >
                  <Plus className="w-5 h-5 text-gray-400" />
                  <span className="text-xs text-gray-400">Add</span>
                </button>
              </div>
            </div>
          )}

          {sectionMedia.length === 0 && (
            <div className="mt-3 pt-3 border-t border-gray-100">
              <button
                onClick={() => onAddMedia(section.id)}
                className="flex items-center gap-2 text-xs text-gray-400 hover:text-blue-500 transition-colors px-1 py-1"
              >
                <Upload className="w-3.5 h-3.5" />
                Add file to this section
              </button>
            </div>
          )}
        </>
      )}
    </Card>
  );
}

// ─── Blueprint Report ─────────────────────────────────────────────────────────

function BlueprintReport({ plan, sections, stats, achievements }: {
  plan: BuildPlan;
  sections: BuildSection[];
  stats?: PlanStats;
  achievements: Achievement[];
}) {
  const earnedBadges = achievements.filter(a => a.unlocked);

  return (
    <div className="max-w-3xl mx-auto space-y-6" id="blueprint-report">
      {/* Header */}
      <Card className="text-center py-8">
        <div className="text-5xl mb-3">{plan.emoji}</div>
        <h2 className="text-2xl font-bold text-gray-900 mb-1">{plan.title}</h2>
        <p className="text-gray-500 capitalize">{plan.buildType} Build Plan</p>
        {plan.address && <p className="text-gray-500 text-sm mt-1">{plan.address}</p>}
        <div className="flex items-center justify-center gap-6 mt-6 flex-wrap">
          <div className="text-center">
            <div className="text-2xl font-bold text-amber-500">{stats?.overallPercent ?? 0}%</div>
            <div className="text-xs text-gray-500">Complete</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-gray-900">{stats?.totalSections ?? 0}</div>
            <div className="text-xs text-gray-500">Sections</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-gray-900">{stats?.checkedItems ?? 0}/{stats?.totalItems ?? 0}</div>
            <div className="text-xs text-gray-500">Tasks Done</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-gray-900">{earnedBadges.length}</div>
            <div className="text-xs text-gray-500">Badges Earned</div>
          </div>
        </div>
      </Card>

      {/* Earned Badges */}
      {earnedBadges.length > 0 && (
        <Card>
          <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
            <Trophy className="w-4 h-4 text-amber-500" /> Achievements Earned
          </h3>
          <div className="flex flex-wrap gap-2">
            {earnedBadges.map(b => (
              <div key={b.slug} className="flex items-center gap-2 px-3 py-1.5 bg-amber-50 border border-amber-300 rounded-full">
                <span>{b.emoji}</span>
                <span className="text-sm text-gray-800 font-medium">{b.title}</span>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* Section summaries */}
      {sections.map(sec => {
        const total = sec.checkItems.length;
        const done = sec.checkItems.filter(i => i.isChecked).length;
        const meta = SECTION_TYPE_META[sec.type] ?? SECTION_TYPE_META.other;
        return (
          <Card key={sec.id}>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <meta.icon className={cn('w-4 h-4', meta.color)} />
                <h3 className="font-semibold text-gray-900">{sec.title}</h3>
              </div>
              <span className="text-sm text-gray-500">{done}/{total} complete</span>
            </div>
            {sec.notes && <p className="text-gray-500 text-sm mb-3">{sec.notes}</p>}
            <div className="space-y-1.5">
              {sec.checkItems.map(item => (
                <div key={item.id} className="flex items-center gap-2 text-sm">
                  <span className={item.isChecked ? 'text-amber-500' : 'text-gray-400'}>
                    {item.isChecked ? '✓' : '○'}
                  </span>
                  <span className={item.isChecked ? 'text-gray-400 line-through' : 'text-gray-800'}>
                    {item.label}
                  </span>
                </div>
              ))}
            </div>
          </Card>
        );
      })}

      {/* Footer */}
      <Card className="text-center text-gray-400 text-sm py-4">
        Construction Blueprint generated by Biddaro Build Planner
        <br />
        {new Date().toLocaleDateString('en-AU', { dateStyle: 'long' })}
      </Card>
    </div>
  );
}
