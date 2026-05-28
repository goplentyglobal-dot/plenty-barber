"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState, type FormEvent } from "react";
import { AlertCircle, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/toast-provider";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";
import { hasSupabasePublicEnv } from "@/lib/validations/env";
type LoginDictionary = {
  email: string;
  password: string;
  submit: string;
  loading: string;
  demoUnavailable: string;
  genericError: string;
  businessUserRequired: string;
  unauthorized: string;
  invalidCredentials: string;
};

export function LoginForm({ dictionary }: { dictionary: LoginDictionary }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [error, setError] = useState<string | null>(searchParams.get("error"));
  const [isLoading, setIsLoading] = useState(false);
  const { showToast } = useToast();

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);

    if (!hasSupabasePublicEnv()) {
      const response = await fetch("/api/auth/demo-login", { method: "POST" });

      if (!response.ok) {
        setError(dictionary.demoUnavailable);
        showToast({ type: "error", title: dictionary.demoUnavailable, persistent: true });
        return;
      }

      const next = searchParams.get("next") || "/dashboard";
      router.push(next);
      router.refresh();
      return;
    }

    const formData = new FormData(event.currentTarget);
    const email = String(formData.get("email") ?? "");
    const password = String(formData.get("password") ?? "");

    setIsLoading(true);

    try {
      const supabase = createSupabaseBrowserClient();
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (signInError) {
        setError(signInError.message);
        showToast({
          type: "error",
          title: formatLoginError(signInError.message, dictionary),
          persistent: true
        });
        return;
      }

      const next = searchParams.get("next") || "/dashboard";
      router.push(next);
      router.refresh();
    } catch {
      setError(dictionary.genericError);
      showToast({ type: "error", title: dictionary.genericError, persistent: true });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <form className="grid gap-4" onSubmit={handleSubmit}>
      {error ? (
        <div className="flex gap-3 rounded-md border border-red-400/30 bg-red-500/10 p-3 text-sm text-red-100">
          <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
          <span>{formatLoginError(error, dictionary)}</span>
        </div>
      ) : null}
      <label className="grid gap-2 text-sm text-cream/72">
        {dictionary.email}
        <input
          name="email"
          type="email"
          placeholder="owner@salon.com"
          autoComplete="email"
          required
          className="min-h-12 rounded-full border border-white/10 bg-noir px-4 text-cream outline-none transition placeholder:text-cream/30 focus:border-gold/70"
        />
      </label>
      <label className="grid gap-2 text-sm text-cream/72">
        {dictionary.password}
        <input
          name="password"
          type="password"
          placeholder={dictionary.password}
          autoComplete="current-password"
          required
          className="min-h-12 rounded-full border border-white/10 bg-noir px-4 text-cream outline-none transition placeholder:text-cream/30 focus:border-gold/70"
        />
      </label>
      <Button type="submit" disabled={isLoading} className="mt-2 w-full gap-2">
        {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
        {isLoading ? dictionary.loading : dictionary.submit}
      </Button>
    </form>
  );
}

function formatLoginError(error: string, dictionary: LoginDictionary) {
  if (error === "business_user_required") {
    return dictionary.businessUserRequired;
  }

  if (error === "unauthorized") {
    return dictionary.unauthorized;
  }

  if (error === "Invalid login credentials") {
    return dictionary.invalidCredentials;
  }

  return error;
}
