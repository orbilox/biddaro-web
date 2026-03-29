'use client';
import React, { useEffect, useState, useCallback } from 'react';
import {
  Package, CheckCircle, Loader2, Download, Trash2,
  Zap, Star, AlertTriangle, Search,
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Card } from '@/components/ui/Card';
import { toast } from '@/store/uiStore';
import { addonsApi } from '@/lib/api';
import { formatCurrency } from '@/lib/utils';

// ─── Types ────────────────────────────────────────────────────────────────────

interface AddOn {
  slug: string;
  name: string;
  tagline: string;
  description: string;
  category: string;
  icon: string;
  price: number;
  pricingType: 'free' | 'monthly' | 'one_time';
  targetRole: 'contractor' | 'job_poster' | 'both';
  features: string[];
  isNew?: boolean;
  isPopular?: boolean;
  comingSoon?: boolean;
  isInstalled?: boolean;
  installedAt?: string | null;
}

type FilterCategory = 'All' | string;

// ─── Pricing label ────────────────────────────────────────────────────────────

function pricingLabel(addon: AddOn): string {
  if (addon.price === 0) return 'Free';
  const amount = formatCurrency(addon.price);
  if (addon.pricingType === 'monthly') return `${amount}/mo`;
  if (addon.pricingType === 'one_time') return `${amount} one-time`;
  return amount;
}

// ─── Add-On Card ──────────────────────────────────────────────────────────────

interface AddOnCardProps {
  addon: AddOn;
  onInstall: (slug: string) => void;
  onUninstall: (slug: string) => void;
  loading: string | null;
}

