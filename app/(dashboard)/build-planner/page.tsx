'use client';
import React, { useEffect, useState, useCallback } from 'react';
import Link from 'next/link';
import {
  Hammer, Plus, Loader2, Package, Trash2, ChevronDown, ChevronRight,
  CheckSquare, Square, Image as ImageIcon, X, Trophy, Target, Upload,
  Building2, Zap, Shield, Layers, Droplets,
  Wind, Paintbrush, Map, BarChart3, FileText, RefreshCw, CheckCircle2,
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Card } from '@/components/ui/Card';
import { Modal, ConfirmModal } from '@/components/ui/Modal';
import { Tabs, TabList, Tab, TabPanel } from '@/components/ui/Tabs';
import { buildPlannerApi, addonsApi } from '@/lib/api';
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

  // Modals
  const [createPlanOpen, setCreatePlanOpen] = useState(false);
  const [deletePlanId, setDeletePlanId]     = useState<string | null>(null);
  const [addSectionOpen, setAddSectionOpen] = useState(false);
  const [addMediaOpen, setAddMediaOpen]     = useState(false);
  const [editPlanOpen, setEditPlanOpen]     = useState(false);

  // Forms
  const [planForm, setPlanForm] = useState({ title: '', description: '', buildType: 'residential', address: '', totalBudget: '', emoji: '🏗️' });
  const [sectionForm, setSectionForm] = useState({ type: 'site_map', notes: '' });
  const [mediaForm, setMediaForm] = useState({ name: '', url: '', caption: '', mediaType: 'image' });
  const [saving, setSaving] = useState(false);

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
      await buildPlannerApi.addSection(selectedPlan.id, {
        type: sectionForm.type,
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
    if (!selectedPlan || !mediaForm.name.trim() || !mediaForm.url.trim()) return;
    setSaving(true);
    try {
      await buildPlannerApi.addMedia(selectedPlan.id, {
        name: mediaForm.name.trim(),
        url: mediaForm.url.trim(),
        caption: mediaForm.caption.trim() || undefined,
        mediaType: mediaForm.mediaType,
      });
      toast.success('Media added!');
      setAddMediaOpen(false);
      setMediaForm({ name: '', url: '', caption: '', mediaType: 'image' });
      await loadPlan(selectedPlan.id);
    } catch { toast.error('Failed to add media'); }
    finally { setSaving(false); }
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
    <div className="flex h-[calc(100vh-4rem)] overflow-hidden">
      {/* ── Left Sidebar: Plan List ─────────────────────────────────────── */}
      <div className="w-64 border-r border-dark-700 flex flex-col bg-dark-900 flex-shrink-0">
        <div className="p-4 border-b border-dark-700 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Hammer className="w-5 h-5 text-amber-400" />
            <span className="font-semibold text-white text-sm">Build Plans</span>
          </div>
          <Button variant="ghost" size="sm" onClick={() => setCreatePlanOpen(true)} className="p-1">
            <Plus className="w-4 h-4" />
          </Button>
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
                'w-full text-left px-3 py-2.5 rounded-lg transition-colors group',
                selectedPlan?.id === plan.id
                  ? 'bg-amber-500/10 border border-amber-500/30'
                  : 'hover:bg-dark-800'
              )}
            >
              <div className="flex items-center gap-2">
                <span className="text-lg">{plan.emoji}</span>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium text-white truncate">{plan.title}</div>
                  <div className="text-xs text-dark-400 capitalize">{plan.buildType}</div>
                </div>
                <button
                  onClick={e => { e.stopPropagation(); setDeletePlanId(plan.id); }}
                  className="opacity-0 group-hover:opacity-100 text-dark-400 hover:text-red-400 transition-opacity"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </button>
          ))}
        </div>

        <div className="p-3 border-t border-dark-700">
          <Button variant="secondary" size="sm" onClick={() => setCreatePlanOpen(true)} className="w-full text-xs">
            <Plus className="w-3.5 h-3.5 mr-1" /> New Build Plan
          </Button>
        </div>
      </div>

      {/* ── Main Content ────────────────────────────────────────────────── */}
      {!selectedPlan ? (
        <div className="flex-1 flex items-center justify-center text-center">
          <div>
            <div className="text-5xl mb-3">🏗️</div>
            <p className="text-gray-500">Select or create a build plan to get started</p>
            <Button variant="primary" size="sm" onClick={() => setCreatePlanOpen(true)} className="mt-4">
              <Plus className="w-4 h-4 mr-1" /> New Build Plan
            </Button>
          </div>
        </div>
      ) : (
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Header */}
          <div className="px-6 py-4 border-b border-dark-700 flex items-center justify-between bg-dark-900">
            <div className="flex items-center gap-3">
              <span className="text-2xl">{selectedPlan.emoji}</span>
              <div>
                <h1 className="text-lg font-bold text-white">{selectedPlan.title}</h1>
                <p className="text-xs text-dark-400 capitalize">{selectedPlan.buildType}{selectedPlan.address ? ` · ${selectedPlan.address}` : ''}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="sm" onClick={() => loadPlan(selectedPlan.id)}>
                <RefreshCw className="w-4 h-4" />
              </Button>
              <Button variant="secondary" size="sm" onClick={() => setAddSectionOpen(true)}>
                <Plus className="w-4 h-4 mr-1" /> Add Section
              </Button>
              <Button variant="secondary" size="sm" onClick={() => setAddMediaOpen(true)}>
                <Upload className="w-4 h-4 mr-1" /> Upload
              </Button>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex-1 overflow-hidden">
            <Tabs defaultValue="blueprint" onChange={setActiveTab}>
              <div className="border-b border-dark-700 px-6">
                <TabList>
                  <Tab value="blueprint"><Trophy className="w-4 h-4 mr-1.5 inline" />Blueprint</Tab>
                  <Tab value="sections"><CheckSquare className="w-4 h-4 mr-1.5 inline" />Sections</Tab>
                  <Tab value="media"><ImageIcon className="w-4 h-4 mr-1.5 inline" />Media Board</Tab>
                  <Tab value="report"><FileText className="w-4 h-4 mr-1.5 inline" />Report</Tab>
                </TabList>
              </div>

              <div className="overflow-y-auto h-[calc(100%-3rem)] p-6">
                {/* ── Blueprint Tab ───────────────────────────────────────── */}
                <TabPanel value="blueprint">
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Progress ring */}
                    <Card className="col-span-1 flex flex-col items-center justify-center gap-4 py-6">
                      <ProgressRing percent={stats?.overallPercent ?? 0} size={120} />
                      <div className="text-center">
                        <div className="text-gray-900 font-semibold">Overall Progress</div>
                        <div className="text-gray-500 text-sm">
                          {stats?.checkedItems ?? 0} / {stats?.totalItems ?? 0} items complete
                        </div>
                        <div className="text-gray-400 text-xs mt-1">
                          {stats?.fullyCompletedSectionCount ?? 0} / {stats?.totalSections ?? 0} sections done
                        </div>
                      </div>
                    </Card>

                    {/* Stats */}
                    <Card className="col-span-1 lg:col-span-2">
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                        {[
                          { label: 'Sections', value: stats?.totalSections ?? 0, icon: Layers },
                          { label: 'Tasks',    value: stats?.totalItems ?? 0,    icon: CheckSquare },
                          { label: 'Done',     value: stats?.checkedItems ?? 0,  icon: CheckCircle2 },
                          { label: 'Media',    value: stats?.totalMedia ?? 0,    icon: ImageIcon },
                          { label: 'Badges',   value: achievements.filter(a => a.unlocked).length, icon: Trophy },
                          { label: 'Budget',   value: selectedPlan.totalBudget ? `$${selectedPlan.totalBudget.toLocaleString()}` : '—', icon: Target },
                        ].map(s => (
                          <div key={s.label} className="flex items-center gap-3 p-3 bg-gray-50 border border-gray-200 rounded-lg">
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
                    <Card className="col-span-1 lg:col-span-3">
                      <div className="flex items-center gap-2 mb-4">
                        <Trophy className="w-5 h-5 text-amber-500" />
                        <h3 className="font-semibold text-gray-900">Achievement Badges</h3>
                        <Badge variant="warning" className="ml-auto text-xs">
                          {achievements.filter(a => a.unlocked).length} / {achievements.length} earned
                        </Badge>
                      </div>
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                        {achievements.map(ach => (
                          <div
                            key={ach.slug}
                            className={cn(
                              'flex flex-col items-center text-center p-3 rounded-xl border transition-all',
                              ach.unlocked
                                ? 'border-amber-400 bg-amber-50 shadow-sm'
                                : 'border-gray-200 bg-gray-50 opacity-50 grayscale'
                            )}
                          >
                            <span className="text-3xl mb-1">{ach.emoji}</span>
                            <div className="text-gray-900 text-xs font-semibold leading-tight">{ach.title}</div>
                            <div className="text-gray-500 text-xs mt-1 leading-tight">{ach.description}</div>
                            {ach.unlocked && (
                              <Badge variant="warning" className="mt-2 text-xs">Earned!</Badge>
                            )}
                          </div>
                        ))}
                        {achievements.length === 0 && (
                          <div className="col-span-4 text-center text-gray-500 py-4">
                            Add sections and complete tasks to earn achievement badges
                          </div>
                        )}
                      </div>
                    </Card>

                    {/* Section progress bars */}
                    {sections.length > 0 && (
                      <Card className="col-span-1 lg:col-span-3">
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
                        />
                      ))}
                      <Button variant="secondary" onClick={() => setAddSectionOpen(true)} className="w-full">
                        <Plus className="w-4 h-4 mr-1" /> Add Section
                      </Button>
                    </div>
                  )}
                </TabPanel>

                {/* ── Media Board Tab ─────────────────────────────────────── */}
                <TabPanel value="media">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-semibold text-gray-900">{media.length} item{media.length !== 1 ? 's' : ''}</h3>
                    <Button variant="secondary" size="sm" onClick={() => setAddMediaOpen(true)}>
                      <Upload className="w-4 h-4 mr-1" /> Add Media
                    </Button>
                  </div>
                  {media.length === 0 ? (
                    <div className="text-center py-12 border-2 border-dashed border-gray-300 rounded-xl">
                      <ImageIcon className="w-10 h-10 text-gray-400 mx-auto mb-3" />
                      <p className="text-gray-500 mb-2">No media uploaded yet</p>
                      <p className="text-gray-400 text-sm">Upload blueprints, site photos, inspiration images & more</p>
                      <Button variant="secondary" size="sm" onClick={() => setAddMediaOpen(true)} className="mt-4">
                        <Upload className="w-4 h-4 mr-1" /> Upload First File
                      </Button>
                    </div>
                  ) : (
                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                      {media.map(m => (
                        <div key={m.id} className="group relative rounded-xl overflow-hidden border border-gray-200 bg-gray-50">
                          {m.mediaType === 'image' ? (
                            <img
                              src={m.url}
                              alt={m.name}
                              className="w-full h-36 object-cover"
                              onError={e => { (e.target as HTMLImageElement).src = 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100"><rect width="100" height="100" fill="%23f3f4f6"/><text x="50" y="50" text-anchor="middle" fill="%236b7280" font-size="12">No preview</text></svg>'; }}
                            />
                          ) : (
                            <div className="w-full h-36 flex items-center justify-center bg-gray-100">
                              <FileText className="w-10 h-10 text-gray-400" />
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
        onClose={() => setAddMediaOpen(false)}
        title="Add Media / Blueprint"
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm text-gray-700 mb-1">Name *</label>
            <input
              className="w-full bg-white border border-gray-300 rounded-lg px-3 py-2 text-gray-900 text-sm focus:outline-none focus:border-brand-500"
              placeholder="e.g. Front elevation blueprint"
              value={mediaForm.name}
              onChange={e => setMediaForm(m => ({ ...m, name: e.target.value }))}
            />
          </div>
          <div>
            <label className="block text-sm text-gray-700 mb-1">URL *</label>
            <input
              className="w-full bg-white border border-gray-300 rounded-lg px-3 py-2 text-gray-900 text-sm focus:outline-none focus:border-brand-500"
              placeholder="https://..."
              value={mediaForm.url}
              onChange={e => setMediaForm(m => ({ ...m, url: e.target.value }))}
            />
          </div>
          <div>
            <label className="block text-sm text-gray-700 mb-1">Type</label>
            <select
              className="w-full bg-white border border-gray-300 rounded-lg px-3 py-2 text-gray-900 text-sm"
              value={mediaForm.mediaType}
              onChange={e => setMediaForm(m => ({ ...m, mediaType: e.target.value }))}
            >
              <option value="image">Image / Photo</option>
              <option value="blueprint">Blueprint / Plan</option>
              <option value="document">Document</option>
              <option value="video">Video</option>
            </select>
          </div>
          <div>
            <label className="block text-sm text-gray-700 mb-1">Caption (optional)</label>
            <input
              className="w-full bg-white border border-gray-300 rounded-lg px-3 py-2 text-gray-900 text-sm focus:outline-none focus:border-brand-500"
              placeholder="Brief description..."
              value={mediaForm.caption}
              onChange={e => setMediaForm(m => ({ ...m, caption: e.target.value }))}
            />
          </div>
          <div className="flex justify-end gap-3 pt-2">
            <Button variant="ghost" onClick={() => setAddMediaOpen(false)}>Cancel</Button>
            <Button variant="primary" onClick={handleAddMedia} disabled={saving || !mediaForm.name.trim() || !mediaForm.url.trim()}>
              {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Add Media'}
            </Button>
          </div>
        </div>
      </Modal>

      {/* Delete confirm */}
      <ConfirmModal
        open={!!deletePlanId}
        onClose={() => setDeletePlanId(null)}
        onConfirm={handleDeletePlan}
        title="Delete Build Plan"
        description="Are you sure you want to delete this build plan? All sections, checklists, and media will be permanently removed."
        confirmLabel="Delete Plan"
        danger
      />
    </div>
  );
}

// ─── Section Card ─────────────────────────────────────────────────────────────

function SectionCard({
  section,
  onToggle,
  onDelete,
}: {
  section: BuildSection;
  onToggle: (itemId: string) => void;
  onDelete: (sectionId: string) => void;
}) {
  const [expanded, setExpanded] = useState(true);
  const meta = SECTION_TYPE_META[section.type] ?? SECTION_TYPE_META.other;
  const total = section.checkItems.length;
  const done = section.checkItems.filter(i => i.isChecked).length;
  const pct = total > 0 ? Math.round((done / total) * 100) : 0;

  return (
    <Card className="overflow-hidden">
      <div
        className="flex items-center gap-3 cursor-pointer select-none"
        onClick={() => setExpanded(!expanded)}
      >
        <meta.icon className={cn('w-5 h-5 flex-shrink-0', meta.color)} />
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-gray-900">{section.title}</span>
            {pct === 100 && total > 0 && (
              <Badge variant="success" className="text-xs">Complete ✓</Badge>
            )}
          </div>
          {section.notes && <p className="text-xs text-gray-500 truncate">{section.notes}</p>}
        </div>
        <div className="flex items-center gap-3 flex-shrink-0">
          <span className="text-sm text-gray-500">{done}/{total}</span>
          <div className="w-20 h-1.5 bg-gray-200 rounded-full overflow-hidden">
            <div className="h-full bg-amber-500 rounded-full transition-all" style={{ width: `${pct}%` }} />
          </div>
          <button
            onClick={e => { e.stopPropagation(); onDelete(section.id); }}
            className="text-gray-400 hover:text-red-500 transition-colors"
          >
            <Trash2 className="w-4 h-4" />
          </button>
          {expanded ? <ChevronDown className="w-4 h-4 text-gray-400" /> : <ChevronRight className="w-4 h-4 text-gray-400" />}
        </div>
      </div>

      {expanded && total > 0 && (
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
