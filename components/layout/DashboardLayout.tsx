'use client';
import React from 'react';
import { cn } from '@/lib/utils';
import { Sidebar } from './Sidebar';
import { Topbar } from './Topbar';
import { useUIStore } from '@/store/uiStore';

interface DashboardLayoutProps {
  children: React.ReactNode;
  title?: string;
}

export function DashboardLayout({ children, title }: DashboardLayoutProps) {
  const { navCollapsed } = useUIStore();

  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar />
      <div
        className={cn(
          'transition-all duration-300 ease-in-out',
          navCollapsed ? 'lg:ml-16' : 'lg:ml-64'
        )}
      >
        <Topbar title={title} />
        <main className="p-6">{children}</main>
      </div>
    </div>
  );
}
