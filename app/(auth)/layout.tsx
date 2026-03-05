import React from 'react';
import Link from 'next/link';
import { HardHat } from 'lucide-react';
import { ROUTES } from '@/lib/constants';

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <div className="px-6 h-16 flex items-center justify-between border-b border-gray-200 bg-white">
        <Link href={ROUTES.HOME} className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-brand-500 flex items-center justify-center">
            <HardHat className="w-5 h-5 text-white" />
          </div>
          <span className="text-lg font-bold text-dark-900">Biddaro</span>
        </Link>
      </div>

      {/* Content */}
      <div className="flex-1 flex items-center justify-center p-4 py-12">
        {children}
      </div>

      {/* Footer */}
      <div className="h-12 flex items-center justify-center border-t border-gray-200 bg-white">
        <p className="text-xs text-dark-400">
          &copy; {new Date().getFullYear()} Biddaro, Inc. All rights reserved.
        </p>
      </div>
    </div>
  );
}
