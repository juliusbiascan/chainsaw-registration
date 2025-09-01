"use client";

import * as z from "zod";
import { useForm } from "react-hook-form";
import { useState, useTransition } from "react";
import { zodResolver } from "@hookform/resolvers/zod";

import { ResetSchema } from "@/schemas";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { FormError } from "@/components/form-error";
import { FormSuccess } from "@/components/form-success";
import { reset } from "@/actions/reset";
import React from "react";
import { Icons } from "../icons";
import { Header } from "./header";
import { BackButton } from "./back-button";

export const ResetForm = () => {
  const [error, setError] = useState<string | undefined>("");
  const [success, setSuccess] = useState<string | undefined>("");
  const [isPending, startTransition] = useTransition();

  const form = useForm<z.infer<typeof ResetSchema>>({
    resolver: zodResolver(ResetSchema),
    defaultValues: {
      email: "",
    },
  });

  const onSubmit = (values: z.infer<typeof ResetSchema>) => {
    setError("");
    setSuccess("");

    startTransition(() => {
      reset(values)
        .then((data) => {
          setError(data?.error);
          setSuccess(data?.success);
        });
    });
  };

  return (
    <div className="w-full space-y-8">
      {/* Header */}
      <Header label="Forgot your password?" />

      {/* Form */}
      <div className="space-y-6">
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-6"
          >
            <div className="space-y-4">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-lime-700 dark:text-lime-300 font-medium">Email</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        disabled={isPending}
                        placeholder="john.doe@example.com"
                        type="email"
                        className="border-lime-200 dark:border-lime-700 focus:border-lime-400 dark:focus:border-lime-500"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <FormError message={error} />
            <FormSuccess message={success} />
            <Button
              disabled={isPending}
              type="submit"
              className="w-full bg-lime-600 dark:bg-lime-600 text-lime-50 dark:text-lime-50 hover:bg-lime-700 dark:hover:bg-lime-700 font-semibold py-3 px-4 rounded-lg transition-all duration-200 shadow-sm hover:shadow-md h-12"
            >
              {isPending && <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />}
              Send reset email
            </Button>
          </form>
        </Form>
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
