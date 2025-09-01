'use client';

import { useSearchParams } from 'next/navigation';
import { useCallback, useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { FormError } from '@/components/form-error';
import { FormSuccess } from '@/components/form-success';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { verifyEquipmentOTP, resendEquipmentOTP } from '@/actions/equipment-otp';
import { useRouter } from 'next/navigation';

export default function EquipmentOTPVerificationPage() {
  const [error, setError] = useState<string | undefined>();
  const [success, setSuccess] = useState<string | undefined>();
  const [isLoading, setIsLoading] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [otp, setOtp] = useState('');
  const searchParams = useSearchParams();
  const router = useRouter();
  const email = searchParams.get('email');

  const onSubmit = useCallback(async () => {
    if (success || error) return;

    if (!email) {
      setError('Email address is required!');
      return;
    }

    if (!otp || otp.length !== 6) {
      setError('Please enter a valid 6-digit OTP!');
      return;
    }

    setIsLoading(true);
    setError('');
    setSuccess('');

    try {
      const result = await verifyEquipmentOTP(email, otp);

      if (result.success) {
        setSuccess(result.success);
        // Redirect to home page after successful verification
        setTimeout(() => {
          router.push('/');
        }, 2000);
      } else if (result.error) {
        setError(result.error);
      }
    } catch (error) {
      setError('An unexpected error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  }, [email, otp, success, error, router]);

  const handleResendOTP = useCallback(async () => {
    if (!email) {
      setError('Email address is required!');
      return;
    }

    setIsResending(true);
    setError('');
    setSuccess('');

    try {
      const result = await resendEquipmentOTP(email);

      if (result.success) {
        setSuccess(result.success);
      } else if (result.error) {
        setError(result.error);
      }
    } catch (error) {
      setError('Failed to resend OTP. Please try again.');
    } finally {
      setIsResending(false);
    }
  }, [email]);

  useEffect(() => {
    if (!email) {
      setError('Email address is required!');
    }
  }, [email]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold text-gray-900">
            Verify Your Email
          </CardTitle>
          <p className="mt-2 text-sm text-gray-600">
            We've sent a 6-digit OTP to <strong>{email}</strong>
          </p>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="otp" className="text-sm font-medium text-gray-700">
              Enter OTP
            </Label>
            <Input
              id="otp"
              type="text"
              placeholder="000000"
              value={otp}
              onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
              className="text-center text-2xl font-mono tracking-widest"
              maxLength={6}
              disabled={isLoading}
            />
            <p className="text-xs text-gray-500">
              Enter the 6-digit code sent to your email
            </p>
          </div>

          <Button
            onClick={onSubmit}
            disabled={isLoading || !otp || otp.length !== 6}
            className="w-full"
          >
            {isLoading ? 'Verifying...' : 'Verify OTP'}
          </Button>

          <div className="text-center">
            <p className="text-sm text-gray-600">
              Didn't receive the OTP?
            </p>
            <Button
              variant="link"
              onClick={handleResendOTP}
              disabled={isResending}
              className="text-sm text-green-600 hover:text-green-500"
            >
              {isResending ? 'Sending...' : 'Resend OTP'}
            </Button>
          </div>

          <FormError message={error} />
          <FormSuccess message={success} />
        </CardContent>
      </Card>
    </div>
  );
}
