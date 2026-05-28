import Link from "next/link";
import { Suspense } from "react";
import { LockKeyhole } from "lucide-react";
import { BrandLogo } from "@/components/brand/logo";
import { Card } from "@/components/ui/card";
import { LoginForm } from "@/app/login/login-form";
import { GoogleLoginButton } from "@/components/auth/google-login-button";
import { getDictionary } from "@/lib/i18n/server";

export default function LoginPage() {
  const dictionary = getDictionary();

  return (
    <main className="grid min-h-screen place-items-center px-5 py-10">
      <div className="w-full max-w-md">
        <div className="mb-8 flex justify-center">
          <BrandLogo />
        </div>
        <Card className="p-6">
          <div className="mb-8 text-center">
            <div className="mx-auto grid h-12 w-12 place-items-center rounded-md border border-gold/35 bg-gold/10">
              <LockKeyhole className="h-5 w-5 text-gold" />
            </div>
            <h1 className="mt-5 font-display text-3xl text-cream">{dictionary.login.title}</h1>
            <p className="mt-2 text-sm text-cream/62">{dictionary.login.subtitle}</p>
          </div>
          <Suspense fallback={<div className="text-sm text-cream/62">{dictionary.login.loadingFallback}</div>}>
            <LoginForm dictionary={dictionary.login} />
          </Suspense>
          <div className="my-5 flex items-center gap-3 text-xs uppercase text-cream/36">
            <span className="h-px flex-1 bg-white/10" />
            {dictionary.login.separator}
            <span className="h-px flex-1 bg-white/10" />
          </div>
          <GoogleLoginButton label={dictionary.login.google} />
          <div className="mt-5 flex items-center justify-between text-sm text-cream/58">
            <Link href="/" className="hover:text-gold-light">
              {dictionary.login.backHome}
            </Link>
            <Link href="/forgot-password" className="hover:text-gold-light">
              {dictionary.login.forgot}
            </Link>
          </div>
          <div className="mt-5 border-t border-white/10 pt-5 text-center text-sm text-cream/58">
            {dictionary.login.noAccount}{" "}
            <Link href="/signup" className="text-gold-light hover:text-gold">
              {dictionary.login.createAccount}
            </Link>
          </div>
        </Card>
      </div>
    </main>
  );
}
