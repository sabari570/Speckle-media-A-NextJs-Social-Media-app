"use client";

import { signupSchema, SignupValues } from "@/lib/validation";
import React, { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { PasswordInput } from "@/components/PasswordInput";
import LoadingButton from "@/components/LoadingButton";
import { signup } from "./actions";

export default function SignupForm() {
  const [error, setError] = useState<string>();

  // We use the `useTransition` hook here to manage the pending state of our form submission.
  // Unlike `useState` or `form.formState.isSubmitting`, `useTransition` ensures that the `isPending` state remains `true`
  // until all asynchronous operations, including server actions and redirections, are completed.
  // This avoids prematurely setting the loading state to `false`, which could result in a poor user experience,
  // especially if there are delays during server-side actions like database updates or redirections.
  const [isPending, startTransition] = useTransition();

  const form = useForm<SignupValues>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      email: "",
      username: "",
      password: "",
    },
  });

  async function onSubmit(values: SignupValues) {
    setError(undefined);
    startTransition(async () => {
      const { error } = await signup(values);
      if (error) setError(error);
    });
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-3">
        <FormField
          control={form.control}
          name="username"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Username</FormLabel>
              <FormControl>
                <Input placeholder="Username" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input placeholder="Email" type="email" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Password</FormLabel>
              <FormControl>
                <PasswordInput placeholder="Password" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="pt-2">
          <LoadingButton loading={isPending} type="submit" classname="w-full">
            <span>Create account</span>
          </LoadingButton>
        </div>
        {error && <p className="mt-2 text-center text-destructive">{error}</p>}
      </form>
    </Form>
  );
}
