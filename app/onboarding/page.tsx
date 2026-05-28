import { Building2 } from "lucide-react";
import { AuthSubmitButton } from "@/components/auth/auth-submit-button";
import { BrandLogo } from "@/components/brand/logo";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { requireSessionUser } from "@/lib/auth/current-user";
import { completeOnboarding } from "@/app/onboarding/actions";
import { getDictionary } from "@/lib/i18n/server";

export const dynamic = "force-dynamic";

export default async function OnboardingPage({
  searchParams
}: {
  searchParams?: { error?: string };
}) {
  const user = await requireSessionUser();
  const dictionary = getDictionary();
  const onboarding = dictionary.onboarding;
  const name = "user_metadata" in user ? String(user.user_metadata?.full_name || "") : "";

  return (
    <main className="grid min-h-screen place-items-center px-5 py-10">
      <div className="w-full max-w-xl">
        <div className="mb-8 flex justify-center">
          <BrandLogo />
        </div>
        <Card className="p-6">
          <div className="mb-8 text-center">
            <div className="mx-auto grid h-12 w-12 place-items-center rounded-md border border-gold/35 bg-gold/10">
              <Building2 className="h-5 w-5 text-gold" />
            </div>
            <h1 className="mt-5 font-display text-3xl text-cream">{onboarding.title}</h1>
            <p className="mt-2 text-sm text-cream/62">
              {onboarding.subtitle}
            </p>
          </div>

          {searchParams?.error ? (
            <div className="mb-5 rounded-md border border-red-400/30 bg-red-500/10 p-3 text-sm text-red-100">
              {searchParams.error}
            </div>
          ) : null}

          <form action={completeOnboarding} className="grid gap-4">
            <Input
              name="business_name"
              placeholder={onboarding.businessName}
              required
            />
            <Input
              name="full_name"
              defaultValue={name}
              placeholder={onboarding.fullName}
              required
            />
            <Input
              name="phone"
              placeholder={onboarding.phone}
            />
            <AuthSubmitButton idleLabel={onboarding.submit} pendingLabel={onboarding.loading} />
          </form>
        </Card>
      </div>
    </main>
  );
}
