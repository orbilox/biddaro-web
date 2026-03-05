'use client';
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { PlusCircle, ClipboardList, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { JobCard } from '@/components/jobs/JobCard';
import { Tabs, TabList, Tab, TabPanel } from '@/components/ui/Tabs';
import { EmptyState } from '@/components/shared/EmptyState';
import { ROUTES } from '@/lib/constants';
import { jobsApi } from '@/lib/api';
import { toast } from '@/store/uiStore';
import type { Job } from '@/types';

export default function MyJobsPage() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const res = await jobsApi.myJobs();
        const data = res.data.data;
        setJobs(data.data ?? (Array.isArray(data) ? data : []));
      } catch (err: any) {
        toast.error('Failed to load jobs', err?.response?.data?.message || 'Please try again.');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const open = jobs.filter((j) => j.status === 'open');
  const active = jobs.filter((j) => j.status === 'in_progress');
  const completed = jobs.filter((j) => j.status === 'completed');

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="page-title">My Jobs</h1>
          <p className="page-subtitle">Manage your posted projects</p>
        </div>
        <Link href={ROUTES.JOB_POST}>
          <Button size="sm" leftIcon={<PlusCircle className="w-4 h-4" />}>
            Post New Job
          </Button>
        </Link>
      </div>

      {loading ? (
        <div className="flex justify-center py-16">
          <Loader2 className="w-6 h-6 text-brand-500 animate-spin" />
        </div>
      ) : (
        <Tabs defaultValue="open">
          <TabList>
            <Tab value="open" count={open.length}>Open</Tab>
            <Tab value="active" count={active.length}>In Progress</Tab>
            <Tab value="completed" count={completed.length}>Completed</Tab>
          </TabList>

          <div className="mt-5">
            {[
              { value: 'open', jobs: open },
              { value: 'active', jobs: active },
              { value: 'completed', jobs: completed },
            ].map(({ value, jobs: tabJobs }) => (
              <TabPanel key={value} value={value}>
                {tabJobs.length > 0 ? (
                  <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-4">
                    {tabJobs.map((job) => (
                      <JobCard key={job.id} job={job} />
                    ))}
                  </div>
                ) : (
                  <EmptyState
                    icon={<ClipboardList className="w-8 h-8" />}
                    title="No jobs here"
                    description="Post a new job to start receiving bids from qualified contractors."
                    action={{ label: 'Post a Job', onClick: () => {} }}
                  />
                )}
              </TabPanel>
            ))}
          </div>
        </Tabs>
      )}
    </div>
  );
}
