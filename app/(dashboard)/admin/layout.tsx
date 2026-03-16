'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/authStore';
import { PageLoader } from '@/components/shared/LoadingSpinner';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { user, isAuthenticated } = useAuthStore();
  const router = useRouter();

  useEffect(() => {
    if (!isAuthenticated || !user) {
      router.replace('/login');
      return;
    }
    if (user.role !== 'admin') {
      router.replace('/dashboard');
    }
  }, [isAuthenticated, user, router]);

  if (!isAuthenticated || !user) return <PageLoader />;
  if (user.role !== 'admin') return <PageLoader />;

  return <>{children}</>;
}
