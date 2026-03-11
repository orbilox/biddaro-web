'use client';
import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { useAuthStore } from '@/store/authStore';
import { PageLoader } from '@/components/shared/LoadingSpinner';
import { ROUTES } from '@/lib/constants';

export default function Layout({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, _hasHydrated } = useAuthStore();
  const router = useRouter();

  useEffect(() => {
    // Only redirect AFTER Zustand has finished loading from localStorage.
    // Without this guard, a page refresh would always redirect to /login
    // because isAuthenticated is false for the brief moment before rehydration.
    if (_hasHydrated && !isAuthenticated) {
      router.replace(ROUTES.LOGIN);
    }
  }, [_hasHydrated, isAuthenticated, router]);

  // Still reading from localStorage — show loader, never redirect
  if (!_hasHydrated) return <PageLoader />;

  // Rehydrated but not logged in — redirect is already triggered above
  if (!isAuthenticated) return <PageLoader />;

  return <DashboardLayout>{children}</DashboardLayout>;
}
