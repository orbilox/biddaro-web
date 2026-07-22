'use client';
import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard, Briefcase, FileText, MessageSquare, Wallet,
  AlertCircle, User, PlusCircle, ClipboardList, HardHat, X, ChevronRight, Search,
  ShieldCheck, BanknoteIcon, Users, DollarSign, BarChart2, Shield, Building2, Crown, Package, Radio, FolderKanban, Hammer, Banknote,
  PanelLeftClose, PanelLeftOpen, Gift, Bell, IndianRupee, Zap, ClipboardCheck, Landmark, Megaphone, CalendarDays, MessageCircle, Globe,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAuthStore } from '@/store/authStore';
import { useUIStore } from '@/store/uiStore';
import { Avatar } from '@/components/ui/Avatar';
import { ROUTES } from '@/lib/constants';
import { track } from '@/lib/analytics';

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
  { href: ROUTES.PROJECT_TRACKING, label: 'Project Tracking', icon: Radio },
  { href: ROUTES.BUILD_PLANNER, label: 'Build Planner', icon: Hammer },
  { href: ROUTES.SITE_MANAGER, label: 'Site Manager', icon: Building2 },
  { href: '/inspect', label: 'Inspect', icon: ClipboardCheck },
  { href: ROUTES.LOANS, label: 'Loans', icon: Banknote },
  { href: ROUTES.ADDONS, label: 'Add-Ons', icon: Package },
  { href: '/referral', label: 'Refer & Earn', icon: Gift },
  { href: '/notifications', label: 'Notifications', icon: Bell },
  { href: ROUTES.PROFILE, label: 'Profile', icon: User },
];

const contractorNavItems: NavItem[] = [
  { href: ROUTES.DASHBOARD, label: 'Dashboard', icon: LayoutDashboard },
  { href: ROUTES.FIND_WORK, label: 'Find Work', icon: Search },
  { href: ROUTES.BIDS, label: 'My Bids', icon: HardHat },
  { href: ROUTES.CONTRACTS, label: 'Contracts', icon: FileText },
  { href: ROUTES.MESSAGES, label: 'Messages', icon: MessageSquare },
  { href: ROUTES.WALLET, label: 'Wallet', icon: Wallet },
  { href: ROUTES.CONNECTS, label: 'Connects', icon: Zap },
  { href: '/subscription', label: 'Premium', icon: Crown },
  { href: ROUTES.DISPUTES, label: 'Disputes', icon: AlertCircle },
  { href: ROUTES.PROJECT_TRACKING, label: 'Project Tracking', icon: Radio },
  { href: ROUTES.PROJECT_MANAGER, label: 'Project Manager', icon: FolderKanban },
  { href: ROUTES.SITE_MANAGER, label: 'Site Manager', icon: Building2 },
  { href: '/inspect', label: 'Inspect', icon: ClipboardCheck },
  { href: '/my-site', label: 'My Website', icon: Globe },
  { href: ROUTES.LOANS, label: 'Loans', icon: Banknote },
  { href: ROUTES.ADDONS, label: 'Add-Ons', icon: Package },
  { href: '/referral', label: 'Refer & Earn', icon: Gift },
  { href: '/notifications', label: 'Notifications', icon: Bell },
  { href: ROUTES.PROFILE, label: 'Profile', icon: User },
];

// ── Admin nav section type ────────────────────────────────────────────────────
interface NavSection {
  label: string;
  items: NavItem[];
}

