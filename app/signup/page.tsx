import Link from "next/link";
import { Crown } from "lucide-react";
import { AuthSubmitButton } from "@/components/auth/auth-submit-button";
import { BrandLogo } from "@/components/brand/logo";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { createBusinessAccount } from "@/app/signup/actions";
import { GoogleLoginButton } from "@/components/auth/google-login-button";
import { getDictionary } from "@/lib/i18n/server";

export default function SignupPage({
  searchParams
}: {
  searchParams?: { error?: string };
}) {
  const dictionary = getDictionary();
  const signup = dictionary.signup;

  return (
    <main className="grid min-h-screen place-items-center px-5 py-10">
      <div className="w-full max-w-xl">
        <div className="mb-8 flex justify-center">
          <BrandLogo />
        </div>
        <Card className="p-6">
          <div className="mb-8 text-center">
            <div className="mx-auto grid h-12 w-12 place-items-center rounded-md border border-gold/35 bg-gold/10">
              <Crown className="h-5 w-5 text-gold" />
            </div>
            <h1 className="mt-5 font-display text-3xl text-cream">{signup.title}</h1>
            <p className="mt-2 text-sm text-cream/62">
              {signup.subtitle}
            </p>
          </div>

          {searchParams?.error ? (
            <div className="mb-5 rounded-md border border-red-400/30 bg-red-500/10 p-3 text-sm text-red-100">
              {searchParams.error}
            </div>
          ) : null}

          <form action={createBusinessAccount} className="grid gap-4">
            <Input
              name="business_name"
              placeholder={signup.businessName}
              required
            />
            <Input
              name="full_name"
              placeholder={signup.ownerName}
              required
            />
            <Input
              name="email"
              type="email"
              placeholder={signup.email}
              required
            />
            <Input
              name="password"
              type="password"
              placeholder={signup.password}
              required
            />
            <div className="flex items-start gap-3">
              <input
                id="terms"
                name="terms"
                type="checkbox"
                required
                value="accepted"
                className="peer mt-0.5 h-4 w-4 shrink-0 cursor-pointer appearance-none rounded border border-gold/40 bg-noir outline-none transition checked:border-gold checked:bg-gold focus-visible:ring-2 focus-visible:ring-gold/30"
              />
              <Label htmlFor="terms" className="cursor-pointer">
                {signup.terms}
              </Label>
            </div>
            <AuthSubmitButton idleLabel={signup.submit} pendingLabel={signup.loading} />
          </form>

          <div className="my-5 flex items-center gap-3 text-xs uppercase text-cream/36">
            <span className="h-px flex-1 bg-white/10" />
            {signup.separator}
            <span className="h-px flex-1 bg-white/10" />
          </div>
          <GoogleLoginButton label={signup.google} />

          <div className="mt-5 text-center text-sm text-cream/58">
            <Link href="/login" className="hover:text-gold-light">
              {signup.already}
            </Link>
          </div>
        </Card>
      </div>
    </main>
  );
}
