'use client';
import React from 'react';
import Link from 'next/link';
import { MapPin, DollarSign, Users, ChevronRight } from 'lucide-react';
import { Job } from '@/types';
import { formatCurrency, timeAgo, getStatusColor, getStatusLabel } from '@/lib/utils';
import { Badge } from '@/components/ui/Badge';
import { Avatar } from '@/components/ui/Avatar';
import { ROUTES } from '@/lib/constants';

interface JobCardProps {
  job: Job;
  compact?: boolean;
}

export function JobCard({ job, compact }: JobCardProps) {
  const statusColor = getStatusColor(job.status);
  const statusLabel = getStatusLabel(job.status);

  if (compact) {
    return (
      <Link
        href={ROUTES.JOB_DETAIL(job.id)}
        className="flex items-center gap-4 p-4 bg-white rounded-xl border border-gray-200 hover:border-brand-300 hover:shadow-card-hover transition-all duration-200 group"
      >
        <div className="w-10 h-10 rounded-lg bg-brand-50 flex items-center justify-center flex-shrink-0">
          <span className="text-lg">{getCategoryEmoji(job.category)}</span>
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-dark-900 truncate group-hover:text-brand-600 transition-colors">
            {job.title}
          </p>
          <div className="flex items-center gap-3 mt-0.5">
            <span className="text-xs text-dark-400 flex items-center gap-1">
              <MapPin className="w-3 h-3" /> {job.location}
            </span>
            <span className="text-xs font-medium text-brand-600">{formatCurrency(job.budget)}</span>
          </div>
        </div>
        <ChevronRight className="w-4 h-4 text-dark-300 group-hover:text-brand-500 transition-colors flex-shrink-0" />
      </Link>
    );
  }

  return (
    <Link href={ROUTES.JOB_DETAIL(job.id)} className="block group">
      <div className="bg-white rounded-xl border border-gray-200 p-5 hover:border-brand-300 hover:shadow-card-hover transition-all duration-200">
        {/* Header */}
        <div className="flex items-start justify-between gap-4 mb-3">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-xl bg-brand-50 border border-brand-100 flex items-center justify-center flex-shrink-0 text-xl">
              {getCategoryEmoji(job.category)}
            </div>
            <div>
              <h3 className="font-semibold text-dark-900 group-hover:text-brand-600 transition-colors leading-snug">
                {job.title}
              </h3>
              <div className="flex items-center gap-1.5 mt-0.5">
                <span className={`inline-flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-full ${statusColor}`}>
                  <span className="w-1.5 h-1.5 rounded-full bg-current opacity-70" />
                  {statusLabel}
                </span>
                <Badge variant="default" size="sm">{job.category}</Badge>
              </div>
            </div>
          </div>
          <div className="text-right flex-shrink-0">
            <p className="text-xl font-bold text-dark-900">{formatCurrency(job.budget)}</p>
            <p className="text-xs text-dark-400">Budget</p>
          </div>
        </div>

        {/* Description */}
        <p className="text-sm text-dark-500 leading-relaxed line-clamp-2 mb-4">
          {job.description}
        </p>

        {/* Meta */}
        <div className="flex items-center flex-wrap gap-4 text-xs text-dark-400">
          <span className="flex items-center gap-1.5">
            <MapPin className="w-3.5 h-3.5 text-dark-300" />
            {job.location}
          </span>
<span className="flex items-center gap-1.5">
            <Users className="w-3.5 h-3.5 text-dark-300" />
            {job.bidCount ?? 0} bids
          </span>
          <span className="ml-auto">{timeAgo(job.createdAt)}</span>
        </div>

        {/* Poster */}
        {job.poster && (
          <div className="flex items-center gap-2 mt-4 pt-4 border-t border-gray-100">
            <Avatar
              src={job.poster.profileImage}
              firstName={job.poster.firstName}
              lastName={job.poster.lastName}
              size="xs"
            />
            <span className="text-xs text-dark-500">
              {job.poster.firstName} {job.poster.lastName}
            </span>
            {job.poster.isVerified && (
              <span className="text-xs text-brand-500 font-medium ml-auto">✓ Verified</span>
            )}
          </div>
        )}
      </div>
    </Link>
  );
}

function getCategoryEmoji(category: string): string {
  const map: Record<string, string> = {
    'General Construction': '🏗️',
    'Plumbing': '🔧',
    'Electrical': '⚡',
    'HVAC': '🌡️',
    'Roofing': '🏠',
    'Flooring': '🪵',
    'Painting': '🎨',
    'Landscaping': '🌿',
    'Carpentry': '🪚',
    'Masonry': '🧱',
    'Demolition': '⛏️',
    'Renovation': '🔨',
    'New Construction': '🏢',
    'Foundation': '🏛️',
    'Concrete': '🪨',
    'Other': '🔩',
  };
  return map[category] ?? '🔩';
}
