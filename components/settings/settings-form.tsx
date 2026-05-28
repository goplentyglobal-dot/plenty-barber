"use client";

import { useEffect } from "react";
import { useFormState, useFormStatus } from "react-dom";
import { Loader2 } from "lucide-react";
import { updateSettings } from "@/app/dashboard/settings/actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/toast-provider";

type Business = {
  name: string;
  phone: string | null;
  logo_url: string | null;
};

type Copy = {
  name: string;
  phone: string;
  logo: string;
  save: string;
  saving: string;
};

const initialState = { status: "idle" as const, message: "" };

export function SettingsForm({ business, copy }: { business: Business; copy: Copy }) {
  const [state, action] = useFormState(updateSettings, initialState);
  const { showToast } = useToast();

  useEffect(() => {
    if (state.status === "success") {
      showToast({ type: "success", title: state.message });
    }

    if (state.status === "error") {
      showToast({ type: "error", title: "No se pudo guardar", description: state.message, persistent: true });
    }
  }, [showToast, state]);

  return (
    <form action={action} className="grid gap-4 md:grid-cols-2">
      <Input name="name" defaultValue={business.name} placeholder={copy.name} required />
      <Input name="phone" defaultValue={business.phone ?? ""} placeholder={copy.phone} />
      <Input name="logo_url" defaultValue={business.logo_url ?? ""} className="md:col-span-2" placeholder={copy.logo} />
      <SubmitButton copy={copy} />
    </form>
  );
}

function SubmitButton({ copy }: { copy: Copy }) {
  const { pending } = useFormStatus();

  return (
    <Button className="gap-2 md:col-span-2" type="submit" disabled={pending}>
      {pending ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
      {pending ? copy.saving : copy.save}
    </Button>
  );
}
