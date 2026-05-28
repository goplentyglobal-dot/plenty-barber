"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";

export function ResetPasswordForm() {
  const router = useRouter();
  const [message, setMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage(null);
    setIsLoading(true);

    const formData = new FormData(event.currentTarget);
    const password = String(formData.get("password") ?? "");
    const supabase = createSupabaseBrowserClient();
    const { error } = await supabase.auth.updateUser({ password });

    setIsLoading(false);

    if (error) {
      setMessage(error.message);
      return;
    }

    router.push("/dashboard");
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit} className="grid gap-4">
      {message ? (
        <div className="rounded-md border border-red-400/30 bg-red-500/10 p-3 text-sm text-red-100">
          {message}
        </div>
      ) : null}
      <input
        name="password"
        type="password"
        placeholder="New password, minimum 8 characters"
        minLength={8}
        required
        className="min-h-12 rounded-md border border-white/10 bg-noir px-4 text-cream outline-none placeholder:text-cream/30 focus:border-gold/70"
      />
      <Button type="submit" disabled={isLoading}>
        {isLoading ? "Saving..." : "Save new password"}
      </Button>
    </form>
  );
}
