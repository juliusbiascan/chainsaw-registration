"use client";

import { useSearchParams } from "next/navigation";
import { FormError } from "@/components/form-error";
import { Header } from "./header";
import { BackButton } from "./back-button";

export const ErrorCard = () => {
  const searchParams = useSearchParams();
  const error = searchParams.get("error");

  let errorMessage = "Oops! Something went wrong!";

  if (error === "Configuration") {
    errorMessage = "There was a problem with the server configuration.";
  }

  return (
    <div className="w-full space-y-8">
      {/* Header */}
      <Header label="Oops! Something went wrong!" />

      {/* Error Content */}
      <div className="space-y-6">
        <div className="flex items-center justify-center min-h-[120px]">
          <FormError message={errorMessage} />
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
  );
};
