'use client';
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  Plus, FolderOpen, FileText, Camera, Clock, ArrowRight,
  BarChart3, Zap, CheckCircle, AlertTriangle, ClipboardList,
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

function statusColor(status: string) {
  if (status === 'sent' || status === 'approved') return 'bg-green-100 text-green-700';
  if (status === 'review') return 'bg-amber-100 text-amber-700';
  if (status === 'draft') return 'bg-dark-100 text-dark-600';
  if (status === 'active') return 'bg-brand-100 text-brand-700';
  if (status === 'completed') return 'bg-blue-100 text-blue-700';
  return 'bg-dark-100 text-dark-600';
}

export default function InspectDashboard() {
  const [stats, setStats] = useState<DashStats | null>(null);
  const [recentProjects, setRecentProjects] = useState<RecentProject[]>([]);
  const [recentReports, setRecentReports] = useState<RecentReport[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const res = await inspectApi.getDashboard();
        const d = (res.data as { data: { stats: DashStats; recentProjects: RecentProject[]; recentReports: RecentReport[] } }).data;
        setStats(d.stats);
        setRecentProjects(d.recentProjects);
        setRecentReports(d.recentReports);
      } catch {
        toast.error('Failed to load dashboard');
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const statCards = [
    { label: 'Active Projects', value: stats?.activeProjects ?? 0, icon: FolderOpen, color: 'text-brand-600', bg: 'bg-brand-50' },
    { label: 'Total Reports', value: stats?.totalReports ?? 0, icon: FileText, color: 'text-blue-600', bg: 'bg-blue-50' },
    { label: 'Draft Reports', value: stats?.draftReports ?? 0, icon: ClipboardList, color: 'text-amber-600', bg: 'bg-amber-50' },
    { label: 'Field Captures', value: stats?.totalCaptures ?? 0, icon: Camera, color: 'text-purple-600', bg: 'bg-purple-50' },
  ];

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
                { n: '4', text: 'Review, edit, and export as Word or PDF' },
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
