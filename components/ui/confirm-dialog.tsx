"use client";

import { type ReactNode, useEffect } from "react";
import { AlertTriangle, X } from "lucide-react";
import { Button } from "@/components/ui/button";

export function ConfirmDialog({
  open,
  title,
  description,
  cancelLabel,
  onClose,
  children
}: {
  open: boolean;
  title: string;
  description: string;
  cancelLabel: string;
  onClose: () => void;
  children: ReactNode;
}) {
  useEffect(() => {
    if (!open) {
      return;
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        onClose();
      }
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose, open]);

  if (!open) {
    return null;
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-black/68 px-4 pb-4 backdrop-blur-sm sm:items-center sm:pb-0"
      role="dialog"
      aria-modal="true"
      aria-labelledby="confirm-dialog-title"
    >
      <div className="w-full max-w-md rounded-3xl border border-gold/25 bg-noir p-5 shadow-[0_30px_100px_rgba(0,0,0,0.55)] sm:rounded-2xl sm:p-6">
        <div className="flex items-start gap-4">
          <div className="grid h-11 w-11 shrink-0 place-items-center rounded-full border border-red-400/30 bg-red-500/10 text-red-100">
            <AlertTriangle className="h-5 w-5" />
          </div>
          <div className="min-w-0 flex-1">
            <h2 id="confirm-dialog-title" className="font-display text-2xl text-cream">
              {title}
            </h2>
            <p className="mt-2 text-sm leading-6 text-cream/64">{description}</p>
          </div>
          <button
            type="button"
            className="grid h-9 w-9 shrink-0 place-items-center rounded-full text-cream/54 transition hover:bg-white/5 hover:text-cream"
            onClick={onClose}
            aria-label={cancelLabel}
          >
            <X className="h-4 w-4" />
          </button>
        </div>
        <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
          <Button type="button" variant="outline" onClick={onClose}>
            {cancelLabel}
          </Button>
          {children}
        </div>
      </div>
    </div>
  );
}
