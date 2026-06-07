'use client';
import React, { useEffect, useState, useRef } from 'react';
import Link from 'next/link';
import {
  Plus, FolderOpen, FileText, Camera, Clock, ArrowRight,
  Zap, ClipboardList, Sparkles, Send, AlertTriangle,
  CheckCircle, Search, Loader2, X, CalendarDays, MapPin,
} from 'lucide-react';
import { inspectApi } from '@/lib/api';
import { toast } from '@/store/uiStore';

interface DashStats {
  totalProjects: number;
  activeProjects: number;
  totalReports: number;
  draftReports: number;
  totalCaptures: number;
}

interface UpcomingSchedule {
  id: string;
  title: string;
  scheduledAt: string;
  notes: string | null;
  status: string;
  project: { id: string; name: string; location: string | null };
}

interface RecentProject {
  id: string;
  name: string;
  location: string | null;
  status: string;
  updatedAt: string;
  _count: { captures: number; reports: number };
}

interface RecentReport {
  id: string;
  title: string;
  status: string;
  createdAt: string;
  project: { name: string };
}

interface SearchResult {
  reportId: string;
  reportTitle: string;
  projectName: string;
  projectId: string;
  section: string;
  excerpt: string;
  severity: string;
  createdAt: string;
}

interface SearchResponse {
  answer: string;
  results: SearchResult[];
  totalReports: number;
}

function statusColor(status: string) {
  if (status === 'sent' || status === 'approved') return 'bg-green-100 text-green-700';
  if (status === 'review') return 'bg-amber-100 text-amber-700';
  if (status === 'draft') return 'bg-dark-100 text-dark-600';
  if (status === 'active') return 'bg-brand-100 text-brand-700';
  if (status === 'completed') return 'bg-blue-100 text-blue-700';
  return 'bg-dark-100 text-dark-600';
}

function severityIcon(severity: string) {
  if (severity === 'critical') return <AlertTriangle className="w-3.5 h-3.5 text-red-500" />;
  if (severity === 'warning') return <AlertTriangle className="w-3.5 h-3.5 text-amber-500" />;
  return <CheckCircle className="w-3.5 h-3.5 text-green-500" />;
}

// ── AI Portfolio Search Panel ──────────────────────────────────────────────────

const SUGGESTED_QUERIES = [
  'Find all reports with critical issues',
  'Which projects have water damage findings?',
  'Show reports sent to clients this month',
  'List all structural defects found',
];

