'use client';
import React, { useState } from 'react';
import Link from 'next/link';
import { Mail, ArrowLeft, CheckCircle } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { authApi } from '@/lib/api';
import { ROUTES } from '@/lib/constants';

export default function ForgotPasswordPage() {
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const { register, handleSubmit, formState: { errors }, getValues } = useForm<{ email: string }>();

  const onSubmit = async (data: { email: string }) => {
    setLoading(true);
    try {
      await authApi.forgotPassword(data.email);
    } catch {}
    setLoading(false);
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="w-full max-w-md">
        <div className="bg-white rounded-2xl border border-gray-200 shadow-card p-8 text-center">
          <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-5">
            <CheckCircle className="w-8 h-8 text-green-600" />
          </div>
          <h2 className="text-xl font-bold text-dark-900 mb-2">Check your email</h2>
          <p className="text-dark-500 text-sm mb-6 leading-relaxed">
            We&apos;ve sent a password reset link to <strong>{getValues('email')}</strong>.
            Check your inbox and follow the instructions.
          </p>
          <Link href={ROUTES.LOGIN}>
            <Button fullWidth variant="outline">
              Back to Sign In
            </Button>
          </Link>
          <p className="text-xs text-dark-400 mt-4">
            Didn&apos;t receive it?{' '}
            <button onClick={() => setSubmitted(false)} className="text-brand-600 underline">
              Try again
            </button>
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-md">
      <div className="bg-white rounded-2xl border border-gray-200 shadow-card p-8">
        <div className="text-center mb-8">
          <div className="w-12 h-12 rounded-xl bg-brand-50 flex items-center justify-center mx-auto mb-4">
            <Mail className="w-6 h-6 text-brand-500" />
          </div>
          <h1 className="text-2xl font-bold text-dark-900">Reset password</h1>
          <p className="text-dark-500 text-sm mt-1.5">
            Enter your email and we&apos;ll send you a reset link.
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <Input
            label="Email address"
            type="email"
            placeholder="you@example.com"
            leftIcon={<Mail className="w-4 h-4" />}
            error={errors.email?.message}
            {...register('email', {
              required: 'Email is required',
              pattern: { value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: 'Invalid email' },
            })}
          />
          <Button type="submit" fullWidth loading={loading}>
            Send Reset Link
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
    </div>
  );
}
