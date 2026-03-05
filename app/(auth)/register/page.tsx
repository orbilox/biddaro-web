'use client';
import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { Eye, EyeOff, Mail, Lock, User, HardHat } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { authApi } from '@/lib/api';
import { useAuthStore } from '@/store/authStore';
import { toast } from '@/store/uiStore';
import { ROUTES } from '@/lib/constants';
import { cn } from '@/lib/utils';

interface RegisterForm {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export default function RegisterPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { setUser } = useAuthStore();
  const [role, setRole] = useState<'job_poster' | 'contractor'>(
    searchParams.get('type') === 'contractor' ? 'contractor' : 'job_poster'
  );
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<RegisterForm>();

  const onSubmit = async (data: RegisterForm) => {
    setLoading(true);
    try {
      const res = await authApi.register({
        email: data.email,
        password: data.password,
        firstName: data.firstName,
        lastName: data.lastName,
        role,
      });
      const { user, accessToken } = res.data.data;
      setUser(user, accessToken);
      toast.success('Account created!', `Welcome to Biddaro, ${user.firstName}!`);
      router.push(ROUTES.DASHBOARD);
    } catch (err: any) {
      toast.error('Registration failed', err?.response?.data?.message || 'Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-lg">
      <div className="bg-white rounded-2xl border border-gray-200 shadow-card p-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-dark-900">Create your account</h1>
          <p className="text-dark-500 text-sm mt-1.5">Join thousands of construction professionals</p>
        </div>

        {/* User type selector */}
        <div className="grid grid-cols-2 gap-3 mb-8">
          <button
            type="button"
            onClick={() => setRole('job_poster')}
            className={cn(
              'flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all duration-200',
              role === 'job_poster'
                ? 'border-brand-500 bg-brand-50'
                : 'border-gray-200 hover:border-gray-300'
            )}
          >
            <span className="text-2xl">📋</span>
            <div className="text-center">
              <p className={cn('text-sm font-semibold', role === 'job_poster' ? 'text-brand-700' : 'text-dark-800')}>
                Job Poster
              </p>
              <p className="text-xs text-dark-400 mt-0.5">I need work done</p>
            </div>
          </button>

          <button
            type="button"
            onClick={() => setRole('contractor')}
            className={cn(
              'flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all duration-200',
              role === 'contractor'
                ? 'border-brand-500 bg-brand-50'
                : 'border-gray-200 hover:border-gray-300'
            )}
          >
            <span className="text-2xl">⚡</span>
            <div className="text-center">
              <p className={cn('text-sm font-semibold', role === 'contractor' ? 'text-brand-700' : 'text-dark-800')}>
                Contractor
              </p>
              <p className="text-xs text-dark-400 mt-0.5">I do the work</p>
            </div>
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <Input
              label="First name"
              placeholder="John"
              leftIcon={<User className="w-4 h-4" />}
              error={errors.firstName?.message}
              {...register('firstName', { required: 'Required' })}
            />
            <Input
              label="Last name"
              placeholder="Doe"
              error={errors.lastName?.message}
              {...register('lastName', { required: 'Required' })}
            />
          </div>

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

          <Input
            label="Password"
            type={showPassword ? 'text' : 'password'}
            placeholder="Min. 8 characters"
            leftIcon={<Lock className="w-4 h-4" />}
            rightIcon={
              <button type="button" onClick={() => setShowPassword(!showPassword)}>
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            }
            error={errors.password?.message}
            {...register('password', {
              required: 'Password is required',
              minLength: { value: 8, message: 'At least 8 characters' },
            })}
          />

          <Input
            label="Confirm password"
            type="password"
            placeholder="Repeat your password"
            leftIcon={<Lock className="w-4 h-4" />}
            error={errors.confirmPassword?.message}
            {...register('confirmPassword', {
              required: 'Please confirm your password',
              validate: (val) => val === watch('password') || 'Passwords do not match',
            })}
          />

          <p className="text-xs text-dark-400 leading-relaxed">
            By creating an account, you agree to our{' '}
            <a href="#" className="text-brand-600 underline">Terms of Service</a>{' '}
            and{' '}
            <a href="#" className="text-brand-600 underline">Privacy Policy</a>.
          </p>

          <Button type="submit" fullWidth loading={loading} size="md">
            Create Account
          </Button>
        </form>

        <p className="text-center text-sm text-dark-500 mt-6">
          Already have an account?{' '}
          <Link href={ROUTES.LOGIN} className="text-brand-600 font-semibold hover:text-brand-700">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