function PortfolioSearch({ hasReports }: { hasReports: boolean }) {
  const [query, setQuery] = useState('');
  const [searching, setSearching] = useState(false);
  const [response, setResponse] = useState<SearchResponse | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  async function runSearch(q?: string) {
    const finalQuery = (q ?? query).trim();
    if (!finalQuery) return;
    setQuery(finalQuery);
    setSearching(true);
    setResponse(null);
    try {
      const res = await inspectApi.searchPortfolio(finalQuery);
      setResponse((res.data as { data: SearchResponse }).data);
    } catch {
      toast.error('Search failed — please try again');
    } finally {
      setSearching(false);
    }
  }

  function handleKey(e: React.KeyboardEvent) {
    if (e.key === 'Enter') runSearch();
  }

  return (
    <div className="bg-dark-900 rounded-2xl p-6 mb-8">
      {/* Header */}
      <div className="flex items-center gap-3 mb-4">
        <div className="w-8 h-8 rounded-lg bg-brand-500/20 flex items-center justify-center">
          <Sparkles className="w-4 h-4 text-brand-400" />
        </div>
        <div>
          <p className="font-bold text-white text-sm">Portfolio Assistant</p>
          <p className="text-dark-400 text-xs">Ask anything about your inspection reports</p>
        </div>
      </div>

      {/* Search input */}
      <div className="flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-dark-400" />
          <input
            ref={inputRef}
            value={query}
            onChange={e => setQuery(e.target.value)}
            onKeyDown={handleKey}
            placeholder={hasReports ? 'Find all reports with water damage…' : 'Generate your first report to start searching'}
            disabled={!hasReports || searching}
            className="w-full bg-dark-800 border border-dark-700 rounded-xl pl-10 pr-4 py-3 text-sm text-white placeholder-dark-500 focus:outline-none focus:border-brand-500 disabled:opacity-50"
          />
          {query && (
            <button
              onClick={() => { setQuery(''); setResponse(null); }}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-dark-500 hover:text-dark-300"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
        <button
          onClick={() => runSearch()}
          disabled={!hasReports || searching || !query.trim()}
          className="flex items-center gap-2 bg-brand-600 hover:bg-brand-500 disabled:opacity-40 text-white font-semibold px-5 py-3 rounded-xl transition-colors"
        >
          {searching ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
        </button>
      </div>

      {/* Suggested queries */}
      {!response && !searching && hasReports && (
        <div className="flex flex-wrap gap-2 mt-3">
          {SUGGESTED_QUERIES.map(q => (
            <button
              key={q}
              onClick={() => runSearch(q)}
              className="text-xs text-dark-400 hover:text-brand-400 bg-dark-800 hover:bg-dark-700 border border-dark-700 px-3 py-1.5 rounded-lg transition-colors"
            >
              {q}
            </button>
          ))}
        </div>
      )}

      {/* Loading */}
      {searching && (
        <div className="mt-4 flex items-center gap-3 text-dark-400 text-sm">
          <Loader2 className="w-4 h-4 animate-spin text-brand-500" />
          Searching {response === null ? 'your portfolio' : ''}…
        </div>
      )}

      {/* Results */}
      {response && !searching && (
        <div className="mt-5 space-y-4">
          {/* AI Answer */}
          <div className="bg-dark-800 border border-dark-700 rounded-xl p-4">
            <div className="flex items-start gap-2.5">
              <Sparkles className="w-4 h-4 text-brand-400 flex-shrink-0 mt-0.5" />
              <p className="text-white text-sm leading-relaxed">{response.answer}</p>
            </div>
            <p className="text-dark-500 text-xs mt-2">Searched {response.totalReports} report{response.totalReports !== 1 ? 's' : ''}</p>
          </div>

          {/* Matched reports */}
          {response.results.length > 0 && (
            <div className="space-y-2">
              {response.results.map((r, i) => (
                <Link
                  key={`${r.reportId}-${i}`}
                  href={`/inspect/reports/${r.reportId}`}
                  className="block bg-dark-800 hover:bg-dark-700 border border-dark-700 rounded-xl p-4 transition-colors group"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        {severityIcon(r.severity)}
                        <p className="font-semibold text-white text-sm truncate">{r.reportTitle}</p>
                      </div>
                      <p className="text-dark-400 text-xs mb-1.5">{r.projectName} · {r.section}</p>
                      {r.excerpt && (
                        <p className="text-dark-300 text-xs leading-relaxed italic">
                          &ldquo;{r.excerpt.slice(0, 180)}{r.excerpt.length > 180 ? '…' : ''}&rdquo;
                        </p>
                      )}
                    </div>
                    <ArrowRight className="w-4 h-4 text-dark-600 group-hover:text-brand-400 flex-shrink-0 transition-colors mt-0.5" />
                  </div>
                </Link>
              ))}
            </div>
          )}

          {response.results.length === 0 && (
            <p className="text-dark-500 text-sm text-center py-2">No specific reports matched — see the answer above.</p>
          )}
        </div>
      )}
    </div>
  );
}

// ── Dashboard ─────────────────────────────────────────────────────────────────

export default function InspectDashboard() {
  const [stats, setStats] = useState<DashStats | null>(null);
  const [recentProjects, setRecentProjects] = useState<RecentProject[]>([]);
  const [recentReports, setRecentReports] = useState<RecentReport[]>([]);
  const [loading, setLoading] = useState(true);
  const [upcomingSchedules, setUpcomingSchedules] = useState<UpcomingSchedule[]>([]);

  useEffect(() => {
    (async () => {
      try {
        const [dashRes, schedRes] = await Promise.all([
          inspectApi.getDashboard(),
          inspectApi.listUpcomingSchedules(),
        ]);
        const d = (dashRes.data as { data: { stats: DashStats; recentProjects: RecentProject[]; recentReports: RecentReport[] } }).data;
        setStats(d.stats);
        setRecentProjects(d.recentProjects);
        setRecentReports(d.recentReports);
        const s = (schedRes.data as { data: { schedules: UpcomingSchedule[] } }).data;
        setUpcomingSchedules(s.schedules ?? []);
      } catch {
        toast.error('Failed to load dashboard');
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const statCards = [
    { label: 'Active Projects', value: stats?.activeProjects ?? 0, icon: FolderOpen, color: 'text-brand-600', bg: 'bg-brand-50' },
    { label: 'Total Reports',   value: stats?.totalReports ?? 0,   icon: FileText,   color: 'text-blue-600',  bg: 'bg-blue-50'  },
    { label: 'Draft Reports',   value: stats?.draftReports ?? 0,   icon: ClipboardList, color: 'text-amber-600', bg: 'bg-amber-50' },
    { label: 'Field Captures',  value: stats?.totalCaptures ?? 0,  icon: Camera,     color: 'text-purple-600', bg: 'bg-purple-50' },
  ];

  const hasReports = (stats?.totalReports ?? 0) > 0;

  return (
    <div className="p-6 max-w-6xl mx-auto">

      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-dark-900 flex items-center gap-2">
            📋 Biddaro Inspect
          </h1>
          <p className="text-dark-500 text-sm mt-1">AI-powered inspection reports from field capture</p>
        </div>
        <Link
          href="/inspect/projects/new"
          className="inline-flex items-center gap-2 bg-brand-600 hover:bg-brand-700 text-white font-semibold px-5 py-2.5 rounded-xl transition-colors"
        >
          <Plus className="w-4 h-4" /> New Project
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {statCards.map(({ label, value, icon: Icon, color, bg }) => (
          <div key={label} className="bg-white border border-dark-100 rounded-xl p-5">
            <div className={`w-9 h-9 rounded-lg ${bg} flex items-center justify-center mb-3`}>
              <Icon className={`w-5 h-5 ${color}`} />
            </div>
            <p className="text-2xl font-bold text-dark-900">{loading ? '—' : value}</p>
            <p className="text-dark-500 text-xs mt-0.5">{label}</p>
          </div>
        ))}
      </div>

      {/* Quick links */}
      <div className="grid grid-cols-2 md:grid-cols-6 gap-3 mb-8">
        {[
          { href: '/inspect/projects', label: 'All Projects', emoji: '🏗️', desc: 'Browse & manage' },
          { href: '/inspect/reports',  label: 'All Reports',  emoji: '📄', desc: 'Review & export' },
          { href: '/inspect/analytics',label: 'Analytics',    emoji: '📊', desc: 'Trends & insights' },
          { href: '/inspect/compare',  label: 'Compare',      emoji: '🔀', desc: 'Delta analysis' },
          { href: '/inspect/search',   label: 'AI Search',    emoji: '✨', desc: 'Ask your portfolio' },
          { href: '/inspect/settings', label: 'Settings',     emoji: '⚙️', desc: 'Inspector profile' },
        ].map(item => (
          <Link key={item.href} href={item.href}
            className="bg-white border border-dark-100 rounded-xl p-4 hover:border-brand-300 hover:shadow-sm transition-all group"
          >
            <div className="text-2xl mb-1">{item.emoji}</div>
            <p className="text-sm font-semibold text-dark-800 group-hover:text-brand-700">{item.label}</p>
            <p className="text-xs text-dark-400">{item.desc}</p>
          </Link>
        ))}
      </div>

      {/* AI Portfolio Search */}
      {!loading && <PortfolioSearch hasReports={hasReports} />}

      {/* Recent grids */}
      <div className="grid md:grid-cols-2 gap-6">

        {/* Recent Projects */}
        <div className="bg-white border border-dark-100 rounded-2xl overflow-hidden">
          <div className="flex items-center justify-between px-5 py-4 border-b border-dark-100">
            <h2 className="font-bold text-dark-900">Recent Projects</h2>
            <Link href="/inspect/projects" className="text-xs text-brand-600 hover:underline font-medium">
              View all
            </Link>
          </div>
          {loading ? (
            <div className="p-5 space-y-3">
              {[1, 2, 3].map(i => <div key={i} className="h-14 bg-dark-50 animate-pulse rounded-lg" />)}
            </div>
          ) : recentProjects.length === 0 ? (
            <div className="p-8 text-center text-dark-400">
              <FolderOpen className="w-8 h-8 mx-auto mb-2 opacity-30" />
              <p className="text-sm">No projects yet</p>
              <Link href="/inspect/projects/new" className="text-brand-600 text-sm hover:underline mt-1 block">
                Create your first project →
              </Link>
            </div>
          ) : (
            <div className="divide-y divide-dark-50">
              {recentProjects.map(p => (
                <Link
                  key={p.id}
                  href={`/inspect/projects/${p.id}`}
                  className="flex items-center justify-between px-5 py-3.5 hover:bg-dark-50 transition-colors"
                >
                  <div className="min-w-0 flex-1">
                    <p className="font-medium text-dark-800 text-sm truncate">{p.name}</p>
                    <p className="text-xs text-dark-400 mt-0.5">
                      {p._count.captures} captures · {p._count.reports} reports
                      {p.location && ` · ${p.location}`}
                    </p>
                  </div>
                  <div className="flex items-center gap-2 ml-3">
                    <span className={`text-xs font-semibold px-2 py-0.5 rounded-full capitalize ${statusColor(p.status)}`}>{p.status}</span>
                    <ArrowRight className="w-4 h-4 text-dark-300" />
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>

        {/* Recent Reports */}
        <div className="bg-white border border-dark-100 rounded-2xl overflow-hidden">
          <div className="flex items-center justify-between px-5 py-4 border-b border-dark-100">
            <h2 className="font-bold text-dark-900">Recent Reports</h2>
          </div>
          {loading ? (
            <div className="p-5 space-y-3">
              {[1, 2, 3].map(i => <div key={i} className="h-14 bg-dark-50 animate-pulse rounded-lg" />)}
            </div>
          ) : recentReports.length === 0 ? (
            <div className="p-8 text-center text-dark-400">
              <FileText className="w-8 h-8 mx-auto mb-2 opacity-30" />
              <p className="text-sm">No reports generated yet</p>
              <p className="text-xs mt-1">Add field captures to a project and generate your first AI report.</p>
            </div>
          ) : (
            <div className="divide-y divide-dark-50">
              {recentReports.map(r => (
                <Link
                  key={r.id}
                  href={`/inspect/reports/${r.id}`}
                  className="flex items-center justify-between px-5 py-3.5 hover:bg-dark-50 transition-colors"
                >
                  <div className="min-w-0 flex-1">
                    <p className="font-medium text-dark-800 text-sm truncate">{r.title}</p>
                    <p className="text-xs text-dark-400 mt-0.5">{r.project.name}</p>
                  </div>
                  <div className="flex items-center gap-2 ml-3">
                    <span className={`text-xs font-semibold px-2 py-0.5 rounded-full capitalize ${statusColor(r.status)}`}>{r.status}</span>
                    <ArrowRight className="w-4 h-4 text-dark-300" />
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Upcoming Scheduled Inspections */}
      {upcomingSchedules.length > 0 && (
        <div className="bg-white border border-dark-100 rounded-2xl overflow-hidden shadow-sm mb-8">
          <div className="flex items-center justify-between px-5 py-4 border-b border-dark-50">
            <div className="flex items-center gap-2">
              <CalendarDays className="w-4 h-4 text-brand-500" />
              <h2 className="font-bold text-dark-900 text-sm">Upcoming Inspections</h2>
              <span className="text-xs bg-brand-50 text-brand-700 font-semibold px-2 py-0.5 rounded-full">
                {upcomingSchedules.length}
              </span>
            </div>
          </div>
          <div className="divide-y divide-dark-50">
            {upcomingSchedules.map(s => {
              const dt = new Date(s.scheduledAt);
              const isToday = new Date().toDateString() === dt.toDateString();
              const isTomorrow = new Date(Date.now() + 86400000).toDateString() === dt.toDateString();
              const dayLabel = isToday ? 'Today' : isTomorrow ? 'Tomorrow'
                : dt.toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'short' });
              const timeStr = dt.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' });
              return (
                <Link
                  key={s.id}
                  href={`/inspect/projects/${s.project.id}`}
                  className="flex items-center gap-4 px-5 py-3.5 hover:bg-dark-50 transition-colors"
                >
                  <div className={`flex-shrink-0 w-12 h-12 rounded-xl flex flex-col items-center justify-center text-center ${isToday ? 'bg-brand-600 text-white' : 'bg-dark-50 text-dark-700'}`}>
                    <span className={`text-xs font-semibold leading-none ${isToday ? 'text-brand-100' : 'text-dark-400'}`}>{dayLabel.split(' ')[0]}</span>
                    <span className="text-base font-bold leading-tight">{isToday || isTomorrow ? timeStr : dayLabel.split(' ').slice(1).join(' ')}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-dark-900 text-sm truncate">{s.title}</p>
                    <div className="flex items-center gap-2 text-xs text-dark-400 mt-0.5">
                      <span>{s.project.name}</span>
                      {s.project.location && (
                        <>
                          <span>·</span>
                          <span className="flex items-center gap-0.5">
                            <MapPin className="w-3 h-3" />{s.project.location}
                          </span>
                        </>
                      )}
                    </div>
                    {(isToday || isTomorrow) && (
                      <p className="text-xs text-dark-400 mt-0.5">{isToday ? 'Today' : 'Tomorrow'} at {timeStr}</p>
                    )}
                  </div>
                  <ArrowRight className="w-4 h-4 text-dark-300 flex-shrink-0" />
                </Link>
              );
            })}
          </div>
        </div>
      )}

      {/* Quick start if empty */}
      {!loading && (stats?.totalProjects ?? 0) === 0 && (
        <div className="mt-8 bg-gradient-to-br from-brand-50 to-white border border-brand-100 rounded-2xl p-8">
          <div className="max-w-lg">
            <div className="flex items-center gap-2 text-brand-600 font-bold text-sm mb-3">
              <Zap className="w-4 h-4" /> Get started in 4 steps
            </div>
            <h3 className="text-xl font-bold text-dark-900 mb-4">Set up your first inspection project</h3>
            <div className="space-y-3">
              {[
                { n: '1', text: 'Create a project with client details' },
                { n: '2', text: 'Add field captures — photos, voice notes, or typed observations' },
                { n: '3', text: 'Click "Generate AI Report" — ready in seconds' },
                { n: '4', text: 'Review, edit, and export as Word document' },
              ].map(({ n, text }) => (
                <div key={n} className="flex items-center gap-3">
                  <span className="w-6 h-6 rounded-full bg-brand-600 text-white text-xs font-bold flex items-center justify-center flex-shrink-0">{n}</span>
                  <p className="text-dark-700 text-sm">{text}</p>
                </div>
              ))}
            </div>
            <Link
              href="/inspect/projects/new"
              className="inline-flex items-center gap-2 bg-brand-600 hover:bg-brand-700 text-white font-semibold px-6 py-3 rounded-xl transition-colors mt-6"
            >
              <Plus className="w-4 h-4" /> Create First Project
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
