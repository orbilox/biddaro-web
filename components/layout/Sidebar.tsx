'use client';
import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard, Briefcase, FileText, MessageSquare, Wallet,
  AlertCircle, User, PlusCircle, ClipboardList, HardHat, X, ChevronRight,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAuthStore } from '@/store/authStore';
import { useUIStore } from '@/store/uiStore';
import { Avatar } from '@/components/ui/Avatar';
import { ROUTES } from '@/lib/constants';

interface NavItem {
  href: string;
  label: string;
  icon: React.ElementType;
  badge?: number;
}

const posterNavItems: NavItem[] = [
  { href: ROUTES.DASHBOARD, label: 'Dashboard', icon: LayoutDashboard },
  { href: ROUTES.JOB_POST, label: 'Post a Job', icon: PlusCircle },
  { href: ROUTES.MY_JOBS, label: 'My Jobs', icon: ClipboardList },
  { href: ROUTES.CONTRACTS, label: 'Contracts', icon: FileText },
  { href: ROUTES.MESSAGES, label: 'Messages', icon: MessageSquare },
  { href: ROUTES.WALLET, label: 'Wallet', icon: Wallet },
  { href: ROUTES.DISPUTES, label: 'Disputes', icon: AlertCircle },
  { href: ROUTES.PROFILE, label: 'Profile', icon: User },
];

const contractorNavItems: NavItem[] = [
  { href: ROUTES.DASHBOARD, label: 'Dashboard', icon: LayoutDashboard },
  { href: ROUTES.JOBS, label: 'Browse Jobs', icon: Briefcase },
  { href: ROUTES.BIDS, label: 'My Bids', icon: HardHat },
  { href: ROUTES.CONTRACTS, label: 'Contracts', icon: FileText },
  { href: ROUTES.MESSAGES, label: 'Messages', icon: MessageSquare },
  { href: ROUTES.WALLET, label: 'Wallet', icon: Wallet },
  { href: ROUTES.DISPUTES, label: 'Disputes', icon: AlertCircle },
  { href: ROUTES.PROFILE, label: 'Profile', icon: User },
];

export function Sidebar() {
  const pathname = usePathname();
  const { user, logout } = useAuthStore();
  const { sidebarOpen, setSidebar } = useUIStore();

  const navItems = user?.role === 'contractor' ? contractorNavItems : posterNavItems;

  return (
    <>
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-20 bg-dark-900/50 lg:hidden"
          onClick={() => setSidebar(false)}
        />
      )}

      <aside
        className={cn(
          'fixed top-0 left-0 z-30 h-full w-64 bg-dark-900 flex flex-col transition-transform duration-300 ease-in-out',
          sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        )}
      >
        {/* Logo */}
        <div className="flex items-center justify-between px-5 h-16 border-b border-dark-700">
          <Link href={ROUTES.DASHBOARD} className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-brand-500 flex items-center justify-center">
              <HardHat className="w-5 h-5 text-white" />
            </div>
            <span className="text-lg font-bold text-white tracking-tight">Biddaro</span>
          </Link>
          <button
            onClick={() => setSidebar(false)}
            className="lg:hidden p-1.5 rounded-lg text-dark-400 hover:text-white hover:bg-dark-700 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* User type badge */}
        <div className="px-5 py-3 border-b border-dark-700">
          <span className="text-xs font-medium text-brand-400 uppercase tracking-wider">
            {user?.role === 'contractor' ? '⚡ Contractor' : '📋 Job Poster'}
          </span>
        </div>

        {/* Navigation */}
        <nav className="flex-1 py-4 px-3 overflow-y-auto">
          <ul className="space-y-0.5">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    onClick={() => setSidebar(false)}
                    className={cn(
                      'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors duration-150',
                      isActive
                        ? 'bg-brand-500/10 text-brand-400 border border-brand-500/20'
                        : 'text-dark-300 hover:text-white hover:bg-dark-700'
                    )}
                  >
                    <Icon className={cn('w-5 h-5 flex-shrink-0', isActive ? 'text-brand-400' : '')} />
                    <span className="flex-1">{item.label}</span>
                    {item.badge !== undefined && item.badge > 0 && (
                      <span className="px-1.5 py-0.5 rounded-full bg-brand-500 text-white text-xs font-semibold">
                        {item.badge}
                      </span>
                    )}
                    {isActive && <ChevronRight className="w-3.5 h-3.5 text-brand-400" />}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* User section */}
        <div className="p-4 border-t border-dark-700">
          <div className="flex items-center gap-3 px-2 py-2 rounded-lg hover:bg-dark-700 transition-colors cursor-pointer group">
            <Avatar
              src={user?.profileImage}
              firstName={user?.firstName}
              lastName={user?.lastName}
              size="sm"
            />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-white truncate">
                {user?.firstName} {user?.lastName}
              </p>
              <p className="text-xs text-dark-400 truncate">{user?.email}</p>
            </div>
            <button
              onClick={logout}
              className="p-1 rounded opacity-0 group-hover:opacity-100 text-dark-400 hover:text-white transition-all"
              title="Logout"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
            </button>
          </div>
        </div>
      </aside>
    </>
  );
}
