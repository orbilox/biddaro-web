'use client';
import React from 'react';
import Link from 'next/link';
import { HardHat, LayoutDashboard } from 'lucide-react';
import { useAuthStore } from '@/store/authStore';
import { Avatar } from '@/components/ui/Avatar';
import { ROUTES } from '@/lib/constants';

export default function PublicLayout({ children }: { children: React.ReactNode }) {
  const { user, isAuthenticated } = useAuthStore();

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* ── Top navbar ──────────────────────────────────────────────────────── */}
      <header className="h-16 px-6 flex items-center justify-between bg-white border-b border-gray-200 sticky top-0 z-30">
        {/* Logo */}
        <Link href={ROUTES.HOME} className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-brand-500 flex items-center justify-center">
            <HardHat className="w-5 h-5 text-white" />
          </div>
          <span className="text-lg font-bold text-dark-900">Biddaro</span>
        </Link>

        {/* Right side: guest → Login / Sign up, logged in → Dashboard + avatar */}
        <div className="flex items-center gap-3">
          {isAuthenticated && user ? (
            <>
              <Link
                href={ROUTES.DASHBOARD}
                className="flex items-center gap-1.5 text-sm text-dark-600 hover:text-dark-900 font-medium transition-colors"
              >
                <LayoutDashboard className="w-4 h-4" />
                Dashboard
              </Link>
              <Link href={ROUTES.PROFILE}>
                <Avatar
                  src={user.profileImage}
                  firstName={user.firstName}
                  lastName={user.lastName}
                  size="sm"
                  className="cursor-pointer ring-2 ring-brand-500/20 hover:ring-brand-500/40 transition-all"
                />
              </Link>
            </>
          ) : (
            <>
              <Link
                href={ROUTES.LOGIN}
                className="text-sm font-medium text-dark-600 hover:text-dark-900 transition-colors px-3 py-1.5 rounded-lg hover:bg-gray-100"
              >
                Log in
              </Link>
              <Link
                href={ROUTES.REGISTER}
                className="text-sm font-semibold text-white bg-brand-500 hover:bg-brand-600 transition-colors px-4 py-1.5 rounded-lg"
              >
                Sign up free
              </Link>
            </>
          )}
        </div>
      </header>

      {/* ── Page content ────────────────────────────────────────────────────── */}
      <main className="flex-1 py-8 px-4 sm:px-6 lg:px-8">
        {children}
      </main>

      {/* ── Footer ──────────────────────────────────────────────────────────── */}
      <footer className="h-12 flex items-center justify-center border-t border-gray-200 bg-white">
        <p className="text-xs text-dark-400">
          &copy; {new Date().getFullYear()} Biddaro, Inc. All rights reserved.
        </p>
      </footer>
    </div>
  );
}
