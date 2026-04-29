'use client';
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { CheckCircle2, Circle, X, User, Briefcase, Sparkles } from 'lucide-react';
import { useAuthStore } from '@/store/authStore';
import { ROUTES } from '@/lib/constants';

const STORAGE_KEY = 'biddaro_onboarding_dismissed_v1';

interface Step {
  icon: React.ElementType;
  title: string;
  desc: string;
  done: boolean;
  href: string;
  cta: string;
}

export function OnboardingBanner() {
  const { user } = useAuthStore();
  // Start as dismissed to prevent flash of banner on page load
  const [dismissed, setDismissed] = useState(true);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const isDismissed = localStorage.getItem(STORAGE_KEY) === 'true';
    setDismissed(isDismissed);
  }, []);

  const handleDismiss = () => {
    localStorage.setItem(STORAGE_KEY, 'true');
    setDismissed(true);
  };

  if (!mounted || dismissed || !user) return null;

  const isPoster = user.role === 'job_poster';

  // Profile completeness checks
  const hasProfileImage = !!user.profileImage;
  const hasBio         = !!user.bio;
  const hasLocation    = !!user.location;
  const hasSkills      = Array.isArray(user.skills)
    ? user.skills.length > 0
    : typeof user.skills === 'string' && user.skills.length > 0;

  const profileComplete = isPoster
    ? hasProfileImage && hasBio && hasLocation
    : hasProfileImage && hasBio && hasSkills;

  const steps: Step[] = isPoster
    ? [
        {
          icon: User,
          title: 'Complete your profile',
          desc: 'Add a photo, location and bio so contractors know who they\'re working with.',
          done: profileComplete,
          href: ROUTES.PROFILE,
          cta: 'Edit Profile →',
        },
        {
          icon: Briefcase,
          title: 'Post your first job',
          desc: 'Describe your project and start receiving competitive bids instantly.',
          done: false,
          href: ROUTES.JOB_POST,
          cta: 'Post a Job →',
        },
        {
          icon: Sparkles,
          title: 'Try our AI tools',
          desc: 'Get instant cost estimates, Vastu tips, and renovation plans powered by AI.',
          done: false,
          href: '/ai',
          cta: 'Explore AI →',
        },
      ]
    : [
        {
          icon: User,
          title: 'Complete your profile',
          desc: 'Add skills, certifications and a portfolio to stand out and win more bids.',
          done: profileComplete,
          href: ROUTES.PROFILE,
          cta: 'Edit Profile →',
        },
        {
          icon: Briefcase,
          title: 'Find & bid on jobs',
          desc: 'Browse open jobs that match your skills and submit winning proposals.',
          done: false,
          href: ROUTES.FIND_WORK,
          cta: 'Browse Jobs →',
        },
        {
          icon: Sparkles,
          title: 'Go Premium',
          desc: 'Get priority listing, unlimited bids, and advanced analytics to grow faster.',
          done: false,
          href: ROUTES.PREMIUM,
          cta: 'View Plans →',
        },
      ];

  const doneCount = steps.filter((s) => s.done).length;

  // Hide once all steps are done
  if (doneCount === steps.length) return null;

  return (
    <div className="bg-gradient-to-r from-brand-50 to-orange-50 border border-brand-100 rounded-2xl p-5 relative">
      {/* Dismiss button */}
      <button
        onClick={handleDismiss}
        className="absolute top-4 right-4 w-7 h-7 rounded-lg hover:bg-brand-100 flex items-center justify-center text-dark-400 hover:text-dark-600 transition-colors"
        aria-label="Dismiss onboarding banner"
      >
        <X className="w-4 h-4" />
      </button>

      {/* Header */}
      <div className="mb-3 pr-8">
        <p className="text-sm font-bold text-dark-900">
          Welcome to Biddaro, {user.firstName}! 🎉
        </p>
        <p className="text-xs text-dark-500 mt-0.5">
          Complete these steps to get the most out of the platform.
          <span className="ml-2 font-semibold text-brand-600">
            {doneCount}/{steps.length} done
          </span>
        </p>
      </div>

      {/* Progress bar */}
      <div className="h-1.5 bg-brand-100 rounded-full mb-4 overflow-hidden">
        <div
          className="h-full bg-brand-500 rounded-full transition-all duration-500"
          style={{ width: `${(doneCount / steps.length) * 100}%` }}
        />
      </div>

      {/* Steps grid */}
      <div className="grid sm:grid-cols-3 gap-3">
        {steps.map(({ icon: Icon, title, desc, done, href, cta }) => (
          <div
            key={title}
            className={`bg-white rounded-xl border p-4 flex flex-col gap-2 transition-all ${
              done
                ? 'border-green-200 opacity-70'
                : 'border-gray-200 hover:border-brand-200 hover:shadow-sm'
            }`}
          >
            <div className="flex items-start justify-between">
              <div
                className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                  done ? 'bg-green-50' : 'bg-brand-50'
                }`}
              >
                <Icon className={`w-4 h-4 ${done ? 'text-green-500' : 'text-brand-500'}`} />
              </div>
              {done
                ? <CheckCircle2 className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" />
                : <Circle className="w-4 h-4 text-gray-300 flex-shrink-0 mt-0.5" />
              }
            </div>
            <p className="text-xs font-bold text-dark-900">{title}</p>
            <p className="text-xs text-dark-500 leading-relaxed flex-1">{desc}</p>
            {!done && (
              <Link
                href={href}
                className="text-xs font-semibold text-brand-600 hover:text-brand-700 transition-colors mt-1"
              >
                {cta}
              </Link>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
