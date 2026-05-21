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

/** Subscribe — call when subscription is confirmed by Razorpay handler (client side). */
export function pixelSubscribe(): void {
  pixelTrack('Subscribe', { value: 100, currency: 'INR', predicted_ltv: 1200 });
}

/** CompleteRegistration — call after OTP verify success (client side). */
export function pixelCompleteRegistration(): void {
  pixelTrack('CompleteRegistration');
}
