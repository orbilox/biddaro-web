'use client';
import React from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import type { User } from '@/types';

// ─── Helpers ──────────────────────────────────────────────────────────────────

function parseArr(v: string | string[] | undefined): string[] {
  if (!v) return [];
  if (Array.isArray(v)) return v;
  try {
    const p = JSON.parse(v);
    return Array.isArray(p) ? p : [];
  } catch {
    return [];
  }
}

// ─── Field definitions ────────────────────────────────────────────────────────

interface FieldDef {
  key: string;
  weight: number;
  label: string;
  filled: (user: User) => boolean;
}

const FIELDS: FieldDef[] = [
  {
    key: 'profileImage',
    weight: 15,
    label: 'Add a profile photo',
    filled: (u) => !!u.profileImage,
  },
  {
    key: 'bio',
    weight: 10,
    label: 'Write a short bio',
    filled: (u) => !!u.bio && u.bio.trim().length > 0,
  },
  {
    key: 'skills',
    weight: 15,
    label: 'Add your skills',
    filled: (u) => parseArr(u.skills).length > 0,
  },
  {
    key: 'hourlyRate',
    weight: 10,
    label: 'Set your hourly rate',
    filled: (u) => typeof u.hourlyRate === 'number' && u.hourlyRate > 0,
  },
  {
    key: 'phone',
    weight: 5,
    label: 'Add phone number',
    filled: (u) => !!u.phone && u.phone.trim().length > 0,
  },
  {
    key: 'portfolio',
    weight: 15,
    label: 'Add portfolio projects',
    filled: (u) => Array.isArray(u.portfolio) && u.portfolio.length > 0,
  },
  {
    key: 'certifications',
    weight: 10,
    label: 'Add certifications',
    filled: (u) => Array.isArray(u.certifications) && u.certifications.length > 0,
  },
  {
    key: 'workHistory',
    weight: 10,
    label: 'Add work history',
    filled: (u) => Array.isArray(u.workHistory) && u.workHistory.length > 0,
  },
  {
    key: 'languages',
    weight: 5,
    label: 'Add languages spoken',
    filled: (u) => parseArr(u.languages).length > 0,
  },
  {
    key: 'licenseNumber',
    weight: 5,
    label: 'Add license/registration number',
    filled: (u) => !!u.licenseNumber && u.licenseNumber.trim().length > 0,
  },
];

// ─── Component ────────────────────────────────────────────────────────────────

interface Props {
  user: User;
}

export function ProfileCompletionCard({ user }: Props) {
  // Calculate completion percentage
  const pct = FIELDS.reduce((sum, f) => sum + (f.filled(user) ? f.weight : 0), 0);

  // Hide when fully complete
  if (pct >= 100) return null;

  // Missing fields sorted by weight descending (most impactful first), show up to 3
  const missing = FIELDS
    .filter((f) => !f.filled(user))
    .sort((a, b) => b.weight - a.weight)
    .slice(0, 3);

  const isNearComplete = pct >= 70;
  const barColor = isNearComplete ? 'bg-green-500' : 'bg-brand-500';
  const textColor = isNearComplete ? 'text-green-600' : 'text-brand-600';

  return (
    <div className="bg-white rounded-2xl border border-gray-200 p-5">
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <div>
          <h3 className="text-sm font-semibold text-dark-900">Complete Your Profile</h3>
          <p className="text-xs text-dark-400 mt-0.5">A complete profile gets 3× more job invitations</p>
        </div>
        <span className={`text-2xl font-bold ${textColor}`}>{pct}%</span>
      </div>

      {/* Progress bar */}
      <div className="h-2 bg-gray-100 rounded-full overflow-hidden mb-4">
        <div
          className={`h-full rounded-full transition-all duration-500 ${barColor}`}
          style={{ width: `${pct}%` }}
        />
      </div>

      {/* Missing items */}
      {missing.length > 0 && (
        <ul className="space-y-1.5 mb-4">
          {missing.map((f) => (
            <li key={f.key} className="flex items-center gap-2 text-xs text-dark-600">
              <span className="w-1.5 h-1.5 rounded-full bg-brand-400 flex-shrink-0" />
              {f.label}
              <span className="ml-auto text-dark-300 font-medium">+{f.weight}%</span>
            </li>
          ))}
        </ul>
      )}

      {/* CTA */}
      <Link href="/profile?tab=edit">
        <Button size="sm" className="w-full">Complete Profile</Button>
      </Link>
    </div>
  );
}
