'use client';

import { useEffect, useState, useCallback } from 'react';
import { sitesApi } from '@/lib/api';
import { toast } from '@/store/uiStore';
import {
  Globe, Save, Loader2, Copy, ExternalLink, Crown, MessageCircle,
  Eye, Users, Phone, CheckCircle, Sparkles,
} from 'lucide-react';

interface Site {
  id: string; slug: string; enabled: boolean;
  headline: string | null; about: string | null; services: string | null;
  accentColor: string | null; whatsapp: string | null;
  showReviews: boolean; showPortfolio: boolean;
  isPro: boolean; views: number;
}
interface Lead { id: string; name: string; phone: string; message: string | null; createdAt: string }

function timeAgo(d: string) {
  const mins = Math.floor((Date.now() - new Date(d).getTime()) / 60000);
  if (mins < 60) return `${Math.max(mins, 1)}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  return `${Math.floor(hrs / 24)}d ago`;
}

export default function MySitePage() {
  const [loading, setLoading] = useState(true);
  const [site, setSite]       = useState<Site | null>(null);
  const [tab, setTab]         = useState<'editor' | 'leads'>('editor');
  const [saving, setSaving]   = useState(false);
  const [upgrading, setUpgrading] = useState(false);
  const [leads, setLeads]     = useState<Lead[]>([]);
  const [views, setViews]     = useState(0);

  // form state
  const [slug, setSlug]           = useState('');
  const [headline, setHeadline]   = useState('');
  const [about, setAbout]         = useState('');
  const [services, setServices]   = useState('');
  const [whatsapp, setWhatsapp]   = useState('');
  const [accentColor, setAccent]  = useState('#EA580C');
  const [showReviews, setShowReviews]     = useState(true);
  const [showPortfolio, setShowPortfolio] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await sitesApi.getMine();
      const s: Site | null = res.data.data.site;
      setSite(s);
      if (s) {
        setSlug(s.slug);
        setHeadline(s.headline || '');
        setAbout(s.about || '');
        try { setServices((JSON.parse(s.services || '[]') as string[]).join(', ')); } catch { setServices(''); }
        setWhatsapp(s.whatsapp || '');
        setAccent(s.accentColor || '#EA580C');
        setShowReviews(s.showReviews);
        setShowPortfolio(s.showPortfolio);
      }
    } catch {
      toast.error('Failed to load your site');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  // Razorpay script (for Pro upgrade)
  useEffect(() => {
    if (document.getElementById('rzp-script')) return;
    const s = document.createElement('script');
    s.id = 'rzp-script';
    s.src = 'https://checkout.razorpay.com/v1/checkout.js';
    document.head.appendChild(s);
  }, []);

  async function loadLeads() {
    try {
      const res = await sitesApi.myLeads();
      setLeads(res.data.data.leads);
      setViews(res.data.data.views || 0);
    } catch { /* silent */ }
  }
  useEffect(() => { if (tab === 'leads') loadLeads(); }, [tab]);

  async function save() {
    if (!slug.trim()) { toast.error('Choose a web address (slug) first'); return; }
    setSaving(true);
    try {
      const res = await sitesApi.upsert({
        slug: slug.trim().toLowerCase(),
        headline: headline.trim(),
        about: about.trim(),
        services: services.split(',').map(s => s.trim()).filter(Boolean),
        showReviews, showPortfolio,
        ...(site?.isPro ? { whatsapp: whatsapp.trim(), accentColor } : {}),
      });
      setSite(res.data.data.site);
      toast.success(site ? 'Site saved' : 'Your website is live! 🎉');
    } catch (e: unknown) {
      const msg = (e as { response?: { data?: { message?: string } } })?.response?.data?.message;
      toast.error(msg || 'Save failed');
    } finally {
      setSaving(false);
    }
  }

  async function upgradeToPro() {
    setUpgrading(true);
    try {
      const res = await sitesApi.subscribe();
      const { subscriptionId, key, amount } = res.data.data;
      await new Promise<void>((resolve) => {
        const rzp = new (window as unknown as { Razorpay: new (o: Record<string, unknown>) => { open: () => void } }).Razorpay({
          key,
          subscription_id: subscriptionId,
          name: 'Biddaro Sites Pro',
          description: `₹${(amount / 100).toFixed(0)}/month — WhatsApp button, leads inbox, no branding`,
          theme: { color: '#EA580C' },
          handler: async (r: { razorpay_payment_id: string; razorpay_subscription_id: string; razorpay_signature: string }) => {
            try {
              await sitesApi.verify(r);
              toast.success('Pro activated! 🎉', 'WhatsApp button and leads inbox are now unlocked.');
              await load();
            } catch {
              toast.error('Payment verification failed', 'Contact support if you were charged.');
            }
            resolve();
          },
          modal: { ondismiss: () => resolve() },
        });
        rzp.open();
      });
    } catch (e: unknown) {
      const msg = (e as { response?: { data?: { message?: string } } })?.response?.data?.message;
      toast.error(msg || 'Could not start the upgrade');
    } finally {
      setUpgrading(false);
    }
  }

  const siteUrl = site ? `https://www.biddaro.com/c/${site.slug}` : '';

  if (loading) {
    return <div className="p-6"><div className="h-64 bg-gray-100 rounded-2xl animate-pulse" /></div>;
  }

  return (
    <div className="p-6 max-w-3xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <Globe className="w-6 h-6 text-brand-500" /> My Website
          </h1>
          <p className="text-gray-500 text-sm mt-1">Your free professional website, built from your Biddaro profile.</p>
        </div>
        {site && (
          <div className="flex items-center gap-2">
            <button
              onClick={() => { navigator.clipboard.writeText(siteUrl); toast.success('Link copied'); }}
              className="flex items-center gap-1.5 text-sm text-gray-600 border border-gray-200 rounded-xl px-3 py-1.5 hover:border-brand-300"
            >
              <Copy className="w-3.5 h-3.5" /> Copy link
            </button>
            <a href={`/c/${site.slug}`} target="_blank" rel="noopener noreferrer"
              className="flex items-center gap-1.5 text-sm text-white bg-gray-900 rounded-xl px-3 py-1.5 hover:bg-gray-800">
              <ExternalLink className="w-3.5 h-3.5" /> View site
            </a>
          </div>
        )}
      </div>

      {/* Pro upsell / status */}
      {site && !site.isPro && (
        <div className="rounded-2xl p-5 text-white" style={{ background: 'linear-gradient(135deg,#EA580C,#9A3412)' }}>
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <p className="font-bold flex items-center gap-2"><Crown className="w-5 h-5" /> Upgrade to Sites Pro — ₹199/month</p>
              <ul className="text-sm text-white/90 mt-2 space-y-1">
                <li>• WhatsApp button — clients message you directly</li>
                <li>• Quote-request form + leads inbox</li>
                <li>• Custom brand color, no Biddaro branding</li>
              </ul>
            </div>
            <button onClick={upgradeToPro} disabled={upgrading}
              className="flex items-center gap-2 bg-white text-gray-900 text-sm font-bold rounded-xl px-5 py-3 disabled:opacity-60">
              {upgrading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />} Upgrade Now
            </button>
          </div>
        </div>
      )}
      {site?.isPro && (
        <div className="flex items-center gap-2 text-sm text-green-700 bg-green-50 border border-green-100 rounded-xl px-4 py-3">
          <CheckCircle className="w-4 h-4" /> <span className="font-semibold">Sites Pro active</span> — WhatsApp button, leads inbox, and custom branding unlocked.
        </div>
      )}

      {/* Tabs */}
      {site && (
        <div className="flex items-center gap-2">
          {(['editor', 'leads'] as const).map(t => (
            <button key={t} onClick={() => setTab(t)}
              className={`text-sm px-4 py-2 rounded-xl font-medium ${tab === t ? 'bg-brand-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>
              {t === 'editor' ? 'Edit Site' : 'Leads & Stats'}
            </button>
          ))}
        </div>
      )}

      {/* Editor */}
      {(tab === 'editor' || !site) && (
        <div className="bg-white border border-gray-100 rounded-2xl p-6 space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Web address</label>
            <div className="flex items-center gap-0">
              <span className="text-sm text-gray-400 bg-gray-50 border border-r-0 border-gray-200 rounded-l-xl px-3 py-3">biddaro.com/c/</span>
              <input value={slug} onChange={e => setSlug(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ''))}
                placeholder="rajesh-builders"
                className="flex-1 text-sm border border-gray-200 rounded-r-xl px-3 py-3 focus:outline-none focus:border-brand-400" />
            </div>
            <p className="text-xs text-gray-400 mt-1">Lowercase letters, numbers and hyphens. 3–40 characters.</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Headline</label>
            <input value={headline} onChange={e => setHeadline(e.target.value)}
              placeholder="Quality construction, on time — 15 years of trust"
              className="w-full text-sm border border-gray-200 rounded-xl px-3 py-3 focus:outline-none focus:border-brand-400" />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">About</label>
            <textarea value={about} onChange={e => setAbout(e.target.value)} rows={4}
              placeholder="Tell clients about your work, your team, and what makes you reliable…"
              className="w-full text-sm border border-gray-200 rounded-xl px-3 py-3 focus:outline-none focus:border-brand-400" />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Services (comma separated)</label>
            <input value={services} onChange={e => setServices(e.target.value)}
              placeholder="House Construction, Renovation, Tiling, Waterproofing"
              className="w-full text-sm border border-gray-200 rounded-xl px-3 py-3 focus:outline-none focus:border-brand-400" />
          </div>

          <div className="flex flex-wrap gap-6">
            <label className="flex items-center gap-2 text-sm text-gray-700">
              <input type="checkbox" checked={showPortfolio} onChange={e => setShowPortfolio(e.target.checked)} className="rounded" />
              Show portfolio
            </label>
            <label className="flex items-center gap-2 text-sm text-gray-700">
              <input type="checkbox" checked={showReviews} onChange={e => setShowReviews(e.target.checked)} className="rounded" />
              Show reviews
            </label>
          </div>

          {/* Pro fields */}
          <div className={`rounded-xl border p-4 space-y-4 ${site?.isPro ? 'border-gray-200' : 'border-dashed border-gray-300 bg-gray-50'}`}>
            <p className="text-xs font-semibold text-gray-500 flex items-center gap-1.5">
              <Crown className="w-3.5 h-3.5 text-brand-500" /> PRO FEATURES {!site?.isPro && '— upgrade to unlock'}
            </p>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5 flex items-center gap-1.5">
                <MessageCircle className="w-4 h-4 text-green-600" /> WhatsApp number
              </label>
              <input value={whatsapp} onChange={e => setWhatsapp(e.target.value)} disabled={!site?.isPro}
                placeholder="+91 98765 43210"
                className="w-full text-sm border border-gray-200 rounded-xl px-3 py-3 focus:outline-none focus:border-brand-400 disabled:bg-gray-100 disabled:text-gray-400" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Brand color</label>
              <input type="color" value={accentColor} onChange={e => setAccent(e.target.value)} disabled={!site?.isPro}
                className="h-10 w-20 rounded cursor-pointer disabled:opacity-40" />
            </div>
          </div>

          <button onClick={save} disabled={saving}
            className="w-full flex items-center justify-center gap-2 bg-brand-600 text-white text-sm font-semibold rounded-xl py-3.5 hover:bg-brand-700 disabled:opacity-60">
            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            {site ? 'Save changes' : 'Publish my website'}
          </button>
        </div>
      )}

      {/* Leads & stats */}
      {tab === 'leads' && site && (
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-white border border-gray-100 rounded-2xl p-4">
              <div className="inline-flex p-2 rounded-xl bg-blue-50 text-blue-600 mb-2"><Eye className="w-4 h-4" /></div>
              <p className="text-2xl font-bold text-gray-900">{views}</p>
              <p className="text-xs text-gray-500">Site views</p>
            </div>
            <div className="bg-white border border-gray-100 rounded-2xl p-4">
              <div className="inline-flex p-2 rounded-xl bg-green-50 text-green-600 mb-2"><Users className="w-4 h-4" /></div>
              <p className="text-2xl font-bold text-gray-900">{leads.length}</p>
              <p className="text-xs text-gray-500">Quote requests</p>
            </div>
          </div>

          <div className="bg-white border border-gray-100 rounded-2xl overflow-hidden">
            <div className="px-4 py-3 border-b border-gray-50">
              <p className="text-sm font-semibold text-gray-700">Quote Requests</p>
            </div>
            {!site.isPro ? (
              <p className="text-sm text-gray-400 text-center py-10">Upgrade to Pro to receive quote requests from your site.</p>
            ) : leads.length === 0 ? (
              <p className="text-sm text-gray-400 text-center py-10">No requests yet — share your site link to get leads.</p>
            ) : (
              <div className="divide-y divide-gray-50">
                {leads.map(l => (
                  <div key={l.id} className="px-4 py-3 flex items-start justify-between gap-3">
                    <div>
                      <p className="text-sm font-semibold text-gray-800">{l.name}</p>
                      <a href={`tel:${l.phone}`} className="text-xs text-brand-600 flex items-center gap-1 mt-0.5">
                        <Phone className="w-3 h-3" /> {l.phone}
                      </a>
                      {l.message && <p className="text-xs text-gray-500 mt-1">{l.message}</p>}
                    </div>
                    <span className="text-xs text-gray-400 whitespace-nowrap">{timeAgo(l.createdAt)}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
