'use client';
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { useAuthStore } from '@/store/authStore';
import { PageLoader } from '@/components/shared/LoadingSpinner';
import { ROUTES } from '@/lib/constants';
import { usePushNotifications } from '@/hooks/usePushNotifications';
import { PushNotificationBanner } from '@/components/notifications/PushNotificationBanner';

export default function Layout({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useAuthStore();
  const router = useRouter();
  usePushNotifications();

  // `mounted` becomes true only after the first paint — by which point Zustand
  // has already rehydrated from localStorage (microtask) and `isAuthenticated`
  // reflects the real stored value. This avoids the refresh-to-login race.
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted && !isAuthenticated) {
      router.replace(ROUTES.LOGIN);
    }
  }, [mounted, isAuthenticated, router]);

  // Still in first-paint / Zustand rehydrating — show loader, never redirect
  if (!mounted || !isAuthenticated) return <PageLoader />;

  return (
    <>
      <DashboardLayout>{children}</DashboardLayout>
      <PushNotificationBanner />
    </>
  );
}