const adminNavSections: NavSection[] = [
  {
    label: 'Overview',
    items: [
      { href: '/admin', label: 'Dashboard', icon: LayoutDashboard },
      { href: '/admin/analytics', label: 'Analytics', icon: BarChart2 },
    ],
  },
  {
    label: 'Manage',
    items: [
      { href: '/admin/users', label: 'Users', icon: Users },
      { href: '/admin/jobs', label: 'Jobs', icon: Briefcase },
      { href: '/admin/contracts', label: 'Contracts', icon: FileText },
      { href: '/admin/transactions', label: 'Transactions', icon: DollarSign },
      { href: '/admin/premium', label: 'Premium', icon: Crown },
      { href: '/admin/inspect-app', label: 'Inspect App', icon: ClipboardCheck },
      { href: '/admin/safety-app', label: 'Safety App', icon: ShieldCheck },
    ],
  },
  {
    label: 'Actions',
    items: [
      { href: '/admin/deposits', label: 'Deposit Requests', icon: BanknoteIcon },
      { href: '/admin/loans', label: 'Loan Applications', icon: Banknote },
      { href: '/admin/loan-inquiries', label: 'Loan Inquiries', icon: IndianRupee },
      { href: '/admin/loan-leads', label: 'Loan Leads', icon: Landmark },
      { href: '/admin/disputes', label: 'Disputes', icon: AlertCircle },
    ],
  },
  {
    label: 'Marketing',
    items: [
      { href: '/admin/social-posts', label: 'Social Posts', icon: Megaphone },
      { href: '/admin/social-calendar', label: 'Social Calendar', icon: CalendarDays },
      { href: '/admin/push-notifications', label: 'Push Notifications', icon: Bell },
      { href: '/admin/whatsapp-followups', label: 'WhatsApp Follow-ups', icon: MessageCircle },
    ],
  },
  {
    label: 'Settings',
    items: [
      { href: '/admin/bank-settings', label: 'Bank Settings', icon: Building2 },
    ],
  },
  {
    label: 'Account',
    items: [
      { href: ROUTES.PROFILE, label: 'Profile', icon: User },
    ],
  },
];

// Flat list for backwards compat (used in navItems selector)
const adminNavItems: NavItem[] = adminNavSections.flatMap(s => s.items);

