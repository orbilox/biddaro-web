'use client';
import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Eye, EyeOff, Mail, Lock } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { authApi } from '@/lib/api';
import { useAuthStore } from '@/store/authStore';
import { toast } from '@/store/uiStore';
import { ROUTES } from '@/lib/constants';

interface LoginForm {
  email: string;
  password: string;
}

export default function LoginPage() {
  const router = useRouter();
  const { setUser } = useAuthStore();
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginForm>();

  const onSubmit = async (data: LoginForm) => {
    setLoading(true);
    try {
      const res = await authApi.login(data);
      const { user, accessToken } = res.data.data;
      setUser(user, accessToken);
      toast.success('Welcome back!', `Good to see you, ${user.firstName}.`);
      router.push(ROUTES.DASHBOARD);
    } catch (err: any) {
      toast.error(
        'Login failed',
        err?.response?.data?.message || 'Invalid email or password.'
      );
    } finally {
      setLoading(false);
    }
  };

  // Demo credentials handler
  const loginAs = async (type: 'poster' | 'contractor') => {
    const demo = {
      poster: { email: 'alice@example.com', password: 'password123' },
      contractor: { email: 'bob@example.com', password: 'password123' },
    };
    setLoading(true);
    try {
      const res = await authApi.login(demo[type]);
      const { user, accessToken } = res.data.data;
      setUser(user, accessToken);
      toast.success('Welcome back!', `Good to see you, ${user.firstName}.`);
      router.push(ROUTES.DASHBOARD);
    } catch (err: any) {
      toast.error('Login failed', err?.response?.data?.message || 'Invalid credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md">
      <div className="bg-white rounded-2xl border border-gray-200 shadow-card p-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-dark-900">Welcome back</h1>
          <p className="text-dark-500 text-sm mt-1.5">Sign in to your Biddaro account</p>
        </div>

        {/* Demo buttons */}
        <div className="grid grid-cols-2 gap-3 mb-6">
          <button
            onClick={() => loginAs('poster')}
            className="text-xs py-2.5 px-4 rounded-lg border border-gray-200 hover:border-brand-300 hover:bg-brand-50 text-dark-600 hover:text-brand-600 transition-all font-medium"
          >
            📋 Demo Job Poster
          </button>
          <button
            onClick={() => loginAs('contractor')}
            className="text-xs py-2.5 px-4 rounded-lg border border-gray-200 hover:border-brand-300 hover:bg-brand-50 text-dark-600 hover:text-brand-600 transition-all font-medium"
          >
            ⚡ Demo Contractor
          </button>
        </div>

        <div className="relative mb-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-200" />
          </div>
          <div className="relative flex justify-center">
            <span className="bg-white px-3 text-xs text-dark-400">or sign in with email</span>
          </div>
        </div>

        {/* Form */}
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

          <Input
            label="Password"
            type={showPassword ? 'text' : 'password'}
            placeholder="Your password"
            leftIcon={<Lock className="w-4 h-4" />}
            rightIcon={
              <button type="button" onClick={() => setShowPassword(!showPassword)}>
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            }
            error={errors.password?.message}
            {...register('password', { required: 'Password is required' })}
          />

          <div className="flex items-center justify-end">
            <Link
              href={ROUTES.FORGOT_PASSWORD}
              className="text-xs text-brand-600 hover:text-brand-700 font-medium"
            >
              Forgot password?
            </Link>
          </div>

          <Button type="submit" fullWidth loading={loading} size="md">
            Sign In
          </Button>
        </form>

        <p className="text-center text-sm text-dark-500 mt-6">
          Don&apos;t have an account?{' '}
          <Link href={ROUTES.REGISTER} className="text-brand-600 font-semibold hover:text-brand-700">
            Sign up free
          </Link>
        </p>
      </div>
    </div>
  );
}
