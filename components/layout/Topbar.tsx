'use client';
import React, { useState } from 'react';
import Link from 'next/link';
import { Menu, Bell, Search, ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAuthStore } from '@/store/authStore';
import { useUIStore } from '@/store/uiStore';
import { Avatar } from '@/components/ui/Avatar';
import { ROUTES } from '@/lib/constants';

interface TopbarProps {
  title?: string;
}

export function Topbar({ title }: TopbarProps) {
  const { user, logout } = useAuthStore();
  const { toggleSidebar } = useUIStore();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6 sticky top-0 z-10">
      {/* Left */}
      <div className="flex items-center gap-4">
        <button
          onClick={toggleSidebar}
          className="p-2 rounded-lg text-dark-500 hover:text-dark-800 hover:bg-gray-100 transition-colors lg:hidden"
        >
          <Menu className="w-5 h-5" />
        </button>
        {title && (
          <h1 className="text-lg font-semibold text-dark-900 hidden sm:block">{title}</h1>
        )}
      </div>

      {/* Right */}
      <div className="flex items-center gap-2">
        {/* Notifications */}
        <button className="relative p-2 rounded-lg text-dark-500 hover:text-dark-800 hover:bg-gray-100 transition-colors">
          <Bell className="w-5 h-5" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-brand-500 rounded-full" />
        </button>

        {/* User menu */}
        <div className="relative">
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="flex items-center gap-2 pl-2 pr-3 py-1.5 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <Avatar
              src={user?.profileImage}
              firstName={user?.firstName}
              lastName={user?.lastName}
              size="sm"
            />
            <div className="hidden sm:block text-left">
              <p className="text-sm font-medium text-dark-800 leading-tight">
                {user?.firstName} {user?.lastName}
              </p>
              <p className="text-xs text-dark-400 leading-tight capitalize">
                {user?.role?.replace('_', ' ')}
              </p>
            </div>
            <ChevronDown className={cn('w-4 h-4 text-dark-400 transition-transform', menuOpen && 'rotate-180')} />
          </button>

          {menuOpen && (
            <>
              <div className="fixed inset-0 z-10" onClick={() => setMenuOpen(false)} />
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg border border-gray-200 py-1 z-20 animate-slide-up">
                <Link
                  href={ROUTES.PROFILE}
                  onClick={() => setMenuOpen(false)}
                  className="flex items-center gap-2 px-4 py-2.5 text-sm text-dark-700 hover:bg-gray-50"
                >
                  Profile Settings
                </Link>
                <Link
                  href={ROUTES.WALLET}
                  onClick={() => setMenuOpen(false)}
                  className="flex items-center gap-2 px-4 py-2.5 text-sm text-dark-700 hover:bg-gray-50"
                >
                  Wallet
                </Link>
                <hr className="my-1 border-gray-100" />
                <button
                  onClick={() => { logout(); setMenuOpen(false); }}
                  className="w-full text-left flex items-center gap-2 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50"
                >
                  Sign Out
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
