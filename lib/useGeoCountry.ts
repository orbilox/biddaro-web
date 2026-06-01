'use client';
/**
 * useGeoCountry — reads the geo_country / geo_currency cookies set by middleware.ts
 * and returns the user's detected country and matching currency.
 *
 * Falls back to USD / US when cookies are absent (SSR hydration pass, localhost, etc.).
 */
import { useState, useEffect } from 'react';

export interface GeoInfo {
  countryCode: string;   // 'IN' | 'AE' | 'SG' | 'US' | ...
  currency: string;      // 'INR' | 'AED' | 'SGD' | 'USD'
  symbol: string;        // '₹' | 'د.إ' | 'S$' | '$'
  countryName: string;
}

const GEO_MAP: Record<string, GeoInfo> = {
  IN: { countryCode: 'IN', currency: 'INR', symbol: '₹',    countryName: 'India' },
  AE: { countryCode: 'AE', currency: 'AED', symbol: 'د.إ',  countryName: 'UAE' },
  SG: { countryCode: 'SG', currency: 'SGD', symbol: 'S$',   countryName: 'Singapore' },
  US: { countryCode: 'US', currency: 'USD', symbol: '$',     countryName: 'USA' },
};

const DEFAULT: GeoInfo = GEO_MAP['US'];

function readCookie(name: string): string | undefined {
  if (typeof document === 'undefined') return undefined;
  const m = document.cookie.match(new RegExp('(?:^|; )' + name + '=([^;]*)'));
  return m ? decodeURIComponent(m[1]) : undefined;
}

export function useGeoCountry(): GeoInfo {
  const [info, setInfo] = useState<GeoInfo>(DEFAULT);

  useEffect(() => {
    const countryCode = readCookie('geo_country') || 'US';
    setInfo(GEO_MAP[countryCode] ?? DEFAULT);
  }, []);

  return info;
}

/** Synchronous version — safe to call outside React (e.g. in event handlers). */
export function getGeoCurrency(): string {
  return readCookie('geo_currency') ?? 'USD';
}

/** Map a currency code to its symbol. */
export function currencySymbol(currency: string): string {
  const entry = Object.values(GEO_MAP).find(g => g.currency === currency);
  return entry?.symbol ?? '$';
}
