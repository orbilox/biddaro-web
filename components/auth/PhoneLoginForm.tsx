'use client';
import React, { useState, useRef } from 'react';
import { Phone, MessageSquare } from 'lucide-react';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { authApi } from '@/lib/api';
import { useAuthStore } from '@/store/authStore';
import { toast } from '@/store/uiStore';
import { getFirebaseAuth } from '@/lib/firebase';
import { RecaptchaVerifier, signInWithPhoneNumber, type ConfirmationResult } from 'firebase/auth';

interface Props {
  onSuccess?: () => void;
}

export function PhoneLoginForm({ onSuccess }: Props) {
  const { setUser } = useAuthStore();
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [step, setStep] = useState<'phone' | 'otp'>('phone');
  const [loading, setLoading] = useState(false);
  const confirmationRef = useRef<ConfirmationResult | null>(null);
  const recaptchaRef = useRef<RecaptchaVerifier | null>(null);
  const recaptchaContainerRef = useRef<HTMLDivElement>(null);

  const sendOtp = async () => {
    const full = phone.startsWith('+') ? phone : `+91${phone}`;
    if (full.length < 10) {
      toast.error('Invalid number', 'Enter a valid phone number with country code.');
      return;
    }
    setLoading(true);
    try {
      const auth = getFirebaseAuth();
      if (!recaptchaRef.current) {
        recaptchaRef.current = new RecaptchaVerifier(auth, recaptchaContainerRef.current!, {
          size: 'invisible',
        });
      }
      confirmationRef.current = await signInWithPhoneNumber(auth, full, recaptchaRef.current);
      setStep('otp');
      toast.success('OTP sent', `Code sent to ${full}`);
    } catch (err: any) {
      toast.error('Failed to send OTP', err?.message || 'Please try again.');
      recaptchaRef.current = null;
    } finally {
      setLoading(false);
    }
  };

  const verifyOtp = async () => {
    if (otp.length !== 6) {
      toast.error('Invalid code', 'Enter the 6-digit code from your SMS.');
      return;
    }
    setLoading(true);
    try {
      const result = await confirmationRef.current!.confirm(otp);
      const idToken = await result.user.getIdToken();
      const res = await authApi.phoneVerify(idToken);
      const { user, accessToken } = res.data.data;
      setUser(user, accessToken);
      toast.success('Welcome!', `Signed in as ${user.phone || user.email}`);
      onSuccess?.();
    } catch (err: any) {
      toast.error('Verification failed', err?.response?.data?.message || 'Wrong or expired code.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      {step === 'phone' ? (
        <>
          <Input
            label="Phone number"
            type="tel"
            placeholder="+91 98765 43210"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            leftIcon={<Phone className="w-4 h-4" />}
            hint="Include country code, e.g. +91 for India"
          />
          <Button
            type="button"
            fullWidth
            loading={loading}
            size="md"
            onClick={sendOtp}
          >
            Send OTP
          </Button>
        </>
      ) : (
        <>
          <p className="text-sm text-dark-500 text-center">
            Enter the 6-digit code sent to <span className="font-medium text-dark-800">{phone}</span>
          </p>
          <Input
            label="Verification code"
            type="text"
            inputMode="numeric"
            maxLength={6}
            placeholder="123456"
            value={otp}
            onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
            leftIcon={<MessageSquare className="w-4 h-4" />}
          />
          <Button
            type="button"
            fullWidth
            loading={loading}
            size="md"
            onClick={verifyOtp}
          >
            Verify &amp; Sign In
          </Button>
          <button
            type="button"
            className="w-full text-xs text-dark-400 hover:text-brand-600 text-center"
            onClick={() => { setStep('phone'); setOtp(''); recaptchaRef.current = null; }}
          >
            Change number
          </button>
        </>
      )}
      {/* Invisible reCAPTCHA container required by Firebase */}
      <div ref={recaptchaContainerRef} />
    </div>
  );
}
