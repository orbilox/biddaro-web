'use client';
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { HardHat, Menu, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/Button';
import { ROUTES } from '@/lib/constants';

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { href: '#features', label: 'Features' },
    { href: '#how-it-works', label: 'How It Works' },
    { href: '#pricing', label: 'Pricing' },
  ];

  return (
    <nav
      className={cn(
        'fixed top-0 left-0 right-0 z-50 transition-all duration-300',
        scrolled
          ? 'bg-white/95 backdrop-blur-md border-b border-gray-200 shadow-sm'
          : 'bg-transparent'
      )}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href={ROUTES.HOME} className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-brand-500 flex items-center justify-center">
              <HardHat className="w-5 h-5 text-white" />
            </div>
            <span className={cn('text-xl font-bold tracking-tight', scrolled ? 'text-dark-900' : 'text-white')}>
              Biddaro
            </span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className={cn(
                  'text-sm font-medium transition-colors',
                  scrolled ? 'text-dark-600 hover:text-dark-900' : 'text-white/80 hover:text-white'
                )}
              >
                {link.label}
              </a>
            ))}
          </div>

          {/* CTA */}
          <div className="hidden md:flex items-center gap-3">
            <Link
              href={ROUTES.LOGIN}
              className={cn(
                'text-sm font-medium transition-colors px-4 py-2 rounded-lg',
                scrolled
                  ? 'text-dark-700 hover:text-dark-900 hover:bg-gray-100'
                  : 'text-white/90 hover:text-white hover:bg-white/10'
              )}
            >
              Sign In
            </Link>
            <Link href={ROUTES.REGISTER}>
              <Button size="sm">Get Started Free</Button>
            </Link>
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className={cn(
              'md:hidden p-2 rounded-lg transition-colors',
              scrolled ? 'text-dark-700' : 'text-white'
            )}
          >
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="md:hidden bg-white border-b border-gray-200 px-4 pb-4 animate-slide-up">
          <div className="flex flex-col gap-1 pt-2">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className="px-3 py-2.5 text-sm font-medium text-dark-700 hover:bg-gray-50 rounded-lg"
              >
                {link.label}
              </a>
            ))}
            <hr className="my-2 border-gray-100" />
            <Link href={ROUTES.LOGIN} className="px-3 py-2.5 text-sm font-medium text-dark-700 hover:bg-gray-50 rounded-lg">
              Sign In
            </Link>
            <Link href={ROUTES.REGISTER}>
              <Button fullWidth size="sm">Get Started Free</Button>
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}
