/**
 * Next.js Edge Middleware — runs on every page request before rendering.
 * Detects user's country from Vercel's IP geolocation header and stores it
 * in a lightweight cookie so client components can read it without an API call.
 */
import { NextRequest, NextResponse } from 'next/server';

/** Map ISO country codes to the platform's supported currencies. */
const COUNTRY_CURRENCY_MAP: Record<string, string> = {
  IN: 'INR',
  AE: 'AED',
  SG: 'SGD',
};

export function middleware(req: NextRequest) {
  const res = NextResponse.next();

  // Skip if the country cookie is already set (don't overwrite user override)
  if (req.cookies.has('geo_country')) return res;

  // Vercel sets x-vercel-ip-country at the edge from MaxMind GeoIP.
  // req.geo?.country is the Next.js convenience accessor for the same value.
  const country =
    req.geo?.country ||
    req.headers.get('x-vercel-ip-country') ||
    'US';

  const currency = COUNTRY_CURRENCY_MAP[country] ?? 'USD';

  // Set for 24 hours — refreshes on next visit if geo changes
  res.cookies.set('geo_country',  country,  { maxAge: 86400, path: '/', sameSite: 'lax' });
  res.cookies.set('geo_currency', currency, { maxAge: 86400, path: '/', sameSite: 'lax' });

  return res;
}

export const config = {
  // Run on all pages except Next.js internals, static assets, and API routes
  matcher: ['/((?!_next/static|_next/image|favicon\\.ico|api/).*)'],
};
