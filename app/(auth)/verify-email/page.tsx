'use client';
import React, { useState, useRef, useEffect, useCallback, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Mail, ArrowLeft, RefreshCw, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { authApi } from '@/lib/api';
import { useAuthStore } from '@/store/authStore';
import { toast } from '@/store/uiStore';
import { ROUTES } from '@/lib/constants';
import { track } from '@/lib/analytics';

// ─── Inner component (needs searchParams) ─────────────────────────────────────

function VerifyEmailForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get('email') || '';
  const { setUser } = useAuthStore();

  const [digits, setDigits] = useState<string[]>(Array(6).fill(''));
  const [loading, setLoading] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);
  const [cooldown, setCooldown] = useState(0);
  const [verified, setVerified] = useState(false);

  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Redirect if no email param
  useEffect(() => {
    if (!email) router.replace('/register');
  }, [email, router]);

  // Cooldown countdown
  useEffect(() => {
    if (cooldown <= 0) return;
    const t = setTimeout(() => setCooldown((c) => c - 1), 1000);
    return () => clearTimeout(t);
  }, [cooldown]);

  const code = digits.join('');
  const isComplete = code.length === 6 && digits.every((d) => d !== '');

  // ── Digit input handling ─────────────────────────────────────────────────────

  const handleChange = (index: number, value: string) => {
    // Accept only digits
    const digit = value.replace(/\D/g, '').slice(-1);
    const next = [...digits];
    next[index] = digit;
    setDigits(next);
    if (digit && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace') {
      if (digits[index]) {
        const next = [...digits];
        next[index] = '';
        setDigits(next);
      } else if (index > 0) {
        inputRefs.current[index - 1]?.focus();
      }
    }
    if (e.key === 'ArrowLeft' && index > 0) inputRefs.current[index - 1]?.focus();
    if (e.key === 'ArrowRight' && index < 5) inputRefs.current[index + 1]?.focus();
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
    if (!pasted) return;
    const next = Array(6).fill('');
    pasted.split('').forEach((ch, i) => { next[i] = ch; });
    setDigits(next);
    const focusIndex = Math.min(pasted.length, 5);
    inputRefs.current[focusIndex]?.focus();
  };

  // ── Submit ───────────────────────────────────────────────────────────────────

  const handleVerify = useCallback(async () => {
    if (!isComplete || loading) return;
    setLoading(true);
    try {
      const res = await authApi.verifyOtp(email, code);
      const { user, accessToken } = res.data.data;
      setUser(user, accessToken);
      setVerified(true);
      track.otpVerified();
      track.signUp({ role: user.role, country: user.country });
      toast.success('Email verified!', `Welcome to Biddaro, ${user.firstName}!`);
      setTimeout(() => router.push(ROUTES.DASHBOARD), 1200);
    } catch (err: any) {
      toast.error(
        'Verification failed',
        err?.response?.data?.message || 'Invalid or expired code.',
      );
      // Clear digits on wrong code
      setDigits(Array(6).fill(''));
      inputRefs.current[0]?.focus();
    } finally {
      setLoading(false);
    }
  }, [code, email, isComplete, loading, router, setUser]);

  // Auto-submit when all 6 digits filled
  useEffect(() => {
    if (isComplete) handleVerify();
  }, [isComplete, handleVerify]);

  // ── Resend ───────────────────────────────────────────────────────────────────

  const handleResend = async () => {
    if (cooldown > 0 || resendLoading) return;
    setResendLoading(true);
    try {
      await authApi.sendOtp(email);
      track.otpResend({ email });
      toast.success('Code resent!', 'Check your inbox for the new 6-digit code.');
      setCooldown(60);
      setDigits(Array(6).fill(''));
      inputRefs.current[0]?.focus();
    } catch (err: any) {
      toast.error('Failed to resend', err?.response?.data?.message || 'Please try again.');
    } finally {
      setResendLoading(false);
    }
  };

  // ── Verified state ───────────────────────────────────────────────────────────

  if (verified) {
    return (
      <div className="w-full max-w-md">
        <div className="bg-white rounded-2xl border border-gray-200 shadow-card p-10 text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="w-9 h-9 text-green-600" />
          </div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">Email verified!</h2>
          <p className="text-gray-500 text-sm">Redirecting you to your dashboard…</p>
        </div>
      </div>
    );
  }

  // ── Main OTP UI ──────────────────────────────────────────────────────────────

  return (
    <div className="w-full max-w-md">
      <div className="bg-white rounded-2xl border border-gray-200 shadow-card p-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-14 h-14 bg-brand-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Mail className="w-7 h-7 text-brand-600" />
          </div>
          <h1 className="text-2xl font-bold text-dark-900">Verify your email</h1>
          <p className="text-dark-500 text-sm mt-2">
            We sent a 6-digit code to
          </p>
          <p className="text-sm font-semibold text-gray-800 mt-0.5 break-all">{email}</p>
        </div>

        {/* OTP digit inputs */}
        <div className="flex justify-center gap-2 sm:gap-3 mb-6" onPaste={handlePaste}>
          {digits.map((digit, i) => (
            <input
              key={i}
              ref={(el) => { inputRefs.current[i] = el; }}
              type="text"
              inputMode="numeric"
              maxLength={1}
              value={digit}
              onChange={(e) => handleChange(i, e.target.value)}
              onKeyDown={(e) => handleKeyDown(i, e)}
              autoFocus={i === 0}
              className={[
                'w-11 h-14 sm:w-12 sm:h-16 text-center text-xl font-bold rounded-xl border-2',
                'focus:outline-none focus:ring-2 focus:ring-brand-400 transition-all',
                digit
                  ? 'border-brand-500 bg-brand-50 text-brand-700'
                  : 'border-gray-200 bg-gray-50 text-gray-800',
              ].join(' ')}
            />
          ))}
        </div>

        {/* Verify button */}
        <Button
          fullWidth
          size="md"
          loading={loading}
          disabled={!isComplete || loading}
          onClick={handleVerify}
          className="mb-4"
        >
          Verify Account
        </Button>

        {/* Resend */}
        <div className="text-center">
          {cooldown > 0 ? (
            <p className="text-sm text-gray-500">
              Resend available in <span className="font-semibold text-brand-600">{cooldown}s</span>
            </p>
          ) : (
            <button
              onClick={handleResend}
              disabled={resendLoading}
              className="inline-flex items-center gap-1.5 text-sm text-brand-600 hover:text-brand-700
                         font-medium transition-colors disabled:opacity-50"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${resendLoading ? 'animate-spin' : ''}`} />
              {resendLoading ? 'Sending…' : "Didn't receive it? Resend code"}
            </button>
          )}
        </div>

        {/* Expiry note */}
        <p className="text-center text-xs text-gray-400 mt-4">
          Code expires in 10 minutes
        </p>

        {/* Back link */}
        <div className="border-t border-gray-100 mt-6 pt-4 text-center">
          <a
            href="/register"
            className="inline-flex items-center gap-1 text-xs text-gray-400 hover:text-gray-600 transition-colors"
          >
            <ArrowLeft className="w-3 h-3" /> Wrong email? Go back to register
          </a>
        </div>
      </div>
    </div>
  );
}

// ─── Page wrapper with Suspense ───────────────────────────────────────────────

export default function VerifyEmailPage() {
  return (
    <Suspense>
      <VerifyEmailForm />
    </Suspense>
  );
}
