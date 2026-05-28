"use client";

import { Loader2 } from "lucide-react";
import { useFormStatus } from "react-dom";
import { Button } from "@/components/ui/button";

export function AuthSubmitButton({
  idleLabel,
  pendingLabel
}: {
  idleLabel: string;
  pendingLabel: string;
}) {
  const { pending } = useFormStatus();

  return (
    <Button type="submit" disabled={pending} className="mt-2 w-full gap-2">
      {pending ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
      {pending ? pendingLabel : idleLabel}
    </Button>
  );
}
