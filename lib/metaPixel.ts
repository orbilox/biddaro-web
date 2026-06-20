/**
 * Browser-side Meta Pixel helper.
 * The base pixel (fbq init + PageView) is already loaded globally in app/layout.tsx.
 * Use these helpers to fire standard events on specific pages/actions.
 */

declare global {
  interface Window {
    fbq?: (...args: unknown[]) => void;
  }
}

/** Fire a standard Meta Pixel event (client-side). */
export function pixelTrack(event: string, params?: Record<string, unknown>): void {
  if (typeof window === 'undefined' || !window.fbq) return;
  window.fbq('track', event, params);
}

/** Read a cookie value by name from document.cookie. */
export function readCookie(name: string): string | undefined {
  if (typeof document === 'undefined') return undefined;
  const match = document.cookie.match(new RegExp('(?:^|;)\\s*' + name + '=([^;]*)'));
  return match ? decodeURIComponent(match[1]) : undefined;
}

const FBC_STORAGE_KEY = '_biddaro_fbc';

/**
 * Return Meta browser signals for forwarding to CAPI (cross-domain).
 * fbclid is persisted in localStorage so it survives page navigation —
 * Meta ads only append fbclid to the landing page URL, not subsequent pages.
 */
export function getMetaSignals(): { fbp?: string; fbc?: string; fbclid?: string } {
  if (typeof window === 'undefined') return {};

  // Capture fbclid from URL and persist it
  const fbclid = new URLSearchParams(window.location.search).get('fbclid') ?? undefined;
  if (fbclid) {
    const fbc = `fb.1.${Date.now()}.${fbclid}`;
    try {
      localStorage.setItem(FBC_STORAGE_KEY, fbc);
      document.cookie = `_fbc=${fbc}; path=/; max-age=7776000; SameSite=Lax`;
    } catch {}
  }

  // fbc: prefer cookie (set by Meta pixel), then our persisted value
  const fbc = readCookie('_fbc') || localStorage.getItem(FBC_STORAGE_KEY) || undefined;

  return { fbp: readCookie('_fbp'), fbc, fbclid };
}

/** View Content — call on key landing pages with content details. */
export function pixelViewContent(opts: {
  contentName: string;
  contentCategory?: string;
  contentType?: string;
  value?: number;
  currency?: string;
}): void {
  pixelTrack('ViewContent', {
    content_name:     opts.contentName,
    content_category: opts.contentCategory,
    content_type:     opts.contentType ?? 'product',
    value:            opts.value,
    currency:         opts.currency ?? 'INR',
  });
}

/**
 * Identify user to Meta Pixel — re-inits fbq with hashed PII so subsequent
 * events get high Event Match Quality. Call this as soon as you have user data.
 * Meta's pixel hashes the values automatically on the client side.
 */
export function pixelIdentify(opts: {
  email?:      string;
  phone?:      string;
  firstName?:  string;
  lastName?:   string;
  city?:       string;
  externalId?: string;
}): void {
  if (typeof window === 'undefined' || !window.fbq) return;
  const userData: Record<string, string> = {};
  if (opts.email)      userData.em          = opts.email.trim().toLowerCase();
  if (opts.phone)      userData.ph          = opts.phone.replace(/\D/g, '');
  if (opts.firstName)  userData.fn          = opts.firstName.trim().toLowerCase();
  if (opts.lastName)   userData.ln          = opts.lastName.trim().toLowerCase();
  if (opts.city)       userData.ct          = opts.city.trim().toLowerCase().replace(/\s+/g, '');
  if (opts.externalId) userData.external_id = opts.externalId;
  // Re-init with user data — Meta pixel de-dupes and hashes before sending
  window.fbq('init', '914655691586718', userData as any);
}

/** Add Payment Info — call when Razorpay modal opens (client side signal). */
export function pixelAddPaymentInfo(opts?: { value?: number; currency?: string; contentCategory?: string }): void {
  pixelTrack('AddPaymentInfo', {
    value:            opts?.value ?? 100,
    currency:         opts?.currency ?? 'INR',
    content_category: opts?.contentCategory,
  });
}

/** Lead — call on form submission confirmation (pairs with server CAPI event). */
export function pixelLead(opts?: { contentCategory?: string; value?: number }): void {
  pixelTrack('Lead', {
    content_category: opts?.contentCategory,
    value:            opts?.value ?? 100,
    currency:         'INR',
  });
}

/** Subscribe — call when subscription is confirmed by Razorpay handler (client side).
 *  NOTE: value/currency are intentionally omitted from the browser event to avoid
 *  Meta's "same value for all Subscribe events" warning (fixed ₹100/month subscription).
 *  The actual value is sent reliably via CAPI on the server side.
 */
export function pixelSubscribe(): void {
  pixelTrack('Subscribe', { predicted_ltv: 1200, currency: 'INR' });
}

/** CompleteRegistration — call after OTP verify success (client side). */
export function pixelCompleteRegistration(): void {
  pixelTrack('CompleteRegistration');
}