export function Sidebar() {
  const pathname = usePathname();
  const { user, logout } = useAuthStore();
  const { sidebarOpen, setSidebar, navCollapsed, toggleNavCollapsed } = useUIStore();

  const navItems = user?.role === 'admin'
    ? adminNavItems
    : user?.role === 'contractor'
      ? contractorNavItems
      : posterNavItems;

  const isAdmin = user?.role === 'admin';

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
          'fixed top-0 left-0 z-30 h-full bg-dark-900 flex flex-col transition-all duration-300 ease-in-out',
          navCollapsed ? 'w-16' : 'w-64',
          sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        )}
      >
        {/* ── Logo / Header ─────────────────────────────────────────────── */}
        <div className={cn(
          'flex items-center h-16 border-b border-dark-700 relative flex-shrink-0',
          navCollapsed ? 'justify-center px-0' : 'justify-between px-5'
        )}>
          {navCollapsed ? (
            <Link href={ROUTES.DASHBOARD} className="w-8 h-8 rounded-lg bg-brand-500 flex items-center justify-center">
              <HardHat className="w-5 h-5 text-white" />
            </Link>
          ) : (
            <>
              <Link href={ROUTES.DASHBOARD} className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-brand-500 flex items-center justify-center">
                  <HardHat className="w-5 h-5 text-white" />
                </div>
                <span className="text-lg font-bold text-white tracking-tight">Biddaro</span>
              </Link>
              {/* Mobile close */}
              <button
                onClick={() => setSidebar(false)}
                className="lg:hidden p-1.5 rounded-lg text-dark-400 hover:text-white hover:bg-dark-700 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </>
          )}

          {/* Desktop collapse toggle — shown on right edge */}
          <button
            onClick={toggleNavCollapsed}
            title={navCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
            className={cn(
              'hidden lg:flex absolute -right-3.5 top-1/2 -translate-y-1/2 w-7 h-7 rounded-full',
              'bg-dark-800 border border-dark-600 items-center justify-center',
              'text-dark-400 hover:text-white hover:border-brand-500 transition-colors shadow-md z-10'
            )}
          >
            {navCollapsed
              ? <PanelLeftOpen className="w-3.5 h-3.5" />
              : <PanelLeftClose className="w-3.5 h-3.5" />
            }
          </button>
        </div>

        {/* ── User type badge ────────────────────────────────────────────── */}
        {!navCollapsed && (
          <div className="px-5 py-3 border-b border-dark-700 flex-shrink-0">
            <span className="text-xs font-medium text-brand-400 uppercase tracking-wider flex items-center gap-1.5">
              {isAdmin
                ? <><Shield className="w-3.5 h-3.5" /> Super Admin</>
                : user?.role === 'contractor'
                  ? '⚡ Contractor'
                  : '📋 Job Poster'}
            </span>
          </div>
        )}

        {/* ── Navigation ────────────────────────────────────────────────── */}
        <nav className="flex-1 py-4 overflow-y-auto" style={{ scrollbarWidth: 'none' }}>
          {isAdmin ? (
            // ── Admin: sectioned nav ────────────────────────────────────
            navCollapsed ? (
              /* collapsed admin — flat icons */
              <ul className="space-y-0.5 px-2">
                {adminNavItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = pathname === item.href || (item.href !== '/admin' && pathname.startsWith(item.href));
                  return (
                    <li key={item.href}>
                      <Link
                        href={item.href}
                        onClick={() => setSidebar(false)}
                        title={item.label}
                        className={cn(
                          'flex items-center justify-center w-10 h-10 rounded-lg mx-auto transition-colors',
                          isActive
                            ? 'bg-brand-500/10 text-brand-400'
                            : 'text-dark-400 hover:text-white hover:bg-dark-700'
                        )}
                      >
                        <Icon className="w-5 h-5 flex-shrink-0" />
                      </Link>
                    </li>
                  );
                })}
              </ul>
            ) : (
              /* expanded admin — sectioned */
              <div className="space-y-5 px-3">
                {adminNavSections.map((section) => (
                  <div key={section.label}>
                    <p className="px-3 mb-1 text-[10px] font-semibold text-dark-500 uppercase tracking-widest">
                      {section.label}
                    </p>
                    <ul className="space-y-0.5">
                      {section.items.map((item) => {
                        const Icon = item.icon;
                        const isActive = pathname === item.href || (item.href !== '/admin' && pathname.startsWith(item.href));
                        return (
                          <li key={item.href}>
                            <Link href={item.href} onClick={() => setSidebar(false)}
                              className={cn(
                                'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors duration-150',
                                isActive
                                  ? 'bg-brand-500/10 text-brand-400 border border-brand-500/20'
                                  : 'text-dark-300 hover:text-white hover:bg-dark-700'
                              )}>
                              <Icon className={cn('w-4 h-4 flex-shrink-0', isActive ? 'text-brand-400' : '')} />
                              <span className="flex-1">{item.label}</span>
                              {isActive && <ChevronRight className="w-3 h-3 text-brand-400" />}
                            </Link>
                          </li>
                        );
                      })}
                    </ul>
                  </div>
                ))}
              </div>
            )
          ) : navCollapsed ? (
            // ── Regular user: collapsed icon-only ──────────────────────
            <ul className="space-y-0.5 px-2">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = pathname === item.href || (item.href !== ROUTES.DASHBOARD && pathname.startsWith(item.href + '/'));
                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      onClick={() => setSidebar(false)}
                      title={item.label}
                      className={cn(
                        'flex items-center justify-center w-10 h-10 rounded-lg mx-auto transition-colors duration-150',
                        isActive
                          ? 'bg-brand-500/10 text-brand-400'
                          : 'text-dark-400 hover:text-white hover:bg-dark-700',
                        item.label === 'Premium' && !isActive ? 'text-amber-500' : ''
                      )}
                    >
                      <Icon className="w-5 h-5 flex-shrink-0" />
                    </Link>
                  </li>
                );
              })}
            </ul>
          ) : (
            // ── Regular user: expanded ──────────────────────────────────
            <ul className="space-y-0.5 px-3">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = pathname === item.href || (item.href !== ROUTES.DASHBOARD && pathname.startsWith(item.href + '/'));
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
                      <Icon className={cn('w-5 h-5 flex-shrink-0', isActive ? 'text-brand-400' : '', item.label === 'Premium' && !isActive ? 'text-amber-500' : '')} />
                      <span className="flex-1">{item.label}</span>
                      {item.label === 'Premium' && (
                        <span className="text-[10px] font-bold bg-amber-500 text-white px-1.5 py-0.5 rounded-full leading-none">
                          PRO
                        </span>
                      )}
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
          )}
        </nav>

        {/* ── User section ──────────────────────────────────────────────── */}
        <div className={cn('border-t border-dark-700 flex-shrink-0', navCollapsed ? 'p-2' : 'p-4')}>
          {navCollapsed ? (
            <div className="flex flex-col items-center gap-2">
              <button
                title={`${user?.firstName} ${user?.lastName}`}
                className="w-10 h-10 rounded-lg flex items-center justify-center hover:bg-dark-700 transition-colors"
              >
                <Avatar
                  src={user?.profileImage}
                  firstName={user?.firstName}
                  lastName={user?.lastName}
                  size="sm"
                />
              </button>
              <button
                onClick={() => { track.logout(); logout(); }}
                title="Logout"
                className="w-10 h-10 rounded-lg flex items-center justify-center text-dark-400 hover:text-white hover:bg-dark-700 transition-colors"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
              </button>
            </div>
          ) : (
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
          )}
        </div>
      </aside>
    </>
  );
}