function AddOnCard({ addon, onInstall, onUninstall, loading }: AddOnCardProps) {
  const isLoading = loading === addon.slug;

  return (
    <div className={`bg-white border rounded-2xl p-5 flex flex-col gap-4 shadow-sm transition-all hover:shadow-md ${
      addon.isInstalled ? 'border-brand-200 ring-1 ring-brand-200' : 'border-gray-100'
    } ${addon.comingSoon ? 'opacity-70' : ''}`}>

      {/* Header */}
      <div className="flex items-start gap-3">
        <div className="w-12 h-12 rounded-xl bg-gray-50 flex items-center justify-center text-2xl flex-shrink-0 border border-gray-100">
          {addon.icon}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <h3 className="text-sm font-bold text-dark-900">{addon.name}</h3>
            {addon.isNew && (
              <span className="px-2 py-0.5 text-[10px] font-bold bg-blue-50 text-blue-600 rounded-full">NEW</span>
            )}
            {addon.isPopular && (
              <span className="px-2 py-0.5 text-[10px] font-bold bg-amber-50 text-amber-600 rounded-full flex items-center gap-1">
                <Star className="w-2.5 h-2.5" /> Popular
              </span>
            )}
            {addon.comingSoon && (
              <span className="px-2 py-0.5 text-[10px] font-bold bg-gray-100 text-gray-500 rounded-full">Soon</span>
            )}
          </div>
          <p className="text-xs text-dark-400 mt-0.5">{addon.tagline}</p>
        </div>
        <div className="flex-shrink-0 text-right">
          <p className="text-sm font-bold text-dark-900">{pricingLabel(addon)}</p>
          <Badge variant="secondary" size="sm" className="mt-0.5">{addon.category}</Badge>
        </div>
      </div>

      {/* Description */}
      <p className="text-xs text-dark-500 leading-relaxed">{addon.description}</p>

      {/* Features */}
      <ul className="space-y-1.5">
        {addon.features.map((f) => (
          <li key={f} className="flex items-start gap-2 text-xs text-dark-600">
            <CheckCircle className="w-3.5 h-3.5 text-green-500 flex-shrink-0 mt-0.5" />
            {f}
          </li>
        ))}
      </ul>

      {/* CTA */}
      <div className="mt-auto pt-2 border-t border-gray-50">
        {addon.comingSoon ? (
          <Button variant="outline" size="sm" className="w-full" disabled>
            Coming Soon
          </Button>
        ) : addon.isInstalled ? (
          <div className="flex items-center gap-2">
            <div className="flex-1 flex items-center gap-2 px-3 py-2 rounded-lg bg-green-50 border border-green-100">
              <CheckCircle className="w-4 h-4 text-green-600" />
              <span className="text-xs font-semibold text-green-700">Installed</span>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => onUninstall(addon.slug)}
              disabled={isLoading}
              className="text-red-500 border-red-200 hover:bg-red-50 px-3"
            >
              {isLoading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Trash2 className="w-3.5 h-3.5" />}
            </Button>
          </div>
        ) : (
          <Button
            size="sm"
            className="w-full"
            onClick={() => onInstall(addon.slug)}
            disabled={isLoading}
            leftIcon={isLoading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Download className="w-3.5 h-3.5" />}
          >
            {addon.price === 0 ? 'Install Free' : `Install · ${pricingLabel(addon)}`}
          </Button>
        )}
      </div>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

const CATEGORIES = ['All', 'Productivity', 'Finance', 'Communication', 'Trust & Safety', 'Marketing'];

export default function AddOnsPage() {
  const [addons, setAddons]           = useState<AddOn[]>([]);
  const [loading, setLoading]         = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [category, setCategory]       = useState<FilterCategory>('All');
  const [search, setSearch]           = useState('');

  const load = useCallback(async () => {
    try {
      const res = await addonsApi.list();
      const data = res.data?.data ?? [];
      setAddons(Array.isArray(data) ? data : []);
    } catch {
      toast.error('Error', 'Failed to load add-ons');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  const handleInstall = async (slug: string) => {
    setActionLoading(slug);
    try {
      const res = await addonsApi.install(slug);
      toast.success('Installed!', res.data?.message ?? 'Add-on installed successfully');
      setAddons((prev) => prev.map((a) => a.slug === slug ? { ...a, isInstalled: true, installedAt: new Date().toISOString() } : a));
    } catch (err: any) {
      toast.error('Install Failed', err?.response?.data?.message ?? 'Could not install add-on');
    } finally {
      setActionLoading(null);
    }
  };

  const handleUninstall = async (slug: string) => {
    setActionLoading(slug);
    try {
      await addonsApi.uninstall(slug);
      toast.success('Uninstalled', 'Add-on has been removed');
      setAddons((prev) => prev.map((a) => a.slug === slug ? { ...a, isInstalled: false, installedAt: null } : a));
    } catch (err: any) {
      toast.error('Error', err?.response?.data?.message ?? 'Could not uninstall add-on');
    } finally {
      setActionLoading(null);
    }
  };

  const installed = addons.filter((a) => a.isInstalled);

  const filtered = addons.filter((a) => {
    const matchCat = category === 'All' || a.category === category;
    const matchSearch = !search || a.name.toLowerCase().includes(search.toLowerCase()) || a.tagline.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchSearch;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="page-title flex items-center gap-2">
          <Package className="w-6 h-6 text-brand-600" /> Add-Ons Marketplace
        </h1>
        <p className="page-subtitle">Extend your Biddaro experience with powerful add-ons. Install, manage, and customize your tools.</p>
      </div>

      {/* Installed banner */}
      {installed.length > 0 && (
        <div className="flex items-center gap-3 px-4 py-3 bg-brand-50 border border-brand-100 rounded-xl">
          <Zap className="w-5 h-5 text-brand-600 flex-shrink-0" />
          <div>
            <p className="text-sm font-semibold text-brand-800">
              {installed.length} add-on{installed.length > 1 ? 's' : ''} installed
            </p>
            <p className="text-xs text-brand-600">
              {installed.map((a) => a.name).join(', ')}
            </p>
          </div>
        </div>
      )}

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        {/* Search */}
        <div className="relative flex-1 max-w-xs">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-dark-400" />
          <input
            type="text"
            placeholder="Search add-ons..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 pr-4 py-2 text-sm border border-gray-200 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent"
          />
        </div>
        {/* Category tabs */}
        <div className="flex gap-1.5 flex-wrap">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setCategory(cat)}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
                category === cat
                  ? 'bg-brand-600 text-white'
                  : 'bg-gray-100 text-dark-600 hover:bg-gray-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Grid */}
      {loading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="w-7 h-7 text-brand-500 animate-spin" />
        </div>
      ) : filtered.length === 0 ? (
        <Card padding="lg">
          <div className="flex flex-col items-center py-10 text-center">
            <AlertTriangle className="w-10 h-10 text-dark-300 mb-3" />
            <p className="text-sm font-semibold text-dark-700">No add-ons found</p>
            <p className="text-xs text-dark-400 mt-1">Try a different category or search term</p>
          </div>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {filtered.map((addon) => (
            <AddOnCard
              key={addon.slug}
              addon={addon}
              onInstall={handleInstall}
              onUninstall={handleUninstall}
              loading={actionLoading}
            />
          ))}
        </div>
      )}

      {/* Footer note */}
      <p className="text-xs text-dark-400 text-center pb-4">
        Add-on prices are debited from your Biddaro wallet. Monthly add-ons can be uninstalled at any time.
      </p>
    </div>
  );
}
