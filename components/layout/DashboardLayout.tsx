'use client';
import React from 'react';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { Sidebar } from './Sidebar';
import { Topbar } from './Topbar';
import { useUIStore } from '@/store/uiStore';

// Routes that take over the full screen on desktop (no topbar, no padding)
const FULLSCREEN_TOOL_ROUTES = ['/build-planner'];

// Routes that get zero padding (full-bleed, mobile-app feel)
const NO_PADDING_ROUTES = ['/site-manager'];

interface DashboardLayoutProps {
  children: React.ReactNode;
  title?: string;
}

export function DashboardLayout({ children, title }: DashboardLayoutProps) {
  const { navCollapsed } = useUIStore();
  const pathname = usePathname();
  const isFullscreen = FULLSCREEN_TOOL_ROUTES.some(r => pathname.startsWith(r));
  const isNoPadding = NO_PADDING_ROUTES.some(r => pathname.startsWith(r));

  return (
    <div className={cn('bg-gray-50', isFullscreen ? 'lg:h-screen lg:overflow-hidden' : 'min-h-screen')}>
      <Sidebar />
      <div
        className={cn(
          'transition-all duration-300 ease-in-out',
          navCollapsed ? 'lg:ml-16' : 'lg:ml-64',
          isFullscreen ? 'lg:h-screen lg:flex lg:flex-col lg:overflow-hidden' : ''
        )}
      >
        {/* Topbar: always visible on mobile; hidden on desktop for fullscreen tools */}
        <div className={isFullscreen ? 'lg:hidden' : ''}>
          <Topbar title={title} />
        </div>

        <main className={cn(
          isFullscreen
            ? 'flex-1 lg:overflow-hidden p-0'   // fullscreen: no padding, fills remaining height
            : isNoPadding
              ? 'p-0'                             // full-bleed: no padding (mobile-app feel)
              : 'p-6'                             // normal: standard padding
        )}>
          {children}
        </main>
      </div>
    </div>
  );
}
