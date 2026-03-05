'use client';
import React, { useEffect, useState, useCallback } from 'react';
import { Briefcase, Loader2 } from 'lucide-react';
import { JobCard } from '@/components/jobs/JobCard';
import { JobFilters } from '@/components/jobs/JobFilters';
import { EmptyState } from '@/components/shared/EmptyState';
import { jobsApi } from '@/lib/api';
import { toast } from '@/store/uiStore';
import type { Job, JobFilters as JobFiltersType } from '@/types';

const defaultFilters: JobFiltersType = {};

export default function JobsPage() {
  const [filters, setFilters] = useState<JobFiltersType>(defaultFilters);
  const [jobs, setJobs] = useState<Job[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const limit = 12;

  const fetchJobs = useCallback(async (f: JobFiltersType, p: number) => {
    setLoading(true);
    try {
      const params: Record<string, any> = {
        page: p,
        limit,
        status: 'open',
      };
      if (f.search) params.search = f.search;
      if (f.category) params.category = f.category;
      if (f.minBudget !== undefined) params.minBudget = f.minBudget;
      if (f.maxBudget !== undefined) params.maxBudget = f.maxBudget;
      if (f.location) params.location = f.location;

      const res = await jobsApi.list(params);
      const data = res.data.data;
      setJobs(data.data || []);
      setTotal(data.pagination?.total ?? 0);
    } catch (err: any) {
      toast.error('Failed to load jobs', err?.response?.data?.message || 'Please try again.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchJobs(filters, page);
  }, [filters, page, fetchJobs]);

  const handleFiltersChange = (f: JobFiltersType) => {
    setFilters(f);
    setPage(1);
  };

  const handleReset = () => {
    setFilters(defaultFilters);
    setPage(1);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="page-title">Browse Jobs</h1>
        <p className="page-subtitle">Find construction projects that match your skills</p>
      </div>

      <JobFilters filters={filters} onChange={handleFiltersChange} onReset={handleReset} />

      {/* Results header */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-dark-500">
          {loading ? (
            <span className="inline-flex items-center gap-1.5"><Loader2 className="w-3.5 h-3.5 animate-spin" /> Loading…</span>
          ) : (
            <><span className="font-semibold text-dark-900">{total}</span> job{total !== 1 ? 's' : ''} found</>
          )}
        </p>
      </div>

      {/* Results */}
      {loading ? (
        <div className="flex justify-center items-center py-20">
          <Loader2 className="w-8 h-8 text-brand-500 animate-spin" />
        </div>
      ) : jobs.length > 0 ? (
        <>
          <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-4">
            {jobs.map((job) => <JobCard key={job.id} job={job} />)}
          </div>

          {/* Pagination */}
          {total > limit && (
            <div className="flex items-center justify-center gap-2 pt-2">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                className="px-3 py-1.5 text-sm rounded-lg border border-gray-200 disabled:opacity-40 hover:border-brand-300 transition-colors"
              >
                Previous
              </button>
              <span className="text-sm text-dark-500">Page {page} of {Math.ceil(total / limit)}</span>
              <button
                onClick={() => setPage((p) => p + 1)}
                disabled={page * limit >= total}
                className="px-3 py-1.5 text-sm rounded-lg border border-gray-200 disabled:opacity-40 hover:border-brand-300 transition-colors"
              >
                Next
              </button>
            </div>
          )}
        </>
      ) : (
        <EmptyState
          icon={<Briefcase className="w-8 h-8" />}
          title="No jobs found"
          description="Try adjusting your filters to find more opportunities."
          action={{ label: 'Clear Filters', onClick: handleReset }}
        />
      )}
    </div>
  );
}
