"use client";

import { useState } from "react";
import { useFormStatus } from "react-dom";
import { Eye, Loader2 } from "lucide-react";
import { unpublishReportAction } from "@/app/report/[id]/actions";
import { Button } from "@/components/ui/button";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";

export function UnpublishReportForm({
  reportId,
  labels,
  variant = "ghost"
}: {
  reportId: string;
  labels: {
    trigger: string;
    title: string;
    description: string;
    cancel: string;
    confirm: string;
    pending: string;
  };
  variant?: "ghost" | "outline";
}) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button variant={variant} className="gap-2" type="button" onClick={() => setOpen(true)}>
        <Eye className="h-4 w-4" /> {labels.trigger}
      </Button>
      <ConfirmDialog
        open={open}
        title={labels.title}
        description={labels.description}
        cancelLabel={labels.cancel}
        onClose={() => setOpen(false)}
      >
        <form action={unpublishReportAction}>
          <input type="hidden" name="report_id" value={reportId} />
          <SubmitButton labels={labels} />
        </form>
      </ConfirmDialog>
    </>
  );
}

function SubmitButton({
  labels
}: {
  labels: {
    confirm: string;
    pending: string;
  };
}) {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={pending}
      className="inline-flex min-h-11 items-center justify-center gap-2 rounded-full border border-red-400/30 bg-red-500/10 px-5 text-sm font-semibold text-red-100 transition hover:bg-red-500/15 disabled:pointer-events-none disabled:opacity-50"
    >
      {pending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Eye className="h-4 w-4" />}
      {pending ? labels.pending : labels.confirm}
    </button>
  );
}
