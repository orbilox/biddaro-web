'use client';

import { useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';
import { useAuthStore } from '@/store/authStore';
import { pixelIdentify, getMetaSignals } from '@/lib/metaPixel';

/**
 * Fires pixelIdentify() with the logged-in user's data on every page load.
 * This ensures PageView and ViewContent events carry email/phone/name so
 * Meta can match them — the main driver of Event Match Quality score.
 * Also captures + persists fbclid from URL on every navigation.
 */
export function MetaPixelIdentify() {
  const user     = useAuthStore(s => s.user);
  const pathname = usePathname();
  const lastId   = useRef<string | null>(null);

  useEffect(() => {
    // Always call getMetaSignals on route change — captures & persists fbclid
    getMetaSignals();

    if (!user) return;

    // Re-identify whenever the user or page changes
    if (lastId.current === user.id && pathname === (window as Window & { __lastMetaPath?: string }).__lastMetaPath) return;
    lastId.current = user.id;
    (window as Window & { __lastMetaPath?: string }).__lastMetaPath = pathname;

    pixelIdentify({
      email:      user.email,
      phone:      user.phone,
      firstName:  user.firstName,
      lastName:   user.lastName,
      city:       user.location,
      externalId: user.id,
    });
  }, [user?.id, pathname]);

  return null;
}
