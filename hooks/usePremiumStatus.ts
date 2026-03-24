'use client';

import { useMemo } from 'react';
import { useAuthStore } from '@/store/authStore';

/**
 * Reusable hook that checks whether the current user has an active premium subscription.
 *
 * Priority:
 *  1. `user.isPremium` from the backend (auth store)
 *  2. Fallback: localStorage key `biddaro_premium_sub_${userId}` with expiry validation
 *     (covers the simulated‑subscription path used when the premium API is unavailable)
 */
export function usePremiumStatus(): boolean {
  const user = useAuthStore((s) => s.user);

  return useMemo(() => {
    if (!user) return false;

    // ── 1. Backend field ──────────────────────────────────────────────────────
    if (user.isPremium) return true;

    // ── 2. localStorage simulation fallback ───────────────────────────────────
    if (typeof window === 'undefined') return false;

    try {
      const raw = localStorage.getItem(`biddaro_premium_sub_${user.id}`);
      if (!raw) return false;

      const data = JSON.parse(raw) as {
        isPremium?: boolean;
        expiresAt?: string;
      };

      if (
        data?.isPremium &&
        data?.expiresAt &&
        new Date(data.expiresAt) > new Date()
      ) {
        return true;
      }
    } catch {
      /* ignore JSON‑parse errors */
    }

    return false;
  }, [user]);
}
