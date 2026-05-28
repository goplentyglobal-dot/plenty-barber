"use client";

import { useEffect, useState } from "react";
import { useFormState, useFormStatus } from "react-dom";
import { Loader2, Trash2 } from "lucide-react";
import { deleteClient, updateClient } from "@/app/dashboard/clients/actions";
import { Button } from "@/components/ui/button";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/toast-provider";

type ClientRow = {
  id: string;
  full_name: string;
  phone: string | null;
  email: string | null;
  notes: string | null;
  created_at: string;
};

type Copy = {
  phone: string;
  email: string;
  created: string;
  save: string;
  saving: string;
  deleting: string;
  deleteClient: string;
  confirmDeleteTitle: string;
  confirmDeleteDescription: string;
  cancel: string;
  confirmDelete: string;
};

const initialState = { status: "idle" as const, message: "" };

export function ClientRowForm({
  client,
  createdLabel,
  copy
}: {
  client: ClientRow;
  createdLabel: string;
  copy: Copy;
}) {
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [updateState, updateAction] = useFormState(updateClient, initialState);
  const [deleteState, deleteAction] = useFormState(deleteClient, initialState);
  const { showToast } = useToast();

  useEffect(() => {
    for (const state of [updateState, deleteState]) {
      if (state.status === "success") {
        showToast({ type: "success", title: state.message });
      }

      if (state.status === "error") {
        showToast({ type: "error", title: "No se pudo completar", description: state.message, persistent: true });
      }
    }

    if (deleteState.status === "success") {
      setConfirmOpen(false);
    }
  }, [deleteState, showToast, updateState]);

  return (
    <div className="grid gap-3 lg:grid-cols-[1.1fr_0.9fr_0.9fr_1.2fr_auto_auto] lg:items-center">
      <form action={updateAction} className="contents">
        <input type="hidden" name="id" value={client.id} />
        <Input name="full_name" defaultValue={client.full_name} className="min-h-11 px-3" />
        <Input name="phone" defaultValue={client.phone ?? ""} placeholder={copy.phone} className="min-h-11 px-3" />
        <Input
          name="email"
          type="email"
          defaultValue={client.email ?? ""}
          placeholder={copy.email}
          className="min-h-11 px-3"
        />
        <Input name="notes" defaultValue={client.notes ?? ""} placeholder={createdLabel} className="min-h-11 px-3" />
        <SaveButton copy={copy} />
      </form>
      <DeleteButton copy={copy} onClick={() => setConfirmOpen(true)} />
      <ConfirmDialog
        open={confirmOpen}
        title={copy.confirmDeleteTitle}
        description={copy.confirmDeleteDescription.replace("{name}", client.full_name)}
        cancelLabel={copy.cancel}
        onClose={() => setConfirmOpen(false)}
      >
        <form action={deleteAction}>
          <input type="hidden" name="id" value={client.id} />
          <ConfirmDeleteButton copy={copy} />
        </form>
      </ConfirmDialog>
    </div>
  );
}

function SaveButton({ copy }: { copy: Copy }) {
  const { pending } = useFormStatus();

  return (
    <Button type="submit" variant="outline" disabled={pending} className="gap-2">
      {pending ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
      {pending ? copy.saving : copy.save}
    </Button>
  );
}

function DeleteButton({ copy, onClick }: { copy: Copy; onClick: () => void }) {
  return (
    <button
      className="inline-flex min-h-11 items-center justify-center rounded-full border border-red-400/30 px-4 text-sm font-semibold text-red-100 transition hover:bg-red-500/10"
      type="button"
      aria-label={copy.deleteClient}
      onClick={onClick}
    >
      <Trash2 className="h-4 w-4" />
    </button>
  );
}

function ConfirmDeleteButton({ copy }: { copy: Copy }) {
  const { pending } = useFormStatus();

  return (
    <button
      className="inline-flex min-h-11 items-center justify-center gap-2 rounded-full border border-red-400/30 bg-red-500/10 px-5 text-sm font-semibold text-red-100 transition hover:bg-red-500/15 disabled:pointer-events-none disabled:opacity-50"
      type="submit"
      disabled={pending}
      aria-label={pending ? copy.deleting : copy.confirmDelete}
    >
      {pending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}
      {pending ? copy.deleting : copy.confirmDelete}
    </button>
  );
}
