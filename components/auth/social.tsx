"use client";

import { signIn } from "next-auth/react";
import { FcGoogle } from "react-icons/fc";
import { FaGithub } from "react-icons/fa";
import { useSearchParams } from "next/navigation";

import { Button } from "@/components/ui/button";
import { DEFAULT_LOGIN_REDIRECT } from "@/routes";

export const Social = () => {
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl");

  const onClick = (provider: "google" | "github") => {
    signIn(provider, {
      callbackUrl: callbackUrl || DEFAULT_LOGIN_REDIRECT,
    });
  }

  return (
    <div className="space-y-4">
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t border-lime-300 dark:border-lime-600" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-white dark:bg-slate-950 px-2 text-lime-500 dark:text-lime-400 font-medium">
            Or continue with
          </span>
        </div>
      </div>

      <div className="flex items-center justify-center w-full gap-x-4">
        <Button
          size="lg"
          variant="outline"
          onClick={() => onClick("google")}
          className="flex-1 h-12 border border-lime-300 dark:border-lime-600 hover:border-lime-400 dark:hover:border-lime-500 text-lime-700 dark:text-lime-300 transition-all duration-200"
        >
          <FcGoogle className="h-5 w-5 mr-2" />
          Google
        </Button>
        <Button
          size="lg"
          variant="outline"
          onClick={() => onClick("github")}
          className="flex-1 h-12 border border-lime-300 dark:border-lime-600 hover:border-lime-400 dark:hover:border-lime-500 text-lime-700 dark:text-lime-300 transition-all duration-200"
        >
          <FaGithub className="h-5 w-5 mr-2" />
          GitHub
        </Button>
      </div>
    </div>
  );
};
