import { KeyRound } from "lucide-react";
import { BrandLogo } from "@/components/brand/logo";
import { Card } from "@/components/ui/card";
import { ResetPasswordForm } from "@/app/reset-password/reset-password-form";

export default function ResetPasswordPage() {
  return (
    <main className="grid min-h-screen place-items-center px-5 py-10">
      <div className="w-full max-w-md">
        <div className="mb-8 flex justify-center">
          <BrandLogo />
        </div>
        <Card className="p-6">
          <div className="mb-8 text-center">
            <div className="mx-auto grid h-12 w-12 place-items-center rounded-md border border-gold/35 bg-gold/10">
              <KeyRound className="h-5 w-5 text-gold" />
            </div>
            <h1 className="mt-5 font-display text-3xl text-cream">Create new password</h1>
            <p className="mt-2 text-sm text-cream/62">Choose a secure password for your account.</p>
          </div>
          <ResetPasswordForm />
        </Card>
      </div>
    </main>
  );
}
