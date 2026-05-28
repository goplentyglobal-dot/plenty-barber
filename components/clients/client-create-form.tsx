"use client";

import { useEffect } from "react";
import { useFormState, useFormStatus } from "react-dom";
import { Loader2 } from "lucide-react";
import { createClient } from "@/app/dashboard/clients/actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/toast-provider";

type Copy = {
  createClient: string;
  creating: string;
  fullName: string;
  phoneWhatsapp: string;
  email: string;
  notes: string;
};

const initialState = { status: "idle" as const, message: "" };

export function ClientCreateForm({ copy }: { copy: Copy }) {
  const [state, action] = useFormState(createClient, initialState);
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
    <form action={action} className="mt-5 grid gap-4 md:grid-cols-2">
      <Input name="full_name" placeholder={copy.fullName} required />
      <Input name="phone" placeholder={copy.phoneWhatsapp} />
      <Input name="email" type="email" placeholder={copy.email} />
      <Input name="notes" placeholder={copy.notes} />
      <SubmitButton idleLabel={copy.createClient} pendingLabel={copy.creating} />
    </form>
  );
}

function SubmitButton({ idleLabel, pendingLabel }: { idleLabel: string; pendingLabel: string }) {
  const { pending } = useFormStatus();

  return (
    <Button type="submit" disabled={pending} className="gap-2 md:col-span-2">
      {pending ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
      {pending ? pendingLabel : idleLabel}
    </Button>
  );
}
