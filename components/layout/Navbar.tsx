'use client';
import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  HardHat, Menu, X, LayoutDashboard, Sparkles,
  MapPin, Crown, ChevronDown,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/Button';
import { ROUTES } from '@/lib/constants';
import { useAuthStore } from '@/store/authStore';

// ─── Country hub entries for the dropdown ─────────────────────────────────────

const CONTRACTOR_HUBS = [
  { flag: '🇮🇳', label: 'India',            sub: 'English',         href: '/hire' },
  { flag: '🇦🇪', label: 'UAE',              sub: 'English',         href: '/uae/hire' },
  { flag: '🇦🇪', label: 'UAE',              sub: 'العربية',         href: '/uae/ar/hire' },
  { flag: '🇸🇬', label: 'Singapore',        sub: 'English',         href: '/sg/hire' },
  { flag: '🇺🇸', label: 'USA',              sub: 'English',         href: '/us/hire' },
];

export function Navbar() {
  const [scrolled, setScrolled]         = useState(false);
  const [mobileOpen, setMobileOpen]     = useState(false);
  const [contractorOpen, setContractorOpen] = useState(false); // desktop dropdown
  const [mobileContractorOpen, setMobileContractorOpen] = useState(false); // mobile expand
  const [mounted, setMounted]           = useState(false);
  const { isAuthenticated }             = useAuthStore();
  const pathname                        = usePathname();
  const dropdownRef                     = useRef<HTMLDivElement>(null);

  const isHomePage = pathname === '/';
  const solid      = scrolled || !isHomePage;

  useEffect(() => {
    setMounted(true);
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close dropdown on outside click
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setContractorOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  const navLinks = [
    { href: '#features',         label: 'Features' },
    { href: ROUTES.OPEN_JOBS,    label: 'Find Jobs' },
    { href: ROUTES.PREMIUM,      label: 'Premium',      icon: Crown,     isPro: true },
    { href: ROUTES.AI_ASSISTANT, label: 'AI Assistant', icon: Sparkles,  isNew: true },
    { href: '/loans',            label: 'Loans',        icon: undefined,  isNew: true },
  ];

  return (
    <nav
      className={cn(
        'fixed top-0 left-0 right-0 z-50 transition-all duration-300',
        solid ? 'bg-white border-b border-gray-200 shadow-sm' : 'bg-transparent'
      )}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">

          {/* Logo */}
          <Link href={ROUTES.HOME} className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-brand-500 flex items-center justify-center">
              <HardHat className="w-5 h-5 text-white" />
            </div>
            <span className={cn(
              'text-xl font-bold tracking-tight',
              solid ? 'text-dark-900' : 'text-white'
            )}>
              Biddaro
            </span>
          </Link>

          {/* Desktop Nav Links */}
          <div className="hidden md:flex items-center gap-8">

            {/* Regular links */}
            {navLinks.map((link) => {
              const NavIcon = link.icon;
              return (
                <a
                  key={link.href}
                  href={link.href}
                  className={cn(
                    'text-sm font-medium transition-colors flex items-center gap-1.5',
                    solid ? 'text-dark-600 hover:text-dark-900' : 'text-white/80 hover:text-white'
                  )}
                >
                  {link.isPro && NavIcon && <NavIcon className="w-3.5 h-3.5 text-amber-500" />}
                  {link.isNew && NavIcon && !link.isPro && <NavIcon className="w-3.5 h-3.5 text-brand-400" />}
                  {link.label}
                  {link.isPro && (
                    <span className="text-[10px] font-bold bg-amber-500 text-white px-1.5 py-0.5 rounded-full leading-none">
                      PRO
                    </span>
                  )}
                  {link.isNew && (
                    <span className="text-[10px] font-bold bg-brand-500 text-white px-1.5 py-0.5 rounded-full leading-none">
                      FREE
                    </span>
                  )}
                </a>
              );
            })}

            {/* Find Contractors dropdown */}
            <div
              ref={dropdownRef}
              className="relative"
              onMouseEnter={() => setContractorOpen(true)}
              onMouseLeave={() => setContractorOpen(false)}
            >
              <button
                onClick={() => setContractorOpen((o) => !o)}
                className={cn(
                  'text-sm font-medium transition-colors flex items-center gap-1.5 py-1',
                  solid ? 'text-dark-600 hover:text-dark-900' : 'text-white/80 hover:text-white'
                )}
              >
                <MapPin className="w-3.5 h-3.5 text-brand-400" />
                Find Contractors
                <ChevronDown className={cn(
                  'w-3.5 h-3.5 transition-transform duration-200',
                  contractorOpen ? 'rotate-180' : ''
                )} />
              </button>

              {/* Dropdown panel */}
              {contractorOpen && (
                <div className="absolute top-full left-1/2 -translate-x-1/2 pt-2 z-50">
                  <div className="bg-white border border-gray-200 rounded-2xl shadow-xl overflow-hidden w-64">
                    <div className="px-4 py-3 border-b border-gray-100 bg-gray-50">
                      <p className="text-xs font-semibold text-dark-500 uppercase tracking-wider">
                        Choose your region
                      </p>
                    </div>
                    <div className="py-1.5">
                      {CONTRACTOR_HUBS.map((hub) => (
                        <Link
                          key={hub.href}
                          href={hub.href}
                          onClick={() => setContractorOpen(false)}
                          className="flex items-center gap-3 px-4 py-3 hover:bg-brand-50 transition-colors group"
                        >
                          <span className="text-2xl leading-none">{hub.flag}</span>
                          <div>
                            <p className="text-sm font-semibold text-dark-800 group-hover:text-brand-700 leading-tight">
                              {hub.label}
                            </p>
                            <p className="text-xs text-dark-400">{hub.sub}</p>
                          </div>
                        </Link>
                      ))}
                    </div>
                    <div className="px-4 py-2.5 border-t border-gray-100 bg-gray-50">
                      <Link
                        href="/hire"
                        onClick={() => setContractorOpen(false)}
                        className="text-xs text-brand-600 hover:text-brand-700 font-semibold"
                      >
                        View all regions →
                      </Link>
                    </div>
                  </div>
                </div>
              )}
            </div>

          </div>

          {/* CTA Buttons */}
          <div className="hidden md:flex items-center gap-3">
            {mounted && isAuthenticated ? (
              <Link href={ROUTES.DASHBOARD}>
                <Button size="sm" rightIcon={<LayoutDashboard className="w-4 h-4" />}>
                  Go to Dashboard
                </Button>
              </Link>
            ) : (
              <>
                <Link
                  href={ROUTES.LOGIN}
                  className={cn(
                    'text-sm font-medium transition-colors px-4 py-2 rounded-lg',
                    solid
                      ? 'text-dark-700 hover:text-dark-900 hover:bg-gray-100'
                      : 'text-white/90 hover:text-white hover:bg-white/10'
                  )}
                >
                  Sign In
                </Link>
                <Link href={ROUTES.REGISTER}>
                  <Button size="sm">Get Started Free</Button>
                </Link>
              </>
            )}
          </div>

          {/* Mobile Hamburger */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className={cn(
              'md:hidden p-2 rounded-lg transition-colors',
              solid ? 'text-dark-700 hover:bg-gray-100' : 'text-white hover:bg-white/10'
            )}
          >
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Drawer */}
      {mobileOpen && (
        <div className="md:hidden bg-white border-b border-gray-200 px-4 pb-4 animate-slide-up">
          <div className="flex flex-col gap-1 pt-2">

            {/* Regular links */}
            {navLinks.map((link) => {
              const NavIcon = link.icon;
              return (
                <a
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  className="px-3 py-2.5 text-sm font-medium text-dark-700 hover:bg-gray-50 rounded-lg flex items-center gap-2"
                >
                  {link.isPro && NavIcon && <NavIcon className="w-3.5 h-3.5 text-amber-500" />}
                  {link.isNew && NavIcon && !link.isPro && <NavIcon className="w-3.5 h-3.5 text-brand-400" />}
                  {link.label}
                  {link.isPro && (
                    <span className="text-[10px] font-bold bg-amber-500 text-white px-1.5 py-0.5 rounded-full leading-none">PRO</span>
                  )}
                  {link.isNew && (
                    <span className="text-[10px] font-bold bg-brand-500 text-white px-1.5 py-0.5 rounded-full leading-none">FREE</span>
                  )}
                </a>
              );
            })}

            {/* Find Contractors expandable on mobile */}
            <div>
              <button
                onClick={() => setMobileContractorOpen((o) => !o)}
                className="w-full px-3 py-2.5 text-sm font-medium text-dark-700 hover:bg-gray-50 rounded-lg flex items-center gap-2"
              >
                <MapPin className="w-3.5 h-3.5 text-brand-400" />
                Find Contractors
                <ChevronDown className={cn(
                  'w-3.5 h-3.5 ml-auto transition-transform duration-200',
                  mobileContractorOpen ? 'rotate-180' : ''
                )} />
              </button>
              {mobileContractorOpen && (
                <div className="ml-4 mt-1 border-l-2 border-brand-100 pl-3 space-y-0.5">
                  {CONTRACTOR_HUBS.map((hub) => (
                    <Link
                      key={hub.href}
                      href={hub.href}
                      onClick={() => { setMobileOpen(false); setMobileContractorOpen(false); }}
                      className="flex items-center gap-2.5 px-3 py-2 text-sm text-dark-600 hover:text-brand-600 hover:bg-brand-50 rounded-lg transition-colors"
                    >
                      <span className="text-lg leading-none">{hub.flag}</span>
                      <span className="font-medium">{hub.label}</span>
                      <span className="text-xs text-dark-400">({hub.sub})</span>
                    </Link>
                  ))}
                </div>
              )}
            </div>

            <hr className="my-2 border-gray-100" />
            {mounted && isAuthenticated ? (
              <Link href={ROUTES.DASHBOARD} onClick={() => setMobileOpen(false)}>
                <Button fullWidth size="sm" rightIcon={<LayoutDashboard className="w-4 h-4" />}>
                  Go to Dashboard
                </Button>
              </Link>
            ) : (
              <>
                <Link
                  href={ROUTES.LOGIN}
                  className="px-3 py-2.5 text-sm font-medium text-dark-700 hover:bg-gray-50 rounded-lg"
                  onClick={() => setMobileOpen(false)}
                >
                  Sign In
                </Link>
                <Link href={ROUTES.REGISTER}>
                  <Button fullWidth size="sm">Get Started Free</Button>
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
