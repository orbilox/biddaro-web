'use client';
import React, { useState, useRef, useCallback } from 'react';
import Link from 'next/link';
import {
  ArrowLeft, Search, Loader2, AlertTriangle, CheckCircle,
  FileText, MapPin, Calendar, Sparkles, History, X,
} from 'lucide-react';
import { inspectApi } from '@/lib/api';
import { toast } from '@/store/uiStore';

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

function SeverityDot({ severity }: { severity: string }) {
  if (severity === 'critical') return <span className="w-2 h-2 rounded-full bg-red-500 inline-block flex-shrink-0" />;
  if (severity === 'warning')  return <span className="w-2 h-2 rounded-full bg-amber-500 inline-block flex-shrink-0" />;
  return <span className="w-2 h-2 rounded-full bg-green-500 inline-block flex-shrink-0" />;
}

const EXAMPLE_QUERIES = [
  'Which reports have critical structural issues?',
  'Find all water damage or moisture findings',
  'Show reports for projects in the last 30 days',
  'Which projects have the most defects?',
  'Are there any electrical safety concerns?',
  'Find all reports that were client signed',
];

export default function PortfolioSearchPage() {
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<SearchResponse | null>(null);
  const [history, setHistory] = useState<string[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);

  const search = useCallback(async (q: string) => {
    const trimmed = q.trim();
    if (!trimmed) return;
    setLoading(true);
    setResult(null);
    try {
      const res = await inspectApi.searchPortfolio(trimmed);
      const data = (res.data as { data: SearchResponse }).data;
      setResult(data);
      setHistory(prev => [trimmed, ...prev.filter(h => h !== trimmed)].slice(0, 8));
    } catch {
      toast.error('Search failed. Please try again.');
    } finally {
      setLoading(false);
    }
  }, []);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    search(query);
  }

  function runExample(q: string) {
    setQuery(q);
    search(q);
  }

  return (
    <div className="p-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <Link href="/inspect" className="p-2 hover:bg-dark-100 rounded-lg transition-colors text-dark-500">
          <ArrowLeft className="w-4 h-4" />
        </Link>
        <div>
          <h1 className="text-xl font-bold text-dark-900 flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-brand-500" />
            AI Portfolio Search
          </h1>
          <p className="text-sm text-dark-400">Ask anything about your inspection reports</p>
        </div>
      </div>

      {/* Search bar */}
      <form onSubmit={handleSubmit} className="mb-6">
        <div className="relative">
          <div className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none">
            {loading
              ? <Loader2 className="w-5 h-5 text-brand-500 animate-spin" />
              : <Search className="w-5 h-5 text-dark-400" />
            }
          </div>
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Ask a question about your reports…"
            disabled={loading}
            className="w-full pl-12 pr-14 py-4 border-2 border-dark-200 focus:border-brand-400 focus:outline-none rounded-2xl text-sm text-dark-900 placeholder:text-dark-300 bg-white transition-colors shadow-sm disabled:opacity-60"
          />
          {query && (
            <button
              type="button"
              onClick={() => { setQuery(''); setResult(null); inputRef.current?.focus(); }}
              className="absolute right-14 top-1/2 -translate-y-1/2 text-dark-300 hover:text-dark-500 p-1"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          <button
            type="submit"
            disabled={loading || !query.trim()}
            className="absolute right-3 top-1/2 -translate-y-1/2 bg-brand-600 hover:bg-brand-700 disabled:opacity-40 disabled:cursor-not-allowed text-white font-semibold px-3 py-2 rounded-xl text-xs transition-colors"
          >
            Ask
          </button>
        </div>
      </form>

      {/* Results */}
      {result && (
        <div className="space-y-5 mb-8">
          {/* AI answer */}
          <div className="bg-brand-50 border border-brand-200 rounded-2xl p-5">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-full bg-brand-100 border border-brand-300 flex items-center justify-center flex-shrink-0 mt-0.5">
                <Sparkles className="w-4 h-4 text-brand-600" />
              </div>
              <div className="min-w-0">
                <p className="text-sm font-semibold text-brand-900 mb-1">AI Answer</p>
                <p className="text-sm text-brand-800 leading-relaxed">{result.answer}</p>
                <p className="text-xs text-brand-400 mt-2">
                  Searched across {result.totalReports} report{result.totalReports !== 1 ? 's' : ''} in your portfolio
                </p>
              </div>
            </div>
          </div>

          {/* Matching reports */}
          {result.results.length > 0 && (
            <div>
              <h2 className="text-sm font-semibold text-dark-600 mb-3 flex items-center gap-2">
                <FileText className="w-4 h-4" />
                Matching Reports ({result.results.length})
              </h2>
              <div className="space-y-3">
                {result.results.map((r, i) => (
                  <Link
                    key={`${r.reportId}-${i}`}
                    href={`/inspect/reports/${r.reportId}`}
                    className="block bg-white border border-dark-200 hover:border-brand-300 hover:shadow-sm rounded-2xl p-4 transition-all"
                  >
                    <div className="flex items-start justify-between gap-3 mb-2">
                      <div className="min-w-0">
                        <p className="font-semibold text-dark-900 text-sm truncate">{r.reportTitle}</p>
                        <div className="flex items-center gap-3 text-xs text-dark-400 mt-0.5">
                          <span className="flex items-center gap-1">
                            <MapPin className="w-3 h-3" />{r.projectName}
                          </span>
                          <span className="flex items-center gap-1">
                            <Calendar className="w-3 h-3" />
                            {new Date(r.createdAt).toLocaleDateString('en-IN', {
                              day: 'numeric', month: 'short', year: 'numeric',
                            })}
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center gap-1.5 flex-shrink-0">
                        <SeverityDot severity={r.severity} />
                        <span className={`text-xs font-semibold capitalize px-2 py-0.5 rounded-full ${
                          r.severity === 'critical' ? 'bg-red-50 text-red-700' :
                          r.severity === 'warning'  ? 'bg-amber-50 text-amber-700' :
                          'bg-green-50 text-green-700'
                        }`}>
                          {r.severity}
                        </span>
                      </div>
                    </div>
                    {r.section && (
                      <p className="text-xs text-dark-400 mb-1.5">
                        Section: <span className="font-medium text-dark-600">{r.section}</span>
                      </p>
                    )}
                    {r.excerpt && (
                      <p className="text-xs text-dark-600 leading-relaxed bg-dark-50 rounded-xl px-3 py-2 line-clamp-2">
                        {r.excerpt}
                      </p>
                    )}
                  </Link>
                ))}
              </div>
            </div>
          )}

          {result.results.length === 0 && (
            <div className="text-center py-8 text-dark-400">
              <Search className="w-8 h-8 mx-auto mb-2 opacity-30" />
              <p className="text-sm">No specific report matches found, but the AI answer above covers your question.</p>
            </div>
          )}
        </div>
      )}

      {/* Initial state — examples + history */}
      {!result && !loading && (
        <div className="space-y-6">
          {/* Search history */}
          {history.length > 0 && (
            <div>
              <h2 className="text-xs font-semibold text-dark-400 uppercase tracking-wider mb-3 flex items-center gap-1.5">
                <History className="w-3.5 h-3.5" /> Recent Searches
              </h2>
              <div className="flex flex-wrap gap-2">
                {history.map((h, i) => (
                  <button
                    key={i}
                    onClick={() => runExample(h)}
                    className="text-sm text-dark-600 bg-dark-50 hover:bg-dark-100 border border-dark-200 px-3 py-1.5 rounded-xl transition-colors text-left"
                  >
                    {h}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Example queries */}
          <div>
            <h2 className="text-xs font-semibold text-dark-400 uppercase tracking-wider mb-3 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5" /> Example Queries
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {EXAMPLE_QUERIES.map((q, i) => (
                <button
                  key={i}
                  onClick={() => runExample(q)}
                  className="text-sm text-dark-700 bg-white border border-dark-200 hover:border-brand-300 hover:bg-brand-50 rounded-xl px-4 py-3 text-left transition-all leading-snug"
                >
                  <span className="text-brand-400 mr-1.5">→</span>
                  {q}
                </button>
              ))}
            </div>
          </div>

          {/* Feature callout */}
          <div className="bg-dark-800 rounded-2xl p-5 text-white">
            <h3 className="font-bold text-sm mb-1.5 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-yellow-400" />
              Natural Language Portfolio Search
            </h3>
            <p className="text-dark-200 text-xs leading-relaxed">
              Powered by AI, this search reads all your inspection reports and answers questions in plain English.
              Ask about specific defects, projects, severity trends, or compliance issues — no need to remember report names.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
