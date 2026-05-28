"use client";

import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { AlertCircle, CheckCircle2, Info, X } from "lucide-react";

type ToastType = "success" | "error" | "info";

type ToastInput = {
  type?: ToastType;
  title: string;
  description?: string;
  persistent?: boolean;
};

type Toast = ToastInput & {
  id: string;
  type: ToastType;
};

type ToastContextValue = {
  showToast: (toast: ToastInput) => void;
  dismissToast: (id: string) => void;
};

const ToastContext = createContext<ToastContextValue | null>(null);

const iconByType = {
  success: CheckCircle2,
  error: AlertCircle,
  info: Info
};

const styleByType = {
  success: "border-emerald-300/30 bg-emerald-500/12 text-emerald-50",
  error: "border-red-300/30 bg-red-500/12 text-red-50",
  info: "border-gold/30 bg-gold/12 text-cream"
};

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const dismissToast = useCallback((id: string) => {
    setToasts((current) => current.filter((toast) => toast.id !== id));
  }, []);

  const showToast = useCallback(
    (input: ToastInput) => {
      const id = crypto.randomUUID();
      const toast: Toast = { ...input, id, type: input.type ?? "info" };

      setToasts((current) => [toast, ...current].slice(0, 4));

      if (!toast.persistent && toast.type !== "error") {
        window.setTimeout(() => dismissToast(id), 2600);
      }

      vibrate(toast.type);
    },
    [dismissToast]
  );

  const value = useMemo(() => ({ showToast, dismissToast }), [dismissToast, showToast]);

  return (
    <ToastContext.Provider value={value}>
      {children}
      <div className="pointer-events-none fixed right-4 top-4 z-50 grid w-[calc(100vw-2rem)] max-w-sm gap-3">
        <AnimatePresence initial={false}>
          {toasts.map((toast) => {
            const Icon = iconByType[toast.type];

            return (
              <motion.div
                key={toast.id}
                layout
                initial={{ opacity: 0, y: -16, scale: 0.97 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -12, scale: 0.98 }}
                transition={{ duration: 0.22 }}
                className={`pointer-events-auto rounded-2xl border p-4 shadow-[0_24px_80px_rgba(0,0,0,0.36)] backdrop-blur-xl ${styleByType[toast.type]}`}
                role={toast.type === "error" ? "alert" : "status"}
              >
                <div className="flex items-start gap-3">
                  <Icon className="mt-0.5 h-5 w-5 shrink-0" />
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-semibold">{toast.title}</p>
                    {toast.description ? (
                      <p className="mt-1 text-sm leading-5 opacity-75">{toast.description}</p>
                    ) : null}
                  </div>
                  <button
                    type="button"
                    className="grid h-7 w-7 shrink-0 place-items-center rounded-full text-current/65 transition hover:bg-white/10 hover:text-current"
                    onClick={() => dismissToast(toast.id)}
                    aria-label="Cerrar notificacion"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);

  if (!context) {
    throw new Error("useToast must be used within ToastProvider.");
  }

  return context;
}

function vibrate(type: ToastType) {
  if (!("vibrate" in navigator)) {
    return;
  }

  navigator.vibrate(type === "error" ? [150, 50, 150] : [55, 35, 90]);
}
