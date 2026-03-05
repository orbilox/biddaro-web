'use client';
import React from 'react';
import { Search, Filter, X, SlidersHorizontal } from 'lucide-react';
import { Input, Select } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { JOB_CATEGORIES, BUDGET_RANGES, SORT_OPTIONS } from '@/lib/constants';
import { JobFilters as JobFiltersType } from '@/types';

interface JobFiltersProps {
  filters: JobFiltersType;
  onChange: (filters: JobFiltersType) => void;
  onReset: () => void;
}

export function JobFilters({ filters, onChange, onReset }: JobFiltersProps) {
  const hasActiveFilters = !!(
    filters.search || filters.category || filters.minBudget || filters.location
  );

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-4 space-y-4">
      {/* Search */}
      <Input
        placeholder="Search jobs by title or keyword…"
        leftIcon={<Search className="w-4 h-4" />}
        value={filters.search ?? ''}
        onChange={(e) => onChange({ ...filters, search: e.target.value })}
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {/* Category */}
        <Select
          placeholder="All Categories"
          value={filters.category ?? ''}
          onChange={(e) => onChange({ ...filters, category: e.target.value || undefined })}
          options={JOB_CATEGORIES.map((c) => ({ label: c, value: c }))}
        />

        {/* Budget */}
        <Select
          placeholder="Any Budget"
          value={filters.minBudget ? `${filters.minBudget}` : ''}
          onChange={(e) => {
            const range = BUDGET_RANGES.find((r) => String(r.min) === e.target.value);
            onChange({
              ...filters,
              minBudget: range?.min,
              maxBudget: range?.max ?? undefined,
            });
          }}
          options={BUDGET_RANGES.map((r) => ({ label: r.label, value: String(r.min) }))}
        />

        {/* Location */}
        <Input
          placeholder="Location…"
          value={filters.location ?? ''}
          onChange={(e) => onChange({ ...filters, location: e.target.value || undefined })}
        />

        {/* Sort */}
        <Select
          placeholder="Sort By"
          value={filters.sortBy ? `${filters.sortBy}:${filters.sortOrder}` : ''}
          onChange={(e) => {
            const [sortBy, sortOrder] = e.target.value.split(':') as [typeof filters.sortBy, typeof filters.sortOrder];
            onChange({ ...filters, sortBy, sortOrder });
          }}
          options={SORT_OPTIONS.map((s) => ({ label: s.label, value: s.value }))}
        />
      </div>

      {hasActiveFilters && (
        <div className="flex items-center justify-between">
          <p className="text-xs text-dark-400">Filters applied</p>
          <Button variant="ghost" size="xs" leftIcon={<X className="w-3.5 h-3.5" />} onClick={onReset}>
            Clear all
          </Button>
        </div>
      )}
    </div>
  );
}
