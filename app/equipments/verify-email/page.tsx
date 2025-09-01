'use client';

import { useSearchParams } from 'next/navigation';
import { useCallback, useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { FormError } from '@/components/form-error';
import { FormSuccess } from '@/components/form-success';
import { verifyEquipmentEmail } from '@/actions/equipment-verification';

export default function EquipmentVerificationPage() {
  const [error, setError] = useState<string | undefined>();
  const [success, setSuccess] = useState<string | undefined>();
  const searchParams = useSearchParams();
  const token = searchParams.get('token');

  const onSubmit = useCallback(() => {
    if (success || error) return;

    if (!token) {
      setError('Missing token!');
      return;
    }

    verifyEquipmentEmail(token)
      .then((data) => {
        if (data?.error) {
          setError(data.error);
        }

        if (data?.success) {
          setSuccess(data.success);
        }
      })
      .catch(() => setError('Something went wrong!'));
  }, [token, success, error]);

  useEffect(() => {
    onSubmit();
  }, [onSubmit]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-background">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">
            Equipment Registration Email Verification
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <FormError message={error} />
          <FormSuccess message={success} />
          {!error && !success && (
            <div className="text-center">
              <p className="text-muted-foreground">
                Verifying your email address...
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
