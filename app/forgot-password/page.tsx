import Link from "next/link";
import { Mail } from "lucide-react";
import { AuthSubmitButton } from "@/components/auth/auth-submit-button";
import { BrandLogo } from "@/components/brand/logo";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { sendPasswordReset } from "@/app/forgot-password/actions";
import { getDictionary } from "@/lib/i18n/server";

export default function ForgotPasswordPage({
  searchParams
}: {
  searchParams?: { error?: string; sent?: string };
}) {
  const dictionary = getDictionary();
  const forgot = dictionary.forgotPassword;

  return (
    <main className="grid min-h-screen place-items-center px-5 py-10">
      <div className="w-full max-w-md">
        <div className="mb-8 flex justify-center">
          <BrandLogo />
        </div>
        <Card className="p-6">
          <div className="mb-8 text-center">
            <div className="mx-auto grid h-12 w-12 place-items-center rounded-md border border-gold/35 bg-gold/10">
              <Mail className="h-5 w-5 text-gold" />
            </div>
            <h1 className="mt-5 font-display text-3xl text-cream">{forgot.title}</h1>
            <p className="mt-2 text-sm text-cream/62">
              {forgot.subtitle}
            </p>
          </div>
          {searchParams?.error ? (
            <div className="mb-5 rounded-md border border-red-400/30 bg-red-500/10 p-3 text-sm text-red-100">
              {searchParams.error}
            </div>
          ) : null}
          {searchParams?.sent ? (
            <div className="mb-5 rounded-md border border-emerald-400/30 bg-emerald-500/10 p-3 text-sm text-emerald-100">
              {forgot.sent}
            </div>
          ) : null}
          <form action={sendPasswordReset} className="grid gap-4">
            <Input
              name="email"
              type="email"
              placeholder={forgot.email}
              required
            />
            <AuthSubmitButton idleLabel={forgot.submit} pendingLabel={forgot.loading} />
          </form>
          <div className="mt-5 text-center text-sm text-cream/58">
            <Link href="/login" className="hover:text-gold-light">
              {forgot.backLogin}
            </Link>
          </div>
        </Card>
      </div>
    </main>
  );
}
