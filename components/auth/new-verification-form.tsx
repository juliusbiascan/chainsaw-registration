"use client";

import { useCallback, useEffect, useState } from "react";
import { BeatLoader } from "react-spinners";
import { useSearchParams } from "next/navigation";

import { newVerification } from "@/actions/new-verification";
import { FormError } from "@/components/form-error";
import { FormSuccess } from "@/components/form-success";
import { Header } from "./header";
import { BackButton } from "./back-button";

export const NewVerificationForm = () => {
  const [error, setError] = useState<string | undefined>();
  const [success, setSuccess] = useState<string | undefined>();

  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const onSubmit = useCallback(() => {
    if (success || error) return;

    if (!token) {
      setError("Missing token!");
      return;
    }

    newVerification(token)
      .then((data) => {
        setSuccess(data.success);
        setError(data.error);
      })
      .catch(() => {
        setError("Something went wrong!");
      })
  }, [token, success, error]);

  useEffect(() => {
    onSubmit();
  }, [onSubmit]);

  return (
    <div className="w-full space-y-8">
      {/* Header */}
      <Header label="Confirming your verification" />

      {/* Content */}
      <div className="space-y-6">
        <div className="flex items-center w-full justify-center min-h-[120px]">
          {!success && !error && (
            <div className="flex flex-col items-center space-y-4">
              <BeatLoader color="currentColor" className="text-lime-600 dark:text-lime-300" />
              <p className="text-lime-600 dark:text-lime-300 text-sm font-medium">Verifying your account...</p>
            </div>
          )}
          <FormSuccess message={success} />
          {!success && (
            <FormError message={error} />
          )}
        </div>
      </div>

      {/* Back Button */}
      <div className="flex justify-center pt-4">
        <BackButton
          label="Back to login"
          href="/auth/login"
        />
      </div>
    </div>
  )
}