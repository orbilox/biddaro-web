'use client';
import React, { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams, useRouter } from 'next/navigation';
import { Lock, Eye, EyeOff, ArrowLeft, CheckCircle, AlertCircle } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { authApi } from '@/lib/api';
import { ROUTES } from '@/lib/constants';

// ─── Inner component (needs useSearchParams, must be inside Suspense) ─────────

function ResetPasswordForm() {
  const searchParams = useSearchParams();
  const router       = useRouter();
  const token        = searchParams.get('token') ?? '';

  const [loading,     setLoading]     = useState(false);
  const [done,        setDone]        = useState(false);
  const [serverError, setServerError] = useState('');
  const [showPwd,     setShowPwd]     = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<{ newPassword: string; confirmPassword: string }>();

  // Redirect to forgot-password if no token in URL
  useEffect(() => {
    if (!token) {
      router.replace(ROUTES.FORGOT_PASSWORD);
    }
  }, [token, router]);

  const onSubmit = async (data: { newPassword: string; confirmPassword: string }) => {
    setLoading(true);
    setServerError('');
    try {
      await authApi.resetPassword({ token, newPassword: data.newPassword });
      setDone(true);
    } catch (err: unknown) {
      const msg =
        (err as { response?: { data?: { message?: string } } })?.response?.data?.message ??
        'Something went wrong. Please request a new reset link.';
      setServerError(msg);
    } finally {
      setLoading(false);
    }
  };

  // ── Success state ──────────────────────────────────────────────────────────
  if (done) {
    return (
      <div className="bg-white rounded-2xl border border-gray-200 shadow-card p-8 text-center">
        <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-5">
          <CheckCircle className="w-8 h-8 text-green-600" />
        </div>
        <h2 className="text-xl font-bold text-dark-900 mb-2">Password updated!</h2>
        <p className="text-dark-500 text-sm mb-6 leading-relaxed">
          Your password has been reset successfully. You can now sign in with your new password.
        </p>
        <Link href={ROUTES.LOGIN}>
          <Button fullWidth>Sign In</Button>
        </Link>
      </div>
    );
  }

  // ── Form ───────────────────────────────────────────────────────────────────
  return (
    <div className="bg-white rounded-2xl border border-gray-200 shadow-card p-8">
      <div className="text-center mb-8">
        <div className="w-12 h-12 rounded-xl bg-brand-50 flex items-center justify-center mx-auto mb-4">
          <Lock className="w-6 h-6 text-brand-500" />
        </div>
        <h1 className="text-2xl font-bold text-dark-900">Choose a new password</h1>
        <p className="text-dark-500 text-sm mt-1.5">
          Must be at least 8 characters long.
        </p>
      </div>

      {serverError && (
        <div className="mb-4 flex items-start gap-2.5 rounded-xl bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">
          <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
          <span>{serverError}</span>
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="relative">
          <Input
            label="New password"
            type={showPwd ? 'text' : 'password'}
            placeholder="At least 8 characters"
            leftIcon={<Lock className="w-4 h-4" />}
            error={errors.newPassword?.message}
            {...register('newPassword', {
              required: 'New password is required',
              minLength: { value: 8, message: 'Password must be at least 8 characters' },
            })}
          />
          <button
            type="button"
            onClick={() => setShowPwd((p) => !p)}
            className="absolute right-3 top-9 text-dark-400 hover:text-dark-700 transition-colors"
            tabIndex={-1}
          >
            {showPwd ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </button>
        </div>

        <div className="relative">
          <Input
            label="Confirm new password"
            type={showConfirm ? 'text' : 'password'}
            placeholder="Repeat your password"
            leftIcon={<Lock className="w-4 h-4" />}
            error={errors.confirmPassword?.message}
            {...register('confirmPassword', {
              required: 'Please confirm your password',
              validate: (value) =>
                value === watch('newPassword') || 'Passwords do not match',
            })}
          />
          <button
            type="button"
            onClick={() => setShowConfirm((p) => !p)}
            className="absolute right-3 top-9 text-dark-400 hover:text-dark-700 transition-colors"
            tabIndex={-1}
          >
            {showConfirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </button>
        </div>

        <Button type="submit" fullWidth loading={loading}>
          Reset Password
        </Button>
      </form>

      <Link
        href={ROUTES.LOGIN}
        className="flex items-center justify-center gap-1.5 text-sm text-dark-500 hover:text-dark-800 mt-6 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to sign in
      </Link>
    </div>
  );
}

// ─── Page wrapper (Suspense required for useSearchParams in Next.js App Router) ─

export default function ResetPasswordPage() {
  return (
    <div className="w-full max-w-md">
      <Suspense fallback={
        <div className="bg-white rounded-2xl border border-gray-200 shadow-card p-8 text-center">
          <div className="w-12 h-12 rounded-xl bg-brand-50 flex items-center justify-center mx-auto mb-4">
            <Lock className="w-6 h-6 text-brand-500" />
          </div>
          <p className="text-dark-500 text-sm">Loading…</p>
        </div>
      }>
        <ResetPasswordForm />
      </Suspense>
    </div>
  );
}
